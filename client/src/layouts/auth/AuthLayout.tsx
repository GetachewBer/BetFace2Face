import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] px-4 py-8">
      <LanguageSwitcher />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-500">
            {t('common.appName')}
          </h1>
          {subtitle && (
            <p className="text-gray-400 mt-2 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>

        <div className="bg-[#1A1A2E] rounded-xl p-6 sm:p-8 shadow-lg border border-purple-500/20">
          {title && (
            <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}