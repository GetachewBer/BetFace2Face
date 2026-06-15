import express from 'express';
import passport from 'passport';
import {
  sendOTP,
  verifyOTPAndRegister,
  phoneLogin,
  googleCallback,
  googleRegister,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Phone Registration
router.post('/phone/send-otp', sendOTP);
router.post('/phone/verify-otp', verifyOTPAndRegister);

// Phone Login
router.post('/phone/login', phoneLogin);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

// Google Register (complete profile after OAuth)
router.post('/google/register', protect, googleRegister);

// Get current user
router.get('/me', protect, getMe);

// Forgot Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Get country list for registration
router.get('/countries', (req, res) => {
  const { countries } = require('../config/countries');
  res.json({ success: true, countries });
});

export default router;