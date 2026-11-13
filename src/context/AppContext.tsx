import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  ReactNode
} from 'react';
import {
  AgentInfo,
  AgentTrace,
  AgentVersion,
  AuditEvent,
  AutonomyLevel,
  ClinicalDutyEligibilityState,
  CommunicationThread,
  ComplianceCase,
  Connector,
  CredentialRequirement,
  CredentialVerification,
  CredentialVerificationState,
  DemoScenarioId,
  Department,
  EmploymentAssignment,
  EnvironmentType,
  EvalCase,
  EvidenceItem,
  Facility,
  FieldMapping,
  HRMSMirrorRecord,
  KillSwitchRecord,
  NavigationScreen,
  Organization,
  PolicyDocument,
  PolicyVersionRecord,
  RemediationTask,
  ROIModelAssumption,
  RuleDefinition,
  SyncTransaction,
  TestFixture,
  TestRun,
  UserPersona,
  UserRoleId,
  Worker,
  WorkflowNodeData
} from '../types';
import {
  ADMIN_AGENTS,
  AGENT_VERSIONS,
  EVAL_CASES,
  HERO_AGENT_TRACE,
  INITIAL_ASSIGNMENTS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_COMMUNICATION_THREADS,
  INITIAL_COMPLIANCE_CASES,
  INITIAL_CONNECTORS,
  INITIAL_DEPARTMENTS,
  INITIAL_EVAL_FIXTURES,
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_FACILITIES,
  INITIAL_FIELD_MAPPINGS,
  INITIAL_HRMS_MIRROR,
  INITIAL_ORGANIZATION,
  INITIAL_POLICIES,
  INITIAL_POLICY_VERSIONS,
  INITIAL_REMEDIATION_TASKS,
  INITIAL_REQUIREMENTS,
  INITIAL_ROI_ASSUMPTIONS,
  INITIAL_RULES,
  INITIAL_SYNC_TRANSACTIONS,
  INITIAL_VERIFICATIONS,
  INITIAL_WORKERS,
  RECENT_TRACES,
  USER_PERSONAS,
  WORKFLOW_NODES
} from '../data/mockData';
import { canPerformAction, PermissionAction } from '../domain/authorization';
import {
  buildRequirementsForWorkerAssignments,
  computeRuleSnapshotHash,
  DEMO_REFERENCE_DATE,
  runRuleEvaluation
} from '../domain/rules';
import { computeWorkerReadiness, WorkerReadinessSummary } from '../domain/readiness';
import {
  applyEmployeeSubmissionToCase,
  applyPrimarySourceVerificationResult,
  validateCaseClosure
} from '../domain/workflows';
import {
  applyAcknowledgedTxToMirror,
  mockWorkdayAdapter
} from '../integrations/MockWorkdayAdapter';

const LOCAL_STORAGE_KEY = 'agentic_records_healthcare_demo_v3';

export interface ToastNotice {
  id: string;
  message: string;
  tone: 'info' | 'success' | 'warning' | 'error';
}

export interface UploadedFilePreview {
  evidenceId: string;
  objectUrl: string;
  fileName: string;
  mimeType: string;
  textSnippet?: string;
}

export interface EmployeePortalSubmitPayload {
  mode: 'file' | 'sample_doc' | 'reply_question' | 'already_submitted_workday';
  file?: File | null;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  licenseNumber?: string;
  expirationDate?: string;
  note: string;
}

interface AppContextType {
  // Active Persona & Navigation
  activeRoleId: UserRoleId;
  currentPersona: UserPersona;
  switchRole: (roleId: UserRoleId, targetScreen?: NavigationScreen) => void;
  can: (
    action: PermissionAction,
    context?: Parameters<typeof canPerformAction>[2]
  ) => ReturnType<typeof canPerformAction>;
  currentScreen: NavigationScreen;
  setCurrentScreen: (screen: NavigationScreen) => void;
  currentEnvironment: EnvironmentType;
  setCurrentEnvironment: (env: EnvironmentType) => void;
  isWelcomeModalOpen: boolean;
  setIsWelcomeModalOpen: (open: boolean) => void;
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeScenarioId: DemoScenarioId | null;
  launchDemoScenario: (scenarioId: DemoScenarioId) => void;
  resetScenario: (scenarioId: DemoScenarioId) => void;

  // Notifications
  toasts: ToastNotice[];
  notify: (message: string, tone?: ToastNotice['tone']) => void;
  dismissToast: (id: string) => void;

  // Organization & Reference
  organization: Organization;
  updateOrganization: (org: Partial<Organization>) => void;
  facilities: Facility[];
  departments: Department[];

  // Workforce & Readiness
  workers: Worker[];
  assignments: EmploymentAssignment[];
  workerReadinessMap: Record<string, WorkerReadinessSummary>;
  selectedWorkerId: string;
  setSelectedWorkerId: (id: string) => void;
  selectedWorker: Worker;
  openWorkerDossier: (workerId: string, caseId?: string) => void;

  // Policies, Rules & Executable Test Lab
  policies: PolicyDocument[];
  addPolicyDocument: (policy: PolicyDocument) => void;
  rules: RuleDefinition[];
  policyVersions: PolicyVersionRecord[];
  testFixtures: TestFixture[];
  testRuns: TestRun[];
  updateDraftRule: (rule: RuleDefinition) => void;
  runDraftRuleTestLab: (ruleId: string) => TestRun | null;
  submitRuleForApproval: (ruleId: string) => { ok: boolean; message: string };
  approveAndPublishRule: (ruleId: string, notes: string) => { ok: boolean; message: string };
  rejectRuleVersion: (ruleId: string, notes: string) => { ok: boolean; message: string };
  rollbackRuleVersion: (ruleId: string, targetVersion: string) => void;

  // Requirements, Evidence, PSV & Cases
  requirements: CredentialRequirement[];
  evidenceItems: EvidenceItem[];
  verifications: CredentialVerification[];
  cases: ComplianceCase[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  selectedCase: ComplianceCase;
  tasks: RemediationTask[];
  threads: CommunicationThread[];
  uploadedFilePreviews: Record<string, UploadedFilePreview>;

  // Core Interactive Workflows
  approveAndSendOutreach: (
    caseId: string,
    subject: string,
    body: string,
    channel?: 'Simulated Demo Portal' | 'Workday Inbox Check'
  ) => { ok: boolean; message: string };
  submitEmployeePortalResponse: (
    caseId: string,
    payload: EmployeePortalSubmitPayload
  ) => Promise<{ ok: boolean; message: string; trackingId?: string }>;
  runPrimarySourceVerification: (
    caseId: string,
    fixtureOutcome: 'VERIFIED_ACTIVE' | 'RESTRICTED' | 'VERIFICATION_FAILED' | 'UNVERIFIED'
  ) => { ok: boolean; message: string };
  recordClinicalEligibilityDecision: (
    caseId: string,
    decision: ClinicalDutyEligibilityState,
    notes: string
  ) => { ok: boolean; message: string };
  reviewAndCloseCase: (
    caseId: string,
    approved: boolean,
    notes: string
  ) => { ok: boolean; message: string };
  completeNonPSVRequirement: (
    caseId: string,
    notes: string
  ) => { ok: boolean; message: string };

  // Workday Staging Adapter
  connectors: Connector[];
  fieldMappings: FieldMapping[];
  syncTransactions: SyncTransaction[];
  hrmsMirror: Record<string, HRMSMirrorRecord>;
  queueAndSyncWorkdayStaging: (
    caseId: string,
    simulateTimeout504?: boolean
  ) => Promise<SyncTransaction | null>;
  retrySyncTransaction: (
    txId: string,
    simulateTimeout504?: boolean
  ) => Promise<SyncTransaction | null>;
  simulateWorkdayWorkerEvent: (
    type: 'NEW_HIRE' | 'ROLE_TRANSFER',
    workerId?: string
  ) => { ok: boolean; message: string };
  runConnectorSync: (connectorId: string) => Promise<void>;
  updateConnectorStatus: (connectorId: string, status: Connector['status']) => void;

  // Modals & Interactive Portal
  isEmployeePortalOpen: boolean;
  setIsEmployeePortalOpen: (open: boolean) => void;
  isHRMSSyncPayloadModalOpen: boolean;
  setIsHRMSSyncPayloadModalOpen: (open: boolean) => void;

  // Audit & ROI
  auditEvents: AuditEvent[];
  logAuditEvent: (
    event: Omit<AuditEvent, 'eventId' | 'timestamp' | 'isSimulatedDemoEvent' | 'integrityLabel'>
  ) => void;
  roiAssumptions: ROIModelAssumption;
  updateRoiAssumptions: (next: Partial<ROIModelAssumption>) => void;

  // Computed Metrics (Sample-scoped + Honest Labels)
  computedMetrics: {
    sampleWorkersCount: number;
    enterpriseHeadcountContext: number;
    totalApplicableRequirements: number;
    openCasesCount: number;
    criticalCasesCount: number;
    clinicalEscalationsPending: number;
    awaitingEmployeeCount: number;
    pendingPSVCount: number;
    needsReviewCount: number;
    syncFailedCount: number;
    readyWorkersCount: number;
    sampleReadinessPercent: number;
    resolvedCasesCount: number;
    modeledMonthlyHoursSaved: number;
    modeledAnnualCapacityValue: number;
    modeledAnnualCashRealizable: number;
    modeledAnnualNetValue: number;
  };

  // Global Reset
  resetDemoData: () => void;

  // Admin AI Governance Compatibility
  agents: AgentInfo[];
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  selectedAgent: AgentInfo;
  complianceAgentAutonomy: AutonomyLevel;
  setComplianceAgentAutonomy: (level: AutonomyLevel) => void;
  killSwitchState: KillSwitchRecord;
  isKillSwitchModalOpen: boolean;
  setIsKillSwitchModalOpen: (open: boolean) => void;
  triggerKillSwitch: (reason: string) => void;
  resumeAgentFromKillSwitch: () => void;
  traces: AgentTrace[];
  selectedTrace: AgentTrace | null;
  setSelectedTrace: (trace: AgentTrace | null) => void;
  isTraceModalOpen: boolean;
  setIsTraceModalOpen: (open: boolean) => void;
  evalCases: EvalCase[];
  selectedEvalCase: EvalCase | null;
  setSelectedEvalCase: (c: EvalCase | null) => void;
  isEvalModalOpen: boolean;
  setIsEvalModalOpen: (open: boolean) => void;
  workflowNodes: WorkflowNodeData[];
  selectedWorkflowNode: WorkflowNodeData | null;
  setSelectedWorkflowNode: (n: WorkflowNodeData | null) => void;
  isWorkflowDrawerOpen: boolean;
  setIsWorkflowDrawerOpen: (open: boolean) => void;
  versions: AgentVersion[];
  dataSources: {
    workday: boolean;
    sharepoint: boolean;
    docusign: boolean;
    docRepo: boolean;
    email: boolean;
    externalWeb: boolean;
  };
  toggleDataSource: (key: keyof AppContextType['dataSources']) => void;
  isRollbackModalOpen: boolean;
  setIsRollbackModalOpen: (open: boolean) => void;
  rollbackToVersion: (version: string) => void;
  releaseGateApproved: boolean;
  setReleaseGateApproved: (approved: boolean) => void;
  isSandboxRunning: boolean;
  sandboxTestResult: 'idle' | 'running' | 'completed';
  runSandboxTest: (ruleId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getDefaultScreenForRole(roleId: UserRoleId): NavigationScreen {
  switch (roleId) {
    case 'admin_priya':
      return 'rule_test_lab';
    case 'chro_david':
      return 'executive_overview';
    case 'cred_alex':
      return 'credential_verification';
    case 'hr_ops_maya':
    default:
      return 'weekly_overview';
  }
}

function nowTimestampUtc(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Unable to parse saved demo state', e);
    }
    return null;
  };
  const saved = useMemo(() => loadSaved(), []);

  const initialRoleId: UserRoleId =
    saved?.activeRoleId && USER_PERSONAS[saved.activeRoleId as UserRoleId]
      ? (saved.activeRoleId as UserRoleId)
      : 'hr_ops_maya';
  const [activeRoleId, setActiveRoleId] = useState<UserRoleId>(initialRoleId);

  const validScreens = new Set<NavigationScreen>([
    'weekly_overview',
    'employees',
    'employee_records',
    'compliance_cases',
    'credential_verification',
    'tasks',
    'employee_requests',
    'audit_packets',
    'analytics',
    'policy_library',
    'rule_builder',
    'rule_test_lab',
    'rule_versions',
    'ai_governance',
    'command_center',
    'agents',
    'agent_detail',
    'agent_workflows',
    'evals',
    'observability',
    'guardrails',
    'settings',
    'integrations',
    'audit_access',
    'users_roles',
    'audit_logs',
    'executive_overview',
    'risk_by_facility',
    'readiness_trends',
    'pilot_scorecard',
    'business_value'
  ]);
  const initialScreen: NavigationScreen =
    saved?.currentScreen && validScreens.has(saved.currentScreen as NavigationScreen)
      ? (saved.currentScreen as NavigationScreen)
      : getDefaultScreenForRole(initialRoleId);
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>(initialScreen);
  const [currentEnvironment, setCurrentEnvironment] = useState<EnvironmentType>(
    'Demo Sandbox (Simulated)'
  );
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<DemoScenarioId | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const notify = (message: string, tone: ToastNotice['tone'] = 'info') => {
    const id = `TOAST-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5200);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ephemeral file previews (never serialized to localStorage)
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState<
    Record<string, UploadedFilePreview>
  >({});
  const previewsRef = useRef<Record<string, UploadedFilePreview>>({});
  previewsRef.current = uploadedFilePreviews;

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((p) => {
        try {
          URL.revokeObjectURL(p.objectUrl);
        } catch {
          // ignore
        }
      });
    };
  }, []);

  // Core normalized entities
  const [organization, setOrganization] = useState<Organization>(
    saved?.organization || INITIAL_ORGANIZATION
  );
  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [workers, setWorkers] = useState<Worker[]>(saved?.workers || INITIAL_WORKERS);
  const [assignments, setAssignments] = useState<EmploymentAssignment[]>(
    saved?.assignments || INITIAL_ASSIGNMENTS
  );
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    saved?.selectedWorkerId || 'EMP-10419'
  );

  const [policies, setPolicies] = useState<PolicyDocument[]>(saved?.policies || INITIAL_POLICIES);
  const [rules, setRules] = useState<RuleDefinition[]>(saved?.rules || INITIAL_RULES);
  const [policyVersions, setPolicyVersions] = useState<PolicyVersionRecord[]>(
    saved?.policyVersions || INITIAL_POLICY_VERSIONS
  );
  const [testFixtures] = useState<TestFixture[]>(INITIAL_EVAL_FIXTURES);

  // Seed initial test run dynamically against the draft rule so Test Lab immediately reflects real failure on FIX-05
  const [testRuns, setTestRuns] = useState<TestRun[]>(() => {
    if (saved?.testRuns?.length) return saved.testRuns;
    const draftRule = INITIAL_RULES.find((r) => r.id === 'RULE-CA-PHARM-DRAFT');
    return draftRule ? [runRuleEvaluation(draftRule, INITIAL_EVAL_FIXTURES, DEMO_REFERENCE_DATE)] : [];
  });

  const [requirements, setRequirements] = useState<CredentialRequirement[]>(
    saved?.requirements || INITIAL_REQUIREMENTS
  );
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(
    saved?.evidenceItems || INITIAL_EVIDENCE_ITEMS
  );
  const [verifications, setVerifications] = useState<CredentialVerification[]>(
    saved?.verifications || INITIAL_VERIFICATIONS
  );
  const [cases, setCases] = useState<ComplianceCase[]>(
    saved?.cases || INITIAL_COMPLIANCE_CASES
  );
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    saved?.selectedCaseId || 'CASE-9021'
  );
  const [tasks, setTasks] = useState<RemediationTask[]>(
    saved?.tasks || INITIAL_REMEDIATION_TASKS
  );
  const [threads, setThreads] = useState<CommunicationThread[]>(
    saved?.threads || INITIAL_COMMUNICATION_THREADS
  );

  const [connectors, setConnectors] = useState<Connector[]>(
    saved?.connectors || INITIAL_CONNECTORS
  );
  const [fieldMappings] = useState<FieldMapping[]>(INITIAL_FIELD_MAPPINGS);
  const [syncTransactions, setSyncTransactions] = useState<SyncTransaction[]>(
    saved?.syncTransactions || INITIAL_SYNC_TRANSACTIONS
  );
  const [hrmsMirror, setHrmsMirror] = useState<Record<string, HRMSMirrorRecord>>(
    saved?.hrmsMirror || INITIAL_HRMS_MIRROR
  );

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(
    saved?.auditEvents || INITIAL_AUDIT_EVENTS
  );
  const [roiAssumptions, setRoiAssumptions] = useState<ROIModelAssumption>(
    saved?.roiAssumptions || INITIAL_ROI_ASSUMPTIONS
  );

  // Interactive modals
  const [isEmployeePortalOpen, setIsEmployeePortalOpen] = useState(false);
  const [isHRMSSyncPayloadModalOpen, setIsHRMSSyncPayloadModalOpen] = useState(false);

  // Admin AI Governance state
  const [agents, setAgents] = useState<AgentInfo[]>(ADMIN_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('compliance-agent');
  const [complianceAgentAutonomy, setComplianceAgentAutonomy] = useState<AutonomyLevel>(2);
  const [killSwitchState, setKillSwitchState] = useState<KillSwitchRecord>(
    saved?.killSwitchState || { isTriggered: false }
  );
  const [isKillSwitchModalOpen, setIsKillSwitchModalOpen] = useState(false);
  const [traces] = useState<AgentTrace[]>(RECENT_TRACES);
  const [selectedTrace, setSelectedTrace] = useState<AgentTrace | null>(HERO_AGENT_TRACE);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [evalCases] = useState<EvalCase[]>(EVAL_CASES);
  const [selectedEvalCase, setSelectedEvalCase] = useState<EvalCase | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [workflowNodes] = useState<WorkflowNodeData[]>(WORKFLOW_NODES);
  const [selectedWorkflowNode, setSelectedWorkflowNode] = useState<WorkflowNodeData | null>(null);
  const [isWorkflowDrawerOpen, setIsWorkflowDrawerOpen] = useState(false);
  const [versions] = useState<AgentVersion[]>(AGENT_VERSIONS);
  const [dataSources, setDataSources] = useState({
    workday: true,
    sharepoint: true,
    docusign: true,
    docRepo: true,
    email: false,
    externalWeb: false
  });
  const toggleDataSource = (key: keyof AppContextType['dataSources']) => {
    const check = can('CREATE_DRAFT_RULE');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    if (key === 'externalWeb') {
      notify('External Internet Web remains permanently blocked by healthcare data guardrails.', 'error');
      return;
    }
    setDataSources((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const setBoundedComplianceAutonomy = (level: AutonomyLevel) => {
    const check = can('CREATE_DRAFT_RULE');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    if (level >= 3) {
      notify('Autonomy Levels 3 and 4 are prohibited for clinical credentialing and external outreach.', 'error');
      return;
    }
    setComplianceAgentAutonomy(level);
    notify(`Compliance Agent autonomy updated to Level ${level}.`, 'info');
  };
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [releaseGateApproved, setReleaseGateApproved] = useState(false);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxTestResult, setSandboxTestResult] = useState<'idle' | 'running' | 'completed'>(
    'completed'
  );

  // Persist sanitized demo state to localStorage (never raw file bytes)
  useEffect(() => {
    try {
      const payload = {
        activeRoleId,
        currentScreen,
        organization,
        workers,
        assignments,
        selectedWorkerId,
        policies,
        rules,
        policyVersions,
        testRuns,
        requirements,
        evidenceItems,
        verifications,
        cases,
        selectedCaseId,
        tasks,
        threads,
        connectors,
        syncTransactions,
        hrmsMirror,
        auditEvents,
        roiAssumptions,
        killSwitchState
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed saving state to localStorage', e);
    }
  }, [
    activeRoleId,
    currentScreen,
    organization,
    workers,
    assignments,
    selectedWorkerId,
    policies,
    rules,
    policyVersions,
    testRuns,
    requirements,
    evidenceItems,
    verifications,
    cases,
    selectedCaseId,
    tasks,
    threads,
    connectors,
    syncTransactions,
    hrmsMirror,
    auditEvents,
    roiAssumptions,
    killSwitchState
  ]);

  const currentPersona = USER_PERSONAS[activeRoleId] || USER_PERSONAS.hr_ops_maya;

  const can = (
    action: PermissionAction,
    context?: Parameters<typeof canPerformAction>[2]
  ) => {
    return canPerformAction(activeRoleId, action, {
      currentActorName: currentPersona.name,
      ...context
    });
  };

  const logAuditEvent = (
    event: Omit<AuditEvent, 'eventId' | 'timestamp' | 'isSimulatedDemoEvent' | 'integrityLabel'>
  ) => {
    const newEvent: AuditEvent = {
      eventId: `EVT-${Date.now().toString().slice(-6)}`,
      timestamp: nowTimestampUtc(),
      ...event,
      isSimulatedDemoEvent: true,
      integrityLabel: 'Demonstration Event History (browser-local, not tamper-proof)'
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const switchRole = (roleId: UserRoleId, targetScreen?: NavigationScreen) => {
    setActiveRoleId(roleId);
    setCurrentScreen(targetScreen || getDefaultScreenForRole(roleId));
    setIsMobileSidebarOpen(false);
    setIsEmployeePortalOpen(false);
    setIsHRMSSyncPayloadModalOpen(false);
    setIsKillSwitchModalOpen(false);
    setIsRollbackModalOpen(false);
    const persona = USER_PERSONAS[roleId];
    if (persona) {
      notify(`Switched workspace view to ${persona.name} (${persona.roleLabel}).`, 'info');
    }
  };

  const openWorkerDossier = (workerId: string, caseId?: string) => {
    setSelectedWorkerId(workerId);
    if (caseId) {
      setSelectedCaseId(caseId);
    } else {
      const matchingCase = cases.find((c) => c.workerId === workerId && c.workflowState !== 'resolved')
        || cases.find((c) => c.workerId === workerId);
      if (matchingCase) setSelectedCaseId(matchingCase.id);
    }
    setCurrentScreen('employees');
  };

  // Memoized readiness per worker derived strictly from normalized requirements + cases
  const workerReadinessMap = useMemo(() => {
    const map: Record<string, WorkerReadinessSummary> = {};
    for (const w of workers) {
      map[w.id] = computeWorkerReadiness(w, requirements, cases, DEMO_REFERENCE_DATE);
    }
    return map;
  }, [workers, requirements, cases]);

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId) || workers[0];
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const updateOrganization = (org: Partial<Organization>) => {
    setOrganization((prev) => ({ ...prev, ...org }));
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'UPDATE_ORGANIZATION_SETTINGS',
      category: 'POLICY',
      source: 'Compliance Admin Settings',
      targetEntityId: organization.id,
      details: 'Updated organization demo configuration.'
    });
  };

  const addPolicyDocument = (policy: PolicyDocument) => {
    setPolicies((prev) => [policy, ...prev]);
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'ADD_POLICY_DOCUMENT',
      category: 'POLICY',
      source: policy.extractionStatus,
      targetEntityId: policy.id,
      details: `Added policy document "${policy.name}" (${policy.version}) — ${policy.extractionStatus}.`
    });
    notify(`Policy document "${policy.name}" added to Policy Library.`, 'success');
  };

  const updateDraftRule = (updated: RuleDefinition) => {
    const check = can('CREATE_DRAFT_RULE');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'UPDATE_DRAFT_RULE_PARAMETERS',
      category: 'POLICY',
      source: 'Rule Builder',
      targetEntityId: updated.id,
      details: `Modified rule ${updated.ruleCode} (${updated.version}). Re-test required before approval.`
    });
  };

  const runDraftRuleTestLab = (ruleId: string): TestRun | null => {
    const check = can('RUN_RULE_SANDBOX_EVAL');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return null;
    }
    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return null;

    const run = runRuleEvaluation(targetRule, testFixtures, DEMO_REFERENCE_DATE);
    setTestRuns((prev) => [run, ...prev]);

    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              status: run.gatePassed ? 'Tested' : 'Draft'
            }
          : r
      )
    );

    setPolicyVersions((prev) =>
      prev.map((pv) =>
        pv.ruleId === ruleId && pv.version === targetRule.version
          ? {
              ...pv,
              lastTestRunId: run.runId,
              testSummary: `${run.passedCount}/${run.totalFixtures} fixtures passed · Gate ${
                run.gatePassed ? 'CLEARED' : 'BLOCKED'
              }`
            }
          : pv
      )
    );

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'RUN_SANDBOX_RULE_TEST_LAB',
      category: 'POLICY',
      source: 'Executable Rule Test Lab',
      targetEntityId: ruleId,
      beforeState: targetRule.status,
      afterState: run.gatePassed ? 'Tested (Gate Cleared)' : 'Draft (Gate Blocked)',
      details: `Executed ${run.totalFixtures} fixtures for ${targetRule.ruleCode}: ${run.passedCount}/${run.totalFixtures} passed.${
        run.gatePassed ? '' : ` Block reasons: ${run.gateBlockReasons.join(' ')}`
      }`
    });

    if (run.gatePassed) {
      notify(
        `Test Lab passed (${run.passedCount}/${run.totalFixtures}). Rule is eligible for independent approval.`,
        'success'
      );
    } else {
      notify(
        `Test Lab blocked release (${run.failedCount} fixture failure). Review diagnostics below.`,
        'warning'
      );
    }

    return run;
  };

  const submitRuleForApproval = (ruleId: string): { ok: boolean; message: string } => {
    const check = can('SUBMIT_RULE_FOR_APPROVAL');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return { ok: false, message: check.reason };
    }

    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return { ok: false, message: 'Rule not found.' };

    const currentHash = computeRuleSnapshotHash(targetRule);
    const matchingRun = testRuns.find(
      (tr) => tr.ruleId === ruleId && tr.ruleSnapshotHash === currentHash
    );

    if (!matchingRun) {
      const msg =
        'Stale or missing test run: Rule parameters changed since the last sandbox run. Run Test Lab before submitting.';
      notify(msg, 'warning');
      return { ok: false, message: msg };
    }
    if (!matchingRun.gatePassed) {
      const msg = `Submission blocked: Latest sandbox run has ${matchingRun.failedCount} failing fixture(s).`;
      notify(msg, 'error');
      return { ok: false, message: msg };
    }

    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, status: 'Pending Approval' } : r))
    );
    setPolicyVersions((prev) =>
      prev.map((pv) =>
        pv.ruleId === ruleId && pv.version === targetRule.version
          ? { ...pv, status: 'Pending Approval' }
          : pv
      )
    );

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'SUBMIT_RULE_FOR_INDEPENDENT_APPROVAL',
      category: 'POLICY',
      source: 'Policy Governance Workflow',
      targetEntityId: ruleId,
      beforeState: 'Tested',
      afterState: 'Pending Approval',
      details: `Submitted ${targetRule.ruleCode} (${targetRule.version}) after ${matchingRun.passedCount}/${matchingRun.totalFixtures} fixture pass. Awaiting independent reviewer (Alex Morgan).`
    });

    notify(
      `Submitted ${targetRule.ruleCode} (${targetRule.version}) for independent approval. Switch to Alex Morgan to approve.`,
      'success'
    );
    return { ok: true, message: 'Submitted for independent approval.' };
  };

  const approveAndPublishRule = (
    ruleId: string,
    notes: string
  ): { ok: boolean; message: string } => {
    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return { ok: false, message: 'Rule not found.' };

    const check = can('APPROVE_RULE_PUBLICATION', {
      ruleAuthorName: targetRule.author
    });
    if (!check.allowed) {
      notify(check.reason, 'error');
      return { ok: false, message: check.reason };
    }

    const currentHash = computeRuleSnapshotHash(targetRule);
    const matchingRun = testRuns.find(
      (tr) => tr.ruleId === ruleId && tr.ruleSnapshotHash === currentHash && tr.gatePassed
    );
    if (!matchingRun) {
      const msg =
        'Publication blocked: Rule must pass all Test Lab fixtures on the exact current snapshot before approval.';
      notify(msg, 'error');
      return { ok: false, message: msg };
    }

    const now = nowTimestampUtc();
    const publishedVersion = targetRule.version.replace('-draft', '');

    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              version: publishedVersion,
              status: 'Published',
              approver: `${currentPersona.name} (${currentPersona.roleLabel})`,
              approvedAt: now,
              approvalNotes: notes
            }
          : r
      )
    );

    setPolicyVersions((prev) => [
      ...prev.map((pv) =>
        pv.ruleId === ruleId && pv.version === targetRule.version
          ? {
              ...pv,
              version: publishedVersion,
              status: 'Published' as const,
              approver: `${currentPersona.name} (${currentPersona.roleLabel})`,
              approvedAt: now,
              approvalNotes: notes
            }
          : pv.ruleCode === 'LIC-CA-RPH' && pv.status === 'Published'
          ? { ...pv, status: 'Superseded' as const }
          : pv
      )
    ]);

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'APPROVE_AND_PUBLISH_RULE_VERSION',
      category: 'POLICY',
      source: 'Policy Governance Gate',
      targetEntityId: ruleId,
      beforeState: 'Pending Approval',
      afterState: `Published (${publishedVersion})`,
      details: `Independent reviewer ${currentPersona.name} approved and published ${targetRule.ruleCode} ${publishedVersion} (author: ${targetRule.author}). Notes: ${notes}`
    });

    notify(`Published ${targetRule.ruleCode} ${publishedVersion} with independent sign-off.`, 'success');
    return { ok: true, message: `Published ${publishedVersion}.` };
  };

  const rejectRuleVersion = (
    ruleId: string,
    notes: string
  ): { ok: boolean; message: string } => {
    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return { ok: false, message: 'Rule not found.' };

    const check = can('APPROVE_RULE_PUBLICATION', {
      ruleAuthorName: targetRule.author
    });
    if (!check.allowed) {
      notify(check.reason, 'error');
      return { ok: false, message: check.reason };
    }

    const now = nowTimestampUtc();
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              status: 'Draft',
              approvalNotes: `Returned to Draft by ${currentPersona.name} (${now}): ${notes}`
            }
          : r
      )
    );
    setPolicyVersions((prev) =>
      prev.map((pv) =>
        pv.ruleId === ruleId && pv.version === targetRule.version
          ? {
              ...pv,
              status: 'Draft',
              approvalNotes: `Returned to Draft by ${currentPersona.name}: ${notes}`
            }
          : pv
      )
    );
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'RETURN_RULE_TO_DRAFT',
      category: 'POLICY',
      source: 'Policy Governance Gate',
      targetEntityId: ruleId,
      beforeState: 'Pending Approval',
      afterState: 'Draft',
      details: `Independent reviewer ${currentPersona.name} returned ${targetRule.ruleCode} (${targetRule.version}) to Draft. Reason: ${notes}`
    });
    notify(`Returned ${targetRule.ruleCode} (${targetRule.version}) to Draft with review notes.`, 'warning');
    return { ok: true, message: 'Returned to Draft.' };
  };

  const rollbackRuleVersion = (ruleId: string, targetVersion: string) => {
    const check = can('CREATE_DRAFT_RULE');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, version: targetVersion, status: 'Published' } : r
      )
    );
    setPolicyVersions((prev) =>
      prev.map((pv) =>
        pv.ruleId === ruleId
          ? {
              ...pv,
              status: pv.version === targetVersion ? 'Published' : 'Superseded'
            }
          : pv
      )
    );
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'ROLLBACK_RULE_VERSION',
      category: 'POLICY',
      source: 'Rule Version Governance',
      targetEntityId: ruleId,
      afterState: `Published (${targetVersion})`,
      details: `Rolled back rule ${ruleId} to version ${targetVersion}.`
    });
    notify(`Rolled back rule to version ${targetVersion}.`, 'warning');
  };

  // WORKFLOW 1: Maya sends employee outreach
  const approveAndSendOutreach = (
    caseId: string,
    subject: string,
    body: string,
    channel: 'Simulated Demo Portal' | 'Workday Inbox Check' = 'Simulated Demo Portal'
  ): { ok: boolean; message: string } => {
    if (killSwitchState.isTriggered) {
      const msg = 'Action blocked: Emergency AI Kill Switch is active. Resume controls in AI Governance.';
      notify(msg, 'error');
      return { ok: false, message: msg };
    }

    const check = can('SEND_EMPLOYEE_OUTREACH');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return { ok: false, message: check.reason };
    }

    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return { ok: false, message: 'Case not found.' };

    const timestamp = nowTimestampUtc();

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              workflowState: 'evidence_requested',
              documentState: c.documentState === 'REJECTED' || c.documentState === 'MISSING' ? 'REQUESTED' : c.documentState
            }
          : c
      )
    );

    setRequirements((prev) =>
      prev.map((req) =>
        req.requirementId === targetCase.requirementId
          ? {
              ...req,
              documentState:
                req.documentState === 'REJECTED' || req.documentState === 'MISSING'
                  ? 'REQUESTED'
                  : req.documentState
            }
          : req
      )
    );

    setTasks((prev) =>
      prev.map((t) => (t.caseId === caseId ? { ...t, status: 'IN_PROGRESS' } : t))
    );

    setThreads((prev) => {
      const existing = prev.find((th) => th.caseId === caseId);
      const outboundMsg = {
        id: `MSG-${Date.now()}`,
        senderType: 'HR_OPERATIONS' as const,
        senderName: currentPersona.name,
        senderRole: currentPersona.roleLabel,
        timestamp,
        channel,
        subject,
        content: body,
        deliveryStatus: 'Simulated Delivered' as const
      };
      if (existing) {
        return prev.map((th) =>
          th.caseId === caseId ? { ...th, subject, messages: [...th.messages, outboundMsg] } : th
        );
      }
      return [
        ...prev,
        {
          id: `THR-${Date.now()}`,
          caseId,
          workerId: targetCase.workerId,
          subject,
          messages: [outboundMsg]
        }
      ];
    });

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'SEND_EMPLOYEE_OUTREACH',
      category: 'OUTREACH',
      source: channel,
      targetEntityId: caseId,
      workerId: targetCase.workerId,
      beforeState: targetCase.workflowState,
      afterState: 'evidence_requested',
      details: `Dispatched simulated employee outreach to ${targetCase.workerName} via ${channel}.`
    });

    notify(`Simulated outreach sent to ${targetCase.workerName}. Employee portal ready for response.`, 'success');
    return { ok: true, message: 'Outreach sent.' };
  };

  // WORKFLOW 2: Simulated Employee Portal Submission (Upload NEVER equals PSV!)
  const submitEmployeePortalResponse = async (
    caseId: string,
    payload: EmployeePortalSubmitPayload
  ): Promise<{ ok: boolean; message: string; trackingId?: string }> => {
    const targetCase = cases.find((c) => c.id === caseId);
    const targetReq = requirements.find((r) => r.requirementId === targetCase?.requirementId);
    if (!targetCase || !targetReq) {
      return { ok: false, message: 'Case or requirement not found.' };
    }

    const timestamp = nowTimestampUtc();
    const evId = `EV-${Date.now().toString().slice(-6)}`;

    if (payload.mode === 'reply_question') {
      if (!payload.note.trim()) {
        const msg = 'Please enter a message before sending your reply.';
        notify(msg, 'warning');
        return { ok: false, message: msg };
      }
      const msgId = `MSG-EMP-${Date.now()}`;
      setThreads((prev) => {
        const exists = prev.some((th) => th.caseId === caseId);
        const msgObj = {
          id: msgId,
          senderType: 'EMPLOYEE' as const,
          senderName: targetCase.workerName,
          senderRole: 'Employee (Simulated Portal)',
          timestamp,
          channel: 'Simulated Demo Portal' as const,
          content: payload.note,
          deliveryStatus: 'Employee Replied' as const
        };
        if (!exists) {
          return [
            ...prev,
            {
              id: `THR-${Date.now()}`,
              caseId,
              workerId: targetCase.workerId,
              subject: `Re: ${targetCase.title}`,
              messages: [msgObj]
            }
          ];
        }
        return prev.map((th) =>
          th.caseId === caseId ? { ...th, messages: [...th.messages, msgObj] } : th
        );
      });
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, workflowState: 'employee_responded' } : c
        )
      );
      logAuditEvent({
        actor: targetCase.workerName,
        actorRole: 'Employee (Simulated Portal)',
        action: 'EMPLOYEE_PORTAL_QUESTION_REPLY',
        category: 'EVIDENCE',
        source: 'Simulated Employee Portal',
        targetEntityId: caseId,
        workerId: targetCase.workerId,
        details: `Employee replied in portal: "${payload.note}"`
      });
      notify(`Employee reply recorded for ${targetCase.workerName}.`, 'info');
      return { ok: true, message: 'Reply recorded.', trackingId: msgId };
    }

    if (payload.mode === 'already_submitted_workday') {
      const msgId = `MSG-EMP-${Date.now()}`;
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                workflowState: 'employee_responded',
                externalSyncState: 'RECONCILIATION_REQUIRED',
                documentState: 'REVIEW_REQUIRED'
              }
            : c
        )
      );
      setThreads((prev) => {
        const msg = {
          id: msgId,
          senderType: 'EMPLOYEE' as const,
          senderName: targetCase.workerName,
          senderRole: 'Employee (Simulated Portal)',
          timestamp,
          channel: 'Simulated Demo Portal' as const,
          content:
            payload.note ||
            'I already submitted this documentation directly in Workday earlier this week. Please re-check Workday inbox.',
          deliveryStatus: 'Employee Replied' as const
        };
        const exists = prev.some((t) => t.caseId === caseId);
        if (!exists) {
          return [
            ...prev,
            {
              id: `THR-${Date.now()}`,
              caseId,
              workerId: targetCase.workerId,
              subject: `Re: ${targetCase.title}`,
              messages: [msg]
            }
          ];
        }
        return prev.map((th) =>
          th.caseId === caseId ? { ...th, messages: [...th.messages, msg] } : th
        );
      });
      logAuditEvent({
        actor: targetCase.workerName,
        actorRole: 'Employee (Simulated Portal)',
        action: 'EMPLOYEE_REPORTED_PRIOR_WORKDAY_SUBMISSION',
        category: 'WORKDAY_SYNC',
        source: 'Simulated Employee Portal',
        targetEntityId: caseId,
        workerId: targetCase.workerId,
        afterState: 'RECONCILIATION_REQUIRED',
        details: `Employee reported prior Workday submission. Case flagged for HR Workday Inbox reconciliation.`
      });
      notify(
        `${targetCase.workerName} reported prior Workday submission — flagged for Workday Inbox check.`,
        'warning'
      );
      return { ok: true, message: 'Flagged for Workday reconciliation.', trackingId: msgId };
    }

    // Actual uploaded file validation
    const file = payload.file;
    if (payload.mode === 'file') {
      if (!file) {
        const msg = 'Please select a file (.pdf, .jpg, .jpeg, .png, or .txt) before submitting.';
        notify(msg, 'warning');
        return { ok: false, message: msg };
      }
      const allowedExt = /\.(pdf|jpe?g|png|txt)$/i;
      if (!allowedExt.test(file.name)) {
        const msg = 'Unsupported file format. Allowed formats: PDF, JPG, PNG, or TXT.';
        notify(msg, 'error');
        return { ok: false, message: msg };
      }
      if (file.size > 5 * 1024 * 1024) {
        const msg = 'File exceeds 5 MB demo upload limit.';
        notify(msg, 'error');
        return { ok: false, message: msg };
      }
    }

    const fileName =
      file?.name ||
      payload.fileName ||
      (targetCase.workerId === 'EMP-10419'
        ? 'Daniel_Kim_CA_Pharmacist_Renewal_2028.pdf'
        : `${targetCase.workerName.replace(/\s+/g, '_')}_Credential_Submission.pdf`);
    const fileSize = file
      ? `${Math.max(1, Math.round(file.size / 1024))} KB`
      : payload.fileSize || '342 KB';
    const mimeType = file?.type || payload.mimeType || 'application/pdf';
    const isTxt = Boolean(file && (mimeType.startsWith('text/') || file.name.toLowerCase().endsWith('.txt')));

    if (file) {
      let textSnippet: string | undefined;
      if (isTxt) {
        try {
          textSnippet = (await file.text()).slice(0, 500);
        } catch {
          textSnippet = undefined;
        }
      }
      const objectUrl = URL.createObjectURL(file);
      setUploadedFilePreviews((prev) => ({
        ...prev,
        [evId]: { evidenceId: evId, objectUrl, fileName, mimeType, textSnippet }
      }));
    }

    const isActualBrowserFile = Boolean(file);
    const extractionMethodNote = isActualBrowserFile
      ? isTxt
        ? 'Browser text file previewed locally; fields require manual reviewer inspection.'
        : 'Upload received; structured extraction unavailable in this browser demo; manual review required.'
      : 'Simulated 1-click demo document fixture — requires Primary Source Verification before licensure closure.';

    const newEvidence: EvidenceItem = {
      id: evId,
      workerId: targetCase.workerId,
      requirementId: targetReq.requirementId,
      documentName: fileName,
      documentType: targetReq.name,
      sourceSystem: 'Employee Portal',
      sourceUri: `portal://demo-submissions/${targetCase.workerId}/${fileName}`,
      uploadedAt: timestamp,
      asOfTimestamp: timestamp,
      expirationDate: payload.expirationDate || '2028-09-15',
      licenseNumber:
        payload.licenseNumber ||
        (targetCase.workerId === 'EMP-10419' ? 'RPH-84920' : 'SUB-DEMO-01'),
      issuingJurisdiction: targetCase.state,
      extractionConfidence: isActualBrowserFile ? 75 : 94,
      extractionMethodNote,
      fileSize,
      mimeType,
      status: 'REVIEW_REQUIRED',
      extractedFields: [
        {
          label: 'Submitted File',
          value: fileName,
          confidence: 100,
          sourceNotice: 'Browser file metadata'
        },
        {
          label: 'Claimed Expiration',
          value: payload.expirationDate || '2028-09-15',
          confidence: isActualBrowserFile ? 75 : 94,
          sourceNotice: isActualBrowserFile
            ? 'Manual review required (no server-side OCR)'
            : 'Simulated fixture field — NOT verified against board'
        }
      ]
    };

    const { updatedCase, updatedRequirement } = applyEmployeeSubmissionToCase(
      targetCase,
      targetReq,
      newEvidence
    );

    setEvidenceItems((prev) => [newEvidence, ...prev]);
    setCases((prev) => prev.map((c) => (c.id === caseId ? updatedCase : c)));
    setRequirements((prev) =>
      prev.map((r) => (r.requirementId === targetReq.requirementId ? updatedRequirement : r))
    );

    setThreads((prev) => {
      const msg = {
        id: `MSG-EMP-${Date.now()}`,
        senderType: 'EMPLOYEE' as const,
        senderName: targetCase.workerName,
        senderRole: 'Employee (Simulated Portal)',
        timestamp,
        channel: 'Simulated Demo Portal' as const,
        content:
          payload.note ||
          `Submitted renewal document "${fileName}" for review.`,
        deliveryStatus: 'Employee Replied' as const,
        attachmentMetadata: {
          fileName,
          fileSize,
          mimeType,
          extractionStatusLabel:
            targetReq.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION'
              ? 'Received — Pending Primary Source Verification'
              : 'Received — Pending HR Review'
        }
      };
      const exists = prev.some((th) => th.caseId === caseId);
      if (!exists) {
        return [
          ...prev,
          {
            id: `THR-${Date.now()}`,
            caseId,
            workerId: targetCase.workerId,
            subject: `Re: ${targetCase.title}`,
            messages: [msg]
          }
        ];
      }
      return prev.map((th) =>
        th.caseId === caseId ? { ...th, messages: [...th.messages, msg] } : th
      );
    });

    logAuditEvent({
      actor: targetCase.workerName,
      actorRole: 'Employee (Simulated Portal)',
      action: 'SUBMIT_EVIDENCE_VIA_PORTAL',
      category: 'EVIDENCE',
      source: 'Simulated Employee Portal',
      targetEntityId: caseId,
      workerId: targetCase.workerId,
      beforeState: targetCase.documentState,
      afterState: `${updatedCase.documentState} / PSV: ${updatedCase.verificationState}`,
      details: `Received "${fileName}" (${fileSize}). Document marked REVIEW_REQUIRED; verification remains ${updatedCase.verificationState} (upload does not verify licensure).`
    });

    notify(
      targetReq.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION'
        ? `File received (${fileName}). PSV remains PENDING_SOURCE_CHECK — switch to Alex Morgan to run board check.`
        : `File received (${fileName}). Ready for HR review.`,
      'info'
    );
    return { ok: true, message: 'Submission recorded.', trackingId: evId };
  };

  // WORKFLOW 3: Alex Morgan runs Simulated Primary Source Verification
  const runPrimarySourceVerification = (
    caseId: string,
    fixtureOutcome: 'VERIFIED_ACTIVE' | 'RESTRICTED' | 'VERIFICATION_FAILED' | 'UNVERIFIED'
  ): { ok: boolean; message: string } => {
    const targetCase = cases.find((c) => c.id === caseId);
    const targetReq = requirements.find((r) => r.requirementId === targetCase?.requirementId);
    if (!targetCase || !targetReq) {
      return { ok: false, message: 'Case or requirement not found.' };
    }

    const now = nowTimestampUtc();
    const verifId = `PSV-${Date.now().toString().slice(-6)}`;
    const latestEvidence = evidenceItems.find(
      (e) => e.requirementId === targetReq.requirementId
    );

    const newVerification: CredentialVerification = {
      id: verifId,
      workerId: targetCase.workerId,
      requirementId: targetReq.requirementId,
      evidenceItemId: latestEvidence?.id,
      method: 'PRIMARY_SOURCE_VERIFICATION',
      sourceName: `${targetCase.state} Licensing Board Roster (Simulated Demo Fixture)`,
      sourceTypeLabel: 'Simulated Board Fixture (Demo Only — No Live API Call)',
      licenseNumberChecked: latestEvidence?.licenseNumber || '#RPH-84920',
      employeeNameMatched: fixtureOutcome !== 'UNVERIFIED',
      returnedStatus: fixtureOutcome,
      restrictionsNote:
        fixtureOutcome === 'RESTRICTED'
          ? 'Simulated Fixture: Board disciplinary suspension / practice restriction reported.'
          : fixtureOutcome === 'VERIFICATION_FAILED'
          ? 'Simulated Fixture: External board lookup endpoint timed out (503). Manual retry required.'
          : undefined,
      expirationDate: fixtureOutcome === 'VERIFIED_ACTIVE' ? '2028-09-15' : latestEvidence?.expirationDate,
      checkedAt: now,
      verifierName: currentPersona.name,
      verifierRole: currentPersona.roleLabel,
      receiptReference: `SIM-PSV-${Date.now().toString().slice(-6)}`,
      isSimulated: true
    };

    const result = applyPrimarySourceVerificationResult(
      activeRoleId,
      targetCase,
      targetReq,
      newVerification
    );

    if (!result.valid || !result.updatedCase || !result.updatedRequirement) {
      notify(result.error || 'PSV execution blocked.', 'error');
      return { ok: false, message: result.error || 'PSV blocked.' };
    }

    setVerifications((prev) => [newVerification, ...prev]);
    setCases((prev) => prev.map((c) => (c.id === caseId ? result.updatedCase! : c)));
    setRequirements((prev) =>
      prev.map((r) =>
        r.requirementId === targetReq.requirementId ? result.updatedRequirement! : r
      )
    );

    if (fixtureOutcome === 'RESTRICTED') {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === targetCase.workerId
            ? { ...w, clinicalEligibility: 'REVIEW_REQUIRED' }
            : w
        )
      );
    }

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: `RUN_SIMULATED_PSV_${fixtureOutcome}`,
      category: 'PSV_CHECK',
      source: newVerification.sourceName,
      targetEntityId: caseId,
      workerId: targetCase.workerId,
      beforeState: targetCase.verificationState,
      afterState: fixtureOutcome,
      details: `Simulated PSV returned ${fixtureOutcome} (Receipt ${newVerification.receiptReference}).${
        fixtureOutcome === 'RESTRICTED'
          ? ' Escalated to clinical leadership; case closure blocked.'
          : ''
      }`
    });

    notify(
      fixtureOutcome === 'VERIFIED_ACTIVE'
        ? `Simulated PSV passed (VERIFIED_ACTIVE · ${newVerification.receiptReference}).`
        : `Simulated PSV returned ${fixtureOutcome}. Closure remains blocked.`,
      fixtureOutcome === 'VERIFIED_ACTIVE' ? 'success' : 'error'
    );
    return { ok: true, message: `PSV recorded as ${fixtureOutcome}.` };
  };

  // WORKFLOW 4: Authorized Clinical Duty Eligibility Decision (Alex / Clinical Leader simulation only)
  const recordClinicalEligibilityDecision = (
    caseId: string,
    decision: ClinicalDutyEligibilityState,
    notes: string
  ): { ok: boolean; message: string } => {
    const check = can('RECORD_CLINICAL_DUTY_ELIGIBILITY');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return { ok: false, message: check.reason };
    }

    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return { ok: false, message: 'Case not found.' };

    const now = nowTimestampUtc();

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === targetCase.workerId
          ? {
              ...w,
              clinicalEligibility: decision,
              clinicalEligibilityDecisionBy: `${currentPersona.name} (Simulated Clinical Leader Sign-off)`,
              clinicalEligibilityDecisionAt: now,
              clinicalEligibilityNotes: notes
            }
          : w
      )
    );

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              clinicalEligibilityState: decision,
              escalation: c.escalation
                ? {
                    ...c.escalation,
                    status: 'DECISION_RECORDED',
                    acknowledgedBy: currentPersona.name,
                    acknowledgedAt: now,
                    decisionRecorded: decision,
                    decisionNotes: notes
                  }
                : undefined,
              reviewDecisions: [
                ...c.reviewDecisions,
                {
                  id: `DEC-${Date.now().toString().slice(-5)}`,
                  caseId,
                  actorName: currentPersona.name,
                  actorRole: 'Credentialing / Clinical Leader Sign-off (Demo)',
                  decision:
                    decision === 'AUTHORIZED_BY_DESIGNATED_LEADER' ? 'APPROVED' : 'ESCALATED',
                  notes,
                  method: 'Designated Clinical Eligibility Decision',
                  sourceRef: 'Clinical Leadership Review Panel',
                  timestamp: now
                }
              ]
            }
          : c
      )
    );

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: 'Credentialing / Clinical Leader Sign-off (Demo)',
      action: 'RECORD_CLINICAL_DUTY_ELIGIBILITY',
      category: 'CLINICAL_ELIGIBILITY',
      source: 'Clinical Leadership Decision Panel',
      targetEntityId: caseId,
      workerId: targetCase.workerId,
      beforeState: targetCase.clinicalEligibilityState,
      afterState: decision,
      details: `Recorded clinical duty eligibility as ${decision}. Notes: ${notes}`
    });

    notify(`Clinical duty eligibility updated to ${decision}.`, 'success');
    return { ok: true, message: 'Clinical eligibility recorded.' };
  };

  // WORKFLOW 5: Maya closes verified administrative case (ONLY this requirement; multi-requirement score stays accurate!)
  const reviewAndCloseCase = (
    caseId: string,
    approved: boolean,
    notes: string
  ): { ok: boolean; message: string } => {
    const targetCase = cases.find((c) => c.id === caseId);
    const targetWorker = workers.find((w) => w.id === targetCase?.workerId);
    const targetRule = rules.find((r) => r.id === targetCase?.ruleId);

    if (!targetCase || !targetWorker) {
      return { ok: false, message: 'Case or worker not found.' };
    }

    const now = nowTimestampUtc();

    if (!approved) {
      const check = can('REVIEW_ORDINARY_HR_EVIDENCE');
      if (!check.allowed) {
        notify(check.reason, 'error');
        return { ok: false, message: check.reason };
      }

      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                documentState: 'REJECTED',
                workflowState: 'evidence_requested',
                reviewDecisions: [
                  ...c.reviewDecisions,
                  {
                    id: `DEC-${Date.now().toString().slice(-5)}`,
                    caseId,
                    actorName: currentPersona.name,
                    actorRole: currentPersona.roleLabel,
                    decision: 'REJECTED',
                    notes,
                    method: 'HR Evidence Review',
                    sourceRef: 'Employee Dossier',
                    timestamp: now
                  }
                ]
              }
            : c
        )
      );
      setRequirements((prev) =>
        prev.map((r) =>
          r.requirementId === targetCase.requirementId
            ? { ...r, documentState: 'REJECTED' }
            : r
        )
      );
      logAuditEvent({
        actor: currentPersona.name,
        actorRole: currentPersona.roleLabel,
        action: 'REJECT_EVIDENCE_AND_REOPEN_REQUEST',
        category: 'CASE',
        source: 'HR Evidence Review',
        targetEntityId: caseId,
        workerId: targetCase.workerId,
        afterState: 'REJECTED / evidence_requested',
        details: `Rejected evidence for ${targetCase.workerName}: ${notes}`
      });
      notify(`Evidence rejected for ${targetCase.workerName}. Re-request triggered.`, 'warning');
      return { ok: true, message: 'Evidence rejected.' };
    }

    const validation = validateCaseClosure(activeRoleId, targetCase, targetRule, targetWorker);
    if (!validation.valid) {
      notify(validation.error || 'Closure blocked.', 'error');
      return { ok: false, message: validation.error || 'Closure blocked.' };
    }

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              documentState: 'ACCEPTED',
              workflowState: 'resolved',
              externalSyncState: 'QUEUED',
              resolvedAt: now,
              resolvedBy: currentPersona.name,
              reviewDecisions: [
                ...c.reviewDecisions,
                {
                  id: `DEC-${Date.now().toString().slice(-5)}`,
                  caseId,
                  actorName: currentPersona.name,
                  actorRole: currentPersona.roleLabel,
                  decision: 'APPROVED',
                  notes,
                  method: 'Administrative Case Closure',
                  sourceRef: targetCase.verificationState,
                  timestamp: now
                }
              ]
            }
          : c
      )
    );

    setRequirements((prev) =>
      prev.map((r) =>
        r.requirementId === targetCase.requirementId
          ? { ...r, documentState: 'ACCEPTED', lastEvaluatedAt: DEMO_REFERENCE_DATE }
          : r
      )
    );

    setEvidenceItems((prev) =>
      prev.map((ev) =>
        ev.requirementId === targetCase.requirementId && ev.status === 'REVIEW_REQUIRED'
          ? { ...ev, status: 'ACCEPTED' }
          : ev
      )
    );

    setTasks((prev) =>
      prev.map((t) => (t.caseId === caseId ? { ...t, status: 'COMPLETED' } : t))
    );

    const otherOpenCases = cases.filter(
      (c) => c.workerId === targetCase.workerId && c.id !== caseId && c.workflowState !== 'resolved'
    );

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'CLOSE_ADMINISTRATIVE_CASE',
      category: 'CASE',
      source: 'HR Case Closure Gate',
      targetEntityId: caseId,
      workerId: targetCase.workerId,
      beforeState: targetCase.workflowState,
      afterState: 'resolved',
      details: `Closed ${targetCase.caseNumber} for ${targetCase.workerName}. ${
        otherOpenCases.length > 0
          ? `Note: ${otherOpenCases.length} other requirement case(s) remain open for this worker.`
          : 'All applicable requirements for worker are now satisfied.'
      }`
    });

    notify(
      otherOpenCases.length > 0
        ? `Closed ${targetCase.caseNumber}. Worker remains Amber because ${otherOpenCases.length} other requirement(s) remain open.`
        : `Closed ${targetCase.caseNumber}. All applicable worker requirements are now Ready.`,
      'success'
    );

    return { ok: true, message: 'Case closed.' };
  };

  // Non-PSV completion (e.g., Daniel Kim CASE-9022 GCP training, Elena BLS, Kevin Workday reconciliation)
  const completeNonPSVRequirement = (
    caseId: string,
    notes: string
  ): { ok: boolean; message: string } => {
    const check = can('REVIEW_ORDINARY_HR_EVIDENCE');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return { ok: false, message: check.reason };
    }
    const targetCase = cases.find((c) => c.id === caseId);
    const targetReq = requirements.find((r) => r.requirementId === targetCase?.requirementId);
    if (!targetCase || !targetReq) {
      return { ok: false, message: 'Case not found.' };
    }
    if (targetReq.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION') {
      const msg =
        'Blocked: Primary Source Verification credentials cannot be completed through ordinary HR training/roster review.';
      notify(msg, 'error');
      return { ok: false, message: msg };
    }

    const now = nowTimestampUtc();
    const evId = `EV-NONPSV-${Date.now().toString().slice(-5)}`;

    const newEvidence: EvidenceItem = {
      id: evId,
      workerId: targetCase.workerId,
      requirementId: targetReq.requirementId,
      documentName: `${targetReq.ruleCode}_Verified_Roster_Record.pdf`,
      documentType: targetReq.name,
      sourceSystem: 'LMS',
      sourceUri: `lms://roster-confirmed/${targetCase.workerId}/${targetReq.ruleCode}`,
      uploadedAt: now,
      asOfTimestamp: now,
      expirationDate: '2027-11-12',
      extractionConfidence: 99,
      extractionMethodNote: 'HR confirmed organizational training/roster record.',
      fileSize: '128 KB',
      mimeType: 'application/pdf',
      status: 'ACCEPTED',
      extractedFields: [
        {
          label: 'Verification Basis',
          value: targetReq.verificationMethod,
          confidence: 99,
          sourceNotice: 'Approved organizational record'
        }
      ]
    };

    setEvidenceItems((prev) => [newEvidence, ...prev]);
    setRequirements((prev) =>
      prev.map((r) =>
        r.requirementId === targetReq.requirementId
          ? {
              ...r,
              documentState: 'ACCEPTED',
              verificationState: 'NOT_REQUIRED',
              evidenceItemId: evId,
              lastEvaluatedAt: DEMO_REFERENCE_DATE
            }
          : r
      )
    );
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              documentState: 'ACCEPTED',
              workflowState: 'resolved',
              externalSyncState: 'QUEUED',
              resolvedAt: now,
              resolvedBy: currentPersona.name,
              reviewDecisions: [
                ...c.reviewDecisions,
                {
                  id: `DEC-${Date.now().toString().slice(-5)}`,
                  caseId,
                  actorName: currentPersona.name,
                  actorRole: currentPersona.roleLabel,
                  decision: 'APPROVED',
                  notes,
                  method: targetReq.verificationMethod,
                  sourceRef: 'Organizational Training / Workday Roster',
                  timestamp: now
                }
              ]
            }
          : c
      )
    );
    setTasks((prev) =>
      prev.map((t) => (t.caseId === caseId ? { ...t, status: 'COMPLETED' } : t))
    );

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'COMPLETE_NON_PSV_REQUIREMENT',
      category: 'CASE',
      source: 'Organizational Roster / LMS',
      targetEntityId: caseId,
      workerId: targetCase.workerId,
      beforeState: targetCase.workflowState,
      afterState: 'resolved',
      details: `Resolved non-PSV case ${targetCase.caseNumber}: ${notes}`
    });

    notify(`Resolved ${targetCase.caseNumber} (${targetCase.title}).`, 'success');
    return { ok: true, message: 'Resolved.' };
  };

  // WORKFLOW 6: Outbound Workday Staging Sync & Scoped Retry
  const queueAndSyncWorkdayStaging = async (
    caseId: string,
    simulateTimeout504 = false
  ): Promise<SyncTransaction | null> => {
    const check = can('TRIGGER_WORKDAY_SYNC');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return null;
    }

    const targetCase = cases.find((c) => c.id === caseId);
    const targetWorker = workers.find((w) => w.id === targetCase?.workerId);
    if (!targetCase || !targetWorker) return null;

    if (targetCase.workflowState !== 'resolved') {
      notify(
        'Workday staging writeback blocked: Complete credential verification and administrative case closure before writing summary to Workday.',
        'error'
      );
      return null;
    }

    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, externalSyncState: 'IN_PROGRESS' } : c))
    );

    const readiness = workerReadinessMap[targetWorker.id];
    const summaryStatus =
      targetWorker.clinicalEligibility === 'REVIEW_REQUIRED' ||
      targetWorker.clinicalEligibility === 'RESTRICTED_BY_AUTHORIZED_DECISION'
        ? 'CLINICAL_REVIEW_REQUIRED'
        : readiness?.overallStatus === 'READY'
        ? 'READY'
        : readiness?.overallStatus === 'INCOMPLETE_AMBER'
        ? 'PARTIAL_PENDING'
        : 'ACTION_REQUIRED';

    const latestEv = evidenceItems.find((e) => e.requirementId === targetCase.requirementId);
    const payload = mockWorkdayAdapter.buildStagingPayload(
      targetWorker,
      targetCase,
      summaryStatus,
      latestEv?.licenseNumber || 'RPH-84920',
      latestEv?.expirationDate || '2028-09-15'
    );

    const tx = await mockWorkdayAdapter.executeOutboundWriteback(payload, {
      simulateTimeout504
    });

    const enrichedTx: SyncTransaction = {
      ...tx,
      workerId: targetWorker.id,
      workerName: targetWorker.name,
      caseId: targetCase.id
    };

    setSyncTransactions((prev) => [enrichedTx, ...prev]);

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              externalSyncState: enrichedTx.status,
              lastSyncTransactionId: enrichedTx.id
            }
          : c
      )
    );

    if (enrichedTx.status === 'ACKNOWLEDGED') {
      setHrmsMirror((prev) => applyAcknowledgedTxToMirror(prev, enrichedTx, targetWorker.id));
      logAuditEvent({
        actor: currentPersona.name,
        actorRole: currentPersona.roleLabel,
        action: 'WORKDAY_STAGING_WRITEBACK_ACKNOWLEDGED',
        category: 'WORKDAY_SYNC',
        source: 'MockWorkdayAdapter (Staging API)',
        targetEntityId: enrichedTx.id,
        workerId: targetWorker.id,
        beforeState: 'QUEUED',
        afterState: 'ACKNOWLEDGED',
        details: `Simulated Workday staging writeback succeeded for ${targetWorker.name} (${targetCase.caseNumber}). Read-only HCM master fields untouched.`
      });
      notify(
        `Workday staging writeback acknowledged (${enrichedTx.id}) for ${targetWorker.name}.`,
        'success'
      );
    } else {
      logAuditEvent({
        actor: currentPersona.name,
        actorRole: currentPersona.roleLabel,
        action: 'WORKDAY_STAGING_WRITEBACK_TIMEOUT',
        category: 'WORKDAY_SYNC',
        source: 'MockWorkdayAdapter (Staging API)',
        targetEntityId: enrichedTx.id,
        workerId: targetWorker.id,
        beforeState: 'IN_PROGRESS',
        afterState: 'FAILED (HTTP 504)',
        details: `Simulated HTTP 504 timeout writing ${targetCase.caseNumber} to Workday staging. Local compliance closure remains preserved; eligible for scoped retry.`
      });
      notify(
        `Simulated HTTP 504 timeout on ${enrichedTx.id}. Local case stays verified; retry transaction safely.`,
        'error'
      );
    }

    return enrichedTx;
  };

  const retrySyncTransaction = async (
    txId: string,
    simulateTimeout504 = false
  ): Promise<SyncTransaction | null> => {
    const check = can('TRIGGER_WORKDAY_SYNC');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return null;
    }

    const failedTx = syncTransactions.find((t) => t.id === txId);
    if (!failedTx) return null;

    const retried = await mockWorkdayAdapter.retryTransaction(failedTx, { simulateTimeout504 });

    setSyncTransactions((prev) => prev.map((t) => (t.id === txId ? retried : t)));

    if (retried.caseId) {
      setCases((prev) =>
        prev.map((c) =>
          c.id === retried.caseId || c.caseNumber === retried.caseId
            ? { ...c, externalSyncState: retried.status, lastSyncTransactionId: retried.id }
            : c
        )
      );
    }

    if (retried.status === 'ACKNOWLEDGED' && retried.workerId) {
      setHrmsMirror((prev) => applyAcknowledgedTxToMirror(prev, retried, retried.workerId!));
      logAuditEvent({
        actor: currentPersona.name,
        actorRole: currentPersona.roleLabel,
        action: 'RETRY_WORKDAY_STAGING_TX_ACKNOWLEDGED',
        category: 'WORKDAY_SYNC',
        source: 'MockWorkdayAdapter (Idempotent Retry)',
        targetEntityId: retried.id,
        workerId: retried.workerId,
        beforeState: 'FAILED (HTTP 504)',
        afterState: 'ACKNOWLEDGED',
        details: `Scoped retry of ${retried.id} (key ${retried.idempotencyKey}) acknowledged for ${
          retried.workerName || retried.workerId
        }.`
      });
      notify(`Scoped retry acknowledged (${retried.id}) for ${retried.workerName || retried.workerId}.`, 'success');
    } else {
      notify(`Retry for ${retried.id} timed out again.`, 'error');
    }

    return retried;
  };

  // Simulate Workday Inbound New Hire or Role Transfer event
  const simulateWorkdayWorkerEvent = (
    type: 'NEW_HIRE' | 'ROLE_TRANSFER',
    workerId?: string
  ): { ok: boolean; message: string } => {
    const check = can('TRIGGER_WORKDAY_SYNC');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return { ok: false, message: check.reason };
    }

    const publishedRules = rules.filter((r) => r.status === 'Published');

    if (type === 'NEW_HIRE') {
      const existing = workers.find((w) => w.id === 'EMP-10990');
      if (existing) {
        notify('Simulated New Hire (EMP-10990) already imported from Workday sandbox.', 'info');
        return { ok: true, message: 'Already imported.' };
      }

      const newWorker: Worker = {
        id: 'EMP-10990',
        employeeNumber: 'EMP-10990',
        name: 'Sophia Patel',
        email: 's.patel@biovanguard-demo.example',
        primaryRole: 'Registered Nurse',
        primaryDepartment: 'Nursing',
        primaryFacilityId: 'FAC-TX-HOSP',
        primaryFacilityName: 'Texas Hospital',
        primaryState: 'Texas',
        workerType: 'Permanent',
        employmentStatus: 'Preboarding',
        hireDate: '2026-11-12',
        startDate: '2026-11-26',
        manager: 'Elena Rostova (Director of Nursing)',
        initials: 'SP',
        occupationalHealthSummary: {
          clearanceStatus: 'PENDING_OCC_HEALTH',
          restrictedAccessNote: 'Restricted medical details managed in Occupational Health EHR only.'
        },
        privilegingReference: { status: 'NOT_APPLICABLE' },
        clinicalEligibility: 'REVIEW_REQUIRED'
      };

      const newAsn: EmploymentAssignment = {
        id: 'ASN-10990-1',
        workerId: 'EMP-10990',
        facilityId: 'FAC-TX-HOSP',
        facilityName: 'Texas Hospital',
        state: 'Texas',
        department: 'Nursing',
        jobProfile: 'Registered Nurse',
        workerType: 'Permanent',
        effectiveStartDate: '2026-11-26',
        isPrimary: true,
        isClinicalDuty: true
      };

      const newReqs = buildRequirementsForWorkerAssignments(
        newWorker,
        [newAsn],
        publishedRules,
        requirements,
        evidenceItems,
        verifications,
        DEMO_REFERENCE_DATE
      );

      setWorkers((prev) => [newWorker, ...prev]);
      setAssignments((prev) => [newAsn, ...prev]);
      setRequirements((prev) => [...prev, ...newReqs]);

      // Create compliance cases for missing requirements
      const generatedCases: ComplianceCase[] = newReqs.map((req, idx) => ({
        id: `CASE-NH-${990 + idx}`,
        caseNumber: `CASE-2026-NH-${990 + idx}`,
        workerId: newWorker.id,
        workerName: newWorker.name,
        assignmentId: newAsn.id,
        facilityId: newAsn.facilityId,
        facilityName: newAsn.facilityName,
        department: newAsn.department,
        role: newAsn.jobProfile,
        state: newAsn.state,
        requirementId: req.requirementId,
        ruleId: req.ruleId,
        ruleVersion: 'v2.1',
        caseCategory: 'Missing Preboarding Credential',
        severity: req.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION' ? 'High' : 'Medium',
        title: `Preboarding: ${req.name}`,
        findingSummary: `Generated from simulated Workday New Hire event (start date ${newWorker.startDate}).`,
        workflowState: 'detected',
        documentState: req.documentState,
        verificationState: req.verificationState,
        clinicalEligibilityState:
          req.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION'
            ? 'REVIEW_REQUIRED'
            : 'NOT_APPLICABLE',
        externalSyncState: 'NOT_REQUIRED',
        detectedDate: DEMO_REFERENCE_DATE,
        dueDate: newWorker.startDate,
        clinicalRiskOwner:
          req.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION'
            ? 'Alex Morgan (Credentialing)'
            : 'N/A',
        hrOutreachOwner: 'Maya (HR Operations)',
        repositoriesSearched: ['Workday Worker Docs', 'SharePoint', 'Employee Portal'],
        whyFlagged: {
          policyName: 'Simulated Workday Preboarding Trigger',
          policyVersion: 'v2.1',
          policyEffectiveDate: '2026-01-15',
          clause: 'New Hire Preboarding Gate',
          clauseText: 'Applicable role requirements evaluated automatically on Workday preboarding import.',
          requirementText: req.name,
          inspectedSource: 'MockWorkdayAdapter Inbound Worker Event',
          sourceAsOfTimestamp: nowTimestampUtc(),
          foundEvidenceSummary: 'No preboarding document found in repositories.',
          alternativesAccepted: ['Active License / Certificate Submission'],
          extractionConfidence: 100,
          confidenceDisclaimer: 'Deterministic Workday job-profile applicability match.',
          uncertaintyNote: 'Preboarding worker start date 2026-11-26.',
          whyAuthoritativeVerificationRequired:
            req.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION'
              ? 'Primary Source Verification required prior to clinical floor start.'
              : 'Standard HR/Training verification required.',
          agentRunId: `RUN-WD-NH-${Date.now().toString().slice(-4)}`
        },
        reviewDecisions: []
      }));

      setCases((prev) => [...generatedCases, ...prev]);

      logAuditEvent({
        actor: currentPersona.name,
        actorRole: currentPersona.roleLabel,
        action: 'SIMULATE_WORKDAY_NEW_HIRE_EVENT',
        category: 'WORKDAY_SYNC',
        source: 'MockWorkdayAdapter Inbound Event',
        targetEntityId: newWorker.id,
        workerId: newWorker.id,
        details: `Imported simulated New Hire Sophia Patel (Texas RN, start 2026-11-26). Generated ${newReqs.length} applicable requirements.`
      });

      notify(
        `Simulated Workday New Hire imported: Sophia Patel (${newReqs.length} requirements evaluated).`,
        'success'
      );
      return { ok: true, message: 'New hire imported.' };
    }

    // ROLE_TRANSFER: Add California assignment to Elena Alvarez or selected worker
    const targetWorker =
      workers.find((w) => w.id === (workerId || 'EMP-10510')) || workers[1];
    const transferAsnId = `ASN-TRF-${Date.now().toString().slice(-4)}`;
    const hasCA = assignments.some(
      (a) => a.workerId === targetWorker.id && a.state === 'California'
    );
    if (hasCA) {
      notify(`${targetWorker.name} already holds a California transfer assignment.`, 'info');
      return { ok: true, message: 'Transfer assignment already exists.' };
    }

    const transferAsn: EmploymentAssignment = {
      id: transferAsnId,
      workerId: targetWorker.id,
      facilityId: 'FAC-CA-CRC',
      facilityName: 'California Clinical Research Center',
      state: 'California',
      department: 'R&D/Clinical Operations',
      jobProfile: 'Registered Nurse',
      workerType: targetWorker.workerType,
      effectiveStartDate: '2026-12-01',
      isPrimary: false,
      isClinicalDuty: true
    };

    const updatedAssignments = [transferAsn, ...assignments];
    const addedReqs = buildRequirementsForWorkerAssignments(
      targetWorker,
      [transferAsn],
      publishedRules,
      requirements,
      evidenceItems,
      verifications,
      DEMO_REFERENCE_DATE
    );

    setAssignments(updatedAssignments);
    setRequirements((prev) => [...prev, ...addedReqs]);

    const transferCases: ComplianceCase[] = addedReqs.map((req, idx) => ({
      id: `CASE-TRF-${Date.now().toString().slice(-4)}-${idx}`,
      caseNumber: `CASE-2026-TRF-${Date.now().toString().slice(-3)}`,
      workerId: targetWorker.id,
      workerName: targetWorker.name,
      assignmentId: transferAsn.id,
      facilityId: transferAsn.facilityId,
      facilityName: transferAsn.facilityName,
      department: transferAsn.department,
      role: transferAsn.jobProfile,
      state: transferAsn.state,
      requirementId: req.requirementId,
      ruleId: req.ruleId,
      ruleVersion: 'v2.4',
      caseCategory: 'Transfer Re-evaluation',
      severity: 'High',
      title: `Transfer Re-Evaluation: ${req.name}`,
      findingSummary: `Simulated Workday Transfer event added California assignment starting 2026-12-01; state-scoped rule re-evaluated.`,
      workflowState: 'detected',
      documentState: req.documentState,
      verificationState: req.verificationState,
      clinicalEligibilityState: 'REVIEW_REQUIRED',
      externalSyncState: 'NOT_REQUIRED',
      detectedDate: DEMO_REFERENCE_DATE,
      dueDate: '2026-11-30',
      clinicalRiskOwner: 'Alex Morgan (Credentialing)',
      hrOutreachOwner: 'Maya (HR Operations)',
      repositoriesSearched: ['Workday Worker Docs', 'SharePoint', 'Employee Portal'],
      whyFlagged: {
        policyName: 'Cross-State Transfer Applicability Policy',
        policyVersion: 'v2.4',
        policyEffectiveDate: '2026-01-15',
        clause: 'Multi-State Licensure Applicability',
        clauseText: 'Out-of-state transfers trigger destination state licensure verification.',
        requirementText: req.name,
        inspectedSource: 'MockWorkdayAdapter Role/Location Transfer Event',
        sourceAsOfTimestamp: nowTimestampUtc(),
        foundEvidenceSummary: `Worker holds ${targetWorker.primaryState} assignment; new California assignment requires CA credential.`,
        alternativesAccepted: ['California Registered Nurse License + PSV'],
        extractionConfidence: 100,
        confidenceDisclaimer: 'Deterministic transfer applicability evaluation.',
        uncertaintyNote: 'Transfer effective 2026-12-01.',
        whyAuthoritativeVerificationRequired:
          'State licensure does not automatically transfer across non-compact jurisdictions.',
        agentRunId: `RUN-WD-TRF-${Date.now().toString().slice(-4)}`
      },
      reviewDecisions: []
    }));

    setCases((prev) => [...transferCases, ...prev]);
    setSelectedWorkerId(targetWorker.id);
    if (transferCases[0]) setSelectedCaseId(transferCases[0].id);

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'SIMULATE_WORKDAY_TRANSFER_EVENT',
      category: 'WORKDAY_SYNC',
      source: 'MockWorkdayAdapter Inbound Event',
      targetEntityId: targetWorker.id,
      workerId: targetWorker.id,
      details: `Simulated California transfer event for ${targetWorker.name}. Triggered ${addedReqs.length} new state-scoped requirement(s).`
    });

    notify(
      `Simulated Workday Transfer for ${targetWorker.name}: ${addedReqs.length} California requirement(s) triggered.`,
      'success'
    );
    return { ok: true, message: 'Transfer simulated.' };
  };

  const runConnectorSync = async (connectorId: string) => {
    const check = can('TRIGGER_WORKDAY_SYNC');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    const now = nowTimestampUtc();
    const target = connectors.find((c) => c.id === connectorId);
    const tx: SyncTransaction = {
      id: `TX-IN-${Date.now().toString().slice(-5)}`,
      idempotencyKey: `idemp-inbound-${connectorId}-${Date.now()}`,
      connectorId,
      connectorName: target?.name || 'Workday HCM (Demo Adapter)',
      direction: 'Inbound (Workday -> Readiness)',
      timestamp: now,
      recordsProcessed: workers.length,
      recordsFailed: 0,
      status: 'ACKNOWLEDGED',
      httpStatus: 200,
      acknowledgedAt: now,
      retryCount: 0
    };
    setSyncTransactions((prev) => [tx, ...prev]);
    setConnectors((prev) =>
      prev.map((c) =>
        c.id === connectorId
          ? { ...c, status: 'Connected (Simulated)', lastSyncTimestamp: now }
          : c
      )
    );
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'RUN_SIMULATED_CONNECTOR_SYNC',
      category: 'WORKDAY_SYNC',
      source: target?.name || connectorId,
      targetEntityId: tx.id,
      details: `Simulated inbound sync completed (${workers.length} sample workers refreshed).`
    });
    notify(`Simulated sync completed for ${target?.name || connectorId}.`, 'success');
  };

  const updateConnectorStatus = (connectorId: string, status: Connector['status']) => {
    setConnectors((prev) => prev.map((c) => (c.id === connectorId ? { ...c, status } : c)));
  };

  const updateRoiAssumptions = (next: Partial<ROIModelAssumption>) => {
    setRoiAssumptions((prev) => ({ ...prev, ...next }));
  };

  // Scenario Launcher (Scenarios 1–6)
  const launchDemoScenario = (scenarioId: DemoScenarioId) => {
    setActiveScenarioId(scenarioId);
    switch (scenarioId) {
      case 'scenario_1_expired_pharmacist':
        setActiveRoleId('hr_ops_maya');
        setSelectedWorkerId('EMP-10419');
        setSelectedCaseId('CASE-9021');
        setCurrentScreen('employees');
        notify('Scenario 1: Daniel Kim expired CA Pharmacist license (#RPH-84920).', 'info');
        break;
      case 'scenario_2_newhire_nurse':
        setActiveRoleId('hr_ops_maya');
        setSelectedWorkerId('EMP-10510');
        setSelectedCaseId('CASE-9040');
        setCurrentScreen('employees');
        notify('Scenario 2: Elena Alvarez Texas RN preboarding (starts in 7 days).', 'info');
        break;
      case 'scenario_3_suspended_license':
        setActiveRoleId('cred_alex');
        setSelectedWorkerId('EMP-10901');
        setSelectedCaseId('CASE-9030');
        setCurrentScreen('employees');
        notify('Scenario 3: Marcus Vance restricted board status (PSV escalation).', 'info');
        break;
      case 'scenario_4_workday_retry':
        setActiveRoleId('admin_priya');
        setSelectedWorkerId('EMP-10922');
        setSelectedCaseId('CASE-9062');
        setCurrentScreen('integrations');
        notify('Scenario 4: Hannah Abbott Workday HTTP 504 staging writeback retry.', 'info');
        break;
      case 'scenario_5_priya_policy_publish':
        setActiveRoleId('admin_priya');
        setCurrentScreen('rule_test_lab');
        notify('Scenario 5: Priya Rule Test Lab (FIX-05 failing draft -> fix -> Alex approval).', 'info');
        break;
      case 'scenario_6_david_executive':
        setActiveRoleId('chro_david');
        setCurrentScreen('executive_overview');
        notify('Scenario 6: David Miller Executive Readiness & Business Value.', 'info');
        break;
    }
  };

  // Computed metrics strictly from live normalized state
  const computedMetrics = useMemo(() => {
    const sampleWorkersCount = workers.length;
    const totalApplicableRequirements = requirements.filter(
      (r) => r.applicabilityOutcome !== 'NOT_APPLICABLE'
    ).length;
    const openCases = cases.filter((c) => c.workflowState !== 'resolved');
    const resolvedCases = cases.filter((c) => c.workflowState === 'resolved');
    const criticalCasesCount = openCases.filter((c) => c.severity === 'Critical').length;
    const clinicalEscalationsPending = openCases.filter(
      (c) =>
        c.clinicalEligibilityState === 'REVIEW_REQUIRED' ||
        c.escalation?.status === 'PENDING_REVIEW'
    ).length;
    const awaitingEmployeeCount = openCases.filter(
      (c) => c.workflowState === 'evidence_requested'
    ).length;
    const pendingPSVCount = openCases.filter(
      (c) =>
        c.verificationState === 'PENDING_SOURCE_CHECK' ||
        c.verificationState === 'VERIFICATION_FAILED' ||
        c.verificationState === 'RESTRICTED'
    ).length;
    const needsReviewCount = openCases.filter(
      (c) => c.documentState === 'REVIEW_REQUIRED' || c.workflowState === 'authorized_review'
    ).length;
    const syncFailedCount = syncTransactions.filter((t) => t.status === 'FAILED').length;

    const readinessValues = Object.values(workerReadinessMap);
    const readyWorkersCount = readinessValues.filter((r) => r.overallStatus === 'READY').length;
    const sampleReadinessPercent = Math.round(
      (readyWorkersCount / Math.max(1, sampleWorkersCount)) * 100
    );

    const minutesSavedPerCase = Math.max(
      0,
      roiAssumptions.baselineManualMinutesPerCase - roiAssumptions.assistedMinutesPerCase
    );
    const modeledMonthlyHoursSaved = Math.round(
      (roiAssumptions.monthlyExceptionVolume * minutesSavedPerCase) / 60
    );
    const modeledAnnualCapacityValue = Math.round(
      modeledMonthlyHoursSaved * 12 * roiAssumptions.loadedHrHourlyRate
    );
    const modeledAnnualCashRealizable = Math.round(
      modeledAnnualCapacityValue * roiAssumptions.capacityToCashRealizationFactor
    );
    const totalAnnualCost =
      roiAssumptions.annualSoftwareSubscriptionCost +
      roiAssumptions.annualImplementationAndIntegrationCost;
    const modeledAnnualNetValue = modeledAnnualCashRealizable - totalAnnualCost;

    return {
      sampleWorkersCount,
      enterpriseHeadcountContext: organization.enterpriseHeadcountContext,
      totalApplicableRequirements,
      openCasesCount: openCases.length,
      criticalCasesCount,
      clinicalEscalationsPending,
      awaitingEmployeeCount,
      pendingPSVCount,
      needsReviewCount,
      syncFailedCount,
      readyWorkersCount,
      sampleReadinessPercent,
      resolvedCasesCount: resolvedCases.length,
      modeledMonthlyHoursSaved,
      modeledAnnualCapacityValue,
      modeledAnnualCashRealizable,
      modeledAnnualNetValue
    };
  }, [
    workers,
    requirements,
    cases,
    syncTransactions,
    workerReadinessMap,
    roiAssumptions,
    organization.enterpriseHeadcountContext
  ]);

  // Kill Switch & Admin Compatibility
  const triggerKillSwitch = (reason: string) => {
    const check = can('TRIGGER_KILL_SWITCH');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    setKillSwitchState({
      isTriggered: true,
      agentId: 'all-agents',
      stoppedAt: nowTimestampUtc(),
      stoppedBy: currentPersona.name,
      reason
    });
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'Paused' })));
    setIsKillSwitchModalOpen(false);
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'TRIGGER_EMERGENCY_KILL_SWITCH',
      category: 'KILL_SWITCH',
      source: 'AI Governance Guardrails',
      targetEntityId: 'ALL_AGENTS',
      details: `Emergency stop triggered: "${reason}". Automated outreach & agent recommendations paused.`
    });
    notify('Emergency Kill Switch activated. Automated outreach paused.', 'error');
  };

  const resumeAgentFromKillSwitch = () => {
    const check = can('TRIGGER_KILL_SWITCH');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    setKillSwitchState({ isTriggered: false });
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'Healthy' })));
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'RESUME_FROM_KILL_SWITCH',
      category: 'KILL_SWITCH',
      source: 'AI Governance Guardrails',
      targetEntityId: 'ALL_AGENTS',
      details: 'Emergency stop cleared by Compliance Administrator.'
    });
    notify('Compliance automation resumed.', 'success');
  };

  const rollbackToVersion = (version: string) => {
    rollbackRuleVersion('RULE-CA-PHARM-01', version);
    setIsRollbackModalOpen(false);
  };

  const runSandboxTest = (ruleId = 'RULE-CA-PHARM-DRAFT') => {
    const check = can('RUN_RULE_SANDBOX_EVAL');
    if (!check.allowed) {
      notify(check.reason, 'error');
      return;
    }
    setIsSandboxRunning(true);
    setSandboxTestResult('running');
    setTimeout(() => {
      runDraftRuleTestLab(ruleId);
      setIsSandboxRunning(false);
      setSandboxTestResult('completed');
    }, 350);
  };

  // Full deterministic Reset Demo Data
  const resetDemoData = () => {
    Object.values(previewsRef.current).forEach((p) => {
      try {
        URL.revokeObjectURL(p.objectUrl);
      } catch {
        // ignore
      }
    });
    setUploadedFilePreviews({});
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    setActiveRoleId('hr_ops_maya');
    setCurrentScreen('weekly_overview');
    setActiveScenarioId(null);
    setOrganization(INITIAL_ORGANIZATION);
    setWorkers(INITIAL_WORKERS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSelectedWorkerId('EMP-10419');
    setPolicies(INITIAL_POLICIES);
    setRules(INITIAL_RULES);
    setPolicyVersions(INITIAL_POLICY_VERSIONS);
    const draftRule = INITIAL_RULES.find((r) => r.id === 'RULE-CA-PHARM-DRAFT');
    setTestRuns(
      draftRule ? [runRuleEvaluation(draftRule, INITIAL_EVAL_FIXTURES, DEMO_REFERENCE_DATE)] : []
    );
    setRequirements(INITIAL_REQUIREMENTS);
    setEvidenceItems(INITIAL_EVIDENCE_ITEMS);
    setVerifications(INITIAL_VERIFICATIONS);
    setCases(INITIAL_COMPLIANCE_CASES);
    setSelectedCaseId('CASE-9021');
    setTasks(INITIAL_REMEDIATION_TASKS);
    setThreads(INITIAL_COMMUNICATION_THREADS);
    setConnectors(INITIAL_CONNECTORS);
    setSyncTransactions(INITIAL_SYNC_TRANSACTIONS);
    setHrmsMirror(INITIAL_HRMS_MIRROR);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setRoiAssumptions(INITIAL_ROI_ASSUMPTIONS);
    setKillSwitchState({ isTriggered: false });
    setAgents(ADMIN_AGENTS);
    setIsEmployeePortalOpen(false);
    setIsHRMSSyncPayloadModalOpen(false);
    notify('Demo dataset reset to reproducible baseline (As of 2026-11-12).', 'info');
  };

  // Single-scenario non-destructive reset (restores only entities belonging to that scenario)
  const resetScenario = (scenarioId: DemoScenarioId) => {
    const restoreEntitiesForWorkers = (workerIds: string[], caseIds: string[]) => {
      const workerSet = new Set(workerIds);
      const caseSet = new Set(caseIds);

      setWorkers((prev) =>
        prev.map((w) => INITIAL_WORKERS.find((iw) => iw.id === w.id && workerSet.has(iw.id)) || w)
      );
      setRequirements((prev) =>
        prev.map((r) =>
          workerSet.has(r.workerId)
            ? INITIAL_REQUIREMENTS.find((ir) => ir.requirementId === r.requirementId) || r
            : r
        )
      );
      setEvidenceItems((prev) => {
        const untouched = prev.filter((e) => !workerSet.has(e.workerId));
        const restored = INITIAL_EVIDENCE_ITEMS.filter((e) => workerSet.has(e.workerId));
        return [...restored, ...untouched];
      });
      setVerifications((prev) => {
        const untouched = prev.filter((v) => !workerSet.has(v.workerId));
        const restored = INITIAL_VERIFICATIONS.filter((v) => workerSet.has(v.workerId));
        return [...restored, ...untouched];
      });
      setCases((prev) =>
        prev.map((c) =>
          caseSet.has(c.id) ? INITIAL_COMPLIANCE_CASES.find((ic) => ic.id === c.id) || c : c
        )
      );
      setTasks((prev) => {
        const untouched = prev.filter((t) => !caseSet.has(t.caseId));
        const restored = INITIAL_REMEDIATION_TASKS.filter((t) => caseSet.has(t.caseId));
        return [...restored, ...untouched];
      });
      setThreads((prev) => {
        const untouched = prev.filter((th) => !caseSet.has(th.caseId));
        const restored = INITIAL_COMMUNICATION_THREADS.filter((th) => caseSet.has(th.caseId));
        return [...restored, ...untouched];
      });
      setHrmsMirror((prev) => {
        const next = { ...prev };
        for (const wId of workerIds) {
          if (INITIAL_HRMS_MIRROR[wId]) next[wId] = INITIAL_HRMS_MIRROR[wId];
        }
        return next;
      });
    };

    switch (scenarioId) {
      case 'scenario_1_expired_pharmacist':
        restoreEntitiesForWorkers(['EMP-10419'], ['CASE-9021', 'CASE-9022']);
        launchDemoScenario('scenario_1_expired_pharmacist');
        notify('Reset Scenario 1 (Daniel Kim) without altering other cases.', 'success');
        break;
      case 'scenario_2_newhire_nurse':
        restoreEntitiesForWorkers(['EMP-10510'], ['CASE-9040', 'CASE-9041', 'CASE-9042']);
        launchDemoScenario('scenario_2_newhire_nurse');
        notify('Reset Scenario 2 (Elena Alvarez) without altering other cases.', 'success');
        break;
      case 'scenario_3_suspended_license':
        restoreEntitiesForWorkers(['EMP-10901'], ['CASE-9030']);
        launchDemoScenario('scenario_3_suspended_license');
        notify('Reset Scenario 3 (Marcus Vance) without altering other cases.', 'success');
        break;
      case 'scenario_4_workday_retry':
        restoreEntitiesForWorkers(['EMP-10922'], ['CASE-9062']);
        setSyncTransactions((prev) => {
          const others = prev.filter((t) => t.id !== 'TX-WD-9062' && t.caseId !== 'CASE-9062');
          const origTx = INITIAL_SYNC_TRANSACTIONS.find((t) => t.id === 'TX-WD-9062');
          return origTx ? [...others, origTx] : others;
        });
        launchDemoScenario('scenario_4_workday_retry');
        notify('Reset Scenario 4 (Hannah Abbott Workday retry) without altering other cases.', 'success');
        break;
      case 'scenario_5_priya_policy_publish': {
        const draftRule = INITIAL_RULES.find((r) => r.id === 'RULE-CA-PHARM-DRAFT');
        setRules(INITIAL_RULES);
        setPolicyVersions(INITIAL_POLICY_VERSIONS);
        setTestRuns(
          draftRule ? [runRuleEvaluation(draftRule, INITIAL_EVAL_FIXTURES, DEMO_REFERENCE_DATE)] : []
        );
        launchDemoScenario('scenario_5_priya_policy_publish');
        notify('Reset Scenario 5 (Priya Rule Test Lab & Sign-Off) without altering operational cases.', 'success');
        break;
      }
      case 'scenario_6_david_executive':
        setRoiAssumptions(INITIAL_ROI_ASSUMPTIONS);
        launchDemoScenario('scenario_6_david_executive');
        notify('Reset Scenario 6 (David Executive ROI assumptions) to baseline.', 'success');
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeRoleId,
        currentPersona,
        switchRole,
        can,
        currentScreen,
        setCurrentScreen,
        currentEnvironment,
        setCurrentEnvironment,
        isWelcomeModalOpen,
        setIsWelcomeModalOpen,
        isDemoGuideOpen,
        setIsDemoGuideOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        activeScenarioId,
        launchDemoScenario,
        resetScenario,
        toasts,
        notify,
        dismissToast,
        organization,
        updateOrganization,
        facilities,
        departments,
        workers,
        assignments,
        workerReadinessMap,
        selectedWorkerId,
        setSelectedWorkerId,
        selectedWorker,
        openWorkerDossier,
        policies,
        addPolicyDocument,
        rules,
        policyVersions,
        testFixtures,
        testRuns,
        updateDraftRule,
        runDraftRuleTestLab,
        submitRuleForApproval,
        approveAndPublishRule,
        rejectRuleVersion,
        rollbackRuleVersion,
        requirements,
        evidenceItems,
        verifications,
        cases,
        selectedCaseId,
        setSelectedCaseId,
        selectedCase,
        tasks,
        threads,
        uploadedFilePreviews,
        approveAndSendOutreach,
        submitEmployeePortalResponse,
        runPrimarySourceVerification,
        recordClinicalEligibilityDecision,
        reviewAndCloseCase,
        completeNonPSVRequirement,
        connectors,
        fieldMappings,
        syncTransactions,
        hrmsMirror,
        queueAndSyncWorkdayStaging,
        retrySyncTransaction,
        simulateWorkdayWorkerEvent,
        runConnectorSync,
        updateConnectorStatus,
        isEmployeePortalOpen,
        setIsEmployeePortalOpen,
        isHRMSSyncPayloadModalOpen,
        setIsHRMSSyncPayloadModalOpen,
        auditEvents,
        logAuditEvent,
        roiAssumptions,
        updateRoiAssumptions,
        computedMetrics,
        resetDemoData,
        agents,
        selectedAgentId,
        setSelectedAgentId,
        selectedAgent,
        complianceAgentAutonomy,
        setComplianceAgentAutonomy: setBoundedComplianceAutonomy,
        killSwitchState,
        isKillSwitchModalOpen,
        setIsKillSwitchModalOpen,
        triggerKillSwitch,
        resumeAgentFromKillSwitch,
        traces,
        selectedTrace,
        setSelectedTrace,
        isTraceModalOpen,
        setIsTraceModalOpen,
        evalCases,
        selectedEvalCase,
        setSelectedEvalCase,
        isEvalModalOpen,
        setIsEvalModalOpen,
        workflowNodes,
        selectedWorkflowNode,
        setSelectedWorkflowNode,
        isWorkflowDrawerOpen,
        setIsWorkflowDrawerOpen,
        versions,
        dataSources,
        toggleDataSource,
        isRollbackModalOpen,
        setIsRollbackModalOpen,
        rollbackToVersion,
        releaseGateApproved,
        setReleaseGateApproved,
        isSandboxRunning,
        sandboxTestResult,
        runSandboxTest
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
