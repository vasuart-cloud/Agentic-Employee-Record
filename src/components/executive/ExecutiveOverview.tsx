import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  FileCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ExecutiveOverview: React.FC = () => {
  const { computedMetrics, setCurrentScreen, organization, complianceCases } = useApp();

  return (
    <div className="space-y-6 text-left">
      {/* Executive Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              CHRO & Board Briefing
            </span>
            <span className="text-xs text-slate-400">· Active Persona: David Miller (VP People)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Continuous Workforce Compliance & Audit Readiness
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Enterprise-wide visibility into file completeness, regulatory compliance exposure, and automated remediation velocity.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('business_value')}
          className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-2"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>View Detailed ROI Economics</span>
        </button>
      </div>

      {/* Hero North Star Metric Card */}
      <div className="bg-teal-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>North Star Metric</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {computedMetrics.northStarAuditReadyPercent}% of Monitored Files Continuously Audit-Ready
          </h2>
          <p className="text-xs text-teal-100 leading-relaxed">
            Every file possesses verified, unexpired evidence meeting active state and corporate regulatory policies within established SLAs.
          </p>
        </div>

        <div className="bg-teal-800/80 border border-teal-700 rounded-xl p-4 min-w-[200px] text-center space-y-1">
          <div className="text-[10px] font-bold text-teal-300 uppercase">Audit Defense Target</div>
          <div className="text-3xl font-black text-white">&ge; 95%</div>
          <div className="text-[10px] text-emerald-300 font-semibold">
            {computedMetrics.northStarAuditReadyPercent >= 85 ? 'On Track for ISO & FDA Audit' : 'In Active Remediation'}
          </div>
        </div>
      </div>

      {/* KPI Trio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Monitored Workforce
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {computedMetrics.totalMonitored}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {organization.departments.length} departments & {organization.states.length} states
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Outstanding Compliance Gaps
          </div>
          <div className={`text-3xl font-black mt-2 ${computedMetrics.openCasesCount > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {computedMetrics.openCasesCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {computedMetrics.criticalCasesCount} critical licensure or verification items
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            HR Operational Labor Saved
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">
            {computedMetrics.totalMinutesSaved} min
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ${computedMetrics.estimatedLaborValueSaved} saved in current demo session
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="font-bold text-sm text-slate-900">
          Workforce Health by Department Cohort
        </div>
        <div className="space-y-2 text-xs">
          {[
            { name: 'R&D Operations (Clinical)', count: 12, compliance: computedMetrics.openCasesCount === 0 ? 100 : 92, risk: 'Low' },
            { name: 'Corporate Finance', count: 6, compliance: 100, risk: 'Low' },
            { name: 'Product & Tech', count: 8, compliance: 100, risk: 'Low' },
            { name: 'Manufacturing & Supply', count: 10, compliance: 100, risk: 'Low' }
          ].map((d) => (
            <div key={d.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
              <div className="font-semibold text-slate-800">{d.name}</div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">{d.count} files monitored</span>
                <span className="font-bold text-emerald-700">{d.compliance}% Audit Ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
