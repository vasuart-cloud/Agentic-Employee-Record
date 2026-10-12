import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const ComplianceQueueView: React.FC = () => {
  const { setCurrentScreen, setSelectedAgentId } = useApp();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');

  const cases = [
    { id: 'CASE-10482', employee: 'Maya Thompson', empId: 'EMP-10482', issue: 'Missing I-9 List C supporting document', severity: 'Critical', confidence: 94, owner: 'Sarah Lee', policy: 'Policy v4.2' },
    { id: 'CASE-10419', employee: 'Daniel Kim', empId: 'EMP-10419', issue: 'California Pharmacist License Expired', severity: 'High', confidence: 99, owner: 'Compliance AI Team', policy: 'Policy v3.8' },
    { id: 'CASE-10884', employee: 'Olivia Carter', empId: 'EMP-10884', issue: 'Annual Handbook signature missing', severity: 'Medium', confidence: 96, owner: 'HR Operations', policy: 'Policy v2.4' },
    { id: 'CASE-10312', employee: 'Marcus Vance', empId: 'EMP-10312', issue: 'GovCloud Tier-2 Public Trust Refresh', severity: 'High', confidence: 91, owner: 'Security Screening', policy: 'Policy v1.9' }
  ];

  const filtered = cases.filter(c => filter === 'All' || c.severity === filter);

  return (
    <div className="space-y-6 pb-12 text-slate-800 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest mb-0.5">
            CONTINUOUS EXCEPTION MANAGEMENT
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Compliance Cases & Exceptions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active compliance gaps identified across the multi-state workforce by the Compliance Agent.
          </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm">{c.employee}</span>
                <span className="text-[11px] font-mono text-slate-400 ml-2">({c.empId})</span>
                <div className="font-semibold text-slate-800 mt-1">{c.issue}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                c.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {c.severity}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] font-mono space-y-1">
              <div className="flex justify-between">
                <span>AI Confidence:</span>
                <span className="font-bold text-teal-700">{c.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span>Policy Citation:</span>
                <span className="text-slate-700">{c.policy}</span>
              </div>
              <div className="flex justify-between">
                <span>Owner Assigned:</span>
                <span className="text-slate-700 font-sans">{c.owner}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 text-[11px]">Surfaced by Compliance Agent v2.4</span>
              <button
                onClick={() => {
                  setSelectedAgentId('compliance-agent');
                  setCurrentScreen('agent_detail');
                }}
                className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
              >
                <span>Inspect Rule</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
