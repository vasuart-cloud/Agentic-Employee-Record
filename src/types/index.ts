export type UserRoleId = 'hr_ops_maya' | 'admin_priya' | 'chro_david' | 'cred_alex';

export interface UserPersona {
  id: UserRoleId;
  name: string;
  title: string;
  roleLabel: string;
  email: string;
  avatarUrl: string;
  workspaceLabel: string;
  jobToBeDone: string;
  isSupportingDemoRole?: boolean;
  description: string;
}

export type NavigationScreen =
  // Maya (HR Operations Lead)
  | 'weekly_overview'
  | 'employees'
  | 'employee_records'
  | 'compliance_cases'
  | 'employee_requests'
  | 'tasks'
  | 'audit_packets'
  | 'analytics'
  // Priya (Healthcare Compliance Admin)
  | 'policy_library'
  | 'rule_builder'
  | 'rule_test_lab'
  | 'rule_versions'
  | 'credential_verification'
  | 'ai_governance'
  | 'integrations'
  | 'audit_access'
  // David (CHRO / VP People)
  | 'executive_overview'
  | 'risk_by_facility'
  | 'readiness_trends'
  | 'business_value'
  | 'pilot_scorecard'
  // Supporting Admin Subviews
  | 'command_center'
  | 'agents'
  | 'agent_detail'
  | 'agent_workflows'
  | 'evals'
  | 'observability'
  | 'guardrails'
  | 'users_roles'
  | 'audit_logs'
  | 'settings';

export type EnvironmentType = 'Demo Sandbox (Simulated)' | 'Staging (Simulated)' | 'Production Preview (Simulated)';
export type AutonomyLevel = 0 | 1 | 2 | 3 | 4;

// Four Independent State Dimensions (Section 6)
export type EvidenceDocumentState =
  | 'MISSING'
  | 'REQUESTED'
  | 'RECEIVED'
  | 'PARSING'
  | 'REVIEW_REQUIRED'
  | 'REJECTED'
  | 'ACCEPTED';

export type CredentialVerificationState =
  | 'NOT_REQUIRED'
  | 'NOT_STARTED'
  | 'PENDING_SOURCE_CHECK'
  | 'VERIFIED_ACTIVE'
  | 'EXPIRED'
  | 'RESTRICTED'
  | 'UNVERIFIED'
  | 'VERIFICATION_FAILED';

export type ClinicalDutyEligibilityState =
  | 'NOT_APPLICABLE'
  | 'REVIEW_REQUIRED'
  | 'RESTRICTED_BY_AUTHORIZED_DECISION'
  | 'AUTHORIZED_BY_DESIGNATED_LEADER';

export type ExternalSyncState =
  | 'NOT_CONFIGURED'
  | 'NOT_REQUIRED'
  | 'QUEUED'
  | 'IN_PROGRESS'
  | 'ACKNOWLEDGED'
  | 'FAILED'
  | 'RECONCILIATION_REQUIRED';

export type CaseWorkflowState =
  | 'detected'
  | 'triaged'
  | 'evidence_requested'
  | 'employee_responded'
  | 'verification_pending'
  | 'authorized_review'
  | 'resolved'
  | 'exception_unresolved'
  | 'escalated';

export type ApplicabilityOutcome = 'REQUIRED' | 'NOT_APPLICABLE' | 'NEEDS_POLICY_INTERPRETATION';

export type WorkerType = 'Permanent' | 'Contingent' | 'Contract';

export interface Organization {
  id: string;
  name: string;
  legalEntity: string;
  enterpriseHeadcountContext: number; // e.g., 11420 — explicitly labeled context, NOT sample size
  defaultSlaDays: number;
  demoReferenceDate: string; // YYYY-MM-DD reproducible anchor
}

export interface Facility {
  id: string;
  name: string;
  state: string;
  type: 'Clinical Research' | 'Acute Care Hospital' | 'Specialty Clinic' | 'Corporate HQ';
  regulatoryContext: string;
}

export interface Department {
  id: string;
  name: string;
  facilityId: string;
}

export interface Position {
  id: string;
  title: string;
  jobProfileCode: string;
  requiresClinicalPrivilegingRef: boolean;
}

export interface EmploymentAssignment {
  id: string;
  workerId: string;
  facilityId: string;
  facilityName: string;
  state: string;
  department: string;
  jobProfile: string;
  workerType: WorkerType;
  sponsoringAgency?: string;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  isPrimary: boolean;
  isClinicalDuty: boolean;
}

export interface OccupationalHealthSummary {
  // Restricted status-only summary; NO diagnoses, vaccine details, or PHI exposed to HR/CHRO
  clearanceStatus: 'CLEARED' | 'PENDING_OCC_HEALTH' | 'RESTRICTED_STATUS_ONLY';
  lastClearedDate?: string;
  restrictedAccessNote: string;
}

export interface PrivilegingReference {
  // External Medical Staff Office status only; never granted by this app or Workday
  status: 'NOT_APPLICABLE' | 'EXTERNAL_MSO_ACTIVE' | 'EXTERNAL_MSO_PENDING' | 'EXTERNAL_MSO_RESTRICTED';
  msoReferenceId?: string;
  lastCheckedAt?: string;
}

export interface Worker {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  primaryRole: string;
  primaryDepartment: string;
  primaryFacilityId: string;
  primaryFacilityName: string;
  primaryState: string;
  workerType: WorkerType;
  sponsoringOrganization?: string;
  employmentStatus: 'Active' | 'Preboarding' | 'Leave' | 'Pending Transfer';
  hireDate: string;
  startDate: string;
  manager: string;
  initials: string;
  avatarUrl?: string;
  occupationalHealthSummary: OccupationalHealthSummary;
  privilegingReference: PrivilegingReference;
  clinicalEligibility: ClinicalDutyEligibilityState;
  clinicalEligibilityDecisionBy?: string;
  clinicalEligibilityDecisionAt?: string;
  clinicalEligibilityNotes?: string;
}

export interface PolicyClause {
  clauseId: string;
  section: string;
  text: string;
}

export interface PolicyDocument {
  id: string;
  name: string;
  documentNumber: string;
  version: string;
  effectiveDate: string;
  owner: string;
  applicableBusinessUnit: string;
  category: 'Clinical Licensure' | 'Life Support / Training' | 'Laboratory Competency' | 'Employment Verification' | 'Ethics & Privacy';
  sourceReference: string;
  summary: string;
  clauses: PolicyClause[];
  fileName: string;
  fileSize: string;
  extractionStatus: 'Seeded Structured Clauses' | 'Browser TXT Extracted' | 'Demo File Reference (Manual Clause Entry Required)';
  status: 'Active' | 'Under Review' | 'Draft';
  disclaimer: string;
}

export type VerificationMethod =
  | 'PRIMARY_SOURCE_VERIFICATION'
  | 'APPROVED_TRAINING_ROSTER'
  | 'SIGNED_ATTESTATION'
  | 'WORKDAY_OR_I9_REVIEW';

export interface RuleApplicability {
  states: string[]; // ['California'] or ['ALL']
  facilities: string[]; // facility IDs or ['ALL']
  departments: string[]; // ['Pharmacy', 'R&D/Clinical Operations'] or ['ALL']
  jobProfiles: string[]; // ['Clinical Research Pharmacist'] or ['ALL']
  workerTypes: WorkerType[] | ['ALL'];
  clinicalDutyRequiredOnly?: boolean;
}

export interface RuleDefinition {
  id: string;
  ruleCode: string;
  name: string;
  category:
    | 'Statutory Licensure'
    | 'Organizational Certification'
    | 'Role Training'
    | 'Policy Attestation'
    | 'Form I-9 Verification'
    | 'Laboratory Competency';
  documentType: string;
  acceptableAlternatives: string[];
  applicability: RuleApplicability;
  conditionExpression: {
    requireUnexpired: boolean;
    requirePrimarySourceVerification: boolean;
    minConfidenceThreshold: number;
    allowAlternativeListA?: boolean; // Form I-9 List A OR List B + C
    disallowOutOfStateLicense: boolean;
    blockOnRestrictedBoardStatus: boolean;
  };
  verificationMethod: VerificationMethod;
  verificationSourceLabel: string;
  accountableOwnerRole: string;
  clinicalEscalationRequired: boolean;
  validityMonths: number;
  internalReminderDays: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  slaDays: number;
  evidenceSources: ('Workday' | 'SharePoint' | 'DocuSign' | 'Box' | 'LMS' | 'Employee Portal')[];
  humanApprovalRequired: boolean;
  effectiveDate: string;
  sourcePolicyId: string;
  sourcePolicyVersion: string;
  sourceClause: string;
  version: string;
  status: 'Draft' | 'Tested' | 'Pending Approval' | 'Published' | 'Superseded';
  author: string;
  approver?: string;
  approvedAt?: string;
  approvalNotes?: string;
}

export interface PolicyVersionRecord {
  id: string;
  ruleId: string;
  ruleCode: string;
  ruleName: string;
  version: string;
  author: string;
  status: 'Published' | 'Pending Approval' | 'Draft' | 'Superseded' | 'Rejected';
  lastTestRunId?: string;
  testSummary: string;
  effectiveDate: string;
  approver?: string;
  approvedAt?: string;
  approvalNotes?: string;
  diffSummary: string;
}

export interface TestFixture {
  id: string;
  name: string;
  ruleId: string;
  scenarioCategory: 'Complete' | 'Expired' | 'Missing' | 'Wrong Type' | 'Out-of-State' | 'Restricted Board' | 'Source Unavailable' | 'Low Confidence' | 'Outdated Rule' | 'Concurrent Assignment';
  workerState: string;
  workerFacility: string;
  workerDepartment: string;
  workerJobProfile: string;
  workerType: WorkerType;
  evidenceProvided: boolean;
  evidenceTypeMatches: boolean;
  evidenceStateMatches: boolean;
  evidenceExpirationDate?: string;
  extractionConfidence: number;
  boardVerificationStatus: CredentialVerificationState;
  ruleVersionMatched: string;
  expectedOutcome: 'PASS_COMPLIANT' | 'FLAG_NON_COMPLIANT' | 'ROUTE_MANUAL_REVIEW' | 'BLOCK_RESTRICTED';
  description: string;
}

export interface FixtureEvaluationResult {
  fixtureId: string;
  fixtureName: string;
  expectedOutcome: TestFixture['expectedOutcome'];
  actualOutcome: TestFixture['expectedOutcome'];
  passed: boolean;
  classification: 'TP' | 'TN' | 'FP' | 'FN';
  reason: string;
  suggestedFix?: string;
}

export interface TestRun {
  runId: string;
  timestamp: string;
  ruleId: string;
  ruleVersion: string;
  ruleSnapshotHash: string;
  totalFixtures: number;
  passedCount: number;
  failedCount: number;
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  precision: number | null; // null renders as 'N/A'
  recall: number | null;
  accuracy: number | null;
  coveragePercent: number;
  blockedOutcomesCount: number;
  gatePassed: boolean;
  gateBlockReasons: string[];
  results: FixtureEvaluationResult[];
}

export interface CredentialRequirement {
  requirementId: string;
  workerId: string;
  assignmentId: string;
  ruleId: string;
  ruleCode: string;
  name: string;
  category: RuleDefinition['category'];
  applicabilityOutcome: ApplicabilityOutcome;
  verificationMethod: VerificationMethod;
  documentState: EvidenceDocumentState;
  verificationState: CredentialVerificationState;
  dueDate: string;
  lastEvaluatedAt: string;
  evidenceItemId?: string;
  verificationId?: string;
  activeCaseId?: string;
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  sourceNotice: string;
}

export interface EvidenceItem {
  id: string;
  workerId: string;
  requirementId: string;
  documentName: string;
  documentType: string;
  sourceSystem: 'Workday' | 'SharePoint' | 'DocuSign' | 'Box' | 'LMS' | 'Employee Portal';
  sourceUri: string;
  uploadedAt: string;
  asOfTimestamp: string;
  expirationDate?: string;
  licenseNumber?: string;
  issuingJurisdiction?: string;
  extractionConfidence: number; // Strictly extraction/classification confidence, NOT legal validity
  extractionMethodNote: string;
  fileSize: string;
  mimeType: string;
  status: EvidenceDocumentState;
  extractedFields: ExtractedField[];
}

export interface CredentialVerification {
  id: string;
  workerId: string;
  requirementId: string;
  evidenceItemId?: string;
  method: VerificationMethod;
  sourceName: string;
  sourceTypeLabel: string;
  licenseNumberChecked?: string;
  employeeNameMatched: boolean;
  returnedStatus: CredentialVerificationState;
  restrictionsNote?: string;
  expirationDate?: string;
  checkedAt: string;
  verifierName: string;
  verifierRole: string;
  receiptReference: string;
  isSimulated: boolean;
}

export interface EscalationRecord {
  id: string;
  caseId: string;
  workerId: string;
  reason: string;
  escalatedToName: string;
  escalatedToRole: string;
  status: 'PENDING_REVIEW' | 'ACKNOWLEDGED' | 'DECISION_RECORDED';
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  decisionRecorded?: ClinicalDutyEligibilityState;
  decisionNotes?: string;
}

export interface ReviewDecision {
  id: string;
  caseId: string;
  actorName: string;
  actorRole: string;
  decision: 'APPROVED' | 'REJECTED' | 'ESCALATED' | 'OVERRIDDEN';
  notes: string;
  method: string;
  sourceRef: string;
  timestamp: string;
}

export interface OutboundMessage {
  id: string;
  senderType: 'HR_OPERATIONS' | 'EMPLOYEE' | 'SYSTEM';
  senderName: string;
  senderRole: string;
  timestamp: string;
  channel: 'Simulated Demo Portal' | 'Workday Inbox Check';
  subject?: string;
  content: string;
  deliveryStatus: 'Simulated Delivered' | 'Employee Replied' | 'Recorded';
  attachmentMetadata?: {
    fileName: string;
    fileSize: string;
    mimeType: string;
    extractionStatusLabel: string;
  };
}

export interface CommunicationThread {
  id: string;
  caseId: string;
  workerId: string;
  subject: string;
  messages: OutboundMessage[];
}

export interface RemediationTask {
  id: string;
  caseId: string;
  workerId: string;
  workerName: string;
  ownerRole: 'hr_ops_maya' | 'cred_alex' | 'clinical_leader';
  ownerLabel: string;
  title: string;
  actionRequired: string;
  dueDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  draftedSubject?: string;
  draftedBody?: string;
  reminderWindowDays?: number;
}

export interface ComplianceCase {
  id: string;
  caseNumber: string;
  workerId: string;
  workerName: string;
  assignmentId: string;
  facilityId: string;
  facilityName: string;
  department: string;
  role: string;
  state: string;
  requirementId: string;
  ruleId: string;
  ruleVersion: string;
  caseCategory: 'Expired License' | 'Missing Preboarding Credential' | 'Low-Confidence Evidence' | 'Restricted / Negative PSV' | 'Training / Attestation' | 'Form I-9 Verification' | 'Transfer Re-evaluation';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  findingSummary: string;
  workflowState: CaseWorkflowState;
  documentState: EvidenceDocumentState;
  verificationState: CredentialVerificationState;
  clinicalEligibilityState: ClinicalDutyEligibilityState;
  externalSyncState: ExternalSyncState;
  detectedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  clinicalRiskOwner: string;
  hrOutreachOwner: string;
  repositoriesSearched: string[];
  whyFlagged: {
    policyName: string;
    policyVersion: string;
    policyEffectiveDate: string;
    clause: string;
    clauseText: string;
    requirementText: string;
    inspectedSource: string;
    sourceAsOfTimestamp: string;
    foundEvidenceSummary: string;
    alternativesAccepted: string[];
    extractionConfidence: number;
    confidenceDisclaimer: string;
    uncertaintyNote: string;
    whyAuthoritativeVerificationRequired: string;
    agentRunId: string;
  };
  escalation?: EscalationRecord;
  reviewDecisions: ReviewDecision[];
  lastSyncTransactionId?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Connector {
  id: string;
  name: string;
  type: 'Workday HCM' | 'SharePoint Online' | 'DocuSign' | 'Box' | 'HealthStream LMS' | 'External Verification Adapter';
  category: 'HRMS' | 'Document Repository' | 'LMS / Training' | 'E-Signature' | 'Verification Adapter';
  environment: 'Demo Sandbox' | 'Production Disabled';
  status: 'Connected (Simulated)' | 'Configured (Simulated)' | 'Error (Simulated)' | 'Disconnected';
  permissionMode: 'Read-Only' | 'Read + Scoped Staging Writeback';
  lastSyncTimestamp: string;
  recordsSynced: number;
  targetObjectLabel: string;
  syncCadence: string;
  writebackEnabled: boolean;
}

export interface FieldMapping {
  id: string;
  sourceSystem: string;
  sourceField: string;
  targetSystem: string;
  targetField: string;
  direction: 'Inbound (Read-Only)' | 'Outbound (Staging Object Only)';
  isWritable: boolean;
  restrictionNote?: string;
  status: 'Mapped' | 'Restricted' | 'Unmapped';
}

export interface SyncTransaction {
  id: string;
  idempotencyKey: string;
  connectorId: string;
  connectorName: string;
  direction: 'Inbound (Workday -> Readiness)' | 'Outbound (Approved Summary -> Workday Staging)';
  workerId?: string;
  workerName?: string;
  caseId?: string;
  timestamp: string;
  recordsProcessed: number;
  recordsFailed: number;
  status: ExternalSyncState;
  httpStatus?: number;
  errorDetails?: string;
  payloadPreview?: Record<string, unknown>;
  acknowledgedAt?: string;
  retryCount: number;
}

export interface HRMSMirrorRecord {
  workerId: string;
  workerName: string;
  workdayWorkerStatus: 'Active' | 'Preboarding' | 'Leave'; // Read-only from Workday
  jobProfile: string; // Read-only
  facilityName: string; // Read-only
  department: string; // Read-only
  assignmentEffectiveDate: string; // Read-only
  // Outbound Staging Object: Workday_Custom_Compliance_Staging__c
  stagingObject: {
    credentialReadinessSummary: 'READY' | 'ACTION_REQUIRED' | 'CLINICAL_REVIEW_REQUIRED' | 'PARTIAL_PENDING';
    verifiedLicenseCode?: string;
    verifiedLicenseThroughDate?: string;
    lastVerifiedCaseId?: string;
    lastVerifiedTimestamp?: string;
    reconciliationStatus: ExternalSyncState;
    lastTransactionId?: string;
  };
}

export interface AuditEvent {
  eventId: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  category: 'POLICY' | 'CASE' | 'OUTREACH' | 'PSV_CHECK' | 'CLINICAL_ELIGIBILITY' | 'EVIDENCE' | 'WORKDAY_SYNC' | 'ACCESS' | 'KILL_SWITCH';
  source: string;
  targetEntityId: string;
  workerId?: string;
  beforeState?: string;
  afterState?: string;
  details: string;
  isSimulatedDemoEvent: true;
  integrityLabel: 'Demonstration Event History (browser-local, not tamper-proof)';
}

export interface ROIModelAssumption {
  monthlyExceptionVolume: number;
  baselineManualMinutesPerCase: number;
  assistedMinutesPerCase: number;
  loadedHrHourlyRate: number;
  annualSoftwareSubscriptionCost: number;
  annualImplementationAndIntegrationCost: number;
  capacityToCashRealizationFactor: number; // e.g. 0.45 — distinguishes capacity released vs hard cash
}

export type DemoScenarioId =
  | 'scenario_1_expired_pharmacist'
  | 'scenario_2_newhire_nurse'
  | 'scenario_3_suspended_license'
  | 'scenario_4_workday_retry'
  | 'scenario_5_priya_policy_publish'
  | 'scenario_6_david_executive';

// Compatibility types for Admin AI Control Center Views
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
