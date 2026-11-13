import {
  ApplicabilityOutcome,
  CredentialRequirement,
  CredentialVerification,
  EmploymentAssignment,
  EvidenceItem,
  FixtureEvaluationResult,
  RuleDefinition,
  TestFixture,
  TestRun,
  Worker
} from '../types';

export const DEMO_REFERENCE_DATE = '2026-11-12';

/**
 * Date-safe day delta calculation (dateB - dateA in whole calendar days).
 */
export function daysBetweenDates(dateAStr: string, dateBStr: string): number {
  const a = new Date(`${dateAStr.slice(0, 10)}T00:00:00Z`).getTime();
  const b = new Date(`${dateBStr.slice(0, 10)}T00:00:00Z`).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

/**
 * Deterministic structural signature of a rule's evaluation parameters.
 * Used to detect rule edits after a sandbox test run so stale tests cannot clear a release gate.
 */
export function computeRuleSnapshotHash(rule: RuleDefinition): string {
  const payload = JSON.stringify({
    id: rule.id,
    version: rule.version,
    applicability: rule.applicability,
    conditionExpression: rule.conditionExpression,
    verificationMethod: rule.verificationMethod,
    severity: rule.severity
  });
  let acc = 0;
  for (let i = 0; i < payload.length; i++) {
    acc = (acc * 31 + payload.charCodeAt(i)) >>> 0;
  }
  return `rule-${rule.id}-${rule.version}-${acc.toString(16)}`;
}

export function checkRuleApplicabilityForAssignment(
  rule: RuleDefinition,
  assignment: EmploymentAssignment
): { outcome: ApplicabilityOutcome; reason: string } {
  const { states, facilities, departments, jobProfiles, workerTypes, clinicalDutyRequiredOnly } =
    rule.applicability;

  if (clinicalDutyRequiredOnly && !assignment.isClinicalDuty) {
    return { outcome: 'NOT_APPLICABLE', reason: 'Assignment does not carry clinical duty scope.' };
  }

  const stateMatch = states.includes('ALL') || states.includes(assignment.state);
  const facilityMatch = facilities.includes('ALL') || facilities.includes(assignment.facilityId);
  const deptMatch = departments.includes('ALL') || departments.includes(assignment.department);
  const jobMatch =
    jobProfiles.includes('ALL') ||
    jobProfiles.some((jp) => assignment.jobProfile.toLowerCase().includes(jp.toLowerCase()));
  const workerTypeMatch =
    (workerTypes as string[]).includes('ALL') ||
    (workerTypes as string[]).includes(assignment.workerType);

  if (stateMatch && facilityMatch && deptMatch && jobMatch && workerTypeMatch) {
    return {
      outcome: 'REQUIRED',
      reason: `Matched ${assignment.jobProfile} (${assignment.workerType}) in ${assignment.department} at ${assignment.facilityName} (${assignment.state}).`
    };
  }

  // Flag ambiguous lab/cross-state situations where job matches but jurisdiction differs
  if (jobMatch && !stateMatch && rule.category === 'Laboratory Competency') {
    return {
      outcome: 'NEEDS_POLICY_INTERPRETATION',
      reason: `Job profile matches ${rule.name}, but assignment state (${assignment.state}) requires local Compliance review.`
    };
  }

  return { outcome: 'NOT_APPLICABLE', reason: 'Assignment outside rule applicability scope.' };
}

/**
 * Deterministic evaluator for a single sandbox test fixture against the current draft rule.
 */
export function evaluateFixtureAgainstRule(
  rule: RuleDefinition,
  fixture: TestFixture,
  referenceDate: string = DEMO_REFERENCE_DATE
): FixtureEvaluationResult {
  let actualOutcome: TestFixture['expectedOutcome'] = 'PASS_COMPLIANT';
  let reason = 'Document, jurisdiction, expiration, and primary-source status satisfy active rule parameters.';
  let suggestedFix: string | undefined;

  // 1. Outdated / superseded rule mismatch
  if (fixture.ruleVersionMatched !== rule.version && fixture.scenarioCategory === 'Outdated Rule') {
    actualOutcome = 'ROUTE_MANUAL_REVIEW';
    reason = `Fixture evaluated against rule version ${fixture.ruleVersionMatched}, which differs from current draft ${rule.version}. Re-evaluation required.`;
  }
  // 2. Restricted / Suspended board status check
  else if (fixture.boardVerificationStatus === 'RESTRICTED') {
    if (rule.conditionExpression.blockOnRestrictedBoardStatus) {
      actualOutcome = 'BLOCK_RESTRICTED';
      reason = 'Authoritative verification source returned RESTRICTED / SUSPENDED status. Clearance blocked and clinical escalation triggered.';
    } else {
      actualOutcome = 'PASS_COMPLIANT';
      reason = 'DEFECT IN DRAFT RULE: blockOnRestrictedBoardStatus is disabled, allowing a restricted credential to pass!';
      suggestedFix = 'Enable "Block clearance on Restricted/Suspended board status" in Rule Parameters.';
    }
  }
  // 3. Missing evidence
  else if (!fixture.evidenceProvided) {
    actualOutcome = 'FLAG_NON_COMPLIANT';
    reason = `Required ${rule.documentType} is missing from all searched repositories.`;
  }
  // 4. Low extraction confidence -> manual review gate
  else if (fixture.extractionConfidence < rule.conditionExpression.minConfidenceThreshold) {
    actualOutcome = 'ROUTE_MANUAL_REVIEW';
    reason = `Extraction confidence (${fixture.extractionConfidence}%) is below configured threshold (${rule.conditionExpression.minConfidenceThreshold}%). Routed to HR/Credentialing manual review.`;
  }
  // 5. Wrong document type
  else if (!fixture.evidenceTypeMatches) {
    actualOutcome = 'FLAG_NON_COMPLIANT';
    reason = `Submitted document does not match required type (${rule.documentType}).`;
  }
  // 6. Out-of-state license check
  else if (!fixture.evidenceStateMatches) {
    if (rule.conditionExpression.disallowOutOfStateLicense) {
      actualOutcome = 'FLAG_NON_COMPLIANT';
      reason = `License jurisdiction does not match assignment state (${fixture.workerState}). Out-of-state rejection enabled.`;
    } else {
      actualOutcome = 'PASS_COMPLIANT';
      reason = `DEFECT IN DRAFT RULE: disallowOutOfStateLicense is disabled, permitting non-${fixture.workerState} license!`;
      suggestedFix = 'Enable "Reject out-of-state licenses for state-scoped assignments" in Rule Parameters.';
    }
  }
  // 7. Expiration check
  else if (
    rule.conditionExpression.requireUnexpired &&
    fixture.evidenceExpirationDate &&
    daysBetweenDates(fixture.evidenceExpirationDate, referenceDate) > 0
  ) {
    const overdueDays = daysBetweenDates(fixture.evidenceExpirationDate, referenceDate);
    actualOutcome = 'FLAG_NON_COMPLIANT';
    reason = `Credential expired on ${fixture.evidenceExpirationDate} (${overdueDays} days prior to ${referenceDate}).`;
  }
  // 8. Authoritative Primary Source Verification check
  else if (
    rule.conditionExpression.requirePrimarySourceVerification &&
    (fixture.boardVerificationStatus === 'UNVERIFIED' ||
      fixture.boardVerificationStatus === 'PENDING_SOURCE_CHECK' ||
      fixture.boardVerificationStatus === 'VERIFICATION_FAILED' ||
      fixture.boardVerificationStatus === 'NOT_STARTED')
  ) {
    actualOutcome = 'ROUTE_MANUAL_REVIEW';
    reason = `Document received, but primary-source verification is ${fixture.boardVerificationStatus}. Upload alone cannot verify regulated licensure.`;
  }

  const passed = actualOutcome === fixture.expectedOutcome;

  // Confusion matrix classification:
  // Positive = needs action (FLAG_NON_COMPLIANT, ROUTE_MANUAL_REVIEW, BLOCK_RESTRICTED)
  // Negative = PASS_COMPLIANT
  const expectedPositive = fixture.expectedOutcome !== 'PASS_COMPLIANT';
  const actualPositive = actualOutcome !== 'PASS_COMPLIANT';

  let classification: FixtureEvaluationResult['classification'];
  if (expectedPositive && actualPositive) classification = 'TP';
  else if (!expectedPositive && !actualPositive) classification = 'TN';
  else if (!expectedPositive && actualPositive) classification = 'FP';
  else classification = 'FN';

  if (!passed && !suggestedFix) {
    suggestedFix = `Expected ${fixture.expectedOutcome} but draft rule produced ${actualOutcome}. Review condition expression and verification threshold.`;
  }

  return {
    fixtureId: fixture.id,
    fixtureName: fixture.name,
    expectedOutcome: fixture.expectedOutcome,
    actualOutcome,
    passed,
    classification,
    reason,
    suggestedFix
  };
}

/**
 * Executes an entire deterministic sandbox evaluation run for a rule against its fixtures.
 * Zero-denominator precision/recall/accuracy values are returned as null ('N/A' in UI).
 */
export function runRuleEvaluation(
  rule: RuleDefinition,
  fixtures: TestFixture[],
  referenceDate: string = DEMO_REFERENCE_DATE
): TestRun {
  const scopedFixtures = fixtures.filter((f) => f.ruleId === rule.id);
  const results = scopedFixtures.map((f) => evaluateFixtureAgainstRule(rule, f, referenceDate));

  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;
  let passedCount = 0;
  let blockedOutcomesCount = 0;

  for (const r of results) {
    if (r.passed) passedCount++;
    if (r.actualOutcome === 'BLOCK_RESTRICTED') blockedOutcomesCount++;
    if (r.classification === 'TP') tp++;
    else if (r.classification === 'TN') tn++;
    else if (r.classification === 'FP') fp++;
    else fn++;
  }

  const totalFixtures = results.length;
  const failedCount = totalFixtures - passedCount;

  const precision = tp + fp > 0 ? Math.round((tp / (tp + fp)) * 1000) / 10 : null;
  const recall = tp + fn > 0 ? Math.round((tp / (tp + fn)) * 1000) / 10 : null;
  const accuracy = totalFixtures > 0 ? Math.round((passedCount / totalFixtures) * 1000) / 10 : null;

  const categoriesCovered = new Set(scopedFixtures.map((f) => f.scenarioCategory)).size;
  const coveragePercent = totalFixtures > 0 ? Math.min(100, Math.round((categoriesCovered / 8) * 100)) : 0;

  const gateBlockReasons: string[] = [];
  if (totalFixtures === 0) {
    gateBlockReasons.push('No test fixtures executed for this rule.');
  }
  if (failedCount > 0) {
    gateBlockReasons.push(`${failedCount} fixture(s) failed expected outcome check.`);
  }
  if (fn > 0) {
    gateBlockReasons.push(`${fn} False Negative(s): dangerous non-compliant or restricted fixture passed unchecked.`);
  }

  const gatePassed = gateBlockReasons.length === 0;

  return {
    runId: `EVAL-${Date.now().toString().slice(-6)}`,
    timestamp: `${referenceDate} 14:30:00 UTC`,
    ruleId: rule.id,
    ruleVersion: rule.version,
    ruleSnapshotHash: computeRuleSnapshotHash(rule),
    totalFixtures,
    passedCount,
    failedCount,
    tp,
    tn,
    fp,
    fn,
    precision,
    recall,
    accuracy,
    coveragePercent,
    blockedOutcomesCount,
    gatePassed,
    gateBlockReasons,
    results
  };
}

/**
 * Evaluates Form I-9 acceptability: List A OR (List B AND List C).
 * Never requires List C when an acceptable List A document is verified.
 */
export function evaluateFormI9Acceptability(evidenceItems: EvidenceItem[]): {
  isComplete: boolean;
  summary: string;
  missingReason?: string;
} {
  const hasListA = evidenceItems.some(
    (e) =>
      (e.documentType.includes('List A') || e.documentType.includes('US Passport')) &&
      e.status === 'ACCEPTED'
  );
  if (hasListA) {
    return {
      isComplete: true,
      summary: 'Employee presented acceptable List A document establishing both identity and employment authorization.'
    };
  }

  const hasListB = evidenceItems.some(
    (e) =>
      (e.documentType.includes('List B') || e.documentType.includes('Driver License')) &&
      e.status === 'ACCEPTED'
  );
  const hasListC = evidenceItems.some(
    (e) =>
      (e.documentType.includes('List C') ||
        e.documentType.includes('Social Security Card') ||
        e.documentType.includes('Birth Certificate')) &&
      e.status === 'ACCEPTED'
  );

  if (hasListB && hasListC) {
    return {
      isComplete: true,
      summary: 'Employee presented acceptable List B identity document plus acceptable List C employment authorization document.'
    };
  }

  if (hasListB && !hasListC) {
    return {
      isComplete: false,
      summary: 'List B identity document verified; corresponding List C employment authorization document missing.',
      missingReason: 'Employee may provide any acceptable List C document (or substitute an acceptable List A document).'
    };
  }

  return {
    isComplete: false,
    summary: 'Form I-9 Section 2 acceptable documentation incomplete.',
    missingReason: 'Requires either an acceptable List A document OR an acceptable List B + List C combination.'
  };
}

/**
 * Evaluates applicable requirements for a worker's assignments (e.g., on New Hire or Role Transfer).
 */
export function buildRequirementsForWorkerAssignments(
  worker: Worker,
  assignments: EmploymentAssignment[],
  publishedRules: RuleDefinition[],
  existingRequirements: CredentialRequirement[],
  existingEvidence: EvidenceItem[],
  existingVerifications: CredentialVerification[],
  referenceDate: string = DEMO_REFERENCE_DATE
): CredentialRequirement[] {
  const newReqs: CredentialRequirement[] = [];

  for (const assignment of assignments.filter((a) => a.workerId === worker.id)) {
    for (const rule of publishedRules.filter((r) => r.status === 'Published')) {
      const app = checkRuleApplicabilityForAssignment(rule, assignment);
      if (app.outcome === 'NOT_APPLICABLE') continue;

      const existing = existingRequirements.find(
        (req) =>
          req.workerId === worker.id &&
          req.assignmentId === assignment.id &&
          req.ruleId === rule.id
      );

      if (existing) {
        newReqs.push({ ...existing, applicabilityOutcome: app.outcome, lastEvaluatedAt: referenceDate });
        continue;
      }

      const matchingEv = existingEvidence.find(
        (ev) => ev.workerId === worker.id && ev.documentType.toLowerCase().includes(rule.documentType.toLowerCase().split(' ')[0])
      );
      const matchingVerif = existingVerifications.find(
        (v) => v.workerId === worker.id && matchingEv && v.evidenceItemId === matchingEv.id
      );

      newReqs.push({
        requirementId: `REQ-${worker.id}-${assignment.id}-${rule.ruleCode}`,
        workerId: worker.id,
        assignmentId: assignment.id,
        ruleId: rule.id,
        ruleCode: rule.ruleCode,
        name: `${rule.name} (${assignment.facilityName})`,
        category: rule.category,
        applicabilityOutcome: app.outcome,
        verificationMethod: rule.verificationMethod,
        documentState: matchingEv ? matchingEv.status : 'MISSING',
        verificationState: matchingVerif
          ? matchingVerif.returnedStatus
          : rule.conditionExpression.requirePrimarySourceVerification
          ? 'NOT_STARTED'
          : 'NOT_REQUIRED',
        dueDate: worker.employmentStatus === 'Preboarding' ? worker.startDate : referenceDate,
        lastEvaluatedAt: referenceDate,
        evidenceItemId: matchingEv?.id,
        verificationId: matchingVerif?.id
      });
    }
  }

  return newReqs;
}
