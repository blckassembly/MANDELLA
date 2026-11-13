import React, { useState } from 'react';
import { TenantAccount } from '../../types/multiTenant';
import { Button, Input, Select, Tabs, KeyValueTable } from '../../design-system';
import { DeploymentScenarioConfig, OsSectionId } from './types';
import { PortingRequest, AuditLogEntry } from '../../types/nms';

interface MissionControlWorkspaceProps {
  currentTenant: TenantAccount;
  scenario: DeploymentScenarioConfig;
  portingRequests: PortingRequest[];
  auditLogs: AuditLogEntry[];
  onSelectSection: (section: OsSectionId) => void;
  onCreateNewProject: () => void;
  onApprovePlan: () => void;
}

export const useMissionControlSidebar = (
  currentTenant: TenantAccount,
  scenario: DeploymentScenarioConfig,
  filterCountry: string,
  setFilterCountry: (c: string) => void,
  filterLayer: string,
  setFilterLayer: (l: string) => void,
  filterStatus: string,
  setFilterStatus: (s: string) => void,
  onReset: () => void
) => (
  <div className="p-4 space-y-4">
    <div className="font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-2">
      INFRASTRUCTURE INSPECTOR
    </div>
    <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">FILTERS</div>

    <div className="space-y-3">
      <Select
        label="ORGANIZATION"
        value={currentTenant.id}
        onChange={() => {}}
        options={[{ label: currentTenant.name, value: currentTenant.id }]}
      />
      <Select
        label="COUNTRY"
        value={filterCountry}
        onChange={(e) => setFilterCountry(e.target.value)}
        options={[
          { label: 'All Countries', value: 'ALL' },
          { label: 'DRC', value: 'DRC' },
          { label: 'Kenya', value: 'KE' },
          { label: 'Nigeria', value: 'NG' }
        ]}
      />
      <Select
        label="PROJECT"
        value={scenario.project}
        onChange={() => {}}
        options={[{ label: `${scenario.project} Connectivity`, value: scenario.project }]}
      />
      <Select
        label="INFRASTRUCTURE LAYER"
        value={filterLayer}
        onChange={(e) => setFilterLayer(e.target.value)}
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'Connectivity', value: 'Connectivity' },
          { label: 'Telecom & SIP', value: 'Telecom' },
          { label: 'Orbit / Satellite', value: 'Orbit' },
          { label: 'Security', value: 'Security' }
        ]}
      />
      <Select
        label="STATUS"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Active', value: 'ACTIVE' }
        ]}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input label="FROM" value="2025-01-01" readOnly />
        <Input label="TO" value="2025-03-31" readOnly />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 pt-2">
      <Button variant="primary" size="sm" onClick={() => {}}>
        APPLY FILTERS
      </Button>
      <Button variant="secondary" size="sm" onClick={onReset}>
        RESET
      </Button>
    </div>
  </div>
);

export const MissionControlWorkspace: React.FC<MissionControlWorkspaceProps> = ({
  currentTenant,
  scenario,
  portingRequests,
  auditLogs,
  onSelectSection,
  onCreateNewProject,
  onApprovePlan
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'approvals' | 'activity' | 'incidents' | 'audit'>('projects');

  const projectStatusLabel = scenario.planApproved
    ? 'APPROVED'
    : scenario.planGenerated
    ? 'PLAN READY'
    : 'DRAFT';

  const progressLabel =
    scenario.simulationStatus === 'complete'
      ? '7/8 simulated'
      : scenario.simulationStatus === 'running'
      ? `Stage ${scenario.activeStageIndex + 1}/8`
      : 'Not started';

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black tracking-tight">Infrastructure Operations</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Coordinate active infrastructure projects, system readiness, approvals, and sovereign audit feeds.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'OVERVIEW' },
          { id: 'projects', label: 'PROJECTS' },
          { id: 'approvals', label: 'APPROVALS' },
          { id: 'activity', label: 'ACTIVITY' },
          { id: 'incidents', label: 'INCIDENTS' },
          { id: 'audit', label: 'AUDIT' }
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {(activeTab === 'projects' || activeTab === 'overview') && (
        <div className="space-y-6">
          {/* Active Operations Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                ACTIVE INFRASTRUCTURE OPERATIONS (1)
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" size="xs" onClick={onCreateNewProject}>
                  NEW PROJECT
                </Button>
                <Button variant="secondary" size="xs" onClick={() => setActiveTab('activity')}>
                  OPEN ACTIVITY
                </Button>
                <Button variant="secondary" size="xs" onClick={() => onSelectSection('deployments')}>
                  OPEN TIMELINE
                </Button>
              </div>
            </div>

            <div className="border border-black bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-black bg-zinc-50 font-mono text-[11px] uppercase">
                    <th className="py-2.5 px-3.5">PROJECT</th>
                    <th className="py-2.5 px-3.5">COUNTRY</th>
                    <th className="py-2.5 px-3.5">SITE</th>
                    <th className="py-2.5 px-3.5">INFRASTRUCTURE LAYER</th>
                    <th className="py-2.5 px-3.5">OWNER</th>
                    <th className="py-2.5 px-3.5">STATUS</th>
                    <th className="py-2.5 px-3.5">PROGRESS</th>
                    <th className="py-2.5 px-3.5">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/15">
                  <tr>
                    <td className="py-3 px-3.5 font-bold">{scenario.project} Connectivity Project</td>
                    <td className="py-3 px-3.5">{scenario.country}</td>
                    <td className="py-3 px-3.5">Clinic</td>
                    <td className="py-3 px-3.5">Connectivity</td>
                    <td className="py-3 px-3.5">Demo Operator</td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 border border-black font-mono text-[10px] font-bold">
                        {projectStatusLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">{progressLabel}</td>
                    <td className="py-3 px-3.5">
                      <button
                        type="button"
                        onClick={() => onSelectSection('deployments')}
                        className="font-bold underline cursor-pointer"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Operation Inspector */}
          <div className="border-t border-black pt-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              OPERATION INSPECTOR — {scenario.project.toUpperCase()} CONNECTIVITY PROJECT
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <KeyValueTable
                  rows={[
                    { key: 'PROJECT', value: `${scenario.project} Connectivity Project` },
                    { key: 'ORGANIZATION', value: currentTenant.name },
                    { key: 'COUNTRY', value: scenario.country },
                    { key: 'SITE', value: scenario.site },
                    { key: 'INFRASTRUCTURE LAYER', value: 'Connectivity · Telecom · Compute · Security' },
                    { key: 'OWNER', value: 'Demo Operator' },
                    { key: 'STATUS', value: projectStatusLabel },
                    { key: 'PROGRESS', value: progressLabel },
                    { key: 'CREATED', value: '2025-02-10 10:24 UTC' },
                    { key: 'LAST UPDATED', value: '2025-02-10 10:24 UTC' }
                  ]}
                />
              </div>

              <div className="lg:col-span-5 space-y-5 lg:border-l border-black/20 lg:pl-6">
                <div className="space-y-2">
                  <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">NEXT ACTION</div>
                  <div className="text-lg font-extrabold text-black">Review plan</div>
                  <p className="text-xs text-zinc-600">
                    Validate design, scope, and deployment readiness before execution simulation.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full mt-2"
                    onClick={() => onSelectSection('golden_command')}
                  >
                    REVIEW PLAN
                  </Button>
                </div>

                <div className="space-y-2 border-t border-black/20 pt-4">
                  <div className="font-mono text-[11px] font-bold uppercase text-black">
                    CONNECTED SYSTEMS (3)
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-800">
                    <li>Network Manager — Connected</li>
                    <li>Deployment Manager — Connected</li>
                    <li>Monitoring — Connected</li>
                  </ul>
                  <Button
                    variant="secondary"
                    className="w-full mt-2"
                    onClick={() => onSelectSection('deployments')}
                  >
                    OPEN DEPLOYMENT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="border border-black bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase">APPROVAL GATEWAYS</span>
            {!scenario.planApproved && (
              <Button variant="primary" size="sm" onClick={onApprovePlan}>
                APPROVE DEMO-001
              </Button>
            )}
          </div>
          <p className="text-sm text-zinc-700">
            {scenario.planApproved
              ? `Deployment ${scenario.deploymentId} (${scenario.version}) is approved for simulation.`
              : `Deployment ${scenario.deploymentId} (${scenario.version}) requires operator sign-off before running full simulation.`}
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="border border-black bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b border-black bg-zinc-50 font-mono uppercase">
                <th className="py-2.5 px-3.5">PORTING / OPERATION ID</th>
                <th className="py-2.5 px-3.5">NUMBER / TARGET</th>
                <th className="py-2.5 px-3.5">CARRIER TRANSFER</th>
                <th className="py-2.5 px-3.5">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/15">
              {portingRequests.map((req) => (
                <tr key={req.id}>
                  <td className="py-2.5 px-3.5 font-mono font-bold">{req.id}</td>
                  <td className="py-2.5 px-3.5 font-mono">{req.number}</td>
                  <td className="py-2.5 px-3.5">
                    {req.currentCarrier} → {req.targetCarrier}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono uppercase font-bold">{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="border border-black bg-white p-5 space-y-3">
          <div className="font-mono text-xs font-bold uppercase">ACTIVE INCIDENTS</div>
          <div className="border border-black p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">Stage 3 Conditional Route — Optical Coverage Unverified</div>
              <div className="text-xs text-zinc-600 mt-0.5">
                System 11 optical ground link requires readiness verification; Route-B backhaul available.
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => onSelectSection('deployments')}>
              Inspect Block
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="border border-black bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b border-black bg-zinc-50 font-mono uppercase">
                <th className="py-2.5 px-3.5">TIMESTAMP</th>
                <th className="py-2.5 px-3.5">ACTOR</th>
                <th className="py-2.5 px-3.5">ACTION</th>
                <th className="py-2.5 px-3.5">TARGET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/15">
              {auditLogs.slice(0, 8).map((log) => (
                <tr key={log.id}>
                  <td className="py-2.5 px-3.5 font-mono">{log.timestamp}</td>
                  <td className="py-2.5 px-3.5">{log.actor}</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold">{log.action}</td>
                  <td className="py-2.5 px-3.5">{log.e164 || log.countryCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
