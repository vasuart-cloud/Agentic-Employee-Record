import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Eye, 
  Clock, 
  DollarSign, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TraceDetailModal: React.FC = () => {
  const { 
    isTraceModalOpen, 
    setIsTraceModalOpen, 
    selectedTrace 
  } = useApp();

  if (!isTraceModalOpen || !selectedTrace) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"
        onClick={() => setIsTraceModalOpen(false)}
      />

      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col text-slate-800 text-xs max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold font-mono">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-teal-700 uppercase">
                STRUCTURED SYSTEM REASONING & EXECUTION TRACE
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Agent Trace: {selectedTrace.id}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsTraceModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">AGENT & ACTION</span>
              <span className="font-bold text-slate-900">{selectedTrace.agentName}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">LATENCY / COST</span>
              <span className="font-bold text-teal-700">{selectedTrace.latencySec}s · ${selectedTrace.costUsd.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">TOKENS USED</span>
              <span className="font-bold text-slate-900">{selectedTrace.tokenCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">CALIBRATED CONFIDENCE</span>
              <span className="font-bold text-teal-700 font-mono">{selectedTrace.confidence}%</span>
            </div>
          </div>

          {/* Detailed 6-Step Execution Timeline (Section 18) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Execution Steps & Sub-Routine Latencies (Total: {selectedTrace.latencySec} sec)
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Zero Hidden Chain-of-Thought</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden font-mono">
              {selectedTrace.steps.map((st) => (
                <div key={st.stepNumber} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                      {st.stepNumber}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block font-sans">{st.name}</span>
                      <span className="text-[11px] text-slate-500 font-sans">{st.detail}</span>
                    </div>
                  </div>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                    {st.durationMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inputs & Outputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-800 text-[11px] uppercase block font-mono">INPUT ATTRIBUTES</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                {Object.entries(selectedTrace.inputs).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-bold text-slate-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-800 text-[11px] uppercase block font-mono">STRUCTURED OUTPUT</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                {Object.entries(selectedTrace.outputs).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model & System Metadata */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Model Version:</span>
              <span className="font-bold text-slate-900">{selectedTrace.modelVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Prompt Hash:</span>
              <span className="font-bold text-slate-900">{selectedTrace.promptVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Policy Citation:</span>
              <span className="font-bold text-teal-700">{selectedTrace.policyVersion}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px] text-slate-500 font-sans">
              <span>Sources Audited:</span>
              <span className="font-bold text-slate-700">{selectedTrace.sourcesAccessed.join(' · ')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsTraceModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
