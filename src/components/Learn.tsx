import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ModuleItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  theory: string;
  packetAnatomy: { field: string; value: string; desc: string }[];
  cliConfig: string;
  quizQuestion: string;
  quizOptions: string[];
  correctOptionIndex: number;
}

interface CourseTrack {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  duration: string;
  modules: ModuleItem[];
}

const networkingCoursesData: CourseTrack[] = [
  {
    id: 'topologies',
    tag: 'Network Architectures',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    title: 'Physical & Logical Topologies: From Star/Mesh to Global Spine-Leaf',
    description: 'Master physical and logical network layouts: Star, Ring, Bus, Full/Partial Mesh, 3-Tier Hierarchical Campus, and Clos Spine-Leaf Data Centers.',
    duration: '3h 00m',
    modules: [
      {
        id: 'top-1',
        title: '1. Fundamental Topologies: Star, Ring, Bus & Full Mesh Math',
        time: '45m',
        completed: true,
        theory: 'Physical topology defines how nodes are physically cabled, while logical topology defines how frames/packets flow. A Star topology centralizes connectivity through a Layer-2 Switch. A Ring topology (FDDI/SONET) passes tokens/frames circularly with counter-rotating fiber redundancy. A Full Mesh connects every router to every other router directly, requiring N(N-1)/2 links for N nodes.',
        packetAnatomy: [
          { field: 'Star Topology', value: 'N Links', desc: 'Easy troubleshooting; central switch is a single point of failure unless redundant' },
          { field: 'Ring Topology', value: 'N Links (Closed Loop)', desc: 'Used in Metro Fiber rings (SONET/SDH) with sub-50ms protection switching' },
          { field: 'Full Mesh Formula', value: 'N(N - 1) / 2 Links', desc: 'For 6 core routers: 6(5)/2 = 15 dedicated point-to-point links' },
          { field: 'Partial Mesh', value: 'Hub-and-Spoke / Hybrid', desc: 'Balances high availability on core nodes with cost-efficiency on edge branches' }
        ],
        cliConfig: `! Verifying Point-to-Point Full Mesh Neighbor Adjacencies
Core-RTR1# show cdp neighbors detail
Core-RTR1# show ip interface brief | include up
Core-RTR1# show ip route summary`,
        quizQuestion: 'How many physical point-to-point links are required to connect 8 Core Routers in a Full Mesh topology?',
        quizOptions: [
          '8 links',
          '16 links',
          '28 links — calculated using N(N - 1) / 2 = 8(7) / 2',
          '64 links'
        ],
        correctOptionIndex: 2
      },
      {
        id: 'top-2',
        title: '2. Enterprise 3-Tier Hierarchical Model vs Spine-Leaf Architecture',
        time: '55m',
        completed: false,
        theory: 'Enterprise campus networks use the 3-Tier Hierarchical model: Access Layer (port security, PoE, VLAN assignment), Distribution Layer (L3 routing boundaries, ACL policies, FHRP/HSRP), and Core Layer (high-speed 40G/100G L3 switching backbone). Modern Data Centers replace 3-Tier with a 2-Tier Spine-Leaf (Clos) architecture where every Leaf switch connects to every Spine switch for predictable East-West latency.',
        packetAnatomy: [
          { field: 'Access Layer', value: 'Layer 2 Edge', desc: 'Connects end-user workstations, IP phones, and Wi-Fi APs' },
          { field: 'Distribution Layer', value: 'L2/L3 Boundary', desc: 'Aggregates access switches, runs OSPF/EIGRP, and provides HSRP gateways' },
          { field: 'Core Layer', value: 'High-Speed Backbone', desc: 'Pure Layer-3 fast packet switching with zero packet manipulation' },
          { field: 'Spine-Leaf (Clos)', value: 'ECMP East-West', desc: 'Every server-to-server flow crosses exactly: Leaf -> Spine -> Leaf' }
        ],
        cliConfig: `! Configuring HSRP First-Hop Redundancy at the Distribution Layer
Dist-SW1(config)# interface vlan 10
Dist-SW1(config-if)# ip address 192.168.10.2 255.255.255.0
Dist-SW1(config-if)# standby 10 ip 192.168.10.1
Dist-SW1(config-if)# standby 10 priority 150
Dist-SW1(config-if)# standby 10 preempt`,
        quizQuestion: 'In a modern Data Center Spine-Leaf (Clos) topology, how are the switches interconnected?',
        quizOptions: [
          'Spine switches connect directly to other Spine switches in a ring',
          'Every Leaf switch connects to every Spine switch (and Spines never connect to each other)',
          'All servers connect directly to the Spine switches',
          'STP blocks 50% of the links between Spine and Leaf switches'
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'subnetting',
    tag: 'IPv4 & IPv6 Addressing',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    title: 'IPv4 CIDR, Zero-Waste VLSM & IPv6 EUI-64 Architecture',
    description: 'Calculate subnet masks, wildcard bits, route summarization (Supernetting), and IPv6 Global Unicast & SLAAC.',
    duration: '3h 15m',
    modules: [
      {
        id: 'sub-1',
        title: '1. Variable Length Subnet Masking (VLSM) & Route Summarization',
        time: '50m',
        completed: true,
        theory: 'VLSM allows partitioning a network block into custom prefix lengths (/25, /26, /27, /30) by borrowing host bits. Always allocate from largest host requirement to smallest to prevent address overlap. Conversely, Route Summarization (Supernetting) aggregates contiguous prefixes into a single summary route to shrink core routing tables.',
        packetAnatomy: [
          { field: '/25 Prefix', value: '255.255.255.128', desc: '7 host bits -> 126 usable hosts (2 subnets per /24)' },
          { field: '/26 Prefix', value: '255.255.255.192', desc: '6 host bits -> 62 usable hosts (Block increment of 64)' },
          { field: '/27 Prefix', value: '255.255.255.224', desc: '5 host bits -> 30 usable hosts (Block increment of 32)' },
          { field: '/30 Prefix', value: '255.255.255.252', desc: '2 host bits -> 2 usable hosts (Ideal for Point-to-Point WAN links)' }
        ],
        cliConfig: `Router-01(config)# interface gigabitEthernet 0/0
Router-01(config-if)# ip address 192.168.10.1 255.255.255.192
Router-01(config)# interface serial 0/0/0
Router-01(config-if)# ip address 192.168.10.253 255.255.255.252
! Summarizing 192.168.0.0/24 through 192.168.3.0/24 into a /22:
Router-01(config-router)# area 1 range 192.168.0.0 255.255.252.0`,
        quizQuestion: 'What is the single contiguous summary route (Supernet) for the four networks: 10.1.0.0/24, 10.1.1.0/24, 10.1.2.0/24, and 10.1.3.0/24?',
        quizOptions: [
          '10.1.0.0/22 (Mask 255.255.252.0)',
          '10.1.0.0/20 (Mask 255.255.240.0)',
          '10.1.0.0/26 (Mask 255.255.255.192)',
          '10.0.0.0/8'
        ],
        correctOptionIndex: 0
      },
      {
        id: 'sub-2',
        title: '2. IPv6 Addressing, Neighbor Discovery (NDP) & EUI-64',
        time: '55m',
        completed: true,
        theory: 'IPv6 uses 128-bit addresses and eliminates broadcast traffic completely in favor of Multicast and Anycast. ARP is replaced by ICMPv6 Neighbor Discovery Protocol (NDP: Neighbor Solicitation Type 135 & Neighbor Advertisement Type 136). SLAAC uses Router Advertisements (RA) and EUI-64 (inserting FFFE and inverting the 7th U/L bit) to auto-configure hosts.',
        packetAnatomy: [
          { field: 'Global Unicast', value: '2000::/3', desc: 'Globally routable public IPv6 space (e.g., 2001:DB8::/32)' },
          { field: 'Unique Local', value: 'FC00::/7 (FD00::/8)', desc: 'Private internal IPv6 equivalent of IPv4 RFC 1918' },
          { field: 'Link-Local', value: 'FE80::/10', desc: 'Auto-assigned on every IPv6 interface; used as next-hop by routing protocols' },
          { field: 'Solicited-Node', value: 'FF02::1:FFxx:xxxx', desc: 'Multicast address used by NDP for efficient MAC address resolution' }
        ],
        cliConfig: `Router-01(config)# ipv6 unicast-routing
Router-01(config)# interface gigabitEthernet 0/0
Router-01(config-if)# ipv6 address 2001:DB8:ACAD:1::/64 eui-64
Router-01(config-if)# ipv6 address FE80::1 link-local
Router-01# show ipv6 neighbors`,
        quizQuestion: 'Which protocol replaces IPv4 ARP in an IPv6 network to resolve Layer-3 addresses to Layer-2 MAC addresses?',
        quizOptions: [
          'DHCPv6 Relay',
          'ICMPv6 Neighbor Discovery Protocol (NDP — NS & NA messages)',
          'IGMPv3',
          'RARP (Reverse ARP)'
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'switching',
    tag: 'Layer-2 Switching',
    tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    title: 'VLAN Segmentation, IEEE 802.1Q Trunking, RSTP & EtherChannel',
    description: 'Master Layer-2 MAC switching, 802.1Q trunk encapsulation, Rapid-PVST+ loop prevention, and LACP Port-Channels.',
    duration: '3h 30m',
    modules: [
      {
        id: 'sw-1',
        title: '1. CAM Table Learning, VLANs & IEEE 802.1Q Trunk Links',
        time: '50m',
        completed: true,
        theory: 'Layer-2 switches learn Source MAC addresses dynamically into Content Addressable Memory (CAM) and forward frames based on Destination MAC. Unknown unicasts, broadcasts (FF:FF:FF:FF:FF:FF), and multicasts are flooded within the same VLAN. IEEE 802.1Q trunks carry multiple VLANs across a single link by inserting a 4-byte tag (12-bit VLAN ID).',
        packetAnatomy: [
          { field: 'TPID (16 bits)', value: '0x8100', desc: 'Marks the Ethernet frame as IEEE 802.1Q VLAN-tagged' },
          { field: 'VID (12 bits)', value: 'VLAN 1–4094', desc: 'Identifies the exact VLAN; 0 and 4095 are reserved' },
          { field: 'Native VLAN', value: 'Untagged Traffic', desc: 'Must match on both ends of a trunk link to prevent STP/CDP loops' },
          { field: 'DTP Modes', value: 'Dynamic Auto/Desirable', desc: 'Best practice: disable DTP using switchport nonegotiate' }
        ],
        cliConfig: `Switch-01(config)# interface gigabitEthernet 0/1
Switch-01(config-if)# switchport mode trunk
Switch-01(config-if)# switchport trunk native vlan 99
Switch-01(config-if)# switchport nonegotiate
Switch-01(config-if)# switchport trunk allowed vlan 10,20,99`,
        quizQuestion: 'What happens when a Layer-2 switch receives a unicast frame whose Destination MAC address is NOT in its MAC address table?',
        quizOptions: [
          'It drops the frame immediately and sends an ICMP Unreachable message',
          'It floods the frame out all ports belonging to the same VLAN except the ingress port',
          'It forwards the frame only to the default gateway router',
          'It broadcasts an ARP request on behalf of the sender'
        ],
        correctOptionIndex: 1
      },
      {
        id: 'sw-2',
        title: '2. Rapid-PVST+ (802.1w) & LACP EtherChannel (802.3ad)',
        time: '60m',
        completed: false,
        theory: 'Rapid-PVST+ runs a separate 802.1w Spanning Tree instance per VLAN, electing a Root Bridge (lowest Bridge Priority + MAC) and converging in under 1 second via Proposal/Agreement handshakes. LACP (802.3ad) aggregates physical links into a single logical Port-Channel so STP treats the bundle as one link.',
        packetAnatomy: [
          { field: 'Root Bridge ID', value: 'Priority + VLAN + MAC', desc: 'Default priority is 32768; lower priority (e.g., 4096) wins Root election' },
          { field: 'Root Port (RP)', value: 'Lowest Path Cost', desc: 'One port per non-root switch with the lowest cumulative cost to Root' },
          { field: 'Designated Port', value: 'Forwarding Per Segment', desc: 'All ports on the Root Bridge are Designated Ports (DP)' },
          { field: 'LACP Modes', value: 'Active / Passive', desc: 'At least one side must be Active to initiate LACP negotiation' }
        ],
        cliConfig: `Core-SW1(config)# spanning-tree mode rapid-pvst
Core-SW1(config)# spanning-tree vlan 10 priority 4096
Core-SW1(config)# interface range gigabitEthernet 0/1 - 2
Core-SW1(config-if-range)# channel-group 1 mode active`,
        quizQuestion: 'On a Root Bridge switch, what role do all active Spanning-Tree ports assume?',
        quizOptions: [
          'Root Ports (RP)',
          'Designated Ports (DP) in the Forwarding state',
          'Alternate Blocking Ports',
          'Backup Ports'
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'igp-routing',
    tag: 'IGP Routing (RIP & OSPF)',
    tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    title: 'Interior Gateway Protocols: RIPv2 Timers & Multi-Area OSPF',
    description: 'Compare Distance-Vector (Bellman-Ford RIPv2) vs Link-State (Dijkstra SPF OSPFv2/v3), LSA types, and Stub Areas.',
    duration: '4h 15m',
    modules: [
      {
        id: 'igp-1',
        title: '1. RIPv2 Distance-Vector Mechanics, Timers & Loop Prevention',
        time: '50m',
        completed: true,
        theory: 'RIPv2 (RFC 2453) is a classless Distance-Vector protocol using Hop Count as its metric (max 15 hops; 16 = unreachable). Updates are multicast to 224.0.0.9 (UDP port 520) every 30 seconds. To prevent routing loops (Count-to-Infinity), RIPv2 employs Split Horizon, Route Poisoning (advertising metric 16), Poison Reverse, and Holddown Timers.',
        packetAnatomy: [
          { field: 'Update Timer', value: '30 Seconds', desc: 'Periodic full routing table multicast to 224.0.0.9' },
          { field: 'Invalid Timer', value: '180 Seconds', desc: 'Route marked invalid if no update is heard for 180s' },
          { field: 'Holddown Timer', value: '180 Seconds', desc: 'Ignores inferior metrics while topology stabilizes' },
          { field: 'Flush Timer', value: '240 Seconds', desc: 'Purges the route completely from the routing table' }
        ],
        cliConfig: `Router-01(config)# router rip
Router-01(config-router)# version 2
Router-01(config-router)# no auto-summary
Router-01(config-router)# network 192.168.1.0
Router-01(config-router)# timers basic 30 180 180 240`,
        quizQuestion: 'Which RIPv2 loop-prevention rule states that a router must never advertise a route back out the same interface from which it was learned?',
        quizOptions: [
          'Split Horizon',
          'Dijkstra Shortest Path First',
          'Designated Router Election',
          'Autonomous System Prepending'
        ],
        correctOptionIndex: 0
      },
      {
        id: 'igp-2',
        title: '2. Multi-Area OSPF, LSA Types (1–5) & Stub Area Optimization',
        time: '75m',
        completed: false,
        theory: 'OSPFv2 (IP Protocol 89) organizes networks into a two-tier hierarchy anchored by Area 0 (Backbone). Routers within an area share an identical Link-State Database (LSDB) built from LSAs: Type 1 (Router), Type 2 (Network DR), Type 3 (ABR Summary), Type 4 (ASBR Summary), and Type 5 (External). Stub and Totally Stubby areas block external/summary LSAs to save memory.',
        packetAnatomy: [
          { field: 'LSA Type 1 & 2', value: 'Intra-Area (O)', desc: 'Flooded strictly within the originating area; runs full SPF' },
          { field: 'LSA Type 3', value: 'Inter-Area (O IA)', desc: 'Generated by ABR to advertise prefixes between areas' },
          { field: 'LSA Type 5', value: 'External (O E1/E2)', desc: 'Generated by ASBR for routes redistributed into OSPF' },
          { field: 'Totally Stubby', value: 'Blocks LSA 3, 4, 5', desc: 'Replaces external and inter-area routes with a single 0.0.0.0/0 default route' }
        ],
        cliConfig: `ABR-Router(config)# router ospf 1
ABR-Router(config-router)# router-id 1.1.1.1
ABR-Router(config-router)# network 10.0.0.0 0.0.0.3 area 0
ABR-Router(config-router)# network 192.168.20.0 0.0.0.255 area 20
ABR-Router(config-router)# area 20 stub no-summary`,
        quizQuestion: 'In a Multi-Area OSPF design, all non-backbone areas (such as Area 10 and Area 20) must connect directly to which area?',
        quizOptions: [
          'Area 255',
          'Area 0 (The Backbone Area)',
          'Area 1',
          'Any Stub Area'
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'bgp-wan',
    tag: 'Global BGP & WAN',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    title: 'Global Internet Routing: eBGP / iBGP Path Attributes & MPLS',
    description: 'Architect global ISP interconnections, manipulate BGP Path Attributes (Weight, Local-Pref, AS-Path, MED), and understand MPLS labels.',
    duration: '4h 30m',
    modules: [
      {
        id: 'bgp-1',
        title: '1. Inter-Domain BGP-4 Peering & Path Selection Attributes',
        time: '85m',
        completed: false,
        theory: 'Border Gateway Protocol (BGP-4, TCP Port 179) interconnects Autonomous Systems across the global Internet. eBGP peers across different ASNs (TTL=1, AD=20), whereas iBGP peers within the same ASN (AD=200, requires full mesh or Route Reflectors due to iBGP Split-Horizon). BGP selects best paths via: Highest Weight -> Highest Local-Pref -> Locally Originated -> Shortest AS-Path -> Lowest Origin -> Lowest MED.',
        packetAnatomy: [
          { field: '1. Weight', value: 'Cisco Local Only', desc: 'Highest wins (0–65535); never advertised to any BGP neighbor' },
          { field: '2. Local-Pref', value: 'Intra-AS Outbound', desc: 'Highest wins (default 100); controls how traffic leaves your AS' },
          { field: '3. AS-Path', value: 'Inter-AS Inbound', desc: 'Shortest AS_PATH wins; AS-Path Prepending steers inbound return traffic' },
          { field: '4. MED (Metric)', value: 'Lowest Wins', desc: 'Suggests preferred entry point to a directly connected neighboring AS' }
        ],
        cliConfig: `ISP-Edge(config)# route-map OUTBOUND_PREF permit 10
ISP-Edge(config-route-map)# set local-preference 200
ISP-Edge(config)# route-map INBOUND_PREPEND permit 10
ISP-Edge(config-route-map)# set as-path prepend 65001 65001 65001
ISP-Edge(config)# router bgp 65001
ISP-Edge(config-router)# neighbor 203.0.113.2 remote-as 65002`,
        quizQuestion: 'Which technique is commonly used by network engineers to make a backup ISP link look less attractive to external Autonomous Systems for INBOUND traffic?',
        quizOptions: [
          'Increasing the OSPF Hello interval',
          'AS-Path Prepending (repeating your own ASN multiple times outbound)',
          'Setting Cisco Weight to 65535',
          'Enabling PortFast on the WAN interface'
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'multicast',
    tag: 'IP Multicast',
    tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    title: 'Multicast Routing: IGMPv2/v3, DVMRP & PIM Sparse-Mode',
    description: 'Master Class D multicast addressing, Layer-2 multicast MAC mapping, Reverse Path Forwarding (RPF), and PIM trees.',
    duration: '3h 10m',
    modules: [
      {
        id: 'mcast-1',
        title: '1. Multicast Addressing, RPF Check, DVMRP & PIM-SM Trees',
        time: '65m',
        completed: false,
        theory: 'Multicast sends a single stream to interested receivers in Class D (224.0.0.0–239.255.255.255). Layer-2 Ethernet maps the low-order 23 bits of the IPv4 multicast group into MAC prefix 01:00:5E:xx:xx:xx. Routers use DVMRP (Flood-and-Prune Distance-Vector) or PIM Sparse-Mode (explicit join toward a Rendezvous Point RP) and validate every packet via an RPF check against the unicast routing table.',
        packetAnatomy: [
          { field: 'L2 Multicast MAC', value: '01-00-5E + 23 bits', desc: '32 multicast IPv4 groups map to 1 multicast MAC (5 bits lost)' },
          { field: 'IGMPv2 / IGMPv3', value: 'Host <-> Router', desc: 'Hosts send Membership Reports to join multicast groups on a LAN' },
          { field: 'DVMRP', value: 'Flood & Prune', desc: 'Builds Source-Based Trees using distance-vector reverse path flooding' },
          { field: 'PIM Sparse-Mode', value: 'RP Shared Tree (*,G)', desc: 'Receivers join the Rendezvous Point first, then switch to SPT (S,G)' }
        ],
        cliConfig: `Router-01(config)# ip multicast-routing
Router-01(config)# ip pim rp-address 10.0.0.1
Router-01(config)# interface gigabitEthernet 0/0
Router-01(config-if)# ip pim sparse-mode
Router-01(config-if)# ip igmp version 3
Router-01# show ip mroute`,
        quizQuestion: 'When mapping a 32-bit IPv4 Class D multicast address into an IEEE 802.3 Ethernet multicast MAC address (01:00:5E:...), how many bits of the IP address are mapped?',
        quizOptions: [
          'All 32 bits are mapped 1-to-1',
          'The lower 23 bits are mapped (causing a 32:1 address ambiguity)',
          'Only the first 8 bits are mapped',
          '48 bits are mapped'
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'transport-nat',
    tag: 'Transport, NAT & QoS',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    title: 'TCP/UDP Transport Internals, NAT/PAT & DiffServ QoS',
    description: 'Deep dive into TCP sliding windows, congestion control, PAT port translation, and DiffServ DSCP traffic prioritization.',
    duration: '3h 00m',
    modules: [
      {
        id: 'l4-1',
        title: '1. TCP Sliding Window, MSS Clamping & PAT Overload',
        time: '60m',
        completed: false,
        theory: 'TCP guarantees reliable delivery using sequence numbers, cumulative ACKs, and a dynamic Sliding Window controlled by receiver buffer space (rwnd) and network congestion (cwnd: Slow Start & Congestion Avoidance). At the network edge, Port Address Translation (PAT / NAT Overload) maps thousands of private RFC 1918 hosts to a single public IP by tracking unique 16-bit TCP/UDP source port numbers.',
        packetAnatomy: [
          { field: 'TCP 3-Way Handshake', value: 'SYN -> SYN/ACK -> ACK', desc: 'Establishes Initial Sequence Numbers (ISN) and Maximum Segment Size' },
          { field: 'Sliding Window', value: 'Bytes in Flight', desc: 'Number of unacknowledged bytes sender can transmit before pausing' },
          { field: 'PAT Overload', value: 'IP + Port Tuple', desc: 'Uses unique source port numbers (1024–65535) to multiplex flows' },
          { field: 'DiffServ QoS', value: 'DSCP EF (46)', desc: 'Expedited Forwarding in IPv4 ToS byte prioritizes real-time VoIP packets' }
        ],
        cliConfig: `Router-01(config)# access-list 1 permit 192.168.1.0 0.0.0.255
Router-01(config)# ip nat inside source list 1 interface gig0/1 overload
Router-01(config)# interface tunnel 0
Router-01(config-if)# ip mtu 1400
Router-01(config-if)# ip tcp adjust-mss 1360`,
        quizQuestion: 'How does PAT (NAT Overload) distinguish between multiple internal workstations simultaneously browsing the web through a single public WAN IPv4 address?',
        quizOptions: [
          'By rewriting the MAC address in the BGP table',
          'By assigning and tracking unique 16-bit TCP/UDP source port numbers in the NAT translation table',
          'By putting each workstation into a different OSPF area',
          'By disabling the TCP 3-way handshake'
        ],
        correctOptionIndex: 1
      }
    ]
  }
];

function Learn() {
  const [courses, setCourses] = useState<CourseTrack[]>(() => {
    const saved = localStorage.getItem('netforge_courses_pure_net');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('netforge_courses_pure_net', JSON.stringify(networkingCoursesData));
    return networkingCoursesData;
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0].id);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ status: 'correct' | 'wrong' | null; msg: string }>({ status: null, msg: '' });
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('netforge_courses_pure_net', JSON.stringify(courses));
  }, [courses]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const currentModule = selectedCourse.modules[selectedModuleIndex] || selectedCourse.modules[0];

  const calculateProgress = (course: CourseTrack) => {
    if (!course.modules.length) return 0;
    const done = course.modules.filter(m => m.completed).length;
    return Math.round((done / course.modules.length) * 100);
  };

  const handleCheckQuiz = () => {
    if (selectedQuizAnswer === null) return;

    if (selectedQuizAnswer === currentModule.correctOptionIndex) {
      if (!currentModule.completed) {
        const updatedCourses = courses.map(course => {
          if (course.id === selectedCourse.id) {
            const updatedMods = course.modules.map((mod, idx) =>
              idx === selectedModuleIndex ? { ...mod, completed: true } : mod
            );
            return { ...course, modules: updatedMods };
          }
          return course;
        });
        setCourses(updatedCourses);

        const currentXp = Number(localStorage.getItem('netforge_xp') || 4850);
        localStorage.setItem('netforge_xp', String(currentXp + 75));
      }

      setQuizFeedback({
        status: 'correct',
        msg: '🎉 Correct! Module marked as Completed (+75 XP added to your Network Engineering profile).'
      });
    } else {
      setQuizFeedback({
        status: 'wrong',
        msg: '✗ Incorrect answer. Review the networking theory and protocol anatomy table above and try again.'
      });
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalModulesCount = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const completedModulesCount = courses.reduce((acc, c) => acc + c.modules.filter(m => m.completed).length, 0);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/60 flex flex-col justify-between h-screen shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400 mb-10 tracking-widest uppercase">Netforge</h1>
          
          <nav className="space-y-1">
            <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Dashboard
            </Link>
            <Link to="/lab" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Network Lab
            </Link>
            <Link to="/challenges" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Challenges
            </Link>
            <Link to="/learn" className="flex items-center gap-3 text-white bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50 font-medium">
              Learn
            </Link>
            <Link to="/networks" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-4">
              My Networks
            </Link>
            <Link to="/progress" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors">
              Progress
            </Link>
            <Link to="/settings" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/30 px-4 py-2.5 rounded-lg transition-colors mt-4">
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            Z
          </div>
          <div>
            <h4 className="text-white font-medium text-sm leading-tight">Zain</h4>
            <p className="text-xs text-slate-500 mt-0.5">Network Engineering<br/>Student</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto h-screen">
        
        <header className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                100% Pure Network Engineering
              </span>
              <span className="text-[11px] font-mono text-slate-500">Topologies • L2/L3 Protocols • Global BGP • Multicast</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">Network Engineering Academy</h2>
            <p className="text-slate-400 text-sm">Master physical/logical topologies, IPv4/IPv6 subnetting, switching, OSPF, BGP, and multicast routing.</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 px-5 py-3 rounded-xl flex items-center gap-5">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lessons Mastered</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">{completedModulesCount} / {totalModulesCount}</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800"></div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quiz Reward</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">+75 XP</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search networking topics (e.g., Mesh, OSPF, BGP, VLAN)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {filteredCourses.map((course) => {
                const isSelected = selectedCourse.id === course.id;
                const progress = calculateProgress(course);

                return (
                  <div 
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSelectedModuleIndex(0);
                      setSelectedQuizAnswer(null);
                      setQuizFeedback({ status: null, msg: '' });
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-sm ${
                      isSelected 
                        ? 'bg-slate-800/70 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.12)]' 
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${course.tagColor}`}>
                        {course.tag}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{course.duration}</span>
                    </div>
                    
                    <h3 className="text-white font-bold text-sm mb-3 leading-snug">{course.title}</h3>
                    
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                        <span>{course.modules.length} Networking Modules</span>
                        <span className="text-cyan-400 font-mono font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-400' : 'bg-cyan-500'}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-800">
                <div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-md border inline-block mb-2 ${selectedCourse.tagColor}`}>
                    {selectedCourse.tag}
                  </span>
                  <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">Track Completion</div>
                  <div className="text-xl font-bold text-cyan-400">{calculateProgress(selectedCourse)}%</div>
                </div>
              </div>

              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Select Lesson Module:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-8">
                {selectedCourse.modules.map((mod, idx) => {
                  const isActiveMod = idx === selectedModuleIndex;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setSelectedModuleIndex(idx);
                        setSelectedQuizAnswer(null);
                        setQuizFeedback({ status: null, msg: '' });
                        setCopiedCli(false);
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isActiveMod
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          mod.completed 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : isActiveMod
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                        }`}>
                          {mod.completed ? '✓' : idx + 1}
                        </span>
                        <span className="text-xs font-semibold line-clamp-1">{mod.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{mod.time}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-cyan-400">{currentModule.title}</h3>
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                    currentModule.completed 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  }`}>
                    {currentModule.completed ? '● Completed' : '○ In Progress'}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentModule.theory}
                </p>
              </div>

              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                🔬 Protocol & Architecture Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentModule.packetAnatomy.map((item, i) => (
                  <div key={i} className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono font-bold text-white">{item.field}</span>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  💻 Cisco IOS Configuration Reference
                </h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentModule.cliConfig);
                    setCopiedCli(true);
                  }}
                  className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  {copiedCli ? '✓ Copied!' : 'Copy CLI Commands'}
                </button>
              </div>
              <div className="bg-black/90 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 leading-relaxed mb-8 overflow-x-auto">
                <pre>{currentModule.cliConfig}</pre>
              </div>

              {/* Quiz */}
              <div className="bg-slate-950/90 border-2 border-blue-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                    🧠 Network Engineering Knowledge Check
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">+75 XP Reward</span>
                </div>

                <p className="text-sm font-semibold text-white mb-4">
                  {currentModule.quizQuestion}
                </p>

                <div className="space-y-2.5 mb-4">
                  {currentModule.quizOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedQuizAnswer(idx)}
                      className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-3 ${
                        selectedQuizAnswer === idx
                          ? 'bg-blue-600/20 border-cyan-400 text-white'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        selectedQuizAnswer === idx ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold' : 'border-slate-600'
                      }`}>
                        {selectedQuizAnswer === idx ? '✓' : ''}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handleCheckQuiz}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                  >
                    Verify Answer & Complete Lesson
                  </button>

                  {selectedModuleIndex < selectedCourse.modules.length - 1 && (
                    <button
                      onClick={() => {
                        setSelectedModuleIndex(selectedModuleIndex + 1);
                        setSelectedQuizAnswer(null);
                        setQuizFeedback({ status: null, msg: '' });
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
                    >
                      Next Lesson Module →
                    </button>
                  )}
                </div>

                {quizFeedback.status && (
                  <div className={`mt-4 p-3 rounded-xl border text-xs font-mono ${
                    quizFeedback.status === 'correct'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}>
                    {quizFeedback.msg}
                  </div>
                )}
              </div>

            </div>

            <div className="flex items-center justify-between pt-5 border-t border-slate-800/80">
              <div className="text-xs text-slate-400">
                Ready to build Star, Mesh, Spine-Leaf, or Global BGP networks?
              </div>
              <Link 
                to="/lab" 
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                🌐 Open Global Architecture Studio →
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Learn;