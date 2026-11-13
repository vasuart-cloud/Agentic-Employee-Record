import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateFormI9Acceptability } from '../../domain/rules';
import {
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const AgentSandbox: React.FC = () => {
  const {
    workers,
    rules,
    requirements,
    evidenceItems,
    workerReadinessMap,
    testRuns,
    isSandboxRunning,
    runSandboxTest,
    can,
    setCurrentScreen
  } = useApp();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || 'EMP-10419');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('RULE-CA-PHARM-DRAFT');
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);

  const worker = workers.find((w) => w.id === selectedWorkerId) || workers[0];
  const rule = rules.find((r) => r.id === selectedRuleId) || rules[0];
  const readiness = worker ? workerReadinessMap[worker.id] : undefined;
  const workerReqs = useMemo(
    () =>
      requirements.filter(
        (r) => r.workerId === worker?.id && r.applicabilityOutcome !== 'NOT_APPLICABLE'
      ),
    [requirements, worker?.id]
  );
  const workerEv = useMemo(
    () => evidenceItems.filter((e) => e.workerId === worker?.id),
    [evidenceItems, worker?.id]
  );
  const i9Result = useMemo(() => evaluateFormI9Acceptability(workerEv), [workerEv]);
  const latestRun = testRuns.find((tr) => tr.ruleId === rule?.id) || testRuns[0];
  const canRunEval = can('RUN_RULE_SANDBOX_EVAL');

  const handleRun = () => {
    setHasExecuted(true);
    runSandboxTest(rule?.id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-slate-800">
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block mb-0.5">
            ISOLATED DEMO SANDBOX ENVIRONMENT
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Deterministic Rule &amp; Worker Sandbox
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect live worker readiness and execute rule fixtures in the browser sandbox before submitting rule changes.
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={isSandboxRunning || !canRunEval.allowed}
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs"
        >
          {isSandboxRunning ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-teal-200" />
              <span>Evaluating Rule Fixtures...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Execute Sandbox Evaluation</span>
            </>
          )}
        </button>
      </div>

      {/* Live Worker & Rule Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
            Sample Worker Dossier ({workers.length} synthetic records)
          </label>
          <select
            value={worker?.id || ''}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600"
          >
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.employeeNumber}) — {w.primaryRole} ({w.primaryState})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
            Compliance Rule Under Test
          </label>
          <select
            value={rule?.id || ''}
            onChange={(e) => setSelectedRuleId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-600"
          >
            {rules.map((r) => (
              <option key={r.id} value={r.id}>
                {r.ruleCode} ({r.version} · {r.status}) — {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Evaluated Worker State */}
      {worker && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold text-slate-900">
              Live State: {worker.name} · {worker.primaryFacilityName} ({worker.primaryState})
            </div>
            <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
              Readiness: {readiness?.readinessPercent ?? 'Unknown'}% ({readiness?.satisfiedRequirementsCount}/{readiness?.totalApplicableRequirements}) · {readiness?.overallStatusLabel}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] uppercase text-slate-500">Applicable Requirements</div>
              <div className="font-semibold text-slate-900 mt-0.5">{workerReqs.length} evaluated</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] uppercase text-slate-500">Evidence Records</div>
              <div className="font-semibold text-slate-900 mt-0.5">{workerEv.length} stored</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] uppercase text-slate-500">Form I-9 List A / B+C Check</div>
              <div className="font-semibold text-slate-900 mt-0.5">{i9Result.summary}</div>
            </div>
          </div>
        </div>
      )}

      {/* Real Rule Fixture Evaluation Output */}
      {(hasExecuted || latestRun) && latestRun && (
        <div
          className={`p-5 rounded-xl border space-y-4 text-xs ${
            latestRun.gatePassed
              ? 'border-emerald-300 bg-emerald-50/40'
              : 'border-rose-300 bg-rose-50/40'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {latestRun.gatePassed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              )}
              <span className="font-bold text-slate-900 text-sm">
                Fixture Evaluation ({rule?.ruleCode || latestRun.ruleId} {latestRun.ruleVersion}): {latestRun.passedCount}/{latestRun.totalFixtures} Passed
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-white border border-slate-200">
              {latestRun.gatePassed ? 'RELEASE GATE CLEARED' : 'RELEASE GATE BLOCKED'}
            </span>
          </div>

          {!latestRun.gatePassed && latestRun.gateBlockReasons.length > 0 && (
            <div className="text-rose-800 font-medium">
              {latestRun.gateBlockReasons.join(' ')}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-slate-600">
              Precision: <strong>{latestRun.precision ?? 'N/A'}%</strong> · Recall: <strong>{latestRun.recall ?? 'N/A'}%</strong> · FN: <strong>{latestRun.fn}</strong>
            </div>
            <button
              onClick={() => setCurrentScreen('rule_test_lab')}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Inspect Fixtures in Rule Test Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

