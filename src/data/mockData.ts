import { 
  AgentInfo, 
  AgentTrace, 
  EvalCase, 
  WorkflowNodeData, 
  AgentVersion, 
  Employee, 
  DocumentItem, 
  ComplianceGap 
} from '../types';

export const ADMIN_AGENTS: AgentInfo[] = [
  {
    id: 'ingestion-agent',
    name: 'Ingestion Agent',
    purpose: 'Find, classify and associate employee documents across HR repositories.',
    version: 'v2.4',
    status: 'Healthy',
    runs30d: 72420,
    successRate: 98.6,
    avgLatency: '1.2 sec',
    avgCostPerRun: '$0.008',
    keyMetricLabel: 'Documents Classified',
    keyMetricValue: '84,390',
    secondaryMetricLabel: 'Human Correction',
    secondaryMetricValue: '1.8%',
    owner: 'HR AI Platform Team',
    productionSince: 'Oct 01, 2026',
    autonomyLevel: 2
  },
  {
    id: 'compliance-agent',
    name: 'Compliance Agent',
    purpose: 'Check employee records against configured policies and identify missing or expired evidence.',
    version: 'v2.4',
    status: 'Healthy',
    runs30d: 41260,
    successRate: 96.9,
    avgLatency: '2.6 sec',
    avgCostPerRun: '$0.014',
    keyMetricLabel: 'Compliance Findings',
    keyMetricValue: '2,146',
    secondaryMetricLabel: 'False Positive Rate',
    secondaryMetricValue: '3.1%',
    owner: 'HR AI Platform Team',
    productionSince: 'Oct 01, 2026',
    autonomyLevel: 2
  },
  {
    id: 'remediation-agent',
    name: 'Remediation Agent',
    purpose: 'Recommend and coordinate corrective actions with strict human approval gates.',
    version: 'v2.4',
    status: 'Healthy',
    runs30d: 22190,
    successRate: 97.4,
    avgLatency: '1.8 sec',
    avgCostPerRun: '$0.011',
    keyMetricLabel: 'Recommendations Accepted',
    keyMetricValue: '87%',
    secondaryMetricLabel: 'Cases Resolved',
    secondaryMetricValue: '1,623',
    owner: 'HR Operations Group',
    productionSince: 'Oct 01, 2026',
    autonomyLevel: 2
  },
  {
    id: 'audit-retrieval-agent',
    name: 'Audit & Retrieval Agent',
    purpose: 'Retrieve evidence, answer natural language inquiries, and generate audit-ready packets.',
    version: 'v2.4',
    status: 'Healthy',
    runs30d: 12650,
    successRate: 99.2,
    avgLatency: '2.1 sec',
    avgCostPerRun: '$0.009',
    keyMetricLabel: 'Evidence-Backed Responses',
    keyMetricValue: '99.2%',
    secondaryMetricLabel: 'Audit Packets Generated',
    secondaryMetricValue: '342',
    owner: 'Compliance & Legal AI Ops',
    productionSince: 'Oct 01, 2026',
    autonomyLevel: 2
  }
];

export const HERO_AGENT_TRACE: AgentTrace = {
  id: 'AGT-839218',
  timestamp: '10:42:18 UTC',
  agentName: 'Compliance Agent',
  employeeId: 'EMP-10482',
  employeeName: 'Maya Thompson',
  action: 'Evaluate Form I-9 Supporting Identification',
  latencySec: 1.83,
  tokenCount: 1845,
  costUsd: 0.014,
  outcome: 'Flag',
  confidence: 94,
  policyVersion: 'Employment Verification Policy v4.2',
  modelVersion: 'gemini-1.5-pro-governed-enterprise',
  promptVersion: 'p-i9-eval-v4.2.1',
  steps: [
    { stepNumber: 1, name: 'Employee retrieved from Workday HCM', durationMs: 128, detail: 'Worker EMP-10482 active in Texas legal entity', status: 'success' },
    { stepNumber: 2, name: '14 documents identified across repositories', durationMs: 310, detail: 'Workday (4), SharePoint (7), DocuSign (3)', status: 'success' },
    { stepNumber: 3, name: '3 employment-verification documents classified', durationMs: 480, detail: 'Form I-9, Texas DL (List B), Unclassified scan', status: 'success' },
    { stepNumber: 4, name: 'Employment Verification Policy v4.2 loaded', durationMs: 85, detail: 'Deterministic Section 2 rule schema active', status: 'success' },
    { stepNumber: 5, name: 'Evidence evaluated against List B + C rule', durationMs: 610, detail: 'List B located (99% conf). List C missing across all sources.', status: 'warning' },
    { stepNumber: 6, name: 'Finding & structured remediation recommendation generated', durationMs: 220, detail: 'Flagged with 94% calibrated confidence. Routed to HR review.', status: 'success' }
  ],
  inputs: {
    'Employee ID': 'EMP-10482 (Maya Thompson)',
    'Jurisdiction': 'Texas, United States',
    'Form Election': 'Form I-9 Section 2 (List B + List C)',
    'Repository Scope': 'Workday, SharePoint, DocuSign, Archive'
  },
  outputs: {
    'Finding Status': 'FLAG_MISSING_EVIDENCE',
    'Deficiency': 'Missing Form I-9 List C Employment Authorization document',
    'Found Evidence': 'Texas Driver License (SharePoint / Identity)',
    'Confidence': '94%',
    'Recommended Action': 'Request missing List C document from Maya Thompson via secure portal'
  },
  toolsCalled: [
    'WorkdayWorkerConnector.getWorker()',
    'DocumentIndex.queryByEmployee()',
    'TaxonomyClassifier.batchClassify()',
    'PolicyEngine.evaluateRuleset()'
  ],
  sourcesAccessed: [
    'Workday://Worker Documents/EMP-10482',
    'SharePoint://Employee Records/Maya Thompson',
    'DocuSign://Envelopes/ENV-9941-2024'
  ]
};

export const RECENT_TRACES: AgentTrace[] = [
  HERO_AGENT_TRACE,
  {
    id: 'AGT-839217',
    timestamp: '10:41:05 UTC',
    agentName: 'Ingestion Agent',
    employeeId: 'EMP-10884',
    employeeName: 'Olivia Carter',
    action: 'Classify DocuSign Envelope',
    latencySec: 1.15,
    tokenCount: 940,
    costUsd: 0.007,
    outcome: 'Pass',
    confidence: 99,
    policyVersion: 'Corporate Handbook Standard v2.4',
    modelVersion: 'gemini-1.5-flash-enterprise',
    promptVersion: 'p-ingest-v2.3',
    steps: [],
    inputs: {},
    outputs: {},
    toolsCalled: ['DocuSignConnector.fetchEnvelope()'],
    sourcesAccessed: ['DocuSign']
  },
  {
    id: 'AGT-839216',
    timestamp: '10:39:42 UTC',
    agentName: 'Compliance Agent',
    employeeId: 'EMP-10419',
    employeeName: 'Daniel Kim',
    action: 'Verify State Pharmacy Licensure',
    latencySec: 2.45,
    tokenCount: 2110,
    costUsd: 0.016,
    outcome: 'Flag',
    confidence: 99,
    policyVersion: 'Clinical Licensure Policy v3.8',
    modelVersion: 'gemini-1.5-pro-governed-enterprise',
    promptVersion: 'p-licensure-v3.8',
    steps: [],
    inputs: {},
    outputs: {},
    toolsCalled: ['StateRegistryAPI.queryLicense()'],
    sourcesAccessed: ['Workday', 'California DCA Registry']
  },
  {
    id: 'AGT-839215',
    timestamp: '10:38:12 UTC',
    agentName: 'Remediation Agent',
    employeeId: 'EMP-10312',
    employeeName: 'Marcus Vance',
    action: 'Draft GovCloud Background Rescreen Task',
    latencySec: 1.62,
    tokenCount: 1420,
    costUsd: 0.011,
    outcome: 'Escalate',
    confidence: 91,
    policyVersion: 'Federal Screening Standard v1.9',
    modelVersion: 'gemini-1.5-pro-governed-enterprise',
    promptVersion: 'p-remediation-v2.1',
    steps: [],
    inputs: {},
    outputs: {},
    toolsCalled: ['SterlingConnector.checkPackage()'],
    sourcesAccessed: ['Sterling', 'Workday']
  }
];

export const EVAL_CASES: EvalCase[] = [
  {
    id: 'EVAL-041',
    name: 'Expired state license severity calibration',
    testSuite: 'Compliance',
    scenario: 'California Registered Pharmacist credential expired >15 days with active clinical shifts.',
    expected: 'Flag HIGH severity',
    actual: 'Flag MEDIUM severity',
    difference: 'Severity assigned was MEDIUM due to outdated lookup table in draft prompt v2.5-alpha.',
    severity: 'Medium',
    owner: 'Compliance AI Team (Priya Sharma)',
    status: 'Open',
    policyUsed: 'Clinical Licensure & Credentialing Policy v3.8',
    promptVersion: 'prompt-licensure-eval-draft-2.5',
    agentTraceId: 'AGT-839216'
  },
  {
    id: 'EVAL-019',
    name: 'Form I-9 List A foreign passport stamp expiration',
    testSuite: 'Edge Case',
    scenario: 'I-94 electronic printout attached without unexpired foreign passport endorsement page.',
    expected: 'Flag CRITICAL (Incomplete evidence)',
    actual: 'Flag CRITICAL (Incomplete evidence)',
    difference: 'None. Clean match against statutory 8 CFR 274a.2.',
    severity: 'Low',
    owner: 'HR Compliance QA',
    status: 'Resolved',
    policyUsed: 'Employment Verification Policy v4.2',
    promptVersion: 'p-i9-eval-v4.2.1',
    agentTraceId: 'AGT-838910'
  },
  {
    id: 'EVAL-082',
    name: 'Direct deposit voided check misclassification check',
    testSuite: 'Regression',
    scenario: 'Legacy batch onboarding scan containing bank account routing numbers.',
    expected: 'Unclassified / Ignore (Not Form I-9)',
    actual: 'Unclassified / Ignore (Not Form I-9)',
    difference: 'Successfully avoided false positive matching.',
    severity: 'Low',
    owner: 'Ingestion Eng Lead',
    status: 'Resolved',
    policyUsed: 'Document Taxonomy Standard v5.1',
    promptVersion: 'p-ingest-v2.4',
    agentTraceId: 'AGT-837102'
  }
];

export const WORKFLOW_NODES: WorkflowNodeData[] = [
  {
    id: 'node-1',
    title: 'Employee Created / Updated',
    subtitle: 'Workday HCM Webhook (Worker Event)',
    type: 'trigger',
    trigger: 'Workday Worker Event / Scheduled 15m Sync',
    outputs: ['Worker Metadata', 'HCM ID', 'Legal Entity', 'Start Date']
  },
  {
    id: 'node-2',
    title: 'Ingestion Agent',
    subtitle: 'Scan Connected Repositories',
    type: 'agent',
    agent: 'Ingestion Agent v2.4',
    inputs: ['Worker Metadata', 'Repository Connectors'],
    outputs: ['Indexed File Hashes', 'Metadata Payloads'],
    timeout: '60s',
    retryPolicy: '3 retries with exponential backoff'
  },
  {
    id: 'node-3',
    title: 'Document Classification',
    subtitle: 'Deterministic OCR & NER',
    type: 'action',
    inputs: ['Indexed File Hashes'],
    outputs: ['Document Type', 'Confidence Score', 'Extracted Dates'],
    humanApprovalRequired: false
  },
  {
    id: 'node-4',
    title: 'Compliance Agent',
    subtitle: 'Evaluate Policy Rules',
    type: 'agent',
    agent: 'Compliance Agent v2.4',
    inputs: ['Classified Documents', 'Policy Ruleset v4.2'],
    outputs: ['Completeness Matrix', 'Missing Evidence Flags'],
    timeout: '45s'
  },
  {
    id: 'node-5',
    title: 'Decision & Branching',
    subtitle: 'Route by Compliance Outcome',
    type: 'decision',
    branch: '3-Way Evaluation Gate'
  },
  {
    id: 'node-6',
    title: 'Remediation Agent',
    subtitle: 'Prepare Action & Draft Outreach',
    type: 'agent',
    agent: 'Remediation Agent v2.4',
    inputs: ['Missing Evidence Finding', 'Policy SLA (3 days)'],
    outputs: ['Draft Outreach', 'Due Date', 'Escalation Path']
  },
  {
    id: 'node-7',
    title: 'Human Approval Gate (Gate 2)',
    subtitle: 'HR Operations Review',
    type: 'human_gate',
    humanApprovalRequired: true,
    failureBehavior: 'Block external communication until approved by HR Ops Specialist'
  },
  {
    id: 'node-8',
    title: 'Employee / Manager Action',
    subtitle: 'Secure Tokenized Upload Link',
    type: 'action',
    inputs: ['Approved Message'],
    outputs: ['Encrypted File Submission']
  },
  {
    id: 'node-9',
    title: 'New Evidence Received',
    subtitle: 'Secure Webhook Listener',
    type: 'trigger',
    trigger: 'Single-use Token File Upload'
  },
  {
    id: 'node-10',
    title: 'Ingestion & Re-check',
    subtitle: 'Verify Against Policy Rules',
    type: 'agent',
    agent: 'Compliance Agent v2.4',
    inputs: ['New Document', 'Prior Deficiency Record'],
    outputs: ['Rule Satisfaction Confirmation']
  },
  {
    id: 'node-11',
    title: 'Human Closure (Gate 3)',
    subtitle: 'HR Verifies & Certifies',
    type: 'human_gate',
    humanApprovalRequired: true,
    failureBehavior: 'Keep case in pending verification queue'
  },
  {
    id: 'node-12',
    title: 'Audit Record Sealed',
    subtitle: 'Defensible Evidence Package',
    type: 'audit',
    outputs: ['Immutable SHA256 Ledger Entry', 'Audit Dossier Export']
  }
];

export const AGENT_VERSIONS: AgentVersion[] = [
  {
    version: 'v2.5',
    status: 'Draft',
    model: 'gemini-1.5-pro-governed-2026',
    promptVersion: 'p-compliance-v2.5-draft',
    policyCompatibility: 'Employment Verification v4.2, Licensure v3.8',
    evalScore: '98.4% (Sandbox Pass)',
    releaseDate: 'In Draft Review',
    owner: 'Priya Sharma',
    notes: 'Improved source attribution and 18% lower token overhead. Awaiting Release Gate approval.'
  },
  {
    version: 'v2.4',
    status: 'Production',
    model: 'gemini-1.5-pro-governed-enterprise',
    promptVersion: 'p-compliance-v2.4.2',
    policyCompatibility: 'All Active 2026 Company Policies',
    evalScore: '98.2% (Passed all Gates)',
    releaseDate: 'Oct 01, 2026',
    owner: 'HR AI Platform Team',
    notes: 'Current production baseline. Running across 12,480 active employee files.'
  },
  {
    version: 'v2.3',
    status: 'Previous',
    model: 'gemini-1.5-pro-governed-enterprise',
    promptVersion: 'p-compliance-v2.3.8',
    policyCompatibility: 'Policies v4.0 and v4.1',
    evalScore: '97.5% (Certified)',
    releaseDate: 'Aug 14, 2026',
    owner: 'Priya Sharma',
    notes: 'Stable backup rollback target. Tested and verified in staging.'
  },
  {
    version: 'v2.2',
    status: 'Archived',
    model: 'gemini-1.0-pro-enterprise',
    promptVersion: 'p-compliance-v2.2.0',
    policyCompatibility: 'Legacy 2025 Rules',
    evalScore: '95.8%',
    releaseDate: 'May 02, 2026',
    owner: 'HR Systems Admin',
    notes: 'Deprecated legacy architecture.'
  }
];

export const PRODUCTION_EXCEPTIONS = [
  { type: 'Document classification failed', count: 42, severity: 'Medium', trend: '-8% WoW' },
  { type: 'Low-confidence findings (<80%)', count: 76, severity: 'Medium', trend: '+2% WoW' },
  { type: 'Integration timeout (Workday/SharePoint)', count: 18, severity: 'High', trend: '-14% WoW' },
  { type: 'Policy conflict / version ambiguity', count: 7, severity: 'High', trend: 'Stable' },
  { type: 'Agent escalation to HR', count: 34, severity: 'Medium', trend: '-5% WoW' },
  { type: 'Critical unclassified errors', count: 2, severity: 'Critical', trend: 'Isolated' }
];

// Operational employees list for test sandbox & operational inspection
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-10482',
    name: 'Maya Thompson',
    email: 'm.thompson@company.com',
    role: 'Senior Financial Analyst',
    department: 'Corporate Finance',
    location: 'Texas, USA',
    status: 'Active',
    startDate: 'March 18, 2024',
    manager: 'Robert Chen',
    avatarUrl: '/src/assets/images/avatar_maya_thompson_1791368343099.jpg',
    fileHealthScore: 82,
    healthStatus: 'Needs Attention',
    lastScanTime: '8 minutes ago',
    openGapsCount: 1
  },
  {
    id: 'EMP-10419',
    name: 'Daniel Kim',
    email: 'd.kim@company.com',
    role: 'Clinical Research Pharmacist',
    department: 'R&D Operations',
    location: 'California, USA',
    status: 'Active',
    startDate: 'January 10, 2023',
    manager: 'Dr. Aris Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 78,
    healthStatus: 'Critical',
    lastScanTime: '15 minutes ago',
    openGapsCount: 1
  },
  {
    id: 'EMP-10884',
    name: 'Olivia Carter',
    email: 'o.carter@company.com',
    role: 'Product Operations Lead',
    department: 'Product & Tech',
    location: 'New York, USA',
    status: 'Active',
    startDate: 'June 01, 2024',
    manager: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 89,
    healthStatus: 'Needs Attention',
    lastScanTime: '32 minutes ago',
    openGapsCount: 1
  }
];
