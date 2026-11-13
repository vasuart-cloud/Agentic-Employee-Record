import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { checkRuleApplicabilityForAssignment, computeRuleSnapshotHash } from '../../domain/rules';
import { PolicyDocument, RuleDefinition } from '../../types';
import {
  BookOpen,
  Sliders,
  FlaskConical,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Upload,
  UserCheck,
  RotateCcw,
  Lock
} from 'lucide-react';

export const ComplianceSetupWizard: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    activeRoleId,
    switchRole,
    can,
    organization,
    computedMetrics,
    workers,
    policies,
    addPolicyDocument,
    rules,
    policyVersions,
    testRuns,
    assignments,
    updateDraftRule,
    runDraftRuleTestLab,
    submitRuleForApproval,
    approveAndPublishRule,
    rejectRuleVersion,
    rollbackRuleVersion,
    notify
  } = useApp();

  const activeTab: 'policy_library' | 'rule_builder' | 'rule_test_lab' | 'rule_versions' =
    currentScreen === 'policy_library' ||
    currentScreen === 'rule_builder' ||
    currentScreen === 'rule_test_lab' ||
    currentScreen === 'rule_versions'
      ? currentScreen
      : 'rule_test_lab';

  const [selectedRuleId, setSelectedRuleId] = useState<string>('RULE-CA-PHARM-DRAFT');
  const selectedRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  // Policy Upload state
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyOwner, setNewPolicyOwner] = useState('Pharmacy & Clinical Compliance');
  const [newPolicyText, setNewPolicyText] = useState('');
  const [uploadedPolicyFile, setUploadedPolicyFile] = useState<{
    name: string;
    size: string;
    isTxt: boolean;
  } | null>(null);

  const [approvalNotes, setApprovalNotes] = useState(
    'Verified 12/12 Test Lab pass and confirmed out-of-state rejection & PSV enforcement.'
  );

  const currentSnapshotHash = selectedRule ? computeRuleSnapshotHash(selectedRule) : '';
  const latestRunForRule = testRuns.find((tr) => tr.ruleId === selectedRule?.id);
  const isRunStale =
    latestRunForRule && selectedRule ? latestRunForRule.ruleSnapshotHash !== currentSnapshotHash : true;

  const [policyFileError, setPolicyFileError] = useState<string | null>(null);

  const workerById = useMemo(() => {
    const m: Record<string, (typeof workers)[number]> = {};
    for (const w of workers) m[w.id] = w;
    return m;
  }, [workers]);

  const impactedAssignments = useMemo(() => {
    if (!selectedRule) return [];
    return assignments.filter(
      (a) => checkRuleApplicabilityForAssignment(selectedRule, a).outcome === 'REQUIRED'
    );
  }, [selectedRule, assignments]);

  const handlePolicyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const lower = file.name.toLowerCase();
    const isTxt = file.type === 'text/plain' || lower.endsWith('.txt');
    const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf');
    if (!isTxt && !isPdf) {
      setPolicyFileError('Unsupported file format. Upload a .txt or .pdf policy document.');
      notify('Unsupported policy file type. Allowed: .txt, .pdf', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPolicyFileError('File exceeds 5 MB browser demo limit.');
      notify('Policy file exceeds 5 MB limit.', 'error');
      return;
    }
    const sizeLabel = `${Math.max(1, Math.round(file.size / 1024))} KB`;
    setUploadedPolicyFile({ name: file.name, size: sizeLabel, isTxt });
    if (!newPolicyName) setNewPolicyName(file.name.replace(/\.[^.]+$/, ''));

    if (isTxt) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPolicyText(String(reader.result || '').slice(0, 2000));
      };
      reader.readAsText(file);
    } else {
      setNewPolicyText('');
    }
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName.trim()) return;
    const isTxt = Boolean(uploadedPolicyFile?.isTxt && newPolicyText.trim());
    const extractedClauses = isTxt
      ? newPolicyText
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 4)
          .map((line, i) => ({
            clauseId: `CL-${Date.now().toString().slice(-4)}-${i + 1}`,
            section: `Section ${i + 1}`,
            text: line
          }))
      : [
          {
            clauseId: `CL-${Date.now().toString().slice(-4)}-1`,
            section: 'Manual Entry Required',
            text:
              newPolicyText.trim() ||
              'PDF/binary reference stored in demo mode. Enter policy clause text manually; no server-side PDF parsing executed.'
          }
        ];

    const doc: PolicyDocument = {
      id: `POL-${Date.now().toString().slice(-5)}`,
      name: newPolicyName.trim(),
      documentNumber: `POL-DEMO-${Date.now().toString().slice(-3)}`,
      version: 'v1.0-draft',
      effectiveDate: '2026-12-01',
      owner: newPolicyOwner,
      applicableBusinessUnit: 'BioVanguard Health Systems',
      category: 'Clinical Licensure',
      sourceReference: uploadedPolicyFile ? `Browser File (${uploadedPolicyFile.name})` : 'Manual Policy Entry',
      summary: 'Employer-configured policy entry added in Demo Policy Library.',
      clauses: extractedClauses,
      fileName: uploadedPolicyFile?.name || 'manual_policy_entry.txt',
      fileSize: uploadedPolicyFile?.size || '2 KB',
      extractionStatus: isTxt
        ? 'Browser TXT Extracted'
        : 'Demo File Reference (Manual Clause Entry Required)',
      status: 'Draft',
      disclaimer:
        'Illustrative employer policy text only — not formal legal advice or external regulatory guidance.'
    };

    addPolicyDocument(doc);
    setNewPolicyName('');
    setNewPolicyText('');
    setUploadedPolicyFile(null);
  };

  const canAuthor = can('CREATE_DRAFT_RULE');
  const canApproveRule = can('APPROVE_RULE_PUBLICATION', {
    ruleAuthorName: selectedRule?.author
  });

  const formatMetric = (val: number | null) => (val === null ? 'N/A' : `${val}%`);

  return (
    <div className="space-y-6">
      {/* Header + Sub-nav */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-teal-800">
            Configure → Test → Independent Approve → Publish → Monitor
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mt-0.5">
            Policy Rules, Executable Test Lab &amp; Approvals
          </h1>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {(
            [
              ['policy_library', 'Policy Library', BookOpen],
              ['rule_builder', 'Rule Builder', Sliders],
              ['rule_test_lab', 'Test Lab', FlaskConical],
              ['rule_versions', 'Versions & Approvals', GitBranch]
            ] as const
          ).map(([id, label, Icon]) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setCurrentScreen(id)}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  active
                    ? 'bg-teal-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 1 Organization & Integration Scope Summary */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-600">
          <strong className="text-slate-900">{organization.name}</strong> · Active sample cohort:{' '}
          <strong className="tabular-nums">{computedMetrics.sampleWorkersCount}</strong> workers ({organization.enterpriseHeadcountContext.toLocaleString()} enterprise context) · Ref Date{' '}
          <span className="font-mono">{organization.demoReferenceDate}</span>
        </div>
        <button
          onClick={() => setCurrentScreen('integrations')}
          className="text-teal-700 hover:text-teal-800 font-semibold"
        >
          Manage Workday &amp; Repository Connectors →
        </button>
      </div>

      {/* TAB 1: POLICY LIBRARY */}
      {activeTab === 'policy_library' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs">
          <div className="lg:col-span-2 space-y-3">
            {policies.map((pol) => (
              <div key={pol.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-teal-800">
                      {pol.documentNumber} · {pol.version} · Effective {pol.effectiveDate}
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900 mt-0.5">{pol.name}</h2>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Owner: {pol.owner} · {pol.applicableBusinessUnit} · Extraction: <strong>{pol.extractionStatus}</strong>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    {pol.status}
                  </span>
                </div>

                <p className="text-slate-600">{pol.summary}</p>

                <div className="space-y-1.5">
                  {pol.clauses.map((cl) => (
                    <div key={cl.clauseId} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-semibold text-slate-800">{cl.section}</div>
                      <div className="text-slate-600 mt-0.5">{cl.text}</div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                  {pol.disclaimer}
                </div>
              </div>
            ))}
          </div>

          {/* Add Policy Document Form */}
          <form onSubmit={handleCreatePolicy} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 h-fit">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-teal-700" />
              <span>Add Policy Source</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Upload a plain-text (<code>.txt</code>) policy file for real browser clause extraction, or attach a PDF as a demo reference with manual clause entry.
            </p>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Policy Title</label>
              <input
                type="text"
                required
                value={newPolicyName}
                onChange={(e) => setNewPolicyName(e.target.value)}
                placeholder="e.g., California Pharmacy Renewal Addendum"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Owner</label>
              <input
                type="text"
                value={newPolicyOwner}
                onChange={(e) => setNewPolicyOwner(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Attach .txt or .pdf (max 5 MB)</label>
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={handlePolicyFileChange}
                className="w-full text-[11px] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-slate-900 file:text-white"
              />
              {policyFileError && (
                <div className="text-[11px] text-rose-700 font-medium mt-1">{policyFileError}</div>
              )}
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Policy Clauses {uploadedPolicyFile?.isTxt ? '(Extracted from TXT)' : '(Manual Entry)'}
              </label>
              <textarea
                rows={4}
                value={newPolicyText}
                onChange={(e) => setNewPolicyText(e.target.value)}
                placeholder="Enter or paste policy clauses..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={!canAuthor.allowed}
              className="w-full py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold"
            >
              Register Policy Document
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: RULE BUILDER */}
      {activeTab === 'rule_builder' && selectedRule && (
        <div className="space-y-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="font-semibold text-slate-700">Select Rule:</label>
              <select
                value={selectedRule.id}
                onChange={(e) => setSelectedRuleId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
              >
                {rules.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.ruleCode} ({r.version} · {r.status}) — {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-slate-600 tabular-nums">
              Matched sample assignments: <strong>{impactedAssignments.length}</strong> of {assignments.length}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Applicability Scope */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Applicability Scope</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-500 font-semibold">States</div>
                  <div className="font-medium text-slate-900 mt-0.5">{selectedRule.applicability.states.join(', ')}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-500 font-semibold">Worker Types</div>
                  <div className="font-medium text-slate-900 mt-0.5">{selectedRule.applicability.workerTypes.join(', ')}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
                  <div className="text-[10px] uppercase text-slate-500 font-semibold">Departments &amp; Job Profiles</div>
                  <div className="font-medium text-slate-900 mt-0.5">
                    {selectedRule.applicability.departments.join(', ')} · {selectedRule.applicability.jobProfiles.join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-1.5">
                <div className="font-semibold text-slate-800">Verification Method &amp; Source</div>
                <div className="text-slate-600">
                  Method: <strong>{selectedRule.verificationMethod}</strong> ({selectedRule.verificationSourceLabel})
                </div>
                <div className="text-slate-600">
                  Source Policy Citation: <strong>{selectedRule.sourceClause}</strong> ({selectedRule.sourcePolicyVersion})
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="font-semibold text-slate-800">
                  Matched Sample Worker Assignments ({impactedAssignments.length})
                </div>
                {impactedAssignments.length === 0 ? (
                  <div className="text-slate-500">No sample assignments currently match this rule filter.</div>
                ) : (
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {impactedAssignments.map((asn) => {
                      const w = workerById[asn.workerId];
                      return (
                        <div key={asn.id} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-[11px]">
                          <div>
                            <span className="font-semibold text-slate-900">{w?.name || asn.workerId}</span>
                            <span className="text-slate-500"> · {asn.jobProfile}</span>
                          </div>
                          <span className="text-slate-600 font-mono shrink-0">{asn.state}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Condition Parameters (Interactive Toggles) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Condition Parameters</h3>

              {(
                [
                  ['requireUnexpired', 'Require Unexpired Credential'],
                  ['requirePrimarySourceVerification', 'Require Authoritative Primary Source Verification (PSV)'],
                  ['disallowOutOfStateLicense', 'Reject out-of-state licenses for state-scoped assignments'],
                  ['blockOnRestrictedBoardStatus', 'Block clearance on Restricted / Suspended board status']
                ] as const
              ).map(([field, label]) => (
                <label
                  key={field}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer"
                >
                  <span className="font-medium text-slate-800">{label}</span>
                  <input
                    type="checkbox"
                    disabled={!canAuthor.allowed}
                    checked={Boolean(selectedRule.conditionExpression[field])}
                    onChange={(e) => {
                      const next: RuleDefinition = {
                        ...selectedRule,
                        status: 'Draft',
                        conditionExpression: {
                          ...selectedRule.conditionExpression,
                          [field]: e.target.checked
                        }
                      };
                      updateDraftRule(next);
                    }}
                    className="rounded border-slate-300 text-teal-700"
                  />
                </label>
              ))}

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-medium text-slate-800">
                  <span>Min Extraction Confidence Threshold</span>
                  <span className="font-mono tabular-nums">{selectedRule.conditionExpression.minConfidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={99}
                  disabled={!canAuthor.allowed}
                  value={selectedRule.conditionExpression.minConfidenceThreshold}
                  onChange={(e) => {
                    updateDraftRule({
                      ...selectedRule,
                      status: 'Draft',
                      conditionExpression: {
                        ...selectedRule.conditionExpression,
                        minConfidenceThreshold: Number(e.target.value)
                      }
                    });
                  }}
                  className="w-full accent-teal-700"
                />
              </div>

              <button
                onClick={() => setCurrentScreen('rule_test_lab')}
                className="w-full py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold"
              >
                Open Executable Test Lab for {selectedRule.ruleCode} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTABLE RULE TEST LAB */}
      {activeTab === 'rule_test_lab' && selectedRule && (
        <div className="space-y-5 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-teal-800">{selectedRule.ruleCode}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {selectedRule.version} · {selectedRule.status}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 mt-1">{selectedRule.name}</h2>
                <p className="text-slate-600 mt-0.5">
                  Deterministic sandbox fixture evaluation. Draft rule <code className="font-mono">v3.9-draft</code> initially omits out-of-state rejection so fixture <code className="font-mono">FIX-05</code> fails until fixed.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  value={selectedRule.id}
                  onChange={(e) => setSelectedRuleId(e.target.value)}
                  aria-label="Select rule for Test Lab"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                >
                  {rules
                    .filter((r) => r.id === 'RULE-CA-PHARM-DRAFT' || r.id === 'RULE-CA-PHARM-01')
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.ruleCode} ({r.version})
                      </option>
                    ))}
                </select>

                <button
                  onClick={() => runDraftRuleTestLab(selectedRule.id)}
                  disabled={!can('RUN_RULE_SANDBOX_EVAL').allowed}
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Run Sandbox Fixtures</span>
                </button>

                <button
                  onClick={() => submitRuleForApproval(selectedRule.id)}
                  disabled={
                    !can('SUBMIT_RULE_FOR_APPROVAL').allowed ||
                    !latestRunForRule?.gatePassed ||
                    isRunStale ||
                    selectedRule.status === 'Pending Approval' ||
                    selectedRule.status === 'Published'
                  }
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold"
                >
                  Submit for Independent Approval
                </button>
              </div>
            </div>

            {/* Quick Inline Parameter Fix Strip */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900">
                  Draft Guardrail Toggle: Reject Out-of-State Licenses (<code className="font-mono">disallowOutOfStateLicense</code>)
                </div>
                <div className="text-[11px] text-slate-600">
                  State-scoped California Pharmacy assignments must reject Nevada / out-of-state credentials.
                </div>
              </div>
              <label className="flex items-center gap-2 font-semibold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!canAuthor.allowed}
                  checked={selectedRule.conditionExpression.disallowOutOfStateLicense}
                  onChange={(e) =>
                    updateDraftRule({
                      ...selectedRule,
                      status: 'Draft',
                      conditionExpression: {
                        ...selectedRule.conditionExpression,
                        disallowOutOfStateLicense: e.target.checked
                      }
                    })
                  }
                  className="rounded border-slate-300 text-teal-700 w-4 h-4"
                />
                <span>{selectedRule.conditionExpression.disallowOutOfStateLicense ? 'Enabled' : 'Disabled (Defect)'}</span>
              </label>
            </div>

            {/* Latest Run Results */}
            {latestRunForRule ? (
              <div className="space-y-4">
                {/* Gate Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                    isRunStale
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : latestRunForRule.gatePassed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {isRunStale ? (
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    ) : latestRunForRule.gatePassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-rose-700" />
                    )}
                    <span>
                      {isRunStale
                        ? 'Rule modified since last run — rerun Test Lab to clear release gate.'
                        : latestRunForRule.gatePassed
                        ? `Release Gate CLEARED (${latestRunForRule.passedCount}/${latestRunForRule.totalFixtures} passed)`
                        : `Release Gate BLOCKED: ${latestRunForRule.gateBlockReasons.join(' ')}`}
                    </span>
                  </div>
                  <span className="font-mono text-[11px]">Run {latestRunForRule.runId}</span>
                </div>

                {/* Confusion Matrix + Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 tabular-nums">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase">Passed</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {latestRunForRule.passedCount}/{latestRunForRule.totalFixtures}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase">TP / TN</div>
                    <div className="text-lg font-semibold text-emerald-700">
                      {latestRunForRule.tp} / {latestRunForRule.tn}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase">FP / FN</div>
                    <div className="text-lg font-semibold text-rose-700">
                      {latestRunForRule.fp} / {latestRunForRule.fn}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase">Precision</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {formatMetric(latestRunForRule.precision)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase">Recall</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {formatMetric(latestRunForRule.recall)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {formatMetric(latestRunForRule.accuracy)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase">Coverage</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {latestRunForRule.coveragePercent}%
                    </div>
                  </div>
                </div>

                {/* Fixture Results Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500">
                        <th className="py-2 px-3">Fixture</th>
                        <th className="py-2 px-3">Expected</th>
                        <th className="py-2 px-3">Actual</th>
                        <th className="py-2 px-3">Result</th>
                        <th className="py-2 px-3">Diagnostic &amp; Suggested Fix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {latestRunForRule.results.map((res) => (
                        <tr key={res.fixtureId} className={res.passed ? '' : 'bg-rose-50/50'}>
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            <span className="font-mono text-[11px] text-slate-500 mr-1.5">
                              {res.fixtureId}
                            </span>
                            {res.fixtureName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">{res.expectedOutcome}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">{res.actualOutcome}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                                res.passed
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-100 text-rose-900 border border-rose-300'
                              }`}
                            >
                              {res.passed ? `PASS (${res.classification})` : `FAIL (${res.classification})`}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">
                            <div>{res.reason}</div>
                            {res.suggestedFix && (
                              <div className="text-rose-800 font-semibold mt-0.5">
                                Fix: {res.suggestedFix}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                No sandbox runs executed for this rule yet. Click Run Sandbox Fixtures above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: VERSIONS & INDEPENDENT APPROVALS */}
      {activeTab === 'rule_versions' && (
        <div className="space-y-5 text-xs">
          {/* Independent Approval Action Card for Pending Rule */}
          {selectedRule && selectedRule.status === 'Pending Approval' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Independent Publication Sign-Off: {selectedRule.ruleCode} ({selectedRule.version})
                </h3>
                <span className="text-[11px] text-slate-500">Author: {selectedRule.author}</span>
              </div>

              {/* Rule Parameter Diff & Latest Eval Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Out-of-State Rejection</span>
                  <strong className={selectedRule.conditionExpression.disallowOutOfStateLicense ? 'text-emerald-800' : 'text-rose-700'}>
                    {selectedRule.conditionExpression.disallowOutOfStateLicense ? 'Enabled (Rejects NV/Out-of-State)' : 'Disabled'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Primary Source Verification</span>
                  <strong className="text-slate-900">
                    {selectedRule.conditionExpression.requirePrimarySourceVerification ? 'Mandatory (PSV)' : 'Optional'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Latest Test Lab Run</span>
                  <strong className={latestRunForRule?.gatePassed && !isRunStale ? 'text-emerald-800' : 'text-amber-800'}>
                    {latestRunForRule
                      ? `${latestRunForRule.passedCount}/${latestRunForRule.totalFixtures} Passed (${latestRunForRule.gatePassed && !isRunStale ? 'Gate Cleared' : 'Needs Rerun'})`
                      : 'No run found'}
                  </strong>
                </div>
              </div>

              {!canApproveRule.allowed ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
                  <div className="flex items-start gap-2 text-amber-950 font-medium">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{canApproveRule.reason}</span>
                  </div>
                  {activeRoleId !== 'cred_alex' && (
                    <button
                      onClick={() => switchRole('cred_alex', 'rule_versions')}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold inline-flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Switch to Alex Morgan (Independent Approver)</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Independent review & rationale..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => approveAndPublishRule(selectedRule.id, approvalNotes)}
                      className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve &amp; Publish Rule Version</span>
                    </button>
                    <button
                      onClick={() => rejectRuleVersion(selectedRule.id, approvalNotes)}
                      className="px-4 py-2 rounded-lg border border-rose-300 text-rose-800 hover:bg-rose-50 font-semibold"
                    >
                      Return to Draft / Request Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Version History Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900">
              Policy Version Ledger
            </div>
            <div className="divide-y divide-slate-100">
              {policyVersions.map((pv) => (
                <div key={pv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-teal-800">{pv.ruleCode}</span>
                      <span className="font-semibold text-slate-900">{pv.version}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {pv.status}
                      </span>
                    </div>
                    <div className="text-slate-700">{pv.diffSummary}</div>
                    <div className="text-[11px] text-slate-500">
                      Author: {pv.author} · Test: {pv.testSummary}
                      {pv.approver && ` · Approved by ${pv.approver} (${pv.approvedAt})`}
                    </div>
                  </div>

                  {pv.status === 'Superseded' && canAuthor.allowed && (
                    <button
                      onClick={() => rollbackRuleVersion(pv.ruleId, pv.version)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback to {pv.version}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
