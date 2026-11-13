import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Zap,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  Clock,
  Radio,
  FileCode,
  Network,
  Users,
  Compass,
  Mic,
  Server,
  ArrowRight,
  Flame,
  Volume2,
  Check
} from 'lucide-react';
import { SocC2Tab } from '../../types/multiTenant';
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
  INITIAL_SOC_KPIS,
  INITIAL_QUARANTINE_ITEMS,
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_EDGES,
  INITIAL_PLAYBOOKS,
  SocKpiMetrics,
  SimSwapQuarantineItem,
  EntityGraphNode,
  SocMitigationPlaybook
} from '../../data/mockSocC2Data';
import { ThreatGeospatialView } from './ThreatGeospatialView';

interface SocC2SuiteProps {
  currentTenantId?: string;
  onNavigateToModule?: (product: string) => void;
}

export const SocC2Suite: React.FC<SocC2SuiteProps> = ({ onNavigateToModule }) => {
  const [activeTab, setActiveTab] = useState<SocC2Tab>('threat_matrix');
  const [kpis, setKpis] = useState<SocKpiMetrics>(INITIAL_SOC_KPIS);
  const [quarantineItems, setQuarantineItems] = useState<SimSwapQuarantineItem[]>(INITIAL_QUARANTINE_ITEMS);
  const [selectedQuarantine, setSelectedQuarantine] = useState<SimSwapQuarantineItem | null>(INITIAL_QUARANTINE_ITEMS[0]);
  const [quarantineFeedback, setQuarantineFeedback] = useState<string | null>(null);

  // Entity Graph state
  const [selectedNode, setSelectedNode] = useState<EntityGraphNode | null>(INITIAL_GRAPH_NODES[0]);

  // Playbooks state
  const [playbooks, setPlaybooks] = useState<SocMitigationPlaybook[]>(INITIAL_PLAYBOOKS);
  const [activeExecutingPlaybook, setActiveExecutingPlaybook] = useState<string | null>(null);
  const [playbookExecutionLogs, setPlaybookExecutionLogs] = useState<string[]>([]);

  // Ticker animation for Fraud $ Blocked
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis((prev) => ({
        ...prev,
        fraudDollarsBlockedToday: prev.fraudDollarsBlockedToday + Math.floor(Math.random() * 85),
        attacksLiveTotal: prev.attacksLiveTotal + (Math.random() > 0.5 ? 1 : -1)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle Quarantine action
  const handleQuarantineAction = (
    itemId: string,
    action: 'FREEZE_HLR' | 'REVOKE_ESIM' | 'QUARANTINE_MFA' | 'ALLOWLIST'
  ) => {
    setQuarantineItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          let newStatus = item.status;
          let auditMsg = '';
          if (action === 'FREEZE_HLR') {
            newStatus = 'FROZEN_HLR';
            auditMsg = `Just now - HLR Profile Frozen. MAP_InsertSubscriberData revoked on VLR.`;
          } else if (action === 'REVOKE_ESIM') {
            newStatus = 'REVOKED_ESIM';
            auditMsg = `Just now - eSIM Token Revoked via SM-DP+ and POS agent flagged.`;
          } else if (action === 'QUARANTINE_MFA') {
            newStatus = 'MFA_QUARANTINED';
            auditMsg = `Just now - Banking MFA SMS quarantined in volatile memory.`;
          } else {
            newStatus = 'ALLOWLISTED';
            auditMsg = `Just now - Allowlisted as legitimate roaming activity.`;
          }

          const updated = {
            ...item,
            status: newStatus,
            auditTrail: [auditMsg, ...item.auditTrail]
          };
          setSelectedQuarantine(updated);
          return updated;
        }
        return item;
      })
    );
    setQuarantineFeedback(`Action ${action} executed immediately on subscriber ${selectedQuarantine?.msisdn}.`);
  };

  // Handle Geospatial Mitigation
  const handleGeospatialMitigation = (actionDesc: string, savedAmount: number) => {
    setKpis((prev) => ({
      ...prev,
      fraudDollarsBlockedToday: prev.fraudDollarsBlockedToday + savedAmount,
      attacksLiveTotal: Math.max(0, prev.attacksLiveTotal - 1)
    }));
  };

  // Run Playbook
  const handleRunPlaybook = (playbook: SocMitigationPlaybook) => {
    setActiveExecutingPlaybook(playbook.id);
    setPlaybookExecutionLogs([`[0.0s] Initiating ${playbook.id}...`]);

    setTimeout(() => {
      setPlaybookExecutionLogs((prev) => [...prev, `[0.4s] ${playbook.executionSteps[0]}`]);
    }, 300);

    setTimeout(() => {
      setPlaybookExecutionLogs((prev) => [...prev, `[0.9s] ${playbook.executionSteps[1]}`]);
    }, 700);

    setTimeout(() => {
      setPlaybookExecutionLogs((prev) => [
        ...prev,
        `[1.3s] ${playbook.executionSteps[2]}`,
        `[${playbook.automatedRunTimeS}s] SUCCESS: Playbook execution completed and verified in ${playbook.automatedRunTimeS}s (< 3.0s SLA).`
      ]);
      setActiveExecutingPlaybook(null);
      setPlaybooks((prev) =>
        prev.map((p) => (p.id === playbook.id ? { ...p, status: 'SUCCESS_ACTIVE', lastExecuted: 'Just now' } : p))
      );
    }, 1400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Module Identity */}
      <div className="bg-black text-white p-6 border border-black shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase bg-white text-black border border-white">
                MODULE 4: SOC COMMAND &amp; CONTROL
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase border border-white/30 text-white/80">
                REAL-TIME C2 UI
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase border border-emerald-400 text-emerald-300">
                MTTM: 2.1s SLA
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              SOC Command &amp; Control (C2) Experience &amp; Real-Time UI
            </h1>
            <p className="text-sm text-white/70 mt-1 max-w-3xl">
              Owner: Senior Full-Stack Engineer &amp; Principal UI/UX Architect · Live threat visualization, real-time financial loss prevention ticker, SIM-swap quarantine monitor, and guided one-click mitigation UI.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right pl-3 border-l border-white/20">
              <div className="text-xs font-mono text-white/60">FRAUD $ BLOCKED TODAY</div>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                ${kpis.fraudDollarsBlockedToday.toLocaleString()} USD
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time KPI Header */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6 pt-5 border-t border-white/10 text-xs font-mono">
          <div className="p-2.5 bg-zinc-900 border border-white/10">
            <div className="text-white/60 text-[10px]">ATTACKS LIVE</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {kpis.attacksLiveTotal} Active
            </div>
          </div>
          <div className="p-2.5 bg-zinc-900 border border-white/10">
            <div className="text-white/60 text-[10px]">SS7 &amp; DIAMETER</div>
            <div className="text-base font-bold text-white">
              {kpis.attacksLiveByPlane.ss7} / {kpis.attacksLiveByPlane.diameter}
            </div>
          </div>
          <div className="p-2.5 bg-zinc-900 border border-white/10">
            <div className="text-white/60 text-[10px]">SMS &amp; SIMJACKER</div>
            <div className="text-base font-bold text-white">{kpis.attacksLiveByPlane.sms} blocked</div>
          </div>
          <div className="p-2.5 bg-zinc-900 border border-white/10">
            <div className="text-white/60 text-[10px]">VOICE &amp; DEEPFAKE</div>
            <div className="text-base font-bold text-white">{kpis.attacksLiveByPlane.voiceSip} intercepted</div>
          </div>
          <div className="p-2.5 bg-zinc-900 border border-white/10">
            <div className="text-white/60 text-[10px]">SIM-SWAP QUARANTINE</div>
            <div className="text-base font-bold text-amber-400">{kpis.attacksLiveByPlane.simSwap} in triage</div>
          </div>
          <div className="p-2.5 bg-zinc-900 border border-white/10">
            <div className="text-white/60 text-[10px]">MTTM TO MITIGATE</div>
            <div className="text-base font-bold text-emerald-400">{kpis.meanTimeToMitigateSeconds}s &lt; 3.0s SLA</div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center border-b border-black/10 gap-2 overflow-x-auto pb-1">
        {[
          { tab: 'threat_matrix', label: 'Threat Overview & Protocol Planes' },
          { tab: 'simswap_quarantine', label: 'SIM-Swap & Account Drain Quarantine' },
          { tab: 'entity_graph', label: 'Multi-Hop Entity Relationship Graph' },
          { tab: 'geodesic_map', label: 'Threat Geospatial View (Deck.gl)' },
          { tab: 'acoustic_lab', label: 'Voice Deepfake Real-Time RTP Lab' },
          { tab: 'playbook_automation', label: 'Guided AI Mitigation Playbooks' }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab as SocC2Tab)}
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

      {/* TAB 1: THREAT MATRIX & PLANES */}
      {activeTab === 'threat_matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase text-black">Signaling &amp; Core Plane</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 font-mono text-[10px] font-bold">110 EVENTS/MIN</span>
              </div>
              <p className="text-xs text-black/60 mb-4">
                Active inline blocking of unauthorized MAP_InsertSubscriberData and Diameter S6a_CLR on international peering trunks.
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-zinc-50 border border-black/10">
                  <span>SS7 MAP Injections:</span>
                  <strong className="text-black">42 / min</strong>
                </div>
                <div className="flex justify-between p-2 bg-zinc-50 border border-black/10">
                  <span>Diameter S6a ULR Drops:</span>
                  <strong className="text-black">68 / min</strong>
                </div>
              </div>
            </div>

            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase text-black">Messaging &amp; Voice Plane</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 font-mono text-[10px] font-bold">153 EVENTS/MIN</span>
              </div>
              <p className="text-xs text-black/60 mb-4">
                FastText URL smishing defusal, Simjacker 0x7F UDH envelope stripping, and STIR/SHAKEN Level A verification.
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-zinc-50 border border-black/10">
                  <span>SMS Smishing Defused:</span>
                  <strong className="text-black">119 / min</strong>
                </div>
                <div className="flex justify-between p-2 bg-zinc-50 border border-black/10">
                  <span>DNO Spoofed Voice Drops:</span>
                  <strong className="text-black">34 / min</strong>
                </div>
              </div>
            </div>

            <div className="border border-black p-5 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold uppercase text-black">IXP DDoS &amp; Volumetric</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">0 DOWNTIME</span>
              </div>
              <p className="text-xs text-black/60 mb-4">
                Automated BGP FlowSpec announcements and Anycast eBPF/XDP drops mitigating GTP-U floods in under 1.8 seconds.
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-zinc-50 border border-black/10">
                  <span>Active Floods Scrubbed:</span>
                  <strong className="text-black">3 centers</strong>
                </div>
                <div className="flex justify-between p-2 bg-zinc-50 border border-black/10">
                  <span>Peak Scrubber Bandwidth:</span>
                  <strong className="text-black">2.4 Tbps capacity</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-black bg-zinc-50 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold uppercase text-black">
                Sovereign Telemetry &amp; Enclave Memory Compliance
              </div>
              <div className="text-xs text-black/60 mt-0.5">
                All voice RTP audio and subscriber PII processed strictly in ephemeral RAM enclaves and purged immediately. Zero plain-text disk storage.
              </div>
            </div>
            <span className="px-3 py-1 bg-black text-emerald-400 font-mono text-xs font-semibold">
              COMPLIANT · KENYA DATA PROTECTION ACT 2019
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: SIM-SWAP & ACCOUNT DRAIN QUARANTINE */}
      {activeTab === 'simswap_quarantine' && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-50 border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                SIM-Swap &amp; Fraud Quarantine Triage Queue
              </h3>
              <p className="text-xs text-black/60 mt-0.5">
                Real-time queue of subscribers with correlated post-swap risk flags. One-click actions to freeze HLR profile, revoke eSIM token, or quarantine banking MFA.
              </p>
            </div>
            <div className="text-xs font-mono text-black/70">
              Queue: <strong>{quarantineItems.length} High-Risk Targets</strong>
            </div>
          </div>

          {quarantineFeedback && (
            <div className="p-3 text-xs font-mono bg-zinc-100 border-l-4 border-black text-black">
              {quarantineFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-black/15 bg-white divide-y divide-black/5">
              {quarantineItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedQuarantine(item)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedQuarantine?.id === item.id ? 'bg-zinc-100 border-l-4 border-black' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-black">{item.id}</span>
                      <span className="text-xs font-bold text-black">{item.msisdn}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 border border-black/20 bg-white">
                        {item.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-red-700">
                        ${item.lossAtRiskUsd.toLocaleString()} USD at risk
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          item.status === 'PENDING_TRIAGE'
                            ? 'bg-red-600 text-white'
                            : item.status === 'ALLOWLISTED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-500'
                            : 'bg-zinc-900 text-white'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-black/80 font-sans mb-2 font-medium">
                    {item.subscriberName} · <span className="text-black/50">{item.flaggedReason}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-black/60 bg-zinc-50 p-2 border border-black/10">
                    <div>
                      <span className="text-black/40 block text-[9px]">SWAP AGENT</span>
                      <span className="text-black truncate block">{item.posAgent}</span>
                    </div>
                    <div>
                      <span className="text-black/40 block text-[9px]">CELL ATTACH</span>
                      <span className="text-black truncate block">{item.cellLocation}</span>
                    </div>
                    <div>
                      <span className="text-black/40 block text-[9px]">ELAPSED TIME</span>
                      <span className="text-red-700 font-bold">{item.elapsedSinceSwap}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Item Quarantine Actions */}
            <div className="border border-black p-5 bg-zinc-50 space-y-4">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-black pb-2 border-b border-black/10">
                1-Click Mitigation Triage
              </h4>

              {selectedQuarantine ? (
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-black/40 uppercase">Selected Subscriber</div>
                    <div className="text-base font-bold text-black">{selectedQuarantine.msisdn}</div>
                    <div className="text-[11px] text-black/60">IMSI: {selectedQuarantine.imsi}</div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-black/10">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuarantineAction(selectedQuarantine.id, 'FREEZE_HLR')}
                      className="w-full bg-red-600 text-white hover:bg-red-700 text-xs cursor-pointer"
                    >
                      Freeze HLR Profile (Immediate)
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuarantineAction(selectedQuarantine.id, 'REVOKE_ESIM')}
                      className="w-full bg-black text-white hover:bg-zinc-800 text-xs cursor-pointer"
                    >
                      Revoke eSIM Token (SM-DP+)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuarantineAction(selectedQuarantine.id, 'QUARANTINE_MFA')}
                      className="w-full border-black text-black hover:bg-black hover:text-white text-xs cursor-pointer"
                    >
                      Quarantine Banking MFA SMS
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuarantineAction(selectedQuarantine.id, 'ALLOWLIST')}
                      className="w-full border-black/30 text-black/70 hover:border-black hover:text-black text-xs cursor-pointer"
                    >
                      Allowlist Legitimate Roamer
                    </Button>
                  </div>

                  <div className="pt-3 border-t border-black/10">
                    <div className="text-[10px] font-semibold text-black/60 uppercase mb-1">Audit Trail</div>
                    <div className="space-y-1 text-[11px] text-black/70 bg-white p-2.5 border border-black/10 max-h-40 overflow-y-auto">
                      {selectedQuarantine.auditTrail.map((log, i) => (
                        <div key={i} className="leading-snug">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-black/50 py-8 text-center font-mono">
                  Select a subscriber from the queue.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-HOP ENTITY GRAPH */}
      {activeTab === 'entity_graph' && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-50 border border-black/10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                Memgraph / Neo4j Multi-Hop Relationship Graph
              </h3>
              <p className="text-xs text-black/60 mt-0.5">
                Tracks relationships in sub-second Cypher traversal: Subscriber &harr; SIM/ICCID &harr; IMEI Chassis &harr; Cell Tower &harr; POS Agent.
              </p>
            </div>
            <span className="px-3 py-1 bg-black text-white font-mono text-xs">
              182M Nodes · 890M Edges
            </span>
          </div>

          <div className="border border-black bg-white p-4">
            {/* SVG Visualizer */}
            <div className="relative w-full h-80 bg-zinc-950 border border-black overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 320">
                {/* Edges */}
                {INITIAL_GRAPH_EDGES.map((edge) => {
                  const sourceNode = INITIAL_GRAPH_NODES.find((n) => n.id === edge.source);
                  const targetNode = INITIAL_GRAPH_NODES.find((n) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;
                  return (
                    <g key={edge.id}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={edge.isThreatPath ? '#ef4444' : '#4ade80'}
                        strokeWidth="2"
                        strokeDasharray={edge.isThreatPath ? '4 2' : 'none'}
                      />
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 6}
                        fill="#ffffff"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        opacity="0.75"
                      >
                        {edge.label}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {INITIAL_GRAPH_NODES.map((node) => (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill={node.status === 'COMPROMISED' ? '#dc2626' : node.status === 'SUSPECT' ? '#d97706' : '#16a34a'}
                      stroke="#ffffff"
                      strokeWidth={selectedNode?.id === node.id ? '3' : '1'}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.type.substring(0, 3)}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 36}
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Selected Node Details Bar */}
            {selectedNode && (
              <div className="mt-4 p-4 bg-zinc-50 border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <div className="text-black/50 text-[10px] uppercase">SELECTED GRAPH ENTITY</div>
                  <div className="text-sm font-bold text-black">{selectedNode.label}</div>
                  <div className="text-black/70">{selectedNode.details}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold uppercase ${
                      selectedNode.status === 'COMPROMISED'
                        ? 'bg-red-600 text-white'
                        : selectedNode.status === 'SUSPECT'
                        ? 'bg-amber-100 text-amber-800 border border-amber-500'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-500'
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Isolating entity ${selectedNode.label} continent-wide.`)}
                    className="border-black text-black hover:bg-black hover:text-white text-xs cursor-pointer"
                  >
                    Isolate Entity in Memgraph
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: GEODESIC MAP & DECK.GL THREAT GEOSPATIAL VIEW */}
      {activeTab === 'geodesic_map' && (
        <div className="space-y-6">
          {/* Deck.gl Real-Time Attack Arcs Component */}
          <ThreatGeospatialView onMitigationTriggered={handleGeospatialMitigation} />

          <div className="p-4 bg-zinc-50 border border-black/10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
              African &amp; Interconnect Geodesic Anomaly Comparative Log
            </h3>
            <p className="text-xs text-black/60 mt-0.5">
              Live geographic velocity measurements comparing local RAN cell attaches against remote international SS7/Diameter signaling taps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-black p-5 bg-black text-white font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-emerald-400 font-bold uppercase">Vector 1: Nairobi &rarr; Bucharest</span>
                <span className="text-xs text-red-400">VELOCITY: 608,625 KM/H</span>
              </div>
              <div className="space-y-2 text-xs text-white/80">
                <div>
                  <span className="text-white/50">Point 1 (RAN): </span>
                  Nairobi CBD [-1.286, 36.817] @ 19:00:12 UTC
                </div>
                <div>
                  <span className="text-white/50">Point 2 (SS7 ULR): </span>
                  Bucharest GT [+40 722 000192] @ 19:00:44 UTC
                </div>
                <div>
                  <span className="text-white/50">Calculated Distance: </span>
                  5,410 km in 32 seconds
                </div>
              </div>
              <div className="p-3 bg-zinc-900 border border-white/10 text-xs text-emerald-400">
                STATUS: Rogue Global Title +40 722 000192 blocked in 1.4ms. VLR roaming profile locked.
              </div>
            </div>

            <div className="border border-black p-5 bg-black text-white font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-emerald-400 font-bold uppercase">Vector 2: Mombasa &rarr; Frankfurt</span>
                <span className="text-xs text-red-400">VELOCITY: 456,230 KM/H</span>
              </div>
              <div className="space-y-2 text-xs text-white/80">
                <div>
                  <span className="text-white/50">Point 1 (5G SA): </span>
                  Mombasa Port [-4.043, 39.668] @ 18:54:10 UTC
                </div>
                <div>
                  <span className="text-white/50">Point 2 (Diameter): </span>
                  Frankfurt DEA [dra-adversary.peer.io] @ 18:55:02 UTC
                </div>
                <div>
                  <span className="text-white/50">Calculated Distance: </span>
                  6,590 km in 52 seconds
                </div>
              </div>
              <div className="p-3 bg-zinc-900 border border-white/10 text-xs text-emerald-400">
                STATUS: Peering DEA isolated on Mombasa transit link. Cause code 3004 sent.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACOUSTIC LAB */}
      {activeTab === 'acoustic_lab' && (
        <div className="space-y-6">
          <div className="p-5 bg-black text-white border border-black">
            <h3 className="text-lg font-semibold tracking-tight text-white mb-1">
              Voice Deepfake &amp; Acoustic Telemetry Lab
            </h3>
            <p className="text-xs font-mono text-white/70">
              Real-time RTP audio stream inspector executing RawNet3 neural inference at the SBC/IVR edge in &lt; 40ms.
            </p>
            <div className="mt-4 p-4 bg-zinc-950 border border-white/10 font-mono text-xs text-emerald-400">
              RAM ENCLAVE PRIVACY HYGIENE: Audio PCM chunks are zero-wiped after inference. Sovereign verification passed.
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PLAYBOOK AUTOMATION */}
      {activeTab === 'playbook_automation' && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-50 border border-black/10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
              Guided One-Click AI Mitigation Playbooks
            </h3>
            <p className="text-xs text-black/60 mt-0.5">
              Automated multi-system mitigation playbooks orchestrating across GSMA EIR, eNodeB/gNodeB radio bearers, BGP FlowSpec, and STIR/SHAKEN STI-VS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playbooks.map((pb) => (
              <div key={pb.id} className="border border-black p-5 bg-white flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-black text-white">
                      {pb.targetPlane}
                    </span>
                    <span className="text-xs font-mono font-bold text-black">
                      SLA: {pb.automatedRunTimeS}s
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-black">{pb.name}</h4>
                  <p className="text-xs text-black/60 mt-1">{pb.description}</p>

                  <div className="mt-4 p-3 bg-zinc-50 border border-black/10 space-y-1.5 text-xs font-mono">
                    <div className="text-[10px] text-black/40 uppercase">Execution Steps:</div>
                    {pb.executionSteps.map((step, idx) => (
                      <div key={idx} className="text-black/80">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-black/50">Last Run: {pb.lastExecuted}</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRunPlaybook(pb)}
                    disabled={activeExecutingPlaybook !== null}
                    className="bg-black text-white hover:bg-zinc-800 text-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    {activeExecutingPlaybook === pb.id ? 'Running Playbook...' : 'Execute Playbook'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {playbookExecutionLogs.length > 0 && (
            <div className="border border-black bg-zinc-950 text-white p-4 font-mono text-xs space-y-1">
              <div className="text-white/50 uppercase pb-2 border-b border-white/10 mb-2">
                Live Playbook Orchestration Output
              </div>
              {playbookExecutionLogs.map((log, i) => (
                <div key={i} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-white/80'}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
