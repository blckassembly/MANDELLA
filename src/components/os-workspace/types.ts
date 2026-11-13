export type OsSectionId =
  | 'desktop'
  | 'mission_control'
  | 'systems'
  | 'infrastructure'
  | 'golden_command'
  | 'deployments'
  | 'expert_console';

export type ExperienceMode = 'guided' | 'expert';

export type OsInterfaceMode =
  | 'os_workspace'
  | 'customer_portal'
  | 'operator_ops';

export type SystemCategory =
  | 'CONNECT'
  | 'TELECOM'
  | 'CLOUD'
  | 'ORBIT'
  | 'GRID'
  | 'FIBER'
  | 'SECURE';

export interface SystemCatalogEntry {
  number: string; // '01' .. '18'
  id: string;
  name: string;
  category: SystemCategory;
  availability: 'mvp' | 'planned';
  shortDesc: string;
  inspectorTitle: string;
  components: { name: string; role: string }[];
  dependencies: string[];
  workflowId: string;
  legacyProduct?: string;
  statusMetrics: { key: string; value: string }[];
}

export interface DeploymentStageItem {
  stageNumber: number;
  code: string;
  systemNumber: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'simulated' | 'conditional' | 'skipped' | 'in_planning' | 'blocked' | 'pending';
  objective: string;
  requiredInputs: string;
  prerequisites: string;
  feasibility: string;
  resources: string;
  note?: string;
}

export interface DeploymentScenarioConfig {
  deploymentId: string;
  version: string;
  project: string;
  country: string;
  site: string;
  objective: string;
  connectivity: string;
  power: string;
  compute: string;
  communications: string;
  priority: 'Standard' | 'High' | 'Emergency';
  selectedPlan: 'A' | 'B';
  planGenerated: boolean;
  planApproved: boolean;
  simulationStatus: 'not_started' | 'running' | 'paused' | 'blocked' | 'complete';
  activeStageIndex: number;
}

export interface OsNotificationItem {
  id: string;
  title: string;
  summary: string;
  project: string;
  stage: string;
  timestamp: string;
  tag: 'DEMO' | 'ALERT' | 'SYSTEM';
  unread: boolean;
  targetSection: OsSectionId;
}

export interface EngineeringLogEntry {
  timeUtc: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  component: string;
  message: string;
}
