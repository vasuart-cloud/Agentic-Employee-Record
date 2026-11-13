import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, MapPin, TrendingUp, ClipboardCheck, ShieldAlert, Lock } from 'lucide-react';

export const ExecutiveOverview: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    organization,
    facilities,
    workers,
    cases,
    workerReadinessMap,
    computedMetrics,
    openWorkerDossier
  } = useApp();

  const [showPostDanielCompare, setShowPostDanielCompare] = useState(false);

  const activeTab: 'executive_overview' | 'risk_by_facility' | 'readiness_trends' | 'pilot_scorecard' =
    currentScreen === 'risk_by_facility' ||
    currentScreen === 'readiness_trends' ||
    currentScreen === 'pilot_scorecard'
      ? currentScreen
      : 'executive_overview';

  const facilityStats = useMemo(() => {
    return facilities.map((fac) => {
      const facWorkers = workers.filter((w) => w.primaryFacilityId === fac.id);
      const readyCount = facWorkers.filter(
        (w) => workerReadinessMap[w.id]?.overallStatus === 'READY'
      ).length;
      const openCases = cases.filter(
        (c) => c.facilityId === fac.id && c.workflowState !== 'resolved'
      );
      const criticalCount = openCases.filter((c) => c.severity === 'Critical').length;
      const escalations = openCases.filter(
        (c) => c.clinicalEligibilityState === 'REVIEW_REQUIRED' || c.verificationState === 'RESTRICTED'
      ).length;
      const readinessPct =
        facWorkers.length > 0 ? Math.round((readyCount / facWorkers.length) * 100) : 0;

      return {
        facility: fac,
        workerCount: facWorkers.length,
        readyCount,
        openCasesCount: openCases.length,
        criticalCount,
        escalations,
        readinessPct
      };
    });
  }, [facilities, workers, cases, workerReadinessMap]);

  const danielReadiness = workerReadinessMap['EMP-10419'];
  const danielCases = cases.filter((c) => c.workerId === 'EMP-10419');
  const danielOpenCount = danielCases.filter((c) => c.workflowState !== 'resolved').length;

  return (
    <div className="space-y-6 text-xs">
      {/* Header + Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-teal-800">
            Read-Only Executive View · {organization.name}
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mt-0.5">
            Executive Readiness &amp; Facility Exposure
          </h1>
          <p className="text-slate-600 mt-1">
            Sample cohort: <strong className="tabular-nums">{computedMetrics.sampleWorkersCount}</strong> workers /{' '}
            <strong className="tabular-nums">{computedMetrics.totalApplicableRequirements}</strong> evaluated requirements (Enterprise context:{' '}
            {computedMetrics.enterpriseHeadcountContext.toLocaleString()}). Restricted medical PHI excluded.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['executive_overview', 'Executive Overview', Building2],
              ['risk_by_facility', 'Risk by Facility', MapPin],
              ['readiness_trends', 'Readiness & Preboarding', TrendingUp],
              ['pilot_scorecard', 'Pilot Scorecard', ClipboardCheck]
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setCurrentScreen(id)}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${
                activeTab === id
                  ? 'bg-teal-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Explicit Measurement & Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Read-only CHRO view: Occupational Health medical details are excluded, and operational approvals remain restricted to HR Ops, Credentialing, and Clinical Leadership.
          </span>
        </div>
        <button
          onClick={() => setShowPostDanielCompare((s) => !s)}
          className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50"
        >
          {showPostDanielCompare ? 'Hide Daniel Case Comparison' : 'Show What Changed After Daniel Case'}
        </button>
      </div>

      {showPostDanielCompare && (
        <div className="bg-white border border-teal-200 rounded-xl p-4 space-y-2">
          <div className="font-semibold text-slate-900">
            Live Comparison — Daniel Kim (EMP-10419 · California Clinical Research Center)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Seeded Baseline</div>
              <div className="mt-1 text-slate-700">
                0 / 2 requirements satisfied (0% · Critical Red). Expired license #RPH-84920 escalated; GCP training overdue.
              </div>
            </div>
            <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-200">
              <div className="text-[11px] font-semibold text-teal-800 uppercase">Current Live State</div>
              <div className="mt-1 text-slate-900 font-medium tabular-nums">
                {danielReadiness?.satisfiedRequirementsCount} / {danielReadiness?.totalApplicableRequirements} requirements satisfied (
                {danielReadiness?.readinessPercent}% · {danielReadiness?.overallStatusLabel}). Open cases for Daniel: {danielOpenCount}.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Observed Sample Readiness</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
            {computedMetrics.sampleReadinessPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            {computedMetrics.readyWorkersCount} of {computedMetrics.sampleWorkersCount} sample workers fully ready
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Open Compliance Exceptions</div>
          <div className="text-2xl font-semibold text-amber-700 mt-1 tabular-nums">
            {computedMetrics.openCasesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            {computedMetrics.criticalCasesCount} critical · {computedMetrics.clinicalEscalationsPending} clinical escalations
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Modeled Annual Cash Realizable</div>
          <div className="text-2xl font-semibold text-teal-800 mt-1 tabular-nums">
            ${computedMetrics.modeledAnnualCashRealizable.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Modeled estimate (see Business Value tab)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-slate-500">Pre-Implementation Baseline Latency</div>
          <div className="text-2xl font-semibold text-slate-700 mt-1">Not measured</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Requires 90-day pilot time-study baseline
          </div>
        </div>
      </div>

      {/* Facility Risk Table */}
      {(activeTab === 'executive_overview' || activeTab === 'risk_by_facility') && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900">
            Facility Readiness &amp; Escalation Exposure (Sample Cohort n={computedMetrics.sampleWorkersCount})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500 bg-slate-50/50">
                  <th className="py-2.5 px-4">Facility</th>
                  <th className="py-2.5 px-4">State / Regulatory Context</th>
                  <th className="py-2.5 px-4">Sample Workers</th>
                  <th className="py-2.5 px-4">Ready (%)</th>
                  <th className="py-2.5 px-4">Open Exceptions</th>
                  <th className="py-2.5 px-4">Clinical Escalations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facilityStats.map((fs) => (
                  <tr key={fs.facility.id}>
                    <td className="py-3 px-4 font-semibold text-slate-900">{fs.facility.name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{fs.facility.state} · {fs.facility.type}</div>
                      <div className="text-[11px] text-slate-500">{fs.facility.regulatoryContext}</div>
                    </td>
                    <td className="py-3 px-4 tabular-nums">{fs.workerCount}</td>
                    <td className="py-3 px-4 font-semibold tabular-nums">
                      {fs.readyCount}/{fs.workerCount} ({fs.readinessPct}%)
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      {fs.openCasesCount} ({fs.criticalCount} critical)
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      {fs.escalations > 0 ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{fs.escalations} pending</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preboarding & Readiness Trends */}
      {(activeTab === 'executive_overview' || activeTab === 'readiness_trends') && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Preboarding &amp; Transfer Time-to-Readiness Watchlist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workers
              .filter((w) => w.employmentStatus === 'Preboarding' || w.employmentStatus === 'Pending Transfer')
              .map((w) => {
                const r = workerReadinessMap[w.id];
                return (
                  <div key={w.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{w.name} ({w.primaryRole})</div>
                      <div className="text-[11px] text-slate-600">
                        {w.primaryFacilityName} · Start: {w.startDate}{' '}
                        {r?.daysToStart !== null && `(${r.daysToStart} days away)`}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 tabular-nums">
                        Admin Onboarding: <strong>{r?.administrativeOnboardingPercent}%</strong> · Clinical Eligibility:{' '}
                        <strong>{w.clinicalEligibility.replace(/_/g, ' ')}</strong>
                      </div>
                    </div>
                    <button
                      onClick={() => openWorkerDossier(w.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-semibold text-slate-700 shrink-0"
                    >
                      Inspect
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Pilot Scorecard */}
      {activeTab === 'pilot_scorecard' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900">
            Pilot Evaluation Scorecard — Provenance &amp; Measurement Confidence
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500 bg-slate-50/50">
                <th className="py-2.5 px-4">Metric</th>
                <th className="py-2.5 px-4">Current Value</th>
                <th className="py-2.5 px-4">Data Basis</th>
                <th className="py-2.5 px-4">Caveat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-4 font-semibold">Sample Workers Evaluated</td>
                <td className="py-2.5 px-4 tabular-nums">{computedMetrics.sampleWorkersCount}</td>
                <td className="py-2.5 px-4">Synthetic Demo Seed</td>
                <td className="py-2.5 px-4 text-slate-600">11,420 enterprise count is context only, not sample size.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold">Cases Resolved in Session</td>
                <td className="py-2.5 px-4 tabular-nums">{computedMetrics.resolvedCasesCount}</td>
                <td className="py-2.5 px-4">Live Browser State</td>
                <td className="py-2.5 px-4 text-slate-600">Simulated employee portal &amp; PSV fixtures.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold">Modeled Annual Net Value</td>
                <td className="py-2.5 px-4 tabular-nums">${computedMetrics.modeledAnnualNetValue.toLocaleString()}</td>
                <td className="py-2.5 px-4">Modeled Assumption</td>
                <td className="py-2.5 px-4 text-slate-600">Applies 45% capacity-to-cash realization factor.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold">Historical Pre-Pilot Turnaround Time</td>
                <td className="py-2.5 px-4">Not measured</td>
                <td className="py-2.5 px-4">Requires Pilot Telemetry</td>
                <td className="py-2.5 px-4 text-slate-600">To be baselined during initial 90-day facility pilot.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
