import React, { useState } from 'react';
import {
  DataverseEntitySchema,
  DataverseRecord,
  DataverseTenant
} from '../../types/dataverse';
import {
  Database,
  Search,
  Filter,
  GitBranch,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  FileCode,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock
} from 'lucide-react';

interface RecordExplorerProps {
  schemas: DataverseEntitySchema[];
  records: DataverseRecord[];
  currentTenantId: string;
  onUpdateRecord: (record: DataverseRecord) => void;
  onCreateRecord: (record: Omit<DataverseRecord, 'id' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>) => void;
}

export const RecordExplorer: React.FC<RecordExplorerProps> = ({
  schemas,
  records,
  currentTenantId,
  onUpdateRecord,
  onCreateRecord
}) => {
  const [selectedEntityName, setSelectedEntityName] = useState<string>('fs_account');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingRecordId, setInspectingRecordId] = useState<string | null>(records[0]?.id || null);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for new record
  const [newRecordAttributes, setNewRecordAttributes] = useState<Record<string, any>>({});

  const currentSchema = schemas.find((s) => s.name === selectedEntityName) || schemas[0];

  const entityRecords = records.filter(
    (r) =>
      r.entityName === selectedEntityName &&
      (r.tenantId === currentTenantId || currentTenantId === 'all') &&
      JSON.stringify(r.attributes).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inspectedRecord = records.find((r) => r.id === inspectingRecordId) || entityRecords[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRecord({
      entityName: selectedEntityName,
      tenantId: currentTenantId,
      createdBy: 'console_user@farsight.africa',
      attributes: newRecordAttributes
    });
    setNewRecordAttributes({});
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Record Explorer & Point-in-Time History</h2>
            <span className="text-xs text-emerald-400 font-mono font-medium">· Multi-Tenant Business Objects</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Query, validate, and inspect live customer accounts, deals, cases, and telecom assets. Includes full version history and SHA-256 tamper-evident time-travel diffing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNewRecordAttributes({});
              setShowCreateModal(true);
            }}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Entity Picker */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-slate-400 font-mono text-[11px] uppercase">Entity:</span>
          <select
            value={selectedEntityName}
            onChange={(e) => {
              setSelectedEntityName(e.target.value);
              setInspectingRecordId(null);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-400"
          >
            {schemas.map((s) => (
              <option key={s.name} value={s.name}>
                {s.displayName} ({s.name})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search attributes, MSISDN, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg pl-8 pr-3 py-1.5 text-white font-sans focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Record Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase">
              {currentSchema?.displayName} Records ({entityRecords.length})
            </span>
            <span className="text-emerald-400">Tenant Scoped</span>
          </div>

          <div className="space-y-2">
            {entityRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No records found matching filter in current tenant.
              </div>
            ) : (
              entityRecords.map((rec) => {
                const primaryVal = rec.attributes[currentSchema.primaryField] || rec.id;
                const isSelected = inspectedRecord?.id === rec.id;

                return (
                  <div
                    key={rec.id}
                    onClick={() => setInspectingRecordId(rec.id)}
                    className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-400/10 border-emerald-400/60 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-white text-xs">{primaryVal}</strong>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                        v{rec.version}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 mt-2">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Record UUID</span>
                        <span className="text-slate-300 truncate block">{rec.id}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Updated At</span>
                        <span className="text-slate-300">{rec.updatedAt.slice(0, 16).replace('T', ' ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Record Attribute Inspector & Version Diffs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {inspectedRecord ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {inspectedRecord.attributes[currentSchema.primaryField] || inspectedRecord.id}
                  </h3>
                  <span className="text-[10px] text-slate-500">ID: {inspectedRecord.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowVersionHistoryModal(true)}
                    className="py-1 px-2.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-600/40 text-blue-300 rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Version History (v{inspectedRecord.version})</span>
                  </button>
                </div>
              </div>

              {/* Attribute Key-Values */}
              <div className="space-y-2.5">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">
                  Typed Attributes
                </span>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  {Object.entries(inspectedRecord.attributes).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-[11px] border-b border-slate-900/80 pb-1.5 last:border-b-0">
                      <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-white font-bold truncate max-w-[200px]">
                        {typeof val === 'number' && key.includes('usd')
                          ? `$${val.toLocaleString()}`
                          : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrity & Metadata Footer */}
              <div className="pt-2 border-t border-slate-800 space-y-1 text-[10px] text-slate-500">
                <div className="flex justify-between">
                  <span>Tenant ID:</span>
                  <span className="text-slate-300">{inspectedRecord.tenantId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created By:</span>
                  <span className="text-slate-300">{inspectedRecord.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHA-256 State Hash:</span>
                  <span className="text-emerald-400 truncate max-w-[180px]">
                    {inspectedRecord.versionHistory[0]?.integrityHash || 'sha256:verified'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Select a record to inspect attributes and version history.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Version History & Point-in-Time Diffing */}
      {showVersionHistoryModal && inspectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Point-in-Time History &amp; Diffs (v{inspectedRecord.version})
                </h3>
              </div>
              <button onClick={() => setShowVersionHistoryModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Every modification in the Mandela Dataverse creates an immutable audit commit with field diffs and cryptographic proof.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto font-mono text-xs">
              {inspectedRecord.versionHistory.map((hist) => (
                <div key={hist.versionNumber} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] flex items-center justify-center font-bold">
                        v{hist.versionNumber}
                      </span>
                      <strong className="text-white text-xs uppercase">{hist.action}</strong>
                    </div>
                    <span className="text-[10px] text-slate-500">{hist.timestamp.replace('T', ' ').slice(0, 19)}</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Committed by: <strong className="text-amber-300">{hist.changedBy}</strong>
                  </div>

                  {/* Diffs */}
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1 text-[11px]">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">Field Diffs:</span>
                    {Object.entries(hist.changes).map(([fKey, diff]) => (
                      <div key={fKey} className="flex items-center gap-2">
                        <span className="text-slate-400">{fKey}:</span>
                        <span className="text-rose-400 line-through">{String(diff.oldValue ?? 'null')}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-emerald-400 font-bold">{String(diff.newValue)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-500 truncate pt-1">
                    Proof: {hist.integrityHash}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowVersionHistoryModal(false)}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Record */}
      {showCreateModal && currentSchema && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create {currentSchema.displayName}</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              {currentSchema.fields
                .filter((f) => f.name !== 'id')
                .slice(0, 6)
                .map((f) => (
                  <div key={f.name}>
                    <label className="block text-slate-400 mb-1">
                      {f.displayName} {f.required && <span className="text-rose-400">*</span>}
                    </label>
                    {f.type === 'picklist' && f.picklistOptions ? (
                      <select
                        required={f.required}
                        value={newRecordAttributes[f.name] || ''}
                        onChange={(e) =>
                          setNewRecordAttributes({ ...newRecordAttributes, [f.name]: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                      >
                        <option value="">Select {f.displayName}...</option>
                        {f.picklistOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type === 'number' || f.type === 'decimal' ? 'number' : 'text'}
                        required={f.required}
                        placeholder={`Enter ${f.displayName.toLowerCase()}...`}
                        value={newRecordAttributes[f.name] || ''}
                        onChange={(e) =>
                          setNewRecordAttributes({ ...newRecordAttributes, [f.name]: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-emerald-400"
                      />
                    )}
                  </div>
                ))}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save to Dataverse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
