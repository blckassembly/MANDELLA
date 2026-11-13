import React, { useState } from 'react';
import { VoiceIvrFlow, IvrNode } from '../../types/voice';
import { PhoneNumberRecord } from '../../types/nms';
import { Plus, Trash2, Phone, Mic, ShieldCheck, Sparkles, Play, Code, CheckCircle2, Layers } from 'lucide-react';

interface IvrFlowBuilderProps {
  flows: VoiceIvrFlow[];
  availableNumbers: PhoneNumberRecord[];
  onSaveFlow: (flow: VoiceIvrFlow) => void;
  onTestFlow: (flow: VoiceIvrFlow) => void;
}

export const IvrFlowBuilder: React.FC<IvrFlowBuilderProps> = ({
  flows,
  availableNumbers,
  onSaveFlow,
  onTestFlow
}) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(flows[0]?.id || '');
  const [activeMode, setActiveMode] = useState<'visual' | 'ncco' | 'voicexml'>('visual');

  const selectedFlow = flows.find((f) => f.id === selectedFlowId) || flows[0];

  // Editable local state
  const [flowName, setFlowName] = useState(selectedFlow.name);
  const [flowDescription, setFlowDescription] = useState(selectedFlow.description);
  const [assignedE164, setAssignedE164] = useState(selectedFlow.assignedE164);
  const [primaryLang, setPrimaryLang] = useState(selectedFlow.primaryLanguage);
  const [recordCalls, setRecordCalls] = useState(selectedFlow.recordCalls);
  const [amdEnabled, setAmdEnabled] = useState(selectedFlow.amdEnabled);
  const [biometricsEnabled, setBiometricsEnabled] = useState(selectedFlow.voiceBiometricsEnabled);
  const [noiseSuppression, setNoiseSuppression] = useState(selectedFlow.noiseSuppressionEnabled);

  // Nodes for visual builder
  const [nodes, setNodes] = useState<IvrNode[]>(selectedFlow.nodes || []);
  const [biometricsThreshold, setBiometricsThreshold] = useState<'85' | '95' | '75'>('85');
  const [nccoJson, setNccoJson] = useState(selectedFlow.nccoJson || '[\n  {\n    "action": "talk",\n    "text": "Welcome. Press 1 for Twi, 2 for Swahili.",\n    "language": "en"\n  }\n]');

  // When changing flow
  const handleSelectFlow = (flow: VoiceIvrFlow) => {
    setSelectedFlowId(flow.id);
    setFlowName(flow.name);
    setFlowDescription(flow.description);
    setAssignedE164(flow.assignedE164);
    setPrimaryLang(flow.primaryLanguage);
    setRecordCalls(flow.recordCalls);
    setAmdEnabled(flow.amdEnabled);
    setBiometricsEnabled(flow.voiceBiometricsEnabled);
    setNoiseSuppression(flow.noiseSuppressionEnabled);
    setNodes(flow.nodes || []);
    setActiveMode(flow.mode);
    if (flow.nccoJson) setNccoJson(flow.nccoJson);
  };

  const handleAddNode = (type: IvrNode['type']) => {
    const isBiometrics = type === 'voice_biometrics';
    const newNode: IvrNode = {
      id: `node-${Date.now()}`,
      type,
      title: isBiometrics
        ? 'Voice Biometric Speaker Verification'
        : type === 'welcome_play'
        ? 'Greeting Prompt'
        : type === 'speech_input'
        ? 'Speech ASR Input'
        : 'Bridge Call',
      promptText: isBiometrics
        ? 'Please state your full name and passphrase clearly for acoustic speaker authentication.'
        : type === 'welcome_play'
        ? 'Welcome to our shop! How can we help you today?'
        : 'Please speak your inquiry now.',
      ttsVoice: 'Adwoa (Ghana Neural)',
      language: primaryLang.toLowerCase().includes('twi') ? 'twi' : 'sw'
    };
    setNodes((prev) => [...prev, newNode]);
    if (isBiometrics) {
      setBiometricsEnabled(true);
    }
  };

  const handleRemoveNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const getUpdatedFlow = (): VoiceIvrFlow => ({
    ...selectedFlow,
    name: flowName,
    description: flowDescription,
    assignedE164,
    primaryLanguage: primaryLang,
    recordCalls,
    amdEnabled,
    voiceBiometricsEnabled: biometricsEnabled,
    noiseSuppressionEnabled: noiseSuppression,
    nodes,
    nccoJson,
    mode: activeMode
  });

  const handleSave = () => {
    onSaveFlow(getUpdatedFlow());
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Visual IVR & NCCO Programmable Call Flow Builder</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 4 & 5.2</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Voice is the UI. Create spoken language menus in Twi, Swahili, and Yoruba, or upload programmable NCCO documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTestFlow(getUpdatedFlow())}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Call in Simulator</span>
          </button>
          <button
            onClick={handleSave}
            className="py-1.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors shadow-sm"
          >
            Save Call Flow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Flow list & settings (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-slate-800">
            Published Voice IVR Lines
          </div>

          <div className="space-y-2">
            {flows.map((f) => (
              <div
                key={f.id}
                onClick={() => handleSelectFlow(f)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  f.id === selectedFlowId
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                }`}
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{f.name}</span>
                  <span className="font-mono text-[10px] text-amber-300">{f.countryCode}</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">
                  DID: {f.assignedE164}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {f.primaryLanguage} · {f.totalCalls.toLocaleString()} calls · {f.completionRate}% completion
                </div>
              </div>
            ))}
          </div>

          {/* Bound Sovereign Number Setting */}
          <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px] block">
              Inbound Sovereign DID Binding (System 1)
            </span>
            <div>
              <label className="block text-slate-400 mb-1">Assigned Number</label>
              <select
                value={assignedE164}
                onChange={(e) => setAssignedE164(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-amber-300 font-mono text-xs"
              >
                {availableNumbers.map((num) => (
                  <option key={num.id} value={num.e164}>
                    {num.e164} ({num.countryName} · {num.carrier})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-emerald-400 mt-1 block">
                ✓ Routes via Kamailio dispatcher into FreeSWITCH media cluster
              </span>
            </div>

            {/* AI Flags & Security Layer */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* VOICE BIOMETRICS DEDICATED OPT-IN CARD (PRD Section 8 - USER REQUEST) */}
              <div className={`p-3.5 rounded-lg border transition-all ${
                biometricsEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-950/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${biometricsEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="font-semibold text-white">Voice Biometrics Auth Layer</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      biometricsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                    title="Toggle voice biometrics speaker verification"
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow ${
                        biometricsEnabled ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                  Opt-in speaker verification layer: authenticate callers via acoustic voiceprint matching for telephone banking, mobile money transfers, medical consent, and low-literacy caller authentication.
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Opt-In Status:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                    biometricsEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {biometricsEnabled ? '✓ OPTED IN (ACTIVE)' : 'OPTED OUT (BYPASSED)'}
                  </span>
                </div>

                {biometricsEnabled && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-300 font-medium">Security Threshold:</span>
                      <select
                        value={biometricsThreshold}
                        onChange={(e) => setBiometricsThreshold(e.target.value as any)}
                        className="bg-slate-900 border border-emerald-600/40 rounded px-2 py-0.5 text-white font-mono text-[10px]"
                      >
                        <option value="85">Standard (≥85% Match)</option>
                        <option value="95">High Assurance (≥95% Financial)</option>
                        <option value="75">Rapid Screening (≥75%)</option>
                      </select>
                    </div>
                    <div className="text-[10px] text-emerald-400/90 font-mono">
                      ✓ Anti-spoofing liveness check active · 256-dim neural voiceprint embedding
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={recordCalls}
                    onChange={(e) => setRecordCalls(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500"
                  />
                  <span>Full Call Audio Recording</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={amdEnabled}
                    onChange={(e) => setAmdEnabled(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500"
                  />
                  <span>Answering Machine Detection (AMD)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={noiseSuppression}
                    onChange={(e) => setNoiseSuppression(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500"
                  />
                  <span>2G Rural Background Noise Suppression</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Flow Builder Canvas & NCCO Editor (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          {/* Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="text-base font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-400 focus:outline-none w-full"
              />
              <p className="text-xs text-slate-400 mt-0.5">{flowDescription}</p>
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveMode('visual')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeMode === 'visual'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Visual Wizard
              </button>
              <button
                onClick={() => setActiveMode('ncco')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeMode === 'ncco'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                NCCO JSON
              </button>
            </div>
          </div>

          {activeMode === 'visual' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Call Dialog Steps ({nodes.length} nodes)</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px]">Add Step:</span>
                  <button
                    onClick={() => handleAddNode('welcome_play')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                  >
                    + Prompt
                  </button>
                  <button
                    onClick={() => handleAddNode('speech_input')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                  >
                    + Speech ASR
                  </button>
                  <button
                    onClick={() => handleAddNode('voice_biometrics')}
                    className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 font-semibold rounded text-[11px] flex items-center gap-1 shadow-xs"
                    title="Insert acoustic speaker verification step"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Voice Biometrics</span>
                  </button>
                  <button
                    onClick={() => handleAddNode('bridge_call')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                  >
                    + Bridge
                  </button>
                </div>
              </div>

              {/* Node Cards */}
              <div className="space-y-3">
                {nodes.map((node, index) => (
                  <div
                    key={node.id}
                    className={`p-4 rounded-xl border space-y-3 text-xs transition-colors ${
                      node.type === 'voice_biometrics'
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full font-mono text-[10px] flex items-center justify-center font-bold ${
                          node.type === 'voice_biometrics'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-400/20 text-amber-300'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {node.type === 'voice_biometrics' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span className="font-bold text-white">{node.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          node.type === 'voice_biometrics'
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {node.type.replace('_', ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveNode(node.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Spoken Prompt (African Neural TTS)
                      </label>
                      <textarea
                        rows={2}
                        value={node.promptText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNodes((prev) =>
                            prev.map((n) => (n.id === node.id ? { ...n, promptText: val } : n))
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-2">
                        <span>Voice: <strong className="text-amber-300">{node.ttsVoice}</strong></span>
                        {node.bridgeTarget && (
                          <span>Target: <strong className="text-emerald-400 font-mono">{node.bridgeTarget}</strong></span>
                        )}
                      </div>
                      <span className="font-mono text-slate-500">Streaming Turn &lt; 1.2s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMode === 'ncco' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Programmable Nexmo Call Control Object (NCCO) JSON</span>
                <span className="font-mono text-[11px] text-amber-300">FreeSWITCH JSON Interpreter</span>
              </div>
              <textarea
                rows={12}
                value={nccoJson}
                onChange={(e) => setNccoJson(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs text-emerald-400/90 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
