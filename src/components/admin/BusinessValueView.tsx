import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator } from 'lucide-react';

export const BusinessValueView: React.FC = () => {
  const { roiAssumptions, updateRoiAssumptions, computedMetrics } = useApp();

  const minutesSavedPerCase = Math.max(
    0,
    roiAssumptions.baselineManualMinutesPerCase - roiAssumptions.assistedMinutesPerCase
  );
  const totalAnnualCost =
    roiAssumptions.annualSoftwareSubscriptionCost +
    roiAssumptions.annualImplementationAndIntegrationCost;

  const scenarioSensitivity = [
    { label: 'Conservative (25% cash realization)', factor: 0.25 },
    { label: `Current Model (${Math.round(roiAssumptions.capacityToCashRealizationFactor * 100)}% realization)`, factor: roiAssumptions.capacityToCashRealizationFactor },
    { label: 'Optimistic (70% cash realization)', factor: 0.7 }
  ].map((s) => {
    const realizable = Math.round(computedMetrics.modeledAnnualCapacityValue * s.factor);
    const net = realizable - totalAnnualCost;
    return { ...s, realizable, net };
  });

  return (
    <div className="space-y-6 text-xs">
      <div>
        <div className="text-xs font-medium text-teal-800">
          Modeled Operational Economics · Editable Assumptions
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mt-0.5">
          Business Value &amp; Capacity-to-Cash Sensitivity Model
        </h1>
        <p className="text-slate-600 mt-1">
          Explicitly separates HR operational capacity released (hours saved) from conservative cash-realizable savings after software, implementation, and Workday integration costs.
        </p>
      </div>

      {/* Modeled Outputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Modeled Capacity Released</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
            {computedMetrics.modeledMonthlyHoursSaved} hrs / mo
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            {minutesSavedPerCase} min saved per exception
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Annual Equivalent Labor Value</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
            ${computedMetrics.modeledAnnualCapacityValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Gross time value (not hard cash)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Cash-Realizable Value</div>
          <div className="text-2xl font-semibold text-teal-800 mt-1 tabular-nums">
            ${computedMetrics.modeledAnnualCashRealizable.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            At {Math.round(roiAssumptions.capacityToCashRealizationFactor * 100)}% realization factor
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Modeled Annual Net Value</div>
          <div
            className={`text-2xl font-semibold mt-1 tabular-nums ${
              computedMetrics.modeledAnnualNetValue >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            ${computedMetrics.modeledAnnualNetValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            Net of ${totalAnnualCost.toLocaleString()} annual cost
          </div>
        </div>
      </div>

      {/* Assumptions Form + Sensitivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
            <Calculator className="w-4 h-4 text-teal-700" />
            <span>Interactive Model Assumptions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Monthly Exceptions Volume
              </label>
              <input
                type="number"
                value={roiAssumptions.monthlyExceptionVolume}
                onChange={(e) =>
                  updateRoiAssumptions({ monthlyExceptionVolume: Math.max(0, Number(e.target.value)) })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Loaded HR/Credentialing Hourly Rate ($)
              </label>
              <input
                type="number"
                value={roiAssumptions.loadedHrHourlyRate}
                onChange={(e) =>
                  updateRoiAssumptions({ loadedHrHourlyRate: Math.max(0, Number(e.target.value)) })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Baseline Manual Minutes / Case
              </label>
              <input
                type="number"
                value={roiAssumptions.baselineManualMinutesPerCase}
                onChange={(e) =>
                  updateRoiAssumptions({
                    baselineManualMinutesPerCase: Math.max(0, Number(e.target.value))
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Assisted Workflow Minutes / Case
              </label>
              <input
                type="number"
                value={roiAssumptions.assistedMinutesPerCase}
                onChange={(e) =>
                  updateRoiAssumptions({ assistedMinutesPerCase: Math.max(0, Number(e.target.value)) })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Annual Software Cost ($)
              </label>
              <input
                type="number"
                value={roiAssumptions.annualSoftwareSubscriptionCost}
                onChange={(e) =>
                  updateRoiAssumptions({
                    annualSoftwareSubscriptionCost: Math.max(0, Number(e.target.value))
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Annual Implementation &amp; Integration ($)
              </label>
              <input
                type="number"
                value={roiAssumptions.annualImplementationAndIntegrationCost}
                onChange={(e) =>
                  updateRoiAssumptions({
                    annualImplementationAndIntegrationCost: Math.max(0, Number(e.target.value))
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Capacity-to-Cash Realization Factor</span>
              <span className="font-mono tabular-nums">
                {Math.round(roiAssumptions.capacityToCashRealizationFactor * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={90}
              value={Math.round(roiAssumptions.capacityToCashRealizationFactor * 100)}
              onChange={(e) =>
                updateRoiAssumptions({ capacityToCashRealizationFactor: Number(e.target.value) / 100 })
              }
              className="w-full accent-teal-700"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="font-semibold text-slate-900 text-sm">
            Sensitivity Range (Capacity vs Hard Cash)
          </div>
          <div className="space-y-3">
            {scenarioSensitivity.map((sc) => (
              <div key={sc.label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{sc.label}</div>
                  <div className="text-[11px] text-slate-500 tabular-nums">
                    Realizable: ${sc.realizable.toLocaleString()} − Cost: ${totalAnnualCost.toLocaleString()}
                  </div>
                </div>
                <div
                  className={`text-base font-semibold tabular-nums ${
                    sc.net >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  ${sc.net.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            Note: Figures above are modeled projections for buyer evaluation. Actual pilot ROI must be validated against measured baseline labor hours and agency/overtime avoidance.
          </div>
        </div>
      </div>
    </div>
  );
};
