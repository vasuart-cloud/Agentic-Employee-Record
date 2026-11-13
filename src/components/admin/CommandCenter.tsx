import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Activity,
  CheckCircle2,
  UserX,
  Clock,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    agents,
    setSelectedAgentId,
    setCurrentScreen,
    killSwitchState,
    computedMetrics,
    roiAssumptions,
    testRuns,
    auditEvents,
    organization
  } = useApp();

  const isKilled = killSwitchState.isTriggered;
  const activeHealthyAgentsCount = agents.filter(
    (a) => !(a.id === 'compliance-agent' && isKilled) && a.status === 'Healthy'
  ).length;
  const monthlyCapacityValue = Math.round(computedMetrics.modeledAnnualCapacityValue / 12);
  const latestRun = testRuns[0];

  const handleOpenAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setCurrentScreen('agent_detail');
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-teal-700 tracking-wider uppercase font-mono">
              CONTROL LAYER · WORKFORCE GOVERNANCE
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
              Illustrative Modeled Telemetry (Synthetic Benchmark)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Operations Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor agent configuration, live session readiness metrics, and modeled HR ROI assumptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('business_value')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-teal-700" />
            <span>ROI Breakdown</span>
          </button>

          <button
            onClick={() => {
              setSelectedAgentId('compliance-agent');
              setCurrentScreen('agent_detail');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Manage Compliance Agent</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Active Agents */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Active Agents</span>
            <Cpu className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {activeHealthyAgentsCount}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isKilled ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <span>
              {isKilled
                ? `${activeHealthyAgentsCount} Healthy · ${agents.length - activeHealthyAgentsCount} Paused`
                : `${agents.length} Healthy · 0 Degraded`}
            </span>
          </div>
        </div>

        {/* Agent Runs 30d (Illustrative Model) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Runs (30d Model)</span>
            <Activity className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {agents.reduce((sum, a) => sum + a.runs30d, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>Simulated benchmark</span>
          </div>
        </div>

        {/* Sample Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Cohort Readiness</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {computedMetrics.sampleReadinessPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {computedMetrics.readyWorkersCount} of {computedMetrics.sampleWorkersCount} sample workers
          </div>
        </div>

        {/* Open Cases (Live) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Open Exceptions</span>
            <UserX className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {computedMetrics.openCasesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {computedMetrics.criticalCasesCount} Critical · {computedMetrics.resolvedCasesCount} Closed
          </div>
        </div>

        {/* Modeled HR Hours Saved */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Modeled Hours/Mo</span>
            <Clock className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-teal-800 font-mono tabular-nums">
            {computedMetrics.modeledMonthlyHoursSaved.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            {roiAssumptions.monthlyExceptionVolume.toLocaleString()} cases/mo assumption
          </div>
        </div>

        {/* Modeled Monthly Capacity Value */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Modeled Value/Mo</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${monthlyCapacityValue.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-1">
            Capacity @ ${roiAssumptions.loadedHrHourlyRate}/hr
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 italic">
        * Capacity and run volume metrics combine live in-browser sample cohort calculations ({computedMetrics.sampleWorkersCount} sample workers across a {organization.enterpriseHeadcountContext.toLocaleString()}-employee enterprise model) with editable ROI assumptions.
      </div>

      {/* SECTION 4: ARE THE AGENTS CREATING VALUE? */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Are the agents creating value?</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking across {computedMetrics.sampleWorkersCount} sample workers and {computedMetrics.totalApplicableRequirements} evaluated requirements (modeled for {organization.enterpriseHeadcountContext.toLocaleString()} employees).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Live Sample Readiness:</span>
            <span className="bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold px-2 py-0.5 rounded">
              {computedMetrics.sampleReadinessPercent}% Sample Workers Ready
            </span>
          </div>
        </div>

        {/* Before vs Now Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Handling Time / Case (Model)</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 line-through">
                {roiAssumptions.baselineManualMinutesPerCase} min
              </span>
              <span className="text-2xl font-extrabold text-teal-700 font-mono">
                {roiAssumptions.assistedMinutesPerCase} min
              </span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              Editable in Business Value &amp; ROI
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Cash Realizable / Yr</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-teal-700 font-mono">
                ${computedMetrics.modeledAnnualCashRealizable.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              {Math.round(roiAssumptions.capacityToCashRealizationFactor * 100)}% realization factor
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Clinical / PSV</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-700 font-mono">
                {computedMetrics.clinicalEscalationsPending + computedMetrics.pendingPSVCount}
              </span>
              <span className="text-xs text-slate-500">live gates</span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              {computedMetrics.clinicalEscalationsPending} clinical · {computedMetrics.pendingPSVCount} PSV checks
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Failed Workday Syncs</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {computedMetrics.syncFailedCount}
              </span>
              <span className="text-xs text-slate-500">staging TXs</span>
            </div>
            <div className="text-[11px] text-teal-700 font-medium">
              {computedMetrics.resolvedCasesCount} case(s) closed this session
            </div>
          </div>
        </div>

        {/* Value Calculation Ribbon */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              $
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Modeled Monthly Capacity Value: ${monthlyCapacityValue.toLocaleString()} (Annual Net Cash: ${computedMetrics.modeledAnnualNetValue.toLocaleString()})
              </span>
              <span className="text-slate-600 text-[11px]">
                {computedMetrics.modeledMonthlyHoursSaved.toLocaleString()} modeled HR hrs/mo × ${roiAssumptions.loadedHrHourlyRate}/hr loaded cost
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('business_value')}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>See ROI Model &amp; Pilot Assumptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 5: AGENT USAGE DASHBOARD (4 AGENTS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Agent Workforce Usage (Simulated Telemetry)</h2>
            <p className="text-xs text-slate-500">
              The {agents.length} specialized agents governed by Priya Sharma&apos;s compliance policy controls.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Click any agent to inspect configuration &amp; kill switch
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((ag) => {
            const isCompliance = ag.id === 'compliance-agent';
            const isAgentStopped = isCompliance && isKilled;

            return (
              <div
                key={ag.id}
                onClick={() => handleOpenAgent(ag.id)}
                className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer hover:border-teal-500 hover:shadow-sm transition-all space-y-4 ${
                  isAgentStopped ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      {ag.version} · {ag.owner}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{ag.name}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      isAgentStopped
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isAgentStopped ? 'PAUSED' : 'Healthy'}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 h-8">{ag.purpose}</p>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Runs (30d Model):</span>
                    <span className="font-bold text-slate-900">{ag.runs30d.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Fixture Rate:</span>
                    <span className="font-bold text-emerald-700">{ag.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Avg Latency / Cost:</span>
                    <span className="text-slate-700">
                      {ag.avgLatency} · {ag.avgCostPerRun}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-sans">{ag.keyMetricLabel}:</span>
                    <span className="font-bold text-teal-800">{ag.keyMetricValue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 text-[11px]">
                    {ag.secondaryMetricLabel}:{' '}
                    <strong className="text-slate-700">{ag.secondaryMetricValue}</strong>
                  </span>
                  <span className="text-teal-700 font-semibold text-xs flex items-center gap-0.5">
                    <span>Configure</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 30: AI GOVERNANCE HEALTH PANEL */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">Live Session Governance &amp; Safety Health</h3>
          </div>
          <span
            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
              isKilled ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isKilled ? 'Status: EMERGENCY PAUSED' : 'Status: BOUNDED DEMO ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Agents Active</span>
            <span className="font-bold text-slate-900 text-sm font-mono">
              {activeHealthyAgentsCount} / {agents.length}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Latest Test Lab</span>
            <span
              className={`font-bold text-sm font-mono ${
                latestRun?.gatePassed ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {latestRun ? `${latestRun.passedCount} / ${latestRun.totalFixtures}` : '0 / 0'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Critical Cases</span>
            <span className="font-bold text-rose-700 text-sm font-mono">
              {computedMetrics.criticalCasesCount}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Failed Syncs</span>
            <span className="font-bold text-amber-700 text-sm font-mono">
              {computedMetrics.syncFailedCount}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Cases Resolved</span>
            <span className="font-bold text-teal-800 text-sm font-mono">
              {computedMetrics.resolvedCasesCount}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Emergency Stops</span>
            <span className={`font-bold text-sm font-mono ${isKilled ? 'text-rose-700' : 'text-slate-900'}`}>
              {isKilled ? '1 Active' : '0 Active'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Session Audit Events</span>
            <span className="font-bold text-slate-900 text-sm font-mono">{auditEvents.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
