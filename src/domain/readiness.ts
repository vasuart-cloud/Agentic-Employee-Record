import {
  ClinicalDutyEligibilityState,
  ComplianceCase,
  CredentialRequirement,
  Worker
} from '../types';
import { daysBetweenDates, DEMO_REFERENCE_DATE } from './rules';

export interface WorkerReadinessSummary {
  workerId: string;
  totalApplicableRequirements: number;
  satisfiedRequirementsCount: number;
  openRequirementsCount: number;
  needsInterpretationCount: number;
  openCasesCount: number;
  criticalCasesCount: number;
  readinessPercent: number | null; // null when coverage unknown (0 evaluated requirements)
  overallStatus: 'READY' | 'INCOMPLETE_AMBER' | 'CRITICAL_RED' | 'COVERAGE_UNKNOWN';
  overallStatusLabel: string;
  administrativeOnboardingPercent: number;
  clinicalDutyReadiness: ClinicalDutyEligibilityState;
  daysToStart: number | null; // calculated dynamically for preboarding workers
  blockingReasons: string[];
}

export function isRequirementSatisfied(req: CredentialRequirement): boolean {
  if (req.applicabilityOutcome === 'NOT_APPLICABLE') return true;
  if (req.applicabilityOutcome === 'NEEDS_POLICY_INTERPRETATION') return false;

  const docOk = req.documentState === 'ACCEPTED';
  if (!docOk) return false;

  // If Primary Source Verification is required, document receipt alone is NOT enough!
  if (req.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION') {
    return req.verificationState === 'VERIFIED_ACTIVE';
  }

  return req.verificationState === 'NOT_REQUIRED' || req.verificationState === 'VERIFIED_ACTIVE';
}

export function computeWorkerReadiness(
  worker: Worker,
  requirements: CredentialRequirement[],
  cases: ComplianceCase[],
  referenceDate: string = DEMO_REFERENCE_DATE
): WorkerReadinessSummary {
  const workerReqs = requirements.filter(
    (r) => r.workerId === worker.id && r.applicabilityOutcome !== 'NOT_APPLICABLE'
  );
  const workerCases = cases.filter((c) => c.workerId === worker.id);
  const openCases = workerCases.filter((c) => c.workflowState !== 'resolved');
  const criticalCases = openCases.filter((c) => c.severity === 'Critical');

  const needsInterpretationCount = workerReqs.filter(
    (r) => r.applicabilityOutcome === 'NEEDS_POLICY_INTERPRETATION'
  ).length;

  const totalApplicableRequirements = workerReqs.length;
  const satisfiedRequirementsCount = workerReqs.filter(isRequirementSatisfied).length;
  const openRequirementsCount = totalApplicableRequirements - satisfiedRequirementsCount;

  // Administrative onboarding / non-PSV readiness
  const adminReqs = workerReqs.filter((r) => r.verificationMethod !== 'PRIMARY_SOURCE_VERIFICATION');
  const adminSatisfied = adminReqs.filter(isRequirementSatisfied).length;
  const administrativeOnboardingPercent =
    adminReqs.length > 0 ? Math.round((adminSatisfied / adminReqs.length) * 100) : 100;

  const daysToStart =
    worker.employmentStatus === 'Preboarding'
      ? daysBetweenDates(referenceDate, worker.startDate)
      : null;

  const blockingReasons: string[] = [];
  for (const r of workerReqs) {
    if (!isRequirementSatisfied(r)) {
      if (r.applicabilityOutcome === 'NEEDS_POLICY_INTERPRETATION') {
        blockingReasons.push(`${r.name}: Needs policy interpretation`);
      } else if (r.verificationState === 'RESTRICTED') {
        blockingReasons.push(`${r.name}: Authoritative source reported RESTRICTED / SUSPENDED`);
      } else if (r.verificationState === 'EXPIRED') {
        blockingReasons.push(`${r.name}: Credential expired`);
      } else if (r.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION' && r.verificationState !== 'VERIFIED_ACTIVE') {
        blockingReasons.push(`${r.name}: Primary-source verification is ${r.verificationState}`);
      } else {
        blockingReasons.push(`${r.name}: Evidence is ${r.documentState}`);
      }
    }
  }

  if (worker.clinicalEligibility === 'REVIEW_REQUIRED') {
    blockingReasons.push('Clinical duty eligibility decision pending designated clinical leader review.');
  } else if (worker.clinicalEligibility === 'RESTRICTED_BY_AUTHORIZED_DECISION') {
    blockingReasons.push('Clinical duties restricted by authorized clinical leadership decision.');
  }

  // Coverage unknown if zero applicable requirements have been evaluated yet
  if (totalApplicableRequirements === 0 || needsInterpretationCount === totalApplicableRequirements) {
    return {
      workerId: worker.id,
      totalApplicableRequirements,
      satisfiedRequirementsCount,
      openRequirementsCount,
      needsInterpretationCount,
      openCasesCount: openCases.length,
      criticalCasesCount: criticalCases.length,
      readinessPercent: null,
      overallStatus: 'COVERAGE_UNKNOWN',
      overallStatusLabel: 'Coverage Unknown',
      administrativeOnboardingPercent,
      clinicalDutyReadiness: worker.clinicalEligibility,
      daysToStart,
      blockingReasons
    };
  }

  const readinessPercent = Math.round((satisfiedRequirementsCount / totalApplicableRequirements) * 100);

  let overallStatus: WorkerReadinessSummary['overallStatus'] = 'READY';
  let overallStatusLabel = 'All Applicable Requirements Ready';

  const hasRestrictedOrCritical =
    criticalCases.length > 0 ||
    workerReqs.some((r) => r.verificationState === 'RESTRICTED' || r.verificationState === 'EXPIRED') ||
    worker.clinicalEligibility === 'RESTRICTED_BY_AUTHORIZED_DECISION';

  if (hasRestrictedOrCritical && openRequirementsCount > 0) {
    overallStatus = 'CRITICAL_RED';
    overallStatusLabel = 'Action Required · Clinical/Critical Gap';
  } else if (
    openRequirementsCount > 0 ||
    openCases.length > 0 ||
    worker.clinicalEligibility === 'REVIEW_REQUIRED'
  ) {
    overallStatus = 'INCOMPLETE_AMBER';
    overallStatusLabel =
      openRequirementsCount > 0
        ? `Incomplete · ${openRequirementsCount} Requirement(s) Open`
        : 'Clinical Eligibility Review Pending';
  }

  return {
    workerId: worker.id,
    totalApplicableRequirements,
    satisfiedRequirementsCount,
    openRequirementsCount,
    needsInterpretationCount,
    openCasesCount: openCases.length,
    criticalCasesCount: criticalCases.length,
    readinessPercent,
    overallStatus,
    overallStatusLabel,
    administrativeOnboardingPercent,
    clinicalDutyReadiness: worker.clinicalEligibility,
    daysToStart,
    blockingReasons
  };
}

export function getCaseDurationDays(caseItem: ComplianceCase, referenceDate: string = DEMO_REFERENCE_DATE): number {
  return Math.max(0, daysBetweenDates(caseItem.detectedDate, referenceDate));
}

export function getCaseDaysUntilDue(caseItem: ComplianceCase, referenceDate: string = DEMO_REFERENCE_DATE): number {
  return daysBetweenDates(referenceDate, caseItem.dueDate);
}
