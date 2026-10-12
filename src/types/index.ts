export type NavigationScreen = 
  // Operations
  | 'command_center'
  | 'employee_records'
  | 'compliance_cases'
  | 'tasks'
  // AI Control Center
  | 'agents'
  | 'agent_detail'
  | 'agent_workflows'
  | 'evals'
  | 'observability'
  | 'guardrails'
  // Insights
  | 'analytics'
  | 'business_value'
  | 'audit_logs'
  // Platform
  | 'integrations'
  | 'users_roles'
  | 'settings';

export type EnvironmentType = 'Production' | 'Staging' | 'Sandbox';

export type AutonomyLevel = 0 | 1 | 2 | 3 | 4;

export interface AgentInfo {
  id: string;
  name: string;
  purpose: string;
  version: string;
  status: 'Healthy' | 'Degraded' | 'Disabled' | 'Paused';
  runs30d: number;
  successRate: number;
  avgLatency: string;
  avgCostPerRun: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  owner: string;
  productionSince: string;
  autonomyLevel: AutonomyLevel;
}

export interface AgentTraceStep {
  stepNumber: number;
  name: string;
  durationMs: number;
  detail: string;
  status: 'success' | 'warning' | 'error';
}

export interface AgentTrace {
  id: string;
  timestamp: string;
  agentName: string;
  employeeId: string;
  employeeName: string;
  action: string;
  latencySec: number;
  tokenCount: number;
  costUsd: number;
  outcome: 'Flag' | 'Pass' | 'Escalate' | 'Resolved';
  confidence: number;
  policyVersion: string;
  modelVersion: string;
  promptVersion: string;
  steps: AgentTraceStep[];
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  toolsCalled: string[];
  sourcesAccessed: string[];
}

export interface EvalCase {
  id: string;
  name: string;
  testSuite: 'Regression' | 'Compliance' | 'Edge Case' | 'Safety';
  scenario: string;
  expected: string;
  actual: string;
  difference: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  policyUsed: string;
  promptVersion: string;
  agentTraceId: string;
}

export interface WorkflowNodeData {
  id: string;
  title: string;
  subtitle: string;
  type: 'trigger' | 'agent' | 'decision' | 'human_gate' | 'action' | 'audit';
  agent?: string;
  inputs?: string[];
  outputs?: string[];
  trigger?: string;
  timeout?: string;
  retryPolicy?: string;
  humanApprovalRequired?: boolean;
  failureBehavior?: string;
  branch?: string;
}

export interface AgentVersion {
  version: string;
  status: 'Production' | 'Draft' | 'Previous' | 'Archived';
  model: string;
  promptVersion: string;
  policyCompatibility: string;
  evalScore: string;
  releaseDate: string;
  owner: string;
  notes: string;
}

export interface KillSwitchRecord {
  isTriggered: boolean;
  agentId?: string;
  stoppedAt?: string;
  stoppedBy?: string;
  reason?: string;
}

// Retain employee & document types for operational drill-down
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  status: 'Active' | 'Onboarding' | 'Leave';
  startDate: string;
  manager: string;
  avatarUrl: string;
  fileHealthScore: number;
  healthStatus: 'Complete' | 'Needs Attention' | 'Critical';
  lastScanTime: string;
  openGapsCount: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  sourceSystem: 'Workday' | 'SharePoint' | 'DocuSign' | 'Email Archive' | 'Sterling';
  sourceUri: string;
  uploadedAt: string;
  classificationConfidence: number;
  status: 'Verified' | 'Unclassified' | 'Superseded' | 'Needs Review';
  fileSize: string;
  contentHash: string;
  extractedFields?: Record<string, string>;
}

export interface ComplianceGap {
  id: string;
  employeeId: string;
  employeeName: string;
  issue: string;
  docFamily: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number;
  ageDays: number;
  owner: string;
  status: 'Open' | 'Remediation Proposed' | 'Remediation Dispatched' | 'Evidence Received' | 'Resolved';
  detectedAt: string;
  findingSummary: string;
  policySource: string;
  policyVersion: string;
}
