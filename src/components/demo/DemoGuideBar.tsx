import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronRight, 
  RotateCcw, 
  Play, 
  ShieldCheck, 
  Cpu, 
  Workflow, 
  CheckCircle2, 
  Eye, 
  ShieldAlert, 
  AlertOctagon, 
  BarChart3, 
  DollarSign,
  TestTube
} from 'lucide-react';

export const DemoGuideBar: React.FC = () => {
  const { demoStep, jumpToDemoStep, resetDemoState } = useApp();

  const demoSteps = [
    { num: 1, label: '1. Command Center', sub: 'Governed workforce' },
    { num: 2, label: '2. Business Value', sub: '$64.2K/mo saved' },
    { num: 3, label: '3. Compliance Agent', sub: 'Level-2 Autonomy' },
    { num: 4, label: '4. Workflow Graph', sub: 'Approval gates' },
    { num: 5, label: '5. Pre-prod Evals', sub: 'Regression & Safety' },
    { num: 6, label: '6. Test Sandbox', sub: 'Maya I-9 Scenario' },
    { num: 7, label: '7. Observability', sub: 'Trace AGT-839218' },
    { num: 8, label: '8. Guardrails', sub: 'Zero unapproved comms' },
    { num: 9, label: '9. Kill Switch', sub: 'Immediate safety stop' },
    { num: 10, label: '10. Analytics', sub: '91% Audit-ready North Star' }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">6-Min CEO Demo Flow</span>
          <span className="text-slate-400 text-[10px] hidden md:inline">· Priya Sharma Admin Story</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {demoSteps.map((s, idx) => {
            const isCurrent = demoStep === s.num;
            const isCompleted = demoStep > s.num;

            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => jumpToDemoStep(s.num)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all whitespace-nowrap ${
                    isCurrent 
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' 
                      : isCompleted 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                  }`}
                  title={`${s.label}: ${s.sub}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono ${
                    isCurrent ? 'bg-slate-950 text-teal-300 font-bold' : isCompleted ? 'bg-slate-800 text-teal-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {s.num}
                  </span>
                  <span className="text-[11px]">{s.label.split('. ')[1]}</span>
                </button>

                {idx < demoSteps.length - 1 && (
                  <ChevronRight className="w-2.5 h-2.5 text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-slate-800">
        <button
          onClick={resetDemoState}
          className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded text-[11px] transition-colors"
          title="Reset demonstration state"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
