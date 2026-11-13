import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Phone,
  RefreshCw,
  ArrowRight,
  Layers,
  CheckCircle2,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { Button, CalloutBanner, KeyValueTable, Select, Tabs } from '../../design-system';
import { CustomerProduct, SubscriptionTier, TenantAccount } from '../../types/multiTenant';
import { PhoneNumberRecord } from '../../types/nms';
import { CustomerPortalView } from '../customer/CustomerPortalView';

export type CustomerPortalScreenId =
  | 'overview'
  | 'find_number'
  | 'configure_destination'
  | 'review_order'
  | 'track_order'
  | 'test_activate'
  | 'manage_line'
  | 'usage_billing'
  | 'full_portal';

export interface CustomerOrderDraft {
  orderId: string;
  market: string;
  numberType: 'Local' | 'Toll-Free' | 'Mobile';
  selectedNumber: string;
  forwardingMode: 'Forward to phone' | 'Connect SIP / PBX';
  destination: string;
  verificationStatus: 'In review' | 'Approved' | 'Action required';
  testPassed: boolean;
  activated: boolean;
  lastTestedAt: string;
}

export const INITIAL_CUSTOMER_ORDER: CustomerOrderDraft = {
  orderId: 'ORD-001',
  market: 'Sample launch market',
  numberType: 'Local',
  selectedNumber: '+27 ••• ••• 0142',
  forwardingMode: 'Forward to phone',
  destination: '+27 ••• ••• 0188',
  verificationStatus: 'In review',
  testPassed: true,
  activated: false,
  lastTestedAt: '2025-01-22 14:37:09 UTC'
};

const SAMPLE_CATALOG_NUMBERS: {
  e164: string;
  masked: string;
  market: string;
  type: 'Local' | 'Toll-Free' | 'Mobile';
  monthlyCredits: string;
}[] = [
  {
    e164: '+27105000410',
    masked: '+27 ••• ••• 410',
    market: 'Sample launch market',
    type: 'Local',
    monthlyCredits: '5.00 credits'
  },
  {
    e164: '+27105000728',
    masked: '+27 ••• ••• 728',
    market: 'Sample launch market',
    type: 'Local',
    monthlyCredits: '5.00 credits'
  },
  {
    e164: '+254205000142',
    masked: '+254 ••• ••• 142',
    market: 'Kenya Enterprise (KE)',
    type: 'Local',
    monthlyCredits: '5.00 credits'
  },
  {
    e164: '+23415008819',
    masked: '+234 ••• ••• 819',
    market: 'Nigeria Sovereign (NG)',
    type: 'Toll-Free',
    monthlyCredits: '12.00 credits'
  }
];

export const useCustomerPortalSidebar = (
  screen: CustomerPortalScreenId,
  onSelectScreen: (s: CustomerPortalScreenId) => void,
  order: CustomerOrderDraft,
  currentTenant: TenantAccount
) => {
  const stepMap: Record<CustomerPortalScreenId, number> = {
    overview: 1,
    find_number: 3,
    configure_destination: 4,
    review_order: 5,
    track_order: 5,
    test_activate: 5,
    manage_line: 5,
    usage_billing: 5,
    full_portal: 5
  };
  const currentStep = stepMap[screen] || 1;

  const setupSteps: {
    step: number;
    label: string;
    status: string;
    target: CustomerPortalScreenId;
    done: boolean;
  }[] = [
    {
      step: 1,
      label: 'Business details',
      status: 'Complete',
      target: 'overview',
      done: true
    },
    {
      step: 2,
      label: 'Verification',
      status: order.verificationStatus,
      target: 'track_order',
      done: order.verificationStatus === 'Approved' || order.activated
    },
    {
      step: 3,
      label: 'Choose number',
      status: order.selectedNumber ? 'Selected' : 'Pending',
      target: 'find_number',
      done: currentStep > 3 || order.activated
    },
    {
      step: 4,
      label: 'Call destination',
      status: order.destination ? 'Selected' : 'Pending',
      target: 'configure_destination',
      done: currentStep > 4 || order.activated
    },
    {
      step: 5,
      label: order.activated ? 'Activation' : 'Review & Activate',
      status: order.activated ? 'Active' : order.testPassed ? 'Ready' : 'Current',
      target: order.activated ? 'manage_line' : 'test_activate',
      done: order.activated
    }
  ];

  return (
    <div className="p-4 space-y-5">
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
          CLIENT PORTAL
        </div>
        <h2 className="text-lg font-extrabold text-black tracking-tight mt-0.5">
          Setup Progress
        </h2>
      </div>

      <div className="space-y-1.5">
        {setupSteps.map((s) => {
          const isCurrent = s.target === screen;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onSelectScreen(s.target)}
              className={`w-full text-left px-2.5 py-2 border flex items-center justify-between gap-2 text-xs cursor-pointer transition-colors ${
                isCurrent
                  ? 'border-black bg-zinc-100 font-bold'
                  : 'border-black/20 hover:border-black bg-white'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-5 h-5 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 border border-black ${
                    isCurrent || s.done ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {s.done && !isCurrent ? '✓' : s.step}
                </span>
                <span className="truncate text-black">{s.label}</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-600 shrink-0">{s.status}</span>
            </button>
          );
        })}
      </div>

      <KeyValueTable
        title="ACCOUNT SNAPSHOT"
        rows={[
          { key: 'ORGANIZATION', value: currentTenant.name },
          { key: 'ORDER REF', value: order.orderId },
          { key: 'PLAN TIER', value: currentTenant.subscription.displayName },
          { key: 'ACTIVE DIDS', value: String(currentTenant.usage.activeDids) },
          { key: 'WALLET', value: `$${currentTenant.usage.accountBalanceUsd.toLocaleString()}` }
        ]}
      />

      <div className="space-y-2 border-t border-black pt-3">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onSelectScreen('full_portal')}
        >
          OPEN FULL SELF-SERVICE SUITE
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => onSelectScreen('usage_billing')}
        >
          USAGE &amp; BILLING OVERVIEW
        </Button>
      </div>
    </div>
  );
};

interface CustomerPortalWorkspaceProps {
  screen: CustomerPortalScreenId;
  onSelectScreen: (s: CustomerPortalScreenId) => void;
  order: CustomerOrderDraft;
  onUpdateOrder: React.Dispatch<React.SetStateAction<CustomerOrderDraft>>;
  currentTenant: TenantAccount;
  activeCustomerTab: CustomerProduct;
  onSelectCustomerTab: (tab: CustomerProduct) => void;
  assignedNumbers: PhoneNumberRecord[];
  onOpenSoftphone: (number: PhoneNumberRecord) => void;
  onUpgradeSubscription: (tier: SubscriptionTier) => void;
  onDispatchTestSms?: (recipient: string, text: string) => void;
  onOrderNumber?: (newNumber: PhoneNumberRecord) => void;
  onTopUpBalance?: (amountUsd: number) => void;
  onOpenStressTest?: () => void;
  onOpenOnboarding?: () => void;
  onSwitchToOperatorOps: () => void;
  onShowToast: (msg: string) => void;
}

export const CustomerPortalWorkspace: React.FC<CustomerPortalWorkspaceProps> = ({
  screen,
  onSelectScreen,
  order,
  onUpdateOrder,
  currentTenant,
  activeCustomerTab,
  onSelectCustomerTab,
  assignedNumbers,
  onOpenSoftphone,
  onUpgradeSubscription,
  onDispatchTestSms,
  onOrderNumber,
  onTopUpBalance,
  onOpenStressTest,
  onOpenOnboarding,
  onSwitchToOperatorOps,
  onShowToast
}) => {
  const [searchMarket, setSearchMarket] = useState(order.market);
  const [searchType, setSearchType] = useState<'Local' | 'Toll-Free' | 'Mobile'>(order.numberType);
  const [customDestination, setCustomDestination] = useState(order.destination);

  const navTabs: { id: CustomerPortalScreenId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'find_number', label: 'Find Number' },
    { id: 'configure_destination', label: 'Setup' },
    { id: 'review_order', label: 'Review Order' },
    { id: 'track_order', label: 'Track ORD-001' },
    { id: 'test_activate', label: 'Test & Activate' },
    { id: 'manage_line', label: 'Manage Line' },
    { id: 'usage_billing', label: 'Usage & Billing' },
    { id: 'full_portal', label: 'Full Tenant Console' }
  ];

  const filteredCatalog = SAMPLE_CATALOG_NUMBERS.filter(
    (item) =>
      (searchMarket === 'All markets' || item.market === searchMarket) &&
      item.type === searchType
  );
  const visibleNumbers =
    filteredCatalog.length > 0 ? filteredCatalog : SAMPLE_CATALOG_NUMBERS.slice(0, 2);

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      {/* Top Client Sub-Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black pb-3">
        <div className="flex flex-wrap gap-1.5">
          {navTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectScreen(t.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border border-black cursor-pointer transition-colors ${
                screen === t.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Button variant="secondary" size="sm" onClick={onSwitchToOperatorOps}>
          VIEW IN OPERATOR QUEUE (MVP-001)
        </Button>
      </div>

      {/* CONCEPT OVERVIEW */}
      {screen === 'overview' && (
        <div className="space-y-6">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600">
              MVP-C01 · BUSINESS LINE SETUP
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mt-1">
              Get your business on MANDELA OS
            </h1>
            <p className="text-sm text-zinc-700 mt-1">
              Provision a sovereign African business number, configure inbound routing, and activate in five transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-black p-5 bg-white space-y-2">
              <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">STEP 1 · SETUP</div>
              <div className="text-lg font-extrabold text-black">Business number</div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Select a local, mobile, or toll-free E.164 number in supported African markets.
              </p>
            </div>
            <div className="border border-black p-5 bg-white space-y-2">
              <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">STEP 2 · ROUTING</div>
              <div className="text-lg font-extrabold text-black">Forwarding or SIP</div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Forward incoming calls to an existing mobile line or connect your enterprise PBX over TLS.
              </p>
            </div>
            <div className="border border-black p-5 bg-white space-y-2">
              <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">STEP 3 · BILLING</div>
              <div className="text-lg font-extrabold text-black">Starts at activation</div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Monthly rental (5.00 credits) and metered forwarding begin only after test verification passes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="md" onClick={() => onSelectScreen('find_number')}>
              Find a business number →
            </Button>
            <Button variant="secondary" size="md" onClick={() => onSelectScreen('track_order')}>
              Track active order ({order.orderId})
            </Button>
          </div>
        </div>
      )}

      {/* CONCEPT 001: FIND A BUSINESS NUMBER */}
      {screen === 'find_number' && (
        <div className="space-y-6">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600">Concept 001</div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
              Find a business number
            </h1>
            <p className="text-sm text-zinc-700 mt-1">
              Check availability for a business number in the sample launch market or regional exchanges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="border border-black p-5 bg-white space-y-4">
                <h2 className="text-lg font-extrabold text-black">Search</h2>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <label className="sm:col-span-4 text-sm font-bold text-black">Market:</label>
                  <div className="sm:col-span-8">
                    <Select
                      value={searchMarket}
                      onChange={(e) => setSearchMarket(e.target.value)}
                      options={[
                        { value: 'Sample launch market', label: 'Sample launch market' },
                        { value: 'Kenya Enterprise (KE)', label: 'Kenya Enterprise (KE)' },
                        { value: 'Nigeria Sovereign (NG)', label: 'Nigeria Sovereign (NG)' },
                        { value: 'All markets', label: 'All African markets' }
                      ]}
                    />
                  </div>

                  <label className="sm:col-span-4 text-sm font-bold text-black">Number type:</label>
                  <div className="sm:col-span-8">
                    <Select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value as any)}
                      options={[
                        { value: 'Local', label: 'Local' },
                        { value: 'Toll-Free', label: 'Toll-Free' },
                        { value: 'Mobile', label: 'Mobile' }
                      ]}
                    />
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onShowToast(`Searched ${searchType} availability in ${searchMarket}`)}
                >
                  Search
                </Button>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-lg font-extrabold text-black">Available numbers</h3>
                {visibleNumbers.map((num) => (
                  <div
                    key={num.e164}
                    className="border border-black p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-base font-extrabold text-black tabular-nums">
                        {num.masked}
                      </span>
                      <span className="text-xs text-zinc-600 border-l border-black/30 pl-4">
                        {num.type} · {num.market} · {num.monthlyCredits}/mo
                      </span>
                    </div>
                    <Button
                      variant={order.selectedNumber === num.masked ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => {
                        onUpdateOrder((prev) => ({
                          ...prev,
                          market: num.market,
                          numberType: num.type,
                          selectedNumber: num.masked
                        }));
                        onSelectScreen('configure_destination');
                      }}
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 border-l border-black pl-5 space-y-5">
              <div className="pb-4 border-b border-black/25">
                <h3 className="text-base font-extrabold text-black">Setup</h3>
                <p className="text-xs text-zinc-700 mt-1">
                  Add a business number and choose where incoming calls go.
                </p>
              </div>
              <div className="pb-4 border-b border-black/25">
                <h3 className="text-base font-extrabold text-black">Monthly rental</h3>
                <p className="text-xs text-zinc-700 mt-1">
                  Keep the number active for your business on a predictable monthly credit schedule.
                </p>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-black">Metered forwarding</h3>
                <p className="text-xs text-zinc-700 mt-1">
                  Forward incoming calls to a phone or connect an enterprise PBX with metered forwarding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESTINATION SETUP */}
      {screen === 'configure_destination' && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600">
              STEP 4 · CALL DESTINATION
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
              Choose where calls go
            </h1>
          </div>

          <div className="border border-black p-5 bg-white space-y-4">
            <KeyValueTable
              title="SELECTED BUSINESS NUMBER"
              rows={[
                { key: 'NUMBER', value: order.selectedNumber },
                { key: 'MARKET', value: order.market },
                { key: 'NUMBER TYPE', value: order.numberType }
              ]}
            />

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-black block">
                ROUTING MODE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['Forward to phone', 'Connect SIP / PBX'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onUpdateOrder((prev) => ({ ...prev, forwardingMode: m }))}
                    className={`p-3 border border-black text-left cursor-pointer ${
                      order.forwardingMode === m
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-sm">{m}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        order.forwardingMode === m ? 'text-zinc-300' : 'text-zinc-600'
                      }`}
                    >
                      {m === 'Forward to phone'
                        ? 'Ring an existing local or mobile number'
                        : 'Route over TLS to Kamailio / Asterisk / 3CX'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-black block">
                {order.forwardingMode === 'Forward to phone'
                  ? 'FORWARDING PHONE DESTINATION'
                  : 'SIP URI ENDPOINT'}
              </label>
              <input
                type="text"
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                className="w-full border border-black px-3 py-2 text-sm font-mono text-black bg-white"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onUpdateOrder((prev) => ({ ...prev, destination: customDestination }));
                  onSelectScreen('review_order');
                }}
              >
                Continue to review order →
              </Button>
              <Button variant="secondary" size="md" onClick={() => onSelectScreen('find_number')}>
                Change number
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONCEPT 002: REVIEW BUSINESS LINE ORDER */}
      {screen === 'review_order' && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-start justify-between gap-4 border-b border-black pb-3">
            <div>
              <div className="font-mono text-xs font-bold uppercase text-zinc-600">
                Order {order.orderId}
              </div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight">
                Review business line order
              </h1>
              <p className="text-xs text-zinc-600 mt-0.5">
                Review your order details, offer, and verification status before you submit.
              </p>
            </div>
            <span className="border border-black px-2.5 py-1 text-xs font-mono font-bold">
              Concept 002
            </span>
          </div>

          <div className="border border-black p-5 bg-white space-y-3">
            <KeyValueTable
              rows={[
                { key: 'Organization:', value: currentTenant.name },
                { key: 'Local business number:', value: order.selectedNumber },
                { key: 'Forwarding destination:', value: order.destination },
                { key: 'Verification:', value: order.verificationStatus }
              ]}
            />
          </div>

          <div className="border border-black p-5 bg-white space-y-3">
            <h2 className="text-lg font-extrabold text-black border-b border-black/20 pb-2">
              Offer summary
            </h2>
            <KeyValueTable
              rows={[
                { key: 'Setup:', value: '0.00 credits' },
                { key: 'Monthly:', value: '5.00 credits' },
                { key: 'Usage:', value: 'Metered' }
              ]}
            />
          </div>

          <CalloutBanner symbol="i" text="Billing begins at activation in this prototype." />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => onShowToast(`Draft order ${order.orderId} saved.`)}
            >
              Save draft
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                onShowToast(`Order ${order.orderId} submitted for provisioning.`);
                onSelectScreen('track_order');
              }}
            >
              Submit order
            </Button>
          </div>
        </div>
      )}

      {/* TRACK ORDER (ORD-001) */}
      {screen === 'track_order' && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600">
              ORDER TRACKER · {order.orderId}
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
              Track business line setup
            </h1>
          </div>

          <div className="border border-black divide-y divide-black/20 bg-white">
            {[
              { stage: 'Order submitted', detail: `${order.orderId} accepted into MANDELA provisioning queue`, state: 'Complete' },
              { stage: 'Business verification', detail: 'KYB corporate entity & regulator compliance review', state: order.verificationStatus },
              { stage: 'Number reservation', detail: `${order.selectedNumber} locked in sovereign pool`, state: 'Complete' },
              { stage: 'Carrier & SIP routing', detail: `${order.forwardingMode} → ${order.destination}`, state: 'Provisioned' },
              { stage: 'Test & Activation', detail: 'Verify inbound test call & enable line', state: order.activated ? 'Active' : 'Ready for test' }
            ].map((row) => (
              <div key={row.stage} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-black">{row.stage}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{row.detail}</div>
                </div>
                <span className="border border-black px-2 py-0.5 font-mono text-[11px] font-bold uppercase shrink-0">
                  {row.state}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="md" onClick={() => onSelectScreen('test_activate')}>
              Proceed to Test &amp; Activate →
            </Button>
            <Button variant="secondary" size="md" onClick={onSwitchToOperatorOps}>
              Inspect in MANDELA / Operations
            </Button>
          </div>
        </div>
      )}

      {/* CONCEPT 005: TEST AND ACTIVATE BUSINESS LINE */}
      {screen === 'test_activate' && (
        <div className="space-y-6 max-w-3xl">
          <div className="border-b border-black pb-3">
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Test and activate business line
            </h1>
            <p className="text-sm text-zinc-600 mt-0.5">
              Confirm test results and activate your business line.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-black">Test results</h2>
            <KeyValueTable
              rows={[
                { key: 'Business number', value: order.selectedNumber },
                { key: 'Destination', value: order.destination },
                {
                  key: 'Test evidence',
                  value: order.testPassed ? 'Test passed' : 'Test pending'
                },
                { key: 'Timestamp', value: order.lastTestedAt }
              ]}
            />
          </div>

          <div className="border-t border-b border-black/25 py-3 flex items-center justify-between text-sm">
            <span className="font-bold text-black">Monthly rental</span>
            <span className="text-zinc-700">Starts on activation.</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onUpdateOrder((prev) => ({
                  ...prev,
                  verificationStatus: 'Approved',
                  activated: true
                }));
                onShowToast(`Business line ${order.selectedNumber} activated!`);
                onSelectScreen('manage_line');
              }}
            >
              Activate line
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                const ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
                onUpdateOrder((prev) => ({ ...prev, testPassed: true, lastTestedAt: ts }));
                onShowToast(`Inbound loop test passed at ${ts}`);
              }}
            >
              Repeat test
            </Button>
          </div>
        </div>
      )}

      {/* CONCEPT 006: MANAGE BUSINESS LINE */}
      {screen === 'manage_line' && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-black pb-3">
            <div>
              <div className="font-mono text-xs font-bold uppercase text-zinc-600">
                CONCEPT 006 · ACTIVE SERVICE
              </div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
                Manage business line
              </h1>
            </div>
            <span className="bg-black text-white px-2.5 py-1 font-mono text-xs font-bold uppercase">
              {order.activated ? 'ACTIVE' : 'READY'}
            </span>
          </div>

          <KeyValueTable
            title="LINE CONFIGURATION"
            rows={[
              { key: 'BUSINESS NUMBER', value: order.selectedNumber },
              { key: 'FORWARDING TO', value: order.destination },
              { key: 'ROUTING MODE', value: order.forwardingMode },
              { key: 'MONTHLY RENTAL', value: '5.00 credits / month' },
              { key: 'ORDER REFERENCE', value: order.orderId }
            ]}
          />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const target = assignedNumbers[0];
                if (target) onOpenSoftphone(target);
                else onShowToast('Softphone test call placed to ' + order.selectedNumber);
              }}
            >
              <Phone className="w-4 h-4 mr-1.5 inline" />
              Place live test call
            </Button>
            <Button variant="secondary" size="md" onClick={() => onSelectScreen('configure_destination')}>
              Update destination
            </Button>
            <Button variant="secondary" size="md" onClick={() => onSelectScreen('usage_billing')}>
              View usage &amp; billing
            </Button>
          </div>
        </div>
      )}

      {/* USAGE & BILLING OVERVIEW */}
      {screen === 'usage_billing' && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600">
              USAGE &amp; BILLING OVERVIEW
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
              Usage and billing overview
            </h1>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
            <div className="border border-black p-4 bg-white">
              <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">BALANCE</div>
              <div className="text-2xl font-extrabold text-black mt-1">
                ${currentTenant.usage.accountBalanceUsd.toLocaleString()}
              </div>
            </div>
            <div className="border border-black p-4 bg-white">
              <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">MONTH SPEND</div>
              <div className="text-2xl font-extrabold text-black mt-1">
                ${currentTenant.usage.currentMonthSpendUsd.toLocaleString()}
              </div>
            </div>
            <div className="border border-black p-4 bg-white">
              <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">ACTIVE DIDS</div>
              <div className="text-2xl font-extrabold text-black mt-1">
                {currentTenant.usage.activeDids}
              </div>
            </div>
            <div className="border border-black p-4 bg-white">
              <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">VOICE MINS</div>
              <div className="text-2xl font-extrabold text-black mt-1">
                {currentTenant.usage.voiceMinutesThisMonth.toLocaleString()}
              </div>
            </div>
          </div>

          <KeyValueTable
            title="CURRENT BILLING CYCLE BREAKDOWN"
            rows={[
              { key: 'SUBSCRIPTION PLAN', value: currentTenant.subscription.displayName },
              { key: 'BASE PLATFORM FEE', value: `$${currentTenant.subscription.monthlyFeeUsd}/mo` },
              { key: 'SMS DELIVERED', value: `${currentTenant.usage.smsDeliveredThisMonth.toLocaleString()} msgs` },
              { key: 'PROTOTYPE ORDER ORD-001', value: '5.00 credits / mo (Metered forwarding)' }
            ]}
          />

          <div className="flex flex-wrap gap-3">
            {onTopUpBalance && (
              <Button variant="primary" size="sm" onClick={() => onTopUpBalance(500)}>
                TOP UP +$500 CREDITS
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => onSelectScreen('full_portal')}>
              OPEN FULL BILLING &amp; API KEYS
            </Button>
          </div>
        </div>
      )}

      {/* EMBEDDED FULL SELF-SERVICE TENANT CONSOLE */}
      {screen === 'full_portal' && (
        <div className="space-y-4">
          <CustomerPortalView
            currentTenant={currentTenant}
            activeCustomerTab={activeCustomerTab}
            onSelectCustomerTab={onSelectCustomerTab}
            assignedNumbers={assignedNumbers}
            onOpenSoftphone={onOpenSoftphone}
            onUpgradeSubscription={onUpgradeSubscription}
            onDispatchTestSms={onDispatchTestSms}
            onOrderNumber={onOrderNumber}
            onTopUpBalance={onTopUpBalance}
            onOpenStressTest={onOpenStressTest}
            onOpenOnboarding={onOpenOnboarding}
          />
        </div>
      )}
    </div>
  );
};
