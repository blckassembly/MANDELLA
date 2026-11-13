import {
  VoiceIvrFlow,
  LiveVoiceCall,
  AfricanLanguageModel,
  CallSummaryReport
} from '../types/voice';

export const AFRICAN_LANGUAGE_MODELS: AfricanLanguageModel[] = [
  {
    code: 'twi',
    name: 'Twi (Akan)',
    nativeName: 'Twi',
    region: 'West Africa (Ghana)',
    speakersCount: '18M+',
    asrAccuracy: 88.6,
    ttsNaturalnessMos: 4.3,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Akwaaba! Sɛ worepɛ kɔkɔɔ anaa aburoo boɔ a, bɔ baako.',
    sampleTranslationEn: 'Welcome! If you want cocoa or maize prices, press 1.'
  },
  {
    code: 'sw',
    name: 'Swahili (Kiswahili)',
    nativeName: 'Kiswahili',
    region: 'East & Central Africa',
    speakersCount: '150M+',
    asrAccuracy: 92.4,
    ttsNaturalnessMos: 4.5,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Karibu huduma ya sauti ya Mandela. Bonyeza moja kwa Kiswahili au zungumza sasa.',
    sampleTranslationEn: 'Welcome to Mandela voice service. Press 1 for Swahili or speak now.'
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    region: 'West Africa (Nigeria, Benin)',
    speakersCount: '45M+',
    asrAccuracy: 87.9,
    ttsNaturalnessMos: 4.2,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Ẹ káàbọ̀ sí ilé iṣẹ́ wa. Tẹ ọ̀kan fún iṣiro owó, tàbí sọ̀rọ̀ báyìí.',
    sampleTranslationEn: 'Welcome to our service. Press one for balance inquiry, or speak now.'
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    region: 'West & Central Africa (Nigeria, Niger)',
    speakersCount: '75M+',
    asrAccuracy: 89.1,
    ttsNaturalnessMos: 4.3,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Barka da zuwa cibiyar sadarwa. Danna daya domin samun farashin hatsi.',
    sampleTranslationEn: 'Welcome to the communication center. Press 1 to get grain prices.'
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    region: 'East Africa (Ethiopia)',
    speakersCount: '35M+',
    asrAccuracy: 86.4,
    ttsNaturalnessMos: 4.1,
    codeSwitchingSupport: false,
    status: 'production',
    sampleAudioPrompt: 'እንኳን ወደ ማንዴላ የድምፅ አገልግሎት በደህና መጡ። ለገበያ ዋጋ አንድን ይጫኑ።',
    sampleTranslationEn: 'Welcome to Mandela voice service. Press 1 for market price.'
  },
  {
    code: 'zu',
    name: 'Zulu (isiZulu)',
    nativeName: 'isiZulu',
    region: 'Southern Africa (South Africa)',
    speakersCount: '28M+',
    asrAccuracy: 90.8,
    ttsNaturalnessMos: 4.4,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Siyakwamukela ohlelweni lwezwi. Cindezela u-1 ukuze ukhulume nomeluleki.',
    sampleTranslationEn: 'Welcome to voice service. Press 1 to speak with an advisor.'
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Ásụ̀sụ́ Ìgbò',
    region: 'West Africa (Nigeria)',
    speakersCount: '32M+',
    asrAccuracy: 86.9,
    ttsNaturalnessMos: 4.1,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Nnọọ na Mandela Voice. Kpọọ ọnụọgụgụ otu maka ozi gbasara ahịa.',
    sampleTranslationEn: 'Welcome to Mandela Voice. Press number one for market info.'
  },
  {
    code: 'ln',
    name: 'Lingala',
    nativeName: 'Lingála',
    region: 'Central Africa (DRC, Congo)',
    speakersCount: '25M+',
    asrAccuracy: 85.2,
    ttsNaturalnessMos: 4.0,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Boyei bolamu na Mandela Voice. Pona moko mpo na kozwa talo ya biloko.',
    sampleTranslationEn: 'Welcome to Mandela Voice. Press 1 to get commodity prices.'
  },
  {
    code: 'wo',
    name: 'Wolof',
    nativeName: 'Wolof',
    region: 'West Africa (Senegal, Gambia)',
    speakersCount: '12M+',
    asrAccuracy: 86.1,
    ttsNaturalnessMos: 4.1,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Dalal ak jamm ci Mandela Voice. Bësal benn ngir jënd wala jaay.',
    sampleTranslationEn: 'Welcome to Mandela Voice. Press 1 to buy or sell.'
  },
  {
    code: 'om',
    name: 'Oromo (Afaan Oromoo)',
    nativeName: 'Afaan Oromoo',
    region: 'East Africa (Ethiopia, Kenya)',
    speakersCount: '40M+',
    asrAccuracy: 85.8,
    ttsNaturalnessMos: 4.0,
    codeSwitchingSupport: false,
    status: 'production',
    sampleAudioPrompt: 'Baga nagaan dhuftan. Gatii gabaa beekuuf tokko tuqaa.',
    sampleTranslationEn: 'Welcome. Press one to know market prices.'
  },
  {
    code: 'sn',
    name: 'Shona (chiShona)',
    nativeName: 'chiShona',
    region: 'Southern Africa (Zimbabwe, Mozambique)',
    speakersCount: '15M+',
    asrAccuracy: 88.0,
    ttsNaturalnessMos: 4.2,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Mauya kuMandela Voice. Dzvanya 1 kuti unzwe mitengo yezvirimwa.',
    sampleTranslationEn: 'Welcome to Mandela Voice. Press 1 to hear crop prices.'
  },
  {
    code: 'lg',
    name: 'Luganda',
    nativeName: 'Oluganda',
    region: 'East Africa (Uganda)',
    speakersCount: '10M+',
    asrAccuracy: 87.3,
    ttsNaturalnessMos: 4.1,
    codeSwitchingSupport: true,
    status: 'production',
    sampleAudioPrompt: 'Tukusanyukidde ku Mandela Voice. Nyiga emu okufuna amawulire g’ebbeeyi.',
    sampleTranslationEn: 'Welcome to Mandela Voice. Press 1 to receive price updates.'
  }
];

export const INITIAL_IVR_FLOWS: VoiceIvrFlow[] = [
  {
    id: 'flow-agri-gh',
    name: 'Ashanti Agri-Commodity Voice Portal',
    description: 'Farmers call local Ghana number, hear spoken prompts in Twi or English, and receive market prices and weather via speech recognition.',
    assignedE164: '+233244123890',
    countryCode: 'GH',
    mode: 'visual',
    primaryLanguage: 'Twi (Akan)',
    supportedLanguages: ['Twi (Akan)', 'English'],
    recordCalls: true,
    amdEnabled: false,
    voiceBiometricsEnabled: false,
    noiseSuppressionEnabled: true,
    status: 'active',
    totalCalls: 3840,
    completionRate: 94.6,
    avgDurationSec: 88,
    avgMosScore: 4.3,
    nodes: [
      {
        id: 'node-1',
        type: 'language_select',
        title: 'Language Selection',
        promptText: 'Akwaaba! For English, press 1 or say English. Sɛ worepɛ Twi a, bɔ mmienu anaa ka Twi.',
        ttsVoice: 'Adwoa (Ghana Neural)',
        language: 'twi',
        options: [
          { key: '1', label: 'English', targetNodeId: 'node-2-en' },
          { key: '2', label: 'Twi', targetNodeId: 'node-2-twi' }
        ]
      },
      {
        id: 'node-2-twi',
        type: 'speech_input',
        title: 'Twi Speech Menu',
        promptText: 'Bɔ mpaninfoɔ baako ma aburoo boɔ, mmienu ma kookoo, anaa bisa asɛm biara.',
        ttsVoice: 'Kwame (Twi Neural)',
        language: 'twi',
        options: [
          { key: '1', label: 'Maize Prices', targetNodeId: 'node-maize' },
          { key: '2', label: 'Cocoa Rates', targetNodeId: 'node-cocoa' }
        ]
      },
      {
        id: 'node-maize',
        type: 'welcome_play',
        title: 'Spoken Market Price',
        promptText: 'Aburoo kotoku kɛseɛ no boɔ yɛ GHc 420 wɔ Kumasi dwam nnɛ. Nsuo bɛtɔ wɔ Wukuada.',
        ttsVoice: 'Adwoa (Ghana Neural)',
        language: 'twi'
      }
    ]
  },
  {
    id: 'flow-health-ke',
    name: 'Rural Healthcare Hotline & Triage',
    description: 'Interactive Swahili & Sheng medical voice triage with automated doctor bridging and code-switching detection.',
    assignedE164: '+254722550119',
    countryCode: 'KE',
    mode: 'visual',
    primaryLanguage: 'Swahili (Kiswahili)',
    supportedLanguages: ['Swahili (Kiswahili)', 'English'],
    recordCalls: true,
    amdEnabled: true,
    voiceBiometricsEnabled: true,
    noiseSuppressionEnabled: true,
    status: 'active',
    totalCalls: 2190,
    completionRate: 92.1,
    avgDurationSec: 142,
    avgMosScore: 4.4,
    nodes: [
      {
        id: 'node-h1',
        type: 'welcome_play',
        title: 'Swahili Greeting',
        promptText: 'Karibu katika kliniki ya simu. Mazungumzo haya yanarekodiwa kwa ajili ya usalama.',
        ttsVoice: 'Amina (Kenya Swahili)',
        language: 'sw'
      },
      {
        id: 'node-h2',
        type: 'dtmf_menu',
        title: 'Medical Category',
        promptText: 'Bonyeza 1 kwa dharura ya uzazi, 2 kwa ushauri wa mtoto, 3 kuunganishwa na kliniki.',
        ttsVoice: 'Baraka (Kenya Swahili)',
        language: 'sw',
        options: [
          { key: '1', label: 'Maternal Care', targetNodeId: 'node-bridge' },
          { key: '2', label: 'Child Health', targetNodeId: 'node-bridge' },
          { key: '3', label: 'Duty Nurse', targetNodeId: 'node-bridge' }
        ]
      },
      {
        id: 'node-bridge',
        type: 'bridge_call',
        title: 'Bridge to Duty Nurse',
        promptText: 'Tafadhali subiri, tunakuunganisha na muuguzi...',
        ttsVoice: 'Amina (Kenya Swahili)',
        bridgeTarget: '+254700112233'
      }
    ]
  },
  {
    id: 'flow-ncco-fin-ng',
    name: 'Fintech Voice Biometrics & OTP Portal',
    description: 'Enterprise NCCO programmable voice engine with voiceprint speaker authentication and automated call summarization.',
    assignedE164: '+2348039876543',
    countryCode: 'NG',
    mode: 'ncco',
    primaryLanguage: 'Yoruba',
    supportedLanguages: ['Yoruba', 'English', 'Hausa'],
    recordCalls: true,
    amdEnabled: true,
    voiceBiometricsEnabled: true,
    noiseSuppressionEnabled: true,
    status: 'active',
    totalCalls: 5410,
    completionRate: 96.2,
    avgDurationSec: 64,
    avgMosScore: 4.2,
    nccoJson: JSON.stringify(
      [
        {
          action: 'talk',
          text: 'Welcome to Mandela Sovereign Bank. Please state your account passphrase for voice verification.',
          voice_name: 'chioma-nigerian-neural',
          bargeIn: true
        },
        {
          action: 'input',
          type: ['speech'],
          speech: {
            language: 'en-NG',
            endOnSilence: 1.5,
            sensitivity: 'high'
          }
        },
        {
          action: 'record',
          format: 'wav',
          channels: 1,
          eventUrl: ['https://api.mandela.africa/voice/events/biometrics']
        }
      ],
      null,
      2
    ),
    nodes: []
  }
];

export const INITIAL_LIVE_CALLS: LiveVoiceCall[] = [
  {
    id: 'call-live-001',
    callerMsisdn: '+233244901822',
    didE164: '+233244123890',
    carrier: 'MTN Ghana',
    countryCode: 'GH',
    flowId: 'flow-agri-gh',
    flowName: 'Ashanti Agri-Commodity Voice Portal',
    state: 'in_dialog',
    durationSec: 42,
    detectedLanguage: 'Twi (Akan)',
    codeSwitchingDetected: true,
    codeSwitchingPair: 'Twi + English ("Cocoa price Kumasi")',
    currentStep: 'Speech Recognition: Maize & Weather Query',
    mosScore: 4.3,
    mediaServer: 'fs-node-accra-01.mandela.cloud',
    supervisorMode: 'none',
    startedAt: '16:04:12',
    liveTranscript: [
      { speaker: 'system', text: 'Akwaaba! For English press 1. Sɛ worepɛ Twi bɔ 2.', time: '16:04:14' },
      { speaker: 'caller', text: '[DTMF 2 pressed - Twi selected]', time: '16:04:18' },
      { speaker: 'system', text: 'Bɔ mpaninfoɔ baako ma aburoo boɔ, mmienu ma kookoo...', time: '16:04:20' },
      { speaker: 'caller', text: 'Mepɛ sɛ mehunu cocoa price wɔ Kumasi na nsuo bɛtɔ anaa?', time: '16:04:35' },
      { speaker: 'system', text: 'Kookoo boɔ yɛ GHc 800 per bag. Nsuo bɛtɔ Wukuada.', time: '16:04:41' }
    ]
  },
  {
    id: 'call-live-002',
    callerMsisdn: '+254711882244',
    didE164: '+254722550119',
    carrier: 'Safaricom Kenya',
    countryCode: 'KE',
    flowId: 'flow-health-ke',
    flowName: 'Rural Healthcare Hotline & Triage',
    state: 'bridged',
    durationSec: 118,
    detectedLanguage: 'Swahili (Kiswahili)',
    codeSwitchingDetected: true,
    codeSwitchingPair: 'Swahili + Sheng',
    currentStep: 'Bridged to Duty Nurse (+254700112233)',
    mosScore: 4.4,
    mediaServer: 'fs-node-nairobi-01.mandela.cloud',
    supervisorMode: 'listening',
    startedAt: '16:02:50',
    liveTranscript: [
      { speaker: 'system', text: 'Karibu kliniki ya simu. Bonyeza 1 kwa dharura ya uzazi.', time: '16:02:52' },
      { speaker: 'caller', text: 'Niko na sister wangu hapa amefura mguu anaskia vibaya sana.', time: '16:03:05' },
      { speaker: 'system', text: 'Tunakuunganisha na muuguzi sasa hivi...', time: '16:03:12' },
      { speaker: 'caller', text: '[Audio Bridged to Nurse Station Nairobi]', time: '16:03:15' }
    ]
  },
  {
    id: 'call-live-003',
    callerMsisdn: '+2348021110022',
    didE164: '+2348039876543',
    carrier: 'Airtel Nigeria',
    countryCode: 'NG',
    flowId: 'flow-ncco-fin-ng',
    flowName: 'Fintech Voice Biometrics & OTP Portal',
    state: 'in_dialog',
    durationSec: 26,
    detectedLanguage: 'Yoruba',
    codeSwitchingDetected: false,
    currentStep: 'Voice Biometrics Speaker Authentication',
    mosScore: 4.1,
    mediaServer: 'fs-node-lagos-01.mandela.cloud',
    supervisorMode: 'none',
    startedAt: '16:04:28',
    liveTranscript: [
      { speaker: 'system', text: 'Welcome to Mandela Bank. Please state your passphrase.', time: '16:04:30' },
      { speaker: 'caller', text: 'Oruko mi ni Adebayo, mo fe gba owo mi jade.', time: '16:04:38' },
      { speaker: 'system', text: '[AI Biometrics: Voiceprint matched with 97.4% confidence score]', time: '16:04:42' }
    ]
  }
];

export const INITIAL_CALL_SUMMARIES: CallSummaryReport[] = [
  {
    callId: 'call-hist-991',
    callerMsisdn: '+233244123890',
    didE164: '+233244123890',
    language: 'Twi (Akan)',
    durationSec: 94,
    intent: 'Inquire on regional maize grain price & rainfall forecast',
    structuredOutcome: {
      Crop: 'White Maize (Aburoo)',
      Location: 'Kumasi Market (Ashanti)',
      PriceQuoted: 'GHc 420 / wholesale bag',
      Action: 'Farmer advised to store dry due to Wednesday rain'
    },
    sentiment: 'positive',
    transcriptSummary: 'Farmer caller requested wholesale price for maize in Kumasi market. System responded in Twi with current price (GHc 420) and gave automated weather advisory warning of heavy rains on Wednesday.',
    timestamp: '2026-10-10 15:52 UTC',
    recordingWaveform: [35, 60, 45, 80, 75, 40, 20, 90, 85, 50, 65, 30]
  },
  {
    callId: 'call-hist-992',
    callerMsisdn: '+254722550119',
    didE164: '+254722550119',
    language: 'Swahili (Kiswahili)',
    durationSec: 154,
    intent: 'Maternal health consultation & triage',
    structuredOutcome: {
      PatientType: 'Expectant mother (3rd trimester)',
      Symptom: 'Swelling & mild headache',
      TriageLevel: 'Priority Routine',
      BridgeDestination: 'Nairobi Referral Nurse Station'
    },
    sentiment: 'urgent',
    transcriptSummary: 'Caller reported pregnancy discomfort in mixed Swahili and Sheng. Medical triage logic classified case as priority and successfully bridged to duty nurse at Nairobi health post.',
    timestamp: '2026-10-10 15:48 UTC',
    recordingWaveform: [20, 45, 70, 85, 95, 60, 40, 70, 50, 45, 30, 15]
  }
];
