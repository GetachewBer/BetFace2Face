import { Router } from 'express';
import { login, emailLogin, register, verifyOTP, setPassword, googleAuth, googleRegister } from '../controllers/auth.controller';

const router = Router();
router.post('/login', login);
router.post('/login/email', emailLogin);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/set-password', setPassword);
router.post('/google', googleAuth);
router.post('/google/register', googleRegister);
export default router;