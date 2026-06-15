import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Smartphone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ phone, password });
    if (result?.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8 bg-gradient-to-b from-[#e8f4fd] to-[#f0f2f5]">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00A8FF] to-[#0070CC] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00A8FF]/30">
            <span className="text-white font-bold text-2xl">BF</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('common.appName')}</h1>
          <p className="text-gray-500 mt-1 text-sm">{t('auth.signIn')}</p>
        </div>

        {/* Login Card */}
        <div className="card p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Smartphone size={16} />
              {t('auth.phoneNumber')}
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="font-bold">@</span>
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            {loginMethod === 'phone' ? (
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-medium">
                  {t('auth.phoneNumber')}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 912 345 678"
                  className="input-field"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-medium">
                  Email
                </label>
                <input type="email" placeholder="example@gmail.com" className="input-field" />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-medium">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-xs text-[#00A8FF] hover:underline font-medium">
                {t('auth.forgotPassword')}
              </a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('common.loading') : t('auth.signIn')}
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button type="button" className="btn-secondary w-full flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm">{t('auth.googleSignIn')}</span>
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-[#00A8FF] hover:underline font-medium">
              {t('auth.createOne')}
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          By signing in, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  );
}