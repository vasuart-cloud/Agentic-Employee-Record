import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, RefreshCw, UserPlus, ArrowRightLeft, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const {
    connectors,
    fieldMappings,
    syncTransactions,
    hrmsMirror,
    can,
    runConnectorSync,
    retrySyncTransaction,
    simulateWorkdayWorkerEvent
  } = useApp();

  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [simulateSecondFailure, setSimulateSecondFailure] = useState(false);

  const canSync = can('TRIGGER_WORKDAY_SYNC');

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-teal-800">
            Simulated Integration Architecture · MockWorkdayAdapter
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mt-0.5">
            Integrations, Scoped Staging &amp; Data Mapping
          </h1>
          <p className="text-slate-600 mt-1">
            Workday HCM remains the authoritative system of record for worker/job/org master data. Outbound writes target only <code className="font-mono bg-slate-100 px-1 rounded">Workday_Custom_Compliance_Staging__c</code>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => simulateWorkdayWorkerEvent('NEW_HIRE')}
            disabled={!canSync.allowed}
            className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Simulate Workday New Hire</span>
          </button>
          <button
            onClick={() => simulateWorkdayWorkerEvent('ROLE_TRANSFER', 'EMP-10510')}
            disabled={!canSync.allowed}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Simulate CA Transfer</span>
          </button>
        </div>
      </div>

      {/* Connected Systems (Simulated) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-teal-700" />
                  <span>{c.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{c.category} · {c.permissionMode}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  c.status.includes('Error')
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="text-[11px] text-slate-600 space-y-0.5">
              <div>Target: <span className="font-mono">{c.targetObjectLabel}</span></div>
              <div>Last Sync: {c.lastSyncTimestamp}</div>
            </div>

            <button
              onClick={() => runConnectorSync(c.id)}
              disabled={!canSync.allowed}
              className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-semibold flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Simulated Inbound Refresh</span>
            </button>
          </div>
        ))}
      </div>

      {/* Sync Transactions Log (Including Scoped Retry for TX-WD-9062) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="font-semibold text-slate-900">
            Workday Staging Sync Transactions ({syncTransactions.length})
          </div>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={simulateSecondFailure}
              onChange={(e) => setSimulateSecondFailure(e.target.checked)}
              className="rounded border-slate-300 text-teal-700"
            />
            <span>Simulate persistent 504 on retry</span>
          </label>
        </div>

        <div className="divide-y divide-slate-100">
          {syncTransactions.map((tx) => (
            <div key={tx.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold text-slate-900">{tx.id}</span>
                  <span className="text-slate-500">{tx.direction}</span>
                  {tx.workerName && (
                    <span className="font-semibold text-teal-800">
                      {tx.workerName} ({tx.caseId})
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      tx.status === 'ACKNOWLEDGED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {tx.status} {tx.httpStatus ? `HTTP ${tx.httpStatus}` : ''}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Idempotency Key: {tx.idempotencyKey} · Retries: {tx.retryCount} · {tx.timestamp}
                </div>
                {tx.errorDetails && (
                  <div className="text-[11px] text-rose-800 bg-rose-50 border border-rose-200 rounded px-2.5 py-1.5 mt-1 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{tx.errorDetails}</span>
                  </div>
                )}
              </div>

              {(tx.status === 'FAILED' || tx.status === 'RECONCILIATION_REQUIRED') && (
                <button
                  disabled={!canSync.allowed || retryingId === tx.id}
                  onClick={async () => {
                    setRetryingId(tx.id);
                    await retrySyncTransaction(tx.id, simulateSecondFailure);
                    setRetryingId(null);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${retryingId === tx.id ? 'animate-spin' : ''}`} />
                  <span>Retry This Transaction</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workday Staging Mirror State */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900">
          Simulated Workday Mirror (Read-Only Master vs Staging Object)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500 bg-slate-50/50">
                <th className="py-2 px-4">Worker (Read-Only Master)</th>
                <th className="py-2 px-4">Workday Job / Facility</th>
                <th className="py-2 px-4">Staging Summary</th>
                <th className="py-2 px-4">Verified License / Date</th>
                <th className="py-2 px-4">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(hrmsMirror).map((rec) => (
                <tr key={rec.workerId}>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-900">{rec.workerName}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {rec.workerId} · {rec.workdayWorkerStatus}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">
                    {rec.jobProfile} · {rec.facilityName}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                    {rec.stagingObject.credentialReadinessSummary}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-700">
                    {rec.stagingObject.verifiedLicenseCode || '—'} ·{' '}
                    {rec.stagingObject.verifiedLicenseThroughDate || '—'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      {rec.stagingObject.reconciliationStatus === 'ACKNOWLEDGED' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      )}
                      <span>{rec.stagingObject.reconciliationStatus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Mappings & Restricted Boundaries */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900">
          Workday Field Mappings &amp; Hard Write Restrictions
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500 bg-slate-50/50">
                <th className="py-2 px-4">Source</th>
                <th className="py-2 px-4">Target</th>
                <th className="py-2 px-4">Direction</th>
                <th className="py-2 px-4">Status / Boundary Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fieldMappings.map((fm) => (
                <tr key={fm.id}>
                  <td className="py-2.5 px-4 font-mono text-[11px]">
                    {fm.sourceSystem}.{fm.sourceField}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px]">
                    {fm.targetSystem}.{fm.targetField}
                  </td>
                  <td className="py-2.5 px-4">{fm.direction}</td>
                  <td className="py-2.5 px-4">
                    {fm.status === 'Restricted' ? (
                      <span className="inline-flex items-center gap-1 text-rose-800 font-semibold">
                        <Lock className="w-3 h-3" />
                        <span>{fm.restrictionNote || 'Restricted'}</span>
                      </span>
                    ) : (
                      <span className="text-emerald-800 font-medium">{fm.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
