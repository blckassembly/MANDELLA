import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react';
import { PortalMode } from '../../types/multiTenant';

interface CalculatorPreset {
  name: string;
  sms: number;
  voiceMinutes: number;
  countries: number;
}

const PRESETS: CalculatorPreset[] = [
  { name: 'Fintech Startup', sms: 500000, voiceMinutes: 50000, countries: 3 },
  { name: 'Pan-African Bank', sms: 8000000, voiceMinutes: 1200000, countries: 16 },
  { name: 'Multinational MNO/MVNO', sms: 35000000, voiceMinutes: 6500000, countries: 34 }
];

export const RoiCalculatorSection: React.FC<{
  onLaunchConsole: (mode?: PortalMode) => void;
}> = ({ onLaunchConsole }) => {
  const [smsVolume, setSmsVolume] = useState<number>(3500000);
  const [voiceMinutes, setVoiceMinutes] = useState<number>(450000);
  const [countriesCount, setCountriesCount] = useState<number>(8);

  // Pricing Model
  // Legacy aggregator rates in Africa: ~$0.048/SMS, ~$0.082/min
  // Mandela Direct Telco rates: ~$0.014/SMS, ~$0.026/min
  const legacySmsRate = 0.048;
  const legacyVoiceRate = 0.082;
  const mandelaSmsRate = 0.014;
  const mandelaVoiceRate = 0.026;

  const legacyMonthlyCost = (smsVolume * legacySmsRate) + (voiceMinutes * legacyVoiceRate);
  const mandelaMonthlyCost = (smsVolume * mandelaSmsRate) + (voiceMinutes * mandelaVoiceRate);

  const monthlySavings = legacyMonthlyCost - mandelaMonthlyCost;
  const annualSavings = monthlySavings * 12;
  const savingsPercent = Math.round((monthlySavings / legacyMonthlyCost) * 100);

  // Latency improvement calculation
  // Legacy OTP hops average 14.2s across Africa; Mandela direct average 3.4s
  const legacyLatency = 14.2;
  const mandelaLatency = 3.4;
  const latencyImprovement = Math.round(((legacyLatency - mandelaLatency) / legacyLatency) * 100);

  const applyPreset = (preset: CalculatorPreset) => {
    setSmsVolume(preset.sms);
    setVoiceMinutes(preset.voiceMinutes);
    setCountriesCount(preset.countries);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <section id="roi-calculator" className="py-20 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>ENTERPRISE TCO & ROI MODEL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Calculate Direct-Carrier Savings vs Global Aggregators.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300">
            See how much your enterprise saves by connecting directly to sovereign telecom switches instead of paying multi-tier aggregator markups.
          </p>

          {/* Quick Presets */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="text-slate-400 mr-2">QUICK SCENARIOS:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Main Body */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Sliders (6 cols) */}
          <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8">
            {/* Slider 1: SMS Volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider">
                  Monthly SMS / OTP Volume
                </label>
                <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                  {formatNumber(smsVolume)} msgs/mo
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="30000000"
                step="100000"
                value={smsVolume}
                onChange={(e) => setSmsVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>100K</span>
                <span>15M</span>
                <span>30M+</span>
              </div>
            </div>

            {/* Slider 2: Voice Minutes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider">
                  Monthly Voice Traffic (Minutes)
                </label>
                <span className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
                  {formatNumber(voiceMinutes)} mins/mo
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="25000"
                value={voiceMinutes}
                onChange={(e) => setVoiceMinutes(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>10K</span>
                <span>2.5M</span>
                <span>5M+</span>
              </div>
            </div>

            {/* Slider 3: Sovereign Countries */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider">
                  Active African Sovereign Markets
                </label>
                <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                  {countriesCount} Countries
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="54"
                step="1"
                value={countriesCount}
                onChange={(e) => setCountriesCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>1 Nation</span>
                <span>27 Nations</span>
                <span>All 54 Sovereign States</span>
              </div>
            </div>

            {/* Guarantee Checkmark Strip */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Tier-1 SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>99.999% Core Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>In-country data residency</span>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Savings Display (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Top Stat Badge */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                  ESTIMATED ENTERPRISE ARBITRAGE
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  +{savingsPercent}% RETAINED
                </span>
              </div>

              {/* Big Financial Highlight */}
              <div className="mt-8">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Projected Annual Cost Reduction
                </div>
                <div className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tight mt-1 tabular-nums">
                  {formatCurrency(annualSavings)}
                  <span className="text-sm font-normal text-slate-400"> /year</span>
                </div>
                <div className="text-sm font-mono text-emerald-400 mt-1 tabular-nums font-semibold">
                  {formatCurrency(monthlySavings)} saved per month
                </div>
              </div>

              {/* Cost Comparison Breakdown */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-y border-slate-800 py-4">
                <div>
                  <div className="text-xs font-mono text-slate-400">AGGREGATOR ESTIMATE</div>
                  <div className="text-lg font-bold font-mono text-rose-400 mt-1 tabular-nums">
                    {formatCurrency(legacyMonthlyCost)}/mo
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">High markup & foreign tax</div>
                </div>

                <div className="border-l border-slate-800 pl-4">
                  <div className="text-xs font-mono text-emerald-400">MANDELA DIRECT</div>
                  <div className="text-lg font-bold font-mono text-emerald-300 mt-1 tabular-nums">
                    {formatCurrency(mandelaMonthlyCost)}/mo
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Direct sovereign tariff</div>
                </div>
              </div>

              {/* Delivery Latency Improvement Stat */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      OTP Delivery Latency Improvement
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      From {legacyLatency}s down to {mandelaLatency}s
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-emerald-400 text-lg tabular-nums">
                  -{latencyImprovement}%
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-4">
              <button
                onClick={() => onLaunchConsole('enterprise_suite')}
                className="w-full py-4 px-6 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
              >
                <span>Provision Bilateral Trunk in Console</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
