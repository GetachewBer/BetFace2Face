import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Login from '../auth/Login';
import Register from '../auth/Register';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [showAuth, setShowAuth] = useState<'none' | 'login' | 'register'>('none');

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f4fd] to-[#f0f2f5] flex flex-col">
      {/* Top Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00A8FF] to-[#0070CC] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md">
              BF
            </div>
            <span className="text-gray-800 font-bold text-lg hidden sm:block">
              BetFace2Face
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="text-gray-500 hover:text-gray-800 text-sm font-medium"
            >
              {i18n.language === 'en' ? 'አማርኛ' : 'English'}
            </button>
            <button
              onClick={() => setShowAuth('login')}
              className="text-[#00A8FF] hover:text-[#0090DD] text-sm font-semibold px-4 py-2 rounded-lg border border-[#00A8FF] hover:bg-[#00A8FF]/5 transition-all"
            >
              {t('auth.login')}
            </button>
            <button
              onClick={() => setShowAuth('register')}
              className="bg-[#00A8FF] hover:bg-[#0090DD] text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md shadow-[#00A8FF]/20 transition-all"
            >
              {t('auth.register')}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Coming Soon */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00A8FF] to-[#0070CC] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#00A8FF]/30 animate-pulse">
            <span className="text-white font-bold text-4xl">BF</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
            BetFace2Face
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl mb-2">
            Peer-to-Peer Football Betting Exchange
          </p>
          <p className="text-[#00A8FF] font-semibold text-lg animate-pulse">
            🚀 Coming Soon
          </p>
          <p className="text-gray-400 text-sm mt-6 max-w-md mx-auto">
            Bet directly against other players. No house edge. 
            Fair odds. Instant settlements.
          </p>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAuth('none')}
          />
          
          {/* Modal Content - Full height on mobile, centered on desktop */}
          <div className="relative w-full h-full sm:h-auto sm:max-h-[95vh] sm:w-[440px] overflow-y-auto">
            <div className="min-h-full sm:min-h-0 flex items-center justify-center p-4">
              <div className="w-full bg-white rounded-none sm:rounded-2xl shadow-2xl p-6 sm:p-8 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowAuth('none')}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>

                {showAuth === 'login' ? (
                  <Login
                    isModal
                    onSuccess={() => setShowAuth('none')}
                    onSwitchToRegister={() => setShowAuth('register')}
                  />
                ) : (
                  <Register
                    isModal
                    onSuccess={() => setShowAuth('none')}
                    onSwitchToLogin={() => setShowAuth('login')}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}