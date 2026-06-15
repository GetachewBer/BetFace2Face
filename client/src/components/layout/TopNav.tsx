import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TopNav() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00A8FF] to-[#0070CC] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md">
            BF
          </div>
          <span className="text-gray-800 font-bold text-lg hidden sm:block">
            BetFace2Face
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-gray-500 hover:text-gray-800 text-sm font-medium px-2 py-1"
          >
            {i18n.language === 'en' ? 'አማ' : 'EN'}
          </button>

          {isAuthPage ? (
            <Link
              to="/register"
              className="bg-[#00A8FF] hover:bg-[#0090DD] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-md shadow-[#00A8FF]/20"
            >
              {t('auth.register')}
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-[#00A8FF] hover:bg-[#0090DD] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-md shadow-[#00A8FF]/20"
            >
              {t('auth.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}