import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Settings() {
  const [name, setName] = useState('Zain');
  const [role, setRole] = useState('Network Engineering Student');
  const [autoSave, setAutoSave] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [packetSpeed, setPacketSpeed] = useState('Normal (1.5s)');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans flex overflow-hidden">
      
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

        {/* User Profile Info */}
        <div className="p-6 border-t border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            Z
          </div>
          <div>
            <h4 className="text-white font-medium text-sm leading-tight">{name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto h-screen max-w-4xl">
        
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Platform Settings</h2>
            <p className="text-slate-400">Customize your profile, lab simulator behavior, and terminal preferences.</p>
          </div>
          {savedMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium">
              ✓ Preferences saved successfully
            </div>
          )}
        </header>

        <div className="space-y-8">
          
          {/* Profile Section */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Engineer Profile</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academic / Professional Title</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Simulator Preferences */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Lab Simulator Preferences</h3>
            <div className="space-y-5">
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-white">Auto-Save Topologies</div>
                  <div className="text-xs text-slate-500">Automatically save device positions and links in browser storage</div>
                </div>
                <button 
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${autoSave ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoSave ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-white">Show Canvas Dot Grid</div>
                  <div className="text-xs text-slate-500">Display alignment grid dots in the Network Lab workspace</div>
                </div>
                <button 
                  onClick={() => setShowGrid(!showGrid)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${showGrid ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${showGrid ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <div className="text-sm font-medium text-white">Packet Simulation Speed</div>
                  <div className="text-xs text-slate-500">Control the velocity of ICMP & OSPF packet animations</div>
                </div>
                <select 
                  value={packetSpeed}
                  onChange={(e) => setPacketSpeed(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>Slow (3.0s)</option>
                  <option>Normal (1.5s)</option>
                  <option>Fast (0.8s)</option>
                </select>
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              onClick={() => localStorage.clear()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              Clear Local Cache
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Settings;