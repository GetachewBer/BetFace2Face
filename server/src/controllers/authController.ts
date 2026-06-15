import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import Otp from '../models/Otp';
import { AuthRequest } from '../middleware/auth';
import { generateOTP, sendOtpToTelegram, sendWelcomeMessage } from '../services/telegramService';
import { formatPhoneNumber, isValidPhoneNumber } from '../config/countries';

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRE || '30d' } as jwt.SignOptions
  );
};

// ============================================================
// PHONE REGISTRATION
// ============================================================

// @desc    Send OTP to phone via Telegram
// @route   POST /api/auth/phone/send-otp
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dialCode, phoneNumber } = req.body;

    // Validate input
    if (!dialCode || !phoneNumber) {
      res.status(400).json({
        success: false,
        message: 'Please provide country code and phone number',
      });
      return;
    }

    // Format and validate phone
    const fullPhone = formatPhoneNumber(dialCode, phoneNumber);

    if (!isValidPhoneNumber(fullPhone, dialCode)) {
      res.status(400).json({
        success: false,
        message: 'Phone number must be 9 digits after country code',
      });
      return;
    }

    // Check if phone already registered
    const existingUser = await User.findOne({ phone: fullPhone });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Phone number is already registered',
      });
      return;
    }

    // Generate OTP
    const otpCode = generateOTP();

    // Delete any existing OTP for this phone
    await Otp.deleteMany({ phone: fullPhone });

    // Save new OTP
    await Otp.create({
      phone: fullPhone,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Send OTP via Telegram
    const sent = await sendOtpToTelegram(fullPhone, otpCode);

    res.status(200).json({
      success: true,
      message: sent
        ? 'OTP sent to Telegram'
        : `OTP generated (Telegram failed). Demo OTP: ${otpCode}`,
      // In demo mode, return OTP directly (REMOVE IN PRODUCTION)
      otp: process.env.NODE_ENV === 'production' ? undefined : otpCode,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message,
    });
  }
};

// @desc    Verify OTP and Register User
// @route   POST /api/auth/phone/verify-otp
export const verifyOTPAndRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dialCode, phoneNumber, otp, nickname, fullName, password, confirmPassword, agreeTerms } = req.body;

    // Validate all fields present
    if (!dialCode || !phoneNumber || !otp || !nickname || !fullName || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    // Check terms agreement
    if (!agreeTerms) {
      res.status(400).json({
        success: false,
        message: 'You must agree to the terms and conditions',
      });
      return;
    }

    // Format phone
    const fullPhone = formatPhoneNumber(dialCode, phoneNumber);

    // Validate password match
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    // Validate nickname length
    if (nickname.length < 3 || nickname.length > 20) {
      res.status(400).json({
        success: false,
        message: 'Nickname must be between 3 and 20 characters',
      });
      return;
    }

    // Check if nickname is already taken
    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) {
      res.status(400).json({
        success: false,
        message: 'This nickname is already taken',
      });
      return;
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({
      phone: fullPhone,
      code: otp,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
      return;
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Create user
    const user = await User.create({
      phone: fullPhone,
      fullName,
      nickname,
      password,
      balance: 0,
      role: 'user',
    });

    // Send welcome notification via Telegram
    await sendWelcomeMessage(fullPhone, nickname);

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        nickname: user.nickname,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (error: any) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        success: false,
        message: `This ${field} is already registered`,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// ============================================================
// PHONE LOGIN
// ============================================================

// @desc    Login with phone and password
// @route   POST /api/auth/phone/login
export const phoneLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide phone and password',
      });
      return;
    }

    // Find user and include password for comparison
    const user = await User.findOne({ phone }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid phone number or password',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
      return;
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid phone number or password',
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        fullName: user.fullName,
        nickname: user.nickname,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// ============================================================
// GOOGLE OAuth
// ============================================================

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
export const googleCallback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // User is attached by Passport middleware
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Google authentication failed',
      });
      return;
    }

    const token = generateToken(user._id as string);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback?token=${token}`);
  } catch (error: any) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

// ============================================================
// GOOGLE REGISTER (Complete Profile)
// ============================================================

// @desc    Complete Google registration with alias/password
// @route   POST /api/auth/google/register
export const googleRegister = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nickname, password, confirmPassword, agreeTerms } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    // Check if already completed
    if (user.nickname && user.nickname !== user.email) {
      res.status(400).json({
        success: false,
        message: 'Profile already completed',
      });
      return;
    }

    // Validate
    if (!nickname || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    if (!agreeTerms) {
      res.status(400).json({
        success: false,
        message: 'You must agree to the terms',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
      return;
    }

    // Check nickname
    const existingNickname = await User.findOne({ nickname, _id: { $ne: user._id } });
    if (existingNickname) {
      res.status(400).json({
        success: false,
        message: 'Nickname already taken',
      });
      return;
    }

    // Update user
    user.nickname = nickname;
    user.password = password;
    await user.save();

    const token = generateToken(user._id as string);

    res.status(200).json({
      success: true,
      message: 'Profile completed',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        nickname: user.nickname,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// ============================================================
// GENERAL
// ============================================================

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        fullName: user.fullName,
        nickname: user.nickname,
        balance: user.balance,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        depositLimits: user.depositLimits,
        stats: user.stats,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
    });
  }
};

// ============================================================
// FORGOT PASSWORD
// ============================================================

// @desc    Send reset OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({
        success: false,
        message: 'Please provide phone number',
      });
      return;
    }

    // Find user
    const user = await User.findOne({ phone });

    if (!user) {
      // Don't reveal if user exists or not (security)
      res.status(200).json({
        success: true,
        message: 'If this phone is registered, an OTP will be sent',
      });
      return;
    }

    // Generate OTP
    const otpCode = generateOTP();

    await Otp.deleteMany({ phone });
    await Otp.create({
      phone,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpToTelegram(phone, otpCode);

    res.status(200).json({
      success: true,
      message: 'OTP sent to Telegram',
      otp: process.env.NODE_ENV === 'production' ? undefined : otpCode,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, newPassword, confirmPassword } = req.body;

    if (!phone || !otp || !newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
      return;
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({
      phone,
      code: otp,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
      return;
    }

    // Update password
    const user = await User.findOne({ phone }).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
    });
  }
};