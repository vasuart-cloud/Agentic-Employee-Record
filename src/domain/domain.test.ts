import test from 'node:test';
import assert from 'node:assert/strict';
import { canPerformAction } from './authorization';
import {
  checkRuleApplicabilityForAssignment,
  computeRuleSnapshotHash,
  daysBetweenDates,
  DEMO_REFERENCE_DATE,
  evaluateFormI9Acceptability,
  runRuleEvaluation
} from './rules';
import { computeWorkerReadiness } from './readiness';
import {
  applyEmployeeSubmissionToCase,
  applyPrimarySourceVerificationResult,
  validateCaseClosure
} from './workflows';
import {
  applyAcknowledgedTxToMirror,
  mockWorkdayAdapter
} from '../integrations/MockWorkdayAdapter';
import {
  ComplianceCase,
  CredentialRequirement,
  EmploymentAssignment,
  EvidenceItem,
  HRMSMirrorRecord,
  RuleDefinition,
  SyncTransaction,
  TestFixture,
  Worker
} from '../types';

const SAMPLE_RULE: RuleDefinition = {
  id: 'RULE-CA-PHARM',
  ruleCode: 'LIC-CA-RPH',
  name: 'CA Clinical Pharmacist License',
  category: 'Statutory Licensure',
  documentType: 'CA Pharmacist License',
  acceptableAlternatives: ['CA Board of Pharmacy Active License Certificate'],
  applicability: {
    states: ['California'],
    facilities: ['FAC-CA-CRC'],
    departments: ['Pharmacy', 'R&D/Clinical Operations'],
    jobProfiles: ['Clinical Research Pharmacist'],
    workerTypes: ['Permanent', 'Contingent']
  },
  conditionExpression: {
    requireUnexpired: true,
    requirePrimarySourceVerification: true,
    minConfidenceThreshold: 85,
    disallowOutOfStateLicense: true,
    blockOnRestrictedBoardStatus: true
  },
  verificationMethod: 'PRIMARY_SOURCE_VERIFICATION',
  verificationSourceLabel: 'California Board of Pharmacy (Simulated Demo Fixture)',
  accountableOwnerRole: 'cred_alex',
  clinicalEscalationRequired: true,
  validityMonths: 24,
  internalReminderDays: 60,
  severity: 'Critical',
  slaDays: 2,
  evidenceSources: ['Workday', 'SharePoint', 'Employee Portal'],
  humanApprovalRequired: true,
  effectiveDate: '2026-01-15',
  sourcePolicyId: 'POL-CLIN-01',
  sourcePolicyVersion: 'v3.8',
  sourceClause: 'Section 4.1',
  version: 'v3.8',
  status: 'Published',
  author: 'Priya Sharma'
};

const SAMPLE_WORKER: Worker = {
  id: 'EMP-10419',
  employeeNumber: 'EMP-10419',
  name: 'Daniel Kim',
  email: 'd.kim@biovanguard-demo.example',
  primaryRole: 'Clinical Research Pharmacist',
  primaryDepartment: 'R&D/Clinical Operations',
  primaryFacilityId: 'FAC-CA-CRC',
  primaryFacilityName: 'California Clinical Research Center',
  primaryState: 'California',
  workerType: 'Permanent',
  employmentStatus: 'Active',
  hireDate: '2023-01-10',
  startDate: '2023-01-10',
  manager: 'Dr. Aris Thorne',
  initials: 'DK',
  occupationalHealthSummary: {
    clearanceStatus: 'CLEARED',
    lastClearedDate: '2026-04-10',
    restrictedAccessNote: 'Medical details restricted to Occupational Health EHR.'
  },
  privilegingReference: {
    status: 'NOT_APPLICABLE'
  },
  clinicalEligibility: 'REVIEW_REQUIRED'
};

test('Authorization enforces role boundaries, self-approval separation, and PHI isolation', () => {
  const mayaPSV = canPerformAction('hr_ops_maya', 'RUN_PRIMARY_SOURCE_VERIFICATION');
  assert.equal(mayaPSV.allowed, false);

  const mayaClinical = canPerformAction('hr_ops_maya', 'RECORD_CLINICAL_DUTY_ELIGIBILITY');
  assert.equal(mayaClinical.allowed, false);

  const priyaSelfApprove = canPerformAction('admin_priya', 'APPROVE_RULE_PUBLICATION', {
    ruleAuthorName: 'Priya Sharma',
    currentActorName: 'Priya Sharma'
  });
  assert.equal(priyaSelfApprove.allowed, false);

  const alexApprove = canPerformAction('cred_alex', 'APPROVE_RULE_PUBLICATION', {
    ruleAuthorName: 'Priya Sharma',
    currentActorName: 'Alex Morgan'
  });
  assert.equal(alexApprove.allowed, true);

  const rawPhi = canPerformAction('chro_david', 'VIEW_OCCUPATIONAL_HEALTH_RAW');
  assert.equal(rawPhi.allowed, false);
});

test('Rule applicability and Form I-9 List A vs List B+C evaluation', () => {
  const caAssignment: EmploymentAssignment = {
    id: 'ASN-1',
    workerId: 'EMP-10419',
    facilityId: 'FAC-CA-CRC',
    facilityName: 'California Clinical Research Center',
    state: 'California',
    department: 'R&D/Clinical Operations',
    jobProfile: 'Clinical Research Pharmacist',
    workerType: 'Permanent',
    effectiveStartDate: '2023-01-10',
    isPrimary: true,
    isClinicalDuty: true
  };
  const txAssignment: EmploymentAssignment = {
    ...caAssignment,
    id: 'ASN-2',
    facilityId: 'FAC-TX-HOSP',
    facilityName: 'Texas Hospital',
    state: 'Texas'
  };

  assert.equal(checkRuleApplicabilityForAssignment(SAMPLE_RULE, caAssignment).outcome, 'REQUIRED');
  assert.equal(checkRuleApplicabilityForAssignment(SAMPLE_RULE, txAssignment).outcome, 'NOT_APPLICABLE');

  const listAOnly: EvidenceItem[] = [
    {
      id: 'EV-1',
      workerId: 'EMP-10482',
      requirementId: 'REQ-I9',
      documentName: 'US Passport',
      documentType: 'Form I-9 List A (US Passport)',
      sourceSystem: 'Workday',
      sourceUri: 'workday://docs/passport',
      uploadedAt: '2026-01-01',
      asOfTimestamp: '2026-11-12',
      extractionConfidence: 98,
      extractionMethodNote: 'Seeded demo fixture',
      fileSize: '420 KB',
      mimeType: 'application/pdf',
      status: 'ACCEPTED',
      extractedFields: []
    }
  ];
  assert.equal(evaluateFormI9Acceptability(listAOnly).isComplete, true);
});

test('Executable rule test lab detects real misconfiguration failures and handles zero denominators with null (N/A)', () => {
  const emptyRun = runRuleEvaluation(SAMPLE_RULE, [], DEMO_REFERENCE_DATE);
  assert.equal(emptyRun.precision, null);
  assert.equal(emptyRun.recall, null);
  assert.equal(emptyRun.accuracy, null);
  assert.equal(emptyRun.gatePassed, false);

  const fixtures: TestFixture[] = [
    {
      id: 'FIX-OUT-OF-STATE',
      name: 'Nevada License in CA',
      ruleId: SAMPLE_RULE.id,
      scenarioCategory: 'Out-of-State',
      workerState: 'California',
      workerFacility: 'FAC-CA-CRC',
      workerDepartment: 'R&D/Clinical Operations',
      workerJobProfile: 'Clinical Research Pharmacist',
      workerType: 'Permanent',
      evidenceProvided: true,
      evidenceTypeMatches: true,
      evidenceStateMatches: false,
      evidenceExpirationDate: '2028-01-01',
      extractionConfidence: 96,
      boardVerificationStatus: 'VERIFIED_ACTIVE',
      ruleVersionMatched: 'v3.8',
      expectedOutcome: 'FLAG_NON_COMPLIANT',
      description: 'Should flag Nevada license'
    },
    {
      id: 'FIX-VALID',
      name: 'Valid CA License',
      ruleId: SAMPLE_RULE.id,
      scenarioCategory: 'Complete',
      workerState: 'California',
      workerFacility: 'FAC-CA-CRC',
      workerDepartment: 'R&D/Clinical Operations',
      workerJobProfile: 'Clinical Research Pharmacist',
      workerType: 'Permanent',
      evidenceProvided: true,
      evidenceTypeMatches: true,
      evidenceStateMatches: true,
      evidenceExpirationDate: '2028-01-01',
      extractionConfidence: 97,
      boardVerificationStatus: 'VERIFIED_ACTIVE',
      ruleVersionMatched: 'v3.8',
      expectedOutcome: 'PASS_COMPLIANT',
      description: 'Valid'
    }
  ];

  // Broken draft rule: disallowOutOfStateLicense = false
  const brokenRule: RuleDefinition = {
    ...SAMPLE_RULE,
    conditionExpression: { ...SAMPLE_RULE.conditionExpression, disallowOutOfStateLicense: false }
  };
  const failedRun = runRuleEvaluation(brokenRule, fixtures, DEMO_REFERENCE_DATE);
  assert.equal(failedRun.gatePassed, false);
  assert.equal(failedRun.fn, 1);
  assert.equal(failedRun.failedCount, 1);

  // Fixed rule
  const fixedRun = runRuleEvaluation(SAMPLE_RULE, fixtures, DEMO_REFERENCE_DATE);
  assert.equal(fixedRun.gatePassed, true);
  assert.equal(fixedRun.passedCount, 2);
  assert.notEqual(computeRuleSnapshotHash(brokenRule), computeRuleSnapshotHash(SAMPLE_RULE));
});

test('Whole-file readiness stays incomplete when closing 1 of 2 applicable requirements', () => {
  const req1: CredentialRequirement = {
    requirementId: 'REQ-LIC',
    workerId: 'EMP-10419',
    assignmentId: 'ASN-1',
    ruleId: 'RULE-CA-PHARM',
    ruleCode: 'LIC-CA-RPH',
    name: 'CA Pharmacist License',
    category: 'Statutory Licensure',
    applicabilityOutcome: 'REQUIRED',
    verificationMethod: 'PRIMARY_SOURCE_VERIFICATION',
    documentState: 'ACCEPTED',
    verificationState: 'VERIFIED_ACTIVE',
    dueDate: '2026-11-12',
    lastEvaluatedAt: '2026-11-12'
  };
  const req2: CredentialRequirement = {
    requirementId: 'REQ-TRN',
    workerId: 'EMP-10419',
    assignmentId: 'ASN-1',
    ruleId: 'RULE-GCP-TRN',
    ruleCode: 'TRN-GCP-2026',
    name: 'Annual Clinical Trial GCP Training',
    category: 'Role Training',
    applicabilityOutcome: 'REQUIRED',
    verificationMethod: 'APPROVED_TRAINING_ROSTER',
    documentState: 'MISSING',
    verificationState: 'NOT_REQUIRED',
    dueDate: '2026-11-20',
    lastEvaluatedAt: '2026-11-12'
  };

  const workerAuthorized: Worker = {
    ...SAMPLE_WORKER,
    clinicalEligibility: 'AUTHORIZED_BY_DESIGNATED_LEADER'
  };

  const partial = computeWorkerReadiness(workerAuthorized, [req1, req2], [], DEMO_REFERENCE_DATE);
  assert.equal(partial.readinessPercent, 50);
  assert.equal(partial.overallStatus, 'INCOMPLETE_AMBER');

  const req2Done: CredentialRequirement = { ...req2, documentState: 'ACCEPTED' };
  const ready = computeWorkerReadiness(workerAuthorized, [req1, req2Done], [], DEMO_REFERENCE_DATE);
  assert.equal(ready.readinessPercent, 100);
  assert.equal(ready.overallStatus, 'READY');
});

test('Workflow invariants: upload never sets VERIFIED_ACTIVE, and RESTRICTED board check blocks closure', () => {
  const req: CredentialRequirement = {
    requirementId: 'REQ-LIC',
    workerId: 'EMP-10419',
    assignmentId: 'ASN-1',
    ruleId: SAMPLE_RULE.id,
    ruleCode: SAMPLE_RULE.ruleCode,
    name: 'CA Pharmacist License',
    category: 'Statutory Licensure',
    applicabilityOutcome: 'REQUIRED',
    verificationMethod: 'PRIMARY_SOURCE_VERIFICATION',
    documentState: 'REQUESTED',
    verificationState: 'EXPIRED',
    dueDate: '2026-11-12',
    lastEvaluatedAt: '2026-11-12'
  };

  const baseCase: ComplianceCase = {
    id: 'CASE-9021',
    caseNumber: 'CASE-2026-9021',
    workerId: 'EMP-10419',
    workerName: 'Daniel Kim',
    assignmentId: 'ASN-1',
    facilityId: 'FAC-CA-CRC',
    facilityName: 'California Clinical Research Center',
    department: 'R&D/Clinical Operations',
    role: 'Clinical Research Pharmacist',
    state: 'California',
    requirementId: 'REQ-LIC',
    ruleId: SAMPLE_RULE.id,
    ruleVersion: 'v3.8',
    caseCategory: 'Expired License',
    severity: 'Critical',
    title: 'Expired License',
    findingSummary: 'Expired',
    workflowState: 'evidence_requested',
    documentState: 'REQUESTED',
    verificationState: 'EXPIRED',
    clinicalEligibilityState: 'REVIEW_REQUIRED',
    externalSyncState: 'NOT_REQUIRED',
    detectedDate: '2026-11-12',
    dueDate: '2026-11-12',
    clinicalRiskOwner: 'Alex Morgan',
    hrOutreachOwner: 'Maya',
    repositoriesSearched: ['Workday', 'SharePoint'],
    whyFlagged: {
      policyName: 'Policy',
      policyVersion: 'v3.8',
      policyEffectiveDate: '2026-01-15',
      clause: '4.1',
      clauseText: 'Must be active',
      requirementText: 'CA License',
      inspectedSource: 'SharePoint',
      sourceAsOfTimestamp: '2026-11-12',
      foundEvidenceSummary: 'Expired',
      alternativesAccepted: ['CA License'],
      extractionConfidence: 96,
      confidenceDisclaimer: 'Extraction only',
      uncertaintyNote: 'PSV required',
      whyAuthoritativeVerificationRequired: 'Board is source of truth',
      agentRunId: 'RUN-1'
    },
    reviewDecisions: []
  };

  const ev: EvidenceItem = {
    id: 'EV-NEW',
    workerId: 'EMP-10419',
    requirementId: 'REQ-LIC',
    documentName: 'renewal.pdf',
    documentType: 'CA Pharmacist License',
    sourceSystem: 'Employee Portal',
    sourceUri: 'portal://upload/1',
    uploadedAt: '2026-11-12',
    asOfTimestamp: '2026-11-12',
    extractionConfidence: 0,
    extractionMethodNote: 'Manual review required',
    fileSize: '500 KB',
    mimeType: 'application/pdf',
    status: 'REVIEW_REQUIRED',
    extractedFields: []
  };

  const afterUpload = applyEmployeeSubmissionToCase(baseCase, req, ev);
  assert.notEqual(afterUpload.updatedCase.verificationState, 'VERIFIED_ACTIVE');
  assert.equal(afterUpload.updatedCase.verificationState, 'PENDING_SOURCE_CHECK');

  // Restricted board status from Alex
  const psvRes = applyPrimarySourceVerificationResult('cred_alex', afterUpload.updatedCase, afterUpload.updatedRequirement, {
    id: 'VER-1',
    workerId: 'EMP-10419',
    requirementId: 'REQ-LIC',
    method: 'PRIMARY_SOURCE_VERIFICATION',
    sourceName: 'CA Board Demo',
    sourceTypeLabel: 'Simulated Board',
    licenseNumberChecked: 'RPH-84920',
    employeeNameMatched: true,
    returnedStatus: 'RESTRICTED',
    checkedAt: '2026-11-12',
    verifierName: 'Alex Morgan',
    verifierRole: 'Credentialing Reviewer',
    receiptReference: 'REC-1',
    isSimulated: true
  });
  assert.equal(psvRes.valid, true);
  assert.equal(psvRes.updatedCase?.verificationState, 'RESTRICTED');

  const closeCheck = validateCaseClosure('hr_ops_maya', psvRes.updatedCase!, SAMPLE_RULE, SAMPLE_WORKER);
  assert.equal(closeCheck.valid, false);
});

test('MockWorkdayAdapter retries only the selected failed transaction and updates only that correlated worker mirror', async () => {
  const mirror: Record<string, HRMSMirrorRecord> = {
    'EMP-10419': {
      workerId: 'EMP-10419',
      workerName: 'Daniel Kim',
      workdayWorkerStatus: 'Active',
      jobProfile: 'Clinical Research Pharmacist',
      facilityName: 'California Clinical Research Center',
      department: 'R&D/Clinical Operations',
      assignmentEffectiveDate: '2023-01-10',
      stagingObject: {
        credentialReadinessSummary: 'ACTION_REQUIRED',
        reconciliationStatus: 'FAILED',
        lastTransactionId: 'TX-FAIL-1'
      }
    },
    'EMP-10510': {
      workerId: 'EMP-10510',
      workerName: 'Elena Alvarez',
      workdayWorkerStatus: 'Preboarding',
      jobProfile: 'Registered Nurse',
      facilityName: 'Texas Hospital',
      department: 'Nursing',
      assignmentEffectiveDate: '2026-11-19',
      stagingObject: {
        credentialReadinessSummary: 'ACTION_REQUIRED',
        reconciliationStatus: 'NOT_REQUIRED'
      }
    }
  };

  const failedTx: SyncTransaction = {
    id: 'TX-FAIL-1',
    idempotencyKey: 'idemp-CASE-9021-EMP-10419',
    connectorId: 'conn-workday',
    connectorName: 'Workday HCM',
    direction: 'Outbound (Approved Summary -> Workday Staging)',
    workerId: 'EMP-10419',
    workerName: 'Daniel Kim',
    caseId: 'CASE-9021',
    timestamp: '2026-11-12 10:00:00 UTC',
    recordsProcessed: 0,
    recordsFailed: 1,
    status: 'FAILED',
    httpStatus: 504,
    payloadPreview: {
      credentialReadinessSummary: 'PARTIAL_PENDING',
      verifiedLicenseCode: 'RPH-84920',
      verifiedLicenseThroughDate: '2028-09-15'
    },
    retryCount: 0
  };

  const retried = await mockWorkdayAdapter.retryTransaction(failedTx, { simulateTimeout504: false });
  assert.equal(retried.status, 'ACKNOWLEDGED');
  assert.equal(retried.retryCount, 1);

  const updatedMirror = applyAcknowledgedTxToMirror(mirror, retried, 'EMP-10419');
  assert.equal(updatedMirror['EMP-10419'].stagingObject.reconciliationStatus, 'ACKNOWLEDGED');
  assert.equal(updatedMirror['EMP-10419'].stagingObject.verifiedLicenseThroughDate, '2028-09-15');
  // Elena's record untouched!
  assert.equal(updatedMirror['EMP-10510'].stagingObject.reconciliationStatus, 'NOT_REQUIRED');

  // Cannot retry an already acknowledged transaction
  await assert.rejects(() => mockWorkdayAdapter.retryTransaction(retried));
});

test('Date-safe calculation computes reproducible expired license duration and preboarding days-to-start', () => {
  assert.equal(daysBetweenDates('2026-09-15', DEMO_REFERENCE_DATE), 58);
  assert.equal(daysBetweenDates(DEMO_REFERENCE_DATE, '2026-11-19'), 7);
});
