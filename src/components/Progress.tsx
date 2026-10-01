import React from 'react';
import { Link } from 'react-router-dom';

const skillsData = [
  { name: 'Routing Protocols (OSPF / BGP)', level: 'Advanced', percent: 85, color: 'bg-cyan-500' },
  { name: 'Layer 2 Switching & VLANs', level: 'Intermediate', percent: 70, color: 'bg-blue-500' },
  { name: 'IPv4/IPv6 Subnetting & VLSM', level: 'Master', percent: 95, color: 'bg-emerald-400' },
  { name: 'Network Security & Perimeter ACLs', level: 'Intermediate', percent: 60, color: 'bg-rose-500' },
];

const badgesData = [
  { title: 'Subnetting Ninja', desc: 'Solved 10 VLSM & CIDR challenges without errors', icon: '🎯', earned: true, date: 'Sep 2026' },
  { title: 'OSPF Architect', desc: 'Built a multi-area OSPF topology with full adjacency', icon: '🌐', earned: true, date: 'Sep 2026' },
  { title: 'Packet Guardian', desc: 'Mitigated a simulated ICMP flood using extended ACLs', icon: '🛡️', earned: true, date: 'Oct 2026' },
  { title: 'BGP Mastermind', desc: 'Configure eBGP peering across 3 Autonomous Systems', icon: '🚀', earned: false, date: 'Locked' },
];

const activityLog = [
  { action: 'Completed Challenge: VLAN Trunking & 802.1Q', xp: '+150 XP', time: '2 hours ago' },
  { action: 'Simulated Traffic on Office Network Topology', xp: '+50 XP', time: 'Yesterday' },
  { action: 'Finished Module: Binary to Decimal Conversion', xp: '+100 XP', time: '3 days ago' },
  { action: 'Created Topology: Mini SOC & Honeypot Lab', xp: '+200 XP', time: '1 week ago' },
];

function Progress() {
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
            <Link to="/progress" className="flex items-center gap-3 text-white bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50 font-medium">
              Progress
            </Link>
            <Link to="/settings" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-4">
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
            <h4 className="text-white font-medium text-sm leading-tight">Zain</h4>
            <p className="text-xs text-slate-500 mt-0.5">Network Engineering<br/>Student</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto h-screen">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Engineering Progress</h2>
            <p className="text-slate-400">Track your technical mastery, earned badges, and lab simulation milestones.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 px-6 py-3 rounded-xl flex items-center gap-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Rank</div>
              <div className="text-lg font-bold text-white">Level 14 • <span className="text-cyan-400">Net Architect</span></div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800"></div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total XP</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">4,850 XP</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8 mb-10">
          
          {/* Skill Breakdown (7 cols) */}
          <div className="col-span-7 bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-6">Domain Mastery</h3>
            <div className="space-y-6">
              {skillsData.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded">{skill.level}</span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">{skill.percent}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2">
                    <div className={`${skill.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${skill.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log (5 cols) */}
          <div className="col-span-5 bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {activityLog.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                  <div>
                    <div className="text-xs font-medium text-slate-200 mb-1">{item.action}</div>
                    <div className="text-[11px] text-slate-500">{item.time}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    {item.xp}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Badges & Certifications */}
        <h3 className="text-lg font-bold text-white mb-6">Earned Badges & Achievements</h3>
        <div className="grid grid-cols-4 gap-6">
          {badgesData.map((badge, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-xl border backdrop-blur-sm flex flex-col justify-between ${
                badge.earned 
                  ? 'bg-slate-900/40 border-slate-800/80' 
                  : 'bg-slate-900/20 border-slate-800/30 opacity-50'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-4">
                  {badge.icon}
                </div>
                <h4 className="text-white font-bold mb-1">{badge.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{badge.desc}</p>
              </div>
              <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center text-[11px]">
                <span className={badge.earned ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  {badge.earned ? '● Unlocked' : '🔒 Locked'}
                </span>
                <span className="text-slate-500 font-mono">{badge.date}</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

export default Progress;