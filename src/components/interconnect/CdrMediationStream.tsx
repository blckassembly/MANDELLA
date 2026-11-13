import React, { useState } from 'react';
import { MediatedCdr } from '../../types/interconnect';
import {
  Zap,
  Activity,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface CdrMediationStreamProps {
  cdrs: MediatedCdr[];
}

export const CdrMediationStream: React.FC<CdrMediationStreamProps> = ({ cdrs }) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredCdrs = cdrs.filter(
    (c) =>
      c.callId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.sourceMsisdn.includes(searchFilter) ||
      c.destinationMsisdn.includes(searchFilter) ||
      c.selectedCarrier.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalBilled = cdrs.reduce((acc, c) => acc + c.customerBilledUsd, 0);
  const totalCost = cdrs.reduce((acc, c) => acc + c.carrierCostUsd, 0);
  const totalMargin = totalBilled - totalCost;
  const avgMarginPercent = totalBilled > 0 ? (totalMargin / totalBilled) * 100 : 0;
  const avgLatency = Math.round(
    cdrs.reduce((acc, c) => acc + c.mediationLatencyMs, 0) / cdrs.length
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Kafka CDR Mediation Stream &amp; Real-Time Rating</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· Target &lt; 5s End-to-End</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time rating of voice &amp; SMS traffic from Apache Kafka. Full audit trail from raw FreeSWITCH/Kamailio CDR to rated customer invoice with live gross margin calculation.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search Call-ID, MSISDN..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs rounded-lg pl-8 pr-3 py-1.5 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400 w-60"
          />
        </div>
      </div>

      {/* Real-Time Financial Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] text-slate-400 uppercase">Gross Revenue Billed</div>
          <div className="text-xl font-bold text-white mt-1">
            ${totalBilled.toFixed(3)}
          </div>
          <span className="text-[10px] text-emerald-400">Live Customer Charge</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] text-slate-400 uppercase">Carrier Termination Cost</div>
          <div className="text-xl font-bold text-amber-300 mt-1">
            ${totalCost.toFixed(3)}
          </div>
          <span className="text-[10px] text-slate-400">Interconnect Outflow</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] text-slate-400 uppercase">Net Margin Realized</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            ${totalMargin.toFixed(3)} ({avgMarginPercent.toFixed(1)}%)
          </div>
          <span className="text-[10px] text-emerald-400">Protected Above Floor</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[10px] text-slate-400 uppercase">Mediation Speed</div>
          <div className="text-xl font-bold text-white mt-1">
            {avgLatency} ms
          </div>
          <span className="text-[10px] text-emerald-400">Target &lt; 5,000 ms OK</span>
        </div>
      </div>

      {/* Live Rated CDR Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-bold text-white uppercase text-xs">
            Live Mediated CDR Stream ({filteredCdrs.length})
          </span>
          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Kafka Consumer Group: dataverse.cdr.mediator
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Call Timestamp</th>
                <th className="p-3">Source → Dest MSISDN</th>
                <th className="p-3">Routed Carrier</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Carrier Cost</th>
                <th className="p-3">Billed Price</th>
                <th className="p-3">Margin %</th>
                <th className="p-3">Rating Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCdrs.map((c) => (
                <tr key={c.id} className="hover:bg-slate-950/50 text-slate-300">
                  <td className="p-3 text-[11px] text-slate-400">
                    {c.timestamp.slice(11, 19)}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{c.sourceMsisdn}</div>
                    <div className="text-[10px] text-amber-300">→ {c.destinationMsisdn}</div>
                  </td>
                  <td className="p-3 text-slate-200">
                    <div>{c.selectedCarrier}</div>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {c.routeType}
                    </span>
                  </td>
                  <td className="p-3">{c.durationSeconds}s ({c.billableMinutes.toFixed(1)}m)</td>
                  <td className="p-3 text-slate-300">${c.carrierCostUsd.toFixed(4)}</td>
                  <td className="p-3 font-bold text-white">${c.customerBilledUsd.toFixed(4)}</td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-bold">
                      +{c.grossMarginPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      RATED ({c.mediationLatencyMs}ms)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
