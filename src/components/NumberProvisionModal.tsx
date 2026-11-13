import React, { useState, useEffect } from 'react';
import { PhoneNumberRecord, KycProfile } from '../types/nms';
import { CheckCircle2, Loader2, ShieldCheck, Server, Globe2, Radio, PhoneCall } from 'lucide-react';

interface NumberProvisionModalProps {
  number: PhoneNumberRecord;
  kycProfile: KycProfile;
  onComplete: (updatedNumber: PhoneNumberRecord) => void;
  onCancel: () => void;
  onOpenSoftphone: (number: PhoneNumberRecord) => void;
}

interface StepState {
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  icon: any;
  duration?: number;
}

export const NumberProvisionModal: React.FC<NumberProvisionModalProps> = ({
  number,
  kycProfile,
  onComplete,
  onCancel,
  onOpenSoftphone,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // User configurable routing target during provisioning:
  const [sipUri, setSipUri] = useState(`sip:${number.e164}@sbc.mandela.africa:5060;transport=tls`);
  const [webhookUrl, setWebhookUrl] = useState(`https://api.mandela-apps.com/webhooks/incoming-${number.countryCode.toLowerCase()}`);

  const [steps, setSteps] = useState<StepState[]>([
    {
      title: 'System 16 KYC Check & Compliance Attestation',
      description: `Validating ${kycProfile.entityName} against ${number.countryName} regulatory registry.`,
      status: 'running',
      icon: ShieldCheck,
      duration: 1200
    },
    {
      title: `Regulatory Allocation Lock (${number.carrier})`,
      description: `Reserving E.164 block with ${number.carrier} and ${number.countryName} numbering plan.`,
      status: 'pending',
      icon: Radio,
      duration: 1500
    },
    {
      title: 'Kamailio Dispatcher & SBC Route Compilation',
      description: 'Writing routing record to Telecom Systems 4 & 5 Kamailio edge proxy.',
      status: 'pending',
      icon: Server,
      duration: 1800
    },
    {
      title: 'RFC 3761 ENUM DNS (e164.arpa) Record Publication',
      description: `Publishing NAPTR record: ${number.e164.replace('+', '').split('').reverse().join('.')}.e164.arpa`,
      status: 'pending',
      icon: Globe2,
      duration: 1400
    },
    {
      title: 'SIP Trunk & Webhook Binding Verification',
      description: 'Linking customer SIP credentials and HTTP webhook event triggers.',
      status: 'pending',
      icon: CheckCircle2,
      duration: 1100
    }
  ]);

  // Timer
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (!isFinished) {
        setElapsedMs(Date.now() - start);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isFinished]);

  // Step runner
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setIsFinished(true);
      return;
    }

    const currentStep = steps[currentStepIndex];
    const duration = currentStep.duration || 1500;

    const timer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((s, idx) => {
          if (idx === currentStepIndex) return { ...s, status: 'completed' };
          if (idx === currentStepIndex + 1) return { ...s, status: 'running' };
          return s;
        })
      );
      setCurrentStepIndex((prev) => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length]);

  const handleFinalize = () => {
    const updated: PhoneNumberRecord = {
      ...number,
      status: 'assigned',
      allocatedTo: 'mandela-user-primary',
      allocatedAt: new Date().toISOString(),
      sipTrunkUri: sipUri,
      webhookUrl: webhookUrl,
      kamailioDispatcherId: Math.floor(100 + Math.random() * 899),
      enumRecord: `${number.e164.replace('+', '').split('').reverse().join('.')}.e164.arpa IN NAPTR 10 100 "u" "E2U+sip" "!^.*$!${sipUri}!" .`,
      lastActivityAt: new Date().toISOString(),
      kycVerified: true
    };
    onComplete(updated);
  };

  const handleTestCallImmediate = () => {
    const updated: PhoneNumberRecord = {
      ...number,
      status: 'assigned',
      allocatedTo: 'mandela-user-primary',
      allocatedAt: new Date().toISOString(),
      sipTrunkUri: sipUri,
      webhookUrl: webhookUrl,
      kamailioDispatcherId: Math.floor(100 + Math.random() * 899),
      enumRecord: `${number.e164.replace('+', '').split('').reverse().join('.')}.e164.arpa IN NAPTR 10 100 "u" "E2U+sip" "!^.*$!${sipUri}!" .`,
      lastActivityAt: new Date().toISOString(),
      kycVerified: true
    };
    onComplete(updated);
    onOpenSoftphone(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">Automated Provisioning Orchestrator</span>
              <span className="text-xs font-mono text-emerald-400">· SUB-60s SLA</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Binding sovereign number <span className="font-mono text-amber-300 font-semibold">{number.e164}</span> ({number.countryName})
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Elapsed Time</div>
            <div className="font-mono text-sm font-semibold text-white tabular-nums">
              {(elapsedMs / 1000).toFixed(1)}s <span className="text-xs text-slate-500">/ 60.0s max</span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300 ease-out"
              style={{
                width: `${(Math.min(currentStepIndex, steps.length) / steps.length) * 100}%`
              }}
            />
          </div>

          {/* Stepper list */}
          <div className="space-y-3 pt-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs transition-colors flex items-start gap-3 ${
                    s.status === 'completed'
                      ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                      : s.status === 'running'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-100 shadow-sm'
                      : 'bg-slate-950/30 border-slate-800/40 text-slate-500'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {s.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {s.status === 'running' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                    {s.status === 'pending' && <Icon className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>{s.title}</span>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">
                        {s.status === 'completed' ? 'Done' : s.status === 'running' ? 'Writing...' : 'Queued'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Routing Configuration Options */}
          <div className="pt-2 border-t border-slate-800 space-y-3 text-xs">
            <div className="text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
              Mandela Routing Endpoints
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">SIP Trunk URI (Kamailio Dispatcher Target)</label>
              <input
                type="text"
                value={sipUri}
                onChange={(e) => setSipUri(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Inbound Voice / SMS Webhook URL</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isFinished ? (
              <span className="text-emerald-400 font-medium">Provisioning succeeded in {(elapsedMs / 1000).toFixed(1)}s</span>
            ) : (
              <span className="text-slate-400">Synchronizing routing engines...</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isFinished ? (
              <button
                onClick={onCancel}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            ) : (
              <>
                <button
                  onClick={handleFinalize}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  Save & Go to Numbers
                </button>
                <button
                  onClick={handleTestCallImmediate}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Test Ring Now (Softphone)
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
