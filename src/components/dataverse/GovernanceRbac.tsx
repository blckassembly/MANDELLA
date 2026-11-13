import React, { useState } from 'react';
import {
  DataverseSecurityRole,
  DataverseAuditLog
} from '../../types/dataverse';
import {
  ShieldCheck,
  Lock,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Key,
  Shield,
  Layers,
  Cpu,
  Database
} from 'lucide-react';
import { HardwareAttestationAudit } from './HardwareAttestationAudit';

interface GovernanceRbacProps {
  roles: DataverseSecurityRole[];
  auditLogs: DataverseAuditLog[];
}

export const GovernanceRbac: React.FC<GovernanceRbacProps> = ({
  roles,
  auditLogs
}) => {
  const [activeGovernanceTab, setActiveGovernanceTab] = useState<
    'hardware_attestation' | 'rbac_ledger'
  >('hardware_attestation');

  const retentionPolicies = [
    {
      framework: 'NCC / Central Bank Financial & Telco CDR Mandate',
      duration: '7 Years Strict',
      entities: 'fs_account, fs_opportunity, fs_telecom_asset, CDRs',
      status: 'Active Enforced'
    },
    {
      framework: 'Nigeria Data Protection Act (NDPR) / Kenya DPA 2019',
      duration: '3 Years Max for Unconsented Marketing Leads',
      entities: 'fs_campaign, fs_lead',
      status: 'Active Enforced'
    },
    {
      framework: 'African Union Malabo Convention on Cyber Security',
      duration: '10 Years Immutable Security Audit Trail',
      entities: 'dataverse_audit_log, record_version_history',
      status: 'Active Enforced'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Governance, RBAC & Data Retention Policies</h2>
            <span className="text-xs text-rose-400 font-mono font-medium">· Compliance &amp; Security Layer</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tenant-scoped role-based access control, field-level encryption (FLS), African Data Protection compliance, and tamper-evident audit logs.
          </p>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveGovernanceTab('hardware_attestation')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeGovernanceTab === 'hardware_attestation'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hardware Attestation Audit (eUICC Tokens)</span>
          <span className="bg-emerald-950 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono border border-emerald-800">
            GSMA SGP.22
          </span>
        </button>

        <button
          onClick={() => setActiveGovernanceTab('rbac_ledger')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeGovernanceTab === 'rbac_ledger'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>RBAC Security Roles &amp; Immutable Audit Ledger</span>
        </button>
      </div>

      {activeGovernanceTab === 'hardware_attestation' ? (
        <HardwareAttestationAudit />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Security Roles & Field-Level Security (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
              <span className="font-bold text-white uppercase tracking-wider">
                Security Roles &amp; Tenant RBAC ({roles.length})
              </span>
              <span className="text-emerald-400">Least Privilege Enforced</span>
            </div>

            <div className="space-y-3">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-white text-xs">{r.name}</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {r.isSystem ? 'System Core' : 'Custom'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {r.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Scope:</span>
                      <span className="text-white">{r.permissions[0]?.entity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">AI Executable:</span>
                      <span className={r.permissions[0]?.canExecuteAi ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {r.permissions[0]?.canExecuteAi ? 'Allowed' : 'Blocked'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Export:</span>
                      <span className={r.permissions[0]?.canExport ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                        {r.permissions[0]?.canExport ? 'Granted' : 'Denied'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Policies */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                Regulatory Retention Policies
              </h3>
            </div>

            <div className="space-y-2.5 font-mono text-[11px]">
              {retentionPolicies.map((p, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{p.framework}</span>
                    <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {p.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Period: <strong className="text-amber-300">{p.duration}</strong> · Target: {p.entities}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Immutable Audit Logs (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider">
              Immutable Dataverse Audit Ledger ({auditLogs.length})
            </span>
            <span className="text-emerald-400">Cryptographically Signed</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.action === 'CREATE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : log.action === 'UPDATE'
                        ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                        : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                    }`}>
                      {log.action}
                    </span>
                    <strong className="text-white text-xs">{log.entityName}</strong>
                  </div>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {log.details}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <div>
                    <span>Actor: </span>
                    <span className="text-slate-300">{log.userId}</span>
                  </div>
                  <div className="text-right">
                    <span>IP: </span>
                    <span className="text-slate-300">{log.ipAddress}</span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 truncate pt-1">
                  Hash: {log.hashVerification}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
