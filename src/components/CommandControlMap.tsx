import React, { useState } from 'react';
import { AfricanCountry, ConnectorHealth } from '../types/nms';
import { Radio, AlertTriangle, CheckCircle2, RefreshCw, Zap, Server, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

interface CommandControlMapProps {
  countries: AfricanCountry[];
  connectors: ConnectorHealth[];
  onSelectCountry: (country: AfricanCountry) => void;
  onOpenAiForecast: (country: AfricanCountry) => void;
  onTriggerAutoOrder: (countryCode: string, count: number) => void;
  onGenerateReport: (countryCode: string) => void;
}

export const CommandControlMap: React.FC<CommandControlMapProps> = ({
  countries,
  connectors,
  onSelectCountry,
  onOpenAiForecast,
  onTriggerAutoOrder,
  onGenerateReport
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [isSyncingConnectors, setIsSyncingConnectors] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const selectedCountry = countries.find((c) => c.code === selectedCountryCode) || countries[0];
  const connectorForCountry = connectors.find((conn) => conn.countryCode === selectedCountryCode);

  const totalPool = countries.reduce((acc, c) => acc + c.availableInventory, 0);
  const healthyCount = countries.filter((c) => c.connectorStatus === 'healthy' && c.availableInventory >= 1500).length;
  const lowStockCount = countries.filter((c) => c.availableInventory < 1500).length;
  const degradedConnectors = connectors.filter((c) => c.status === 'degraded' || c.status === 'manual').length;

  const handleSyncAll = () => {
    setIsSyncingConnectors(true);
    setTimeout(() => {
      setIsSyncingConnectors(false);
    }, 1200);
  };

  const getCountryStatusColor = (country: AfricanCountry) => {
    if (country.connectorStatus === 'degraded') return '#ef4444'; // Red
    if (country.availableInventory < 1500 || country.connectorStatus === 'syncing') return '#f59e0b'; // Yellow / Amber
    return '#10b981'; // Green
  };

  return (
    <div className="space-y-6">
      {/* Top High-Density Metric Strip (PRD Section 8 & Design Guidelines single-row contract) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Total Pan-African Stock
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalPool.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">E.164 ranges</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Across 15 Priority Markets
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Provisioning SLA (p95)
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              18.4s
            </span>
            <span className="text-xs text-emerald-500">· 99.4% &lt;60s</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Kamailio & ENUM Sync
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Carrier Connectors
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {connectors.length - degradedConnectors} / {connectors.length}
            </span>
            <span className="text-xs text-amber-400">
              {degradedConnectors > 0 ? `${degradedConnectors} Degraded` : 'All Nominal'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Direct API / EDI / SOAP
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Regulatory Compliance
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              100%
            </span>
            <span className="text-xs text-emerald-400">· Zero Violations</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            TIRMS & CA 2026 Directives
          </div>
        </div>
      </div>

      {/* Actionable Operations Alerts Bar (PRD Section 8) */}
      <div className="space-y-2">
        {!dismissedAlerts.includes('alert-ng') && (
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-200">
                <strong className="text-amber-300 font-semibold">Automated Inventory Replenishment:</strong> MTN Nigeria available stock for Lagos DID prefix 01234xxxx is approaching re-order threshold (buffer &lt; 14 days).
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  onTriggerAutoOrder('NG', 1000);
                  setDismissedAlerts((prev) => [...prev, 'alert-ng']);
                }}
                className="py-1 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                Approve Auto-Order 1,000 Numbers
              </button>
              <button
                onClick={() => setDismissedAlerts((prev) => [...prev, 'alert-ng'])}
                className="text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!dismissedAlerts.includes('alert-cd') && (
          <div className="bg-rose-950/30 border border-rose-500/30 rounded-lg p-3 px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="text-rose-200">
                <strong className="text-rose-300 font-semibold">Connector Advisory:</strong> ARPTC DR Congo portal reported high latency. Fallback human-in-the-loop verification engaged for new allocations.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onGenerateReport('CD')}
                className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-xs transition-colors"
              >
                View Fallback Queue
              </button>
              <button
                onClick={() => setDismissedAlerts((prev) => [...prev, 'alert-cd'])}
                className="text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Map & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Map Panel (8 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Pan-African Sovereign Inventory Grid</h3>
              <p className="text-xs text-slate-400">Click any country node to inspect regulator gateway, live stock & routing</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Healthy ({healthyCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Low Stock ({lowStockCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Degraded ({degradedConnectors})
                </span>
              </div>
              <button
                onClick={handleSyncAll}
                disabled={isSyncingConnectors}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Sync all connectors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingConnectors ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Interactive Africa SVG Map */}
          <div className="relative flex-1 min-h-[380px] flex items-center justify-center p-4">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[460px] drop-shadow-md select-none"
            >
              {/* African Continent Silhouette Base */}
              <path
                d="M 28 8 
                   C 35 7, 50 8, 62 14
                   C 70 17, 72 24, 68 28
                   C 66 32, 75 36, 82 44
                   C 86 50, 78 58, 74 65
                   C 70 72, 65 82, 58 92
                   C 53 97, 48 93, 44 85
                   C 40 76, 38 65, 36 55
                   C 32 50, 22 52, 16 46
                   C 10 38, 14 30, 20 20
                   Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="0.8"
                className="transition-colors"
              />
              {/* Madagascar */}
              <path
                d="M 82 66 C 85 64, 88 72, 85 82 C 82 86, 79 80, 82 66 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="0.6"
              />

              {/* Decorative Subtle Grid Lines */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,1" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,1" />

              {/* Country Nodes */}
              {countries.map((country) => {
                const isSelected = country.code === selectedCountryCode;
                const statusColor = getCountryStatusColor(country);

                return (
                  <g
                    key={country.code}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedCountryCode(country.code)}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={country.coordinates.x}
                        cy={country.coordinates.y}
                        r="3.8"
                        fill="none"
                        stroke={statusColor}
                        strokeWidth="0.6"
                        opacity="0.8"
                      />
                    )}
                    {/* Node Dot */}
                    <circle
                      cx={country.coordinates.x}
                      cy={country.coordinates.y}
                      r={isSelected ? '2.4' : '1.8'}
                      fill={statusColor}
                      stroke="#020617"
                      strokeWidth="0.5"
                    />
                    {/* Country Code Label */}
                    <text
                      x={country.coordinates.x}
                      y={country.coordinates.y - 2.6}
                      textAnchor="middle"
                      fill={isSelected ? '#f8fafc' : '#94a3b8'}
                      fontSize="2.4"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {country.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick country switcher pills for accessibility */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Select Market:
            </span>
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountryCode(c.code)}
                className={`px-2 py-1 rounded font-mono text-xs whitespace-nowrap transition-colors ${
                  c.code === selectedCountryCode
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {c.flag} {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Country Deep Inspector (4 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <h4 className="text-base font-bold text-white">{selectedCountry.name}</h4>
                  <span className="font-mono text-xs text-amber-300 font-semibold">
                    {selectedCountry.dialCode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedCountry.regulator}
                </p>
              </div>
              <span
                className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                  selectedCountry.connectorStatus === 'healthy'
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    : selectedCountry.connectorStatus === 'degraded'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                    : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                }`}
              >
                {selectedCountry.connectorStatus.toUpperCase()}
              </span>
            </div>

            {/* Key stats grid */}
            <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Available Inventory</span>
                <span className="font-mono text-base font-bold text-white tabular-nums">
                  {selectedCountry.availableInventory.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Entry Monthly Fee</span>
                <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                  ${selectedCountry.minPriceUsd.toFixed(2)}
                  <span className="text-[10px] text-slate-400 ml-1">
                    ({selectedCountry.currencySymbol}
                    {(selectedCountry.minPriceUsd * selectedCountry.exchangeRateToUsd).toLocaleString()})
                  </span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">MNP Portability</span>
                <span className="text-white font-medium">
                  {selectedCountry.mnpSupported ? 'Full MNP Clearinghouse' : 'Bilateral / Non-MNP'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Recycling Grace</span>
                <span className="font-mono text-white tabular-nums">
                  {selectedCountry.recyclingPeriodDays} Days
                </span>
              </div>
            </div>

            {/* Carrier aggregators */}
            <div className="py-3 border-b border-slate-800 space-y-1.5 text-xs">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider block">
                Integrated Carrier Pools
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCountry.carriers.map((carrier, idx) => (
                  <span
                    key={idx}
                    className="text-slate-200 bg-slate-950 px-2 py-0.5 rounded text-[11px] border border-slate-800 font-mono"
                  >
                    {carrier}
                  </span>
                ))}
              </div>
            </div>

            {/* Regulatory rules summary */}
            <div className="py-3 border-b border-slate-800 space-y-1 text-xs">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider block">
                Lifecycle & Recycling Framework
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedCountry.recyclingRulesSummary}
              </p>
            </div>

            {/* Connector Technical Health */}
            {connectorForCountry && (
              <div className="py-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>CONNECTOR: {connectorForCountry.connectorType}</span>
                  <span className="font-mono text-emerald-400">{connectorForCountry.latencyMs}ms</span>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                  {connectorForCountry.notes}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectCountry(selectedCountry)}
                className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Browse {selectedCountry.name} Numbers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAiForecast(selectedCountry)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition-colors"
                title="Run AI Demand Forecast & Stockout Risk"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => onGenerateReport(selectedCountry.code)}
                className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded transition-colors text-[11px]"
              >
                Export {selectedCountry.regulatorAcronym} Filing
              </button>
              <button
                onClick={() => onTriggerAutoOrder(selectedCountry.code, 500)}
                className="flex-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded transition-colors text-[11px]"
              >
                +500 Range Replenish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
