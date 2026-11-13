import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCaseDaysUntilDue, getCaseDurationDays } from '../../domain/readiness';
import { DEMO_REFERENCE_DATE } from '../../domain/rules';
import { ArrowRight, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ComplianceQueueView: React.FC = () => {
  const { cases, openWorkerDossier } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'escalated' | 'open' | 'resolved'>('all');

  const filtered = cases.filter((c) => {
    if (filterMode === 'escalated') return Boolean(c.escalation) || c.verificationState === 'RESTRICTED';
    if (filterMode === 'open') return c.workflowState !== 'resolved';
    if (filterMode === 'resolved') return c.workflowState === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Cases &amp; Clinical Escalations</h1>
          <p className="text-xs text-slate-600 mt-1">
            All compliance exceptions across the 16-worker sample dataset with separated Document, PSV, Clinical, and Workday Sync states.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {(
            [
              ['all', 'All Cases'],
              ['escalated', 'Clinical Escalations'],
              ['open', 'Open Only'],
              ['resolved', 'Resolved']
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilterMode(id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterMode === id
                  ? 'bg-teal-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-4">Case</th>
                <th className="py-2.5 px-4">Worker &amp; Facility</th>
                <th className="py-2.5 px-4">Category &amp; Severity</th>
                <th className="py-2.5 px-4">Doc / PSV / Clinical</th>
                <th className="py-2.5 px-4">Escalation Status</th>
                <th className="py-2.5 px-4">Timing</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const age = getCaseDurationDays(c, DEMO_REFERENCE_DATE);
                const dueDelta = getCaseDaysUntilDue(c, DEMO_REFERENCE_DATE);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 align-top">
                      <div className="font-mono font-semibold text-teal-800">{c.caseNumber}</div>
                      <div className="font-medium text-slate-900 mt-0.5 max-w-xs">{c.title}</div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="font-semibold text-slate-900">{c.workerName}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.role} · {c.facilityName}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="font-medium text-slate-800">{c.caseCategory}</div>
                      <div
                        className={`text-[11px] font-semibold mt-0.5 ${
                          c.severity === 'Critical'
                            ? 'text-rose-700'
                            : c.severity === 'High'
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {c.severity}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top text-[11px] space-y-0.5">
                      <div>Doc: <strong>{c.documentState}</strong></div>
                      <div>PSV: <strong>{c.verificationState}</strong></div>
                      <div>Clinical: <strong>{c.clinicalEligibilityState.replace(/_/g, ' ')}</strong></div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      {c.escalation ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                          <ShieldAlert className="w-3 h-3" />
                          <span>{c.escalation.status}</span>
                        </div>
                      ) : c.workflowState === 'resolved' ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolved</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>{c.workflowState.replace(/_/g, ' ')}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top tabular-nums whitespace-nowrap">
                      <div>{age}d open</div>
                      <div className="text-[11px] text-slate-500">
                        {dueDelta < 0 ? `${Math.abs(dueDelta)}d overdue` : `Due ${c.dueDate}`}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top text-right">
                      <button
                        onClick={() => openWorkerDossier(c.workerId, c.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
