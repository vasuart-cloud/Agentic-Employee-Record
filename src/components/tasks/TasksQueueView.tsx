import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, CheckSquare, ArrowRight, Send, Smartphone } from 'lucide-react';

export const TasksQueueView: React.FC = () => {
  const {
    currentScreen,
    tasks,
    threads,
    cases,
    openWorkerDossier,
    setSelectedWorkerId,
    setSelectedCaseId,
    setIsEmployeePortalOpen
  } = useApp();

  const isRequestsView = currentScreen === 'employee_requests';
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const filteredTasks = tasks.filter((t) =>
    statusFilter === 'ALL' ? true : t.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {isRequestsView ? 'Employee Requests & Portal Threads' : 'Tasks & Follow-ups'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {isRequestsView
              ? 'Track simulated portal outreach, employee replies, and Workday reconciliation flags.'
              : 'Follow-up tasks, 30/60/90-day license renewal reminders, and credentialing handoffs.'}
          </p>
        </div>

        {!isRequestsView && (
          <div className="flex items-center gap-1.5 text-xs">
            {(['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium ${
                  statusFilter === st
                    ? 'bg-teal-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {isRequestsView ? (
        <div className="space-y-4">
          {threads.map((th) => {
            const linkedCase = cases.find((c) => c.id === th.caseId);
            return (
              <div key={th.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-teal-700" />
                      <span className="font-semibold text-slate-900 text-sm">{th.subject}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Case {linkedCase?.caseNumber || th.caseId} · Worker: {linkedCase?.workerName || th.workerId} · Status:{' '}
                      <strong>{linkedCase?.workflowState.replace(/_/g, ' ')}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedWorkerId(th.workerId);
                        setSelectedCaseId(th.caseId);
                        setIsEmployeePortalOpen(true);
                        openWorkerDossier(th.workerId, th.caseId);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-teal-700 text-teal-800 hover:bg-teal-50 font-semibold flex items-center gap-1"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Simulate Reply</span>
                    </button>
                    <button
                      onClick={() => openWorkerDossier(th.workerId, th.caseId)}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1"
                    >
                      <span>Open Case</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {th.messages.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-800">{m.senderName}</span>
                        <span>{m.timestamp} · {m.deliveryStatus}</span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-line">{m.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold text-slate-900">{t.title}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {t.status}
                  </span>
                </div>
                <p className="text-slate-600">{t.actionRequired}</p>
                <div className="text-[11px] text-slate-500">
                  Worker: <strong>{t.workerName}</strong> · Owner: {t.ownerLabel} · Due:{' '}
                  <span className="font-mono">{t.dueDate}</span>
                  {t.reminderWindowDays && ` · ${t.reminderWindowDays}d renewal window`}
                </div>
              </div>

              <button
                onClick={() => openWorkerDossier(t.workerId, t.caseId)}
                className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in Dossier</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
