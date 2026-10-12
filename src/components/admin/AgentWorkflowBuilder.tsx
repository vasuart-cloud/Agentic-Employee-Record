import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowNodeData } from '../../types';
import { 
  Workflow, 
  ArrowDown, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Play, 
  Copy, 
  Sliders, 
  X,
  Lock,
  GitBranch
} from 'lucide-react';

export const AgentWorkflowBuilder: React.FC = () => {
  const { 
    workflowNodes, 
    selectedWorkflowNode, 
    setSelectedWorkflowNode,
    isWorkflowDrawerOpen,
    setIsWorkflowDrawerOpen,
    setCurrentScreen 
  } = useApp();

  const [activeNode, setActiveNode] = useState<WorkflowNodeData>(workflowNodes[3]); // default Compliance Agent node

  const handleSelectNode = (node: WorkflowNodeData) => {
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
              VERSION v4.2 · PRODUCTION
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">Last modified: Oct 8, 2026 by HR AI Platform</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Employee File Compliance Workflow
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Governed orchestration linking Ingestion, Compliance checks, Human Approval gates, and Audit sealing.
          </p>
        </div>

        {/* Governance Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => alert('Created draft revision v4.3 in Sandbox.')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Create Draft
          </button>

          <button
            onClick={() => alert('Workflow cloned to Staging environment.')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Clone</span>
          </button>

          <button
            onClick={() => {
              setSelectedWorkflowNode(workflowNodes[3]);
              setCurrentScreen('agent_detail');
            }}
            className="px-3 py-1.5 bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Workflow</span>
          </button>

          <button
            onClick={() => setCurrentScreen('evals')}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Run Evals
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
              <span>Execution Pipeline Graph</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Click any block to inspect runtime inputs, outputs & timeouts
            </span>
          </div>

          {/* Visual Nodes Sequence */}
          <div className="flex flex-col items-center space-y-3 py-4 max-w-lg mx-auto">
            {/* Step 1: Trigger */}
            <div 
              onClick={() => handleSelectNode(workflowNodes[0])}
              className="w-full p-3.5 rounded-xl border border-slate-300 bg-slate-50 hover:border-teal-500 cursor-pointer transition-all shadow-xs text-center"
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">EVENT TRIGGER</span>
              <div className="text-xs font-bold text-slate-900">Employee Created / Updated</div>
              <div className="text-[11px] text-slate-500">Workday HCM Webhook / Scheduled 15m Sync</div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 2: Ingestion Agent */}
            <div 
              onClick={() => handleSelectNode(workflowNodes[1])}
              className="w-full p-3.5 rounded-xl border border-teal-300 bg-teal-50/50 hover:border-teal-600 cursor-pointer transition-all shadow-xs text-center"
            >
              <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">AGENT INVOCATION</span>
              <div className="text-xs font-bold text-slate-900">Ingestion Agent v2.4</div>
              <div className="text-[11px] text-slate-600">Scan Workday, SharePoint, DocuSign for Employee IDs</div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 3: Classification */}
            <div 
              onClick={() => handleSelectNode(workflowNodes[2])}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-500 cursor-pointer transition-all shadow-xs text-center"
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">DETERMINISTIC EXTRACTION</span>
              <div className="text-xs font-bold text-slate-900">Document Classification & NER</div>
              <div className="text-[11px] text-slate-500">Extract issue date, expiration, and tax metadata</div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 4: Compliance Agent */}
            <div 
              onClick={() => handleSelectNode(workflowNodes[3])}
              className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all shadow-xs text-center ${
                activeNode.id === 'node-4' ? 'border-teal-600 bg-teal-50' : 'border-teal-400 bg-teal-50/30 hover:border-teal-600'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-teal-800 uppercase">CORE REASONING AGENT</span>
              <div className="text-sm font-extrabold text-slate-900">Compliance Agent v2.4</div>
              <div className="text-xs text-slate-600">Evaluate against Employment Verification Policy v4.2</div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 5: Decision Branch */}
            <div className="w-full p-3.5 rounded-xl border border-amber-300 bg-amber-50/40 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase flex items-center justify-center gap-1">
                <GitBranch className="w-3 h-3 text-amber-700" />
                <span>DECISION & POLICY OUTCOME BRANCHING</span>
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
                <div className="p-1.5 rounded bg-white border border-emerald-300 text-emerald-800">
                  COMPLIANT<br/>
                  <span className="font-normal text-[10px] text-slate-500">→ Mark Complete</span>
                </div>
                <div className="p-1.5 rounded bg-white border border-amber-300 text-amber-800">
                  NEEDS ATTN<br/>
                  <span className="font-normal text-[10px] text-slate-500">→ HR Task</span>
                </div>
                <div className="p-1.5 rounded bg-white border-2 border-rose-300 text-rose-800">
                  MISSING EVIDENCE<br/>
                  <span className="font-normal text-[10px] text-slate-500">→ Remediation</span>
                </div>
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 6: Remediation Agent */}
            <div 
              onClick={() => handleSelectNode(workflowNodes[5])}
              className="w-full p-3.5 rounded-xl border border-teal-300 bg-teal-50/50 hover:border-teal-600 cursor-pointer transition-all shadow-xs text-center"
            >
              <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">AGENT INVOCATION</span>
              <div className="text-xs font-bold text-slate-900">Remediation Agent</div>
              <div className="text-[11px] text-slate-600">Recommend action & generate draft outreach</div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 7: Human Approval Gate (Gate 2) */}
            <div 
              onClick={() => handleSelectNode(workflowNodes[6])}
              className="w-full p-3.5 rounded-xl border-2 border-rose-400 bg-rose-50/50 hover:border-rose-600 cursor-pointer transition-all shadow-xs text-center"
            >
              <span className="text-[10px] font-mono font-bold text-rose-800 uppercase flex items-center justify-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>HUMAN-IN-THE-LOOP APPROVAL (GATE 2)</span>
              </span>
              <div className="text-xs font-bold text-slate-900">HR Operations Specialist Review</div>
              <div className="text-[11px] text-slate-600">Mandatory sign-off prior to employee notification dispatch</div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400" />

            {/* Step 8 & 9 & 10: Loop closure to Audit */}
            <div 
              onClick={() => handleSelectNode(workflowNodes[11])}
              className="w-full p-3.5 rounded-xl border border-emerald-400 bg-emerald-50 hover:border-emerald-600 cursor-pointer transition-all shadow-xs text-center"
            >
              <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase flex items-center justify-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>DEFENSIBLE PROOF LEDGER</span>
              </span>
              <div className="text-xs font-bold text-slate-900">Audit Record Sealed</div>
              <div className="text-[11px] text-slate-600">Immutable SHA256 audit dossier package compiled</div>
            </div>
          </div>
        </div>

        {/* Right Node Configuration Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">NODE INSPECTOR</span>
              <h3 className="text-sm font-bold text-slate-900">
                {activeNode.title}
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              {activeNode.id}
            </span>
          </div>

          <div className="space-y-3 font-mono">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">AGENT EXECUTABLE</span>
              <span className="font-bold text-slate-900">{activeNode.agent || 'Deterministic Rule / Event Engine'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">INPUT PAYLOAD</span>
              <span className="text-slate-700">{activeNode.inputs?.join(', ') || 'Worker Metadata from Workday'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">OUTPUT PAYLOAD</span>
              <span className="text-slate-700">{activeNode.outputs?.join(', ') || 'Compliance Finding & Remediation'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[9px] uppercase block font-sans">TIMEOUT</span>
                <span className="font-bold text-slate-800">{activeNode.timeout || '30 sec'}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[9px] uppercase block font-sans">RETRY POLICY</span>
                <span className="font-bold text-slate-800">{activeNode.retryPolicy || '2 retries'}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-rose-50/50 border-rose-200 text-rose-900 font-sans">
              <span className="text-[10px] font-bold uppercase block text-rose-700">HUMAN APPROVAL REQUIREMENT</span>
              <span className="text-xs font-semibold">
                {activeNode.humanApprovalRequired ? 'REQUIRED (Gate 2 Human-in-the-Loop Enforced)' : 'Not required for read/classification steps'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
              <span className="text-slate-400 text-[10px] uppercase block font-mono">FAILURE BEHAVIOR</span>
              <span className="text-xs text-slate-700">
                {activeNode.failureBehavior || 'Route to HR review queue; never guess worker identity.'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert(`Saved configuration changes for ${activeNode.title}.`)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Save Node Parameters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
