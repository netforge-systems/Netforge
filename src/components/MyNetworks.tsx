import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialNetworks = [
  {
    id: 1,
    name: 'Office Network',
    description: 'Standard enterprise LAN with perimeter firewall, single-area OSPF router, and dual workstations.',
    status: 'Online',
    devices: 7,
    connections: 6,
    protocols: ['OSPF', 'NAT', 'Firewall'],
    lastModified: '2 hours ago'
  },
  {
    id: 2,
    name: 'University Lab',
    description: 'Multi-VLAN campus topology utilizing 802.1Q trunking, Router-on-a-Stick, and DHCP relay agents.',
    status: 'Online',
    devices: 12,
    connections: 14,
    protocols: ['VLAN', '802.1Q', 'DHCP'],
    lastModified: 'Yesterday'
  },
  {
    id: 3,
    name: 'Secure Server Network',
    description: 'Hardened DMZ architecture with extended ACLs, port security, and isolated web/database servers.',
    status: 'Offline',
    devices: 9,
    connections: 10,
    protocols: ['ACLs', 'DMZ', 'Port-Sec'],
    lastModified: '3 days ago'
  },
  {
    id: 4,
    name: 'ISP BGP Peering',
    description: 'Autonomous System (AS 65001 & AS 65002) eBGP peering simulation with route-maps and local preference.',
    status: 'Offline',
    devices: 6,
    connections: 7,
    protocols: ['eBGP', 'IPv6', 'Route-Map'],
    lastModified: '1 week ago'
  },
  {
    id: 5,
    name: 'Mini SOC & Honeypot Lab',
    description: 'Security monitoring topology featuring an isolated honeypot node, IDS sensor, and SIEM log collector.',
    status: 'Online',
    devices: 8,
    connections: 8,
    protocols: ['SIEM', 'Syslog', 'SSH'],
    lastModified: '2 weeks ago'
  }
];

function MyNetworks() {
  const [networks, setNetworks] = useState<any[]>(() => {
    const saved = localStorage.getItem('netforge_networks_list');
    return saved ? JSON.parse(saved) : initialNetworks;
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNetworks = networks.filter(net => 
    net.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    net.protocols.some((p: string) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // حذف شبكة وتحديث الذاكرة فوراً
  const handleDelete = (id: number) => {
    const updated = networks.filter(net => net.id !== id);
    setNetworks(updated);
    localStorage.setItem('netforge_networks_list', JSON.stringify(updated));
  };

  // إضافة شبكة جديدة + زيادة 100 XP في الداشبورد
  const handleCreateNew = () => {
    const newNet = {
      id: Date.now(),
      name: `Custom Topology #${networks.length + 1}`,
      description: 'Newly initialized network topology ready for device placement and cabling.',
      status: 'Online',
      devices: 3,
      connections: 2,
      protocols: ['IPv4', 'OSPF'],
      lastModified: 'Just now'
    };
    const updated = [newNet, ...networks];
    setNetworks(updated);
    localStorage.setItem('netforge_networks_list', JSON.stringify(updated));

    // زيادة نقاط XP بمقدار 100 عند إنشاء شبكة جديدة
    const currentXp = Number(localStorage.getItem('netforge_xp') || 4850);
    localStorage.setItem('netforge_xp', String(currentXp + 100));
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
            <Link to="/networks" className="flex items-center gap-3 text-white bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50 font-medium mt-4">
              My Networks
            </Link>
            <Link to="/progress" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Progress
            </Link>
            <Link to="/settings" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-4">
              Settings
            </Link>
          </nav>
        </div>

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

      <main className="flex-1 p-10 overflow-y-auto h-screen">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Networks</h2>
            <p className="text-slate-400">Manage, simulate, and organize your saved network topologies (+100 XP per new topology).</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            + Create Topology
          </button>
        </header>

        <div className="flex justify-between items-center mb-8 bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl backdrop-blur-sm">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Search by network name or protocol (e.g., OSPF, VLAN)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-6 text-sm px-2">
            <div>
              <span className="text-slate-500 mr-2">Total Topologies:</span>
              <span className="text-white font-bold">{networks.length}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-2">Active Instances:</span>
              <span className="text-emerald-400 font-bold">{networks.filter(n => n.status === 'Online').length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {filteredNetworks.map((net) => (
            <div 
              key={net.id} 
              className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="h-28 bg-slate-950/60 border border-slate-800/60 rounded-lg mb-5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                  <div className="flex items-center gap-4 z-10">
                    <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185]"></div>
                    <div className="w-8 h-0.5 bg-slate-700"></div>
                    <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                    <div className="w-8 h-0.5 bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
                  </div>

                  <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                    net.status === 'Online' 
                      ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/20' 
                      : 'text-rose-400 bg-rose-400/10 border border-rose-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${net.status === 'Online' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {net.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-cyan-400 transition-colors">
                  {net.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {net.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {net.protocols.map((proto: string, idx: number) => (
                    <span key={idx} className="text-[11px] font-mono bg-slate-800/80 text-cyan-300 px-2 py-0.5 rounded border border-slate-700/60">
                      {proto}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 pb-4 mb-4 border-b border-slate-800/60">
                  <span>{net.devices} Devices • {net.connections} Links</span>
                  <span>{net.lastModified}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Link 
                    to="/lab" 
                    className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 py-2 rounded-lg text-xs font-semibold text-center transition-all"
                  >
                    Open in Lab →
                  </Link>
                  <button 
                    onClick={() => handleDelete(net.id)}
                    title="Delete Network"
                    className="px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 text-xs transition-colors cursor-pointer"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MyNetworks;