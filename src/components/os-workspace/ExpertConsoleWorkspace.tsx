import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Button, Select, Tabs, KeyValueTable, CalloutBanner } from '../../design-system';
import { TenantAccount } from '../../types/multiTenant';
import { INITIAL_ENGINEERING_LOGS } from './systemsCatalog';
import { DeploymentScenarioConfig, OsSectionId } from './types';
import { MandelaShellTerminal } from '../agnostic-os/MandelaShellTerminal';
import { DeveloperConsoleView } from '../agnostic-os/DeveloperConsoleView';

export type ExpertConsoleTab =
  | 'logs'
  | 'api_requests'
  | 'configuration'
  | 'dependencies'
  | 'validation'
  | 'summary'
  | 'shell'
  | 'dev_sdk';

interface ExpertConsoleWorkspaceProps {
  currentTenant: TenantAccount;
  scenario: DeploymentScenarioConfig;
  activeTab: ExpertConsoleTab;
  onChangeTab: (t: ExpertConsoleTab) => void;
  onSelectSection: (s: OsSectionId) => void;
}

export const useExpertConsoleSidebar = (
  currentTenant: TenantAccount,
  scenario: DeploymentScenarioConfig,
  selectedSystem: string,
  setSelectedSystem: (s: string) => void,
  selectedStage: string,
  setSelectedStage: (s: string) => void,
  eventCategory: string,
  setEventCategory: (s: string) => void,
  onSelectSection: (s: OsSectionId) => void
) => (
  <div className="p-4 space-y-3.5">
    <div className="font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-2">
      ENGINEERING INSPECTOR
    </div>

    <Select
      label="PROJECT"
      value={scenario.project}
      onChange={() => {}}
      options={[{ label: scenario.project, value: scenario.project }]}
    />
    <Select
      label="DEPLOYMENT"
      value={scenario.deploymentId}
      onChange={() => {}}
      options={[{ label: scenario.deploymentId, value: scenario.deploymentId }]}
    />
    <Select
      label="SYSTEM"
      value={selectedSystem}
      onChange={(e) => setSelectedSystem(e.target.value)}
      options={[
        { label: '11 — Optical Ground Stations', value: '11' },
        { label: '01 — Number Management', value: '01' },
        { label: '04 — SIP Core & SBC', value: '04' },
        { label: '07 — Compute Fabric', value: '07' },
        { label: '10 — Satellite Fleet', value: '10' },
        { label: '14 — Backhaul Integration', value: '14' },
        { label: '17 — Fraud & SOC', value: '17' }
      ]}
    />
    <Select
      label="SELECTED STAGE"
      value={selectedStage}
      onChange={(e) => setSelectedStage(e.target.value)}
      options={[
        { label: 'Stage 3 (Skipped — Route-B)', value: '3' },
        { label: 'Stage 1 (Power)', value: '1' },
        { label: 'Stage 2 (Satellite)', value: '2' },
        { label: 'Stage 6 (Number & SIP)', value: '6' }
      ]}
    />
    <Select
      label="ENVIRONMENT"
      value="Demo"
      onChange={() => {}}
      options={[{ label: 'Demo', value: 'Demo' }]}
    />
    <Select
      label="EVENT CATEGORY"
      value={eventCategory}
      onChange={(e) => setEventCategory(e.target.value)}
      options={[
        { label: 'All', value: 'ALL' },
        { label: 'orchestrator', value: 'orchestrator' },
        { label: 'dependency', value: 'dependency' },
        { label: 'workflow', value: 'workflow' }
      ]}
    />

    <KeyValueTable
      title="DEPLOYMENT SUMMARY"
      rows={[
        { key: 'DEPLOYMENT ID', value: scenario.deploymentId },
        { key: 'VERSION', value: '2' },
        { key: 'ORG', value: currentTenant.name },
        { key: 'STAGE STATE', value: selectedStage === '3' ? 'Skipped' : 'Simulated' }
      ]}
    />

    <Button
      variant="primary"
      size="sm"
      className="w-full"
      onClick={() => onSelectSection('deployments')}
    >
      ← RETURN TO DEPLOYMENT
    </Button>
  </div>
);

export const ExpertConsoleWorkspace: React.FC<
  ExpertConsoleWorkspaceProps & {
    selectedSystem: string;
    selectedStage: string;
    eventCategory: string;
  }
> = ({
  scenario,
  activeTab,
  onChangeTab,
  onSelectSection,
  selectedSystem,
  selectedStage,
  eventCategory
}) => {
  const [copiedJson, setCopiedJson] = useState(false);

  const jsonPayload = JSON.stringify(
    {
      deployment_id: scenario.deploymentId,
      version: 2,
      environment: 'demo',
      site: `${scenario.site}`,
      stage: {
        number: Number(selectedStage),
        system: Number(selectedSystem),
        state: selectedStage === '3' ? 'skipped' : 'simulated',
        reason: selectedStage === '3' ? 'alternative_demo_route' : 'demo_simulation_complete'
      },
      coverage_verified: false,
      production_actions: false
    },
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1800);
  };

  const filteredLogs =
    eventCategory === 'ALL'
      ? INITIAL_ENGINEERING_LOGS
      : INITIAL_ENGINEERING_LOGS.filter((l) => l.component === eventCategory);

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-5">
      <div>
        <div className="font-mono text-xs font-bold uppercase text-zinc-600">
          EXPERT CONSOLE · SYSTEM {selectedSystem}
        </div>
        <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
          Infrastructure Engineering Workspace
        </h1>
      </div>

      {/* Action Strip (WF-30) */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" size="sm" onClick={() => onChangeTab('configuration')}>
          INSPECT JSON
        </Button>
        <Button variant="primary" size="sm" onClick={() => onChangeTab('dependencies')}>
          DEPENDENCY GRAPH
        </Button>
        <Button variant="primary" size="sm" onClick={() => onChangeTab('validation')}>
          VALIDATE
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          onClick={handleCopyJson}
        >
          {copiedJson ? 'COPIED JSON' : 'COPY JSON'}
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={<Download className="w-3.5 h-3.5" />}
          onClick={() => {
            const blob = new Blob([jsonPayload], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${scenario.deploymentId.toLowerCase()}-stage-${selectedStage}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          EXPORT SAMPLE
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onSelectSection('deployments')}>
          RETURN TO DEPLOYMENT
        </Button>
      </div>

      {/* 4 Summary Cards (WF-30) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-black bg-white p-3.5">
          <div className="font-mono text-[10px] font-bold uppercase text-zinc-600">WORKFLOW STATE</div>
          <div className="text-sm font-extrabold text-black mt-1">Simulated complete</div>
          <div className="text-xs text-zinc-600 mt-1">
            Version: v2 · Selected stage: {selectedStage} ({selectedStage === '3' ? 'skipped' : 'ok'})
          </div>
        </div>

        <div className="border border-black bg-white p-3.5">
          <div className="font-mono text-[10px] font-bold uppercase text-zinc-600">DEPENDENCY SUMMARY</div>
          <div className="text-sm font-extrabold text-black mt-1">Conditional route detected</div>
          <div className="text-xs text-zinc-600 mt-1">
            Alternative: route-B · service_unavailable = true
          </div>
        </div>

        <div className="border border-black bg-white p-3.5">
          <div className="font-mono text-[10px] font-bold uppercase text-zinc-600">TECHNICAL EVENTS</div>
          <div className="text-sm font-extrabold text-black mt-1">Demo stage skipped</div>
          <div className="text-xs text-zinc-600 mt-1 font-mono tabular-nums">
            Correlation: demo-001-s0{selectedStage}
          </div>
        </div>

        <div className="border border-black bg-white p-3.5">
          <div className="font-mono text-[10px] font-bold uppercase text-zinc-600">CONFIGURATION</div>
          <pre className="font-mono text-[11px] text-black mt-1 leading-snug">
{`environment: demo
system: ${selectedSystem}
status: ${selectedStage === '3' ? 'skipped' : 'simulated'}`}
          </pre>
        </div>
      </div>

      <CalloutBanner
        symbol="!"
        text="VALIDATION | Coverage remains unverified."
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'logs', label: 'LOGS (WF-32)' },
          { id: 'configuration', label: 'JSON INSPECTOR (WF-33)' },
          { id: 'dependencies', label: 'DEPENDENCY GRAPH (WF-31)' },
          { id: 'api_requests', label: 'API REQUESTS' },
          { id: 'validation', label: 'VALIDATION (WF-34)' },
          { id: 'summary', label: 'SUMMARY (WF-35)' },
          { id: 'shell', label: 'LINUX SHELL (MSH)' },
          { id: 'dev_sdk', label: 'DEV & SDK CONSOLE' }
        ]}
        activeId={activeTab}
        onChange={(id) => onChangeTab(id as ExpertConsoleTab)}
      />

      {activeTab === 'logs' && (
        <div className="border border-black bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b border-black bg-zinc-50 font-mono uppercase">
                <th className="py-2.5 px-3.5">TIME (UTC)</th>
                <th className="py-2.5 px-3.5">LEVEL</th>
                <th className="py-2.5 px-3.5">COMPONENT</th>
                <th className="py-2.5 px-3.5">MESSAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/15">
              {filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td className="py-2.5 px-3.5 font-mono whitespace-nowrap">{log.timeUtc}</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold">{log.level}</td>
                  <td className="py-2.5 px-3.5 font-mono">{log.component}</td>
                  <td className="py-2.5 px-3.5">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'configuration' && (
        <div className="space-y-4">
          <pre className="border border-black bg-white p-5 font-mono text-sm overflow-x-auto tabular-nums leading-relaxed">
            {jsonPayload}
          </pre>
          <div className="border border-black p-4 bg-white">
            <div className="font-mono text-xs font-bold uppercase">API</div>
            <div className="text-sm text-zinc-700 mt-0.5">Sample payload only — no request sent.</div>
          </div>
        </div>
      )}

      {activeTab === 'dependencies' && (
        <div className="space-y-4">
          {/* Dependency Graph Box (WF-31) */}
          <div className="border border-black bg-white p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase">
              DEPENDENCY GRAPH ({scenario.deploymentId} v2)
            </div>

            <div className="overflow-x-auto py-2">
              <div className="flex items-center gap-3 min-w-[720px] text-center text-xs font-sans">
                <div className="border-2 border-black p-3 min-w-[110px]">
                  <div className="font-extrabold">System 12</div>
                  <div>Power</div>
                </div>
                <span className="font-mono font-bold">→</span>
                <div className="border-2 border-black p-3 min-w-[110px]">
                  <div className="font-extrabold">System 10</div>
                  <div>Satellite</div>
                </div>
                <span className="font-mono font-bold">→</span>
                <div className="space-y-2">
                  <div className="border border-dashed border-black p-2.5 min-w-[130px] relative opacity-75">
                    <div className="font-extrabold line-through">System 11</div>
                    <div className="line-through">Optical (Skipped)</div>
                  </div>
                  <div className="border-2 border-black p-2.5 min-w-[130px] bg-zinc-50">
                    <div className="font-extrabold">System 14</div>
                    <div>Backhaul (Conditional)</div>
                  </div>
                </div>
                <span className="font-mono font-bold">→</span>
                <div className="border-2 border-black p-3 min-w-[110px]">
                  <div className="font-extrabold">System 07</div>
                  <div>Compute</div>
                </div>
                <span className="font-mono font-bold">→</span>
                <div className="space-y-2">
                  <div className="border-2 border-black p-2.5 min-w-[140px]">
                    <div className="font-extrabold">System 01</div>
                    <div>Numbering</div>
                  </div>
                  <div className="border-2 border-black p-2.5 min-w-[140px]">
                    <div className="font-extrabold">System 04</div>
                    <div>SIP Core &amp; SBC</div>
                  </div>
                </div>
                <span className="font-mono font-bold">→</span>
                <div className="border-2 border-black p-3 min-w-[110px]">
                  <div className="font-extrabold">System 17</div>
                  <div>Security</div>
                </div>
              </div>
            </div>

            <div className="border-t border-black pt-3 flex flex-wrap gap-6 text-[11px] font-mono font-bold uppercase">
              <span>──▶ = REQUIRED DEMO DEPENDENCY</span>
              <span>- - ▶ = CONDITIONAL DEPENDENCY</span>
              <span>[X] = SKIPPED (NOT DEPLOYED)</span>
            </div>
          </div>

          {/* Accessible Dependency Table */}
          <div className="border border-black bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-black bg-zinc-50 font-mono uppercase">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">DEPENDENCY</th>
                  <th className="py-2 px-3">TYPE</th>
                  <th className="py-2 px-3">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/15">
                {[
                  ['1', 'System 12 Power → System 10 Satellite', 'Required', 'Power provides prerequisite capacity for the Satellite system.'],
                  ['2', 'System 10 Satellite → System 11 Optical', 'Conditional', 'Optional optical route (skipped in this deployment).'],
                  ['3', 'System 11 Optical', 'Skipped', 'Not deployed — Alternative demo route selected.'],
                  ['4', 'System 10 Satellite → System 14 Backhaul', 'Conditional', 'Alternative backhaul route (active when Optical is skipped).'],
                  ['5', 'System 14 Backhaul → System 07 Compute', 'Required', 'Backhaul connectivity required for Compute deployment.'],
                  ['6', 'System 16 Identity → Systems 01/04 Communications', 'Required', 'Identity is a prerequisite for both Communications systems.'],
                  ['7', 'System 07 Compute → System 01/04 Communications', 'Required', 'Compute provides platform services for Voice, SMS & Numbers.'],
                  ['8', 'Systems 01/04 Communications → System 17 Security', 'Required', 'Security is the final gate after Communications are available.']
                ].map(([idx, dep, type, desc]) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-mono tabular-nums">{idx}</td>
                    <td className="py-2 px-3 font-bold">{dep}</td>
                    <td className="py-2 px-3 font-mono">{type}</td>
                    <td className="py-2 px-3 text-zinc-700">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'api_requests' && (
        <div className="border border-black bg-white p-5 space-y-3 text-xs font-mono">
          <div className="font-bold uppercase">RECENT GATEWAY / ORCHESTRATOR API CALLS</div>
          <div className="border border-black p-3 flex justify-between">
            <span>POST /api/v1/deployments/DEMO-001/simulate</span>
            <span className="font-bold">200 OK (SIMULATED)</span>
          </div>
          <div className="border border-black p-3 flex justify-between">
            <span>GET /api/v1/systems/11/readiness</span>
            <span className="font-bold">200 OK (UNVERIFIED)</span>
          </div>
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="border border-black bg-white p-5 space-y-3 text-sm">
          <div className="font-mono text-xs font-bold uppercase">TECHNICAL VALIDATION (WF-34)</div>
          <div className="border border-black p-3 flex justify-between">
            <span className="font-semibold">Schema &amp; Dependency Graph Integrity</span>
            <span className="font-mono font-bold text-xs">PASS</span>
          </div>
          <div className="border border-black p-3 flex justify-between">
            <span className="font-semibold">Stage 3 Optical Ground Coverage</span>
            <span className="font-mono font-bold text-xs">WARN — FALLBACK ROUTE-B ACTIVE</span>
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <KeyValueTable
          title="DEPLOYMENT SUMMARY (WF-35)"
          rows={[
            { key: 'DEPLOYMENT', value: `${scenario.deploymentId} v2` },
            { key: 'PROJECT', value: `${scenario.project} — ${scenario.site}` },
            { key: 'OUTCOME', value: '7 simulated / 1 skipped (System 11 Optical → Route-B)' },
            { key: 'ENVIRONMENT', value: 'Demo planning environment — no live infrastructure changes.' }
          ]}
        />
      )}

      {activeTab === 'shell' && (
        <div className="bg-zinc-950 border border-black p-3 text-zinc-100">
          <MandelaShellTerminal />
        </div>
      )}

      {activeTab === 'dev_sdk' && (
        <div className="bg-zinc-950 border border-black p-3 text-zinc-100">
          <DeveloperConsoleView />
        </div>
      )}
    </div>
  );
};
