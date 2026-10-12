import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Users, 
  FileCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  PieChart
} from 'lucide-react';

export const BusinessValueView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 tracking-widest uppercase mb-0.5">
            EXECUTIVE ROI & HR OPERATIONAL ECONOMICS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Business Value Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrating tangible HR service delivery cost savings, reduced audit risk, and operational velocity.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 font-mono block">PILOT ECONOMIC MODEL</span>
          <span className="text-xs font-bold text-teal-700">Multi-State 10,000 Worker Enterprise</span>
        </div>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">MONTHLY PRODUCTIVITY VALUE</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">$64,200</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">1,284 HR hours saved / month</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">ANNUALIZED VALUE</div>
          <div className="text-3xl font-extrabold text-teal-700 font-mono mt-1">$770,400</div>
          <div className="text-xs text-slate-500 mt-1">Direct labor reallocation</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">AUDIT PREP EFFORT</div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">-86%</div>
          <div className="text-xs text-slate-500 mt-1">Down from 5 days to 7 hours</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">COST PER RESOLVED CASE</div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">↓ 42%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">2.4 touches vs 6.2 baseline</div>
        </div>
      </div>

      {/* ROI HYPOTHESIS COMPARISON BOX */}
      <div className="bg-white border-2 border-teal-500/40 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block mb-0.5">
              ECONOMIC PROPOSITION
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              ROI Hypothesis & Enterprise Justification
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Value Multiple:</span>
            <span className="text-base font-extrabold font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg">
              3.1× Net ROI
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-500 uppercase font-mono text-[10px] block">ANNUAL SUBSCRIPTION COST</span>
            <div className="text-2xl font-bold font-mono text-slate-900">$250,000</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Tier for 10,000 active employees with unlimited continuous file monitoring across Workday, SharePoint, and DocuSign.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
            <span className="font-bold text-teal-700 uppercase font-mono text-[10px] block">ANNUAL OPERATIONAL VALUE</span>
            <div className="text-2xl font-bold font-mono text-teal-900">$770,400</div>
            <p className="text-teal-800 text-[11px] leading-relaxed">
              Direct operational savings: 15,408 annual HR Operations hours saved @ $50/hour loaded cost.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-700 uppercase font-mono text-[10px] block">NET MONETARY BENEFIT</span>
            <div className="text-2xl font-bold font-mono text-emerald-900">+$520,400</div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Net annual surplus after software subscription. Excludes avoided statutory fines (e.g. $2,500/missing I-9).
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 italic">
          * Illustrative customer economics — validate during design-partner pilots with HR Operations leadership.
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Audits & Governance</span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Audit-Ready Files:</span>
              <span className="font-bold text-teal-700">91% (11,356)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Audit Dossiers Generated:</span>
              <span className="font-bold text-slate-900">342 packets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">USCIS Penalty Exposure:</span>
              <span className="font-bold text-emerald-700">Near Zero</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">File Completeness Velocity</span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Files Monitored:</span>
              <span className="font-bold text-slate-900">12,480 workers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Docs Classified:</span>
              <span className="font-bold text-slate-900">84,390 files</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Gaps Prevented:</span>
              <span className="font-bold text-teal-700">1,623 resolved</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Cycle Time Reduction</span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Gap Resolution:</span>
              <span className="font-bold text-emerald-700">63% faster (3.1d)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Manual File Review:</span>
              <span className="font-bold text-emerald-700">5 min (vs 18 min)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Adoption Rate:</span>
              <span className="font-bold text-slate-900">92% Weekly Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
