import React, { useState } from 'react';

const cidrData: Record<string, { mask: string; hosts: string; wildcard: string; useCase: string }> = {
  '/24': { mask: '255.255.255.0', hosts: '254 Usable Hosts', wildcard: '0.0.0.255', useCase: 'Standard Enterprise LAN / Department VLAN' },
  '/26': { mask: '255.255.255.192', hosts: '62 Usable Hosts', wildcard: '0.0.0.63', useCase: 'Segmented Engineering or DMZ Server Subnet' },
  '/28': { mask: '255.255.255.240', hosts: '14 Usable Hosts', wildcard: '0.0.0.15', useCase: 'Small Branch Office / Management VLAN' },
  '/30': { mask: '255.255.255.252', hosts: '2 Usable Hosts', wildcard: '0.0.0.3', useCase: 'Point-to-Point Router WAN Link (OSPF / BGP)' },
};

function ChartSection() {
  const [selectedCidr, setSelectedCidr] = useState<string>('/24');
  const currentCidr = cidrData[selectedCidr];

  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* البطاقة اليسرى: مؤشرات أداء ومقارنة البروتوكولات */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 block mb-2">
              ⚡ Engine Telemetry
            </span>
            <h3 className="text-2xl font-extrabold text-white mb-2">
              Real-Time Routing Convergence & Throughput
            </h3>
            <p className="text-sm text-slate-400 mb-8">
              Compare protocol convergence times and packet forwarding rates inside the Netforge virtual kernel.
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-white font-semibold">OSPFv2 Fast-Hello Convergence</span>
                  <span className="text-cyan-400 font-bold">0.42 sec (98% Efficiency)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full w-[94%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-white font-semibold">IEEE 802.1Q Trunk Switching Throughput</span>
                  <span className="text-emerald-400 font-bold">10 Gbps Line-Rate</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-2.5 rounded-full w-[98%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-white font-semibold">Extended ACL Stateful Packet Inspection</span>
                  <span className="text-purple-400 font-bold">0.18 ms Latency</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full w-[88%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-800/80 text-center">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              <div className="text-xl font-extrabold text-white font-mono">0%</div>
              <div className="text-[11px] text-slate-500">Packet Loss</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              <div className="text-xl font-extrabold text-cyan-400 font-mono">Layer 2/3</div>
              <div className="text-[11px] text-slate-500">Full Emulation</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              <div className="text-xl font-extrabold text-emerald-400 font-mono">Cisco IOS</div>
              <div className="text-[11px] text-slate-500">CLI Compatible</div>
            </div>
          </div>
        </div>

        {/* البطاقة اليمنى: حاسبة CIDR التفاعلية السريعة */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-2">
              🧮 Interactive Tool
            </span>
            <h3 className="text-2xl font-extrabold text-white mb-2">
              Instant CIDR & VLSM Inspector
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Select a prefix length to preview subnet masks, OSPF wildcard bits, and host capacity.
            </p>

            {/* أزرار اختيار الـ Prefix */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {Object.keys(cidrData).map((prefix) => (
                <button
                  key={prefix}
                  onClick={() => setSelectedCidr(prefix)}
                  className={`py-2.5 rounded-xl font-mono text-sm font-bold transition-all cursor-pointer border ${
                    selectedCidr === prefix
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {prefix}
                </button>
              ))}
            </div>

            {/* نتائج الـ Subnetting */}
            <div className="space-y-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-500">Subnet Mask:</span>
                <span className="text-white font-bold">{currentCidr.mask}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-500">OSPF Wildcard:</span>
                <span className="text-cyan-400 font-bold">{currentCidr.wildcard}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-500">Capacity:</span>
                <span className="text-emerald-400 font-bold">{currentCidr.hosts}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Recommended Topology Use:</span>
                <span className="text-slate-300 font-sans">{currentCidr.useCase}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] font-mono text-slate-500 text-center">
            Example Network: <span className="text-slate-300">192.168.10.0{selectedCidr}</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ChartSection;