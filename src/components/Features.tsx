import React from 'react';

const platformFeatures = [
  {
    icon: '🔀',
    title: 'Interactive Topology Builder',
    description: 'Drag-and-drop routers, Layer 2 switches, firewalls, and servers onto an infinite canvas with live link status detection.'
  },
  {
    icon: '💻',
    title: 'Built-in Cisco IOS CLI',
    description: 'Practice real-world command-line configurations, inspect MAC tables, verify interface IPs, and run smart ICMP ping tests.'
  },
  {
    icon: '⚡',
    title: 'Live Packet Simulation',
    description: 'Visualize data packets flowing across network links in real time and observe immediate routing reactions when nodes go offline.'
  }
];

function Features() {
  return (
    <section className="py-16 px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformFeatures.map((feat, idx) => (
          <div 
            key={idx} 
            className="bg-slate-900/50 border border-slate-800/80 p-7 rounded-2xl backdrop-blur-sm hover:border-cyan-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl mb-5">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2.5">{feat.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;