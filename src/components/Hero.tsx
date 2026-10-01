import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const protocolDemos: Record<string, { title: string; status: string; color: string; packetColor: string; cli: string }> = {
  ospf: {
    title: 'OSPFv2 Area 0 Convergence',
    status: 'FULL / DR Elected (1.1.1.1)',
    color: 'text-amber-300 border-amber-400/40 bg-amber-400/10',
    packetColor: '#facc15',
    cli: `Router-01# show ip ospf neighbor
Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/BDR        00:00:38    10.0.0.2        Gig0/1
%OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on Gig0/1 from LOADING to FULL`
  },
  vlan: {
    title: 'IEEE 802.1Q Trunking & ROAS',
    status: 'VLAN 10, 20 Tagged Active',
    color: 'text-purple-300 border-purple-400/40 bg-purple-500/15',
    packetColor: '#c084fc',
    cli: `Switch-01# show interfaces trunk
Port        Mode             Encapsulation  Status        Native vlan
Gi0/1       on               802.1q         trunking      99
Gi0/1       Vlans allowed and active in management domain: 10,20,99`
  },
  bgp: {
    title: 'Global eBGP Multi-AS Peering',
    status: 'AS 65001 <-> AS 65002 ESTABLISHED',
    color: 'text-amber-300 border-amber-400/40 bg-amber-400/10',
    packetColor: '#fbbf24',
    cli: `Amman-IXP# show ip bgp summary
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
185.10.1.2      4 65002    1420    1398       84    0    0 12:44:10       4250`
  }
};

function Hero() {
  const navigate = useNavigate();
  const [activeProto, setActiveProto] = useState<'ospf' | 'vlan' | 'bgp'>('ospf');
  const [role, setRole] = useState<'engineer' | 'instructor'>('engineer');
  const [email, setEmail] = useState('zain.obeidat@netforge.edu');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const currentDemo = protocolDemos[activeProto];

  return (
    <section className="relative min-h-[88vh] flex items-center py-12 px-8 lg:px-16 overflow-hidden bg-[#070B19]">
      
      {/* إضاءة خلفية نهدية وصفراء فوق الكحلي */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)', backgroundSize: '32px 32px' }}
      ></div>
      <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[460px] h-[460px] bg-amber-400/15 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* الجهة اليسرى (7 أعمدة) */}
        <div className="lg:col-span-7 text-left space-y-6">
          
          <div className="inline-flex flex-wrap items-center gap-3 bg-[#0E152B] border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-mono">
            <span className="flex items-center gap-2 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              NETFORGE ENGINE ONLINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-purple-300">ASN 65001</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">100G Clos & BGP Ready</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Architect, Simulate & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-300">
              Command Global Networks.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300/80 max-w-2xl leading-relaxed">
            Design simple Star/Mesh LANs or complex intercontinental BGP & Spine-Leaf fabrics. Configure routers via Cisco IOS CLI and watch live packet flows in real time.
          </p>

          {/* معاين البروتوكولات الحي باللون النهدي والأصفر */}
          <div className="bg-[#0C1226]/90 border border-purple-500/30 rounded-2xl p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-purple-500/20">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">⚡ Live Protocol Inspector:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveProto('ospf')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    activeProto === 'ospf' ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(250,204,21,0.4)]' : 'bg-slate-900 text-slate-300 border-purple-500/30'
                  }`}
                >
                  🔄 OSPF Area 0
                </button>
                <button 
                  onClick={() => setActiveProto('vlan')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    activeProto === 'vlan' ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]' : 'bg-slate-900 text-slate-300 border-purple-500/30'
                  }`}
                >
                  🔀 802.1Q VLAN
                </button>
                <button 
                  onClick={() => setActiveProto('bgp')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    activeProto === 'bgp' ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(250,204,21,0.4)]' : 'bg-slate-900 text-slate-300 border-purple-500/30'
                  }`}
                >
                  🌍 Global eBGP
                </button>
              </div>
            </div>

            <div className="bg-[#070B19] border border-purple-500/25 rounded-xl p-4 mb-4 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(250,204,21,0.3)]">🔄</div>
                <div>
                  <div className="text-xs font-bold text-white">Core-RTR1</div>
                  <div className="text-[10px] font-mono text-amber-400">10.0.0.1/30</div>
                </div>
              </div>

              <div className="flex-1 mx-4 relative h-8 flex items-center">
                <svg className="w-full h-8 overflow-visible">
                  <path d="M 0 16 L 240 16" stroke="#6b21a8" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                  <circle r="5" fill={currentDemo.packetColor}>
                    <animateMotion dur="1.2s" repeatCount="indefinite" path="M 0 16 L 240 16" />
                  </circle>
                  <circle r="4" fill="#c084fc" opacity="0.8">
                    <animateMotion dur="1.2s" begin="0.6s" repeatCount="indefinite" path="M 240 16 L 0 16" />
                  </circle>
                </svg>
                <span className={`absolute left-1/2 -translate-x-1/2 -top-1 text-[10px] font-mono px-2 py-0.5 rounded border ${currentDemo.color}`}>
                  {currentDemo.status}
                </span>
              </div>

              <div className="flex items-center gap-3 z-10">
                <div className="text-right">
                  <div className="text-xs font-bold text-white">Dist-SW01</div>
                  <div className="text-[10px] font-mono text-purple-300">192.168.1.2/24</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-900 border-2 border-purple-500 flex items-center justify-center text-lg">🔀</div>
              </div>
            </div>

            <div className="bg-black/90 rounded-lg p-3.5 border border-purple-500/20 font-mono text-[11px] text-amber-300 overflow-x-auto">
              <pre className="leading-relaxed">{currentDemo.cli}</pre>
            </div>
          </div>

        </div>

        {/* الجهة اليمنى (5 أعمدة): بوابة تسجيل الدخول بالثيم النهدي والأصفر */}
        <div className="lg:col-span-5">
          <div className="bg-[#0C1226]/90 border-2 border-purple-500/40 rounded-3xl p-8 lg:p-9 backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.2)] relative">
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#facc15]"></span>
                <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
                  Netforge Auth Gateway
                </span>
              </div>
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                🔒 SSH / TLS 1.3
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-1">Engineer Console Login</h2>
            <p className="text-xs text-slate-400 mb-6">Authenticate to access your global topologies and lab instances.</p>

            <div className="grid grid-cols-2 gap-2 p-1 bg-[#070B19] rounded-xl border border-purple-500/30 mb-6">
              <button
                type="button"
                onClick={() => setRole('engineer')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'engineer' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                👩‍💻 Student / Engineer
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'instructor' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏫 Lab Instructor
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5">
                  {role === 'engineer' ? 'Engineer ID / University Email' : 'Instructor Credentials'}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#070B19] border border-purple-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                    Access Passkey
                  </label>
                  <span className="text-[11px] text-amber-400 hover:underline cursor-pointer">Reset Key?</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070B19] border border-purple-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-[0_0_25px_rgba(250,204,21,0.4)] transition-all cursor-pointer text-sm tracking-wide mt-2"
              >
                Authenticate & Launch Dashboard →
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="h-[1px] flex-1 bg-purple-500/20"></div>
              <span className="text-[10px] font-mono uppercase text-slate-500">OR INSTANT SANDBOX</span>
              <div className="h-[1px] flex-1 bg-purple-500/20"></div>
            </div>

            <Link
              to="/lab"
              className="w-full bg-purple-950/40 hover:bg-purple-900/50 text-amber-300 border border-purple-500/40 font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              ⚡ Launch Global Topology Studio (Guest Mode)
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;