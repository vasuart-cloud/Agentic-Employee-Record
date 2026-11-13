import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getCaseDaysUntilDue, getCaseDurationDays } from '../../domain/readiness';
import { DEMO_REFERENCE_DATE } from '../../domain/rules';
import { ComplianceCase } from '../../types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Filter,
  Search,
  ListChecks
} from 'lucide-react';

type QueueTab =
  | 'all_open'
  | 'clinical_risk'
  | 'expired_urgent'
  | 'preboarding_expiring'
  | 'employee_pending'
  | 'needs_verification'
  | 'sync_failures';

export const WeeklyOperationsDashboard: React.FC = () => {
  const {
    cases,
    workers,
    facilities,
    workerReadinessMap,
    syncTransactions,
    computedMetrics,
    openWorkerDossier,
    setCurrentScreen,
    organization
  } = useApp();

  const [activeTab, setActiveTab] = useState<QueueTab>('all_open');
  const [weekWindow, setWeekWindow] = useState<'current' | 'prior' | 'all'>('current');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [facilityFilter, setFacilityFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [showResolved, setShowResolved] = useState<boolean>(false);
  const [showReviewGuide, setShowReviewGuide] = useState<boolean>(false);

  const uniqueStates = useMemo(
    () => Array.from(new Set(facilities.map((f) => f.state))).sort(),
    [facilities]
  );

  const workerById = useMemo(() => {
    const m: Record<string, (typeof workers)[number]> = {};
    for (const w of workers) m[w.id] = w;
    return m;
  }, [workers]);

  const weeklySummary = useMemo(() => {
    const open = cases.filter((c) => c.workflowState !== 'resolved');
    const uniqueWorkers = new Set(open.map((c) => c.workerId)).size;
    const newlyDetected = open.filter((c) => c.detectedDate >= '2026-11-09').length;
    const carriedOver = open.filter((c) => c.detectedDate < '2026-11-09').length;
    const overdue = open.filter((c) => getCaseDaysUntilDue(c, DEMO_REFERENCE_DATE) < 0).length;
    return {
      uniqueWorkers,
      newlyDetected,
      carriedOver,
      overdue
    };
  }, [cases]);

  const filteredCases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cases.filter((c) => {
      if (!showResolved && c.workflowState === 'resolved' && activeTab !== 'sync_failures') {
        return false;
      }
      if (weekWindow === 'current' && c.detectedDate > '2026-11-15') return false;
      if (weekWindow === 'prior' && c.detectedDate >= '2026-11-09') return false;
      if (facilityFilter !== 'ALL' && c.facilityId !== facilityFilter) return false;
      if (stateFilter !== 'ALL' && c.state !== stateFilter) return false;
      if (ownerFilter === 'MAYA' && !c.hrOutreachOwner.toLowerCase().includes('maya')) return false;
      if (ownerFilter === 'ALEX' && !c.clinicalRiskOwner.toLowerCase().includes('alex')) return false;
      if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
      if (q) {
        const hay = `${c.workerName} ${c.workerId} ${c.caseNumber} ${c.title} ${c.role}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      switch (activeTab) {
        case 'clinical_risk':
          return (
            c.clinicalEligibilityState === 'REVIEW_REQUIRED' ||
            c.clinicalEligibilityState === 'RESTRICTED_BY_AUTHORIZED_DECISION' ||
            c.verificationState === 'RESTRICTED' ||
            c.severity === 'Critical'
          );
        case 'expired_urgent':
          return c.caseCategory === 'Expired License' || c.verificationState === 'EXPIRED';
        case 'preboarding_expiring': {
          const w = workerById[c.workerId];
          const daysDue = getCaseDaysUntilDue(c, DEMO_REFERENCE_DATE);
          return (
            w?.employmentStatus === 'Preboarding' ||
            c.caseCategory === 'Missing Preboarding Credential' ||
            (daysDue >= 0 && daysDue <= 30)
          );
        }
        case 'employee_pending':
          return c.workflowState === 'evidence_requested' || c.documentState === 'REQUESTED';
        case 'needs_verification':
          return (
            c.documentState === 'REVIEW_REQUIRED' ||
            c.verificationState === 'PENDING_SOURCE_CHECK' ||
            c.verificationState === 'VERIFICATION_FAILED' ||
            (c.verificationState === 'VERIFIED_ACTIVE' && c.workflowState !== 'resolved')
          );
        case 'sync_failures':
          return (
            c.externalSyncState === 'FAILED' ||
            c.externalSyncState === 'RECONCILIATION_REQUIRED'
          );
        case 'all_open':
        default:
          return true;
      }
    });
  }, [
    cases,
    activeTab,
    weekWindow,
    searchQuery,
    facilityFilter,
    stateFilter,
    ownerFilter,
    severityFilter,
    showResolved,
    workerById
  ]);

  const tabs: { id: QueueTab; label: string; count: number }[] = [
    {
      id: 'all_open',
      label: 'All Open',
      count: cases.filter((c) => c.workflowState !== 'resolved').length
    },
    {
      id: 'clinical_risk',
      label: 'Immediate Clinical Risk',
      count: cases.filter(
        (c) =>
          c.workflowState !== 'resolved' &&
          (c.severity === 'Critical' ||
            c.verificationState === 'RESTRICTED' ||
            c.clinicalEligibilityState === 'REVIEW_REQUIRED')
      ).length
    },
    {
      id: 'expired_urgent',
      label: 'Expired / Urgent',
      count: cases.filter(
        (c) =>
          c.workflowState !== 'resolved' &&
          (c.caseCategory === 'Expired License' || c.verificationState === 'EXPIRED')
      ).length
    },
    {
      id: 'preboarding_expiring',
      label: 'Preboarding & 30d',
      count: cases.filter((c) => {
        if (c.workflowState === 'resolved') return false;
        const w = workerById[c.workerId];
        return w?.employmentStatus === 'Preboarding' || getCaseDaysUntilDue(c, DEMO_REFERENCE_DATE) <= 30;
      }).length
    },
    {
      id: 'employee_pending',
      label: 'Employee Pending',
      count: cases.filter(
        (c) => c.workflowState === 'evidence_requested' || c.documentState === 'REQUESTED'
      ).length
    },
    {
      id: 'needs_verification',
      label: 'Needs PSV / Review',
      count: cases.filter(
        (c) =>
          c.workflowState !== 'resolved' &&
          (c.documentState === 'REVIEW_REQUIRED' ||
            c.verificationState === 'PENDING_SOURCE_CHECK' ||
            c.verificationState === 'VERIFICATION_FAILED' ||
            c.verificationState === 'VERIFIED_ACTIVE')
      ).length
    },
    {
      id: 'sync_failures',
      label: 'Sync / Reconciliation',
      count: cases.filter(
        (c) =>
          c.externalSyncState === 'FAILED' ||
          c.externalSyncState === 'RECONCILIATION_REQUIRED'
      ).length
    }
  ];

  const failedSyncTxCount = syncTransactions.filter((t) => t.status === 'FAILED').length;

  const renderDocBadge = (c: ComplianceCase) => {
    const tone =
      c.documentState === 'ACCEPTED'
        ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
        : c.documentState === 'REVIEW_REQUIRED' || c.documentState === 'REQUESTED'
        ? 'text-amber-800 bg-amber-50 border-amber-200'
        : 'text-rose-800 bg-rose-50 border-rose-200';
    return (
      <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${tone}`}>
        {c.documentState}
      </span>
    );
  };

  const renderVerificationBadge = (c: ComplianceCase) => {
    const tone =
      c.verificationState === 'VERIFIED_ACTIVE'
        ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
        : c.verificationState === 'NOT_REQUIRED'
        ? 'text-slate-600 bg-slate-100 border-slate-200'
        : c.verificationState === 'RESTRICTED' || c.verificationState === 'EXPIRED' || c.verificationState === 'VERIFICATION_FAILED'
        ? 'text-rose-800 bg-rose-50 border-rose-200'
        : 'text-amber-800 bg-amber-50 border-amber-200';
    return (
      <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${tone}`}>
        {c.verificationState}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-teal-800">
            Week Window: 2026-11-09 to 2026-11-15 · Reference Date: {organization.demoReferenceDate}
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mt-0.5">
            Weekly Workforce Readiness
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Triage active credentialing gaps, preboarding deadlines, and clinical escalations across the {computedMetrics.sampleWorkersCount}-worker sample dataset ({organization.enterpriseHeadcountContext.toLocaleString()} enterprise context).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={weekWindow}
            onChange={(e) => setWeekWindow(e.target.value as any)}
            aria-label="Select week window"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700"
          >
            <option value="current">This Week (Nov 9–15, 2026)</option>
            <option value="prior">Carried Over (&lt; Nov 9, 2026)</option>
            <option value="all">All Windows</option>
          </select>

          <button
            onClick={() => setShowReviewGuide((s) => !s)}
            className="px-3 py-1.5 rounded-lg border border-teal-700 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold flex items-center gap-1.5"
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>{showReviewGuide ? 'Hide Weekly Review' : 'Start Weekly Compliance Review'}</span>
          </button>

          {failedSyncTxCount > 0 && (
            <button
              onClick={() => setCurrentScreen('integrations')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="tabular-nums">{failedSyncTxCount} Failed Workday Sync</span>
            </button>
          )}
        </div>
      </div>

      {showReviewGuide && (
        <div className="bg-white border border-teal-200 rounded-xl p-4 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-semibold text-teal-900">
              Recommended Weekly Operations Triage Sequence
            </div>
            <div className="text-slate-600">
              1. Triage <strong>Immediate Clinical Risk</strong> (expired/restricted credentials) → 2. Unblock <strong>Preboarding &amp; 30d</strong> hires → 3. Verify <strong>Needs PSV / Review</strong> uploads with Credentialing → 4. Reconcile <strong>Sync Failures</strong>.
            </div>
          </div>
          <button
            onClick={() => setActiveTab('clinical_risk')}
            className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold shrink-0"
          >
            Jump to Immediate Clinical Risk
          </button>
        </div>
      )}

      {/* KPI Strip — Exact Sample Denominators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('all_open')}
          className="text-left bg-white border border-slate-200 hover:border-teal-600 rounded-xl p-4 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Open Cases</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
            {computedMetrics.openCasesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            Across {computedMetrics.totalApplicableRequirements} evaluated requirements
          </div>
        </button>

        <button
          onClick={() => setActiveTab('clinical_risk')}
          className="text-left bg-white border border-slate-200 hover:border-rose-500 rounded-xl p-4 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Clinical Escalations Pending</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-semibold text-rose-700 mt-1 tabular-nums">
            {computedMetrics.clinicalEscalationsPending}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            {computedMetrics.criticalCasesCount} critical severity open
          </div>
        </button>

        <button
          onClick={() => setActiveTab('needs_verification')}
          className="text-left bg-white border border-slate-200 hover:border-amber-500 rounded-xl p-4 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Needs PSV / Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-semibold text-amber-700 mt-1 tabular-nums">
            {computedMetrics.needsReviewCount + computedMetrics.pendingPSVCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            {computedMetrics.awaitingEmployeeCount} awaiting employee response
          </div>
        </button>

        <button
          onClick={() => setCurrentScreen('employees')}
          className="text-left bg-white border border-slate-200 hover:border-teal-600 rounded-xl p-4 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Sample Workers Ready</span>
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
            {computedMetrics.readyWorkersCount} / {computedMetrics.sampleWorkersCount}{' '}
            <span className="text-sm font-medium text-slate-500">
              ({computedMetrics.sampleReadinessPercent}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            All applicable requirements satisfied
          </div>
        </button>
      </div>

      {/* Section 12 Weekly Denominator & SLA Summary Strip */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs tabular-nums">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Affected Workers / Cases</div>
          <div className="font-semibold text-slate-900 mt-0.5">
            {weeklySummary.uniqueWorkers} workers · {computedMetrics.openCasesCount} cases
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">New vs Carried Over</div>
          <div className="font-semibold text-slate-900 mt-0.5">
            {weeklySummary.newlyDetected} new · {weeklySummary.carriedOver} prior
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Overdue Exceptions</div>
          <div className={`font-semibold mt-0.5 ${weeklySummary.overdue > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
            {weeklySummary.overdue} overdue
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Aged Unowned</div>
          <div className="font-semibold text-slate-900 mt-0.5">0 unowned</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Completed This Week</div>
          <div className="font-semibold text-emerald-700 mt-0.5">
            {computedMetrics.resolvedCasesCount} resolved
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Median Handling Time</div>
          <div className="font-semibold text-slate-600 mt-0.5">Not measured</div>
        </div>
      </div>

      {/* Queue Tabs + Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 pt-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                    active
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                      active ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search worker, case, role..."
                aria-label="Filter queue by text"
                className="pl-7 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs w-44 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              aria-label="Filter by facility"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
            >
              <option value="ALL">All Facilities</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              aria-label="Filter by state"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
            >
              <option value="ALL">All States</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              aria-label="Filter by owner"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
            >
              <option value="ALL">All Owners</option>
              <option value="MAYA">HR Ops (Maya)</option>
              <option value="ALEX">Credentialing (Alex)</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              aria-label="Filter by severity"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer pl-1">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>Include resolved</span>
            </label>
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-4">Worker &amp; Assignment</th>
                <th className="py-2.5 px-4">Case &amp; Requirement</th>
                <th className="py-2.5 px-4">Document</th>
                <th className="py-2.5 px-4">Verification (PSV)</th>
                <th className="py-2.5 px-4">File Readiness</th>
                <th className="py-2.5 px-4">Age / Due</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No cases match the current queue filter.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const worker = workerById[c.workerId];
                  const readiness = workerReadinessMap[c.workerId];
                  const ageDays = getCaseDurationDays(c, DEMO_REFERENCE_DATE);
                  const dueDelta = getCaseDaysUntilDue(c, DEMO_REFERENCE_DATE);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-slate-900">{c.workerName}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.role} · {c.facilityName}
                        </div>
                        {worker?.employmentStatus === 'Preboarding' && readiness?.daysToStart !== null && (
                          <div className="text-[11px] font-medium text-amber-800 mt-0.5 tabular-nums">
                            Starts {worker.startDate} ({readiness.daysToStart}d to start)
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-teal-800">
                            {c.caseNumber}
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${
                              c.severity === 'Critical'
                                ? 'text-rose-700'
                                : c.severity === 'High'
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }`}
                          >
                            {c.severity}
                          </span>
                        </div>
                        <div className="font-medium text-slate-800 mt-0.5">{c.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Outreach: {c.hrOutreachOwner} · Risk: {c.clinicalRiskOwner}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        {renderDocBadge(c)}
                        <div className="text-[10px] text-slate-500 mt-1">
                          Workflow: {c.workflowState.replace(/_/g, ' ')}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        {renderVerificationBadge(c)}
                        <div className="text-[10px] text-slate-500 mt-1">
                          Clinical: {c.clinicalEligibilityState.replace(/_/g, ' ')}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        {readiness ? (
                          <div>
                            <div
                              className={`font-semibold tabular-nums ${
                                readiness.overallStatus === 'READY'
                                  ? 'text-emerald-700'
                                  : readiness.overallStatus === 'CRITICAL_RED'
                                  ? 'text-rose-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {readiness.readinessPercent !== null
                                ? `${readiness.readinessPercent}% (${readiness.satisfiedRequirementsCount}/${readiness.totalApplicableRequirements})`
                                : 'Coverage Unknown'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {readiness.openRequirementsCount} req open
                            </div>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="py-3 px-4 align-top whitespace-nowrap tabular-nums">
                        <div className="text-slate-700 font-medium">{ageDays}d open</div>
                        <div
                          className={`text-[11px] ${
                            dueDelta < 0
                              ? 'text-rose-700 font-semibold'
                              : dueDelta <= 7
                              ? 'text-amber-700 font-medium'
                              : 'text-slate-500'
                          }`}
                        >
                          {dueDelta < 0
                            ? `${Math.abs(dueDelta)}d overdue`
                            : dueDelta === 0
                            ? 'Due today'
                            : `Due in ${dueDelta}d`}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <button
                          onClick={() => openWorkerDossier(c.workerId, c.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors"
                        >
                          <span>Open Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
