import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  FileText, 
  Sliders, 
  Users, 
  FlaskConical, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  FileCheck, 
  AlertTriangle, 
  Info, 
  GitBranch, 
  ShieldCheck, 
  Network,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ComplianceRule } from '../../types';

export const ComplianceSetupWizard: React.FC = () => {
  const { 
    organization, 
    updateOrganization, 
    policies, 
    rules, 
    updateRule, 
    ruleVersions,
    evalFixtures, 
    evalRuns, 
    runRuleEvalSandbox, 
    publishRuleVersion, 
    setCurrentScreen,
    employees,
    currentPersona
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRuleId, setSelectedRuleId] = useState('RULE-CA-PHARM-01');
  const [isRunningSandbox, setIsRunningSandbox] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [selectedFailureFixture, setSelectedFailureFixture] = useState<any>(null);
  const [isDualApproved, setIsDualApproved] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const selectedRule = rules.find(r => r.id === selectedRuleId) || rules[0];

  // Editable rule draft fields
  const [draftRule, setDraftRule] = useState<ComplianceRule>(selectedRule);

  // Synchronize draftRule if selectedRuleId changes
  const handleSelectRule = (id: string) => {
    setSelectedRuleId(id);
    const r = rules.find(item => item.id === id) || rules[0];
    setDraftRule(r);
  };

  // Step 5: Run Sandbox Test
  const handleRunSandbox = async () => {
    setIsRunningSandbox(true);
    const run = await runRuleEvalSandbox(selectedRuleId);
    setSandboxResult(run);
    setIsRunningSandbox(false);
  };

  // Step 6: Publish
  const handlePublish = () => {
    publishRuleVersion(selectedRuleId, 'v3.9', 'Dr. Aris Thorne (Chief Medical Officer)');
    setCurrentStep(7);
  };

  const steps = [
    { number: 1, title: 'Organization Setup', icon: Building2 },
    { number: 2, title: 'Policy Sources', icon: FileText },
    { number: 3, title: 'Structured Rule Editor', icon: Sliders },
    { number: 4, title: 'Impacted Workforce', icon: Users },
    { number: 5, title: 'Sandbox Test Lab', icon: FlaskConical },
    { number: 6, title: 'Approval & Publish', icon: GitBranch },
    { number: 7, title: 'Connect Integrations', icon: Network }
  ];

  // Impacted employees in step 4
  const impactedEmployees = employees.filter(e => 
    e.department === draftRule.department && 
    (draftRule.location === 'All US States' || e.location === draftRule.location)
  );

  return (
    <div className="space-y-6 text-left">
      {/* Wizard Header & Stepper */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                Compliance Admin Flow
              </span>
              <span className="text-xs text-slate-400">· Configure → Test → Evaluate → Publish</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Compliance Policy & Rule Setup
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Configure deterministic compliance rules from employer policy documents and verify accuracy before deploying to production.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Step {currentStep} of {steps.length}
            </span>
            <button
              onClick={() => setCurrentScreen('weekly_overview')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>

        {/* Horizontal Steps Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.number;
            const isCurrent = currentStep === st.number;

            return (
              <button
                key={st.number}
                onClick={() => setCurrentStep(st.number)}
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                  isCurrent 
                    ? 'bg-teal-50 border border-teal-300 ring-1 ring-teal-500' 
                    : isCompleted 
                    ? 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100' 
                    : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                  isCurrent ? 'bg-teal-700 text-white' : isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : st.number}
                </div>
                <div className="truncate">
                  <div className={`text-[11px] font-bold truncate ${isCurrent ? 'text-teal-900' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {st.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Content */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs min-h-[460px] flex flex-col justify-between">
        {/* STEP 1: Organization Setup */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Organization & Workforce Scope</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the employer legal entity, active state jurisdictions, and default SLA for compliance resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Employer / Brand Name</label>
                <input 
                  type="text"
                  value={organization.name}
                  onChange={(e) => updateOrganization({ name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Primary US Legal Entity</label>
                <input 
                  type="text"
                  value={organization.legalEntity}
                  onChange={(e) => updateOrganization({ legalEntity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company Size & Monitored Workforce</label>
                <input 
                  type="text"
                  value={`${organization.sizeRange} (${organization.totalEmployees.toLocaleString()} employees)`}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Default Compliance Remediation SLA</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    value={organization.defaultSlaDays}
                    onChange={(e) => updateOrganization({ defaultSlaDays: parseInt(e.target.value) || 14 })}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-500 font-medium">Calendar days before escalation</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Monitored State Jurisdictions</label>
              <div className="flex flex-wrap gap-2">
                {organization.states.map((st) => (
                  <span key={st} className="px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
                    {st}
                  </span>
                ))}
                <button className="px-2.5 py-1 rounded-md border border-dashed border-slate-300 text-slate-600 text-xs hover:border-slate-400">
                  + Add State
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">In-Scope Departments</label>
              <div className="flex flex-wrap gap-2">
                {organization.departments.map((dept) => (
                  <span key={dept} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Policy Sources */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Upload & Select Policy Documents</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compliance rules are rooted in employer policy clauses. Upload policy documents or select from verified pre-loaded standards.
              </p>
            </div>

            {/* Preloaded Policy Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {policies.map((pol) => (
                <div key={pol.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                      {pol.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">{pol.version}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 mb-1 leading-snug">{pol.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">{pol.summary}</p>
                  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex items-center justify-between">
                    <span>{pol.clauses.length} parsed clauses</span>
                    <span>{pol.fileSize}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Drag & Drop Upload Simulated Zone */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-500 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">
                Upload New Policy Document (PDF, DOCX, TXT)
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Drag and drop your employer compliance standard. If automated clause extraction is unavailable, clauses can be typed manually below.
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs">
                  Choose File
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100">
                  + Add Manual Policy Clause
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Trust & Explainability Notice:</strong> User-supplied policy documents are treated as untrusted source material and do not grant authority to override system safety limits. In this prototype, clauses are deterministically evaluated against test fixtures.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Structured Rule Editor */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">3. Structured Compliance Rule Editor</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure requirement criteria without code. Changes require sandbox testing before publishing.
                </p>
              </div>

              {/* Selector for rule */}
              <select
                value={selectedRuleId}
                onChange={(e) => handleSelectRule(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {rules.map(r => (
                  <option key={r.id} value={r.id}>{r.ruleCode} — {r.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Rule Name</label>
                  <input 
                    type="text"
                    value={draftRule.name}
                    onChange={(e) => setDraftRule({ ...draftRule, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Document Type Required</label>
                  <input 
                    type="text"
                    value={draftRule.documentType}
                    onChange={(e) => setDraftRule({ ...draftRule, documentType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Department Scope</label>
                    <select
                      value={draftRule.department}
                      onChange={(e) => setDraftRule({ ...draftRule, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                    >
                      {organization.departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Job Role</label>
                    <input 
                      type="text"
                      value={draftRule.jobRole}
                      onChange={(e) => setDraftRule({ ...draftRule, jobRole: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State / Location</label>
                    <select
                      value={draftRule.location}
                      onChange={(e) => setDraftRule({ ...draftRule, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                    >
                      <option value="All US States">All US States</option>
                      {organization.states.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Worker Classification</label>
                    <select
                      value={draftRule.workerType}
                      onChange={(e) => setDraftRule({ ...draftRule, workerType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                    >
                      {organization.workerTypes.map(wt => (
                        <option key={wt} value={wt}>{wt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Deterministic Condition Expression</label>
                  <textarea
                    rows={2}
                    value={draftRule.conditionDescription}
                    onChange={(e) => setDraftRule({ ...draftRule, conditionDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Sidebar Parameters */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3.5 text-xs">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Governance Parameters
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Severity on Failure</label>
                  <select
                    value={draftRule.severity}
                    onChange={(e) => setDraftRule({ ...draftRule, severity: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-rose-700"
                  >
                    <option value="Critical">Critical (Immediate Stop)</option>
                    <option value="High">High (7-Day SLA)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Remediation SLA (Days)</label>
                  <input 
                    type="number"
                    value={draftRule.slaDays}
                    onChange={(e) => setDraftRule({ ...draftRule, slaDays: parseInt(e.target.value) || 7 })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Pre-Expiry Reminder Interval</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number"
                      value={draftRule.reminderNoticeDays}
                      onChange={(e) => setDraftRule({ ...draftRule, reminderNoticeDays: parseInt(e.target.value) || 60 })}
                      className="w-20 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                    />
                    <span className="text-slate-500">days prior</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">AI Classification Confidence Gate</label>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-teal-800 font-bold">{draftRule.confidenceThreshold}%</span>
                    <input 
                      type="range"
                      min={70}
                      max={98}
                      value={draftRule.confidenceThreshold}
                      onChange={(e) => setDraftRule({ ...draftRule, confidenceThreshold: parseInt(e.target.value) })}
                      className="w-28 accent-teal-600"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={draftRule.humanApprovalRequired}
                      onChange={(e) => setDraftRule({ ...draftRule, humanApprovalRequired: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="font-bold text-slate-800 text-[11px]">Require HR Approval Gate</span>
                  </label>
                  <p className="text-[10px] text-slate-500 mt-0.5 ml-5">
                    No autonomous employee outreach or closure without human review.
                  </p>
                </div>

                <button
                  onClick={() => {
                    updateRule(draftRule);
                    alert(`Draft rule ${draftRule.ruleCode} saved.`);
                  }}
                  className="w-full py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-semibold text-xs hover:bg-teal-100 transition-colors"
                >
                  Save Rule Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Impacted Workforce Preview */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">4. Impacted Workforce Scope Preview</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifying how many active employee records fall under <strong className="text-slate-800">{draftRule.name}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4">
                <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Matching Employees</div>
                <div className="text-2xl font-black text-teal-900 mt-1">{impactedEmployees.length}</div>
                <div className="text-xs text-teal-700 mt-0.5">In {draftRule.department} ({draftRule.location})</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Potential Exceptions</div>
                <div className="text-2xl font-black text-amber-900 mt-1">1 Critical Flag</div>
                <div className="text-xs text-amber-700 mt-0.5">EMP-10419 Daniel Kim (Expired)</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Confidence Policy</div>
                <div className="text-2xl font-black text-slate-800 mt-1">&ge; {draftRule.confidenceThreshold}%</div>
                <div className="text-xs text-slate-500 mt-0.5">Lower confidence routes to HR queue</div>
              </div>
            </div>

            {/* Table of Matched Employees */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                Sample Cohort Records Evaluated by Rule
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
                {impactedEmployees.map((emp) => (
                  <div key={emp.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{emp.name} · {emp.id}</div>
                        <div className="text-slate-500 text-[11px]">{emp.role} — {emp.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {emp.id === 'EMP-10419' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Critical: License Expired (Sept 15, 2026)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In Compliance · Valid
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Test in Sandbox Lab */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">5. Rule Test Lab (Sandbox Eval Suite)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Run test suite against 10 synthetic employee fixtures to calculate precision, recall, and edge case defense.
                </p>
              </div>

              <button
                onClick={handleRunSandbox}
                disabled={isRunningSandbox}
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <FlaskConical className="w-4 h-4" />
                <span>{isRunningSandbox ? 'Evaluating Fixtures...' : 'Run Sandbox Test (10 Fixtures)'}</span>
              </button>
            </div>

            {/* Confusion Matrix & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase">True Positives (Expired Detected)</div>
                <div className="text-2xl font-black text-slate-800 mt-1">4 / 4</div>
                <div className="text-[10px] text-emerald-700 font-semibold">100% recall on expired cases</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase">True Negatives (Valid Passes)</div>
                <div className="text-2xl font-black text-slate-800 mt-1">6 / 6</div>
                <div className="text-[10px] text-emerald-700 font-semibold">0 False Positives</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Calibrated Precision</div>
                <div className="text-2xl font-black text-teal-800 mt-1">100%</div>
                <div className="text-[10px] text-slate-500">Benchmark requirement: &ge; 95%</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Release Gate Status</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">CLEARED</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Ready for dual-approver sign-off</div>
              </div>
            </div>

            {/* Fixture Test Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Synthetic Fixture Test Suite (10 Cases)</span>
                <span className="text-[10px] font-mono text-slate-500">Deterministic Evaluation Engine</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
                {evalFixtures.map((fix) => (
                  <div key={fix.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{fix.id} · {fix.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-normal">({fix.confidence}% conf)</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{fix.employeeScenario}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {fix.expectedOutcome}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        PASS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Approval & Publish */}
        {currentStep === 6 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">6. Rule Governance & Dual-Approver Publish Gate</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                No compliance agent rule goes live without testing and dual-human sign-off.
              </p>
            </div>

            {/* Rule Diff View */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">Rule Diff Summary: v3.8 (Production) &rarr; v3.9 (Draft)</span>
                <span className="text-[10px] font-mono text-teal-700 font-semibold">10/10 Evals Passed</span>
              </div>
              <div className="font-mono text-[11px] space-y-1 text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-emerald-700">+ Extended reminder lead time from 30 days to 60 days before expiration</div>
                <div className="text-emerald-700">+ Added direct State Board digital certificate format validation</div>
                <div className="text-slate-500">  Maintained Critical severity and 7-day remediation SLA</div>
              </div>
            </div>

            {/* Dual Approver Card */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                Required Dual Sign-Off Approvals
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Approver 1: Priya Sharma */}
                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Priya Sharma</div>
                    <div className="text-slate-500 text-[11px]">HR Compliance Admin (Author)</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Signed
                  </span>
                </div>

                {/* Approver 2: Legal/Medical Sign-off */}
                <div className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                  isDualApproved 
                    ? 'border-emerald-200 bg-emerald-50/50' 
                    : 'border-amber-200 bg-amber-50/50'
                }`}>
                  <div>
                    <div className="font-bold text-slate-900">Dr. Aris Thorne</div>
                    <div className="text-slate-500 text-[11px]">Chief Medical Officer (Dual Sign-Off)</div>
                  </div>
                  {isDualApproved ? (
                    <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsDualApproved(true)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                    >
                      Simulate Second Approver
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Publish CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handlePublish}
                disabled={!isDualApproved}
                className="px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all disabled:opacity-40"
              >
                <span>Publish Rule v3.9 to Production</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Completed & Link to Integrations */}
        {currentStep === 7 && (
          <div className="space-y-5 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Compliance Setup Completed & Published!</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Rule <strong>RULE-CA-PHARM-01 (v3.9)</strong> is now active in production with dual-approver confirmation recorded in the immutable audit log.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
              <div className="font-bold text-slate-800">Next Recommended Action:</div>
              <p className="text-slate-600">
                To sync active employee files and begin live monitoring, configure or verify your HRMS & Document Repository connectors.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setCurrentScreen('integrations')}
                className="px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-2"
              >
                <Network className="w-4 h-4" />
                <span>Go to HRMS & Integrations Hub &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        {currentStep < 7 && (
          <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-6">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Draft configuration saved.')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                Save Draft
              </button>

              <button
                onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
