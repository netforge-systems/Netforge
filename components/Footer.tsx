import React from 'react';

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-10 px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* اسم المنصة وحالة المحرك */}
        <div className="flex items-center gap-4">
          <span className="text-blue-500 text-xl font-bold tracking-wider">NETFORGE</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            All Simulation Nodes Operational
          </span>
        </div>

        {/* المعايير الهندسية المدعومة بدلاً من تكرار الروابط */}
        <div className="flex flex-wrap justify-center gap-4 text-[11px] font-mono text-slate-500">
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded">RFC 2328 (OSPFv2)</span>
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded">IEEE 802.1Q (VLAN)</span>
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded">RFC 4271 (BGP-4)</span>
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded">Stateful ACLs</span>
        </div>

        {/* حقوق الملكية */}
        <div className="text-xs text-slate-500 font-mono">
          © 2026 Netforge Lab • Engineered by <span className="text-cyan-400 font-semibold">Zain</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;