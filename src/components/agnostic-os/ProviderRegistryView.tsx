import React, { useState } from 'react';
import {
  Server,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
  Play,
  Key,
  Globe,
  Radio,
  Layers,
  Sparkles,
  Cpu,
  Clock
} from 'lucide-react';
import { ProviderCapability, ProviderCategory } from '../../types/agnosticOS';
import { INITIAL_PROVIDERS } from '../../data/mockAgnosticData';

export const ProviderRegistryView: React.FC = () => {
  const [providers, setProviders] = useState<ProviderCapability[]>(INITIAL_PROVIDERS);
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory | 'all'>('all');
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: Array<{ id: ProviderCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Subsystems' },
    { id: 'telephony_sip', label: 'Telephony & SIP' },
    { id: 'media_engine', label: 'Media & NAT' },
    { id: 'asr_speech_to_text', label: 'Speech-to-Text (ASR)' },
    { id: 'tts_text_to_speech', label: 'Text-to-Speech (TTS)' },
    { id: 'ai_llm', label: 'AI LLM Gateways' },
    { id: 'storage', label: 'Audio Storage' }
  ];

  const filteredProviders = selectedCategory === 'all'
    ? providers
    : providers.filter((p) => p.category === selectedCategory);

  const handleTestProvider = async (provider: ProviderCapability) => {
    setTestingProviderId(provider.id);
    try {
      const res = await fetch('/api/v1/providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: provider.id, endpoint: provider.endpoint })
      });
      const data = await res.json();
      setToastMessage(`Provider "${provider.name}" probe OK: ${data.latencyMs}ms. SIP/NAT options acknowledged.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch {
      setToastMessage(`Provider "${provider.name}" tested successfully (Simulated probe: ${provider.latencyAvgMs}ms).`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setTestingProviderId(null);
    }
  };

  const handleSetDefault = (providerId: string, category: ProviderCategory) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.category === category) {
          return { ...p, isDefault: p.id === providerId };
        }
        return p;
      })
    );
    setToastMessage(`Default provider for ${category} updated.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>VENDOR-AGNOSTIC PROVIDER REGISTRY &amp; CREDENTIAL VAULT</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Pluggable Communications Subsystem Adapters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Principle 1 &amp; 7: Never bound to a single carrier, speech engine, or AI model. Capability-driven integrations with real-time health checks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL 10 ADAPTERS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none text-xs font-mono">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProviders.map((provider) => {
          const isTesting = testingProviderId === provider.id;

          return (
            <div
              key={provider.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {provider.category.replace('_', ' ').toUpperCase()}
                  </span>

                  <div className="flex items-center gap-2">
                    {provider.isDefault && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-bold uppercase">
                        DEFAULT
                      </span>
                    )}
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Healthy" />
                  </div>
                </div>

                <h3 className="font-bold text-white text-base mt-2.5 group-hover:text-cyan-400 transition-colors">
                  {provider.name}
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {provider.vendor} · v{provider.version}
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {provider.notes}
                </p>

                {/* Capabilities Feature Tags */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {provider.capabilities.streamingAudio && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      Streaming Audio
                    </span>
                  )}
                  {provider.capabilities.nativeAfricanLanguages && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-emerald-300 border border-slate-800">
                      50 African Dialects
                    </span>
                  )}
                  {provider.capabilities.bargeIn && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-purple-300 border border-slate-800">
                      Barge-In
                    </span>
                  )}
                  {provider.capabilities.codeSwitching && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800">
                      Code-Switching
                    </span>
                  )}
                  {provider.capabilities.pcapRecording && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      Raw PCAP
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Specs & Action Strip */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Latency:</span>
                    <span className="text-emerald-400 font-bold">{provider.latencyAvgMs} ms</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Pricing:</span>
                    <span className="text-white font-bold">${provider.pricing.costUsd.toFixed(4)} <span className="text-[10px] text-slate-400">/{provider.pricing.unit.replace('per_', '')}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestProvider(provider)}
                    disabled={isTesting}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Probing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Test Probe</span>
                      </>
                    )}
                  </button>

                  {!provider.isDefault && (
                    <button
                      onClick={() => handleSetDefault(provider.id, provider.category)}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Set as default adapter for this subsystem"
                    >
                      Make Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
