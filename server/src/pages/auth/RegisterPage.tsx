import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'done'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    setError('');
    if (phone.length < 9) { setError('Enter valid phone number'); return; }

    setLoading(true);
    try {
      const fullPhone = '+251' + phone;
      const res = await axios.post(`${API_URL}/auth/register`, { phone: fullPhone });
      if (res.data.success) {
        setMessage('OTP sent to your Telegram!');
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    setError('');
    if (otp.length !== 6) { setError('Enter 6-digit OTP'); return; }

    setLoading(true);
    try {
      const fullPhone = '+251' + phone;
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone: fullPhone, otp });
      if (res.data.success) {
        setMessage('Verified! Create password.');
        setStep('password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set Password
  const handleSetPassword = async () => {
    setError('');
    if (password.length < 8) { setError('Min 8 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords dont match'); return; }

    setLoading(true);
    try {
      const fullPhone = '+251' + phone;
      const res = await axios.post(`${API_URL}/auth/set-password`, { phone: fullPhone, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.accessToken);
        setStep('done');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">
            {step === 'phone' && 'Register'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'password' && 'Set Password'}
            {step === 'done' && 'Welcome!'}
          </h1>
        </div>

        {message && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 text-emerald-400 text-sm mb-3">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-3">{error}</div>}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">

          {/* Step 1: Phone */}
          {step === 'phone' && (
            <div className="space-y-3">
              <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-gray-800 rounded-lg border-2 border-gray-700 text-white text-sm">+251</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="912345678" maxLength={9}
                  className="flex-1 rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
              </div>
              <button onClick={handleSendOTP} disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
                {loading ? 'Sending OTP...' : 'Send OTP via Telegram'}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <div className="space-y-3 text-center">
              <p className="text-gray-400 text-sm">Enter code from Telegram</p>
              <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000" maxLength={6}
                className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-3 text-center text-2xl font-bold tracking-widest text-white focus:border-emerald-500 focus:outline-none" />
              <button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
                Verify OTP
              </button>
            </div>
          )}

          {/* Step 3: Password */}
          {step === 'password' && (
            <div className="space-y-3">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password (min 8 chars)"
                className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
              <button onClick={handleSetPassword} disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
                Register
              </button>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">Registered!</h2>
              <p className="text-sm text-gray-400">Balance: 0.00 ETB | Role: User</p>
              <a href="/" className="inline-block mt-4 px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm">Go Home</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;