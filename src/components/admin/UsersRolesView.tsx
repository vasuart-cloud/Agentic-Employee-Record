import React from 'react';
import { UserCheck, ShieldCheck, Lock, User, Plus } from 'lucide-react';

export const UsersRolesView: React.FC = () => {
  const users = [
    { name: 'Priya Sharma', role: 'HR Systems & Compliance Administrator', email: 'p.sharma@enterprise.com', status: 'Active', access: 'Full Admin & Agent Governance' },
    { name: 'Sarah Lee', role: 'HR Operations Lead', email: 's.lee@enterprise.com', status: 'Active', access: 'Review Queue & Gate 2 Approver' },
    { name: 'David Miller', role: 'VP People / CHRO', email: 'd.miller@enterprise.com', status: 'Active', access: 'Executive Insights & Audit Attestation' }
  ];

  return (
    <div className="space-y-6 pb-12 text-slate-800 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block mb-0.5">
            ROLE-BASED ACCESS CONTROL (RBAC)
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Users & Governance Roles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enforcing least privilege and dual-control approvals across HR AI agents.
          </p>
        </div>

        <button
          onClick={() => alert('Invite administrator user modal')}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Admin User</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
              <th className="py-3 px-4 font-bold">User Name</th>
              <th className="py-3 px-4 font-bold">Governance Role</th>
              <th className="py-3 px-4 font-bold">Access Scope</th>
              <th className="py-3 px-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{u.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                </td>
                <td className="py-3 px-4 text-slate-700 font-medium">
                  {u.role}
                </td>
                <td className="py-3 px-4 font-mono text-teal-800">
                  {u.access}
                </td>
                <td className="py-3 px-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
