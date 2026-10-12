import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cpu, 
  Check, 
  X, 
  ShieldAlert, 
  AlertOctagon, 
  Play, 
  Sliders, 
  Database, 
  History, 
  CheckCircle2, 
  Eye, 
  RotateCcw, 
  ExternalLink,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { AgentSandbox } from './AgentSandbox';

export const AgentDetailPage: React.FC = () => {
  const { 
    selectedAgent, 
    setCurrentScreen, 
    complianceAgentAutonomy, 
    setComplianceAgentAutonomy,
    dataSources,
    toggleDataSource,
    killSwitchState,
    setIsKillSwitchModalOpen,
    resumeAgentFromKillSwitch,
    versions,
    setIsRollbackModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'configuration' | 'autonomy' | 'data_access' | 'sandbox' | 'versions' | 'audit_log'>('overview');

  const isKilled = killSwitchState.isTriggered && selectedAgent.id === 'compliance-agent';

  const autonomyLevels = [
    { level: 0, title: 'LEVEL 0 — Observe Only', desc: 'Agent monitors and logs findings silently. No alerts, tasks or outreach.' },
    { level: 1, title: 'LEVEL 1 — Recommend', desc: 'Agent generates compliance findings and suggests next steps in dashboard.' },
    { level: 2, title: 'LEVEL 2 — Execute with Human Approval', desc: 'Current setting. Prepares remediation outreach and tasks, but requires HR sign-off before dispatch.' },
    { level: 3, title: 'LEVEL 3 — Execute within Policy', desc: 'Autonomously dispatches low-risk reminder tasks. Human review required for critical or adverse findings.' },
    { level: 4, title: 'LEVEL 4 — Full Autonomy', desc: 'Fully automated outreach, resolution, and closure without human intervention.' }
  ];

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Kill Switch Banner if Activated */}
      {isKilled && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-900">
                COMPLIANCE AGENT STATUS: PAUSED — EMERGENCY STOP
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                Stopped by: <strong>{killSwitchState.stoppedBy}</strong> at {killSwitchState.stoppedAt} · Reason: <em>"{killSwitchState.reason}"</em>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen('evals')}
              className="px-3.5 py-2 rounded-lg bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 font-bold text-xs"
            >
              Run Evals
            </button>
            <button
              onClick={resumeAgentFromKillSwitch}
              className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
            >
              Resume Agent
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {selectedAgent.name}
                </h1>
                <span className="font-mono text-xs bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-slate-700 font-semibold">
                  {selectedAgent.version}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-bold font-mono ${
                  isKilled ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isKilled ? 'PAUSED' : 'ACTIVE'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-mono">
                <span>Production since: <strong className="text-slate-700 font-semibold">{selectedAgent.productionSince}</strong></span>
                <span>·</span>
                <span>Owner: <strong className="text-slate-700 font-semibold">{selectedAgent.owner}</strong></span>
                <span>·</span>
                <span>Environment: <strong className="text-teal-700 font-semibold">Production</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('sandbox')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-teal-700" />
              <span>Test Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('configuration')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Configuration</span>
            </button>

            <button
              onClick={() => setCurrentScreen('evals')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Evals</span>
            </button>

            {/* Red Emergency Kill Switch Button */}
            <button
              onClick={() => setIsKillSwitchModalOpen(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Emergency shutdown for this agent"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-white" />
              <span>Kill Switch</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-slate-200 mt-6 pt-2 flex items-center gap-6 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'configuration', label: 'Configuration & Permissions' },
            { id: 'autonomy', label: 'Autonomy Controls' },
            { id: 'data_access', label: 'Data Access & PII' },
            { id: 'sandbox', label: 'Test Sandbox' },
            { id: 'versions', label: 'Version Control & Rollback' },
            { id: 'audit_log', label: 'Audit Log' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Agent Purpose & Scope</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluate employee records against approved company compliance rules and statutory requirements (USCIS Form I-9, State Medical Licensure, EEOC 29 CFR Part 1602). Identifies missing, expired, or conflicting evidence across Workday, SharePoint, and DocuSign.
              </p>
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 font-medium">
                <strong>Governance Principle:</strong> Operates at Level-2 Autonomy (Execute with Human Approval). Never sends external messages or modifies employee master records without HR Operations sign-off.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Active Production Policies</h3>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800">Employment Verification Policy</span>
                    <span className="text-slate-500 text-[11px] block">Governs Form I-9 Section 2 statutory requirements</span>
                  </div>
                  <span className="font-mono text-teal-700 font-bold">Version 4.2 · Active</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800">Clinical & Professional Licensure Policy</span>
                    <span className="text-slate-500 text-[11px] block">California DCA, Texas Board of Pharmacy, Legal Bar rules</span>
                  </div>
                  <span className="font-mono text-teal-700 font-bold">Version 3.8 · Active</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800">Pre-Employment Screening Standards</span>
                    <span className="text-slate-500 text-[11px] block">Sterling background and education verification</span>
                  </div>
                  <span className="font-mono text-teal-700 font-bold">Version 2.0 · Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Production Metrics (30d)</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Total Invocations:</span>
                  <span className="font-bold text-slate-900">41,260</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Success Rate:</span>
                  <span className="font-bold text-emerald-700">96.9%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Avg Latency:</span>
                  <span className="text-slate-700">2.6 sec</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Compliance Findings:</span>
                  <span className="font-bold text-slate-900">2,146</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">False Positive Rate:</span>
                  <span className="font-bold text-slate-700">3.1%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-sans">Avg Cost / Run:</span>
                  <span className="text-slate-700">$0.014</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Release Gate Readiness</h3>
              <p className="text-xs text-slate-500">
                Draft version v2.5 is currently in staging review.
              </p>
              <button
                onClick={() => setCurrentScreen('evals')}
                className="w-full mt-2 py-2 px-3 bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Check Release Gate Checklist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Configuration (Allowed & Not Allowed Actions) */}
      {activeTab === 'configuration' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Agent Configuration & Action Boundaries</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict permissions defining what the Compliance Agent may and may not execute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allowed Actions */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Allowed Actions</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  'Read employee metadata (Workday worker ID, status, state, start date)',
                  'Read approved document repositories (SharePoint, DocuSign, Archive)',
                  'Classify employee evidence with calibrated confidence scores',
                  'Evaluate compliance requirements against versioned policy rules',
                  'Create compliance findings in Priority Queue for human review',
                  'Recommend remediation outreach and draft message templates'
                ].map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-200/80">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-slate-800 font-medium">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Allowed Actions */}
            <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-5 space-y-3">
              <div className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600" />
                <span>Prohibited Actions (Hard Guardrails)</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  'Delete employee documents or file records from any repository',
                  'Change employee master data in Workday, SAP, or HCM systems',
                  'Send employee or manager communication automatically without HR approval',
                  'Close critical compliance findings automatically without human review',
                  'Modify compliance policy schemas or alter statutory rules'
                ].map((prohibition, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-rose-200">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="text-rose-900 font-medium">{prohibition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Autonomy Controls (Section 8) */}
      {activeTab === 'autonomy' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Agent Autonomy Level Configuration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the boundary between autonomous machine actions and mandatory human gates.
            </p>
          </div>

          <div className="space-y-3">
            {autonomyLevels.map((lvl) => {
              const isSelected = complianceAgentAutonomy === lvl.level;
              return (
                <div
                  key={lvl.level}
                  onClick={() => setComplianceAgentAutonomy(lvl.level as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-teal-500 bg-teal-50/60 shadow-xs ring-1 ring-teal-500' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                      {lvl.title}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold bg-teal-600 text-white px-2 py-0.5 rounded">
                        Active Setting
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    {lvl.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Autonomy Parameters */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <span className="font-bold text-slate-800 block">Confidence & Routing Thresholds</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-mono">CONFIDENCE &gt; 95%</span>
                <span className="font-bold text-slate-900">Continue automated check</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-mono">CONFIDENCE 80% – 95%</span>
                <span className="font-bold text-amber-700">Route to HR Review Queue</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-mono">CRITICAL CASES</span>
                <span className="font-bold text-rose-700">Always require human review</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Data Access (Section 9) */}
      {activeTab === 'data_access' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Allowed Data Sources & PII Guardrails</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure read permissions for enterprise systems and enforce sensitive document masking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'workday', label: 'Workday HCM', desc: 'Worker master records & document attachments' },
              { key: 'sharepoint', label: 'Microsoft SharePoint', desc: 'HR document library & employee archive' },
              { key: 'docusign', label: 'DocuSign Enterprise', desc: 'Executed onboarding agreement envelopes' },
              { key: 'docRepo', label: 'Employee Document Repository', desc: 'Legacy employee file storage' },
              { key: 'email', label: 'Corporate Email Inboxes', desc: 'Restricted (High PII risk)' },
              { key: 'externalWeb', label: 'External Internet Web', desc: 'Prohibited in enterprise production' }
            ].map((ds) => {
              const isEnabled = dataSources[ds.key as keyof typeof dataSources];
              return (
                <div key={ds.key} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{ds.label}</span>
                      <button
                        onClick={() => toggleDataSource(ds.key as any)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono transition-colors ${
                          isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{ds.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-slate-800 block">PII & Residency Standards</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
              <div>PII Access: <strong className="text-slate-900">Restricted</strong></div>
              <div>Sensitive docs: <strong className="text-slate-900">Masked unless required</strong></div>
              <div>Data residency: <strong className="text-slate-900">United States</strong></div>
              <div>Retention: <strong className="text-slate-900">Per company policy</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Test Sandbox (Page 4 / Section 12 & 13) */}
      {activeTab === 'sandbox' && (
        <AgentSandbox />
      )}

      {/* TAB CONTENT: Version Control & Rollback (Page 8 / Section 22) */}
      {activeTab === 'versions' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Agent Versions & Rollback Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every release preserves an immutable snapshot with evaluated policy compatibility.
              </p>
            </div>

            <button
              onClick={() => setIsRollbackModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Rollback to v2.3</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {versions.map((ver) => (
              <div key={ver.version} className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-slate-900">{ver.version}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      ver.status === 'Production' ? 'bg-emerald-100 text-emerald-800' :
                      ver.status === 'Draft' ? 'bg-teal-100 text-teal-800' :
                      ver.status === 'Previous' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ver.status}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">Model: {ver.model}</span>
                  </div>

                  <p className="text-slate-600 text-xs">{ver.notes}</p>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
                    <span>Prompt: {ver.promptVersion}</span>
                    <span>·</span>
                    <span>Eval Score: <strong className="text-slate-700 font-semibold">{ver.evalScore}</strong></span>
                    <span>·</span>
                    <span>Released: {ver.releaseDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ver.status === 'Previous' && (
                    <button
                      onClick={() => setIsRollbackModalOpen(true)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"
                    >
                      Rollback
                    </button>
                  )}
                  {ver.status === 'Draft' && (
                    <button
                      onClick={() => setCurrentScreen('evals')}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs"
                    >
                      Promote to Evals
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Audit Log */}
      {activeTab === 'audit_log' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900">Agent Configuration Audit Log</h3>
          <div className="space-y-2 font-mono">
            {[
              { time: 'Today 10:54 AM', actor: 'Priya Sharma', action: 'KILL_SWITCH_STATUS_CHECK', detail: 'Verified emergency shutdown threshold rules' },
              { time: 'Oct 08, 2026', actor: 'Priya Sharma', action: 'POLICY_SCHEMA_UPDATE', detail: 'Associated Employment Verification Policy v4.2 with Compliance Agent v2.4' },
              { time: 'Oct 01, 2026', actor: 'HR AI Platform Team', action: 'AGENT_PROMOTED_PRODUCTION', detail: 'Compliance Agent v2.4 published after passing 100% Safety and 98.2% Regression Evals' }
            ].map((log, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-slate-500 mr-3">{log.time}</span>
                  <span className="font-bold text-teal-800 mr-2">{log.actor}</span>
                  <span className="text-slate-700">{log.detail}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-200 px-1.5 py-0.5 rounded">
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
