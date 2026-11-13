import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvalCase } from '../../types';
import {
  Play,
  Lock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AgentEvalsView: React.FC = () => {
  const {
    evalCases,
    testRuns,
    rules,
    activeRoleId,
    switchRole,
    can,
    setSelectedEvalCase,
    setIsEvalModalOpen,
    runDraftRuleTestLab,
    setCurrentScreen
  } = useApp();

  const [evalRunFeedback, setEvalRunFeedback] = useState<string | null>(null);

  const draftRule = rules.find((r) => r.id === 'RULE-CA-PHARM-DRAFT') || rules[0];
  const latestRun = testRuns.find((tr) => tr.ruleId === draftRule?.id) || testRuns[0];
  const canRun = can('RUN_RULE_SANDBOX_EVAL');
  const canApprove = can('APPROVE_RULE_PUBLICATION', { ruleAuthorName: draftRule?.author });

  const handleOpenFailure = (c: EvalCase) => {
    setSelectedEvalCase(c);
    setIsEvalModalOpen(true);
  };

  const handleRunRealFixtures = () => {
    if (!draftRule) return;
    const run = runDraftRuleTestLab(draftRule.id);
    if (run) {
      setEvalRunFeedback(
        `Executed ${run.totalFixtures} deterministic fixtures on ${draftRule.ruleCode} (${run.ruleVersion}): ${run.passedCount} passed, ${run.failedCount} failed (${run.gatePassed ? 'Gate Cleared' : 'Gate Blocked'}).`
      );
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 tracking-widest uppercase mb-0.5">
            PRE-PRODUCTION VERIFICATION &amp; RELEASE GATES
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Rule &amp; Agent Evals (Demo Sandbox)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic fixture verification backed by the Rule Test Lab. No rule change publishes without passing fixtures and independent sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunRealFixtures}
            disabled={!canRun.allowed}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Rule Fixtures ({latestRun?.totalFixtures || 12})</span>
          </button>
          <button
            onClick={() => setCurrentScreen('rule_test_lab')}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5"
          >
            <span>Open Rule Test Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {evalRunFeedback && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
          <span>{evalRunFeedback}</span>
          <button onClick={() => setEvalRunFeedback(null)} className="text-teal-700 hover:text-teal-900 font-bold">×</button>
        </div>
      )}

      {/* Live Deterministic Eval Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Deterministic Fixture Suite</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                latestRun?.gatePassed
                  ? 'text-emerald-800 bg-emerald-100'
                  : 'text-rose-800 bg-rose-100'
              }`}
            >
              {latestRun?.gatePassed ? 'PASS' : 'BLOCKED'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Live fixture results from Rule Test Lab ({draftRule?.ruleCode} {draftRule?.version}).
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Fixtures:</span>
              <span className="font-bold text-slate-900">{latestRun?.totalFixtures || 0} cases</span>
            </div>
            <div className="flex justify-between">
              <span>Pass / Fail:</span>
              <span className="font-bold text-slate-900">
                {latestRun?.passedCount || 0} Pass · {latestRun?.failedCount || 0} Fail
              </span>
            </div>
            <div className="flex justify-between">
              <span>False Negatives:</span>
              <span className={`font-bold ${(latestRun?.fn || 0) > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {latestRun?.fn ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Precision &amp; Accuracy</h3>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">
              LIVE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Computed directly from True/False Positives &amp; Negatives on curated fixtures.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Precision:</span>
              <span className="font-bold text-slate-900">
                {latestRun?.precision !== null && latestRun?.precision !== undefined ? `${latestRun.precision}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Recall:</span>
              <span className="font-bold text-slate-900">
                {latestRun?.recall !== null && latestRun?.recall !== undefined ? `${latestRun.recall}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="font-bold text-slate-900">
                {latestRun?.accuracy !== null && latestRun?.accuracy !== undefined ? `${latestRun.accuracy}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">PHI &amp; Boundary Checks</h3>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-mono">
              DEMO GUARDRAIL
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Enforces Occupational Health PHI exclusion, PSV separation, and read-only Workday master boundaries.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Autonomy Ceiling:</span>
              <span className="font-bold text-slate-900">Level 2 Max</span>
            </div>
            <div className="flex justify-between">
              <span>Outreach Gate:</span>
              <span className="font-bold text-slate-900">HR Approval</span>
            </div>
            <div className="flex justify-between">
              <span>External Attestation:</span>
              <span className="font-bold text-amber-800">Not SOC 2/HIPAA Audited</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Historical Benchmark</h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono">
              PILOT NEEDED
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Longitudinal accuracy across live enterprise traffic requires 90-day pilot telemetry.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>Live Prod Corpus:</span>
              <span className="font-bold text-slate-700">Not connected</span>
            </div>
            <div className="flex justify-between">
              <span>Pre-Pilot Latency:</span>
              <span className="font-bold text-slate-700">Not measured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Eval Cases Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Tracked Edge-Case Scenarios</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any row to inspect expected vs actual behavior in the Rule Test Lab.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-mono uppercase">
                <th className="py-2.5 px-4 font-bold">Test Scenario</th>
                <th className="py-2.5 px-4 font-bold">Expected Output</th>
                <th className="py-2.5 px-4 font-bold">Live Draft Status</th>
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
                    <div className="text-[11px] text-slate-400 font-mono">{c.id} · {c.testSuite}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{c.expected}</td>
                  <td className="py-3 px-4 font-mono text-amber-800 font-bold">
                    {latestRun?.gatePassed ? 'PASS (Fixture Cleared)' : 'FAIL (Gate Blocked)'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono bg-rose-100 text-rose-800">
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{c.owner}</td>
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

      {/* Independent Release Gate Enforcement */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block mb-0.5">
              TWO-PERSON RELEASE GATE
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Publication Gate ({draftRule?.ruleCode} {draftRule?.version})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-approval is disabled: rule author ({draftRule?.author}) cannot approve publication. Independent Credentialing sign-off is required.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!canApprove.allowed ? (
              activeRoleId !== 'cred_alex' ? (
                <button
                  onClick={() => switchRole('cred_alex', 'rule_versions')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch to Alex Morgan (Independent Approver)</span>
                </button>
              ) : (
                <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Blocked by Separation of Duties</span>
                </span>
              )
            ) : (
              <button
                onClick={() => setCurrentScreen('rule_versions')}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs"
              >
                Open Independent Sign-Off ({draftRule?.status}) →
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            {
              label: 'Zero False Negatives on Fixtures',
              passed: (latestRun?.fn ?? 1) === 0,
              status: `${latestRun?.fn ?? 1} false negative(s)`
            },
            {
              label: 'Out-of-State Rejection Enabled',
              passed: Boolean(draftRule?.conditionExpression.disallowOutOfStateLicense),
              status: draftRule?.conditionExpression.disallowOutOfStateLicense ? 'Enabled' : 'Disabled (Blocked)'
            },
            {
              label: 'Independent Reviewer Assigned',
              passed: true,
              status: 'Alex Morgan (Credentialing)'
            },
            {
              label: 'Rollback Target Available',
              passed: true,
              status: 'v3.7 snapshot preserved'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 border rounded-xl flex items-start gap-2.5 ${
                item.passed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
              }`}
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-slate-900 block">{item.label}</span>
                <span className={`text-[11px] font-mono ${item.passed ? 'text-emerald-700' : 'text-rose-800'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

