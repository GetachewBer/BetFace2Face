import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Bet<span className="text-emerald-400">2</span>Face</span>
          </a>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Admin Badge */}
                {user.role === 'admin' && (
                  <a href="/admin" 
                     className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium rounded-lg hover:bg-purple-500/20 transition-colors">
                    ⚡ Admin Panel
                  </a>
                )}

                {/* Balance */}
                {user.role === 'user' && (
                  <div className="hidden sm:flex px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700/50">
                    <span className="text-xs font-semibold text-emerald-400">
                      {user.walletBalance?.toFixed(2) || '0.00'} ETB
                    </span>
                  </div>
                )}

                {/* Avatar + Dropdown */}
                <div className="relative">
                  <button onClick={() => setShowDropdown(!showDropdown)} 
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-700' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}>
                      {getInitials(user.fullName)}
                    </div>
                  </button>

                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 py-2 z-20">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-800">
                          <p className="text-sm font-medium text-white">{user.fullName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {user.role === 'admin' ? 'Administrator' : user.phone || user.email}
                          </p>
                          {user.role === 'user' && (
                            <p className="text-xs text-emerald-400 mt-1">
                              Balance: {user.walletBalance?.toFixed(2) || '0.00'} ETB
                            </p>
                          )}
                        </div>

                        {/* Menu Items */}
                        {user.role === 'admin' ? (
                          <>
                            <a href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                              <span>📊</span> Dashboard
                            </a>
                            <a href="/admin/users" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                              <span>👥</span> Users
                            </a>
                          </>
                        ) : (
                          <>
                            <a href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                              <span>🏠</span> Dashboard
                            </a>
                            <a href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                              <span>👤</span> Profile
                            </a>
                          </>
                        )}

                        <hr className="my-1 border-gray-800" />
                        
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Sign In
                </a>
                <a href="/register" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-full hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25">
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};