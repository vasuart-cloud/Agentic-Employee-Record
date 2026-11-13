import React from 'react';
import { useApp } from '../../context/AppContext';
import { USER_PERSONAS } from '../../data/mockData';
import { UserRoleId } from '../../types';
import { Check, X, Shield, UserCheck } from 'lucide-react';

const MATRIX_ROWS: {
  capability: string;
  hr_ops_maya: boolean;
  admin_priya: boolean;
  cred_alex: boolean;
  chro_david: boolean;
}[] = [
  { capability: 'Triage weekly queue & send employee outreach', hr_ops_maya: true, admin_priya: false, cred_alex: false, chro_david: false },
  { capability: 'Review ordinary HR / LMS / Form I-9 evidence', hr_ops_maya: true, admin_priya: false, cred_alex: false, chro_david: false },
  { capability: 'Run Primary Source Verification (PSV) checks', hr_ops_maya: false, admin_priya: false, cred_alex: true, chro_david: false },
  { capability: 'Record Clinical Duty Eligibility decision', hr_ops_maya: false, admin_priya: false, cred_alex: true, chro_david: false },
  { capability: 'Close administrative case (after required PSV)', hr_ops_maya: true, admin_priya: false, cred_alex: false, chro_david: false },
  { capability: 'Author draft rules & run Test Lab', hr_ops_maya: false, admin_priya: true, cred_alex: false, chro_david: false },
  { capability: 'Approve & publish another author’s rule version', hr_ops_maya: false, admin_priya: false, cred_alex: true, chro_david: false },
  { capability: 'Trigger Workday staging sync / retry', hr_ops_maya: true, admin_priya: true, cred_alex: false, chro_david: false },
  { capability: 'View raw Occupational Health medical PHI', hr_ops_maya: false, admin_priya: false, cred_alex: false, chro_david: false },
  { capability: 'View aggregate executive readiness & ROI', hr_ops_maya: false, admin_priya: false, cred_alex: false, chro_david: true }
];

export const UsersRolesView: React.FC = () => {
  const { activeRoleId, switchRole } = useApp();
  const roleOrder: UserRoleId[] = ['hr_ops_maya', 'admin_priya', 'cred_alex', 'chro_david'];

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Simulated Access Boundaries &amp; Separation of Duties
        </h1>
        <p className="text-slate-600 mt-1">
          Simulated browser persona control (Demo Mode). Production deployments require enterprise SSO (SAML/OIDC) and server-side RBAC enforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleOrder.map((rId) => {
          const p = USER_PERSONAS[rId];
          const isCurrent = activeRoleId === rId;
          return (
            <div
              key={rId}
              className={`bg-white border rounded-xl p-4 flex flex-col justify-between gap-3 ${
                isCurrent ? 'border-teal-700 bg-teal-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                  {p.isSupportingDemoRole && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      Supporting Role
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-medium text-teal-800">{p.roleLabel}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{p.description}</p>
              </div>
              <button
                onClick={() => switchRole(rId)}
                disabled={isCurrent}
                className={`w-full py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-teal-700 text-white'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isCurrent ? 'Active Persona' : `Switch to ${p.name}`}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center gap-2 font-semibold text-slate-900">
          <Shield className="w-4 h-4 text-teal-700" />
          <span>Enforced Permission Matrix</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase text-slate-500">
                <th className="py-2.5 px-4">Capability</th>
                <th className="py-2.5 px-4 text-center">Maya (HR Ops)</th>
                <th className="py-2.5 px-4 text-center">Priya (Admin)</th>
                <th className="py-2.5 px-4 text-center">Alex (Credentialing)</th>
                <th className="py-2.5 px-4 text-center">David (CHRO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MATRIX_ROWS.map((row) => (
                <tr key={row.capability}>
                  <td className="py-2.5 px-4 font-medium text-slate-800">{row.capability}</td>
                  {(['hr_ops_maya', 'admin_priya', 'cred_alex', 'chro_david'] as const).map((r) => (
                    <td key={r} className="py-2.5 px-4 text-center">
                      {row[r] ? (
                        <Check className="w-4 h-4 text-emerald-700 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
