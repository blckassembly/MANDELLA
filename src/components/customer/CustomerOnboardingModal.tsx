import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  Lock,
  Wallet,
  Zap,
  X,
  PhoneCall,
  Check
} from 'lucide-react';
import { TenantAccount } from '../../types/multiTenant';

interface CustomerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (updatedTenant: TenantAccount) => void;
  currentTenant: TenantAccount;
}

export const CustomerOnboardingModal: React.FC<CustomerOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  currentTenant
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Organization Details
  const [orgName, setOrgName] = useState(currentTenant.name);
  const [selectedCountry, setSelectedCountry] = useState('KE');
  const [economicUseCase, setEconomicUseCase] = useState<'fintech_remittance' | 'call_center' | 'telecom_operator' | 'sme_commerce'>('fintech_remittance');

  // Step 2: KYC Attestation & Tier
  const [kycTier, setKycTier] = useState<1 | 2 | 3>(2);
  const [nationalIdDoc, setNationalIdDoc] = useState('KE-ID-94810294.pdf');
  const [taxCertificate, setTaxCertificate] = useState('KRA-PIN-P051928491Z.pdf');
  const [telecomLicense, setTelecomLicense] = useState('CA-ASP-LIC-2026-081.pdf');
  const [kycAttested, setKycAttested] = useState(true);

  // Step 3: Sovereign Wallet Top-Up
  const [currency, setCurrency] = useState<'USD' | 'KES' | 'NGN' | 'ZAR'>('USD');
  const [topUpAmount, setTopUpAmount] = useState<number>(250);
  const [paymentRail, setPaymentRail] = useState<'mpesa' | 'flutterwave' | 'card' | 'wire'>('mpesa');
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);

  if (!isOpen) return null;

  const handleFinishOnboarding = () => {
    setIsProcessingTopUp(true);
    setTimeout(() => {
      setIsProcessingTopUp(false);
      const updated: TenantAccount = {
        ...currentTenant,
        name: orgName,
        country: selectedCountry === 'KE' ? 'Kenya' : selectedCountry === 'NG' ? 'Nigeria' : selectedCountry === 'ZA' ? 'South Africa' : 'Ghana',
        countryCode: selectedCountry,
        usage: {
          ...currentTenant.usage,
          accountBalanceUsd: currentTenant.usage.accountBalanceUsd + topUpAmount
        }
      };
      onComplete(updated);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150 font-sans">
      <div
        className="w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-750 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Pan-African Number Provisioning Setup
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  STEP {step} OF 4
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Guided multi-tenant onboarding with sovereign KYC tier and prepaid wallet provisioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full h-1 bg-zinc-900">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 shadow-sm shadow-emerald-500/50"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* STEP 1: ORGANIZATION & REGIONAL PROFILE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-bold text-sm text-white">1. Organization &amp; Operating Nation</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Configure your primary operating jurisdiction across 54 African countries.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                    placeholder="e.g. Stanbic Sovereign Pay PLC"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                      Primary African Nation
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                    >
                      <option value="KE">🇰🇪 Kenya (+254 · CA Kenya)</option>
                      <option value="NG">🇳🇬 Nigeria (+234 · NCC)</option>
                      <option value="ZA">🇿🇦 South Africa (+27 · ICASA)</option>
                      <option value="GH">🇬🇭 Ghana (+233 · NCA)</option>
                      <option value="EG">🇪🇬 Egypt (+20 · NTRA)</option>
                      <option value="RW">🇷🇼 Rwanda (+250 · RURA)</option>
                      <option value="TZ">🇹🇿 Tanzania (+255 · TCRA)</option>
                      <option value="UG">🇺🇬 Uganda (+256 · UCC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                      Primary Use Case
                    </label>
                    <select
                      value={economicUseCase}
                      onChange={(e) => setEconomicUseCase(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                    >
                      <option value="fintech_remittance">Fintech &amp; Remittance 2FA</option>
                      <option value="call_center">Customer Care / Contact Center</option>
                      <option value="telecom_operator">Licensed Telco MVNO Ingress</option>
                      <option value="sme_commerce">Enterprise SME Notifications</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Multi-Tenant Invariant: Zero Cross-Tenant Leakage</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Your organization will be assigned a cryptographically isolated tenant schema with its own E.164 allocation quota, audit trails, and dedicated Redis reservation locks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REGULATORY KYC COMPLIANCE TIER */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-bold text-sm text-white">2. Regulatory KYC Verification Tier</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  ITU and African sovereign telecom regulators require document verification prior to live number activation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    tier: 1,
                    title: 'Tier 1: Consumer',
                    desc: 'National ID & Proof of Address. Unlocks Mobile & Toll-Free DIDs.',
                    docs: 'National ID'
                  },
                  {
                    tier: 2,
                    title: 'Tier 2: Enterprise',
                    desc: 'Certificate of Incorporation & Tax PIN. Unlocks Geographic & Mobile lines.',
                    docs: 'Company Reg + Tax'
                  },
                  {
                    tier: 3,
                    title: 'Tier 3: Carrier',
                    desc: 'National Telecommunications Operator License. Unlocks direct SIP trunking.',
                    docs: 'Regulator License'
                  }
                ].map((t) => (
                  <div
                    key={t.tier}
                    onClick={() => setKycTier(t.tier as any)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      kycTier === t.tier
                        ? 'bg-zinc-800 border-emerald-400 shadow-md ring-1 ring-emerald-400/30'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{t.title}</span>
                      {kycTier === t.tier && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{t.desc}</p>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-emerald-400 border border-zinc-800">
                      Req: {t.docs}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2 font-mono text-xs">
                <span className="font-bold text-white uppercase text-[11px]">Submitted Attestation Documents</span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-300 truncate">📄 {nationalIdDoc}</span>
                    <span className="text-emerald-400 font-bold text-[10px]">VERIFIED (SHA-256)</span>
                  </div>
                  {kycTier >= 2 && (
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-300 truncate">📄 {taxCertificate}</span>
                      <span className="text-emerald-400 font-bold text-[10px]">VERIFIED (SHA-256)</span>
                    </div>
                  )}
                  {kycTier === 3 && (
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-300 truncate">📄 {telecomLicense}</span>
                      <span className="text-emerald-400 font-bold text-[10px]">VERIFIED (SHA-256)</span>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={kycAttested}
                  onChange={(e) => setKycAttested(e.target.checked)}
                  className="rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-zinc-300">
                  I attest that these documents comply with sovereign ITU E.164 and National Regulatory Authority mandates.
                </span>
              </label>
            </div>
          )}

          {/* STEP 3: PREPAID WALLET TOP-UP */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-bold text-sm text-white">3. Sovereign Prepaid Wallet Provisioning</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Fund your multi-currency wallet to activate 15-minute reservation locks and monthly DID rentals.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { cur: 'USD', symbol: '$', rate: '1.00 USD' },
                  { cur: 'KES', symbol: 'KES', rate: '130.00 KES' },
                  { cur: 'NGN', symbol: '₦', rate: '1,600.00 NGN' },
                  { cur: 'ZAR', symbol: 'R', rate: '18.50 ZAR' }
                ].map((c) => (
                  <button
                    key={c.cur}
                    onClick={() => setCurrency(c.cur as any)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      currency === c.cur
                        ? 'bg-zinc-800 border-emerald-400 text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs">{c.cur} ({c.symbol})</div>
                    <div className="text-[10px] text-zinc-500 font-mono">1 USD = {c.rate}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  Deposit Amount ({currency})
                </label>
                <div className="flex items-center gap-2">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-all ${
                        topUpAmount === amt
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-32 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs font-mono text-white text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                  Payment Rails &amp; Gateways
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'mpesa', label: 'M-PESA Direct', tag: 'Instant' },
                    { id: 'flutterwave', label: 'Flutterwave / NGN', tag: 'Africa Core' },
                    { id: 'card', label: 'Corporate Card', tag: 'Visa / MC' },
                    { id: 'wire', label: 'Bank Wire (RTGS)', tag: 'Enterprise' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPaymentRail(p.id as any)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        paymentRail === p.id
                          ? 'bg-zinc-800 border-emerald-400 text-white font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{p.label}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{p.tag}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION & ACTIVATION */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-white">Tenancy Ready for Activation</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Your tenant profile is validated, KYC attestation is confirmed, and your prepaid wallet will be credited upon launch.
                </p>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">ORGANIZATION:</span>
                  <span className="font-bold text-white">{orgName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">JURISDICTION:</span>
                  <span className="font-bold text-emerald-400">{selectedCountry} (54 ITU Registry)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">REGULATORY TIER:</span>
                  <span className="font-bold text-white">Tier {kycTier} Attested</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">WALLET CREDIT:</span>
                  <span className="font-bold text-emerald-400">+{topUpAmount} {currency}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-xs font-medium text-zinc-300 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1) as any)}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={isProcessingTopUp}
              onClick={handleFinishOnboarding}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {isProcessingTopUp ? (
                <span>Provisioning Tenancy...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Activate &amp; Launch Inventory</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
