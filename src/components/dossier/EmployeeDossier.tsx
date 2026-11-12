import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Mail, 
  Send, 
  Upload, 
  Clock, 
  Database, 
  RefreshCw, 
  Sparkles, 
  FileDown, 
  ExternalLink, 
  Info, 
  ChevronRight, 
  X,
  AlertCircle,
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';

export const EmployeeDossier: React.FC = () => {
  const { 
    selectedEmployee, 
    selectedCase, 
    employees, 
    complianceCases,
    setSelectedEmployeeId,
    setSelectedCaseId,
    remediationTasks,
    messageThreads,
    approveAndSendRemediation,
    simulateEmployeeUpload,
    reviewEvidenceAndResolve,
    triggerHRMSWriteback,
    retryFailedSync,
    currentPersona,
    hrmsMirror
  } = useApp();

  // Panels & Drawers
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [isEmployeePortalOpen, setIsEmployeePortalOpen] = useState(false);
  const [isHRMSDiffModalOpen, setIsHRMSDiffModalOpen] = useState(false);
  const [isSimulateFailure, setIsSimulateFailure] = useState(false);
  const [isSyncingHRMS, setIsSyncingHRMS] = useState(false);

  // Outreach draft state
  const task = remediationTasks.find(t => t.caseId === selectedCase.id);
  const [customSubject, setCustomSubject] = useState(task ? task.draftedSubject : 'Action Required: Submit Verification');
  const [customBody, setCustomBody] = useState(task ? task.draftedBody : 'Please upload your renewed credential.');

  // Employee portal simulation state
  const [simulatedFileName, setSimulatedFileName] = useState('CA_Board_Pharmacy_License_RPH84920_Renewal_2028.pdf');
  const [simulatedFileSize, setSimulatedFileSize] = useState('1.8 MB (PDF)');
  const [uploadNote, setUploadNote] = useState('Renewed license certificate from California State Board of Pharmacy. Valid through Sept 15, 2028.');

  // HR Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('Verified against California State Board of Pharmacy online roster. License #RPH-84920 confirmed active with expiration 2028-09-15.');

  const thread = messageThreads.find(th => th.caseId === selectedCase.id);
  const empMirror = hrmsMirror[selectedEmployee.id];

  const isCaseResolved = selectedCase.status === 'GREEN_RESOLVED';
  const isAwaitingEmployee = selectedCase.status === 'AMBER_AWAITING_EMPLOYEE';
  const isNeedsReview = selectedCase.status === 'AMBER_NEEDS_HR_REVIEW';
  const isOpenRed = selectedCase.status === 'RED_OPEN';

  // Handle HRMS sync trigger
  const handleTriggerSync = async () => {
    setIsSyncingHRMS(true);
    await triggerHRMSWriteback(selectedCase.id, isSimulateFailure);
    setIsSyncingHRMS(false);
  };

  // Switch between sample employees easily
  const handleSwitchEmployee = (empId: string) => {
    setSelectedEmployeeId(empId);
    const emp = employees.find(e => e.id === empId);
    if (emp && emp.activeCaseId) {
      setSelectedCaseId(emp.activeCaseId);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Employee Switcher Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Inspect Employee File:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {employees.slice(0, 5).map((e) => (
              <button
                key={e.id}
                onClick={() => handleSwitchEmployee(e.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedEmployee.id === e.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {e.name} ({e.id})
                {e.id === 'EMP-10419' && !isCaseResolved && (
                  <span className="ml-1.5 px-1 py-0.2 rounded bg-rose-500 text-white text-[9px] font-bold">
                    HERO CASE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px]">System of Record: Workday HCM</span>
        </div>
      </div>

      {/* 3-Panel Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Employee Profile & Document Checklist (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Employee Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedEmployee.avatarUrl}
                  alt={selectedEmployee.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                />
                <div>
                  <h2 className="font-bold text-base text-slate-900 leading-tight">
                    {selectedEmployee.name}
                  </h2>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedEmployee.id} · {selectedEmployee.role}
                  </div>
                  <div className="text-[11px] text-teal-800 font-medium">
                    {selectedEmployee.department} ({selectedEmployee.location})
                  </div>
                </div>
              </div>
            </div>

            {/* Health Score & Status Gauge */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">File Health Score</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-black ${
                    selectedEmployee.fileHealthScore === 100 ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {selectedEmployee.fileHealthScore}%
                  </span>
                  <span className="text-slate-400 text-[10px]">/ 100</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Compliance Status</div>
                <div className="mt-1">
                  {selectedEmployee.healthStatus === 'Complete' ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified Complete
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {selectedEmployee.healthStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 flex justify-between">
              <span>Manager: <strong>{selectedEmployee.manager}</strong></span>
              <span>Scanned: {selectedEmployee.lastScanTime}</span>
            </div>
          </div>

          {/* Document Inventory & Verification Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-900">
              <span>Required Evidence Checklist</span>
              <span className="text-[10px] font-mono text-slate-400">Policy v3.8 / v4.2</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Item 1: State Licensure (The hero item!) */}
              <div className={`p-3 rounded-lg border transition-all ${
                isCaseResolved
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-rose-200 bg-rose-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>CA Pharmacist License</span>
                  </div>
                  {isCaseResolved ? (
                    <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid (2028-09-15)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-800 px-2 py-0.5 rounded bg-rose-100 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Expired (Sept 15, 2026)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>Source: SharePoint Online</span>
                  <span className="font-mono">#RPH-84920</span>
                </div>
              </div>

              {/* Item 2: Form I-9 */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Form I-9 Employment Verification</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>List A: US Passport Verified</span>
                  <span>Workday</span>
                </div>
              </div>

              {/* Item 3: Ethics Handbook */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Code of Ethics Acknowledgment</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Signed
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>DocuSign Envelope Completed</span>
                  <span>2026-03-02</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER / RIGHT COLUMN: Active Case Details, Why Flagged Drawer, Remediation Flow (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* HERO CASE ACTION HEADER */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {selectedCase.caseNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isCaseResolved ? 'bg-emerald-100 text-emerald-800' :
                    isAwaitingEmployee || isNeedsReview ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedCase.severity} Priority
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {selectedCase.documentType}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {selectedCase.findingSummary}
                </p>
              </div>

              {/* Status Pill */}
              <div className="text-right shrink-0">
                <div className="text-[10px] font-mono text-slate-400 mb-0.5">RECORD HEALTH</div>
                {isCaseResolved ? (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>GREEN · Verified Complete</span>
                  </div>
                ) : isAwaitingEmployee ? (
                  <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>AMBER · Awaiting Employee</span>
                  </div>
                ) : isNeedsReview ? (
                  <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>AMBER · Needs HR Review</span>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>RED · Non-Compliant Gap</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar (Why Flagged, Prepare Request, Review Evidence, Sync HRMS) */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Button 1: Why Flagged Drawer */}
                <button
                  onClick={() => setIsWhyDrawerOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-teal-700" />
                  <span>Explainability: "Why Flagged?"</span>
                </button>

                {/* Button 2: Prepare / Dispatch Employee Request */}
                {!isCaseResolved && isOpenRed && (
                  <button
                    onClick={() => setIsOutreachModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Prepare Employee Request</span>
                  </button>
                )}

                {/* Button 3: Simulated Employee Portal (when outreach is dispatched) */}
                {(isAwaitingEmployee || isNeedsReview) && !isCaseResolved && (
                  <button
                    onClick={() => setIsEmployeePortalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all animate-pulse"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Open Simulated Employee Portal as Daniel</span>
                  </button>
                )}

                {/* Button 4: Review received evidence & Resolve */}
                {isNeedsReview && !isCaseResolved && (
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Review Evidence & Approve Closure</span>
                  </button>
                )}
              </div>

              {/* HRMS Writeback Button & Badge */}
              <div className="flex items-center gap-2">
                {isCaseResolved && (
                  <div className="flex items-center gap-2">
                    {selectedCase.hrmsSyncStatus === 'SYNCED' ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified complete · Synced to Workday</span>
                      </span>
                    ) : selectedCase.hrmsSyncStatus === 'SYNCING' ? (
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Syncing to Workday HCM...</span>
                      </span>
                    ) : selectedCase.hrmsSyncStatus === 'FAILED' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                          Writeback Failed
                        </span>
                        <button
                          onClick={handleTriggerSync}
                          className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
                        >
                          Retry Sync
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleTriggerSync}
                        disabled={isSyncingHRMS}
                        className="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingHRMS ? 'animate-spin' : ''}`} />
                        <span>Write Back to Workday HCM</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTIVITY & CONVERSATION THREAD */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-800">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Audit & Activity Timeline
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Rule Version: {selectedCase.detailedWhy.policyVersion}
              </span>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-4 text-xs">
              {/* Event 1: AI Ingestion & Finding */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">
                      Compliance Agent flagged expired credential
                    </span>
                    <span className="text-[10px] text-slate-400">{selectedCase.detectedDate}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Evaluated California Board of Pharmacy license against {selectedCase.detailedWhy.policyName}. License #RPH-84920 expired on 2026-09-15. Overdue by 58 days.
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    Run ID: {selectedCase.detailedWhy.agentRunId} · Confidence: {selectedCase.detailedWhy.agentConfidence}%
                  </div>
                </div>
              </div>

              {/* Event 2: Outreach Messages from Thread */}
              {thread && thread.messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.sender === 'HR_OPERATIONS' 
                      ? 'bg-teal-100 text-teal-800 border border-teal-200' 
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  }`}>
                    {msg.sender === 'HR_OPERATIONS' ? <Mail className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-[11px] whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Attachments if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Uploaded Evidence:</div>
                        {msg.attachments.map((att, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-800">
                            <span className="font-mono text-[11px]">{att.filename} ({att.size})</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Validated Format
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Event 3: Closure & Sync Confirmation if Resolved */}
              {isCaseResolved && (
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900">
                        Case Approved & Resolved by {selectedCase.resolvedBy || currentPersona.name}
                      </span>
                      <span className="text-[10px] text-emerald-700">Verified Complete</span>
                    </div>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      Replacement California Pharmacist License verified through September 15, 2028. File health restored to 100%. Workday HRMS compliance attributes queued for writeback.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DRAWER: WHY FLAGGED? EXPLAINABILITY & POLICY CITATIONS */}
      {/* ========================================================================= */}
      {isWhyDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 p-6 overflow-y-auto space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  AI Explainability & Evidence Drill-Down
                </h3>
              </div>
              <button 
                onClick={() => setIsWhyDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deterministic Compliance Reasoning</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Agentic Employee Records does not make black-box guesses. The Compliance Agent compares extracted evidence fields against versioned employer policy clauses.
              </p>
            </div>

            {/* Exact Policy Clause Citation */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Governing Employer Policy Citation
              </span>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-900">
                  {selectedCase.detailedWhy.policyName}
                </div>
                <div className="text-[11px] font-mono text-teal-800 font-semibold">
                  {selectedCase.detailedWhy.clause}
                </div>
                <blockquote className="text-[11px] text-slate-600 italic border-l-2 border-teal-600 pl-2.5 py-0.5 bg-white rounded-r">
                  "{selectedCase.detailedWhy.clauseText}"
                </blockquote>
              </div>
            </div>

            {/* Found Evidence & Expiration Comparison */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Evaluated Evidence & Repository Provenance
              </span>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-400">Found Evidence:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {selectedCase.detailedWhy.foundEvidenceSummary}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Source Repository:</span>
                  <div className="font-mono text-slate-800 mt-0.5">
                    {selectedCase.detailedWhy.foundEvidenceSource}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Expiration Comparison:</span>
                  <div className="font-bold text-rose-700 mt-0.5">
                    {selectedCase.detailedWhy.expiryComparison}
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence vs Legal Validity Notice */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Calibrated Confidence & Uncertainty Disclosure
              </span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">AI Document Classification Confidence:</span>
                  <span className="font-mono font-bold text-teal-800 text-xs">
                    {selectedCase.detailedWhy.agentConfidence}%
                  </span>
                </div>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  {selectedCase.detailedWhy.uncertaintyNote}
                </p>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[10px]">
                  <strong>Human Gate Standard:</strong> High AI confidence does not replace human authorization. Compliance closure requires HR Operations verification.
                </div>
              </div>
            </div>

            {/* Action Recommendations */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsWhyDrawerOpen(false);
                  if (isOpenRed) setIsOutreachModalOpen(true);
                }}
                className="w-full py-2.5 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 shadow-xs flex items-center justify-center gap-2"
              >
                <span>Proceed to Remediation Outreach</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREPARE & DISPATCH REMEDIATION OUTREACH (Gate 2) */}
      {/* ========================================================================= */}
      {isOutreachModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Review & Approve AI-Drafted Employee Outreach (Gate 2)
                </h3>
              </div>
              <button 
                onClick={() => setIsOutreachModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              The Remediation Agent drafted this request using policy parameters. HR Operations must approve or edit the text before sending to <strong>{selectedEmployee.name}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input 
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Body</label>
                <textarea 
                  rows={6}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Dispatch Channel: <strong>Secure Employee Portal</strong></span>
                <span className="text-teal-700 font-semibold">Simulated Delivery Link</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsOutreachModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  approveAndSendRemediation(selectedCase.id, customSubject, customBody);
                  setIsOutreachModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Approve & Dispatch Outreach</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SIMULATED EMPLOYEE PORTAL (Daniel Kim uploads renewed certificate) */}
      {/* ========================================================================= */}
      {isEmployeePortalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  BV
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    BioVanguard Employee Self-Service Portal
                  </h3>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Logged in as: Daniel Kim (EMP-10419)
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsEmployeePortalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold">Compliance Action Required:</div>
              <p className="text-[11px] text-amber-800">
                Please upload your renewed California State Board of Pharmacy license certificate to maintain clinical research authorization.
              </p>
            </div>

            {/* Document Upload Control */}
            <div className="border-2 border-dashed border-teal-300 bg-teal-50/30 rounded-xl p-5 text-center space-y-2">
              <Upload className="w-7 h-7 text-teal-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">
                {simulatedFileName}
              </div>
              <div className="text-[10px] text-slate-500">
                {simulatedFileSize} · Detected License #RPH-84920 · Valid: 2028-09-15
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    simulateEmployeeUpload(selectedCase.id, {
                      fileName: simulatedFileName,
                      fileSize: simulatedFileSize,
                      licenseNumber: 'RPH-84920',
                      expirationDate: '2028-09-15'
                    });
                    setIsEmployeePortalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
                >
                  Submit Renewed California License &rarr;
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center">
              Simulated Employee Portal Link · Secured with Enterprise SAML SSO
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: HUMAN HR REVIEW & CLOSURE (Gate 3) */}
      {/* ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  HR Evidence Verification & Case Sign-Off (Gate 3)
                </h3>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Daniel Kim has submitted replacement evidence. Review the document parameters before confirming closure:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted File:</span>
                <span className="font-mono font-bold text-slate-800">{simulatedFileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Detected License #:</span>
                <span className="font-mono font-bold text-slate-800">RPH-84920</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">New Expiration Date:</span>
                <span className="font-mono font-bold text-emerald-700">2028-09-15 (Valid)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Policy Standard:</span>
                <span className="font-semibold text-slate-800">Clinical Licensure Policy v3.8</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">HR Review Notes & Verification Source</label>
              <textarea 
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  reviewEvidenceAndResolve(selectedCase.id, false, 'Document rejected - illegible expiration seal');
                  setIsReviewModalOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50"
              >
                Reject Evidence
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    reviewEvidenceAndResolve(selectedCase.id, true, reviewNotes);
                    setIsReviewModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Verified & Mark Resolved (Green)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
