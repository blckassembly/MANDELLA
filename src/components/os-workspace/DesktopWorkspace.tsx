import React, { useState } from 'react';
import {
  Monitor,
  Layers,
  CheckSquare,
  FileText,
  Clock,
  Terminal,
  Phone,
  Database,
  ShieldCheck,
  Satellite,
  Bot,
  Activity
} from 'lucide-react';
import { TenantAccount } from '../../types/multiTenant';
import { Button, Select, Tabs } from '../../design-system';
import { DeploymentScenarioConfig, ExperienceMode, OsSectionId } from './types';

export type DesktopSubView = 'desktop' | 'projects' | 'approvals' | 'drafts' | 'activity';

interface DesktopWorkspaceProps {
  currentTenant: TenantAccount;
  scenario: DeploymentScenarioConfig;
  experienceMode: ExperienceMode;
  onChangeExperienceMode: (mode: ExperienceMode) => void;
  onSelectSection: (section: OsSectionId) => void;
  onOpenSystem: (systemNumber: string) => void;
  onOpenTenantModal: () => void;
  onCreateNewProject: () => void;
  onApprovePlan: () => void;
  onOpenNmcp?: () => void;
  onOpenStressTest?: () => void;
}

export const useDesktopSidebar = (
  subView: DesktopSubView,
  setSubView: (v: DesktopSubView) => void,
  currentTenant: TenantAccount,
  scenario: DeploymentScenarioConfig,
  experienceMode: ExperienceMode,
  onChangeExperienceMode: (mode: ExperienceMode) => void,
  onSelectSection: (section: OsSectionId) => void,
  onCreateNewProject: () => void
) => {
  const navItems: { id: DesktopSubView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'desktop', label: 'Desktop', icon: Monitor },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Clock }
  ];

  return (
    <div className="p-4 space-y-5">
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
          DESKTOP INSPECTOR
        </div>
        <h2 className="text-xl font-extrabold text-black tracking-tight mt-0.5">Workspace</h2>
      </div>

      <div className="space-y-3 border-t border-black pt-3">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-black">
          CONTEXT
        </div>
        <Select
          label="PILOT ORGANIZATION"
          value={currentTenant.id}
          onChange={() => {}}
          options={[{ label: currentTenant.name, value: currentTenant.id }]}
        />
        <Select
          label="PROJECT"
          value={scenario.project}
          onChange={() => {}}
          options={[
            { label: `${scenario.project} Connectivity Project`, value: scenario.project },
            { label: 'Regional Carrier Interconnect Mesh', value: 'interconnect' }
          ]}
        />
        <Select
          label="MODE"
          value={experienceMode}
          onChange={(e) => onChangeExperienceMode(e.target.value as ExperienceMode)}
          options={[
            { label: 'Guided Mode', value: 'guided' },
            { label: 'Expert Mode', value: 'expert' }
          ]}
        />
      </div>

      <div className="space-y-2 border-t border-black pt-3">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-black">
          QUICK ACTIONS
        </div>
        <Button variant="primary" size="sm" className="w-full" onClick={() => onSelectSection('mission_control')}>
          Open Project
        </Button>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => onSelectSection('golden_command')}>
          Review Deployment Plan
        </Button>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => onSelectSection('golden_command')}>
          Open Golden Command
        </Button>
        <Button variant="secondary" size="sm" className="w-full" onClick={onCreateNewProject}>
          Create New Project
        </Button>
      </div>

      <div className="space-y-1 border-t border-black pt-3">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-black mb-2">
          WORKSPACE
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = subView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubView(item.id)}
              className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DesktopWorkspace: React.FC<DesktopWorkspaceProps & { subView: DesktopSubView; onChangeSubView: (v: DesktopSubView) => void }> = ({
  subView,
  onChangeSubView,
  scenario,
  onSelectSection,
  onOpenSystem,
  onCreateNewProject,
  onApprovePlan,
  onOpenNmcp,
  onOpenStressTest
}) => {
  const [firstUsePreview, setFirstUsePreview] = useState(false);

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            {firstUsePreview ? 'Welcome to MANDELA OS' : 'Welcome back'}
          </h1>
          <p className="text-sm text-zinc-700 mt-1">
            {firstUsePreview
              ? 'Start by selecting a region in Infrastructure or configuring a site in Golden Command.'
              : `Continue your work on the ${scenario.project} Connectivity Project, review progress, and take the next action.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setFirstUsePreview((p) => !p)}
            className="px-3 py-1.5 border border-black bg-white hover:bg-zinc-100 font-mono text-[11px] font-bold uppercase cursor-pointer"
          >
            {firstUsePreview ? 'VIEW RETURNING WORKSPACE' : 'VIEW FIRST-USE STATE'}
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'desktop', label: 'WORKSPACE OVERVIEW' },
          { id: 'projects', label: 'PROJECTS (1)' },
          { id: 'approvals', label: `APPROVALS (${scenario.planApproved ? 0 : 1})` },
          { id: 'drafts', label: 'SAVED DRAFTS (1)' },
          { id: 'activity', label: 'ACTIVITY' }
        ]}
        activeId={subView}
        onChange={(id) => onChangeSubView(id as DesktopSubView)}
      />

      {subView === 'desktop' && (
        <div className="space-y-5">
          {/* Recent Project Card */}
          <div className="border border-black bg-white p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              RECENT PROJECT
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-t border-black/20 pt-4">
              <div className="md:col-span-4">
                <div className="font-mono text-[10px] font-bold uppercase text-zinc-500">PROJECT</div>
                <div className="text-lg font-extrabold text-black mt-0.5">
                  {scenario.project} Connectivity Project
                </div>
              </div>
              <div className="md:col-span-2 md:border-l border-black/20 md:pl-4">
                <div className="font-mono text-[10px] font-bold uppercase text-zinc-500">LOCATION</div>
                <div className="text-base font-bold text-black mt-0.5">{scenario.country}</div>
              </div>
              <div className="md:col-span-2 md:border-l border-black/20 md:pl-4">
                <div className="font-mono text-[10px] font-bold uppercase text-zinc-500">STATUS</div>
                <div className="text-base font-bold text-black mt-0.5">
                  {scenario.planApproved ? 'Approved' : scenario.planGenerated ? 'Plan Ready' : 'Draft saved'}
                </div>
              </div>
              <div className="md:col-span-2 md:border-l border-black/20 md:pl-4">
                <div className="font-mono text-[10px] font-bold uppercase text-zinc-500">NEXT ACTION</div>
                <div className="text-sm font-bold text-black mt-0.5">
                  {scenario.planApproved ? 'Run simulation' : 'Review deployment plan'}
                </div>
              </div>
              <div className="md:col-span-2 flex md:justify-end">
                <Button variant="primary" onClick={() => onSelectSection('mission_control')}>
                  Open Project
                </Button>
              </div>
            </div>
          </div>

          {/* 3-Column Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-black bg-white p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  PENDING APPROVALS
                </div>
                <div className="text-2xl font-extrabold text-black mt-2">
                  {scenario.planApproved ? 'None' : '1 Approval'}
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  {scenario.planApproved
                    ? 'No approvals are currently pending.'
                    : `${scenario.deploymentId} (${scenario.version}) awaiting operator review.`}
                </p>
              </div>
              {!scenario.planApproved && (
                <div className="pt-2">
                  <Button variant="secondary" size="sm" onClick={() => onSelectSection('golden_command')}>
                    Review & Approve
                  </Button>
                </div>
              )}
            </div>

            <div className="border border-black bg-white p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  SAVED DRAFTS
                </div>
                <div className="text-2xl font-extrabold text-black mt-2">Clinic plan v1</div>
                <p className="text-xs text-zinc-600 mt-1 tabular-nums">Draft saved today, 10:24 UTC.</p>
              </div>
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={() => onSelectSection('golden_command')}>
                  Edit Draft
                </Button>
              </div>
            </div>

            <div className="border border-black bg-white p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  RECENT ACTIVITY
                </div>
                <div className="text-2xl font-extrabold text-black mt-2">Demo plan saved</div>
                <p className="text-xs text-zinc-600 mt-1 tabular-nums">Project draft updated today, 10:24 UTC.</p>
              </div>
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={() => onChangeSubView('activity')}>
                  View Log
                </Button>
              </div>
            </div>
          </div>

          {/* Golden Command Banner */}
          <div className="border border-black bg-white p-4 sm:px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black whitespace-nowrap">
                GOLDEN COMMAND
              </span>
              <span className="hidden sm:inline text-black/30">|</span>
              <span className="text-sm text-zinc-700">
                Access orchestrated infrastructure actions, deployments, and expert controls.
              </span>
            </div>
            <Button variant="primary" size="sm" onClick={() => onSelectSection('golden_command')}>
              Open Golden Command
            </Button>
          </div>

          {/* Direct Product Shortcuts (Preserving Full Access to Core Telecom Modules) */}
          <div className="border border-black bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-black/20 pb-2.5">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                CONNECTED INFRASTRUCTURE &amp; TELECOM WORKSPACES
              </div>
              <button
                type="button"
                onClick={() => onSelectSection('systems')}
                className="font-mono text-xs font-bold underline text-black cursor-pointer"
              >
                VIEW ALL 18 SYSTEMS →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  num: '01',
                  title: 'Pan-Africa Numbers',
                  sub: '54 ITU E.164 Registries',
                  icon: Phone,
                  onClick: () => onOpenSystem('01')
                },
                {
                  num: '04',
                  title: 'SIP Core & SBC',
                  sub: 'Kamailio & PBX Trunks',
                  icon: Terminal,
                  onClick: () => onOpenSystem('04')
                },
                {
                  num: '08',
                  title: 'Sovereign Dataverse',
                  sub: 'Schemas, SQL & Records',
                  icon: Database,
                  onClick: () => onOpenSystem('08')
                },
                {
                  num: '10',
                  title: 'Satellite NTN Fleet',
                  sub: '3GPP Rel-17 Teleports',
                  icon: Satellite,
                  onClick: () => onOpenSystem('10')
                },
                {
                  num: '17',
                  title: 'Fraud, SIEM & SOC C2',
                  sub: 'Deepfake & SIM-Swap Defense',
                  icon: ShieldCheck,
                  onClick: () => onOpenSystem('17')
                },
                {
                  num: '06',
                  title: 'Programmable CPaaS',
                  sub: 'NCCO Flows & AI Agents',
                  icon: Bot,
                  onClick: () => onOpenSystem('06')
                },
                {
                  num: '18',
                  title: 'Multi-AI & MCP Gateway',
                  sub: 'Unified API & SDK Plane',
                  icon: Layers,
                  onClick: () => (onOpenNmcp ? onOpenNmcp() : onOpenSystem('18'))
                },
                {
                  num: 'QA',
                  title: 'Network Stress Audit',
                  sub: 'Carrier Load Simulation',
                  icon: Activity,
                  onClick: () => (onOpenStressTest ? onOpenStressTest() : onSelectSection('deployments'))
                }
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    type="button"
                    onClick={card.onClick}
                    className="text-left p-3.5 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 border border-current">
                        SYS {card.num}
                      </span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm">{card.title}</div>
                    <div className="text-xs opacity-75 mt-0.5">{card.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {subView === 'projects' && (
        <div className="border border-black bg-white">
          <div className="p-4 border-b border-black flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase">ACTIVE PROJECTS (1)</span>
            <Button variant="primary" size="sm" onClick={onCreateNewProject}>
              New Project
            </Button>
          </div>
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-base text-black">{scenario.project} Connectivity Project</div>
              <div className="text-xs text-zinc-600 mt-0.5 tabular-nums">
                {scenario.country} · {scenario.site} · Deployment {scenario.deploymentId} ({scenario.version})
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => onSelectSection('mission_control')}>
                Inspect
              </Button>
              <Button variant="primary" size="sm" onClick={() => onSelectSection('deployments')}>
                Open Timeline
              </Button>
            </div>
          </div>
        </div>
      )}

      {subView === 'approvals' && (
        <div className="border border-black bg-white p-5 space-y-4">
          <div className="font-mono text-xs font-bold uppercase">PENDING APPROVAL QUEUE</div>
          {scenario.planApproved ? (
            <div className="text-sm text-zinc-600">
              All demo deployment packages have been approved for simulation.
            </div>
          ) : (
            <div className="border border-black p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-black">
                  Approval Requested — {scenario.project} ({scenario.deploymentId} {scenario.version})
                </div>
                <div className="text-xs text-zinc-600 mt-0.5">
                  Scope: 8 infrastructure stages ({scenario.connectivity}, {scenario.power})
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => onSelectSection('golden_command')}>
                  Review Plan
                </Button>
                <Button variant="primary" size="sm" onClick={onApprovePlan}>
                  Approve Package
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {subView === 'drafts' && (
        <div className="border border-black bg-white p-5 space-y-3">
          <div className="font-mono text-xs font-bold uppercase">SAVED DEPLOYMENT DRAFTS</div>
          <div className="border border-black p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-black">Clinic plan v1 — {scenario.site}</div>
              <div className="text-xs text-zinc-600 font-mono mt-0.5 tabular-nums">
                Last saved 2025-01-24 10:24 UTC · Plan {scenario.selectedPlan}
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => onSelectSection('golden_command')}>
              Resume Draft
            </Button>
          </div>
        </div>
      )}

      {subView === 'activity' && (
        <div className="border border-black bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="border-b border-black bg-zinc-50 font-mono uppercase">
                <th className="py-2.5 px-3.5">TIMESTAMP</th>
                <th className="py-2.5 px-3.5">EVENT</th>
                <th className="py-2.5 px-3.5">PROJECT</th>
                <th className="py-2.5 px-3.5">ACTOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/15">
              <tr>
                <td className="py-2.5 px-3.5 font-mono">2025-01-24 10:35 UTC</td>
                <td className="py-2.5 px-3.5 font-semibold">Approval requested for planning package</td>
                <td className="py-2.5 px-3.5">{scenario.project}</td>
                <td className="py-2.5 px-3.5">Demo Operator</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-mono">2025-01-24 10:24 UTC</td>
                <td className="py-2.5 px-3.5 font-semibold">Saved draft configuration ({scenario.version})</td>
                <td className="py-2.5 px-3.5">{scenario.project}</td>
                <td className="py-2.5 px-3.5">Demo Operator</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3.5 font-mono">2025-01-24 09:58 UTC</td>
                <td className="py-2.5 px-3.5 font-semibold">Generated 8-stage Golden Command topology</td>
                <td className="py-2.5 px-3.5">{scenario.project}</td>
                <td className="py-2.5 px-3.5">Orchestrator</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
