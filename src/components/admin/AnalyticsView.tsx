import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3 } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { cases, requirements, computedMetrics, openWorkerDossier } = useApp();

  const byCategory = cases.reduce<Record<string, number>>((acc, c) => {
    acc[c.caseCategory] = (acc[c.caseCategory] || 0) + 1;
    return acc;
  }, {});

  const byVerificationMethod = requirements.reduce<Record<string, number>>((acc, r) => {
    acc[r.verificationMethod] = (acc[r.verificationMethod] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-700" />
          <span>Operations Analytics (Live Sample State)</span>
        </h1>
        <p className="text-slate-600 mt-1">
          Live breakdown derived directly from the {computedMetrics.sampleWorkersCount}-worker sample dataset and {computedMetrics.totalApplicableRequirements} applicable requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Cases by Exception Category</h2>
          <div className="space-y-2">
            {Object.entries(byCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-800">{cat}</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Requirements by Verification Method</h2>
          <div className="space-y-2">
            {Object.entries(byVerificationMethod).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-800">{method.replace(/_/g, ' ')}</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Active Critical &amp; High Priority Cases</h2>
        <div className="divide-y divide-slate-100">
          {cases
            .filter((c) => c.workflowState !== 'resolved' && (c.severity === 'Critical' || c.severity === 'High'))
            .map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <span className="font-mono font-semibold text-teal-800 mr-2">{c.caseNumber}</span>
                  <span className="font-semibold text-slate-900">{c.workerName}</span>
                  <span className="text-slate-500"> — {c.title}</span>
                </div>
                <button
                  onClick={() => openWorkerDossier(c.workerId, c.id)}
                  className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700"
                >
                  Open
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
