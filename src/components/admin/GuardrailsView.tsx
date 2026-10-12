import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const GuardrailsView: React.FC = () => {
  const { 
    killSwitchState, 
    setIsKillSwitchModalOpen, 
    resumeAgentFromKillSwitch,
    setCurrentScreen 
  } = useApp();

  const isKilled = killSwitchState.isTriggered;

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
            Hard boundaries that no AI agent can circumvent under any runtime prompt or scenario.
          </p>
        </div>

        <button
          onClick={() => setIsKillSwitchModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Emergency Kill Switch</span>
        </button>
      </div>

      {/* SECTION 21: EMERGENCY KILL SWITCH HERO CARD */}
      <div className={`p-6 rounded-2xl border-2 transition-all ${
        isKilled 
          ? 'bg-rose-50 border-rose-400 shadow-sm' 
          : 'bg-white border-rose-300 hover:border-rose-400 shadow-xs'
      }`}>
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
                  <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.2 rounded">
                    SHUTDOWN ACTIVE
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Compliance Agent Emergency Kill Switch
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Immediately prevents new compliance evaluations, automated workflow actions, and remediation drafting. Existing records remain available in Workday and read-only HR queues.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {!isKilled ? (
              <button
                onClick={() => setIsKillSwitchModalOpen(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>STOP COMPLIANCE AGENT</span>
              </button>
            ) : (
              <button
                onClick={resumeAgentFromKillSwitch}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>Resume Previous Version</span>
              </button>
            )}
          </div>
        </div>

        {/* When Kill Switch is Active: Display Shutdown Metadata */}
        {isKilled && (
          <div className="mt-5 pt-4 border-t border-rose-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-white/70 p-4 rounded-xl border border-rose-200">
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
              { rule: 'Delete employee records', detail: 'Hard-blocked in API adapter. System has zero delete scopes.' },
              { rule: 'Modify HR master data', detail: 'Workday remains authoritative system of record (Read-only).' },
              { rule: 'Send external communications without approval', detail: 'Remediation outreach requires Gate 2 human sign-off.' },
              { rule: 'Change compliance policies', detail: 'Policies versioned via admin-only git-style approvals.' },
              { rule: 'Close critical compliance findings automatically', detail: 'Gate 3 human verification required before closure.' }
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
                <span className="font-bold text-emerald-900">&gt; 95% Confidence</span>
                <span className="text-emerald-800 font-bold">CONTINUE WORKFLOW</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                High certainty evidence match. Prepares drafted remediation task automatically.
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-amber-900">80% – 95% Confidence</span>
                <span className="text-amber-800 font-bold">REQUIRE HR VALIDATION</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Ambiguity detected (e.g. Maya Thompson unclassified archive PDF). Surfaced to "Why?" drawer.
              </p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-rose-900">&lt; 80% Confidence</span>
                <span className="text-rose-800 font-bold">STOP & ESCALATE</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Low confidence. Agent halts processing and routes directly to human exception queue.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Data Guardrails */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>3. Data Storage & Repositories</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
              Whitelisted Sources
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 block">ALLOWED REPOSITORIES</span>
              <div className="text-slate-700 text-[11px]">
                Workday Worker Docs, SharePoint HR Archive, DocuSign Envelopes, Sterling Background Check packages.
              </div>
            </div>

            <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1">
              <span className="font-bold text-rose-900 block">BLOCKED DATA VECTORS</span>
              <div className="text-rose-800 text-[11px]">
                Personal cloud drives, unapproved corporate email inboxes, third-party generative web sources.
              </div>
            </div>
          </div>
        </div>

        {/* 4. PII Guardrails */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-teal-600" />
              <span>4. PII Masking & Cryptographic Hygiene</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
              HIPAA / CCPA Compliant
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">SSN / TAX ID</span>
              <span className="font-bold text-slate-900">Masked (XXX-XX-4819)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">BANK ACCOUNT</span>
              <span className="font-bold text-slate-900">Masked in logs</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">MEDICAL DATA</span>
              <span className="font-bold text-slate-900">Excluded by policy</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">IMMIGRATION DOCS</span>
              <span className="font-bold text-slate-900">Restricted RBAC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
