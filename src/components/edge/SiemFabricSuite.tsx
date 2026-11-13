import React, { useState } from 'react';
import {
  Database,
  Activity,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Copy,
  Check,
  Server,
  Zap,
  Cpu,
  Clock,
  Eye,
  ArrowRight,
  ShieldCheck,
  Network
} from 'lucide-react';
import { SiemFabricTab } from '../../types/multiTenant';
import {
  Card,
  Badge,
  Button,
  StatCard,
  StatusDot,
  CodeBlock,
  SectionHeader
} from '../../design-system';
import {
  INITIAL_SIEM_SOURCES,
  INITIAL_FLINK_CORRELATIONS,
  STORAGE_TIER_METRICS,
  SAMPLE_OCSF_EVENTS,
  SIEM_AI_SHADOW_ARTIFACTS,
  SiemSourceConnector,
  FlinkCorrelatedWindow,
  OcsfTelecomEventSample
} from '../../data/mockSiemFabricData';

interface SiemFabricSuiteProps {
  currentTenantId?: string;
}

export const SiemFabricSuite: React.FC<SiemFabricSuiteProps> = () => {
  const [activeTab, setActiveTab] = useState<SiemFabricTab>('connectors_matrix');
  const [sources, setSources] = useState<SiemSourceConnector[]>(INITIAL_SIEM_SOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOcsfSample, setSelectedOcsfSample] = useState<OcsfTelecomEventSample | null>(SAMPLE_OCSF_EVENTS[0]);

  // Flink correlations state
  const [correlations, setCorrelations] = useState<FlinkCorrelatedWindow[]>(INITIAL_FLINK_CORRELATIONS);
  const [selectedCorrelation, setSelectedCorrelation] = useState<FlinkCorrelatedWindow | null>(INITIAL_FLINK_CORRELATIONS[0]);
  const [isSimulatingStitch, setIsSimulatingStitch] = useState<boolean>(false);
  const [stitchFeedback, setStitchFeedback] = useState<string | null>(null);

  // Storage query simulator
  const [selectedQueryType, setSelectedQueryType] = useState<'clickhouse' | 'memgraph' | 'iceberg'>('clickhouse');
  const [queryExecutionLog, setQueryExecutionLog] = useState<string | null>(null);
  const [isExecutingQuery, setIsExecutingQuery] = useState<boolean>(false);

  // AI Shadow artifact viewer
  const [activeArtifactIdx, setActiveArtifactIdx] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Filter sources
  const filteredSources = sources.filter((s) => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ocsfClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Total current EPS across all 18 connectors
  const totalEps = sources.reduce((acc, s) => acc + s.epsRate, 0);

  // Simulate Flink live identity stitch
  const handleSimulateStitch = () => {
    setIsSimulatingStitch(true);
    setStitchFeedback('Injecting live Core HSS + CGNAT + POS SIM-swap event into Apache Flink 15m sliding window...');

    setTimeout(() => {
      const newWin: FlinkCorrelatedWindow = {
        windowId: `FLINK-WIN-${Math.floor(9030 + Math.random() * 900)}`,
        timeWindow: 'T-15m Sliding Window (Active)',
        imsi: '6390100' + Math.floor(10000000 + Math.random() * 90000000),
        imei: '86' + Math.floor(1000000000000 + Math.random() * 9000000000000),
        msisdn: '+254 7' + Math.floor(10000000 + Math.random() * 90000000),
        tmsi: '0x' + Math.random().toString(16).substring(2, 10),
        guti: '639-01-0001-08-' + Math.random().toString(16).substring(2, 10),
        cgnatPrivateIp: `10.142.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 250)}`,
        publicIp: '196.201.214.' + Math.floor(10 + Math.random() * 80),
        cellId: '639-01-eNB-1049 (Nairobi CBD)',
        posAgentId: 'POS-NBO-KIMATHI-04',
        stitchLatencyMs: parseFloat((25 + Math.random() * 15).toFixed(1)),
        correlationStatus: 'IDENTITY_DISCREPANCY',
        riskScore: 0.96,
        flags: ['POST_SWAP_300S_MFA_BURST', 'IMPOSSIBLE_GEODESIC_VELOCITY']
      };

      setCorrelations((prev) => [newWin, ...prev]);
      setSelectedCorrelation(newWin);
      setIsSimulatingStitch(false);
      setStitchFeedback(`RocksDB state updated! Identity joined in ${newWin.stitchLatencyMs}ms (< 50ms SLA). Triggered High-Risk flag!`);
    }, 700);
  };

  // Run simulated storage query
  const handleExecuteStorageQuery = () => {
    setIsExecutingQuery(true);
    setTimeout(() => {
      setIsExecutingQuery(false);
      if (selectedQueryType === 'clickhouse') {
        setQueryExecutionLog(
          `ClickHouse Query OK. Scanned 18,420,000 rows across 8 shards in 0.038 seconds. Aggregated 5M EPS telemetry partition. RAM: 42 MB.`
        );
      } else if (selectedQueryType === 'memgraph') {
        setQueryExecutionLog(
          `Memgraph Cypher OK. Traversed 4 hops (Subscriber -> SIM -> IMEI -> Tower) across 182M node graph in 17.4ms. Bolt protocol returned 1 match.`
        );
      } else {
        setQueryExecutionLog(
          `Apache Iceberg / S3 Query OK. Scanned metadata manifest for 7-year WORM partition. 0 blocks altered (WORM invariant preserved). Time: 1.82s.`
        );
      }
    }, 450);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Module Identity */}
      <div className="bg-black text-white p-6 border border-black shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase bg-white text-black border border-white">
                MODULE 2: INGESTION & NORMALIZATION
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase border border-white/30 text-white/80">
                18 TELECOM SYSTEMS
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase border border-emerald-400 text-emerald-300">
                OCSF TELECOM EXTENSION v1.2
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              18-System SIEM Ingestion & Stateful Normalization Fabric
            </h1>
            <p className="text-sm text-white/70 mt-1 max-w-3xl">
              Owner: Product Architect & Lead Data/Streaming Engineer · Unified Hot/Graph/Cold Lakehouse with Apache Flink 1.20 stateful correlation joining ephemeral identifiers (TMSI, GUTI, CGNAT IP) in under 50ms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSources((prev) =>
                  prev.map((s) => ({
                    ...s,
                    epsRate: Math.floor(s.epsRate * (1 + (Math.random() * 0.1 - 0.05)))
                  }))
                );
              }}
              className="border-white/30 text-white hover:bg-white hover:text-black cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Refresh Connectors
            </Button>
            <div className="text-right pl-3 border-l border-white/20">
              <div className="text-xs font-mono text-white/60">LIVE EPS INGESTION</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {(totalEps / 1000000).toFixed(2)}M EPS
              </div>
            </div>
          </div>
        </div>

        {/* Real-time SLAs Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">BASELINE EPS: </span>
              <span className="text-white font-medium">1,500,000 EPS</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">PEAK BURST SLA: </span>
              <span className="text-white font-medium">5,000,000 EPS</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">FLINK JOIN SLA: </span>
              <span className="text-white font-medium">&lt; 50ms (RocksDB)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">STORAGE COMPLIANCE: </span>
              <span className="text-white font-medium">7-Yr WORM S3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center border-b border-black/10 gap-2 overflow-x-auto pb-1">
        {[
          { tab: 'connectors_matrix', label: '18-Source Unified Connector Matrix' },
          { tab: 'flink_stateful', label: 'Apache Flink Stateful Stream Correlation' },
          { tab: 'tiered_storage', label: 'Tiered Storage Architecture (Hot/Graph/Cold)' },
          { tab: 'ai_shadow_spec', label: 'AI Build Shadow Spec (Protobuf/Java/SQL)' }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab as SiemFabricTab)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === item.tab
                ? 'border-black text-black font-semibold'
                : 'border-transparent text-black/60 hover:text-black hover:border-black/30'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB 1: 18-SOURCE CONNECTOR MATRIX */}
      {activeTab === 'connectors_matrix' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'Signaling & Edge', 'Core & Mobility', 'Radio & Access', 'Business & Identity'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-mono transition-colors border cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-black text-white border-black font-medium'
                        : 'bg-white text-black/70 border-black/20 hover:border-black'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-black/40" />
              <input
                type="text"
                placeholder="Search connector name, protocol, OCSF class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-black/20 focus:outline-none focus:border-black font-mono"
              />
            </div>
          </div>

          {/* Connectors Table */}
          <div className="border border-black/10 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-50 border-b border-black/10 uppercase tracking-wider text-black/70">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3">Source Telecom System</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Protocol / Wire Ingest</th>
                    <th className="p-3 text-right">Throughput</th>
                    <th className="p-3 text-right">P99 Ingest</th>
                    <th className="p-3">OCSF Telecom Class</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredSources.map((source) => (
                    <tr key={source.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-3 text-center font-bold text-black/60">{source.id}</td>
                      <td className="p-3">
                        <div className="font-medium text-black font-sans">{source.name}</div>
                        <div className="text-[11px] text-black/50 font-mono mt-0.5 truncate max-w-sm">
                          {source.description}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] border border-black/20 bg-zinc-50">
                          {source.category}
                        </span>
                      </td>
                      <td className="p-3 text-black/80">{source.protocol}</td>
                      <td className="p-3 text-right">
                        <span className="font-semibold text-black">
                          {(source.epsRate / 1000).toFixed(0)}k EPS
                        </span>
                        <span className="text-[10px] text-black/40 block">
                          Peak {(source.peakEpsRate / 1000).toFixed(0)}k
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-black">
                        {source.latencyMs}ms
                      </td>
                      <td className="p-3 text-black/70 text-[11px] font-mono">
                        {source.ocsfClass}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] border border-emerald-600 bg-emerald-50 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* OCSF Normalization Inspector Card */}
          <div className="border border-black p-5 bg-zinc-50">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                  OCSF Telecom Extension Normalization Pipeline
                </h3>
                <p className="text-xs text-black/60">
                  Select a live normalized event sample to view raw wire ingest vs standardized OCSF JSON payload.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {SAMPLE_OCSF_EVENTS.map((sample) => (
                  <button
                    key={sample.eventUuid}
                    onClick={() => setSelectedOcsfSample(sample)}
                    className={`px-3 py-1 text-xs font-mono border cursor-pointer ${
                      selectedOcsfSample?.eventUuid === sample.eventUuid
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-black/70 border-black/20 hover:border-black'
                    }`}
                  >
                    System {sample.sourceSystemId}: {sample.sourceSystemName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {selectedOcsfSample && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 border border-black/10">
                  <div className="text-xs font-mono font-medium text-black/50 uppercase mb-2">
                    Raw Heterogeneous Ingest (Source {selectedOcsfSample.sourceSystemId})
                  </div>
                  <div className="p-3 bg-zinc-100 font-mono text-xs text-black/80 border border-black/10 mb-3">
                    {selectedOcsfSample.rawPayloadSnippet}
                  </div>
                  <div className="space-y-1.5 text-xs font-mono text-black/70">
                    <div>
                      <span className="text-black/40">Timestamp: </span>
                      {selectedOcsfSample.timestampIso}
                    </div>
                    <div>
                      <span className="text-black/40">Target IMSI: </span>
                      {selectedOcsfSample.imsi}
                    </div>
                    <div>
                      <span className="text-black/40">Target IMEI: </span>
                      {selectedOcsfSample.imei}
                    </div>
                    <div>
                      <span className="text-black/40">Target MSISDN: </span>
                      {selectedOcsfSample.msisdn}
                    </div>
                    <div>
                      <span className="text-black/40">Estimated Fraud Loss Prevented: </span>
                      <span className="font-bold text-emerald-700">
                        ${selectedOcsfSample.fraudLossEstimateUsd.toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-black text-white p-4 border border-black">
                  <div className="flex items-center justify-between text-xs font-mono text-white/50 uppercase mb-2">
                    <span>Standardized OCSF Telecom JSON (Class 900x)</span>
                    <button
                      onClick={() => handleCopyCode(selectedOcsfSample.ocsfNormalizedJson)}
                      className="text-white hover:text-emerald-400 cursor-pointer flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 bg-zinc-950 p-3 border border-white/10 overflow-x-auto max-h-64 leading-relaxed">
                    {selectedOcsfSample.ocsfNormalizedJson}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FLINK STATEFUL STREAM CORRELATION */}
      {activeTab === 'flink_stateful' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-zinc-50 border border-black/10">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                Apache Flink 1.20 · 15-Minute Sliding Window Correlation
              </h3>
              <p className="text-xs text-black/60 mt-0.5">
                Keyed by IMSI, IMEI, MSISDN, Cell-ID, and CGNAT IP. Ephemeral identifiers (TMSI, GUTI, CGNAT Private IP) joined to persistent subscriber records in real time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSimulateStitch}
                disabled={isSimulatingStitch}
                className="bg-black text-white hover:bg-zinc-800 cursor-pointer text-xs"
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                {isSimulatingStitch ? 'Stitching Identity...' : 'Simulate Ingestion & Stitch'}
              </Button>
            </div>
          </div>

          {stitchFeedback && (
            <div className="p-3 text-xs font-mono bg-zinc-100 border-l-4 border-black text-black">
              {stitchFeedback}
            </div>
          )}

          {/* Correlations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-black/10 bg-white">
              <div className="p-3 bg-zinc-50 border-b border-black/10 font-mono text-xs font-medium uppercase text-black/70 flex justify-between">
                <span>Active 15-Min Sliding Correlated Windows</span>
                <span>RocksDB State Size: 1.84 GB</span>
              </div>
              <div className="divide-y divide-black/5">
                {correlations.map((win) => (
                  <div
                    key={win.windowId}
                    onClick={() => setSelectedCorrelation(win)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedCorrelation?.windowId === win.windowId
                        ? 'bg-zinc-100 border-l-4 border-black'
                        : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-black">{win.windowId}</span>
                        <span className="text-[10px] font-mono text-black/50">[{win.timeWindow}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-black/60">
                          Join: <strong className="text-black">{win.stitchLatencyMs}ms</strong>
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono uppercase font-semibold ${
                            win.correlationStatus === 'IDENTITY_DISCREPANCY'
                              ? 'border border-red-500 bg-red-50 text-red-700'
                              : 'border border-emerald-600 bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {win.correlationStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono text-black/70 mb-2">
                      <div>
                        <span className="text-black/40 block text-[10px]">MSISDN</span>
                        <span className="text-black font-semibold">{win.msisdn}</span>
                      </div>
                      <div>
                        <span className="text-black/40 block text-[10px]">IMSI / IMEI</span>
                        <span className="truncate block">{win.imsi.substring(0, 7)}... / {win.imei.substring(0, 6)}...</span>
                      </div>
                      <div>
                        <span className="text-black/40 block text-[10px]">CGNAT IP &rarr; PUBLIC</span>
                        <span className="truncate block">{win.cgnatPrivateIp} &rarr; {win.publicIp}</span>
                      </div>
                      <div>
                        <span className="text-black/40 block text-[10px]">RISK SCORE</span>
                        <span className={`font-bold ${win.riskScore > 0.8 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {(win.riskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {win.flags.map((flag) => (
                        <span
                          key={flag}
                          className="px-2 py-0.5 text-[10px] font-mono border border-black/15 bg-white text-black/80"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Correlation Deep-Dive */}
            <div className="border border-black p-4 bg-zinc-50 space-y-4">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-black pb-2 border-b border-black/10">
                Identity Stitcher Deep-Dive
              </h4>

              {selectedCorrelation ? (
                <div className="space-y-3 text-xs font-mono">
                  <div className="bg-white p-3 border border-black/10 space-y-2">
                    <div className="text-[11px] font-semibold text-black uppercase">
                      Persistent Subscriber Identities
                    </div>
                    <div>
                      <span className="text-black/50">MSISDN: </span>
                      <strong className="text-black">{selectedCorrelation.msisdn}</strong>
                    </div>
                    <div>
                      <span className="text-black/50">True IMSI: </span>
                      <span className="text-black">{selectedCorrelation.imsi}</span>
                    </div>
                    <div>
                      <span className="text-black/50">IMEI Hardware TAC: </span>
                      <span className="text-black">{selectedCorrelation.imei}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 border border-black/10 space-y-2">
                    <div className="text-[11px] font-semibold text-black uppercase">
                      Ephemeral Joined Identifiers
                    </div>
                    <div>
                      <span className="text-black/50">Current TMSI: </span>
                      <span className="text-black">{selectedCorrelation.tmsi}</span>
                    </div>
                    <div>
                      <span className="text-black/50">GUTI: </span>
                      <span className="text-black truncate block">{selectedCorrelation.guti}</span>
                    </div>
                    <div>
                      <span className="text-black/50">CGNAT Private IP: </span>
                      <span className="text-black">{selectedCorrelation.cgnatPrivateIp}</span>
                    </div>
                    <div>
                      <span className="text-black/50">Egress Public IP: </span>
                      <span className="text-black">{selectedCorrelation.publicIp}</span>
                    </div>
                    <div>
                      <span className="text-black/50">Anchor Cell-ID: </span>
                      <span className="text-black">{selectedCorrelation.cellId}</span>
                    </div>
                    {selectedCorrelation.posAgentId && (
                      <div>
                        <span className="text-black/50">POS Agent ID: </span>
                        <strong className="text-red-700">{selectedCorrelation.posAgentId}</strong>
                      </div>
                    )}
                  </div>

                  <div className="p-3 border border-black bg-black text-white">
                    <div className="text-[10px] text-white/50 uppercase mb-1">State Engine Status</div>
                    <div className="text-xs text-emerald-400 font-semibold">
                      JOINED IN {selectedCorrelation.stitchLatencyMs}ms VIA KEYEDCOPROCESS
                    </div>
                    <div className="text-[11px] text-white/70 mt-1">
                      Apache Flink 1.20 state backend: RocksDB on NVMe cluster. Zero data drops.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-black/50 font-mono py-8 text-center">
                  Select a window above to inspect stitched state.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIERED STORAGE ARCHITECTURE */}
      {activeTab === 'tiered_storage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORAGE_TIER_METRICS.map((tier) => (
              <div key={tier.tierName} className="border border-black p-5 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-black text-white">
                      {tier.tierName.split(' ')[0]} TIER
                    </span>
                    <span className="text-xs font-mono font-bold text-black">{tier.retentionWindow}</span>
                  </div>
                  <h3 className="text-base font-semibold text-black mb-1">{tier.tierName}</h3>
                  <div className="text-xs font-mono text-black/60 mb-4">{tier.technology}</div>

                  <div className="space-y-2.5 text-xs font-mono border-t border-black/10 pt-3">
                    <div>
                      <span className="text-black/40 block text-[10px]">P99 QUERY LATENCY</span>
                      <strong className="text-black">{tier.queryLatencyP99}</strong>
                    </div>
                    <div>
                      <span className="text-black/40 block text-[10px]">CURRENT INGEST RATE</span>
                      <span className="text-black">{tier.currentIngestionRate}</span>
                    </div>
                    <div>
                      <span className="text-black/40 block text-[10px]">CAPACITY USED</span>
                      <span className="text-black">{tier.storageCapacityUsed}</span>
                    </div>
                    <div>
                      <span className="text-black/40 block text-[10px]">ENCRYPTION & SECURITY</span>
                      <span className="text-black">{tier.encryptionStandard}</span>
                    </div>
                    <div>
                      <span className="text-black/40 block text-[10px]">REGULATORY AUDIT SLA</span>
                      <span className="text-emerald-700 font-semibold">{tier.complianceLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-black/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedQueryType(
                        tier.tierName.includes('ClickHouse')
                          ? 'clickhouse'
                          : tier.tierName.includes('Memgraph')
                          ? 'memgraph'
                          : 'iceberg'
                      );
                      handleExecuteStorageQuery();
                    }}
                    className="w-full text-xs font-mono border-black text-black hover:bg-black hover:text-white cursor-pointer"
                  >
                    Test Query Latency SLA
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Query Simulation Terminal */}
          <div className="border border-black bg-zinc-950 text-white p-5 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span>
                <span className="text-white/60">SOVEREIGN LAKEHOUSE QUERY RUNNER: </span>
                <span className="text-white font-bold uppercase">{selectedQueryType}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setSelectedQueryType('clickhouse')}
                  className={`px-2.5 py-1 text-[11px] border cursor-pointer ${
                    selectedQueryType === 'clickhouse' ? 'bg-white text-black border-white' : 'border-white/20 text-white/70'
                  }`}
                >
                  ClickHouse (5M EPS)
                </button>
                <button
                  onClick={() => setSelectedQueryType('memgraph')}
                  className={`px-2.5 py-1 text-[11px] border cursor-pointer ${
                    selectedQueryType === 'memgraph' ? 'bg-white text-black border-white' : 'border-white/20 text-white/70'
                  }`}
                >
                  Memgraph (Cypher)
                </button>
                <button
                  onClick={() => setSelectedQueryType('iceberg')}
                  className={`px-2.5 py-1 text-[11px] border cursor-pointer ${
                    selectedQueryType === 'iceberg' ? 'bg-white text-black border-white' : 'border-white/20 text-white/70'
                  }`}
                >
                  Iceberg (7-Yr WORM)
                </button>
              </div>
            </div>

            <div className="p-3 bg-black border border-white/10 text-xs text-white/90 mb-3 leading-relaxed">
              {selectedQueryType === 'clickhouse' && (
                <code>
                  SELECT source_system_id, count(), sum(fraud_loss_estimate_usd) FROM telecom_siem_lakehouse.telecom_events_hot WHERE event_time &gt;= now() - INTERVAL 1 HOUR GROUP BY source_system_id ORDER BY count() DESC;
                </code>
              )}
              {selectedQueryType === 'memgraph' && (
                <code>
                  MATCH path = (s:Subscriber &#123;msisdn: '+254722819201'&#125;)-[:BOUND_TO_ESIM]-&gt;(:SIM)&lt;-[:REPROVISIONED_BY]-(a:Agent) RETURN path;
                </code>
              )}
              {selectedQueryType === 'iceberg' && (
                <code>
                  SELECT * FROM iceberg_compliance.worm_audit_7yr WHERE event_year = 2026 AND legal_hold_flag = true LIMIT 10;
                </code>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteStorageQuery}
                disabled={isExecutingQuery}
                className="bg-white text-black hover:bg-zinc-200 cursor-pointer text-xs"
              >
                {isExecutingQuery ? 'Running Query...' : 'Execute Live Query'}
              </Button>
              <div className="text-xs text-emerald-400">
                {queryExecutionLog || 'Click execute to benchmark query execution.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI SHADOW SPECIFICATION */}
      {activeTab === 'ai_shadow_spec' && (
        <div className="space-y-6">
          <div className="p-5 bg-black text-white border border-black">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/15">
              <div>
                <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase bg-white text-black border border-white">
                  SHADOW MODULE ID: MOD-02-SIEM-FABRIC
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-white mt-1">
                  Target Agent: data-pipeline-streaming-architect
                </h3>
                <p className="text-xs font-mono text-white/70 mt-0.5">
                  Runtime: Redpanda / Kafka (RF=3) + Apache Flink 1.20 (Java 21 / RocksDB) + ClickHouse (ReplicatedMergeTree) + Memgraph (Bolt)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(SIEM_AI_SHADOW_ARTIFACTS[activeArtifactIdx].code)}
                  className="px-3 py-1.5 text-xs font-mono bg-white text-black hover:bg-zinc-200 cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {SIEM_AI_SHADOW_ARTIFACTS.map((art, idx) => (
                <button
                  key={art.path}
                  onClick={() => setActiveArtifactIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-mono border cursor-pointer whitespace-nowrap ${
                    activeArtifactIdx === idx
                      ? 'bg-white text-black border-white font-semibold'
                      : 'border-white/20 text-white/70 hover:border-white/50'
                  }`}
                >
                  {art.path.split('/').pop()} ({art.language})
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-zinc-900 border border-white/10 text-xs font-mono text-white/80">
              <span className="text-white/40">Responsibility: </span>
              {SIEM_AI_SHADOW_ARTIFACTS[activeArtifactIdx].responsibility}
            </div>

            <pre className="mt-3 p-4 bg-zinc-950 text-emerald-300 font-mono text-xs border border-white/10 overflow-x-auto max-h-[500px] leading-relaxed">
              {SIEM_AI_SHADOW_ARTIFACTS[activeArtifactIdx].code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
