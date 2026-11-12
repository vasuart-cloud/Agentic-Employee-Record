import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRoleId } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  X,
  FileCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export const PersonaSwitcherModal: React.FC = () => {
  const { 
    isWelcomeModalOpen, 
    setIsWelcomeModalOpen, 
    activeRoleId, 
    switchRole 
  } = useApp();

  if (!isWelcomeModalOpen) return null;

  const personas = [
    {
      id: 'hr_ops_maya' as UserRoleId,
      name: 'Maya',
      title: 'HR Operations Manager',
      companyRole: 'HR Operations Group (Frontline Exceptions)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
      badge: 'Hero Workflow Persona',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      tagline: 'Reviews weekly exceptions, reviews "Why Flagged?", sends outreach, verifies evidence, and closes compliance cases.',
      features: [
        'Weekly exception work queue (Daniel Kim hero case)',
        'Explainable AI evidence side drawer with policy citations',
        'Approve AI-drafted outreach to simulated employee portal',
        'Human-in-the-loop review & closure (Red → Amber → Green)',
        'Automatic Workday HRMS metadata writeback'
      ],
      ctaLabel: 'Enter as Maya (HR Operations)'
    },
    {
      id: 'admin_priya' as UserRoleId,
      name: 'Priya Sharma',
      title: 'HR Systems & Compliance Administrator',
      companyRole: 'Office of Medical Compliance & HR AI Systems',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
      badge: 'Compliance & Governance',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      tagline: 'Configures compliance policies, tests rule accuracy in the sandbox, publishes versions, and manages HRMS connectors.',
      features: [
        'Multi-step compliance onboarding wizard',
        'Rule Test Lab with 10 fixtures & confusion matrix',
        'Dual-approver simulated release gate before publish',
        'HRMS & Integrations hub (Workday, SharePoint, DocuSign)',
        'Emergency Kill Switch & Agent Autonomy controls'
      ],
      ctaLabel: 'Enter as Priya (Compliance Admin)'
    },
    {
      id: 'chro_david' as UserRoleId,
      name: 'David Miller',
      title: 'VP People / CHRO',
      companyRole: 'Executive Leadership (Read-Only)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      badge: 'Executive & Board',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      tagline: 'Monitors North Star audit-readiness metrics, labor hours saved, and defensible audit packages.',
      features: [
        'North Star: % of files continuously audit-ready within SLA',
        'Dynamic ROI calculator with editable pilot assumptions',
        'Before/after case resolution comparison for Daniel Kim',
        'Defensible audit trail export'
      ],
      ctaLabel: 'Enter as David (Executive CHRO)'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full p-6 text-left my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Interactive SaaS Prototype
              </span>
              <span className="text-xs text-slate-400 font-medium">· Role-Based Experience</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome to Agentic Employee Records
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              “Your HCM knows who works here. Agentic Employee Records makes every employee file complete, explainable and defensible — continuously.”
            </p>
          </div>
          <button 
            onClick={() => setIsWelcomeModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {personas.map((p) => {
            const isCurrent = activeRoleId === p.id;
            return (
              <div 
                key={p.id}
                className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                  isCurrent 
                    ? 'border-teal-500 bg-teal-50/40 shadow-sm ring-1 ring-teal-500' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-teal-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={p.avatar} 
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">
                        {p.name}
                      </h4>
                      <div className="text-[11px] font-medium text-slate-600 leading-tight">
                        {p.title}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {p.tagline}
                  </p>

                  {/* Features list */}
                  <div className="space-y-1.5 mb-5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 leading-tight">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Switch Button */}
                <button
                  onClick={() => {
                    switchRole(p.id);
                    setIsWelcomeModalOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-teal-700 text-white shadow-xs hover:bg-teal-800'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <span>{isCurrent ? 'Continue as ' + p.name.split(' ')[0] : p.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Note on Hero Workflow */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Hero Interactive Journey:</strong> Daniel Kim (EMP-10419) has an expired California Pharmacist license. Work the case as Maya or manage policies as Priya.
            </span>
          </div>
          <button
            onClick={() => {
              switchRole('hr_ops_maya');
              setIsWelcomeModalOpen(false);
            }}
            className="text-teal-700 font-bold hover:underline shrink-0 ml-3"
          >
            Start with Daniel Kim →
          </button>
        </div>
      </div>
    </div>
  );
};
