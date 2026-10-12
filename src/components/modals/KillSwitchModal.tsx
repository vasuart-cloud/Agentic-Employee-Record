import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, X, AlertTriangle, ShieldAlert } from 'lucide-react';

export const KillSwitchModal: React.FC = () => {
  const { 
    isKillSwitchModalOpen, 
    setIsKillSwitchModalOpen, 
    triggerKillSwitch 
  } = useApp();

  const [reason, setReason] = useState('Incorrect compliance decisions');
  const [typedConfirmation, setTypedConfirmation] = useState('');

  if (!isKillSwitchModalOpen) return null;

  const isConfirmed = typedConfirmation.trim() === 'STOP AGENT';

  const handleConfirm = () => {
    if (!isConfirmed) return;
    triggerKillSwitch(reason);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"
        onClick={() => setIsKillSwitchModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white border-2 border-rose-500 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col text-slate-800 text-xs">
        {/* Header */}
        <div className="p-5 border-b border-rose-100 flex items-start justify-between bg-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-rose-700 uppercase">
                EMERGENCY CIRCUIT BREAKER
              </div>
              <h2 className="text-lg font-bold text-rose-950">
                Stop Compliance Agent?
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsKillSwitchModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-2">
            <span className="font-bold block">This action immediately prevents:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>New compliance evaluations across all connected worker files</li>
              <li>New automated workflow actions and queue triggers</li>
              <li>New remediation task and outreach generation</li>
            </ul>
            <div className="text-[11px] text-slate-600 pt-1 border-t border-rose-200">
              Existing cases remain available in Workday and read-only HR queues.
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
              Select Shutdown Reason (Mandatory Audit Requirement)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
            >
              <option value="Unexpected AI behavior">Unexpected AI behavior</option>
              <option value="Incorrect compliance decisions">Incorrect compliance decisions</option>
              <option value="Security incident">Security incident</option>
              <option value="Data-quality issue">Data-quality issue</option>
              <option value="Integration problem">Integration problem</option>
              <option value="Other">Other compliance exception</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
              Type <strong className="text-rose-700 font-mono">STOP AGENT</strong> to confirm
            </label>
            <input
              type="text"
              placeholder="STOP AGENT"
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-rose-700 tracking-wider focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => setIsKillSwitchModalOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Confirm Emergency Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
