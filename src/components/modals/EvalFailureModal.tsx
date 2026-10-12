import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, Play, UserCheck, Wrench, ArrowRight } from 'lucide-react';

export const EvalFailureModal: React.FC = () => {
  const { 
    selectedEvalCase, 
    isEvalModalOpen, 
    setIsEvalModalOpen 
  } = useApp();

  if (!isEvalModalOpen || !selectedEvalCase) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"
        onClick={() => setIsEvalModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col text-slate-800 text-xs">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-amber-800 uppercase">
                FAILED EVAL CASE INVESTIGATION
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {selectedEvalCase.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsEvalModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-700 block font-mono text-[10px] uppercase">TEST SCENARIO</span>
            <p className="text-slate-800 font-medium">{selectedEvalCase.scenario}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
              <span className="text-[10px] text-emerald-800 font-bold block font-sans">EXPECTED RESULT</span>
              <span className="font-bold text-emerald-900 text-sm">{selectedEvalCase.expected}</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
              <span className="text-[10px] text-amber-800 font-bold block font-sans">ACTUAL AGENT OUTPUT</span>
              <span className="font-bold text-amber-900 text-sm">{selectedEvalCase.actual}</span>
            </div>
          </div>

          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1">
            <span className="font-bold text-rose-800 font-mono text-[10px] uppercase block">DIFFERENCE / ROOT CAUSE</span>
            <p className="text-rose-950 leading-relaxed">{selectedEvalCase.difference}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-mono text-slate-700 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Policy Citation:</span>
              <span className="font-bold text-slate-900">{selectedEvalCase.policyUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Prompt Version:</span>
              <span className="font-bold text-slate-900">{selectedEvalCase.promptVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Owner Assigned:</span>
              <span className="font-bold text-teal-800">{selectedEvalCase.owner}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions (Section 15: Assign, Create Fix, Retest) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => setIsEvalModalOpen(false)}
            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Assigned to Compliance AI Team (Priya Sharma).')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign</span>
            </button>

            <button
              onClick={() => alert('Draft fix created: Updated prompt lookup table threshold.')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Create Fix</span>
            </button>

            <button
              onClick={() => {
                alert('Retesting case against draft candidate agent... PASSED!');
                setIsEvalModalOpen(false);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Retest Case</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
