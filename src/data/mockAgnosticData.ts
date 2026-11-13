import {
  ProviderCapability,
  LiveCallSession,
  CallWorkflowDefinition,
  AiAgentConfig,
  CallRecordingRecord,
  TelemetryMetricPoint
} from '../types/agnosticOS';

export const INITIAL_PROVIDERS: ProviderCapability[] = [
  // 1. Telephony & SIP
  {
    id: 'prov-freeswitch-core',
    category: 'telephony_sip',
    name: 'FreeSWITCH Anycast SIP Core',
    vendor: 'Mandela Cloud (System 7/9)',
    version: '1.10.10-sovereign',
    status: 'healthy',
    isDefault: true,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: true,
      nativeAfricanLanguages: true,
      voiceBiometrics: true,
      noiseSuppression: true,
      dtmfDetection: true,
      pcapRecording: true,
    },
    supportedLanguages: ['sw-KE', 'yo-NG', 'am-ET', 'zu-ZA', 'ha-NG', 'en-US', 'fr-FR'],
    pricing: { unit: 'per_minute', costUsd: 0.0085 },
    latencyAvgMs: 14,
    endpoint: 'sip:sip.nairobi.mandela.net:5060;transport=tls',
    credentialVaultKeyId: 'vault-key-fs-core-nbo',
    notes: 'Primary sovereign carrier SIP trunk. Capacity 1,000 concurrent calls per node.',
  },
  {
    id: 'prov-telnyx-sip',
    category: 'telephony_sip',
    name: 'Telnyx Global SIP Trunk',
    vendor: 'Telnyx Corp',
    version: 'v2-webrtc-sip',
    status: 'healthy',
    isDefault: false,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: false,
      nativeAfricanLanguages: false,
      voiceBiometrics: false,
      noiseSuppression: true,
      dtmfDetection: true,
      pcapRecording: false,
    },
    supportedLanguages: ['en-US', 'fr-FR', 'es-ES'],
    pricing: { unit: 'per_minute', costUsd: 0.0140 },
    latencyAvgMs: 38,
    endpoint: 'sip:sip.telnyx.com:5061',
    credentialVaultKeyId: 'vault-key-telnyx-primary',
    notes: 'Secondary failover SIP provider for international carrier termination.',
  },
  {
    id: 'prov-twilio-voice',
    category: 'telephony_sip',
    name: 'Twilio Elastic SIP Trunking',
    vendor: 'Twilio Inc',
    version: 'trunk-v1',
    status: 'healthy',
    isDefault: false,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: false,
      nativeAfricanLanguages: false,
      voiceBiometrics: false,
      noiseSuppression: false,
      dtmfDetection: true,
      pcapRecording: false,
    },
    supportedLanguages: ['en-US', 'en-GB'],
    pricing: { unit: 'per_minute', costUsd: 0.0220 },
    latencyAvgMs: 62,
    endpoint: 'sip:mandela-prod.pstn.twilio.com',
    credentialVaultKeyId: 'vault-key-twilio-secondary',
    notes: 'Optional cloud telephony adapter for global DID termination.',
  },

  // 2. Media Engine & NAT Traversal
  {
    id: 'prov-rtpengine-cluster',
    category: 'media_engine',
    name: 'RTPEngine Distributed Cluster',
    vendor: 'Sipwise / Mandela Edge',
    version: '11.5.1',
    status: 'healthy',
    isDefault: true,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: true,
      nativeAfricanLanguages: true,
      voiceBiometrics: true,
      noiseSuppression: true,
      dtmfDetection: true,
      pcapRecording: true,
    },
    supportedLanguages: ['all'],
    pricing: { unit: 'per_minute', costUsd: 0.0015 },
    latencyAvgMs: 4,
    endpoint: 'ng://197.210.64.12:22222',
    notes: 'High-throughput NAT traversal, kernel-level packet forwarding & raw PCAP recording.',
  },

  // 3. Speech-to-Text (ASR)
  {
    id: 'prov-asr-mandela-system7',
    category: 'asr_speech_to_text',
    name: 'African Dialect Neural ASR',
    vendor: 'Mandela System 7 AI Lab',
    version: 'asr-africa-v4',
    status: 'healthy',
    isDefault: true,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: true,
      nativeAfricanLanguages: true,
      voiceBiometrics: true,
      noiseSuppression: true,
      dtmfDetection: false,
      pcapRecording: false,
    },
    supportedLanguages: ['sw-KE', 'yo-NG', 'am-ET', 'zu-ZA', 'ha-NG', 'ig-NG', 'wo-SN', 'ln-CD'],
    pricing: { unit: 'per_minute', costUsd: 0.0090 },
    latencyAvgMs: 82,
    endpoint: 'wss://asr.sovereign.mandela.net/v1/stream',
    notes: 'Trained on 100k+ hours of native African speech. Sub-100ms real-time streaming with automatic code-switching.',
  },
  {
    id: 'prov-asr-whisper',
    category: 'asr_speech_to_text',
    name: 'OpenAI Whisper v3 Large',
    vendor: 'OpenAI / Local TensorRT',
    version: 'v3-turbo',
    status: 'healthy',
    isDefault: false,
    capabilities: {
      streamingAudio: false,
      bargeIn: false,
      codeSwitching: true,
      nativeAfricanLanguages: false,
      voiceBiometrics: false,
      noiseSuppression: true,
      dtmfDetection: false,
      pcapRecording: false,
    },
    supportedLanguages: ['en-US', 'fr-FR', 'es-ES', 'ar-EG'],
    pricing: { unit: 'per_minute', costUsd: 0.0060 },
    latencyAvgMs: 240,
    endpoint: 'https://api.openai.com/v1/audio/transcriptions',
    credentialVaultKeyId: 'vault-key-whisper-fast',
    notes: 'Accurate batch and near-realtime English/French/Arabic transcription.',
  },

  // 4. Text-to-Speech (TTS)
  {
    id: 'prov-tts-mandela-voices',
    category: 'tts_text_to_speech',
    name: '50 African Languages Neural TTS',
    vendor: 'Mandela Speech Synthesis',
    version: 'tts-neural-v3.2',
    status: 'healthy',
    isDefault: true,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: true,
      nativeAfricanLanguages: true,
      voiceBiometrics: false,
      noiseSuppression: true,
      dtmfDetection: false,
      pcapRecording: false,
    },
    supportedLanguages: ['sw-KE', 'yo-NG', 'am-ET', 'zu-ZA', 'ha-NG', 'ig-NG', 'en-KE', 'en-NG'],
    pricing: { unit: 'per_1k_chars', costUsd: 0.0120 },
    latencyAvgMs: 95,
    endpoint: 'https://tts.mandela.net/v1/synthesize',
    notes: 'Localized expressive voices with tonal dialect preservation for Swahili, Yoruba, Amharic, and Zulu.',
  },
  {
    id: 'prov-tts-elevenlabs',
    category: 'tts_text_to_speech',
    name: 'ElevenLabs Conversational TTS',
    vendor: 'ElevenLabs Inc',
    version: 'flash-v2.5',
    status: 'healthy',
    isDefault: false,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: false,
      nativeAfricanLanguages: false,
      voiceBiometrics: false,
      noiseSuppression: false,
      dtmfDetection: false,
      pcapRecording: false,
    },
    supportedLanguages: ['en-US', 'en-GB', 'fr-FR'],
    pricing: { unit: 'per_1k_chars', costUsd: 0.0300 },
    latencyAvgMs: 110,
    endpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
    credentialVaultKeyId: 'vault-key-elevenlabs',
    notes: 'Ultra-realistic human voice inflection for global English/French corporate personas.',
  },

  // 5. AI LLM Gateway
  {
    id: 'prov-ai-gemini-38',
    category: 'ai_llm',
    name: 'Google Gemini 3.8 Flash (Server SDK)',
    vendor: 'Google Cloud Vertex / AI Studio',
    version: 'gemini-3.8-flash',
    status: 'healthy',
    isDefault: true,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: true,
      nativeAfricanLanguages: true,
      voiceBiometrics: false,
      noiseSuppression: false,
      dtmfDetection: false,
      pcapRecording: false,
    },
    supportedLanguages: ['all'],
    pricing: { unit: 'per_1k_tokens', costUsd: 0.00015 },
    latencyAvgMs: 140,
    endpoint: 'https://generativelanguage.googleapis.com',
    notes: 'Primary reasoning model for conversational voice agent state machine and tool calling.',
  },
  {
    id: 'prov-ai-claude-35',
    category: 'ai_llm',
    name: 'Anthropic Claude 3.5 Sonnet',
    vendor: 'Anthropic PBC',
    version: 'claude-3-5-sonnet-20241022',
    status: 'healthy',
    isDefault: false,
    capabilities: {
      streamingAudio: true,
      bargeIn: true,
      codeSwitching: true,
      nativeAfricanLanguages: true,
      voiceBiometrics: false,
      noiseSuppression: false,
      dtmfDetection: false,
      pcapRecording: false,
    },
    supportedLanguages: ['all'],
    pricing: { unit: 'per_1k_tokens', costUsd: 0.00300 },
    latencyAvgMs: 290,
    endpoint: 'https://api.anthropic.com/v1/messages',
    credentialVaultKeyId: 'vault-key-anthropic-prod',
    notes: 'High-reasoning secondary model for complex dispute arbitration and legal compliance checks.',
  },

  // 6. S3-Compatible Storage
  {
    id: 'prov-storage-s3-sovereign',
    category: 'storage',
    name: 'Mandela Sovereign S3 Vault',
    vendor: 'Ceph / MinIO Distributed',
    version: 'v4-object-store',
    status: 'healthy',
    isDefault: true,
    capabilities: {
      streamingAudio: true,
      bargeIn: false,
      codeSwitching: false,
      nativeAfricanLanguages: false,
      voiceBiometrics: true,
      noiseSuppression: false,
      dtmfDetection: false,
      pcapRecording: true,
    },
    supportedLanguages: ['all'],
    pricing: { unit: 'per_gigabyte', costUsd: 0.0150 },
    latencyAvgMs: 12,
    endpoint: 's3://vault.nairobi.mandela.net/call-recordings',
    notes: 'AES-GCM-256 encrypted at rest. Complies with African Union Malabo Convention on in-country residency.',
  }
];

export const INITIAL_LIVE_CALLS: LiveCallSession[] = [
  {
    id: 'call-nbo-849201',
    callControlId: 'cc-session-99120',
    tenantId: 'tenant-ke-safaricom-01',
    from: '+254712998102',
    fromLabel: 'Farmer Consumer (Eldoret Maize Coop)',
    to: '+254207901000',
    direction: 'inbound',
    state: 'ai_active',
    workflowId: 'wf-agri-advisory-01',
    workflowName: 'Farmer Agronomy & Microloan Hotline',
    activeNodeId: 'node-ai-agent',
    mediaServerId: 'freeswitch-nbo-01.mandela.cloud',
    rtpEngineId: 'rtpengine-nbo-cluster-1',
    startedAt: new Date(Date.now() - 84 * 1000).toISOString(),
    durationSeconds: 84,
    selectedLanguage: 'sw-KE',
    detectedDialect: 'Rift Valley Swahili (Confidence: 98.4%)',
    mosScore: 4.42,
    asrConfidence: 0.98,
    supervisorAction: 'none',
    participants: [
      {
        id: 'p-consumer-01',
        role: 'consumer',
        numberOrName: '+254 712 998 102',
        country: 'Kenya',
        joinedAt: new Date(Date.now() - 84 * 1000).toISOString(),
        audioMuted: false,
        mosScore: 4.42,
        jitterMs: 14,
        packetLossPercent: 0.02,
      },
      {
        id: 'p-agent-01',
        role: 'ai_agent',
        numberOrName: 'Zawadi (AI Agronomy Agent)',
        country: 'Kenya',
        joinedAt: new Date(Date.now() - 82 * 1000).toISOString(),
        audioMuted: false,
        mosScore: 4.50,
        jitterMs: 4,
        packetLossPercent: 0.0,
      }
    ],
    liveTranscript: [
      {
        id: 't-1',
        speaker: 'system',
        text: 'Call connected via FreeSWITCH media server [PoP: Nairobi IXP]. RTPEngine NAT allocated port 19042.',
        timestamp: '00:02',
        language: 'system',
        sentiment: 'neutral'
      },
      {
        id: 't-2',
        speaker: 'agent',
        text: 'Habari mkulima! Karibu huduma ya ushauri wa kilimo. Je, ungependa kupata bei ya soko ya mahindi au kuangalia mkopo wa mbolea?',
        timestamp: '00:06',
        language: 'sw-KE',
        sentiment: 'positive'
      },
      {
        id: 't-3',
        speaker: 'consumer',
        text: 'Habari yako. Nahitaji kujua bei ya gunia la mahindi katika soko la Eldoret leo, na kama mkopo wangu umeidhinishwa.',
        timestamp: '00:18',
        language: 'sw-KE',
        sentiment: 'neutral'
      },
      {
        id: 't-4',
        speaker: 'agent',
        text: 'Leo katika soko la Eldoret, gunia la kilo 90 linauzwa shilingi 3,400. Pia, mkopo wako wa mbolea wa shilingi elfu kumi na mbili umeidhinishwa asubuhi ya leo!',
        timestamp: '00:32',
        language: 'sw-KE',
        sentiment: 'positive'
      },
      {
        id: 't-5',
        speaker: 'consumer',
        text: 'Asante sana! Naomba unisaidie kuongea na afisa wa mikopo nithibitishe jinsi ya kuipokea kwa M-Pesa.',
        timestamp: '00:54',
        language: 'sw-KE',
        sentiment: 'neutral'
      },
      {
        id: 't-6',
        speaker: 'agent',
        text: 'Sawa kabisa. Ninahamisha simu yako sasa hivi kwa afisa wa mikopo aliyepo kwenye dawati la huduma. Tafadhali subiri kidogo.',
        timestamp: '01:08',
        language: 'sw-KE',
        sentiment: 'positive'
      }
    ],
    recordAudioEnabled: true,
    costAccruedUsd: 0.0118,
  },
  {
    id: 'call-los-382910',
    callControlId: 'cc-session-88204',
    tenantId: 'tenant-ng-ecobank-prod',
    from: '+2348032049102',
    fromLabel: 'Customer (Lagos Merchant)',
    to: '+23412700000',
    direction: 'inbound',
    state: 'ai_active',
    workflowId: 'wf-fintech-auth-02',
    workflowName: 'Ecobank Merchant Auth & POS Support',
    activeNodeId: 'node-ai-agent',
    mediaServerId: 'freeswitch-lag-02.mandela.cloud',
    rtpEngineId: 'rtpengine-lag-cluster-2',
    startedAt: new Date(Date.now() - 42 * 1000).toISOString(),
    durationSeconds: 42,
    selectedLanguage: 'yo-NG',
    detectedDialect: 'Lagos Yoruba & Nigerian Pidgin Code-Switch',
    mosScore: 4.36,
    asrConfidence: 0.96,
    supervisorAction: 'none',
    participants: [
      {
        id: 'p-consumer-02',
        role: 'consumer',
        numberOrName: '+234 803 204 9102',
        country: 'Nigeria',
        joinedAt: new Date(Date.now() - 42 * 1000).toISOString(),
        audioMuted: false,
        mosScore: 4.36,
        jitterMs: 18,
        packetLossPercent: 0.04,
      },
      {
        id: 'p-agent-02',
        role: 'ai_agent',
        numberOrName: 'Adeola (Merchant Voice Bot)',
        country: 'Nigeria',
        joinedAt: new Date(Date.now() - 40 * 1000).toISOString(),
        audioMuted: false,
        mosScore: 4.45,
        jitterMs: 5,
        packetLossPercent: 0.0,
      }
    ],
    liveTranscript: [
      {
        id: 't-21',
        speaker: 'agent',
        text: 'E kaasan! Welcome to Ecobank Merchant Service. How fit I help you today with your terminal or transfer?',
        timestamp: '00:04',
        language: 'yo-NG',
        sentiment: 'positive'
      },
      {
        id: 't-22',
        speaker: 'consumer',
        text: 'Ejo, my POS terminal display error code 91 since morning. Customer wan pay for goods but transaction dey hang.',
        timestamp: '00:15',
        language: 'yo-NG',
        sentiment: 'negative'
      },
      {
        id: 't-23',
        speaker: 'agent',
        text: 'No worry oga. Error 91 na temporary switch network issue. I don restart your terminal session remotely from bank core. Abeg press yellow button restart am now.',
        timestamp: '00:28',
        language: 'yo-NG',
        sentiment: 'positive'
      }
    ],
    recordAudioEnabled: true,
    costAccruedUsd: 0.0064,
  },
  {
    id: 'call-cpt-102948',
    callControlId: 'cc-session-77192',
    tenantId: 'tenant-za-vodacom-01',
    from: '+27829910022',
    fromLabel: 'Mine Site Supervisor (Rustenburg)',
    to: '+27110020000',
    direction: 'inbound',
    state: 'bridged',
    workflowId: 'wf-mining-dispatch-03',
    workflowName: 'AngloSahara Satellite Telemetry Escalation',
    activeNodeId: 'node-transfer',
    mediaServerId: 'freeswitch-cpt-01.mandela.cloud',
    rtpEngineId: 'rtpengine-cpt-cluster-1',
    startedAt: new Date(Date.now() - 195 * 1000).toISOString(),
    durationSeconds: 195,
    selectedLanguage: 'zu-ZA',
    detectedDialect: 'IsiZulu Technical Terminology',
    mosScore: 4.18,
    asrConfidence: 0.94,
    supervisorAction: 'none',
    participants: [
      {
        id: 'p-consumer-03',
        role: 'consumer',
        numberOrName: '+27 82 991 0022',
        country: 'South Africa',
        joinedAt: new Date(Date.now() - 195 * 1000).toISOString(),
        audioMuted: false,
        mosScore: 4.18,
        jitterMs: 24,
        packetLossPercent: 0.08,
      },
      {
        id: 'p-human-01',
        role: 'human_agent',
        numberOrName: 'Sipho Dlamini (Senior NOC Controller)',
        country: 'South Africa',
        joinedAt: new Date(Date.now() - 120 * 1000).toISOString(),
        audioMuted: false,
        mosScore: 4.48,
        jitterMs: 6,
        packetLossPercent: 0.0,
      }
    ],
    liveTranscript: [
      {
        id: 't-31',
        speaker: 'agent',
        text: 'Sawubona. Ngikudlulisela kumphathi we-NOC mayelana nesexwayiso sesiteshi se-satellite.',
        timestamp: '01:10',
        language: 'zu-ZA',
        sentiment: 'neutral'
      },
      {
        id: 't-32',
        speaker: 'agent',
        text: 'Bridged to Senior NOC Controller Sipho Dlamini at Johannesburg Operations Center.',
        timestamp: '01:15',
        language: 'system',
        sentiment: 'neutral'
      }
    ],
    recordAudioEnabled: true,
    costAccruedUsd: 0.0285,
  }
];

export const INITIAL_CALL_WORKFLOWS: CallWorkflowDefinition[] = [
  {
    id: 'wf-agri-advisory-01',
    tenantId: 'tenant-ke-safaricom-01',
    name: 'Farmer Agronomy & Microloan Hotline',
    version: 3,
    status: 'active',
    description: 'Multilingual customer service voice agent that greets in Swahili/English, answers crop market questions via System 7 AI, and transfers to a loan officer if unresolved.',
    entryNumber: '+254207901000',
    selectedProviders: {
      telephonyId: 'prov-freeswitch-core',
      mediaEngineId: 'prov-rtpengine-cluster',
      asrProviderId: 'prov-asr-mandela-system7',
      ttsProviderId: 'prov-tts-mandela-voices',
      aiProviderId: 'prov-ai-gemini-38',
    },
    supportedLanguages: ['sw-KE', 'en-KE'],
    requiresApproval: false,
    approvedBy: 'lead_architect@mandela.africa',
    approvedAt: '2026-10-20T10:00:00Z',
    createdAt: '2026-10-15T08:30:00Z',
    updatedAt: '2026-10-21T11:45:00Z',
    nodes: [
      {
        id: 'node-trigger',
        type: 'trigger_inbound',
        title: 'Inbound SIP Call',
        description: 'Triggers on incoming call to +254 20 790 1000',
        config: { recordConsentRequired: true },
        position: { x: 100, y: 150 },
        nextDefault: 'node-answer'
      },
      {
        id: 'node-answer',
        type: 'answer',
        title: 'Answer & Negotiate SDP',
        description: 'Answers call via FreeSWITCH + RTPEngine NAT',
        config: { noiseSuppression: true },
        position: { x: 300, y: 150 },
        nextDefault: 'node-ai-agent'
      },
      {
        id: 'node-ai-agent',
        type: 'ai_conversational_agent',
        title: 'Zawadi AI Voice Agent',
        description: 'Conversational Swahili/English crop & loan advisor',
        config: {
          aiAgentId: 'agent-zawadi-agri',
          language: 'sw-KE',
          noiseSuppression: true
        },
        position: { x: 520, y: 150 },
        nextBranches: [
          { label: 'Escalate / Loan Officer', conditionValue: 'TRANSFER_REQUESTED', targetNodeId: 'node-transfer' },
          { label: 'Normal Completion', conditionValue: 'CALL_RESOLVED', targetNodeId: 'node-hangup' }
        ]
      },
      {
        id: 'node-transfer',
        type: 'transfer_sip_bridge',
        title: 'Transfer to Loan Officer',
        description: 'Bridges call to human operator on +254 700 892 104',
        config: {
          transferTarget: '+254700892104',
          transferTimeoutSeconds: 30
        },
        position: { x: 780, y: 100 },
        nextDefault: 'node-hangup'
      },
      {
        id: 'node-hangup',
        type: 'hangup',
        title: 'End Call & Export CDR',
        description: 'Terminates media session and commits recording to S3',
        config: {},
        position: { x: 800, y: 260 }
      }
    ]
  },
  {
    id: 'wf-fintech-auth-02',
    tenantId: 'tenant-ng-ecobank-prod',
    name: 'Ecobank Merchant Auth & POS Support',
    version: 1,
    status: 'active',
    description: 'Yoruba/Pidgin/English voicebot for POS merchant terminal troubleshooting with automatic terminal reset API tool.',
    entryNumber: '+23412700000',
    selectedProviders: {
      telephonyId: 'prov-freeswitch-core',
      mediaEngineId: 'prov-rtpengine-cluster',
      asrProviderId: 'prov-asr-mandela-system7',
      ttsProviderId: 'prov-tts-mandela-voices',
      aiProviderId: 'prov-ai-gemini-38',
    },
    supportedLanguages: ['yo-NG', 'en-NG'],
    requiresApproval: true,
    approvedBy: 'compliance_officer@ecobank.com',
    approvedAt: '2026-10-22T14:15:00Z',
    createdAt: '2026-10-18T09:00:00Z',
    updatedAt: '2026-10-22T14:15:00Z',
    nodes: [
      {
        id: 'node-trigger-2',
        type: 'trigger_inbound',
        title: 'Inbound Merchant Call',
        description: 'Receives calls on +234 1 270 0000',
        config: {},
        position: { x: 100, y: 150 },
        nextDefault: 'node-answer-2'
      },
      {
        id: 'node-answer-2',
        type: 'answer',
        title: 'Answer Call',
        description: 'Initializes audio session',
        config: {},
        position: { x: 300, y: 150 },
        nextDefault: 'node-agent-adeola'
      },
      {
        id: 'node-agent-adeola',
        type: 'ai_conversational_agent',
        title: 'Adeola POS Assistant',
        description: 'Troubleshoots POS errors with automated backend API',
        config: {
          aiAgentId: 'agent-adeola-merchant',
          language: 'yo-NG'
        },
        position: { x: 520, y: 150 },
        nextDefault: 'node-hangup-2'
      },
      {
        id: 'node-hangup-2',
        type: 'hangup',
        title: 'Hangup & Send SMS Summary',
        description: 'Sends SMS confirmation to merchant phone',
        config: {},
        position: { x: 740, y: 150 }
      }
    ]
  }
];

export const INITIAL_AI_AGENTS: AiAgentConfig[] = [
  {
    id: 'agent-zawadi-agri',
    tenantId: 'tenant-ke-safaricom-01',
    name: 'Zawadi (Farmer Advisory Voice Agent)',
    roleDescription: 'Multilingual customer-service voice agent assisting smallholder farmers with daily market commodity prices, fertilizer loans, and transferring complex disputes to human loan officers.',
    systemPrompt: `You are Zawadi, a warm, knowledgeable agricultural and financial assistant for Kenyan farmers.
Greet callers politely in Swahili or Kenyan English depending on their input.
Help farmers with:
1. Daily wholesale commodity prices (maize, beans, potatoes) in major regional markets (Eldoret, Nairobi, Kisumu, Nakuru).
2. Checking status of M-Pesa fertilizer and seed input credit lines.
3. If the farmer asks to speak to an employee, loan officer, or human, invoke the "transfer_to_loan_officer" tool immediately with a kind confirmation.
Keep responses concise, clear, and practical for spoken audio over mobile phones. Avoid markdown or bullet points in your speech.`,
    personaTone: 'empathetic',
    primaryLanguage: 'sw-KE',
    supportedLocales: ['sw-KE', 'en-KE'],
    enableCodeSwitching: true,
    llmProviderId: 'prov-ai-gemini-38',
    modelName: 'gemini-3.8-flash',
    temperature: 0.3,
    maxTokens: 350,
    enableBiometrics: false,
    enableNoiseSuppression: true,
    toolsAllowed: [
      {
        name: 'query_commodity_market_price',
        description: 'Fetches today wholesale commodity price per 90kg bag across Kenyan markets',
        parametersSchema: '{"commodity": "string", "market": "string"}'
      },
      {
        name: 'check_farmer_loan_status',
        description: 'Queries Core Banking for farmer approved loan balance and disbursement state',
        parametersSchema: '{"farmerNationalId": "string"}'
      },
      {
        name: 'transfer_to_loan_officer',
        description: 'Initiates a SIP bridge transfer to the available human loan officer',
        parametersSchema: '{"department": "microloans", "priority": "normal"}'
      }
    ],
    fallbackTransferNumber: '+254700892104',
    escalationKeywords: ['ongea na binadamu', 'ongea na mtu', 'loan officer', 'afisa wa mkopo', 'speak to agent', 'help employee'],
    status: 'published',
    lastSimulationResult: {
      success: true,
      turnCount: 4,
      avgLatencyMs: 210,
      asrAccuracy: 0.98,
      dialogueExcerpt: 'Consumer: "Nahitaji bei ya mahindi Eldoret..." -> Zawadi: "Leo gunia linauzwa shilingi 3,400..." -> Consumer: "Asante! Naomba niongee na afisa wa mikopo..." -> Zawadi: "Sawa, ninahamisha simu yako sasa hivi..."'
    }
  },
  {
    id: 'agent-adeola-merchant',
    tenantId: 'tenant-ng-ecobank-prod',
    name: 'Adeola (Merchant Support Voice Agent)',
    roleDescription: 'Yoruba and Nigerian Pidgin conversational agent that resolves point-of-sale (POS) terminal issues and restarts merchant sessions remotely.',
    systemPrompt: `You are Adeola, a sharp, friendly customer support specialist for Ecobank merchants in Lagos and across Nigeria.
Greet merchants warmly in Nigerian Pidgin or Yoruba.
Diagnose common POS terminal error codes (Error 91, Error 51, Error 06) and execute remote terminal cache resets via tool.`,
    personaTone: 'empathetic',
    primaryLanguage: 'yo-NG',
    supportedLocales: ['yo-NG', 'en-NG'],
    enableCodeSwitching: true,
    llmProviderId: 'prov-ai-gemini-38',
    modelName: 'gemini-3.8-flash',
    temperature: 0.2,
    maxTokens: 300,
    enableBiometrics: false,
    enableNoiseSuppression: true,
    toolsAllowed: [
      {
        name: 'reset_pos_terminal_session',
        description: 'Restarts terminal network key exchange on the bank switch',
        parametersSchema: '{"terminalId": "string"}'
      }
    ],
    fallbackTransferNumber: '+23412700999',
    escalationKeywords: ['human', 'customer care', 'dispute', 'police', 'fraud'],
    status: 'published',
  }
];

export const INITIAL_RECORDINGS: CallRecordingRecord[] = [
  {
    id: 'rec-nbo-99120',
    callSessionId: 'call-nbo-849201',
    tenantId: 'tenant-ke-safaricom-01',
    from: '+254 712 998 102',
    to: '+254 20 790 1000',
    startedAt: '2026-10-26T14:12:00Z',
    durationSeconds: 142,
    audioUrl: '/audio/sample_swahili_call.wav',
    fileSizeBytes: 2272000,
    storageProvider: 'Mandela Sovereign S3 Vault (Nairobi)',
    encryptionAlgorithm: 'AES-GCM-256 (SHA-256 Verified)',
    consentObtained: true,
    sentiment: 'positive',
    language: 'sw-KE',
    mosScore: 4.41,
    piiRedacted: true,
    summary: 'Farmer called regarding Eldoret maize market price (KES 3,400) and fertilizer loan approval (KES 12,000). Transferred successfully to human loan officer for M-Pesa disbursement.',
    transcription: [
      { speaker: 'agent', text: 'Habari mkulima! Karibu huduma ya ushauri wa kilimo.', startSecond: 2, endSecond: 6, confidence: 0.99 },
      { speaker: 'consumer', text: 'Habari yako. Nahitaji kujua bei ya gunia la mahindi katika soko la Eldoret leo...', startSecond: 7, endSecond: 16, confidence: 0.98 },
      { speaker: 'agent', text: 'Leo katika soko la Eldoret, gunia la kilo 90 linauzwa shilingi 3,400. Pia mkopo wako umeidhinishwa.', startSecond: 18, endSecond: 28, confidence: 0.99 },
      { speaker: 'consumer', text: 'Asante sana! Naomba unisaidie kuongea na afisa wa mikopo nithibitishe jinsi ya kuipokea kwa M-Pesa.', startSecond: 30, endSecond: 39, confidence: 0.97 },
      { speaker: 'agent', text: 'Sawa kabisa. Ninahamisha simu yako sasa hivi kwa afisa wa mikopo. Tafadhali subiri kidogo.', startSecond: 41, endSecond: 50, confidence: 0.99 }
    ]
  },
  {
    id: 'rec-los-88204',
    callSessionId: 'call-los-382910',
    tenantId: 'tenant-ng-ecobank-prod',
    from: '+234 803 204 9102',
    to: '+234 1 270 0000',
    startedAt: '2026-10-26T13:45:00Z',
    durationSeconds: 98,
    audioUrl: '/audio/sample_yoruba_call.wav',
    fileSizeBytes: 1568000,
    storageProvider: 'Mandela Sovereign S3 Vault (Lagos)',
    encryptionAlgorithm: 'AES-GCM-256 (SHA-256 Verified)',
    consentObtained: true,
    sentiment: 'positive',
    language: 'yo-NG',
    mosScore: 4.38,
    piiRedacted: true,
    summary: 'Merchant experienced Error 91 on POS terminal. Voicebot Adeola executed remote terminal switch reset. Terminal resumed normal card transactions.',
    transcription: [
      { speaker: 'agent', text: 'E kaasan! Welcome to Ecobank Merchant Service. How fit I help you today?', startSecond: 2, endSecond: 6, confidence: 0.98 },
      { speaker: 'consumer', text: 'Ejo, my POS terminal display error code 91 since morning...', startSecond: 8, endSecond: 15, confidence: 0.96 },
      { speaker: 'agent', text: 'No worry oga. I don restart your terminal session remotely from bank core.', startSecond: 17, endSecond: 25, confidence: 0.97 }
    ]
  }
];

export const INITIAL_TELEMETRY: TelemetryMetricPoint[] = [
  { timestamp: '17:00', activeChannels: 640, concurrentCalls: 590, avgMosScore: 4.41, asrLatencyMs: 82, ttsLatencyMs: 94, llmLatencyMs: 142, packetLossPercent: 0.02, networkJitterMs: 12 },
  { timestamp: '17:05', activeChannels: 780, concurrentCalls: 710, avgMosScore: 4.38, asrLatencyMs: 85, ttsLatencyMs: 98, llmLatencyMs: 148, packetLossPercent: 0.03, networkJitterMs: 14 },
  { timestamp: '17:10', activeChannels: 920, concurrentCalls: 840, avgMosScore: 4.40, asrLatencyMs: 81, ttsLatencyMs: 92, llmLatencyMs: 139, packetLossPercent: 0.01, networkJitterMs: 11 },
  { timestamp: '17:15', activeChannels: 1040, concurrentCalls: 960, avgMosScore: 4.36, asrLatencyMs: 88, ttsLatencyMs: 102, llmLatencyMs: 155, packetLossPercent: 0.04, networkJitterMs: 16 },
  { timestamp: '17:20', activeChannels: 890, concurrentCalls: 820, avgMosScore: 4.42, asrLatencyMs: 80, ttsLatencyMs: 91, llmLatencyMs: 138, packetLossPercent: 0.01, networkJitterMs: 10 },
  { timestamp: '17:25', activeChannels: 980, concurrentCalls: 905, avgMosScore: 4.39, asrLatencyMs: 83, ttsLatencyMs: 95, llmLatencyMs: 144, packetLossPercent: 0.02, networkJitterMs: 13 },
  { timestamp: '17:30', activeChannels: 1015, concurrentCalls: 942, avgMosScore: 4.41, asrLatencyMs: 82, ttsLatencyMs: 93, llmLatencyMs: 140, packetLossPercent: 0.02, networkJitterMs: 12 },
];
