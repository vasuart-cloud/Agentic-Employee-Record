import { 
  UserPersona,
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
  AgentVersion
} from '../types';

export const USER_PERSONAS: Record<string, UserPersona> = {
  admin_priya: {
    id: 'admin_priya',
    name: 'Priya Sharma',
    title: 'HR Systems & Compliance Administrator',
    roleLabel: 'Compliance Admin',
    email: 'p.sharma@biovanguard.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    workspaceLabel: 'Compliance & AI Administration',
    description: 'Sets compliance policies, tests rule evals in the sandbox, publishes versions, manages HRMS connectors, and enforces safety guardrails.',
    permissions: {
      canConfigurePolicies: true,
      canPublishRules: true,
      canManageConnectors: true,
      canApproveRemediation: false,
      canCommunicateWithEmployees: false,
      canResolveCases: false,
      canTriggerHRMSSync: true
    }
  },
  hr_ops_maya: {
    id: 'hr_ops_maya',
    name: 'Maya',
    title: 'HR Operations Manager',
    roleLabel: 'HR Operations Manager',
    email: 'maya.ops@biovanguard.com',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    workspaceLabel: 'HR Operations & Exceptions',
    description: 'Works the weekly exceptions queue, investigates "Why Flagged?" citations, approves remediation outreach, verifies evidence, and closes compliance cases.',
    permissions: {
      canConfigurePolicies: false,
      canPublishRules: false,
      canManageConnectors: false,
      canApproveRemediation: true,
      canCommunicateWithEmployees: true,
      canResolveCases: true,
      canTriggerHRMSSync: true
    }
  },
  chro_david: {
    id: 'chro_david',
    name: 'David Miller',
    title: 'VP People / CHRO',
    roleLabel: 'Executive CHRO',
    email: 'd.miller@biovanguard.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    workspaceLabel: 'Executive & Board Insights',
    description: 'Monitors North Star audit-readiness metrics, labor hours saved, audit exposure reduction, and pilot ROI goals.',
    permissions: {
      canConfigurePolicies: false,
      canPublishRules: false,
      canManageConnectors: false,
      canApproveRemediation: false,
      canCommunicateWithEmployees: false,
      canResolveCases: false,
      canTriggerHRMSSync: false
    }
  }
};

export const INITIAL_ORGANIZATION: Organization = {
  name: 'BioVanguard Health Systems',
  legalEntity: 'BioVanguard Therapeutics US Inc.',
  sizeRange: '10,000–15,000 Employees',
  totalEmployees: 11420,
  states: ['California', 'Texas', 'New York', 'Illinois', 'Massachusetts', 'North Carolina'],
  departments: ['R&D Operations', 'Corporate Finance', 'Product & Tech', 'Clinical Affairs', 'Manufacturing & Supply', 'Talent & HR'],
  workerTypes: ['Full-Time Regular', 'Part-Time', 'Clinical Contractor', 'Temporary / Staffing'],
  defaultSlaDays: 14
};

export const INITIAL_POLICIES: PolicySource[] = [
  {
    id: 'POL-CLIN-38',
    name: 'Clinical Research Licensure & Credentialing Policy',
    documentNumber: 'POL-BVH-2026-08',
    version: 'v3.8',
    effectiveDate: '2026-01-15',
    owner: 'Office of Medical Compliance & Priya Sharma',
    category: 'Licensure',
    summary: 'Governs professional state license verification for all clinical trial personnel, research pharmacists, and medical monitors.',
    clauses: [
      {
        clauseId: 'CL-4.1',
        section: 'Section 4.1: State Pharmacist Licensure',
        text: 'All pharmacists actively engaged in clinical trials, investigational drug compounding, or site dispensing in California must possess an active, unencumbered license from the California State Board of Pharmacy. Evidence of renewal must be verified prior to expiration.'
      },
      {
        clauseId: 'CL-4.2',
        section: 'Section 4.2: Renewal Notice Interval',
        text: 'HR Operations must notify affected professionals at least 60 calendar days prior to credential expiration. A grace period of 7 days is permitted before mandatory operational suspension.'
      },
      {
        clauseId: 'CL-4.3',
        section: 'Section 4.3: Acceptable Evidence Standards',
        text: 'Acceptable proof comprises an official digital certificate of licensure issued by the State Board or a direct query verification record with license number, status (Active), and unexpired renewal date.'
      }
    ],
    fileSize: '412 KB (PDF)',
    status: 'Active'
  },
  {
    id: 'POL-I9-42',
    name: 'US Employment Eligibility Verification (Form I-9) Standard',
    documentNumber: 'POL-BVH-2025-01',
    version: 'v4.2',
    effectiveDate: '2025-08-01',
    owner: 'US Talent Operations',
    category: 'Employment Verification',
    summary: 'Complies with federal 8 CFR § 274a standards for Form I-9 document completeness: either acceptable List A OR acceptable List B + List C.',
    clauses: [
      {
        clauseId: 'CL-2.1',
        section: 'Section 2.1: Identity and Work Authorization Combinations',
        text: 'Employees must present either one document from List A (establishing both identity and employment authorization) OR an acceptable combination of one document from List B (identity) AND one document from List C (employment authorization).'
      },
      {
        clauseId: 'CL-2.2',
        section: 'Section 2.2: Retention and Audit SLA',
        text: 'Completed Form I-9 and verified supporting documentation must be retained for three years after hire date or one year after termination, whichever is later, in an audit-ready state.'
      }
    ],
    fileSize: '530 KB (PDF)',
    status: 'Active'
  },
  {
    id: 'POL-ETH-24',
    name: 'Corporate Code of Ethics & Employee Handbook',
    documentNumber: 'POL-BVH-2026-03',
    version: 'v2.4',
    effectiveDate: '2026-03-01',
    owner: 'Legal & Compliance',
    category: 'Ethics & Conduct',
    summary: 'Requires annual electronic signature acknowledgment of anti-bribery, HIPAA, and data protection standards by all salaried employees.',
    clauses: [
      {
        clauseId: 'CL-1.3',
        section: 'Section 1.3: Annual Acknowledgment',
        text: 'Every regular employee must sign the annual Code of Ethics acknowledgment envelope via DocuSign within 30 days of issuance.'
      }
    ],
    fileSize: '1.2 MB (PDF)',
    status: 'Active'
  }
];

export const INITIAL_RULES: ComplianceRule[] = [
  {
    id: 'RULE-CA-PHARM-01',
    ruleCode: 'LIC-CA-RPH',
    name: 'California Clinical Research Pharmacist Licensure',
    documentType: 'California State Board of Pharmacy License',
    department: 'R&D Operations',
    jobRole: 'Clinical Research Pharmacist',
    location: 'California',
    workerType: 'Full-Time Regular',
    conditionDescription: 'Employee must hold an Active unencumbered California Pharmacist License with expiration date strictly greater than current evaluation date.',
    validityPeriodMonths: 24,
    reminderNoticeDays: 60,
    severity: 'Critical',
    slaDays: 7,
    evidenceSources: ['Workday', 'SharePoint', 'Employee Portal'],
    humanApprovalRequired: true,
    confidenceThreshold: 85,
    effectiveDate: '2026-01-15',
    sourcePolicyId: 'POL-CLIN-38',
    sourceClause: 'Section 4.1: State Pharmacist Licensure',
    version: 'v3.8',
    status: 'Published',
    approvedBy: 'Dr. Aris Thorne (Chief Medical Officer)',
    approvedAt: '2026-01-14T16:00:00Z'
  },
  {
    id: 'RULE-US-I9-01',
    ruleCode: 'I9-FED-VERIF',
    name: 'Form I-9 List A or (List B + List C) Completeness',
    documentType: 'Form I-9 & Supporting Evidence',
    department: 'All Departments',
    jobRole: 'All Roles',
    location: 'All US States',
    workerType: 'All Worker Types',
    conditionDescription: 'File must contain either List A document OR both List B photo identity AND List C employment authorization documents.',
    validityPeriodMonths: 36,
    reminderNoticeDays: 90,
    severity: 'High',
    slaDays: 3,
    evidenceSources: ['Workday', 'DocuSign', 'SharePoint'],
    humanApprovalRequired: true,
    confidenceThreshold: 90,
    effectiveDate: '2025-08-01',
    sourcePolicyId: 'POL-I9-42',
    sourceClause: 'Section 2.1: Identity and Work Authorization Combinations',
    version: 'v4.2',
    status: 'Published',
    approvedBy: 'Legal Counsel (Compliance)',
    approvedAt: '2025-07-28T11:00:00Z'
  },
  {
    id: 'RULE-CORP-ETHICS-01',
    ruleCode: 'CORP-ETHICS-ACK',
    name: 'Annual Code of Ethics DocuSign Envelope',
    documentType: 'DocuSign Envelope Acknowledgment',
    department: 'All Departments',
    jobRole: 'All Roles',
    location: 'All US States',
    workerType: 'Full-Time Regular',
    conditionDescription: 'Envelope must be marked Completed with valid electronic signature and timestamp within 365 days.',
    validityPeriodMonths: 12,
    reminderNoticeDays: 30,
    severity: 'Medium',
    slaDays: 30,
    evidenceSources: ['DocuSign', 'Workday'],
    humanApprovalRequired: false,
    confidenceThreshold: 95,
    effectiveDate: '2026-03-01',
    sourcePolicyId: 'POL-ETH-24',
    sourceClause: 'Section 1.3: Annual Acknowledgment',
    version: 'v2.4',
    status: 'Published',
    approvedBy: 'HR Systems Admin',
    approvedAt: '2026-02-28T09:30:00Z'
  }
];

export const INITIAL_RULE_VERSIONS: RuleVersion[] = [
  {
    version: 'v3.8',
    ruleId: 'RULE-CA-PHARM-01',
    ruleName: 'California Clinical Research Pharmacist Licensure',
    author: 'Priya Sharma',
    status: 'Published',
    testPassRate: 100,
    evalScore: '10/10 Fixtures Passed (Gate Cleared)',
    effectiveDate: '2026-01-15',
    approvedBy: 'Dr. Aris Thorne (Chief Medical Officer)',
    notes: 'Current production rule for California clinical licensure verification.',
    diffSummary: 'Baseline rule deployed.'
  },
  {
    version: 'v3.9-draft',
    ruleId: 'RULE-CA-PHARM-01',
    ruleName: 'California Clinical Research Pharmacist Licensure (Enhanced)',
    author: 'Priya Sharma',
    status: 'Draft',
    testPassRate: 100,
    evalScore: 'Ready for Sandbox Run',
    effectiveDate: '2026-12-01',
    notes: 'Adds support for direct California State Board online verification tokens and reduces false positive edge cases.',
    diffSummary: '+ Added California State Board API token verification clause; + Extended reminder interval to 60 days.'
  }
];

export const INITIAL_EVAL_FIXTURES: EvalFixture[] = [
  {
    id: 'FIX-01',
    name: 'Daniel Kim — Expired California License',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Clinical Research Pharmacist in California. License #RPH-84920 expired on 2026-09-15. Today is past expiration date.',
    expectedOutcome: 'FLAG_EXPIRED',
    actualOutcome: 'FLAG_EXPIRED',
    status: 'pass',
    confidence: 96,
    evidenceSummary: 'CA Board of Pharmacy License #RPH-84920, Issued 2024-09-15, Expired 2026-09-15',
    evidenceFilename: 'D_Kim_CA_RPh_License_2024.pdf'
  },
  {
    id: 'FIX-02',
    name: 'Sarah Jenkins — Active CA License Valid Through 2027',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Clinical Research Pharmacist in CA with active license #RPH-91044 expiring 2027-11-30.',
    expectedOutcome: 'PASS_VALID',
    actualOutcome: 'PASS_VALID',
    status: 'pass',
    confidence: 98,
    evidenceSummary: 'CA Board License #RPH-91044, Status: Active, Exp: 2027-11-30',
    evidenceFilename: 'S_Jenkins_CA_Board_License.pdf'
  },
  {
    id: 'FIX-03',
    name: 'Marcus Vance — Missing License File',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Newly transferred Clinical Pharmacist in San Francisco with no licensure document in Workday or SharePoint.',
    expectedOutcome: 'FLAG_MISSING',
    actualOutcome: 'FLAG_MISSING',
    status: 'pass',
    confidence: 99,
    evidenceSummary: 'No matching document in Workday, SharePoint, or DocuSign',
    evidenceFilename: 'N/A'
  },
  {
    id: 'FIX-04',
    name: 'Elena Rostova — Wrong Document Type (BLS CPR Card)',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Employee uploaded AHA Basic Life Support card to licensure folder instead of pharmacist license.',
    expectedOutcome: 'REJECT_WRONG_TYPE',
    actualOutcome: 'REJECT_WRONG_TYPE',
    status: 'pass',
    confidence: 94,
    evidenceSummary: 'AHA BLS Provider Card, Not State Board of Pharmacy license',
    evidenceFilename: 'Rostova_AHA_BLS_Card.pdf'
  },
  {
    id: 'FIX-05',
    name: 'David Lin — Out-of-State License (Nevada RPh)',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Pharmacist practicing in California who provided Nevada Board of Pharmacy license #NV-4819.',
    expectedOutcome: 'REJECT_WRONG_TYPE',
    actualOutcome: 'REJECT_WRONG_TYPE',
    status: 'pass',
    confidence: 95,
    evidenceSummary: 'Nevada State Board License, CA license missing for CA work location',
    evidenceFilename: 'Lin_NV_Pharmacy_License.pdf'
  },
  {
    id: 'FIX-06',
    name: 'Hannah Abbott — Valid CA License Expiring 2028',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Clinical Pharmacist in San Diego with renewal completed; valid until 2028-06-30.',
    expectedOutcome: 'PASS_VALID',
    actualOutcome: 'PASS_VALID',
    status: 'pass',
    confidence: 97,
    evidenceSummary: 'CA Board License #RPH-99201, Status: Active, Exp: 2028-06-30',
    evidenceFilename: 'Abbott_CA_Renewal_2026.pdf'
  },
  {
    id: 'FIX-07',
    name: 'Carlos Gomez — Degraded / Unreadable Scanned Image',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Low resolution mobile photo of physical certificate with obscured expiration digits.',
    expectedOutcome: 'NEEDS_HUMAN_REVIEW',
    actualOutcome: 'NEEDS_HUMAN_REVIEW',
    status: 'pass',
    confidence: 72,
    evidenceSummary: 'Expiration date blurry (OCR confidence < 75%). Flagged for HR human verification.',
    evidenceFilename: 'Gomez_Photo_Scan_004.jpg'
  },
  {
    id: 'FIX-08',
    name: 'Brian Chen — Valid CA License Expiring Dec 2026',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Clinical Pharmacist in Los Angeles, CA license valid through Dec 2026.',
    expectedOutcome: 'PASS_VALID',
    actualOutcome: 'PASS_VALID',
    status: 'pass',
    confidence: 96,
    evidenceSummary: 'CA Board License #RPH-88412, Active, Exp: 2026-12-31',
    evidenceFilename: 'Chen_CA_RPh.pdf'
  },
  {
    id: 'FIX-09',
    name: 'Rachel Adams — Valid CA License Expiring 2027',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Clinical Pharmacist, South San Francisco facility, valid through 2027.',
    expectedOutcome: 'PASS_VALID',
    actualOutcome: 'PASS_VALID',
    status: 'pass',
    confidence: 99,
    evidenceSummary: 'CA Board License #RPH-77410, Active, Exp: 2027-08-31',
    evidenceFilename: 'Adams_RPh_CA.pdf'
  },
  {
    id: 'FIX-10',
    name: 'Amanda White — Valid CA License Expiring 2028',
    ruleId: 'RULE-CA-PHARM-01',
    employeeScenario: 'Clinical Pharmacist in Palo Alto, valid through 2028.',
    expectedOutcome: 'PASS_VALID',
    actualOutcome: 'PASS_VALID',
    status: 'pass',
    confidence: 98,
    evidenceSummary: 'CA Board License #RPH-92100, Active, Exp: 2028-04-30',
    evidenceFilename: 'White_CA_RPh.pdf'
  }
];

export const INITIAL_EVAL_RUN: EvalRun = {
  runId: 'EVAL-RUN-2026-11-09',
  timestamp: '2026-11-09 14:22:10 UTC',
  ruleVersion: 'v3.8',
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

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-10419',
    name: 'Daniel Kim',
    email: 'd.kim@biovanguard.com',
    role: 'Clinical Research Pharmacist',
    department: 'R&D Operations',
    location: 'California',
    status: 'Active',
    startDate: '2023-01-10',
    manager: 'Dr. Aris Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 78,
    healthStatus: 'Critical',
    lastScanTime: '12 minutes ago',
    openGapsCount: 1,
    activeCaseId: 'CASE-9021'
  },
  {
    id: 'EMP-10482',
    name: 'Maya Thompson',
    email: 'm.thompson@biovanguard.com',
    role: 'Senior Financial Analyst',
    department: 'Corporate Finance',
    location: 'Texas',
    status: 'Active',
    startDate: '2024-03-18',
    manager: 'Robert Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 82,
    healthStatus: 'Needs Attention',
    lastScanTime: '24 minutes ago',
    openGapsCount: 1,
    activeCaseId: 'CASE-9018'
  },
  {
    id: 'EMP-10884',
    name: 'Olivia Carter',
    email: 'o.carter@biovanguard.com',
    role: 'Product Operations Lead',
    department: 'Product & Tech',
    location: 'New York',
    status: 'Active',
    startDate: '2024-06-01',
    manager: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 89,
    healthStatus: 'Needs Attention',
    lastScanTime: '35 minutes ago',
    openGapsCount: 1,
    activeCaseId: 'CASE-9014'
  },
  {
    id: 'EMP-10901',
    name: 'Marcus Vance',
    email: 'm.vance@biovanguard.com',
    role: 'Clinical Pharmacist',
    department: 'R&D Operations',
    location: 'California',
    status: 'Onboarding',
    startDate: '2026-10-15',
    manager: 'Dr. Aris Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 65,
    healthStatus: 'Critical',
    lastScanTime: '1 hour ago',
    openGapsCount: 1,
    activeCaseId: 'CASE-9030'
  },
  {
    id: 'EMP-10902',
    name: 'Carlos Gomez',
    email: 'c.gomez@biovanguard.com',
    role: 'Research Nurse Practitioner',
    department: 'Clinical Affairs',
    location: 'Texas',
    status: 'Active',
    startDate: '2023-09-01',
    manager: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 84,
    healthStatus: 'Needs Attention',
    lastScanTime: '2 hours ago',
    openGapsCount: 1,
    activeCaseId: 'CASE-9032'
  },
  {
    id: 'EMP-10903',
    name: 'Sarah Jenkins',
    email: 's.jenkins@biovanguard.com',
    role: 'Senior Clinical Pharmacist',
    department: 'R&D Operations',
    location: 'California',
    status: 'Active',
    startDate: '2022-04-12',
    manager: 'Dr. Aris Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 100,
    healthStatus: 'Complete',
    lastScanTime: '15 minutes ago',
    openGapsCount: 0
  },
  {
    id: 'EMP-10904',
    name: 'David Lin',
    email: 'd.lin@biovanguard.com',
    role: 'Biochemist Specialist',
    department: 'R&D Operations',
    location: 'California',
    status: 'Active',
    startDate: '2023-08-20',
    manager: 'Dr. Aris Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 100,
    healthStatus: 'Complete',
    lastScanTime: '45 minutes ago',
    openGapsCount: 0
  },
  {
    id: 'EMP-10905',
    name: 'Elena Rostova',
    email: 'e.rostova@biovanguard.com',
    role: 'VP Engineering',
    department: 'Product & Tech',
    location: 'New York',
    status: 'Active',
    startDate: '2021-11-01',
    manager: 'David Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 100,
    healthStatus: 'Complete',
    lastScanTime: '30 minutes ago',
    openGapsCount: 0
  },
  {
    id: 'EMP-10906',
    name: 'Hannah Abbott',
    email: 'h.abbott@biovanguard.com',
    role: 'Clinical Pharmacist',
    department: 'R&D Operations',
    location: 'California',
    status: 'Active',
    startDate: '2024-01-15',
    manager: 'Dr. Aris Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 100,
    healthStatus: 'Complete',
    lastScanTime: '20 minutes ago',
    openGapsCount: 0
  },
  {
    id: 'EMP-10907',
    name: 'Brian Chen',
    email: 'b.chen@biovanguard.com',
    role: 'Manufacturing Compliance Lead',
    department: 'Manufacturing & Supply',
    location: 'Illinois',
    status: 'Active',
    startDate: '2022-09-10',
    manager: 'Rachel Adams',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 100,
    healthStatus: 'Complete',
    lastScanTime: '1 hour ago',
    openGapsCount: 0
  },
  {
    id: 'EMP-10908',
    name: 'Rachel Adams',
    email: 'r.adams@biovanguard.com',
    role: 'Director of QA & Compliance',
    department: 'Manufacturing & Supply',
    location: 'Illinois',
    status: 'Active',
    startDate: '2020-03-15',
    manager: 'Executive VP',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 100,
    healthStatus: 'Complete',
    lastScanTime: '1 hour ago',
    openGapsCount: 0
  },
  {
    id: 'EMP-10909',
    name: 'Amanda White',
    email: 'a.white@biovanguard.com',
    role: 'Talent Acquisition Manager',
    department: 'Talent & HR',
    location: 'Massachusetts',
    status: 'Active',
    startDate: '2023-05-18',
    manager: 'David Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    fileHealthScore: 100,
    healthStatus: 'Complete',
    lastScanTime: '3 hours ago',
    openGapsCount: 0
  },
  // Additional realistic employees to reach 30+ records
  ...Array.from({ length: 24 }).map((_, i) => {
    const names = [
      'James Wilson', 'Grace Hopper', 'Liam Neeson', 'Sophie Turner', 
      'Alexander Wright', 'Chloe Bennett', 'Zackary Taylor', 'Emily Blunt',
      'Nathan Drake', 'Lucas Scott', 'Jessica Pearson', 'Harvey Specter',
      'Donna Paulsen', 'Louis Litt', 'Rachel Zane', 'Mike Ross',
      'Tara Knowles', 'Jackson Teller', 'Kim Wexler', 'Howard Hamlin',
      'Gus Fring', 'Walter White', 'Jesse Pinkman', 'Hank Schrader'
    ];
    const depts = ['R&D Operations', 'Corporate Finance', 'Product & Tech', 'Clinical Affairs', 'Manufacturing & Supply', 'Talent & HR'];
    const locs = ['California', 'Texas', 'New York', 'Illinois', 'Massachusetts', 'North Carolina'];
    return {
      id: `EMP-${11000 + i}`,
      name: names[i] || `Worker ${i + 1}`,
      email: `${(names[i] || `worker${i}`).toLowerCase().replace(/\s+/g, '.')}@biovanguard.com`,
      role: 'Operations Specialist',
      department: depts[i % depts.length],
      location: locs[i % locs.length],
      status: 'Active' as const,
      startDate: '2024-02-01',
      manager: 'Operations Lead',
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345)}?auto=format&fit=crop&w=256&h=256&q=80`,
      fileHealthScore: 100,
      healthStatus: 'Complete' as const,
      lastScanTime: `${(i % 12) + 1} hours ago`,
      openGapsCount: 0
    };
  })
];

export const INITIAL_COMPLIANCE_CASES: ComplianceCase[] = [
  {
    id: 'CASE-9021',
    caseNumber: 'CASE-2026-9021',
    employeeId: 'EMP-10419',
    employeeName: 'Daniel Kim',
    department: 'R&D Operations',
    role: 'Clinical Research Pharmacist',
    location: 'California',
    severity: 'Critical',
    documentType: 'California State Board of Pharmacy License',
    findingSummary: 'Professional pharmacist license #RPH-84920 expired on September 15, 2026. File is 58 days out of compliance.',
    detailedWhy: {
      policyName: 'Clinical Research Licensure & Credentialing Policy v3.8',
      policyVersion: 'v3.8 (Section 4.1)',
      clause: 'Section 4.1: State Pharmacist Licensure',
      clauseText: 'All pharmacists actively engaged in clinical trials, investigational drug compounding, or site dispensing in California must possess an active, unencumbered license from the California State Board of Pharmacy. Evidence of renewal must be verified prior to expiration.',
      requirement: 'Active, unencumbered California State Board of Pharmacy License with unexpired validity date.',
      foundEvidenceSummary: 'CA State Board License #RPH-84920 found in SharePoint://R&D Compliance/Credentials/D_Kim_License.pdf. Document expiration date is 2026-09-15.',
      foundEvidenceSource: 'SharePoint Online (R&D Compliance Site)',
      expiryComparison: 'License expired on 2026-09-15. Current evaluation date is November 12, 2026 (58 days overdue).',
      agentConfidence: 96,
      uncertaintyNote: 'Document classified with high certainty (96%). No subsequent renewal certificate located in Workday, SharePoint, or DocuSign archives.',
      agentRunId: 'TRACE-AGT-884921',
      evaluatedAt: '2026-11-12T10:14:00Z'
    },
    detectedDate: '2026-11-12',
    dueDate: '2026-11-19',
    slaStatus: 'Overdue',
    status: 'RED_OPEN',
    hrmsSyncStatus: 'PENDING',
    assignedTo: 'Maya (HR Operations Manager)'
  },
  {
    id: 'CASE-9018',
    caseNumber: 'CASE-2026-9018',
    employeeId: 'EMP-10482',
    employeeName: 'Maya Thompson',
    department: 'Corporate Finance',
    role: 'Senior Financial Analyst',
    location: 'Texas',
    severity: 'High',
    documentType: 'Form I-9 List C Document',
    findingSummary: 'Form I-9 election was List B + List C. Texas Driver License (List B) is verified, but List C Employment Authorization is missing across repositories.',
    detailedWhy: {
      policyName: 'US Employment Eligibility Verification Standard v4.2',
      policyVersion: 'v4.2 (Section 2.1)',
      clause: 'Section 2.1: Identity and Work Authorization Combinations',
      clauseText: 'Employees presenting List B identity evidence must also present acceptable List C employment authorization documentation.',
      requirement: 'Unrestricted Social Security Card or Consular Report of Birth Abroad (List C).',
      foundEvidenceSummary: 'Texas Driver License found (List B, 99% confidence). No List C document located in Workday or SharePoint.',
      foundEvidenceSource: 'Workday Worker Documents',
      expiryComparison: 'Hired March 2024; List C documentation missing.',
      agentConfidence: 94,
      uncertaintyNote: 'Ingestion agent searched all 4 enterprise repositories. 0 potential List C candidates found.',
      agentRunId: 'TRACE-AGT-839218',
      evaluatedAt: '2026-11-12T09:42:00Z'
    },
    detectedDate: '2026-11-10',
    dueDate: '2026-11-17',
    slaStatus: 'Due Soon',
    status: 'RED_OPEN',
    hrmsSyncStatus: 'NOT_APPLICABLE',
    assignedTo: 'Maya (HR Operations Manager)'
  },
  {
    id: 'CASE-9014',
    caseNumber: 'CASE-2026-9014',
    employeeId: 'EMP-10884',
    employeeName: 'Olivia Carter',
    department: 'Product & Tech',
    role: 'Product Operations Lead',
    location: 'New York',
    severity: 'Medium',
    documentType: 'Annual Code of Ethics DocuSign Envelope',
    findingSummary: 'Annual Code of Ethics & Handbook acknowledgment envelope issued 34 days ago has not been executed.',
    detailedWhy: {
      policyName: 'Corporate Code of Ethics & Employee Handbook v2.4',
      policyVersion: 'v2.4 (Section 1.3)',
      clause: 'Section 1.3: Annual Acknowledgment',
      clauseText: 'Every regular employee must sign the annual Code of Ethics acknowledgment envelope via DocuSign within 30 days of issuance.',
      requirement: 'Completed DocuSign electronic signature envelope with certificate of completion.',
      foundEvidenceSummary: 'DocuSign Envelope ENV-NY-2026-0914 is in status "Sent / Unopened".',
      foundEvidenceSource: 'DocuSign API Connector',
      expiryComparison: 'Issued 34 days ago (30-day policy SLA exceeded by 4 days).',
      agentConfidence: 99,
      uncertaintyNote: 'Direct API status check against DocuSign Production envelope index.',
      agentRunId: 'TRACE-AGT-820199',
      evaluatedAt: '2026-11-11T16:00:00Z'
    },
    detectedDate: '2026-11-11',
    dueDate: '2026-11-18',
    slaStatus: 'Due Soon',
    status: 'AMBER_AWAITING_EMPLOYEE',
    hrmsSyncStatus: 'NOT_APPLICABLE',
    assignedTo: 'Maya (HR Operations Manager)'
  },
  {
    id: 'CASE-9030',
    caseNumber: 'CASE-2026-9030',
    employeeId: 'EMP-10901',
    employeeName: 'Marcus Vance',
    department: 'R&D Operations',
    role: 'Clinical Pharmacist',
    location: 'California',
    severity: 'Critical',
    documentType: 'California State Board of Pharmacy License',
    findingSummary: 'New hire onboarding in San Francisco requires initial verified California Pharmacist license prior to trial participation.',
    detailedWhy: {
      policyName: 'Clinical Research Licensure Policy v3.8',
      policyVersion: 'v3.8 (Section 4.1)',
      clause: 'Section 4.1: State Pharmacist Licensure',
      clauseText: 'Licensure must be verified prior to active duty in clinical trials.',
      requirement: 'California Pharmacist License #',
      foundEvidenceSummary: 'No document uploaded yet in onboarding package.',
      foundEvidenceSource: 'Workday Onboarding Inbox',
      agentConfidence: 99,
      uncertaintyNote: 'Pending candidate onboarding upload.',
      agentRunId: 'TRACE-AGT-891002',
      evaluatedAt: '2026-11-12T11:00:00Z'
    },
    detectedDate: '2026-11-12',
    dueDate: '2026-11-15',
    slaStatus: 'Due Soon',
    status: 'RED_OPEN',
    hrmsSyncStatus: 'NOT_APPLICABLE',
    assignedTo: 'Maya (HR Operations Manager)'
  },
  {
    id: 'CASE-9032',
    caseNumber: 'CASE-2026-9032',
    employeeId: 'EMP-10902',
    employeeName: 'Carlos Gomez',
    department: 'Clinical Affairs',
    role: 'Research Nurse Practitioner',
    location: 'Texas',
    severity: 'High',
    documentType: 'Texas Advanced Practice Registered Nurse (APRN) License',
    findingSummary: 'Submitted scan of physical certificate has unreadable expiration year due to glare/artifacting. Low OCR confidence.',
    detailedWhy: {
      policyName: 'Clinical Research Licensure Policy v3.8',
      policyVersion: 'v3.8 (Section 4.3)',
      clause: 'Section 4.3: Acceptable Evidence Standards',
      clauseText: 'Scanned records must maintain legible expiration date.',
      requirement: 'Clear legible scan or Board lookup verification.',
      foundEvidenceSummary: 'File Gomez_Photo_Scan_004.jpg has OCR confidence 72%.',
      foundEvidenceSource: 'SharePoint Online',
      agentConfidence: 72,
      uncertaintyNote: 'Ingestion agent routed to HR for human verification because confidence < 80%.',
      agentRunId: 'TRACE-AGT-891004',
      evaluatedAt: '2026-11-12T08:30:00Z'
    },
    detectedDate: '2026-11-11',
    dueDate: '2026-11-20',
    slaStatus: 'On Track',
    status: 'AMBER_NEEDS_HR_REVIEW',
    hrmsSyncStatus: 'NOT_APPLICABLE',
    assignedTo: 'Maya (HR Operations Manager)'
  }
];

export const INITIAL_REMEDIATION_TASKS: RemediationTask[] = [
  {
    id: 'TASK-9021',
    caseId: 'CASE-9021',
    employeeId: 'EMP-10419',
    employeeName: 'Daniel Kim',
    title: 'Request California Pharmacist License Renewal Evidence',
    actionRequired: 'Provide updated California Board of Pharmacy license renewal certificate or online verification record.',
    channel: 'Secure Portal',
    draftedSubject: 'Action Required: Updated California Pharmacist License Required for Clinical Trial Compliance',
    draftedBody: `Hi Daniel,

During our regular compliance verification for R&D Operations clinical personnel, our records indicate that your California State Board of Pharmacy License (#RPH-84920) expired on September 15, 2026.

To maintain active compliance with Clinical Research Licensure Policy v3.8 and state regulatory requirements, please submit your renewed license certificate or official State Board verification document by November 19, 2026.

You can upload your renewed credential securely using the one-click portal link below.

Best regards,
Maya, HR Operations Manager
BioVanguard Health Systems`,
    status: 'DRAFT',
    deadlineDate: '2026-11-19'
  }
];

export const INITIAL_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'THREAD-9021',
    caseId: 'CASE-9021',
    employeeId: 'EMP-10419',
    employeeName: 'Daniel Kim',
    subject: 'Action Required: Updated California Pharmacist License Required',
    messages: []
  }
];

export const INITIAL_CONNECTORS: HRMSConnector[] = [
  {
    id: 'conn-workday',
    name: 'Workday HCM',
    type: 'Workday',
    category: 'HRMS',
    status: 'Connected',
    lastSyncTimestamp: '2026-11-12 14:15:00 UTC',
    recordsSynced: 11420,
    endpointUrl: 'https://wd5-impl-services1.workday.com/ccx/service/biovanguard_preview/Human_Resources/v41.0',
    syncFrequency: 'Every 15 min',
    writebackEnabled: true,
    fieldMappingsCount: 12
  },
  {
    id: 'conn-sharepoint',
    name: 'SharePoint Online (R&D / HR Docs)',
    type: 'SharePoint',
    category: 'Document Repository',
    status: 'Connected',
    lastSyncTimestamp: '2026-11-12 14:10:00 UTC',
    recordsSynced: 34820,
    endpointUrl: 'https://biovanguard.sharepoint.com/sites/hr-compliance-dossiers',
    syncFrequency: 'Hourly',
    writebackEnabled: false,
    fieldMappingsCount: 6
  },
  {
    id: 'conn-docusign',
    name: 'DocuSign Enterprise',
    type: 'DocuSign',
    category: 'E-Signature',
    status: 'Connected',
    lastSyncTimestamp: '2026-11-12 13:45:00 UTC',
    recordsSynced: 14200,
    endpointUrl: 'https://na4.docusign.net/restapi/v2.1/accounts/8492019-biovanguard',
    syncFrequency: 'Every 15 min',
    writebackEnabled: false,
    fieldMappingsCount: 5
  },
  {
    id: 'conn-box',
    name: 'Box Enterprise Repository',
    type: 'Box',
    category: 'Document Repository',
    status: 'Configured',
    lastSyncTimestamp: 'Never',
    recordsSynced: 0,
    endpointUrl: 'https://api.box.com/2.0/folders/enterprise-hr',
    syncFrequency: 'Daily',
    writebackEnabled: false,
    fieldMappingsCount: 4
  }
];

export const INITIAL_FIELD_MAPPINGS: FieldMapping[] = [
  { id: 'FM-01', sourceField: 'Worker_ID', targetField: 'employeeId', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-02', sourceField: 'Legal_Full_Name', targetField: 'employeeName', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-03', sourceField: 'Business_Title', targetField: 'role', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-04', sourceField: 'Supervisory_Org', targetField: 'department', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-05', sourceField: 'Work_Location_State', targetField: 'location', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-06', sourceField: 'Employment_Status', targetField: 'status', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-07', sourceField: 'Hire_Date', targetField: 'startDate', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-08', sourceField: 'Manager_Name', targetField: 'manager', direction: 'Import Only', status: 'Mapped' },
  { id: 'FM-09', sourceField: 'Compliance_Health_Status', targetField: 'complianceStatus', direction: 'Two-Way', status: 'Mapped' },
  { id: 'FM-10', sourceField: 'Professional_License_Number', targetField: 'licenseNumber', direction: 'Two-Way', status: 'Mapped' },
  { id: 'FM-11', sourceField: 'License_Expiration_Date', targetField: 'licenseExpiration', direction: 'Two-Way', status: 'Mapped' },
  { id: 'FM-12', sourceField: 'Audit_Verification_Timestamp', targetField: 'lastVerifiedAt', direction: 'Export Only', status: 'Mapped' }
];

export const INITIAL_SYNC_RUNS: SyncRun[] = [
  {
    id: 'SYNC-RUN-8841',
    connectorId: 'conn-workday',
    connectorName: 'Workday HCM',
    direction: 'Inbound (HRMS -> Compliance)',
    timestamp: '2026-11-12 14:15:00 UTC',
    recordsFetched: 11420,
    recordsCreated: 0,
    recordsUpdated: 14,
    recordsFailed: 0,
    durationMs: 1420,
    status: 'SUCCESS',
    idempotencyKey: 'IDEMP-WD-20261112-1415'
  },
  {
    id: 'SYNC-RUN-8840',
    connectorId: 'conn-sharepoint',
    connectorName: 'SharePoint Online (R&D / HR Docs)',
    direction: 'Inbound (HRMS -> Compliance)',
    timestamp: '2026-11-12 14:10:00 UTC',
    recordsFetched: 1240,
    recordsCreated: 3,
    recordsUpdated: 28,
    recordsFailed: 0,
    durationMs: 3120,
    status: 'SUCCESS',
    idempotencyKey: 'IDEMP-SP-20261112-1410'
  },
  {
    id: 'SYNC-RUN-8839',
    connectorId: 'conn-workday',
    connectorName: 'Workday HCM',
    direction: 'Outbound (Approved Compliance -> HRMS)',
    timestamp: '2026-11-12 11:30:00 UTC',
    recordsFetched: 1,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsFailed: 1,
    durationMs: 820,
    status: 'FAILED',
    errorMessage: 'Simulated Network Glitch: Workday Web Services API rate limit threshold reached (HTTP 429). Recoverable on retry.',
    idempotencyKey: 'IDEMP-WD-OUT-FAIL-01'
  }
];

export const INITIAL_HRMS_MIRROR: Record<string, HRMSMirrorRecord> = {
  'EMP-10419': {
    employeeId: 'EMP-10419',
    workerName: 'Daniel Kim',
    jobProfile: 'Clinical Research Pharmacist',
    department: 'R&D Operations',
    location: 'California',
    workerStatus: 'Active',
    complianceStatus: 'NON_COMPLIANT_EXPIRED_LICENSE',
    licenseNumber: 'RPH-84920',
    licenseExpiration: '2026-09-15',
    auditVerified: false,
    lastSyncTimestamp: '2026-11-12 14:15:00 UTC'
  },
  'EMP-10482': {
    employeeId: 'EMP-10482',
    workerName: 'Maya Thompson',
    jobProfile: 'Senior Financial Analyst',
    department: 'Corporate Finance',
    location: 'Texas',
    workerStatus: 'Active',
    complianceStatus: 'NON_COMPLIANT_MISSING_I9',
    auditVerified: false,
    lastSyncTimestamp: '2026-11-12 14:15:00 UTC'
  },
  'EMP-10884': {
    employeeId: 'EMP-10884',
    workerName: 'Olivia Carter',
    jobProfile: 'Product Operations Lead',
    department: 'Product & Tech',
    location: 'New York',
    workerStatus: 'Active',
    complianceStatus: 'IN_REMEDIATION',
    auditVerified: false,
    lastSyncTimestamp: '2026-11-12 14:15:00 UTC'
  }
};

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUDIT-89101',
    timestamp: '2026-11-12 10:14:00 UTC',
    actor: 'Compliance Agent (System)',
    actorRole: 'Autonomous Agent',
    action: 'FLAG_NON_COMPLIANCE',
    category: 'CASE',
    targetEntityId: 'CASE-9021',
    targetEntityType: 'Case',
    details: 'Flagged expired California Pharmacist license for Daniel Kim (#RPH-84920) under Policy v3.8 Section 4.1.',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'AUDIT-89100',
    timestamp: '2026-11-12 09:42:00 UTC',
    actor: 'Compliance Agent (System)',
    actorRole: 'Autonomous Agent',
    action: 'FLAG_NON_COMPLIANCE',
    category: 'CASE',
    targetEntityId: 'CASE-9018',
    targetEntityType: 'Case',
    details: 'Flagged missing Form I-9 List C for Maya Thompson under Policy v4.2 Section 2.1.',
    hashSha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
  },
  {
    id: 'AUDIT-89099',
    timestamp: '2026-11-09 14:25:00 UTC',
    actor: 'Priya Sharma',
    actorRole: 'HR Compliance Admin',
    action: 'RUN_SANDBOX_EVAL',
    category: 'POLICY',
    targetEntityId: 'RULE-CA-PHARM-01',
    targetEntityType: 'Rule',
    details: 'Executed 10-fixture eval test suite for Rule v3.8. 10/10 passed (100% precision, 100% recall).',
    hashSha256: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'
  },
  {
    id: 'AUDIT-89098',
    timestamp: '2026-11-09 15:00:00 UTC',
    actor: 'Dr. Aris Thorne',
    actorRole: 'Chief Medical Officer (Dual Approver)',
    action: 'APPROVE_AND_PUBLISH_RULE',
    category: 'POLICY',
    targetEntityId: 'RULE-CA-PHARM-01',
    targetEntityType: 'Rule',
    details: 'Dual sign-off approved publishing Rule v3.8 into Production environment.',
    hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
  }
];

export const INITIAL_ASSUMPTIONS: BusinessValueAssumptions = {
  baselineManualMinutesPerCase: 45,
  assistedMinutesPerCase: 6,
  loadedHrHourlyRate: 62,
  averageMonthlyCases: 120,
  annualSubscriptionCost: 36000,
  annualizedImplementationCost: 12000
};

// Advanced Bounded Agents for Priya Sharma Admin console
export const ADMIN_AGENTS: AgentInfo[] = [
  {
    id: 'ingestion-agent',
    name: 'Ingestion Agent',
    purpose: 'Find, classify and associate employee documents across HR repositories with prompt-injection defenses.',
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
    purpose: 'Recommend and coordinate corrective actions with strict human approval gates (no autonomous outreach).',
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
  id: 'TRACE-AGT-884921',
  timestamp: '10:14:00 UTC',
  agentName: 'Compliance Agent',
  employeeId: 'EMP-10419',
  employeeName: 'Daniel Kim',
  action: 'Evaluate California Clinical Research Pharmacist Licensure',
  latencySec: 1.65,
  tokenCount: 1620,
  costUsd: 0.012,
  outcome: 'Flag',
  confidence: 96,
  policyVersion: 'Clinical Licensure Policy v3.8',
  modelVersion: 'gemini-1.5-pro-governed-enterprise',
  promptVersion: 'p-licensure-eval-v3.8.4',
  steps: [
    { stepNumber: 1, name: 'Employee retrieved from Workday HCM', durationMs: 110, detail: 'Worker EMP-10419 active in California R&D Operations', status: 'success' },
    { stepNumber: 2, name: 'Searched SharePoint & Workday document repositories', durationMs: 290, detail: 'Found 1 California Pharmacy Board document', status: 'success' },
    { stepNumber: 3, name: 'Taxonomy extraction on CA Pharmacist License #RPH-84920', durationMs: 440, detail: 'Expiration date detected: 2026-09-15', status: 'success' },
    { stepNumber: 4, name: 'Evaluated against Rule RULE-CA-PHARM-01', durationMs: 180, detail: 'Document expiration date (2026-09-15) < current date (2026-11-12). Overdue by 58 days.', status: 'warning' },
    { stepNumber: 5, name: 'Drafted remediation outreach recommendation', durationMs: 210, detail: 'Routed to Maya (HR Operations Manager) for mandatory human approval before employee outreach.', status: 'success' }
  ],
  inputs: {
    'Employee ID': 'EMP-10419 (Daniel Kim)',
    'Jurisdiction': 'California, United States',
    'Department': 'R&D Operations',
    'Role': 'Clinical Research Pharmacist',
    'Rule Code': 'LIC-CA-RPH'
  },
  outputs: {
    'Finding Status': 'FLAG_EXPIRED_EVIDENCE',
    'Deficiency': 'California Pharmacist License #RPH-84920 expired on 2026-09-15',
    'Confidence': '96%',
    'Recommended Action': 'Prepare and send renewal evidence request via Secure Portal'
  },
  toolsCalled: [
    'WorkdayWorkerConnector.getWorker()',
    'DocumentIndex.queryByEmployee()',
    'TaxonomyClassifier.extractLicenseMetadata()',
    'PolicyEngine.evaluateRuleset()'
  ],
  sourcesAccessed: [
    'Workday://Worker Documents/EMP-10419',
    'SharePoint://R&D Compliance/Credentials/D_Kim_License.pdf'
  ]
};

export const RECENT_TRACES: AgentTrace[] = [
  HERO_AGENT_TRACE,
  {
    id: 'TRACE-AGT-839218',
    timestamp: '09:42:00 UTC',
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
      { stepNumber: 1, name: 'Worker record loaded', durationMs: 120, detail: 'Texas Legal Entity', status: 'success' },
      { stepNumber: 2, name: 'List B document found', durationMs: 310, detail: 'Texas Driver License verified (99%)', status: 'success' },
      { stepNumber: 3, name: 'List C document checked', durationMs: 480, detail: 'No List C document found in any repository', status: 'warning' },
      { stepNumber: 4, name: 'Finding created', durationMs: 220, detail: 'Flagged with 94% calibrated confidence', status: 'success' }
    ],
    inputs: { 'Employee': 'EMP-10482 Maya Thompson', 'Requirement': 'Form I-9 List C' },
    outputs: { 'Finding': 'Missing List C Document' },
    toolsCalled: ['WorkdayWorkerConnector.getWorker()', 'DocumentIndex.queryByEmployee()'],
    sourcesAccessed: ['Workday://Worker Documents/EMP-10482']
  }
];

export const EVAL_CASES: EvalCase[] = [
  {
    id: 'EVAL-01',
    name: 'State Licensure Expiration Threshold Test',
    testSuite: 'Compliance',
    scenario: 'Employee license expires today at 23:59:59. Evaluator runs at 12:00:00.',
    expected: 'Grace period alert issued (Status: Expiring Today)',
    actual: 'Grace period alert issued (Status: Expiring Today)',
    difference: '0 days variance. Deterministic boundary check pass.',
    severity: 'High',
    owner: 'Priya Sharma',
    status: 'Resolved',
    policyUsed: 'Clinical Licensure Policy v3.8',
    promptVersion: 'p-licensure-eval-v3.8.4',
    agentTraceId: 'TRACE-AGT-884921'
  },
  {
    id: 'EVAL-02',
    name: 'Form I-9 Alternative List A Substitution',
    testSuite: 'Compliance',
    scenario: 'Employee presents US Passport (List A). System should not demand List B or C.',
    expected: 'Pass - List A fully satisfies Section 2 requirement',
    actual: 'Pass - List A fully satisfies Section 2 requirement',
    difference: 'No false positive generated.',
    severity: 'Critical',
    owner: 'Priya Sharma',
    status: 'Resolved',
    policyUsed: 'Employment Verification Policy v4.2',
    promptVersion: 'p-i9-eval-v4.2.1',
    agentTraceId: 'TRACE-AGT-839218'
  }
];

export const WORKFLOW_NODES: WorkflowNodeData[] = [
  {
    id: 'node-trigger',
    title: 'Trigger: Daily HRMS Delta & Event Stream',
    subtitle: 'Daily cron + Workday Webhook on Worker Change',
    type: 'trigger',
    trigger: 'Daily 02:00 UTC or Worker Status Changed Event'
  },
  {
    id: 'node-ingest',
    title: 'Ingestion Agent: Multi-Repository Discovery',
    subtitle: 'Extracts documents across Workday, SharePoint, DocuSign',
    type: 'agent',
    agent: 'Ingestion Agent',
    inputs: ['Worker ID', 'Connected Repositories'],
    outputs: ['Document Metadata Catalog', 'PII Masked Embeddings']
  },
  {
    id: 'node-compliance',
    title: 'Compliance Agent: Rule & Policy Evaluation',
    subtitle: 'Compares evidence against published versioned rules',
    type: 'agent',
    agent: 'Compliance Agent',
    inputs: ['Document Metadata', 'Active Policy Rules v3.8'],
    outputs: ['Compliance Finding', 'Confidence Score', 'Evidence Citations']
  },
  {
    id: 'node-gate-1',
    title: 'Decision Gate: Confidence & Sensitivity Check',
    subtitle: 'Is confidence >= 85% and no unresolvable conflict?',
    type: 'decision',
    branch: 'Confidence >= 85% -> Remediation Agent; Confidence < 85% -> HR Review'
  },
  {
    id: 'node-remediate',
    title: 'Remediation Agent: Task & Outreach Drafting',
    subtitle: 'Drafts employee message & sets due date',
    type: 'agent',
    agent: 'Remediation Agent',
    inputs: ['Finding Details', 'Policy Clause Text'],
    outputs: ['Drafted Outreach Message', 'Portal Upload Link']
  },
  {
    id: 'node-human-approval',
    title: 'Human Gate: HR Operations Approval Required',
    subtitle: 'Maya reviews and approves outreach before sending',
    type: 'human_gate',
    humanApprovalRequired: true
  },
  {
    id: 'node-employee-portal',
    title: 'Action: Secure Employee Portal Dispatch',
    subtitle: 'Employee uploads replacement certificate',
    type: 'action'
  },
  {
    id: 'node-human-closure',
    title: 'Human Gate: HR Review & Resolution Sign-Off',
    subtitle: 'Maya confirms evidence meets policy standard',
    type: 'human_gate',
    humanApprovalRequired: true
  },
  {
    id: 'node-hrms-sync',
    title: 'Action: Simulated HRMS Metadata Writeback',
    subtitle: 'Writes verified compliance status to Workday mirror',
    type: 'action'
  },
  {
    id: 'node-audit',
    title: 'Audit & Retrieval Agent: Immutable Ledger',
    subtitle: 'SHA-256 hashed audit packet generation',
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
    policyCompatibility: 'Clinical Licensure v3.8, Employment Verification v4.2',
    evalScore: '10/10 Fixtures Passed (Sandbox)',
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
    notes: 'Current production baseline. Running across 11,420 active employee files.'
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

