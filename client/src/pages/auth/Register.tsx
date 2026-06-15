import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { countries } from '../../utils/countries';
import type { RegisterFormData } from '../../types/auth';

type FieldErrors = Record<string, string>;

interface RegisterProps {
  isModal?: boolean;
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function Register({ isModal, onSuccess, onSwitchToLogin }: RegisterProps) {
  const { t } = useTranslation();
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!formData.fullName) errors.fullName = t('auth.errors.fullNameRequired');
    if (!formData.nickname || formData.nickname.length < 3) errors.nickname = t('auth.errors.nicknameRequired');
    if (!formData.phoneNumber || formData.phoneNumber.length !== 9) errors.phoneNumber = t('auth.errors.phoneRequired');
    if (!formData.password || formData.password.length < 6) errors.password = t('auth.errors.passwordRequired');
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = t('auth.errors.passwordMatch');
    if (!formData.agreeTerms) errors.agreeTerms = t('auth.errors.termsRequired');
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
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
    if (result?.success) onSuccess?.();
  };

  const inputClass = (field: string) =>
    `w-full bg-white border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-[#00A8FF] focus:outline-none focus:ring-2 focus:ring-[#00A8FF]/10 ${
      fieldErrors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  const formContent = (
    <form onSubmit={handleSendOTP} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">{t('auth.fullName')}</label>
        <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Abebe Kebede" className={inputClass('fullName')} />
        {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">{t('auth.nickname')}</label>
        <input type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} placeholder="LionKing" className={inputClass('nickname')} />
        {fieldErrors.nickname && <p className="text-red-500 text-xs mt-1">{fieldErrors.nickname}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">{t('auth.phoneNumber')}</label>
        <div className="flex gap-2">
          <select value={formData.dialCode} onChange={(e) => setFormData({ ...formData, dialCode: e.target.value })} className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-gray-800 focus:border-[#00A8FF] focus:outline-none text-sm">
            {countries.map((c) => (<option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode}</option>))}
          </select>
          <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 9) })} placeholder="912345678" maxLength={9} className={inputClass('phoneNumber') + ' flex-1'} />
        </div>
        {fieldErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">{t('auth.password')}</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" className={inputClass('password') + ' pr-12'} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">{t('auth.confirmPassword')}</label>
        <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Re-enter password" className={inputClass('confirmPassword')} />
        {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} className="sr-only peer" id="terms-reg" />
        <label htmlFor="terms-reg" className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer mt-0.5 ${formData.agreeTerms ? 'bg-[#00A8FF] border-[#00A8FF]' : 'border-gray-300 bg-white'}`}>
          {formData.agreeTerms && <Check size={12} className="text-white" />}
        </label>
        <label htmlFor="terms-reg" className="text-xs text-gray-500 cursor-pointer select-none">
          {t('auth.agreeTerms')} <a href="#" className="text-[#00A8FF] hover:underline">{t('auth.terms')}</a> & <a href="#" className="text-[#00A8FF] hover:underline">{t('auth.privacy')}</a>
        </label>
      </div>
      {fieldErrors.agreeTerms && <p className="text-red-500 text-xs">{fieldErrors.agreeTerms}</p>}

      <button type="submit" disabled={loading} className="w-full bg-[#00A8FF] hover:bg-[#0090DD] text-white font-semibold py-3 rounded-lg transition-all shadow-md shadow-[#00A8FF]/20 mt-2">
        {loading ? t('common.loading') : t('auth.sendOTP')}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400 uppercase">or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <button type="button" className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border border-gray-300 transition-all flex items-center justify-center gap-3">
        <span className="font-bold text-blue-500 text-lg">G</span>
        <span className="text-sm">{t('auth.googleRegister')}</span>
      </button>

      <p className="text-center text-gray-500 text-sm pt-1">
        {t('auth.hasAccount')}{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-[#00A8FF] hover:underline font-medium">
          {t('auth.signInLink')}
        </button>
      </p>
    </form>
  );

  const otpContent = (
    <div className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-gray-600 text-sm">{t('auth.otpSent')}</p>
        <p className="text-gray-800 font-semibold mt-1">{formData.dialCode} {formData.phoneNumber}</p>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-medium">{t('auth.enterOTP')}</label>
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-center text-3xl tracking-[0.3em] placeholder-gray-300 focus:border-[#00A8FF] focus:outline-none focus:ring-2 focus:ring-[#00A8FF]/10" />
      </div>

      <button type="button" onClick={handleVerifyOTP} disabled={loading || otp.length < 6} className="w-full bg-[#00A8FF] hover:bg-[#0090DD] text-white font-semibold py-3 rounded-lg transition-all shadow-md shadow-[#00A8FF]/20">
        {loading ? t('common.loading') : t('auth.verifyOTP')}
      </button>

      <button type="button" onClick={() => setStep('form')} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm py-2">
        <ArrowLeft size={16} /> {t('auth.changePhone')}
      </button>
    </div>
  );

  if (isModal) return <>{step === 'otp' ? otpContent : formContent}</>;

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8 bg-gradient-to-b from-[#e8f4fd] to-[#f0f2f5]">
      <div className="w-full max-w-[440px]">
        {!isModal && (
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00A8FF] to-[#0070CC] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#00A8FF]/30">
              <span className="text-white font-bold text-xl">BF</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('common.appName')}</h1>
            <p className="text-gray-500 text-sm">{t('auth.signUp')}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8">
          {step === 'otp' ? otpContent : formContent}
        </div>
      </div>
    </div>
  );
}