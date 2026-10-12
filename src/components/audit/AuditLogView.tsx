import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck, 
  Search, 
  ShieldCheck, 
  Lock,
  Calendar,
  User,
  Hash
} from 'lucide-react';

interface AdminAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  details: string;
  hash: string;
}

export const AuditLogView: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const auditEvents: AdminAuditEvent[] = [
    {
      id: 'AUD-88219',
      timestamp: 'Today 10:54:12 UTC',
      actor: 'Priya Sharma',
      role: 'HR Systems & Compliance Admin',
      action: 'KILL_SWITCH_STATUS_CHECK',
      target: 'Compliance Agent v2.4',
      details: 'Inspected emergency kill switch configuration and tested confirmation gate parameters.',
      hash: 'sha256: 4f1a...8902'
    },
    {
      id: 'AUD-88218',
      timestamp: 'Today 10:42:18 UTC',
      actor: 'Compliance Agent v2.4',
      role: 'Autonomous Evaluator',
      action: 'EVALUATE_FILE',
      target: 'EMP-10482 (Maya Thompson)',
      details: 'Execution trace AGT-839218: flagged missing Form I-9 List C evidence with 94% confidence.',
      hash: 'sha256: 8f4b...3345'
    },
    {
      id: 'AUD-88217',
      timestamp: 'Oct 08, 2026 14:15 UTC',
      actor: 'Priya Sharma',
      role: 'HR Systems & Compliance Admin',
      action: 'WORKFLOW_CONFIG_UPDATE',
      target: 'Workflow v4.2',
      details: 'Published minor update to Document Classification timeout parameters (set to 60s).',
      hash: 'sha256: b718...42f1'
    },
    {
      id: 'AUD-88216',
      timestamp: 'Oct 01, 2026 09:00 UTC',
      actor: 'HR AI Platform Team',
      role: 'System Administrator',
      action: 'PROMOTE_PRODUCTION',
      target: 'Compliance Agent v2.4',
      details: 'Published version v2.4 after achieving 98.2% Regression Eval and 100% Safety Eval pass rates.',
      hash: 'sha256: 1204...349a'
    }
  ];

  const filteredEvents = auditEvents.filter(e => 
    e.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.actor.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.target.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.details.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest mb-0.5">
            APPEND-ONLY IMMUTABLE LEDGER
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System & Agent Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed timeline of all administrative actions, agent evaluations, and governance decisions.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-bold">
            TAMPER-EVIDENT RECORDING ACTIVE
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, or target ID..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="text-slate-500 text-[11px] font-mono">
          Showing {filteredEvents.length} cryptographic audit records
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase">
              <th className="py-3 px-4 font-bold font-sans">Timestamp</th>
              <th className="py-3 px-4 font-bold font-sans">Actor</th>
              <th className="py-3 px-4 font-bold font-sans">Action</th>
              <th className="py-3 px-4 font-bold font-sans">Target</th>
              <th className="py-3 px-4 font-bold font-sans">Details</th>
              <th className="py-3 px-4 font-bold font-sans text-right">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                  {evt.timestamp}
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-sans">
                  <span className="font-bold text-slate-900 block">{evt.actor}</span>
                  <span className="text-slate-400 text-[10px]">{evt.role}</span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold text-[10px]">
                    {evt.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-800 font-sans font-medium whitespace-nowrap">
                  {evt.target}
                </td>
                <td className="py-3 px-4 text-slate-600 font-sans leading-relaxed max-w-sm">
                  {evt.details}
                </td>
                <td className="py-3 px-4 text-right text-slate-400 text-[10px]">
                  {evt.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
