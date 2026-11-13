import React, { useState } from 'react';
import {
  Satellite,
  Radio,
  Building2,
  Rocket,
  Shield,
  Zap,
  Globe2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Server,
  Lock,
  Code,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';
import { TenantAccount, SubscriptionTier } from '../../types/multiTenant';
import { SUBSCRIPTION_TIERS } from '../../data/mockMultiTenantData';
import {
  ModalShell,
  Badge,
  Button,
  Card,
  CodeBlock,
  StatusDot
} from '../../design-system';

export type OnboardingArchetype = 'satellite' | 'telco' | 'startup' | 'enterprise';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (newTenant: TenantAccount) => void;
  initialArchetype?: OnboardingArchetype;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
  initialArchetype = 'satellite',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [archetype, setArchetype] = useState<OnboardingArchetype>(initialArchetype);

  // Form Fields
  const [companyName, setCompanyName] = useState('AST SpaceMobile Africa Interconnect');
  const [primaryCountry, setPrimaryCountry] = useState('Kenya & Pan-African LEO');
  const [countryCode, setCountryCode] = useState('KE');
  const [adminEmail, setAdminEmail] = useState('noc@spacesat-carrier.africa');
  const [domain, setDomain] = useState('spacesat-carrier.africa');

  // Technical Specs
  const [selectedPoPs, setSelectedPoPs] = useState<string[]>(['nairobi', 'johannesburg', 'lagos']);
  const [requestedCps, setRequestedCps] = useState<number>(5000);
  const [dataIsolation, setDataIsolation] = useState<'dedicated_keyspace' | 'logical_schema'>('dedicated_keyspace');

  // Archetype Specifics
  const [satelliteFrequencyBand, setSatelliteFrequencyBand] = useState('S-Band 3GPP Rel-17');
  const [teleportGroundStation, setTeleportGroundStation] = useState('Mwembeshi Earth Station (Zambia)');
  const [telcoPointCode, setTelcoPointCode] = useState('6-024-1 (Safaricom Nairobi)');
  const [startupLanguage, setStartupLanguage] = useState<'nodejs' | 'python' | 'curl'>('nodejs');

  // Stress Test Simulation State
  const [testRunning, setTestRunning] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<{
    latencyMs: number;
    jitterMs: number;
    packetLossPct: number;
    throughputCps: number;
    status: 'passed' | 'failed' | null;
  } | null>(null);

  const archetypeConfig = {
    satellite: {
      name: 'Satellite Carrier / NTN',
      icon: <Satellite className="w-5 h-5 text-sky-400" />,
      badge: 'LEO / GEO Constellation',
      tier: 'satellite_operator' as SubscriptionTier,
      defaultName: 'Eutelsat OneWeb LEO African Edge',
      description: 'Connect direct-to-cell LEO constellation to African mobile networks over 3GPP Rel-17 with Doppler shift compensation.',
    },
    telco: {
      name: 'Telecom MNO / MVNO',
      icon: <Radio className="w-5 h-5 text-amber-400" />,
      badge: 'Carrier Wholesale Interconnect',
      tier: 'sovereign_telco' as SubscriptionTier,
      defaultName: 'Airtel Africa Wholesale Gateway',
      description: 'Sovereign Kamailio SBC core, BGP AS37105 IXP peering, bilateral rate deck LCRq engine, and SMPP v5 binds.',
    },
    startup: {
      name: 'High-Growth Startup',
      icon: <Rocket className="w-5 h-5 text-violet-400" />,
      badge: 'Developer Sandbox & Scale',
      tier: 'growth_business' as SubscriptionTier,
      defaultName: 'KudiPay Cross-Border Remittance',
      description: 'Instant API sandbox, virtual test MSISDNs, transactional OTPs with automated USSD fallback, and instant top-up wallet.',
    },
    enterprise: {
      name: 'Pan-African Enterprise',
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
      badge: 'Bank / Multi-country Scale',
      tier: 'fintech_enterprise' as SubscriptionTier,
      defaultName: 'Standard Bank Pan-Africa Contact Center',
      description: 'Dedicated HSM Sovereign Vault, 10,000 concurrent voice channels, multi-country DID allocation, and 24/7 dedicated NOC hotline.',
    },
  };

  const handleSelectArchetype = (type: OnboardingArchetype) => {
    setArchetype(type);
    setCompanyName(archetypeConfig[type].defaultName);
    if (type === 'satellite') {
      setRequestedCps(10000);
      setDataIsolation('dedicated_keyspace');
    } else if (type === 'telco') {
      setRequestedCps(10000);
      setDataIsolation('dedicated_keyspace');
    } else if (type === 'startup') {
      setRequestedCps(250);
      setDataIsolation('logical_schema');
    } else {
      setRequestedCps(1500);
      setDataIsolation('dedicated_keyspace');
    }
  };

  const runPreFlightStressTest = () => {
    setTestRunning(true);
    setTestProgress(10);
    setTestResults(null);

    const interval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTestRunning(false);
          setTestResults({
            latencyMs: archetype === 'satellite' ? 34 : 18,
            jitterMs: archetype === 'satellite' ? 4.2 : 1.1,
            packetLossPct: 0.0,
            throughputCps: requestedCps,
            status: 'passed',
          });
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleFinishOnboarding = () => {
    const selectedTier = archetypeConfig[archetype].tier;
    const plan = SUBSCRIPTION_TIERS[selectedTier];

    const newTenant: TenantAccount = {
      id: `tenant-${Date.now().toString(36)}`,
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24),
      country: primaryCountry,
      countryCode: countryCode,
      region: selectedPoPs.map(p => p.toUpperCase()).join(' · ') + ' ANYCAST',
      industry: archetypeConfig[archetype].name,
      domain: domain,
      logoInitial: companyName.charAt(0).toUpperCase(),
      accentColor:
        archetype === 'satellite'
          ? 'text-sky-400 bg-sky-950/40 border-sky-800'
          : archetype === 'telco'
          ? 'text-amber-400 bg-amber-950/40 border-amber-800'
          : archetype === 'startup'
          ? 'text-violet-400 bg-violet-950/40 border-violet-800'
          : 'text-emerald-400 bg-emerald-950/40 border-emerald-800',
      subscription: plan,
      status: 'active',
      dataIsolationMode: dataIsolation,
      encryptionKeyAlias: `kms/sovereign-vault/${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      apiKey: `mandela_live_${archetype.slice(0, 3)}_${Math.random().toString(36).substring(2, 12)}`,
      registeredAdminEmail: adminEmail,
      createdAt: new Date().toISOString().split('T')[0],
      usage: {
        smsDeliveredThisMonth: 0,
        voiceMinutesThisMonth: 0,
        activeDids: plan.limits.didsIncluded,
        dataverseRecordsTotal: 0,
        dataverseStorageMb: 0,
        currentMonthSpendUsd: plan.monthlyFeeUsd,
        accountBalanceUsd: 15000.0,
      },
    };

    onCompleteOnboarding(newTenant);
    onClose();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Sovereign Telecom Onboarding & Provisioning Wizard"
      subtitle="Carrier-grade onboarding for Satellites, Telcos, Startups, and Enterprise at Pan-African scale."
      icon={<Sparkles className="w-5 h-5 text-amber-400" />}
      maxWidth="4xl"
    >
      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-black/15 pb-4 mb-6">
        {[
          { step: 1, label: '1. Select Persona' },
          { step: 2, label: '2. Organization & Region' },
          { step: 3, label: '3. Technical Topology' },
          { step: 4, label: '4. Sovereign Security' },
          { step: 5, label: '5. Pre-flight Stress Test' },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => s.step < currentStep && setCurrentStep(s.step)}
            className={`flex items-center gap-1.5 text-xs font-sans font-medium transition-colors cursor-pointer ${
              currentStep === s.step
                ? 'text-black font-bold'
                : currentStep > s.step
                ? 'text-black/80'
                : 'text-black/40'
            }`}
          >
            {currentStep > s.step ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            ) : (
              <span
                className={`w-4 h-4 rounded-[2px] flex items-center justify-center text-[10px] font-mono ${
                  currentStep === s.step
                    ? 'bg-black text-white font-bold'
                    : 'bg-zinc-100 text-black/60 border border-black/15'
                }`}
              >
                {s.step}
              </span>
            )}
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ================= STEP 1: SELECT PERSONA ================= */}
      {currentStep === 1 && (
        <div className="space-y-4 font-sans">
          <div>
            <h4 className="text-base font-bold text-black">
              Select Your Organization Profile
            </h4>
            <p className="text-xs sm:text-sm text-black/60 mt-1">
              Mandela provides purpose-built architectural stacks for every tier of the telecommunications ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['satellite', 'telco', 'startup', 'enterprise'] as OnboardingArchetype[]).map((type) => {
              const cfg = archetypeConfig[type];
              const isSelected = archetype === type;
              return (
                <div
                  key={type}
                  onClick={() => handleSelectArchetype(type)}
                  className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-black bg-zinc-50 shadow-sm'
                      : 'border-black/15 bg-white hover:border-black/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-[2px] bg-zinc-100 border border-black/10 text-black">
                        {cfg.icon}
                      </div>
                      <div>
                        <h5 className="font-bold text-black text-sm">{cfg.name}</h5>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-black/60 font-semibold">
                          {cfg.badge}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-[13px] text-black/70 mt-3 leading-relaxed">
                    {cfg.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={() => setCurrentStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Organization Details
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: ORGANIZATION & REGION ================= */}
      {currentStep === 2 && (
        <div className="space-y-4 font-sans">
          <div>
            <h4 className="text-base font-bold text-black">
              Organization & Pan-African Presence
            </h4>
            <p className="text-xs sm:text-sm text-black/60 mt-1">
              Configure your sovereign operational details, administrative contacts, and target regions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black mb-1">
                Company / Organization Legal Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-[2px] bg-white border border-black/20 text-black text-xs sm:text-[13px] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1">
                Corporate Domain / ASN
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-[2px] bg-white border border-black/20 text-black text-xs sm:text-[13px] focus:outline-none focus:border-black font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1">
                Primary Operating African Country
              </label>
              <input
                type="text"
                value={primaryCountry}
                onChange={(e) => setPrimaryCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-[2px] bg-white border border-black/20 text-black text-xs sm:text-[13px] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1">
                24/7 NOC / Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-[2px] bg-white border border-black/20 text-black text-xs sm:text-[13px] focus:outline-none focus:border-black font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-black mb-1.5">
              Select Anycast Edge PoPs for Deployment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'nairobi', name: 'Nairobi Hub (KIXP AS37105)' },
                { id: 'johannesburg', name: 'Joburg Core (NAPAfrica)' },
                { id: 'lagos', name: 'Lagos Pod (IXPN Gateway)' },
                { id: 'accra', name: 'Accra Edge (GIX)' },
                { id: 'cairo', name: 'Cairo Trans-Sahara' },
                { id: 'kigali', name: 'Kigali Central Node' },
              ].map((pop) => (
                <label
                  key={pop.id}
                  className={`p-2.5 rounded-[2px] border flex items-center gap-2 cursor-pointer transition-colors ${
                    selectedPoPs.includes(pop.id)
                      ? 'border-black bg-zinc-50 text-black font-medium'
                      : 'border-black/15 bg-white text-black/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPoPs.includes(pop.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPoPs([...selectedPoPs, pop.id]);
                      } else {
                        setSelectedPoPs(selectedPoPs.filter((p) => p !== pop.id));
                      }
                    }}
                    className="accent-black rounded"
                  />
                  <span>{pop.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep(3)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Technical Topology
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: TECHNICAL TOPOLOGY ================= */}
      {currentStep === 3 && (
        <div className="space-y-4 font-sans">
          <div>
            <h4 className="text-base font-bold text-black">
              Protocol Configuration & Capacity Allocations
            </h4>
            <p className="text-xs sm:text-sm text-black/60 mt-1">
              Fine-tune the routing protocols, capacity limits, and edge gateway bindings for your architecture.
            </p>
          </div>

          {archetype === 'satellite' && (
            <div className="space-y-3 p-4 rounded-[2px] bg-zinc-50 border border-black/15">
              <div className="flex items-center gap-2 text-black font-semibold text-xs">
                <Satellite className="w-4 h-4 text-black" />
                Satellite & Non-Terrestrial Network (NTN) Specifications
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-black/70 mb-1">
                    Frequency & 3GPP Standard
                  </label>
                  <select
                    value={satelliteFrequencyBand}
                    onChange={(e) => setSatelliteFrequencyBand(e.target.value)}
                    className="w-full px-3 py-2 rounded-[2px] bg-white border border-black/20 text-black text-xs focus:outline-none"
                  >
                    <option value="S-Band 3GPP Rel-17">S-Band 3GPP Rel-17 (Direct-to-Device)</option>
                    <option value="Ka-Band High-Throughput">Ka-Band High-Throughput (LEO Feeder)</option>
                    <option value="Ku-Band Maritime">Ku-Band Maritime / Mining VSAT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-black/70 mb-1">
                    African Earth Station Interconnect
                  </label>
                  <select
                    value={teleportGroundStation}
                    onChange={(e) => setTeleportGroundStation(e.target.value)}
                    className="w-full px-3 py-2 rounded-[2px] bg-white border border-black/20 text-black text-xs focus:outline-none"
                  >
                    <option value="Mwembeshi Earth Station (Zambia)">Mwembeshi Earth Station (Zambia)</option>
                    <option value="Longonot Earth Station (Kenya)">Longonot Earth Station (Kenya)</option>
                    <option value="Hartebeesthoek Teleport (South Africa)">Hartebeesthoek Teleport (South Africa)</option>
                    <option value="Dakar Atlantic Gateway (Senegal)">Dakar Atlantic Gateway (Senegal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {archetype === 'telco' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-amber-800/40">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Radio className="w-4 h-4" />
                Carrier Interconnect & SS7 Point Code Allocation
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Primary ITU-T Point Code (DPC)
                  </label>
                  <input
                    type="text"
                    value={telcoPointCode}
                    onChange={(e) => setTelcoPointCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    CDR Mediation Pipeline
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono">
                    Apache Kafka (&lt; 5s latency) · Real-time LCRq
                  </div>
                </div>
              </div>
            </div>
          )}

          {archetype === 'startup' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-violet-800/40">
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs">
                <Code className="w-4 h-4" />
                Developer Sandbox SDK Preference
              </div>
              <div className="flex gap-2">
                {(['nodejs', 'python', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setStartupLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase ${
                      startupLanguage === lang
                        ? 'bg-violet-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Peak Target Call Throughput (CPS):</span>
              <span className="font-mono text-amber-400 font-bold">{requestedCps.toLocaleString()} CPS</span>
            </div>
            <input
              type="range"
              min={100}
              max={15000}
              step={100}
              value={requestedCps}
              onChange={(e) => setRequestedCps(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>100 CPS (Startup)</span>
              <span>5,000 CPS (Enterprise)</span>
              <span>15,000 CPS (Telco/Satellite)</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(2)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep(4)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Sovereign Security
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: SOVEREIGN SECURITY ================= */}
      {currentStep === 4 && (
        <div className="space-y-4 font-sans">
          <div>
            <h4 className="text-base font-bold text-black">
              Sovereign Data Residency & Cryptographic Vault
            </h4>
            <p className="text-xs sm:text-sm text-black/60 mt-1">
              Select your data isolation tier and regulatory compliance keyspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setDataIsolation('dedicated_keyspace')}
              className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                dataIsolation === 'dedicated_keyspace'
                  ? 'border-black bg-zinc-50 shadow-sm'
                  : 'border-black/15 bg-white hover:border-black/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black text-sm">
                  Dedicated Hardware HSM Keyspace
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-black text-white text-[10px] font-mono font-medium">
                  Carrier Grade
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-black/70 leading-relaxed">
                Cryptographic hardware isolation. Tenant keys stored in sovereign African data center HSMs. Meets strict central bank & telco regulatory requirements.
              </p>
            </div>

            <div
              onClick={() => setDataIsolation('logical_schema')}
              className={`p-4 rounded-[2px] border cursor-pointer transition-all ${
                dataIsolation === 'logical_schema'
                  ? 'border-black bg-zinc-50 shadow-sm'
                  : 'border-black/15 bg-white hover:border-black/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black text-sm">
                  Logical Schema Multi-Tenancy
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-zinc-100 text-black border border-black/15 text-[10px] font-mono font-medium">
                  Cost Efficient
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-black/70 leading-relaxed">
                Software row-level security and tenant-scoped AES-256-GCM encryption. Optimized for high-velocity startups and lightweight applications.
              </p>
            </div>
          </div>

          {/* Generated Code Sample */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-black mb-2">
              Generated Interconnect Configuration:
            </div>
            <CodeBlock
              fileName={
                archetype === 'startup'
                  ? 'mandela-client.js'
                  : archetype === 'satellite'
                  ? 'ntn-kamailio-gateway.cfg'
                  : 'freeswitch-carrier-gateway.xml'
              }
              language={archetype === 'startup' ? 'javascript' : 'xml'}
              code={
                archetype === 'startup'
                  ? `import { MandelaClient } from '@mandela/sdk';

const client = new MandelaClient({
  apiKey: 'mandela_live_sand_${domain.slice(0, 6)}',
  region: 'africa-east',
  enableUssdFallback: true // Automatic fallback if SMS delivery fails
});

// Send transactional OTP with 98% guarantee
const resp = await client.messages.dispatch({
  to: '+254712000000',
  body: 'Your KudiPay verification code is 492019. Valid 5 mins.'
});`
                  : `<include>
  <gateway name="mandela-${archetype}-trunk">
    <param name="realm" value="sip.mandela.africa"/>
    <param name="username" value="${domain}"/>
    <param name="password" value="[VAULT-SECURED-SECRET]"/>
    <param name="register" value="true"/>
    <param name="channels" value="${requestedCps * 2}"/>
    <param name="sip-trace" value="yes"/>
    <param name="rtp-ip" value="anycast.mandela.africa"/>
  </gateway>
</include>`
              }
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(3)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep(5)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Pre-flight Stress Test
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 5: PRE-FLIGHT STRESS TEST ================= */}
      {currentStep === 5 && (
        <div className="space-y-4 font-sans">
          <div>
            <h4 className="text-base font-bold text-black">
              Live Pre-Flight Interconnect Stress Test
            </h4>
            <p className="text-xs sm:text-sm text-black/60 mt-1">
              Verify real-time signaling latency, media jitter buffers, and SLA parameters against Mandela’s Anycast network before activation.
            </p>
          </div>

          <div className="p-5 bg-white border border-black/15 rounded-[2px] space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-black" />
                <span className="font-bold text-black text-sm">
                  Simulated Carrier Loopback Diagnostics
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                loading={testRunning}
                onClick={runPreFlightStressTest}
              >
                {testRunning ? 'Running Synthetic Stress Burst...' : 'Run Diagnostics'}
              </Button>
            </div>

            {testRunning && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-black/60 font-mono">
                  <span>Testing Kamailio SIP OPTIONS & RTPEngine Echo...</span>
                  <span>{testProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-[2px] bg-zinc-100 overflow-hidden border border-black/10">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${testProgress}%` }}
                  />
                </div>
              </div>
            )}

            {testResults && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-zinc-50 p-4 rounded-[2px] border border-black/15">
                <div>
                  <span className="text-black/50 block text-[10px] uppercase font-mono">Round-Trip Latency:</span>
                  <span className="text-black font-bold text-sm">
                    {testResults.latencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-black/50 block text-[10px] uppercase font-mono">RTP Jitter:</span>
                  <span className="text-black font-bold text-sm">
                    {testResults.jitterMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-black/50 block text-[10px] uppercase font-mono">Packet Loss:</span>
                  <span className="text-black font-bold text-sm">
                    {testResults.packetLossPct}%
                  </span>
                </div>
                <div>
                  <span className="text-black/50 block text-[10px] uppercase font-mono">Edge Status:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] bg-black text-white text-[10px] font-mono font-medium">
                    PASSED SLA
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 rounded-[2px] bg-zinc-50 border border-black/15 text-xs text-black/80 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
              <span>
                All 6 African PoPs are reachable. Zero foreign dependency detected. Ready for immediate production provisioning!
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(4)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleFinishOnboarding}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Complete Onboarding & Launch Workspace
            </Button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};
