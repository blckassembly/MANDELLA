import React, { useState } from 'react';
import {
  Check,
  X,
  Ban,
  Clock,
  RefreshCw,
  FileText,
  ListChecks,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button, CalloutBanner, KeyValueTable, Select, Tabs } from '../../design-system';
import { PortingRequest, SovereignLicense, AuditLogEntry, PhoneNumberRecord, AfricanCountry } from '../../types/nms';
import { PortingEngine } from '../PortingEngine';
import { ComplianceRegistry } from '../ComplianceRegistry';
import { SYSTEMS_18_CATALOG } from './systemsCatalog';

export type OperatorOpsTabId =
  | 'provisioning'
  | 'orders'
  | 'customers'
  | 'service_health'
  | 'usage'
  | 'support';

export interface ProvisioningOrderItem {
  id: string;
  customer: string;
  service: string;
  market: string;
  owner: string;
  stage: 'verification' | 'number' | 'route_failed' | 'route_ok' | 'test' | 'active';
  reconciled: boolean;
  auditEvents: { timestamp: string; event: string }[];
}

export const INITIAL_OPS_ORDERS: ProvisioningOrderItem[] = [
  {
    id: 'ORD-001',
    customer: 'Acacia Trading (sample)',
    service: 'Business line',
    market: 'Launch market',
    owner: 'Unassigned',
    stage: 'route_failed',
    reconciled: false,
    auditEvents: [
      { timestamp: '2025-01-17 10:02', event: 'Order created' },
      { timestamp: '2025-01-17 10:08', event: 'Route provisioning started' },
      { timestamp: '2025-01-17 10:12', event: 'Route provisioning failed' }
    ]
  },
  {
    id: 'ORD-002',
    customer: 'Kivu Rural Health Clinic',
    service: 'Business line + NTN failover',
    market: 'DRC Eastern Corridor',
    owner: 'Ops Lead (Kigali)',
    stage: 'test',
    reconciled: true,
    auditEvents: [
      { timestamp: '2025-01-20 08:15', event: 'Order created' },
      { timestamp: '2025-01-20 08:22', event: 'S01 inventory reserved (+243)' },
      { timestamp: '2025-01-20 08:30', event: 'S04 Kamailio route active' }
    ]
  },
  {
    id: 'ORD-003',
    customer: 'Safaricom FinPay Gateway',
    service: 'High-CPS SIP Trunk + DID Pool',
    market: 'Kenya Enterprise (KE)',
    owner: 'Carrier Engineering',
    stage: 'active',
    reconciled: true,
    auditEvents: [
      { timestamp: '2025-01-18 14:10', event: 'Order created' },
      { timestamp: '2025-01-18 14:40', event: 'Test call verified (MOS 4.4)' },
      { timestamp: '2025-01-18 14:42', event: 'Line activated' }
    ]
  }
];

export const useOperatorOperationsSidebar = (
  orders: ProvisioningOrderItem[],
  selectedOrderId: string,
  onSelectOrderId: (id: string) => void,
  onChangeOwner: (orderId: string, owner: string) => void
) => {
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const stageIdx =
    order.stage === 'verification'
      ? 0
      : order.stage === 'number'
      ? 1
      : order.stage === 'route_failed' || order.stage === 'route_ok'
      ? 2
      : order.stage === 'test'
      ? 3
      : 4;

  const railSteps = [
    'Verification',
    'Number assignment',
    'Call routing',
    'Test call',
    'Activation'
  ];

  return (
    <div className="p-4 space-y-5">
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
          ACTIVE ORDER
        </div>
        <h2 className="text-lg font-extrabold text-black tracking-tight mt-0.5">
          {order.customer}
        </h2>
      </div>

      <div className="space-y-3 text-xs border-b border-black pb-4">
        <div>
          <div className="font-bold text-black">Order</div>
          <div className="font-mono text-zinc-800">{order.id}</div>
        </div>
        <div>
          <div className="font-bold text-black">Service</div>
          <div className="text-zinc-800">{order.service}</div>
        </div>
        <div>
          <div className="font-bold text-black">Market</div>
          <div className="text-zinc-800">{order.market}</div>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-black">Owner</div>
          <Select
            value={order.owner}
            onChange={(e) => onChangeOwner(order.id, e.target.value)}
            options={[
              { value: 'Unassigned', label: 'Unassigned' },
              { value: 'Ops Lead (Kigali)', label: 'Ops Lead (Kigali)' },
              { value: 'Carrier Engineering', label: 'Carrier Engineering' },
              { value: 'Sovereign Compliance', label: 'Sovereign Compliance' }
            ]}
          />
        </div>
      </div>

      <div className="space-y-2 border-b border-black pb-4">
        <div className="font-bold text-xs text-black">Stage</div>
        <div className="space-y-2.5 pl-1">
          {railSteps.map((label, i) => {
            const isActive = i === stageIdx;
            const isPast = i < stageIdx;
            return (
              <div key={label} className="flex items-center gap-2.5 text-xs">
                <span
                  className={`w-3 h-3 rounded-full border border-black shrink-0 ${
                    isActive || isPast ? 'bg-black' : 'bg-white'
                  }`}
                />
                <span className={isActive ? 'font-bold text-black' : 'text-zinc-700'}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
          ORDER QUEUE ({orders.length})
        </div>
        <div className="space-y-1">
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelectOrderId(o.id)}
              className={`w-full text-left px-2.5 py-2 border text-xs cursor-pointer ${
                o.id === order.id
                  ? 'border-black bg-black text-white font-bold'
                  : 'border-black/25 hover:border-black bg-white text-black'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono">{o.id}</span>
                <span className="font-mono text-[10px] uppercase">
                  {o.stage === 'route_failed' ? 'FAILED' : o.stage}
                </span>
              </div>
              <div className="truncate text-[11px] opacity-85 mt-0.5">{o.customer}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface OperatorOperationsWorkspaceProps {
  activeTab: OperatorOpsTabId;
  onSelectTab: (tab: OperatorOpsTabId) => void;
  orders: ProvisioningOrderItem[];
  selectedOrderId: string;
  onSelectOrderId: (id: string) => void;
  onReconcileOrder: (id: string) => void;
  onRetryRouteOrder: (id: string) => void;
  onAdvanceOrderToActive: (id: string) => void;
  onOpenSystemDetail: (systemNumber: string) => void;
  portingRequests: PortingRequest[];
  countries: AfricanCountry[];
  onSubmitNewPort: (req: PortingRequest) => void;
  onAdvancePortStatus: (id: string) => void;
  licenses: SovereignLicense[];
  auditLogs: AuditLogEntry[];
  quarantinedNumbers: PhoneNumberRecord[];
  onUploadLicense: (lic: SovereignLicense) => void;
  onAdvanceRecycleStep: (id: string) => void;
}

export const OperatorOperationsWorkspace: React.FC<OperatorOperationsWorkspaceProps> = ({
  activeTab,
  onSelectTab,
  orders,
  selectedOrderId,
  onSelectOrderId,
  onReconcileOrder,
  onRetryRouteOrder,
  onAdvanceOrderToActive,
  onOpenSystemDetail,
  portingRequests,
  countries,
  onSubmitNewPort,
  onAdvancePortStatus,
  licenses,
  auditLogs,
  quarantinedNumbers,
  onUploadLicense,
  onAdvanceRecycleStep
}) => {
  const [opsSubView, setOpsSubView] = useState<'provision' | 'porting' | 'compliance'>('provision');
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const isFailed = order.stage === 'route_failed';
  const isRouteOk = order.stage === 'route_ok';
  const isTest = order.stage === 'test';
  const isActive = order.stage === 'active';

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      {/* Sub-Navigation for Operator Operations */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black pb-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'provisioning', label: 'Provisioning' },
            { id: 'orders', label: 'Order Queue' },
            { id: 'customers', label: 'Customers' },
            { id: 'service_health', label: 'Service Health' },
            { id: 'usage', label: 'Usage' },
            { id: 'support', label: 'Support' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTab(t.id as OperatorOpsTabId)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border border-black cursor-pointer ${
                activeTab === t.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] font-bold uppercase border border-black px-2 py-0.5">
          MVP-001 · OPERATIONS
        </span>
      </div>

      {/* PROVISIONING (Matches MVP-001 Provision business line wireframe) */}
      {activeTab === 'provisioning' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="font-mono text-xs text-zinc-600">Orders / {order.id}</div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight">
                Provision business line
              </h1>
            </div>
            <div className="flex gap-2">
              {(['provision', 'porting', 'compliance'] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setOpsSubView(sub)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border border-black cursor-pointer ${
                    opsSubView === sub ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  {sub === 'provision'
                    ? 'LINE PROVISIONING'
                    : sub === 'porting'
                    ? 'MNP PORTING'
                    : 'COMPLIANCE'}
                </button>
              ))}
            </div>
          </div>

          {opsSubView === 'porting' && (
            <PortingEngine
              portingRequests={portingRequests}
              countries={countries}
              onSubmitNewPort={onSubmitNewPort}
              onAdvancePortStatus={onAdvancePortStatus}
            />
          )}

          {opsSubView === 'compliance' && (
            <ComplianceRegistry
              licenses={licenses}
              auditLogs={auditLogs}
              quarantinedNumbers={quarantinedNumbers}
              countries={countries}
              onUploadLicense={onUploadLicense}
              onAdvanceRecycleStep={onAdvanceRecycleStep}
            />
          )}

          {opsSubView === 'provision' && (
            <div className="space-y-5">
              <div className="text-lg font-extrabold text-black">
                {isFailed
                  ? 'Route provisioning failed'
                  : isActive
                  ? 'Business line provisioned & active'
                  : isTest
                  ? 'Route provisioned — awaiting test verification'
                  : 'Route reconciled — ready to retry route'}
              </div>

              {/* 5-Stage Pipeline Cards (MVP-001) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="border border-black p-3 bg-white text-center space-y-1">
                  <div className="font-mono text-xs font-bold">1</div>
                  <div className="text-xs font-bold">Verify business</div>
                  <div className="text-[11px] flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Approved
                  </div>
                </div>
                <div className="border border-black p-3 bg-white text-center space-y-1">
                  <div className="font-mono text-xs font-bold">2</div>
                  <div className="text-xs font-bold">Assign number</div>
                  <div className="text-[11px] flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Complete
                  </div>
                </div>
                <div
                  className={`p-3 bg-white text-center space-y-1 ${
                    isFailed || isRouteOk ? 'border-2 border-black' : 'border border-black'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">3</div>
                  <div className="text-xs font-bold">Configure route</div>
                  <div className="text-[11px] flex items-center justify-center gap-1 font-bold">
                    {isFailed ? (
                      <>
                        <X className="w-3.5 h-3.5" /> Failed
                      </>
                    ) : isRouteOk ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" /> Reconciled
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" /> Complete
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`p-3 bg-white text-center space-y-1 ${
                    isTest ? 'border-2 border-black' : 'border border-black'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">4</div>
                  <div className="text-xs font-bold">Test</div>
                  <div className="text-[11px] flex items-center justify-center gap-1">
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Passed
                      </>
                    ) : isTest ? (
                      <>
                        <Clock className="w-3.5 h-3.5" /> Ready
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" /> Blocked
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`p-3 bg-white text-center space-y-1 ${
                    isActive ? 'border-2 border-black bg-zinc-50' : 'border border-black'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">5</div>
                  <div className="text-xs font-bold">Activate</div>
                  <div className="text-[11px] flex items-center justify-center gap-1">
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Card matching MVP-001 */}
              {isFailed && (
                <div className="border border-black p-5 bg-white space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                      <X className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold text-black">Route provisioning failed</h3>
                      <p className="text-sm text-zinc-700">
                        Provider did not confirm the route. Reconcile upstream SBC &amp; carrier state before retrying.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pl-10">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onReconcileOrder(order.id)}
                    >
                      {order.reconciled ? 'Provider status reconciled' : 'Reconcile provider status'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      disabled={!order.reconciled}
                      onClick={() => onRetryRouteOrder(order.id)}
                    >
                      Retry route
                    </Button>
                    {!order.reconciled && (
                      <span className="text-xs text-zinc-600">Disabled until reconciled</span>
                    )}
                  </div>
                </div>
              )}

              {isRouteOk && (
                <div className="border border-black p-5 bg-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-black">
                      Provider status reconciled — retry SIP &amp; LCR route
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Upstream Kamailio SBC confirmed route table synchronization.
                    </p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => onRetryRouteOrder(order.id)}>
                    Retry route →
                  </Button>
                </div>
              )}

              {isTest && (
                <div className="border border-black p-5 bg-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-black">
                      Route provisioned — ready to execute verification &amp; activate
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Run automated SIP INVITE loop test and activate {order.customer}.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onAdvanceOrderToActive(order.id)}
                  >
                    Verify test &amp; Activate line
                  </Button>
                </div>
              )}

              {isActive && (
                <CalloutBanner
                  symbol="i"
                  text={`${order.id} (${order.customer}) is ACTIVE across S01 Inventory, S04 SIP Core, and S05 Carrier Interconnect.`}
                />
              )}

              {/* Technical details strip (S01 / S04 / S05) */}
              <div className="border border-black p-4 bg-white space-y-3">
                <div className="font-bold text-sm text-black">Technical details</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => onOpenSystemDetail('01')}
                    className="text-left border border-black/25 hover:border-black p-3 cursor-pointer"
                  >
                    <div className="font-bold text-black">S01 inventory</div>
                    <div className="font-mono text-zinc-700 mt-0.5">S01 · E.164 Pool Ready →</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenSystemDetail('04')}
                    className="text-left border border-black/25 hover:border-black p-3 cursor-pointer"
                  >
                    <div className="font-bold text-black">S04 SIP</div>
                    <div className="font-mono text-zinc-700 mt-0.5">S04 · Kamailio TLS Trunk →</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenSystemDetail('05')}
                    className="text-left border border-black/25 hover:border-black p-3 cursor-pointer"
                  >
                    <div className="font-bold text-black">S05 carrier</div>
                    <div className="font-mono text-zinc-700 mt-0.5">S05 · LCR Interconnect →</div>
                  </button>
                </div>
              </div>

              {/* Audit trail */}
              <div className="border border-black bg-white">
                <div className="px-4 py-2.5 border-b border-black font-bold text-sm text-black">
                  Audit trail
                </div>
                <div className="divide-y divide-black/15 text-xs tabular-nums">
                  {order.auditEvents.map((ev, idx) => (
                    <div key={idx} className="grid grid-cols-12 px-4 py-2">
                      <div className="col-span-4 sm:col-span-3 font-mono text-zinc-700">
                        {ev.timestamp}
                      </div>
                      <div className="col-span-8 sm:col-span-9 text-black">{ev.event}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => onSelectTab('orders')}>
                  <ListChecks className="w-3.5 h-3.5 mr-1.5 inline" />
                  Order queue
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onSelectTab('service_health')}>
                  <FileText className="w-3.5 h-3.5 mr-1.5 inline" />
                  Service health
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ORDER QUEUE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Order Queue</h1>
          <div className="border border-black divide-y divide-black/20 bg-white">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-black">{o.id}</span>
                    <span className="text-sm font-extrabold text-black">{o.customer}</span>
                  </div>
                  <div className="text-xs text-zinc-600 mt-0.5">
                    {o.service} · {o.market} · Owner: {o.owner}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-black px-2 py-0.5 font-mono text-[11px] font-bold uppercase">
                    {o.stage}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onSelectOrderId(o.id);
                      onSelectTab('provisioning');
                    }}
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICE HEALTH */}
      {activeTab === 'service_health' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            18-System Service Health
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SYSTEMS_18_CATALOG.map((sys) => (
              <button
                key={sys.number}
                type="button"
                onClick={() => onOpenSystemDetail(sys.number)}
                className="text-left border border-black p-4 bg-white hover:bg-zinc-50 cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">
                    SYSTEM {sys.number} · {sys.category}
                  </span>
                  <span className="border border-black px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase">
                    {sys.availability}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-black">{sys.name}</div>
                <div className="text-xs text-zinc-600 line-clamp-2">{sys.shortDesc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOMERS, USAGE, SUPPORT */}
      {(activeTab === 'customers' || activeTab === 'usage' || activeTab === 'support') && (
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-black tracking-tight uppercase">
            {activeTab.replace('_', ' ')}
          </h1>
          <KeyValueTable
            title="OPERATOR TELEMETRY"
            rows={[
              { key: 'ACTIVE PILOT ORGANIZATIONS', value: '6 Tenants (Demo + Production)' },
              { key: 'PENDING PROVISIONING ORDERS', value: String(orders.filter((o) => o.stage !== 'active').length) },
              { key: 'OPEN MNP PORTING REQUESTS', value: String(portingRequests.length) },
              { key: 'SOVEREIGN LICENSES RECORDED', value: String(licenses.length) }
            ]}
          />
          <Button variant="primary" size="sm" onClick={() => onSelectTab('provisioning')}>
            Return to Provisioning Workbench
          </Button>
        </div>
      )}
    </div>
  );
};
