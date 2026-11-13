export type PopCode = 'LOS' | 'NBO' | 'JNB' | 'CAI' | 'DKR' | 'FIH';

export interface SbcPointOfPresence {
  code: PopCode;
  city: string;
  country: string;
  region: 'West Africa' | 'East Africa' | 'Southern Africa' | 'North Africa' | 'Central Africa';
  flag: string;
  anycastIp: string;
  bgpAsn: number;
  status: 'healthy' | 'degraded' | 'draining' | 'offline';
  currentCps: number;
  targetCps: number; // 10,000 CPS target
  activeChannels: number;
  maxChannels: number;
  registrationsCount: number;
  signalingLatencyMs: number; // Target < 150ms p95
  mediaLatencyMs: number; // Target < 80ms p95
  cpuPercent: number;
  memoryPercent: number;
  error5xxRate: number; // e.g. 0.02%
  kamailioPods: number;
  rtpEngineNodes: number;
  freeSwitchNodes: number;
}

export interface EnterprisePbxCredential {
  id: string;
  companyName: string;
  sipDomain: string; // sip.mandela.africa
  username: string;
  realm: string;
  authMethod: 'digest' | 'ip_whitelist';
  whitelistedIps: string[];
  assignedDids: string[];
  maxCps: number;
  maxConcurrentCalls: number;
  tlsEnabled: boolean;
  srtpEnabled: boolean;
  registeredPop?: PopCode;
  registrationStatus: 'registered' | 'unregistered' | 'expiring' | 'failed';
  lastRegisterTime?: string;
  sourceIp?: string;
  userAgent?: string;
}

export interface SipLadderMessage {
  id: string;
  timestamp: string;
  relativeTimeMs: number;
  fromEntity: 'Enterprise PBX' | 'Anycast Edge (Kamailio)' | 'RTPEngine / FreeSWITCH' | 'Carrier PSTN';
  toEntity: 'Enterprise PBX' | 'Anycast Edge (Kamailio)' | 'RTPEngine / FreeSWITCH' | 'Carrier PSTN';
  methodOrStatus: string; // e.g. 'INVITE', '100 Trying', '180 Ringing', '200 OK', 'ACK', 'RTP (Opus/SRTP)', 'BYE', '200 OK'
  protocol: 'SIP/2.0/TLS' | 'RTP/SAVPF' | 'SIP/2.0/UDP';
  cseq: string;
  rawHeaders: string;
  sdpBody?: string;
  isError?: boolean;
}

export interface SipCallTrace {
  id: string;
  callId: string;
  popCode: PopCode;
  callerMsisdn: string;
  calleeMsisdn: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'failed' | 'in_progress';
  sipCode: number; // 200, 486, 503, 404, etc.
  sipReason: string;
  durationSec: number;
  mosScore: number;
  messages: SipLadderMessage[];
  mediaBypass: boolean;
  paiHeader?: string;
  privacyHeader?: string;
  diversionHeader?: string;
  codec: string;
}

export interface SbcHeaderRule {
  id: string;
  name: string;
  description: string;
  customerId?: string; // or '*' for global
  direction: 'ingress' | 'egress' | 'both';
  headerName: 'P-Asserted-Identity' | 'Privacy' | 'Diversion' | 'User-Agent' | 'X-Mandela-Tenant' | 'Custom';
  action: 'pass_through' | 'overwrite' | 'strip' | 'anonymize' | 'prepend';
  targetValue?: string;
  status: 'active' | 'disabled';
  priority: number;
}

export interface SbcGlobalAcl {
  id: string;
  cidr: string;
  action: 'block' | 'allow' | 'rate_limit';
  reason: string;
  appliedBy: string; // User or AI Fraud Agent
  createdAt: string;
  expiresAt?: string;
  activePops: PopCode[];
  syncStatus: 'synced_all_pops' | 'syncing' | 'failed';
  matchedPacketsLastHour: number;
}

export interface SbcAiAlert {
  id: string;
  type: 'attack_scanner' | 'fraud_spike' | 'capacity_prediction' | 'anomaly_5xx';
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  affectedPop: PopCode | 'ALL';
  suggestedAction: string;
  actionPayload?: {
    actionType: 'block_ip' | 'scale_pods' | 'reroute_pop' | 'rate_limit';
    target: string;
  };
  timestamp: string;
  autoRemediated: boolean;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface RtpPacketHeader {
  packetNumber: number;
  captureOffsetMs: number;
  version: number; // 2
  padding: boolean;
  extension: boolean;
  csrcCount: number;
  marker: boolean;
  payloadType: number; // 111 (Opus), 8 (PCMA), 0 (PCMU), 9 (G.722), etc.
  payloadName: string;
  sequenceNumber: number;
  timestamp: number;
  ssrc: string; // e.g. "0x8E42B109"
  csrcList?: string[];
  extensionData?: {
    profile: number;
    lengthWords: number;
    audioLevelDbov?: number;
    vadActive?: boolean;
  };
  payloadSizeBytes: number;
  totalSizeBytes: number;
  deltaMs: number;
  jitterMs: number;
  hexDump: string;
}

export interface PacketDiagnosticSession {
  id: string;
  callTraceId: string;
  callId: string;
  popCode: PopCode;
  callerMsisdn: string;
  calleeMsisdn: string;
  codec: string;
  status: 'idle' | 'capturing' | 'completed' | 'stopped';
  durationSeconds: number; // 30
  remainingSeconds: number;
  startedAt: string;
  completedAt?: string;
  packets: RtpPacketHeader[];
  metrics: {
    totalPackets: number;
    lostPackets: number;
    lossRatePercent: number;
    avgJitterMs: number;
    maxJitterMs: number;
    avgLatencyMs: number;
    estimatedMos: number;
    bitrateKbps: number;
    srtpSuite: string;
  };
}

