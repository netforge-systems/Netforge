import DeviceProperties from './DeviceProperties';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TerminalModal from './TerminalModal';

// 1. مكتبة القوالب الجاهزة: تشمل الأشكال البسيطة + المعماريات العالمية المعقدة
const topologyPresets: Record<string, {
  title: string;
  category: 'Simple' | 'Global & Complex' | 'Custom';
  description: string;
  devices: Record<string, any>;
  connections: { id: number; from: string; to: string; linkType?: 'copper' | 'fiber' | 'wan' }[];
}> = {
  'enterprise-lan': {
    title: 'Standard Enterprise LAN',
    category: 'Simple',
    description: 'Perimeter Firewall, Core Router, Layer-2 Switch, and dual workstations with a Web Server.',
    devices: {
      'Internet': { type: 'Cloud Network', status: 'Online', x: 480, y: 45, icon: '🌐', shape: 'rounded-lg border-slate-500', interfaces: [{ name: 'WAN', ip: '203.0.113.2/30' }], actions: ['Check Latency'] },
      'Firewall': { type: 'Security Appliance', status: 'Online', x: 480, y: 150, icon: '🧱', shape: 'rounded-lg border-rose-500', interfaces: [{ name: 'eth0 (LAN)', ip: '192.168.1.254/24' }, { name: 'eth1 (WAN)', ip: '203.0.113.1/30' }], actions: ['View Firewall Rules', 'Toggle Power'] },
      'Router-01': { type: 'Router', status: 'Online', x: 480, y: 260, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Gig0/0', ip: '192.168.1.1/24' }, { name: 'Gig0/1', ip: '10.0.0.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Switch-01': { type: 'Layer 2 Switch', status: 'Online', x: 480, y: 370, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 1', ip: '192.168.1.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'PC-01': { type: 'Workstation', status: 'Online', x: 300, y: 475, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.1.10/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'PC-02': { type: 'Workstation', status: 'Online', x: 480, y: 475, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.1.11/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Server-01': { type: 'Web Server', status: 'Online', x: 660, y: 475, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '192.168.1.100/24' }], actions: ['Server Manager', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Internet', to: 'Firewall', linkType: 'wan' },
      { id: 2, from: 'Firewall', to: 'Router-01', linkType: 'fiber' },
      { id: 3, from: 'Router-01', to: 'Switch-01', linkType: 'copper' },
      { id: 4, from: 'Switch-01', to: 'PC-01', linkType: 'copper' },
      { id: 5, from: 'Switch-01', to: 'PC-02', linkType: 'copper' },
      { id: 6, from: 'Switch-01', to: 'Server-01', linkType: 'fiber' }
    ]
  },

  'star-topology': {
    title: 'Star Topology (Centralized L2 Hub/Switch)',
    category: 'Simple',
    description: 'Classic Star layout where 6 end-devices radiate from a central Layer-2 Switch.',
    devices: {
      'Center-SW': { type: 'Layer 2 Switch', status: 'Online', x: 480, y: 260, icon: '🔀', shape: 'rounded-lg border-cyan-400', interfaces: [{ name: 'VLAN 1', ip: '192.168.10.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'PC-North': { type: 'Workstation', status: 'Online', x: 480, y: 80, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.10.11/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'PC-South': { type: 'Workstation', status: 'Online', x: 480, y: 450, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.10.12/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'PC-East1': { type: 'Workstation', status: 'Online', x: 700, y: 165, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.10.13/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'PC-East2': { type: 'Workstation', status: 'Online', x: 700, y: 365, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.10.14/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'PC-West1': { type: 'Workstation', status: 'Online', x: 260, y: 165, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.10.15/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Server-West': { type: 'Web Server', status: 'Online', x: 260, y: 365, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '192.168.10.100/24' }], actions: ['Server Manager', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Center-SW', to: 'PC-North', linkType: 'copper' },
      { id: 2, from: 'Center-SW', to: 'PC-South', linkType: 'copper' },
      { id: 3, from: 'Center-SW', to: 'PC-East1', linkType: 'copper' },
      { id: 4, from: 'Center-SW', to: 'PC-East2', linkType: 'copper' },
      { id: 5, from: 'Center-SW', to: 'PC-West1', linkType: 'copper' },
      { id: 6, from: 'Center-SW', to: 'Server-West', linkType: 'fiber' }
    ]
  },

  'ring-topology': {
    title: 'Ring Topology (Metro Fiber SONET/RSTP Ring)',
    category: 'Simple',
    description: 'Closed-loop 6-node fiber ring providing bidirectional redundancy across city metro nodes.',
    devices: {
      'Node-RTR1': { type: 'Core Router', status: 'Online', x: 480, y: 70, icon: '🔄', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/0', ip: '10.10.1.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-RTR2': { type: 'Core Router', status: 'Online', x: 690, y: 170, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/0', ip: '10.10.1.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-RTR3': { type: 'Core Router', status: 'Online', x: 690, y: 370, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/0', ip: '10.10.1.3/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-RTR4': { type: 'Core Router', status: 'Online', x: 480, y: 470, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/0', ip: '10.10.1.4/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-RTR5': { type: 'Core Router', status: 'Online', x: 270, y: 370, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/0', ip: '10.10.1.5/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-RTR6': { type: 'Core Router', status: 'Online', x: 270, y: 170, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/0', ip: '10.10.1.6/30' }], actions: ['Configure Router', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Node-RTR1', to: 'Node-RTR2', linkType: 'fiber' },
      { id: 2, from: 'Node-RTR2', to: 'Node-RTR3', linkType: 'fiber' },
      { id: 3, from: 'Node-RTR3', to: 'Node-RTR4', linkType: 'fiber' },
      { id: 4, from: 'Node-RTR4', to: 'Node-RTR5', linkType: 'fiber' },
      { id: 5, from: 'Node-RTR5', to: 'Node-RTR6', linkType: 'fiber' },
      { id: 6, from: 'Node-RTR6', to: 'Node-RTR1', linkType: 'fiber' }
    ]
  },

  'full-mesh': {
    title: 'Full Mesh Core Topology (N(N-1)/2 = 10 Links)',
    category: 'Simple',
    description: '5 Core Routers interconnected in a complete Full Mesh for zero single-point-of-failure OSPF/iBGP routing.',
    devices: {
      'Core-R1': { type: 'Core Router', status: 'Online', x: 480, y: 65, icon: '🔄', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Loopback0', ip: '1.1.1.1/32' }], actions: ['Configure Router', 'Toggle Power'] },
      'Core-R2': { type: 'Core Router', status: 'Online', x: 720, y: 210, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Loopback0', ip: '2.2.2.2/32' }], actions: ['Configure Router', 'Toggle Power'] },
      'Core-R3': { type: 'Core Router', status: 'Online', x: 630, y: 450, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Loopback0', ip: '3.3.3.3/32' }], actions: ['Configure Router', 'Toggle Power'] },
      'Core-R4': { type: 'Core Router', status: 'Online', x: 330, y: 450, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Loopback0', ip: '4.4.4.4/32' }], actions: ['Configure Router', 'Toggle Power'] },
      'Core-R5': { type: 'Core Router', status: 'Online', x: 240, y: 210, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Loopback0', ip: '5.5.5.5/32' }], actions: ['Configure Router', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Core-R1', to: 'Core-R2', linkType: 'fiber' },
      { id: 2, from: 'Core-R1', to: 'Core-R3', linkType: 'fiber' },
      { id: 3, from: 'Core-R1', to: 'Core-R4', linkType: 'fiber' },
      { id: 4, from: 'Core-R1', to: 'Core-R5', linkType: 'fiber' },
      { id: 5, from: 'Core-R2', to: 'Core-R3', linkType: 'fiber' },
      { id: 6, from: 'Core-R2', to: 'Core-R4', linkType: 'fiber' },
      { id: 7, from: 'Core-R2', to: 'Core-R5', linkType: 'fiber' },
      { id: 8, from: 'Core-R3', to: 'Core-R4', linkType: 'fiber' },
      { id: 9, from: 'Core-R3', to: 'Core-R5', linkType: 'fiber' },
      { id: 10, from: 'Core-R4', to: 'Core-R5', linkType: 'fiber' }
    ]
  },

  'global-bgp': {
    title: '🌍 Global Multi-AS Internet Backbone (Intercontinental eBGP)',
    category: 'Global & Complex',
    description: 'Complex global submarine WAN interconnecting 4 Autonomous Systems: Amman IXP (AS65001), Frankfurt EU (AS65002), US-East (AS65003), and Tokyo APAC (AS65004).',
    devices: {
      'Amman-IXP-AS65001': { type: 'BGP Border Router', status: 'Online', x: 480, y: 240, icon: '🌐', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/0', ip: '185.10.1.1/30' }, { name: 'BGP-Loopback', ip: '91.106.0.1/32' }], actions: ['Configure Router', 'Toggle Power'] },
      'Frankfurt-AS65002': { type: 'Tier-1 ISP Core', status: 'Online', x: 240, y: 110, icon: '🔄', shape: 'rounded-full border-purple-500', interfaces: [{ name: 'Submarine-0/1', ip: '185.10.1.2/30' }, { name: 'EU-IXP', ip: '80.81.192.1/24' }], actions: ['Configure Router', 'Toggle Power'] },
      'US-East-AS65003': { type: 'Tier-1 ISP Core', status: 'Online', x: 180, y: 360, icon: '🔄', shape: 'rounded-full border-purple-500', interfaces: [{ name: 'TransAtlantic-0', ip: '198.51.100.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Tokyo-APAC-AS65004': { type: 'Tier-1 ISP Core', status: 'Online', x: 760, y: 140, icon: '🔄', shape: 'rounded-full border-purple-500', interfaces: [{ name: 'TransPacific-0', ip: '203.0.113.9/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Amman-Core-SW': { type: 'L3 Core Switch', status: 'Online', x: 480, y: 390, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 100', ip: '172.16.0.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Cloud-DNS-1.1.1.1': { type: 'Anycast Root DNS', status: 'Online', x: 760, y: 370, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'Anycast0', ip: '1.1.1.1/32' }], actions: ['Server Manager', 'Toggle Power'] },
      'Enterprise-HQ-PC': { type: 'Workstation', status: 'Online', x: 350, y: 495, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '172.16.0.10/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Regional-DataCenter': { type: 'Web Server', status: 'Online', x: 610, y: 495, icon: '🗄️', shape: 'rounded-sm border-emerald-400', interfaces: [{ name: 'eth0', ip: '172.16.0.200/24' }], actions: ['Server Manager', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Amman-IXP-AS65001', to: 'Frankfurt-AS65002', linkType: 'wan' },
      { id: 2, from: 'Frankfurt-AS65002', to: 'US-East-AS65003', linkType: 'wan' },
      { id: 3, from: 'Amman-IXP-AS65001', to: 'Tokyo-APAC-AS65004', linkType: 'wan' },
      { id: 4, from: 'Frankfurt-AS65002', to: 'Tokyo-APAC-AS65004', linkType: 'wan' },
      { id: 5, from: 'US-East-AS65003', to: 'Amman-IXP-AS65001', linkType: 'wan' },
      { id: 6, from: 'Tokyo-APAC-AS65004', to: 'Cloud-DNS-1.1.1.1', linkType: 'fiber' },
      { id: 7, from: 'Amman-IXP-AS65001', to: 'Amman-Core-SW', linkType: 'fiber' },
      { id: 8, from: 'Amman-Core-SW', to: 'Enterprise-HQ-PC', linkType: 'copper' },
      { id: 9, from: 'Amman-Core-SW', to: 'Regional-DataCenter', linkType: 'fiber' }
    ]
  },

  'campus-3tier': {
    title: '🏢 3-Tier Hierarchical Campus (Core / Dist / Access)',
    category: 'Global & Complex',
    description: 'Redundant enterprise architecture with Dual Core Routers, cross-connected L3 Distribution Switches, and Access VLAN switches.',
    devices: {
      'Core-RTR-A': { type: 'Core Router', status: 'Online', x: 360, y: 70, icon: '🔄', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/0', ip: '10.0.0.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Core-RTR-B': { type: 'Core Router', status: 'Online', x: 600, y: 70, icon: '🔄', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/0', ip: '10.0.0.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Dist-L3-SW1': { type: 'L3 Distribution Switch', status: 'Online', x: 320, y: 225, icon: '🔀', shape: 'rounded-lg border-blue-500', interfaces: [{ name: 'SVI VLAN 10', ip: '192.168.10.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Dist-L3-SW2': { type: 'L3 Distribution Switch', status: 'Online', x: 640, y: 225, icon: '🔀', shape: 'rounded-lg border-blue-500', interfaces: [{ name: 'SVI VLAN 20', ip: '192.168.20.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Access-SW-Eng': { type: 'Access Switch', status: 'Online', x: 240, y: 375, icon: '🔀', shape: 'rounded-sm border-slate-500', interfaces: [{ name: 'VLAN 10', ip: '192.168.10.5/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Access-SW-HR': { type: 'Access Switch', status: 'Online', x: 720, y: 375, icon: '🔀', shape: 'rounded-sm border-slate-500', interfaces: [{ name: 'VLAN 20', ip: '192.168.20.5/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Eng-PC-01': { type: 'Workstation', status: 'Online', x: 180, y: 495, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.10.50/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Cluster-Srv-01': { type: 'Web Server', status: 'Online', x: 480, y: 495, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '192.168.10.100/24' }], actions: ['Server Manager', 'Toggle Power'] },
      'HR-PC-01': { type: 'Workstation', status: 'Online', x: 780, y: 495, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.20.50/24' }], actions: ['Command Prompt', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Core-RTR-A', to: 'Core-RTR-B', linkType: 'fiber' },
      { id: 2, from: 'Core-RTR-A', to: 'Dist-L3-SW1', linkType: 'fiber' },
      { id: 3, from: 'Core-RTR-A', to: 'Dist-L3-SW2', linkType: 'fiber' },
      { id: 4, from: 'Core-RTR-B', to: 'Dist-L3-SW1', linkType: 'fiber' },
      { id: 5, from: 'Core-RTR-B', to: 'Dist-L3-SW2', linkType: 'fiber' },
      { id: 6, from: 'Dist-L3-SW1', to: 'Dist-L3-SW2', linkType: 'fiber' },
      { id: 7, from: 'Dist-L3-SW1', to: 'Access-SW-Eng', linkType: 'copper' },
      { id: 8, from: 'Dist-L3-SW2', to: 'Access-SW-Eng', linkType: 'copper' },
      { id: 9, from: 'Dist-L3-SW2', to: 'Access-SW-HR', linkType: 'copper' },
      { id: 10, from: 'Dist-L3-SW1', to: 'Access-SW-HR', linkType: 'copper' },
      { id: 11, from: 'Access-SW-Eng', to: 'Eng-PC-01', linkType: 'copper' },
      { id: 12, from: 'Dist-L3-SW1', to: 'Cluster-Srv-01', linkType: 'fiber' },
      { id: 13, from: 'Access-SW-HR', to: 'HR-PC-01', linkType: 'copper' }
    ]
  },

    'spine-leaf': {
    title: '⚡ Data Center Spine-Leaf (Clos Fabric Architecture)',
    category: 'Global & Complex',
    description: 'High-speed Data Center fabric where 3 Spine L3 switches connect in a full bipartite mesh to 4 Top-of-Rack Leaf switches.',
    devices: {
      'Spine-01': { type: 'Spine L3 Switch', status: 'Online', x: 260, y: 85, icon: '🔄', shape: 'rounded-lg border-cyan-400', interfaces: [{ name: '100G-Fabric', ip: '10.100.1.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Spine-02': { type: 'Spine L3 Switch', status: 'Online', x: 480, y: 85, icon: '🔄', shape: 'rounded-lg border-cyan-400', interfaces: [{ name: '100G-Fabric', ip: '10.100.1.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Spine-03': { type: 'Spine L3 Switch', status: 'Online', x: 700, y: 85, icon: '🔄', shape: 'rounded-lg border-cyan-400', interfaces: [{ name: '100G-Fabric', ip: '10.100.1.3/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Leaf-ToR1': { type: 'Leaf Switch', status: 'Online', x: 180, y: 290, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VTEP-1', ip: '172.20.1.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Leaf-ToR2': { type: 'Leaf Switch', status: 'Online', x: 380, y: 290, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VTEP-2', ip: '172.20.2.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Leaf-ToR3': { type: 'Leaf Switch', status: 'Online', x: 580, y: 290, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VTEP-3', ip: '172.20.3.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Leaf-ToR4': { type: 'Leaf Switch', status: 'Online', x: 780, y: 290, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VTEP-4', ip: '172.20.4.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Rack-Srv-A': { type: 'Blade Server', status: 'Online', x: 180, y: 465, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '172.20.1.10/24' }], actions: ['Server Manager', 'Toggle Power'] },
      'Rack-Srv-B': { type: 'Blade Server', status: 'Online', x: 380, y: 465, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '172.20.2.10/24' }], actions: ['Server Manager', 'Toggle Power'] },
      'Rack-Srv-C': { type: 'Blade Server', status: 'Online', x: 580, y: 465, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '172.20.3.10/24' }], actions: ['Server Manager', 'Toggle Power'] },
      'Rack-Srv-D': { type: 'Blade Server', status: 'Online', x: 780, y: 465, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '172.20.4.10/24' }], actions: ['Server Manager', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Spine-01', to: 'Leaf-ToR1', linkType: 'fiber' },
      { id: 2, from: 'Spine-01', to: 'Leaf-ToR2', linkType: 'fiber' },
      { id: 3, from: 'Spine-01', to: 'Leaf-ToR3', linkType: 'fiber' },
      { id: 4, from: 'Spine-01', to: 'Leaf-ToR4', linkType: 'fiber' },
      { id: 5, from: 'Spine-02', to: 'Leaf-ToR1', linkType: 'fiber' },
      { id: 6, from: 'Spine-02', to: 'Leaf-ToR2', linkType: 'fiber' },
      { id: 7, from: 'Spine-02', to: 'Leaf-ToR3', linkType: 'fiber' },
      { id: 8, from: 'Spine-02', to: 'Leaf-ToR4', linkType: 'fiber' },
      { id: 9, from: 'Spine-03', to: 'Leaf-ToR1', linkType: 'fiber' },
      { id: 10, from: 'Spine-03', to: 'Leaf-ToR2', linkType: 'fiber' },
      { id: 11, from: 'Spine-03', to: 'Leaf-ToR3', linkType: 'fiber' },
      { id: 12, from: 'Spine-03', to: 'Leaf-ToR4', linkType: 'fiber' },
      { id: 13, from: 'Leaf-ToR1', to: 'Rack-Srv-A', linkType: 'copper' },
      { id: 14, from: 'Leaf-ToR2', to: 'Rack-Srv-B', linkType: 'copper' },
      { id: 15, from: 'Leaf-ToR3', to: 'Rack-Srv-C', linkType: 'copper' },
      { id: 16, from: 'Leaf-ToR4', to: 'Rack-Srv-D', linkType: 'copper' }
    ]
  },

  'blank-canvas': {
    title: '✨ Blank Canvas (Build Custom Network from Scratch)',
    category: 'Custom',
    description: 'Empty workspace — add any routers, switches, clouds, and cables from the left panel to design your own topology.',
    devices: {},
    connections: []
  }
};

function NetworkLab() {
  const [activePresetKey, setActivePresetKey] = useState<string>('enterprise-lan');

  const [devices, setDevices] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('netforge_devices');
    return saved ? JSON.parse(saved) : topologyPresets['enterprise-lan'].devices;
  });

  const [connections, setConnections] = useState<any[]>(() => {
    const saved = localStorage.getItem('netforge_connections');
    return saved ? JSON.parse(saved) : topologyPresets['enterprise-lan'].connections;
  });

  const [selectedDevice, setSelectedDevice] = useState<string | null>('Router-01');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalAutoCmd, setTerminalAutoCmd] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [selectedCableType, setSelectedCableType] = useState<'copper' | 'fiber' | 'wan'>('copper');
  const [canvasZoom, setCanvasZoom] = useState<number>(1);

  // شريط Wireshark Live Packet Sniffer
  const [showPacketSniffer, setShowPacketSniffer] = useState<boolean>(true);
  const [livePackets, setLivePackets] = useState<any[]>([
    { id: 1, time: '00:00.104', src: '10.0.0.1', dst: '224.0.0.5', proto: 'OSPFv2', info: 'Hello Packet (Area 0, Router-ID 1.1.1.1, Pri=255)' },
    { id: 2, time: '00:00.412', src: '192.168.1.10', dst: '192.168.1.100', proto: 'TCP', info: '54322 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460' },
    { id: 3, time: '00:00.890', src: '185.10.1.1', dst: '185.10.1.2', proto: 'BGP-4', info: 'KEEPALIVE Message (AS65001 <-> AS65002)' }
  ]);

  // حالة تحدي الإصلاح الحي
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [challengeResult, setChallengeResult] = useState<{ status: 'success' | 'error' | null; msg: string }>({ status: null, msg: '' });

  const [activeTool, setActiveTool] = useState<string>('Select');
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [draggingDevice, setDraggingDevice] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentDeviceData = selectedDevice ? devices[selectedDevice] : null;

  // توليد حزم حية شبيهة بـ Wireshark عند تشغيل المحاكاة
  useEffect(() => {
    if (!isSimulating) return;
    const devKeys = Object.keys(devices).filter(k => devices[k].status === 'Online');
    if (devKeys.length < 2) return;

    const protos = [
      { proto: 'OSPFv2', dstOverride: '224.0.0.5', info: 'LS Update (Type-1 Router LSA, Area 0.0.0.0, Seq 0x80000014)' },
      { proto: 'ICMP', dstOverride: null, info: 'Echo (ping) request id=0x04a1, seq=12/3072, ttl=64 (reply in 1.8ms)' },
      { proto: 'TCP/TLS', dstOverride: null, info: 'Application Data [ACK] Seq=1461 Ack=420 Win=65535 Len=1400' },
      { proto: '802.1Q', dstOverride: 'FF:FF:FF:FF:FF:FF', info: 'Tagged Frame VLAN 10 (TPID=0x8100, CoS=5, Native=99)' },
      { proto: 'BGP-4', dstOverride: null, info: 'UPDATE Message (NLRI: 172.16.0.0/24, LocalPref=200, AS_PATH: 65001)' }
    ];

    const timer = setInterval(() => {
      const sDev = devices[devKeys[Math.floor(Math.random() * devKeys.length)]];
      const dDev = devices[devKeys[Math.floor(Math.random() * devKeys.length)]];
      const sample = protos[Math.floor(Math.random() * protos.length)];
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });

      setLivePackets(prev => [
        {
          id: Date.now(),
          time: now,
          src: (sDev?.interfaces?.[0]?.ip || '10.0.0.1').split('/')[0],
          dst: sample.dstOverride || (dDev?.interfaces?.[0]?.ip || '192.168.1.100').split('/')[0],
          proto: sample.proto,
          info: sample.info
        },
        ...prev.slice(0, 14)
      ]);
    }, 1400);

    return () => clearInterval(timer);
  }, [isSimulating, devices]);

  const handleLoadPreset = (presetKey: string) => {
    const preset = topologyPresets[presetKey];
    if (!preset) return;
    setActivePresetKey(presetKey);
    const clonedDevices = JSON.parse(JSON.stringify(preset.devices));
    const clonedConns = JSON.parse(JSON.stringify(preset.connections));
    setDevices(clonedDevices);
    setConnections(clonedConns);
    setConnectSource(null);
    setIsChallengeMode(false);
    const firstDev = Object.keys(clonedDevices)[0] || null;
    setSelectedDevice(firstDev);
  };

  const handleStartBrokenLabChallenge = () => {
    const base = topologyPresets['enterprise-lan'];
    const brokenDevices = JSON.parse(JSON.stringify(base.devices));
    brokenDevices['Switch-01'].status = 'Offline';
    brokenDevices['Server-01'].interfaces[0].ip = '192.168.99.100/24';
    
    const brokenConnections = base.connections.filter(
      c => !(c.from === 'Switch-01' && c.to === 'Server-01')
    );

    setDevices(brokenDevices);
    setConnections(brokenConnections);
    setIsChallengeMode(true);
    setChallengeResult({ status: null, msg: '' });
    setSelectedDevice('Server-01');
  };

  const handleVerifyLabChallenge = () => {
    const swOnline = devices['Switch-01']?.status === 'Online';
    const srvOnline = devices['Server-01']?.status === 'Online';
    const srvIp = devices['Server-01']?.interfaces?.[0]?.ip.trim();
    const isCorrectSubnet = srvIp === '192.168.1.100/24' || srvIp === '192.168.1.100';
    const isCableConnected = connections.some(
      c => (c.from === 'Switch-01' && c.to === 'Server-01') || (c.from === 'Server-01' && c.to === 'Switch-01')
    );

    if (!swOnline || !srvOnline) {
      setChallengeResult({ status: 'error', msg: '✗ Fault Remaining: Switch-01 or Server-01 is still Offline! Select it and click Power On.' });
    } else if (!isCableConnected) {
      setChallengeResult({ status: 'error', msg: '✗ Fault Remaining: Missing physical link between Switch-01 and Server-01! Use the Connect tool.' });
    } else if (!isCorrectSubnet) {
      setChallengeResult({ status: 'error', msg: `✗ Fault Remaining: Server-01 IP (${srvIp}) is in the wrong subnet! Change it to 192.168.1.100/24.` });
    } else {
      const currentXp = Number(localStorage.getItem('netforge_xp') || 4850);
      localStorage.setItem('netforge_xp', String(currentXp + 350));
      setChallengeResult({ status: 'success', msg: '🎉 Challenge Solved! All 3 network faults fixed (+350 XP added to your profile)!' });
      setIsSimulating(true);
    }
  };

  const handleSaveTopology = () => {
    localStorage.setItem('netforge_devices', JSON.stringify(devices));
    localStorage.setItem('netforge_connections', JSON.stringify(connections));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const updateDeviceIp = (deviceName: string, interfaceIndex: number, newIp: string) => {
    setDevices(prev => {
      if (!prev[deviceName]) return prev;
      const updatedInterfaces = [...prev[deviceName].interfaces];
      updatedInterfaces[interfaceIndex] = { ...updatedInterfaces[interfaceIndex], ip: newIp };
      return {
        ...prev,
        [deviceName]: {
          ...prev[deviceName],
          interfaces: updatedInterfaces
        }
      };
    });
  };

  const toggleDevicePower = (deviceName: string) => {
    setDevices(prev => {
      if (!prev[deviceName]) return prev;
      return {
        ...prev,
        [deviceName]: {
          ...prev[deviceName],
          status: prev[deviceName].status === 'Online' ? 'Offline' : 'Online'
        }
      };
    });
  };

  const handleAddDevice = (deviceType: string) => {
    const cleanPrefix = deviceType.replace(/\s+/g, '-');
    const count = Object.keys(devices).filter(k => k.startsWith(cleanPrefix)).length + 1;
    const newName = `${cleanPrefix}-0${count}`;
    
    const icons: Record<string, string> = {
      'Core Router': '🔄', 'Router': '🔄', 'BGP Border': '🌐',
      'L3 Switch': '🔀', 'Switch': '🔀', 'Firewall': '🧱',
      'Server': '🗄️', 'PC': '💻', 'Access Point': '📡', 'ISP Cloud': '☁️'
    };

    const shapes: Record<string, string> = {
      'Core Router': 'rounded-full border-cyan-400',
      'Router': 'rounded-full border-blue-500',
      'BGP Border': 'rounded-full border-purple-500',
      'L3 Switch': 'rounded-lg border-blue-400',
      'Switch': 'rounded-sm border-blue-500',
      'Firewall': 'rounded-lg border-rose-500',
      'Server': 'rounded-sm border-yellow-500',
      'PC': 'rounded border-slate-600',
      'Access Point': 'rounded-full border-emerald-400',
      'ISP Cloud': 'rounded-xl border-purple-400'
    };

    const randomOffset = (Object.keys(devices).length * 45) % 260;
    setDevices(prev => ({
      ...prev,
      [newName]: {
        type: deviceType,
        status: 'Online',
        x: 220 + randomOffset,
        y: 120 + (randomOffset % 180),
        icon: icons[deviceType] || '💻',
        shape: shapes[deviceType] || 'rounded border-slate-600',
        interfaces: [
          { name: 'Gig0/0', ip: `192.168.1.${20 + Object.keys(prev).length}/24` },
          ...(deviceType.includes('Router') || deviceType.includes('BGP') ? [{ name: 'TenGig0/1', ip: `10.0.${Object.keys(prev).length}.1/30` }] : [])
        ],
        actions: ['Configure Router', 'Toggle Power']
      }
    }));
    setSelectedDevice(newName);
    setActiveTool('Select');
  };

  const handleDeviceClick = (devName: string) => {
    if (activeTool === 'Delete') {
      setDevices(prev => {
        const updated = { ...prev };
        delete updated[devName];
        return updated;
      });
      setConnections(prev => prev.filter(c => c.from !== devName && c.to !== devName));
      if (selectedDevice === devName) setSelectedDevice(null);
    } 
    else if (activeTool === 'Connect') {
      if (!connectSource) {
        setConnectSource(devName);
      } else if (connectSource !== devName) {
        const exists = connections.some(
          c => (c.from === connectSource && c.to === devName) || (c.from === devName && c.to === connectSource)
        );
        if (!exists) {
          setConnections(prev => [
            ...prev,
            { id: Date.now(), from: connectSource, to: devName, linkType: selectedCableType }
          ]);
        }
        setConnectSource(null);
      } else {
        setConnectSource(null);
      }
    } 
    else {
      setSelectedDevice(devName);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingDevice || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(50, Math.min(910, (e.clientX - rect.left) / canvasZoom));
    const newY = Math.max(30, Math.min(520, (e.clientY - rect.top - 24) / canvasZoom));

    setDevices(prev => ({
      ...prev,
      [draggingDevice]: {
        ...prev[draggingDevice],
        x: Math.round(newX),
        y: Math.round(newY)
      }
    }));
  };

  const getLinkStyle = (linkType?: string, isOnline?: boolean) => {
    if (!isOnline) {
      return { stroke: '#ef4444', dash: '5,5', packetColor: '#ef4444' };
    }
    if (linkType === 'fiber') {
      return { stroke: '#f59e0b', dash: 'none', packetColor: '#fbbf24' };
    }
    if (linkType === 'wan') {
      return { stroke: '#a855f7', dash: '8,4', packetColor: '#c084fc' };
    }
    return { stroke: '#3b82f6', dash: 'none', packetColor: '#22d3ee' };
  };

  return (
    <div 
      className="h-screen bg-[#070B19] text-slate-300 font-sans flex flex-col overflow-hidden relative select-none"
      onMouseUp={() => setDraggingDevice(null)}
    >
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800/60 bg-slate-900/60 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span className="text-blue-500 text-xl font-bold tracking-wider">NETFORGE</span>
          <span className="text-slate-700">|</span>
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">← Dashboard</Link>
          
          <div className="flex items-center gap-2 ml-2 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1">
            <span className="text-[11px] font-mono text-cyan-400 font-bold">🌐 Topology Blueprint:</span>
            <select
              value={activePresetKey}
              onChange={(e) => handleLoadPreset(e.target.value)}
              className="bg-slate-950 text-white text-xs font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <optgroup label="Simple Topologies (Basic Shapes)">
                <option value="enterprise-lan">Standard Enterprise LAN</option>
                <option value="star-topology">Star Topology (Centralized Switch)</option>
                <option value="ring-topology">Ring Topology (Metro Fiber Ring)</option>
                <option value="full-mesh">Full Mesh Topology (5-Core Routers)</option>
              </optgroup>
              <optgroup label="Global & Complex Architectures">
                <option value="global-bgp">🌍 Global Multi-AS BGP Internet Backbone</option>
                <option value="campus-3tier">🏢 3-Tier Hierarchical Enterprise Campus</option>
                <option value="spine-leaf">⚡ Data Center Spine-Leaf (Clos Fabric)</option>
              </optgroup>
              <optgroup label="Custom">
                <option value="blank-canvas">✨ Blank Canvas (Build From Scratch)</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPacketSniffer(!showPacketSniffer)}
            className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md cursor-pointer"
          >
            {showPacketSniffer ? '🔽 Hide Sniffer' : '🔼 Wireshark Sniffer'}
          </button>

          <button 
            onClick={handleStartBrokenLabChallenge}
            className="text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-md transition-all cursor-pointer"
          >
            🎯 Troubleshoot Challenge
          </button>

          <button 
            onClick={handleSaveTopology}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
              saveSuccess 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {saveSuccess ? '✓ Saved!' : 'Save Network'}
          </button>

          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`${
              isSimulating 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            } text-white text-xs px-4 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer`}
          >
            {isSimulating ? '⏹ Stop Traffic' : '▶ Simulate Packets'}
          </button>
        </div>
      </header>

      {/* شريط التحدي العملي */}
      {isChallengeMode && (
        <div className="bg-slate-900/95 border-b border-amber-500/40 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 z-20">
          <div className="text-xs">
            <span className="font-bold text-amber-400 mr-3">🚨 Fix 3 Network Faults:</span>
            <span className="text-slate-300 font-mono text-[11px]">
              1. Power ON <b className="text-white">Switch-01</b> • 2. Connect <b className="text-cyan-400">Switch-01 ↔ Server-01</b> • 3. Set <b className="text-white">Server-01</b> IP to <b className="text-emerald-400">192.168.1.100/24</b>
            </span>
            {challengeResult.status && (
              <div className={`font-mono font-bold mt-1 ${challengeResult.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {challengeResult.msg}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyLabChallenge}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer"
            >
              ✓ Verify Fix (+350 XP)
            </button>
            <button onClick={() => setIsChallengeMode(false)} className="text-xs text-slate-400 hover:text-white px-2 cursor-pointer">✕</button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 bg-slate-900/40 border-r border-slate-800/60 flex flex-col overflow-y-auto shrink-0 z-10">
          <div className="p-4 space-y-5">
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Network Nodes</h3>
                <span className="text-[9px] text-cyan-400 font-mono">+ Click to spawn</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Core Router', 'BGP Border', 'L3 Switch', 'Switch',
                  'Firewall', 'ISP Cloud', 'Server', 'PC', 'Access Point'
                ].map((device) => (
                  <button 
                    key={device} 
                    onClick={() => handleAddDevice(device)}
                    className="flex items-center justify-between px-2.5 py-2 text-xs bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer group"
                  >
                    <span className="truncate">{device}</span>
                    <span className="text-slate-600 group-hover:text-cyan-400 font-bold">+</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-widest mb-2 uppercase">Cable / Link Media</h3>
              <div className="space-y-1.5">
                {[
                  { id: 'copper', label: 'Copper Gigabit (Cat6)', color: 'bg-blue-500' },
                  { id: 'fiber', label: '100G Fiber Optic (SMF)', color: 'bg-amber-400' },
                  { id: 'wan', label: 'Submarine / BGP WAN', color: 'bg-purple-500' }
                ].map((cable) => (
                  <button
                    key={cable.id}
                    onClick={() => {
                      setSelectedCableType(cable.id as any);
                      setActiveTool('Connect');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer border ${
                      selectedCableType === cable.id
                        ? 'bg-slate-800 text-white border-cyan-500/50 font-semibold'
                        : 'bg-slate-950/40 text-slate-400 border-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${cable.color}`}></span>
                    <span>{cable.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-widest mb-2 uppercase">Canvas Tools</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {['Select', 'Connect', 'Delete', 'Pan'].map((tool) => (
                  <button 
                    key={tool} 
                    onClick={() => {
                      setActiveTool(tool);
                      setConnectSource(null);
                    }}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors text-center cursor-pointer border ${
                      activeTool === tool 
                        ? tool === 'Delete' 
                          ? 'text-rose-400 bg-rose-500/15 border-rose-500/40 font-bold'
                          : 'text-cyan-300 bg-cyan-500/15 border-cyan-500/40 font-bold' 
                        : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => handleLoadPreset('blank-canvas')}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
              >
                ✨ Clear Canvas (Build Custom)
              </button>
            </div>

          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 relative bg-[#070B19] overflow-auto flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          
          <div className="absolute top-3 left-6 right-6 flex flex-wrap justify-between items-center pointer-events-none z-20">
            <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl backdrop-blur-md">
              <span className="text-xs font-bold text-white mr-2">{topologyPresets[activePresetKey]?.title}</span>
              <span className="text-[11px] text-slate-400 hidden xl:inline">{topologyPresets[activePresetKey]?.description}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl pointer-events-auto">
              <button onClick={() => setCanvasZoom(z => Math.max(0.75, +(z - 0.1).toFixed(2)))} className="px-2 text-slate-300 hover:text-white text-sm cursor-pointer">−</button>
              <span className="text-[11px] font-mono text-cyan-400 w-12 text-center">{Math.round(canvasZoom * 100)}%</span>
              <button onClick={() => setCanvasZoom(z => Math.min(1.3, +(z + 0.1).toFixed(2)))} className="px-2 text-slate-300 hover:text-white text-sm cursor-pointer">+</button>
            </div>
          </div>

          {activeTool === 'Connect' && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-blue-950/90 border border-blue-500/40 text-blue-300 px-4 py-1 rounded-full text-xs z-20">
              🔗 {connectSource ? `Connecting from "${connectSource}" (${selectedCableType.toUpperCase()}) — Click target node` : `Connect Mode (${selectedCableType.toUpperCase()}) — Click first node`}
            </div>
          )}

          <div 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            style={{ transform: `scale(${canvasZoom})`, transformOrigin: 'center center' }}
            className="relative w-[960px] h-[540px] shrink-0 mt-6 transition-transform duration-150"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {connections.map((conn) => {
                const fromDev = devices[conn.from];
                const toDev = devices[conn.to];
                if (!fromDev || !toDev) return null;

                const isOnline = fromDev.status === 'Online' && toDev.status === 'Online';
                const pathString = `M ${fromDev.x} ${fromDev.y + 24} L ${toDev.x} ${toDev.y + 24}`;
                const style = getLinkStyle(conn.linkType, isOnline);

                return (
                  <g key={conn.id}>
                    <path 
                      d={pathString} 
                      stroke={style.stroke} 
                      strokeWidth={conn.linkType === 'fiber' ? "2.5" : "2"} 
                      strokeDasharray={style.dash}
                      fill="none" 
                    />
                    {isSimulating && isOnline && (
                      <circle r="4.5" fill={style.packetColor}>
                        <animateMotion dur={conn.linkType === 'fiber' ? "0.9s" : "1.5s"} repeatCount="indefinite" path={pathString} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {Object.entries(devices).map(([devName, dev]) => {
              const isSelected = selectedDevice === devName;
              const isConnectFirst = connectSource === devName;

              return (
                <div 
                  key={devName} 
                  onMouseDown={() => {
                    if (activeTool === 'Select' || activeTool === 'Pan') {
                      setDraggingDevice(devName);
                    }
                  }}
                  onClick={() => handleDeviceClick(devName)} 
                  style={{ left: `${dev.x}px`, top: `${dev.y}px` }}
                  className={`absolute -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer z-10 ${
                    isSelected || isConnectFirst ? 'scale-110' : ''
                  } transition-transform`}
                >
                  <div className={`w-12 h-12 bg-slate-900 border-2 ${
                    isConnectFirst 
                      ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' 
                      : isSelected 
                        ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                        : dev.shape
                  } flex items-center justify-center text-lg`}>
                    {dev.icon}
                  </div>
                  <div className="text-[11px] font-bold text-white whitespace-nowrap bg-slate-950/80 px-1.5 py-0.2 rounded">
                    {devName}
                  </div>
                  <div className={`text-[9px] font-mono ${dev.status === 'Online' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ● {dev.interfaces?.[0]?.ip || dev.status}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-2 left-6 right-6 flex flex-wrap justify-between items-center text-xs text-slate-500 font-mono">
            <div>
              {Object.keys(devices).length} Nodes • {connections.length} Links • Tool: <span className="text-cyan-400">{activeTool}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block"></span> GigE Copper</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block"></span> 100G Fiber</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-500 inline-block"></span> Submarine / BGP WAN</span>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <DeviceProperties 
          selectedDevice={selectedDevice}
          currentDeviceData={currentDeviceData}
          onOpenTerminal={(autoCmd) => {
            setTerminalAutoCmd(autoCmd || null);
            setIsTerminalOpen(true);
          }}
          onTogglePower={toggleDevicePower}
          onUpdateIp={updateDeviceIp}
        />

      </div>

      {/* شريط Wireshark Live Packet Sniffer في أسفل المختبر */}
      {showPacketSniffer && (
        <div className="h-40 bg-[#050811] border-t-2 border-purple-500/30 flex flex-col shrink-0 z-20 font-mono text-xs">
          <div className="bg-[#0B1124] px-6 py-1.5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                🔬 Live Packet Sniffer (Wireshark Telemetry)
              </span>
              <span className="text-[10px] text-slate-400">
                {isSimulating ? 'Capturing live L2/L3 frames...' : 'Click "▶ Simulate Packets" for live capture'}
              </span>
            </div>
            <button onClick={() => setLivePackets([])} className="text-[10px] text-slate-400 hover:text-white cursor-pointer">
              Clear Capture
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-1.5 space-y-1">
            {livePackets.map((pkt) => (
              <div key={pkt.id} className="grid grid-cols-12 gap-2 py-1 border-b border-slate-900/80 text-[11px] items-center hover:bg-slate-900/50">
                <span className="col-span-1 text-slate-500">{pkt.time}</span>
                <span className="col-span-2 text-slate-200">{pkt.src}</span>
                <span className="col-span-2 text-cyan-300">{pkt.dst}</span>
                <span className="col-span-1">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-amber-300 border border-purple-500/30 text-[10px] font-bold">
                    {pkt.proto}
                  </span>
                </span>
                <span className="col-span-6 text-slate-300 truncate">{pkt.info}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <TerminalModal 
        isOpen={isTerminalOpen} 
        onClose={() => {
          setIsTerminalOpen(false);
          setTerminalAutoCmd(null);
        }} 
        deviceName={selectedDevice || 'Console'} 
        deviceData={currentDeviceData}
        allDevices={devices}
        initialCommand={terminalAutoCmd}
        onUpdateIp={updateDeviceIp}
        onTogglePower={toggleDevicePower}
        onCliSyslog={(msg) => setLivePackets(prev => [{ id: Date.now(), time: 'SYSLOG', src: selectedDevice, dst: 'CONSOLE', proto: 'IOS-LOG', info: msg }, ...prev])}
      />

    </div>
  );
}

export default NetworkLab;
