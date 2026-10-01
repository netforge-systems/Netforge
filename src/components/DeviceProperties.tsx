import React from 'react';

interface DevicePropertiesProps {
  selectedDevice: string | null;
  currentDeviceData: any;
  onOpenTerminal: (autoCommand?: string) => void;
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
  
  if (!selectedDevice || !currentDeviceData) {
    return (
      <aside className="w-72 bg-slate-900/60 border-l border-slate-800/60 flex flex-col shrink-0 z-10">
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500 p-6 text-center">
          Select a device on the canvas to view its properties
        </div>
      </aside>
    );
  }

  // تحديد الأمر التلقائي الذي سيعمل عند الضغط على كل زر
  const handleActionClick = (action: string) => {
    if (action === 'Toggle Power') {
      onTogglePower(selectedDevice);
    } else if (action === 'View MAC Table') {
      onOpenTerminal('show mac address-table');
    } else if (action === 'View Firewall Rules') {
      onOpenTerminal('show access-lists');
    } else if (action === 'Check Latency') {
      onOpenTerminal('ping 8.8.8.8');
    } else if (action === 'Server Manager') {
      onOpenTerminal('show services');
    } else {
      onOpenTerminal(); // يفتح الـ Terminal العادي للراوتر والكمبيوتر
    }
  };

  return (
    <aside className="w-72 bg-slate-900/60 border-l border-slate-800/60 flex flex-col shrink-0 z-10">
      <div className="p-6">
        <h3 className="text-[10px] font-bold text-slate-500 tracking-widest mb-1 uppercase">Device Properties</h3>
        <h2 className="text-xl font-bold text-white mb-1">{selectedDevice}</h2>
        <p className="text-sm text-slate-400 mb-6">{currentDeviceData.type}</p>

        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 tracking-widest mb-2 uppercase">Status</h4>
            <div className={`flex items-center gap-2 text-sm font-medium ${currentDeviceData.status === 'Online' ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentDeviceData.status === 'Online' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span> {currentDeviceData.status}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Interfaces</h4>
              <span className="text-[9px] text-slate-500">Click IP to edit ✎</span>
            </div>
            <div className="space-y-3">
              {currentDeviceData.interfaces.map((intf: any, idx: number) => (
                <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 focus-within:border-cyan-500/60 transition-colors">
                  <div className="text-xs font-semibold text-white mb-1.5 flex justify-between">
                    <span>{intf.name}</span>
                    <span className="text-[10px] text-slate-500">IPv4</span>
                  </div>
                  <input
                    type="text"
                    value={intf.ip}
                    onChange={(e) => onUpdateIp(selectedDevice, idx, e.target.value)}
                    className={`w-full bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700/60 text-sm font-mono focus:outline-none focus:border-cyan-400 transition-colors ${
                      currentDeviceData.status === 'Online' ? 'text-cyan-300' : 'text-slate-500'
                    }`}
                    spellCheck="false"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-slate-500 tracking-widest mb-3 uppercase">Actions</h4>
            <div className="space-y-2">
              {currentDeviceData.actions.map((action: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => handleActionClick(action)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    action === 'Toggle Power' 
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : idx === 0 
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DeviceProperties;