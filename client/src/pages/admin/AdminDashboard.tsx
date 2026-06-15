import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    if (JSON.parse(userData).role !== 'admin') { navigate('/dashboard'); return; }
    loadFixtures();
  }, []);

  const loadFixtures = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL + '/fixtures');
      setFixtures(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSyncToday = async () => {
    setMsg('Syncing...');
    try {
      const res = await axios.post(API_URL + '/fixtures/sync-today');
      setMsg('New: ' + res.data.added + ' | Updated: ' + res.data.updated);
      loadFixtures();
    } catch (err: any) { setMsg('Failed'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredFixtures = filter === 'all' ? fixtures : 
    filter === 'wc' ? fixtures.filter((f: any) => f.league && f.league.includes('World Cup')) :
    fixtures.filter((f: any) => f.league && f.league.includes('ETH'));

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' | ' +
           d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getStatusDot = (status: string) => {
    if (status === 'LIVE') return 'bg-red-500 animate-pulse';
    if (status === 'FINISHED') return 'bg-gray-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <div className={sidebarOpen ? 'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 translate-x-0' : 'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 -translate-x-full lg:translate-x-0'}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div><p className="text-white font-semibold text-sm">Admin Panel</p><p className="text-gray-500 text-xs">Bet2Face</p></div>
          </div>
          <nav className="space-y-1 flex-1">
            {['Users', 'Sports', 'Events'].map(item => (
              <button key={item} onClick={() => { setActiveTab(item.toLowerCase()); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${activeTab === item.toLowerCase() ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {item === 'Users' ? 'U' : item === 'Sports' ? 'S' : 'E'} {item}
              </button>
            ))}
          </nav>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10">Sign Out</button>
        </div>
      </div>

      <div className="flex-1 min-h-screen">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-white font-semibold">Admin</h1>
          <div className="w-10" />
        </div>

        <div className="p-4 lg:p-8">
          {activeTab === 'events' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">Event Management</h1>
                <div className="flex gap-2">
                  <button onClick={handleSyncToday} className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-xl hover:bg-emerald-600">Sync Today</button>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'wc', label: 'World Cup' },
                  { key: 'eth', label: 'Ethiopian' }
                ].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium ${filter === f.key ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                    {f.label}
                  </button>
                ))}
              </div>

              {msg && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 text-sm mb-4">{msg}</div>}

              {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> :
               filteredFixtures.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400">No fixtures. Click Sync Today!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFixtures.map((f: any) => (
                    <div key={f._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{f.league}</span>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusDot(f.status)}`} />
                          <span className="text-xs text-gray-400">{f.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex items-center justify-end gap-3">
                          <span className="text-white font-bold">{f.homeTeam}</span>
                          {f.homeLogo ? <img src={f.homeLogo} alt="" className="w-8 h-8 object-contain rounded-full bg-gray-800 p-1" /> : <div className="w-8 h-8 rounded-full bg-gray-800" />}
                        </div>
                        
                        <div className="px-6 text-center">
                          {f.status === 'SCHEDULED' ? (
                            <div>
                              <p className="text-gray-500 text-xs">{formatTime(f.date)}</p>
                              <p className="text-gray-700 text-xs font-bold mt-1">VS</p>
                            </div>
                          ) : (
                            <div className="bg-gray-800 rounded-lg px-4 py-2">
                              <span className="text-white font-bold text-lg">{f.homeScore ?? 0}</span>
                              <span className="text-gray-500 mx-2">-</span>
                              <span className="text-white font-bold text-lg">{f.awayScore ?? 0}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex items-center gap-3">
                          {f.awayLogo ? <img src={f.awayLogo} alt="" className="w-8 h-8 object-contain rounded-full bg-gray-800 p-1" /> : <div className="w-8 h-8 rounded-full bg-gray-800" />}
                          <span className="text-white font-bold">{f.awayTeam}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;