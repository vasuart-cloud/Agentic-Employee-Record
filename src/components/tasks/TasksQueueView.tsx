import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Clock, 
  Send, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const TasksQueueView: React.FC = () => {
  const { 
    remediationTasks, 
    setCurrentScreen, 
    setSelectedEmployeeId, 
    setSelectedCaseId 
  } = useApp();

  return (
    <div className="space-y-6 pb-12 text-slate-800 text-xs text-left">
      <div className="border-b border-slate-200 pb-4">
        <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest mb-0.5">
          HUMAN-IN-THE-LOOP WORKFLOW QUEUE
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Remediation & Approval Tasks
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tasks prepared by the Remediation Agent awaiting HR Operations review, dispatch, or resolution.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-900">Active Remediation Tasks</span>
          <span className="text-teal-800 font-mono text-[11px] font-bold">Enforcing Gate 2 Human Approval</span>
        </div>

        <div className="divide-y divide-slate-100">
          {remediationTasks.map(t => {
            const isCompleted = t.status === 'COMPLETED';
            const isSent = t.status === 'APPROVED_SENT';

            return (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{t.employeeName}</span>
                    <span className="text-[10px] font-mono text-slate-500">({t.employeeId})</span>
                    <span className="text-[10px] font-mono text-slate-400">· {t.id}</span>
                  </div>
                  <div className="text-slate-800 font-medium">{t.title}</div>
                  <div className="text-slate-500 text-[11px]">{t.actionRequired}</div>
                  <div className="text-slate-400 text-[10px] flex items-center gap-2 font-mono pt-1">
                    <span>Deadline: {t.deadlineDate}</span>
                    <span>·</span>
                    <span>Channel: {t.channel}</span>
                    <span>·</span>
                    <span className="text-teal-700">Remediation Agent v2.4</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800' :
                    isSent ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {isCompleted ? 'Completed & Verified' :
                     isSent ? 'Awaiting Employee Response' :
                     'Draft (Needs HR Review)'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedEmployeeId(t.employeeId);
                      setSelectedCaseId(t.caseId);
                      setCurrentScreen('employee_records');
                    }}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>{isCompleted ? 'View Dossier' : 'Work Task in Dossier'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
