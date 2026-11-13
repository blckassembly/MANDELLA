import React, { useState, useMemo } from 'react';
import { AfricanCountry, PhoneNumberRecord, NumberType } from '../types/nms';
import { Search, SlidersHorizontal, Check, Zap, Sparkles } from 'lucide-react';

interface InventoryBrowserProps {
  countries: AfricanCountry[];
  numbers: PhoneNumberRecord[];
  selectedCountryCode: string;
  onCountryChange: (countryCode: string) => void;
  onInitiatePurchase: (number: PhoneNumberRecord) => void;
  onOpenAiForecast: (country: AfricanCountry) => void;
}

export const InventoryBrowser: React.FC<InventoryBrowserProps> = ({
  countries,
  numbers,
  selectedCountryCode,
  onCountryChange,
  onInitiatePurchase,
  onOpenAiForecast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<NumberType | 'all'>('all');
  const [selectedFeature, setSelectedFeature] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const activeCountry = countries.find((c) => c.code === selectedCountryCode) || countries[0];

  // Filter numbers
  const filteredNumbers = useMemo(() => {
    return numbers.filter((num) => {
      if (num.countryCode !== selectedCountryCode) return false;
      if (onlyAvailable && num.status !== 'available') return false;
      if (selectedType !== 'all' && num.type !== selectedType) return false;
      if (selectedFeature !== 'all' && !num.features.includes(selectedFeature as any)) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesE164 = num.e164.toLowerCase().includes(query);
        const matchesNational = num.nationalFormat.toLowerCase().includes(query);
        const matchesCarrier = num.carrier.toLowerCase().includes(query);
        if (!matchesE164 && !matchesNational && !matchesCarrier) return false;
      }
      return true;
    });
  }, [numbers, selectedCountryCode, onlyAvailable, selectedType, selectedFeature, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Country selection strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Sovereign Number Inventory</h2>
            <p className="text-xs text-slate-400">
              Aggregated from national regulators and licensed carriers across Africa
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAiForecast(activeCountry)}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Demand Forecast ({activeCountry.code})</span>
            </button>
          </div>
        </div>

        {/* Horizontal Country Selector */}
        <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-1">
          {countries.map((country) => {
            const isSelected = country.code === selectedCountryCode;
            return (
              <button
                key={country.code}
                onClick={() => onCountryChange(country.code)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400/60 text-amber-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-sm">{country.flag}</span>
                <span className="font-semibold">{country.name}</span>
                <span className="font-mono text-[11px] text-slate-400">({country.dialCode})</span>
                <span className="text-[10px] px-1 py-0.2 bg-slate-800 rounded font-mono text-slate-300">
                  {country.availableInventory.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Country Banner & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeCountry.flag}</span>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{activeCountry.name}</span>
                <span className="text-xs font-mono text-amber-300 font-semibold">{activeCountry.dialCode}</span>
                <span className="text-[10px] text-slate-400 font-mono">· {activeCountry.regulatorAcronym}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {activeCountry.regulator} · {activeCountry.carriers.join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Available Stock</span>
              <span className="font-bold text-white tabular-nums">{activeCountry.availableInventory.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Starting Rate</span>
              <span className="font-bold text-emerald-400 tabular-nums">
                ${activeCountry.minPriceUsd.toFixed(2)}/mo
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Local Equiv</span>
              <span className="text-slate-300 tabular-nums">
                {activeCountry.currencySymbol}
                {(activeCountry.minPriceUsd * activeCountry.exchangeRateToUsd).toFixed(0)}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by prefix, number, or carrier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Number Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Types (Mobile, Fixed, Toll-Free)</option>
              <option value="mobile">Mobile (MSISDN)</option>
              <option value="fixed">Fixed DID (City Geographies)</option>
              <option value="toll-free">Toll-Free (0800 National)</option>
              <option value="short-code">Short Code (USSD / SMS)</option>
            </select>
          </div>

          {/* Feature Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Capabilities</option>
              <option value="voice">Voice Enabled</option>
              <option value="sms">SMS Enabled</option>
              <option value="ussd">USSD Interactive</option>
              <option value="mms">MMS Enabled</option>
            </select>
          </div>

          {/* Toggle Available Only */}
          <div className="md:col-span-2 flex items-center justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Numbers Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Showing <strong className="text-white font-mono">{filteredNumbers.length}</strong> available sovereign numbers</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Sub-60s Kamailio + ENUM Provisioning Guarantee
          </div>
        </div>

        {filteredNumbers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-slate-500 text-sm">No matching numbers found in active buffer for {activeCountry.name}.</div>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Our automated inventory connector syncs every few minutes. You can also trigger an on-demand allocation order.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedFeature('all');
                setOnlyAvailable(false);
              }}
              className="py-1.5 px-3 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredNumbers.map((num) => {
              const isAssigned = num.status === 'assigned';
              const isRecycling = num.status === 'recycling';

              return (
                <div
                  key={num.id}
                  className="p-4 hover:bg-slate-850/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Number and metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-white tracking-wide">
                        {num.e164}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {num.nationalFormat}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {num.type}
                      </span>
                      {isAssigned && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          Active (Yours)
                        </span>
                      )}
                      {isRecycling && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30">
                          Recycling Hold
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{num.carrier}</span>
                      <span aria-hidden="true">·</span>
                      <span>{num.countryName}</span>
                      <span aria-hidden="true">·</span>
                      <div className="flex items-center gap-1.5">
                        {num.features.map((f) => (
                          <span key={f} className="text-[11px] text-amber-300/80 uppercase font-mono">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing and Action */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                        ${num.monthlyFeeUsd.toFixed(2)}
                        <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {activeCountry.currencySymbol}
                        {(num.monthlyFeeUsd * activeCountry.exchangeRateToUsd).toFixed(0)} · Voice: ${num.perMinInboundUsd}/min
                      </div>
                    </div>

                    <div>
                      {num.status === 'available' ? (
                        <button
                          onClick={() => onInitiatePurchase(num)}
                          className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Buy & Provision</span>
                        </button>
                      ) : isAssigned ? (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>In Service</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">
                          Quarantined
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
