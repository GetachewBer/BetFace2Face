import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BetSlip from '../components/betting/BetSlip';

const API_URL = 'http://localhost:5000/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedFixture, setSelectedFixture] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) { navigate('/login'); return; }
    setUser(JSON.parse(userData));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const fixturesRes = await axios.get(API_URL + '/fixtures');
      setFixtures(fixturesRes.data.data || []);
      
      try {
        const betsRes = await axios.get(API_URL + '/bets/my', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setBets(betsRes.data.data || []);
      } catch (err) {
        setBets([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const scheduled = fixtures.filter((f: any) => f.status === 'SCHEDULED');
  const live = fixtures.filter((f: any) => f.status === 'LIVE');
  const finished = fixtures.filter((f: any) => f.status === 'FINISHED');
  const pendingBets = bets.filter((b: any) => b.status === 'pending');
  const settledBets = bets.filter((b: any) => b.status !== 'pending');

  const tabs = [
    { key: 'upcoming', label: 'Matches', count: scheduled.length },
    { key: 'live', label: 'Live', count: live.length },
    { key: 'mybets', label: 'My Bets', count: pendingBets.length },
    { key: 'history', label: 'History', count: settledBets.length },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{user?.fullName?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <p className="text-white font-semibold">{user?.fullName}</p>
              <p className="text-emerald-400 text-sm font-medium">{user?.walletBalance?.toFixed(2) || '0.00'} ETB</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm">Sign Out</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 mb-6 mt-4">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800'
              }`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
          <>
            {activeTab === 'mybets' && (
              <div className="space-y-3">
                {pendingBets.length === 0 ? (
                  <div className="text-center py-20"><p className="text-gray-400">No active bets</p></div>
                ) : pendingBets.map((b: any) => (
                  <div key={b._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{b.league}</span>
                      <span className="text-xs text-yellow-400 font-medium">PENDING</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">{b.homeTeam}</span>
                      <div className="text-center">
                        <p className="text-emerald-400 font-bold">{b.amount} ETB</p>
                        <p className="text-gray-500 text-xs">on {b.selectedTeam}</p>
                      </div>
                      <span className="text-white text-sm">{b.awayTeam}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {settledBets.length === 0 ? (
                  <div className="text-center py-20"><p className="text-gray-400">No history</p></div>
                ) : settledBets.map((b: any) => (
                  <div key={b._id} className={`bg-gray-900 border rounded-2xl p-4 ${b.status === 'won' ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                    <span className={`text-xs font-medium ${b.status === 'won' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {b.status === 'won' ? 'WON +' + b.potentialWin : 'LOST'} - {b.amount} ETB
                    </span>
                    <p className="text-white text-sm mt-1">{b.homeTeam} vs {b.awayTeam}</p>
                    <p className="text-gray-500 text-xs">on {b.selectedTeam}</p>
                  </div>
                ))}
              </div>
            )}

            {['upcoming', 'live', 'finished'].includes(activeTab) && (
              <div className="space-y-3">
                {(activeTab === 'upcoming' ? scheduled : activeTab === 'live' ? live : finished).map((f: any) => (
                  <div key={f._id} onClick={() => f.status === 'SCHEDULED' && setSelectedFixture(f)}
                    className={`bg-gray-900 border border-gray-800 rounded-2xl p-4 ${f.status === 'SCHEDULED' ? 'hover:border-emerald-500/50 cursor-pointer' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{f.league}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        f.status === 'LIVE' ? 'bg-red-500/10 text-red-400' : f.status === 'FINISHED' ? 'bg-gray-500/10 text-gray-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>{f.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-sm">{f.homeTeam}</span>
                      <div className="px-4 text-center">
                        {f.status === 'SCHEDULED' ? (
                          <div><p className="text-gray-700 font-bold">VS</p><p className="text-emerald-400 text-xs">Tap to Bet</p></div>
                        ) : (
                          <div className="bg-gray-800 rounded-lg px-3 py-1.5">
                            <span className="text-white font-bold">{f.homeScore ?? 0}</span>
                            <span className="text-gray-500 mx-1">-</span>
                            <span className="text-white font-bold">{f.awayScore ?? 0}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-white font-bold text-sm">{f.awayTeam}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedFixture && <BetSlip fixture={selectedFixture} onClose={() => { setSelectedFixture(null); loadData(); }} />}
    </div>
  );
};

export default Dashboard;