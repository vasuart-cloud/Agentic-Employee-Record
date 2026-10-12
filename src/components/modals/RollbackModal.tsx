import React from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

export const RollbackModal: React.FC = () => {
  const { 
    isRollbackModalOpen, 
    setIsRollbackModalOpen, 
    rollbackToVersion 
  } = useApp();

  if (!isRollbackModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"
        onClick={() => setIsRollbackModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col text-slate-800 text-xs">
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-slate-900">
              Confirm Rollback to Version v2.3?
            </h2>
          </div>
          <button
            onClick={() => setIsRollbackModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-slate-700 leading-relaxed">
            This will immediately demote <strong>Compliance Agent v2.4</strong> and activate <strong>Version v2.3</strong> as the production baseline across all connected employee files.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-600 space-y-1">
            <div>Target Version: <strong className="text-slate-900">v2.3 (Tested & Certified)</strong></div>
            <div>Model: <strong className="text-slate-900">gemini-1.5-pro-governed-enterprise</strong></div>
            <div>Approved by: <strong className="text-teal-800">Priya Sharma</strong></div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => setIsRollbackModalOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => rollbackToVersion('v2.3')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Confirm Rollback</span>
          </button>
        </div>
      </div>
    </div>
  );
};
