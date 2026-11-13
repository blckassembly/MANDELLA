import React, { useState } from 'react';
import {
  TenantAccount,
  CustomerProduct,
  SubscriptionTier
} from '../../types/multiTenant';
import { SUBSCRIPTION_TIERS } from '../../data/mockMultiTenantData';
import { PhoneNumberRecord } from '../../types/nms';
import {
  TrendingUp,
  MessageSquare,
  Phone,
  Database,
  CreditCard,
  Key,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  FileText,
  Download,
  Send,
  Zap,
  ShoppingBag,
  LifeBuoy,
  Play,
  Pause,
  Volume2,
  Radio,
  Plus,
  RefreshCw,
  Clock,
  Check,
  X,
  Layers,
  Activity,
  QrCode,
  Smartphone,
  Globe
} from 'lucide-react';

interface CustomerPortalViewProps {
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
}

export interface StorefrontNumberItem extends PhoneNumberRecord {
  city: string;
  kycLevel: string;
}

// Rich mock catalog of available sovereign DIDs across Africa
const STOREFRONT_NUMBERS: StorefrontNumberItem[] = [
  {
    id: 'did-ke-nbo-01',
    e164: '+254700892104',
    nationalFormat: '0700 892 104',
    countryCode: 'KE',
    countryName: 'Kenya',
    city: 'Nairobi',
    type: 'mobile',
    status: 'available',
    carrier: 'Safaricom Anycast Interconnect',
    monthlyFeeUsd: 2.50,
    perMinInboundUsd: 0.015,
    perSmsUsd: 0.0042,
    features: ['voice', 'sms'],
    kycVerified: true,
    kycLevel: 'Level 3 - Enterprise Attested'
  },
  {
    id: 'did-za-jhb-02',
    e164: '+27118849201',
    nationalFormat: '011 884 9201',
    countryCode: 'ZA',
    countryName: 'South Africa',
    city: 'Johannesburg',
    type: 'fixed',
    status: 'available',
    carrier: 'Vodacom Carrier Route',
    monthlyFeeUsd: 4.00,
    perMinInboundUsd: 0.018,
    perSmsUsd: 0.005,
    features: ['voice', 'sms'],
    kycVerified: true,
    kycLevel: 'Level 3 - FICA Verified'
  },
  {
    id: 'did-ng-los-03',
    e164: '+23412984402',
    nationalFormat: '01 298 4402',
    countryCode: 'NG',
    countryName: 'Nigeria',
    city: 'Lagos',
    type: 'fixed',
    status: 'available',
    carrier: 'MTN Nigeria Core SIP',
    monthlyFeeUsd: 3.50,
    perMinInboundUsd: 0.02,
    perSmsUsd: 0.0045,
    features: ['voice', 'sms'],
    kycVerified: true,
    kycLevel: 'Level 3 - NDPR Sovereign'
  },
  {
    id: 'did-eg-cai-04',
    e164: '+20233498120',
    nationalFormat: '02 3349 8120',
    countryCode: 'EG',
    countryName: 'Egypt',
    city: 'Cairo',
    type: 'fixed',
    status: 'available',
    carrier: 'Telecom Egypt Interconnect',
    monthlyFeeUsd: 3.80,
    perMinInboundUsd: 0.022,
    perSmsUsd: 0.006,
    features: ['voice', 'sms'],
    kycVerified: true,
    kycLevel: 'Level 2 - NTRA Compliant'
  },
  {
    id: 'did-gh-acc-05',
    e164: '+233302918021',
    nationalFormat: '030 291 8021',
    countryCode: 'GH',
    countryName: 'Ghana',
    city: 'Accra',
    type: 'fixed',
    status: 'available',
    carrier: 'MTN Ghana Anycast Gateway',
    monthlyFeeUsd: 2.90,
    perMinInboundUsd: 0.018,
    perSmsUsd: 0.0048,
    features: ['voice', 'sms'],
    kycVerified: true,
    kycLevel: 'Level 2 - NCA Attested'
  },
  {
    id: 'did-rw-kgl-06',
    e164: '+250788194002',
    nationalFormat: '0788 194 002',
    countryCode: 'RW',
    countryName: 'Rwanda',
    city: 'Kigali',
    type: 'mobile',
    status: 'available',
    carrier: 'Airtel Rwanda Fibre Hub',
    monthlyFeeUsd: 2.20,
    perMinInboundUsd: 0.014,
    perSmsUsd: 0.0038,
    features: ['voice', 'sms'],
    kycVerified: true,
    kycLevel: 'Level 3 - RURA Verified'
  },
  {
    id: 'did-sat-ntn-07',
    e164: '+88216902441',
    nationalFormat: '+882 16 902 441',
    countryCode: 'SAT',
    countryName: 'Orbital NTN (Pan-Africa)',
    city: 'LEO Orbit',
    type: 'toll-free',
    status: 'available',
    carrier: '3GPP Rel-17 Direct-to-Cell LEO',
    monthlyFeeUsd: 15.00,
    perMinInboundUsd: 0.045,
    perSmsUsd: 0.012,
    features: ['voice', 'sms'],
    kycVerified: true,
    kycLevel: 'Level 3 - ITU-R Sovereign'
  }
];

// Rich customer Call Detail Records (CDRs)
interface CustomerCdr {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  durationSec: number;
  mosScore: number;
  codec: string;
  costUsd: number;
  status: 'answered' | 'busy' | 'no_answer';
  transcriptSnippet: string;
  bilingualLanguage: string;
  bilingualSnippet: string;
}

const CUSTOMER_CDRS: CustomerCdr[] = [
  {
    id: 'cdr-9014-ke',
    timestamp: '2026-10-17 18:24:12',
    direction: 'inbound',
    from: '+254712994012',
    to: '+254700000001',
    durationSec: 184,
    mosScore: 4.42,
    codec: 'Opus HD (48kHz)',
    costUsd: 0.038,
    status: 'answered',
    transcriptSnippet: 'Caller verified identity using biometric voice recognition. Inquired about wholesale Kenyan maize payment settlement.',
    bilingualLanguage: 'Swahili',
    bilingualSnippet: 'Mteja amethibitisha utambulisho kwa sauti. Aliuliza kuhusu malipo ya mahindi ya Kenya.'
  },
  {
    id: 'cdr-9013-za',
    timestamp: '2026-10-17 18:02:44',
    direction: 'outbound',
    from: '+27118849201',
    to: '+27823456789',
    durationSec: 72,
    mosScore: 4.38,
    codec: 'AMR-WB (16kHz)',
    costUsd: 0.015,
    status: 'answered',
    transcriptSnippet: 'Automated 2FA security challenge dispatched via voice call. Customer pressed 1 to approve high-value EFT.',
    bilingualLanguage: 'Zulu',
    bilingualSnippet: 'Ucingo lokuphepha lwe-2FA luthunyelwe ngokuzenzakalelayo. Ikhasimende licindezele u-1 ukuze liqinisekise ukudluliswa kwemali.'
  },
  {
    id: 'cdr-9012-ng',
    timestamp: '2026-10-17 17:45:19',
    direction: 'inbound',
    from: '+2348031234567',
    to: '+23412984402',
    durationSec: 240,
    mosScore: 4.29,
    codec: 'G.711u (8kHz)',
    costUsd: 0.048,
    status: 'answered',
    transcriptSnippet: 'Customer service inquiry for fintech wallet integration. Call handled through Lagos Kamailio Anycast PoP.',
    bilingualLanguage: 'Yoruba',
    bilingualSnippet: 'Oníbàárà béèrè nípa ìṣọ̀kan àpò owó orí ẹ̀rọ. Ìpè náà kọjá ní ibùdó Kamailio ní Èkó.'
  },
  {
    id: 'cdr-9011-sat',
    timestamp: '2026-10-17 17:10:05',
    direction: 'inbound',
    from: '+88216902441',
    to: '+254700000001',
    durationSec: 95,
    mosScore: 4.15,
    codec: 'Opus HD (48kHz)',
    costUsd: 0.092,
    status: 'answered',
    transcriptSnippet: 'Emergency offshore maritime alert relayed via 3GPP Rel-17 LEO satellite direct-to-device constellation.',
    bilingualLanguage: 'Swahili',
    bilingualSnippet: 'Tahadhari ya dharura ya baharini imetumwa kupitia satelaiti ya Rel-17 direct-to-cell.'
  },
  {
    id: 'cdr-9010-rw',
    timestamp: '2026-10-17 16:32:51',
    direction: 'outbound',
    from: '+250788194002',
    to: '+250788001122',
    durationSec: 42,
    mosScore: 4.45,
    codec: 'Opus HD (48kHz)',
    costUsd: 0.009,
    status: 'answered',
    transcriptSnippet: 'IVR verification confirmation for cross-border logistics dispatch from Kigali dry port.',
    bilingualLanguage: 'French',
    bilingualSnippet: 'Confirmation de vérification IVR pour expédition logistique transfrontalière du port sec de Kigali.'
  }
];

// Rich customer invoices
interface CustomerInvoice {
  id: string;
  period: string;
  date: string;
  amountUsd: number;
  paymentMethod: string;
  status: 'paid' | 'settled' | 'processing';
  itemsCount: number;
}

const CUSTOMER_INVOICES: CustomerInvoice[] = [
  {
    id: 'INV-2026-010',
    period: 'Oct 01 - Oct 31, 2026',
    date: '2026-10-15',
    amountUsd: 2450.00,
    paymentMethod: 'M-Pesa Business Till 891024',
    status: 'paid',
    itemsCount: 14
  },
  {
    id: 'INV-2026-009',
    period: 'Sep 01 - Sep 30, 2026',
    date: '2026-09-30',
    amountUsd: 1980.50,
    paymentMethod: 'Flutterwave NGN Settlement',
    status: 'settled',
    itemsCount: 11
  },
  {
    id: 'INV-2026-008',
    period: 'Aug 01 - Aug 31, 2026',
    date: '2026-08-31',
    amountUsd: 1450.00,
    paymentMethod: 'ABSA Bank Corporate Wire',
    status: 'settled',
    itemsCount: 8
  },
  {
    id: 'INV-2026-007',
    period: 'Jul 01 - Jul 31, 2026',
    date: '2026-07-31',
    amountUsd: 1450.00,
    paymentMethod: 'Prepaid Balance Auto-Draft',
    status: 'settled',
    itemsCount: 8
  }
];

// Rich customer support tickets
interface CustomerTicket {
  id: string;
  subject: string;
  product: string;
  priority: 'P1 - Critical' | 'P2 - High' | 'P3 - Standard';
  status: 'in_progress' | 'resolved' | 'pending_noc';
  createdAt: string;
  assignee: string;
  lastReply: string;
}

const INITIAL_CUSTOMER_TICKETS: CustomerTicket[] = [
  {
    id: 'TKT-9481',
    subject: 'BGP Anycast routing latency optimization for Mombasa IXP undersea fiber',
    product: 'Carrier SBC / BGP',
    priority: 'P2 - High',
    status: 'in_progress',
    createdAt: '2026-10-17 14:10',
    assignee: 'NOC Lead (Nairobi Hub)',
    lastReply: 'Route converged. Latency reduced from 34ms to 11.2ms over TEAMS cable.'
  },
  {
    id: 'TKT-9420',
    subject: 'SMPP bind throughput request: bump window size to 10,000 CPS for flash election poll',
    product: 'SMS & Messaging',
    priority: 'P1 - Critical',
    status: 'resolved',
    createdAt: '2026-10-16 09:30',
    assignee: 'Core Messaging Architect',
    lastReply: 'Window buffer expanded to 10,000 CPS with zero dropped DLRs.'
  },
  {
    id: 'TKT-9388',
    subject: 'STIR/SHAKEN Level-A certificate renewal for South Africa ICASA compliance',
    product: 'Edge Defense / Compliance',
    priority: 'P3 - Standard',
    status: 'resolved',
    createdAt: '2026-10-12 11:45',
    assignee: 'Regulatory & Trust Officer',
    lastReply: 'X.509 passport certificate signed by African Root CA and active.'
  }
];

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
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
  onOpenOnboarding
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [testRecipient, setTestRecipient] = useState('+254712345678');
  const [testMessage, setTestMessage] = useState('Your OTP code for Mandela Secure is 849201. Valid for 5 minutes.');
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // eSIM Modal State
  const [showEsimModal, setShowEsimModal] = useState(false);
  const [esimProfile, setEsimProfile] = useState<{
    e164: string;
    eid: string;
    iccid: string;
    lpaString: string;
    smdpServer: string;
    pin: string;
    puk: string;
  } | null>(null);

  // Audio Playback Simulation State
  const [playingCdrId, setPlayingCdrId] = useState<string | null>(null);
  const [selectedCdrForAudio, setSelectedCdrForAudio] = useState<CustomerCdr | null>(null);

  // Balance Top-up Modal State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [topUpPaymentMethod, setTopUpPaymentMethod] = useState<'mpesa' | 'flutterwave' | 'card' | 'wire'>('mpesa');

  // New Support Ticket Modal State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [tickets, setTickets] = useState<CustomerTicket[]>(INITIAL_CUSTOMER_TICKETS);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketProduct, setNewTicketProduct] = useState('Voice & IVR Core');
  const [newTicketPriority, setNewTicketPriority] = useState<'P1 - Critical' | 'P2 - High' | 'P3 - Standard'>('P2 - High');
  const [newTicketDescription, setNewTicketDescription] = useState('');

  // Webhook Test Console State
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.site/mandela-enterprise-hook');
  const [webhookEventType, setWebhookEventType] = useState<'sms.delivered' | 'call.answered' | 'esim.attested' | 'cdr.generated'>('sms.delivered');
  const [webhookResult, setWebhookResult] = useState<{
    status: number;
    latencyMs: number;
    signature: string;
    payload: string;
  } | null>(null);
  const [isFiringWebhook, setIsFiringWebhook] = useState(false);

  const plan = currentTenant.subscription;
  const usage = currentTenant.usage;
  const limits = plan.limits;

  const smsPercent = Math.min(100, Math.round((usage.smsDeliveredThisMonth / limits.monthlySmsQuota) * 100));
  const storagePercent = Math.min(100, Math.round((usage.dataverseStorageMb / limits.maxDataverseStorageMb) * 100));

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(currentTenant.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (onDispatchTestSms) {
      onDispatchTestSms(testRecipient, testMessage);
    }
    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 3000);
  };

  const handleOpenEsimModal = (number: PhoneNumberRecord) => {
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const lpa = `LPA:1$smdp.mandela.africa$9028-AFRICA-${randomHex}`;
    setEsimProfile({
      e164: number.e164,
      eid: `890490320000010000000000${randomHex}892`,
      iccid: `8925402000009182${randomHex}`,
      lpaString: lpa,
      smdpServer: 'smdp.mandela.africa',
      pin: '1234',
      puk: '98402144'
    });
    setShowEsimModal(true);
  };

  const handleOrderStorefrontNumber = (num: PhoneNumberRecord) => {
    if (onOrderNumber) {
      const provisionedNumber: PhoneNumberRecord = {
        ...num,
        id: `did-prov-${Date.now()}`,
        status: 'assigned',
        sipTrunkUri: `sip:${num.e164.replace('+', '')}@nbo-sbc.mandela.africa:5060`,
        allocatedAt: new Date().toISOString()
      };
      onOrderNumber(provisionedNumber);
    }
  };

  const handleExecuteTopUp = () => {
    if (onTopUpBalance) {
      onTopUpBalance(topUpAmount);
    }
    setShowTopUpModal(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim()) return;
    const newTkt: CustomerTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicketSubject,
      product: newTicketProduct,
      priority: newTicketPriority,
      status: 'pending_noc',
      createdAt: 'Just now',
      assignee: 'Auto-Dispatched to Tier 3 On-Call NOC',
      lastReply: 'Ticket received. Automated SLA timer engaged. Engineer response in < 15 mins.'
    };
    setTickets([newTkt, ...tickets]);
    setNewTicketSubject('');
    setNewTicketDescription('');
    setShowTicketModal(false);
  };

  const handleFireWebhook = () => {
    setIsFiringWebhook(true);
    setWebhookResult(null);
    setTimeout(() => {
      const mockPayload = JSON.stringify(
        {
          event: webhookEventType,
          tenant_id: currentTenant.id,
          timestamp: new Date().toISOString(),
          data: {
            msisdn: '+254700000001',
            status: 'DELIVERED',
            dlr_latency_sec: 0.038,
            carrier_route: 'Safaricom Direct Anycast AS37105',
            cost_usd: 0.0042
          }
        },
        null,
        2
      );

      setIsFiringWebhook(false);
      setWebhookResult({
        status: 200,
        latencyMs: 38,
        signature: 'sha256=9b72a4f1082c9e7019f30b912384a51e6b30f81a7b8e1928374a',
        payload: mockPayload
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Tenant Identity Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 border ${currentTenant.accentColor}`}
          >
            {currentTenant.logoInitial}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-bold text-white tracking-tight">
                {currentTenant.name}
              </h1>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${plan.badgeColor}`}>
                {plan.displayName}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Tenancy · 99.999% SLA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Customer Self-Service Workspace · {currentTenant.region} · Tenant ID:{' '}
              <span className="font-mono text-slate-300">{currentTenant.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onSelectCustomerTab('storefront')}
            className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order DIDs &amp; eSIMs</span>
          </button>
          <button
            onClick={() => setShowTopUpModal(true)}
            className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs rounded border border-zinc-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Top Up Balance</span>
          </button>
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs rounded border border-zinc-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Launch Guided Onboarding & KYC Verification Flow"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Onboarding &amp; KYC</span>
            </button>
          )}
          {onOpenStressTest && (
            <button
              onClick={onOpenStressTest}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Launch All-Architecture Full-Stack Stress Engine"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Stress Fleet</span>
            </button>
          )}
        </div>
      </div>

      {/* Customer Portal Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium scrollbar-none">
        {[
          { id: 'overview', label: 'Usage & Overview', icon: TrendingUp },
          { id: 'services', label: `My Communications (${assignedNumbers.length} DIDs)`, icon: Phone },
          { id: 'storefront', label: 'Order Numbers & eSIM', icon: ShoppingBag },
          { id: 'cdrs', label: 'Live CDRs & Audio', icon: FileText },
          { id: 'api_keys', label: 'Developer API & Webhooks', icon: Key },
          { id: 'billing', label: 'Invoices & Quotas', icon: CreditCard },
          { id: 'support', label: `Support Tickets (${tickets.length})`, icon: LifeBuoy },
          { id: 'sla', label: 'SLA & Sovereign Terms', icon: ShieldCheck }
        ].map((tab) => {
          const isSelected = activeCustomerTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectCustomerTab(tab.id as CustomerProduct)}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeCustomerTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>SMS Messages Delivered</span>
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold font-mono text-white mt-2">
                {usage.smsDeliveredThisMonth.toLocaleString()}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Quota: {limits.monthlySmsQuota.toLocaleString()}</span>
                <span className="text-emerald-400 font-mono">{smsPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-1">
                <div
                  className="bg-emerald-400 h-1 rounded-full transition-all"
                  style={{ width: `${smsPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Voice Minutes Used</span>
                <Phone className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold font-mono text-white mt-2">
                {usage.voiceMinutesThisMonth.toLocaleString()} min
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Peak Concurrency: {limits.maxVoiceChannels} channels</span>
                <span className="text-amber-400 font-mono">ASR 50 Langs</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-1">
                <div className="bg-amber-400 h-1 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Dataverse Storage</span>
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold font-mono text-white mt-2">
                {usage.dataverseStorageMb.toFixed(1)} MB
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total: {limits.maxDataverseStorageMb} MB</span>
                <span className="text-cyan-400 font-mono">{storagePercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-1">
                <div
                  className="bg-cyan-400 h-1 rounded-full"
                  style={{ width: `${storagePercent}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Prepaid Balance</span>
                <CreditCard className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-2">
                ${usage.accountBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Plan: ${plan.monthlyFeeUsd.toLocaleString()}/mo</span>
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold cursor-pointer"
                >
                  + Add Funds
                </button>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-1">
                <div className="bg-purple-400 h-1 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Active Services Quick View & Quick Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Provisioned DIDs and Quick Dialer (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Active Phone Numbers &amp; Routing</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned DIDs under {currentTenant.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {assignedNumbers.length} of {limits.didsIncluded} included
                  </span>
                  <button
                    onClick={() => onSelectCustomerTab('storefront')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Buy More</span>
                  </button>
                </div>
              </div>

              {assignedNumbers.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No numbers assigned yet.{' '}
                  <button
                    onClick={() => onSelectCustomerTab('storefront')}
                    className="text-emerald-400 underline font-semibold cursor-pointer"
                  >
                    Order from Storefront
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {assignedNumbers.slice(0, 4).map((num) => (
                    <div
                      key={num.e164}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-4 font-mono text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{num.e164}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {num.countryCode}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-sans">
                            {num.sipTrunkUri ? 'SIP Trunk' : num.webhookUrl ? 'Webhook' : 'IVR Hotline'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                          Target: {num.sipTrunkUri || num.webhookUrl || 'sip:ivr-router@mandela.africa'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenEsimModal(num)}
                          className="px-2.5 py-1 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-500/30 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="Generate GSMA SGP.22 eSIM QR Code"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>eSIM</span>
                        </button>
                        <button
                          onClick={() => onOpenSoftphone(num)}
                          className="px-2.5 py-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-500/30 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call In</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Quick SMS Dispatch Test (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Quick SMS Sandbox Test</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Direct SMPP v5 dispatch with USSD fallback
                  </p>
                </div>
              </div>

              {smsSentNotice && (
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Message dispatched via direct carrier route! Status: DELIVERED (DLR 0.04s)</span>
                </div>
              )}

              <form onSubmit={handleSendTestSms} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Destination Mobile (MSISDN)</label>
                  <input
                    type="text"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Message Body</label>
                  <textarea
                    rows={3}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Routing: Auto (Least-Cost + 98% Delivery SLA)</span>
                  <span className="font-mono text-emerald-400">$0.0042 / msg</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Dispatch SMS via SMPP</span>
                </button>
              </form>
            </div>
          </div>

          {/* Recent Tenant Activity Telemetry Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Workspace Telemetry &amp; Carrier Ingestion</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">0.00% Packet Loss</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                <div className="text-[11px] text-slate-400">Active BGP Anycast PoP</div>
                <div className="font-bold text-white mt-1">Nairobi Primary (NBO-01)</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">11.4ms round-trip latency</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                <div className="text-[11px] text-slate-400">SMPP Session Bind</div>
                <div className="font-bold text-white mt-1">TX/RX Transceiver Active</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">10,000 max window capacity</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                <div className="text-[11px] text-slate-400">Cryptographic Keyspace</div>
                <div className="font-bold text-white mt-1">{currentTenant.dataIsolationMode}</div>
                <div className="text-[10px] text-cyan-400 mt-1 font-mono">{currentTenant.encryptionKeyAlias}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY COMMUNICATIONS ================= */}
      {activeCustomerTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Assigned Numbers &amp; Hotlines</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage incoming call and SMS behavior for all your sovereign numbers
                </p>
              </div>
              <button
                onClick={() => onSelectCustomerTab('storefront')}
                className="py-1.5 px-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Order New DID</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedNumbers.map((num) => (
                <div
                  key={num.e164}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-white">{num.e164}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      Active Line
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div>
                      Country:{' '}
                      <strong className="text-slate-200">
                        {num.countryCode} ({num.countryName})
                      </strong>
                    </div>
                    <div>
                      Regulatory Compliance:{' '}
                      <span className="text-emerald-400">KYC Verified &amp; Sovereign Attested</span>
                    </div>
                    <div>
                      Routing Mode:{' '}
                      <span className="font-mono text-amber-300">
                        {num.sipTrunkUri ? 'SIP Trunk' : num.webhookUrl ? 'Webhook' : 'IVR Hotline'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenSoftphone(num)}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Test Call</span>
                      </button>
                      <button
                        onClick={() => handleOpenEsimModal(num)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>eSIM QR</span>
                      </button>
                    </div>
                    <span className="text-xs font-mono text-slate-500 truncate">ID: {num.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: STOREFRONT (NUMBERS & ESIM) ================= */}
      {activeCustomerTab === 'storefront' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Sovereign Phone Numbers &amp; eSIM Storefront</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant self-service procurement of verified African national DIDs and satellite direct-to-cell lines
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Direct Provisioning SLA: &lt; 2.5 seconds
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STOREFRONT_NUMBERS.map((item) => {
                const isAlreadyAssigned = assignedNumbers.some((n) => n.e164 === item.e164);
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold font-mono text-white tracking-tight">
                          {item.e164}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.countryCode}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 space-y-1">
                        <div>
                          Location:{' '}
                          <span className="text-slate-200 font-medium">
                            {item.city}, {item.countryName}
                          </span>
                        </div>
                        <div>
                          Carrier:{' '}
                          <span className="text-slate-300 font-mono text-[11px]">{item.carrier}</span>
                        </div>
                        <div>
                          Compliance:{' '}
                          <span className="text-emerald-400 text-[11px]">{item.kycLevel}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            Voice {item.features.includes('voice') ? '✓' : '✗'}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            SMS {item.features.includes('sms') ? '✓' : '✗'}
                          </span>
                          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded">
                            eSIM Ready
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          ${item.monthlyFeeUsd.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500"> /mo</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEsimModal(item)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs transition-colors cursor-pointer"
                          title="Preview GSMA SGP.22 eSIM QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isAlreadyAssigned}
                          onClick={() => handleOrderStorefrontNumber(item)}
                          className={`px-3 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                            isAlreadyAssigned
                              ? 'bg-slate-800 text-slate-500 cursor-default'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                          }`}
                        >
                          {isAlreadyAssigned ? 'Assigned' : 'Order DID'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: LIVE CDRS & AUDIO ================= */}
      {activeCustomerTab === 'cdrs' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Call Detail Records (CDRs) &amp; Biometric Audio Explorer</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time mediated call records with MOS quality scores, bilingual transcripts, and playback
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Streaming via Kafka Consumer Group: <strong className="text-slate-200">cdr-mediation-v2</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Call ID / Time</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Caller (From)</th>
                    <th className="py-2.5 px-3">Destination (To)</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Codec / MOS</th>
                    <th className="py-2.5 px-3">Cost</th>
                    <th className="py-2.5 px-3 text-right">Playback &amp; Transcript</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {CUSTOMER_CDRS.map((cdr) => (
                    <tr key={cdr.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{cdr.id}</div>
                        <div className="text-[10px] text-slate-400">{cdr.timestamp}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-sans px-1.5 py-0.5 rounded font-semibold ${
                            cdr.direction === 'inbound'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-amber-500/10 text-amber-300'
                          }`}
                        >
                          {cdr.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-bold">{cdr.from}</td>
                      <td className="py-3 px-3 text-slate-300">{cdr.to}</td>
                      <td className="py-3 px-3 text-slate-300">
                        {Math.floor(cdr.durationSec / 60)}m {cdr.durationSec % 60}s
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-[11px] text-slate-200">{cdr.codec}</div>
                        <div className="text-[10px] text-emerald-400 font-bold">
                          MOS {cdr.mosScore.toFixed(2)} (High Def)
                        </div>
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        ${cdr.costUsd.toFixed(3)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedCdrForAudio(cdr);
                            setPlayingCdrId(playingCdrId === cdr.id ? null : cdr.id);
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-sans font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                            playingCdrId === cdr.id
                              ? 'bg-emerald-400 text-slate-950 font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {playingCdrId === cdr.id ? (
                            <>
                              <Pause className="w-3 h-3" />
                              <span>Playing</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audio Waveform & Transcript Drawer if CDR selected */}
            {selectedCdrForAudio && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 mt-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      Encrypted Audio Stream · {selectedCdrForAudio.id} ({selectedCdrForAudio.codec})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCdrForAudio(null);
                      setPlayingCdrId(null);
                    }}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕ Close Player
                  </button>
                </div>

                {/* Animated simulated waveform */}
                <div className="flex items-center gap-1 h-8 px-2 bg-slate-900 rounded-md overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const heightPercent = playingCdrId
                      ? Math.max(15, Math.floor(Math.sin(i * 0.4 + Date.now() * 0.005) * 45 + 50))
                      : (i % 5) * 15 + 20;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-xs transition-all duration-150 ${
                          playingCdrId ? 'bg-emerald-400' : 'bg-slate-700'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>

                {/* Bilingual Transcripts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      English Transcription (Whisper v3 Sovereign)
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      "{selectedCdrForAudio.transcriptSnippet}"
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">
                      {selectedCdrForAudio.bilingualLanguage} Translation &amp; Sentiment
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans italic">
                      "{selectedCdrForAudio.bilingualSnippet}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 5: DEVELOPER API & WEBHOOKS ================= */}
      {activeCustomerTab === 'api_keys' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Developer API Key &amp; Tenant Authentication</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Use your sovereign bearer token to access Mandela Voice, SMS, eSIM, and Dataverse APIs
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Production API Key
                </span>
                <span className="text-xs text-emerald-400 font-mono">Active · No Expiration</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentTenant.apiKey}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-emerald-300"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Tenant Header:{' '}
                <span className="text-slate-200">X-Mandela-Tenant-Id: {currentTenant.id}</span>
              </div>
            </div>

            {/* Interactive Webhook Simulator */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Interactive Webhook Dispatch Tester
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Test live webhook payload delivery with HMAC-SHA256 signature verification
                  </p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  HTTP POST
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium">Target Webhook URL</label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium">Event Type</label>
                  <select
                    value={webhookEventType}
                    onChange={(e) => setWebhookEventType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="sms.delivered">sms.delivered</option>
                    <option value="call.answered">call.answered</option>
                    <option value="esim.attested">esim.attested</option>
                    <option value="cdr.generated">cdr.generated</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleFireWebhook}
                disabled={isFiringWebhook}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isFiringWebhook ? 'Dispatching Webhook...' : 'Fire Test Webhook'}</span>
              </button>

              {webhookResult && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs font-mono animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">
                      HTTP {webhookResult.status} OK · Latency: {webhookResult.latencyMs}ms
                    </span>
                    <span className="text-slate-400 truncate max-w-xs">
                      X-Mandela-Signature: {webhookResult.signature.substring(0, 24)}...
                    </span>
                  </div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto leading-relaxed p-2 bg-slate-950 rounded">
                    {webhookResult.payload}
                  </pre>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Quick Integration Example (cURL)
              </span>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.mandela.africa/v1/messaging/sms \\
  -H "Authorization: Bearer ${currentTenant.apiKey}" \\
  -H "X-Mandela-Tenant-Id: ${currentTenant.id}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+254700000001",
    "message": "Welcome to our service",
    "delivery_guarantee": "98_percent_ussd_fallback"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: BILLING & INVOICES ================= */}
      {activeCustomerTab === 'billing' && (
        <div className="space-y-6">
          {/* Top: Current Balance & Add Credit Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Current Prepaid Balance
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                ${usage.accountBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Active Tier: <strong className="text-white">{plan.displayName}</strong> (${plan.monthlyFeeUsd.toLocaleString()}/mo)
              </p>
            </div>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="py-2 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <CreditCard className="w-4 h-4" />
              <span>Top Up Balance</span>
            </button>
          </div>

          {/* Invoices History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Invoices &amp; Settlement Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official tax-compliant receipts and automated billing records
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">Currency: USD / KES / NGN</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-mono">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Billing Period</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {CUSTOMER_INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{inv.id}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{inv.period}</td>
                      <td className="py-3 px-3 text-slate-300">{inv.date}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        ${inv.amountUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans">{inv.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-sans px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => alert(`Downloading official PDF for ${inv.id}`)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription Tier Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Subscription Model &amp; Tier Upgrades</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every tenant has a dedicated product workspace and enterprise allowances
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['starter_sme', 'growth_business', 'fintech_enterprise', 'sovereign_telco'] as SubscriptionTier[]).map(
                (tierKey) => {
                  const tPlan = SUBSCRIPTION_TIERS[tierKey];
                  const isCurrent = plan.tier === tierKey;

                  return (
                    <div
                      key={tierKey}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
                        isCurrent
                          ? 'bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{tPlan.displayName}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="text-xl font-bold font-mono text-emerald-400">
                          ${tPlan.monthlyFeeUsd.toLocaleString()}
                          <span className="text-xs text-slate-500 font-normal"> /mo</span>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                          {tPlan.features.slice(0, 5).map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-[11px]">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        disabled={isCurrent}
                        onClick={() => onUpgradeSubscription(tierKey)}
                        className={`w-full py-2 rounded text-xs font-bold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                        }`}
                      >
                        {isCurrent ? 'Current Plan' : `Upgrade to ${tPlan.displayName}`}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: SUPPORT TICKETS & INCIDENTS ================= */}
      {activeCustomerTab === 'support' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <LifeBuoy className="w-4 h-4 text-amber-400" />
                  <span>Enterprise SLA Support &amp; Incident Operations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct escalation channel to 24/7 sovereign NOC engineers in Nairobi, Johannesburg, and Lagos
                </p>
              </div>
              <button
                onClick={() => setShowTicketModal(true)}
                className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Open New SLA Ticket</span>
              </button>
            </div>

            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-white text-xs">{tkt.id}</span>
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded font-bold uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        {tkt.priority}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold">{tkt.subject}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold self-start sm:self-auto ${
                        tkt.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-cyan-500/10 text-cyan-300'
                      }`}
                    >
                      {tkt.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4 pt-1 font-sans">
                    <span>Product: <strong className="text-slate-200">{tkt.product}</strong></span>
                    <span>Created: <strong className="text-slate-300 font-mono">{tkt.createdAt}</strong></span>
                    <span>Assignee: <strong className="text-slate-200">{tkt.assignee}</strong></span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-md border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                    <span className="font-semibold text-emerald-400">NOC Update: </span>
                    {tkt.lastReply}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: SLA & SOVEREIGN TERMS ================= */}
      {activeCustomerTab === 'sla' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Sovereign Data Residency &amp; Carrier SLA</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mandela sovereign commitments guarantee data residency within African borders
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1">
                <span className="text-xs text-slate-400">Core Network SLA</span>
                <div className="text-lg font-bold font-mono text-emerald-400">99.999%</div>
                <p className="text-[11px] text-slate-500">Kamailio Anycast 6 PoPs across Africa</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1">
                <span className="text-xs text-slate-400">SMS Delivery SLA</span>
                <div className="text-lg font-bold font-mono text-emerald-400">98.4% Guaranteed</div>
                <p className="text-[11px] text-slate-500">Automatic USSD fallback on signal loss</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1">
                <span className="text-xs text-slate-400">Data Residency Isolation</span>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {currentTenant.dataIsolationMode === 'dedicated_keyspace' ? 'Dedicated HSM' : 'Logical Isolation'}
                </div>
                <p className="text-[11px] text-slate-500">Data stays within national jurisdiction</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: GSMA SGP.22 ESIM QR CODE ================= */}
      {showEsimModal && esimProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">GSMA SGP.22 eSIM Activation</h3>
              </div>
              <button
                onClick={() => setShowEsimModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3">
              {/* High-fidelity SVG QR representation */}
              <div className="inline-block p-4 bg-white rounded-xl shadow-inner">
                <svg width="180" height="180" viewBox="0 0 180 180" className="w-40 h-40">
                  {/* Position detection patterns */}
                  <rect x="10" y="10" width="45" height="45" fill="black" />
                  <rect x="17" y="17" width="31" height="31" fill="white" />
                  <rect x="24" y="24" width="17" height="17" fill="black" />

                  <rect x="125" y="10" width="45" height="45" fill="black" />
                  <rect x="132" y="17" width="31" height="31" fill="white" />
                  <rect x="139" y="24" width="17" height="17" fill="black" />

                  <rect x="10" y="125" width="45" height="45" fill="black" />
                  <rect x="17" y="132" width="31" height="31" fill="white" />
                  <rect x="24" y="139" width="17" height="17" fill="black" />

                  {/* Synthetic data modules */}
                  {Array.from({ length: 64 }).map((_, i) => (
                    <rect
                      key={i}
                      x={65 + ((i % 8) * 7)}
                      y={65 + (Math.floor(i / 8) * 7)}
                      width="5"
                      height="5"
                      fill={(i * 17) % 3 === 0 ? 'black' : 'white'}
                    />
                  ))}
                </svg>
              </div>

              <div className="font-mono text-xs text-white font-bold">{esimProfile.e164}</div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Scan with any eSIM-compatible smartphone or IoT device (iOS &amp; Android supported).
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 font-mono text-[11px] text-slate-300">
              <div>LPA String: <span className="text-cyan-300 truncate block">{esimProfile.lpaString}</span></div>
              <div>EID: <span className="text-slate-400">{esimProfile.eid}</span></div>
              <div>ICCID: <span className="text-slate-400">{esimProfile.iccid}</span></div>
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span>PIN: <strong className="text-white">{esimProfile.pin}</strong></span>
                <span>PUK: <strong className="text-white">{esimProfile.puk}</strong></span>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(esimProfile.lpaString);
                alert('LPA string copied to clipboard!');
              }}
              className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
            >
              Copy LPA Activation Code
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: PREPAID BALANCE TOP-UP ================= */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Prepaid Balance Refill</span>
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Select Amount (USD)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[250, 500, 1500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 rounded font-mono font-bold transition-colors cursor-pointer ${
                        topUpAmount === amt
                          ? 'bg-emerald-400 text-slate-950 shadow-sm'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mpesa', label: 'M-Pesa Business Till' },
                    { id: 'flutterwave', label: 'Flutterwave Africa' },
                    { id: 'card', label: 'Visa / Mastercard' },
                    { id: 'wire', label: 'SWIFT / ABSA Wire' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setTopUpPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded text-left transition-colors cursor-pointer border ${
                        topUpPaymentMethod === m.id
                          ? 'bg-slate-800 border-emerald-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px]">
                Instant atomic ledger update: Balance will be immediately credited with 0 fee.
              </div>

              <button
                onClick={handleExecuteTopUp}
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer shadow-sm"
              >
                Pay ${topUpAmount.toLocaleString()} &amp; Credit Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEW SLA SUPPORT TICKET ================= */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-amber-400" />
                <span>Open SLA Support Ticket</span>
              </h3>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Issue Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Latency spike on Johannesburg Anycast BGP..."
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Affected Product</label>
                  <select
                    value={newTicketProduct}
                    onChange={(e) => setNewTicketProduct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Voice & IVR Core">Voice &amp; IVR Core</option>
                    <option value="SMS & Messaging (SMPP)">SMS &amp; Messaging (SMPP)</option>
                    <option value="Carrier SBC & Anycast">Carrier SBC &amp; Anycast</option>
                    <option value="MANDELA Dataverse">MANDELA Dataverse</option>
                    <option value="Satellite NTN Direct">Satellite NTN Direct</option>
                    <option value="Billing & Invoicing">Billing &amp; Invoicing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Priority Severity</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="P1 - Critical">P1 - Critical (&lt; 15m SLA)</option>
                    <option value="P2 - High">P2 - High (&lt; 1h SLA)</option>
                    <option value="P3 - Standard">P3 - Standard (&lt; 4h SLA)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Technical Details &amp; Reproduction Steps</label>
                <textarea
                  rows={4}
                  placeholder="Provide call IDs, phone numbers, or timestamped traces..."
                  value={newTicketDescription}
                  onChange={(e) => setNewTicketDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
