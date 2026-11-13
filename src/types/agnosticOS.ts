/**
 * Agnostic Communications Operating System (Agnostic OS)
 * Core Type Definitions & API Contracts
 * Based on the Carrier/SIP -> FreeSWITCH -> RTPEngine -> Call Control -> ASR/TTS -> AI Layer Architecture
 */

export type ProviderCategory = 'telephony_sip' | 'media_engine' | 'asr_speech_to_text' | 'tts_text_to_speech' | 'ai_llm' | 'storage';

export type ProviderStatus = 'healthy' | 'degraded' | 'unverified' | 'offline';

export interface ProviderCapability {
  id: string;
  category: ProviderCategory;
  name: string;
  vendor: string;
  version: string;
  status: ProviderStatus;
  isDefault: boolean;
  capabilities: {
    streamingAudio: boolean;
    bargeIn: boolean;
    codeSwitching: boolean;
    nativeAfricanLanguages: boolean;
    voiceBiometrics: boolean;
    noiseSuppression: boolean;
    dtmfDetection: boolean;
    pcapRecording: boolean;
  };
  supportedLanguages: string[]; // e.g. ['sw-KE', 'yo-NG', 'am-ET', 'zu-ZA', 'ha-NG', 'en-US', 'fr-FR']
  pricing: {
    unit: 'per_minute' | 'per_1k_chars' | 'per_1k_tokens' | 'per_gigabyte' | 'per_call';
    costUsd: number;
  };
  latencyAvgMs: number;
  endpoint: string;
  credentialVaultKeyId?: string;
  notes?: string;
}

export type CallDirection = 'inbound' | 'outbound';
export type CallState = 'ringing' | 'connected' | 'in_ivr' | 'ai_active' | 'transferring' | 'bridged' | 'completed' | 'failed';
export type SupervisorMode = 'listen' | 'whisper' | 'barge' | 'none';

export interface CallParticipant {
  id: string;
  role: 'consumer' | 'ai_agent' | 'human_agent' | 'supervisor';
  numberOrName: string;
  country: string;
  joinedAt: string;
  audioMuted: boolean;
  mosScore: number; // 1.0 - 5.0
  jitterMs: number;
  packetLossPercent: number;
}

export interface LiveCallSession {
  id: string;
  callControlId: string;
  tenantId: string;
  from: string;
  fromLabel: string;
  to: string;
  direction: CallDirection;
  state: CallState;
  workflowId: string;
  workflowName: string;
  activeNodeId?: string;
  mediaServerId: string; // e.g. "freeswitch-nbo-01"
  rtpEngineId: string; // e.g. "rtpengine-cluster-east"
  startedAt: string;
  durationSeconds: number;
  selectedLanguage: string; // e.g. 'sw-KE' (Swahili)
  detectedDialect?: string;
  mosScore: number;
  asrConfidence: number;
  supervisorAction?: SupervisorMode;
  participants: CallParticipant[];
  liveTranscript: Array<{
    id: string;
    speaker: 'consumer' | 'agent' | 'system';
    text: string;
    timestamp: string;
    language: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
  }>;
  recordAudioEnabled: boolean;
  costAccruedUsd: number;
}

export type WorkflowNodeType = 
  | 'trigger_inbound'
  | 'answer'
  | 'say_tts'
  | 'play_audio'
  | 'gather_dtmf'
  | 'ai_conversational_agent'
  | 'condition_branch'
  | 'record_start'
  | 'transfer_sip_bridge'
  | 'external_webhook'
  | 'send_sms'
  | 'hangup';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description: string;
  config: {
    messageText?: string;
    voiceId?: string;
    language?: string;
    ttsProviderId?: string;
    asrProviderId?: string;
    aiAgentId?: string;
    numDigits?: number;
    dtmfTimeoutSeconds?: number;
    transferTarget?: string; // E.164 phone number or SIP URI
    transferTimeoutSeconds?: number;
    webhookUrl?: string;
    webhookMethod?: 'GET' | 'POST';
    conditionVariable?: string;
    conditionOperator?: 'equals' | 'contains' | 'greater_than';
    conditionValue?: string;
    maxDurationSeconds?: number;
    noiseSuppression?: boolean;
    recordConsentRequired?: boolean;
  };
  position: { x: number; y: number };
  nextDefault?: string;
  nextBranches?: Array<{ label: string; conditionValue: string; targetNodeId: string }>;
}

export interface CallWorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  version: number;
  status: 'draft' | 'testing' | 'active' | 'archived';
  description: string;
  entryNumber: string; // E.164 phone number or prefix
  nodes: WorkflowNode[];
  selectedProviders: {
    telephonyId: string;
    mediaEngineId: string;
    asrProviderId: string;
    ttsProviderId: string;
    aiProviderId: string;
  };
  supportedLanguages: string[];
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiAgentConfig {
  id: string;
  tenantId: string;
  name: string;
  roleDescription: string;
  systemPrompt: string;
  personaTone: 'empathetic' | 'formal' | 'concise' | 'technical';
  primaryLanguage: string;
  supportedLocales: string[];
  enableCodeSwitching: boolean;
  llmProviderId: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  enableBiometrics: boolean;
  enableNoiseSuppression: boolean;
  toolsAllowed: Array<{
    name: string;
    description: string;
    parametersSchema: string;
    endpointUrl?: string;
  }>;
  fallbackTransferNumber: string;
  escalationKeywords: string[];
  status: 'draft' | 'simulated' | 'published';
  lastSimulationResult?: {
    success: boolean;
    turnCount: number;
    avgLatencyMs: number;
    asrAccuracy: number;
    dialogueExcerpt: string;
  };
}

export interface CallRecordingRecord {
  id: string;
  callSessionId: string;
  tenantId: string;
  from: string;
  to: string;
  startedAt: string;
  durationSeconds: number;
  audioUrl: string;
  fileSizeBytes: number;
  storageProvider: string;
  encryptionAlgorithm: string; // e.g. "AES-GCM-256"
  consentObtained: boolean;
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'urgent';
  language: string;
  mosScore: number;
  piiRedacted: boolean;
  summary: string;
  transcription: Array<{
    speaker: 'consumer' | 'agent';
    text: string;
    startSecond: number;
    endSecond: number;
    confidence: number;
  }>;
}

export interface TelemetryMetricPoint {
  timestamp: string;
  activeChannels: number;
  concurrentCalls: number;
  avgMosScore: number;
  asrLatencyMs: number;
  ttsLatencyMs: number;
  llmLatencyMs: number;
  packetLossPercent: number;
  networkJitterMs: number;
}
