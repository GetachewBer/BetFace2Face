import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface BetSlipProps {
  fixture: any;
  onClose: () => void;
}

const BetSlip: React.FC<BetSlipProps> = ({ fixture, onClose }) => {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away' | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceBet = async () => {
    if (!selectedTeam || !amount || Number(amount) <= 0) return;
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL + '/bets', {
        fixtureId: fixture.fixtureId,
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        selectedTeam: selectedTeam === 'home' ? fixture.homeTeam : fixture.awayTeam,
        amount: Number(amount),
        matchDate: fixture.date,
        league: fixture.league
      }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">OK</div>
          <h3 className="text-lg font-bold text-white mb-1">Bet Placed!</h3>
          <p className="text-gray-400 text-sm mb-2">{amount} ETB on {selectedTeam === 'home' ? fixture.homeTeam : fixture.awayTeam}</p>
          <p className="text-emerald-400 text-sm font-medium mb-4">Win: {Number(amount) * 2} ETB</p>
          <button onClick={onClose} className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white text-center mb-4">Place Your Bet</h3>

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-sm mb-3">{error}</div>}

        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setSelectedTeam('home')}
            className={`flex-1 p-3 rounded-xl text-center transition-all ${selectedTeam === 'home' ? 'bg-emerald-500/10 border-2 border-emerald-500' : 'bg-gray-800 border-2 border-transparent'}`}>
            <p className="text-white font-medium text-sm">{fixture.homeTeam}</p>
          </button>
          <span className="px-3 text-gray-500 font-bold">VS</span>
          <button onClick={() => setSelectedTeam('away')}
            className={`flex-1 p-3 rounded-xl text-center transition-all ${selectedTeam === 'away' ? 'bg-emerald-500/10 border-2 border-emerald-500' : 'bg-gray-800 border-2 border-transparent'}`}>
            <p className="text-white font-medium text-sm">{fixture.awayTeam}</p>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Amount (ETB)</label>
          <div className="flex gap-2 mb-2">
            {[50, 100, 200, 500].map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${amount === String(a) ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {a}
              </button>
            ))}
          </div>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="Custom" className="w-full rounded-lg bg-gray-800 border-2 border-gray-700 px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none" />
        </div>

        <button onClick={handlePlaceBet} disabled={!selectedTeam || !amount || loading}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50">
          {loading ? 'Placing...' : 'Place Bet - ' + (amount || '0') + ' ETB'}
        </button>
      </div>
    </div>
  );
};

export default BetSlip;