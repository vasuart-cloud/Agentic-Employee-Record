import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck, 
  Search, 
  ShieldCheck, 
  Lock,
  Calendar,
  User,
  Hash,
  Download
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditEvents } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredEvents = auditEvents.filter(e => {
    if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        e.action.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        e.targetEntityId.toLowerCase().includes(q) ||
        e.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Actor,Role,Action,Category,Target,Details,SHA256_Hash\n';
    const rows = filteredEvents.map(e => 
      `"${e.id}","${e.timestamp}","${e.actor}","${e.actorRole}","${e.action}","${e.category}","${e.targetEntityId}","${e.details.replace(/"/g, '""')}","${e.hashSha256}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agentic_Records_Audit_Trail_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 text-xs text-slate-800 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest mb-0.5">
            APPEND-ONLY IMMUTABLE AUDIT TRAIL
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System, Policy & Decision Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed timeline of all administrative actions, agent evaluations, human approvals, and HRMS syncs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>Export Audit Trail (CSV)</span>
          </button>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-bold">
            SHA-256 SEALED
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search action, actor, or target ID..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="POLICY">Policy & Rules</option>
            <option value="CASE">Compliance Cases</option>
            <option value="OUTREACH">Outreach</option>
            <option value="EVIDENCE">Evidence Submissions</option>
            <option value="HRMS_SYNC">HRMS Sync</option>
            <option value="KILL_SWITCH">Kill Switch</option>
          </select>
        </div>

        <div className="text-slate-500 text-[11px] font-mono">
          Showing {filteredEvents.length} cryptographic audit records
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-mono">
              <th className="py-2.5 px-4 font-bold">Timestamp</th>
              <th className="py-2.5 px-4 font-bold">Actor</th>
              <th className="py-2.5 px-4 font-bold">Action</th>
              <th className="py-2.5 px-4 font-bold">Target</th>
              <th className="py-2.5 px-4 font-bold">Details</th>
              <th className="py-2.5 px-4 font-bold text-right">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                  {evt.timestamp}
                </td>
                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span className="font-bold text-slate-900 block">{evt.actor}</span>
                  <span className="text-slate-400 text-[10px]">{evt.actorRole}</span>
                </td>
                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span className="text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold font-mono text-[10px]">
                    {evt.action}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-800 font-mono text-[11px] whitespace-nowrap">
                  {evt.targetEntityId}
                </td>
                <td className="py-2.5 px-4 text-slate-600 leading-relaxed max-w-md">
                  {evt.details}
                </td>
                <td className="py-2.5 px-4 text-right text-slate-400 text-[10px] font-mono">
                  {evt.hashSha256.slice(0, 12)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
