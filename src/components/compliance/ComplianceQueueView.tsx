import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';

export const ComplianceQueueView: React.FC = () => {
  const { complianceCases, setSelectedEmployeeId, setSelectedCaseId, setCurrentScreen } = useApp();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const [search, setSearch] = useState('');

  const filtered = complianceCases.filter(c => {
    if (filter !== 'All' && c.severity !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.employeeName.toLowerCase().includes(q) ||
        c.employeeId.toLowerCase().includes(q) ||
        c.documentType.toLowerCase().includes(q) ||
        c.findingSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 text-slate-800 text-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest mb-0.5">
            CONTINUOUS EXCEPTION MANAGEMENT
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Compliance Cases & Exceptions Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active compliance gaps identified across the multi-state workforce by the Compliance Agent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exceptions..."
              className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            {(['All', 'Critical', 'High', 'Medium'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded transition-colors ${
                  filter === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => {
          const isResolved = c.status === 'GREEN_RESOLVED';
          const isAmber = c.status.startsWith('AMBER');

          return (
            <div 
              key={c.id} 
              onClick={() => {
                setSelectedEmployeeId(c.employeeId);
                setSelectedCaseId(c.id);
                setCurrentScreen('employee_records');
              }}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 cursor-pointer hover:border-teal-500 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{c.employeeName}</span>
                    <span className="text-[11px] font-mono text-slate-400">({c.employeeId})</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">{c.documentType}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{c.findingSummary}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                    c.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 
                    c.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {c.severity}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Confidence:</span>
                  <span className="font-bold text-teal-700">{c.detailedWhy.agentConfidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Policy Citation:</span>
                  <span className="text-slate-700">{c.detailedWhy.policyVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remediation Status:</span>
                  <span className={`font-semibold ${
                    isResolved ? 'text-emerald-700' : isAmber ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {isResolved ? 'Verified Complete' : isAmber ? 'In Remediation' : 'Action Required'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 text-[11px]">Due: {c.dueDate} ({c.slaStatus})</span>
                <span className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1">
                  <span>Open Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
