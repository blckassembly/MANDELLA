import React, { useState } from 'react';
import {
  DataverseEntitySchema,
  DataverseField,
  DataverseRelationship
} from '../../types/dataverse';
import {
  Layers,
  Plus,
  Trash2,
  FileCode,
  Check,
  Copy,
  Lock,
  Search,
  GitBranch,
  ShieldCheck,
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SchemaDesignerProps {
  schemas: DataverseEntitySchema[];
  relationships: DataverseRelationship[];
  onAddSchema: (schema: DataverseEntitySchema) => void;
  onAddFieldToSchema: (schemaId: string, field: DataverseField) => void;
}

export const SchemaDesigner: React.FC<SchemaDesignerProps> = ({
  schemas,
  relationships,
  onAddSchema,
  onAddFieldToSchema
}) => {
  const [selectedSchemaId, setSelectedSchemaId] = useState<string>(schemas[0]?.id || '');
  const [activeView, setActiveView] = useState<'fields' | 'erd_graph' | 'typescript'>('fields');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showAddEntityModal, setShowAddEntityModal] = useState(false);

  // New Field Form State
  const [fieldName, setFieldName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fieldType, setFieldType] = useState<DataverseField['type']>('string');
  const [isRequired, setIsRequired] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);

  // New Entity Form State
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityDisplayName, setNewEntityDisplayName] = useState('');
  const [newEntityCategory, setNewEntityCategory] = useState<DataverseEntitySchema['category']>('custom');
  const [newEntityDesc, setNewEntityDesc] = useState('');

  const selectedSchema = schemas.find((s) => s.id === selectedSchemaId) || schemas[0];

  const handleAddFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim() || !selectedSchema) return;

    const newField: DataverseField = {
      name: fieldName.trim().toLowerCase().replace(/\s+/g, '_'),
      displayName: displayName.trim() || fieldName,
      type: fieldType,
      required: isRequired,
      isEncrypted: isEncrypted || fieldType === 'encrypted',
      searchable: true
    };

    onAddFieldToSchema(selectedSchema.id, newField);
    setFieldName('');
    setDisplayName('');
    setIsRequired(false);
    setIsEncrypted(false);
    setShowAddFieldModal(false);
  };

  const handleAddEntitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    const newSchema: DataverseEntitySchema = {
      id: `schema-${Date.now()}`,
      name: `fs_${newEntityName.trim().toLowerCase().replace(/\s+/g, '_')}`,
      displayName: newEntityDisplayName.trim() || newEntityName,
      category: newEntityCategory,
      description: newEntityDesc.trim() || 'Custom business entity created in Dataverse.',
      primaryField: 'name',
      recordCount: 0,
      version: 1,
      tenantScoped: true,
      aiAccessible: true,
      retentionYears: 5,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      fields: [
        { name: 'id', displayName: 'UUID', type: 'string', required: true, unique: true },
        { name: 'name', displayName: 'Name / Identifier', type: 'string', required: true, searchable: true },
        { name: 'created_at', displayName: 'Created At', type: 'datetime', required: true },
        { name: 'status', displayName: 'Status', type: 'picklist', required: true, picklistOptions: ['Active', 'Draft', 'Archived'] }
      ]
    };

    onAddSchema(newSchema);
    setSelectedSchemaId(newSchema.id);
    setNewEntityName('');
    setNewEntityDisplayName('');
    setNewEntityDesc('');
    setShowAddEntityModal(false);
  };

  const generateTsInterface = (schema: DataverseEntitySchema) => {
    const fieldsTs = schema.fields
      .map((f) => {
        let tsType = 'string';
        if (f.type === 'number' || f.type === 'decimal') tsType = 'number';
        if (f.type === 'boolean') tsType = 'boolean';
        if (f.type === 'picklist' && f.picklistOptions) {
          tsType = f.picklistOptions.map((o) => `'${o}'`).join(' | ');
        }
        if (f.type === 'json') tsType = 'Record<string, any>';
        return `  /** ${f.displayName} */\n  ${f.name}${f.required ? '' : '?'}: ${tsType};`;
      })
      .join('\n');

    return `// Auto-Generated Farsight Dataverse Schema SDK
export interface ${schema.name.replace(/^fs_/, '').split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Entity {
${fieldsTs}
  tenant_id: string;
  version: number;
  created_at: string;
  updated_at: string;
}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateTsInterface(selectedSchema));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Visual Schema Designer & Object Modeler</h2>
            <span className="text-xs text-emerald-400 font-mono font-medium">· Dataverse Core Architecture</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Shared business schemas for Customer, Sales, Marketing, Service, and Telecom entities. Strongly typed fields, foreign references, and field-level security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddEntityModal(true)}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Entity</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Entities List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider font-mono">
              Business Entities ({schemas.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Strict Validation</span>
          </div>

          <div className="space-y-2">
            {schemas.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSchemaId(s.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  s.id === selectedSchemaId
                    ? 'bg-emerald-400/10 border-emerald-400/60 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white text-xs">{s.displayName}</strong>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                    {s.category}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                  {s.name}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-800/60 font-mono">
                  <span>{s.fields.length} columns</span>
                  <span>{s.recordCount.toLocaleString()} records</span>
                  <span>v{s.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Schema Details & Tabs (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          {/* Header of selected schema */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedSchema.displayName}</h3>
                <span className="text-xs font-mono text-emerald-400">({selectedSchema.name})</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSchema.description}</p>
            </div>

            {/* View Switcher: Fields vs ERD Graph vs TypeScript */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveView('fields')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeView === 'fields' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Fields ({selectedSchema.fields.length})
              </button>
              <button
                onClick={() => setActiveView('erd_graph')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeView === 'erd_graph' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ERD Relationships
              </button>
              <button
                onClick={() => setActiveView('typescript')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeView === 'typescript' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                TypeScript SDK
              </button>
            </div>
          </div>

          {/* VIEW 1: Fields Table */}
          {activeView === 'fields' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Primary Field: <strong className="text-amber-300">{selectedSchema.primaryField}</strong> · Retention: {selectedSchema.retentionYears} Years
                </span>
                <button
                  onClick={() => setShowAddFieldModal(true)}
                  className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add Column</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Column Name</th>
                      <th className="p-3">Display Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Security & Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {selectedSchema.fields.map((f) => (
                      <tr key={f.name} className="hover:bg-slate-950/50 text-slate-300">
                        <td className="p-3 font-bold text-white">{f.name}</td>
                        <td className="p-3 font-sans text-slate-200">{f.displayName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            f.type === 'encrypted'
                              ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                              : f.type === 'lookup'
                              ? 'bg-blue-950 text-blue-300 border border-blue-600/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {f.type}
                          </span>
                        </td>
                        <td className="p-3">
                          {f.required ? (
                            <span className="text-emerald-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-slate-500">Optional</span>
                          )}
                        </td>
                        <td className="p-3 text-[11px]">
                          {f.isEncrypted && (
                            <span className="inline-flex items-center gap-1 text-rose-400 mr-2">
                              <Lock className="w-3 h-3" /> Encrypted (KMS)
                            </span>
                          )}
                          {f.lookupTargetEntity && (
                            <span className="text-blue-400">
                              → {f.lookupTargetEntity}
                            </span>
                          )}
                          {f.picklistOptions && (
                            <span className="text-slate-400 truncate block max-w-xs">
                              Options: {f.picklistOptions.slice(0, 3).join(', ')}...
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: Entity Relationship Graph (ERD) */}
          {activeView === 'erd_graph' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
                  <span className="text-slate-300 font-bold uppercase">
                    Dataverse Unified Relationship Graph
                  </span>
                  <span className="text-emerald-400">Cascading Integrity Enforced</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The diagram below illustrates how core business entities interconnect in the Mandela Dataverse:
                </p>

                {/* Graph Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  {/* Parent: Account */}
                  <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold">
                        Root Entity
                      </span>
                      <Database className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white text-sm">fs_account</h4>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Primary Customer &amp; Enterprise Account
                    </p>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                      Key: <strong>id</strong> (UUID)
                    </div>
                  </div>

                  {/* Links / Arrow */}
                  <div className="flex flex-col justify-center space-y-2">
                    {relationships.map((rel) => (
                      <div
                        key={rel.id}
                        className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px]"
                      >
                        <div className="flex items-center justify-between text-amber-300 font-bold">
                          <span>{rel.type}</span>
                          <GitBranch className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-slate-300 font-sans mt-0.5 truncate">
                          {rel.name.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          {rel.fromEntity}.{rel.fromField} → {rel.toEntity}.{rel.toField}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Children: Opportunities, Cases, Telecom Assets */}
                  <div className="space-y-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <span className="text-[10px] text-blue-400 block font-bold">Child Entity</span>
                      <strong className="text-white text-xs">fs_opportunity</strong>
                      <span className="text-[10px] text-slate-500 block">Deals &amp; Contract Revenue</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <span className="text-[10px] text-blue-400 block font-bold">Child Entity</span>
                      <strong className="text-white text-xs">fs_case</strong>
                      <span className="text-[10px] text-slate-500 block">Support Tickets &amp; NOC Alarms</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <span className="text-[10px] text-blue-400 block font-bold">Child Entity</span>
                      <strong className="text-white text-xs">fs_telecom_asset</strong>
                      <span className="text-[10px] text-slate-500 block">E.164 DIDs &amp; SIP Trunks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: TypeScript Code Gen */}
          {activeView === 'typescript' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400 text-[11px]">
                  Farsight Dataverse Client SDK Definition ({selectedSchema.name}.ts)
                </span>
                <button
                  onClick={handleCopyCode}
                  className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy TypeScript'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400/90 overflow-x-auto leading-relaxed max-h-80">
                {generateTsInterface(selectedSchema)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Column */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Add Column to {selectedSchema.displayName}</h3>
              <button onClick={() => setShowAddFieldModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddFieldSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Column System Name (e.g. credit_score)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. credit_score"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Display Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Credit Score Rating"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Data Type</label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                >
                  <option value="string">String (Text)</option>
                  <option value="number">Number (Integer)</option>
                  <option value="decimal">Decimal (Currency/Float)</option>
                  <option value="boolean">Boolean (True/False)</option>
                  <option value="datetime">DateTime (Timestamp)</option>
                  <option value="picklist">Picklist (Enumerated)</option>
                  <option value="json">JSON Metadata</option>
                  <option value="encrypted">Encrypted (KMS Secure Field)</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-500"
                  />
                  <span>Required Field</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isEncrypted}
                    onChange={(e) => setIsEncrypted(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-500"
                  />
                  <span>Field-Level Encryption</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Column
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Entity */}
      {showAddEntityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create New Dataverse Entity</h3>
              <button onClick={() => setShowAddEntityModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddEntitySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Entity System Name (e.g. invoice, dispatch_order)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dispatch_order"
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Display Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dispatch Order"
                  value={newEntityDisplayName}
                  onChange={(e) => setNewEntityDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newEntityCategory}
                  onChange={(e) => setNewEntityCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                >
                  <option value="sales">Sales &amp; Commerce</option>
                  <option value="service">Service &amp; Operations</option>
                  <option value="marketing">Marketing &amp; Audience</option>
                  <option value="telecom">Telecom &amp; Interconnect</option>
                  <option value="custom">Custom Entity</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain the purpose of this business object..."
                  value={newEntityDesc}
                  onChange={(e) => setNewEntityDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEntityModal(false)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Provision Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
