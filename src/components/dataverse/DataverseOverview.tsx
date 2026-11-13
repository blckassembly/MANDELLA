import React from 'react';
import {
  DataverseEntitySchema,
  DataverseTenant,
  DataverseRecord,
  DataverseEventSubscription
} from '../../types/dataverse';
import {
  Database,
  Layers,
  ShieldCheck,
  Zap,
  Server,
  GitBranch,
  Search,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCode,
  Users,
  Building,
  Key
} from 'lucide-react';

interface DataverseOverviewProps {
  tenants: DataverseTenant[];
  currentTenantId: string;
  onSelectTenant: (id: string) => void;
  schemas: DataverseEntitySchema[];
  records: DataverseRecord[];
  events: DataverseEventSubscription[];
  onNavigateTab: (tab: any) => void;
}

export const DataverseOverview: React.FC<DataverseOverviewProps> = ({
  tenants,
  currentTenantId,
  onSelectTenant,
  schemas,
  records,
  events,
  onNavigateTab
}) => {
  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const totalFields = schemas.reduce((acc, s) => acc + s.fields.length, 0);
  const totalRecordsCount = schemas.reduce((acc, s) => acc + s.recordCount, 0);
  const totalEventsDispatched = events.reduce((acc, e) => acc + e.dispatchedCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 font-mono text-xs font-semibold border border-emerald-400/30">
              MANDELA Dataverse · Enterprise Native Data Engine
            </span>
            <h2 className="text-base font-bold text-white">
              Proprietary Unified Business-Data Infrastructure
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Farsight&apos;s native data platform. Multi-tenant storage, shared business schemas (Customer, Sales, Marketing, Service, Telecom),
            record versioning, point-in-time change history, RBAC, Kafka CDC event pipelines, and AI-safe data services.
          </p>
        </div>

        {/* Tenant Isolation Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0">
          <Building className="w-4 h-4 text-emerald-400" />
          <div className="text-xs">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Isolated Tenant</span>
            <select
              value={currentTenantId}
              onChange={(e) => onSelectTenant(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name} ({t.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* High-Level Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Entity Schemas</span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {schemas.length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            {totalFields} Typed Fields
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Dataverse Records</span>
            <Database className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {totalRecordsCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {currentTenant.storageMb} MB Storage
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>CDC Events Stream</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 mt-1">
            {totalEventsDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            Kafka & Webhooks OK
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Query Latency</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            2.1 ms
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            p99 Indexed Reads
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Isolation Mode</span>
            <Lock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white mt-1 capitalize truncate">
            {currentTenant.dataIsolationMode.replace('_', ' ')}
          </div>
          <div className="text-[10px] text-purple-300 mt-1 truncate">
            AES-256 KMS Active
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>AI Permission Core</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-1">
            ENFORCING
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Field Guardrails Active
          </div>
        </div>
      </div>

      {/* Architecture & Navigation Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Module 1: Schema Designer & Entity Graphs */}
        <div
          onClick={() => onNavigateTab('schema_designer')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-white text-sm">Schema Designer & Entity Graphs</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Visual object modeler with 1:N, N:1, N:N relationships, foreign key constraints, typed picklists, and encrypted data columns.
          </p>
          <div className="text-[11px] font-mono text-emerald-400 pt-1">
            5 Shared Schemas · 3 Active Relationships →
          </div>
        </div>

        {/* Module 2: Record Explorer & Time-Travel Versioning */}
        <div
          onClick={() => onNavigateTab('record_explorer')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-white text-sm">Record Explorer & Time-Travel Diffs</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Explore live customer, sales, marketing, and service entities. Inspect change history and point-in-time diffs with SHA-256 integrity hashes.
          </p>
          <div className="text-[11px] font-mono text-blue-400 pt-1">
            Immutable Audit Trail · Point-in-Time Restore →
          </div>
        </div>

        {/* Module 3: Dataverse Query Studio */}
        <div
          onClick={() => onNavigateTab('query_service')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-5 space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-white text-sm">Query Studio & Data Services</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            High-performance SQL and OData filter engine. Execute cross-entity queries, filtered pagination, and CSV data exports under 3ms.
          </p>
          <div className="text-[11px] font-mono text-amber-400 pt-1">
            Sub-3ms Queries · Structured Pagination →
          </div>
        </div>

        {/* Module 4: Change Data Capture & Event Pipeline */}
        <div
          onClick={() => onNavigateTab('event_pipeline')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-white text-sm">Event Pipeline & Change Data Capture</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Real-time event registration engine. Stream create/update/delete events to Apache Kafka topics, enterprise webhooks, and automation tasks.
          </p>
          <div className="text-[11px] font-mono text-purple-400 pt-1">
            Kafka Eventing · Exponential Retry Backoff →
          </div>
        </div>

        {/* Module 5: Governance, RBAC & Retention */}
        <div
          onClick={() => onNavigateTab('governance_rbac')}
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-xl p-5 space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-white text-sm">RBAC Governance & Retention Policies</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Tenant-scoped security roles, field-level security (FLS), African Data Protection compliance (NDPR, Kenya DPA), and 7-10 yr retention rules.
          </p>
          <div className="text-[11px] font-mono text-rose-400 pt-1">
            4 Security Roles · Field Masking Enforced →
          </div>
        </div>

        {/* Module 6: AI-Accessible Data Services */}
        <div
          onClick={() => onNavigateTab('ai_services')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 space-y-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-white text-sm">AI Data Services & Semantic Gateway</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            AI-accessible data services with strict field-level guardrails, dual approval for automated writes, and semantic vector indexing.
          </p>
          <div className="text-[11px] font-mono text-emerald-400 pt-1">
            Grounded AI Functions · Tax/ID Masking →
          </div>
        </div>
      </div>

      {/* Shared Business Object Schemas Summary Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Shared Farsight Business Entities
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            Tenant: {currentTenant.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {schemas.map((s) => (
            <div
              key={s.id}
              onClick={() => onNavigateTab('schema_designer')}
              className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                  {s.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">v{s.version}</span>
              </div>
              <h4 className="font-bold text-white text-xs truncate">{s.displayName}</h4>
              <p className="text-[10px] font-mono text-emerald-400">{s.name}</p>
              <div className="text-[10px] text-slate-500 pt-1 flex justify-between">
                <span>{s.fields.length} fields</span>
                <span>{s.recordCount.toLocaleString()} rows</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
