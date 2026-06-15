import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';
const GOOGLE_CLIENT_ID = '875332750219-b3iifqldtbd4nsg1b1d18decug96af02.apps.googleusercontent.com';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'password' | 'done'>('input');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    setError('');
    if (phone.length < 9) { setError('Enter valid phone number'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { phone: '+251' + phone });
      if (res.data.success) { setMessage('OTP sent to Telegram!'); setStep('otp'); }
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { setError('Enter 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone: '+251' + phone, otp });
      if (res.data.success) { setMessage('Verified! Set password.'); setStep('password'); }
    } catch (err: any) { setError(err.response?.data?.message || 'Invalid OTP'); }
    finally { setLoading(false); }
  };

  const handleSetPassword = async () => {
    if (password.length < 8) { setError('Min 8 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords dont match'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/set-password`, { phone: '+251' + phone, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        setStep('done');
      }
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleGoogleSignup = () => {
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=' + GOOGLE_CLIENT_ID +
      '&redirect_uri=http://localhost:5173/oauth/callback' +
      '&response_type=code' +
      '&scope=openid%20profile%20email';
    window.location.href = authUrl;
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
          <h1 className="text-xl font-bold text-white">Register</h1>
        </div>

        {message && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 text-emerald-400 text-sm mb-3">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-3">{error}</div>}

        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
          <button onClick={() => { setTab('phone'); setStep('input'); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md ${tab === 'phone' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
            Phone
          </button>
          <button onClick={() => setTab('email')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md ${tab === 'email' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
            Email
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">

          {tab === 'phone' && step !== 'done' && (
            <>
              {step === 'input' && (
                <div className="space-y-3">
                  <label className="block text-sm text-gray-300">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-gray-800 rounded-lg border-2 border-gray-700 text-white text-sm">+251</span>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="912345678" maxLength={9}
                      className="flex-1 rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <button onClick={handleSendOTP} disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
                    Send OTP via Telegram
                  </button>
                </div>
              )}
              {step === 'otp' && (
                <div className="space-y-3 text-center">
                  <p className="text-gray-400 text-sm">Enter code from Telegram</p>
                  <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" maxLength={6}
                    className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-3 text-center text-2xl font-bold tracking-widist text-white focus:border-emerald-500 focus:outline-none" />
                  <button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
                    Verify OTP
                  </button>
                </div>
              )}
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
            </>
          )}

          {tab === 'email' && (
            <div className="space-y-4 text-center">
              <p className="text-gray-400 text-sm">Register with your Google account</p>
              <button onClick={handleGoogleSignup}
                className="w-full p-3 bg-white rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium text-sm">Continue with Google</span>
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">Registered!</h2>
              <p className="text-sm text-gray-400">Balance: 0.00 ETB | Role: User</p>
              <a href="/dashboard" className="inline-block mt-4 px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm">Dashboard</a>
            </div>
          )}

          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-emerald-400 hover:text-emerald-300">Already have an account? Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;