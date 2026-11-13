import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, ShieldAlert, FileCheck2 } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditEvents, workers, currentScreen, openWorkerDossier, notify } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = auditEvents.filter((e) =>
    categoryFilter === 'ALL' ? true : e.category === categoryFilter
  );

  const exportCsv = () => {
    const header = ['eventId', 'timestamp', 'actor', 'actorRole', 'category', 'action', 'targetEntityId', 'details', 'integrityLabel'];
    const rows = filtered.map((e) =>
      [e.eventId, e.timestamp, e.actor, e.actorRole, e.category, e.action, e.targetEntityId, e.details, e.integrityLabel]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DEMO_Event_History_PHI_Excluded.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('Exported browser-local demo event history CSV (PHI excluded).', 'success');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {currentScreen === 'audit_packets'
              ? 'Evidence & Audit Packets'
              : 'Demonstration Event History'}
          </h1>
          <p className="text-slate-600 mt-1">
            Event timeline recorded locally in browser session storage for workflow inspection. Occupational health PHI is strictly excluded.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Demo Event CSV</span>
        </button>
      </div>

      {/* Honest Integrity Label */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
        <div>
          <strong>Demonstration Event History (browser-local, not tamper-proof):</strong>{' '}
          Production deployments require an append-only server-side audit store, cryptographic signing/WORM storage, and SSO user identity binding.
        </div>
      </div>

      {currentScreen === 'audit_packets' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="font-semibold text-slate-900 text-sm">
            Worker Evidence Packets (Select Worker Dossier to Export Full JSON Packet)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {workers.slice(0, 8).map((w) => (
              <button
                key={w.id}
                onClick={() => openWorkerDossier(w.id)}
                className="text-left p-3 rounded-lg border border-slate-200 hover:border-teal-600 hover:bg-teal-50/30 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-slate-900">{w.name}</div>
                  <div className="text-[11px] text-slate-500">{w.primaryRole}</div>
                </div>
                <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-slate-800 tabular-nums">
            Events ({filtered.length})
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter event category"
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs"
          >
            <option value="ALL">All Categories</option>
            <option value="CASE">CASE</option>
            <option value="OUTREACH">OUTREACH</option>
            <option value="EVIDENCE">EVIDENCE</option>
            <option value="PSV_CHECK">PSV_CHECK</option>
            <option value="CLINICAL_ELIGIBILITY">CLINICAL_ELIGIBILITY</option>
            <option value="POLICY">POLICY</option>
            <option value="WORKDAY_SYNC">WORKDAY_SYNC</option>
            <option value="KILL_SWITCH">KILL_SWITCH</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500 bg-slate-50/60">
                <th className="py-2 px-4">Timestamp</th>
                <th className="py-2 px-4">Actor &amp; Role</th>
                <th className="py-2 px-4">Category / Action</th>
                <th className="py-2 px-4">Target</th>
                <th className="py-2 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((evt) => (
                <tr key={evt.eventId}>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-900">{evt.actor}</div>
                    <div className="text-[11px] text-slate-500">{evt.actorRole}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-mono text-[11px] font-semibold text-teal-800">{evt.action}</div>
                    <div className="text-[10px] text-slate-500">{evt.category}</div>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-700">
                    {evt.targetEntityId}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 max-w-md">{evt.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
