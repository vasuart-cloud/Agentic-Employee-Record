import React from 'react';
import { useApp } from '../../context/AppContext';
import { USER_PERSONAS } from '../../data/mockData';
import { UserRoleId } from '../../types';
import { X, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const PersonaSwitcherModal: React.FC = () => {
  const {
    isWelcomeModalOpen,
    setIsWelcomeModalOpen,
    switchRole,
    setIsDemoGuideOpen
  } = useApp();

  if (!isWelcomeModalOpen) return null;

  const cards: { id: UserRoleId; highlight: string }[] = [
    {
      id: 'hr_ops_maya',
      highlight: 'Weekly work queue, employee outreach, ordinary evidence review & final closure'
    },
    {
      id: 'admin_priya',
      highlight: 'Policy library, applicability rules, executable test lab & Workday mappings'
    },
    {
      id: 'chro_david',
      highlight: 'Facility risk exposure, onboarding readiness & capacity-vs-cash value'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60"
        onClick={() => setIsWelcomeModalOpen(false)}
      />

      <div className="relative z-10 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-xs">
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-teal-800 font-semibold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>BioVanguard Health Systems · Synthetic Demo</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mt-1">
              Choose Your Perspective
            </h2>
            <p className="text-slate-600 mt-0.5">
              Demo data only — Workday HCM, employee portal delivery, and board verifications are simulated locally.
            </p>
          </div>
          <button
            onClick={() => setIsWelcomeModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Close persona chooser"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map(({ id, highlight }) => {
            const p = USER_PERSONAS[id];
            return (
              <button
                key={id}
                onClick={() => {
                  switchRole(id);
                  setIsWelcomeModalOpen(false);
                }}
                className="text-left p-4 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/30 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-[11px] font-medium text-teal-800">{p.roleLabel}</div>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{highlight}</p>
                </div>
                <div className="flex items-center justify-between text-teal-700 font-semibold pt-2 border-t border-slate-100">
                  <span>Enter Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              switchRole('cred_alex');
              setIsWelcomeModalOpen(false);
            }}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium"
          >
            <UserCheck className="w-4 h-4 text-slate-500" />
            <span>Supporting Reviewer: Switch to Alex Morgan (Credentialing / PSV &amp; Rule Sign-off)</span>
          </button>

          <button
            onClick={() => {
              setIsWelcomeModalOpen(false);
              setIsDemoGuideOpen(true);
            }}
            className="text-teal-700 hover:text-teal-800 font-semibold"
          >
            View demo scenarios →
          </button>
        </div>
      </div>
    </div>
  );
};
