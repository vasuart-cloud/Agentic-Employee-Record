import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  NavigationScreen, 
  EnvironmentType, 
  AutonomyLevel,
  AgentInfo, 
  AgentTrace, 
  EvalCase, 
  WorkflowNodeData, 
  AgentVersion,
  Employee,
  KillSwitchRecord 
} from '../types';
import { 
  ADMIN_AGENTS, 
  HERO_AGENT_TRACE, 
  RECENT_TRACES, 
  EVAL_CASES, 
  WORKFLOW_NODES, 
  AGENT_VERSIONS,
  MOCK_EMPLOYEES 
} from '../data/mockData';

interface AppContextType {
  // Navigation & Environment
  currentScreen: NavigationScreen;
  setCurrentScreen: (screen: NavigationScreen) => void;
  currentEnvironment: EnvironmentType;
  setCurrentEnvironment: (env: EnvironmentType) => void;
  currentUser: {
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
  };
  
  // Agents State
  agents: AgentInfo[];
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  selectedAgent: AgentInfo;
  complianceAgentAutonomy: AutonomyLevel;
  setComplianceAgentAutonomy: (level: AutonomyLevel) => void;
  
  // Data Sources Permissions
  dataSources: {
    workday: boolean;
    sharepoint: boolean;
    docusign: boolean;
    docRepo: boolean;
    email: boolean;
    externalWeb: boolean;
  };
  toggleDataSource: (key: keyof AppContextType['dataSources']) => void;

  // Emergency Kill Switch
  killSwitchState: KillSwitchRecord;
  isKillSwitchModalOpen: boolean;
  setIsKillSwitchModalOpen: (open: boolean) => void;
  triggerKillSwitch: (reason: string) => void;
  resumeAgentFromKillSwitch: () => void;

  // Observability & Traces
  traces: AgentTrace[];
  selectedTrace: AgentTrace | null;
  setSelectedTrace: (trace: AgentTrace | null) => void;
  isTraceModalOpen: boolean;
  setIsTraceModalOpen: (open: boolean) => void;

  // Evals & Failures
  evalCases: EvalCase[];
  selectedEvalCase: EvalCase | null;
  setSelectedEvalCase: (caseItem: EvalCase | null) => void;
  isEvalModalOpen: boolean;
  setIsEvalModalOpen: (open: boolean) => void;
  releaseGateApproved: boolean;
  setReleaseGateApproved: (approved: boolean) => void;

  // Workflow Builder
  workflowNodes: WorkflowNodeData[];
  selectedWorkflowNode: WorkflowNodeData | null;
  setSelectedWorkflowNode: (node: WorkflowNodeData | null) => void;
  isWorkflowDrawerOpen: boolean;
  setIsWorkflowDrawerOpen: (open: boolean) => void;

  // Versions & Rollback
  versions: AgentVersion[];
  isRollbackModalOpen: boolean;
  setIsRollbackModalOpen: (open: boolean) => void;
  rollbackToVersion: (version: string) => void;

  // Sandbox Test
  isSandboxRunning: boolean;
  sandboxTestResult: 'idle' | 'running' | 'completed';
  runSandboxTest: () => void;

  // Operational Employees (Maya Thompson inspection)
  employees: Employee[];
  selectedEmployeeId: string;
  setSelectedEmployeeId: (id: string) => void;
  selectedEmployee: Employee;

  // CEO 10-Step Demo Navigator
  demoStep: number;
  jumpToDemoStep: (stepNumber: number) => void;
  resetDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>('command_center');
  const [currentEnvironment, setCurrentEnvironment] = useState<EnvironmentType>('Production');

  // Administrator Persona: Priya Sharma
  const [currentUser] = useState({
    name: 'Priya Sharma',
    role: 'HR Systems & Compliance Administrator',
    email: 'p.sharma@enterprise.com',
    avatarUrl: '/src/assets/images/avatar_sarah_lee_1791368352965.jpg'
  });

  // Agents
  const [agents, setAgents] = useState<AgentInfo[]>(ADMIN_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('compliance-agent');
  const [complianceAgentAutonomy, setComplianceAgentAutonomy] = useState<AutonomyLevel>(2);

  // Data Sources Configuration
  const [dataSources, setDataSources] = useState({
    workday: true,
    sharepoint: true,
    docusign: true,
    docRepo: true,
    email: false,
    externalWeb: false
  });

  const toggleDataSource = (key: keyof typeof dataSources) => {
    setDataSources(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Kill Switch
  const [killSwitchState, setKillSwitchState] = useState<KillSwitchRecord>({
    isTriggered: false
  });
  const [isKillSwitchModalOpen, setIsKillSwitchModalOpen] = useState(false);

  const triggerKillSwitch = (reason: string) => {
    setKillSwitchState({
      isTriggered: true,
      agentId: 'compliance-agent',
      stoppedAt: '10:54 AM UTC (Today)',
      stoppedBy: 'Priya Sharma',
      reason
    });
    // Update agent status
    setAgents(prev => prev.map(a => a.id === 'compliance-agent' ? { ...a, status: 'Paused' } : a));
    setIsKillSwitchModalOpen(false);
  };

  const resumeAgentFromKillSwitch = () => {
    setKillSwitchState({ isTriggered: false });
    setAgents(prev => prev.map(a => a.id === 'compliance-agent' ? { ...a, status: 'Healthy' } : a));
  };

  // Observability & Traces
  const [traces] = useState<AgentTrace[]>(RECENT_TRACES);
  const [selectedTrace, setSelectedTrace] = useState<AgentTrace | null>(HERO_AGENT_TRACE);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);

  // Evals
  const [evalCases] = useState<EvalCase[]>(EVAL_CASES);
  const [selectedEvalCase, setSelectedEvalCase] = useState<EvalCase | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [releaseGateApproved, setReleaseGateApproved] = useState(false);

  // Workflow
  const [workflowNodes] = useState<WorkflowNodeData[]>(WORKFLOW_NODES);
  const [selectedWorkflowNode, setSelectedWorkflowNode] = useState<WorkflowNodeData | null>(null);
  const [isWorkflowDrawerOpen, setIsWorkflowDrawerOpen] = useState(false);

  // Versions
  const [versions, setVersions] = useState<AgentVersion[]>(AGENT_VERSIONS);
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);

  const rollbackToVersion = (targetVersion: string) => {
    setVersions(prev => prev.map(v => {
      if (v.version === targetVersion) {
        return { ...v, status: 'Production', notes: `Rolled back to ${targetVersion} by Priya Sharma on Oct 12, 2026` };
      }
      if (v.version === 'v2.4') {
        return { ...v, status: 'Previous' };
      }
      return v;
    }));
    setIsRollbackModalOpen(false);
  };

  // Sandbox Test
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxTestResult, setSandboxTestResult] = useState<'idle' | 'running' | 'completed'>('idle');

  const runSandboxTest = () => {
    setIsSandboxRunning(true);
    setSandboxTestResult('running');
    setTimeout(() => {
      setIsSandboxRunning(false);
      setSandboxTestResult('completed');
    }, 1400);
  };

  // Operational Records
  const [employees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP-10482');
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId) || employees[0];

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[1];

  // CEO Demo Step Navigator
  const [demoStep, setDemoStep] = useState(1);

  const resetDemoState = () => {
    setDemoStep(1);
    setCurrentScreen('command_center');
    setKillSwitchState({ isTriggered: false });
    setAgents(ADMIN_AGENTS);
    setSandboxTestResult('idle');
    setIsTraceModalOpen(false);
    setIsEvalModalOpen(false);
    setIsKillSwitchModalOpen(false);
    setIsWorkflowDrawerOpen(false);
  };

  const jumpToDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    switch (stepNumber) {
      case 1:
        // Command Center
        setCurrentScreen('command_center');
        break;
      case 2:
        // Business Value
        setCurrentScreen('business_value');
        break;
      case 3:
        // Compliance Agent Detail
        setSelectedAgentId('compliance-agent');
        setCurrentScreen('agent_detail');
        break;
      case 4:
        // Agent Workflow Builder
        setCurrentScreen('agent_workflows');
        break;
      case 5:
        // Evals
        setCurrentScreen('evals');
        break;
      case 6:
        // Sandbox Testing
        setSelectedAgentId('compliance-agent');
        setCurrentScreen('agent_detail');
        // trigger sandbox run automatically
        runSandboxTest();
        break;
      case 7:
        // Observability & Agent Trace
        setCurrentScreen('observability');
        setSelectedTrace(HERO_AGENT_TRACE);
        setIsTraceModalOpen(true);
        break;
      case 8:
        // Guardrails
        setCurrentScreen('guardrails');
        break;
      case 9:
        // Emergency Kill Switch Demo
        setCurrentScreen('guardrails');
        setIsKillSwitchModalOpen(true);
        break;
      case 10:
        // Analytics & North Star
        setCurrentScreen('analytics');
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      currentEnvironment,
      setCurrentEnvironment,
      currentUser,
      agents,
      selectedAgentId,
      setSelectedAgentId,
      selectedAgent,
      complianceAgentAutonomy,
      setComplianceAgentAutonomy,
      dataSources,
      toggleDataSource,
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
      releaseGateApproved,
      setReleaseGateApproved,
      workflowNodes,
      selectedWorkflowNode,
      setSelectedWorkflowNode,
      isWorkflowDrawerOpen,
      setIsWorkflowDrawerOpen,
      versions,
      isRollbackModalOpen,
      setIsRollbackModalOpen,
      rollbackToVersion,
      isSandboxRunning,
      sandboxTestResult,
      runSandboxTest,
      employees,
      selectedEmployeeId,
      setSelectedEmployeeId,
      selectedEmployee,
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
