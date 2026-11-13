import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  Globe,
  Server,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { MANDELA_APPLICATIONS } from '../../config/mandelaAppsRegistry';
import { MandelaApplication, OperatingSystemTier } from '../../types/mandelaOS';

export interface AppDirectoryLaunchpadProps {
  onOpenApp: (appId: string, moduleId?: string) => void;
}

export const AppDirectoryLaunchpad: React.FC<AppDirectoryLaunchpadProps> = ({ onOpenApp }) => {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered applications
  const filteredApps = useMemo(() => {
    return MANDELA_APPLICATIONS.filter((app) => {
      const matchesTier = selectedTier === 'all' || app.tier === selectedTier;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.shortName.toLowerCase().includes(q) ||
        app.code.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.strategicFunction.toLowerCase().includes(q);
      return matchesTier && matchesSearch;
    });
  }, [selectedTier, searchQuery]);

  // Group filtered apps by tier
  const tier1Apps = filteredApps.filter((a) => a.tier === 'enterprise');
  const tier2Apps = filteredApps.filter((a) => a.tier === 'agnostic');
  const tier3Apps = filteredApps.filter((a) => a.tier === 'customer');

  const renderAppCard = (app: MandelaApplication) => {
    const AppIcon = app.icon;

    return (
      <div
        key={app.id}
        onClick={() => onOpenApp(app.id)}
        className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer text-left"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-xs">
                <AppIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono px-1 rounded bg-neutral-100 text-neutral-700 font-bold">
                  {app.code}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 ml-1.5 uppercase">
                  {app.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>ACTIVE</span>
            </div>
          </div>

          {/* App Title & Function */}
          <h3 className="text-sm font-bold text-neutral-900 group-hover:text-amber-800 transition-colors">
            {app.name}
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed mt-1 line-clamp-2">
            {app.description}
          </p>

          {/* Modules Preview */}
          <div className="mt-3 flex flex-wrap gap-1">
            {app.modules.slice(0, 4).map((mod) => (
              <span
                key={mod.id}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600"
              >
                {mod.label}
              </span>
            ))}
            {app.modules.length > 4 && (
              <span className="text-[10px] font-mono text-neutral-400 px-1 py-0.5">
                +{app.modules.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Button */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 text-[11px]">
            {app.dataSources.length} Sources Connected
          </span>

          <span className="text-neutral-900 group-hover:text-amber-700 font-bold flex items-center gap-1 transition-colors">
            <span>Launch</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50 p-6 md:p-8 space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Directory Banner */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-amber-700 tracking-wider">
                MANDELA OS PLATFORM DIRECTORY
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-xs font-mono text-neutral-500">30 Native Applications</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              Telecommunications Operating System
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Unified operating environment for Pan-African telecommunications infrastructure,
              voice media clusters, AI agent orchestration, mobile FinTech, and sovereign cybersecurity.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 relative shrink-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 30 applications..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {[
            { id: 'all', label: 'All Applications (30)' },
            { id: 'enterprise', label: 'Tier 01: Enterprise Telecom Core (11)' },
            { id: 'agnostic', label: 'Tier 02: Mandela Agnostic OS (11)' },
            { id: 'customer', label: 'Tier 03: Customer Self-Service (8)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTier(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                selectedTier === tab.id
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TIER 01 SECTION */}
        {(selectedTier === 'all' || selectedTier === 'enterprise') && tier1Apps.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span>Tier 01 — Enterprise Telecom Core</span>
                  <span className="text-xs font-mono font-normal text-neutral-500">
                    ({tier1Apps.length} applications)
                  </span>
                </h2>
                <p className="text-xs text-neutral-500">
                  Mission-critical carrier telephony infrastructure, signaling firewalls, and lakehouse storage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tier1Apps.map(renderAppCard)}
            </div>
          </section>
        )}

        {/* TIER 02 SECTION */}
        {(selectedTier === 'all' || selectedTier === 'agnostic') && tier2Apps.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span>Tier 02 — Mandela Agnostic OS</span>
                  <span className="text-xs font-mono font-normal text-neutral-500">
                    ({tier2Apps.length} applications)
                  </span>
                </h2>
                <p className="text-xs text-neutral-500">
                  Internal operating environment, n8n workflow DAG engine, Linux shell CLI, and provider hubs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tier2Apps.map(renderAppCard)}
            </div>
          </section>
        )}

        {/* TIER 03 SECTION */}
        {(selectedTier === 'all' || selectedTier === 'customer') && tier3Apps.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span>Tier 03 — Customer Self-Service Portal</span>
                  <span className="text-xs font-mono font-normal text-neutral-500">
                    ({tier3Apps.length} applications)
                  </span>
                </h2>
                <p className="text-xs text-neutral-500">
                  Tenant-scoped self-service portals, prepaid wallet top-up, DID storefront, and SLA supervision.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tier3Apps.map(renderAppCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
