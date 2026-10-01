import React, { useState, useEffect, useRef } from 'react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  deviceData?: any;
  allDevices?: Record<string, any>;
  initialCommand?: string | null;
}

function TerminalModal({ 
  isOpen, 
  onClose, 
  deviceName, 
  deviceData, 
  allDevices = {}, 
  initialCommand 
}: TerminalModalProps) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'user' | 'enable' | 'config'>('user');
  const [history, setHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // دالة تنفيذ الأوامر
  const executeCommand = (cmd: string, currentHistory: string[], currentMode: 'user' | 'enable' | 'config') => {
    const trimmed = cmd.trim();
    const lowerCmd = trimmed.toLowerCase();
    const promptSymbol = currentMode === 'config' ? `${deviceName}(config)#` : currentMode === 'enable' ? `${deviceName}#` : `${deviceName}>`;
    const newLines = [...currentHistory, `${promptSymbol}${trimmed}`];

    if (!trimmed) {
      setHistory(newLines);
      return;
    }

    // التحقق مما إذا كان الجهاز نفسه مطفأً
    if (deviceData?.status === 'Offline') {
      newLines.push(`% System is currently powered down (Offline). Toggle power to execute commands.`);
      setHistory(newLines);
      return;
    }

    if (lowerCmd === 'help' || lowerCmd === '?') {
      newLines.push(
        `Available Commands:`,
        `  enable / en               Enter privileged EXEC mode`,
        `  conf t                    Enter global configuration mode`,
        `  show ip int brief         Display live interface IP status`,
        `  show mac address-table    Display Layer 2 MAC forwarding table`,
        `  show access-lists         Display Firewall security ACL rules`,
        `  show services             Display active server ports & daemons`,
        `  ipconfig                  Display workstation IP configuration`,
        `  ping <ip>                 Smart ICMP reachability test to any device`,
        `  clear                     Clear terminal screen`,
        `  exit                      Exit current mode`
      );
    } 
    else if (lowerCmd === 'enable' || lowerCmd === 'en') {
      setMode('enable');
    } 
    else if (lowerCmd === 'configure terminal' || lowerCmd === 'conf t') {
      if (currentMode === 'enable') {
        setMode('config');
        newLines.push(`Enter configuration commands, one per line. End with CNTL/Z.`);
      } else {
        newLines.push(`% Invalid input: Must be in privileged mode (type 'enable' first).`);
      }
    } 
    else if (lowerCmd === 'show ip interface brief' || lowerCmd === 'show ip int brief' || lowerCmd === 'sh ip int br') {
      newLines.push(`Interface              IP-Address      OK? Method Status                Protocol`);
      if (deviceData?.interfaces) {
        deviceData.interfaces.forEach((intf: any) => {
          const namePad = intf.name.padEnd(22, ' ');
          const ipPad = intf.ip.padEnd(15, ' ');
          const status = deviceData.status === 'Online' ? 'up                    up' : 'administratively down down';
          newLines.push(`${namePad} ${ipPad} YES manual${status}`);
        });
      }
    } 
    else if (lowerCmd === 'show mac address-table' || lowerCmd === 'sh mac address-table') {
      newLines.push(
        `          Mac Address Table`,
        `-------------------------------------------`,
        `Vlan    Mac Address       Type        Ports`,
        `----    -----------       --------    -----`
      );
      Object.entries(allDevices).forEach(([name, dev], index) => {
        if (name !== deviceName && dev.status === 'Online') {
          const fakeMac = `0050.7966.680${index + 1}`;
          const port = `Fa0/${index + 1}`;
          newLines.push(`   1    ${fakeMac}    DYNAMIC     ${port} (${name})`);
        }
      });
    }
    else if (lowerCmd === 'show access-lists' || lowerCmd === 'sh access-lists') {
      newLines.push(
        `Extended IP access list PERIMETER_FW_IN`,
        `    10 permit tcp any host 192.168.1.100 eq 443 (142 matches)`,
        `    20 permit tcp any host 192.168.1.100 eq 80 (89 matches)`,
        `    30 deny icmp any 192.168.1.0 0.0.0.255 echo (412 matches - Blocked)`,
        `    40 permit ip 192.168.1.0 0.0.0.255 any (1205 matches)`
      );
    }
    else if (lowerCmd === 'show services') {
      newLines.push(
        `Active Daemons & Listening Ports on ${deviceName}:`,
        `  Proto   Local Address          State           Service`,
        `  TCP     0.0.0.0:80             LISTENING       HTTP (Nginx)`,
        `  TCP     0.0.0.0:443            LISTENING       HTTPS (TLS 1.3)`,
        `  TCP     0.0.0.0:22             LISTENING       OpenSSH Server`,
        `  UDP     0.0.0.0:53             ACTIVE          DNS Resolver`
      );
    }
    else if (lowerCmd === 'ipconfig' || lowerCmd === 'ifconfig') {
      newLines.push(`Netforge IP Configuration for ${deviceName}:`);
      if (deviceData?.interfaces) {
        deviceData.interfaces.forEach((intf: any) => {
          newLines.push(`  Adapter ${intf.name}:`);
          newLines.push(`     IPv4 Address. . . . . . . . : ${intf.ip}`);
          newLines.push(`     Interface Status. . . . . . : ${deviceData.status}`);
        });
      }
    } 
    else if (lowerCmd.startsWith('ping ')) {
      const targetIp = trimmed.slice(5).trim();
      
      // البحث الذكي في جميع أجهزة الشبكة عن عنوان الـ IP المطلوب (مع تجاهل /24 أو /30)
      let foundDeviceName: string | null = null;
      let foundDeviceStatus: string | null = null;

      if (targetIp === '8.8.8.8' || targetIp === '1.1.1.1') {
        foundDeviceName = 'Internet (Public DNS)';
        foundDeviceStatus = allDevices['Internet']?.status || 'Offline';
      } else {
        for (const [devName, dev] of Object.entries(allDevices)) {
          if (dev.interfaces) {
            for (const intf of dev.interfaces) {
              const cleanIp = intf.ip.split('/')[0].trim();
              if (cleanIp === targetIp) {
                foundDeviceName = devName;
                foundDeviceStatus = dev.status;
                break;
              }
            }
          }
          if (foundDeviceName) break;
        }
      }

      newLines.push(
        `Type escape sequence to abort.`,
        `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`
      );

      if (foundDeviceName && foundDeviceStatus === 'Online') {
        newLines.push(
          `!!!!!`,
          `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
          `[Verified reachability to ${foundDeviceName}]`
        );
      } else if (foundDeviceName && foundDeviceStatus === 'Offline') {
        newLines.push(
          `.....`,
          `Success rate is 0 percent (0/5)`,
          `% Destination host (${foundDeviceName}) is currently Offline / Administratively Down.`
        );
      } else {
        newLines.push(
          `.....`,
          `Success rate is 0 percent (0/5)`,
          `% Request timed out: No active device configured with IP ${targetIp} in topology.`
        );
      }
    } 
    else if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setHistory([]);
      return;
    } 
    else if (lowerCmd === 'exit') {
      if (currentMode === 'config') setMode('enable');
      else if (currentMode === 'enable') setMode('user');
      else onClose();
    } 
    else {
      newLines.push(`% Unknown command: "${trimmed}". Type 'help' for available commands.`);
    }

    setHistory(newLines);
  };

  useEffect(() => {
    if (isOpen) {
      setMode('user');
      const startLines = [
        `Connecting to ${deviceName} console... Connected.`,
        `Type 'help' for available commands.`,
        ``
      ];
      if (initialCommand) {
        // تنفيذ الأمر التلقائي فور فتح النافذة
        setHistory(startLines);
        setTimeout(() => {
          executeCommand(initialCommand, startLines, 'user');
        }, 100);
      } else {
        setHistory(startLines);
      }
    }
  }, [isOpen, deviceName, initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const getPrompt = () => {
    if (mode === 'config') return `${deviceName}(config)#`;
    if (mode === 'enable') return `${deviceName}#`;
    return `${deviceName}>`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input, history, mode);
    setInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[680px] h-[440px] bg-[#090D16] border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Terminal Header */}
        <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" onClick={onClose}></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">CLI Console — {deviceName}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm cursor-pointer">✕</button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1">
          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-relaxed">{line}</div>
          ))}
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-1">
            <span className="text-cyan-400 font-bold">{getPrompt()}</span>
            <input
              type="text"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white focus:outline-none font-mono"
            />
          </form>
          <div ref={bottomRef} />
        </div>

      </div>
    </div>
  );
}

export default TerminalModal;