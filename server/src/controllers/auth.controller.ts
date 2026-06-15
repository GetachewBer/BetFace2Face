import { Request, Response } from 'express';
import User from '../models/User';
import { sendOTP } from '../services/telegram.service';
import { verifyGoogleCode } from '../services/google.service';

const otpStore = new Map<string, { code: string; expires: Date }>();
function generateOTP(): string { return Math.floor(100000 + Math.random() * 900000).toString(); }

// Phone login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).select('+password +refreshToken');
    if (!user) { res.status(404).json({ success: false, message: 'No account found' }); return; }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) { res.status(401).json({ success: false, message: 'Invalid password' }); return; }
    const accessToken = user.generateAuthToken();
    user.refreshToken = user.generateRefreshToken();
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: { user: user.toJSON(), accessToken } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

// Email login
export const emailLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ success: false, message: 'Email and password required' }); return; }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
    if (!user) { res.status(404).json({ success: false, message: 'No account found' }); return; }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) { res.status(401).json({ success: false, message: 'Invalid password' }); return; }
    const accessToken = user.generateAuthToken();
    user.refreshToken = user.generateRefreshToken();
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: { user: user.toJSON(), accessToken } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

// Register phone
export const register = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) { res.status(400).json({ success: false, message: 'Phone required' }); return; }
  const exists = await User.findOne({ phone });
  if (exists) { res.status(409).json({ success: false, message: 'Already registered' }); return; }
  const otp = generateOTP();
  otpStore.set(phone, { code: otp, expires: new Date(Date.now() + 5 * 60 * 1000) });
  await sendOTP(phone, otp);
  res.json({ success: true, message: 'OTP sent!' });
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { phone, otp } = req.body;
  const stored = otpStore.get(phone);
  if (!stored || new Date() > stored.expires || stored.code !== otp) {
    res.status(400).json({ success: false, message: 'Invalid OTP' }); return;
  }
  otpStore.delete(phone);
  res.json({ success: true, message: 'OTP verified' });
};

export const setPassword = async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;
  if (!password || password.length < 8) { res.status(400).json({ success: false, message: 'Min 8 characters' }); return; }
  const user = await User.create({
    fullName: 'User_' + phone.slice(-4), phone, password,
    provider: 'telegram', providerId: phone,
    role: 'user', isActive: true, walletBalance: 0.00,
  });
  const token = user.generateAuthToken();
  res.status(201).json({ success: true, data: { user: user.toJSON(), accessToken: token } });
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const googleUser = await verifyGoogleCode(code);
    const existingUser = await User.findOne({ provider: 'google', providerId: googleUser.googleId });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'This Google account is already registered. Please go to Login page.' });
      return;
    }
    res.json({ success: true, isNewUser: true, data: { fullName: googleUser.fullName, email: googleUser.email, googleId: googleUser.googleId, picture: googleUser.picture } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const googleRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, googleId, picture, password } = req.body;
    if (!password || password.length < 8) { res.status(400).json({ success: false, message: 'Min 8 characters' }); return; }
    const user = await User.create({ fullName, email, password, provider: 'google', providerId: googleId, avatar: picture, role: 'user', isActive: true, walletBalance: 0.00 });
    const token = user.generateAuthToken();
    res.status(201).json({ success: true, data: { user: user.toJSON(), accessToken: token } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};
