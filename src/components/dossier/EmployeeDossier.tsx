import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateFormI9Acceptability, DEMO_REFERENCE_DATE } from '../../domain/rules';
import { getCaseDaysUntilDue, getCaseDurationDays } from '../../domain/readiness';
import { ClinicalDutyEligibilityState } from '../../types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Send,
  Upload,
  Lock,
  ExternalLink,
  Download,
  RefreshCw,
  UserCheck,
  Smartphone,
  X,
  Info,
  BadgeCheck
} from 'lucide-react';

export const EmployeeDossier: React.FC = () => {
  const {
    activeRoleId,
    currentPersona,
    switchRole,
    can,
    workers,
    selectedWorker,
    setSelectedWorkerId,
    assignments,
    requirements,
    evidenceItems,
    verifications,
    cases,
    selectedCase,
    setSelectedCaseId,
    threads,
    tasks,
    hrmsMirror,
    workerReadinessMap,
    uploadedFilePreviews,
    approveAndSendOutreach,
    submitEmployeePortalResponse,
    runPrimarySourceVerification,
    recordClinicalEligibilityDecision,
    reviewAndCloseCase,
    completeNonPSVRequirement,
    queueAndSyncWorkdayStaging,
    setIsHRMSSyncPayloadModalOpen,
    isHRMSSyncPayloadModalOpen,
    isEmployeePortalOpen,
    setIsEmployeePortalOpen,
    notify,
    logAuditEvent
  } = useApp();

  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);
  const [outreachSubject, setOutreachSubject] = useState('');
  const [outreachBody, setOutreachBody] = useState('');
  const [outreachChannel, setOutreachChannel] = useState<'Simulated Demo Portal' | 'Workday Inbox Check'>('Simulated Demo Portal');
  const [closureNotes, setClosureNotes] = useState('Verified supporting documentation and PSV confirmation.');
  const [clinicalNotes, setClinicalNotes] = useState('Reviewed current PSV record and clinical supervision status.');
  const [psvFixtureChoice, setPsvFixtureChoice] = useState<'VERIFIED_ACTIVE' | 'RESTRICTED' | 'VERIFICATION_FAILED' | 'UNVERIFIED'>('VERIFIED_ACTIVE');
  const [portalMode, setPortalMode] = useState<'file' | 'sample_doc' | 'reply_question' | 'already_submitted_workday'>('sample_doc');
  const [portalFile, setPortalFile] = useState<File | null>(null);
  const [portalNote, setPortalNote] = useState('');
  const [portalClaimedExp, setPortalClaimedExp] = useState('2028-09-15');
  const [portalError, setPortalError] = useState<string | null>(null);
  const [portalSubmittedReceipt, setPortalSubmittedReceipt] = useState<{
    trackingId: string;
    message: string;
  } | null>(null);
  const [portalSubmitting, setPortalSubmitting] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const evidenceSectionRef = useRef<HTMLDivElement>(null);

  const workerAssignments = useMemo(
    () => assignments.filter((a) => a.workerId === selectedWorker.id),
    [assignments, selectedWorker.id]
  );

  const workerRequirements = useMemo(
    () => requirements.filter((r) => r.workerId === selectedWorker.id && r.applicabilityOutcome !== 'NOT_APPLICABLE'),
    [requirements, selectedWorker.id]
  );

  const workerCases = useMemo(
    () => cases.filter((c) => c.workerId === selectedWorker.id),
    [cases, selectedWorker.id]
  );

  const activeCase = useMemo(() => {
    if (selectedCase && selectedCase.workerId === selectedWorker.id) return selectedCase;
    return workerCases[0] || null;
  }, [selectedCase, workerCases, selectedWorker.id]);

  useEffect(() => {
    setOutreachSubject('');
    setOutreachBody('');
    setPortalFile(null);
    setPortalNote('');
    setPortalError(null);
    setPortalSubmittedReceipt(null);
  }, [activeCase?.id, selectedWorker.id]);

  useEffect(() => {
    if (!isWhyDrawerOpen && !isEmployeePortalOpen && !isHRMSSyncPayloadModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsWhyDrawerOpen(false);
        setIsEmployeePortalOpen(false);
        setIsHRMSSyncPayloadModalOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [
    isWhyDrawerOpen,
    isEmployeePortalOpen,
    isHRMSSyncPayloadModalOpen,
    setIsEmployeePortalOpen,
    setIsHRMSSyncPayloadModalOpen
  ]);

  const activeRequirement = useMemo(
    () => (activeCase ? requirements.find((r) => r.requirementId === activeCase.requirementId) : undefined),
    [requirements, activeCase]
  );

  const workerEvidence = useMemo(
    () => evidenceItems.filter((e) => e.workerId === selectedWorker.id),
    [evidenceItems, selectedWorker.id]
  );

  const workerVerifications = useMemo(
    () => verifications.filter((v) => v.workerId === selectedWorker.id),
    [verifications, selectedWorker.id]
  );

  const activeThread = useMemo(
    () => (activeCase ? threads.find((th) => th.caseId === activeCase.id) : undefined),
    [threads, activeCase]
  );

  const activeTask = useMemo(
    () => (activeCase ? tasks.find((t) => t.caseId === activeCase.id) : undefined),
    [tasks, activeCase]
  );

  const readiness = workerReadinessMap[selectedWorker.id];
  const mirrorRecord = hrmsMirror[selectedWorker.id];
  const i9Eval = useMemo(() => {
    if (!activeCase || activeCase.caseCategory !== 'Form I-9 Verification') return null;
    return evaluateFormI9Acceptability(workerEvidence);
  }, [activeCase, workerEvidence]);

  const defaultSubject = activeTask?.draftedSubject || (activeCase ? `Action Required: ${activeCase.title}` : '');
  const defaultBody =
    activeTask?.draftedBody ||
    (activeCase
      ? `Hi ${selectedWorker.name},\n\nOur credentialing check flagged "${activeCase.title}". Please upload your current documentation or confirm submission status via the portal.\n\nThank you,\nHR Operations`
      : '');

  const currentSubject = outreachSubject || defaultSubject;
  const currentBody = outreachBody || defaultBody;

  const isPSVRequired = activeRequirement?.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION';
  const canSendOutreach = can('SEND_EMPLOYEE_OUTREACH');
  const canRunPSV = can('RUN_PRIMARY_SOURCE_VERIFICATION');
  const canRecordClinical = can('RECORD_CLINICAL_DUTY_ELIGIBILITY');
  const canCloseCase = can('CLOSE_ADMINISTRATIVE_CASE', {
    requiresPSV: isPSVRequired,
    hasAuthoritativePSV: activeCase?.verificationState === 'VERIFIED_ACTIVE'
  });

  const handleDownloadAuditPacket = () => {
    const packet = {
      reportTitle: 'Agentic Employee Records — Demo Evidence & Readiness Packet',
      syntheticDemoNotice: 'DEMO SYNTHETIC DATA ONLY — Not an official HIPAA/SOC2 attestation or live Workday extract.',
      privacyExclusionNotice: 'Occupational Health medical details (PHI/ADA) are strictly excluded. Clearance status only.',
      generatedAtUtc: new Date().toISOString(),
      worker: {
        id: selectedWorker.employeeNumber,
        name: selectedWorker.name,
        primaryRole: selectedWorker.primaryRole,
        facility: selectedWorker.primaryFacilityName,
        employmentStatus: selectedWorker.employmentStatus,
        occupationalHealthStatusOnly: selectedWorker.occupationalHealthSummary.clearanceStatus,
        privilegingReference: selectedWorker.privilegingReference,
        clinicalDutyEligibility: selectedWorker.clinicalEligibility
      },
      readinessSummary: readiness,
      requirements: workerRequirements,
      evidenceMetadata: workerEvidence.map((e) => ({
        id: e.id,
        documentName: e.documentName,
        sourceSystem: e.sourceSystem,
        status: e.status,
        extractionConfidence: e.extractionConfidence,
        extractionMethodNote: e.extractionMethodNote
      })),
      verifications: workerVerifications,
      cases: workerCases.map((c) => ({
        caseNumber: c.caseNumber,
        title: c.title,
        workflowState: c.workflowState,
        documentState: c.documentState,
        verificationState: c.verificationState,
        clinicalEligibilityState: c.clinicalEligibilityState,
        externalSyncState: c.externalSyncState,
        reviewDecisions: c.reviewDecisions
      }))
    };

    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DEMO_Evidence_Packet_${selectedWorker.employeeNumber}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    logAuditEvent({
      actor: currentPersona.name,
      actorRole: currentPersona.roleLabel,
      action: 'EXPORT_DEMO_EVIDENCE_PACKET',
      category: 'EVIDENCE',
      source: 'Employee Dossier',
      targetEntityId: selectedWorker.id,
      workerId: selectedWorker.id,
      details: `Exported DEMO evidence packet for ${selectedWorker.name} (PHI excluded).`
    });
    notify(`Downloaded DEMO evidence packet for ${selectedWorker.name} (PHI excluded).`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Worker Switcher Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-teal-700 text-white font-semibold text-sm flex items-center justify-center shrink-0">
            {selectedWorker.initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">{selectedWorker.name}</h1>
              <span className="font-mono text-xs text-slate-500">{selectedWorker.employeeNumber}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                {selectedWorker.employmentStatus} · {selectedWorker.workerType}
              </span>
              {readiness?.daysToStart !== null && readiness && (
                <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium tabular-nums">
                  Start Date: {selectedWorker.startDate} ({readiness.daysToStart} days to start)
                </span>
              )}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {selectedWorker.primaryRole} · {selectedWorker.primaryDepartment} · {selectedWorker.primaryFacilityName} ({selectedWorker.primaryState})
              {selectedWorker.sponsoringOrganization && ` · Agency: ${selectedWorker.sponsoringOrganization}`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWorker.id}
            onChange={(e) => {
              const nextId = e.target.value;
              setSelectedWorkerId(nextId);
              const firstCase = cases.find((c) => c.workerId === nextId);
              if (firstCase) setSelectedCaseId(firstCase.id);
              setOutreachSubject('');
              setOutreachBody('');
            }}
            aria-label="Select worker dossier"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
          >
            {workers.map((w) => {
              const r = workerReadinessMap[w.id];
              return (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.primaryRole}) — {r?.readinessPercent !== null ? `${r?.readinessPercent}%` : 'Unknown'}
                </option>
              );
            })}
          </select>

          <button
            onClick={handleDownloadAuditPacket}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Demo Packet</span>
          </button>
        </div>
      </div>

      {/* Multi-Assignment + Restricted Boundary Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Whole-file Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800">Whole-File Readiness</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                readiness?.overallStatus === 'READY'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : readiness?.overallStatus === 'CRITICAL_RED'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {readiness?.readinessPercent !== null
                ? `${readiness?.readinessPercent}% (${readiness?.satisfiedRequirementsCount}/${readiness?.totalApplicableRequirements})`
                : 'Coverage Unknown'}
            </span>
          </div>
          <div className="text-slate-600">{readiness?.overallStatusLabel}</div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Admin / Non-PSV Onboarding:</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              {readiness?.administrativeOnboardingPercent}%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Clinical Duty Eligibility:</span>
            <span className="font-semibold text-slate-800">
              {selectedWorker.clinicalEligibility.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Workday Assignments & External MSO */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="font-semibold text-slate-800">
            Workday Assignments ({workerAssignments.length})
          </div>
          <div className="space-y-1.5">
            {workerAssignments.map((a) => (
              <div key={a.id} className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="font-medium text-slate-800">
                  {a.jobProfile} · {a.facilityName} ({a.state})
                </div>
                <div>
                  Effective {a.effectiveStartDate} · {a.isPrimary ? 'Primary' : 'Concurrent'} ·{' '}
                  {a.isClinicalDuty ? 'Clinical Scope' : 'Non-Clinical'}
                </div>
              </div>
            ))}
          </div>
          {selectedWorker.privilegingReference.status !== 'NOT_APPLICABLE' && (
            <div className="text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <strong>External Medical Staff Office (MSO):</strong>{' '}
              {selectedWorker.privilegingReference.status} ({selectedWorker.privilegingReference.msoReferenceId}) — Read-only external reference; privileging is never granted here.
            </div>
          )}
        </div>

        {/* Occupational Health Privacy Boundary */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Occupational Health Boundary</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-800">
            Clearance Status: {selectedWorker.occupationalHealthSummary.clearanceStatus}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {selectedWorker.occupationalHealthSummary.restrictedAccessNote}
          </p>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            HIPAA / ADA Boundary: Raw medical, vaccination, or accommodation records are strictly excluded from HR, Compliance Admin, Executive views, and audit exports.
          </div>
        </div>
      </div>

      {/* Multi-Requirement Tracker for Selected Worker */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Applicable Credential &amp; Compliance Requirements ({workerRequirements.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              Whole-file readiness updates only as each applicable requirement is verified and closed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workerRequirements.map((req) => {
            const linkedCase = workerCases.find((c) => c.requirementId === req.requirementId);
            const isSelected = linkedCase && activeCase && linkedCase.id === activeCase.id;
            const satisfied =
              req.documentState === 'ACCEPTED' &&
              (req.verificationMethod !== 'PRIMARY_SOURCE_VERIFICATION' ||
                req.verificationState === 'VERIFIED_ACTIVE');

            return (
              <div
                key={req.requirementId}
                onClick={() => linkedCase && setSelectedCaseId(linkedCase.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  linkedCase ? 'cursor-pointer' : ''
                } ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/40'
                    : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[10px] font-semibold text-slate-500">
                      {req.ruleCode} · {req.verificationMethod.replace(/_/g, ' ')}
                    </div>
                    <div className="font-semibold text-slate-900 mt-0.5">{req.name}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                      satisfied
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {satisfied ? 'SATISFIED' : 'OPEN'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-600">
                  <span>Doc: <strong>{req.documentState}</strong></span>
                  <span>PSV: <strong>{req.verificationState}</strong></span>
                  {linkedCase && (
                    <span className="text-teal-800 font-semibold">
                      Case {linkedCase.caseNumber} ({linkedCase.workflowState})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Case Workspace */}
      {activeCase ? (
        <div className="space-y-5">
          {/* Case Banner + Four Independent State Dimensions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-semibold text-teal-800">{activeCase.caseNumber}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-700">{activeCase.caseCategory}</span>
                  <span className="text-slate-400">·</span>
                  <span className="tabular-nums text-slate-500">
                    Open {getCaseDurationDays(activeCase, DEMO_REFERENCE_DATE)}d ·{' '}
                    {getCaseDaysUntilDue(activeCase, DEMO_REFERENCE_DATE) < 0
                      ? `${Math.abs(getCaseDaysUntilDue(activeCase, DEMO_REFERENCE_DATE))}d overdue`
                      : `Due ${activeCase.dueDate}`}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 mt-1">{activeCase.title}</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeCase.findingSummary}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsWhyDrawerOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-teal-700" />
                  <span>Why Flagged? &amp; Evidence</span>
                </button>
                <button
                  onClick={() => setIsEmployeePortalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-teal-700 bg-white hover:bg-teal-50 text-teal-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open Employee Portal</span>
                </button>
              </div>
            </div>

            {/* Four Separated Dimensions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  1. Document State
                </div>
                <div className="font-semibold text-slate-900 mt-1">{activeCase.documentState}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Upload does not verify licensure</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  2. PSV Verification
                </div>
                <div className="font-semibold text-slate-900 mt-1">{activeCase.verificationState}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isPSVRequired ? 'Authoritative board check required' : 'Non-PSV organizational check'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  3. Clinical Duty Eligibility
                </div>
                <div className="font-semibold text-slate-900 mt-1">
                  {selectedWorker.clinicalEligibility.replace(/_/g, ' ')}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Designated leader decision only</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  4. Workday Staging Sync
                </div>
                <div className="font-semibold text-slate-900 mt-1">{activeCase.externalSyncState}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Staging custom object only</div>
              </div>
            </div>

            {/* Form I-9 Acceptability Check (List A vs List B + C) */}
            {i9Eval && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-900">
                  Form I-9 Section 2 Acceptability Rule (List A OR List B + List C)
                </div>
                <div className="text-slate-700">{i9Eval.summary}</div>
                {i9Eval.missingReason && (
                  <div className="text-amber-800 font-medium">{i9Eval.missingReason}</div>
                )}
              </div>
            )}
          </div>

          {/* 2-Column Operational Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* Left: Outreach + Portal Thread + Evidence */}
            <div className="space-y-5">
              {/* HR Outreach Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Step 1 · HR Operations Outreach (Simulated)
                  </h3>
                  <span className="text-[11px] text-slate-500">Owner: {activeCase.hrOutreachOwner}</span>
                </div>

                {!canSendOutreach.allowed && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    {canSendOutreach.reason}
                  </div>
                )}

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Channel
                    </label>
                    <select
                      value={outreachChannel}
                      onChange={(e) => setOutreachChannel(e.target.value as any)}
                      disabled={!canSendOutreach.allowed}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                    >
                      <option value="Simulated Demo Portal">Simulated Demo Portal (No real email sent)</option>
                      <option value="Workday Inbox Check">Workday Inbox Reconciliation Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={currentSubject}
                      onChange={(e) => setOutreachSubject(e.target.value)}
                      disabled={!canSendOutreach.allowed}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Message Draft
                    </label>
                    <textarea
                      rows={4}
                      value={currentBody}
                      onChange={(e) => setOutreachBody(e.target.value)}
                      disabled={!canSendOutreach.allowed}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => approveAndSendOutreach(activeCase.id, currentSubject, currentBody, outreachChannel)}
                      disabled={!canSendOutreach.allowed}
                      className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Approve &amp; Send Simulated Outreach</span>
                    </button>

                    <button
                      onClick={() => setIsEmployeePortalOpen(true)}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Simulate Employee Upload</span>
                    </button>
                  </div>
                </div>

                {/* Thread History */}
                {activeThread && activeThread.messages.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-700">
                      Portal Communication History
                    </div>
                    {activeThread.messages.map((m) => (
                      <div key={m.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-800">{m.senderName} ({m.senderRole})</span>
                          <span>{m.timestamp} · {m.deliveryStatus}</span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line">{m.content}</p>
                        {m.attachmentMetadata && (
                          <div className="text-[11px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
                            Attachment: {m.attachmentMetadata.fileName} ({m.attachmentMetadata.fileSize}) — {m.attachmentMetadata.extractionStatusLabel}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submitted Evidence Items */}
              <div ref={evidenceSectionRef} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Worker Evidence Records ({workerEvidence.length})
                </h3>
                {workerEvidence.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center bg-slate-50 rounded-lg border border-slate-200">
                    No evidence records stored for this worker yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {workerEvidence.map((ev) => {
                      const preview = uploadedFilePreviews[ev.id];
                      return (
                        <div key={ev.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                              <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                              <span>{ev.documentName}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                              {ev.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Source: {ev.sourceSystem} · Size: {ev.fileSize} · Extraction confidence: <strong>{ev.extractionConfidence}%</strong>
                          </div>
                          <div className="text-[10px] text-slate-500">{ev.extractionMethodNote}</div>
                          {preview && (
                            <div className="pt-1 space-y-1">
                              {preview.mimeType.startsWith('image/') ? (
                                <img
                                  src={preview.objectUrl}
                                  alt={preview.fileName}
                                  className="max-h-32 rounded border border-slate-200"
                                />
                              ) : preview.textSnippet ? (
                                <pre className="p-2 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 whitespace-pre-wrap max-h-28 overflow-y-auto">
                                  {preview.textSnippet}
                                </pre>
                              ) : (
                                <div className="text-[11px] text-teal-800 font-medium">
                                  Local browser file attached ({preview.fileName}) — held in session memory only; manual review required.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: PSV Check, Clinical Eligibility, Case Closure, Workday Staging */}
            <div className="space-y-5">
              {/* Primary Source Verification (Alex Morgan) */}
              {isPSVRequired && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-teal-700" />
                      <span>Step 2 · Primary Source Verification (Simulated Board Check)</span>
                    </h3>
                    <span className="text-[11px] font-medium text-slate-600">
                      {activeCase.verificationState}
                    </span>
                  </div>

                  {!canRunPSV.allowed ? (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
                      <div className="text-amber-950 font-medium">{canRunPSV.reason}</div>
                      <button
                        onClick={() => switchRole('cred_alex', 'employees')}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs inline-flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Switch to Alex Morgan (Credentialing Reviewer)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-600 block mb-1">
                          Select Simulated Board Fixture Outcome (Demo Only — No Live Board API)
                        </label>
                        <select
                          value={psvFixtureChoice}
                          onChange={(e) => setPsvFixtureChoice(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                        >
                          <option value="VERIFIED_ACTIVE">VERIFIED_ACTIVE — Active &amp; unencumbered through 2028-09-15</option>
                          <option value="RESTRICTED">RESTRICTED — Board disciplinary suspension (blocks closure &amp; escalates)</option>
                          <option value="VERIFICATION_FAILED">VERIFICATION_FAILED — Board endpoint 503 unavailable</option>
                          <option value="UNVERIFIED">UNVERIFIED — License # / Name mismatch</option>
                        </select>
                      </div>
                      <button
                        onClick={() => runPrimarySourceVerification(activeCase.id, psvFixtureChoice)}
                        className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold"
                      >
                        Run Simulated Primary Source Verification
                      </button>
                    </div>
                  )}

                  {workerVerifications.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {workerVerifications.slice(0, 2).map((v) => (
                        <div key={v.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{v.returnedStatus}</span>
                            <span className="font-mono">{v.receiptReference}</span>
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            {v.sourceName} · Verified by {v.verifierName} ({v.checkedAt})
                          </div>
                          {v.restrictionsNote && (
                            <div className="text-rose-700 font-medium mt-0.5">{v.restrictionsNote}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Clinical Escalation & Eligibility Decision */}
              {(activeCase.escalation || activeCase.clinicalEligibilityState !== 'NOT_APPLICABLE') && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Clinical Escalation &amp; Duty Eligibility</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-700">
                      {selectedWorker.clinicalEligibility.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {activeCase.escalation && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-950 space-y-1">
                      <div className="font-semibold">
                        Escalated to: {activeCase.escalation.escalatedToName} ({activeCase.escalation.status})
                      </div>
                      <p>{activeCase.escalation.reason}</p>
                    </div>
                  )}

                  {!canRecordClinical.allowed ? (
                    <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                      {canRecordClinical.reason}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <textarea
                        rows={2}
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        placeholder="Clinical leadership review notes..."
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            recordClinicalEligibilityDecision(
                              activeCase.id,
                              'AUTHORIZED_BY_DESIGNATED_LEADER' as ClinicalDutyEligibilityState,
                              clinicalNotes
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                        >
                          Record Authorized Duty Eligibility
                        </button>
                        <button
                          onClick={() =>
                            recordClinicalEligibilityDecision(
                              activeCase.id,
                              'RESTRICTED_BY_AUTHORIZED_DECISION' as ClinicalDutyEligibilityState,
                              clinicalNotes
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold"
                        >
                          Restrict Clinical Duty
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Administrative Case Closure */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Step 3 · Final Administrative Case Closure
                </h3>

                {activeCase.workflowState === 'resolved' ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Closed administratively by {activeCase.resolvedBy} at {activeCase.resolvedAt}.
                      </span>
                    </div>
                    {selectedWorker.clinicalEligibility === 'REVIEW_REQUIRED' && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        Notice: Administrative HR file closure is complete, while worker clinical duty eligibility still requires separate authorization by a designated clinical leader.
                      </div>
                    )}
                  </div>
                ) : isPSVRequired ? (
                  <div className="space-y-3">
                    {!canCloseCase.allowed && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        {canCloseCase.reason}
                        {activeRoleId === 'cred_alex' && (
                          <button
                            onClick={() => switchRole('hr_ops_maya', 'employees')}
                            className="block mt-2 px-3 py-1 rounded bg-slate-900 text-white font-semibold"
                          >
                            Switch back to Maya (HR Ops) for Final Closure
                          </button>
                        )}
                      </div>
                    )}

                    <textarea
                      rows={2}
                      value={closureNotes}
                      onChange={(e) => setClosureNotes(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => reviewAndCloseCase(activeCase.id, true, closureNotes)}
                        disabled={!canCloseCase.allowed}
                        className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold"
                      >
                        Approve &amp; Close Case
                      </button>
                      <button
                        onClick={() =>
                          reviewAndCloseCase(activeCase.id, false, 'Requested clearer documentation.')
                        }
                        disabled={!can('REVIEW_ORDINARY_HR_EVIDENCE').allowed}
                        className="px-3 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-40 font-semibold"
                      >
                        Reject Evidence
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-600">
                      This requirement uses <strong>{activeRequirement?.verificationMethod.replace(/_/g, ' ')}</strong> rather than statutory board PSV.
                    </p>
                    <textarea
                      rows={2}
                      value={closureNotes}
                      onChange={(e) => setClosureNotes(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    <button
                      onClick={() => completeNonPSVRequirement(activeCase.id, closureNotes)}
                      disabled={!can('REVIEW_ORDINARY_HR_EVIDENCE').allowed}
                      className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold"
                    >
                      Verify Roster / HR Evidence &amp; Close Requirement
                    </button>
                  </div>
                )}
              </div>

              {/* Workday Staging Writeback */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Step 4 · Workday Staging Sync (Simulated Adapter)
                  </h3>
                  <button
                    onClick={() => setIsHRMSSyncPayloadModalOpen(true)}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Inspect Payload &amp; Mirror</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-600">
                  Writes readiness summary ONLY to <code className="font-mono bg-slate-100 px-1 rounded">Workday_Custom_Compliance_Staging__c</code>. Master worker records and payroll remain read-only.
                </p>

                {activeCase.workflowState !== 'resolved' && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    Gate Enforced: Complete Step 3 administrative case closure before dispatching an outbound Workday staging writeback.
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={
                      syncLoading ||
                      activeCase.workflowState !== 'resolved' ||
                      !can('TRIGGER_WORKDAY_SYNC').allowed
                    }
                    onClick={async () => {
                      setSyncLoading(true);
                      await queueAndSyncWorkdayStaging(activeCase.id, false);
                      setSyncLoading(false);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                    <span>Sync to Workday Staging (Success)</span>
                  </button>
                  <button
                    disabled={
                      syncLoading ||
                      activeCase.workflowState !== 'resolved' ||
                      !can('TRIGGER_WORKDAY_SYNC').allowed
                    }
                    onClick={async () => {
                      setSyncLoading(true);
                      await queueAndSyncWorkdayStaging(activeCase.id, true);
                      setSyncLoading(false);
                    }}
                    className="px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 text-amber-900 font-semibold"
                  >
                    Simulate HTTP 504 Timeout
                  </button>
                </div>

                {mirrorRecord && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                    <div className="font-semibold text-slate-800">
                      Workday Staging Mirror ({mirrorRecord.workerId})
                    </div>
                    <div>
                      Summary: <strong>{mirrorRecord.stagingObject.credentialReadinessSummary}</strong> · Reconciliation:{' '}
                      <strong>{mirrorRecord.stagingObject.reconciliationStatus}</strong>
                    </div>
                    {mirrorRecord.stagingObject.verifiedLicenseThroughDate && (
                      <div>
                        Verified Through: <span className="font-mono">{mirrorRecord.stagingObject.verifiedLicenseThroughDate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-600">
          No open or historical cases for {selectedWorker.name}. All applicable requirements are currently satisfied.
        </div>
      )}

      {/* WHY FLAGGED DRAWER */}
      {isWhyDrawerOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setIsWhyDrawerOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col text-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                  Explainability &amp; Source Audit
                </div>
                <h2 className="text-base font-semibold text-slate-900 mt-0.5">
                  Why Was {activeCase.caseNumber} Flagged?
                </h2>
              </div>
              <button
                onClick={() => setIsWhyDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                aria-label="Close Why Flagged drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Assignment &amp; Rule Triggered</div>
                <div>
                  <strong>Worker / Role:</strong> {activeCase.workerName} · {activeCase.role}
                </div>
                <div>
                  <strong>Facility / State:</strong> {activeCase.facilityName} ({activeCase.state}) · Assignment <span className="font-mono">{activeCase.assignmentId}</span>
                </div>
                <div>
                  <strong>Rule Code &amp; Version:</strong>{' '}
                  <span className="font-mono">{activeRequirement?.ruleCode || activeCase.ruleId}</span> ({activeCase.ruleVersion}) · Run <span className="font-mono">{activeCase.whyFlagged.agentRunId}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Rule &amp; Policy Citation</div>
                <div>
                  <strong>Policy:</strong> {activeCase.whyFlagged.policyName} ({activeCase.whyFlagged.policyVersion}, effective {activeCase.whyFlagged.policyEffectiveDate})
                </div>
                <div>
                  <strong>Clause:</strong> {activeCase.whyFlagged.clause}
                </div>
                <div>
                  <strong>Accepted Evidence:</strong> {activeCase.whyFlagged.alternativesAccepted.join(', ')}
                </div>
                <p className="text-slate-600 italic bg-white p-2.5 rounded border border-slate-200">
                  “{activeCase.whyFlagged.clauseText}”
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Inspected Source &amp; Freshness</div>
                <div>
                  <strong>Source:</strong> <span className="font-mono text-[11px]">{activeCase.whyFlagged.inspectedSource}</span>
                </div>
                <div>
                  <strong>As-of Timestamp:</strong> {activeCase.whyFlagged.sourceAsOfTimestamp}
                </div>
                <div>
                  <strong>Finding:</strong> {activeCase.whyFlagged.foundEvidenceSummary}
                </div>
                <div>
                  <strong>Repositories Searched:</strong> {activeCase.repositoriesSearched.join(', ')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                <div className="font-semibold text-amber-950">
                  Extraction Confidence ({activeCase.whyFlagged.extractionConfidence}%) — Honest Disclaimer
                </div>
                <p className="text-amber-900">{activeCase.whyFlagged.confidenceDisclaimer}</p>
                <p className="text-amber-900">
                  <strong>Uncertainty Note:</strong> {activeCase.whyFlagged.uncertaintyNote}
                </p>
                <p className="text-amber-900">
                  <strong>Why PSV Required:</strong> {activeCase.whyFlagged.whyAuthoritativeVerificationRequired}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsWhyDrawerOpen(false);
                  evidenceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="w-full py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold"
              >
                Jump to Worker Evidence Records ↓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED MOBILE-FRIENDLY EMPLOYEE PORTAL MODAL */}
      {isEmployeePortalOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setIsEmployeePortalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-xs">
            <div className="px-5 py-4 bg-teal-800 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-teal-200">
                  Simulated Employee Self-Service Portal
                </div>
                <h3 className="text-sm font-semibold mt-0.5">
                  {selectedWorker.name} · {activeCase.caseNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsEmployeePortalOpen(false)}
                className="p-1 text-teal-100 hover:text-white"
                aria-label="Close employee portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                <strong>Requested Item:</strong> {activeCase.title}
              </div>

              {portalSubmittedReceipt ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submitted to HR Review Queue</span>
                  </div>
                  <div className="text-emerald-950 leading-relaxed">{portalSubmittedReceipt.message}</div>
                  <div className="font-mono text-[11px] bg-white border border-emerald-200 rounded px-2.5 py-1.5 text-emerald-900">
                    Tracking ID: <strong>{portalSubmittedReceipt.trackingId}</strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPortalSubmittedReceipt(null);
                        setIsEmployeePortalOpen(false);
                      }}
                      className="flex-1 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold"
                    >
                      Done &amp; Return to Dossier
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setPortalMode('sample_doc');
                        setPortalError(null);
                      }}
                      className={`p-2 rounded-lg border text-left font-medium ${
                        portalMode === 'sample_doc' ? 'border-teal-700 bg-teal-50 text-teal-900' : 'border-slate-200'
                      }`}
                    >
                      1-Click Sample Doc
                    </button>
                    <button
                      onClick={() => {
                        setPortalMode('file');
                        setPortalError(null);
                      }}
                      className={`p-2 rounded-lg border text-left font-medium ${
                        portalMode === 'file' ? 'border-teal-700 bg-teal-50 text-teal-900' : 'border-slate-200'
                      }`}
                    >
                      Upload Real File
                    </button>
                    <button
                      onClick={() => {
                        setPortalMode('reply_question');
                        setPortalError(null);
                      }}
                      className={`p-2 rounded-lg border text-left font-medium ${
                        portalMode === 'reply_question' ? 'border-teal-700 bg-teal-50 text-teal-900' : 'border-slate-200'
                      }`}
                    >
                      Reply With Question
                    </button>
                    <button
                      onClick={() => {
                        setPortalMode('already_submitted_workday');
                        setPortalError(null);
                      }}
                      className={`p-2 rounded-lg border text-left font-medium ${
                        portalMode === 'already_submitted_workday' ? 'border-teal-700 bg-teal-50 text-teal-900' : 'border-slate-200'
                      }`}
                    >
                      Submitted in Workday
                    </button>
                  </div>

                  {portalMode === 'file' && (
                    <div className="space-y-2">
                      <label className="block font-medium text-slate-700">
                        Select PDF, JPG, PNG, or TXT file from your device (max 5 MB)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                        onChange={(e) => {
                          setPortalFile(e.target.files?.[0] || null);
                          setPortalError(null);
                        }}
                        className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-teal-700 file:text-white file:font-semibold"
                      />
                      <div className="text-[10px] text-slate-500">
                        Held in session memory only (not saved to localStorage). Uploading never marks a regulated license verified.
                      </div>
                    </div>
                  )}

                  {(portalMode === 'sample_doc' || portalMode === 'file') && (
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Claimed Expiration Date (Requires Verification)
                      </label>
                      <input
                        type="date"
                        value={portalClaimedExp}
                        onChange={(e) => setPortalClaimedExp(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Note for HR / Credentialing {portalMode === 'reply_question' ? '(Required)' : ''}
                    </label>
                    <textarea
                      rows={2}
                      value={portalNote}
                      onChange={(e) => {
                        setPortalNote(e.target.value);
                        setPortalError(null);
                      }}
                      placeholder={
                        portalMode === 'already_submitted_workday'
                          ? 'I uploaded this in Workday on Tuesday...'
                          : portalMode === 'reply_question'
                          ? 'Enter your question or clarification for HR...'
                          : 'Optional note...'
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>

                  {portalError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium">
                      {portalError}
                    </div>
                  )}

                  <button
                    disabled={portalSubmitting}
                    onClick={async () => {
                      setPortalSubmitting(true);
                      setPortalError(null);
                      const res = await submitEmployeePortalResponse(activeCase.id, {
                        mode: portalMode,
                        file: portalFile,
                        expirationDate: portalClaimedExp,
                        note: portalNote
                      });
                      setPortalSubmitting(false);
                      if (!res.ok) {
                        setPortalError(res.message);
                        return;
                      }
                      setPortalSubmittedReceipt({
                        trackingId: res.trackingId || `PORTAL-${Date.now().toString().slice(-6)}`,
                        message: res.message
                      });
                    }}
                    className="w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold"
                  >
                    {portalSubmitting ? 'Submitting...' : 'Submit Response to HR Queue'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WORKDAY PAYLOAD & MIRROR MODAL */}
      {isHRMSSyncPayloadModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setIsHRMSSyncPayloadModalOpen(false)} />
          <div className="relative z-10 w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Simulated Workday Staging Object Payload
                </h3>
                <p className="text-[11px] text-slate-500">
                  Target: Workday_Custom_Compliance_Staging__c (Master HR fields remain read-only)
                </p>
              </div>
              <button
                onClick={() => setIsHRMSSyncPayloadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
                aria-label="Close payload inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
{JSON.stringify(
  {
    targetObject: 'Workday_Custom_Compliance_Staging__c',
    workerId: selectedWorker.employeeNumber,
    caseNumber: activeCase.caseNumber,
    credentialReadinessSummary:
      readiness?.overallStatus === 'READY' ? 'READY' : 'PARTIAL_PENDING',
    excludedFields: [
      'Occupational_Health_Details__PHI',
      'Medical_Staff_Clinical_Privileges',
      'Workday_Payroll_Compensation'
    ]
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
