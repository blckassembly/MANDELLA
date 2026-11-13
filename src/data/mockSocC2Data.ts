// Module 4: SOC Command & Control (C2) Experience & Real-Time UI Data
// Owner: Senior Full-Stack Engineer & Principal UI/UX Architect

export interface SocKpiMetrics {
  attacksLiveTotal: number;
  attacksLiveByPlane: {
    ss7: number;
    diameter: number;
    sms: number;
    voiceSip: number;
    ixpDdos: number;
    simSwap: number;
  };
  fraudDollarsBlockedToday: number;
  meanTimeToMitigateSeconds: number;
  sovereignComplianceStatus: {
    isFullyCompliant: boolean;
    dataResidency: string;
    ramEnclavePurgeActive: boolean;
    hsmStatus: string;
  };
}

export interface SimSwapQuarantineItem {
  id: string;
  msisdn: string;
  imsi: string;
  imei: string;
  subscriberName: string;
  tier: 'VIP_CORPORATE' | 'RETAIL_HIGH_NET_WORTH' | 'STANDARD_PREPAID';
  riskScore: number; // 0.00 to 1.00
  swapTimestamp: string;
  elapsedSinceSwap: string;
  posAgent: string;
  cellLocation: string;
  flaggedReason: string;
  status: 'PENDING_TRIAGE' | 'FROZEN_HLR' | 'REVOKED_ESIM' | 'MFA_QUARANTINED' | 'ALLOWLISTED';
  lossAtRiskUsd: number;
  auditTrail: string[];
}

export interface EntityGraphNode {
  id: string;
  label: string;
  type: 'SUBSCRIBER' | 'SIM_ICCID' | 'IMEI_CHASSIS' | 'CELL_TOWER' | 'POS_AGENT' | 'FINTECH_BANK';
  status: 'COMPROMISED' | 'SUSPECT' | 'VERIFIED_CLEAN';
  details: string;
  x: number;
  y: number;
}

export interface EntityGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  isThreatPath: boolean;
}

export interface SocMitigationPlaybook {
  id: string;
  name: string;
  description: string;
  targetPlane: 'RAN / IMEI' | 'Cell Tower / BTS' | 'IXP / BGP' | 'Voice / STIR';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  automatedRunTimeS: number;
  lastExecuted: string;
  executionSteps: string[];
  status: 'READY' | 'EXECUTING' | 'SUCCESS_ACTIVE';
}

export const INITIAL_SOC_KPIS: SocKpiMetrics = {
  attacksLiveTotal: 278,
  attacksLiveByPlane: {
    ss7: 42,
    diameter: 68,
    sms: 119,
    voiceSip: 34,
    ixpDdos: 3,
    simSwap: 12
  },
  fraudDollarsBlockedToday: 1428950,
  meanTimeToMitigateSeconds: 2.1,
  sovereignComplianceStatus: {
    isFullyCompliant: true,
    dataResidency: 'Republic of Kenya & Pan-African Sovereign Edge',
    ramEnclavePurgeActive: true,
    hsmStatus: 'Hardware FIPS 140-3 Level 4 Active'
  }
};

export const INITIAL_QUARANTINE_ITEMS: SimSwapQuarantineItem[] = [
  {
    id: 'QR-0941',
    msisdn: '+254 722 819201',
    imsi: '639010048192039',
    imei: '863920048192830',
    subscriberName: 'Safaricom Enterprise CFO Treasury Account',
    tier: 'VIP_CORPORATE',
    riskScore: 0.98,
    swapTimestamp: '18:58:14 UTC',
    elapsedSinceSwap: '1m 45s ago',
    posAgent: 'AG-NBO-8819 (Kimathi St)',
    cellLocation: 'Nairobi CBD (eNodeB-1049)',
    flaggedReason: 'Post-swap 86s Ecobank OTP burst followed by unauthorized web session from proxy ASN',
    status: 'PENDING_TRIAGE',
    lossAtRiskUsd: 145000,
    auditTrail: [
      '18:58:14 - POS Agent AG-NBO-8819 regenerated eSIM QR code',
      '18:59:40 - 4x Ecobank MFA OTP SMS requests received via SMPP',
      '19:00:15 - Flink correlation flagged POST_SWAP_300S_MFA_BURST (Risk 0.98)',
      '19:00:18 - Automatic SMS quarantine engaged; OTP holding in volatile memory'
    ]
  },
  {
    id: 'QR-0942',
    msisdn: '+254 733 910283',
    imsi: '639010077281920',
    imei: '869201882019482',
    subscriberName: 'Apex Logistics Fleet Director',
    tier: 'RETAIL_HIGH_NET_WORTH',
    riskScore: 0.91,
    swapTimestamp: '18:50:00 UTC',
    elapsedSinceSwap: '10m 00s ago',
    posAgent: 'AG-ELD-0021 (Eldoret)',
    cellLocation: 'Eldoret Highway (eNodeB-8840)',
    flaggedReason: 'Rapid IMEI rotation (3 devices in 10 mins) + Impossible Geodesic Velocity vector',
    status: 'FROZEN_HLR',
    lossAtRiskUsd: 42000,
    auditTrail: [
      '18:50:00 - Physical SIM swap executed at Eldoret Branch',
      '18:54:10 - RAN attach in Eldoret',
      '18:55:02 - SS7 ULR request from Frankfurt GT in 52s (456,000 km/h)',
      '18:55:04 - One-click HLR profile freeze executed by SOC operator'
    ]
  },
  {
    id: 'QR-0943',
    msisdn: '+254 710 449201',
    imsi: '639010091823901',
    imei: '358920192837411',
    subscriberName: 'East African Port Authority Operations Lead',
    tier: 'VIP_CORPORATE',
    riskScore: 0.15,
    swapTimestamp: '17:30:00 UTC',
    elapsedSinceSwap: '1h 30m ago',
    posAgent: 'AG-MSA-0012 (Mombasa Port)',
    cellLocation: 'Mombasa Port (gNodeB-2201)',
    flaggedReason: 'Routine corporate SIM upgrade with physical biometric face match verification',
    status: 'ALLOWLISTED',
    lossAtRiskUsd: 0,
    auditTrail: [
      '17:30:00 - Biometric facial verification authenticated at Mombasa store',
      '17:32:00 - Clean 5G SA attach with STIR/SHAKEN Level A verification',
      '17:33:00 - Cleared and whitelisted by AI verification engine'
    ]
  }
];

export const INITIAL_GRAPH_NODES: EntityGraphNode[] = [
  {
    id: 'SUB_01',
    label: '+254 722 819201',
    type: 'SUBSCRIBER',
    status: 'COMPROMISED',
    details: 'VIP Corporate Treasury Account · MSISDN',
    x: 280,
    y: 160
  },
  {
    id: 'SIM_01',
    label: 'ICCID 892540192844',
    type: 'SIM_ICCID',
    status: 'COMPROMISED',
    details: 'eSIM QR Profile · Re-provisioned via POS',
    x: 480,
    y: 80
  },
  {
    id: 'POS_01',
    label: 'Agent AG-NBO-8819',
    type: 'POS_AGENT',
    status: 'SUSPECT',
    details: 'Retail Agent · 4 overrides today',
    x: 700,
    y: 80
  },
  {
    id: 'IMEI_01',
    label: 'IMEI 863920048192830',
    type: 'IMEI_CHASSIS',
    status: 'COMPROMISED',
    details: 'Tecno Spark 10 · Hardware TAC flagged',
    x: 480,
    y: 240
  },
  {
    id: 'TOWER_01',
    label: 'Cell eNB-1049 (NBO CBD)',
    type: 'CELL_TOWER',
    status: 'SUSPECT',
    details: 'Sector 2 · High SIM-swap density',
    x: 700,
    y: 240
  },
  {
    id: 'BANK_01',
    label: 'Ecobank Kenya MFA',
    type: 'FINTECH_BANK',
    status: 'VERIFIED_CLEAN',
    details: 'Target Financial Entity · $145,000 transfer queued',
    x: 100,
    y: 160
  }
];

export const INITIAL_GRAPH_EDGES: EntityGraphEdge[] = [
  {
    id: 'E1',
    source: 'SUB_01',
    target: 'SIM_01',
    label: 'BOUND_TO_ESIM',
    isThreatPath: true
  },
  {
    id: 'E2',
    source: 'SIM_01',
    target: 'POS_01',
    label: 'REPROVISIONED_BY',
    isThreatPath: true
  },
  {
    id: 'E3',
    source: 'SUB_01',
    target: 'IMEI_01',
    label: 'ACTIVE_CHASSIS',
    isThreatPath: true
  },
  {
    id: 'E4',
    source: 'IMEI_01',
    target: 'TOWER_01',
    label: 'ATTACHED_RADIO',
    isThreatPath: true
  },
  {
    id: 'E5',
    source: 'BANK_01',
    target: 'SUB_01',
    label: 'MFA_DISPATCH_INTERCEPTED',
    isThreatPath: true
  }
];

export const INITIAL_PLAYBOOKS: SocMitigationPlaybook[] = [
  {
    id: 'PLAYBOOK_BLOCK_IMEI_CONTINENT_WIDE',
    name: 'Block IMEI Continent-Wide (GSMA EIR Sync)',
    description: 'Broadcasts immediate TAC/IMEI blacklist command to all Pan-African 5G-EIR registries and cancels active radio bearers in < 1.8 seconds.',
    targetPlane: 'RAN / IMEI',
    severity: 'CRITICAL',
    automatedRunTimeS: 1.8,
    lastExecuted: '4 mins ago',
    executionSteps: [
      '1. Validate IMEI against Central EIR Master Database',
      '2. Send S13 Cancel-Bearer to active MME/AMF',
      '3. Replicate Blacklist Entry to Pan-African GSMA EIR peer nodes',
      '4. Quarantine associated IMSI and alert customer care desk'
    ],
    status: 'READY'
  },
  {
    id: 'PLAYBOOK_ISOLATE_SIMBOX_CLUSTER',
    name: 'Isolate SIM-Box Cluster & Invalidate IMSIs',
    description: 'Instructs eNodeB to sever radio bearers for stationary IMSI clusters exhibiting zero Timing Advance variance and flags retail distributor ICCID batch.',
    targetPlane: 'Cell Tower / BTS',
    severity: 'CRITICAL',
    automatedRunTimeS: 2.4,
    lastExecuted: '22 mins ago',
    executionSteps: [
      '1. Identify all IMSIs attached to suspect Cell-ID with TA variance < 0.01km',
      '2. Issue batch S6a_CLR (Cancel-Location) with cause code "Subscription Withdrawn"',
      '3. Blacklist SIM ICCID series in HLR/UDM',
      '4. Generate Law Enforcement Geolocation Evidence Docket'
    ],
    status: 'READY'
  },
  {
    id: 'PLAYBOOK_BGP_FLOWSPEC_BLACKHOLE',
    name: 'BGP FlowSpec Automated Blackhole / Rate-Limit',
    description: 'Synthesizes RFC 8955 BGP FlowSpec rule via GoBGP gRPC to drop volumetric UDP/GTP-U flood prefixes at peer IXP border routers.',
    targetPlane: 'IXP / BGP',
    severity: 'HIGH',
    automatedRunTimeS: 1.1,
    lastExecuted: '1 hour ago',
    executionSteps: [
      '1. Aggregate NetFlow v9 prefix flood telemetry',
      '2. Generate GoBGP gRPC FlowSpec announcement: match destination port + packet length',
      '3. Push to KIXP, JINX, and IXPN route reflectors',
      '4. Verify zero packet transit on carrier peering border interfaces'
    ],
    status: 'READY'
  },
  {
    id: 'PLAYBOOK_STIR_SHAKEN_DNO_INJECT',
    name: 'Inject Spoofed CLI to National DNO Registry',
    description: 'Locks down outbound and transit SBCs against high-velocity Wangiri or IRSF spoofed calling line identification numbers.',
    targetPlane: 'Voice / STIR',
    severity: 'HIGH',
    automatedRunTimeS: 0.9,
    lastExecuted: '12 mins ago',
    executionSteps: [
      '1. Extract originating CLI from Wangiri storm detector',
      '2. Inject number into Redis National DNO Cache cluster',
      '3. Push policy update to STI-VS verification proxies with Attestation Level REJECT',
      '4. Return SIP 603 Decline or 403 Forbidden to ingress trunks'
    ],
    status: 'READY'
  }
];
