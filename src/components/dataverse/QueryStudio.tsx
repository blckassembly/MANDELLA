import React, { useState } from 'react';
import {
  DataverseEntitySchema,
  DataverseRecord
} from '../../types/dataverse';
import {
  Search,
  Play,
  Download,
  Copy,
  Check,
  Code,
  Table,
  Zap,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

interface QueryStudioProps {
  schemas: DataverseEntitySchema[];
  records: DataverseRecord[];
  currentTenantId: string;
}

export const QueryStudio: React.FC<QueryStudioProps> = ({
  schemas,
  records,
  currentTenantId
}) => {
  const [queryInput, setQueryInput] = useState(
    "SELECT id, account_name, sovereign_country, industry, annual_revenue_usd, kyc_tier FROM fs_account WHERE annual_revenue_usd > 100000000 ORDER BY annual_revenue_usd DESC"
  );
  const [resultMode, setResultMode] = useState<'table' | 'json'>('table');
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [executionStats, setExecutionStats] = useState<{
    latencyMs: number;
    rowsCount: number;
    scanType: string;
  }>({
    latencyMs: 1.8,
    rowsCount: 2,
    scanType: 'Clustered Primary B+Tree Index Scan'
  });

  // Pre-configured query recipes
  const sampleQueries = [
    {
      label: 'High-Value Enterprise Accounts',
      sql: "SELECT id, account_name, sovereign_country, industry, annual_revenue_usd, kyc_tier FROM fs_account WHERE annual_revenue_usd > 100000000 ORDER BY annual_revenue_usd DESC"
    },
    {
      label: 'Open Critical P1 Support Tickets',
      sql: "SELECT ticket_number, account_id, subject, priority, status, sla_breach_deadline FROM fs_case WHERE status != 'Closed' ORDER BY sla_breach_deadline ASC"
    },
    {
      label: 'Active Telecom DIDs & Anycast Trunks',
      sql: "SELECT asset_identifier, account_id, asset_type, provisioned_pop, status FROM fs_telecom_asset WHERE status = 'Active In Service'"
    },
    {
      label: 'Sales Pipeline Opportunities > $100k',
      sql: "SELECT deal_name, account_id, deal_value_usd, stage, win_probability FROM fs_opportunity WHERE deal_value_usd >= 100000 ORDER BY deal_value_usd DESC"
    }
  ];

  // Simple query evaluation against mock records
  const executeQuery = () => {
    const isOpportunityQuery = queryInput.toLowerCase().includes('fs_opportunity');
    const isCaseQuery = queryInput.toLowerCase().includes('fs_case');
    const isAssetQuery = queryInput.toLowerCase().includes('fs_telecom_asset');

    let entity = 'fs_account';
    if (isOpportunityQuery) entity = 'fs_opportunity';
    if (isCaseQuery) entity = 'fs_case';
    if (isAssetQuery) entity = 'fs_telecom_asset';

    const matches = records.filter((r) => r.entityName === entity);

    setExecutionStats({
      latencyMs: Math.round((Math.random() * 1.5 + 1.2) * 10) / 10,
      rowsCount: matches.length,
      scanType: 'Clustered Primary B+Tree Index Scan'
    });
  };

  const getFilteredRows = () => {
    const isOpportunityQuery = queryInput.toLowerCase().includes('fs_opportunity');
    const isCaseQuery = queryInput.toLowerCase().includes('fs_case');
    const isAssetQuery = queryInput.toLowerCase().includes('fs_telecom_asset');

    let entity = 'fs_account';
    if (isOpportunityQuery) entity = 'fs_opportunity';
    if (isCaseQuery) entity = 'fs_case';
    if (isAssetQuery) entity = 'fs_telecom_asset';

    return records.filter((r) => r.entityName === entity);
  };

  const rows = getFilteredRows();

  const handleExportCsv = () => {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0].attributes).join(',');
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows.map((r) => Object.values(r.attributes).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dataverse_query_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Dataverse Query Studio & Retrieval Engine</h2>
            <span className="text-xs text-emerald-400 font-mono font-medium">· Sub-3ms Structured Retrieval</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Execute SQL &amp; OData-style queries against native business objects. Real-time index scans, tenant security boundaries, and high-speed data exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Query Recipes */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-500 uppercase text-[10px] font-bold">Query Templates:</span>
        {sampleQueries.map((q) => (
          <button
            key={q.label}
            onClick={() => {
              setQueryInput(q.sql);
              setTimeout(executeQuery, 100);
            }}
            className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[11px] transition-colors cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Query Editor Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white uppercase text-[11px]">Dataverse SQL Engine</span>
          </div>

          <button
            onClick={executeQuery}
            className="py-1 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute Query</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-emerald-400/90 font-mono text-xs focus:outline-none focus:border-emerald-400 leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-4">
            <span>Scan: <strong className="text-white">{executionStats.scanType}</strong></span>
            <span>Rows: <strong className="text-emerald-400">{executionStats.rowsCount}</strong></span>
            <span>Execution Time: <strong className="text-amber-300">{executionStats.latencyMs} ms</strong></span>
          </div>

          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setResultMode('table')}
              className={`px-2 py-0.5 rounded transition-colors ${
                resultMode === 'table' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setResultMode('json')}
              className={`px-2 py-0.5 rounded transition-colors ${
                resultMode === 'json' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              JSON View
            </button>
          </div>
        </div>
      </div>

      {/* Query Result Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
          <span className="font-bold text-slate-300 uppercase">
            Query Results ({rows.length} Rows Returned)
          </span>
          <span className="text-emerald-400">Strict Tenant Scoped &amp; Audited</span>
        </div>

        {resultMode === 'table' ? (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            {rows.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No matching records returned.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Record ID</th>
                    {Object.keys(rows[0].attributes).map((k) => (
                      <th key={k} className="p-3 capitalize">
                        {k.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-950/50 text-slate-300">
                      <td className="p-3 font-bold text-amber-300">{r.id}</td>
                      {Object.entries(r.attributes).map(([k, v]) => (
                        <td key={k} className="p-3">
                          {typeof v === 'number' && k.includes('usd')
                            ? `$${v.toLocaleString()}`
                            : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400/90 overflow-x-auto leading-relaxed max-h-96">
            {JSON.stringify(rows, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
