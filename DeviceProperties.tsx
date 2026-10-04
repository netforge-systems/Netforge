import React, { useState, useEffect } from 'react';

interface DevicePropertiesProps {
  selectedDevice: string | null;
  currentDeviceData: any;
  onOpenTerminal: (autoCmd?: string) => void;
  onTogglePower: (deviceName: string) => void;
  onUpdateIp: (deviceName: string, interfaceIndex: number, newIp: string) => void;
}

function DeviceProperties({
  selectedDevice,
  currentDeviceData,
  onOpenTerminal,
  onTogglePower,
  onUpdateIp
}: DevicePropertiesProps) {
  const [cpuLoad, setCpuLoad] = useState(14);
  const [memUsage, setMemUsage] = useState(42);

  // محاكاة حية لاستهلاك المعالج والذاكرة في الوقت الفعلي
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentDeviceData?.status === 'Online') {
        setCpuLoad(Math.floor(12 + Math.random() * 18));
        setMemUsage(Math.floor(40 + Math.random() * 6));
      } else {
        setCpuLoad(0);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [currentDeviceData]);

  if (!selectedDevice || !currentDeviceData) {
    return (
      <aside className="w-72 bg-slate-900/40 border-l border-slate-800/60 p-6 flex items-center justify-center text-xs text-slate-500 font-mono">
        Select a node on the canvas to inspect hardware & interfaces.
      </aside>
    );
  }

  const isOnline = currentDeviceData.status === 'Online';

  return (
    <aside className="w-80 bg-slate-900/60 border-l border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto shrink-0 z-10">
      <div className="space-y-5">
        
        {/* رأس الجهاز وحالة التشغيل */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentDeviceData.icon}</span>
              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">{selectedDevice}</h3>
                <span className="text-[11px] font-mono text-slate-400">{currentDeviceData.type}</span>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
              isOnline ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              {currentDeviceData.status}
            </span>
          </div>

          {/* مقاييس العتاد الحية (Hardware Telemetry) */}
          <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-950/90 border border-slate-800/80 rounded-xl p-2.5 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-500">CPU Load</div>
              <div className="text-xs font-bold text-amber-300">{isOnline ? `${cpuLoad}%` : '0%'}</div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-[10px] text-slate-500">DRAM</div>
              <div className="text-xs font-bold text-purple-300">{isOnline ? `${memUsage}%` : '0%'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Chassis</div>
              <div className="text-xs font-bold text-emerald-400">{isOnline ? '36°C' : 'OFF'}</div>
            </div>
          </div>
        </div>

        {/* منافذ الشبكة الفيزيائية وأضواء LED */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Physical Interfaces (NIC / Ports)
            </h4>
            <span className="text-[10px] font-mono text-emerald-400">1000BASE-T / Full</span>
          </div>

          <div className="space-y-3">
            {(currentDeviceData.interfaces || []).map((intf: any, idx: number) => (
              <div key={idx} className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`}></span>
                    {intf.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isOnline ? 'UP / UP' : 'ADMIN DOWN'}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">IPv4 Address / CIDR Mask:</label>
                  <input
                    type="text"
                    value={intf.ip}
                    onChange={(e) => onUpdateIp(selectedDevice, idx, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                  <span>MTU: 1500B</span>
                  <span>BW: 1,000,000 Kbit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أزرار التحكم والـ CLI السريع */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            Device Operations & Diagnostics
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => onOpenTerminal()}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              💻 Open Live IOS CLI Terminal
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenTerminal('show ip route')}
                className="py-2 px-2.5 rounded-lg text-[11px] font-mono bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                📋 Routing Table
              </button>
              <button
                onClick={() => onOpenTerminal('show ip interface brief')}
                className="py-2 px-2.5 rounded-lg text-[11px] font-mono bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                🔌 Port Status
              </button>
            </div>

            <button
              onClick={() => onTogglePower(selectedDevice)}
              className={`w-full py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isOnline
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isOnline ? '⏻ Shut Down Chassis Power' : '⚡ Power On Chassis'}
            </button>
          </div>
        </div>

      </div>

      <div className="pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
        <span>IOSv 17.9.4a</span>
        <span>SNMPv3: Active</span>
      </div>
    </aside>
  );
}

export default DeviceProperties;