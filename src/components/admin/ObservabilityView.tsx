import React from 'react';
import { useApp } from '../../context/AppContext';
import { AgentTrace } from '../../types';
import { 
  Eye, 
  Activity, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Cpu, 
  ChevronRight, 
  AlertOctagon, 
  FileText,
  TrendingDown,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { HERO_AGENT_TRACE, PRODUCTION_EXCEPTIONS } from '../../data/mockData';

export const ObservabilityView: React.FC = () => {
  const { 
    traces, 
    setSelectedTrace, 
    setIsTraceModalOpen, 
    setIsKillSwitchModalOpen 
  } = useApp();

  const handleRowClick = (trace: AgentTrace) => {
    setSelectedTrace(trace);
    setIsTraceModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Observability Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block mb-0.5">
            PRODUCTION TELEMETRY & EXECUTION TRACES
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Agent Observability
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand what every agent is doing in production. Monitor latency, tokens, cost, confidence and exceptions.
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
          <span>Inspect Hero Trace (AGT-839218)</span>
        </button>
      </div>

      {/* Top Metrics Cards (Section 17) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Agent Runs</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">148.5K</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+18% MoM</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Success Rate</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">96.8%</div>
          <div className="text-[11px] text-slate-500 mt-1">Rule validated</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Errors</div>
          <div className="text-2xl font-bold text-slate-700 font-mono mt-1">1.4%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Within SLA</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Human Escalations</div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1">7.2%</div>
          <div className="text-[11px] text-slate-500 mt-1">Low-conf routing</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Median Latency</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">1.9 sec</div>
          <div className="text-[11px] text-slate-500 mt-1">P95: 2.8 sec</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Monthly AI Cost</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">$1,842</div>
          <div className="text-[10px] text-slate-500 mt-1">$0.012 / run avg</div>
        </div>
      </div>

      {/* SECTION 18: AGENT TRACE TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Live Agent Invocations & Execution Traces</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any trace row to inspect system execution steps, documents searched, latency breakdown, and policy versions.
            </p>
          </div>
          <span className="text-xs text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
            Real-Time Stream
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
                  <td className="py-3 px-4 text-slate-500">
                    {tr.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-800 font-sans">
                    {tr.agentName}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-800">
                    <span className="font-semibold block">{tr.employeeName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{tr.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">
                    {tr.action}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {tr.latencySec}s
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {tr.tokenCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    ${tr.costUsd.toFixed(3)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      tr.outcome === 'Flag' ? 'bg-rose-100 text-rose-800' :
                      tr.outcome === 'Escalate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tr.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-700">
                    {tr.confidence}%
                  </td>
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

      {/* SECTION 19: ERROR & EXCEPTION MONITORING */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Production Exceptions & Anomalies</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated anomaly triage routing issues before they impact employee file completeness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsKillSwitchModalOpen(true)}
              className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
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
              <div className="text-xl font-bold font-mono text-slate-900">
                {exc.count}
              </div>
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
