import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, FileText, Sliders, FlaskConical, UserCheck, Database, Lock } from 'lucide-react';
import { computeRuleSnapshotHash } from '../../domain/rules';

const steps = [
  { title: 'Organization', subtitle: 'Choose your workforce scope', icon: Database },
  { title: 'Policies', subtitle: 'Review source documents', icon: FileText },
  { title: 'Rules', subtitle: 'Choose the requirements', icon: Sliders },
  { title: 'Test', subtitle: 'Check the rule safely', icon: FlaskConical },
  { title: 'Approve', subtitle: 'Independent sign-off', icon: UserCheck }
] as const;

export const AdminOnboardingJourney: React.FC = () => {
  const { organization, facilities, policies, rules, testRuns, updateDraftRule,
    runDraftRuleTestLab, submitRuleForApproval, approveAndPublishRule, can,
    setCurrentScreen, activeRoleId, switchRole, notify, computedMetrics } = useApp();
  const [step, setStep] = useState(0);
  const [ruleId, setRuleId] = useState('RULE-CA-PHARM-DRAFT');
  const [reviewedPolicy, setReviewedPolicy] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('Independent review of applicability, PSV requirements and sandbox results.');
  const draftRule = rules.find(r => r.id === ruleId) || rules.find(r => r.id === 'RULE-CA-PHARM-DRAFT') || rules[0];
  const test = testRuns.find(t => t.ruleId === draftRule.id);
  const isCurrentTest = !!test && test.ruleSnapshotHash === computeRuleSnapshotHash(draftRule);
  const testPassed = !!test?.gatePassed && isCurrentTest;
  const canEdit = can('CREATE_DRAFT_RULE').allowed;
  const isAuthor = activeRoleId === 'admin_priya';
  const publishAllowed = can('APPROVE_RULE_PUBLICATION', { ruleAuthorName: draftRule.author }).allowed;
  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const previous = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="space-y-5 pb-10 max-w-5xl mx-auto">
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="text-xs text-teal-700 uppercase font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4"/> Compliance Admin · Guided setup
        </div>
        <h1 className="text-2xl font-semibold text-slate-950 mt-2">Set up your compliance checks</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">
          Start with where the rule applies, confirm the policy, define the check, test it and send for independent approval.
          Workday and board verification are simulated in this customer demo.
        </p>
        <div className="mt-5 grid grid-cols-5 gap-1 sm:gap-2" aria-label="Setup progress">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.title} type="button" onClick={() => setStep(i)}
                aria-current={step === i ? 'step' : undefined}
                className={`flex flex-col items-center text-center rounded-lg p-2 gap-1 border transition-colors ${step === i ? 'bg-teal-50 border-teal-400 text-teal-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                <Icon className="w-4 h-4"/>
                <span className="text-[11px] font-semibold">{i + 1}. {s.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5 min-h-72">
        <div>
          <div className="text-xs font-semibold text-teal-700">Step {step + 1} of 5</div>
          <h2 className="text-xl font-semibold mt-1 text-slate-900">{steps[step].subtitle}</h2>
        </div>

        {step === 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="text-xs text-slate-500">Organization</div>
              <div className="font-semibold text-lg mt-1">{organization.name}</div>
              <div className="text-sm text-slate-600 mt-2">Sample: {computedMetrics.sampleWorkersCount} workers. Enterprise headcount is contextual only, not a measured compliance denominator.</div>
              <div className="mt-3 text-xs font-semibold text-teal-800">Workday HCM · Simulated connector</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="text-xs text-slate-500">Facilities in scope</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-800">
                {facilities.map(f => <li key={f.id} className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700"/>{f.name} · {f.state}</li>)}
              </ul>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Policies supply the requirements. A document is a source reference, not permission to bypass an approved rule.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {policies.slice(0, 4).map(p => (
                <div className="border border-slate-200 rounded-xl p-4" key={p.id}>
                  <div className="font-semibold text-sm text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-600 mt-1">{p.version} · {p.owner} · {p.status}</div>
                  <div className="mt-2 text-xs text-slate-500">{p.clauses.length} documented clauses</div>
                </div>
              ))}
            </div>
            <label className="flex gap-2 items-center text-sm text-slate-800 bg-teal-50 p-3 rounded-lg border border-teal-100">
              <input type="checkbox" checked={reviewedPolicy} onChange={e => setReviewedPolicy(e.target.checked)}/>
              I have reviewed the sample policy sources for this demo.
            </label>
            <button onClick={() => setCurrentScreen('policy_library')} className="text-sm font-semibold text-teal-700 hover:underline">Open full policy library and add a document →</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="text-sm font-semibold block">Select a rule to configure
              <select value={draftRule.id} onChange={e => setRuleId(e.target.value)}
                className="block mt-1 p-2.5 w-full border border-slate-300 rounded-lg text-sm bg-white">
                {rules.filter(r => r.status === 'Draft' || r.status === 'Pending Approval').map(r => <option key={r.id} value={r.id}>{r.name} ({r.version})</option>)}
              </select>
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm">
                <div className="font-semibold">Who does this apply to?</div>
                <div className="text-slate-600 mt-2">State: {draftRule.applicability.states.join(', ')}</div>
                <div className="text-slate-600 mt-1">Role: {draftRule.applicability.jobProfiles.join(', ')}</div>
                <div className="text-slate-600 mt-1">Required evidence: {draftRule.documentType}</div>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-sm">
                <div className="font-semibold">Safety checks</div>
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={draftRule.conditionExpression.disallowOutOfStateLicense} disabled={!canEdit}
                    onChange={e => updateDraftRule({...draftRule, status:'Draft', conditionExpression:{...draftRule.conditionExpression,disallowOutOfStateLicense:e.target.checked}})}/>
                  Reject out-of-state licenses
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={draftRule.conditionExpression.requirePrimarySourceVerification} disabled={!canEdit}
                    onChange={e => updateDraftRule({...draftRule, status:'Draft', conditionExpression:{...draftRule.conditionExpression,requirePrimarySourceVerification:e.target.checked}})}/>
                  Require primary-source verification
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={draftRule.conditionExpression.blockOnRestrictedBoardStatus} disabled={!canEdit}
                    onChange={e => updateDraftRule({...draftRule, status:'Draft', conditionExpression:{...draftRule.conditionExpression,blockOnRestrictedBoardStatus:e.target.checked}})}/>
                  Block restricted board statuses
                </label>
              </div>
            </div>
            <p className="text-xs text-slate-600">Start with “Reject out-of-state licenses” off to demonstrate a failing test, then enable it and retest.</p>
            <button className="text-sm font-semibold text-teal-700 hover:underline" onClick={() => setCurrentScreen('rule_builder')}>Advanced: full rule builder →</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => {runDraftRuleTestLab(draftRule.id);}} disabled={!can('RUN_RULE_SANDBOX_EVAL').allowed}
                className="rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white px-4 py-2.5 text-sm font-semibold flex items-center gap-2">
                <FlaskConical className="w-4 h-4"/> Run 12 sample checks
              </button>
              <div className="text-sm text-slate-700">
                {!test ? 'Not tested yet' : !isCurrentTest ? 'Rule changed — test again' : test.gatePassed ? `Passed ${test.passedCount}/${test.totalFixtures}` : `Needs fix: ${test.failedCount} test(s) failed`}
              </div>
            </div>
            {test && isCurrentTest && (
              <div className={`rounded-xl border p-4 ${test.gatePassed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="font-semibold text-sm">{test.gatePassed ? 'Safety gate cleared' : 'Not ready to publish'}</div>
                <div className="text-xs mt-2">{test.gateBlockReasons.length ? test.gateBlockReasons.join(' · ') : 'All required sample fixtures passed.'}</div>
                {test.results.filter(r => !r.passed).slice(0,2).map(r => <div className="text-xs mt-2" key={r.fixtureId}>{r.fixtureId}: {r.reason}</div>)}
              </div>
            )}
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" disabled={!canEdit} checked={draftRule.conditionExpression.disallowOutOfStateLicense}
                onChange={e => updateDraftRule({...draftRule,status:'Draft',conditionExpression:{...draftRule.conditionExpression,disallowOutOfStateLicense:e.target.checked}})}/>
              Reject out-of-state licenses (the recommended fix)
            </label>
            <button className="text-sm font-semibold text-teal-700 hover:underline" onClick={() => setCurrentScreen('rule_test_lab')}>See detailed test evidence →</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 p-4 text-sm">
              <div className="font-semibold">Rule: {draftRule.name}</div>
              <div className="text-slate-600 mt-1">Status: {draftRule.status} · Latest gate: {testPassed ? 'Passed' : 'Not cleared'}</div>
              <p className="text-slate-600 mt-2">The author cannot approve their own rule. Alex acts as an independent simulated approver.</p>
            </div>
            {isAuthor && (
              <button onClick={() => {const result=submitRuleForApproval(draftRule.id);if(result.ok) notify(result.message,'success');}}
                disabled={!testPassed || draftRule.status !== 'Draft'}
                className="px-4 py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-lg disabled:opacity-40">
                Submit for independent approval
              </button>
            )}
            {draftRule.status === 'Pending Approval' && !publishAllowed && (
              <button onClick={() => switchRole('cred_alex','admin_onboarding')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg">
                <UserCheck className="w-4 h-4"/> Switch to Alex for sign-off
              </button>
            )}
            {draftRule.status === 'Pending Approval' && publishAllowed && (
              <div className="space-y-2">
                <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm" rows={2} value={approvalNotes} onChange={e => setApprovalNotes(e.target.value)}/>
                <button onClick={() => approveAndPublishRule(draftRule.id, approvalNotes)}
                  className="px-4 py-2.5 bg-teal-700 text-white rounded-lg text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 inline mr-1"/> Approve & publish rule
                </button>
              </div>
            )}
            {draftRule.status === 'Published' && <div className="flex gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-lg text-sm"><CheckCircle2 className="w-4 h-4"/> Rule published in the simulated environment.</div>}
            {activeRoleId === 'cred_alex' && <button className="text-sm text-teal-700 underline font-medium" onClick={()=>switchRole('admin_priya','admin_onboarding')}>Return to Priya's setup</button>}
          </div>
        )}
      </section>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={previous} disabled={step === 0} className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-40 inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4"/> Back
        </button>
        <span className="text-xs text-slate-500">Only synthetic data and simulated external systems</span>
        {step < steps.length-1
          ? <button onClick={next} disabled={step===1 && !reviewedPolicy} className="px-5 py-2.5 rounded-lg bg-teal-700 text-white disabled:opacity-40 inline-flex items-center gap-2 text-sm font-semibold">Continue <ArrowRight className="w-4 h-4"/></button>
          : <button onClick={()=>setCurrentScreen('rule_versions')} className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-teal-800 inline-flex items-center gap-2 text-sm font-semibold"><Lock className="w-4 h-4"/> View approvals</button>
        }
      </div>
    </div>
  );
};
