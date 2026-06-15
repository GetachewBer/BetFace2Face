import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Peer-to-Peer Betting Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Bet Face to Face</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 bg-clip-text text-transparent">
              Win Real Money
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Challenge your friends, create custom bets, and settle face to face. 
            The most trusted P2P betting platform in Ethiopia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" 
               className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full text-lg
                          hover:from-emerald-400 hover:to-teal-500 transition-all duration-300
                          shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40">
              Start Betting Now
            </a>
            <a href="/login" 
               className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-full text-lg
                          border border-gray-700 hover:border-emerald-500/50 transition-all duration-300">
              I Already Have an Account
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20 pt-12 border-t border-gray-800/50">
            <div>
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-sm text-gray-500 mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">50K+</p>
              <p className="text-sm text-gray-500 mt-1">Bets Placed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">2M+</p>
              <p className="text-sm text-gray-500 mt-1">ETB Won</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why <span className="text-emerald-400">Bet2Face</span>?
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
            The ultimate platform for fair and exciting peer-to-peer betting.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Secure Escrow', desc: 'Money held securely until bet is settled. No scams.' },
              { icon: '⚡', title: 'Instant Payouts', desc: 'Winners paid immediately. No delays.' },
              { icon: '🤝', title: 'Peer-to-Peer', desc: 'Bet against friends. You set the terms.' },
              { icon: '📱', title: 'Mobile First', desc: 'Works perfectly on any device.' },
              { icon: '🎯', title: 'Any Challenge', desc: 'Sports, games, trivia - bet on anything.' },
              { icon: '🇪🇹', title: 'Ethiopian Birr', desc: 'All bets in ETB. No currency confusion.' },
            ].map((f, i) => (
              <div key={i} className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">Bet<span className="text-emerald-400">2</span>Face</span>
        </div>
        <p className="text-gray-600 text-sm">2024 Bet2Face. Made in Ethiopia 🇪🇹</p>
      </footer>
    </div>
  );
};

export default Home;