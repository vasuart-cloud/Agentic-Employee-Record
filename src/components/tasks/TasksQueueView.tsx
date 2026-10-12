import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Clock, 
  Send, 
  UserCheck, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TasksQueueView: React.FC = () => {
  const { setCurrentScreen, setSelectedAgentId } = useApp();

  const tasks = [
    { id: 'TSK-01', target: 'Maya Thompson (EMP-10482)', action: 'Request Form I-9 List C Evidence', sla: '3 business days', owner: 'Sarah Lee', status: 'Pending Human Approval (Gate 2)', agent: 'Remediation Agent' },
    { id: 'TSK-02', target: 'Daniel Kim (EMP-10419)', action: 'Request Licensure Renewal Certificate', sla: '7 business days', owner: 'Compliance AI Team', status: 'Awaiting Employee Upload', agent: 'Remediation Agent' },
    { id: 'TSK-03', target: 'Olivia Carter (EMP-10884)', action: 'Re-send DocuSign Handbook Envelope', sla: '5 business days', owner: 'HR Operations', status: 'Pending Human Approval (Gate 2)', agent: 'Remediation Agent' }
  ];

  return (
    <div className="space-y-6 pb-12 text-slate-800 text-xs">
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
          {tasks.map(t => (
            <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{t.target}</span>
                  <span className="text-[10px] font-mono text-slate-500">{t.id}</span>
                </div>
                <div className="text-slate-800 font-medium">{t.action}</div>
                <div className="text-slate-400 text-[11px] flex items-center gap-2 font-mono">
                  <span>SLA: {t.sla}</span>
                  <span>·</span>
                  <span>Owner: {t.owner}</span>
                  <span>·</span>
                  <span className="text-teal-700">{t.agent}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {t.status}
                </span>
                <button
                  onClick={() => {
                    setSelectedAgentId('remediation-agent');
                    setCurrentScreen('agent_detail');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs flex items-center gap-1"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
