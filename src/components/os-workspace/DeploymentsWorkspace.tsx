import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, ArrowLeftRight, Download, CheckCircle2, Square, ArrowRight } from 'lucide-react';
import { Button, Tabs, KeyValueTable, CalloutBanner, ModalShell } from '../../design-system';
import { TenantAccount } from '../../types/multiTenant';
import { DEFAULT_DEPLOYMENT_STAGES } from './systemsCatalog';
import { DeploymentScenarioConfig, OsSectionId } from './types';

export type DeploymentsSubView =
  | 'timeline'
  | 'stage_inspector'
  | 'blocked_recovery'
  | 'complete';

interface DeploymentsWorkspaceProps {
  currentTenant: TenantAccount;
  scenario: DeploymentScenarioConfig;
  onUpdateScenario: (patch: Partial<DeploymentScenarioConfig>) => void;
  onSelectSection: (section: OsSectionId) => void;
}

export const useDeploymentsSidebar = (
  subView: DeploymentsSubView,
  setSubView: (v: DeploymentsSubView) => void,
  currentTenant: TenantAccount,
  scenario: DeploymentScenarioConfig,
  selectedStageNum: number,
  onSelectSection: (section: OsSectionId) => void
) => {
  const stage =
    DEFAULT_DEPLOYMENT_STAGES.find((s) => s.stageNumber === selectedStageNum) ||
    DEFAULT_DEPLOYMENT_STAGES[2];

  if (subView === 'complete') {
    return (
      <div className="p-4 space-y-4">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-2">
          DEPLOYMENT INSPECTOR
        </div>
        <KeyValueTable
          rows={[
            { key: 'CLINIC', value: scenario.project },
            { key: 'DEPLOYMENT ID', value: `${scenario.deploymentId} v2` },
            { key: 'ENVIRONMENT', value: 'Demo' },
            { key: 'MODE', value: 'Guided' }
          ]}
        />
        <div className="space-y-2 border-t border-black pt-3">
          <div className="font-mono text-[11px] font-bold uppercase text-black">SIMULATION STATUS</div>
          <div className="border border-black p-3 flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Simulated complete</span>
          </div>
        </div>
        <KeyValueTable
          title="DEPLOYMENT CONTEXT"
          rows={[
            { key: 'PILOT ORGANIZATION', value: currentTenant.name },
            { key: 'LOCATION (DEMO)', value: 'Lukunga, DRC' },
            { key: 'DEPLOYMENT TYPE', value: 'Clinic Connectivity' },
            { key: 'SIMULATION RUN', value: '3 of 3 (Final)' },
            { key: 'LAST RUN', value: '2025-01-26 14:37 UTC' }
          ]}
        />
        <div className="space-y-1.5">
          <div className="font-mono text-[11px] font-bold uppercase text-black">OUTCOME SUMMARY</div>
          <div className="border border-black p-3 font-extrabold text-sm text-center">
            7 simulated / 1 skipped
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-2">
        DEPLOYMENT INSPECTOR
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-lg font-extrabold text-black">{scenario.deploymentId} {scenario.version}</span>
        <span className="px-1.5 py-0.5 border border-black font-mono text-[10px] font-bold uppercase">
          {scenario.planApproved ? 'APPROVED' : 'DRAFT'}
        </span>
      </div>

      <KeyValueTable
        title="PLAN SUMMARY"
        rows={[
          { key: 'ORGANIZATION', value: scenario.project },
          { key: 'DEPLOYMENT', value: `${scenario.deploymentId} ${scenario.version}` },
          { key: 'PLAN', value: 'Rural Connectivity Pilot' },
          { key: 'MODE', value: 'Demo (Simulation)' },
          { key: 'CURRENT STAGE', value: `${stage.stageNumber} — ${stage.title}` },
          { key: 'STATUS', value: scenario.simulationStatus.replace('_', ' ').toUpperCase() },
          { key: 'APPROVAL', value: 'Approved for simulation only' }
        ]}
      />

      <KeyValueTable
        title={`STAGE ${stage.stageNumber} OVERVIEW`}
        rows={[
          { key: 'SYSTEM', value: stage.systemNumber },
          { key: 'OBJECTIVE', value: stage.objective },
          { key: 'PREREQUISITE', value: stage.prerequisites },
          { key: 'FEASIBILITY', value: stage.feasibility }
        ]}
      />

      <div className="space-y-2 border-t border-black pt-3">
        <div className="font-mono text-[11px] font-bold uppercase text-black">ACTIONS</div>
        <Button variant="primary" size="sm" className="w-full" onClick={() => setSubView('stage_inspector')}>
          INSPECT STAGE {stage.stageNumber}
        </Button>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => onSelectSection('golden_command')}>
          EDIT DEPLOYMENT PLAN
        </Button>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => setSubView('timeline')}>
          VIEW STAGE TIMELINE
        </Button>
      </div>
    </div>
  );
};

export const DeploymentsWorkspace: React.FC<
  DeploymentsWorkspaceProps & {
    subView: DeploymentsSubView;
    setSubView: (v: DeploymentsSubView) => void;
    selectedStageNum: number;
    setSelectedStageNum: (n: number) => void;
  }
> = ({
  subView,
  setSubView,
  selectedStageNum,
  setSelectedStageNum,
  scenario,
  onUpdateScenario,
  onSelectSection
}) => {
  const [timelineTab, setTimelineTab] = useState<'details' | 'dependencies' | 'resources' | 'approvals' | 'logs' | 'history'>('details');
  const [showExportModal, setShowExportModal] = useState(false);
  const [recoveryResolved, setRecoveryResolved] = useState(false);
  const [requirementsChecked, setRequirementsChecked] = useState<Record<string, boolean>>({});

  // Auto-advance simulation timer when status === 'running'
  useEffect(() => {
    if (scenario.simulationStatus !== 'running') return;
    const timer = window.setTimeout(() => {
      if (scenario.activeStageIndex === 2 && !recoveryResolved) {
        onUpdateScenario({ simulationStatus: 'blocked' });
        setSelectedStageNum(3);
        setSubView('blocked_recovery');
        return;
      }
      if (scenario.activeStageIndex >= 7) {
        onUpdateScenario({ simulationStatus: 'complete' });
        setSubView('complete');
        return;
      }
      onUpdateScenario({ activeStageIndex: scenario.activeStageIndex + 1 });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [scenario.simulationStatus, scenario.activeStageIndex, recoveryResolved, onUpdateScenario, setSelectedStageNum, setSubView]);

  const getStageBadge = (idx: number) => {
    if (scenario.simulationStatus === 'complete') {
      return idx === 2 ? 'SKIPPED (ROUTE-B)' : idx === 1 || idx === 3 ? 'SIMULATED CONDITIONAL' : 'SIMULATED';
    }
    if (scenario.simulationStatus === 'blocked' && idx === 2) {
      return 'BLOCKED — UNVERIFIED';
    }
    if (idx < scenario.activeStageIndex) {
      return idx === 2 && recoveryResolved ? 'SKIPPED (ROUTE-B)' : 'SIMULATED';
    }
    if (idx === scenario.activeStageIndex && scenario.simulationStatus === 'running') {
      return 'RUNNING (SIMULATION)';
    }
    if (idx === scenario.activeStageIndex && scenario.simulationStatus === 'paused') {
      return 'PAUSED (SIMULATION)';
    }
    return 'PENDING (SIMULATION)';
  };

  const selectedStage =
    DEFAULT_DEPLOYMENT_STAGES.find((s) => s.stageNumber === selectedStageNum) ||
    DEFAULT_DEPLOYMENT_STAGES[2];

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      {/* Sub-view Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-black pb-3">
        {[
          { id: 'timeline', label: 'Execution Timeline (WF-24)' },
          { id: 'stage_inspector', label: 'Stage Inspector (WF-25)' },
          { id: 'blocked_recovery', label: 'Dependency & Recovery (WF-27/28)' },
          { id: 'complete', label: 'Simulation Complete (WF-29)' }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSubView(item.id as DeploymentsSubView)}
            className={`px-3 py-1.5 border border-black font-mono text-[11px] font-bold uppercase cursor-pointer transition-colors ${
              subView === item.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ==================== 1. EXECUTION TIMELINE (WF-24 / WF-26) ==================== */}
      {subView === 'timeline' && (
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Execution Timeline</h1>
            <p className="font-mono text-xs uppercase text-zinc-700 mt-1">
              {scenario.project} Connectivity Project | MAIN INFRASTRUCTURE EXECUTION TIMELINE
            </p>
          </div>

          {/* Control Strip */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={() => onUpdateScenario({ simulationStatus: 'running', planApproved: true })}
            >
              PLAY SIMULATION
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Pause className="w-3.5 h-3.5" />}
              disabled={scenario.simulationStatus !== 'running'}
              onClick={() => onUpdateScenario({ simulationStatus: 'paused' })}
            >
              PAUSE
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<SkipForward className="w-3.5 h-3.5" />}
              onClick={() => {
                if (scenario.activeStageIndex >= 7) {
                  onUpdateScenario({ simulationStatus: 'complete' });
                  setSubView('complete');
                } else {
                  onUpdateScenario({
                    simulationStatus: 'paused',
                    activeStageIndex: scenario.activeStageIndex + 1
                  });
                }
              }}
            >
              STEP
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => {
                setRecoveryResolved(false);
                onUpdateScenario({ simulationStatus: 'not_started', activeStageIndex: 0 });
              }}
            >
              RESET
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeftRight className="w-3.5 h-3.5" />}
              onClick={() => onSelectSection('golden_command')}
            >
              COMPARE
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => setShowExportModal(true)}
            >
              EXPORT
            </Button>
          </div>

          {/* 8-Stage Pipeline Diagram */}
          <div className="border border-black bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-black">
                INFRASTRUCTURE EXECUTION TIMELINE
              </span>
              <span className="px-2.5 py-1 border border-black font-mono text-[10px] font-bold uppercase">
                APPROVED FOR SIMULATION ONLY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DEFAULT_DEPLOYMENT_STAGES.map((stage, idx) => {
                const isSelected = stage.stageNumber === selectedStageNum;
                const badge = getStageBadge(idx);
                const isCurrent = idx === scenario.activeStageIndex && scenario.simulationStatus !== 'not_started';
                return (
                  <button
                    key={stage.code}
                    type="button"
                    onClick={() => {
                      setSelectedStageNum(stage.stageNumber);
                      setSubView('stage_inspector');
                    }}
                    className={`text-left p-3.5 border transition-colors cursor-pointer flex flex-col justify-between min-h-[116px] ${
                      isCurrent
                        ? 'border-2 border-black bg-zinc-100'
                        : isSelected
                        ? 'border-2 border-black bg-white'
                        : 'border border-black bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-sm text-black">{stage.code}</span>
                        {idx < 7 && <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                      </div>
                      <div className="font-mono text-[10px] uppercase text-zinc-600 mt-1">
                        {stage.title}
                      </div>
                    </div>
                    <div className="mt-3 pt-1.5 border-t border-black/15">
                      <span
                        className={`inline-block w-full text-center py-1 px-1.5 border border-black font-mono text-[10px] font-bold uppercase ${
                          badge.includes('BLOCKED')
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border border-black px-3.5 py-2 font-mono text-xs font-bold flex flex-wrap items-center gap-2">
              <span>PREREQUISITE (DEPENDENCIES)</span>
              <span className="text-black/30">|</span>
              <span className="tabular-nums">12 → 10 → 11 (conditional) → 14 (conditional) → 07 → 01/04 → 16 → 17</span>
            </div>
          </div>

          {/* Lower Details Strip */}
          <Tabs
            tabs={[
              { id: 'details', label: 'EXECUTION DETAILS' },
              { id: 'dependencies', label: 'DEPENDENCIES' },
              { id: 'resources', label: 'RESOURCE INVENTORY' },
              { id: 'approvals', label: 'APPROVALS' },
              { id: 'logs', label: 'LOGS' },
              { id: 'history', label: 'HISTORY' }
            ]}
            activeId={timelineTab}
            onChange={(id) => setTimelineTab(id as any)}
          />

          {timelineTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KeyValueTable
                rows={[
                  { key: 'EXECUTION ID', value: 'EXEC-DRC-0001' },
                  { key: 'EXECUTION MODE', value: 'Guided (Simulation)' },
                  { key: 'MILESTONES', value: '8 (12, 10, 11, 14, 07, 01/04, 16, 17)' },
                  { key: 'STATUS', value: scenario.simulationStatus.replace('_', ' ').toUpperCase() }
                ]}
              />
              <KeyValueTable
                rows={[
                  { key: 'ENVIRONMENT', value: 'Simulation (Demo)' },
                  { key: 'TIMELINE (EST.)', value: '~ 2h 30m (simulation)' },
                  { key: 'CONDITIONAL ITEMS', value: '11 (Optical), 14 (Backhaul)' },
                  { key: 'APPROVAL', value: 'Approved for simulation only' }
                ]}
              />
            </div>
          )}

          {timelineTab !== 'details' && (
            <div className="border border-black p-4 text-xs font-mono space-y-2 tabular-nums">
              <div className="font-bold uppercase">SIMULATION {timelineTab.toUpperCase()} RECORD</div>
              <p className="font-sans text-zinc-700">
                Active stage index: {scenario.activeStageIndex + 1} of 8 · Optical GS fallback Route-B {recoveryResolved ? 'selected' : 'pending evaluation'}.
              </p>
              <Button variant="secondary" size="xs" onClick={() => onSelectSection('expert_console')}>
                INSPECT IN EXPERT CONSOLE
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ==================== 2. STAGE INSPECTOR (WF-25) ==================== */}
      {subView === 'stage_inspector' && (
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Stage Inspector</h1>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600 mt-1">
              DEPLOYMENTS &gt; {scenario.deploymentId} {scenario.version} &gt; STAGE INSPECTOR
            </div>
          </div>

          {/* Top Stage Stepper Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { n: 1, label: '1. SITE', st: 'COMPLETE' },
              { n: 2, label: '2. SATELLITE', st: 'COMPLETE' },
              { n: 3, label: '3. OPTICAL GS', st: recoveryResolved ? 'SKIPPED' : 'IN PLANNING' },
              { n: 5, label: '4. INTEGRATION', st: 'PENDING' },
              { n: 8, label: '5. DEPLOY', st: 'PENDING' }
            ].map((item) => {
              const active = selectedStageNum === item.n;
              return (
                <button
                  key={item.n}
                  type="button"
                  onClick={() => setSelectedStageNum(item.n)}
                  className={`p-3 border text-center cursor-pointer ${
                    active ? 'border-2 border-black bg-white' : 'border border-black bg-zinc-50 hover:bg-white'
                  }`}
                >
                  <div className="font-mono text-xs font-extrabold">{item.label}</div>
                  <div className="font-mono text-[10px] text-zinc-600 mt-0.5">{item.st}</div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 border border-black p-5 bg-white space-y-4">
              <div>
                <div className="font-mono text-xs font-bold uppercase text-zinc-600">
                  STAGE {selectedStage.stageNumber}
                </div>
                <h2 className="text-2xl font-extrabold text-black">{selectedStage.title}</h2>
                <div className="font-mono text-xs font-bold uppercase text-black mt-0.5">
                  {selectedStage.systemNumber}
                </div>
              </div>

              <KeyValueTable
                rows={[
                  { key: 'OBJECTIVE', value: selectedStage.objective },
                  { key: 'REQUIRED INPUTS', value: selectedStage.requiredInputs },
                  { key: 'PREREQUISITES', value: selectedStage.prerequisites },
                  { key: 'FEASIBILITY', value: selectedStage.feasibility },
                  { key: 'RESOURCES', value: selectedStage.resources }
                ]}
              />

              {selectedStage.note && (
                <CalloutBanner symbol="!" text={selectedStage.note} />
              )}
            </div>

            <div className="lg:col-span-5 border border-black p-5 bg-white space-y-4 flex flex-col justify-between">
              <KeyValueTable
                title={`STAGE ${selectedStage.stageNumber} INSPECTOR`}
                rows={[
                  { key: 'STAGE', value: `${selectedStage.stageNumber} — ${selectedStage.title}` },
                  { key: 'SYSTEM', value: selectedStage.systemNumber },
                  { key: 'FEASIBILITY', value: selectedStage.feasibility },
                  { key: 'RESOURCES', value: selectedStage.resources }
                ]}
              />
              <Button variant="primary" className="w-full" onClick={() => onSelectSection('expert_console')}>
                INSPECT EXPERT DETAILS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. BLOCKED DEPENDENCY & RECOVERY PLAN (WF-27/28) ==================== */}
      {subView === 'blocked_recovery' && (
        <div className="space-y-5">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600">
              STAGE 3 DEPENDENCY EVALUATION (WF-27 / WF-28)
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
              {recoveryResolved ? 'Recovery Plan Applied (Route-B)' : 'Blocked Dependency — Optical Ground Station'}
            </h1>
          </div>

          <CalloutBanner
            symbol="!"
            text={
              recoveryResolved
                ? 'Alternative Route-B (System 14 Backhaul Integration) selected. Optical GS stage marked skipped (demo).'
                : 'Stage 3 (System 11 Optical Ground Station) coverage is unverified. Select an alternative connectivity recovery path to continue.'
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-black p-5 bg-white space-y-3">
              <div className="font-mono text-xs font-bold uppercase">OPTION 1 — ROUTE-B CONDITIONAL BACKHAUL</div>
              <p className="text-xs text-zinc-700">
                Skip System 11 Optical Ground Station and route clinic connectivity through System 10 LEO Satellite + System 14 Regional Backhaul.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setRecoveryResolved(true);
                  onUpdateScenario({ simulationStatus: 'complete', activeStageIndex: 7 });
                  setSubView('complete');
                }}
              >
                APPLY RECOVERY ROUTE-B &amp; COMPLETE SIMULATION
              </Button>
            </div>

            <div className="border border-black p-5 bg-white space-y-3">
              <div className="font-mono text-xs font-bold uppercase">OPTION 2 — INSPECT DEPENDENCY GRAPH</div>
              <p className="text-xs text-zinc-700">
                Inspect why System 11 is conditional and trace upstream/downstream impacts in Expert Console.
              </p>
              <Button variant="secondary" size="sm" onClick={() => onSelectSection('expert_console')}>
                OPEN DEPENDENCY GRAPH (WF-31)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. SIMULATION COMPLETE (WF-29) ==================== */}
      {subView === 'complete' && (
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Simulation Complete.
            </h1>
            <p className="text-sm text-zinc-700 mt-1">
              All planned simulation stages have reached their expected demonstration outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Simulation Outcomes Table */}
            <div className="lg:col-span-7 space-y-2">
              <div className="font-mono text-xs font-bold uppercase text-black">SIMULATION OUTCOMES</div>
              <div className="border border-black bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black bg-zinc-50 font-mono uppercase">
                      <th className="py-2.5 px-3.5">STAGE</th>
                      <th className="py-2.5 px-3.5 border-l border-black">OUTCOME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/20">
                    {[
                      ['1. Power', 'Simulated'],
                      ['2. Satellite', 'Simulated conditional'],
                      ['3. Optical', 'Skipped — alternative selected'],
                      ['4. Backhaul', 'Simulated conditional'],
                      ['5. Compute', 'Simulated'],
                      ['6. Number & SIP', 'Simulated'],
                      ['7. Identity', 'Simulated'],
                      ['8. Security', 'Simulated']
                    ].map(([st, out]) => (
                      <tr key={st}>
                        <td className="py-2 px-3.5 font-bold">{st}</td>
                        <td className="py-2 px-3.5 border-l border-black">{out}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary & Outstanding Requirements */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <div className="font-mono text-xs font-bold uppercase text-black">SUMMARY</div>
                <div className="border border-black p-4 text-center text-xl font-extrabold text-black">
                  7 simulated / 1 skipped
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-mono text-xs font-bold uppercase text-black">
                  OUTSTANDING REQUIREMENTS
                </div>
                <div className="border border-black p-3.5 space-y-2 text-xs">
                  {[
                    'Verify coverage.',
                    'Assess power.',
                    'Confirm service providers.',
                    'Obtain real approvals.'
                  ].map((req) => {
                    const checked = Boolean(requirementsChecked[req]);
                    return (
                      <button
                        key={req}
                        type="button"
                        onClick={() => setRequirementsChecked((p) => ({ ...p, [req]: !p[req] }))}
                        className="flex items-center gap-2.5 w-full text-left cursor-pointer"
                      >
                        {checked ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
                        <span className={checked ? 'line-through text-zinc-500' : 'font-medium text-black'}>{req}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <CalloutBanner
            symbol="!"
            text="This result does not establish physical clinic connectivity."
          />

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => onSelectSection('expert_console')}>
              View Summary
            </Button>
            <Button variant="secondary" onClick={() => setShowExportModal(true)}>
              Export
            </Button>
            <Button variant="secondary" onClick={() => onSelectSection('mission_control')}>
              Return to Mission Control
            </Button>
          </div>
        </div>
      )}

      <ModalShell
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Deployment Handoff (WF-36)"
        subtitle={`${scenario.deploymentId} (${scenario.version}) — ${scenario.project}`}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowExportModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const payload = JSON.stringify({ scenario, exportedAt: new Date().toISOString() }, null, 2);
                const blob = new Blob([payload], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${scenario.deploymentId.toLowerCase()}-handoff.json`;
                a.click();
                URL.revokeObjectURL(url);
                setShowExportModal(false);
              }}
            >
              Download JSON Handoff
            </Button>
          </div>
        }
      >
        <p className="text-sm text-zinc-700">
          Export includes scenario inputs, 8-stage execution trace, Route-B dependency decision, and outstanding field verification checklist.
        </p>
        <pre className="border border-black p-3 bg-zinc-50 font-mono text-xs overflow-x-auto tabular-nums">
          {JSON.stringify(scenario, null, 2)}
        </pre>
      </ModalShell>
    </div>
  );
};
