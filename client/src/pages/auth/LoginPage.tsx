import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.length < 9) { setError('Enter valid phone number'); return; }
    if (!password) { setError('Enter your password'); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { phone: '+251' + phone, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Enter your email'); return; }
    if (!password) { setError('Enter your password'); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login/email`, { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Sign In</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-3">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
          <button onClick={() => { setTab('phone'); setError(''); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md ${tab === 'phone' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
            Phone
          </button>
          <button onClick={() => { setTab('email'); setError(''); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md ${tab === 'email' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
            Email
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">

          {tab === 'phone' ? (
            <form onSubmit={handlePhoneLogin} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-800 rounded-lg border-2 border-gray-700 text-white text-sm">+251</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="912345678" maxLength={9}
                    className="flex-1 rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <a href="/register" className="text-sm text-emerald-400 hover:text-emerald-300">
              Don't have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;