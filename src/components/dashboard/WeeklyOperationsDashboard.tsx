import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  Search, 
  ChevronRight,
  TrendingDown,
  Mail,
  Zap,
  RotateCcw
} from 'lucide-react';

export const WeeklyOperationsDashboard: React.FC = () => {
  const { 
    complianceCases, 
    employees, 
    setSelectedEmployeeId, 
    setSelectedCaseId, 
    setCurrentScreen,
    computedMetrics,
    currentPersona
  } = useApp();

  const [deptFilter, setDeptFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Filtered cases
  const filteredCases = complianceCases.filter(c => {
    if (deptFilter !== 'ALL' && c.department !== deptFilter) return false;
    if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'OPEN' && c.status === 'GREEN_RESOLVED') return false;
      if (statusFilter === 'RESOLVED' && c.status !== 'GREEN_RESOLVED') return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        c.employeeName.toLowerCase().includes(q) ||
        c.employeeId.toLowerCase().includes(q) ||
        c.documentType.toLowerCase().includes(q) ||
        c.findingSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Action: Open Hero Case (Daniel Kim)
  const openHeroCase = () => {
    setSelectedEmployeeId('EMP-10419');
    setSelectedCaseId('CASE-9021');
    setCurrentScreen('employee_records');
  };

  const departments = ['R&D Operations', 'Corporate Finance', 'Product & Tech', 'Clinical Affairs', 'Manufacturing & Supply'];

  return (
    <div className="space-y-6 text-left">
      {/* Hero Welcome & Onboarding Banner for Maya */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              Weekly Operations Queue
            </span>
            <span className="text-xs text-slate-400">· Active Shift: Maya (HR Operations Manager)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            This Week’s Compliance Attention
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Identify fragmented or expired credentials across Workday, SharePoint, and DocuSign. Review AI evidence citations and approve verified closures.
          </p>
        </div>

        {/* Quick CTA to Hero Case */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={openHeroCase}
            className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Review Priority Case: Daniel Kim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Dynamic Metric Cards (Computed from Live Relational State) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Monitored */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Files Monitored
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {computedMetrics.totalMonitored}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>6 Legal Entities</span>
          </div>
        </div>

        {/* Metric 2: Open Issues */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Open Exceptions
          </div>
          <div className={`text-2xl font-black mt-1 ${computedMetrics.openCasesCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {computedMetrics.openCasesCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {computedMetrics.criticalCasesCount} critical priority
          </div>
        </div>

        {/* Metric 3: Overdue */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Overdue SLAs
          </div>
          <div className={`text-2xl font-black mt-1 ${computedMetrics.overdueCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
            {computedMetrics.overdueCount}
          </div>
          <div className="text-[10px] text-rose-700 mt-0.5 font-medium">
            Requires immediate touch
          </div>
        </div>

        {/* Metric 4: Awaiting Employee */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            In Employee Portal
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {computedMetrics.awaitingEmployeeCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Outreach dispatched
          </div>
        </div>

        {/* Metric 5: Verified Complete */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Verified Complete
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {computedMetrics.verifiedCompleteCount}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold">
            100% audit evidence
          </div>
        </div>

        {/* Metric 6: North Star % */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
            Audit-Ready SLA
          </div>
          <div className="text-2xl font-black text-teal-900 mt-1">
            {computedMetrics.northStarAuditReadyPercent}%
          </div>
          <div className="text-[10px] text-teal-700 mt-0.5 font-semibold">
            North Star Metric
          </div>
        </div>
      </div>

      {/* Hero Notice Bar if Daniel Kim is still open */}
      {complianceCases.some(c => c.id === 'CASE-9021' && c.status === 'RED_OPEN') && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-rose-900">
                Action Required: Daniel Kim (EMP-10419) California Pharmacist License Expired
              </div>
              <div className="text-[11px] text-rose-700">
                License #RPH-84920 expired Sept 15, 2026. File is 58 days out of compliance under Clinical Licensure Policy v3.8.
              </div>
            </div>
          </div>

          <button
            onClick={openHeroCase}
            className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Investigate "Why Flagged?"</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Work Queue Table & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* Table Filters Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by employee name, ID, or deficiency..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open Exceptions</option>
              <option value="RESOLVED">Verified & Resolved</option>
            </select>
          </div>
        </div>

        {/* Case Rows */}
        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/50 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Employee & Role</th>
                <th className="px-4 py-2.5">Deficiency & Finding</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">SLA Due</th>
                <th className="px-4 py-2.5">Evidence Status</th>
                <th className="px-4 py-2.5">HRMS Sync</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((cs) => {
                const emp = employees.find(e => e.id === cs.employeeId);
                const isResolved = cs.status === 'GREEN_RESOLVED';
                const isAmber = cs.status.startsWith('AMBER');

                return (
                  <tr 
                    key={cs.id}
                    onClick={() => {
                      setSelectedEmployeeId(cs.employeeId);
                      setSelectedCaseId(cs.id);
                      setCurrentScreen('employee_records');
                    }}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      cs.employeeId === 'EMP-10419' && !isResolved ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    {/* Employee & Dept */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {cs.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 hover:text-teal-700 flex items-center gap-1.5">
                            {cs.employeeName}
                            <span className="text-[10px] font-mono text-slate-400">· {cs.employeeId}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {cs.role} — {cs.department}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Finding Summary */}
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate" title={cs.documentType}>
                        {cs.documentType}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1" title={cs.findingSummary}>
                        {cs.findingSummary}
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        cs.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        cs.severity === 'High' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {cs.severity}
                      </span>
                    </td>

                    {/* SLA Due */}
                    <td className="px-4 py-3 font-mono text-[11px]">
                      <div className={cs.slaStatus === 'Overdue' ? 'text-rose-700 font-bold' : 'text-slate-600'}>
                        {cs.dueDate}
                      </div>
                      <div className="text-[10px] text-slate-400">{cs.slaStatus}</div>
                    </td>

                    {/* Evidence Status Badge */}
                    <td className="px-4 py-3">
                      {isResolved ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Complete
                        </span>
                      ) : isAmber ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          {cs.status === 'AMBER_AWAITING_EMPLOYEE' ? 'Awaiting Employee' : 'Needs HR Review'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Missing / Expired
                        </span>
                      )}
                    </td>

                    {/* HRMS Sync Status */}
                    <td className="px-4 py-3">
                      {cs.hrmsSyncStatus === 'SYNCED' ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Workday Synced
                        </span>
                      ) : cs.hrmsSyncStatus === 'SYNCING' ? (
                        <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded animate-pulse">
                          Syncing...
                        </span>
                      ) : cs.hrmsSyncStatus === 'PENDING' ? (
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          Sync Pending
                        </span>
                      ) : cs.hrmsSyncStatus === 'FAILED' ? (
                        <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          Sync Failed
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          N/A
                        </span>
                      )}
                    </td>

                    {/* Action CTA */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployeeId(cs.employeeId);
                          setSelectedCaseId(cs.id);
                          setCurrentScreen('employee_records');
                        }}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Open Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
