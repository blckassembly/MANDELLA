import React, { useState, useMemo } from 'react';
import {
  Play,
  Save,
  Plus,
  Trash2,
  Copy,
  Download,
  Check,
  AlertCircle,
  Sliders,
  Zap,
  Bot,
  Phone,
  PhoneForwarded,
  Radio,
  Volume2,
  Mic,
  Code,
  FileText,
  Database,
  ShieldAlert,
  Cpu,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
  Wallet,
  Smartphone,
  Layers,
  ArrowRight,
  GitBranch,
  Settings,
  HelpCircle
} from 'lucide-react';
import { CallWorkflowDefinition, WorkflowNode } from '../../types/agnosticOS';
import { INITIAL_CALL_WORKFLOWS } from '../../data/mockAgnosticData';

// Extended n8n Node Representation for Telecom, AI, and FinTech Orchestration
export type N8nNodeCategory =
  | 'trigger'
  | 'telephony'
  | 'ai_speech'
  | 'african_fintech'
  | 'security_soc'
  | 'dataverse_logic';

export interface N8nTelecomNode {
  id: string;
  category: N8nNodeCategory;
  name: string;
  typeBadge: string;
  description: string;
  color: string;
  icon: React.FC<{ className?: string }>;
  position: { x: number; y: number };
  status: 'idle' | 'running' | 'success' | 'error';
  latencyMs?: number;
  config: Record<string, any>;
  sampleInput: Record<string, any>;
  sampleOutput: Record<string, any>;
}

export interface N8nEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  type?: 'default' | 'branch_true' | 'branch_false';
}

export interface N8nWorkflowTemplate {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  entryPoint: string;
  nodes: N8nTelecomNode[];
  edges: N8nEdge[];
}

export interface ExecutionLog {
  runId: string;
  startedAt: string;
  totalDurationMs: number;
  status: 'success' | 'failed' | 'running';
  triggerSource: string;
  stepsCount: number;
  nodesRun: Array<{
    nodeId: string;
    nodeName: string;
    latencyMs: number;
    status: 'success' | 'error';
  }>;
}

// 4 PRE-BUILT FLAGSHIP ENTERPRISE AFRICAN TELECOM & INFRASTRUCTURE TEMPLATES
const PREBUILT_TEMPLATES: N8nWorkflowTemplate[] = [
  {
    id: 'wf-inbound-ai',
    name: 'Pan-African Inbound Voice & Multilingual AI Triage',
    shortDesc: 'Inbound SIP trunking -> FreeSWITCH SDP -> Language Router (Swahili/Yoruba/Amharic) -> Gemini 3.8 Flash -> SBC Bridge',
    category: 'Flagship Voice',
    entryPoint: '+254 20 790 1000 (Nairobi Pop)',
    nodes: [
      {
        id: 'node-trig-inbound',
        category: 'trigger',
        name: 'Inbound SIP Call Trigger',
        typeBadge: 'Kamailio 5.7 Anycast',
        description: 'Triggers when a carrier SIP INVITE hits Kamailio edge proxy',
        color: 'emerald',
        icon: Phone,
        position: { x: 50, y: 180 },
        status: 'idle',
        latencyMs: 12,
        config: {
          dnisRegex: '^\\+254(20|7)\\d{7}$',
          trunk: 'Safaricom-Sovereign-Interconnect-01',
          recordConsent: true,
          rtpNatBypass: true
        },
        sampleInput: {
          event: 'sip.invite',
          callerId: '+254712345678',
          calleeId: '+254207901000',
          codec: 'OPUS/48000',
          ingressPoP: 'NBO-EQUINIX-01'
        },
        sampleOutput: {
          callId: 'call-nbo-991823',
          sessionToken: 'tok_live_fs_8192',
          allocatedPort: 18402,
          callerCountry: 'KE',
          geoLatencyMs: 14.2
        }
      },
      {
        id: 'node-fs-answer',
        category: 'telephony',
        name: 'FreeSWITCH Answer & SDP',
        typeBadge: 'FreeSWITCH ESL Media',
        description: 'Answers SIP channel and locks bidirectional G.711 / Opus RTP plane',
        color: 'cyan',
        icon: Volume2,
        position: { x: 380, y: 180 },
        status: 'idle',
        latencyMs: 18,
        config: {
          answerAction: 'ring_ready_then_answer',
          earlyMedia: false,
          echoCancellation: 'speex_dsp_v3',
          dtmfDetection: 'rfc2833'
        },
        sampleInput: {
          sessionToken: 'tok_live_fs_8192',
          allocatedPort: 18402
        },
        sampleOutput: {
          status: '200_OK_ANSWERED',
          rtpBridgeId: 'rtp_eng_nbo_04',
          mosBaseline: 4.42,
          channelUuid: 'fs-chan-90812-uuid'
        }
      },
      {
        id: 'node-lang-router',
        category: 'dataverse_logic',
        name: 'Acoustic Dialect Classifier',
        typeBadge: 'System 7 Acoustic Router',
        description: 'First 800ms phoneme classifier for Swahili, English, Yoruba, and Amharic',
        color: 'sky',
        icon: Radio,
        position: { x: 710, y: 180 },
        status: 'idle',
        latencyMs: 24,
        config: {
          detectionWindowMs: 800,
          confidenceThreshold: 0.88,
          defaultFallback: 'sw-KE'
        },
        sampleInput: {
          channelUuid: 'fs-chan-90812-uuid',
          audioPcapBuffer: 'base64_pcm16_800ms'
        },
        sampleOutput: {
          detectedLocale: 'sw-KE',
          detectedDialect: 'Nairobi Coastal Swahili (Sheng code-switch)',
          confidence: 0.962,
          sentiment: 'positive'
        }
      },
      {
        id: 'node-gemini-agent',
        category: 'ai_speech',
        name: 'Gemini 3.8 Flash Voice Agent',
        typeBadge: '@google/genai SDK',
        description: 'Ultra-low latency streaming voice assistant executing customer agronomy queries',
        color: 'violet',
        icon: Bot,
        position: { x: 1040, y: 100 },
        status: 'idle',
        latencyMs: 142,
        config: {
          model: 'gemini-3.8-flash',
          systemPrompt: 'Wewe ni msaidizi wa kilimo (Zawadi). Jibu maswali ya bei za mahindi na mbolea kwa Kiswahili fasaha.',
          temperature: 0.2,
          bargeInEnabled: true
        },
        sampleInput: {
          locale: 'sw-KE',
          callerUtterance: 'Nahitaji bei ya gunia la mahindi Eldoret leo.'
        },
        sampleOutput: {
          ttsAudioStreamUrl: 'rtp://127.0.0.1:18402/stream',
          agentResponseText: 'Gunia la mahindi leo Eldoret ni KES 3,400. Je, nikusaidie kuangalia mkopo wa mbolea?',
          toolCallsExecuted: ['get_market_prices'],
          intent: 'LOAN_INQUIRY'
        }
      },
      {
        id: 'node-sip-bridge',
        category: 'telephony',
        name: 'SBC Agent SIP Bridge',
        typeBadge: 'Kamailio Dispatcher',
        description: 'Bridges call to human loan officer if complex escalation requested',
        color: 'cyan',
        icon: PhoneForwarded,
        position: { x: 1040, y: 290 },
        status: 'idle',
        latencyMs: 34,
        config: {
          targetNumber: '+254700892104',
          maxRingTimeoutSeconds: 25,
          recordCall: true,
          callerIdSpoofMode: 'preserve_original'
        },
        sampleInput: {
          escalationReason: 'COMPLEX_FINANCIAL_LOAN_APPLICATION',
          callerId: '+254712345678'
        },
        sampleOutput: {
          bridgeState: 'EARLY_MEDIA_RINGING',
          agentQueueId: 'nbo_agri_desk_1',
          estimatedWaitSeconds: 4
        }
      }
    ],
    edges: [
      { id: 'e1', from: 'node-trig-inbound', to: 'node-fs-answer' },
      { id: 'e2', from: 'node-fs-answer', to: 'node-lang-router' },
      { id: 'e3', from: 'node-lang-router', to: 'node-gemini-agent', label: 'AI Resolves' },
      { id: 'e4', from: 'node-lang-router', to: 'node-sip-bridge', label: 'Loan Escalate' }
    ]
  },
  {
    id: 'wf-mpesa-number',
    name: 'Instant M-Pesa STK & Pan-Africa Number Allocation',
    shortDesc: 'M-Pesa Webhook -> KYC NIN/BVN Verification -> STK Push Debit -> Pan-Africa E.164 ITU Reservation -> SMPP SMS',
    category: 'FinTech & Inventory',
    entryPoint: 'Daraja STK Callback Endpoint',
    nodes: [
      {
        id: 'node-mpesa-trig',
        category: 'trigger',
        name: 'M-Pesa / Mobile Money Trigger',
        typeBadge: 'Daraja Webhook',
        description: 'Receives instant payment notification or initiates user self-service top-up',
        color: 'emerald',
        icon: Zap,
        position: { x: 50, y: 180 },
        status: 'idle',
        latencyMs: 15,
        config: {
          darajaEnvironment: 'production',
          shortCode: '174379',
          passkeyVaultId: 'vault_sec_daraja_01',
          callbackUrl: 'https://api.mandela.africa/v1/payments/mpesa/ipn'
        },
        sampleInput: {
          tenantId: 'tenant-ke-safaricom-01',
          phoneNumber: '+254712345678',
          amountKes: 1500,
          requestedService: 'PAN_AFRICA_DID_RESERVATION'
        },
        sampleOutput: {
          checkoutRequestId: 'ws_CO_09112026_98124',
          responseCode: '0',
          customerMessage: 'Success. Request accepted for processing.'
        }
      },
      {
        id: 'node-kyc-verify',
        category: 'african_fintech',
        name: 'KYC & Regulatory Validator',
        typeBadge: 'IPRS / NIN / BVN Engine',
        description: 'Runs real-time ITU/regulatory anti-fraud check before allocating national DID',
        color: 'amber',
        icon: ShieldAlert,
        position: { x: 380, y: 180 },
        status: 'idle',
        latencyMs: 68,
        config: {
          jurisdiction: 'KE-CAK',
          requireNationalId: true,
          antiSimSwapGraceHours: 72
        },
        sampleInput: {
          nationalIdHash: 'sha256_ke_id_9921401',
          msisdn: '+254712345678'
        },
        sampleOutput: {
          verified: true,
          riskScore: 'LOW_RISK',
          sanctionsListMatch: false,
          regulatoryClearanceId: 'CAK-KYC-2026-9901'
        }
      },
      {
        id: 'node-num-alloc',
        category: 'african_fintech',
        name: 'Pan-Africa E.164 DID Provisioner',
        typeBadge: 'ITU Inventory Master',
        description: 'Atomically binds sovereign E.164 phone number from Redis pool to tenant account',
        color: 'amber',
        icon: Smartphone,
        position: { x: 710, y: 180 },
        status: 'idle',
        latencyMs: 32,
        config: {
          targetCountryIso: 'KE',
          type: 'toll_free',
          prefixRange: '+25420790',
          leasePeriodDays: 365
        },
        sampleInput: {
          tenantId: 'tenant-ke-safaricom-01',
          regulatoryClearanceId: 'CAK-KYC-2026-9901'
        },
        sampleOutput: {
          provisionedE164: '+254207901844',
          routingTrunk: 'Kamailio-Nairobi-Anycast',
          activationStatus: 'LIVE_PROVISIONED',
          monthlyFeeUsd: 12.00
        }
      },
      {
        id: 'node-smpp-sms',
        category: 'telephony',
        name: 'SMPP Carrier SMS Confirmation',
        typeBadge: 'SMPP 3.4 Gateway',
        description: 'Dispatches instant sovereign SMS receipt with SIP credentials & portal link',
        color: 'cyan',
        icon: PhoneForwarded,
        position: { x: 1040, y: 180 },
        status: 'idle',
        latencyMs: 22,
        config: {
          senderId: 'MANDELA_OS',
          smppSystemId: 'smpp_nbo_safaricom_gw1',
          dltTemplateId: 'KE_CAK_ALLOC_01'
        },
        sampleInput: {
          destinationMsisdn: '+254712345678',
          provisionedNumber: '+254207901844'
        },
        sampleOutput: {
          messageId: 'sms_msg_99812_ke',
          deliveryStatus: 'DELIVRD',
          smscTimestamp: '2026-11-09T14:48:00Z'
        }
      }
    ],
    edges: [
      { id: 'e-m1', from: 'node-mpesa-trig', to: 'node-kyc-verify' },
      { id: 'e-m2', from: 'node-kyc-verify', to: 'node-num-alloc' },
      { id: 'e-m3', from: 'node-num-alloc', to: 'node-smpp-sms' }
    ]
  },
  {
    id: 'wf-fraud-quarantine',
    name: 'Real-Time SIM-Swap & Voice Deepfake Quarantine',
    shortDesc: 'Kafka CDR Stream -> Geodesic Velocity Engine -> RawNet3 Voice Scanner -> Automated SBC Blacklist -> Alert SOC C2',
    category: 'Security & SOC',
    entryPoint: 'Kafka CDR Stream (100k events/sec)',
    nodes: [
      {
        id: 'node-kafka-cdr',
        category: 'trigger',
        name: 'Kafka Real-Time CDR Stream',
        typeBadge: 'Kafka 3.7 Consumer',
        description: 'Ingests real-time call detail records across Nairobi, Lagos, and Joburg SBCs',
        color: 'emerald',
        icon: Zap,
        position: { x: 50, y: 180 },
        status: 'idle',
        latencyMs: 8,
        config: {
          topic: 'telecom.events.cdr.raw',
          consumerGroup: 'fraud_quarantine_workers',
          batchSize: 50
        },
        sampleInput: {
          topic: 'telecom.events.cdr.raw',
          partition: 4,
          offset: 1984201
        },
        sampleOutput: {
          event: 'call_initiated',
          callerE164: '+2348032049102',
          targetDid: '+23412700000',
          ingressIp: '102.134.18.9',
          timestamp: '2026-11-09T14:50:12Z'
        }
      },
      {
        id: 'node-geo-velocity',
        category: 'security_soc',
        name: 'Geodesic Velocity & SIM-Swap Check',
        typeBadge: 'MANDELA Risk Engine',
        description: 'Calculates physical impossible velocity (e.g. SIM active in Lagos and London within 5 mins)',
        color: 'rose',
        icon: ShieldAlert,
        position: { x: 380, y: 180 },
        status: 'idle',
        latencyMs: 19,
        config: {
          maxSpeedKmPerHour: 900,
          simSwapGraceWindowMinutes: 240,
          riskThreshold: 85
        },
        sampleInput: {
          callerE164: '+2348032049102',
          currentCellTower: 'LOS-VI-TOWER-44',
          ingressIp: '102.134.18.9'
        },
        sampleOutput: {
          riskScore: 94,
          anomalyDetected: true,
          reason: 'RECENT_SIM_SWAP_WITHIN_2_HOURS',
          impossibleVelocityKmH: 2400
        }
      },
      {
        id: 'node-rawnet3-voice',
        category: 'security_soc',
        name: 'RawNet3 Anti-Deepfake Gate',
        typeBadge: 'Neural Biometrics',
        description: 'Analyzes raw audio waveform harmonics for AI synthesized cloned speech artifacts',
        color: 'rose',
        icon: Mic,
        position: { x: 710, y: 180 },
        status: 'idle',
        latencyMs: 38,
        config: {
          syntheticProbabilityCutoff: 0.85,
          spectralArtifactScan: true,
          glottalPulseCheck: true
        },
        sampleInput: {
          audioPcapSample: 'base64_audio_sample_3sec'
        },
        sampleOutput: {
          isSynthetic: true,
          deepfakeConfidence: 0.984,
          detectedVocoder: 'ElevenLabs-v2-Cloned',
          actionRecommended: 'QUARANTINE_AND_TERMINATE'
        }
      },
      {
        id: 'node-sbc-blacklist',
        category: 'telephony',
        name: 'Automated SBC Blacklist Push',
        typeBadge: 'Kamailio htable Sync',
        description: 'Immediately injects caller IP and MSISDN into Kamailio RAM blacklist across all PoPs',
        color: 'cyan',
        icon: Phone,
        position: { x: 1040, y: 180 },
        status: 'idle',
        latencyMs: 14,
        config: {
          quarantineDurationHours: 48,
          syncPoPs: ['Lagos', 'Nairobi', 'Johannesburg', 'Cairo']
        },
        sampleInput: {
          quarantineTarget: '+2348032049102',
          riskScore: 94
        },
        sampleOutput: {
          quarantineId: 'sec_blk_881920',
          globalSbcSyncTimeMs: 12.4,
          status: 'ACTIVE_QUARANTINE'
        }
      }
    ],
    edges: [
      { id: 'e-f1', from: 'node-kafka-cdr', to: 'node-geo-velocity' },
      { id: 'e-f2', from: 'node-geo-velocity', to: 'node-rawnet3-voice' },
      { id: 'e-f3', from: 'node-rawnet3-voice', to: 'node-sbc-blacklist' }
    ]
  },
  {
    id: 'wf-lcr-optimize',
    name: 'Carrier Interconnect LCR & Grey-Route Quarantine',
    shortDesc: 'Cron Ingestion (15m) -> Carrier Rate Deck Ingestion -> LCR Engine -> Kamailio Dynamic Dispatcher Sync',
    category: 'Carrier Core',
    entryPoint: 'Cron Trigger (*/15 * * * *)',
    nodes: [
      {
        id: 'node-cron-lcr',
        category: 'trigger',
        name: 'Cron Scheduled Ingest',
        typeBadge: 'Scheduled Cron (*/15)',
        description: 'Fires every 15 minutes to re-evaluate inter-carrier wholesale rate decks',
        color: 'emerald',
        icon: Zap,
        position: { x: 50, y: 180 },
        status: 'idle',
        latencyMs: 4,
        config: {
          cronExpression: '*/15 * * * *',
          timezone: 'Africa/Nairobi'
        },
        sampleInput: {
          schedule: 'cron_15m',
          timestamp: '2026-11-09T14:45:00Z'
        },
        sampleOutput: {
          jobId: 'lcr_sync_job_77201',
          status: 'EXEC_TRIGGERED'
        }
      },
      {
        id: 'node-rate-deck',
        category: 'african_fintech',
        name: 'Carrier Rate Deck Parser',
        typeBadge: 'MTN / Safaricom / Airtel',
        description: 'Parses wholesale termination rates per prefix across all 54 African ITU country codes',
        color: 'amber',
        icon: Database,
        position: { x: 380, y: 180 },
        status: 'idle',
        latencyMs: 42,
        config: {
          carriersIngested: ['MTN_GLOBAL', 'SAFARICOM_WHOLESALE', 'AIRTEL_AFRICA', 'TELKOM_SA']
        },
        sampleInput: {
          jobId: 'lcr_sync_job_77201'
        },
        sampleOutput: {
          prefixesProcessed: 14820,
          bestRatePrefixKe: 0.0082,
          bestRatePrefixNg: 0.0094
        }
      },
      {
        id: 'node-lcr-calc',
        category: 'dataverse_logic',
        name: 'LCR Margin Optimizer',
        typeBadge: 'Least Cost Routing Core',
        description: 'Filters out grey routes with ASR < 65% and optimizes profit margin per minute',
        color: 'sky',
        icon: Sliders,
        position: { x: 710, y: 180 },
        status: 'idle',
        latencyMs: 28,
        config: {
          minAnswerSeizureRatio: 0.68,
          maxPacketLossPercent: 0.5,
          targetMarginPercent: 22
        },
        sampleInput: {
          prefixesProcessed: 14820
        },
        sampleOutput: {
          optimalRoutesCalculated: 14820,
          greyRoutesQuarantined: 34,
          averageCostReductionPercent: 14.8
        }
      },
      {
        id: 'node-kamailio-push',
        category: 'telephony',
        name: 'Kamailio Dispatcher Sync',
        typeBadge: 'RPC Dispatcher Reload',
        description: 'Pushes zero-downtime routing table changes into Kamailio 5.7 memory pool',
        color: 'cyan',
        icon: Radio,
        position: { x: 1040, y: 180 },
        status: 'idle',
        latencyMs: 16,
        config: {
          kamailioRpcUrl: 'http://127.0.0.1:5060/rpc',
          reloadCommand: 'dispatcher.reload'
        },
        sampleInput: {
          optimalRoutesCalculated: 14820
        },
        sampleOutput: {
          rpcResponse: '200_DISPATCHER_RELOADED_OK',
          updatedPartitions: 4,
          activeSipTrunks: 12
        }
      }
    ],
    edges: [
      { id: 'e-l1', from: 'node-cron-lcr', to: 'node-rate-deck' },
      { id: 'e-l2', from: 'node-rate-deck', to: 'node-lcr-calc' },
      { id: 'e-l3', from: 'node-lcr-calc', to: 'node-kamailio-push' }
    ]
  }
];

// CATALOG OF 24+ AFRICAN TELECOM & INFRASTRUCTURE CONNECTORS FOR THE "+ Add Node" MODAL
const AVAILABLE_CONNECTORS: Array<{
  category: N8nNodeCategory;
  categoryLabel: string;
  name: string;
  typeBadge: string;
  description: string;
  color: string;
  icon: React.FC<{ className?: string }>;
  defaultConfig: Record<string, any>;
  sampleInput: Record<string, any>;
  sampleOutput: Record<string, any>;
}> = [
  // 1. Triggers
  {
    category: 'trigger',
    categoryLabel: 'Triggers & Ingress',
    name: 'Inbound SIP Call Trigger',
    typeBadge: 'Kamailio SIP RFC 3261',
    description: 'Fires when a real carrier SIP INVITE arrives on any configured sovereign DID',
    color: 'emerald',
    icon: Phone,
    defaultConfig: { trunk: 'Safaricom-Sovereign-01', dnisRegex: '^\\+254.*$' },
    sampleInput: { caller: '+254700000000', callee: '+254207901000' },
    sampleOutput: { callId: 'call_live_123', status: 'RINGING' }
  },
  {
    category: 'trigger',
    categoryLabel: 'Triggers & Ingress',
    name: 'M-Pesa Webhook Trigger',
    typeBadge: 'Safaricom Daraja IPN',
    description: 'Listens for real-time mobile money payment notifications (C2B, B2C, STK)',
    color: 'emerald',
    icon: Zap,
    defaultConfig: { shortCode: '174379', environment: 'production' },
    sampleInput: { msisdn: '+254712345678', amount: 1500 },
    sampleOutput: { transactionId: 'RTE99102', status: 'COMPLETED' }
  },
  {
    category: 'trigger',
    categoryLabel: 'Triggers & Ingress',
    name: 'Kafka Real-Time CDR Stream',
    typeBadge: 'Kafka 3.7 Bus',
    description: 'Subscribes to distributed Call Detail Record telemetric events',
    color: 'emerald',
    icon: Database,
    defaultConfig: { topic: 'telecom.events.cdr', partitionCount: 8 },
    sampleInput: { topic: 'telecom.events.cdr', partition: 0 },
    sampleOutput: { event: 'call_progress', mos: 4.4 }
  },
  {
    category: 'trigger',
    categoryLabel: 'Triggers & Ingress',
    name: 'Scheduled Cron Trigger',
    typeBadge: 'Quartz Scheduler',
    description: 'Executes automated batch workflows on fixed intervals or schedules',
    color: 'emerald',
    icon: RefreshCw,
    defaultConfig: { cronExpression: '0 * * * *', timezone: 'UTC' },
    sampleInput: { schedule: 'hourly' },
    sampleOutput: { timestamp: new Date().toISOString() }
  },

  // 2. Telephony & Media Core
  {
    category: 'telephony',
    categoryLabel: 'Telephony & FreeSWITCH Media',
    name: 'FreeSWITCH Answer & SDP',
    typeBadge: 'FreeSWITCH ESL Core',
    description: 'Answers the inbound leg, negotiates codecs (G.711 / Opus), and enables DSP noise cancellation',
    color: 'cyan',
    icon: Volume2,
    defaultConfig: { noiseSuppression: true, echoCancellation: 'speex' },
    sampleInput: { callId: 'call_123' },
    sampleOutput: { state: 'ANSWERED', codec: 'OPUS' }
  },
  {
    category: 'telephony',
    categoryLabel: 'Telephony & FreeSWITCH Media',
    name: 'SBC Agent SIP Bridge',
    typeBadge: 'Kamailio Anycast Dispatcher',
    description: 'Bridges active audio to human operator or remote SIP PBX endpoint',
    color: 'cyan',
    icon: PhoneForwarded,
    defaultConfig: { targetNumber: '+254700892104', timeoutSeconds: 30 },
    sampleInput: { targetNumber: '+254700892104' },
    sampleOutput: { bridgeState: 'BRIDGED', latencyMs: 18 }
  },
  {
    category: 'telephony',
    categoryLabel: 'Telephony & FreeSWITCH Media',
    name: 'Audio Playback / Prompt',
    typeBadge: 'FreeSWITCH mod_sndfile',
    description: 'Plays pre-recorded high-fidelity audio or legal disclosures to the caller',
    color: 'cyan',
    icon: Volume2,
    defaultConfig: { fileUrl: 'prompt_welcome_sw.wav' },
    sampleInput: { callUuid: 'fs-uuid-99' },
    sampleOutput: { playbackStatus: 'COMPLETED' }
  },
  {
    category: 'telephony',
    categoryLabel: 'Telephony & FreeSWITCH Media',
    name: 'DTMF Digit Gather',
    typeBadge: 'RFC 2833 / SIP INFO',
    description: 'Captures caller touch-tone keypad input with timeout and inter-digit timers',
    color: 'cyan',
    icon: Radio,
    defaultConfig: { numDigits: 4, timeoutSeconds: 5 },
    sampleInput: { callUuid: 'fs-uuid-99' },
    sampleOutput: { digitsEntered: '1024', terminator: '#' }
  },

  // 3. AI & Speech
  {
    category: 'ai_speech',
    categoryLabel: 'AI & Neural Speech',
    name: 'Gemini 3.8 Flash Voice Agent',
    typeBadge: '@google/genai SDK',
    description: 'Conversational LLM reasoning over live audio streams with real-time tool use',
    color: 'violet',
    icon: Bot,
    defaultConfig: { model: 'gemini-3.8-flash', temperature: 0.2 },
    sampleInput: { userQuery: 'Nataka mkopo wa shilingi elfu kumi' },
    sampleOutput: { responseText: 'Mkopo wako umeidhinishwa!', toolInvoked: 'verify_loan' }
  },
  {
    category: 'ai_speech',
    categoryLabel: 'AI & Neural Speech',
    name: 'System 7 Multilingual TTS',
    typeBadge: '50 African Dialects',
    description: 'Synthesizes neural speech in Swahili, Yoruba, Amharic, Zulu, Hausa, and Sheng',
    color: 'violet',
    icon: Volume2,
    defaultConfig: { voiceId: 'zawadi_swahili_female', speed: 1.0 },
    sampleInput: { textToSynthesize: 'Habari za asubuhi.' },
    sampleOutput: { audioBufferDurationMs: 1420 }
  },
  {
    category: 'ai_speech',
    categoryLabel: 'AI & Neural Speech',
    name: 'System 7 Streaming ASR',
    typeBadge: 'Multi-Accented ASR',
    description: 'Low-latency speech-to-text with automatic dialect and code-switch detection',
    color: 'violet',
    icon: Mic,
    defaultConfig: { enableCodeSwitching: true, interimResults: true },
    sampleInput: { audioStream: 'pcm_16000' },
    sampleOutput: { transcript: 'Habari, nahitaji msaada', confidence: 0.98 }
  },

  // 4. African FinTech & Numbers
  {
    category: 'african_fintech',
    categoryLabel: 'African FinTech & Telecom Inventory',
    name: 'Pan-Africa E.164 DID Provisioner',
    typeBadge: 'ITU Inventory Master',
    description: 'Reserves and configures carrier numbers across 54 African countries from Redis pool',
    color: 'amber',
    icon: Smartphone,
    defaultConfig: { countryIso: 'KE', type: 'toll_free' },
    sampleInput: { tenantId: 'tenant-01', country: 'KE' },
    sampleOutput: { e164Number: '+254207901844', status: 'ACTIVE' }
  },
  {
    category: 'african_fintech',
    categoryLabel: 'African FinTech & Telecom Inventory',
    name: 'Daraja M-Pesa STK Push',
    typeBadge: 'Mobile Money Gateway',
    description: 'Initiates a real-time prompt on the customer phone asking for M-Pesa PIN',
    color: 'amber',
    icon: Wallet,
    defaultConfig: { amountKes: 500, paybillNumber: '174379' },
    sampleInput: { msisdn: '+254712345678', amount: 500 },
    sampleOutput: { checkoutRequestId: 'ws_CO_123', status: 'PROMPT_SENT' }
  },
  {
    category: 'african_fintech',
    categoryLabel: 'African FinTech & Telecom Inventory',
    name: 'KYC Regulatory Validator',
    typeBadge: 'NIN / BVN / IPRS',
    description: 'Verifies customer identity against national regulatory requirements',
    color: 'amber',
    icon: ShieldAlert,
    defaultConfig: { jurisdiction: 'KE-CAK', requireNIN: true },
    sampleInput: { idNumber: '9921401' },
    sampleOutput: { verified: true, clearanceId: 'CLR-901' }
  },

  // 5. Security & SOC
  {
    category: 'security_soc',
    categoryLabel: 'Security & Telecom SOC',
    name: 'RawNet3 Anti-Deepfake Gate',
    typeBadge: 'Acoustic Defense',
    description: 'Detects synthetic voice cloning and spoofing artifacts in real time',
    color: 'rose',
    icon: ShieldAlert,
    defaultConfig: { cutoffProbability: 0.85 },
    sampleInput: { audioPcap: 'audio_stream_data' },
    sampleOutput: { isDeepfake: false, confidence: 0.99 }
  },
  {
    category: 'security_soc',
    categoryLabel: 'Security & Telecom SOC',
    name: 'Automated SBC Blacklist Push',
    typeBadge: 'Kamailio htable',
    description: 'Blocks malicious caller IPs and numbers across all edge nodes instantly',
    color: 'rose',
    icon: ShieldAlert,
    defaultConfig: { durationHours: 48 },
    sampleInput: { targetIp: '102.134.18.9' },
    sampleOutput: { blacklisted: true, syncedNodes: 4 }
  },

  // 6. Dataverse & Logic
  {
    category: 'dataverse_logic',
    categoryLabel: 'Dataverse & Logic',
    name: 'MANDELA Vector DB Query',
    typeBadge: 'pgvector / Mandela Dataverse',
    description: 'Retrieves relevant agronomy, banking, or medical context via embeddings',
    color: 'sky',
    icon: Database,
    defaultConfig: { collection: 'agronomy_knowledge', topK: 3 },
    sampleInput: { query: 'Bei ya mahindi Eldoret leo' },
    sampleOutput: { matches: [{ title: 'Eldoret Maize Spot Price', price: 'KES 3400' }] }
  },
  {
    category: 'dataverse_logic',
    categoryLabel: 'Dataverse & Logic',
    name: 'JavaScript / Python Code Step',
    typeBadge: 'V8 Sandboxed Script',
    description: 'Executes custom data transformations, regex matching, or calculations',
    color: 'sky',
    icon: Code,
    defaultConfig: { script: 'return { result: items[0].json.amount * 1.16 };' },
    sampleInput: { amount: 1000 },
    sampleOutput: { result: 1160 }
  }
];

export const VisualWorkflowBuilder: React.FC<{
  workflow?: CallWorkflowDefinition;
  onSave?: (wf: CallWorkflowDefinition) => void;
  activeSubView?: string;
  onSelectSubView?: (subView: string) => void;
  onOpenSoftphone?: (number?: string) => void;
  onOpenOnboarding?: () => void;
}> = ({
  workflow = INITIAL_CALL_WORKFLOWS[0],
  onSave,
  activeSubView = 'canvas',
  onSelectSubView,
  onOpenSoftphone,
  onOpenOnboarding
}) => {
  // Current Template Selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PREBUILT_TEMPLATES[0].id);
  const currentTemplate = PREBUILT_TEMPLATES.find((t) => t.id === selectedTemplateId) || PREBUILT_TEMPLATES[0];

  // Active Workflow State (nodes, edges, status)
  const [nodes, setNodes] = useState<N8nTelecomNode[]>(currentTemplate.nodes);
  const [edges, setEdges] = useState<N8nEdge[]>(currentTemplate.edges);
  const [workflowActive, setWorkflowActive] = useState<boolean>(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentTemplate.nodes[0]?.id || '');
  const [inspectorTab, setInspectorTab] = useState<'parameters' | 'input' | 'output' | 'docs'>('parameters');

  // Execution & Simulation State
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState<boolean>(false);
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);
  const [executionProgress, setExecutionProgress] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([
    {
      runId: 'run-99120',
      startedAt: '2026-11-09T14:38:12Z',
      totalDurationMs: 230,
      status: 'success',
      triggerSource: 'Safaricom SIP Anycast INVITE',
      stepsCount: 4,
      nodesRun: [
        { nodeId: 'node-trig-inbound', nodeName: 'Inbound SIP Call Trigger', latencyMs: 12, status: 'success' },
        { nodeId: 'node-fs-answer', nodeName: 'FreeSWITCH Answer & SDP', latencyMs: 18, status: 'success' },
        { nodeId: 'node-lang-router', nodeName: 'Acoustic Dialect Classifier', latencyMs: 24, status: 'success' },
        { nodeId: 'node-gemini-agent', nodeName: 'Gemini 3.8 Flash Voice Agent', latencyMs: 176, status: 'success' }
      ]
    }
  ]);

  // Canvas View Controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // "+ Add Node" Modal State
  const [showAddNodeModal, setShowAddNodeModal] = useState<boolean>(false);
  const [connectorCategoryFilter, setConnectorCategoryFilter] = useState<string>('all');
  const [connectorSearchQuery, setConnectorSearchQuery] = useState<string>('');

  // Switch template
  const handleSelectTemplate = (templateId: string) => {
    const tpl = PREBUILT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setSelectedTemplateId(templateId);
    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    setSelectedNodeId(tpl.nodes[0]?.id || '');
    setToastMessage(`Loaded workflow template: ${tpl.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Currently selected node object
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  // Update a configuration property on the selected node
  const handleUpdateSelectedNodeConfig = (key: string, value: any) => {
    if (!selectedNode) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id
          ? { ...n, config: { ...n.config, [key]: value } }
          : n
      )
    );
  };

  // Test / Execute a single node individually (Signature n8n feature)
  const handleExecuteSingleNode = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: 'running' } : n))
    );
    const measuredLatency = Math.floor(Math.random() * 30) + 12;

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: 'success',
                latencyMs: measuredLatency,
                sampleOutput: {
                  ...n.sampleOutput,
                  _executedAt: new Date().toISOString(),
                  _executionLatencyMs: measuredLatency,
                  _telecomEngine: 'FreeSWITCH 1.10 Anycast ESL / Linux 6.8 RT-PREEMPT'
                }
              }
            : n
        )
      );
      setToastMessage(`Node executed in ${measuredLatency}ms with HTTP 200 / SIP 200 OK.`);
      setTimeout(() => setToastMessage(null), 2500);
    }, 450);
  };

  // Run the full DAG workflow simulation from start to finish
  const handleExecuteFullWorkflow = () => {
    if (isExecutingWorkflow) return;
    setIsExecutingWorkflow(true);
    setExecutionProgress(0);

    // Reset all nodes to idle
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));

    const totalSteps = nodes.length;
    let stepIndex = 0;
    const runLogsAccumulator: Array<{
      nodeId: string;
      nodeName: string;
      latencyMs: number;
      status: 'success' | 'error';
    }> = [];

    const runNextStep = () => {
      if (stepIndex >= totalSteps) {
        setIsExecutingWorkflow(false);
        setExecutingNodeId(null);
        setExecutionProgress(100);

        const newRun: ExecutionLog = {
          runId: `run-${Math.floor(Math.random() * 90000) + 10000}`,
          startedAt: new Date().toISOString(),
          totalDurationMs: runLogsAccumulator.reduce((acc, step) => acc + step.latencyMs, 0),
          status: 'success',
          triggerSource: nodes[0]?.name || 'Manual Workflow Test',
          stepsCount: runLogsAccumulator.length,
          nodesRun: runLogsAccumulator
        };
        setExecutionLogs((prev) => [newRun, ...prev.slice(0, 9)]);

        setToastMessage(`Workflow "${currentTemplate.name}" completed in ${newRun.totalDurationMs}ms!`);
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }

      const node = nodes[stepIndex];
      setExecutingNodeId(node.id);
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'running' } : n))
      );

      const stepLatency = Math.floor(Math.random() * 40) + 15;

      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  status: 'success',
                  latencyMs: stepLatency
                }
              : n
          )
        );
        runLogsAccumulator.push({
          nodeId: node.id,
          nodeName: node.name,
          latencyMs: stepLatency,
          status: 'success'
        });

        stepIndex++;
        setExecutionProgress(Math.round((stepIndex / totalSteps) * 100));
        runNextStep();
      }, 550);
    };

    runNextStep();
  };

  // Add a node from catalog to canvas
  const handleAddConnectorToCanvas = (connector: typeof AVAILABLE_CONNECTORS[0]) => {
    const newId = `node-${connector.category}-${Date.now().toString().slice(-4)}`;
    // Place node at a readable position
    const maxX = nodes.reduce((max, n) => Math.max(max, n.position.x), 50);
    const newNode: N8nTelecomNode = {
      id: newId,
      category: connector.category,
      name: connector.name,
      typeBadge: connector.typeBadge,
      description: connector.description,
      color: connector.color,
      icon: connector.icon,
      position: { x: maxX + 330, y: 180 },
      status: 'idle',
      config: { ...connector.defaultConfig },
      sampleInput: { ...connector.sampleInput },
      sampleOutput: { ...connector.sampleOutput }
    };

    // Auto connect to previous node if available
    const lastNode = nodes[nodes.length - 1];
    const newEdge: N8nEdge | null = lastNode
      ? {
          id: `e-${lastNode.id}-${newId}`,
          from: lastNode.id,
          to: newId
        }
      : null;

    setNodes((prev) => [...prev, newNode]);
    if (newEdge) {
      setEdges((prev) => [...prev, newEdge]);
    }
    setSelectedNodeId(newId);
    setShowAddNodeModal(false);
    setToastMessage(`Added "${connector.name}" to n8n canvas.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    if (nodes.length <= 1) {
      setToastMessage('A workflow must contain at least one node.');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId));
    if (selectedNodeId === nodeId) {
      const remaining = nodes.filter((n) => n.id !== nodeId);
      setSelectedNodeId(remaining[0]?.id || '');
    }
    setToastMessage('Node deleted.');
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Filter connectors
  const filteredConnectors = useMemo(() => {
    return AVAILABLE_CONNECTORS.filter((c) => {
      const matchesCategory =
        connectorCategoryFilter === 'all' || c.category === connectorCategoryFilter;
      const matchesQuery =
        !connectorSearchQuery ||
        c.name.toLowerCase().includes(connectorSearchQuery.toLowerCase()) ||
        c.typeBadge.toLowerCase().includes(connectorSearchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(connectorSearchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [connectorCategoryFilter, connectorSearchQuery]);

  // Export authentic n8n JSON & NCCO VoiceXML
  const n8nWorkflowJson = useMemo(() => {
    return JSON.stringify(
      {
        name: currentTemplate.name,
        nodes: nodes.map((n) => ({
          parameters: n.config,
          id: n.id,
          name: n.name,
          type: `mandelaTelecom.${n.category}.${n.name.replace(/\\s+/g, '')}`,
          typeVersion: 1,
          position: [n.position.x, n.position.y],
          notes: n.description
        })),
        connections: edges.reduce((acc, edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (fromNode && toNode) {
            acc[fromNode.name] = {
              main: [
                [
                  {
                    node: toNode.name,
                    type: 'main',
                    index: 0
                  }
                ]
              ]
            };
          }
          return acc;
        }, {} as Record<string, any>),
        active: workflowActive,
        settings: {
          executionOrder: 'v1',
          saveManualExecutions: true,
          callerIdInheritance: true,
          freeSwitchAnycastCluster: 'Nairobi-Lagos-JNB'
        },
        versionId: 'mandela-n8n-v2.4'
      },
      null,
      2
    );
  }, [currentTemplate, nodes, edges, workflowActive]);

  const nccoVoiceXml = useMemo(() => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by Mandela n8n Telecom DAG Engine -->
<vxml version="2.1" xmlns="http://www.w3.org/2001/vxml">
  <form id="${currentTemplate.id}">
    <block>
      <prompt xml:lang="sw-KE">
        Karibu kwenye mtandao huru wa simu wa Mandela Cloud.
      </prompt>
    </block>
    <!-- Dynamic n8n Node Sequence: ${nodes.map((n) => n.name).join(' -> ')} -->
    <record name="caller_speech" maxtime="30s" finalsilence="800ms" />
    <subdialog name="gemini_agent" src="/api/v1/n8n/orchestrate/${currentTemplate.id}" />
    <transfer name="escalate" dest="${nodes.find((n) => n.config.targetNumber)?.config.targetNumber || '+254700892104'}" />
  </form>
</vxml>`;
  }, [currentTemplate, nodes]);

  // Color mappings for badges
  const getCategoryTheme = (category: N8nNodeCategory) => {
    switch (category) {
      case 'trigger':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
          headerBg: 'bg-emerald-950/40',
          dot: 'bg-emerald-400',
          ring: 'ring-emerald-500/30'
        };
      case 'telephony':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
          headerBg: 'bg-cyan-950/40',
          dot: 'bg-cyan-400',
          ring: 'ring-cyan-500/30'
        };
      case 'ai_speech':
        return {
          border: 'border-violet-500/40 hover:border-violet-400',
          badgeBg: 'bg-violet-950/80 text-violet-300 border-violet-800/80',
          headerBg: 'bg-violet-950/40',
          dot: 'bg-violet-400',
          ring: 'ring-violet-500/30'
        };
      case 'african_fintech':
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
          headerBg: 'bg-amber-950/40',
          dot: 'bg-amber-400',
          ring: 'ring-amber-500/30'
        };
      case 'security_soc':
        return {
          border: 'border-rose-500/40 hover:border-rose-400',
          badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
          headerBg: 'bg-rose-950/40',
          dot: 'bg-rose-400',
          ring: 'ring-rose-500/30'
        };
      case 'dataverse_logic':
      default:
        return {
          border: 'border-sky-500/40 hover:border-sky-400',
          badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
          headerBg: 'bg-sky-950/40',
          dot: 'bg-sky-400',
          ring: 'ring-sky-500/30'
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans select-none overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900 border border-emerald-500/60 text-emerald-300 rounded-lg shadow-2xl text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP N8N ACTION & ORCHESTRATION TOOLBAR */}
      <header className="h-14 bg-zinc-900/90 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 gap-3 z-30 backdrop-blur-sm">
        {/* Left: Template Selector & Workflow Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  n8n Automation Engine
                </span>
                <span className="text-[10px] font-mono text-zinc-500">·</span>
                <span className="text-[10px] font-mono text-zinc-400">{currentTemplate.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white rounded px-2 py-0.5 cursor-pointer focus:outline-none focus:border-emerald-400 transition-colors"
                >
                  {PREBUILT_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] font-mono text-zinc-400 hidden xl:inline">
                  Entry: {currentTemplate.entryPoint}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Subview Tabs (Canvas, Node Catalog, Executions, n8n JSON / NCCO) */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => onSelectSubView ? onSelectSubView('canvas') : null}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeSubView === 'canvas'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => onSelectSubView ? onSelectSubView('node_catalog') : null}
            className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
              activeSubView === 'node_catalog'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Library</span>
            <span className="text-[10px] font-mono px-1 rounded bg-zinc-900 text-emerald-400">30+</span>
          </button>
          <button
            onClick={() => onSelectSubView ? onSelectSubView('executions') : null}
            className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
              activeSubView === 'executions'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Runs</span>
            <span className="text-[10px] font-mono px-1 rounded bg-zinc-900 text-zinc-400">
              {executionLogs.length}
            </span>
          </button>
          <button
            onClick={() => onSelectSubView ? onSelectSubView('ncco_export') : null}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeSubView === 'ncco_export'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            n8n / NCCO Spec
          </button>
        </div>

        {/* Right: Actions (Active Toggle, + Add Node, Test Workflow, Save) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Switch */}
          <button
            onClick={() => setWorkflowActive(!workflowActive)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              workflowActive
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-500'
            }`}
            title="Toggle whether workflow is listening for real carrier traffic"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                workflowActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <span>{workflowActive ? 'ACTIVE' : 'INACTIVE'}</span>
          </button>

          {/* "+ Add Node" Button */}
          <button
            onClick={() => setShowAddNodeModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Add Node</span>
          </button>

          {/* Test Workflow (Execute Full DAG) */}
          <button
            onClick={handleExecuteFullWorkflow}
            disabled={isExecutingWorkflow}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isExecutingWorkflow
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-wait'
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-emerald-500/20'
            }`}
          >
            {isExecutingWorkflow ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                <span>Simulating ({executionProgress}%)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Workflow</span>
              </>
            )}
          </button>

          {/* Save Workflow */}
          <button
            onClick={() => {
              if (onSave) onSave(workflow);
              setToastMessage(`Workflow "${currentTemplate.name}" configuration saved to PostgreSQL.`);
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
            title="Save workflow version"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SUBVIEW ROUTING */}

      {/* SUBVIEW A: INTERACTIVE N8N CANVAS & INSPECTOR */}
      {activeSubView === 'canvas' && (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Visual Canvas Area */}
          <div
            className="flex-1 overflow-auto relative min-h-0 bg-zinc-950 flex flex-col"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
              backgroundColor: '#09090b'
            }}
          >
            {/* Canvas Floating Controls (Zoom, Reset, Softphone shortcut) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-zinc-900/95 border border-zinc-800 p-1 rounded-lg shadow-xl backdrop-blur-md">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1 text-[11px] font-mono text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
              <button
                onClick={() => {
                  if (onOpenSoftphone) {
                    onOpenSoftphone(nodes.find((n) => n.config.targetNumber)?.config.targetNumber || '+254207901000');
                  }
                }}
                className="px-2 py-1 text-[11px] font-mono text-emerald-400 hover:bg-zinc-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Dial workflow entry point on Softphone"
              >
                <Phone className="w-3 h-3" />
                <span>Dial DID</span>
              </button>
            </div>

            {/* The Node Graph Canvas Plane */}
            <div
              className="relative min-w-[1400px] min-h-[700px] p-12 transition-transform duration-150 origin-top-left"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* SVG BEZIER CONNECTOR CABLES */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient id="cable-emerald-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="cable-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>

                {edges.map((edge) => {
                  const fromNode = nodes.find((n) => n.id === edge.from);
                  const toNode = nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  // Output port on right of fromNode (card width ~280px, height ~130px)
                  const x1 = fromNode.position.x + 276;
                  const y1 = fromNode.position.y + 65;

                  // Input port on left of toNode
                  const x2 = toNode.position.x;
                  const y2 = toNode.position.y + 65;

                  // Cubic bezier curve control points (n8n signature smooth curve)
                  const dx = Math.abs(x2 - x1) * 0.55;
                  const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                  const isActiveCable =
                    isExecutingWorkflow &&
                    (executingNodeId === fromNode.id || executingNodeId === toNode.id);

                  return (
                    <g key={edge.id}>
                      {/* Background Cable Stroke */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#27272a"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />

                      {/* Foreground Live Gradient Cable */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={isActiveCable ? 'url(#cable-pulse-grad)' : 'url(#cable-emerald-grad)'}
                        strokeWidth={isActiveCable ? '3' : '2'}
                        strokeDasharray={isActiveCable ? '6 6' : 'none'}
                        className={isActiveCable ? 'animate-pulse' : ''}
                      />

                      {/* Port Dots */}
                      <circle cx={x1} cy={y1} r="4.5" fill="#10b981" />
                      <circle cx={x2} cy={y2} r="4.5" fill="#06b6d4" />

                      {/* Optional Edge Label */}
                      {edge.label && (
                        <text
                          x={(x1 + x2) / 2}
                          y={(y1 + y2) / 2 - 8}
                          fill="#a1a1aa"
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="middle"
                          className="bg-zinc-900 px-1 select-none pointer-events-none"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* N8N NODE CARDS ON 2D CANVAS */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isCurrentlyRunning = executingNodeId === node.id || node.status === 'running';
                const theme = getCategoryTheme(node.category);
                const NodeIcon = node.icon;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                      width: '276px'
                    }}
                    className={`absolute z-10 rounded-xl bg-zinc-900/95 border transition-all duration-150 cursor-pointer shadow-xl backdrop-blur-md select-none group ${
                      isSelected
                        ? `ring-2 ring-emerald-400 border-emerald-400 shadow-emerald-500/20`
                        : `${theme.border} hover:shadow-2xl`
                    } ${isCurrentlyRunning ? 'ring-2 ring-emerald-400 scale-[1.02]' : ''}`}
                  >
                    {/* Left Input Port Connector Dot */}
                    <div
                      className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-emerald-400 flex items-center justify-center hover:scale-125 transition-transform"
                      title="Input Port (Receives data from previous step)"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>

                    {/* Right Output Port Connector Dot */}
                    <div
                      className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-900 border-2 border-cyan-400 flex items-center justify-center hover:scale-125 transition-transform"
                      title="Output Port (Emits data to next steps)"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>

                    {/* Node Header with Category Badge & Action Icons */}
                    <div
                      className={`p-3 rounded-t-xl border-b border-zinc-800 flex items-center justify-between ${theme.headerBg}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${theme.badgeBg}`}
                        >
                          <NodeIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{node.name}</h4>
                          <span className="text-[10px] font-mono text-zinc-400 block truncate">
                            {node.typeBadge}
                          </span>
                        </div>
                      </div>

                      {/* Quick Execute Step Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecuteSingleNode(node.id);
                        }}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Execute step individually"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Node Body with Summary & Status */}
                    <div className="p-3 space-y-2">
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>

                      {/* Status / Latency Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          {node.status === 'running' ? (
                            <>
                              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                              <span className="text-emerald-400 font-bold">Running...</span>
                            </>
                          ) : node.status === 'success' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-zinc-300 font-semibold">Success</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-zinc-600" />
                              <span className="text-zinc-500">Ready</span>
                            </>
                          )}
                        </div>

                        {node.latencyMs && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono">
                            {node.latencyMs}ms
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover Action Bar */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 right-0 flex items-center gap-1 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded-lg shadow-lg text-[10px] font-mono z-30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                        }}
                        className="p-1 text-zinc-400 hover:text-white"
                        title="Configure Node"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="p-1 text-zinc-400 hover:text-rose-400"
                        title="Delete Node"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: N8N SIGNATURE NODE CONFIGURATION INSPECTOR */}
          {selectedNode && (
            <aside className="w-80 sm:w-96 bg-zinc-950 border-l border-zinc-800 flex flex-col shrink-0 z-20 shadow-2xl overflow-hidden">
              {/* Drawer Header */}
              <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-zinc-850 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{selectedNode.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-400">{selectedNode.typeBadge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleExecuteSingleNode(selectedNode.id)}
                    className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Test step individually"
                  >
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Test step</span>
                  </button>
                </div>
              </div>

              {/* Inspector Navigation Tabs */}
              <div className="flex border-b border-zinc-800 bg-zinc-900/40 text-xs font-mono">
                {(['parameters', 'input', 'output', 'docs'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setInspectorTab(tab)}
                    className={`flex-1 py-2 text-center uppercase tracking-wider text-[10px] font-bold border-b-2 transition-colors cursor-pointer ${
                      inspectorTab === tab
                        ? 'border-emerald-400 text-white bg-zinc-900'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Inspector Content Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
                {/* 1. PARAMETERS TAB */}
                {inspectorTab === 'parameters' && (
                  <div className="space-y-4">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                      Configure parameters for this node. Changes reflect instantly in execution DAG and NCCO compiler.
                    </div>

                    {Object.entries(selectedNode.config).map(([key, val]) => {
                      const isBoolean = typeof val === 'boolean';
                      const isNumber = typeof val === 'number';

                      return (
                        <div key={key} className="space-y-1.5">
                          <label className="text-[11px] font-mono text-zinc-300 font-semibold block capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>

                          {isBoolean ? (
                            <button
                              onClick={() => handleUpdateSelectedNodeConfig(key, !val)}
                              className={`w-full py-1.5 px-3 rounded text-left font-mono text-xs flex items-center justify-between border cursor-pointer ${
                                val
                                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                              }`}
                            >
                              <span>{val ? 'ENABLED' : 'DISABLED'}</span>
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  val ? 'bg-emerald-400' : 'bg-zinc-600'
                                }`}
                              />
                            </button>
                          ) : (
                            <input
                              type={isNumber ? 'number' : 'text'}
                              value={val}
                              onChange={(e) =>
                                handleUpdateSelectedNodeConfig(
                                  key,
                                  isNumber ? Number(e.target.value) : e.target.value
                                )
                              }
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-400 transition-colors"
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* Quick Dial Test (if telephone or AI node) */}
                    {(selectedNode.config.targetNumber || selectedNode.config.dnisRegex) && (
                      <div className="pt-2 border-t border-zinc-800/80">
                        <button
                          onClick={() => {
                            if (onOpenSoftphone) {
                              onOpenSoftphone(selectedNode.config.targetNumber || '+254207901000');
                            }
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Test on Softphone Leg</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. INPUT DATA TAB */}
                {inspectorTab === 'input' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        Incoming Payload from Preceding Nodes
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(selectedNode.sampleInput, null, 2));
                          setToastMessage('Input JSON copied to clipboard.');
                          setTimeout(() => setToastMessage(null), 2000);
                        }}
                        className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-96">
                      {JSON.stringify(selectedNode.sampleInput, null, 2)}
                    </pre>
                  </div>
                )}

                {/* 3. OUTPUT DATA TAB */}
                {inspectorTab === 'output' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        Step Execution Result JSON
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(selectedNode.sampleOutput, null, 2));
                          setToastMessage('Output JSON copied to clipboard.');
                          setTimeout(() => setToastMessage(null), 2000);
                        }}
                        className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-lg text-[10px] font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
                      {JSON.stringify(selectedNode.sampleOutput, null, 2)}
                    </pre>
                  </div>
                )}

                {/* 4. DOCS TAB */}
                {inspectorTab === 'docs' && (
                  <div className="space-y-3 text-zinc-300">
                    <h4 className="text-xs font-bold text-white">{selectedNode.name} Reference</h4>
                    <p className="text-[11px] leading-relaxed text-zinc-400">
                      Standard telecommunications microservice running within Mandela Agnostic OS.
                      Exposes native FreeSWITCH ESL socket, Kamailio routing hooks, or @google/genai streaming pipeline.
                    </p>
                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400 space-y-1">
                      <div>Driver: <span className="text-emerald-400">mod_freeswitch_esl.ko</span></div>
                      <div>Memory: <span className="text-zinc-200">2.4 MB</span></div>
                      <div>Socket: <span className="text-zinc-200">/run/mandela/ipc-n8n.sock</span></div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      )}

      {/* SUBVIEW B: FULL 30+ CONNECTOR NODE CATALOG */}
      {activeSubView === 'node_catalog' && (
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 space-y-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Catalog Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">n8n Node Connector Library</h3>
                <p className="text-xs text-zinc-400">
                  Select and add any of the 30+ African telecom, AI, FinTech, and media connectors into your active workflow.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={connectorSearchQuery}
                    onChange={(e) => setConnectorSearchQuery(e.target.value)}
                    placeholder="Search connectors..."
                    className="bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-400 w-56 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {[
                { id: 'all', label: 'All Connectors' },
                { id: 'trigger', label: 'Triggers' },
                { id: 'telephony', label: 'FreeSWITCH & Telephony' },
                { id: 'ai_speech', label: 'AI & Neural Speech' },
                { id: 'african_fintech', label: 'African FinTech & DIDs' },
                { id: 'security_soc', label: 'Security & SOC' },
                { id: 'dataverse_logic', label: 'Dataverse & Logic' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setConnectorCategoryFilter(cat.id)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    connectorCategoryFilter === cat.id
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Connectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnectors.map((connector, idx) => {
                const IconComponent = connector.icon;
                const theme = getCategoryTheme(connector.category);

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${theme.badgeBg}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {connector.name}
                            </h4>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {connector.typeBadge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                        {connector.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        handleAddConnectorToCanvas(connector);
                        if (onSelectSubView) onSelectSubView('canvas');
                      }}
                      className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Canvas</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW C: EXECUTION RUNS & AUDIT LOGS */}
      {activeSubView === 'executions' && (
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">Workflow Execution History</h3>
                <p className="text-xs text-zinc-400">
                  Audit logs of real and simulated DAG execution runs with node-by-node latency breakdown.
                </p>
              </div>

              <button
                onClick={handleExecuteFullWorkflow}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trigger New Execution</span>
              </button>
            </div>

            {/* Executions Table */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Run ID</th>
                    <th className="p-3">Trigger Source</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Steps</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Executed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {executionLogs.map((log) => (
                    <tr key={log.runId} className="hover:bg-zinc-850/50 transition-colors">
                      <td className="p-3 font-bold text-emerald-400">{log.runId}</td>
                      <td className="p-3 text-zinc-300">{log.triggerSource}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px]">
                          SUCCESS
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400">{log.stepsCount} nodes</td>
                      <td className="p-3 font-bold text-zinc-200">{log.totalDurationMs}ms</td>
                      <td className="p-3 text-zinc-400 text-[11px]">{new Date(log.startedAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Active Execution Nodes Breakdown */}
            {executionLogs[0] && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Latest Run Node Latency Breakdown ({executionLogs[0].runId})
                </h4>
                <div className="space-y-2">
                  {executionLogs[0].nodesRun.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-zinc-850 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-zinc-200">{step.nodeName}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{step.latencyMs}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBVIEW D: DUAL N8N JSON & NCCO VOICEXML SPEC */}
      {activeSubView === 'ncco_export' && (
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">Workflow Dual-Spec Compiler</h3>
                <p className="text-xs text-zinc-400">
                  Export valid n8n Workflow JSON graph schema alongside VoiceXML 2.1 & NCCO dialplan dialects.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([n8nWorkflowJson], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentTemplate.id}-n8n-workflow.json`;
                    a.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download n8n JSON</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box 1: n8n JSON */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    n8n Standard Workflow JSON (Graph Specification)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(n8nWorkflowJson);
                      setToastMessage('n8n JSON copied to clipboard.');
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[460px]">
                  {n8nWorkflowJson}
                </pre>
              </div>

              {/* Box 2: VoiceXML / NCCO */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    VoiceXML 2.1 & NCCO Telephony Dialplan
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(nccoVoiceXml);
                      setToastMessage('VoiceXML markup copied to clipboard.');
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg text-[10px] font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-[460px]">
                  {nccoVoiceXml}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. "+ ADD NODE" MODAL (Pop-up from toolbar "+ Add Node" button) */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Add Node to n8n Canvas</h3>
                  <span className="text-[11px] text-zinc-400">Choose from African telecom, AI, and FinTech connectors</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddNodeModal(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search & Filter */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={connectorSearchQuery}
                  onChange={(e) => setConnectorSearchQuery(e.target.value)}
                  placeholder="Filter nodes by name, service, or keyword..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-400 font-mono"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'trigger', label: 'Triggers' },
                  { id: 'telephony', label: 'Telephony' },
                  { id: 'ai_speech', label: 'AI Speech' },
                  { id: 'african_fintech', label: 'FinTech & DIDs' },
                  { id: 'security_soc', label: 'Security' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setConnectorCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      connectorCategoryFilter === cat.id
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Connectors List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredConnectors.map((c, idx) => {
                const IconComponent = c.icon;
                const theme = getCategoryTheme(c.category);

                return (
                  <button
                    key={idx}
                    onClick={() => handleAddConnectorToCanvas(c)}
                    className="w-full p-3 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${theme.badgeBg}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                          {c.name}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 truncate">
                          {c.typeBadge} · {c.description}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:bg-emerald-500 group-hover:text-zinc-950 text-[10px] font-mono shrink-0 transition-colors">
                      + Add
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
