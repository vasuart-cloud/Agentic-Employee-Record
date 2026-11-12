export type UserRoleId = 'admin_priya' | 'hr_ops_maya' | 'chro_david';

export interface UserPersona {
  id: UserRoleId;
  name: string;
  title: string;
  roleLabel: string;
  email: string;
  avatarUrl: string;
  workspaceLabel: string;
  description: string;
  permissions: {
    canConfigurePolicies: boolean;
    canPublishRules: boolean;
    canManageConnectors: boolean;
    canApproveRemediation: boolean;
    canCommunicateWithEmployees: boolean;
    canResolveCases: boolean;
    canTriggerHRMSSync: boolean;
  };
}

export type NavigationScreen = 
  // HR Operations
  | 'weekly_overview'
  | 'employees'
  | 'compliance_cases'
  | 'tasks'
  | 'messages'
  | 'audit_packets'
  // Compliance Admin
  | 'setup_checklist'
  | 'compliance_wizard'
  | 'policies_rules'
  | 'rule_test_lab'
  | 'rule_versions'
  | 'agents'
  | 'agent_detail'
  | 'agent_workflows'
  | 'evals'
  | 'observability'
  | 'guardrails'
  | 'audit_logs'
  // Insights
  | 'analytics'
  | 'business_value'
  | 'executive_overview'
  // Platform
  | 'integrations'
  | 'users_roles'
  | 'settings'
  // Legacy alias
  | 'command_center'
  | 'employee_records';

export type EnvironmentType = 'Production' | 'Staging' | 'Sandbox';
export type AutonomyLevel = 0 | 1 | 2 | 3 | 4;

export interface Organization {
  name: string;
  legalEntity: string;
  sizeRange: string;
  totalEmployees: number;
  states: string[];
  departments: string[];
  workerTypes: string[];
  defaultSlaDays: number;
}

export interface PolicySource {
  id: string;
  name: string;
  documentNumber: string;
  version: string;
  effectiveDate: string;
  owner: string;
  category: 'Licensure' | 'Employment Verification' | 'Ethics & Conduct' | 'Safety';
  summary: string;
  clauses: {
    clauseId: string;
    section: string;
    text: string;
  }[];
  fileSize: string;
  status: 'Active' | 'Under Review' | 'Draft';
}

export interface ComplianceRule {
  id: string;
  ruleCode: string;
  name: string;
  documentType: string;
  department: string;
  jobRole: string;
  location: string;
  workerType: string;
  conditionDescription: string;
  validityPeriodMonths: number;
  reminderNoticeDays: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  slaDays: number;
  evidenceSources: ('Workday' | 'SharePoint' | 'DocuSign' | 'Employee Portal')[];
  humanApprovalRequired: boolean;
  confidenceThreshold: number;
  effectiveDate: string;
  sourcePolicyId: string;
  sourceClause: string;
  version: string;
  status: 'Draft' | 'Tested' | 'Pending Approval' | 'Published';
  approvedBy?: string;
  approvedAt?: string;
}

export interface RuleVersion {
  version: string;
  ruleId: string;
  ruleName: string;
  author: string;
  status: 'Published' | 'Pending Approval' | 'Draft' | 'Archived';
  testPassRate: number;
  evalScore: string;
  effectiveDate: string;
  approvedBy?: string;
  notes: string;
  diffSummary?: string;
}

export interface EvalFixture {
  id: string;
  name: string;
  ruleId: string;
  employeeScenario: string;
  expectedOutcome: 'FLAG_EXPIRED' | 'FLAG_MISSING' | 'PASS_VALID' | 'NEEDS_HUMAN_REVIEW' | 'REJECT_WRONG_TYPE';
  actualOutcome?: 'FLAG_EXPIRED' | 'FLAG_MISSING' | 'PASS_VALID' | 'NEEDS_HUMAN_REVIEW' | 'REJECT_WRONG_TYPE';
  status: 'pass' | 'fail';
  confidence: number;
  evidenceSummary: string;
  evidenceFilename: string;
  failureExplanation?: string;
  suggestedFix?: string;
}

export interface EvalRun {
  runId: string;
  timestamp: string;
  ruleVersion: string;
  totalFixtures: number;
  passedFixtures: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  accuracy: number;
  gatePassed: boolean;
}

export interface DocumentItem {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  sourceSystem: 'Workday' | 'SharePoint' | 'DocuSign' | 'Employee Portal';
  sourceUri: string;
  uploadedAt: string;
  expirationDate?: string;
  classificationConfidence: number;
  status: 'Verified' | 'Expired' | 'Pending Review' | 'Superseded';
  fileSize: string;
  extractedFields?: Record<string, string>;
}

export interface ComplianceCase {
  id: string;
  caseNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  location: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  documentType: string;
  findingSummary: string;
  detailedWhy: {
    policyName: string;
    policyVersion: string;
    clause: string;
    clauseText: string;
    requirement: string;
    foundEvidenceSummary: string;
    foundEvidenceSource: string;
    expiryComparison?: string;
    agentConfidence: number;
    uncertaintyNote: string;
    agentRunId: string;
    evaluatedAt: string;
  };
  detectedDate: string;
  dueDate: string;
  slaStatus: 'On Track' | 'Due Soon' | 'Overdue';
  status: 'RED_OPEN' | 'AMBER_AWAITING_EMPLOYEE' | 'AMBER_NEEDS_HR_REVIEW' | 'GREEN_RESOLVED';
  hrmsSyncStatus: 'NOT_APPLICABLE' | 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  lastHRMSTryTimestamp?: string;
  lastHRMSError?: string;
  assignedTo: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface RemediationTask {
  id: string;
  caseId: string;
  employeeId: string;
  employeeName: string;
  title: string;
  actionRequired: string;
  channel: 'Secure Portal' | 'Work Email';
  draftedSubject: string;
  draftedBody: string;
  status: 'DRAFT' | 'APPROVED_SENT' | 'COMPLETED' | 'CANCELLED';
  dispatchedAt?: string;
  deadlineDate: string;
}

export interface MessageThread {
  id: string;
  caseId: string;
  employeeId: string;
  employeeName: string;
  subject: string;
  messages: {
    id: string;
    sender: 'HR_OPERATIONS' | 'EMPLOYEE' | 'SYSTEM';
    senderName: string;
    timestamp: string;
    content: string;
    attachments?: {
      filename: string;
      size: string;
      verified: boolean;
    }[];
  }[];
}

export interface EmployeeUpload {
  id: string;
  caseId: string;
  employeeId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  detectedLicenseNumber?: string;
  detectedExpirationDate?: string;
  classificationConfidence: number;
  status: 'VALIDATED_AUTO' | 'NEEDS_HR_REVIEW' | 'REJECTED' | 'APPROVED';
  reviewerNotes?: string;
}

export interface HRMSConnector {
  id: string;
  name: string;
  type: 'Workday' | 'SAP SuccessFactors' | 'Oracle HCM' | 'SharePoint' | 'DocuSign' | 'Box';
  category: 'HRMS' | 'Document Repository' | 'E-Signature';
  status: 'Connected' | 'Configured' | 'Disconnected' | 'Error';
  lastSyncTimestamp: string;
  recordsSynced: number;
  endpointUrl: string;
  syncFrequency: 'Every 15 min' | 'Hourly' | 'Daily';
  writebackEnabled: boolean;
  fieldMappingsCount: number;
}

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  direction: 'Two-Way' | 'Import Only' | 'Export Only';
  transformation?: string;
  status: 'Mapped' | 'Warning' | 'Unmapped';
}

export interface SyncRun {
  id: string;
  connectorId: string;
  connectorName: string;
  direction: 'Inbound (HRMS -> Compliance)' | 'Outbound (Approved Compliance -> HRMS)';
  timestamp: string;
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  durationMs: number;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  errorMessage?: string;
  idempotencyKey: string;
}

export interface HRMSMirrorRecord {
  employeeId: string;
  workerName: string;
  jobProfile: string;
  department: string;
  location: string;
  workerStatus: string;
  complianceStatus: 'VERIFIED_COMPLIANT' | 'NON_COMPLIANT_EXPIRED_LICENSE' | 'NON_COMPLIANT_MISSING_I9' | 'IN_REMEDIATION';
  licenseNumber?: string;
  licenseExpiration?: string;
  auditVerified: boolean;
  lastVerifiedBy?: string;
  lastVerifiedAt?: string;
  lastSyncTimestamp: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  category: 'POLICY' | 'CASE' | 'OUTREACH' | 'EVIDENCE' | 'HRMS_SYNC' | 'SYSTEM' | 'KILL_SWITCH';
  targetEntityId: string;
  targetEntityType: 'Rule' | 'Case' | 'Employee' | 'Connector' | 'Agent';
  details: string;
  hashSha256: string;
}

export interface BusinessValueAssumptions {
  baselineManualMinutesPerCase: number;
  assistedMinutesPerCase: number;
  loadedHrHourlyRate: number;
  averageMonthlyCases: number;
  annualSubscriptionCost: number;
  annualizedImplementationCost: number;
}

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
  activeCaseId?: string;
}

// Bounded Agents
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
