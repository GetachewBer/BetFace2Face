import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../layouts/auth/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ phone, password });
    if (result?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout subtitle={t('auth.signIn')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Phone Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">{t('auth.phoneNumber')}</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 912 345 678"
            className="w-full bg-[#0F0F1A] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">{t('auth.password')}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0F0F1A] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none pr-12 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
            {t('auth.forgotPassword')}
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? t('common.loading') : t('auth.signIn')}
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1A1A2E] text-gray-400">{t('auth.orContinue')}</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">G</span>
          {t('auth.googleSignIn')}
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-400 text-sm pt-2">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
            {t('auth.createOne')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}