import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvalCase } from '../../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  Play, 
  FileCheck2, 
  AlertCircle, 
  ChevronRight,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';

export const AgentEvalsView: React.FC = () => {
  const { 
    evalCases, 
    setSelectedEvalCase, 
    setIsEvalModalOpen, 
    releaseGateApproved, 
    setReleaseGateApproved 
  } = useApp();

  const [isRunningAllEvals, setIsRunningAllEvals] = useState(false);
  const [evalRunFeedback, setEvalRunFeedback] = useState<string | null>(null);

  const handleOpenFailure = (c: EvalCase) => {
    setSelectedEvalCase(c);
    setIsEvalModalOpen(true);
  };

  const handleRunAll = () => {
    setIsRunningAllEvals(true);
    setEvalRunFeedback('Executing 1,600 automated test scenarios across regression and safety benchmarks...');
    setTimeout(() => {
      setIsRunningAllEvals(false);
      setEvalRunFeedback('All eval suites finished: Regression 98.2% PASS, Safety 100% PASS, Compliance Accuracy 96.8% PASS.');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 tracking-widest uppercase mb-0.5">
            PRE-PRODUCTION VERIFICATION & SAFETY GATES
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Agent Evals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prove behavior before production. No agent configuration reaches production without verified eval passes.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={isRunningAllEvals}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isRunningAllEvals ? 'Running 1,600 Evals...' : 'Run Full Eval Suite'}</span>
        </button>
      </div>

      {evalRunFeedback && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
          <span>{evalRunFeedback}</span>
          <button onClick={() => setEvalRunFeedback(null)} className="text-teal-700 hover:text-teal-900 font-bold">×</button>
        </div>
      )}

      {/* 4 Eval Cards (Section 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Regression Eval */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Regression Eval</h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
              PASS
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tests previously resolved historical cases to ensure zero behavioral regression.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Scenarios:</span>
              <span className="font-bold text-slate-900">1,000 cases</span>
            </div>
            <div className="flex justify-between">
              <span>Pass / Fail:</span>
              <span className="text-emerald-700 font-bold">982 Pass · 18 Fail</span>
            </div>
            <div className="flex justify-between">
              <span>Pass Rate:</span>
              <span className="font-bold text-slate-900">98.2%</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px] text-slate-500 font-sans">
              <span>Threshold: &gt;97%</span>
              <span className="text-emerald-700 font-bold font-mono">PASSED</span>
            </div>
          </div>
        </div>

        {/* Compliance Accuracy Eval */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Compliance Accuracy</h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
              PASS
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Validates statutory precision and recall against legal compliance ground truth.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Test Cases:</span>
              <span className="font-bold text-slate-900">500 cases</span>
            </div>
            <div className="flex justify-between">
              <span>Precision:</span>
              <span className="font-bold text-slate-900">96.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Recall:</span>
              <span className="font-bold text-slate-900">95.1%</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px] text-slate-500 font-sans">
              <span>FP: 3.2% · FN: 1.7%</span>
              <span className="text-emerald-700 font-bold font-mono">PASSED</span>
            </div>
          </div>
        </div>

        {/* Edge Case Eval */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Edge Case Eval</h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
              PASS WITH REVIEW
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Missing, expired, duplicate, unreadable scans, and conflicting records.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Scenarios Tested:</span>
              <span className="font-bold text-slate-900">100 edge cases</span>
            </div>
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-bold text-amber-800">92 / 100</span>
            </div>
            <div className="flex justify-between">
              <span>Failures:</span>
              <span className="font-bold text-rose-700">8 low/med cases</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px] text-slate-500 font-sans">
              <span>Action:</span>
              <span className="text-amber-800 font-bold">Reviewing 1 item</span>
            </div>
          </div>
        </div>

        {/* Safety Eval */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Safety & Guardrails</h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
              PASS 100%
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tests PII masking, prompt injection resistance, policy bypass, and data leakage.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Adversarial Tests:</span>
              <span className="font-bold text-slate-900">250 vectors</span>
            </div>
            <div className="flex justify-between">
              <span>PII Violations:</span>
              <span className="font-bold text-emerald-700">0 detected</span>
            </div>
            <div className="flex justify-between">
              <span>Unapproved Comms:</span>
              <span className="font-bold text-emerald-700">0 allowed</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px] text-slate-500 font-sans">
              <span>Safety Rating:</span>
              <span className="text-emerald-700 font-bold font-mono">100% SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 15: FAILED EVAL CASES TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Failed Eval Cases Requiring Investigation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any row to open the input payload, agent output, expected result, and execution trace.
            </p>
          </div>
          <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            1 Open Non-Blocking Issue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-mono uppercase">
                <th className="py-2.5 px-4 font-bold">Test Scenario</th>
                <th className="py-2.5 px-4 font-bold">Expected Output</th>
                <th className="py-2.5 px-4 font-bold">Actual Output</th>
                <th className="py-2.5 px-4 font-bold">Severity</th>
                <th className="py-2.5 px-4 font-bold">Owner</th>
                <th className="py-2.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evalCases.map((c) => (
                <tr 
                  key={c.id} 
                  onClick={() => handleOpenFailure(c)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.id} · {c.testSuite} Suite</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                    {c.expected}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-700 font-bold">
                    {c.actual}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      c.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      c.severity === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {c.owner}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFailure(c);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs"
                    >
                      Inspect Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 16: PRODUCTION RELEASE GATE */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block mb-0.5">
              GOVERNANCE ENFORCEMENT
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Production Release Gate
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate versions (e.g. Compliance Agent v2.5 Draft) cannot be published until all 7 criteria are met.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!releaseGateApproved ? (
              <button
                onClick={() => setReleaseGateApproved(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
              >
                Submit for Approval (Priya Sharma)
              </button>
            ) : (
              <button
                onClick={() => alert('Agent v2.5 Draft successfully published to Production environment!')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Publish Version to Production</span>
              </button>
            )}
          </div>
        </div>

        {/* 7 Checkmark Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Regression Eval >97%', status: '98.2% achieved' },
            { label: 'Safety Eval 100%', status: 'Zero leakage / 0 bypass' },
            { label: 'Compliance accuracy met', status: '96.8% precision' },
            { label: 'No unresolved critical failures', status: '0 critical open' },
            { label: 'Security review complete', status: 'SOC 2 & PII approved' },
            { label: 'Human approver assigned', status: 'Priya Sharma (Admin)' },
            { label: 'Rollback version available', status: 'v2.3 certified target' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <span className="font-bold text-slate-900 block">{item.label}</span>
                <span className="text-emerald-700 text-[11px] font-mono">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
