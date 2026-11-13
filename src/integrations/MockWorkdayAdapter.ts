import {
  ComplianceCase,
  HRMSMirrorRecord,
  SyncTransaction,
  Worker
} from '../types';

export interface OutboundStagingPayload {
  targetObject: 'Workday_Custom_Compliance_Staging__c';
  workerId: string;
  caseId: string;
  credentialReadinessSummary: 'READY' | 'ACTION_REQUIRED' | 'CLINICAL_REVIEW_REQUIRED' | 'PARTIAL_PENDING';
  verifiedLicenseCode?: string;
  verifiedLicenseThroughDate?: string;
  verifiedTimestamp: string;
  idempotencyKey: string;
  excludedRestrictedFields: string[];
}

export interface HRMSAdapter {
  readonly adapterName: string;
  readonly isSimulatedDemoAdapter: boolean;
  buildStagingPayload(
    worker: Worker,
    caseItem: ComplianceCase,
    overallReadinessStatus: OutboundStagingPayload['credentialReadinessSummary'],
    verifiedLicenseCode?: string,
    verifiedThroughDate?: string
  ): OutboundStagingPayload;
  executeOutboundWriteback(
    payload: OutboundStagingPayload,
    options?: { simulateTimeout504?: boolean }
  ): Promise<SyncTransaction>;
  retryTransaction(
    failedTx: SyncTransaction,
    options?: { simulateTimeout504?: boolean }
  ): Promise<SyncTransaction>;
}

/**
 * Simulated Workday Integration Adapter (DEMO ONLY).
 * Does NOT connect to a live Workday tenant or transmit credentials.
 * Outbound writes target a scoped custom integration staging object only,
 * preserving Workday master worker identity, job profile, payroll, and clinical privileges.
 */
export class MockWorkdayAdapter implements HRMSAdapter {
  public readonly adapterName = 'Workday HCM Demo Adapter (Simulated Staging API)';
  public readonly isSimulatedDemoAdapter = true;

  public buildStagingPayload(
    worker: Worker,
    caseItem: ComplianceCase,
    overallReadinessStatus: OutboundStagingPayload['credentialReadinessSummary'],
    verifiedLicenseCode?: string,
    verifiedThroughDate?: string
  ): OutboundStagingPayload {
    const idempotencyKey = `idemp-${caseItem.id}-${worker.id}-${caseItem.workflowState}`;
    return {
      targetObject: 'Workday_Custom_Compliance_Staging__c',
      workerId: worker.employeeNumber,
      caseId: caseItem.caseNumber,
      credentialReadinessSummary: overallReadinessStatus,
      verifiedLicenseCode,
      verifiedLicenseThroughDate: verifiedThroughDate,
      verifiedTimestamp: new Date().toISOString(),
      idempotencyKey,
      excludedRestrictedFields: [
        'Occupational_Health_Details__PHI (Excluded)',
        'Medical_Staff_Clinical_Privileges (External MSO Only)',
        'Workday_Compensation_Payroll (Read-Only)',
        'Workday_Employment_Termination_Action (Prohibited)'
      ]
    };
  }

  public async executeOutboundWriteback(
    payload: OutboundStagingPayload,
    options?: { simulateTimeout504?: boolean }
  ): Promise<SyncTransaction> {
    const txId = `WD-TX-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    // Simulated async gateway latency
    await new Promise((r) => setTimeout(r, 350));

    if (options?.simulateTimeout504) {
      return {
        id: txId,
        idempotencyKey: payload.idempotencyKey,
        connectorId: 'conn-workday',
        connectorName: 'Workday HCM (Demo Adapter)',
        direction: 'Outbound (Approved Summary -> Workday Staging)',
        workerId: payload.workerId,
        caseId: payload.caseId,
        timestamp: nowIso,
        recordsProcessed: 0,
        recordsFailed: 1,
        status: 'FAILED',
        httpStatus: 504,
        errorDetails:
          'Simulated HTTP 504 Gateway Timeout from Workday Staging Endpoint. Outcome unknown — requires reconciliation. Local compliance verification remains preserved; retry only this transaction with same idempotency key.',
        payloadPreview: payload as unknown as Record<string, unknown>,
        retryCount: 0
      };
    }

    return {
      id: txId,
      idempotencyKey: payload.idempotencyKey,
      connectorId: 'conn-workday',
      connectorName: 'Workday HCM (Demo Adapter)',
      direction: 'Outbound (Approved Summary -> Workday Staging)',
      workerId: payload.workerId,
      caseId: payload.caseId,
      timestamp: nowIso,
      recordsProcessed: 1,
      recordsFailed: 0,
      status: 'ACKNOWLEDGED',
      httpStatus: 200,
      payloadPreview: payload as unknown as Record<string, unknown>,
      acknowledgedAt: nowIso,
      retryCount: 0
    };
  }

  public async retryTransaction(
    failedTx: SyncTransaction,
    options?: { simulateTimeout504?: boolean }
  ): Promise<SyncTransaction> {
    if (failedTx.status !== 'FAILED' && failedTx.status !== 'RECONCILIATION_REQUIRED') {
      throw new Error(`Transaction ${failedTx.id} is in status ${failedTx.status} and cannot be retried.`);
    }

    await new Promise((r) => setTimeout(r, 300));
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    if (options?.simulateTimeout504) {
      return {
        ...failedTx,
        timestamp: nowIso,
        status: 'FAILED',
        httpStatus: 504,
        retryCount: failedTx.retryCount + 1,
        errorDetails: 'Retry attempted with same idempotency key; simulated endpoint still timed out (HTTP 504).'
      };
    }

    return {
      ...failedTx,
      timestamp: nowIso,
      recordsProcessed: 1,
      recordsFailed: 0,
      status: 'ACKNOWLEDGED',
      httpStatus: 200,
      errorDetails: undefined,
      acknowledgedAt: nowIso,
      retryCount: failedTx.retryCount + 1
    };
  }
}

export const mockWorkdayAdapter = new MockWorkdayAdapter();

/**
 * Applies an acknowledged outbound transaction ONLY to the correlated worker's mirror record.
 */
export function applyAcknowledgedTxToMirror(
  currentMirror: Record<string, HRMSMirrorRecord>,
  tx: SyncTransaction,
  workerId: string
): Record<string, HRMSMirrorRecord> {
  if (tx.status !== 'ACKNOWLEDGED') return currentMirror;
  const existing = currentMirror[workerId];
  if (!existing) return currentMirror;

  const payload = tx.payloadPreview as Partial<OutboundStagingPayload> | undefined;

  return {
    ...currentMirror,
    [workerId]: {
      ...existing,
      stagingObject: {
        ...existing.stagingObject,
        credentialReadinessSummary: payload?.credentialReadinessSummary || existing.stagingObject.credentialReadinessSummary,
        verifiedLicenseCode: payload?.verifiedLicenseCode || existing.stagingObject.verifiedLicenseCode,
        verifiedLicenseThroughDate:
          payload?.verifiedLicenseThroughDate || existing.stagingObject.verifiedLicenseThroughDate,
        lastVerifiedCaseId: tx.caseId || existing.stagingObject.lastVerifiedCaseId,
        lastVerifiedTimestamp: tx.acknowledgedAt || tx.timestamp,
        reconciliationStatus: 'ACKNOWLEDGED',
        lastTransactionId: tx.id
      }
    }
  };
}
