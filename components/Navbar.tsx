import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="h-20 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link to="/welcome" className="text-blue-500 text-2xl font-extrabold tracking-wider">
          NETFORGE
        </Link>
        <span className="hidden sm:inline-block text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-md">
          v2.4.0-IOS
        </span>
      </div>

      {/* جميع الروابط تفتح الآن صفحات المشروع الحقيقية مباشرةً */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link to="/lab" className="hover:text-cyan-400 transition-colors">
          Simulator Lab
        </Link>
        <Link to="/learn" className="hover:text-cyan-400 transition-colors">
          Learning Tracks
        </Link>
        <Link to="/challenges" className="hover:text-cyan-400 transition-colors">
          Challenges
        </Link>
        <Link to="/networks" className="hover:text-cyan-400 transition-colors">
          My Topologies
        </Link>
        <Link to="/progress" className="hover:text-cyan-400 transition-colors">
          Progress
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <Link 
          to="/lab" 
          className="hidden sm:inline-block bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold px-4 py-2.5 rounded-lg transition-all"
        >
          ⚡ Sandbox CLI
        </Link>
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all"
        >
          Open Dashboard
        </Link>
      </div>
    </header>
  );
}

export default Navbar;