import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  // قراءة اسم ودور المستخدم المسجل حالياً بدلاً من الاسم الثابت
  const storedUser = JSON.parse(
    localStorage.getItem('netforge_user') ||
    '{"name":"Network Engineer","role":"Network Engineering Student","email":"engineer@netforge.io","initial":"N"}'
  );

  const [name, setName] = useState<string>(storedUser.name || 'Network Engineer');
  const [role, setRole] = useState<string>(storedUser.role || 'Network Engineering Student');
  const [email, setEmail] = useState<string>(storedUser.email || 'engineer@netforge.io');
  const [autoSave, setAutoSave] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [packetSpeed, setPacketSpeed] = useState('Normal (1.5s)');
  const [savedMessage, setSavedMessage] = useState(false);

  // حفظ التغييرات فعلياً في localStorage لتنعكس على كل صفحات الموقع
  const handleSave = () => {
    const cleanName = name.trim() || 'Network Engineer';
    const updatedUser = {
      name: cleanName,
      role: role.trim() || 'Network Engineer',
      email: email.trim(),
      initial: cleanName.charAt(0).toUpperCase()
    };
    localStorage.setItem('netforge_user', JSON.stringify(updatedUser));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleResetProgress = () => {
    localStorage.removeItem('netforge_devices');
    localStorage.removeItem('netforge_connections');
    localStorage.removeItem('netforge_xp');
    localStorage.removeItem('netforge_challenges');
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const currentInitial = (name.trim() || 'N').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-300 font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/60 flex flex-col justify-between h-screen shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400 mb-10 tracking-widest uppercase">Netforge</h1>
          
          <nav className="space-y-1">
            <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Dashboard
            </Link>
            <Link to="/lab" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Network Lab
            </Link>
            <Link to="/challenges" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Challenges
            </Link>
            <Link to="/learn" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Learn
            </Link>
            <Link to="/networks" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-4">
              My Networks
            </Link>
            <Link to="/progress" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Progress
            </Link>
            <Link to="/settings" className="flex items-center gap-3 text-white bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50 font-medium mt-4">
              Settings
            </Link>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {currentInitial}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-white font-medium text-sm leading-tight truncate">{name || 'Network Engineer'}</h4>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Platform Settings</h2>
            <p className="text-slate-400 text-sm">Customize your engineer profile and simulation preferences.</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('netforge_user');
              navigate('/welcome');
            }}
            className="text-xs font-mono bg-slate-900 hover:bg-slate-800 text-amber-300 border border-purple-500/30 px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
          >
            ⇄ Sign Out / Switch User
          </button>
        </header>

        <div className="max-w-3xl space-y-8">
          
          {/* Profile Section */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Engineer Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Role / Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Simulation Preferences */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-5">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Simulation Engine Preferences</h3>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-white">Auto-Save Topologies</h4>
                <p className="text-xs text-slate-500">Automatically save canvas nodes and links to local storage</p>
              </div>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-white">Show Canvas Alignment Grid</h4>
                <p className="text-xs text-slate-500">Display radial dot grid inside the Network Lab workspace</p>
              </div>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-white">Packet Animation Speed</h4>
                <p className="text-xs text-slate-500">Control ICMP / OSPF / BGP packet traversal velocity</p>
              </div>
              <select
                value={packetSpeed}
                onChange={(e) => setPacketSpeed(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option>Fast (0.8s)</option>
                <option>Normal (1.5s)</option>
                <option>Slow / Debug (2.5s)</option>
              </select>
            </div>
          </div>

          {/* Save & Reset Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
              >
                Save Changes
              </button>

              {savedMessage && (
                <span className="text-emerald-400 text-xs font-mono font-bold">
                  ✓ Profile & preferences updated across all pages!
                </span>
              )}
            </div>

            <button
              onClick={handleResetProgress}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Lab & XP Data
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Settings;