import { UserRoleId } from '../types';

export type PermissionAction =
  | 'VIEW_WEEKLY_QUEUE'
  | 'VIEW_EMPLOYEE_DOSSIER_OPERATIONAL'
  | 'VIEW_OCCUPATIONAL_HEALTH_RAW'
  | 'SEND_EMPLOYEE_OUTREACH'
  | 'ASSIGN_CASE_OWNER'
  | 'REVIEW_ORDINARY_HR_EVIDENCE'
  | 'RUN_PRIMARY_SOURCE_VERIFICATION'
  | 'APPROVE_CLINICAL_CREDENTIAL'
  | 'RECORD_CLINICAL_DUTY_ELIGIBILITY'
  | 'CLOSE_ADMINISTRATIVE_CASE'
  | 'CREATE_DRAFT_RULE'
  | 'RUN_RULE_SANDBOX_EVAL'
  | 'SUBMIT_RULE_FOR_APPROVAL'
  | 'APPROVE_RULE_PUBLICATION'
  | 'TRIGGER_WORKDAY_SYNC'
  | 'TRIGGER_KILL_SWITCH'
  | 'VIEW_EXECUTIVE_DASHBOARD';

export interface AuthorizationCheckResult {
  allowed: boolean;
  reason: string;
  requiredRoleHint?: string;
  isSimulatedControlNotice: string;
}

const SIMULATED_NOTICE =
  'Simulated browser persona control (Demo Mode). Production deployments require enterprise SSO (SAML/OIDC) and server-side API authorization.';

const ROLE_LABELS: Record<UserRoleId, string> = {
  hr_ops_maya: 'Maya (HR Operations Lead)',
  admin_priya: 'Priya Sharma (Healthcare Compliance Admin)',
  chro_david: 'David Miller (CHRO / VP People)',
  cred_alex: 'Alex Morgan (Credentialing / Clinical Compliance Reviewer)'
};

export function canPerformAction(
  roleId: UserRoleId,
  action: PermissionAction,
  context?: {
    ruleAuthorName?: string;
    currentActorName?: string;
    hasAuthoritativePSV?: boolean;
    requiresPSV?: boolean;
    isClinicalLeadershipSignOff?: boolean;
  }
): AuthorizationCheckResult {
  // Absolute boundary: raw occupational medical PHI is NEVER exposed in general HR/CHRO/Admin dossiers
  if (action === 'VIEW_OCCUPATIONAL_HEALTH_RAW') {
    return {
      allowed: false,
      reason:
        'Restricted Occupational Health / ADA medical details are isolated from HR Operations, Compliance Admin, and Executive views. Only clearance status is displayed.',
      requiredRoleHint: 'Occupational Health EHR (External Restricted System)',
      isSimulatedControlNotice: SIMULATED_NOTICE
    };
  }

  // Executive CHRO (David): Read-only aggregate insights & authorized drill-down, no operational approve/send/edit
  if (roleId === 'chro_david') {
    if (action === 'VIEW_EXECUTIVE_DASHBOARD') {
      return {
        allowed: true,
        reason: 'Executive read-only access granted for aggregate facility readiness and business value.',
        isSimulatedControlNotice: SIMULATED_NOTICE
      };
    }
    return {
      allowed: false,
      reason: `${ROLE_LABELS[roleId]} has read-only executive insight access and cannot modify cases, send employee outreach, or approve credentials.`,
      requiredRoleHint: 'Maya (HR Operations) or Alex Morgan (Credentialing)',
      isSimulatedControlNotice: SIMULATED_NOTICE
    };
  }

  // HR Operations Lead (Maya)
  if (roleId === 'hr_ops_maya') {
    switch (action) {
      case 'VIEW_WEEKLY_QUEUE':
      case 'VIEW_EMPLOYEE_DOSSIER_OPERATIONAL':
      case 'SEND_EMPLOYEE_OUTREACH':
      case 'ASSIGN_CASE_OWNER':
      case 'REVIEW_ORDINARY_HR_EVIDENCE':
      case 'TRIGGER_WORKDAY_SYNC':
        return {
          allowed: true,
          reason: 'Permitted under HR Operations Lead scope.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'CLOSE_ADMINISTRATIVE_CASE':
        if (context?.requiresPSV && !context?.hasAuthoritativePSV) {
          return {
            allowed: false,
            reason:
              'Cannot close a regulated clinical licensure case before Credentialing completes an authoritative Primary Source Verification (VERIFIED_ACTIVE).',
            requiredRoleHint: 'Alex Morgan (Credentialing Reviewer)',
            isSimulatedControlNotice: SIMULATED_NOTICE
          };
        }
        return {
          allowed: true,
          reason: 'Permitted to record final administrative closure after required verification is complete.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'RUN_PRIMARY_SOURCE_VERIFICATION':
      case 'APPROVE_CLINICAL_CREDENTIAL':
        return {
          allowed: false,
          reason:
            'HR Operations cannot independently mark a regulated clinical license as Primary-Source Verified. Route to Credentialing / Clinical Compliance.',
          requiredRoleHint: 'Alex Morgan (Credentialing Reviewer)',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'RECORD_CLINICAL_DUTY_ELIGIBILITY':
        return {
          allowed: false,
          reason:
            'HR Operations cannot authorize or restrict clinical duties. Clinical duty eligibility must be recorded by Credentialing / Clinical Leadership.',
          requiredRoleHint: 'Authorized Clinical Leader / Credentialing Reviewer',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'CREATE_DRAFT_RULE':
      case 'RUN_RULE_SANDBOX_EVAL':
      case 'SUBMIT_RULE_FOR_APPROVAL':
      case 'APPROVE_RULE_PUBLICATION':
      case 'TRIGGER_KILL_SWITCH':
        return {
          allowed: false,
          reason: 'Policy authoring, rule publishing, and AI kill-switch controls are restricted to Compliance Administration.',
          requiredRoleHint: 'Priya Sharma (Healthcare Compliance Admin)',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      default:
        return {
          allowed: false,
          reason: 'Action not permitted for HR Operations Lead.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
    }
  }

  // Healthcare Compliance Admin (Priya)
  if (roleId === 'admin_priya') {
    switch (action) {
      case 'CREATE_DRAFT_RULE':
      case 'RUN_RULE_SANDBOX_EVAL':
      case 'SUBMIT_RULE_FOR_APPROVAL':
      case 'TRIGGER_WORKDAY_SYNC':
      case 'TRIGGER_KILL_SWITCH':
      case 'VIEW_WEEKLY_QUEUE':
      case 'VIEW_EMPLOYEE_DOSSIER_OPERATIONAL':
        return {
          allowed: true,
          reason: 'Permitted under Healthcare Compliance Administrator governance scope.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'APPROVE_RULE_PUBLICATION':
        // Enforce author != approver separation!
        if (
          context?.ruleAuthorName &&
          context?.currentActorName &&
          context.ruleAuthorName.toLowerCase() === context.currentActorName.toLowerCase()
        ) {
          return {
            allowed: false,
            reason:
              'Separation of duties: Rule author (Priya Sharma) cannot approve her own policy version. Switch to an independent Policy Approver (Alex Morgan) in the Demo Role Menu.',
            requiredRoleHint: 'Alex Morgan (Independent Policy / Credentialing Approver)',
            isSimulatedControlNotice: SIMULATED_NOTICE
          };
        }
        return {
          allowed: true,
          reason: 'Independent approver verified.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'SEND_EMPLOYEE_OUTREACH':
      case 'CLOSE_ADMINISTRATIVE_CASE':
      case 'RUN_PRIMARY_SOURCE_VERIFICATION':
      case 'APPROVE_CLINICAL_CREDENTIAL':
      case 'RECORD_CLINICAL_DUTY_ELIGIBILITY':
        return {
          allowed: false,
          reason:
            'Compliance Administrators govern rules and connectors, not day-to-day employee outreach, PSV verification, or clinical eligibility decisions.',
          requiredRoleHint: 'Maya (HR Ops) or Alex Morgan (Credentialing)',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      default:
        return {
          allowed: false,
          reason: 'Action not permitted for Compliance Admin.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
    }
  }

  // Supporting Limited-Role Reviewer: Alex Morgan (Credentialing / Clinical Compliance Reviewer)
  if (roleId === 'cred_alex') {
    switch (action) {
      case 'VIEW_WEEKLY_QUEUE':
      case 'VIEW_EMPLOYEE_DOSSIER_OPERATIONAL':
      case 'RUN_PRIMARY_SOURCE_VERIFICATION':
      case 'APPROVE_CLINICAL_CREDENTIAL':
      case 'RECORD_CLINICAL_DUTY_ELIGIBILITY':
        return {
          allowed: true,
          reason: 'Permitted under Credentialing & Clinical Compliance Reviewer scope.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'APPROVE_RULE_PUBLICATION':
        if (
          context?.ruleAuthorName &&
          context?.currentActorName &&
          context.ruleAuthorName.toLowerCase() === context.currentActorName.toLowerCase()
        ) {
          return {
            allowed: false,
            reason: 'Author cannot self-approve rule version.',
            isSimulatedControlNotice: SIMULATED_NOTICE
          };
        }
        return {
          allowed: true,
          reason: 'Independent reviewer permitted to approve tested compliance rule version.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      case 'SEND_EMPLOYEE_OUTREACH':
      case 'CLOSE_ADMINISTRATIVE_CASE':
        return {
          allowed: false,
          reason:
            'Credentialing Reviewer records primary-source verification and clinical review; Maya (HR Operations) manages employee outreach and final administrative closure.',
          requiredRoleHint: 'Maya (HR Operations Lead)',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
      default:
        return {
          allowed: false,
          reason: 'Action outside Credentialing Reviewer limited role scope.',
          isSimulatedControlNotice: SIMULATED_NOTICE
        };
    }
  }

  return {
    allowed: false,
    reason: 'Unknown persona role.',
    isSimulatedControlNotice: SIMULATED_NOTICE
  };
}
