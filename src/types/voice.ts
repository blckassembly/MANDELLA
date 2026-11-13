export type IvrNodeType =
  | 'welcome_play'
  | 'language_select'
  | 'speech_input'
  | 'voice_biometrics'
  | 'dtmf_menu'
  | 'bridge_call'
  | 'hangup';

export interface IvrNode {
  id: string;
  type: IvrNodeType;
  title: string;
  promptText: string;
  ttsVoice: string;
  language?: string;
  options?: Array<{ key: string; label: string; targetNodeId?: string }>;
  bridgeTarget?: string;
}

export interface VoiceIvrFlow {
  id: string;
  name: string;
  description: string;
  assignedE164: string; // Bound to System 1 sovereign number
  countryCode: string;
  mode: 'visual' | 'ncco' | 'voicexml';
  primaryLanguage: string;
  supportedLanguages: string[];
  nodes: IvrNode[];
  nccoJson?: string;
  voiceXmlText?: string;
  recordCalls: boolean;
  amdEnabled: boolean; // Answering Machine Detection
  voiceBiometricsEnabled: boolean;
  noiseSuppressionEnabled: boolean;
  status: 'active' | 'draft' | 'archived';
  totalCalls: number;
  completionRate: number;
  avgDurationSec: number;
  avgMosScore: number;
}

export interface LiveVoiceCall {
  id: string;
  callerMsisdn: string;
  didE164: string;
  carrier: string;
  countryCode: string;
  flowId: string;
  flowName: string;
  state: 'ringing' | 'in_dialog' | 'bridged' | 'completed' | 'failed';
  durationSec: number;
  detectedLanguage: string;
  codeSwitchingDetected: boolean;
  codeSwitchingPair?: string; // e.g. "English + Twi" or "Swahili + Sheng"
  currentStep: string;
  mosScore: number; // 1.0 to 5.0
  mediaServer: string; // FreeSWITCH cluster node
  supervisorMode: 'none' | 'listening' | 'whispering' | 'barged';
  liveTranscript: Array<{ speaker: 'system' | 'caller'; text: string; time: string }>;
  startedAt: string;
}

export interface AfricanLanguageModel {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  speakersCount: string;
  asrAccuracy: number; // e.g. 88.5%
  ttsNaturalnessMos: number; // e.g. 4.2
  codeSwitchingSupport: boolean;
  status: 'production' | 'fine_tuning' | 'training';
  sampleAudioPrompt: string;
  sampleTranslationEn: string;
}

export interface CallSummaryReport {
  callId: string;
  callerMsisdn: string;
  didE164: string;
  language: string;
  durationSec: number;
  intent: string;
  structuredOutcome: Record<string, string>;
  sentiment: 'positive' | 'neutral' | 'urgent' | 'negative';
  transcriptSummary: string;
  timestamp: string;
  recordingWaveform: number[];
}
