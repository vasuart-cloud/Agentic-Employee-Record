import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  UserRoleId,
  UserPersona,
  NavigationScreen, 
  EnvironmentType, 
  AutonomyLevel,
  Organization,
  PolicySource,
  ComplianceRule,
  RuleVersion,
  EvalFixture,
  EvalRun,
  ComplianceCase,
  RemediationTask,
  MessageThread,
  HRMSConnector,
  FieldMapping,
  SyncRun,
  HRMSMirrorRecord,
  AuditEvent,
  BusinessValueAssumptions,
  Employee,
  AgentInfo, 
  AgentTrace, 
  EvalCase, 
  WorkflowNodeData, 
  AgentVersion,
  KillSwitchRecord 
} from '../types';
import { 
  USER_PERSONAS,
  INITIAL_ORGANIZATION,
  INITIAL_POLICIES,
  INITIAL_RULES,
  INITIAL_RULE_VERSIONS,
  INITIAL_EVAL_FIXTURES,
  INITIAL_EVAL_RUN,
  MOCK_EMPLOYEES,
  INITIAL_COMPLIANCE_CASES,
  INITIAL_REMEDIATION_TASKS,
  INITIAL_MESSAGE_THREADS,
  INITIAL_CONNECTORS,
  INITIAL_FIELD_MAPPINGS,
  INITIAL_SYNC_RUNS,
  INITIAL_HRMS_MIRROR,
  INITIAL_AUDIT_LOGS,
  INITIAL_ASSUMPTIONS,
  ADMIN_AGENTS, 
  HERO_AGENT_TRACE, 
  RECENT_TRACES, 
  EVAL_CASES, 
  WORKFLOW_NODES, 
  AGENT_VERSIONS
} from '../data/mockData';

const LOCAL_STORAGE_KEY = 'agentic_records_state_v2';

interface AppContextType {
  // Active Persona & Navigation
  activeRoleId: UserRoleId;
  currentPersona: UserPersona;
  switchRole: (roleId: UserRoleId) => void;
  currentScreen: NavigationScreen;
  setCurrentScreen: (screen: NavigationScreen) => void;
  currentEnvironment: EnvironmentType;
  setCurrentEnvironment: (env: EnvironmentType) => void;
  isWelcomeModalOpen: boolean;
  setIsWelcomeModalOpen: (open: boolean) => void;

  // Organization & Policies
  organization: Organization;
  updateOrganization: (org: Partial<Organization>) => void;
  policies: PolicySource[];
  addPolicy: (policy: PolicySource) => void;

  // Rules & Test Lab
  rules: ComplianceRule[];
  ruleVersions: RuleVersion[];
  evalFixtures: EvalFixture[];
  evalRuns: EvalRun[];
  updateRule: (rule: ComplianceRule) => void;
  runRuleEvalSandbox: (ruleId: string) => Promise<EvalRun>;
  publishRuleVersion: (ruleId: string, version: string, secondApproverName: string) => void;
  rollbackRuleVersion: (ruleId: string, targetVersion: string) => void;

  // Operational Employees & Cases
  employees: Employee[];
  selectedEmployeeId: string;
  setSelectedEmployeeId: (id: string) => void;
  selectedEmployee: Employee;
  complianceCases: ComplianceCase[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  selectedCase: ComplianceCase;
  remediationTasks: RemediationTask[];
  messageThreads: MessageThread[];

  // Hero Story Actions
  approveAndSendRemediation: (caseId: string, customSubject?: string, customBody?: string) => void;
  simulateEmployeeUpload: (caseId: string, details: { fileName: string; fileSize: string; licenseNumber?: string; expirationDate?: string }) => void;
  reviewEvidenceAndResolve: (caseId: string, approved: boolean, notes: string) => void;
  triggerHRMSWriteback: (caseId: string, simulateFailure?: boolean) => Promise<boolean>;
  retryFailedSync: (syncRunId: string) => void;

  // Modals & Inspection UI
  isEmployeePortalOpen: boolean;
  setIsEmployeePortalOpen: (open: boolean) => void;
  isHRMSSyncPayloadModalOpen: boolean;
  setIsHRMSSyncPayloadModalOpen: (open: boolean) => void;

  // Connectors & HRMS Sync
  connectors: HRMSConnector[];
  fieldMappings: FieldMapping[];
  syncRuns: SyncRun[];
  hrmsMirror: Record<string, HRMSMirrorRecord>;
  runConnectorSync: (connectorId: string, direction?: string) => Promise<void>;
  updateConnectorStatus: (connectorId: string, status: HRMSConnector['status']) => void;

  // Audit Ledger
  auditEvents: AuditEvent[];
  logAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'hashSha256'>) => void;

  // Business Value Assumptions & Computed Metrics
  assumptions: BusinessValueAssumptions;
  updateAssumptions: (newAssumptions: Partial<BusinessValueAssumptions>) => void;
  computedMetrics: {
    totalMonitored: number;
    openCasesCount: number;
    criticalCasesCount: number;
    overdueCount: number;
    awaitingEmployeeCount: number;
    needsReviewCount: number;
    verifiedCompleteCount: number;
    northStarAuditReadyPercent: number;
    totalMinutesSaved: number;
    estimatedLaborValueSaved: number;
    annualizedNetROI: number;
  };

  // Agents & Guardrails (Admin)
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

  // Traces & Evals
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
  // Global Reset
  resetDemoData: () => void;

  // Compatibility fields for advanced admin controls & demo
  dataSources: {
    workday: boolean;
    sharepoint: boolean;
    docusign: boolean;
    docRepo: boolean;
    email: boolean;
    externalWeb: boolean;
  };
  toggleDataSource: (key: any) => void;
  isRollbackModalOpen: boolean;
  setIsRollbackModalOpen: (open: boolean) => void;
  rollbackToVersion: (version: string) => void;
  releaseGateApproved: boolean;
  setReleaseGateApproved: (approved: boolean) => void;
  isSandboxRunning: boolean;
  sandboxTestResult: 'idle' | 'running' | 'completed';
  runSandboxTest: () => void;
  demoStep: number;
  jumpToDemoStep: (stepNumber: number) => void;
  resetDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or Seeds
  const [activeRoleId, setActiveRoleId] = useState<UserRoleId>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeRoleId) return parsed.activeRoleId;
      }
    } catch (e) {
      console.warn('Failed reading activeRoleId from storage', e);
    }
    return 'hr_ops_maya';
  });

  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>('weekly_overview');
  const [currentEnvironment, setCurrentEnvironment] = useState<EnvironmentType>('Production');
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  // Entities state
  const [organization, setOrganization] = useState<Organization>(INITIAL_ORGANIZATION);
  const [policies, setPolicies] = useState<PolicySource[]>(INITIAL_POLICIES);
  const [rules, setRules] = useState<ComplianceRule[]>(INITIAL_RULES);
  const [ruleVersions, setRuleVersions] = useState<RuleVersion[]>(INITIAL_RULE_VERSIONS);
  const [evalFixtures, setEvalFixtures] = useState<EvalFixture[]>(INITIAL_EVAL_FIXTURES);
  const [evalRuns, setEvalRuns] = useState<EvalRun[]>([INITIAL_EVAL_RUN]);

  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('EMP-10419'); // Daniel Kim by default

  const [complianceCases, setComplianceCases] = useState<ComplianceCase[]>(INITIAL_COMPLIANCE_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-9021'); // Hero case Daniel Kim
  const [remediationTasks, setRemediationTasks] = useState<RemediationTask[]>(INITIAL_REMEDIATION_TASKS);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(INITIAL_MESSAGE_THREADS);

  const [connectors, setConnectors] = useState<HRMSConnector[]>(INITIAL_CONNECTORS);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(INITIAL_FIELD_MAPPINGS);
  const [syncRuns, setSyncRuns] = useState<SyncRun[]>(INITIAL_SYNC_RUNS);
  const [hrmsMirror, setHrmsMirror] = useState<Record<string, HRMSMirrorRecord>>(INITIAL_HRMS_MIRROR);

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [assumptions, setAssumptions] = useState<BusinessValueAssumptions>(INITIAL_ASSUMPTIONS);

  // Admin agents & kill switch
  const [agents, setAgents] = useState<AgentInfo[]>(ADMIN_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('compliance-agent');
  const [complianceAgentAutonomy, setComplianceAgentAutonomy] = useState<AutonomyLevel>(2);
  const [killSwitchState, setKillSwitchState] = useState<KillSwitchRecord>({ isTriggered: false });
  const [isKillSwitchModalOpen, setIsKillSwitchModalOpen] = useState(false);

  // Observability & traces
  const [traces] = useState<AgentTrace[]>(RECENT_TRACES);
  const [selectedTrace, setSelectedTrace] = useState<AgentTrace | null>(HERO_AGENT_TRACE);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);

  // Evals & Workflows
  const [evalCases] = useState<EvalCase[]>(EVAL_CASES);
  const [selectedEvalCase, setSelectedEvalCase] = useState<EvalCase | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [workflowNodes] = useState<WorkflowNodeData[]>(WORKFLOW_NODES);
  const [selectedWorkflowNode, setSelectedWorkflowNode] = useState<WorkflowNodeData | null>(null);
  const [isWorkflowDrawerOpen, setIsWorkflowDrawerOpen] = useState(false);
  const [versions] = useState<AgentVersion[]>(AGENT_VERSIONS);

  // Interactive Hero UI Modals
  const [isEmployeePortalOpen, setIsEmployeePortalOpen] = useState(false);
  const [isHRMSSyncPayloadModalOpen, setIsHRMSSyncPayloadModalOpen] = useState(false);

  // Advanced Admin Controls Compatibility
  const [dataSources, setDataSources] = useState({
    workday: true,
    sharepoint: true,
    docusign: true,
    docRepo: true,
    email: false,
    externalWeb: false
  });
  const toggleDataSource = (key: any) => {
    setDataSources(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const rollbackToVersion = (targetVersion: string) => {
    rollbackRuleVersion('RULE-CA-PHARM-01', targetVersion);
    setIsRollbackModalOpen(false);
  };

  const [releaseGateApproved, setReleaseGateApproved] = useState(true);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxTestResult, setSandboxTestResult] = useState<'idle' | 'running' | 'completed'>('completed');
  const runSandboxTest = () => {
    setIsSandboxRunning(true);
    setSandboxTestResult('running');
    setTimeout(() => {
      setIsSandboxRunning(false);
      setSandboxTestResult('completed');
    }, 1200);
  };

  const [demoStep, setDemoStep] = useState(1);
  const jumpToDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
  };
  const resetDemoState = () => {
    resetDemoData();
  };

  // Save to localStorage when critical state changes
  useEffect(() => {
    try {
      const stateToSave = {
        activeRoleId,
        currentScreen,
        complianceCases,
        employees,
        hrmsMirror,
        rules,
        ruleVersions,
        evalRuns,
        connectors,
        syncRuns,
        auditEvents,
        assumptions,
        killSwitchState
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [
    activeRoleId, currentScreen, complianceCases, employees, hrmsMirror, 
    rules, ruleVersions, evalRuns, connectors, syncRuns, auditEvents, 
    assumptions, killSwitchState
  ]);

  // Active persona
  const currentPersona = USER_PERSONAS[activeRoleId] || USER_PERSONAS['hr_ops_maya'];

  // Switch role without losing progress
  const switchRole = (roleId: UserRoleId) => {
    setActiveRoleId(roleId);
    if (roleId === 'admin_priya') {
      setCurrentScreen('setup_checklist');
    } else if (roleId === 'hr_ops_maya') {
      setCurrentScreen('weekly_overview');
    } else if (roleId === 'chro_david') {
      setCurrentScreen('executive_overview');
    }
  };

  // Helper to log audit event
  const logAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp' | 'hashSha256'>) => {
    const id = `AUDIT-${Date.now().toString().slice(-5)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const rawString = `${id}|${timestamp}|${event.actor}|${event.action}|${event.targetEntityId}`;
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      hash = (hash << 5) - hash + rawString.charCodeAt(i);
      hash |= 0;
    }
    const hashSha256 = Math.abs(hash).toString(16).padStart(64, 'a');

    const newEvent: AuditEvent = {
      id,
      timestamp,
      ...event,
      hashSha256
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  // Selected Entities
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId) || employees[0];
  const selectedCase = complianceCases.find(c => c.id === selectedCaseId) || complianceCases[0];
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[1];

  // Organization update
  const updateOrganization = (org: Partial<Organization>) => {
    setOrganization(prev => ({ ...prev, ...org }));
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'UPDATE_ORGANIZATION_SETTINGS',
      category: 'SYSTEM',
      targetEntityId: 'ORG-MAIN',
      targetEntityType: 'Rule',
      details: `Updated organization scope and legal entity configurations.`
    });
  };

  // Add policy
  const addPolicy = (policy: PolicySource) => {
    setPolicies(prev => [policy, ...prev]);
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'REGISTER_POLICY_DOCUMENT',
      category: 'POLICY',
      targetEntityId: policy.id,
      targetEntityType: 'Rule',
      details: `Registered policy document: ${policy.name} (${policy.version}).`
    });
  };

  // Update rule
  const updateRule = (updatedRule: ComplianceRule) => {
    setRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'UPDATE_COMPLIANCE_RULE_DRAFT',
      category: 'POLICY',
      targetEntityId: updatedRule.id,
      targetEntityType: 'Rule',
      details: `Updated parameters for rule ${updatedRule.ruleCode} (${updatedRule.name}). Status: ${updatedRule.status}.`
    });
  };

  // Run Rule Eval in Sandbox
  const runRuleEvalSandbox = async (ruleId: string): Promise<EvalRun> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const runId = `EVAL-RUN-${Date.now().toString().slice(-6)}`;
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        
        // Evaluate fixtures
        const newRun: EvalRun = {
          runId,
          timestamp,
          ruleVersion: 'v3.9-draft',
          totalFixtures: 10,
          passedFixtures: 10,
          truePositives: 4,
          falsePositives: 0,
          trueNegatives: 6,
          falseNegatives: 0,
          precision: 100,
          recall: 100,
          accuracy: 100,
          gatePassed: true
        };

        setEvalRuns(prev => [newRun, ...prev]);
        setRules(prev => prev.map(r => r.id === ruleId ? { ...r, status: 'Tested' } : r));
        
        logAuditEvent({
          actor: currentPersona.name,
          actorRole: currentPersona.roleLabel,
          action: 'EXECUTE_SANDBOX_EVAL',
          category: 'POLICY',
          targetEntityId: ruleId,
          targetEntityType: 'Rule',
          details: `Sandbox evaluation passed: 10/10 test fixtures passed (Precision 100%, Recall 100%). Gate cleared for dual-approval.`
        });

        resolve(newRun);
      }, 750);
    });
  };

  // Publish Rule Version with dual approver simulation
  const publishRuleVersion = (ruleId: string, version: string, secondApproverName: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? {
      ...r,
      version,
      status: 'Published',
      approvedBy: `${currentPersona.name} & ${secondApproverName}`,
      approvedAt: new Date().toISOString()
    } : r));

    const newVersionRecord: RuleVersion = {
      version,
      ruleId,
      ruleName: 'California Clinical Research Pharmacist Licensure',
      author: currentPersona.name,
      status: 'Published',
      testPassRate: 100,
      evalScore: '10/10 Passed (Dual Sign-Off)',
      effectiveDate: new Date().toISOString().split('T')[0],
      approvedBy: secondApproverName,
      notes: `Published with dual sign-off from ${secondApproverName}.`,
      diffSummary: `Published production rule ${version}.`
    };

    setRuleVersions(prev => [newVersionRecord, ...prev.map(v => v.status === 'Published' ? { ...v, status: 'Archived' as const } : v)]);

    logAuditEvent({
      actor: `${currentPersona.name} & ${secondApproverName}`,
      actorRole: 'Compliance Admin & Legal/Medical Sign-off',
      action: 'PUBLISH_COMPLIANCE_RULE',
      category: 'POLICY',
      targetEntityId: ruleId,
      targetEntityType: 'Rule',
      details: `Published Rule ${ruleId} version ${version} with dual-approver confirmation.`
    });
  };

  // Rollback Rule Version
  const rollbackRuleVersion = (ruleId: string, targetVersion: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, version: targetVersion } : r));
    setRuleVersions(prev => prev.map(v => v.version === targetVersion ? { ...v, status: 'Published' } : { ...v, status: 'Archived' }));
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'ROLLBACK_COMPLIANCE_RULE',
      category: 'POLICY',
      targetEntityId: ruleId,
      targetEntityType: 'Rule',
      details: `Rolled back rule ${ruleId} to version ${targetVersion}.`
    });
  };

  // Run Connector Sync
  const runConnectorSync = async (connectorId: string, direction = 'Inbound (HRMS -> Compliance)') => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        const targetConnector = connectors.find(c => c.id === connectorId);
        const connectorName = targetConnector ? targetConnector.name : 'Workday HCM';

        const runRecord: SyncRun = {
          id: `SYNC-RUN-${Date.now().toString().slice(-4)}`,
          connectorId,
          connectorName,
          direction: direction as any,
          timestamp,
          recordsFetched: 11420,
          recordsCreated: 0,
          recordsUpdated: 3,
          recordsFailed: 0,
          durationMs: 1240,
          status: 'SUCCESS',
          idempotencyKey: `IDEMP-SYNC-${Date.now()}`
        };

        setSyncRuns(prev => [runRecord, ...prev]);
        setConnectors(prev => prev.map(c => c.id === connectorId ? {
          ...c,
          status: 'Connected',
          lastSyncTimestamp: timestamp
        } : c));

        logAuditEvent({
          actor: currentPersona.name,
          actorRole: currentPersona.roleLabel,
          action: 'RUN_INTEGRATION_SYNC',
          category: 'HRMS_SYNC',
          targetEntityId: connectorId,
          targetEntityType: 'Connector',
          details: `Simulated sync run completed successfully for ${connectorName}. 11,420 records evaluated.`
        });

        resolve();
      }, 600);
    });
  };

  const updateConnectorStatus = (connectorId: string, status: HRMSConnector['status']) => {
    setConnectors(prev => prev.map(c => c.id === connectorId ? { ...c, status } : c));
  };

  // HERO ACTION 1: Approve and send remediation outreach (Gate 2)
  const approveAndSendRemediation = (caseId: string, customSubject?: string, customBody?: string) => {
    if (killSwitchState.isTriggered) {
      alert('Action blocked: Emergency Kill Switch is currently active.');
      return;
    }

    const targetCase = complianceCases.find(c => c.id === caseId);
    if (!targetCase) return;

    const task = remediationTasks.find(t => t.caseId === caseId);
    const subject = customSubject || (task ? task.draftedSubject : 'Action Required: Submit Verification');
    const body = customBody || (task ? task.draftedBody : 'Please upload your renewed credential.');

    // 1. Update Case Status -> AMBER_AWAITING_EMPLOYEE
    setComplianceCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      status: 'AMBER_AWAITING_EMPLOYEE',
      slaStatus: 'Due Soon'
    } : c));

    // 2. Update Task Status -> APPROVED_SENT
    setRemediationTasks(prev => prev.map(t => t.caseId === caseId ? {
      ...t,
      status: 'APPROVED_SENT',
      dispatchedAt: new Date().toISOString()
    } : t));

    // 3. Append to Message Thread
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    setMessageThreads(prev => {
      const existing = prev.find(th => th.caseId === caseId);
      if (existing) {
        return prev.map(th => th.caseId === caseId ? {
          ...th,
          messages: [
            ...th.messages,
            {
              id: `MSG-${Date.now()}`,
              sender: 'HR_OPERATIONS',
              senderName: `${currentPersona.name} (HR Operations)`,
              timestamp,
              content: body
            }
          ]
        } : th);
      } else {
        return [
          ...prev,
          {
            id: `THREAD-${Date.now()}`,
            caseId,
            employeeId: targetCase.employeeId,
            employeeName: targetCase.employeeName,
            subject,
            messages: [
              {
                id: `MSG-${Date.now()}`,
                sender: 'HR_OPERATIONS',
                senderName: `${currentPersona.name} (HR Operations)`,
                timestamp,
                content: body
              }
            ]
          }
        ];
      }
    });

    // 4. Log Audit Event
    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'APPROVE_AND_DISPATCH_REMEDIATION',
      category: 'OUTREACH',
      targetEntityId: caseId,
      targetEntityType: 'Case',
      details: `Approved AI-drafted outreach to ${targetCase.employeeName} (${targetCase.employeeId}) via Secure Portal. Case transitioned to Amber (Awaiting Response).`
    });
  };

  // HERO ACTION 2: Simulate employee portal upload (Daniel Kim submits license)
  const simulateEmployeeUpload = (
    caseId: string, 
    details: { fileName: string; fileSize: string; licenseNumber?: string; expirationDate?: string }
  ) => {
    const targetCase = complianceCases.find(c => c.id === caseId);
    if (!targetCase) return;

    // 1. Update Case Status -> AMBER_NEEDS_HR_REVIEW
    setComplianceCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      status: 'AMBER_NEEDS_HR_REVIEW'
    } : c));

    // 2. Add message to thread with attachment
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    setMessageThreads(prev => prev.map(th => th.caseId === caseId ? {
      ...th,
      messages: [
        ...th.messages,
        {
          id: `MSG-EMP-${Date.now()}`,
          sender: 'EMPLOYEE',
          senderName: targetCase.employeeName,
          timestamp,
          content: `Hi Maya, I have completed my California Board of Pharmacy renewal. Attached is my official license verification certificate with expiration extended through September 15, 2028. Thank you!`,
          attachments: [
            {
              filename: details.fileName,
              size: details.fileSize,
              verified: true
            }
          ]
        }
      ]
    } : th));

    // 3. Log Audit Event
    logAuditEvent({
      actor: targetCase.employeeName,
      actorRole: 'Employee (Simulated Secure Portal)',
      action: 'SUBMIT_EVIDENCE_DOCUMENT',
      category: 'EVIDENCE',
      targetEntityId: caseId,
      targetEntityType: 'Case',
      details: `Uploaded renewal document "${details.fileName}" (${details.fileSize}) with detected License #RPH-84920, Valid through 2028-09-15.`
    });
  };

  // HERO ACTION 3: Review evidence & approve resolution (Gate 3) -> RED -> AMBER -> GREEN!
  const reviewEvidenceAndResolve = (caseId: string, approved: boolean, notes: string) => {
    const targetCase = complianceCases.find(c => c.id === caseId);
    if (!targetCase) return;

    if (approved) {
      // Transition Case to GREEN_RESOLVED
      setComplianceCases(prev => prev.map(c => c.id === caseId ? {
        ...c,
        status: 'GREEN_RESOLVED',
        slaStatus: 'On Track',
        hrmsSyncStatus: 'PENDING',
        resolvedAt: new Date().toISOString(),
        resolvedBy: currentPersona.name,
        resolutionNotes: notes
      } : c));

      // Transition Employee to Complete / 100% health
      setEmployees(prev => prev.map(emp => emp.id === targetCase.employeeId ? {
        ...emp,
        fileHealthScore: 100,
        healthStatus: 'Complete',
        openGapsCount: 0,
        lastScanTime: 'Just now'
      } : emp));

      // Complete Task
      setRemediationTasks(prev => prev.map(t => t.caseId === caseId ? {
        ...t,
        status: 'COMPLETED'
      } : t));

      // Log Audit Event
      logAuditEvent({
        actor: currentPersona.name,
        actorRole: currentPersona.roleLabel,
        action: 'APPROVE_EVIDENCE_AND_RESOLVE_CASE',
        category: 'CASE',
        targetEntityId: caseId,
        targetEntityType: 'Case',
        details: `Verified replacement evidence for ${targetCase.employeeName}. Case marked RESOLVED (Green). Compliance file is 100% complete and audit-ready.`
      });
    } else {
      // Rejection keeps case AMBER
      setComplianceCases(prev => prev.map(c => c.id === caseId ? {
        ...c,
        status: 'AMBER_AWAITING_EMPLOYEE',
        resolutionNotes: `Evidence rejected: ${notes}`
      } : c));

      logAuditEvent({
        actor: currentPersona.name,
        actorRole: currentPersona.roleLabel,
        action: 'REJECT_EVIDENCE',
        category: 'CASE',
        targetEntityId: caseId,
        targetEntityType: 'Case',
        details: `Rejected uploaded document for ${targetCase.employeeName}: ${notes}. Revised request requested.`
      });
    }
  };

  // HERO ACTION 4: Trigger simulated HRMS metadata writeback to Workday Mirror
  const triggerHRMSWriteback = async (caseId: string, simulateFailure = false): Promise<boolean> => {
    const targetCase = complianceCases.find(c => c.id === caseId);
    if (!targetCase) return false;

    // Step 1: Set Case HRMS status to SYNCING
    setComplianceCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      hrmsSyncStatus: 'SYNCING'
    } : c));

    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

        if (simulateFailure) {
          // Failure path
          setComplianceCases(prev => prev.map(c => c.id === caseId ? {
            ...c,
            hrmsSyncStatus: 'FAILED',
            lastHRMSTryTimestamp: timestamp,
            lastHRMSError: 'Workday API Timeout (HTTP 504) - Gateway Timeout. Retry is available.'
          } : c));

          const failedRun: SyncRun = {
            id: `SYNC-RUN-${Date.now().toString().slice(-4)}`,
            connectorId: 'conn-workday',
            connectorName: 'Workday HCM',
            direction: 'Outbound (Approved Compliance -> HRMS)',
            timestamp,
            recordsFetched: 1,
            recordsCreated: 0,
            recordsUpdated: 0,
            recordsFailed: 1,
            durationMs: 1450,
            status: 'FAILED',
            errorMessage: 'Gateway Timeout while writing back compliance verification metadata to Workday worker record.',
            idempotencyKey: `IDEMP-OUT-FAIL-${Date.now()}`
          };
          setSyncRuns(prev => [failedRun, ...prev]);

          logAuditEvent({
            actor: currentPersona.name,
            actorRole: currentPersona.roleLabel,
            action: 'OUTBOUND_HRMS_SYNC_FAILED',
            category: 'HRMS_SYNC',
            targetEntityId: caseId,
            targetEntityType: 'Case',
            details: `Simulated writeback failed for ${targetCase.employeeName}: Gateway Timeout (HTTP 504).`
          });

          resolve(false);
        } else {
          // Success path
          setComplianceCases(prev => prev.map(c => c.id === caseId ? {
            ...c,
            hrmsSyncStatus: 'SYNCED',
            lastHRMSTryTimestamp: timestamp,
            lastHRMSError: undefined
          } : c));

          // Update Workday local mirror
          setHrmsMirror(prev => ({
            ...prev,
            [targetCase.employeeId]: {
              employeeId: targetCase.employeeId,
              workerName: targetCase.employeeName,
              jobProfile: targetCase.role,
              department: targetCase.department,
              location: targetCase.location,
              workerStatus: 'Active',
              complianceStatus: 'VERIFIED_COMPLIANT',
              licenseNumber: 'RPH-84920',
              licenseExpiration: '2028-09-15',
              auditVerified: true,
              lastVerifiedBy: `${currentPersona.name} (${currentPersona.roleLabel})`,
              lastVerifiedAt: timestamp,
              lastSyncTimestamp: timestamp
            }
          }));

          const successRun: SyncRun = {
            id: `SYNC-RUN-${Date.now().toString().slice(-4)}`,
            connectorId: 'conn-workday',
            connectorName: 'Workday HCM',
            direction: 'Outbound (Approved Compliance -> HRMS)',
            timestamp,
            recordsFetched: 1,
            recordsCreated: 0,
            recordsUpdated: 1,
            recordsFailed: 0,
            durationMs: 780,
            status: 'SUCCESS',
            idempotencyKey: `IDEMP-OUT-SUCC-${Date.now()}`
          };
          setSyncRuns(prev => [successRun, ...prev]);

          logAuditEvent({
            actor: currentPersona.name,
            actorRole: currentPersona.roleLabel,
            action: 'OUTBOUND_HRMS_SYNC_SUCCESS',
            category: 'HRMS_SYNC',
            targetEntityId: caseId,
            targetEntityType: 'Case',
            details: `Successfully wrote back verified compliance metadata for ${targetCase.employeeName} to Workday HCM. Mirror record updated with unexpired date (2028-09-15) and audit timestamp.`
          });

          resolve(true);
        }
      }, 950);
    });
  };

  // Retry failed sync
  const retryFailedSync = (syncRunId: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    setSyncRuns(prev => prev.map(sr => sr.id === syncRunId ? {
      ...sr,
      status: 'SUCCESS',
      errorMessage: undefined,
      recordsUpdated: 1,
      recordsFailed: 0,
      timestamp
    } : sr));

    setComplianceCases(prev => prev.map(c => c.hrmsSyncStatus === 'FAILED' ? {
      ...c,
      hrmsSyncStatus: 'SYNCED',
      lastHRMSError: undefined,
      lastHRMSTryTimestamp: timestamp
    } : c));

    // Update mirror
    setHrmsMirror(prev => {
      const updated = { ...prev };
      if (updated['EMP-10419']) {
        updated['EMP-10419'] = {
          ...updated['EMP-10419'],
          complianceStatus: 'VERIFIED_COMPLIANT',
          licenseExpiration: '2028-09-15',
          auditVerified: true,
          lastVerifiedBy: `${currentPersona.name}`,
          lastVerifiedAt: timestamp,
          lastSyncTimestamp: timestamp
        };
      }
      return updated;
    });

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'RETRY_HRMS_SYNC_SUCCESS',
      category: 'HRMS_SYNC',
      targetEntityId: syncRunId,
      targetEntityType: 'Connector',
      details: `Retried failed outbound sync run ${syncRunId}. Successfully wrote back compliance metadata to Workday HCM.`
    });
  };

  // Update business assumptions
  const updateAssumptions = (newAssumptions: Partial<BusinessValueAssumptions>) => {
    setAssumptions(prev => ({ ...prev, ...newAssumptions }));
  };

  // Dynamic Metrics derived directly from live state
  const computedMetrics = useMemo(() => {
    const totalMonitored = employees.length;
    const openCases = complianceCases.filter(c => c.status !== 'GREEN_RESOLVED');
    const openCasesCount = openCases.length;
    const criticalCasesCount = openCases.filter(c => c.severity === 'Critical').length;
    const overdueCount = openCases.filter(c => c.slaStatus === 'Overdue').length;
    const awaitingEmployeeCount = complianceCases.filter(c => c.status === 'AMBER_AWAITING_EMPLOYEE').length;
    const needsReviewCount = complianceCases.filter(c => c.status === 'AMBER_NEEDS_HR_REVIEW').length;
    const verifiedCompleteCount = employees.filter(e => e.healthStatus === 'Complete').length;
    const northStarAuditReadyPercent = Math.round((verifiedCompleteCount / Math.max(1, totalMonitored)) * 100);

    const resolvedCasesCount = complianceCases.filter(c => c.status === 'GREEN_RESOLVED').length;
    const minutesSavedPerCase = Math.max(0, assumptions.baselineManualMinutesPerCase - assumptions.assistedMinutesPerCase);
    const totalMinutesSaved = resolvedCasesCount * minutesSavedPerCase;
    const estimatedLaborValueSaved = Math.round((totalMinutesSaved / 60) * assumptions.loadedHrHourlyRate);

    // Annualized net ROI projection from pilot assumptions
    const projectedMonthlyMinutesSaved = assumptions.averageMonthlyCases * minutesSavedPerCase;
    const projectedAnnualLaborSaved = (projectedMonthlyMinutesSaved / 60) * assumptions.loadedHrHourlyRate * 12;
    const annualizedNetROI = Math.round(projectedAnnualLaborSaved - assumptions.annualSubscriptionCost - assumptions.annualizedImplementationCost);

    return {
      totalMonitored,
      openCasesCount,
      criticalCasesCount,
      overdueCount,
      awaitingEmployeeCount,
      needsReviewCount,
      verifiedCompleteCount,
      northStarAuditReadyPercent,
      totalMinutesSaved,
      estimatedLaborValueSaved,
      annualizedNetROI
    };
  }, [employees, complianceCases, assumptions]);

  // Kill Switch
  const triggerKillSwitch = (reason: string) => {
    setKillSwitchState({
      isTriggered: true,
      agentId: 'all-agents',
      stoppedAt: new Date().toLocaleTimeString() + ' (Just now)',
      stoppedBy: currentPersona.name,
      reason
    });
    setAgents(prev => prev.map(a => ({ ...a, status: 'Paused' })));
    setIsKillSwitchModalOpen(false);

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'TRIGGER_EMERGENCY_KILL_SWITCH',
      category: 'KILL_SWITCH',
      targetEntityId: 'ALL_AGENTS',
      targetEntityType: 'Agent',
      details: `Emergency stop initiated by ${currentPersona.name}: "${reason}". All agent background operations paused.`
    });
  };

  const resumeAgentFromKillSwitch = () => {
    setKillSwitchState({ isTriggered: false });
    setAgents(prev => prev.map(a => ({ ...a, status: 'Healthy' })));

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'RESUME_AGENTS_FROM_KILL_SWITCH',
      category: 'KILL_SWITCH',
      targetEntityId: 'ALL_AGENTS',
      targetEntityType: 'Agent',
      details: `Emergency stop lifted by ${currentPersona.name}. Resumed normal operational telemetry.`
    });
  };

  // Reset demo state back to pristine seed
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setActiveRoleId('hr_ops_maya');
    setCurrentScreen('weekly_overview');
    setCurrentEnvironment('Production');
    setOrganization(INITIAL_ORGANIZATION);
    setPolicies(INITIAL_POLICIES);
    setRules(INITIAL_RULES);
    setRuleVersions(INITIAL_RULE_VERSIONS);
    setEvalFixtures(INITIAL_EVAL_FIXTURES);
    setEvalRuns([INITIAL_EVAL_RUN]);
    setEmployees(MOCK_EMPLOYEES);
    setSelectedEmployeeId('EMP-10419');
    setComplianceCases(INITIAL_COMPLIANCE_CASES);
    setSelectedCaseId('CASE-9021');
    setRemediationTasks(INITIAL_REMEDIATION_TASKS);
    setMessageThreads(INITIAL_MESSAGE_THREADS);
    setConnectors(INITIAL_CONNECTORS);
    setFieldMappings(INITIAL_FIELD_MAPPINGS);
    setSyncRuns(INITIAL_SYNC_RUNS);
    setHrmsMirror(INITIAL_HRMS_MIRROR);
    setAuditEvents(INITIAL_AUDIT_LOGS);
    setAssumptions(INITIAL_ASSUMPTIONS);
    setKillSwitchState({ isTriggered: false });
    setAgents(ADMIN_AGENTS);
    setIsEmployeePortalOpen(false);
    setIsHRMSSyncPayloadModalOpen(false);
  };

  return (
    <AppContext.Provider value={{
      activeRoleId,
      currentPersona,
      switchRole,
      currentScreen,
      setCurrentScreen,
      currentEnvironment,
      setCurrentEnvironment,
      isWelcomeModalOpen,
      setIsWelcomeModalOpen,
      organization,
      updateOrganization,
      policies,
      addPolicy,
      rules,
      ruleVersions,
      evalFixtures,
      evalRuns,
      updateRule,
      runRuleEvalSandbox,
      publishRuleVersion,
      rollbackRuleVersion,
      employees,
      selectedEmployeeId,
      setSelectedEmployeeId,
      selectedEmployee,
      complianceCases,
      selectedCaseId,
      setSelectedCaseId,
      selectedCase,
      remediationTasks,
      messageThreads,
      approveAndSendRemediation,
      simulateEmployeeUpload,
      reviewEvidenceAndResolve,
      triggerHRMSWriteback,
      retryFailedSync,
      isEmployeePortalOpen,
      setIsEmployeePortalOpen,
      isHRMSSyncPayloadModalOpen,
      setIsHRMSSyncPayloadModalOpen,
      connectors,
      fieldMappings,
      syncRuns,
      hrmsMirror,
      runConnectorSync,
      updateConnectorStatus,
      auditEvents,
      logAuditEvent,
      assumptions,
      updateAssumptions,
      computedMetrics,
      agents,
      selectedAgentId,
      setSelectedAgentId,
      selectedAgent,
      complianceAgentAutonomy,
      setComplianceAgentAutonomy,
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
      resetDemoData,
      dataSources,
      toggleDataSource,
      isRollbackModalOpen,
      setIsRollbackModalOpen,
      rollbackToVersion,
      releaseGateApproved,
      setReleaseGateApproved,
      isSandboxRunning,
      sandboxTestResult,
      runSandboxTest,
      demoStep,
      jumpToDemoStep,
      resetDemoState
    }}>
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
