import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  AlertOctagon,
  Lock,
  EyeOff,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export const GuardrailsView: React.FC = () => {
  const {
    killSwitchState,
    setIsKillSwitchModalOpen,
    resumeAgentFromKillSwitch,
    can,
    notify
  } = useApp();

  const isKilled = killSwitchState.isTriggered;
  const killAuth = can('TRIGGER_KILL_SWITCH');

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 tracking-widest uppercase mb-0.5">
            BOUNDED WORKFORCE SAFETY CONTROLS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Agent Guardrails & Safety Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hard policy boundaries enforced in domain logic and UI state transitions across worker files.
          </p>
        </div>

        <button
          onClick={() => {
            if (!killAuth.allowed) {
              notify(killAuth.reason, 'error');
              return;
            }
            setIsKillSwitchModalOpen(true);
          }}
          disabled={!killAuth.allowed}
          title={killAuth.allowed ? 'Open Emergency Kill Switch dialog' : killAuth.reason}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Emergency Kill Switch</span>
        </button>
      </div>

      {/* SECTION 21: EMERGENCY KILL SWITCH HERO CARD */}
      <div
        className={`p-6 rounded-2xl border-2 transition-all ${
          isKilled
            ? 'bg-rose-50 border-rose-400 shadow-sm'
            : 'bg-white border-rose-300 hover:border-rose-400 shadow-xs'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold text-rose-700 uppercase">
                  CIRCUIT BREAKER CONTROL
                </span>
                {isKilled && (
                  <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    SHUTDOWN ACTIVE
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Compliance Agent Emergency Kill Switch
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Immediately prevents new compliance evaluations, automated workflow outreach, and staging writebacks. Existing records remain available in Workday and read-only HR queues.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {!isKilled ? (
              <button
                onClick={() => {
                  if (!killAuth.allowed) {
                    notify(killAuth.reason, 'error');
                    return;
                  }
                  setIsKillSwitchModalOpen(true);
                }}
                disabled={!killAuth.allowed}
                title={killAuth.allowed ? 'Stop Compliance Agent' : killAuth.reason}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>STOP COMPLIANCE AGENT</span>
              </button>
            ) : (
              <button
                onClick={resumeAgentFromKillSwitch}
                disabled={!killAuth.allowed}
                title={killAuth.allowed ? 'Resume Compliance Agent' : killAuth.reason}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>Resume Published Baseline</span>
              </button>
            )}
          </div>
        </div>

        {/* When Kill Switch is Active: Display Shutdown Metadata */}
        {isKilled && (
          <div className="mt-5 pt-4 border-t border-rose-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-white/70 p-4 rounded-xl border">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">AGENT STATUS</span>
              <span className="font-bold text-rose-700">PAUSED — EMERGENCY STOP</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">STOPPED BY</span>
              <span className="font-bold text-slate-900">{killSwitchState.stoppedBy}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">TIMESTAMP</span>
              <span className="font-bold text-slate-900 font-mono">{killSwitchState.stoppedAt}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">REASON RECORDED</span>
              <span className="font-bold text-rose-800">{killSwitchState.reason}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Guardrails Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Action Guardrails */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>1. Action Guardrails (Hard Prohibitions)</span>
            </h3>
            <span className="text-[10px] font-mono text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded">
              Zero Bypass
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              {
                rule: 'Delete employee records',
                detail: 'Hard-blocked in integration adapter. System has zero delete scopes.'
              },
              {
                rule: 'Modify Workday master HR fields',
                detail: 'Master HR fields remain read-only; only readiness staging summaries may be queued.'
              },
              {
                rule: 'Send external communications without approval',
                detail: 'Employee portal outreach requires explicit human review and approval.'
              },
              {
                rule: 'Self-approve compliance rule changes',
                detail: 'Rule publication enforces independent reviewer sign-off and passing Test Lab results.'
              },
              {
                rule: 'Verify regulated licensure from uploaded PDFs alone',
                detail: 'Uploads set PENDING_SOURCE_CHECK until Credentialing logs board verification.'
              }
            ].map((g, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✕
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">{g.rule}</span>
                  <span className="text-slate-500 text-[11px]">{g.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Confidence Guardrails */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>2. Confidence Routing Guardrails</span>
            </h3>
            <span className="text-[10px] font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded">
              Calibrated Thresholds
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-emerald-900">&gt; 95% Extraction Confidence</span>
                <span className="text-emerald-800 font-bold">DRAFT FOR REVIEW</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                High certainty document match. Prepares drafted remediation task; regulated licenses still require Credentialing PSV.
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-amber-900">80% – 95% Confidence</span>
                <span className="text-amber-800 font-bold">REQUIRE HR VALIDATION</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Ambiguity or out-of-state jurisdiction detected (e.g. Elena Alvarez Nevada vs Texas RN license). Surfaced in &ldquo;Why?&rdquo; drawer.
              </p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-rose-900">&lt; 80% Confidence</span>
                <span className="text-rose-800 font-bold">STOP &amp; ESCALATE</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Low scan quality (e.g. Carlos Gomez blurry NYSED scan at 72%). Halts automated matching and routes to human exception queue.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Data Guardrails */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>3. Data Storage &amp; Repositories</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
              Whitelisted Sources
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 block">ALLOWED DEMO REPOSITORIES</span>
              <div className="text-slate-700 text-[11px]">
                Workday Worker Docs (Simulated), SharePoint HR Archive, DocuSign Envelopes, LMS Training Roster, Employee Submission Portal.
              </div>
            </div>

            <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1">
              <span className="font-bold text-rose-900 block">BLOCKED DATA VECTORS</span>
              <div className="text-rose-800 text-[11px]">
                External open web search (locked OFF), Occupational Health raw medical records (PHI excluded), personal cloud drives.
              </div>
            </div>
          </div>
        </div>

        {/* 4. Data Minimization & PHI Guardrails */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-teal-600" />
              <span>4. Data Minimization &amp; PHI Isolation Boundaries</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Demo Boundary (Not HIPAA/SOC 2 Audited)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">OCCUPATIONAL HEALTH PHI</span>
              <span className="font-bold text-slate-900">Excluded; clearance status only</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">WORKDAY MASTER FIELDS</span>
              <span className="font-bold text-slate-900">Read-only; staging writebacks only</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">MEDICAL STAFF PRIVILEGING</span>
              <span className="font-bold text-slate-900">External MSO reference only</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">IMMIGRATION / I-9 DOCS</span>
              <span className="font-bold text-slate-900">Role-restricted RBAC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
