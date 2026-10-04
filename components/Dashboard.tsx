import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const defaultNetworks = [
  { id: 1, name: 'Office Network', status: 'Online' },
  { id: 2, name: 'University Lab', status: 'Online' },
  { id: 3, name: 'Secure Server Network', status: 'Offline' },
  { id: 4, name: 'ISP BGP Peering', status: 'Offline' },
  { id: 5, name: 'Global Spine-Leaf Fabric', status: 'Online' }
];

function Dashboard() {
  const navigate = useNavigate();
  const [networksList, setNetworksList] = useState<any[]>(defaultNetworks);
  const [completedChallenges, setCompletedChallenges] = useState<number>(2);
  const [totalXp, setTotalXp] = useState<number>(4850);
  const [labDevicesCount, setLabDevicesCount] = useState<number>(7);

  // اسم عام افتراضي بدون أي اسم شخصي
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; initial: string }>({
    name: 'Network Engineer',
    role: 'Engineering Workspace',
    initial: 'N'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('netforge_user');
    if (!savedUser) {
      // إذا لم يسجل الزائر دخوله بعد، يتم توجيهه لبوابة الدخول ليكتب اسمه
      navigate('/welcome');
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setCurrentUser({
      name: parsedUser.name || 'Network Engineer',
      role: parsedUser.role || 'Network Engineer',
      initial: (parsedUser.name || 'N').charAt(0).toUpperCase()
    });

    const savedNets = localStorage.getItem('netforge_networks_list');
    if (savedNets) setNetworksList(JSON.parse(savedNets));

    const savedXp = localStorage.getItem('netforge_xp');
    if (savedXp) setTotalXp(Number(savedXp));

    const savedChallenges = localStorage.getItem('netforge_challenges');
    if (savedChallenges) {
      const parsed = JSON.parse(savedChallenges);
      const completedCount = parsed.filter((c: any) => c.status === 'Completed').length;
      setCompletedChallenges(completedCount);
    }

    const savedDevices = localStorage.getItem('netforge_devices');
    if (savedDevices) {
      setLabDevicesCount(Object.keys(JSON.parse(savedDevices)).length);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('netforge_user');
    navigate('/welcome');
  };

  const onlineNetworksCount = networksList.filter(n => n.status === 'Online').length;

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-300 font-sans flex overflow-hidden relative">
      
      <div className="absolute -top-32 left-64 w-96 h-96 bg-purple-600/15 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-400/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1124]/90 backdrop-blur-xl border-r border-purple-500/20 flex flex-col justify-between h-screen shrink-0 z-10">
        <div className="p-6">
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300 mb-10 tracking-widest uppercase">
            Netforge
          </h1>
          
          <nav className="space-y-1.5">
            <Link to="/" className="flex items-center justify-between text-white bg-gradient-to-r from-purple-600/30 to-amber-400/10 px-4 py-2.5 rounded-xl border border-purple-500/40 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span>Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </Link>
            <Link to="/lab" className="flex items-center gap-3 text-slate-400 hover:text-amber-300 hover:bg-purple-950/30 px-4 py-2.5 rounded-xl transition-colors">
              Network Lab
            </Link>
            <Link to="/challenges" className="flex items-center gap-3 text-slate-400 hover:text-amber-300 hover:bg-purple-950/30 px-4 py-2.5 rounded-xl transition-colors">
              Challenges
            </Link>
            <Link to="/learn" className="flex items-center gap-3 text-slate-400 hover:text-amber-300 hover:bg-purple-950/30 px-4 py-2.5 rounded-xl transition-colors">
              Learn
            </Link>
            <Link to="/networks" className="flex items-center gap-3 text-slate-400 hover:text-amber-300 hover:bg-purple-950/30 px-4 py-2.5 rounded-xl transition-colors mt-4">
              My Networks
            </Link>
            <Link to="/progress" className="flex items-center gap-3 text-slate-400 hover:text-amber-300 hover:bg-purple-950/30 px-4 py-2.5 rounded-xl transition-colors">
              Progress
            </Link>
            <Link to="/settings" className="flex items-center gap-3 text-slate-400 hover:text-amber-300 hover:bg-purple-950/30 px-4 py-2.5 rounded-xl transition-colors mt-4">
              Settings
            </Link>
          </nav>
        </div>

        {/* Dynamic User Profile */}
        <div className="p-5 border-t border-purple-500/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center text-slate-950 font-extrabold text-lg shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.5)]">
              {currentUser.initial}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-white font-semibold text-sm leading-tight truncate">{currentUser.name}</h4>
              <p className="text-[11px] text-purple-300/70 mt-0.5 truncate">{currentUser.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-1.5 px-3 rounded-lg text-[11px] font-mono bg-slate-900/90 hover:bg-purple-950/60 text-amber-300 border border-purple-500/30 transition-colors cursor-pointer"
          >
            ⇄ Sign Out / Switch User
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto h-screen z-10">
        
        <header className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full inline-block mb-2">
              ⚡ Netforge Command Center
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-1">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">{currentUser.name}</span>
            </h2>
            <p className="text-slate-400 text-sm">Continue building and exploring global & enterprise networks.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/lab" className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-extrabold transition-all shadow-[0_0_20px_rgba(250,204,21,0.35)]">
              + New Network
            </Link>
            <Link to="/challenges" className="bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 px-5 py-2.5 rounded-xl font-semibold transition-all border border-purple-500/40">
              Challenges
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-12">
          {[
            { title: 'NETWORKS', value: networksList.length.toString(), sub: `${onlineNetworksCount} active online`, accent: 'border-purple-500/30 text-purple-300' },
            { title: 'CHALLENGES', value: `${completedChallenges} / 17`, sub: 'completed scenarios', accent: 'border-amber-400/30 text-amber-300' },
            { title: 'LAB DEVICES', value: labDevicesCount.toString(), sub: 'active in workspace', accent: 'border-purple-500/30 text-purple-300' },
            { title: 'TOTAL XP', value: totalXp.toLocaleString(), sub: 'live engineering score', accent: 'border-amber-400/40 text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className={`bg-[#0E152B]/80 border ${stat.accent} p-6 rounded-2xl backdrop-blur-md shadow-lg`}>
              <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-widest">{stat.title}</h4>
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">{stat.value}</div>
              <div className={`text-xs font-mono ${stat.accent.split(' ')[1]}`}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-white mb-6">Continue Learning</h3>
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { tag: 'Switching', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', title: 'VLAN & 802.1Q Trunking', chapter: 'Module 1 - Tagging & Native VLAN', progress: '75%' },
            { tag: 'IGP Routing', tagColor: 'text-amber-300 bg-amber-400/15 border-amber-400/30', title: 'Multi-Area OSPF & LSAs', chapter: 'Module 2 - LSA Types 1–5', progress: '50%' },
            { tag: 'Global WAN', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', title: 'eBGP & Autonomous Systems', chapter: 'Module 1 - Local-Pref & AS-Path', progress: '35%' },
          ].map((course, i) => (
            <Link to="/learn" key={i} className="bg-[#0E152B]/70 border border-purple-500/25 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between h-44 hover:border-amber-400/50 transition-all group">
              <div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border inline-block mb-2.5 ${course.tagColor}`}>
                  {course.tag}
                </span>
                <h4 className="text-white font-bold mb-1 group-hover:text-amber-300 transition-colors">{course.title}</h4>
                <p className="text-xs text-slate-400">{course.chapter}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-2 font-mono">
                  <span>{course.progress} complete</span>
                </div>
                <div className="w-full bg-slate-800/90 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-amber-400 h-2 rounded-full" style={{ width: course.progress }}></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Recent Topologies</h3>
          <Link to="/networks" className="text-xs font-semibold text-amber-400 hover:underline">View All ({networksList.length}) →</Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {networksList.slice(0, 3).map((network, i) => (
             <Link to="/lab" key={network.id || i} className="bg-[#0E152B]/70 border border-purple-500/25 p-6 rounded-2xl backdrop-blur-sm cursor-pointer hover:border-amber-400/50 transition-all group block">
               <div className="h-24 w-full flex items-center justify-center mb-6">
                 <div className="relative w-16 h-16">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full z-10 shadow-[0_0_12px_rgba(250,204,21,0.9)]"></div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-purple-500/50"></div>
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-purple-500/50"></div>
                   <div className="absolute top-1/2 left-0 -translate-y-1/2 w-6 h-0.5 bg-purple-500/50"></div>
                   <div className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-0.5 bg-purple-500/50"></div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
                   <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
                   <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
                 </div>
               </div>
               <div className="flex justify-between items-end border-t border-purple-500/20 pt-4">
                 <h4 className="text-white font-semibold group-hover:text-amber-300 transition-colors">{network.name}</h4>
                 <span className={`text-[10px] font-bold uppercase flex items-center gap-1.5 ${network.status === 'Online' ? 'text-amber-400' : 'text-rose-400'}`}>
                   <span className={`w-1.5 h-1.5 rounded-full ${network.status === 'Online' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                   {network.status}
                 </span>
               </div>
             </Link>
          ))}
        </div>

      </main>
    </div>
  );
}

export default Dashboard;