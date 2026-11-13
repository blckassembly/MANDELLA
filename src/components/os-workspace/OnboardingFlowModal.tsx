import React, { useState } from 'react';
import { Monitor, Terminal, Eye, EyeOff, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Button, Input, Select } from '../../design-system';
import { ExperienceMode } from './types';

interface OnboardingFlowModalProps {
  isOpen: boolean;
  initialView: 'signin' | 'org_setup' | 'choose_experience' | 'orientation';
  onClose: () => void;
  experienceMode: ExperienceMode;
  onSelectExperienceMode: (mode: ExperienceMode) => void;
  onCreateOrg?: (orgName: string, country: string, focus: string) => void;
  onNavigateTarget?: (section: 'desktop' | 'mission_control' | 'systems' | 'infrastructure' | 'golden_command') => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    total: 5,
    title: 'Welcome to MANDELA OS',
    description:
      'Navigate Africa’s Infrastructure Operating System across Desktop, Mission Control, 18 Systems, Infrastructure Map, Golden Command, Deployments, and Expert Console.',
    highlight: 'Top Navigation & Bottom OS Dock'
  },
  {
    step: 2,
    total: 5,
    title: 'Two Interfaces. One System.',
    description:
      'Switch anytime between Guided Mode (for planning and approving site objectives) and Expert Mode (for JSON configs, logs, and dependency graphs).',
    highlight: 'Guided / Expert Mode Switcher'
  },
  {
    step: 3,
    total: 5,
    title: '18 Layered Infrastructure Systems',
    description:
      'Connect (01–03), Telecom (04–06), Cloud (07–09), Orbit (10–11), Grid (12–13), Fiber (14–15), and Secure (16–18) operate on one unified tenant model.',
    highlight: 'Systems Library (WF-08)'
  },
  {
    step: 4,
    total: 5,
    title: 'Golden Command & Simulation Pipeline',
    description:
      'Configure site requirements (e.g., DRC Clinic), compare Satellite vs. Terrestrial plans, obtain approval, and step through the 8-stage execution timeline.',
    highlight: 'Golden Command & Deployments'
  },
  {
    step: 5,
    total: 5,
    title: 'Customer Self-Service & Operator Provisioning',
    description:
      'Use the OS / Client / Ops selector in the header to move seamlessly from infrastructure planning to business number ordering and operator KYC verification.',
    highlight: 'Unified Multi-Interface Top Bar'
  }
];

export const OnboardingFlowModal: React.FC<OnboardingFlowModalProps> = ({
  isOpen,
  initialView,
  onClose,
  experienceMode,
  onSelectExperienceMode,
  onCreateOrg,
  onNavigateTarget
}) => {
  const [step, setStep] = useState<'signin' | 'org_setup' | 'choose_experience' | 'orientation'>(initialView);
  const [email, setEmail] = useState('operator@drc-clinic.org');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const [orgName, setOrgName] = useState('Pilot Organization — DRC Clinic');
  const [orgCountry, setOrgCountry] = useState('DRC (Democratic Republic of Congo)');
  const [orgFocus, setOrgFocus] = useState('Rural Clinic Connectivity & Sovereign Telecom');

  const [selectedMode, setSelectedMode] = useState<ExperienceMode>(experienceMode);
  const [tourIndex, setTourIndex] = useState(0);

  if (!isOpen) return null;

  const currentTour = TOUR_STEPS[tourIndex];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto">
      {/* Top Bar */}
      <header className="h-14 border-b border-black px-6 flex items-center justify-between shrink-0">
        <div className="font-extrabold text-lg tracking-tight text-black">MANDELA OS</div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
            DEMO
          </span>
          <span className="text-xs font-semibold text-black">{orgName}</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-black hover:bg-zinc-100 cursor-pointer"
            title="Return to workspace"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        {step === 'signin' && (
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-600">
                INFRASTRUCTURE
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black leading-[1.08]">
                Africa’s Infrastructure Operating System.
              </h1>
              <p className="text-base sm:text-lg text-zinc-700 max-w-lg leading-relaxed">
                Plan, connect, and operate infrastructure through one unified workspace.
              </p>
              <div className="pt-2 text-sm font-semibold text-black">
                Two interfaces. One system.
              </div>
            </div>

            <div className="lg:col-span-5 border-2 border-black bg-white p-6 sm:p-7 space-y-5">
              <h2 className="text-xl font-extrabold text-black">Welcome to MANDELA OS</h2>

              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="space-y-1">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="flex items-center gap-1 text-zinc-700 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide password' : 'Show password'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('choose_experience')}
                      className="underline text-zinc-700 hover:text-black cursor-pointer"
                    >
                      Continue as operator
                    </button>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={() => setStep('choose_experience')}
              >
                Sign in
              </Button>

              <div className="border-t border-black/20 pt-4 space-y-2.5">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setStep('org_setup')}
                >
                  Create organization
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={onClose}
                >
                  Explore demo environment
                </Button>
                <div className="text-center text-[11px] text-zinc-500 pt-1">
                  Demo planning workspace — no production modifications.
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'org_setup' && (
          <div className="w-full max-w-2xl border-2 border-black bg-white p-6 sm:p-8 space-y-6">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-600">
                ONBOARDING / 01
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Organization setup
              </h2>
              <p className="text-sm text-zinc-600 mt-1">
                Configure your pilot organization, country jurisdiction, and primary infrastructure focus.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
              <Select
                label="Primary Country / Market"
                value={orgCountry}
                onChange={(e) => setOrgCountry(e.target.value)}
                options={[
                  { label: 'DRC (Democratic Republic of Congo)', value: 'DRC (Democratic Republic of Congo)' },
                  { label: 'Kenya (+254)', value: 'Kenya (+254)' },
                  { label: 'Nigeria (+234)', value: 'Nigeria (+234)' },
                  { label: 'South Africa (+27)', value: 'South Africa (+27)' },
                  { label: 'Rwanda (+250)', value: 'Rwanda (+250)' }
                ]}
              />
              <Select
                label="Infrastructure Focus"
                value={orgFocus}
                onChange={(e) => setOrgFocus(e.target.value)}
                options={[
                  { label: 'Rural Clinic Connectivity & Sovereign Telecom', value: 'Rural Clinic Connectivity & Sovereign Telecom' },
                  { label: 'Carrier Interconnect & SIP Trunking', value: 'Carrier Interconnect & SIP Trunking' },
                  { label: 'Multi-Tenant Enterprise CPaaS & Numbers', value: 'Multi-Tenant Enterprise CPaaS & Numbers' }
                ]}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/20">
              <Button variant="secondary" onClick={() => setStep('signin')}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (onCreateOrg) onCreateOrg(orgName, orgCountry, orgFocus);
                  setStep('choose_experience');
                }}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'choose_experience' && (
          <div className="w-full max-w-4xl space-y-6">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-600">
                ONBOARDING / 02
              </div>
              <h2 className="text-3xl font-extrabold text-black mt-1">
                Choose your experience
              </h2>
              <p className="text-base font-semibold text-black mt-1">Two interfaces. One system.</p>
              <p className="text-sm text-zinc-600 mt-0.5">
                Switch modes anytime. Your projects, resources, and progress stay with you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guided Mode */}
              <button
                type="button"
                onClick={() => setSelectedMode('guided')}
                className={`text-left p-6 bg-white transition-all cursor-pointer flex flex-col justify-between ${
                  selectedMode === 'guided' ? 'border-[3px] border-black' : 'border border-black hover:bg-zinc-50'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full border border-black ${
                          selectedMode === 'guided' ? 'bg-black' : 'bg-white'
                        }`}
                      />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                        DEFAULT FOR OPERATORS
                      </span>
                    </div>
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-black">Guided Mode</div>
                    <p className="text-sm text-zinc-700 mt-1">
                      I want MANDELA to help me plan and manage infrastructure.
                    </p>
                  </div>
                  <div className="divide-y divide-black/20 border-t border-black/20 text-sm">
                    <div className="py-2.5">Describe a site objective</div>
                    <div className="py-2.5">Review a structured plan</div>
                    <div className="py-2.5">Follow approvals and simulation</div>
                  </div>
                </div>
              </button>

              {/* Expert Mode */}
              <button
                type="button"
                onClick={() => setSelectedMode('expert')}
                className={`text-left p-6 bg-white transition-all cursor-pointer flex flex-col justify-between ${
                  selectedMode === 'expert' ? 'border-[3px] border-black' : 'border border-black hover:bg-zinc-50'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-full border border-black ${
                          selectedMode === 'expert' ? 'bg-black' : 'bg-white'
                        }`}
                      />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                        FOR ENGINEERS
                      </span>
                    </div>
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-black">Expert Mode</div>
                    <p className="text-sm text-zinc-700 mt-1">
                      I want access to technical infrastructure controls and diagnostics.
                    </p>
                  </div>
                  <div className="divide-y divide-black/20 border-t border-black/20 text-sm">
                    <div className="py-2.5">Inspect technical configuration</div>
                    <div className="py-2.5">Trace system dependencies</div>
                    <div className="py-2.5">Review logs and validation</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="border border-black px-4 py-3 text-sm text-black bg-white">
              Both modes use the same project and deployment record.
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setStep('org_setup')}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onSelectExperienceMode(selectedMode);
                  setStep('orientation');
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'orientation' && (
          <div className="w-full max-w-2xl border-2 border-black bg-white p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-black pb-3">
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                  FIRST-TIME ORIENTATION · STEP {currentTour.step} OF {currentTour.total}
                </div>
                <h2 className="text-2xl font-extrabold text-black mt-1">
                  {currentTour.title}
                </h2>
              </div>
              <span className="px-2.5 py-1 border border-black font-mono text-xs font-bold">
                {currentTour.step} / {currentTour.total}
              </span>
            </div>

            <p className="text-sm sm:text-base text-zinc-800 leading-relaxed">
              {currentTour.description}
            </p>

            <div className="border border-black bg-zinc-50 p-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] font-bold uppercase text-zinc-600">
                  WORKSPACE FOCUS AREA
                </div>
                <div className="font-bold text-sm text-black mt-0.5">{currentTour.highlight}</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-black" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/20">
              <Button
                variant="secondary"
                onClick={() => (tourIndex > 0 ? setTourIndex((i) => i - 1) : onClose())}
              >
                {tourIndex > 0 ? 'Previous' : 'Skip Tour'}
              </Button>

              <div className="flex items-center gap-2">
                {tourIndex < TOUR_STEPS.length - 1 ? (
                  <Button
                    variant="primary"
                    icon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setTourIndex((i) => i + 1)}
                  >
                    Next ({tourIndex + 2} of {TOUR_STEPS.length})
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (onNavigateTarget) onNavigateTarget('desktop');
                      onClose();
                    }}
                  >
                    Enter MANDELA OS
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-10 border-t border-black px-6 flex items-center justify-between text-xs text-zinc-600 shrink-0">
        <span>MANDELA OS · Demo planning workspace</span>
        <span className="font-mono font-bold text-black">
          {step === 'signin'
            ? '01 / SIGN IN'
            : step === 'org_setup'
            ? '02 / ORGANIZATION SETUP'
            : step === 'choose_experience'
            ? '03 / CHOOSE EXPERIENCE'
            : 'WF-04 / ORIENTATION TOUR'}
        </span>
      </footer>
    </div>
  );
};
