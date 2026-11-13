import React from 'react';
import { useApp } from '../../context/AppContext';
import { AgentTrace } from '../../types';
import {
  Eye,
  AlertTriangle,
  AlertOctagon,
  History
} from 'lucide-react';
import { HERO_AGENT_TRACE, PRODUCTION_EXCEPTIONS } from '../../data/mockData';

export const ObservabilityView: React.FC = () => {
  const {
    traces,
    auditEvents,
    syncTransactions,
    setSelectedTrace,
    setIsTraceModalOpen,
    setIsKillSwitchModalOpen,
    can,
    notify
  } = useApp();

  const killAuth = can('TRIGGER_KILL_SWITCH');
  const failedSyncsCount = syncTransactions.filter((t) => t.status === 'FAILED').length;

  const handleRowClick = (trace: AgentTrace) => {
    setSelectedTrace(trace);
    setIsTraceModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Observability Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest">
              EXECUTION TRACES &amp; BENCHMARK TELEMETRY
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
              Illustrative Synthetic Benchmark + Live Session Events
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Agent Observability
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect modeled agent execution steps, policy citations, latency breakdowns, and live session actions.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTrace(HERO_AGENT_TRACE);
            setIsTraceModalOpen(true);
          }}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect Hero Trace ({HERO_AGENT_TRACE.id})</span>
        </button>
      </div>

      {/* Top Metrics Cards (Illustrative Benchmark + Live Session Counters) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Runs (30d Model)</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">148.5K</div>
          <div className="text-[11px] text-slate-500 mt-1">Synthetic benchmark</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Rule Match Rate</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">96.8%</div>
          <div className="text-[11px] text-slate-500 mt-1">Modeled baseline</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Sync Failures (Live)</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${failedSyncsCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {failedSyncsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Workday staging queue</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Session Events (Live)</div>
          <div className="text-2xl font-bold text-teal-800 font-mono mt-1">{auditEvents.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Local browser log</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Median Latency (Model)</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">1.9 sec</div>
          <div className="text-[11px] text-slate-500 mt-1">P95: 2.8 sec</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Monthly AI Cost (Model)</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">$1,842</div>
          <div className="text-[10px] text-slate-500 mt-1">$0.012 / run modeled</div>
        </div>
      </div>

      {/* SECTION 18: AGENT TRACE TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Sample Agent Invocations &amp; Execution Traces</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any trace row to inspect system execution steps, repositories searched, latency breakdown, and policy versions.
            </p>
          </div>
          <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Simulated Demo Traces
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-mono uppercase">
                <th className="py-2.5 px-4 font-bold">Timestamp</th>
                <th className="py-2.5 px-4 font-bold">Agent</th>
                <th className="py-2.5 px-4 font-bold">Employee Record</th>
                <th className="py-2.5 px-4 font-bold">Action Executed</th>
                <th className="py-2.5 px-4 font-bold">Latency</th>
                <th className="py-2.5 px-4 font-bold">Tokens</th>
                <th className="py-2.5 px-4 font-bold">Cost</th>
                <th className="py-2.5 px-4 font-bold">Outcome</th>
                <th className="py-2.5 px-4 font-bold">Confidence</th>
                <th className="py-2.5 px-4 font-bold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {traces.map((tr) => (
                <tr
                  key={tr.id}
                  onClick={() => handleRowClick(tr)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-slate-500">{tr.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-teal-800 font-sans">{tr.agentName}</td>
                  <td className="py-3 px-4 font-sans text-slate-800">
                    <span className="font-semibold block">{tr.employeeName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{tr.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">{tr.action}</td>
                  <td className="py-3 px-4 text-slate-700">{tr.latencySec}s</td>
                  <td className="py-3 px-4 text-slate-700">{tr.tokenCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-700">${tr.costUsd.toFixed(3)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        tr.outcome === 'Flag'
                          ? 'bg-rose-100 text-rose-800'
                          : tr.outcome === 'Escalate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tr.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-700">{tr.confidence}%</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(tr);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs font-sans"
                    >
                      View Trace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Session Events Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Recent Session Actions (Live In-Browser Feed)</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Latest 6 events</span>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {auditEvents.slice(0, 6).map((evt) => (
            <div key={evt.eventId} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-teal-800">{evt.action}</span>
                <span className="text-slate-400 mx-1.5">·</span>
                <span className="text-slate-700">{evt.details}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 shrink-0">
                {evt.actor} · {evt.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 19: ERROR & EXCEPTION MONITORING */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Modeled Exception Categories</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Illustrative enterprise anomaly distribution routing low-confidence or board exceptions to human queues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!killAuth.allowed) {
                  notify(killAuth.reason, 'error');
                  return;
                }
                setIsKillSwitchModalOpen(true);
              }}
              disabled={!killAuth.allowed}
              title={killAuth.allowed ? 'Open Emergency Kill Switch' : killAuth.reason}
              className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 disabled:opacity-45 disabled:cursor-not-allowed font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency Kill Switch</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRODUCTION_EXCEPTIONS.map((exc, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-mono truncate" title={exc.type}>
                {exc.type}
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">{exc.count}</div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200">
                <span className={`font-bold ${exc.severity === 'Critical' ? 'text-rose-700' : 'text-slate-600'}`}>
                  {exc.severity}
                </span>
                <span className="text-slate-500 font-mono">{exc.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
