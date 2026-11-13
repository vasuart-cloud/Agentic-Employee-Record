import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoScenarioId } from '../../types';
import { X, ShieldAlert, Play, CheckCircle2, RotateCcw } from 'lucide-react';

const GUIDE_SCENARIOS: { id: DemoScenarioId; label: string; detail: string }[] = [
  {
    id: 'scenario_1_expired_pharmacist',
    label: 'Scenario 1: Expired CA Pharmacist (Daniel Kim)',
    detail: 'Walk through Why-Flagged -> Maya Outreach -> Employee Portal Upload -> Alex PSV -> Partial Readiness (Amber while GCP training remains open) -> Full Ready -> Workday Staging Sync.'
  },
  {
    id: 'scenario_2_newhire_nurse',
    label: 'Scenario 2: Preboarding Texas RN (Elena Alvarez)',
    detail: 'Starts 2026-11-19 (7 days out). Separates Administrative Onboarding % from Clinical Duty Eligibility.'
  },
  {
    id: 'scenario_3_suspended_license',
    label: 'Scenario 3: Restricted Board Status (Marcus Vance)',
    detail: 'Negative PSV fixture blocks administrative closure and triggers clinical leadership escalation.'
  },
  {
    id: 'scenario_4_workday_retry',
    label: 'Scenario 4: Workday HTTP 504 Timeout & Scoped Retry (Hannah Abbott)',
    detail: 'Retry failed outbound writeback TX-WD-9062 with idempotency key without altering master HR records.'
  },
  {
    id: 'scenario_5_priya_policy_publish',
    label: 'Scenario 5: Rule Test Lab Failure -> Fix -> Independent Sign-Off',
    detail: 'Priya runs RULE-CA-PHARM-DRAFT (FIX-05 fails 11/12), enables out-of-state rejection (12/12), submits, and Alex approves.'
  },
  {
    id: 'scenario_6_david_executive',
    label: 'Scenario 6: Executive Facility Risk & Realizable Value (David)',
    detail: 'Aggregate readiness across 4 facilities, sample vs enterprise denominators, and capacity vs cash ROI.'
  }
];

export const DemoGuideModal: React.FC = () => {
  const { isDemoGuideOpen, setIsDemoGuideOpen, launchDemoScenario, resetScenario } = useApp();

  useEffect(() => {
    if (!isDemoGuideOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDemoGuideOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isDemoGuideOpen, setIsDemoGuideOpen]);

  if (!isDemoGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60"
        onClick={() => setIsDemoGuideOpen(false)}
      />
      <div className="relative z-10 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-xs max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Demo Guide &amp; Honest Architecture Boundaries
            </h2>
            <p className="text-slate-500 mt-0.5">
              BioVanguard Health Systems · Reproducible synthetic dataset anchored to 2026-11-12
            </p>
          </div>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Close demo guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-900">
              <ShieldAlert className="w-4 h-4" />
              <span>What This Browser Prototype Simulates vs Real Production Requirements</span>
            </div>
            <ul className="space-y-1 text-amber-950 list-disc list-inside leading-relaxed">
              <li>
                <strong>System Boundaries:</strong> Workday HCM stays authoritative for worker/job/org master data; licensing boards/CVOs stay authoritative for license status; clinical leaders authorize clinical duty eligibility.
              </li>
              <li>
                <strong>Four Separated State Dimensions:</strong> Document Upload State, Primary Source Verification (PSV), Clinical Duty Eligibility, and Workday Staging Sync never collapse into one boolean.
              </li>
              <li>
                <strong>Simulated Controls:</strong> Browser persona switcher, MockWorkdayAdapter staging writebacks, licensing board fixtures, and local event history (not tamper-proof SHA-256 ledger) are simulated for discovery demos.
              </li>
              <li>
                <strong>Privacy &amp; PHI:</strong> Occupational Health medical details are strictly excluded; HR and Executive views display clearance status only.
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              Launch or Reset Individual Discovery Scenarios
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GUIDE_SCENARIOS.map((sc) => (
                <div
                  key={sc.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-900">{sc.label}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{sc.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        launchDemoScenario(sc.id);
                        setIsDemoGuideOpen(false);
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Launch</span>
                    </button>
                    <button
                      onClick={() => {
                        resetScenario(sc.id);
                        setIsDemoGuideOpen(false);
                      }}
                      title="Reset only this scenario to baseline"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-slate-600 leading-relaxed">
              <strong>Separation of Duties Enforced:</strong> Maya (HR Ops) cannot mark clinical licenses primary-source verified; Priya (Compliance Admin) cannot self-approve her own rule version. Switch to <strong>Alex Morgan (Credentialing Reviewer)</strong> in the header Role Menu to complete PSV checks and independent rule sign-off.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
