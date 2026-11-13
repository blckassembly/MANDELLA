export type MessageChannel = 'sms' | 'ussd_push' | 'ussd_session';
export type MessageType = 'otp' | 'transactional' | 'promotional';
export type MessageStatus = 'queued' | 'submitted' | 'delivered' | 'failed' | 'retrying' | 'converted_to_ussd';

export interface MessageRecord {
  id: string;
  to: string; // MSISDN E.164
  from: string; // Sender ID (depends on System 1)
  body: string;
  type: MessageType;
  channel: MessageChannel;
  status: MessageStatus;
  countryCode: string;
  carrier: string;
  bindId: string;
  smppSequenceNumber: number;
  dlrStatus?: 'DELIVRD' | 'EXPIRED' | 'UNDELIV' | 'REJECTD' | 'PENDING';
  submittedAt: string;
  deliveredAt?: string;
  latencyMs?: number;
  attempts: number;
  maxAttempts: number;
  aiPredictedFailure: boolean;
  aiConfidence?: number;
  aiFallbackReason?: string;
  costUsd: number;
  hlrReachable: boolean;
  handsetDeviceType: 'feature_phone_2g' | 'basic_phone' | 'smartphone_3g_4g';
}

export interface SmppBind {
  id: string;
  carrierName: string;
  countryCode: string;
  operator: string;
  protocol: 'SMPP v5.0' | 'SMPP v3.4';
  bindType: 'transceiver' | 'transmitter' | 'receiver';
  host: string;
  port: number;
  systemId: string;
  state: 'BOUND' | 'CONNECTING' | 'THROTTLED' | 'UNBOUND' | 'CLOSED' | 'ERROR';
  windowSize: number;
  windowUtilization: number; // percentage
  tps: number;
  maxTps: number;
  latencyMs: number;
  successRate1h: number;
  enquireLinkIntervalSec: number;
  lastEnquireLink: string;
  sigtranGateway: string;
}

export interface UssdSession {
  sessionId: string;
  msisdn: string;
  serviceCode: string;
  carrier: string;
  state: 'active' | 'completed' | 'timeout';
  step: number;
  dialogHistory: Array<{
    prompt: string;
    userReply?: string;
    timestamp: string;
  }>;
  startedAt: string;
  lastActivityAt: string;
}

export interface CarrierQualityMetric {
  carrier: string;
  countryCode: string;
  flag: string;
  hourlyDeliveryRates: number[]; // 24-hr historical percentages
  currentDeliveryRate: number; // Mandela rate (e.g. 98.4%)
  industryAggregatorRate: number; // Typically 58-62%
  p95LatencySec: number;
  costPerSmsUsd: number;
  costPerUssdUsd: number;
  activeBinds: number;
  status: 'optimal' | 'degraded' | 'rerouted';
  activeAlert?: string;
  suggestedFailover?: string;
}

export interface SmppPduTrace {
  id: string;
  timestamp: string;
  command: 'SUBMIT_SM' | 'SUBMIT_SM_RESP' | 'DELIVER_SM' | 'DELIVER_SM_RESP' | 'ENQUIRE_LINK' | 'ENQUIRE_LINK_RESP';
  direction: 'outbound' | 'inbound';
  commandStatus: 'ESME_ROK' | 'ESME_RTHROTTLED' | 'ESME_RINVMSGLEN' | 'ESME_RSUBMITFAIL';
  sequenceNumber: number;
  messageId?: string;
  sourceAddr?: string;
  destAddr?: string;
  hexDump: string;
  decodedSummary: string;
}

export interface RouteProfile {
  id: string;
  name: string;
  description: string;
  mode: 'optimize_delivery' | 'optimize_cost' | 'custom_rules';
  countryCode: string;
  primaryCarrierBind: string;
  fallbackCarrierBind: string;
  ussdConversionThreshold: number; // 0.0 - 1.0 (default 0.70)
  retrySchedule: number[]; // [0, 300, 1800] seconds
  ttlMinutes: number;
}
