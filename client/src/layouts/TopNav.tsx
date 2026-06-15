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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1a2d]/95 backdrop-blur-md border-b border-[#1e3048]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00A8FF] rounded-lg flex items-center justify-center font-bold text-white text-sm">
            BF
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">
            BetFace2Face
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="text-gray-400 hover:text-white text-sm font-medium px-2 py-1"
          >
            {i18n.language === 'en' ? 'አማ' : 'EN'}
          </button>

          {/* Auth buttons */}
          {isAuthPage ? (
            <Link
              to="/register"
              className="bg-[#00A8FF] hover:bg-[#0090DD] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {t('auth.register')}
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-[#00A8FF] hover:bg-[#0090DD] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {t('auth.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}