import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  Percent
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'quarter' | 'custom'>('30d');

  const funnelSteps = [
    { name: '1. AI Finding Created', percent: 100, count: '2,146' },
    { name: '2. HR Viewed Finding', percent: 92, count: '1,974', dropoff: '8%' },
    { name: '3. "Why?" Viewed', percent: 68, count: '1,459', dropoff: '24%' },
    { name: '4. Finding Confirmed', percent: 84, count: '1,802', dropoff: '8%' },
    { name: '5. Remediation Approved', percent: 78, count: '1,673', dropoff: '6%' },
    { name: '6. Issue Resolved', percent: 71, count: '1,523', dropoff: '7%' }
  ];

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 tracking-widest uppercase mb-0.5">
            MIXPANEL-INSPIRED PRODUCT & AGENT BEHAVIORAL TELEMETRY
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product & Agent Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Measure automation adoption, human trust calibration, and file completeness velocity.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: 'quarter', label: 'Quarter' },
            { id: 'custom', label: 'Custom' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as any)}
              className={`px-3 py-1 rounded transition-colors ${
                timeRange === t.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary North Star Metric Hero Card */}
      <div className="bg-gradient-to-r from-teal-50 via-teal-50/50 to-white border-2 border-teal-500/40 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRIMARY NORTH STAR METRIC</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            % of Monitored Employee Files Continuously Audit-Ready
          </h2>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-extrabold text-teal-800 font-mono">91%</span>
            <span className="text-xs text-slate-500 font-mono">Target: <strong className="text-slate-800 font-semibold">95%</strong> (In-progress)</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            11,356 of 12,480 employee records possess 100% complete, unexpired, verifiable evidence.
          </p>
        </div>

        <div className="bg-white border border-teal-200 rounded-xl p-4 text-right space-y-1 shrink-0 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">MONTHLY TRAJECTORY</span>
          <div className="text-2xl font-bold font-mono text-emerald-600">+3.4% MoM</div>
          <span className="text-[11px] text-slate-500 block">From 82% at system launch</span>
        </div>
      </div>

      {/* SECTION 28: MIXPANEL FUNNEL WITH DROPOFF */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>Human-in-the-Loop Conversion Funnel</span>
            </h3>
            <p className="text-xs text-slate-500">
              Progression from AI anomaly generation to HR Operations closure.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
            71% End-to-End Resolution Rate
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">{step.name}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400 text-[11px]">{step.count} files</span>
                  <span className="text-teal-800 font-bold">{step.percent}%</span>
                  {step.dropoff && (
                    <span className="text-rose-600 text-[11px]">(-{step.dropoff} drop)</span>
                  )}
                </div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${step.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Callout with CTA */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Funnel Insight:</strong> Largest drop-off occurs between finding confirmation and remediation approval (HR users taking time to customize employee messages).
            </span>
          </div>

          <button
            onClick={() => setCurrentScreen('agent_workflows')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1 shadow-xs"
          >
            <span>Investigate Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Pillars: Adoption, Trust, Quality, Efficiency (Sections 24-27) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Adoption */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase">1. Adoption</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Weekly Active HR Users:</span>
              <span className="font-bold font-mono text-slate-900">42 users</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Dossiers Reviewed:</span>
              <span className="font-bold font-mono text-slate-900">1,490</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">AI Cases Handled:</span>
              <span className="font-bold font-mono text-slate-900">1,623</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Repeat HR Users:</span>
              <span className="font-bold font-mono text-emerald-600">94%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Copilot Queries / Wk:</span>
              <span className="font-bold font-mono text-teal-700">14.2 / user</span>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase">2. Trust Metrics</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">AI Finding Acceptance:</span>
              <span className="font-bold font-mono text-slate-900">89%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Human Override Rate:</span>
              <span className="font-bold font-mono text-amber-700">4.2%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">"Why?" Evidence Drill-down:</span>
              <span className="font-bold font-mono text-teal-700">38%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Low-Confidence Escalation:</span>
              <span className="font-bold font-mono text-slate-900">6.4%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Recommendation Accept:</span>
              <span className="font-bold font-mono text-emerald-600">87%</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-200">
            * Warning: Never interpret acceptance alone. High acceptance with zero evidence review signals automation bias.
          </div>
        </div>

        {/* Quality */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase">3. Quality Metrics</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Classification Accuracy:</span>
              <span className="font-bold font-mono text-emerald-600">98.2%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Compliance Precision:</span>
              <span className="font-bold font-mono text-slate-900">96.8%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Compliance Recall:</span>
              <span className="font-bold font-mono text-slate-900">95.1%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">False Positives:</span>
              <span className="font-bold font-mono text-slate-700">3.2%</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Citation Accuracy:</span>
              <span className="font-bold font-mono text-teal-700">99.1%</span>
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase">4. Efficiency</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Median Resolution:</span>
              <span className="font-bold font-mono text-teal-700">3.1 days <span className="text-[10px] text-slate-400 font-normal">(was 8.4d)</span></span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">HR Touches Per Case:</span>
              <span className="font-bold font-mono text-teal-700">2.4 <span className="text-[10px] text-slate-400 font-normal">(was 6.2)</span></span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Manual Review Time:</span>
              <span className="font-bold font-mono text-emerald-600">5 min <span className="text-[10px] text-slate-400 font-normal">(was 18m)</span></span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Audit Package Prep:</span>
              <span className="font-bold font-mono text-emerald-600">7 hours <span className="text-[10px] text-slate-400 font-normal">(was 5d)</span></span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="text-slate-500">Cost Savings / Mo:</span>
              <span className="font-bold font-mono text-slate-900">$64,200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
