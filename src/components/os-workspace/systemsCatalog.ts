import { SystemCatalogEntry, DeploymentStageItem, OsNotificationItem, EngineeringLogEntry } from './types';

export const SYSTEMS_18_CATALOG: SystemCatalogEntry[] = [
  {
    number: '01',
    id: 'sys_01_numbers',
    name: 'Number Management',
    category: 'CONNECT',
    availability: 'mvp',
    shortDesc: 'Pan-African 54-country ITU E.164 inventory, regulatory compliance, MNP porting, and eSIM attestation.',
    inspectorTitle: 'NUMBERING INSPECTOR',
    workflowId: 'WF-38 / SYSTEM 01',
    legacyProduct: 'nms_numbers',
    components: [
      { name: 'ITU REGISTRY ENGINE', role: '54 sovereign country numbering plans & local area codes' },
      { name: 'RESERVATION LOCKS', role: '15-minute atomic inventory hold & assignment' },
      { name: 'MNP & COMPLIANCE', role: 'Clearinghouse porting & GSMA SGP.22 eSIM certificates' }
    ],
    dependencies: ['SYSTEM 16 IDENTITY', 'SYSTEM 04 SIP CORE', 'SYSTEM 08 DATAVERSE'],
    statusMetrics: [
      { key: 'COUNTRIES INDEXED', value: '54 African Nations' },
      { key: 'ACTIVE DIDS', value: '42,850' },
      { key: 'E.164 ALLOCATION', value: 'Ready' },
      { key: 'KYC GATE', value: 'Verified (Tier 3)' }
    ]
  },
  {
    number: '02',
    id: 'sys_02_messaging',
    name: 'Messaging Gateway',
    category: 'CONNECT',
    availability: 'mvp',
    shortDesc: 'Direct SMPP v5 binds, transactional OTP delivery, and native SIGTRAN USSD workflows.',
    inspectorTitle: 'MESSAGING INSPECTOR',
    workflowId: 'WF-38 / SYSTEM 02',
    legacyProduct: 'messaging_sms',
    components: [
      { name: 'SMPP V5 BROKER', role: 'Carrier-grade async bind pool (1,500 MPS)' },
      { name: 'USSD SESSION CORE', role: 'Menu state machine for feature phones (*xxx#)' },
      { name: 'DLR TELEMETRY', role: 'Delivery receipt tracing & automated route failover' }
    ],
    dependencies: ['SYSTEM 01 NUMBERS', 'SYSTEM 05 CARRIER ROUTING', 'SYSTEM 17 FRAUD'],
    statusMetrics: [
      { key: 'DIRECT BINDS', value: '89 Carrier Binds' },
      { key: 'DELIVERY RATE', value: '98.4%' },
      { key: 'USSD LATENCY', value: '42 ms' },
      { key: 'SMPP PROTOCOL', value: 'v5.0 Active' }
    ]
  },
  {
    number: '03',
    id: 'sys_03_voice_ivr',
    name: 'Voice & IVR',
    category: 'CONNECT',
    availability: 'mvp',
    shortDesc: 'FreeSWITCH media cluster supporting 50 African languages neural ASR/TTS and visual IVR callflows.',
    inspectorTitle: 'VOICE MEDIA INSPECTOR',
    workflowId: 'WF-38 / SYSTEM 03',
    legacyProduct: 'voice_ivr',
    components: [
      { name: 'FREESWITCH CLUSTER', role: 'Concurrent call media anchoring & DTMF capture' },
      { name: 'NEURAL ASR / TTS', role: '50 African language acoustic & speech models' },
      { name: 'VISUAL IVR BUILDER', role: 'Low-latency multilingual voice prompt orchestration' }
    ],
    dependencies: ['SYSTEM 01 NUMBERS', 'SYSTEM 04 SIP CORE', 'SYSTEM 07 COMPUTE'],
    statusMetrics: [
      { key: 'CONCUR. CHANNELS', value: '4,280' },
      { key: 'LANGUAGES', value: '50 African Models' },
      { key: 'MOS SCORE', value: '4.38 / 5.0' },
      { key: 'MEDIA ENGINE', value: 'FreeSWITCH 1.10' }
    ]
  },
  {
    number: '04',
    id: 'sys_04_sip_sbc',
    name: 'SIP Core & SBC',
    category: 'TELECOM',
    availability: 'mvp',
    shortDesc: 'Kamailio SBC, FreeSWITCH call applications, and RTPEngine media relay across 6 African PoPs.',
    inspectorTitle: 'CONNECTION INSPECTOR',
    workflowId: 'WF-38 / SYSTEM 04',
    legacyProduct: 'sbc_core',
    components: [
      { name: 'KAMAILIO SBC', role: 'SIP signaling, authentication, routing' },
      { name: 'FREESWITCH', role: 'Call applications, transcoding' },
      { name: 'RTPENGINE', role: 'Media relay, NAT traversal, SRTP handling' }
    ],
    dependencies: ['SYSTEM 01 NUMBERS', 'SYSTEM 07 COMPUTE', 'SYSTEM 15 NETWORK'],
    statusMetrics: [
      { key: 'ENTERPRISE PBX', value: 'TLS Trunk Ready' },
      { key: 'SIP ENDPOINT', value: 'sip.mandela.africa' },
      { key: 'TRANSPORT', value: 'TLS 1.3 / SRTP' },
      { key: 'ACTIVE POPS', value: '6 African Anycast' }
    ]
  },
  {
    number: '05',
    id: 'sys_05_routing',
    name: 'Carrier Routing',
    category: 'TELECOM',
    availability: 'mvp',
    shortDesc: 'Dynamic LCR quality engine, SS7/SIGTRAN rate deck ingestion, and real-time Kafka CDR mediation.',
    inspectorTitle: 'ROUTING INSPECTOR',
    workflowId: 'WF-39 / SYSTEM 05',
    legacyProduct: 'interconnect',
    components: [
      { name: 'RATE DECK PARSER', role: '100+ carrier sheet normalization & margin check' },
      { name: 'LCR QUALITY ENGINE', role: 'ASR/ACD weighted route scoring & grey-route block' },
      { name: 'CDR MEDIATION', role: 'Real-time billing stream & settlement ledger' }
    ],
    dependencies: ['SYSTEM 04 SIP CORE', 'SYSTEM 08 STORAGE', 'SYSTEM 17 FRAUD'],
    statusMetrics: [
      { key: 'ACTIVE CARRIERS', value: '104 Direct' },
      { key: 'LCR HIT RATE', value: '99.98%' },
      { key: 'CDR PIPELINE', value: 'Kafka Streaming' },
      { key: 'ROUTE FAILOVER', value: '< 120 ms' }
    ]
  },
  {
    number: '06',
    id: 'sys_06_cpaas',
    name: 'Programmable CPaaS',
    category: 'TELECOM',
    availability: 'mvp',
    shortDesc: 'Visual NCCO callflow studio, natural-language AI voice agents, and carrier-agnostic provider registry.',
    inspectorTitle: 'CPAAS INSPECTOR',
    workflowId: 'WF-40 / SYSTEM 06',
    components: [
      { name: 'WORKFLOW BUILDER', role: 'Visual node-based NCCO call & SMS automation' },
      { name: 'AI AGENT STUDIO', role: 'Natural language telecom agents & tool hooks' },
      { name: 'PROVIDER ADAPTERS', role: 'Carrier-agnostic outbound SIP/SMPP/API connectors' }
    ],
    dependencies: ['SYSTEM 03 VOICE & IVR', 'SYSTEM 02 MESSAGING', 'SYSTEM 18 CRYPTO/CMD'],
    statusMetrics: [
      { key: 'WORKFLOW ENGINE', value: 'NCCO v2 Active' },
      { key: 'AI AGENTS', value: '4 Active Profiles' },
      { key: 'WEBHOOKS', value: 'Signed HMAC-SHA256' },
      { key: 'LATENCY', value: '18 ms edge' }
    ]
  },
  {
    number: '07',
    id: 'sys_07_compute',
    name: 'Compute Fabric',
    category: 'CLOUD',
    availability: 'mvp',
    shortDesc: 'Site compute VM & container orchestration, kernel process task manager, and regional edge scheduling.',
    inspectorTitle: 'COMPUTE INSPECTOR',
    workflowId: 'WF-41 / SYSTEM 07',
    components: [
      { name: 'EDGE NODE SCHEDULER', role: 'Clinic / campus workload placement (1 VM, 100 GB)' },
      { name: 'KERNEL TASK MONITOR', role: 'Live OS process CPU/RSS inspection & lifecycle control' },
      { name: 'POD AUTOSCALER', role: 'Kamailio & FreeSWITCH burst elasticity' }
    ],
    dependencies: ['SYSTEM 12 SOLAR POWER', 'SYSTEM 10 SATELLITE', 'SYSTEM 15 DATA CENTERS'],
    statusMetrics: [
      { key: 'SITE PROFILE', value: '1 VM · 100 GB NVMe' },
      { key: 'CORE UTILIZATION', value: '34.2% Nominal' },
      { key: 'KERNEL PROCESSES', value: '18 Daemons Active' },
      { key: 'UPTIME SLA', value: '99.99%' }
    ]
  },
  {
    number: '08',
    id: 'sys_08_storage',
    name: 'Object Storage & Databases',
    category: 'CLOUD',
    availability: 'mvp',
    shortDesc: 'MANDELA Sovereign Dataverse: multi-tenant schemas, immutable audit hashes, SQL studio, and file explorer.',
    inspectorTitle: 'STORAGE INSPECTOR',
    workflowId: 'WF-42 / SYSTEM 08',
    legacyProduct: 'dataverse',
    components: [
      { name: 'SOVEREIGN DATAVERSE', role: 'Tenant-isolated keyspaces & cryptographic record seals' },
      { name: 'SQL QUERY STUDIO', role: 'Read-only federated entity analytics & export' },
      { name: 'TELECOM FILE VAULT', role: 'Audio CDR archive & sovereign document storage' }
    ],
    dependencies: ['SYSTEM 07 COMPUTE', 'SYSTEM 16 IDENTITY', 'SYSTEM 18 CRYPTOGRAPHY'],
    statusMetrics: [
      { key: 'SCHEMAS LOADED', value: '14 Entities' },
      { key: 'KEYSPACES', value: '3 Sovereign' },
      { key: 'CDC PIPELINE', value: 'Kafka Synchronized' },
      { key: 'REPLICATION', value: '3x Multi-Region' }
    ]
  },
  {
    number: '09',
    id: 'sys_09_edge_cdn',
    name: 'Edge Network & CDN',
    category: 'CLOUD',
    availability: 'mvp',
    shortDesc: 'IXP eBPF/XDP line-rate packet scrubbing, Anycast DNS/CDN caching, and optical bypass guardrails.',
    inspectorTitle: 'EDGE NETWORK INSPECTOR',
    workflowId: 'WF-43 / SYSTEM 09',
    legacyProduct: 'edge_defense',
    components: [
      { name: 'EBPF / XDP SCRUBBER', role: '0.4ms inline DDoS mitigation at African IXPs' },
      { name: 'EDGE CACHE NODES', role: 'Local static asset & Workbox offline synchronization' },
      { name: 'OPTICAL BYPASS', role: 'Hardware failsafe SLA enforcement' }
    ],
    dependencies: ['SYSTEM 15 IXP', 'SYSTEM 04 SIP CORE', 'SYSTEM 17 FRAUD & SOC'],
    statusMetrics: [
      { key: 'SCRUBBING LATENCY', value: '0.4 ms' },
      { key: 'EDGE LOCATIONS', value: '12 African IXPs' },
      { key: 'WORKBOX CACHE', value: 'Offline Ready' },
      { key: 'PACKET DROP RATE', value: '0.001%' }
    ]
  },
  {
    number: '10',
    id: 'sys_10_satellite',
    name: 'Satellite Fleet',
    category: 'ORBIT',
    availability: 'mvp',
    shortDesc: '3GPP Rel-17 Direct-to-Cell LEO constellation telemetry, orbital beam footprints, and VSAT terminals.',
    inspectorTitle: 'SATELLITE INSPECTOR',
    workflowId: 'WF-09 / SYSTEM 10',
    legacyProduct: 'satellite_ntn',
    components: [
      { name: 'LEO BEAM TRACKER', role: 'Dynamic Doppler compensation & ephemeris tracking' },
      { name: 'NTN DIRECT-TO-CELL', role: '3GPP Rel-17 LTE/NR fallback for rural clinics' },
      { name: 'VSAT MARITIME / MINING', role: 'Dedicated high-throughput rural terminal links' }
    ],
    dependencies: ['SYSTEM 12 POWER', 'SYSTEM 11 OPTICAL GS'],
    statusMetrics: [
      { key: 'TARGET LINK', value: '20 Mbps Satellite-First' },
      { key: 'LEO PASS WINDOW', value: 'Simulated Active' },
      { key: 'EARTH STATIONS', value: '18 Cataloged' },
      { key: 'COVERAGE STATUS', value: 'Requires Site Verify' }
    ]
  },
  {
    number: '11',
    id: 'sys_11_optical_gs',
    name: 'Optical Ground Stations',
    category: 'ORBIT',
    availability: 'planned',
    shortDesc: 'Free-space optical ground stations with weather-aware conditional fallback to terrestrial backhaul.',
    inspectorTitle: 'OPTICAL GS INSPECTOR',
    workflowId: 'WF-45 / SYSTEM 11',
    components: [
      { name: 'OPTICAL LINK EVALUATOR', role: 'Cloud-cover attenuation & line-of-sight readiness' },
      { name: 'CONDITIONAL ROUTER', role: 'Auto-skip to System 14 Backhaul when unavailable' },
      { name: 'FEASIBILITY LOG', role: 'Candidate station selection & availability evidence' }
    ],
    dependencies: ['SYSTEM 10 SATELLITE', 'SYSTEM 14 FIBER BACKHAUL'],
    statusMetrics: [
      { key: 'INTEGRATION STATE', value: 'Planned (Demo Conditional)' },
      { key: 'SELECTED STATION', value: 'None — Route B Active' },
      { key: 'AVAILABILITY', value: 'Unverified' },
      { key: 'FALLBACK PATH', value: 'System 14 Backhaul' }
    ]
  },
  {
    number: '12',
    id: 'sys_12_solar',
    name: 'Solar Microgrid & BMS',
    category: 'GRID',
    availability: 'mvp',
    shortDesc: 'Rural clinic 2 kW solar photovoltaic microgrid sizing, 24-hour lithium BMS autonomy, and surge protection.',
    inspectorTitle: 'POWER INSPECTOR',
    workflowId: 'SYSTEM 12 / GRID',
    components: [
      { name: 'PV ARRAY PLANNER', role: '2 kW nominal solar generation & irradiance estimation' },
      { name: 'BATTERY MANAGEMENT', role: '24-hour continuous backup load protection' },
      { name: 'DC RECTIFIER', role: '48V telecom rack power bus' }
    ],
    dependencies: ['NONE — ROOT PREREQUISITE'],
    statusMetrics: [
      { key: 'PLANNED LOAD', value: '2 kW Continuous' },
      { key: 'AUTONOMY TARGET', value: '24 Hours Backup' },
      { key: 'STAGE PRIORITY', value: 'Stage 1 (Prerequisite)' },
      { key: 'STATUS', value: 'Demo Profile Loaded' }
    ]
  },
  {
    number: '13',
    id: 'sys_13_energy',
    name: 'Energy Orchestration',
    category: 'GRID',
    availability: 'planned',
    shortDesc: 'Automated load-shedding policies, generator failover telemetry, and cross-site grid balancing.',
    inspectorTitle: 'ENERGY INSPECTOR',
    workflowId: 'SYSTEM 13 / GRID',
    components: [
      { name: 'LOAD SHEDDING MATRIX', role: 'Prioritize life-safety voice & clinic compute' },
      { name: 'GENERATOR TELEMETRY', role: 'Diesel reserve alerting & hybrid charge dispatch' }
    ],
    dependencies: ['SYSTEM 12 SOLAR MICROGRID'],
    statusMetrics: [
      { key: 'INTEGRATION STATE', value: 'Planned Integration' },
      { key: 'POLICY MODE', value: 'Clinic Critical First' },
      { key: 'GRID SYNC', value: 'Islanded Microgrid' },
      { key: 'SLA TIER', value: 'Demo Planning' }
    ]
  },
  {
    number: '14',
    id: 'sys_14_fiber',
    name: 'Fiber OSP',
    category: 'FIBER',
    availability: 'planned',
    shortDesc: 'Outside-plant regional fiber backhaul feasibility, splice closures, and microwave/backhaul fallback.',
    inspectorTitle: 'FIBER BACKHAUL INSPECTOR',
    workflowId: 'SYSTEM 14 / FIBER',
    components: [
      { name: 'BACKHAUL FEASIBILITY', role: 'Conditional Route-B transport when Optical GS skipped' },
      { name: 'OSP TRENCH PLANNER', role: 'Metro-to-rural spur attenuation budgeting' }
    ],
    dependencies: ['SYSTEM 10 SATELLITE', 'SYSTEM 15 IXP'],
    statusMetrics: [
      { key: 'INTEGRATION STATE', value: 'Planned (Conditional)' },
      { key: 'ROUTE ROLE', value: 'Alternative Route-B' },
      { key: 'COVERAGE', value: 'Unverified' },
      { key: 'HANDOFF', value: 'System 07 Compute' }
    ]
  },
  {
    number: '15',
    id: 'sys_15_towers',
    name: 'Towers, Data Centers & IXP',
    category: 'FIBER',
    availability: 'planned',
    shortDesc: 'Continental IXP peering fabrics, regional Tier-3 colocation facilities, and tower colocation inventory.',
    inspectorTitle: 'IXP & COLO INSPECTOR',
    workflowId: 'SYSTEM 15 / FIBER',
    components: [
      { name: 'IXP PEERING MESH', role: 'JNB, NBO, LOS, CAI, DKR, FIH Anycast interconnects' },
      { name: 'COLO RACK INVENTORY', role: 'Power/cooling footprint per carrier PoP' }
    ],
    dependencies: ['SYSTEM 13 ENERGY', 'SYSTEM 14 FIBER OSP'],
    statusMetrics: [
      { key: 'CONTINENTAL POPS', value: '6 Primary Hubs' },
      { key: 'BGP ASN', value: 'AS37105 Sovereign' },
      { key: 'PEERING STATUS', value: 'Planned Expansion' },
      { key: 'SECURITY GATE', value: 'System 09 Edge' }
    ]
  },
  {
    number: '16',
    id: 'sys_16_identity',
    name: 'Identity & KYC',
    category: 'SECURE',
    availability: 'mvp',
    shortDesc: 'Sovereign enterprise & subscriber KYC verification, regulatory licenses, and RBAC attestation.',
    inspectorTitle: 'IDENTITY INSPECTOR',
    workflowId: 'SYSTEM 16 / SECURE',
    legacyProduct: 'nms_numbers',
    components: [
      { name: 'KYC REVIEW GATE', role: 'Operator business verification prior to line activation' },
      { name: 'SOVEREIGN LICENSES', role: 'National telecom authority license tracking' },
      { name: 'ACCESS CONTROL', role: 'Guided vs Expert & Multi-Tenant role isolation' }
    ],
    dependencies: ['SYSTEM 08 DATAVERSE', 'SYSTEM 18 CRYPTOGRAPHY'],
    statusMetrics: [
      { key: 'ATTESTATION', value: 'Level 3 Sovereign' },
      { key: 'PENDING REVIEWS', value: '1 Order (ORD-001)' },
      { key: 'RBAC POLICIES', value: 'Enforced' },
      { key: 'AUDIT HASH', value: 'SHA-256 Sealed' }
    ]
  },
  {
    number: '17',
    id: 'sys_17_fraud_soc',
    name: 'Fraud & SOC',
    category: 'SECURE',
    availability: 'mvp',
    shortDesc: '18-system OCSF SIEM ingestion, Apache Flink 15m correlation, RawNet3 deepfake voice defense & SOC C2.',
    inspectorTitle: 'SOC & FRAUD INSPECTOR',
    workflowId: 'SYSTEM 17 / SECURE',
    legacyProduct: 'soc_c2',
    components: [
      { name: 'SIEM FABRIC', role: 'Apache Flink 15-minute correlation & OCSF lakehouse' },
      { name: 'AI ANOMALY ENGINE', role: 'Geodesic velocity, SIM-box ST-GNN, RawNet3 audio' },
      { name: 'SOC COMMAND (C2)', role: 'Incident response & SIM-swap quarantine lockdown' }
    ],
    dependencies: ['SYSTEM 09 EDGE', 'SYSTEM 05 ROUTING', 'SYSTEM 16 IDENTITY'],
    statusMetrics: [
      { key: 'EVENT THROUGHPUT', value: '2.4M EPS (Simulated)' },
      { key: 'DEEPFAKE SCANNER', value: 'RawNet3 Ready' },
      { key: 'CONTAINMENT', value: '0 Uncontained' },
      { key: 'FINAL GATE', value: 'Stage 8 Security' }
    ]
  },
  {
    number: '18',
    id: 'sys_18_crypto_cmd',
    name: 'Cryptography, PKI & Unified Command',
    category: 'SECURE',
    availability: 'mvp',
    shortDesc: 'Golden Command orchestration engine, PKI keyspaces, Multi-AI API Gateway & MCP protocol server.',
    inspectorTitle: 'UNIFIED COMMAND INSPECTOR',
    workflowId: 'SYSTEM 18 / GOLDEN COMMAND',
    components: [
      { name: 'GOLDEN COMMAND', role: 'End-to-end 8-stage cross-system deployment planner' },
      { name: 'MULTI-AI & MCP', role: 'Unified API Gateway, SDK framework & tool orchestration' },
      { name: 'SOVEREIGN PKI', role: 'Tenant encryption keys & STIR/SHAKEN attestation' }
    ],
    dependencies: ['ALL 17 INFRASTRUCTURE SYSTEMS'],
    statusMetrics: [
      { key: 'ORCHESTRATION', value: 'Functional Demo' },
      { key: 'MCP GATEWAY', value: 'Protocol Active' },
      { key: 'STAGES MANAGED', value: '8 Sequential Gates' },
      { key: 'POLICY MODE', value: 'Simulation Safe' }
    ]
  }
];

export const DEFAULT_DEPLOYMENT_STAGES: DeploymentStageItem[] = [
  {
    stageNumber: 1,
    code: '12. POWER',
    systemNumber: 'System 12',
    title: 'Site Power & Protection',
    subtitle: '2 kW solar microgrid & 24h BMS backup sizing',
    status: 'completed',
    objective: 'Establish 2 kW solar & 24-hour battery autonomy baseline for rural clinic rack.',
    requiredInputs: 'Daily kWh load profile, battery autonomy hours, surge protection spec.',
    prerequisites: 'None (Root infrastructure prerequisite).',
    feasibility: 'Simulated baseline valid',
    resources: '2 kW PV + 24h LiFePO4 BMS (Demo)'
  },
  {
    stageNumber: 2,
    code: '10. SATELLITE',
    systemNumber: 'System 10',
    title: 'Satellite Access & Link',
    subtitle: '20 Mbps satellite-first LEO primary backhaul',
    status: 'completed',
    objective: 'Evaluate 20 Mbps LEO satellite link availability and antenna placement.',
    requiredInputs: 'Site coordinates, clear-sky horizon scan, terminal serial.',
    prerequisites: 'System 12 site power confirmed.',
    feasibility: 'Conditional — coverage check required',
    resources: '1 LEO User Terminal (Demo)'
  },
  {
    stageNumber: 3,
    code: '11. OPTICAL',
    systemNumber: 'System 11',
    title: 'Optical Ground Station',
    subtitle: 'Assess proposed optical route (conditional)',
    status: 'in_planning',
    objective: 'Assess proposed optical route.',
    requiredInputs: 'Candidate station, service compatibility, availability evidence.',
    prerequisites: 'Satellite service assessment.',
    feasibility: 'Unverified',
    resources: 'None allocated.',
    note: 'Do not assume any optical link is available.'
  },
  {
    stageNumber: 4,
    code: '14. BACKHAUL',
    systemNumber: 'System 14',
    title: 'Backhaul Integration (Conditional)',
    subtitle: 'Alternative terrestrial/microwave Route-B fallback',
    status: 'conditional',
    objective: 'Provide resilient Route-B transport when Stage 3 Optical GS is skipped.',
    requiredInputs: 'Nearest PoP distance, carrier lease quote, latency budget.',
    prerequisites: 'System 10 Satellite or System 11 Optical evaluation.',
    feasibility: 'Route-B conditional ready',
    resources: 'Backup backhaul reservation (Demo)'
  },
  {
    stageNumber: 5,
    code: '07. COMPUTE',
    systemNumber: 'System 07',
    title: 'Site Compute & Platform',
    subtitle: '1 VM, 100 GB local clinic edge node',
    status: 'pending',
    objective: 'Provision clinic edge compute node for offline EMR & local caching.',
    requiredInputs: 'VM flavor (1 VM / 100 GB), Workbox cache manifest.',
    prerequisites: 'System 12 Power + System 10/14 Transport.',
    feasibility: 'Pending transport gate',
    resources: '1 Edge VM · 100 GB NVMe'
  },
  {
    stageNumber: 6,
    code: '01/04. NUMBER & SIP',
    systemNumber: 'Systems 01 & 04',
    title: 'Numbering & SIP Enablement',
    subtitle: '1 business number, Voice, SMS over TLS SIP trunk',
    status: 'pending',
    objective: 'Assign DRC local business number and bind TLS SIP trunk to Kamailio SBC.',
    requiredInputs: 'Selected E.164 DID, PBX TLS certificate, emergency route.',
    prerequisites: 'System 07 Compute + System 16 Identity.',
    feasibility: 'Pending compute readiness',
    resources: '1 DID · 1 TLS Trunk · Voice/SMS'
  },
  {
    stageNumber: 7,
    code: '16. IDENTITY',
    systemNumber: 'System 16',
    title: 'Identity & Access Control',
    subtitle: 'Clinic operator KYC & RBAC tenant isolation',
    status: 'pending',
    objective: 'Enforce organization identity attestation and least-privilege operator access.',
    requiredInputs: 'Clinic registration docs, authorized operator list.',
    prerequisites: 'System 08 Dataverse schema ready.',
    feasibility: 'Pending KYC verification',
    resources: 'Tenant Keyspace & RBAC Policy'
  },
  {
    stageNumber: 8,
    code: '17. SECURITY',
    systemNumber: 'System 17',
    title: 'Security Baseline & Policies',
    subtitle: 'SIEM ingestion, voice anomaly guardrails & firewall',
    status: 'pending',
    objective: 'Activate inline signaling firewall and continuous telemetry auditing.',
    requiredInputs: 'ACL baseline, STIR/SHAKEN keys, incident contacts.',
    prerequisites: 'Systems 01/04 Communications active.',
    feasibility: 'Pending communications stage',
    resources: 'Inline Scrubber + SIEM Feed'
  }
];

export const INITIAL_OS_NOTIFICATIONS: OsNotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Approval requested — Clinic plan v1',
    summary: 'Review and approve the planning package.',
    project: 'DRC Clinic Plan v1',
    stage: 'Service Coverage (Stage 3 of 8)',
    timestamp: '2025-01-24 10:35 UTC',
    tag: 'DEMO',
    unread: true,
    targetSection: 'golden_command'
  },
  {
    id: 'notif-02',
    title: 'Planning completed — Eight proposed stages',
    summary: 'The planning structure has been generated.',
    project: 'DRC Clinic Plan v1',
    stage: 'Stage Pipeline (8 stages)',
    timestamp: '2025-01-24 09:58 UTC',
    tag: 'DEMO',
    unread: true,
    targetSection: 'deployments'
  },
  {
    id: 'notif-03',
    title: 'Validation issue — Coverage requires verification',
    summary: 'The service coverage assumption needs verification before optical allocation.',
    project: 'DRC Clinic Plan v1',
    stage: 'Stage 3 — Optical Ground Station',
    timestamp: '2025-01-24 09:41 UTC',
    tag: 'ALERT',
    unread: false,
    targetSection: 'expert_console'
  },
  {
    id: 'notif-04',
    title: 'Project update — Draft saved',
    summary: 'Changes to DRC Clinic Plan v1 have been saved.',
    project: 'DRC Clinic Plan v1',
    stage: 'Golden Command Scenario',
    timestamp: '2025-01-24 09:27 UTC',
    tag: 'SYSTEM',
    unread: false,
    targetSection: 'desktop'
  }
];

export const INITIAL_ENGINEERING_LOGS: EngineeringLogEntry[] = [
  {
    timeUtc: '2025-03-01 10:14:21',
    level: 'INFO',
    component: 'orchestrator',
    message: 'Workflow started for deployment DEMO-001 (v2), system 11.'
  },
  {
    timeUtc: '2025-03-01 10:14:27',
    level: 'INFO',
    component: 'dependency',
    message: 'Evaluated conditional route: route-B (condition met).'
  },
  {
    timeUtc: '2025-03-01 10:14:32',
    level: 'WARN',
    component: 'workflow',
    message: 'Stage 3 skipped (demo stage, not executed).'
  },
  {
    timeUtc: '2025-03-01 10:14:38',
    level: 'INFO',
    component: 'workflow',
    message: 'Continue with alternative path: route-B.'
  },
  {
    timeUtc: '2025-03-01 10:14:51',
    level: 'INFO',
    component: 'orchestrator',
    message: 'Workflow completed (simulated). Coverage remains unverified.'
  }
];
