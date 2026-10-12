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
  TrendingDown, 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const { 
    agents, 
    setSelectedAgentId, 
    setCurrentScreen, 
    killSwitchState 
  } = useApp();

  const isKilled = killSwitchState.isTriggered;

  const handleOpenAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setCurrentScreen('agent_detail');
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[11px] font-bold text-teal-700 tracking-wider uppercase font-mono mb-1">
            CONTROL LAYER · WORKFORCE GOVERNANCE
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Operations Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor agent adoption, trust, risk and measurable HR outcomes.
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
            {isKilled ? '3' : '4'}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isKilled ? '3 Healthy · 1 Paused' : '4 Healthy · 0 Degraded'}</span>
          </div>
        </div>

        {/* Agent Runs 30d */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Runs (30 Days)</span>
            <Activity className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            148,520
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18% vs prev month</span>
          </div>
        </div>

        {/* Successful Runs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Successful Runs</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            96.8%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Deterministic rule check
          </div>
        </div>

        {/* Human Overrides */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Human Overrides</span>
            <UserX className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
            4.2%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Healthy calibration signal
          </div>
        </div>

        {/* HR Hours Saved */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>HR Hours Saved</span>
            <Clock className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-teal-800 font-mono tabular-nums">
            1,284 <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            +210 hrs MoM
          </div>
        </div>

        {/* HR Operational Value */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Monthly Value</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            $64,200
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-1">
            @ $50/hr loaded cost
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 italic">
        * Estimated using configured HR operational cost assumptions ($50/hour blended rate for HR Operations Specialists).
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
              Continuously verified outcomes across 12,480 employee records against Workday master data.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">North Star Audit-Ready:</span>
            <span className="bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold px-2 py-0.5 rounded">
              91% Files Compliant
            </span>
          </div>
        </div>

        {/* Before vs Now Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Average Resolution Time</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 line-through">8.4 days</span>
              <span className="text-2xl font-extrabold text-teal-700 font-mono">3.1 days</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">63% reduction in resolution cycle</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">HR Touches Per Case</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 line-through">6.2 touches</span>
              <span className="text-2xl font-extrabold text-teal-700 font-mono">2.4 touches</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">61% reduction in manual clicks</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Audit Preparation Time</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 line-through">5.0 days</span>
              <span className="text-2xl font-extrabold text-teal-700 font-mono">7 hours</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">86% reduction in audit panic</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Automated File Processing</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">84,390</span>
              <span className="text-xs text-slate-500">docs</span>
            </div>
            <div className="text-[11px] text-teal-700 font-medium">1,623 issues resolved via AI loop</div>
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
                Estimated Monthly Operational Productivity Value: $64,200
              </span>
              <span className="text-slate-600 text-[11px]">
                1,284 HR Operations hours saved/month × $50 standard loaded cost per hour
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('business_value')}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>See ROI Model & Pilot Assumptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 5: AGENT USAGE DASHBOARD (4 AGENTS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Agent Workforce Usage</h2>
            <p className="text-xs text-slate-500">
              The 4 specialized agents operating under Priya Sharma's governance rules.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Click any agent to inspect configuration & kill switch
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
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {ag.name}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                    isAgentStopped 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isAgentStopped ? 'PAUSED' : 'Healthy'}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 h-8">
                  {ag.purpose}
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Total Runs (30d):</span>
                    <span className="font-bold text-slate-900">{ag.runs30d.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Success Rate:</span>
                    <span className="font-bold text-emerald-700">{ag.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Avg Latency / Cost:</span>
                    <span className="text-slate-700">{ag.avgLatency} · {ag.avgCostPerRun}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-sans">{ag.keyMetricLabel}:</span>
                    <span className="font-bold text-teal-800">{ag.keyMetricValue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 text-[11px]">
                    {ag.secondaryMetricLabel}: <strong className="text-slate-700">{ag.secondaryMetricValue}</strong>
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
            <h3 className="text-sm font-bold text-slate-900">Governance & Safety Health</h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Audit Posture: DEFENSIVE
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Agents in Prod</span>
            <span className="font-bold text-slate-900 text-sm font-mono">4</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Passing Evals</span>
            <span className="font-bold text-emerald-700 text-sm font-mono">4 / 4</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Critical Failures</span>
            <span className="font-bold text-slate-900 text-sm font-mono">0</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Guardrails Blocked</span>
            <span className="font-bold text-amber-700 text-sm font-mono">2 violations</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">HR Approvals (Wk)</span>
            <span className="font-bold text-teal-800 text-sm font-mono">182</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Emergency Stops</span>
            <span className={`font-bold text-sm font-mono ${isKilled ? 'text-rose-700' : 'text-slate-900'}`}>
              {isKilled ? '1 Active' : '0 this month'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Compliance Status</span>
            <span className="font-bold text-emerald-700 text-sm">Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
