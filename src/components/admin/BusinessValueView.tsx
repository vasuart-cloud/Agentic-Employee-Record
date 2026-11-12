import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  FileDown, 
  Info,
  Sparkles,
  Target
} from 'lucide-react';

export const BusinessValueView: React.FC = () => {
  const { 
    assumptions, 
    updateAssumptions, 
    computedMetrics,
    complianceCases,
    employees,
    currentPersona
  } = useApp();

  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);

  // Per-case delta
  const minutesSavedPerCase = Math.max(0, assumptions.baselineManualMinutesPerCase - assumptions.assistedMinutesPerCase);
  const resolvedCasesCount = complianceCases.filter(c => c.status === 'GREEN_RESOLVED').length;
  const actualDemoMinutesSaved = resolvedCasesCount * minutesSavedPerCase;
  const actualDemoLaborSaved = Math.round((actualDemoMinutesSaved / 60) * assumptions.loadedHrHourlyRate);

  // Scaled monthly/annual pilot projection
  const projectedMonthlyHoursSaved = Math.round((assumptions.averageMonthlyCases * minutesSavedPerCase) / 60);
  const projectedMonthlyLaborSaved = Math.round(projectedMonthlyHoursSaved * assumptions.loadedHrHourlyRate);
  const projectedAnnualGrossLaborValue = projectedMonthlyLaborSaved * 12;
  const totalCost = assumptions.annualSubscriptionCost + assumptions.annualizedImplementationCost;
  const projectedAnnualNetValue = projectedAnnualGrossLaborValue - totalCost;

  // Export summary
  const handleExportSummary = () => {
    const summary = `AGENTIC EMPLOYEE RECORDS — ROI & BUSINESS VALUE SUMMARY
Generated: ${new Date().toLocaleDateString()}
Organization: BioVanguard Health Systems
Monitored Workforce: ${computedMetrics.totalMonitored} files
North Star Audit-Ready Rate: ${computedMetrics.northStarAuditReadyPercent}%

ACTUAL DEMO RESOLUTIONS:
Resolved Cases: ${resolvedCasesCount}
Minutes Saved (Actual): ${actualDemoMinutesSaved} mins
Labor Value Saved (Actual): $${actualDemoLaborSaved}

PILOT PROJECTED ROI (Illustrative Assumptions):
Baseline Manual Review: ${assumptions.baselineManualMinutesPerCase} mins/case
Assisted Review: ${assumptions.assistedMinutesPerCase} mins/case
Loaded Hourly Rate: $${assumptions.loadedHrHourlyRate}/hr
Average Monthly Volume: ${assumptions.averageMonthlyCases} cases/month
Projected Monthly Hours Saved: ${projectedMonthlyHoursSaved} hrs/mo
Projected Annual Labor Value: $${projectedAnnualGrossLaborValue.toLocaleString()}
Annual Software & Implementation Cost: $${totalCost.toLocaleString()}
Projected Annual Net ROI: $${projectedAnnualNetValue.toLocaleString()}
`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agentic_Records_ROI_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              Quantifiable Business Impact
            </span>
            <span className="text-xs text-slate-400">· Transparent Economic Model</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Business Value & Audit Readiness ROI
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Measure operational time saved, reduction in audit exposure, and scalable pilot economics based on verifiable in-app actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssumptionsOpen(!isAssumptionsOpen)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-700" />
            <span>{isAssumptionsOpen ? 'Hide Assumptions' : 'Edit ROI Assumptions'}</span>
          </button>

          <button
            onClick={handleExportSummary}
            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export ROI Summary</span>
          </button>
        </div>
      </div>

      {/* Editable Assumptions Drawer / Banner */}
      {isAssumptionsOpen && (
        <div className="bg-white border border-teal-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" />
              <span>Configurable Economic Assumptions (Illustrative Defaults)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Formula: max(0, baseline - assisted) * cases * hourly rate</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Baseline Review</label>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  value={assumptions.baselineManualMinutesPerCase}
                  onChange={(e) => updateAssumptions({ baselineManualMinutesPerCase: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold"
                />
                <span className="text-slate-400 text-[10px]">min</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Assisted Review</label>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  value={assumptions.assistedMinutesPerCase}
                  onChange={(e) => updateAssumptions({ assistedMinutesPerCase: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold"
                />
                <span className="text-slate-400 text-[10px]">min</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Loaded HR Rate</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[10px]">$</span>
                <input 
                  type="number"
                  value={assumptions.loadedHrHourlyRate}
                  onChange={(e) => updateAssumptions({ loadedHrHourlyRate: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold"
                />
                <span className="text-slate-400 text-[10px]">/hr</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Monthly Cases</label>
              <input 
                type="number"
                value={assumptions.averageMonthlyCases}
                onChange={(e) => updateAssumptions({ averageMonthlyCases: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Annual Subscription</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[10px]">$</span>
                <input 
                  type="number"
                  value={assumptions.annualSubscriptionCost}
                  onChange={(e) => updateAssumptions({ annualSubscriptionCost: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Implementation</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[10px]">$</span>
                <input 
                  type="number"
                  value={assumptions.annualizedImplementationCost}
                  onChange={(e) => updateAssumptions({ annualizedImplementationCost: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Value Cards (Dual Column: In-App Demo Actuals vs Scaled Pilot Projections) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Actual Demo Impact */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Demo State Outcome
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
              Verified Actuals
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-2xl font-black text-slate-900">
                {actualDemoMinutesSaved} min
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Saved across {resolvedCasesCount} resolved case{resolvedCasesCount === 1 ? '' : 's'}
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-emerald-700">
                ${actualDemoLaborSaved}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Direct labor value saved
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 leading-snug">
            Calculated dynamically from {minutesSavedPerCase} minutes saved per completed case at ${assumptions.loadedHrHourlyRate}/hr.
          </p>
        </div>

        {/* Scaled Pilot Projection */}
        <div className="bg-teal-900 text-white rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              Projected Annual Net ROI (Pilot)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-800 text-teal-200">
              Illustrative Projection
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-2xl font-black text-white">
                ${projectedAnnualNetValue.toLocaleString()}
              </div>
              <div className="text-xs text-teal-200 mt-0.5">
                Annual net savings (after SaaS cost)
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-amber-300">
                {projectedMonthlyHoursSaved * 12} hrs
              </div>
              <div className="text-xs text-teal-200 mt-0.5">
                Annual HR operational hours saved
              </div>
            </div>
          </div>

          <p className="text-[11px] text-teal-200 pt-2 border-t border-teal-800 leading-snug">
            Based on {assumptions.averageMonthlyCases} exceptions/mo, $36K annual software fee, and $12K onboarding cost.
          </p>
        </div>
      </div>

      {/* HERO COMPARISON: Daniel Kim Before vs After Case Study */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>Hero Workflow Efficiency Comparison: Daniel Kim (EMP-10419)</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
            87% Turnaround Reduction
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Baseline Manual */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="font-bold text-slate-800 text-xs uppercase text-slate-400">
              Legacy Manual Audit Process
            </div>
            <div className="space-y-1 text-slate-600">
              <div>• <strong>45 minutes</strong> of manual cross-referencing across SharePoint & Workday</div>
              <div>• <strong>4 back-and-forth emails</strong> with employee requesting certificate</div>
              <div>• <strong>14 calendar days</strong> average turnaround to obtain evidence</div>
              <div>• <strong>Zero audit ledger trail</strong> proving who verified what clause</div>
              <div>• Discovered only during quarterly audit panic</div>
            </div>
          </div>

          {/* Agentic Flow */}
          <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl space-y-2">
            <div className="font-bold text-teal-800 text-xs uppercase">
              Agentic Employee Records Flow
            </div>
            <div className="space-y-1 text-teal-900">
              <div>• <strong>6 minutes</strong> of human HR review & approval (Gates 2 & 3)</div>
              <div>• <strong>1-click outreach</strong> pre-drafted with exact policy citation</div>
              <div>• <strong>48 hours</strong> turnaround via simulated self-service portal</div>
              <div>• <strong>Immutable SHA-256 ledger</strong> capturing exact rule v3.8 clause</div>
              <div>• Automated metadata writeback to Workday HCM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pilot Hypothesis & Expansion Goals */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-teal-700" />
          <span>Enterprise Pilot Hypotheses (Product Deck Validation)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-900 mb-1">Adoption Hypothesis</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              HR Ops uses weekly exception queue as primary workflow without opening raw SharePoint folders.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-900 mb-1">Trust Hypothesis</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Explainable "Why Flagged?" citations reduce employee outreach approval reluctance to &lt; 5%.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-900 mb-1">Efficiency Hypothesis</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              At least 35 minutes saved per credential remediation with zero compliance escapes.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-900 mb-1">Expansion Hypothesis</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Expand from initial Clinical R&D cohort to enterprise-wide 11,400 multi-state workers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
