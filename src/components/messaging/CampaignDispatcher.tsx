import React, { useState } from 'react';
import { MessageRecord, MessageType } from '../../types/messaging';
import {
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Radio,
  FileText
} from 'lucide-react';

interface CampaignDispatcherProps {
  messages: MessageRecord[];
  onDispatchMessage: (msg: MessageRecord) => void;
  onOpenPhoneSimulatorWithMsisdn?: (msisdn: string) => void;
}

export const CampaignDispatcher: React.FC<CampaignDispatcherProps> = ({
  messages,
  onDispatchMessage,
  onOpenPhoneSimulatorWithMsisdn
}) => {
  // Mode: single vs bulk
  const [dispatchMode, setDispatchMode] = useState<'single' | 'bulk'>('single');

  // Single dispatch state
  const [targetMsisdn, setTargetMsisdn] = useState('+233244123890');
  const [senderId, setSenderId] = useState('MANDELA_AGRI');
  const [messageType, setMessageType] = useState<MessageType>('transactional');
  const [messageBody, setMessageBody] = useState(
    'Ashanti Maize Market: Wholesale bag selling at GHc 420. High rainfall expected Wednesday. Store dry.'
  );

  // Bulk state
  const [bulkCountry, setBulkCountry] = useState('GH');
  const [bulkCount, setBulkCount] = useState(10000);
  const [bulkPersona, setBulkPersona] = useState('Registered Smallholder Farmers');

  // Optimization mode (PRD Section 7.1)
  const [routingOptimization, setRoutingOptimization] = useState<'optimize_delivery' | 'optimize_cost'>('optimize_delivery');

  // AI Pre-Send Intelligence Pass state
  const [aiPassExecuted, setAiPassExecuted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculated analysis results
  const [aiAnalysis, setAiAnalysis] = useState<{
    smsPercentage: number;
    ussdPercentage: number;
    predictedDeliveryRate: number;
    featurePhonesDetected: number;
    projectedCostUsd: number;
    reasoning: string;
  }>({
    smsPercentage: 70,
    ussdPercentage: 30,
    predictedDeliveryRate: 98.4,
    featurePhonesDetected: 3000,
    projectedCostUsd: 58.4,
    reasoning: 'HLR returned 30% feature phones roaming on 2G cell edge. Converting to USSD Push prevents 3,000 lost SMS drops.'
  });

  const handleRunAiIntelligencePass = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiPassExecuted(true);
      if (dispatchMode === 'bulk') {
        const featureCount = Math.round(bulkCount * 0.32);
        setAiAnalysis({
          smsPercentage: 68,
          ussdPercentage: 32,
          predictedDeliveryRate: 98.6,
          featurePhonesDetected: featureCount,
          projectedCostUsd: +(bulkCount * 0.0058).toFixed(2),
          reasoning: `HLR System 15 pass identified ${featureCount.toLocaleString()} 2G basic handsets with poor packet coverage. Routing via USSD Push ensures instant screen pop.`
        });
      } else {
        const isFeaturePhone = targetMsisdn.includes('233') || targetMsisdn.includes('254');
        setAiAnalysis({
          smsPercentage: isFeaturePhone ? 0 : 100,
          ussdPercentage: isFeaturePhone ? 100 : 0,
          predictedDeliveryRate: 99.1,
          featurePhonesDetected: isFeaturePhone ? 1 : 0,
          projectedCostUsd: 0.0058,
          reasoning: isFeaturePhone
            ? 'Handset MSISDN identified on 2G cell tower. Auto-converting SMS to direct USSD push ensures 100% reach.'
            : 'Handset 4G active with strong SMSC paging score. Direct SMPP v5 route assigned.'
        });
      }
    }, 500);
  };

  const handleExecuteDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (dispatchMode === 'single') {
        const willUseUssd = routingOptimization === 'optimize_delivery' && aiAnalysis.ussdPercentage > 0;
        const newMsg: MessageRecord = {
          id: `msg-${Date.now().toString().slice(-6)}`,
          to: targetMsisdn,
          from: senderId,
          body: messageBody,
          type: messageType,
          channel: willUseUssd ? 'ussd_push' : 'sms',
          status: willUseUssd ? 'converted_to_ussd' : 'delivered',
          countryCode: targetMsisdn.startsWith('+234') ? 'NG' : targetMsisdn.startsWith('+254') ? 'KE' : 'GH',
          carrier: targetMsisdn.startsWith('+234') ? 'MTN Nigeria' : targetMsisdn.startsWith('+254') ? 'Safaricom' : 'MTN Ghana',
          bindId: 'bind-mtn-gh-01',
          smppSequenceNumber: Math.floor(100000 + Math.random() * 900000),
          dlrStatus: 'DELIVRD',
          submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          deliveredAt: new Date(Date.now() + 2100).toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          latencyMs: willUseUssd ? 1800 : 3400,
          attempts: 1,
          maxAttempts: 3,
          aiPredictedFailure: willUseUssd,
          aiConfidence: 0.94,
          aiFallbackReason: willUseUssd ? 'Converted to USSD Push to guarantee delivery on 2G feature handset.' : undefined,
          costUsd: willUseUssd ? 0.0042 : 0.0068,
          hlrReachable: true,
          handsetDeviceType: willUseUssd ? 'feature_phone_2g' : 'smartphone_3g_4g'
        };
        onDispatchMessage(newMsg);
      } else {
        // Bulk campaign simulated items
        const newMsg: MessageRecord = {
          id: `camp-${Date.now().toString().slice(-5)}`,
          to: `${bulkCount.toLocaleString()} ${bulkPersona} (${bulkCountry})`,
          from: senderId,
          body: messageBody,
          type: 'transactional',
          channel: 'sms',
          status: 'delivered',
          countryCode: bulkCountry,
          carrier: 'Direct Multi-Carrier Matrix',
          bindId: 'auto-pool-200',
          smppSequenceNumber: Math.floor(200000 + Math.random() * 800000),
          dlrStatus: 'DELIVRD',
          submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          deliveredAt: new Date(Date.now() + 4500).toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          latencyMs: 3800,
          attempts: 1,
          maxAttempts: 3,
          aiPredictedFailure: true,
          aiConfidence: 0.98,
          costUsd: aiAnalysis.projectedCostUsd,
          hlrReachable: true,
          handsetDeviceType: 'feature_phone_2g'
        };
        onDispatchMessage(newMsg);
      }
    }, 600);
  };

  const handleSelectTemplate = (type: 'otp' | 'agri' | 'logistics') => {
    if (type === 'otp') {
      setMessageType('otp');
      setSenderId('BANK_VERIFY');
      setMessageBody('Your authentication passcode is 772910. Never share this code. Expires in 5 minutes.');
    } else if (type === 'agri') {
      setMessageType('transactional');
      setSenderId('MANDELA_AGRI');
      setMessageBody('Market Update: White maize wholesale buying price in Kumasi is GHc 410. Storage alert: dry conditions.');
    } else {
      setMessageType('transactional');
      setSenderId('EXPRESS_LOG');
      setMessageBody('Parcel #994821 arrived at Lagos Central Hub. Dispatcher arriving at 2:30pm.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Message & Campaign Dispatch Studio</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 4.1 & 9</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Send critical OTPs or broadcast rural farmer campaigns with automated AI failure prediction and USSD fallback.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setDispatchMode('single');
              setAiPassExecuted(false);
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              dispatchMode === 'single'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Single MSISDN
          </button>
          <button
            onClick={() => {
              setDispatchMode('bulk');
              setAiPassExecuted(false);
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              dispatchMode === 'bulk'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulk Campaign (10k+)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dispatch Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-semibold text-white">1. Message Parameters</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Templates:</span>
              <button
                type="button"
                onClick={() => handleSelectTemplate('otp')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
              >
                OTP
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('agri')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
              >
                Agri Alert
              </button>
              <button
                type="button"
                onClick={() => handleSelectTemplate('logistics')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
              >
                Logistics
              </button>
            </div>
          </div>

          <form onSubmit={handleExecuteDispatch} className="space-y-4 text-xs">
            {dispatchMode === 'single' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Destination MSISDN (E.164)</label>
                  <input
                    type="text"
                    required
                    value={targetMsisdn}
                    onChange={(e) => {
                      setTargetMsisdn(e.target.value);
                      setAiPassExecuted(false);
                    }}
                    placeholder="+233... or +234..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Works on any 2G/3G/4G African phone</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Sender ID (System 1 Approved)</label>
                  <input
                    type="text"
                    required
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">✓ Resolved via System 1 registry</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target Country</label>
                  <select
                    value={bulkCountry}
                    onChange={(e) => {
                      setBulkCountry(e.target.value);
                      setAiPassExecuted(false);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium"
                  >
                    <option value="GH">🇬🇭 Ghana (NCA · MTN/Telecel)</option>
                    <option value="NG">🇳🇬 Nigeria (NCC · MTN/Airtel)</option>
                    <option value="KE">🇰🇪 Kenya (CA · Safaricom)</option>
                    <option value="ZA">🇿🇦 South Africa (ICASA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target Audience</label>
                  <input
                    type="text"
                    value={bulkPersona}
                    onChange={(e) => setBulkPersona(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Total Recipients</label>
                  <input
                    type="number"
                    value={bulkCount}
                    onChange={(e) => {
                      setBulkCount(+e.target.value);
                      setAiPassExecuted(false);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Message Body (GSM-7 160 chars / USSD payload)</label>
              <textarea
                rows={3}
                required
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 text-xs leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono mt-1">
                <span>{messageBody.length} characters · 1 segment</span>
                <span>GSM 03.38 standard</span>
              </div>
            </div>

            {/* Routing Mode Policy (PRD Section 7.1) */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-slate-400 font-medium block">2. Route Policy & Failover Profile</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoutingOptimization('optimize_delivery')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    routingOptimization === 'optimize_delivery'
                      ? 'bg-amber-400/10 border-amber-400/60 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Optimize for Delivery (98% SLA)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    AI HLR pre-send prediction + automated USSD Push conversion for 2G feature phones.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRoutingOptimization('optimize_cost')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    routingOptimization === 'optimize_cost'
                      ? 'bg-amber-400/10 border-amber-400/60 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-slate-200">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Optimize for Cost (Wholesale)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Least-cost direct route with standard exponential backoff retries.
                  </p>
                </button>
              </div>
            </div>

            {/* Pre-Send AI Intelligence CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRunAiIntelligencePass}
                disabled={isAnalyzing}
                className="w-full sm:w-auto py-2 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Running HLR Intelligence Pass...' : 'Run Pre-Send AI HLR Analysis'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to SMPP Queue...' : 'Dispatch Message'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: AI HLR Prediction & Auto-Split Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">AI Failure Prediction & Auto-Split</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">System 15 HLR Linked</span>
          </div>

          {!aiPassExecuted ? (
            <div className="p-8 text-center space-y-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
              <Radio className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-slate-300 text-xs font-medium">
                No Pre-Send Analysis Executed
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                Click &ldquo;Run Pre-Send AI HLR Analysis&rdquo; to correlate subscriber handset type, roaming telemetry, and predictive USSD failover.
              </p>
              <button
                type="button"
                onClick={handleRunAiIntelligencePass}
                className="py-1.5 px-3 bg-slate-800 text-amber-300 rounded text-xs hover:bg-slate-700 transition-colors"
              >
                Simulate HLR Check
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Delivery projection card */}
              <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                    Projected Effective Delivery
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {aiAnalysis.predictedDeliveryRate}%
                  </span>
                </div>

                {/* Progress bar split */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-amber-300">{aiAnalysis.smsPercentage}% Direct SMS</span>
                    <span className="text-sky-300">{aiAnalysis.ussdPercentage}% USSD Push Fallback</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${aiAnalysis.smsPercentage}%` }}
                    />
                    <div
                      className="bg-sky-400 h-full transition-all duration-500"
                      style={{ width: `${aiAnalysis.ussdPercentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  {aiAnalysis.reasoning}
                </p>
              </div>

              {/* Breakdown stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Feature Phones</span>
                  <span className="font-mono text-sm font-bold text-white mt-0.5 block">
                    {aiAnalysis.featurePhonesDetected.toLocaleString()} units
                  </span>
                  <span className="text-[10px] text-sky-400">100% USSD Capable</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Estimated Cost</span>
                  <span className="font-mono text-sm font-bold text-emerald-400 mt-0.5 block">
                    ${aiAnalysis.projectedCostUsd.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500">Avg $0.0058 / delivered</span>
                </div>
              </div>

              {/* Feature Phone Simulator link */}
              {onOpenPhoneSimulatorWithMsisdn && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenPhoneSimulatorWithMsisdn(targetMsisdn)}
                    className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-amber-300 text-xs transition-colors flex items-center justify-center gap-1.5 font-mono"
                  >
                    <span>Inspect Handset Experience in 2G Phone Simulator →</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Message Dispatch Journal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-white">Live Dispatched Messages Queue ({messages.length})</span>
          <span className="font-mono text-[11px] text-slate-500">Real-Time DLR Correlation Active</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 hover:bg-slate-850/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-white">{msg.to}</span>
                  <span className="text-slate-500">from</span>
                  <span className="font-mono text-amber-300 font-semibold">{msg.from}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                    {msg.channel.replace('_', ' ')}
                  </span>
                  {msg.status === 'converted_to_ussd' ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-500/30">
                      USSD Push (AI Fallback)
                    </span>
                  ) : msg.status === 'delivered' ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      DLR DELIVRD ({msg.latencyMs}ms)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                      Retrying (Store & Fwd)
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-xs">{msg.body}</p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Carrier: {msg.carrier} · Seq #{msg.smppSequenceNumber} · Submitted: {msg.submittedAt}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs text-slate-400 block">${msg.costUsd.toFixed(4)}</span>
                <span className="text-[10px] text-emerald-400 font-mono">Direct SMPP v5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
