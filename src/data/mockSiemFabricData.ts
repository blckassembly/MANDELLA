// Module 2: 18-System SIEM Ingestion & Stateful Normalization Fabric
// Owner: Product Architect & Lead Data/Streaming Engineer
// Standard: OCSF (Open Cybersecurity Schema Framework) Telecom Extension v1.2
// Engine: Apache Flink 1.20 (Java 21 / RocksDB), ClickHouse Cluster, Memgraph, Apache Iceberg WORM

export interface SiemSourceConnector {
  id: number;
  name: string;
  category: 'Signaling & Edge' | 'Core & Mobility' | 'Radio & Access' | 'Business & Identity';
  protocol: string;
  epsRate: number;
  peakEpsRate: number;
  latencyMs: number;
  status: 'ACTIVE_HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  ocsfClass: string;
  lastNormalizedEvent: string;
  description: string;
}

export interface FlinkCorrelatedWindow {
  windowId: string;
  timeWindow: string; // e.g. "15-min Sliding Window"
  imsi: string;
  imei: string;
  msisdn: string;
  tmsi: string;
  guti: string;
  cgnatPrivateIp: string;
  publicIp: string;
  cellId: string;
  posAgentId?: string;
  stitchLatencyMs: number;
  correlationStatus: 'STITCHED' | 'CORRELATING' | 'IDENTITY_DISCREPANCY';
  riskScore: number;
  flags: string[];
}

export interface StorageTierMetric {
  tierName: 'Hot OLAP (ClickHouse)' | 'Entity Graph (Memgraph)' | 'Cold Compliance (Iceberg S3)';
  technology: string;
  retentionWindow: string;
  queryLatencyP99: string;
  currentIngestionRate: string;
  totalRecordsStored: string;
  storageCapacityUsed: string;
  encryptionStandard: string;
  complianceLevel: string;
}

export interface OcsfTelecomEventSample {
  eventUuid: string;
  timestampNs: number;
  timestampIso: string;
  sourceSystemId: number;
  sourceSystemName: string;
  eventName: string;
  imsi: string;
  imei: string;
  msisdn: string;
  cellId: string;
  srcIp: string;
  fraudLossEstimateUsd: number;
  rawPayloadSnippet: string;
  ocsfNormalizedJson: string;
}

export interface SiemAiShadowArtifact {
  path: string;
  language: 'protobuf' | 'java' | 'sql';
  responsibility: string;
  code: string;
}

export const INITIAL_SIEM_SOURCES: SiemSourceConnector[] = [
  // 1-5: Signaling & Edge
  {
    id: 1,
    name: 'SS7 STP Firewall',
    category: 'Signaling & Edge',
    protocol: 'SIGTRAN M3UA/SCTP',
    epsRate: 142000,
    peakEpsRate: 480000,
    latencyMs: 1.4,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_SIGNALING_SS7',
    lastNormalizedEvent: 'MAP_InsertSubscriberData blocked on Int Interconnect',
    description: 'GSMA FS.11 Category 1-3 packet filter at Nairobi Central STP'
  },
  {
    id: 2,
    name: 'Diameter DRA/DEA Firewall',
    category: 'Signaling & Edge',
    protocol: 'Diameter over TLS (SCTP)',
    epsRate: 198000,
    peakEpsRate: 620000,
    latencyMs: 1.2,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_SIGNALING_DIAMETER',
    lastNormalizedEvent: 'S6a_CancelLocation rejected from untrusted peer DEA',
    description: 'GSMA FS.19 DRA inspection proxy at Mombasa Peering Trunk'
  },
  {
    id: 3,
    name: 'SMS Firewall & Home Router',
    category: 'Signaling & Edge',
    protocol: 'SMPP v3.4 / MAP-MO',
    epsRate: 85000,
    peakEpsRate: 310000,
    latencyMs: 3.1,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_MESSAGING_SMS',
    lastNormalizedEvent: 'Simjacker 0x7F UDH envelope stripped; true IMSI virtualized',
    description: 'Binary OTA filter, A2P gray-route detector, and FastText smishing engine'
  },
  {
    id: 4,
    name: 'STIR/SHAKEN STI-VS & SBC',
    category: 'Signaling & Edge',
    protocol: 'SIP INVITE / RFC 8224 PASSporT',
    epsRate: 42000,
    peakEpsRate: 110000,
    latencyMs: 4.8,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_VOICE_VERIFICATION',
    lastNormalizedEvent: 'PASSporT signature validated with X.509 STI-CA (Level A)',
    description: 'Identity verification service and DNO national blacklist scrubber'
  },
  {
    id: 5,
    name: 'IXP DDoS Scrubber (Anycast)',
    category: 'Signaling & Edge',
    protocol: 'NetFlow v9 / IPFIX / BGP-FS',
    epsRate: 650000,
    peakEpsRate: 2400000,
    latencyMs: 0.8,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_NETWORK_FLOW_VOLUMETRIC',
    lastNormalizedEvent: 'eBPF/XDP kernel drop engaged on 48 Gbps GTP-U flood at KIXP',
    description: 'Multi-IXP Anycast scrubbing center with GoBGP FlowSpec sync'
  },

  // 6-10: Core & Mobility
  {
    id: 6,
    name: 'HLR / HSS / 5G-UDM',
    category: 'Core & Mobility',
    protocol: '3GPP MAP / S6a / Nudm HTTP2',
    epsRate: 115000,
    peakEpsRate: 380000,
    latencyMs: 2.1,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_SUBSCRIBER_DATABASE',
    lastNormalizedEvent: 'Active roaming state sync: IMSI 639010049102834 in Ke-West',
    description: 'Master subscriber authority storing true crypto keys and active VLR'
  },
  {
    id: 7,
    name: 'EIR / 5G-EIR Equipment Registry',
    category: 'Core & Mobility',
    protocol: 'Diameter S13 / N5g-eir HTTP2',
    epsRate: 68000,
    peakEpsRate: 220000,
    latencyMs: 1.9,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_DEVICE_REGISTRY',
    lastNormalizedEvent: 'Blacklisted stolen TAC 86392004 detected at eNodeB-771',
    description: 'Continent-wide IMEI device status (White/Grey/Blacklist) validator'
  },
  {
    id: 8,
    name: 'MSC / MME / 5G-AMF',
    category: 'Core & Mobility',
    protocol: 'S1-MME / N1-N2 NAS Signaling',
    epsRate: 220000,
    peakEpsRate: 750000,
    latencyMs: 2.4,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_MOBILITY_MANAGEMENT',
    lastNormalizedEvent: 'GUTI reallocation & TAU update for 48,200 active UEs',
    description: 'Mobility management entity tracking live attach/detach and paging'
  },
  {
    id: 9,
    name: 'SGW / PGW / 5G-UPF',
    category: 'Core & Mobility',
    protocol: 'GTPv2-C / GTP-U / PFCP',
    epsRate: 310000,
    peakEpsRate: 980000,
    latencyMs: 1.1,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_USER_PLANE',
    lastNormalizedEvent: 'Session established: TEID 0x8a91bc -> APN internet.ke.safarinet',
    description: 'Carrier user-plane and packet gateway anchoring IP sessions'
  },
  {
    id: 10,
    name: 'IMS / VoLTE SBC Core',
    category: 'Core & Mobility',
    protocol: 'SIP / SDP / SRTP',
    epsRate: 78000,
    peakEpsRate: 290000,
    latencyMs: 3.2,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_VOICE_CORE',
    lastNormalizedEvent: 'VoLTE SIP INVITE session with AMR-WB codec negotiated',
    description: 'Carrier-grade session border controller handling carrier voice interconnect'
  },

  // 11-12: Radio & Access
  {
    id: 11,
    name: 'RAN (eNodeB / gNodeB Clusters)',
    category: 'Radio & Access',
    protocol: 'O-RAN E2 / 3GPP Trace / CDR',
    epsRate: 440000,
    peakEpsRate: 1400000,
    latencyMs: 4.1,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_RADIO_ACCESS',
    lastNormalizedEvent: 'Cell-ID 639-01-20941 TA report: 0.12km variance across 42 UEs',
    description: 'Radio access network reporting Timing Advance, RSSI, and handover telemetry'
  },
  {
    id: 12,
    name: 'CGNAT & Gi-LAN Perimeter FW',
    category: 'Radio & Access',
    protocol: 'Syslog RFC 5424 / IPFIX NEL',
    epsRate: 520000,
    peakEpsRate: 1800000,
    latencyMs: 1.5,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_NETWORK_TRANSLATION_CGNAT',
    lastNormalizedEvent: 'NAT444 binding: 10.142.9.88:42100 -> 196.201.214.5:12880',
    description: 'Carrier-Grade NAT event logging mapping internal MSISDN IPs to public egress'
  },

  // 13-18: Business, Identity & Fraud Context
  {
    id: 13,
    name: 'CRM & Retail POS SIM-Swap Logs',
    category: 'Business & Identity',
    protocol: 'REST JSON / Apache Kafka CDC',
    epsRate: 12000,
    peakEpsRate: 45000,
    latencyMs: 8.4,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_IDENTITY_ACCOUNT_CHANGE',
    lastNormalizedEvent: 'eSIM QR profile regenerated by POS agent AG-NBO-8819',
    description: 'Point-of-sale customer service audit trail tracking physical and eSIM swaps'
  },
  {
    id: 14,
    name: 'Customer CIAM (Self-Care & App)',
    category: 'Business & Identity',
    protocol: 'OAuth2 / OpenID Connect / OCSF',
    epsRate: 28000,
    peakEpsRate: 95000,
    latencyMs: 5.2,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_IDENTITY_AUTHENTICATION',
    lastNormalizedEvent: 'Mobile Banking App biometrics step-up login via JA4 fingerprint',
    description: 'Customer digital identity portal logging logins, password resets, and MFA'
  },
  {
    id: 15,
    name: 'OCS & Real-Time Billing (CHF)',
    category: 'Business & Identity',
    protocol: 'Diameter Ro / Gy / 3GPP CHF',
    epsRate: 180000,
    peakEpsRate: 580000,
    latencyMs: 2.8,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_FINANCIAL_TRANSACTION_TELCO',
    lastNormalizedEvent: 'Prepaid wallet credit deduction for USSD M-PESA transaction',
    description: 'Online Charging System metering voice minutes, data bursts, and wallet balances'
  },
  {
    id: 16,
    name: 'Number Portability Database (NPDB)',
    category: 'Business & Identity',
    protocol: 'SQL Query / REST API CDC',
    epsRate: 8500,
    peakEpsRate: 30000,
    latencyMs: 6.9,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_TELECOM_NUMBER_PORTABILITY',
    lastNormalizedEvent: 'Routing Number (RN) updated for MSISDN +254 701 992834 -> LRN 63902',
    description: 'National centralized MNP registry indicating carrier ownership and porting state'
  },
  {
    id: 17,
    name: 'CTI Feeds (GSMA TIS & MISP)',
    category: 'Business & Identity',
    protocol: 'STIX 2.1 / TAXII v2 / MISP ZeroMQ',
    epsRate: 3500,
    peakEpsRate: 15000,
    latencyMs: 14.5,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_SECURITY_THREAT_INTELLIGENCE',
    lastNormalizedEvent: 'GSMA TIS Hotlist: Rogue Global Title +370 600 00192 flagged for IRSF',
    description: 'Global telecom threat intelligence feeding active blocklists and Wangiri ranges'
  },
  {
    id: 18,
    name: 'Enterprise PAM (Privileged Access)',
    category: 'Business & Identity',
    protocol: 'Syslog TLS / OpenTelemetry',
    epsRate: 4200,
    peakEpsRate: 18000,
    latencyMs: 7.1,
    status: 'ACTIVE_HEALTHY',
    ocsfClass: 'OCSF_SECURITY_ACCESS_PRIVILEGE',
    lastNormalizedEvent: 'Core Network Engineer elevated session in HSS maintenance console',
    description: 'Privileged session monitoring and recording on telecom core infrastructure'
  }
];

export const INITIAL_FLINK_CORRELATIONS: FlinkCorrelatedWindow[] = [
  {
    windowId: 'FLINK-WIN-9021',
    timeWindow: 'T-15m Sliding Window (Active)',
    imsi: '639010048192039',
    imei: '863920048192830',
    msisdn: '+254 722 819201',
    tmsi: '0x9fa102b4',
    guti: '639-01-0001-02-9fa102b4',
    cgnatPrivateIp: '10.142.12.44',
    publicIp: '196.201.214.18',
    cellId: '639-01-eNB-1049 (Nairobi CBD)',
    posAgentId: 'POS-NBO-KIMATHI-04',
    stitchLatencyMs: 34.2,
    correlationStatus: 'IDENTITY_DISCREPANCY',
    riskScore: 0.94,
    flags: ['POST_SWAP_300S_MFA_BURST', 'CGNAT_ROTATION', 'AIR_HARVESTING_CORRELATED']
  },
  {
    windowId: 'FLINK-WIN-9022',
    timeWindow: 'T-15m Sliding Window (Active)',
    imsi: '639010091823901',
    imei: '358920192837411',
    msisdn: '+254 710 449201',
    tmsi: '0x3cb88201',
    guti: '639-01-0002-01-3cb88201',
    cgnatPrivateIp: '10.142.18.90',
    publicIp: '196.201.214.92',
    cellId: '639-01-gNB-2201 (Mombasa Port)',
    stitchLatencyMs: 28.5,
    correlationStatus: 'STITCHED',
    riskScore: 0.12,
    flags: ['LEGITIMATE_ATTACH', 'STIR_SHAKEN_VERIFIED_A']
  },
  {
    windowId: 'FLINK-WIN-9023',
    timeWindow: 'T-15m Sliding Window (Active)',
    imsi: '639010077281920',
    imei: '869201882019482',
    msisdn: '+254 733 910283',
    tmsi: '0x1da904ff',
    guti: '639-01-0001-04-1da904ff',
    cgnatPrivateIp: '10.142.08.12',
    publicIp: '196.201.214.05',
    cellId: '639-01-eNB-8840 (Eldoret Highway)',
    stitchLatencyMs: 39.1,
    correlationStatus: 'STITCHED',
    riskScore: 0.45,
    flags: ['ROAMING_LOCATION_DRIFT_MONITORED']
  },
  {
    windowId: 'FLINK-WIN-9024',
    timeWindow: 'T-15m Sliding Window (Active)',
    imsi: '639010011928304',
    imei: '861928301928374',
    msisdn: '+254 729 001928',
    tmsi: '0x7e2910bb',
    guti: '639-01-0003-02-7e2910bb',
    cgnatPrivateIp: '10.142.44.18',
    publicIp: '196.201.214.66',
    cellId: '639-01-eNB-9102 (Kisumu City)',
    posAgentId: 'POS-KSM-MEGA-01',
    stitchLatencyMs: 42.0,
    correlationStatus: 'IDENTITY_DISCREPANCY',
    riskScore: 0.88,
    flags: ['IMPOSSIBLE_GEODESIC_VELOCITY', 'SUSPECT_ESIM_PROVISIONING']
  }
];

export const STORAGE_TIER_METRICS: StorageTierMetric[] = [
  {
    tierName: 'Hot OLAP (ClickHouse)',
    technology: 'ClickHouse Cluster (ReplicatedMergeTree + NVMe)',
    retentionWindow: '30 Days (Rolling Partition)',
    queryLatencyP99: '38ms (Sub-second at 5M EPS peak)',
    currentIngestionRate: '1,890,400 EPS',
    totalRecordsStored: '4,892,100,000 Events',
    storageCapacityUsed: '14.2 TB / 40.0 TB (35.5%)',
    encryptionStandard: 'AES-256-GCM Hardware accelerated',
    complianceLevel: 'Operational Live Forensics SLA'
  },
  {
    tierName: 'Entity Graph (Memgraph)',
    technology: 'Memgraph In-Memory Graph (Cypher / Bolt Protocol)',
    retentionWindow: '90 Days Real-time Traversal',
    queryLatencyP99: '18ms (Multi-hop relationship lookup)',
    currentIngestionRate: '410,000 Graph Ops/sec',
    totalRecordsStored: '182,400,000 Nodes / 890M Edges',
    storageCapacityUsed: '384 GB RAM / 512 GB RAM (75.0%)',
    encryptionStandard: 'mTLS In-Transit + RAM Enclave Sealing',
    complianceLevel: 'Sub-second Graph Hopping SLA'
  },
  {
    tierName: 'Cold Compliance (Iceberg S3)',
    technology: 'Apache Iceberg on Sovereign S3 (Parquet + ZSTD)',
    retentionWindow: '7 Years WORM (Write-Once-Read-Many)',
    queryLatencyP99: '4.2s (Athena / Trino Federated Query)',
    currentIngestionRate: 'Batch Micro-commit every 60s',
    totalRecordsStored: '118,900,000,000 Events',
    storageCapacityUsed: '312.8 TB Compressed',
    encryptionStandard: 'KMS Sovereign HSM Sealed (FIPS 140-3)',
    complianceLevel: 'Law Enforcement & Regulatory Legal Hold'
  }
];

export const SAMPLE_OCSF_EVENTS: OcsfTelecomEventSample[] = [
  {
    eventUuid: '8a91c01e-92b4-4b91-a189-99e82910a001',
    timestampNs: 1728919200000000000,
    timestampIso: '2026-10-14T19:00:00.128Z',
    sourceSystemId: 1,
    sourceSystemName: 'SS7 STP Firewall',
    eventName: 'MAP_InsertSubscriberData_BLOCKED',
    imsi: '639010048192039',
    imei: '863920048192830',
    msisdn: '+254 722 819201',
    cellId: '639-01-eNB-1049',
    srcIp: '196.201.214.18',
    fraudLossEstimateUsd: 14500.0,
    rawPayloadSnippet: 'SIGTRAN M3UA DATA: TCAP Begin [MAP_InsertSubscriberData] from +447973000999',
    ocsfNormalizedJson: JSON.stringify(
      {
        class_uid: 9001,
        class_name: 'Telecom Signaling Activity',
        category_uid: 4,
        category_name: 'Network Activity',
        activity_id: 2,
        activity_name: 'Block',
        severity_id: 5,
        severity: 'Critical',
        time: 1728919200128,
        telecom: {
          imsi: '639010048192039',
          imei: '863920048192830',
          msisdn: '+254 722 819201',
          protocol: 'SS7_MAP',
          op_code: 3,
          op_name: 'MAP_InsertSubscriberData',
          origin_gt: '+447973000999',
          dest_gt: 'stp01.mandela-ke.net',
          gsma_standard: 'FS.11 Category 1'
        },
        financial: {
          estimated_fraud_loss_usd: 14500.0,
          currency: 'USD'
        }
      },
      null,
      2
    )
  },
  {
    eventUuid: '9b02d12f-83a5-4c02-b290-88f93021b002',
    timestampNs: 1728919201000000000,
    timestampIso: '2026-10-14T19:00:01.442Z',
    sourceSystemId: 13,
    sourceSystemName: 'CRM & Retail POS SIM-Swap Logs',
    eventName: 'POS_ESIM_PROFILE_REGEN',
    imsi: '639010048192039',
    imei: '863920048192830',
    msisdn: '+254 722 819201',
    cellId: '639-01-eNB-1049',
    srcIp: '10.240.8.12',
    fraudLossEstimateUsd: 25000.0,
    rawPayloadSnippet: 'REST POS: Agent AG-NBO-8819 re-issued eSIM token with override reason: LOST_SIM',
    ocsfNormalizedJson: JSON.stringify(
      {
        class_uid: 9002,
        class_name: 'Telecom Subscriber Identity Modification',
        category_uid: 3,
        category_name: 'Identity & Access Management',
        activity_id: 1,
        activity_name: 'SIM Swap / Re-provision',
        severity_id: 4,
        severity: 'High',
        time: 1728919201442,
        actor: {
          user_id: 'AG-NBO-8819',
          role: 'RETAIL_POS_AGENT',
          store_id: 'POS-NBO-KIMATHI-04'
        },
        telecom: {
          imsi: '639010048192039',
          msisdn: '+254 722 819201',
          swap_type: 'ESIM_REPROVISION',
          override_applied: true
        },
        financial: {
          estimated_fraud_loss_usd: 25000.0,
          currency: 'USD'
        }
      },
      null,
      2
    )
  },
  {
    eventUuid: 'ac13e23a-74b6-4d13-c301-77a04132c003',
    timestampNs: 1728919202000000000,
    timestampIso: '2026-10-14T19:00:02.890Z',
    sourceSystemId: 3,
    sourceSystemName: 'SMS Firewall & Home Router',
    eventName: 'MFA_SMS_BURST_INTERCEPT_PREVENTED',
    imsi: '639010048192039',
    imei: '863920048192830',
    msisdn: '+254 722 819201',
    cellId: '639-01-eNB-1049',
    srcIp: '196.201.214.18',
    fraudLossEstimateUsd: 32000.0,
    rawPayloadSnippet: 'SMPP v3.4: Bank OTP for Ecobank Kenya $32,000 transfer intercepted by Home Router quarantine',
    ocsfNormalizedJson: JSON.stringify(
      {
        class_uid: 9003,
        class_name: 'Telecom Messaging Inspection',
        category_uid: 4,
        category_name: 'Network Activity',
        activity_id: 3,
        activity_name: 'Quarantine & Strip',
        severity_id: 5,
        severity: 'Critical',
        time: 1728919202890,
        telecom: {
          imsi: '639010048192039',
          msisdn: '+254 722 819201',
          protocol: 'SMPP_V34',
          sender: 'ECOBANK-MFA',
          correlation_trigger: 'POST_SWAP_300S_MFA_BURST',
          action: 'QUARANTINE_PENDING_VOICE_VERIFICATION'
        },
        financial: {
          estimated_fraud_loss_usd: 32000.0,
          currency: 'USD'
        }
      },
      null,
      2
    )
  }
];

export const SIEM_AI_SHADOW_ARTIFACTS: SiemAiShadowArtifact[] = [
  {
    path: 'schemas/protobuf/ocsf_telecom_event.proto',
    language: 'protobuf',
    responsibility: 'Canonical OCSF schema uniting all 18 sources with required keys: event_uuid, timestamp_ns, source_system_id, imsi, imei, msisdn, cell_id, src_ip, fraud_loss_estimate_usd.',
    code: `syntax = "proto3";

package telecom.ocsf.v1;

option go_package = "github.com/mandela-telco/defense/proto/v1;ocsfv1";
option java_package = "com.mandela.telecom.ocsf.v1";
option java_multiple_files = true;

enum SourceSystemId {
  SOURCE_SYSTEM_UNSPECIFIED = 0;
  SOURCE_SS7_FIREWALL = 1;
  SOURCE_DIAMETER_FIREWALL = 2;
  SOURCE_SMS_FIREWALL = 3;
  SOURCE_STIR_SHAKEN_VS = 4;
  SOURCE_IXP_SCRUBBERS = 5;
  SOURCE_HLR_HSS_UDM = 6;
  SOURCE_EIR_5G_EIR = 7;
  SOURCE_MSC_MME_AMF = 8;
  SOURCE_SGW_PGW_UPF = 9;
  SOURCE_IMS_VOLTE_SBC = 10;
  SOURCE_RAN_TOWER_CLUSTERS = 11;
  SOURCE_CGNAT_GILAN_FW = 12;
  SOURCE_CRM_POS_SIMSWAP = 13;
  SOURCE_CUSTOMER_CIAM = 14;
  SOURCE_OCS_BILLING_CHF = 15;
  SOURCE_NUMBER_PORTABILITY_NPDB = 16;
  SOURCE_CTI_GSMA_TIS = 17;
  SOURCE_ENTERPRISE_PAM = 18;
}

message OcsfTelecomEvent {
  string event_uuid = 1;
  uint64 timestamp_ns = 2;
  SourceSystemId source_system_id = 3;
  string source_system_name = 4;

  // Normalized Telecom Identities
  string imsi = 5;
  string imei = 6;
  string msisdn = 7;
  string cell_id = 8;
  string src_ip = 9;
  string tmsi = 10;
  string guti = 11;
  string cgnat_private_ip = 12;

  // Anomaly & Financial Quant
  double fraud_loss_estimate_usd = 13;
  double anomaly_score = 14;
  repeated string correlation_flags = 15;

  // Raw telemetry capture
  bytes raw_wire_packet = 16;
  string metadata_json = 17;
}`
  },
  {
    path: 'flink-jobs/identity-stitcher/src/main/java/IdentityCorrelationJob.java',
    language: 'java',
    responsibility: 'KeyedCoProcessFunction joining HLR/UDM IMSI-IMEI bindings, CRM POS SIM-swap events, and CGNAT IP mappings within 50ms.',
    code: `package com.mandela.telecom.flink;

import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.co.KeyedCoProcessFunction;
import org.apache.flink.util.Collector;
import com.mandela.telecom.ocsf.v1.OcsfTelecomEvent;

public class IdentityCorrelationJob extends KeyedCoProcessFunction<String, OcsfTelecomEvent, OcsfTelecomEvent, CorrelatedIdentityRecord> {

    private transient ValueState<SubscriberActiveState> subscriberState;
    private transient ValueState<Long> lastSimSwapTimestamp;

    @Override
    public void open(Configuration parameters) {
        ValueStateDescriptor<SubscriberActiveState> stateDesc =
            new ValueStateDescriptor<>("subscriber-state", SubscriberActiveState.class);
        subscriberState = getRuntimeContext().getState(stateDesc);

        ValueStateDescriptor<Long> swapDesc =
            new ValueStateDescriptor<>("last-simswap-ts", Long.class);
        lastSimSwapTimestamp = getRuntimeContext().getState(swapDesc);
    }

    @Override
    public void processElement1(OcsfTelecomEvent event, Context ctx, Collector<CorrelatedIdentityRecord> out) throws Exception {
        // Stream 1: Core HLR / CGNAT bindings
        SubscriberActiveState current = subscriberState.value();
        if (current == null) {
            current = new SubscriberActiveState(event.getImsi(), event.getImei(), event.getMsisdn(), event.getCgnatPrivateIp());
        } else {
            current.updateBindings(event.getImei(), event.getCgnatPrivateIp(), event.getCellId());
        }
        subscriberState.update(current);

        // Check if within 300s of a POS SIM swap
        Long lastSwap = lastSimSwapTimestamp.value();
        if (lastSwap != null && (ctx.timestamp() - lastSwap) <= 300_000L) {
            // Emits high-risk correlated identity record immediately
            out.collect(new CorrelatedIdentityRecord(current, 0.94, "POST_SWAP_300S_MFA_BURST"));
        }
    }

    @Override
    public void processElement2(OcsfTelecomEvent posEvent, Context ctx, Collector<CorrelatedIdentityRecord> out) throws Exception {
        // Stream 2: POS SIM-swap event
        if (posEvent.getSourceSystemIdValue() == 13) {
            lastSimSwapTimestamp.update(ctx.timestamp());
            // Set 15-minute sliding window timer to expire state
            ctx.timerService().registerEventTimeTimer(ctx.timestamp() + 900_000L);
        }
    }

    @Override
    public void onTimer(long timestamp, OnTimerContext ctx, Collector<CorrelatedIdentityRecord> out) throws Exception {
        // Clean up sliding state after 15m window
        lastSimSwapTimestamp.clear();
    }
}`
  },
  {
    path: 'db/clickhouse/001_create_siem_telemetry.sql',
    language: 'sql',
    responsibility: 'ClickHouse DDL partitioned by toYYYYMMDD(event_time) and ordered by (source_system_id, imei, imsi, msisdn, event_time).',
    code: `-- ClickHouse Cluster DDL for Sovereign Hot OLAP Tier (5M EPS peak)
CREATE DATABASE IF NOT EXISTS telecom_siem_lakehouse;

CREATE TABLE IF NOT EXISTS telecom_siem_lakehouse.telecom_events_hot
(
    event_uuid UUID,
    event_time DateTime64(3, 'UTC'),
    source_system_id UInt8,
    source_system_name LowCardinality(String),
    imsi FixedString(15),
    imei FixedString(15),
    msisdn String,
    cell_id LowCardinality(String),
    src_ip IPv4,
    tmsi Nullable(String),
    guti Nullable(String),
    cgnat_private_ip Nullable(IPv4),
    fraud_loss_estimate_usd Float64,
    anomaly_score Float32,
    correlation_flags Array(LowCardinality(String)),
    raw_payload_snippet String,
    ocsf_normalized_json String
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{shard}/telecom_events_hot', '{replica}')
PARTITION BY toYYYYMMDD(event_time)
ORDER BY (source_system_id, imei, imsi, msisdn, event_time)
TTL event_time + INTERVAL 30 DAY
SETTINGS index_granularity = 8192;`
  }
];
