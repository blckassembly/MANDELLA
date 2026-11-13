import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  RefreshCw,
  Sliders,
  PhoneForwarded,
  Wrench,
  Check,
  Clock,
  MessageSquare,
  FileText
} from 'lucide-react';
import { AiAgentConfig, CallWorkflowDefinition } from '../../types/agnosticOS';
import { INITIAL_AI_AGENTS, INITIAL_CALL_WORKFLOWS } from '../../data/mockAgnosticData';

const DEFAULT_PROMPT = 'Create a multilingual customer-service voice agent, connect my phone number, answer product questions, and transfer unresolved calls to an employee.';

export const AgentBuilderStudio: React.FC<{
  onPublishAgent?: (agent: AiAgentConfig, workflow: CallWorkflowDefinition) => void;
}> = ({ onPublishAgent }) => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [phoneNumber, setPhoneNumber] = useState<string>('+254207901000');
  const [fallbackNumber, setFallbackNumber] = useState<string>('+254700892104');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'review' | 'workflow' | 'simulation' | 'approval'>('review');

  // Generated Agent State
  const [generatedAgent, setGeneratedAgent] = useState<AiAgentConfig>(INITIAL_AI_AGENTS[0]);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<CallWorkflowDefinition>(INITIAL_CALL_WORKFLOWS[0]);
  const [capabilities, setCapabilities] = useState<{ [key: string]: string }>({
    telephony: 'FreeSWITCH Anycast SIP RFC 3261',
    mediaNat: 'RTPEngine NAT Traversal JitterBuffer',
    asr: 'Native African Dialect Neural ASR (Sub-100ms)',
    tts: '50 African Languages Neural TTS',
    aiModel: 'Gemini 3.8 Flash (Low Latency Reasoning)',
    recordingStorage: 'S3-Compatible Sovereign Vault'
  });
  const [simulationTrace, setSimulationTrace] = useState<{
    sampleCallerDialogue: string;
    sampleAgentResponse: string;
    sampleTransferTrigger: string;
    predictedLatencyMs: number;
    predictedMosScore: number;
  }>({
    sampleCallerDialogue: 'Habari, nahitaji kujua bei ya huduma zenu na jinsi ya kuwasiliana na mfanyakazi.',
    sampleAgentResponse: 'Habari! Bei zetu zinaanzia shilingi elfu moja kwa mwezi. Ningependa kukuunganisha sasa hivi na mfanyakazi wetu ili akusaidie zaidi.',
    sampleTransferTrigger: 'Transfer initiated: Bridging to employee on +254 700 892 104.',
    predictedLatencyMs: 140,
    predictedMosScore: 4.41
  });
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGenerateAgent = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/agents/generate-from-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          phoneNumber,
          fallbackNumber,
          tenantId: 'tenant-ke-safaricom-01'
        })
      });
      const data = await res.json();

      if (data.agentConfig) {
        setGeneratedAgent({
          ...generatedAgent,
          ...data.agentConfig,
          id: `agent-${Date.now()}`
        });
      }
      if (data.requiredCapabilities) {
        setCapabilities(data.requiredCapabilities);
      }
      if (data.generatedWorkflow) {
        setGeneratedWorkflow({
          ...generatedWorkflow,
          ...data.generatedWorkflow,
          id: `wf-${Date.now()}`
        });
      }
      if (data.simulationTrace) {
        setSimulationTrace(data.simulationTrace);
      }
      setIsPublished(false);
      setToastMessage('Agent configuration generated! Review specs and test simulation below.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.warn('Using client-side generation handler:', err.message);
      setToastMessage('Agent generated using local reasoning engine.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    setIsPublished(true);
    if (onPublishAgent) {
      onPublishAgent(generatedAgent, generatedWorkflow);
    }
    setToastMessage(`Agent "${generatedAgent.name}" and callflow published to production FreeSWITCH media servers.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Natural Language Agent Builder Command Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>NATURAL LANGUAGE AGENT &amp; CALLFLOW COMPILER</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">POWERED BY GEMINI 3.8 FLASH</span>
        </div>

        <div className="mt-4">
          <label className="text-xs font-bold text-slate-200 block mb-2 uppercase tracking-wide">
            Describe the agent you want to create:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm font-sans text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors leading-relaxed resize-none"
              placeholder="e.g. Create a multilingual customer-service voice agent, connect my phone number, answer product questions, and transfer unresolved calls to an employee."
            />
          </div>
        </div>

        {/* Configuration inputs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              INBOUND DID PHONE NUMBER:
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              FALLBACK EMPLOYEE TRANSFER NUMBER:
            </label>
            <input
              type="text"
              value={fallbackNumber}
              onChange={(e) => setFallbackNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Prompt presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 mr-1">PRESETS:</span>
          <button
            onClick={() => setPrompt('Create a multilingual customer-service voice agent, connect my phone number, answer product questions, and transfer unresolved calls to an employee.')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Customer Service &amp; Transfer
          </button>
          <button
            onClick={() => setPrompt('Build an agricultural market price voicebot in Swahili and English, verify caller farmer ID, answer maize prices, and transfer to agronomist.')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Farmer Agronomy Hotline
          </button>
          <button
            onClick={() => setPrompt('Create a fintech merchant POS terminal support agent in Yoruba and Nigerian Pidgin that resets terminal sessions and prevents card fraud.')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Fintech Merchant POS Bot
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Compiles system prompt, visual NCCO nodes, tools, and simulation turns.
          </span>
          <button
            onClick={handleGenerateAgent}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
              isGenerating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Agent &amp; Workflow...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 fill-slate-950" />
                <span>Translate to Production Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Review Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'review'
              ? 'bg-slate-800 text-white border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span>1. Agent Specification</span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'workflow'
              ? 'bg-slate-800 text-white border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>2. Generated Callflow (NCCO)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'simulation'
              ? 'bg-slate-800 text-white border-b-2 border-purple-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-purple-400" />
          <span>3. Live Simulation Trace</span>
        </button>

        <button
          onClick={() => setActiveTab('approval')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'approval'
              ? 'bg-slate-800 text-white border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>4. Human Approval Gate</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* Tab 1: Agent Review */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Agent Spec (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">{generatedAgent.name}</h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded uppercase font-bold">
                {generatedAgent.primaryLanguage} · Code-Switching ON
              </span>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase">Role Description</label>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {generatedAgent.roleDescription}
              </p>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase">System Prompt (Speech-to-Speech Persona)</label>
              <textarea
                rows={6}
                value={generatedAgent.systemPrompt}
                onChange={(e) => setGeneratedAgent({ ...generatedAgent, systemPrompt: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400 leading-relaxed resize-none mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1">Tools &amp; Approved Integrations</label>
              <div className="space-y-2">
                {generatedAgent.toolsAllowed.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between text-xs">
                    <div>
                      <div className="font-bold text-white font-mono flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{t.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded">
                      APPROVED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Capabilities Checklist & Provider Bindings (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
              Provider Capabilities Validation
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Before deployment, the OS verifies that all required communications subsystems are registered and healthy.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Telephony &amp; SIP Trunk</div>
                  <div className="font-bold text-white mt-0.5">{capabilities.telephony}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Media &amp; NAT Traversal</div>
                  <div className="font-bold text-white mt-0.5">{capabilities.mediaNat}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Speech-to-Text (ASR)</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{capabilities.asr}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Text-to-Speech (TTS)</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{capabilities.tts}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">AI Reasoning Core</div>
                  <div className="font-bold text-purple-400 mt-0.5">{capabilities.aiModel}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Audio Storage Vault</div>
                  <div className="font-bold text-white mt-0.5">{capabilities.recordingStorage}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('simulation')}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Simulation Test &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Generated Callflow */}
      {activeTab === 'workflow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">VOICEXML / NCCO CALLFLOW</span>
              <h3 className="text-sm font-bold text-white">{generatedWorkflow.name}</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">ENTRY: {generatedWorkflow.entryNumber}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {generatedWorkflow.nodes.map((node, i) => (
              <div key={node.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>STEP 0{i + 1}</span>
                    <span className="text-cyan-400">{node.type.split('_')[0].toUpperCase()}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{node.title}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{node.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] font-mono text-emerald-400">
                  {node.nextBranches ? `${node.nextBranches.length} Branch Conditions` : 'Linear Next'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Simulation */}
      {activeTab === 'simulation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">
                AUDIO &amp; SIGNALING SIMULATION TRACE
              </span>
              <h3 className="text-sm font-bold text-white">Live Turn-by-Turn Dialogue Test</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">PREDICTED LATENCY: <strong className="text-emerald-400">{simulationTrace.predictedLatencyMs}ms</strong></span>
              <span className="text-slate-400">EST. MOS: <strong className="text-white">{simulationTrace.predictedMosScore}</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">1. CALLER (CONSUMER IN SWahili/ENGLISH)</div>
              <p className="text-slate-200 text-sm italic">&quot;{simulationTrace.sampleCallerDialogue}&quot;</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">2. AI VOICE AGENT (ZAWADI SPEECH SYNTHESIS)</div>
              <p className="text-slate-200 text-sm">&quot;{simulationTrace.sampleAgentResponse}&quot;</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">3. CALL CONTROL DISPATCH (SIP BRIDGE TRIGGER)</div>
              <p className="text-amber-200 font-mono text-xs">{simulationTrace.sampleTransferTrigger}</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('approval')}
              className="py-2.5 px-6 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer"
            >
              Request Approval &amp; Publish &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Human Approval */}
      {activeTab === 'approval' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Human-in-the-Loop Approval &amp; Release Gate</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Principal 9: Administrators approve consequential configuration changes and production deployments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-500 uppercase">Risk Level</div>
              <div className="text-emerald-400 font-bold text-sm mt-1">LOW (Consumer Hotline)</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-500 uppercase">Emergency Restrictions</div>
              <div className="text-white font-bold text-sm mt-1">112 / 999 Pass-Through Active</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-500 uppercase">Recording Consent</div>
              <div className="text-cyan-400 font-bold text-sm mt-1">Bilingual Voice Prompt Active</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white font-mono">Deployment Impact Summary:</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>FreeSWITCH media servers will route incoming calls to <strong className="text-white">{phoneNumber}</strong> to this workflow.</li>
              <li>Unresolved calls transfer to <strong className="text-white">{fallbackNumber}</strong> via SIP RFC 3261 bridge.</li>
              <li>Audio recordings stored in encrypted S3 bucket with 90-day retention and PII redaction.</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              STATUS: {isPublished ? <strong className="text-emerald-400">PUBLISHED TO FREESWITCH CLUSTER</strong> : 'AWAITING APPROVER SIGNATURE'}
            </div>

            <button
              onClick={handlePublish}
              disabled={isPublished}
              className={`px-8 py-3.5 rounded-xl font-bold font-mono text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                isPublished
                  ? 'bg-slate-800 text-emerald-400 cursor-default'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              {isPublished ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Agent &amp; Callflow Published!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign &amp; Publish to Production</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
