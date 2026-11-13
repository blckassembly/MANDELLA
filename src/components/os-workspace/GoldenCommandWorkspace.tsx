import React, { useState } from 'react';
import { CheckCircle2, Play, Square, AlertCircle } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Tabs,
  CalloutBanner,
  KeyValueTable,
  ModalShell
} from '../../design-system';
import { DeploymentScenarioConfig, OsSectionId } from './types';

export type GoldenCommandSubView =
  | 'scenario'
  | 'proposed_plan'
  | 'assumptions'
  | 'compare'
  | 'review';

interface GoldenCommandWorkspaceProps {
  scenario: DeploymentScenarioConfig;
  onUpdateScenario: (patch: Partial<DeploymentScenarioConfig>) => void;
  onGeneratePlan: () => void;
  onApprovePlan: () => void;
  onSelectSection: (section: OsSectionId) => void;
}

export const useGoldenCommandSidebar = (
  subView: GoldenCommandSubView,
  setSubView: (v: GoldenCommandSubView) => void,
  scenario: DeploymentScenarioConfig,
  onUpdateScenario: (patch: Partial<DeploymentScenarioConfig>) => void
) => {
  const inputsComplete = Boolean(
    scenario.project.trim() &&
      scenario.objective.trim() &&
      scenario.connectivity.trim() &&
      scenario.power.trim() &&
      scenario.compute.trim() &&
      scenario.communications.trim()
  );

  if (subView === 'compare') {
    return (
      <div className="p-4 space-y-4">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-2">
          SITE INSPECTOR
        </div>
        <KeyValueTable
          title="SITE CONTEXT"
          rows={[
            { key: 'SITE', value: scenario.site },
            { key: 'COUNTRY', value: scenario.country },
            { key: 'SITE TYPE', value: 'Rural Clinic' },
            { key: 'STATUS', value: 'Planning (Demo)' }
          ]}
        />
        <div className="space-y-3 border-t border-black pt-3">
          <div className="font-mono text-[11px] font-bold uppercase text-black">DEPLOYMENT PLANS</div>
          <Select
            label="PLAN A"
            value="A"
            onChange={() => {}}
            options={[{ label: 'Plan A — Satellite-first', value: 'A' }]}
          />
          <Select
            label="PLAN B"
            value="B"
            onChange={() => {}}
            options={[{ label: 'Plan B — Terrestrial-first', value: 'B' }]}
          />
        </div>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => setSubView('scenario')}>
          ← Back to Scenario
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3.5">
      <div className="font-mono text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-2">
        EDIT DEPLOYMENT
      </div>

      <Input
        label="PROJECT"
        value={scenario.project}
        onChange={(e) => onUpdateScenario({ project: e.target.value })}
      />
      <Select
        label="COUNTRY"
        value={scenario.country}
        onChange={(e) => onUpdateScenario({ country: e.target.value })}
        options={[
          { label: 'DRC', value: 'DRC' },
          { label: 'Kenya', value: 'Kenya' },
          { label: 'Nigeria', value: 'Nigeria' },
          { label: 'Rwanda', value: 'Rwanda' }
        ]}
      />
      <Select
        label="SITE"
        value={scenario.site}
        onChange={(e) => onUpdateScenario({ site: e.target.value })}
        options={[
          { label: 'Rural Clinic — Demo', value: 'Rural Clinic — Demo' },
          { label: 'Rural Clinic — Lukunga, DRC', value: 'Rural Clinic — Lukunga, DRC' },
          { label: 'Regional Health Post', value: 'Regional Health Post' }
        ]}
      />
      <Input
        label="OBJECTIVE"
        value={scenario.objective}
        onChange={(e) => onUpdateScenario({ objective: e.target.value })}
      />
      <Input
        label="CONNECTIVITY"
        value={scenario.connectivity}
        onChange={(e) => onUpdateScenario({ connectivity: e.target.value })}
      />
      <Input
        label="POWER"
        value={scenario.power}
        onChange={(e) => onUpdateScenario({ power: e.target.value })}
      />
      <Input
        label="COMPUTE"
        value={scenario.compute}
        onChange={(e) => onUpdateScenario({ compute: e.target.value })}
      />
      <Input
        label="COMMUNICATIONS"
        value={scenario.communications}
        onChange={(e) => onUpdateScenario({ communications: e.target.value })}
      />
      <Select
        label="PRIORITY"
        value={scenario.priority}
        onChange={(e) => onUpdateScenario({ priority: e.target.value as any })}
        options={[
          { label: 'Standard', value: 'Standard' },
          { label: 'High', value: 'High' },
          { label: 'Emergency', value: 'Emergency' }
        ]}
      />

      <div className="border-t border-black pt-3 flex items-start gap-2 text-xs">
        {inputsComplete ? (
          <>
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold text-black">
              Inputs complete. You can generate a deployment plan.
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
            <span className="font-semibold text-red-700">
              Complete all fields above before generating a plan.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export const GoldenCommandWorkspace: React.FC<
  GoldenCommandWorkspaceProps & {
    subView: GoldenCommandSubView;
    setSubView: (v: GoldenCommandSubView) => void;
  }
> = ({
  subView,
  setSubView,
  scenario,
  onUpdateScenario,
  onGeneratePlan,
  onApprovePlan,
  onSelectSection
}) => {
  const [scenarioTab, setScenarioTab] = useState<'details' | 'dependencies' | 'resources' | 'assumptions' | 'configuration' | 'history'>('details');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const inputsComplete = Boolean(
    scenario.project.trim() &&
      scenario.objective.trim() &&
      scenario.connectivity.trim() &&
      scenario.power.trim() &&
      scenario.compute.trim() &&
      scenario.communications.trim()
  );

  // Sub-view Switcher Strip
  const renderWorkflowTabs = () => (
    <div className="flex flex-wrap items-center gap-2 border-b border-black pb-3">
      {[
        { id: 'scenario', label: '1. Scenario (WF-17)' },
        { id: 'proposed_plan', label: '2. Proposed Plan (WF-19)' },
        { id: 'assumptions', label: '3. Assumptions (WF-20)' },
        { id: 'compare', label: '4. Compare A vs B (WF-21)' },
        { id: 'review', label: '5. Review & Approve (WF-22/23)' }
      ].map((step) => (
        <button
          key={step.id}
          type="button"
          onClick={() => setSubView(step.id as GoldenCommandSubView)}
          className={`px-3 py-1.5 border border-black font-mono text-[11px] font-bold uppercase cursor-pointer transition-colors ${
            subView === step.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
          }`}
        >
          {step.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      {renderWorkflowTabs()}

      {/* ==================== 1. SCENARIO BUILDER (WF-16/17/18) ==================== */}
      {subView === 'scenario' && (
        <div className="space-y-5">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-600">
              INFRASTRUCTURE DEPLOYMENT SCENARIO
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
              {inputsComplete ? 'Completed Configuration' : 'Incomplete Configuration'}
            </h1>
            <div className="font-mono text-xs font-bold uppercase text-black mt-1">
              PROJECT: {scenario.project} | COUNTRY: {scenario.country} | SITE: {scenario.site} | PRIORITY: {scenario.priority}
            </div>
          </div>

          <CalloutBanner
            symbol="i"
            text="User-entered demo assumptions — technical feasibility unverified."
          />

          <Tabs
            tabs={[
              { id: 'details', label: 'DETAILS' },
              { id: 'dependencies', label: 'DEPENDENCIES' },
              { id: 'resources', label: 'RESOURCES' },
              { id: 'assumptions', label: 'ASSUMPTIONS' },
              { id: 'configuration', label: 'CONFIGURATION' },
              { id: 'history', label: 'HISTORY' }
            ]}
            activeId={scenarioTab}
            onChange={(id) => setScenarioTab(id as any)}
          />

          {scenarioTab === 'details' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <KeyValueTable
                    title="DEPLOYMENT SUMMARY"
                    rows={[
                      { key: 'Project', value: scenario.project },
                      { key: 'Country', value: scenario.country },
                      { key: 'Site', value: scenario.site },
                      { key: 'Objective', value: scenario.objective },
                      { key: 'Connectivity', value: scenario.connectivity },
                      { key: 'Power', value: scenario.power },
                      { key: 'Compute', value: scenario.compute },
                      { key: 'Communications', value: scenario.communications },
                      { key: 'Priority', value: scenario.priority }
                    ]}
                  />
                </div>

                <div className="lg:col-span-5 border border-black bg-white p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={!inputsComplete}
                      onClick={() => {
                        onGeneratePlan();
                        setSubView('proposed_plan');
                      }}
                    >
                      GENERATE PLAN
                    </Button>

                    <div className="border-t border-black pt-3 space-y-2.5">
                      <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                        <span>SIMULATION CONTROLS</span>
                        <span>{scenario.planApproved ? 'READY' : 'UNAVAILABLE'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Play className="w-3.5 h-3.5" />}
                          disabled={!scenario.planApproved}
                          onClick={() => onSelectSection('deployments')}
                        >
                          RUN SIMULATION
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Square className="w-3.5 h-3.5" />}
                          disabled={!scenario.planApproved}
                        >
                          STOP
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-600">
                        {scenario.planApproved
                          ? 'Plan approved. Click Run Simulation to open the Execution Timeline.'
                          : 'Simulation is unavailable until a deployment plan is generated and approved.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-black bg-white">
                <div className="px-4 py-2.5 border-b border-black font-mono text-xs font-bold uppercase">
                  DEPLOYMENT SCHEDULE
                </div>
                {scenario.planGenerated ? (
                  <div className="p-4 flex items-center justify-between text-xs">
                    <span className="font-semibold">
                      8-stage deployment sequence generated for {scenario.project} ({scenario.selectedPlan === 'A' ? 'Satellite-first' : 'Terrestrial-first'}).
                    </span>
                    <Button variant="primary" size="xs" onClick={() => setSubView('proposed_plan')}>
                      VIEW PROPOSED PLAN
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-1">
                    <div className="font-bold text-sm text-black">No schedule available.</div>
                    <div className="text-xs text-zinc-600">Generate a deployment plan to create a schedule.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {scenarioTab === 'dependencies' && (
            <div className="border border-black p-5 space-y-3 text-xs">
              <div className="font-mono font-bold uppercase">PREREQUISITE DEPENDENCY CHAIN</div>
              <div className="font-mono font-bold p-3 border border-black bg-zinc-50">
                12 (Power) → 10 (Satellite) → 11 (Optical Conditional) → 14 (Backhaul Conditional) → 07 (Compute) → 01/04 (Numbers &amp; SIP) → 16 (Identity) → 17 (Security)
              </div>
            </div>
          )}

          {scenarioTab === 'resources' && (
            <KeyValueTable
              title="ALLOCATED DEMO RESOURCES"
              rows={[
                { key: 'Power Unit', value: '2 kW Solar Array + 24h BMS' },
                { key: 'Backhaul Terminal', value: '20 Mbps LEO Satellite Terminal (Route-B Backhaul reserved)' },
                { key: 'Compute Node', value: '1 Edge VM · 100 GB NVMe' },
                { key: 'Telecom Services', value: '1 E.164 Business Number · Voice & SMS TLS Trunk' }
              ]}
            />
          )}

          {scenarioTab === 'assumptions' && (
            <div className="border border-black p-5 space-y-2 text-sm">
              <div className="font-mono text-xs font-bold uppercase">KEY SCENARIO ASSUMPTIONS</div>
              <ul className="list-disc pl-5 space-y-1 text-zinc-700">
                <li>Coverage and terrestrial backhaul feasibility are unverified demo assumptions.</li>
                <li>Optical Ground Station (System 11) requires clear line-of-sight readiness review.</li>
                <li>Emergency backup maintains clinic voice connectivity for 24 continuous hours.</li>
              </ul>
            </div>
          )}

          {scenarioTab === 'configuration' && (
            <pre className="border border-black p-4 bg-white font-mono text-xs overflow-x-auto tabular-nums">
              {JSON.stringify(scenario, null, 2)}
            </pre>
          )}

          {scenarioTab === 'history' && (
            <div className="border border-black p-4 text-xs font-mono space-y-1 tabular-nums">
              <div>2025-01-24 10:24 UTC — Configuration validated ({scenario.deploymentId})</div>
              <div>2025-01-24 09:58 UTC — Initial clinic parameters populated</div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 2. PROPOSED PLAN (WF-19) ==================== */}
      {subView === 'proposed_plan' && (
        <div className="space-y-5">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-zinc-600">
              PROPOSED DEPLOYMENT PLAN — {scenario.project}
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight mt-0.5">
              Plan {scenario.selectedPlan}: {scenario.selectedPlan === 'A' ? 'Satellite-first' : 'Terrestrial-first'}
            </h1>
          </div>

          <KeyValueTable
            rows={[
              { key: 'PLAN ID', value: `${scenario.deploymentId} (${scenario.version})` },
              { key: 'PRIMARY PATH', value: scenario.selectedPlan === 'A' ? 'System 10 Satellite → System 14 Backhaul' : 'System 14 Terrestrial Fiber → System 10 Backup' },
              { key: 'SYSTEM SEQUENCE', value: '12 → 10 → 11 (conditional) → 14 (conditional) → 07 → 01/04 → 16 → 17' },
              { key: 'APPROVAL STATUS', value: scenario.planApproved ? 'Approved for simulation only' : 'Pending operator review' }
            ]}
          />

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setSubView('compare')}>
              COMPARE PLAN A VS PLAN B
            </Button>
            <Button variant="secondary" onClick={() => setSubView('assumptions')}>
              INSPECT ASSUMPTIONS
            </Button>
            <Button variant="secondary" onClick={() => setSubView('review')}>
              PROCEED TO REVIEW &amp; APPROVAL
            </Button>
          </div>
        </div>
      )}

      {/* ==================== 3. ASSUMPTIONS & DEPENDENCIES (WF-20) ==================== */}
      {subView === 'assumptions' && (
        <div className="space-y-5">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Plan assumptions and dependencies
          </h1>
          <div className="border border-black bg-white divide-y divide-black/15 text-sm">
            <div className="p-4">
              <div className="font-mono text-xs font-bold uppercase">1. SERVICE COVERAGE</div>
              <p className="text-zinc-700 mt-1">
                Assumes candidate LEO beam and optical ground station are reachable from clinic site; field verification required before production.
              </p>
            </div>
            <div className="p-4">
              <div className="font-mono text-xs font-bold uppercase">2. CONDITIONAL OPTICAL SKIP</div>
              <p className="text-zinc-700 mt-1">
                If System 11 Optical Ground Station is unverified, execution conditionally branches to System 14 Backhaul (Route-B).
              </p>
            </div>
            <div className="p-4">
              <div className="font-mono text-xs font-bold uppercase">3. POWER PREREQUISITE</div>
              <p className="text-zinc-700 mt-1">
                System 12 (2 kW Solar + 24h BMS) must be completed before Compute (07) and Communications (01/04) initialization.
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={() => setSubView('review')}>
            CONTINUE TO REVIEW
          </Button>
        </div>
      )}

      {/* ==================== 4. COMPARE DEPLOYMENT PLANS (WF-21) ==================== */}
      {subView === 'compare' && (
        <div className="space-y-5">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Compare deployment plans</h1>

          <Tabs
            tabs={[
              { id: 'compare', label: 'COMPARE PLANS' },
              { id: 'a', label: 'PLAN A DETAILS' },
              { id: 'b', label: 'PLAN B DETAILS' }
            ]}
            activeId="compare"
            onChange={(id) => {
              if (id === 'a') onUpdateScenario({ selectedPlan: 'A' });
              if (id === 'b') onUpdateScenario({ selectedPlan: 'B' });
            }}
          />

          <div className="border border-black bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-black font-mono text-xs uppercase bg-zinc-50">
                  <th className="py-3 px-4">CRITERIA</th>
                  <th className="py-3 px-4 border-l border-black">
                    PLAN A {scenario.selectedPlan === 'A' ? '(SELECTED)' : ''}
                  </th>
                  <th className="py-3 px-4 border-l border-black">
                    PLAN B {scenario.selectedPlan === 'B' ? '(SELECTED)' : ''}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                <tr>
                  <td className="py-3 px-4 font-mono text-xs font-bold uppercase">APPROACH</td>
                  <td className="py-3 px-4 border-l border-black">Satellite-first</td>
                  <td className="py-3 px-4 border-l border-black">Terrestrial-first</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs font-bold uppercase">POWER</td>
                  <td className="py-3 px-4 border-l border-black">2 kW planning input</td>
                  <td className="py-3 px-4 border-l border-black">Load assessment required</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs font-bold uppercase">SYSTEMS</td>
                  <td className="py-3 px-4 border-l border-black font-mono">12,10,7,1/4,16,17</td>
                  <td className="py-3 px-4 border-l border-black font-mono">12,14,7,1/4,16,17</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs font-bold uppercase">DEPENDENCY</td>
                  <td className="py-3 px-4 border-l border-black">Coverage validation</td>
                  <td className="py-3 px-4 border-l border-black">Fiber access validation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs font-bold uppercase">OPTICAL STAGE</td>
                  <td className="py-3 px-4 border-l border-black">Conditional</td>
                  <td className="py-3 px-4 border-l border-black">Not selected</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs font-bold uppercase">FEASIBILITY</td>
                  <td className="py-3 px-4 border-l border-black">Unverified</td>
                  <td className="py-3 px-4 border-l border-black">Unverified</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs font-bold uppercase">COST</td>
                  <td className="py-3 px-4 border-l border-black">Not available</td>
                  <td className="py-3 px-4 border-l border-black">Not available</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-black px-4 py-3 text-sm font-semibold text-black">
            Assumption-based comparison, not a validated engineering calculation.
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={scenario.selectedPlan === 'A' ? 'primary' : 'secondary'}
              onClick={() => {
                onUpdateScenario({ selectedPlan: 'A' });
                setSubView('review');
              }}
            >
              KEEP PLAN A
            </Button>
            <Button
              variant={scenario.selectedPlan === 'B' ? 'primary' : 'secondary'}
              onClick={() => {
                onUpdateScenario({ selectedPlan: 'B' });
                setSubView('review');
              }}
            >
              SELECT PLAN B
            </Button>
          </div>
        </div>
      )}

      {/* ==================== 5. REVIEW & APPROVAL (WF-22/23) ==================== */}
      {subView === 'review' && (
        <div className="space-y-5">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Review deployment plan
          </h1>

          <KeyValueTable
            title="PACKAGE SUMMARY"
            rows={[
              { key: 'DEPLOYMENT', value: `${scenario.deploymentId} (${scenario.version})` },
              { key: 'PROJECT', value: `${scenario.project} — ${scenario.site}` },
              { key: 'SELECTED PLAN', value: `Plan ${scenario.selectedPlan} (${scenario.selectedPlan === 'A' ? 'Satellite-first' : 'Terrestrial-first'})` },
              { key: 'APPROVAL', value: scenario.planApproved ? 'Approved for simulation only' : 'Awaiting demonstration approval' }
            ]}
          />

          <CalloutBanner
            symbol="!"
            text="Approving this package permits simulated execution only. No live clinic hardware or carrier circuits are altered."
          />

          <div className="flex flex-wrap gap-3">
            {!scenario.planApproved ? (
              <Button variant="primary" onClick={() => setShowApprovalModal(true)}>
                APPROVE DEMO DEPLOYMENT
              </Button>
            ) : (
              <Button variant="primary" onClick={() => onSelectSection('deployments')}>
                OPEN EXECUTION TIMELINE →
              </Button>
            )}
            <Button variant="secondary" onClick={() => setSubView('compare')}>
              COMPARE PLANS
            </Button>
          </div>
        </div>
      )}

      <ModalShell
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Approve Demo Deployment (WF-23)"
        subtitle={`Deployment ${scenario.deploymentId} · ${scenario.project}`}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onApprovePlan();
                setShowApprovalModal(false);
                onSelectSection('deployments');
              }}
            >
              Confirm Demo Approval
            </Button>
          </div>
        }
      >
        <p className="text-sm text-zinc-700">
          You are approving <strong>{scenario.deploymentId}</strong> ({scenario.version}) for simulated 8-stage execution in the demo planning environment.
        </p>
        <div className="border border-black p-3 text-xs font-mono bg-zinc-50">
          MODE: SIMULATION ONLY · NO LIVE INFRASTRUCTURE CHANGES
        </div>
      </ModalShell>
    </div>
  );
};
