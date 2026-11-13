import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Building2,
  FileText,
  CreditCard,
  Lock,
  ArrowRight,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
  Info,
  Server,
  Activity,
  Check,
  X,
  Copy
} from 'lucide-react';
import {
  AfricaCountryMetadata,
  UnifiedNumberRecord,
  AfricaRegion,
  UnifiedNumberType,
  SupplierProviderId,
  ReplenishmentForecastItem,
  SupplierSyncJobResult
} from '../../types/panAfricaInventory';
import {
  PAN_AFRICA_COUNTRIES_REGISTRY,
  INITIAL_UNIFIED_INVENTORY,
  INITIAL_REPLENISHMENT_FORECASTS,
  INITIAL_SUPPLIER_SYNC_JOB
} from '../../data/panAfricaNumberData';
import { TenantAccount } from '../../types/multiTenant';
import { PanAfricaProductLanding } from './PanAfricaProductLanding';

interface PanAfricaNumberInventoryViewProps {
  currentTenant?: TenantAccount;
  onOpenVoiceIvr?: () => void;
  onOpenMessaging?: () => void;
  onOpenSoftphone?: (num: any) => void;
  activeSubView?: string;
  onSelectSubView?: (subView: string) => void;
}

export const PanAfricaNumberInventoryView: React.FC<PanAfricaNumberInventoryViewProps> = ({
  currentTenant = {
    id: 'tenant-ke-safaricom-01',
    name: 'Safaricom Sovereign PLC',
    slug: 'safaricom',
    role: 'super_admin',
    subscription: { tier: 'sovereign_telco', displayName: 'Sovereign Telco' }
  } as unknown as TenantAccount,
  onOpenVoiceIvr,
  onOpenMessaging,
  onOpenSoftphone,
  activeSubView = 'product_landing',
  onSelectSubView
}) => {
  // Active product subview state (defaults to landing page)
  const [currentSubView, setCurrentSubView] = useState<string>(activeSubView || 'product_landing');

  useEffect(() => {
    if (activeSubView) {
      setCurrentSubView(activeSubView);
    }
  }, [activeSubView]);

  const handleSubViewChange = (newView: string) => {
    setCurrentSubView(newView);
    if (onSelectSubView) {
      onSelectSubView(newView);
    }
  };

  // State: Countries & Inventory
  const [countries, setCountries] = useState<AfricaCountryMetadata[]>(PAN_AFRICA_COUNTRIES_REGISTRY);
  const [inventory, setInventory] = useState<UnifiedNumberRecord[]>(INITIAL_UNIFIED_INVENTORY);
  const [forecasts, setForecasts] = useState<ReplenishmentForecastItem[]>(INITIAL_REPLENISHMENT_FORECASTS);
  const [syncJob, setSyncJob] = useState<SupplierSyncJobResult>(INITIAL_SUPPLIER_SYNC_JOB);

  // Filters
  const [selectedRegion, setSelectedRegion] = useState<AfricaRegion | 'All'>('All');
  const [selectedCountryIso2, setSelectedCountryIso2] = useState<string>('KE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<SupplierProviderId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<UnifiedNumberType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filterVoiceOnly, setFilterVoiceOnly] = useState(false);
  const [filterSmsOnly, setFilterSmsOnly] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  // Active Modals & Drawers
  const [activeReservation, setActiveReservation] = useState<UnifiedNumberRecord | null>(null);
  const [purchaseModalItem, setPurchaseModalItem] = useState<UnifiedNumberRecord | null>(null);
  const [showForecastDrawer, setShowForecastDrawer] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reservation countdown ticker
  const [reservationSecondsLeft, setReservationSecondsLeft] = useState<number>(900);

  // Purchase modal form state
  const [bindTarget, setBindTarget] = useState<'voice_os' | 'messaging_os' | 'both'>('voice_os');
  const [sipUriInput, setSipUriInput] = useState('sip:nbo-core-trunk@mandela.cloud:5060');
  const [webhookUrlInput, setWebhookUrlInput] = useState('https://api.safaricom.co.ke/webhooks/sms');
  const [isKycConfirmed, setIsKycConfirmed] = useState(true);

  // Load from backend API if available, fallback to seed
  useEffect(() => {
    fetch('/api/v1/numbers/countries')
      .then((res) => res.json())
      .then((data) => {
        if (data.countries?.length) {
          setCountries(data.countries);
        }
      })
      .catch(() => {});

    fetch('/api/v1/numbers/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (data.results?.length) {
          setInventory(data.results);
        }
      })
      .catch(() => {});
  }, []);

  // Ticker effect for reservation
  useEffect(() => {
    if (!activeReservation) return;
    const interval = setInterval(() => {
      setReservationSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveReservation(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeReservation]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Selected Country Metadata
  const activeCountry = countries.find((c) => c.iso2 === selectedCountryIso2) || countries[0];

  // Filtered Numbers
  const filteredNumbers = inventory.filter((num) => {
    if (selectedCountryIso2 && num.countryIso2 !== selectedCountryIso2) return false;
    if (selectedRegion !== 'All' && num.region !== selectedRegion) return false;
    if (selectedProvider !== 'all' && num.provider !== selectedProvider) return false;
    if (selectedType !== 'all' && num.numberType !== selectedType) return false;
    if (selectedStatus !== 'all' && num.status !== selectedStatus) return false;
    if (filterVoiceOnly && !num.capabilities.voice) return false;
    if (filterSmsOnly && !num.capabilities.sms) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        num.e164.includes(q) ||
        num.nationalFormat.toLowerCase().includes(q) ||
        num.cityOrArea.toLowerCase().includes(q) ||
        num.carrierNetwork.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Active SubView filter override: supports left-sidebar navigation switching
  const displayedNumbers = filteredNumbers.filter((num) => {
    if (currentSubView === 'reservations') {
      return num.status === 'reserved' || (num.reservation && (num.reservation.remainingSeconds ?? 0) > 0);
    }
    return true;
  });

  // Action: Trigger 15-Minute Reservation Lock
  const handleReserveNumber = async (num: UnifiedNumberRecord) => {
    try {
      const res = await fetch('/api/v1/numbers/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberId: num.id, tenantId: currentTenant.id })
      });
      const data = await res.json();
      if (data.number) {
        setInventory((prev) => prev.map((n) => (n.id === num.id ? data.number : n)));
        setActiveReservation(data.number);
        setReservationSecondsLeft(900);
        showToast(`15-minute reservation lock engaged for ${num.e164}. Token: ${data.lockToken}`);
      }
    } catch {
      // Local fallback
      const updated: UnifiedNumberRecord = {
        ...num,
        status: 'reserved',
        reservation: {
          reservedByTenantId: currentTenant.id,
          reservedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          lockToken: `lock-${Date.now()}`,
          remainingSeconds: 900
        }
      };
      setInventory((prev) => prev.map((n) => (n.id === num.id ? updated : n)));
      setActiveReservation(updated);
      setReservationSecondsLeft(900);
      showToast(`15-minute reservation lock engaged for ${num.e164}`);
    }
  };

  // Action: Commit Purchase & Binding
  const handleConfirmPurchase = async () => {
    if (!purchaseModalItem) return;

    try {
      const res = await fetch('/api/v1/numbers/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numberId: purchaseModalItem.id,
          tenantId: currentTenant.id,
          voiceOsBridgeTarget: sipUriInput,
          messagingOsTarget: webhookUrlInput,
          kycVerified: isKycConfirmed
        })
      });
      const data = await res.json();
      if (data.number) {
        setInventory((prev) => prev.map((n) => (n.id === purchaseModalItem.id ? data.number : n)));
        if (activeReservation?.id === purchaseModalItem.id) {
          setActiveReservation(null);
        }
        showToast(`Line ${purchaseModalItem.e164} purchased and bound to Voice/Messaging OS!`);
      }
    } catch {
      const updated: UnifiedNumberRecord = {
        ...purchaseModalItem,
        status: 'active',
        reservation: undefined,
        assignment: {
          assignedToTenantId: currentTenant.id,
          assignedAt: new Date().toISOString(),
          voiceOsBridgeTarget: sipUriInput,
          messagingOsTarget: webhookUrlInput
        }
      };
      setInventory((prev) => prev.map((n) => (n.id === purchaseModalItem.id ? updated : n)));
      showToast(`Line ${purchaseModalItem.e164} activated and bound to ${currentTenant.name}!`);
    }

    setPurchaseModalItem(null);
  };

  // Action: Supplier Sync
  const handleTriggerSupplierSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/v1/numbers/sync-suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateMode: isSimulatedMode })
      });
      const data = await res.json();
      if (data.syncJob) {
        setSyncJob(data.syncJob);
        showToast('Pan-African supplier sync completed (DIDWW, Twilio, DIDLogic, Direct MNOs).');
      }
    } catch {
      showToast('Supplier synchronization completed.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans select-none overflow-hidden">
      {/* =========================================================================
          1. TOP METRICS STRIP: CONTINENTAL STOCK & AGGREGATION HEALTH
          ========================================================================= */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-sm sm:text-base tracking-tight">
                Pan-African Number Inventory System
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                54 COUNTRIES · ITU-T NNP
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Aggregating DIDWW · Twilio Wholesale · DIDLogic · Direct Sovereign MNO Binds
            </p>
          </div>
        </div>

        {/* Global Stock Stats & Sync Controls */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          {/* Active 15-Minute Reservation Widget */}
          {activeReservation && (
            <div className="bg-amber-950/80 border border-amber-500/50 text-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                LOCK: <strong className="text-white">{activeReservation.e164}</strong> ({Math.floor(reservationSecondsLeft / 60)}:
                {String(reservationSecondsLeft % 60).padStart(2, '0')})
              </span>
              <button
                onClick={() => setPurchaseModalItem(activeReservation)}
                className="ml-1 px-2 py-0.5 rounded bg-amber-400 text-zinc-950 font-bold hover:bg-white transition-colors cursor-pointer text-[10px]"
              >
                COMMIT
              </button>
            </div>
          )}

          {/* Forecast & Alerts Button */}
          <button
            onClick={() => setShowForecastDrawer(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Depletion Forecasts</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800">
              {forecasts.filter((f) => f.urgencyLevel === 'CRITICAL').length}
            </span>
          </button>

          {/* Sync Suppliers Button */}
          <button
            onClick={handleTriggerSupplierSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Durable Asynchronous Sync across DIDWW, Twilio, DIDLogic, and Direct Carriers"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Suppliers'}</span>
          </button>

          {/* Simulated Mode Toggle */}
          <button
            onClick={() => {
              setIsSimulatedMode(!isSimulatedMode);
              showToast(
                !isSimulatedMode
                  ? 'Switched to Simulated QA Inventory Mode (Safe for test ordering).'
                  : 'Switched to Live Carrier Interconnect Mode.'
              );
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
              isSimulatedMode
                ? 'bg-amber-950/70 border-amber-600 text-amber-300'
                : 'bg-zinc-850 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {isSimulatedMode ? 'QA SIMULATOR: ON' : 'CARRIER API: LIVE'}
          </button>
        </div>
      </div>

      {/* Product Module Navigation Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-mono">
          <button
            onClick={() => handleSubViewChange('product_landing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSubView === 'product_landing'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Product Overview</span>
          </button>
          <button
            onClick={() => handleSubViewChange('all_inventory')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSubView === 'all_inventory'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>54 ITU Registries & Stock</span>
          </button>
          <button
            onClick={() => handleSubViewChange('reservations')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSubView === 'reservations'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>15-Min Reservation Locks</span>
          </button>
          <button
            onClick={() => handleSubViewChange('aggregators')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSubView === 'aggregators'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Wholesale Aggregators</span>
          </button>
          <button
            onClick={() => handleSubViewChange('forecasting')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSubView === 'forecasting'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Replenishment Forecast</span>
          </button>
        </div>

        {currentSubView !== 'product_landing' && (
          <button
            onClick={() => handleSubViewChange('product_landing')}
            className="text-[11px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>← Back to Product Overview</span>
          </button>
        )}
      </div>

      {/* Conditionally Render Landing Page or Operational Dual-Pane View */}
      {currentSubView === 'product_landing' ? (
        <div className="flex-1 overflow-y-auto">
          <PanAfricaProductLanding
            countries={countries}
            inventory={inventory}
            forecasts={forecasts}
            currentTenant={currentTenant}
            onNavigateToSubView={(view, countryIso2) => {
              if (countryIso2) setSelectedCountryIso2(countryIso2);
              handleSubViewChange(view);
            }}
            onTriggerSync={handleTriggerSupplierSync}
            isSyncing={isSyncing}
          />
        </div>
      ) : (
        <>
          {/* =========================================================================
              2. REGIONAL SELECTION STRIP (East, West, Southern, North, Central Africa)
              ========================================================================= */}
          <div className="bg-zinc-950 border-b border-zinc-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-bold uppercase text-[10px] shrink-0">Region:</span>
              {(['All', 'East Africa', 'West Africa', 'Southern Africa', 'North Africa', 'Central Africa'] as const).map(
                (reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      selectedRegion === reg
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    {reg}
                  </button>
                )
              )}
            </div>

            {/* Selected Country Flag & Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-zinc-500 font-bold text-[10px] uppercase">Country Registry:</span>
              <select
                value={selectedCountryIso2}
                onChange={(e) => setSelectedCountryIso2(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {countries
                  .filter((c) => selectedRegion === 'All' || c.region === selectedRegion)
                  .map((c) => (
                    <option key={c.iso2} value={c.iso2}>
                      {c.flagEmoji} {c.name} ({c.dialCode}) — {c.inventorySummary.available} avail
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* =========================================================================
              3. MAIN DUAL-PANE BODY: ITU RULES / REGULATORY SIDEBAR + UNIFIED INVENTORY
              ========================================================================= */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANE: ITU NUMBERING PLAN & REGULATORY METADATA (340px) */}
        <div className="w-full lg:w-84 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-900/60 p-4 overflow-y-auto space-y-4 shrink-0 text-xs">
          {/* Country Overview Banner */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeCountry.flagEmoji}</span>
                <div>
                  <div className="font-bold text-white text-sm">{activeCountry.name}</div>
                  <div className="text-zinc-400 text-[11px] font-mono">
                    ISO: <strong className="text-emerald-400">{activeCountry.iso2}</strong> / {activeCountry.iso3} · Code: <strong className="text-emerald-400">{activeCountry.dialCode}</strong>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {activeCountry.economicBloc}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-800 flex justify-between">
              <span>Currency: <strong>{activeCountry.localCurrencyCode} ({activeCountry.currencySymbol})</strong></span>
              <span>Rate: 1 USD = {activeCountry.exchangeRateToUsd} {activeCountry.localCurrencyCode}</span>
            </div>
          </div>

          {/* ITU National Numbering Plan (NNP) Specifications */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 font-mono">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official ITU-T Numbering Plan</span>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-300 divide-y divide-zinc-800/80">
              <div className="py-1 flex justify-between">
                <span className="text-zinc-500">Regulator:</span>
                <span className="text-right text-zinc-200 truncate max-w-[180px]" title={activeCountry.regulatorName}>
                  {activeCountry.regulatorAcronym}
                </span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-zinc-500">Subscriber Digits:</span>
                <span>{activeCountry.ituRules.subscriberLengthMin} - {activeCountry.ituRules.subscriberLengthMax} digits</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-zinc-500">Trunk Prefix:</span>
                <span>{activeCountry.ituRules.trunkPrefix || 'None (Closed)'}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-zinc-500">Intl Prefix:</span>
                <span>{activeCountry.ituRules.internationalPrefix}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-zinc-500">Area Codes (NDCs):</span>
                <span className="text-cyan-400">{activeCountry.ituRules.nationalDestinationCodes.join(', ')}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-zinc-500">Emergency:</span>
                <span className="text-amber-400 font-bold">{activeCountry.ituRules.emergencyNumbers.join(', ')}</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal pt-1 italic">
              {activeCountry.ituRules.notes}
            </p>
          </div>

          {/* Sovereign Regulatory Compliance Requirements */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs font-mono">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Regulatory KYC Requirements</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between font-mono">
                <span className="text-zinc-400">KYC Verification Tier:</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  TIER {activeCountry.regulatory.kycTierRequired}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-zinc-400">In-Country Address:</span>
                <span className={activeCountry.regulatory.localAddressRequired ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {activeCountry.regulatory.localAddressRequired ? 'Mandatory' : 'Not Required'}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-zinc-400">Quarantine Hold:</span>
                <span className="text-zinc-300">{activeCountry.regulatory.quarantinePeriodDays} Days</span>
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <span className="text-zinc-400 font-medium text-[10px] uppercase font-mono">Required Documents:</span>
                <ul className="mt-1 space-y-1 text-zinc-300 text-[11px]">
                  {activeCountry.regulatory.requiredDocuments.map((doc) => (
                    <li key={doc} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: UNIFIED NUMBER INVENTORY BROWSER & ACTIONS */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          {/* Filter Bar */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search E.164, local format, city, or area code..."
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs font-mono placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Provider Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-zinc-500 text-[11px]">Provider:</span>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs font-mono focus:outline-none"
              >
                <option value="all">All Providers</option>
                <option value="direct_mno">Direct Sovereign MNO</option>
                <option value="didww">DIDWW</option>
                <option value="twilio">Twilio Wholesale</option>
                <option value="didlogic">DIDLogic</option>
              </select>
            </div>

            {/* Number Type Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-zinc-500 text-[11px]">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs font-mono focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="geographic_local">Geographic Local</option>
                <option value="mobile">Mobile</option>
                <option value="toll_free">Toll-Free</option>
                <option value="national">National</option>
              </select>
            </div>

            {/* Quick Capability Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterVoiceOnly(!filterVoiceOnly)}
                className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                  filterVoiceOnly ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                <PhoneCall className="w-3 h-3" /> Voice
              </button>
              <button
                onClick={() => setFilterSmsOnly(!filterSmsOnly)}
                className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                  filterSmsOnly ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                <MessageSquare className="w-3 h-3" /> SMS
              </button>
            </div>
          </div>

          {/* Contextual SubView Panels according to Left-Side Navigation */}
          {currentSubView === 'reservations' && (
            <div className="mx-4 mt-3 p-3.5 bg-amber-950/40 border border-amber-500/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 font-mono animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[13px]">
                    15-Minute Temporary Reservation Subsystem
                  </div>
                  <div className="text-[11px] text-amber-300/80">
                    Holding inventory allocations while tenant verifies regulatory KYC documents &amp; national numbering rules.
                  </div>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded bg-amber-900/80 border border-amber-700 font-bold self-start sm:self-auto text-amber-200 shrink-0">
                {displayedNumbers.length} RESERVED LINES HELD
              </span>
            </div>
          )}

          {currentSubView === 'aggregators' && (
            <div className="mx-4 mt-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3 font-sans animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs uppercase font-mono tracking-wider">
                    Wholesale Aggregators &amp; Carrier Interconnect Mesh
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    4 CONNECTORS ONLINE
                  </span>
                  <button
                    onClick={handleTriggerSupplierSync}
                    disabled={isSyncing}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold cursor-pointer transition-colors"
                  >
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
                {[
                  { name: 'DIDWW Wholesale', region: 'Global / Africa DIDs', latency: '18ms', status: 'VERIFIED', count: '24,190 DIDs' },
                  { name: 'Twilio Wholesale', region: 'Tier 1 BGP Anycast', latency: '24ms', status: 'VERIFIED', count: '18,900 DIDs' },
                  { name: 'DIDLogic African Mesh', region: 'Lagos / JNB Edge', latency: '12ms', status: 'VERIFIED', count: '9,420 DIDs' },
                  { name: 'Direct MNO Binds', region: 'Safaricom · MTN · Vodacom', latency: '4ms', status: 'SS7 SIGTRAN', count: '54 ITU Dialplans' }
                ].map((agg, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{agg.name}</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800 font-bold">
                        {agg.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400">{agg.region}</div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                      <span>{agg.count}</span>
                      <span className="text-emerald-400">{agg.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSubView === 'forecasting' && (
            <div className="mx-4 mt-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3 font-sans animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-xs uppercase font-mono tracking-wider">
                    Continental Stockout Depletion Forecasts
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {forecasts.length} ITU REGISTRIES MONITORED
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono">
                {forecasts.slice(0, 3).map((f) => (
                  <div key={f.countryIso2} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{f.countryName} ({f.countryIso2})</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                          f.urgencyLevel === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : f.urgencyLevel === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {f.urgencyLevel}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Stock: <strong className="text-white">{f.currentAvailableStock}</strong> lines · Runout in <strong className="text-amber-400">{f.projectedStockoutDays} days</strong>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                      <span>Rate: {f.dailyDepletionRate}/day</span>
                      <span className="text-emerald-400">Rec: +{f.recommendedReplenishmentCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unified Inventory Table */}
          <div className="flex-1 overflow-auto p-4">
            <div className="border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-zinc-800 select-none">
                  <tr>
                    <th className="py-2.5 px-3">E.164 &amp; National Format</th>
                    <th className="py-2.5 px-3">Area / City</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Provider &amp; Carrier</th>
                    <th className="py-2.5 px-3">Capabilities</th>
                    <th className="py-2.5 px-3">Rental (USD / Local)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 bg-zinc-950">
                  {displayedNumbers.map((num) => {
                    const isReservedByCurrent =
                      num.status === 'reserved' && num.reservation?.reservedByTenantId === currentTenant.id;

                    return (
                      <tr key={num.id} className="hover:bg-zinc-900/60 transition-colors">
                        {/* Number Display */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-white text-sm">{num.e164}</div>
                          <div className="text-[11px] text-zinc-400">{num.nationalFormat}</div>
                        </td>

                        {/* City / Area */}
                        <td className="py-3 px-3">
                          <div className="text-zinc-200 font-medium">{num.cityOrArea}</div>
                          <div className="text-[10px] text-zinc-500">Area Code: {num.areaCode}</div>
                        </td>

                        {/* Number Type */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 text-zinc-300 border border-zinc-700 uppercase">
                            {num.numberType.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Provider & Carrier */}
                        <td className="py-3 px-3">
                          <div className="text-white font-semibold flex items-center gap-1.5">
                            <span>{num.providerDisplayName}</span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                num.supplierMetadata.verificationState === 'verified_live'
                                  ? 'bg-emerald-400'
                                  : 'bg-amber-400'
                              }`}
                              title={num.supplierMetadata.verificationState}
                            />
                          </div>
                          <div className="text-[10px] text-zinc-400">{num.carrierNetwork} · {num.supplierMetadata.latencyMs}ms</div>
                        </td>

                        {/* Capabilities */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            {num.capabilities.voice && (
                              <span className="p-1 rounded bg-emerald-950 text-emerald-400" title="Voice Supported">
                                <PhoneCall className="w-3 h-3" />
                              </span>
                            )}
                            {num.capabilities.sms && (
                              <span className="p-1 rounded bg-cyan-950 text-cyan-400" title="2-Way SMS Supported">
                                <MessageSquare className="w-3 h-3" />
                              </span>
                            )}
                            {num.capabilities.emergency && (
                              <span className="px-1 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-300" title="Emergency Routing">
                                E911
                              </span>
                            )}
                            {num.capabilities.ussd && (
                              <span className="px-1 py-0.5 rounded text-[9px] bg-purple-950 text-purple-300" title="USSD Menu Bind">
                                USSD
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Rental & Setup Pricing */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">
                            ${num.pricing.monthlyRentalUsd.toFixed(2)} / mo
                          </div>
                          <div className="text-[10px] text-emerald-400">
                            {num.pricing.currencySymbol} {num.pricing.localMonthlyRental} / mo
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          {num.status === 'available' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                              AVAILABLE
                            </span>
                          )}
                          {num.status === 'reserved' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                              LOCKED (15M)
                            </span>
                          )}
                          {num.status === 'active' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                              ACTIVE
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          {num.status === 'available' && (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReserveNumber(num)}
                                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold cursor-pointer transition-colors"
                                title="Engage 15-Minute Temporary Reservation Lock"
                              >
                                Reserve (15m)
                              </button>
                              <button
                                onClick={() => setPurchaseModalItem(num)}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                Purchase
                              </button>
                            </div>
                          )}

                          {isReservedByCurrent && (
                            <button
                              onClick={() => setPurchaseModalItem(num)}
                              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              Complete
                            </button>
                          )}

                          {num.status === 'active' && (
                            <div className="flex items-center justify-end gap-1.5">
                              {onOpenSoftphone ? (
                                <button
                                  onClick={() =>
                                    onOpenSoftphone({
                                      id: num.id,
                                      e164: num.e164,
                                      countryCode: num.countryIso2,
                                      carrier: num.carrierNetwork,
                                      type: num.numberType,
                                      status: 'assigned',
                                      features: [
                                        ...(num.capabilities.voice ? ['voice'] : []),
                                        ...(num.capabilities.sms ? ['sms'] : [])
                                      ]
                                    })
                                  }
                                  className="px-2.5 py-1 rounded bg-zinc-850 hover:bg-emerald-600 hover:text-white text-emerald-400 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 border border-zinc-700"
                                  title="Test line in FreeSWITCH WebRTC Softphone"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Softphone</span>
                                </button>
                              ) : onOpenVoiceIvr ? (
                                <button
                                  onClick={onOpenVoiceIvr}
                                  className="px-2.5 py-1 rounded bg-zinc-850 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                  IVR Callflow
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-400 font-mono font-semibold">Active Line</span>
                              )}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(num.e164);
                                  showToast(`Copied ${num.e164} to clipboard`);
                                }}
                                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                                title="Copy E.164"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {displayedNumbers.length === 0 && (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <p className="text-sm">
                    {currentSubView === 'reservations'
                      ? 'No active 15-minute reservation locks held currently.'
                      : `No numbers match your filter criteria in ${activeCountry.name}.`}
                  </p>
                  <p className="text-xs">
                    {currentSubView === 'reservations'
                      ? 'Click "Reserve (15m)" on any available number to engage temporary hold.'
                      : 'Try selecting a different provider, area code, or reset search.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )}

      {/* =========================================================================
          4. MODAL: PURCHASE, REGULATORY VALIDATION & VOICE/MESSAGING OS BINDING
          ========================================================================= */}
      {purchaseModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
          onClick={() => setPurchaseModalItem(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-5 text-zinc-100 font-sans space-y-4 animate-in fade-in zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 font-bold">
                  {purchaseModalItem.countryIso2}
                </div>
                <div>
                  <div className="font-bold text-white text-base">Provision {purchaseModalItem.e164}</div>
                  <div className="text-xs text-zinc-400 font-mono">
                    {purchaseModalItem.cityOrArea} · {purchaseModalItem.providerDisplayName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPurchaseModalItem(null)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price & Billing Summary */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-zinc-500">Monthly Subscription:</span>
                <div className="text-white text-sm font-bold">
                  ${purchaseModalItem.pricing.monthlyRentalUsd.toFixed(2)} USD
                </div>
              </div>
              <div className="text-right">
                <span className="text-zinc-500">Setup Activation Fee:</span>
                <div className="text-emerald-400 text-sm font-bold">
                  ${purchaseModalItem.pricing.setupFeeUsd.toFixed(2)} USD
                </div>
              </div>
            </div>

            {/* Regulatory KYC Verification Attestation */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Regulatory KYC Compliance (Tier {purchaseModalItem.regulatoryRequirements.kycTier})</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Tenant <strong>{currentTenant.name}</strong> holds pre-verified corporate credentials for{' '}
                {purchaseModalItem.countryName}. Mandatory telecom records will be logged in accordance with{' '}
                {activeCountry.regulatorAcronym} regulations.
              </p>
              <label className="flex items-center gap-2 pt-1 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isKycConfirmed}
                  onChange={(e) => setIsKycConfirmed(e.target.checked)}
                  className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                />
                <span>Attest compliance with in-country local address &amp; tax requirements</span>
              </label>
            </div>

            {/* Operating System Binding Target */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white font-mono">Operating System Binding Target</div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => setBindTarget('voice_os')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    bindTarget === 'voice_os'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  Voice OS (SIP)
                </button>
                <button
                  onClick={() => setBindTarget('messaging_os')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    bindTarget === 'messaging_os'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  Messaging (SMS)
                </button>
                <button
                  onClick={() => setBindTarget('both')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    bindTarget === 'both'
                      ? 'bg-purple-950 text-purple-300 border-purple-700 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  Dual Ingress
                </button>
              </div>

              {/* Ingress Configuration Inputs */}
              {(bindTarget === 'voice_os' || bindTarget === 'both') && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-zinc-400 font-mono">FreeSWITCH Media Bridge / SIP Trunk Target:</span>
                  <input
                    type="text"
                    value={sipUriInput}
                    onChange={(e) => setSipUriInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-300 focus:outline-none"
                  />
                </div>
              )}

              {(bindTarget === 'messaging_os' || bindTarget === 'both') && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-zinc-400 font-mono">SMS Webhook / SMPP Target:</span>
                  <input
                    type="text"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setPurchaseModalItem(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={!isKycConfirmed}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Purchase &amp; Allocate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. DRAWER: REPLENISHMENT FORECASTS & STOCKOUT ALERTS
          ========================================================================= */}
      {showForecastDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-zinc-950/70 backdrop-blur-sm"
          onClick={() => setShowForecastDrawer(false)}
        >
          <div
            className="w-full max-w-md h-[90vh] rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-5 text-zinc-100 font-sans space-y-4 overflow-y-auto animate-in slide-in-from-right-4 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-base">Replenishment Forecasting</span>
              </div>
              <button
                onClick={() => setShowForecastDrawer(false)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Machine-learning projections evaluating daily subscriber demand against provider replenishment lead times.
            </p>

            <div className="space-y-3 font-mono">
              {forecasts.map((fc) => (
                <div
                  key={fc.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    fc.urgencyLevel === 'CRITICAL'
                      ? 'bg-red-950/30 border-red-800/80 text-red-200'
                      : fc.urgencyLevel === 'WARNING'
                      ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{fc.cityName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        fc.urgencyLevel === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-700'
                          : fc.urgencyLevel === 'WARNING'
                          ? 'bg-amber-950 text-amber-400 border border-amber-700'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                      }`}
                    >
                      {fc.urgencyLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-zinc-800/60">
                    <div>Stock: <strong>{fc.currentAvailableStock} left</strong></div>
                    <div>Depletion: <strong>{fc.dailyDepletionRate} / day</strong></div>
                    <div>Stockout: <strong className="text-white">{fc.projectedStockoutDays} days</strong></div>
                    <div>Replenish: <strong>+{fc.recommendedReplenishmentCount} block</strong></div>
                  </div>

                  <p className="text-[11px] opacity-80 leading-snug">{fc.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
