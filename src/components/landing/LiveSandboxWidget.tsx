import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RefreshCw, 
  Terminal, 
  Zap, 
  Radio, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export type SandboxPreset = 'fintech_otp' | 'multilingual_ivr' | 'subsea_bgp' | 'satellite_ntn';

interface SandboxScenario {
  id: SandboxPreset;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  defaultDestination: string;
  defaultPayload: string;
  carrierRoute: string;
  savingsMultiplier: number; // e.g. 0.32 = saves 68%
  sampleStream: Array<{
    phase: string;
    detail: string;
    latencyMs: number;
    status: 'ok' | 'info' | 'warn';
  }>;
}

const SCENARIOS: Record<SandboxPreset, SandboxScenario> = {
  fintech_otp: {
    id: 'fintech_otp',
    title: 'Fintech OTP Delivery',
    tagline: 'Direct Tier-1 SMPP v5 bind bypasses international aggregator markups',
    icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
    defaultDestination: '+234 803 123 4567 (MTN Nigeria)',
    defaultPayload: 'Your Ecobank auth code is 849201. Valid for 3 mins. Ref: #MND-9921',
    carrierRoute: 'LAG-IXP-DIRECT-SMPP-T1',
    savingsMultiplier: 0.31,
    sampleStream: [
      { phase: 'PDU_SUBMIT_SM', detail: 'Encapsulated UCS-2 payload dispatched over direct TLS SMPP session', latencyMs: 14, status: 'info' },
      { phase: 'SIGTRAN_ROUTING', detail: 'HLR Lookup verified active IMSI on MTN Lagos switchboard', latencyMs: 38, status: 'info' },
      { phase: 'SMSC_HANDOFF', detail: 'Direct delivery ticket issued by Sovereign Gateway', latencyMs: 62, status: 'ok' },
      { phase: 'DELIVERY_RECEIPT', detail: 'DLR stat:DELIVRD err:000 sub:001 done date:2610211925', latencyMs: 94, status: 'ok' }
    ]
  },
  multilingual_ivr: {
    id: 'multilingual_ivr',
    title: 'African AI Voice IVR',
    tagline: 'Sub-150ms speech-to-speech neural pipeline in 50 African languages',
    icon: <PhoneCall className="w-4 h-4 text-cyan-400" />,
    defaultDestination: '+254 712 345 678 (Safaricom Kenya)',
    defaultPayload: 'Habari, unakaribishwa kwa huduma za benki. Tafadhali sema salio au uhamishaji fedha.',
    carrierRoute: 'NBO-POP-FREESWITCH-TTS-SWAHILI',
    savingsMultiplier: 0.28,
    sampleStream: [
      { phase: 'SIP_INVITE', detail: 'SDP negotiated G.711a with RTPEngine JitterBuffer at Nairobi IXP', latencyMs: 22, status: 'info' },
      { phase: 'NEURAL_ASR', detail: 'Swahili dialect acoustic model identified intent: CHECK_ACCOUNT_BALANCE', latencyMs: 86, status: 'info' },
      { phase: 'DATAVERSE_QUERY', detail: 'Encrypted token validation against Core Banking Ledger', latencyMs: 118, status: 'ok' },
      { phase: 'TTS_SYNTHESIS', detail: 'Streaming Swahili neural speech packetized into RTP media stream', latencyMs: 142, status: 'ok' }
    ]
  },
  subsea_bgp: {
    id: 'subsea_bgp',
    title: 'Subsea BGP Failover',
    tagline: 'Autonomous LCR arbitration reroutes from WACS/2Africa to Equiano in <12ms',
    icon: <Layers className="w-4 h-4 text-amber-400" />,
    defaultDestination: '+27 82 000 1122 (Vodacom SA)',
    defaultPayload: 'SIP TRUNK BUNDLE: 1,200 CONCURRENT CHANNELS (JOHANNESBURG <-> ACCRA)',
    carrierRoute: 'CPT-WACS -> EQUIANO-DIVERSE-FAILOVER',
    savingsMultiplier: 0.44,
    sampleStream: [
      { phase: 'BGP_HEALTHCHECK', detail: 'Detected high packet loss (22%) on West Africa Subsea (WACS) segment', latencyMs: 8, status: 'warn' },
      { phase: 'LCR_ARBITRATION', detail: 'Scored 14 alternative transit rate decks for SLA jitter < 35ms', latencyMs: 19, status: 'info' },
      { phase: 'ANYCAST_SWAP', detail: 'Anycast DNS & BGP community announce switched prefix to Equiano Cable', latencyMs: 31, status: 'ok' },
      { phase: 'TRAFFIC_RESTORED', detail: '0 dropped SIP dialogues. Mean Opinion Score (MOS) stable at 4.38', latencyMs: 44, status: 'ok' }
    ]
  },
  satellite_ntn: {
    id: 'satellite_ntn',
    title: 'Satellite NTN Direct Link',
    tagline: '3GPP Rel-17 NTN connectivity for off-grid mining & emergency telemetry',
    icon: <Radio className="w-4 h-4 text-purple-400" />,
    defaultDestination: 'LEO-SAT CONSTELLATION (ORBIT 550KM, CONGO BASIN)',
    defaultPayload: 'IOT_TELEMETRY: SENSOR_ID#MIN-0982 DEPTH:420m CH4:0.02% POWER:NORMAL',
    carrierRoute: 'HARARE-TELEPORT-LEO-DIRECT',
    savingsMultiplier: 0.35,
    sampleStream: [
      { phase: 'DOPPLER_ACQUIRE', detail: 'Phase-lock loop stabilized Doppler shift at 42.8 kHz carrier offset', latencyMs: 48, status: 'info' },
      { phase: 'NTN_HANDSHAKE', detail: '3GPP Rel-17 direct device-to-satellite RRC connection acknowledged', latencyMs: 89, status: 'info' },
      { phase: 'EPHEMERIS_CALC', detail: 'Beam handover scheduled to Satellite LEO-AF-04 in 184 seconds', latencyMs: 110, status: 'ok' },
      { phase: 'TELEMETRY_INGEST', detail: 'Ingested into Sovereign Dataverse time-series fabric (Verified SHA-256)', latencyMs: 135, status: 'ok' }
    ]
  }
};

export const LiveSandboxWidget: React.FC<{
  onLaunchConsole?: () => void;
}> = ({ onLaunchConsole }) => {
  const [activePreset, setActivePreset] = useState<SandboxPreset>('fintech_otp');
  const [destination, setDestination] = useState<string>(SCENARIOS.fintech_otp.defaultDestination);
  const [payload, setPayload] = useState<string>(SCENARIOS.fintech_otp.defaultPayload);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [streamProgress, setStreamProgress] = useState<number>(4); // initial all loaded
  const [executionTime, setExecutionTime] = useState<number>(94);

  const scenario = SCENARIOS[activePreset];

  const handleSelectPreset = (preset: SandboxPreset) => {
    setActivePreset(preset);
    const target = SCENARIOS[preset];
    setDestination(target.defaultDestination);
    setPayload(target.defaultPayload);
    setStreamProgress(target.sampleStream.length);
    setExecutionTime(target.sampleStream[target.sampleStream.length - 1].latencyMs);
    setIsRunning(false);
  };

  const handleExecuteSimulation = () => {
    setIsRunning(true);
    setStreamProgress(0);

    const steps = scenario.sampleStream;
    steps.forEach((_, idx) => {
      setTimeout(() => {
        setStreamProgress(idx + 1);
        setExecutionTime(steps[idx].latencyMs);
        if (idx === steps.length - 1) {
          setIsRunning(false);
        }
      }, (idx + 1) * 350);
    });
  };

  const standardCost = 0.048; // USD legacy aggregator baseline
  const mandelaCost = +(standardCost * scenario.savingsMultiplier).toFixed(4);
  const savingsPercent = Math.round((1 - scenario.savingsMultiplier) * 100);

  return (
    <div
      id="sandbox"
      className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-slate-700/80"
    >
      {/* Top Header of Sandbox */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="font-mono text-xs text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>MANDELA-SIMULATOR // TELECOM RUNTIME</span>
          </span>
        </div>

        {/* Live Metric Badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">LATENCY:</span>
            <span className="text-emerald-400 font-bold tabular-nums">{executionTime}ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">SAVINGS:</span>
            <span className="text-cyan-400 font-bold tabular-nums">+{savingsPercent}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">ROUTE:</span>
            <span className="text-slate-200 font-semibold">{scenario.carrierRoute.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-800 bg-slate-950/40 text-xs font-medium">
        {(Object.keys(SCENARIOS) as SandboxPreset[]).map((key) => {
          const sc = SCENARIOS[key];
          const isSelected = activePreset === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`px-4 py-3 text-left transition-all flex items-center gap-2.5 cursor-pointer border-r border-slate-800 last:border-r-0 ${
                isSelected
                  ? 'bg-slate-800/80 text-white border-b-2 border-b-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <span className="shrink-0">{sc.icon}</span>
              <div className="truncate">
                <div className="font-bold truncate">{sc.title}</div>
                <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                  {key === 'fintech_otp' && 'Direct SMPP v5'}
                  {key === 'multilingual_ivr' && '50 Dialects ASR'}
                  {key === 'subsea_bgp' && 'Autonomous LCR'}
                  {key === 'satellite_ntn' && '3GPP Rel-17 LEO'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Sandbox Interactive Body */}
      <div className="p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config & Action (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Destination Endpoint / Target
              </label>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
                SOVEREIGN IXP CONNECT
              </span>
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              placeholder="+234 803 000 0000"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Payload / Signaling Intent
              </label>
              <span className="text-[10px] text-slate-400">
                {payload.length} chars
              </span>
            </div>
            <textarea
              rows={3}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Pricing Comparison Ticker */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Aggregator Cost</div>
              <div className="text-rose-400 line-through tabular-nums">${standardCost.toFixed(4)}</div>
            </div>
            <div className="text-center font-bold text-slate-600">vs</div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-400 uppercase font-semibold">Mandela Direct</div>
              <div className="text-emerald-300 font-bold tabular-nums text-sm">${mandelaCost.toFixed(4)}</div>
            </div>
          </div>

          {/* Execution Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleExecuteSimulation}
              disabled={isRunning}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isRunning
                  ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Telemetry...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Test Live Telemetry Stream</span>
                </>
              )}
            </button>

            {onLaunchConsole && (
              <button
                onClick={onLaunchConsole}
                className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                title="Open production console"
              >
                <span>Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Execution Ladder & Real-Time Console Trace (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SIGNALS TRACE // ISO 27001 AUDIT ACTIVE</span>
              </span>
              <span className="text-slate-500">STREAM: STDOUT</span>
            </div>

            {/* Stepped Stream Log */}
            <div className="space-y-3 pt-3">
              {scenario.sampleStream.slice(0, streamProgress).map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 transition-all duration-200"
                >
                  <div className="shrink-0 mt-0.5">
                    {step.status === 'ok' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : step.status === 'warn' ? (
                      <Zap className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Cpu className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-200 text-[11px] tracking-wide">
                        {step.phase}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        +{step.latencyMs}ms
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5 break-words">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}

              {streamProgress === 0 && (
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  Awaiting simulation dispatch. Click &quot;Test Live Telemetry Stream&quot; above.
                </div>
              )}
            </div>
          </div>

          {/* Footer of the Console Trace */}
          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>E.164 VALIDATED · GSMA PRD IR.21 COMPLIANT</span>
            <span className="text-emerald-400 font-semibold">ALL HOPS ENCRYPTED (mTLS)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
