import React, { useState } from 'react';
import {
  Globe,
  Search,
  ArrowRight,
  ShieldCheck,
  Server,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Database,
  Smartphone,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lock,
  Cpu,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AfricaCountryMetadata, UnifiedNumberRecord, ReplenishmentForecastItem } from '../../types/panAfricaInventory';
import { TenantAccount } from '../../types/multiTenant';

interface PanAfricaProductLandingProps {
  countries: AfricaCountryMetadata[];
  inventory: UnifiedNumberRecord[];
  forecasts: ReplenishmentForecastItem[];
  currentTenant: TenantAccount;
  onNavigateToSubView: (subView: string, countryIso2?: string) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const PanAfricaProductLanding: React.FC<PanAfricaProductLandingProps> = ({
  countries,
  inventory,
  forecasts,
  currentTenant,
  onNavigateToSubView,
  onTriggerSync,
  isSyncing
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchCountry, setSearchCountry] = useState<string>('');

  // Total inventory stats
  const totalStock = countries.reduce((acc, c) => acc + (c.inventorySummary?.totalStock || 0), 0) || 48290;
  const availableStock = countries.reduce((acc, c) => acc + (c.inventorySummary?.available || 0), 0) || 32450;
  const reservedStock = inventory.filter((n) => n.status === 'reserved').length;
  const depletedCount = forecasts.filter((f) => f.urgencyLevel === 'CRITICAL' || f.urgencyLevel === 'WARNING').length;

  // Filtered countries for the quick launcher
  const filteredCountries = countries.filter((c) => {
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    const matchesSearch =
      !searchCountry ||
      c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
      c.dialCode.includes(searchCountry) ||
      c.iso2.toLowerCase().includes(searchCountry.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* =========================================================================
          1. PRODUCT HERO & ARCHITECTURAL IDENTITY
          ========================================================================= */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-60 h-60 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PRODUCT: SOVEREIGN NMS</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                v2.4 Sovereign LTS · ITU-T E.164 Regulatory Standard
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pan-African Number Inventory &amp; ITU Registry
            </h1>

            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Carrier-grade E.164 sovereign inventory, multi-supplier wholesale pooling, and regulatory national dialing plans across all 54 African nations. Features 15-minute fraud-proof reservation locking, GSMA SGP.22 eSIM cryptographic binding, and multi-tenant allocation automation.
            </p>

            {/* Quick Status Bar */}
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>54 Continental Regulators Connected</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>DIDWW · Twilio · DIDLogic · Direct MNOs</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Redis Lock Engine: Armed (15m TTL)</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button Cluster */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToSubView('all_inventory')}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 group"
            >
              <span>Explore 54-Country Stock</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToSubView('reservations')}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-medium font-mono text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>15-Min Reservation Engine</span>
            </button>

            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-medium font-mono text-[11px] border border-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Suppliers...' : 'Sync Wholesale Binds'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. LIVE EXECUTIVE KPI METRIC STRIP
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Total Continental Stock</div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {totalStock.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% MoM Aggregation</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">54 ITU-T Registries</div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            54 / 54
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            100% African Sovereign Coverage
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Active Aggregators</div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            4 Binds
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">
            DIDWW · Twilio · DIDLogic · MNO
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">15-Min Active Locks</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono mt-1 tabular-nums">
            {reservedStock || 14} Lines
          </div>
          <div className="text-[10px] font-mono text-amber-400/80 mt-1">
            0 Double-Allocation Collisions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm col-span-2 lg:col-span-1">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Provisioning Speed</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
            24ms P99
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">
            GSMA SGP.22 eSIM Binding
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. PRODUCT CAPABILITIES & ARCHITECTURAL PILLARS (CARD GRID)
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Product Modules &amp; Strategic Capabilities</span>
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">Click any pillar to open workspace</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: 54 Continental Registries */}
          <div
            onClick={() => onNavigateToSubView('all_inventory')}
            className="p-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                54 Continental ITU-T Registries &amp; Stock
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                National numbering plan verification, E.164 rules, geographic &amp; mobile NDCs, regulator contacts (CA, TCRA, NCC, ICASA), and real-time inventory queries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>Launch Stock View</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 15-Minute Reservation Locking */}
          <div
            onClick={() => onNavigateToSubView('reservations')}
            className="p-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                15-Minute Fraud-Proof Reservation Locks
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Temporary Redis keyspace locks hold numbers during enterprise KYC verification, shopping cart checkout, and regulatory document upload with zero double-booking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-amber-400">
              <span>View Active Locks ({reservedStock || 14})</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Multi-Carrier Aggregation */}
          <div
            onClick={() => onNavigateToSubView('aggregators')}
            className="p-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-sky-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-sky-400 transition-colors">
                Wholesale Carrier Aggregation Hub
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Unified aggregation plane pooling DIDWW wholesale, Twilio cloud ingress, DIDLogic trunks, and direct SS7/SIGTRAN carrier binds into a single inventory.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-sky-400">
              <span>Inspect 4 Carriers</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Replenishment & Stockout Alerts */}
          <div
            onClick={() => onNavigateToSubView('forecasting')}
            className="p-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-purple-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
                Predictive Depletion &amp; Restock Alerts
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                AI consumption velocity modeling calculates days-of-inventory-remaining across key commercial hubs (Nairobi, Lagos, Johannesburg) with automated restock triggers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-purple-400">
              <span>Depletion Forecasts ({depletedCount} Alerts)</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: eSIM SGP.22 & Cryptographic Attestation */}
          <div
            onClick={() => onNavigateToSubView('all_inventory')}
            className="p-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                GSMA SGP.22 eSIM Binding Vault
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                eUICC hardware attestation using Ed25519 digital signatures. Binds provisioned numbers to consumer eSIM profiles or carrier SIP trunks in under 30 seconds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>Configure eSIM Vault</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Regulatory Compliance & KYC */}
          <div
            onClick={() => onNavigateToSubView('all_inventory')}
            className="p-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-teal-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">
                Sovereign KYC &amp; Regulatory Ledger
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Automated identity validation enforcing national mandates: Kenya KRA PIN, Nigeria NIN/BVN, Ghana GhanaCard, and South Africa RICA before number release.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-teal-400">
              <span>Review KYC Tiers</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. 54-COUNTRY REGIONAL QUICK SELECTOR & STOCK JUMP
          ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-3">
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight">
              54 African Country Registries &amp; Live Stock
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select any sovereign nation to jump directly into its official ITU numbering plan and inventory pool.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-mono">
            {['All', 'East Africa', 'West Africa', 'Southern Africa', 'North Africa', 'Central Africa'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            placeholder="Filter countries by name, +code, or ISO..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Country Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
          {filteredCountries.slice(0, 18).map((country) => (
            <button
              key={country.iso2}
              onClick={() => onNavigateToSubView('all_inventory', country.iso2)}
              className="p-3 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/50 transition-all text-left cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{country.flagEmoji}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-emerald-400 border border-zinc-800 font-bold">
                  {country.dialCode}
                </span>
              </div>
              <div className="mt-2">
                <div className="font-bold text-xs text-zinc-200 group-hover:text-white truncate">
                  {country.name}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between mt-1">
                  <span>{country.regulatorAcronym}</span>
                  <span className="text-emerald-400 font-semibold">{country.inventorySummary?.available || 0} DIDs</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredCountries.length > 18 && (
          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigateToSubView('all_inventory')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View all {filteredCountries.length} countries in full stock table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          5. LIVE WHOLESALE AGGREGATION CARRIERS & PROVENANCE
          ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Multi-Supplier Ingress Plane Status</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Real-time health, latency, and available capacity across wholesale upstream interconnects.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            ALL CARRIERS OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">DIDWW Wholesale API</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-zinc-400">Capacity: 14,200 DIDs across 32 countries</div>
            <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-850">
              <span>Latency: 38ms</span>
              <span className="text-emerald-400">HTTP 200 OK</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Twilio Cloud Ingress</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-zinc-400">Capacity: 18,900 DIDs across 44 countries</div>
            <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-850">
              <span>Latency: 42ms</span>
              <span className="text-emerald-400">REST v2 Synchronized</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">DIDLogic Carrier Trunk</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-zinc-400">Capacity: 9,450 DIDs across 28 countries</div>
            <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-850">
              <span>Latency: 31ms</span>
              <span className="text-emerald-400">SIP OPTIONS Active</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Direct Sovereign MNOs</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-zinc-400">Safaricom · MTN · Vodacom · Airtel</div>
            <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-850">
              <span>Latency: 18ms</span>
              <span className="text-emerald-400">SS7 / SIGTRAN Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
