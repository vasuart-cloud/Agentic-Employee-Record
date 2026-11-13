import {
  ComplianceCase,
  CredentialRequirement,
  CredentialVerification,
  CredentialVerificationState,
  EvidenceItem,
  RuleDefinition,
  UserRoleId,
  Worker
} from '../types';
import { canPerformAction } from './authorization';

export interface TransitionValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Invariant: Uploading a document NEVER automatically marks a regulated license as VERIFIED_ACTIVE.
 */
export function applyEmployeeSubmissionToCase(
  caseItem: ComplianceCase,
  requirement: CredentialRequirement,
  newEvidence: EvidenceItem
): {
  updatedCase: ComplianceCase;
  updatedRequirement: CredentialRequirement;
} {
  const requiresPSV = requirement.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION';
  const nextVerificationState: CredentialVerificationState = requiresPSV
    ? 'PENDING_SOURCE_CHECK'
    : requirement.verificationState;

  return {
    updatedCase: {
      ...caseItem,
      documentState: 'REVIEW_REQUIRED',
      verificationState: nextVerificationState,
      workflowState: requiresPSV ? 'verification_pending' : 'employee_responded'
    },
    updatedRequirement: {
      ...requirement,
      documentState: 'REVIEW_REQUIRED',
      verificationState: nextVerificationState,
      evidenceItemId: newEvidence.id
    }
  };
}

/**
 * Invariant: Simulated Primary Source Verification can ONLY be executed by Credentialing Reviewer (Alex Morgan).
 * Positive result -> VERIFIED_ACTIVE.
 * Negative result (RESTRICTED / VERIFICATION_FAILED / UNVERIFIED) -> BLOCKS closure and escalates.
 */
export function applyPrimarySourceVerificationResult(
  roleId: UserRoleId,
  caseItem: ComplianceCase,
  requirement: CredentialRequirement,
  verification: CredentialVerification
): TransitionValidationResult & {
  updatedCase?: ComplianceCase;
  updatedRequirement?: CredentialRequirement;
} {
  const auth = canPerformAction(roleId, 'RUN_PRIMARY_SOURCE_VERIFICATION');
  if (!auth.allowed) {
    return { valid: false, error: auth.reason };
  }

  const returned = verification.returnedStatus;

  if (returned === 'RESTRICTED') {
    return {
      valid: true,
      updatedCase: {
        ...caseItem,
        verificationState: 'RESTRICTED',
        documentState: 'REJECTED',
        clinicalEligibilityState: 'REVIEW_REQUIRED',
        workflowState: 'escalated',
        severity: 'Critical',
        escalation: {
          id: `ESC-${Date.now().toString().slice(-5)}`,
          caseId: caseItem.id,
          workerId: caseItem.workerId,
          reason: `Authoritative verification source reported RESTRICTED/SUSPENDED status for license ${verification.licenseNumberChecked || 'on file'}. Immediate clinical leadership review required.`,
          escalatedToName: 'Dr. Aris Thorne (Clinical Compliance Leader)',
          escalatedToRole: 'Chief Medical / Pharmacy Officer',
          status: 'PENDING_REVIEW',
          createdAt: verification.checkedAt
        }
      },
      updatedRequirement: {
        ...requirement,
        verificationState: 'RESTRICTED',
        documentState: 'REJECTED',
        verificationId: verification.id
      }
    };
  }

  if (returned === 'VERIFICATION_FAILED' || returned === 'UNVERIFIED') {
    return {
      valid: true,
      updatedCase: {
        ...caseItem,
        verificationState: returned,
        workflowState: 'verification_pending'
      },
      updatedRequirement: {
        ...requirement,
        verificationState: returned,
        verificationId: verification.id
      }
    };
  }

  // Positive PSV result: VERIFIED_ACTIVE
  return {
    valid: true,
    updatedCase: {
      ...caseItem,
      verificationState: 'VERIFIED_ACTIVE',
      workflowState: 'authorized_review'
    },
    updatedRequirement: {
      ...requirement,
      verificationState: 'VERIFIED_ACTIVE',
      verificationId: verification.id
    }
  };
}

/**
 * Validates whether an administrative closure of a specific case is permitted.
 */
export function validateCaseClosure(
  roleId: UserRoleId,
  caseItem: ComplianceCase,
  rule: RuleDefinition | undefined,
  worker: Worker
): TransitionValidationResult {
  const requiresPSV = rule ? rule.conditionExpression.requirePrimarySourceVerification : false;
  const hasAuthoritativePSV = caseItem.verificationState === 'VERIFIED_ACTIVE';

  const auth = canPerformAction(roleId, 'CLOSE_ADMINISTRATIVE_CASE', {
    requiresPSV,
    hasAuthoritativePSV
  });

  if (!auth.allowed) {
    return { valid: false, error: auth.reason };
  }

  if (caseItem.verificationState === 'RESTRICTED') {
    return {
      valid: false,
      error: 'Closure blocked: Authoritative verification source reported RESTRICTED / SUSPENDED status.'
    };
  }

  if (caseItem.verificationState === 'VERIFICATION_FAILED' || caseItem.verificationState === 'UNVERIFIED') {
    return {
      valid: false,
      error: 'Closure blocked: Authoritative verification source was unavailable or failed. Manual verification retry required.'
    };
  }

  if (requiresPSV && !hasAuthoritativePSV) {
    return {
      valid: false,
      error: 'Closure blocked: Regulated license requires Primary Source Verification (VERIFIED_ACTIVE) from Credentialing.'
    };
  }

  if (caseItem.documentState === 'MISSING' || caseItem.documentState === 'REJECTED') {
    return {
      valid: false,
      error: `Closure blocked: Evidence state is ${caseItem.documentState}.`
    };
  }

  if (
    rule?.clinicalEscalationRequired &&
    worker.clinicalEligibility === 'RESTRICTED_BY_AUTHORIZED_DECISION'
  ) {
    return {
      valid: false,
      error: 'Closure blocked: Clinical leadership recorded RESTRICTED_BY_AUTHORIZED_DECISION for this worker.'
    };
  }

  return { valid: true };
}
