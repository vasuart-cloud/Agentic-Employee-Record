import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowNodeData } from '../../types';
import {
  Workflow,
  ArrowDown,
  UserCheck,
  FileCheck,
  Play,
  Copy,
  GitBranch
} from 'lucide-react';

export const AgentWorkflowBuilder: React.FC = () => {
  const {
    workflowNodes,
    setSelectedWorkflowNode,
    setIsWorkflowDrawerOpen,
    setCurrentScreen,
    can,
    notify
  } = useApp();

  const [activeNode, setActiveNode] = useState<WorkflowNodeData | undefined>(
    workflowNodes[2] || workflowNodes[0]
  );

  const canEditWorkflow = can('CREATE_DRAFT_RULE');

  const handleSelectNode = (node?: WorkflowNodeData) => {
    if (!node) return;
    setActiveNode(node);
    setSelectedWorkflowNode(node);
    setIsWorkflowDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Workflow Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded uppercase">
              VERSION v3.8 · DEMO SANDBOX
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">
              Last updated: 2026-11-12 · BioVanguard Health Systems
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Employee File Compliance Workflow
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bounded orchestration linking Workday delta ingestion, deterministic rule evaluation, human PSV/outreach gates, and demonstration event logging.
          </p>
        </div>

        {/* Governance Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={!canEditWorkflow.allowed}
            onClick={() => notify('Created draft revision v3.9-draft in Rule Builder.', 'info')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Create Draft
          </button>

          <button
            disabled={!canEditWorkflow.allowed}
            onClick={() => notify('Workflow cloned in Demo Sandbox.', 'info')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Clone</span>
          </button>

          <button
            onClick={() => {
              if (workflowNodes[2]) setSelectedWorkflowNode(workflowNodes[2]);
              setCurrentScreen('rule_builder');
            }}
            className="px-3 py-1.5 bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Open Rule Builder</span>
          </button>

          <button
            onClick={() => setCurrentScreen('rule_test_lab')}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Run Rule Test Lab
          </button>
        </div>
      </div>

      {/* Main Flowchart & Node Inspector Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Flowchart Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-teal-600" />
              <span>Execution Pipeline Graph (7 Governed Stages)</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Click any block to inspect inputs, boundaries &amp; failure behavior
            </span>
          </div>

          <div className="flex flex-col items-center space-y-3 py-4 max-w-lg mx-auto">
            {/* Step 1: Trigger */}
            <div
              onClick={() => handleSelectNode(workflowNodes[0])}
              className={`w-full p-3.5 rounded-xl border cursor-pointer transition-all shadow-xs text-center ${
                activeNode?.id === workflowNodes[0]?.id
                  ? 'border-teal-600 bg-teal-50/40'
                  : 'border-slate-300 bg-slate-50 hover:border-teal-500'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">EVENT TRIGGER</span>
              <div className="text-xs font-bold text-slate-900">
                {workflowNodes[0]?.title || '1. Workday Event / Daily Delta'}
              </div>
              <div className="text-[11px] text-slate-500">
                {workflowNodes[0]?.subtitle || 'Worker hire, transfer, or scheduled scan'}
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 2: Ingestion */}
            <div
              onClick={() => handleSelectNode(workflowNodes[1])}
              className={`w-full p-3.5 rounded-xl border cursor-pointer transition-all shadow-xs text-center ${
                activeNode?.id === workflowNodes[1]?.id
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-teal-300 bg-teal-50/50 hover:border-teal-600'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">UNTRUSTED DOCUMENT INGESTION</span>
              <div className="text-xs font-bold text-slate-900">
                {workflowNodes[1]?.title || '2. Ingestion & Classification'}
              </div>
              <div className="text-[11px] text-slate-600">
                {workflowNodes[1]?.subtitle || 'Indexes repositories; routes low confidence (<85%) to human review'}
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 3: Deterministic Rules */}
            <div
              onClick={() => handleSelectNode(workflowNodes[2])}
              className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all shadow-xs text-center ${
                activeNode?.id === workflowNodes[2]?.id
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-teal-400 bg-teal-50/30 hover:border-teal-600'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-teal-800 uppercase">DETERMINISTIC COMPLIANCE ENGINE</span>
              <div className="text-sm font-extrabold text-slate-900">
                {workflowNodes[2]?.title || '3. Deterministic Rule Evaluation'}
              </div>
              <div className="text-xs text-slate-600">
                {workflowNodes[2]?.subtitle || 'Applies versioned applicability & expiration rules'}
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Decision Branch */}
            <div className="w-full p-3.5 rounded-xl border border-amber-300 bg-amber-50/40 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase flex items-center justify-center gap-1">
                <GitBranch className="w-3 h-3 text-amber-700" />
                <span>POLICY &amp; VERIFICATION OUTCOME BRANCHING</span>
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
                <div className="p-1.5 rounded bg-white border border-emerald-300 text-emerald-800">
                  VERIFIED<br />
                  <span className="font-normal text-[10px] text-slate-500">→ Update Readiness</span>
                </div>
                <div className="p-1.5 rounded bg-white border border-amber-300 text-amber-800">
                  MISSING / EXPIRED<br />
                  <span className="font-normal text-[10px] text-slate-500">→ Draft Outreach</span>
                </div>
                <div className="p-1.5 rounded bg-white border-2 border-rose-300 text-rose-800">
                  RESTRICTED PSV<br />
                  <span className="font-normal text-[10px] text-slate-500">→ Clinical Escalation</span>
                </div>
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 4: Clinical Escalation + HR Outreach Gate */}
            <div
              onClick={() => handleSelectNode(workflowNodes[3])}
              className={`w-full p-3.5 rounded-xl border-2 cursor-pointer transition-all shadow-xs text-center ${
                activeNode?.id === workflowNodes[3]?.id
                  ? 'border-rose-600 bg-rose-50'
                  : 'border-rose-300 bg-rose-50/40 hover:border-rose-500'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-rose-800 uppercase flex items-center justify-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>HUMAN GATE 1 · OUTREACH &amp; ESCALATION</span>
              </span>
              <div className="text-xs font-bold text-slate-900">
                {workflowNodes[3]?.title || '4. Clinical Escalation + HR Outreach Gate'}
              </div>
              <div className="text-[11px] text-slate-600">
                {workflowNodes[3]?.subtitle || 'Maya approves outreach; Credentialing & clinical leadership alerted'}
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 5: Employee Portal Submission */}
            <div
              onClick={() => handleSelectNode(workflowNodes[4])}
              className={`w-full p-3.5 rounded-xl border cursor-pointer transition-all shadow-xs text-center ${
                activeNode?.id === workflowNodes[4]?.id
                  ? 'border-teal-600 bg-teal-50/40'
                  : 'border-slate-200 bg-white hover:border-teal-500'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">EMPLOYEE PORTAL</span>
              <div className="text-xs font-bold text-slate-900">
                {workflowNodes[4]?.title || '5. Employee Portal Submission'}
              </div>
              <div className="text-[11px] text-slate-600">
                {workflowNodes[4]?.subtitle || 'Upload received (never marks statutory license verified)'}
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 6: PSV Gate */}
            <div
              onClick={() => handleSelectNode(workflowNodes[5])}
              className={`w-full p-3.5 rounded-xl border-2 cursor-pointer transition-all shadow-xs text-center ${
                activeNode?.id === workflowNodes[5]?.id
                  ? 'border-rose-600 bg-rose-50'
                  : 'border-rose-300 bg-rose-50/40 hover:border-rose-500'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-rose-800 uppercase flex items-center justify-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>HUMAN GATE 2 · AUTHORITATIVE PSV</span>
              </span>
              <div className="text-xs font-bold text-slate-900">
                {workflowNodes[5]?.title || '6. Primary Source Verification (Alex)'}
              </div>
              <div className="text-[11px] text-slate-600">
                {workflowNodes[5]?.subtitle || 'Authoritative source check + designated leader clinical decision'}
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 7: Workday Staging & Event Log */}
            <div
              onClick={() => handleSelectNode(workflowNodes[6])}
              className={`w-full p-3.5 rounded-xl border cursor-pointer transition-all shadow-xs text-center ${
                activeNode?.id === workflowNodes[6]?.id
                  ? 'border-emerald-600 bg-emerald-100/60'
                  : 'border-emerald-400 bg-emerald-50 hover:border-emerald-600'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase flex items-center justify-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>READINESS &amp; STAGING WRITEBACK</span>
              </span>
              <div className="text-xs font-bold text-slate-900">
                {workflowNodes[6]?.title || '7. Whole-File Readiness & Workday Staging Sync'}
              </div>
              <div className="text-[11px] text-slate-600">
                Re-evaluates whole file, writes scoped staging ACK, and records Demonstration Event History (browser-local, not tamper-proof)
              </div>
            </div>
          </div>
        </div>

        {/* Right Node Configuration Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs h-fit">
          {activeNode ? (
            <>
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">NODE INSPECTOR</span>
                  <h3 className="text-sm font-bold text-slate-900">{activeNode.title}</h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {activeNode.id}
                </span>
              </div>

              <div className="space-y-3 font-mono">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase block font-sans">EXECUTION OWNER / ENGINE</span>
                  <span className="font-bold text-slate-900">
                    {activeNode.agent || 'Deterministic Rule / Event Engine'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase block font-sans">INPUT PAYLOAD</span>
                  <span className="text-slate-700">
                    {activeNode.inputs?.join(', ') || 'Worker Assignment & Indexed Document Metadata (PHI Excluded)'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase block font-sans">OUTPUT PAYLOAD</span>
                  <span className="text-slate-700">
                    {activeNode.outputs?.join(', ') || activeNode.subtitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[9px] uppercase block font-sans">TIMEOUT</span>
                    <span className="font-bold text-slate-800">{activeNode.timeout || '30 sec'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[9px] uppercase block font-sans">RETRY POLICY</span>
                    <span className="font-bold text-slate-800">{activeNode.retryPolicy || 'Idempotent retry'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-rose-50/50 border-rose-200 text-rose-900 font-sans">
                  <span className="text-[10px] font-bold uppercase block text-rose-700">HUMAN APPROVAL REQUIREMENT</span>
                  <span className="text-xs font-semibold">
                    {activeNode.humanApprovalRequired
                      ? 'REQUIRED (Mandatory Human Gate Enforced)'
                      : 'Bounded read / deterministic evaluation only'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
                  <span className="text-slate-400 text-[10px] uppercase block font-mono">FAILURE BEHAVIOR</span>
                  <span className="text-xs text-slate-700">
                    {activeNode.failureBehavior ||
                      'Route to HR / Credentialing exception queue; never auto-verify or overwrite Workday master fields.'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={!canEditWorkflow.allowed}
                  onClick={() => notify(`Saved node configuration for ${activeNode.title} in Demo Sandbox.`, 'success')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Save Node Parameters
                </button>
              </div>
            </>
          ) : (
            <div className="text-slate-500 text-center py-6">Select a workflow node to inspect parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

