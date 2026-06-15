import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../layouts/auth/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { countries } from '../../utils/countries';
import type { RegisterFormData } from '../../types/auth';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sendOTP, verifyOTPAndRegister, loading, error } = useAuth();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    nickname: '',
    dialCode: '+251',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [otp, setOtp] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterFormData>>({});

  const validate = (): boolean => {
    const errors: Partial<Record<keyof RegisterFormData, boolean>> = {};
if (!formData.fullName) errors.fullName = true;
if (!formData.nickname || formData.nickname.length < 3) errors.nickname = true;
if (!formData.phoneNumber || formData.phoneNumber.length !== 9) errors.phoneNumber = true;
if (!formData.password || formData.password.length < 6) errors.password = true;
if (formData.password !== formData.confirmPassword) errors.confirmPassword = true;
if (!formData.agreeTerms) errors.agreeTerms = true;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldError = (field: keyof RegisterFormData): string => {
    if (!fieldErrors[field]) return '';
    const errorMap: Record<string, string> = {
      fullName: t('auth.errors.fullNameRequired'),
      nickname: t('auth.errors.nicknameRequired'),
      phoneNumber: t('auth.errors.phoneRequired'),
      password: t('auth.errors.passwordRequired'),
      confirmPassword: t('auth.errors.passwordMatch'),
      agreeTerms: t('auth.errors.termsRequired'),
    };
    return errorMap[field] || '';
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await sendOTP(formData.dialCode, formData.phoneNumber);
    if (result?.success) setStep('otp');
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyOTPAndRegister(formData, otp);
    if (result?.success) navigate('/dashboard');
  };

  const inputClass = (field: keyof RegisterFormData) =>
    `w-full bg-[#0F0F1A] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
      fieldErrors[field] ? 'border-red-500' : 'border-gray-700 focus:border-purple-500'
    }`;

  // OTP Step
  if (step === 'otp') {
    return (
      <AuthLayout subtitle={t('auth.verifyOTP')}>
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{error}</div>
          )}

          <p className="text-gray-400 text-center text-sm">
            {t('auth.otpSent')} {formData.dialCode} {formData.phoneNumber}
          </p>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            maxLength={6}
            className="w-full bg-[#0F0F1A] border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-[0.3em] placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          />

          <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors">
            {loading ? t('common.loading') : t('auth.verifyOTP')}
          </button>

          <button type="button" onClick={() => setStep('form')} className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={16} /> {t('auth.changePhone')}
          </button>
        </form>
      </AuthLayout>
    );
  }

  // Registration Form
  return (
    <AuthLayout subtitle={t('auth.signUp')}>
      <form onSubmit={handleSendOTP} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{error}</div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('auth.fullName')}</label>
          <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Abebe Kebede" className={inputClass('fullName')} />
          {getFieldError('fullName') && <p className="text-red-400 text-xs mt-1">{getFieldError('fullName')}</p>}
        </div>

        {/* Nickname */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('auth.nickname')}</label>
          <input type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} placeholder="LionKing" className={inputClass('nickname')} />
          {getFieldError('nickname') && <p className="text-red-400 text-xs mt-1">{getFieldError('nickname')}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('auth.phoneNumber')}</label>
          <div className="flex gap-2">
            <select value={formData.dialCode} onChange={(e) => setFormData({ ...formData, dialCode: e.target.value })} className="bg-[#0F0F1A] border border-gray-700 rounded-lg px-3 py-3 text-white focus:border-purple-500 focus:outline-none">
              {countries.map((c) => (
                <option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode}</option>
              ))}
            </select>
            <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 9) })} placeholder="912345678" maxLength={9} className={inputClass('phoneNumber')} />
          </div>
          {getFieldError('phoneNumber') && <p className="text-red-400 text-xs mt-1">{getFieldError('phoneNumber')}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('auth.password')}</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className={inputClass('password') + ' pr-12'} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {getFieldError('password') && <p className="text-red-400 text-xs mt-1">{getFieldError('password')}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('auth.confirmPassword')}</label>
          <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" className={inputClass('confirmPassword')} />
          {getFieldError('confirmPassword') && <p className="text-red-400 text-xs mt-1">{getFieldError('confirmPassword')}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} className="mt-1 w-4 h-4 accent-purple-500" />
          <label className="text-xs sm:text-sm text-gray-400">
            {t('auth.agreeTerms')}{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300">{t('auth.terms')}</a>
            {' '}&{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300">{t('auth.privacy')}</a>
          </label>
        </div>
        {getFieldError('agreeTerms') && <p className="text-red-400 text-xs">{getFieldError('agreeTerms')}</p>}

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors">
          {loading ? t('common.loading') : t('auth.sendOTP')}
        </button>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#1A1A2E] text-gray-400">{t('auth.orContinue')}</span></div>
        </div>

        {/* Google */}
        <button type="button" className="w-full bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-blue-600">G</span> {t('auth.googleRegister')}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm pt-2">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">{t('auth.signInLink')}</Link>
        </p>
      </form>
    </AuthLayout>
  );
}