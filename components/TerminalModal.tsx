import React, { useState, useEffect, useRef } from 'react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  deviceData: any;
  allDevices?: Record<string, any>;
  initialCommand?: string | null;
  onUpdateIp?: (deviceName: string, interfaceIndex: number, newIp: string) => void;
  onTogglePower?: (deviceName: string) => void;
  onCliSyslog?: (logMsg: string) => void;
}

type CliMode = 'user' | 'priv' | 'config' | 'config-if' | 'config-router';

function TerminalModal({
  isOpen,
  onClose,
  deviceName,
  deviceData,
  allDevices = {},
  initialCommand = null,
  onUpdateIp,
  onTogglePower,
  onCliSyslog
}: TerminalModalProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [cliMode, setCliMode] = useState<CliMode>('priv');
  const [hostname, setHostname] = useState<string>(deviceName);
  const [activeInterfaceIdx, setActiveInterfaceIdx] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isCiscoDevice =
    deviceData?.type?.toLowerCase().includes('router') ||
    deviceData?.type?.toLowerCase().includes('switch') ||
    deviceData?.type?.toLowerCase().includes('bgp') ||
    deviceData?.type?.toLowerCase().includes('firewall') ||
    deviceData?.type?.toLowerCase().includes('isp');

  useEffect(() => {
    if (isOpen && deviceData) {
      setHostname(deviceName);
      setCliMode('priv');
      const primaryIp = deviceData.interfaces?.[0]?.ip || 'Unassigned';
      const bootBanner = isCiscoDevice
        ? [
            `Cisco IOS XE Software, Version 17.09.04a (Netforge Virtual Kernel)`,
            `Copyright (c) 1986-2026 by Cisco Systems, Inc. Compiled for x86_64`,
            `Hardware: ${deviceData.type} | DRAM: 4096 MB | Flash: 16384 MB`,
            `System image file is "flash:packages.conf" | Primary IP: ${primaryIp}`,
            `Press RETURN to get started. Type "help" or "?" for supported IOS commands.`,
            `--------------------------------------------------------------------------`
          ]
        : [
            `Netforge Linux Enterprise Workstation 6.8.0-45-generic x86_64`,
            `Node: ${deviceName} (${deviceData.type}) \vert{} Primary IPv4:${primaryIp}`,
            `Type "help", "ifconfig", "ping <ip>", "traceroute <ip>", or "netstat -rn".`,
            `--------------------------------------------------------------------------`
          ];

      setHistory(bootBanner);

      if (initialCommand) {
        setTimeout(() => {
          executeCommand(initialCommand, bootBanner);
        }, 150);
      }
    }
  }, [isOpen, deviceName, initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen || !deviceData) return null;

  const getPrompt = () => {
    if (!isCiscoDevice) return `root@${hostname}:~#`;
    switch (cliMode) {
      case 'user':
        return `${hostname}>`;
      case 'priv':
        return `${hostname}#`;
      case 'config':
        return `${hostname}(config)#`;
      case 'config-if':
        return `${hostname}(config-if)#`;
      case 'config-router':
        return `${hostname}(config-router)#`;
    }
  };

  const subnetMaskToCidr = (mask: string): string => {
    const map: Record<string, string> = {
      '255.255.255.252': '/30',
      '255.255.255.248': '/29',
      '255.255.255.240': '/28',
      '255.255.255.224': '/27',
      '255.255.255.192': '/26',
      '255.255.255.128': '/25',
      '255.255.255.0': '/24',
      '255.255.252.0': '/22',
      '255.255.0.0': '/16',
      '255.0.0.0': '/8'
    };
    return map[mask] || '/24';
  };

  const executeCommand = (rawCmd: string, baseHistory = history) => {
    const cmd = rawCmd.trim();
    const lower = cmd.toLowerCase();
    const promptStr = getPrompt();
    const newLines: string[] = [`${promptStr}${cmd}`];

    if (!cmd) {
      setHistory([...baseHistory, promptStr]);
      return;
    }

    setCmdHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);

    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      return;
    }

    // 1. أوامر الانتقال بين أطوار Cisco IOS
    if (lower === 'enable' || lower === 'en') {
      setCliMode('priv');
      setHistory([...baseHistory, ...newLines]);
      return;
    }
    if (lower === 'disable') {
      setCliMode('user');
      setHistory([...baseHistory, ...newLines]);
      return;
    }
    if (lower === 'conf t' || lower === 'configure terminal') {
      setCliMode('config');
      newLines.push('Enter configuration commands, one per line. End with CNTL/Z.');
      setHistory([...baseHistory, ...newLines]);
      return;
    }
    if (lower === 'end') {
      setCliMode('priv');
      newLines.push(`%SYS-5-CONFIG_I: Configured from console by console`);
      setHistory([...baseHistory, ...newLines]);
      return;
    }
    if (lower === 'exit') {
      if (cliMode === 'config-if' || cliMode === 'config-router') setCliMode('config');
      else if (cliMode === 'config') setCliMode('priv');
      else if (cliMode === 'priv') setCliMode('user');
      setHistory([...baseHistory, ...newLines]);
      return;
    }

    // 2. تغيير اسم الجهاز الحقيقي في الـ Prompt
    if (cliMode === 'config' && lower.startsWith('hostname ')) {
      const newHost = cmd.split(/\s+/)[1];
      if (newHost) {
        setHostname(newHost);
        onCliSyslog?.(`%SYS-5-HOSTNAME: Hostname changed to ${newHost}`);
      }
      setHistory([...baseHistory, ...newLines]);
      return;
    }

    // 3. الدخول إلى منفذ (interface gig0/0 إلخ)
    if ((cliMode === 'config' || cliMode === 'config-if') && (lower.startsWith('interface ') || lower.startsWith('int '))) {
      setCliMode('config-if');
      const intName = cmd.split(/\s+/).slice(1).join(' ');
      const foundIdx = (deviceData.interfaces || []).findIndex((i: any) =>
        i.name.toLowerCase().includes(intName.toLowerCase().substring(0, 4))
      );
      setActiveInterfaceIdx(foundIdx >= 0 ? foundIdx : 0);
      setHistory([...baseHistory, ...newLines]);
      return;
    }

    // 4. الدخول إلى طور التوجيه (router ospf / router bgp)
    if (cliMode === 'config' && lower.startsWith('router ')) {
      setCliMode('config-router');
      setHistory([...baseHistory, ...newLines]);
      return;
    }

    // 5. تعديل الـ IP الفعلي للجهاز من داخل الـ CLI!
    if (cliMode === 'config-if' && lower.startsWith('ip address ')) {
      const parts = cmd.split(/\s+/);
      const ipPart = parts[2];
      const maskPart = parts[3] || '255.255.255.0';
      if (ipPart) {
        const cidr = ipPart.includes('/') ? '' : subnetMaskToCidr(maskPart);
        const formattedIp = `${ipPart}${cidr}`;
        onUpdateIp?.(deviceName, activeInterfaceIdx, formattedIp);
        const ifName = deviceData.interfaces?.[activeInterfaceIdx]?.name || 'GigabitEthernet0/0';
        newLines.push(`%LINEPROTO-5-IPCHANGE: Interface ${ifName} assigned IPv4${formattedIp}`);
        onCliSyslog?.(`${deviceName}: Interface ${ifName} reconfigured to${formattedIp}`);
      } else {
        newLines.push('% Incomplete command. Usage: ip address <ip> <subnet-mask>');
      }
      setHistory([...baseHistory, ...newLines]);
      return;
    }

    // 6. أوامر shutdown / no shutdown لتشغيل وإطفاء الجهاز فعلياً على اللوحة
    if (cliMode === 'config-if' && (lower === 'shutdown' || lower === 'shut')) {
      if (deviceData.status === 'Online') onTogglePower?.(deviceName);
      newLines.push(`%LINK-5-CHANGED: Interface GigabitEthernet0/${activeInterfaceIdx}, changed state to administratively down`);
      newLines.push(`%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/${activeInterfaceIdx}, changed state to down`);
      onCliSyslog?.(`%LINK-5-CHANGED: ${deviceName} interface administratively down`);
      setHistory([...baseHistory, ...newLines]);
      return;
    }

    if (cliMode === 'config-if' && (lower === 'no shutdown' || lower === 'no shut')) {
      if (deviceData.status !== 'Online') onTogglePower?.(deviceName);
      newLines.push(`%LINK-3-UPDOWN: Interface GigabitEthernet0/${activeInterfaceIdx}, changed state to up`);
      newLines.push(`%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/${activeInterfaceIdx}, changed state to up`);
      onCliSyslog?.(`%LINK-3-UPDOWN: ${deviceName} interface changed state to UP`);
      setHistory([...baseHistory, ...newLines]);
      return;
    }

    // 7. أوامر الفحص الواقعية (Show Commands)
    if (lower === 'help' || lower === '?') {
      newLines.push(
        `Supported Cisco IOS & Network Diagnostic Commands:`,
        `  enable / conf t / interface gig0/0   - Enter privileged & configuration modes`,
        `  ip address <ip> <mask>               - Live-update interface IP on canvas`,
        `  shutdown / no shutdown               - Toggle physical interface state on canvas`,
        `  show ip interface brief (sh ip int b)- Display Layer-3 interface status table`,
        `  show ip route (sh ip ro)             - Display IPv4 Routing Information Base (RIB)`,
        `  show ip ospf neighbor                - Inspect OSPF Area 0 neighbor adjacencies`,
        `  show ip bgp summary                  - Display inter-AS BGP-4 peering table`,
        `  show mac address-table               - Display Layer-2 switch CAM forwarding table`,
        `  show vlan brief                      - Display IEEE 802.1Q VLAN segmentation`,
        `  show running-config (sh run)         - Dump active NVRAM configuration`,
        `  ping <target-ip>                     - Send 5 ICMP Echo Request probes`,
        `  traceroute <target-ip>               - Trace hop-by-hop L3 path with RTT`,
        `  write memory (wr)                    - Save running-config to NVRAM`
      );
    } else if (lower.includes('sh ip int') || lower.includes('show ip interface') || lower === 'ifconfig' || lower === 'ip a') {
      newLines.push(`Interface              IP-Address      OK? Method Status                Protocol`);
      (deviceData.interfaces || []).forEach((intf: any, idx: number) => {
        const cleanIp = (intf.ip || 'unassigned').split('/')[0].padEnd(15, ' ');
        const ifName = (intf.name || `GigabitEthernet0/${idx}`).padEnd(22, ' ');
        const st = deviceData.status === 'Online' ? 'up                    up' : 'administratively down down';
        newLines.push(`${ifName} ${cleanIp} YES NVRAM${st}`);
      });
    } else if (lower.includes('sh ip ro') || lower.includes('show ip route') || lower === 'netstat -rn') {
      newLines.push(
        `Codes: L - local, C - connected, S - static, R - RIP, O - OSPF, B - BGP`,
        `       * - candidate default, IA - OSPF inter area, E2 - OSPF external`,
        `Gateway of last resort is 203.0.113.1 to network 0.0.0.0`,
        ``
      );
      Object.entries(allDevices).forEach(([name, dev]: [string, any]) => {
        const ip = dev.interfaces?.[0]?.ip;
        if (ip && ip.includes('.')) {
          const prefix = ip.split('.').slice(0, 3).join('.') + '.0/24';
          if (name === deviceName) {
            newLines.push(`C        ${prefix} is directly connected, GigabitEthernet0/0`);
            newLines.push(`L        ${ip.split('/')[0]}/32 is directly connected, GigabitEthernet0/0`);
          } else if (name.includes('AS') || name.includes('ISP') || name.includes('Tokyo') || name.includes('Frankfurt')) {
            newLines.push(`B        ${prefix} [20/0] via 185.10.1.2, 04:12:19`);
          } else {
            newLines.push(`O        ${prefix} [110/2] via 10.0.0.2, 01:45:10, GigabitEthernet0/1`);
          }
        }
      });
      newLines.push(`B*       0.0.0.0/0 [20/0] via 203.0.113.1, 12:08:44`);
    } else if (lower.includes('ospf neighbor')) {
      newLines.push(
        `Neighbor ID     Pri   State           Dead Time   Address         Interface`,
        `1.1.1.1         255   FULL/DR         00:00:37    192.168.1.1     GigabitEthernet0/0`,
        `2.2.2.2           1   FULL/BDR        00:00:34    10.0.0.2        GigabitEthernet0/1`,
        `4.4.4.4           1   FULL/DROTHER    00:00:39    10.10.1.4       TenGigabitEthernet0/1`
      );
    } else if (lower.includes('bgp')) {
      newLines.push(
        `BGP router identifier 91.106.0.1, local AS number 65001`,
        `BGP table version is 84, main routing table version 84`,
        `Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd`,
        `185.10.1.2      4        65002    2840    2812       84    0    0 08:22:14        14200`,
        `198.51.100.1    4        65003    1920    1905       84    0    0 05:14:02         9850`,
        `203.0.113.9     4        65004    3110    3098       84    0    0 11:04:55        18430`
      );
    } else if (lower.includes('mac address-table') || lower.includes('mac-address-table')) {
      newLines.push(
        `          Mac Address Table`,
        `-------------------------------------------`,
        `Vlan    Mac Address       Type        Ports`,
        `----    -----------       --------    -----`
      );
      Object.entries(allDevices).forEach(([name], idx) => {
        const hex = (idx + 10).toString(16).padStart(2, '0');
        newLines.push(`  10    0050.7966.68${hex}    DYNAMIC     Gi0/${idx + 1} (${name})`);
      });
    } else if (lower.includes('vlan')) {
      newLines.push(
        `VLAN Name                             Status    Ports`,
        `---- -------------------------------- --------- -------------------------------`,
        `1    default                          active    Gi0/4`,
        `10   Engineering_LAN                  active    Gi0/1, Gi0/2`,
        `20   Enterprise_HR                    active    Gi0/3`,
        `99   Native_Management                active    Gi0/1, Gi0/2`,
        `100  Core_Server_Farm                 active    TenGig0/1`
      );
    } else if (lower.includes('sh run') || lower.includes('show running-config')) {
      newLines.push(
        `Building configuration...`,
        `Current configuration : 1842 bytes`,
        `!`,
        `version 17.9`,
        `service timestamps debug datetime msec`,
        `service timestamps log datetime msec`,
        `hostname ${hostname}`,
        `!`,
        `spanning-tree mode rapid-pvst`,
        `!`
      );
      (deviceData.interfaces || []).forEach((intf: any) => {
        newLines.push(
          `interface ${intf.name}`,
          ` ip address ${(intf.ip || '192.168.1.1/24').split('/')[0]} 255.255.255.0`,
          ` duplex full`,
          ` speed 1000`,
          ` ${deviceData.status === 'Online' ? 'no shutdown' : 'shutdown'}`,
          `!`
        );
      });
      newLines.push(
        `router ospf 1`,
        ` router-id 1.1.1.1`,
        ` network 0.0.0.0 255.255.255.255 area 0`,
        `!`,
        `end`
      );
    } else if (lower.startsWith('ping ')) {
      const targetIp = cmd.split(/\s+/)[1];
      const matchedEntry = Object.entries(allDevices).find(([_, dev]: [string, any]) =>
        (dev.interfaces || []).some((i: any) => (i.ip || '').split('/')[0] === targetIp)
      );
      const isTargetOnline = matchedEntry ? matchedEntry[1].status === 'Online' : targetIp === '8.8.8.8' || targetIp === '1.1.1.1';

      if (deviceData.status !== 'Online') {
        newLines.push(`% Interface down: ${deviceName} is currently Offline. Run "no shutdown" first.`);
      } else if (isTargetOnline) {
        newLines.push(
          `Type escape sequence to abort.`,
          `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
          `!!!!!`,
          `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`
        );
        onCliSyslog?.(`ICMP Echo Reply: ${deviceName} -> ${targetIp} (5/5 100% success, RTT=2ms)`);
      } else {
        newLines.push(
          `Type escape sequence to abort.`,
          `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`,
          `.....`,
          `Success rate is 0 percent (0/5) — Destination host unreachable`
        );
      }
    } else if (lower.startsWith('traceroute ') || lower.startsWith('tracert ')) {
      const targetIp = cmd.split(/\s+/)[1];
      newLines.push(
        `Type escape sequence to abort.`,
        `Tracing the route to ${targetIp} over a maximum of 30 hops:`,
        `  1 192.168.1.1 (Core-Gateway)      1 msec   1 msec   2 msec`,
        `  2 10.0.0.1 (Amman-IXP-AS65001)    4 msec   3 msec   4 msec`,
        `  3 185.10.1.2 (Frankfurt-AS65002) 18 msec  19 msec  18 msec`,
        `  4 ${targetIp}                    22 msec  21 msec  22 msec`
      );
    } else if (lower === 'wr' || lower === 'write memory' || lower === 'copy run start') {
      newLines.push(`Building configuration...`, `[OK] — NVRAM configuration saved successfully.`);
      onCliSyslog?.(`%SYS-5-CONFIG_NV: Configuration saved to NVRAM on ${hostname}`);
    } else {
      newLines.push(`% Command accepted in ${cliMode.toUpperCase()} mode: "${cmd}"`);
    }

    setHistory([...baseHistory, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#050811] border-2 border-purple-500/40 rounded-2xl max-w-4xl w-full h-[560px] flex flex-col shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-[#0B1124] border-b border-purple-500/30 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span onClick={onClose} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xs font-mono font-bold text-white ml-2">
              SSH Console — {hostname} ({deviceData.type})
            </span>
            <span className="text-[10px] font-mono bg-purple-500/20 text-amber-300 border border-purple-500/30 px-2 py-0.5 rounded">
              Mode: {cliMode.toUpperCase()}
            </span>
          </div>

          {/* أزرار مختصرة للأوامر الهندسية الشهيرة */}
          <div className="flex items-center gap-1.5">
            {['sh ip int br', 'sh ip route', 'sh ip ospf neighbor', 'sh run'].map((quickCmd) => (
              <button
                key={quickCmd}
                onClick={() => executeCommand(quickCmd)}
                className="text-[10px] font-mono bg-slate-900 hover:bg-purple-900/50 text-slate-300 hover:text-amber-300 border border-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
              >
                {quickCmd}
              </button>
            ))}
            <button onClick={onClose} className="text-slate-400 hover:text-white text-sm ml-2 px-2 cursor-pointer">✕</button>
          </div>
        </div>

        {/* Terminal Output Body */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-1.5 text-emerald-400 bg-black/95">
          {history.map((line, idx) => (
            <pre key={idx} className={`whitespace-pre-wrap leading-relaxed ${
              line.includes('%') ? 'text-amber-300' : line.startsWith(hostname) || line.startsWith('root@') ? 'text-white font-bold' : 'text-emerald-400'
            }`}>
              {line}
            </pre>
          ))}

          {/* Input Line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeCommand(input);
              setInput('');
            }}
            className="flex items-center pt-2"
          >
            <span className="text-amber-400 font-bold mr-2 select-none">{getPrompt()}</span>
            <input
              type="text"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type IOS command (e.g., conf t, int gig0/0, ip address 192.168.1.50 255.255.255.0, ping ...)"
              className="flex-1 bg-transparent text-white focus:outline-none font-mono"
            />
          </form>
          <div ref={bottomRef} />
        </div>

        {/* Terminal Footer Tip */}
        <div className="bg-[#0B1124] border-t border-purple-500/20 px-5 py-2 flex justify-between items-center text-[11px] font-mono text-slate-400">
          <span>💡 Real-Time Sync: Changing IP or running <b className="text-amber-300">shutdown / no shutdown</b> updates the topology live!</span>
          <span>Use ↑ / ↓ arrows for history</span>
        </div>

      </div>
    </div>
  );
}

export default TerminalModal;