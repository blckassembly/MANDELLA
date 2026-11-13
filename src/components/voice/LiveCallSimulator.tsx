import React, { useState, useEffect } from 'react';
import { VoiceIvrFlow, LiveVoiceCall } from '../../types/voice';
import {
  Phone,
  PhoneOff,
  Mic,
  Volume2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Fingerprint
} from 'lucide-react';

interface LiveCallSimulatorProps {
  flows: VoiceIvrFlow[];
  initialCall?: LiveVoiceCall;
  initialFlowId?: string;
  onCallCompleted?: (summary: any) => void;
}

export const LiveCallSimulator: React.FC<LiveCallSimulatorProps> = ({
  flows,
  initialCall,
  initialFlowId,
  onCallCompleted
}) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(
    initialFlowId || initialCall?.flowId || flows[0]?.id || ''
  );
  const [callState, setCallState] = useState<'idle' | 'calling' | 'ringing' | 'connected' | 'completed'>('idle');
  const [callTimer, setCallTimer] = useState(0);

  const activeFlow = flows.find((f) => f.id === selectedFlowId) || flows[0];

  // Voice Biometrics Opt-in State (PRD Section 8 - Speaker Verification Authentication Layer)
  const [voiceBiometricsOptIn, setVoiceBiometricsOptIn] = useState<boolean>(
    activeFlow?.voiceBiometricsEnabled ?? true
  );
  const [biometricsStatus, setBiometricsStatus] = useState<'pending' | 'analyzing' | 'verified' | 'failed'>('pending');
  const [biometricsConfidence, setBiometricsConfidence] = useState<number>(0);
  const [enrolledSpeakerName, setEnrolledSpeakerName] = useState<string>('Kwame Mensah (Account #GH-88492)');

  // Sync when initialFlowId changes
  useEffect(() => {
    if (initialFlowId) {
      setSelectedFlowId(initialFlowId);
      const match = flows.find((f) => f.id === initialFlowId);
      if (match) {
        setVoiceBiometricsOptIn(match.voiceBiometricsEnabled);
      }
    }
  }, [initialFlowId, flows]);

  // Flow change handler
  const handleFlowChange = (newFlowId: string) => {
    setSelectedFlowId(newFlowId);
    const match = flows.find((f) => f.id === newFlowId);
    if (match) {
      setVoiceBiometricsOptIn(match.voiceBiometricsEnabled);
    }
  };

  // Toggle Voice Biometrics opt-in with immediate feedback
  const handleToggleVoiceBiometrics = () => {
    const nextState = !voiceBiometricsOptIn;
    setVoiceBiometricsOptIn(nextState);

    // If call is already active, reflect opt-in/opt-out change in the session
    if (callState === 'connected') {
      if (nextState) {
        setBiometricsStatus('analyzing');
        const promptMsg = '[Caller opted in to Voice Biometrics: Initiating acoustic voiceprint verification...]';
        setTurns((prev) => [
          ...prev,
          {
            speaker: 'system',
            text: promptMsg,
            time: `00:${callTimer.toString().padStart(2, '0')}`,
            language: 'System Security'
          }
        ]);
        setTimeout(() => {
          setBiometricsStatus('verified');
          setBiometricsConfidence(98.4);
          setTurns((prev) => [
            ...prev,
            {
              speaker: 'system',
              text: `[Voiceprint verified: Speaker ${enrolledSpeakerName} authenticated (98.4% Match). Protected banking services unlocked.]`,
              time: `00:${(callTimer + 2).toString().padStart(2, '0')}`,
              language: 'System Security'
            }
          ]);
        }, 2200);
      } else {
        setBiometricsStatus('pending');
        setBiometricsConfidence(0);
        setTurns((prev) => [
          ...prev,
          {
            speaker: 'system',
            text: '[Caller opted out of Voice Biometrics: Speaker verification layer bypassed. Restricted financial transactions disabled.]',
            time: `00:${callTimer.toString().padStart(2, '0')}`,
            language: 'System Security'
          }
        ]);
      }
    }
  };

  // Flow simulation dialog state
  const [dtmfInput, setDtmfInput] = useState('');
  const [callerVoiceInput, setCallerVoiceInput] = useState('');
  const [codeSwitchingDetected, setCodeSwitchingDetected] = useState(false);

  // Call turns transcript
  const [turns, setTurns] = useState<Array<{ speaker: 'system' | 'caller'; text: string; time: string; language?: string }>>([]);
  const [postCallSummary, setPostCallSummary] = useState<any | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const speakPrompt = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartCall = () => {
    setCallState('calling');
    setCallTimer(0);
    setTurns([]);
    setPostCallSummary(null);
    setCodeSwitchingDetected(false);
    setBiometricsStatus('pending');
    setBiometricsConfidence(0);

    setTimeout(() => {
      setCallState('ringing');
    }, 1000);

    setTimeout(() => {
      setCallState('connected');
      // Step 1: Prompt
      const welcomeText = voiceBiometricsOptIn
        ? `Akwaaba! Welcome to Mandela Secure Voice Portal. Voice Biometrics is active. Please state your name and passphrase to authenticate.`
        : (activeFlow.nodes[0]?.promptText || 'Akwaaba! For English press 1. Sɛ worepɛ Twi a, bɔ mmienu.');
      
      setTurns([
        {
          speaker: 'system',
          text: welcomeText,
          time: '00:02',
          language: activeFlow.primaryLanguage
        }
      ]);
      speakPrompt(welcomeText);

      // If biometrics is active, auto-trigger acoustic analysis
      if (voiceBiometricsOptIn) {
        setBiometricsStatus('analyzing');
        setTimeout(() => {
          setBiometricsStatus('verified');
          setBiometricsConfidence(98.4);
          setTurns((prev) => [
            ...prev,
            {
              speaker: 'system',
              text: '[AI Voice Biometrics: Acoustic voiceprint matched (98.4% Confidence). Speaker Kwame Mensah Authenticated. Secure services unlocked.]',
              time: '00:05',
              language: 'System Security'
            }
          ]);
        }, 3200);
      }
    }, 2400);
  };

  const handleEndCall = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCallState('completed');

    // Generate AI structured summary (PRD Section 8)
    const summary = {
      callId: `call-sim-${Date.now()}`,
      callerMsisdn: '+233244901822',
      didE164: activeFlow.assignedE164,
      flowName: activeFlow.name,
      durationSec: callTimer,
      language: activeFlow.primaryLanguage,
      codeSwitchingObserved: codeSwitchingDetected ? 'Twi + English' : 'Monolingual',
      intent: voiceBiometricsOptIn ? 'Biometric Voice Authentication & Account Operations' : 'Commodity price & weather verification',
      voiceBiometricsResult: voiceBiometricsOptIn
        ? {
            enrolledSpeaker: enrolledSpeakerName,
            status: biometricsStatus === 'verified' ? 'PASSED_VERIFICATION' : biometricsStatus === 'failed' ? 'REJECTED_IMPOSTOR' : 'BYPASSED',
            matchConfidence: biometricsStatus === 'verified' ? `${biometricsConfidence}%` : '34.2%',
            threshold: '85.0%',
            securityHash: 'voiceprint:sha256:8f921a99014bca882'
          }
        : {
            status: 'OPTED_OUT',
            note: 'Voice Biometrics disabled by caller / tenant policy.'
          },
      structuredOutcome: {
        InquiryTopic: 'Maize & Cocoa rates',
        AuthenticationTier: voiceBiometricsOptIn ? (biometricsStatus === 'verified' ? 'Tier-2 Voiceprint Verified' : 'Unverified') : 'Standard Public',
        QuotedPrice: 'GHc 420 / wholesale bag',
        AccountBalanceReleased: voiceBiometricsOptIn && biometricsStatus === 'verified' ? 'GHc 14,820 (Approved)' : 'Restricted'
      },
      sentiment: 'positive',
      summaryNotes: `Caller completed voice turn. ${
        voiceBiometricsOptIn
          ? `Voice biometrics authentication ${biometricsStatus === 'verified' ? 'succeeded with 98.4% score' : 'failed'}.`
          : 'Voice biometrics opted out.'
      }`
    };
    setPostCallSummary(summary);
    if (onCallCompleted) onCallCompleted(summary);
  };

  const handleDtmfPress = (digit: string) => {
    if (callState !== 'connected') return;

    setDtmfInput((prev) => prev + digit);
    const newTurnCaller = {
      speaker: 'caller' as const,
      text: `[DTMF Key: ${digit}]`,
      time: `00:${callTimer.toString().padStart(2, '0')}`
    };

    setTurns((prev) => [...prev, newTurnCaller]);

    // Advance dialog
    setTimeout(() => {
      if (digit === '1') {
        const sysText = 'English selected. Say or press 1 for maize, 2 for cocoa.';
        setTurns((prev) => [
          ...prev,
          { speaker: 'system', text: sysText, time: `00:${(callTimer + 1).toString().padStart(2, '0')}`, language: 'English' }
        ]);
        speakPrompt(sysText);
      } else if (digit === '2') {
        const sysText = 'Twi kasa apaw. Bɔ baako ma aburoo boɔ, mmienu ma kookoo anaa bisa asɛm.';
        setTurns((prev) => [
          ...prev,
          { speaker: 'system', text: sysText, time: `00:${(callTimer + 1).toString().padStart(2, '0')}`, language: 'Twi' }
        ]);
        speakPrompt(sysText);
      } else {
        const sysText = 'Aburoo kotoku kɛseɛ no boɔ yɛ GHc 420 wɔ Kumasi. Nsuo bɛtɔ Wukuada.';
        setTurns((prev) => [
          ...prev,
          { speaker: 'system', text: sysText, time: `00:${(callTimer + 1).toString().padStart(2, '0')}`, language: activeFlow.primaryLanguage }
        ]);
        speakPrompt(sysText);
      }
    }, 800);
  };

  const handleSendVoiceUtterance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerVoiceInput.trim() || callState !== 'connected') return;

    const spokenText = callerVoiceInput.trim();
    setCallerVoiceInput('');

    // Check code switching
    const isCodeSwitch = spokenText.toLowerCase().includes('price') || spokenText.toLowerCase().includes('cocoa') || spokenText.toLowerCase().includes('market');
    if (isCodeSwitch) setCodeSwitchingDetected(true);

    const callerTurn = {
      speaker: 'caller' as const,
      text: spokenText,
      time: `00:${callTimer.toString().padStart(2, '0')}`
    };
    setTurns((prev) => [...prev, callerTurn]);

    setTimeout(() => {
      const responseText = voiceBiometricsOptIn && biometricsStatus === 'verified'
        ? `Adebayo/Kwame, wo balance yɛ GHc 14,820. Kookoo boɔ no yɛ GHc 800 per bag. Yɛbɛsoma SMS a ɛkura biribiara akyi.`
        : 'Yɛate aseɛ. Kookoo boɔ no yɛ GHc 800 per bag. Yɛbɛsoma SMS a ɛkura biribiara akyi.';

      setTurns((prev) => [
        ...prev,
        {
          speaker: 'system',
          text: responseText,
          time: `00:${(callTimer + 2).toString().padStart(2, '0')}`,
          language: activeFlow.primaryLanguage
        }
      ]);
      speakPrompt(responseText);
    }, 1100);
  };

  const handleSimulateBiometricMismatch = () => {
    setBiometricsStatus('failed');
    setBiometricsConfidence(34.2);
    const rejectText = 'Security Warning: Voiceprint mismatch (34.2% confidence). Acoustic features do not match enrolled profile. Access to account funds denied.';
    setTurns((prev) => [
      ...prev,
      {
        speaker: 'system',
        text: `[AI Security: ${rejectText}]`,
        time: `00:${callTimer.toString().padStart(2, '0')}`,
        language: 'Security Alert'
      }
    ]);
    speakPrompt(rejectText);
  };

  const handleSimulateBiometricMatch = () => {
    setBiometricsStatus('verified');
    setBiometricsConfidence(98.4);
    const acceptText = 'Voiceprint verified. Confidence score 98.4%. Account authenticated.';
    setTurns((prev) => [
      ...prev,
      {
        speaker: 'system',
        text: `[AI Security: ${acceptText}]`,
        time: `00:${callTimer.toString().padStart(2, '0')}`,
        language: 'Security Alert'
      }
    ]);
    speakPrompt(acceptText);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with prominent Voice Biometrics Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Interactive Phone Call Simulator</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 4.3 & 8</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test real-time conversational voice prompts, DTMF menus, code-switching ASR, and voice biometric authentication.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* FLOW SELECTOR */}
          <select
            value={selectedFlowId}
            onChange={(e) => setSelectedFlowId(e.target.value)}
            disabled={callState === 'connected' || callState === 'calling'}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 font-medium focus:outline-none"
          >
            {flows.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.assignedE164})
              </option>
            ))}
          </select>

          {/* VOICE BIOMETRICS TOGGLE (PRD Section 8 - USER REQUEST) */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Fingerprint className={`w-3.5 h-3.5 ${voiceBiometricsOptIn ? 'text-emerald-400' : 'text-slate-500'}`} />
            <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
              <span className={voiceBiometricsOptIn ? 'text-slate-200' : 'text-slate-500'}>
                Voice Biometrics Opt-In:
              </span>
              <button
                type="button"
                onClick={() => setVoiceBiometricsOptIn(!voiceBiometricsOptIn)}
                disabled={callState === 'connected'}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  voiceBiometricsOptIn ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                title="Toggle speaker verification layer"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    voiceBiometricsOptIn ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
            <span className={`text-[10px] font-mono uppercase ${voiceBiometricsOptIn ? 'text-emerald-400' : 'text-slate-500'}`}>
              {voiceBiometricsOptIn ? 'ENABLED' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Voice Biometrics Authentication Layer Bar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
        voiceBiometricsOptIn
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          : 'bg-slate-950/60 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-2.5">
          {voiceBiometricsOptIn ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Shield className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          <div>
            <span className="font-semibold text-white">
              {voiceBiometricsOptIn
                ? 'Voice Biometrics Active — Speaker Verification Authentication Layer'
                : 'Voice Biometrics Inactive — Standard Unauthenticated / Public Dialog'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {voiceBiometricsOptIn
                ? `Enrolled Caller: ${enrolledSpeakerName} · Passwordless voiceprint matching active (Threshold: ≥85%).`
                : 'Callers will not be prompted for acoustic voiceprint verification.'}
            </p>
          </div>
        </div>

        {voiceBiometricsOptIn && callState === 'connected' && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-400">Simulation Controls:</span>
            <button
              onClick={handleSimulateBiometricMatch}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono rounded text-[11px] transition-colors"
            >
              Simulate Match (98.4%)
            </button>
            <button
              onClick={handleSimulateBiometricMismatch}
              className="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white font-mono rounded text-[11px] transition-colors"
            >
              Simulate Impostor Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Softphone Dialpad Hardware (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center">
          {/* Caller Screen */}
          <div className="w-full bg-slate-900 rounded-xl p-4 border border-slate-800 text-center mb-5">
            <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider flex items-center justify-center gap-1.5">
              <span>Calling African Line</span>
              {voiceBiometricsOptIn && (
                <Lock className="w-3 h-3 text-emerald-400" />
              )}
            </div>
            <div className="font-mono text-lg font-bold text-amber-300 mt-0.5">
              {activeFlow.assignedE164}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {activeFlow.name}
            </div>

            {/* Status Indicator */}
            <div className="mt-3 py-1 px-3 rounded-full inline-block font-mono text-xs">
              {callState === 'idle' && <span className="text-slate-500">Ready to initiate call</span>}
              {callState === 'calling' && <span className="text-amber-300 animate-pulse">Establishing FreeSWITCH session...</span>}
              {callState === 'ringing' && <span className="text-amber-400 font-bold animate-pulse">Ringing at destination...</span>}
              {callState === 'connected' && (
                <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Audio: {Math.floor(callTimer / 60)}:{(callTimer % 60).toString().padStart(2, '0')} (MOS: 4.4)
                </span>
              )}
              {callState === 'completed' && <span className="text-slate-400">Call Terminated</span>}
            </div>

            {/* Live Biometrics Match Meter while call is active */}
            {callState === 'connected' && voiceBiometricsOptIn && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Acoustic Voiceprint:</span>
                  <span className={
                    biometricsStatus === 'verified'
                      ? 'text-emerald-400 font-bold'
                      : biometricsStatus === 'failed'
                      ? 'text-rose-400 font-bold'
                      : 'text-amber-400 animate-pulse'
                  }>
                    {biometricsStatus === 'verified' && `✓ MATCH (${biometricsConfidence}%)`}
                    {biometricsStatus === 'failed' && `✗ REJECTED (${biometricsConfidence}%)`}
                    {biometricsStatus === 'analyzing' && 'ANALYZING VOICEPRINT...'}
                    {biometricsStatus === 'pending' && 'WAITING FOR SPEECH'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      biometricsStatus === 'verified'
                        ? 'bg-emerald-400 w-[98%]'
                        : biometricsStatus === 'failed'
                        ? 'bg-rose-500 w-[34%]'
                        : 'bg-amber-400 w-[60%]'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <button
                key={k}
                onClick={() => handleDtmfPress(k)}
                disabled={callState !== 'connected'}
                className="h-12 rounded-xl bg-slate-900 border border-slate-800 text-base font-mono font-bold text-slate-200 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-40"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Action Call / Hangup */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            {callState === 'idle' || callState === 'completed' ? (
              <button
                onClick={handleStartCall}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
              >
                <Phone className="w-4 h-4" />
                <span>Dial African IVR</span>
              </button>
            ) : (
              <button
                onClick={handleEndCall}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Hang Up & Summarize</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Transcript & Voice Input (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">Live Audio & Speech Transcript</span>
            </div>
            <div className="flex items-center gap-2">
              {voiceBiometricsOptIn && (
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] border flex items-center gap-1 ${
                  biometricsStatus === 'verified'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-950 text-amber-300 border-amber-500/30'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>Biometrics {biometricsStatus.toUpperCase()}</span>
                </span>
              )}
              {codeSwitchingDetected && (
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                  Code-Switching
                </span>
              )}
            </div>
          </div>

          {/* Transcript Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 min-h-[220px] max-h-72 overflow-y-auto text-xs">
            {turns.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                Click &ldquo;Dial African IVR&rdquo; to begin interactive voice session.
              </div>
            ) : (
              turns.map((turn, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border leading-relaxed ${
                    turn.speaker === 'system'
                      ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100 ml-6'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-1">
                    <span className={turn.speaker === 'system' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                      {turn.speaker === 'system' ? 'AFRICAN NEURAL TTS' : 'CALLER SPEECH (ASR)'}
                    </span>
                    <span>{turn.time}</span>
                  </div>
                  <p className="text-xs">{turn.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Spoken Speech Simulation Form */}
          {callState === 'connected' && (
            <form onSubmit={handleSendVoiceUtterance} className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <label className="block text-slate-400 font-medium">
                Simulate Caller Speech Input (Spoken Phrase or Identity Claim)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={callerVoiceInput}
                  onChange={(e) => setCallerVoiceInput(e.target.value)}
                  placeholder="e.g. Mepɛ sɛ mehunu cocoa price wɔ Kumasi, or speak passphrase..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-sans focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  Speak
                </button>
              </div>
              <div className="flex gap-2 text-[11px] text-slate-500 pt-1">
                <span>Quick Utterances:</span>
                <button
                  type="button"
                  onClick={() => setCallerVoiceInput('Kwame Mensah passphrase confirmed')}
                  className="text-amber-300 hover:underline"
                >
                  Voiceprint Passphrase
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setCallerVoiceInput('Mepɛ sɛ mehunu cocoa price wɔ Kumasi')}
                  className="text-amber-300 hover:underline"
                >
                  Twi+En Crop Price
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setCallerVoiceInput('Nataka kuongea na daktari kwa kliniki')}
                  className="text-amber-300 hover:underline"
                >
                  Swahili Clinic
                </button>
              </div>
            </form>
          )}

          {/* Post-Call Structured Summary with Voice Biometrics Evaluation (PRD Section 8) */}
          {postCallSummary && (
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Post-Call Structured AI Summary
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  {postCallSummary.voiceBiometricsResult?.status === 'PASSED_VERIFICATION' ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Voice Biometrics Verified
                    </span>
                  ) : postCallSummary.voiceBiometricsResult?.status === 'REJECTED_IMPOSTOR' ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Biometrics Rejected
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Biometrics Opted-Out</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div>
                  <span className="text-slate-500">Inferred Intent:</span>{' '}
                  <span className="text-white font-medium">{postCallSummary.intent}</span>
                </div>

                {voiceBiometricsOptIn && (
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-300 space-y-0.5">
                    <div className="text-amber-300 font-semibold text-[10px] uppercase">Speaker Authentication Result:</div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speaker Profile:</span>
                      <span className="text-white">{postCallSummary.voiceBiometricsResult.enrolledSpeaker}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Match Confidence:</span>
                      <span className="text-emerald-400 font-bold">{postCallSummary.voiceBiometricsResult.matchConfidence}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Verification Hash:</span>
                      <span className="truncate max-w-[200px]">{postCallSummary.voiceBiometricsResult.securityHash}</span>
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300 mt-2">
                  <span className="text-slate-500 block text-[10px] uppercase mb-1">Extracted Entities & Outcomes:</span>
                  {JSON.stringify(postCallSummary.structuredOutcome, null, 2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
