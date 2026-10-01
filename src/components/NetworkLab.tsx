import DeviceProperties from './DeviceProperties';
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TerminalModal from './TerminalModal';

// أنواع الكيبلات الهندسية المتاحة للتوصيل
const cableStyles: Record<string, { label: string; color: string; width: string; dash: string; speed: string }> = {
  ethernet: { label: 'Gigabit Ethernet (Cat6)', color: '#3b82f6', width: '2', dash: 'none', speed: '1.5s' },
  fiber: { label: '100G Fiber Optic (SMF)', color: '#06b6d4', width: '3', dash: 'none', speed: '0.7s' },
  serial: { label: 'Serial WAN / MPLS', color: '#a855f7', width: '2', dash: '6,4', speed: '1.8s' },
  submarine: { label: 'Submarine / IXP Backbone', color: '#10b981', width: '3.5', dash: 'none', speed: '0.5s' }
};

// 📚 مكتبة القوالب الجاهزة: البسيطة، المعقدة، والعالمية
const topologyPresets: Record<string, {
  title: string;
  category: 'Simple & Fundamental' | 'Enterprise & Data Center' | 'Global & Multi-Area WAN';
  badge: string;
  description: string;
  devices: Record<string, any>;
  connections: any[];
}> = {
  office: {
    title: 'Standard Enterprise LAN (Default)',
    category: 'Simple & Fundamental',
    badge: 'Star + WAN',
    description: 'Single-site enterprise network with perimeter firewall, core router, L2 switch, and end hosts.',
    devices: {
      'Internet': { type: 'Cloud Network', status: 'Online', x: 520, y: 60, icon: '🌐', shape: 'rounded-lg border-slate-500', interfaces: [{ name: 'WAN', ip: 'Public IP (DHCP)' }], actions: ['Check Latency'] },
      'Firewall': { type: 'Security Appliance', status: 'Online', x: 520, y: 170, icon: '🧱', shape: 'rounded-lg border-rose-500', interfaces: [{ name: 'eth0 (LAN)', ip: '192.168.1.254/24' }, { name: 'eth1 (WAN)', ip: '203.0.113.1/30' }], actions: ['View Firewall Rules', 'Toggle Power'] },
      'Router-01': { type: 'Router', status: 'Online', x: 520, y: 290, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Gig0/0', ip: '192.168.1.1/24' }, { name: 'Gig0/1', ip: '10.0.0.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Switch-01': { type: 'Layer 2 Switch', status: 'Online', x: 520, y: 410, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 1', ip: '192.168.1.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'PC-01': { type: 'Workstation', status: 'Online', x: 340, y: 520, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.1.10/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'PC-02': { type: 'Workstation', status: 'Online', x: 520, y: 520, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.1.11/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Server-01': { type: 'Web Server', status: 'Online', x: 700, y: 520, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '192.168.1.100/24' }], actions: ['Server Manager', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Internet', to: 'Firewall', type: 'fiber' },
      { id: 2, from: 'Firewall', to: 'Router-01', type: 'ethernet' },
      { id: 3, from: 'Router-01', to: 'Switch-01', type: 'ethernet' },
      { id: 4, from: 'Switch-01', to: 'PC-01', type: 'ethernet' },
      { id: 5, from: 'Switch-01', to: 'PC-02', type: 'ethernet' },
      { id: 6, from: 'Switch-01', to: 'Server-01', type: 'fiber' }
    ]
  },

  star: {
    title: 'Pure Star Topology (Central Hub/Switch)',
    category: 'Simple & Fundamental',
    badge: 'Layer 2 Star',
    description: 'Classic Star topology where all workstations, servers, and gateways radiate from a central Layer-2 Switch.',
    devices: {
      'Central-SW': { type: 'Layer 2 Switch', status: 'Online', x: 520, y: 300, icon: '🔀', shape: 'rounded-lg border-cyan-400', interfaces: [{ name: 'VLAN 10', ip: '10.10.10.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Gateway-RTR': { type: 'Router', status: 'Online', x: 520, y: 110, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Gig0/0', ip: '10.10.10.1/24' }], actions: ['Configure Router', 'Toggle Power'] },
      'Host-A': { type: 'Workstation', status: 'Online', x: 280, y: 180, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '10.10.10.11/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Host-B': { type: 'Workstation', status: 'Online', x: 760, y: 180, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '10.10.10.12/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Host-C': { type: 'Workstation', status: 'Online', x: 280, y: 430, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '10.10.10.13/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Host-D': { type: 'Workstation', status: 'Online', x: 760, y: 430, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '10.10.10.14/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'File-Server': { type: 'Server', status: 'Online', x: 520, y: 490, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '10.10.10.100/24' }], actions: ['Server Manager', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Central-SW', to: 'Gateway-RTR', type: 'fiber' },
      { id: 2, from: 'Central-SW', to: 'Host-A', type: 'ethernet' },
      { id: 3, from: 'Central-SW', to: 'Host-B', type: 'ethernet' },
      { id: 4, from: 'Central-SW', to: 'Host-C', type: 'ethernet' },
      { id: 5, from: 'Central-SW', to: 'Host-D', type: 'ethernet' },
      { id: 6, from: 'Central-SW', to: 'File-Server', type: 'fiber' }
    ]
  },

  ring: {
    title: 'Metro Optical Ring Topology (SONET / RSTP)',
    category: 'Simple & Fundamental',
    badge: 'Resilient Ring',
    description: ' Bi-directional metropolitan fiber ring connecting 6 city nodes with automatic Spanning-Tree / OSPF loop protection.',
    devices: {
      'Node-North': { type: 'Router', status: 'Online', x: 520, y: 90, icon: '🔄', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/1', ip: '172.16.1.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-NE': { type: 'Router', status: 'Online', x: 760, y: 190, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/1', ip: '172.16.1.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-SE': { type: 'Router', status: 'Online', x: 760, y: 400, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/1', ip: '172.16.1.5/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-South': { type: 'Router', status: 'Online', x: 520, y: 500, icon: '🔄', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/1', ip: '172.16.1.6/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-SW': { type: 'Router', status: 'Online', x: 280, y: 400, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/1', ip: '172.16.1.9/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Node-NW': { type: 'Router', status: 'Online', x: 280, y: 190, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'TenGig0/1', ip: '172.16.1.10/30' }], actions: ['Configure Router', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Node-North', to: 'Node-NE', type: 'fiber' },
      { id: 2, from: 'Node-NE', to: 'Node-SE', type: 'fiber' },
      { id: 3, from: 'Node-SE', to: 'Node-South', type: 'fiber' },
      { id: 4, from: 'Node-South', to: 'Node-SW', type: 'fiber' },
      { id: 5, from: 'Node-SW', to: 'Node-NW', type: 'fiber' },
      { id: 6, from: 'Node-NW', to: 'Node-North', type: 'fiber' }
    ]
  },

  mesh: {
    title: 'Full-Mesh Core Topology (N(N-1)/2 Links)',
    category: 'Simple & Fundamental',
    badge: 'Zero SPOF Mesh',
    description: 'High-availability Full-Mesh topology where every core router has a direct point-to-point link to every other router.',
    devices: {
      'Mesh-R1': { type: 'Core Router', status: 'Online', x: 520, y: 90, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Lo0', ip: '1.1.1.1/32' }, { name: 'Gi0/0', ip: '10.0.12.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Mesh-R2': { type: 'Core Router', status: 'Online', x: 800, y: 250, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Lo0', ip: '2.2.2.2/32' }, { name: 'Gi0/0', ip: '10.0.12.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Mesh-R3': { type: 'Core Router', status: 'Online', x: 690, y: 490, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Lo0', ip: '3.3.3.3/32' }, { name: 'Gi0/0', ip: '10.0.23.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Mesh-R4': { type: 'Core Router', status: 'Online', x: 350, y: 490, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Lo0', ip: '4.4.4.4/32' }, { name: 'Gi0/0', ip: '10.0.34.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Mesh-R5': { type: 'Core Router', status: 'Online', x: 240, y: 250, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Lo0', ip: '5.5.5.5/32' }, { name: 'Gi0/0', ip: '10.0.45.2/30' }], actions: ['Configure Router', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Mesh-R1', to: 'Mesh-R2', type: 'fiber' },
      { id: 2, from: 'Mesh-R2', to: 'Mesh-R3', type: 'fiber' },
      { id: 3, from: 'Mesh-R3', to: 'Mesh-R4', type: 'fiber' },
      { id: 4, from: 'Mesh-R4', to: 'Mesh-R5', type: 'fiber' },
      { id: 5, from: 'Mesh-R5', to: 'Mesh-R1', type: 'fiber' },
      { id: 6, from: 'Mesh-R1', to: 'Mesh-R3', type: 'serial' },
      { id: 7, from: 'Mesh-R1', to: 'Mesh-R4', type: 'serial' },
      { id: 8, from: 'Mesh-R2', to: 'Mesh-R4', type: 'serial' },
      { id: 9, from: 'Mesh-R2', to: 'Mesh-R5', type: 'serial' },
      { id: 10, from: 'Mesh-R3', to: 'Mesh-R5', type: 'serial' }
    ]
  },

  threeTier: {
    title: 'Cisco 3-Tier Hierarchical Campus (Core / Dist / Access)',
    category: 'Enterprise & Data Center',
    badge: 'Enterprise Campus',
    description: 'Full redundant enterprise campus with Dual Core routers, Dual Multilayer Distribution switches (HSRP/EtherChannel), and Access switches.',
    devices: {
      'Core-RTR-A': { type: 'Core Router', status: 'Online', x: 390, y: 80, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/0', ip: '10.0.0.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Core-RTR-B': { type: 'Core Router', status: 'Online', x: 650, y: 80, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'TenGig0/0', ip: '10.0.0.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Dist-L3-SW1': { type: 'L3 Switch', status: 'Online', x: 350, y: 230, icon: '💠', shape: 'rounded-lg border-blue-400', interfaces: [{ name: 'SVI 10 (HSRP)', ip: '192.168.10.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Dist-L3-SW2': { type: 'L3 Switch', status: 'Online', x: 690, y: 230, icon: '💠', shape: 'rounded-lg border-blue-400', interfaces: [{ name: 'SVI 10 (Standby)', ip: '192.168.10.3/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Access-SW1': { type: 'Layer 2 Switch', status: 'Online', x: 240, y: 380, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 10', ip: '192.168.10.11/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Access-SW2': { type: 'Layer 2 Switch', status: 'Online', x: 520, y: 380, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 20', ip: '192.168.20.11/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Access-SW3': { type: 'Layer 2 Switch', status: 'Online', x: 800, y: 380, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 30', ip: '192.168.30.11/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Eng-PC': { type: 'Workstation', status: 'Online', x: 240, y: 510, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.10.50/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Campus-WLAN': { type: 'Access Point', status: 'Online', x: 520, y: 510, icon: '📡', shape: 'rounded-full border-cyan-500', interfaces: [{ name: 'wlan0', ip: '192.168.20.50/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'DataCenter-SRV': { type: 'Server', status: 'Online', x: 800, y: 510, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '192.168.30.100/24' }], actions: ['Server Manager', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Core-RTR-A', to: 'Core-RTR-B', type: 'fiber' },
      { id: 2, from: 'Core-RTR-A', to: 'Dist-L3-SW1', type: 'fiber' },
      { id: 3, from: 'Core-RTR-A', to: 'Dist-L3-SW2', type: 'fiber' },
      { id: 4, from: 'Core-RTR-B', to: 'Dist-L3-SW1', type: 'fiber' },
      { id: 5, from: 'Core-RTR-B', to: 'Dist-L3-SW2', type: 'fiber' },
      { id: 6, from: 'Dist-L3-SW1', to: 'Dist-L3-SW2', type: 'fiber' },
      { id: 7, from: 'Dist-L3-SW1', to: 'Access-SW1', type: 'ethernet' },
      { id: 8, from: 'Dist-L3-SW2', to: 'Access-SW1', type: 'ethernet' },
      { id: 9, from: 'Dist-L3-SW1', to: 'Access-SW2', type: 'ethernet' },
      { id: 10, from: 'Dist-L3-SW2', to: 'Access-SW2', type: 'ethernet' },
      { id: 11, from: 'Dist-L3-SW1', to: 'Access-SW3', type: 'ethernet' },
      { id: 12, from: 'Dist-L3-SW2', to: 'Access-SW3', type: 'ethernet' },
      { id: 13, from: 'Access-SW1', to: 'Eng-PC', type: 'ethernet' },
      { id: 14, from: 'Access-SW2', to: 'Campus-WLAN', type: 'ethernet' },
      { id: 15, from: 'Access-SW3', to: 'DataCenter-SRV', type: 'fiber' }
    ]
  },

  spineLeaf: {
    title: 'Data Center Spine-Leaf (CLOS Fabric Architecture)',
    category: 'Enterprise & Data Center',
    badge: '400G CLOS Fabric',
    description: 'Modern cloud data center fabric where every Leaf switch connects to every Spine switch for deterministic East-West latency (VXLAN/EVPN).',
    devices: {
      'Spine-01': { type: 'Core Router', status: 'Online', x: 380, y: 110, icon: '⚡', shape: 'rounded-lg border-cyan-400', interfaces: [{ name: 'Lo0 (VTEP)', ip: '10.255.0.1/32' }], actions: ['Configure Router', 'Toggle Power'] },
      'Spine-02': { type: 'Core Router', status: 'Online', x: 660, y: 110, icon: '⚡', shape: 'rounded-lg border-cyan-400', interfaces: [{ name: 'Lo0 (VTEP)', ip: '10.255.0.2/32' }], actions: ['Configure Router', 'Toggle Power'] },
      'Leaf-ToR-1': { type: 'L3 Switch', status: 'Online', x: 220, y: 310, icon: '💠', shape: 'rounded-lg border-blue-500', interfaces: [{ name: 'VNI 10010', ip: '172.20.10.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Leaf-ToR-2': { type: 'L3 Switch', status: 'Online', x: 420, y: 310, icon: '💠', shape: 'rounded-lg border-blue-500', interfaces: [{ name: 'VNI 10020', ip: '172.20.20.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Leaf-ToR-3': { type: 'L3 Switch', status: 'Online', x: 620, y: 310, icon: '💠', shape: 'rounded-lg border-blue-500', interfaces: [{ name: 'VNI 10030', ip: '172.20.30.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Leaf-Border-4': { type: 'L3 Switch', status: 'Online', x: 820, y: 310, icon: '💠', shape: 'rounded-lg border-emerald-400', interfaces: [{ name: 'WAN-Uplink', ip: '203.0.113.10/30' }], actions: ['View MAC Table', 'Toggle Power'] },
      'K8s-Node-1': { type: 'Server', status: 'Online', x: 220, y: 490, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '172.20.10.50/24' }], actions: ['Server Manager', 'Toggle Power'] },
      'DB-Cluster': { type: 'Server', status: 'Online', x: 420, y: 490, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '172.20.20.50/24' }], actions: ['Server Manager', 'Toggle Power'] },
      'AI-GPU-Pod': { type: 'Server', status: 'Online', x: 620, y: 490, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'eth0', ip: '172.20.30.50/24' }], actions: ['Server Manager', 'Toggle Power'] },
      'Edge-Firewall': { type: 'Firewall', status: 'Online', x: 820, y: 490, icon: '🧱', shape: 'rounded-lg border-rose-500', interfaces: [{ name: 'WAN', ip: '203.0.113.9/30' }], actions: ['View Firewall Rules', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Spine-01', to: 'Leaf-ToR-1', type: 'fiber' },
      { id: 2, from: 'Spine-01', to: 'Leaf-ToR-2', type: 'fiber' },
      { id: 3, from: 'Spine-01', to: 'Leaf-ToR-3', type: 'fiber' },
      { id: 4, from: 'Spine-01', to: 'Leaf-Border-4', type: 'fiber' },
      { id: 5, from: 'Spine-02', to: 'Leaf-ToR-1', type: 'fiber' },
      { id: 6, from: 'Spine-02', to: 'Leaf-ToR-2', type: 'fiber' },
      { id: 7, from: 'Spine-02', to: 'Leaf-ToR-3', type: 'fiber' },
      { id: 8, from: 'Spine-02', to: 'Leaf-Border-4', type: 'fiber' },
      { id: 9, from: 'Leaf-ToR-1', to: 'K8s-Node-1', type: 'ethernet' },
      { id: 10, from: 'Leaf-ToR-2', to: 'DB-Cluster', type: 'ethernet' },
      { id: 11, from: 'Leaf-ToR-3', to: 'AI-GPU-Pod', type: 'ethernet' },
      { id: 12, from: 'Leaf-Border-4', to: 'Edge-Firewall', type: 'fiber' }
    ]
  },

  globalWan: {
    title: 'Global Intercontinental BGP & Submarine Backbone',
    category: 'Global & Multi-Area WAN',
    badge: 'Global Multi-AS',
    description: 'Worldwide Tier-1 Internet Exchange (IXP) topology linking Amman (AS65010), Frankfurt DE-CIX (AS65020), New York (AS65030), and Tokyo (AS65040).',
    devices: {
      'Amman-IXP-JO': { type: 'Core Router', status: 'Online', x: 520, y: 260, icon: '🌍', shape: 'rounded-full border-emerald-400', interfaces: [{ name: 'BGP AS65010', ip: '185.10.1.1/30' }, { name: 'MENA-Submarine', ip: '91.200.1.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Frankfurt-DE-CIX': { type: 'Core Router', status: 'Online', x: 320, y: 120, icon: '🌍', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'BGP AS65020', ip: '185.10.1.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'NewYork-US-East': { type: 'Core Router', status: 'Online', x: 140, y: 260, icon: '🌍', shape: 'rounded-full border-blue-400', interfaces: [{ name: 'BGP AS65030', ip: '198.51.100.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Tokyo-APNIC-JP': { type: 'Core Router', status: 'Online', x: 840, y: 180, icon: '🌍', shape: 'rounded-full border-purple-400', interfaces: [{ name: 'BGP AS65040', ip: '203.0.113.100/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Amman-Branch-SW': { type: 'L3 Switch', status: 'Online', x: 520, y: 420, icon: '💠', shape: 'rounded-lg border-blue-500', interfaces: [{ name: 'VLAN 100 (JO)', ip: '192.168.1.1/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'EU-Cloud-DC': { type: 'Server', status: 'Online', x: 320, y: 310, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'Anycast-DNS', ip: '8.8.8.8/32' }], actions: ['Server Manager', 'Toggle Power'] },
      'US-Root-DNS': { type: 'Server', status: 'Online', x: 140, y: 440, icon: '🗄️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'Root-A', ip: '198.41.0.4/32' }], actions: ['Server Manager', 'Toggle Power'] },
      'Asia-CDN-Node': { type: 'Server', status: 'Online', x: 840, y: 380, icon: '🗄️️', shape: 'rounded-sm border-yellow-500', interfaces: [{ name: 'CDN-Edge', ip: '1.1.1.1/32' }], actions: ['Server Manager', 'Toggle Power'] },
      'JO-Engineer-PC': { type: 'Workstation', status: 'Online', x: 520, y: 540, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '192.168.1.10/24' }], actions: ['Command Prompt', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Amman-IXP-JO', to: 'Frankfurt-DE-CIX', type: 'submarine' },
      { id: 2, from: 'Frankfurt-DE-CIX', to: 'NewYork-US-East', type: 'submarine' },
      { id: 3, from: 'Amman-IXP-JO', to: 'Tokyo-APNIC-JP', type: 'submarine' },
      { id: 4, from: 'Frankfurt-DE-CIX', to: 'Tokyo-APNIC-JP', type: 'serial' },
      { id: 5, from: 'Amman-IXP-JO', to: 'Amman-Branch-SW', type: 'fiber' },
      { id: 6, from: 'Amman-Branch-SW', to: 'JO-Engineer-PC', type: 'ethernet' },
      { id: 7, from: 'Frankfurt-DE-CIX', to: 'EU-Cloud-DC', type: 'fiber' },
      { id: 8, from: 'NewYork-US-East', to: 'US-Root-DNS', type: 'fiber' },
      { id: 9, from: 'Tokyo-APNIC-JP', to: 'Asia-CDN-Node', type: 'fiber' }
    ]
  },

  multiAreaOspf: {
    title: 'Multi-Area OSPF Hierarchy (Area 0, Area 10 & Area 20)',
    category: 'Global & Multi-Area WAN',
    badge: 'OSPF ABR/ASBR',
    description: 'Enterprise multi-area OSPF deployment featuring Backbone Area 0, two Area Border Routers (ABRs), and Totally Stubby branch areas.',
    devices: {
      'Backbone-R1 (Area 0)': { type: 'Core Router', status: 'Online', x: 400, y: 100, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Gi0/0 (Area 0)', ip: '10.0.0.1/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'Backbone-R2 (Area 0)': { type: 'Core Router', status: 'Online', x: 640, y: 100, icon: '⚡', shape: 'rounded-full border-cyan-400', interfaces: [{ name: 'Gi0/0 (Area 0)', ip: '10.0.0.2/30' }], actions: ['Configure Router', 'Toggle Power'] },
      'ABR-West (Area 0/10)': { type: 'Router', status: 'Online', x: 280, y: 260, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Gi0/1 (Area 10)', ip: '10.10.0.1/24' }], actions: ['Configure Router', 'Toggle Power'] },
      'ABR-East (Area 0/20)': { type: 'Router', status: 'Online', x: 760, y: 260, icon: '🔄', shape: 'rounded-full border-blue-500', interfaces: [{ name: 'Gi0/1 (Area 20)', ip: '10.20.0.1/24' }], actions: ['Configure Router', 'Toggle Power'] },
      'Area10-SW': { type: 'Layer 2 Switch', status: 'Online', x: 280, y: 410, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 10', ip: '10.10.0.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Area20-Stub-SW': { type: 'Layer 2 Switch', status: 'Online', x: 760, y: 410, icon: '🔀', shape: 'rounded-sm border-blue-500', interfaces: [{ name: 'VLAN 20', ip: '10.20.0.2/24' }], actions: ['View MAC Table', 'Toggle Power'] },
      'Branch10-Host': { type: 'Workstation', status: 'Online', x: 280, y: 530, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '10.10.0.50/24' }], actions: ['Command Prompt', 'Toggle Power'] },
      'Branch20-Host': { type: 'Workstation', status: 'Online', x: 760, y: 530, icon: '💻', shape: 'rounded border-slate-600', interfaces: [{ name: 'eth0', ip: '10.20.0.50/24' }], actions: ['Command Prompt', 'Toggle Power'] }
    },
    connections: [
      { id: 1, from: 'Backbone-R1 (Area 0)', to: 'Backbone-R2 (Area 0)', type: 'fiber' },
      { id: 2, from: 'Backbone-R1 (Area 0)', to: 'ABR-West (Area 0/10)', type: 'serial' },
      { id: 3, from: 'Backbone-R2 (Area 0)', to: 'ABR-East (Area 0/20)', type: 'serial' },
      { id: 4, from: 'Backbone-R1 (Area 0)', to: 'ABR-East (Area 0/20)', type: 'serial' },
      { id: 5, from: 'Backbone-R2 (Area 0)', to: 'ABR-West (Area 0/10)', type: 'serial' },
      { id: 6, from: 'ABR-West (Area 0/10)', to: 'Area10-SW', type: 'ethernet' },
      { id: 7, from: 'ABR-East (Area 0/20)', to: 'Area20-Stub-SW', type: 'ethernet' },
      { id: 8, from: 'Area10-SW', to: 'Branch10-Host', type: 'ethernet' },
      { id: 9, from: 'Area20-Stub-SW', to: 'Branch20-Host', type: 'ethernet' }
    ]
  }
};

function NetworkLab() {
  const [devices, setDevices] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('netforge_devices');
    return saved ? JSON.parse(saved) : topologyPresets.office.devices;
  });

  const [connections, setConnections] = useState<any[]>(() => {
    const saved = localStorage.getItem('netforge_connections');
    return saved ? JSON.parse(saved) : topologyPresets.office.connections;
  });

  const [currentTopologyName, setCurrentTopologyName] = useState<string>('Standard Enterprise LAN');
  const [selectedDevice, setSelectedDevice] = useState<string | null>('Router-01');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalAutoCmd, setTerminalAutoCmd] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // نافذة اختيار القوالب العالمية والهندسية
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [selectedCableType, setSelectedCableType] = useState<string>('ethernet');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // حالة تحدي الإصلاح الحي
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [challengeResult, setChallengeResult] = useState<{ status: 'success' | 'error' | null; msg: string }>({ status: null, msg: '' });

  const [activeTool, setActiveTool] = useState<string>('Select');
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const [draggingDevice, setDraggingDevice] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentDeviceData = selectedDevice ? devices[selectedDevice] : null;

  // تحميل أي قالب شبكة (بسيط، معقد، أو عالمي)
  const handleLoadPreset = (presetKey: string) => {
    const preset = topologyPresets[presetKey];
    if (!preset) return;
    const clonedDevices = JSON.parse(JSON.stringify(preset.devices));
    const clonedConns = JSON.parse(JSON.stringify(preset.connections));
    setDevices(clonedDevices);
    setConnections(clonedConns);
    setCurrentTopologyName(preset.title);
    setSelectedDevice(Object.keys(clonedDevices)[0] || null);
    setIsChallengeMode(false);
    setIsTemplatesModalOpen(false);
  };

  // مسح اللوحة بالكامل لبناء شبكة حرة من الصفر
  const handleClearCanvas = () => {
    setDevices({});
    setConnections([]);
    setSelectedDevice(null);
    setCurrentTopologyName('Custom Blank Topology');
    setIsChallengeMode(false);
    setIsTemplatesModalOpen(false);
  };

  // تحميل سيناريو الشبكة المعطلة
  const handleStartBrokenLabChallenge = () => {
    const brokenDevices = JSON.parse(JSON.stringify(topologyPresets.office.devices));
    brokenDevices['Switch-01'].status = 'Offline';
    brokenDevices['Server-01'].interfaces[0].ip = '192.168.99.100/24';
    
    const brokenConnections = topologyPresets.office.connections.filter(
      c => !(c.from === 'Switch-01' && c.to === 'Server-01')
    );

    setDevices(brokenDevices);
    setConnections(brokenConnections);
    setCurrentTopologyName('Troubleshooting Challenge');
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
      setChallengeResult({ status: 'error', msg: '✗ Fault Remaining: Switch-01 or Server-01 is still Offline! Select it and click Toggle Power.' });
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
    setDevices(prev => ({
      ...prev,
      [deviceName]: {
        ...prev[deviceName],
        status: prev[deviceName].status === 'Online' ? 'Offline' : 'Online'
      }
    }));
  };

  // إضافة أجهزة شبكات متخصصة وبسيطة وعالمية
  const handleAddDevice = (deviceType: string) => {
    const count = Object.keys(devices).filter(k => k.startsWith(deviceType)).length + 1;
    const newName = `${deviceType.replace(/\s+/g, '')}-0${count}`;
    
    const icons: Record<string, string> = {
      'Core Router': '⚡', 'Router': '🔄', 'L3 Switch': '💠', 'Switch': '🔀',
      'Firewall': '🧱', 'Global IXP': '🌍', 'Server': '🗄️', 'PC': '💻', 'Access Point': '📡'
    };

    const shapes: Record<string, string> = {
      'Core Router': 'rounded-full border-cyan-400',
      'Router': 'rounded-full border-blue-500',
      'L3 Switch': 'rounded-lg border-blue-400',
      'Switch': 'rounded-sm border-blue-500',
      'Firewall': 'rounded-lg border-rose-500',
      'Global IXP': 'rounded-full border-emerald-400',
      'Server': 'rounded-sm border-yellow-500',
      'PC': 'rounded border-slate-600',
      'Access Point': 'rounded-full border-cyan-500'
    };

    const offset = (Object.keys(devices).length * 45) % 260;
    setDevices(prev => ({
      ...prev,
      [newName]: {
        type: deviceType,
        status: 'Online',
        x: 350 + offset,
        y: 200 + (offset % 180),
        icon: icons[deviceType] || '💻',
        shape: shapes[deviceType] || 'rounded border-slate-600',
        interfaces: [
          { name: 'Gig0/0', ip: `192.168.1.${10 + Object.keys(prev).length}/24` },
          ...(deviceType.includes('Router') || deviceType.includes('IXP') ? [{ name: 'TenGig0/1', ip: `10.0.${Object.keys(prev).length}.1/30` }] : [])
        ],
        actions: deviceType.includes('Switch')
          ? ['View MAC Table', 'Toggle Power']
          : deviceType === 'Firewall'
            ? ['View Firewall Rules', 'Toggle Power']
            : ['Configure Router', 'Toggle Power']
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
            { id: Date.now(), from: connectSource, to: devName, type: selectedCableType }
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
    const newX = Math.max(50, Math.min(990, (e.clientX - rect.left) / zoomLevel));
    const newY = Math.max(30, Math.min(580, (e.clientY - rect.top - 24) / zoomLevel));

    setDevices(prev => ({
      ...prev,
      [draggingDevice]: {
        ...prev[draggingDevice],
        x: Math.round(newX),
        y: Math.round(newY)
      }
    }));
  };

  return (
    <div 
      className="h-screen bg-[#0B1120] text-slate-300 font-sans flex flex-col overflow-hidden relative select-none"
      onMouseUp={() => setDraggingDevice(null)}
    >
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800/60 bg-slate-900/50 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span className="text-blue-500 text-xl font-bold">NETFORGE</span>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">← Back</Link>
            <span className="text-slate-600">|</span>
            <span className="text-white font-semibold">{currentTopologyName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* زر استوديو القوالب والشبكات العالمية */}
          <button 
            onClick={() => setIsTemplatesModalOpen(true)}
            className="text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 px-3.5 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            🌐 Topology Builder & Global Presets
          </button>

          <button 
            onClick={handleStartBrokenLabChallenge}
            className="text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-md transition-all cursor-pointer"
          >
            🎯 Broken Lab
          </button>

          <button 
            onClick={handleClearCanvas}
            className="text-xs font-medium text-slate-400 hover:text-rose-400 px-2 py-1.5 cursor-pointer"
            title="Start with an empty canvas"
          >
            Blank Canvas
          </button>

          <button 
            onClick={handleSaveTopology}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
              saveSuccess 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {saveSuccess ? '✓ Saved!' : 'Save'}
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
        <div className="bg-slate-900/95 border-b border-amber-500/40 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-20">
          <div className="text-xs space-y-1">
            <div className="font-bold text-amber-400 uppercase tracking-wider">
              🚨 Mission: Restore Connectivity to Web Server-01 (3 Faults Detected)
            </div>
            <div className="text-slate-300 font-mono text-[11px]">
              1. Power on <span className="text-white font-bold">Switch-01</span> • 2. Use <span className="text-cyan-400 font-bold">Connect</span> tool to link Switch-01 & Server-01 • 3. Fix <span className="text-white font-bold">Server-01</span> IP to <span className="text-emerald-400 font-bold">192.168.1.100/24</span>
            </div>
            {challengeResult.status && (
              <div className={`font-mono font-bold pt-1 ${challengeResult.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {challengeResult.msg}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyLabChallenge}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs cursor-pointer"
            >
              ✓ Verify Lab Fix (+350 XP)
            </button>
            <button onClick={() => setIsChallengeMode(false)} className="text-xs text-slate-400 hover:text-white px-2 cursor-pointer">✕</button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: الأجهزة + نوع الكيبل + الأدوات */}
        <aside className="w-64 bg-slate-900/40 border-r border-slate-800/60 flex flex-col overflow-y-auto shrink-0 z-10">
          <div className="p-4 space-y-6">
            
            {/* 1. إضافة أجهزة الشبكة */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Network Nodes</h3>
                <span className="text-[9px] text-cyan-400">Click to add +</span>
              </div>
              <div className="space-y-1">
                {['Core Router', 'Router', 'L3 Switch', 'Switch', 'Firewall', 'Global IXP', 'Server', 'PC', 'Access Point'].map((device) => (
                  <button 
                    key={device} 
                    onClick={() => handleAddDevice(device)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors text-left group cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${
                        device === 'Global IXP' ? 'bg-emerald-400' :
                        device === 'Firewall' ? 'bg-rose-400' :
                        device.includes('Core') ? 'bg-cyan-400' : 'bg-blue-400'
                      }`}></span>
                      {device}
                    </span>
                    <span className="text-xs text-slate-600 group-hover:text-cyan-400 font-bold">+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. اختيار نوع الكيبل عند التوصيل */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-widest mb-2.5 uppercase">Cable / Link Media</h3>
              <div className="space-y-1.5">
                {Object.entries(cableStyles).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCableType(key);
                      setActiveTool('Connect');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer border ${
                      selectedCableType === key
                        ? 'bg-slate-800 text-white border-cyan-500/50'
                        : 'bg-slate-950/40 text-slate-400 border-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{style.label}</span>
                    <span className="w-5 h-1 rounded-full shrink-0 ml-2" style={{ backgroundColor: style.color }}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. أدوات التحكم */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-widest mb-2.5 uppercase">Canvas Tools</h3>
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
                        : 'text-slate-400 bg-slate-950/40 border-slate-800/60 hover:text-white'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Center Canvas (مساحة واسعة 1040x640 تدعم الشبكات العالمية والتكبير/التصغير) */}
        <main className="flex-1 relative bg-[#0B1120] overflow-auto flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          
          {/* تنبيهات الأداة الفعالة */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {isSimulating && (
              <div className="bg-slate-900/90 border border-cyan-500/40 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Live Packet Flow Active ({connections.length} links)
              </div>
            )}
            {activeTool === 'Connect' && (
              <div className="bg-blue-950/90 border border-blue-500/40 text-blue-300 px-4 py-1.5 rounded-full text-xs flex items-center gap-2">
                🔗 [{cableStyles[selectedCableType]?.label}] {connectSource ? `From "${connectSource}" → Click target node` : 'Click first node to start cabling'}
              </div>
            )}
            {activeTool === 'Delete' && (
              <div className="bg-rose-950/90 border border-rose-500/40 text-rose-300 px-4 py-1.5 rounded-full text-xs flex items-center gap-2">
                🗑 Click any node on the canvas to remove it
              </div>
            )}
          </div>

          {/* أزرار التكبير والتصغير (Zoom Controls) */}
          <div className="absolute bottom-4 right-6 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl z-20 text-xs font-mono">
            <button onClick={() => setZoomLevel(z => Math.max(0.6, +(z - 0.1).toFixed(1)))} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white cursor-pointer">−</button>
            <span className="px-2 text-slate-300">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => setZoomLevel(1)} className="px-2 py-1 text-[10px] text-cyan-400 hover:underline cursor-pointer">Reset</button>
            <button onClick={() => setZoomLevel(z => Math.min(1.4, +(z + 0.1).toFixed(1)))} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white cursor-pointer">+</button>
          </div>

          <div 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            className="relative w-[1040px] h-[620px] shrink-0 transition-transform duration-150"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {connections.map((conn) => {
                const fromDev = devices[conn.from];
                const toDev = devices[conn.to];
                if (!fromDev || !toDev) return null;

                const isOnline = fromDev.status === 'Online' && toDev.status === 'Online';
                const cStyle = cableStyles[conn.type || 'ethernet'] || cableStyles.ethernet;
                const pathString = `M ${fromDev.x} ${fromDev.y + 24} L ${toDev.x} ${toDev.y + 24}`;
                const revPathString = `M ${toDev.x} ${toDev.y + 24} L ${fromDev.x} ${fromDev.y + 24}`;

                return (
                  <g key={conn.id}>
                    <path 
                      d={pathString} 
                      stroke={isOnline ? cStyle.color : "#ef4444"} 
                      strokeWidth={isOnline ? cStyle.width : "1.5"} 
                      strokeDasharray={isOnline ? cStyle.dash : "5,5"}
                      fill="none" 
                    />
                    {isSimulating && isOnline && (
                      <>
                        <circle r="4.5" fill="#22d3ee" className="drop-shadow-[0_0_8px_#22d3ee]">
                          <animateMotion dur={cStyle.speed} repeatCount="indefinite" path={pathString} />
                        </circle>
                        <circle r="3.5" fill="#a855f7" opacity="0.8">
                          <animateMotion dur={cStyle.speed} begin="0.4s" repeatCount="indefinite" path={revPathString} />
                        </circle>
                      </>
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
                  } flex items-center justify-center text-lg shadow-lg`}>
                    {dev.icon}
                  </div>
                  <div className="text-[11px] font-bold text-white whitespace-nowrap bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                    {devName}
                  </div>
                  <div className={`text-[9px] font-mono ${dev.status === 'Online' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ● {dev.interfaces?.[0]?.ip || dev.status}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-6 text-xs text-slate-500 font-mono">
            {Object.keys(devices).length} nodes • {connections.length} links • Tool: <span className="text-cyan-400">{activeTool}</span>
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

      {/* 🌐 نافذة اختيار القوالب الهندسية والشبكات العالمية (Global & Topology Architecture Studio) */}
      {isTemplatesModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#0B1120] border-2 border-cyan-500/40 rounded-3xl max-w-5xl w-full p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] max-h-[88vh] flex flex-col">
            
            <div className="flex justify-between items-start pb-5 mb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-1">
                  🌐 Netforge Topology Architecture Generator
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  Load Simple, Enterprise, or Global WAN Topologies
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select any reference network architecture below to generate its nodes, IP addressing, and fiber/submarine links on the canvas, or start from a blank slate.
                </p>
              </div>
              <button onClick={() => setIsTemplatesModalOpen(false)} className="text-slate-400 hover:text-white text-xl px-2 cursor-pointer">✕</button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-6 flex-1">
              {(['Simple & Fundamental', 'Enterprise & Data Center', 'Global & Multi-Area WAN'] as const).map((cat) => (
                <div key={cat}>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 mb-3">
                    ■ {cat}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(topologyPresets)
                      .filter(([, p]) => p.category === cat)
                      .map(([key, preset]) => (
                        <div
                          key={key}
                          onClick={() => handleLoadPreset(key)}
                          className="bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-cyan-400 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                {preset.badge}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {Object.keys(preset.devices).length} Nodes • {preset.connections.length} Links
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-400 transition-colors">
                              {preset.title}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                              {preset.description}
                            </p>
                          </div>
                          <div className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                            Deploy Topology →
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-5 mt-5 border-t border-slate-800">
              <button
                onClick={handleClearCanvas}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer"
              >
                🗑 Start with Empty Blank Canvas
              </button>
              <button
                onClick={() => setIsTemplatesModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Close Window
              </button>
            </div>

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
      />

    </div>
  );
}

export default NetworkLab;