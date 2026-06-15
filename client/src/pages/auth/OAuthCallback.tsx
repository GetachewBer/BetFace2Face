import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [googleData, setGoogleData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'loading' | 'new-user' | 'exists'>('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) { setError('No authorization code'); return; }

    axios.post(`${API_URL}/auth/google`, { code })
      .then(res => {
        if (res.data.success && res.data.isNewUser) {
          setGoogleData(res.data.data);
          setStep('new-user');
        }
      })
      .catch(err => {
        if (err.response?.status === 409) {
          setStep('exists');
          setError(err.response.data.message);
        } else {
          setError(err.response?.data?.message || 'Failed');
        }
      });
  }, []);

  const handleRegister = async () => {
    if (password.length < 8) { setError('Min 8 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords dont match'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/google/register`, { ...googleData, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        navigate('/dashboard');
      }
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying with Google...</p>
        </div>
      </div>
    );
  }

  if (step === 'exists') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Already Registered</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <a href="/login"
            className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (step === 'new-user' && googleData) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs mb-3">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified by Google
            </div>
            <h1 className="text-xl font-bold text-white">Set Password</h1>
            <p className="text-sm text-gray-400 mt-1">{googleData.email}</p>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-3">{error}</div>}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-3">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password (min 8 chars)"
              className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none" />
            <button onClick={handleRegister} disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;