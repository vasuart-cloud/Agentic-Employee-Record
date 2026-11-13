import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, House, RotateCcw, CircleCheck, Info } from 'lucide-react';
import { DemoScenarioId } from '../../types';

type StoryStep = {
  title: string;
  instruction: string;
  label: string;
  action: () => void;
};

export const GuidedStoryBar: React.FC = () => {
  const { activeScenarioId, currentScreen, setCurrentScreen, switchRole, openWorkerDossier, resetScenario } = useApp();
  const [stage, setStage] = useState(0);
  useEffect(() => { setStage(0); }, [activeScenarioId]);

  if (!activeScenarioId || currentScreen === 'demo_home') return null;

  const daniel = () => openWorkerDossier('EMP-10419','CASE-9021');
  const storySteps: Record<string, StoryStep[]> = {
    scenario_1_expired_pharmacist: [
      { title:'Find the issue', instruction:'Review Daniel Kim’s expired-license alert and open “Why Flagged?”', label:'Open Daniel’s record',
        action:()=>{switchRole('hr_ops_maya','employees');daniel();}},
      { title:'Collect new evidence', instruction:'Approve the simulated outreach, then open the employee portal and submit sample evidence.', label:'Open employee request',
        action:()=>{switchRole('hr_ops_maya','employees');daniel();}},
      { title:'Verify with Credentialing', instruction:'Alex performs a simulated licensing-board check. A document upload alone is never credential verification.', label:'Switch to Alex',
        action:()=>{switchRole('cred_alex','employees');daniel();}},
      { title:'Close and reconcile', instruction:'Return to Maya, close the verified case and inspect the simulated Workday staging sync. Check other outstanding requirements.', label:'Return to Maya',
        action:()=>{switchRole('hr_ops_maya','employees');daniel();}}
    ],
    scenario_5_priya_policy_publish: [
      { title:'Review the policy', instruction:'Follow the five-step setup wizard. Confirm the sample organization and policy source.', label:'Open admin setup',
        action:()=>switchRole('admin_priya','admin_onboarding')},
      { title:'Test and fix the rule', instruction:'Run the fixture test, enable out-of-state rejection, then rerun to see the new outcome.', label:'Open admin setup',
        action:()=>switchRole('admin_priya','admin_onboarding')},
      { title:'Independent approval', instruction:'Submit the passing rule, then switch to Alex to record the independent sign-off.', label:'Open approvals',
        action:()=>setCurrentScreen('rule_versions')}
    ],
    scenario_6_david_executive: [
      { title:'Understand exposure', instruction:'See open compliance risks and the difference between the sample cohort and enterprise context.', label:'Executive overview',
        action:()=>switchRole('chro_david','executive_overview')},
      { title:'Explore facility risks', instruction:'Compare facility risk and clinical exception exposure.', label:'Risk by facility',
        action:()=>switchRole('chro_david','risk_by_facility')},
      { title:'Evaluate the business case', instruction:'Open the business-value assumptions. Modeled capacity value is not automatically cash savings.', label:'Business value',
        action:()=>switchRole('chro_david','business_value')}
    ]
  };
  const steps=storySteps[activeScenarioId];
  if (!steps) return null;
  const active = Math.min(stage,steps.length-1);
  const current=steps[active];
  const names:Record<string,string>={
    scenario_1_expired_pharmacist:'Story 1 · Resolve an expired credential',
    scenario_5_priya_policy_publish:'Story 2 · Configure a compliance rule',
    scenario_6_david_executive:'Story 3 · Executive risk & value'
  };
  return (
    <div className="mb-5 bg-white border border-teal-200 shadow-sm rounded-xl p-4 sm:p-5 space-y-3" aria-label="Guided story progress">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-teal-800">{names[activeScenarioId]}</div>
        <div className="flex gap-2 items-center">
          <button onClick={()=>{resetScenario(activeScenarioId as DemoScenarioId);setStage(0);steps[0].action();}}
            className="text-xs text-slate-600 inline-flex gap-1 items-center hover:text-slate-900" title="Reset this story"><RotateCcw className="w-3.5 h-3.5"/> Reset</button>
          <button onClick={()=>setCurrentScreen('demo_home')} className="text-xs text-teal-700 font-semibold inline-flex gap-1 items-center hover:underline">
            <House className="w-3.5 h-3.5"/> All stories
          </button>
        </div>
      </div>
      <div className="flex gap-1.5">{steps.map((st,i)=><button key={st.title} aria-label={'Go to '+st.title}
        onClick={()=>{setStage(i);steps[i].action();}} title={st.title}
        className={`h-1.5 rounded-full flex-1 ${i<=active?'bg-teal-600':'bg-slate-200'}`}/>)}</div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-slate-900">{active+1}. {current.title}</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed"><Info className="w-3.5 h-3.5 inline mr-1"/>{current.instruction}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={current.action} className="rounded-lg border border-teal-200 bg-teal-50 text-teal-900 px-3 py-2 text-xs font-semibold whitespace-nowrap">{current.label}</button>
          {active<steps.length-1 ? <button onClick={()=>{setStage(active+1);steps[active+1].action();}}
            className="rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-3 py-2 text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap">
            Next <ArrowRight className="w-3.5 h-3.5"/></button> :
            <button onClick={()=>setCurrentScreen('demo_home')} className="rounded-lg bg-teal-700 text-white px-3 py-2 text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap">Finish <CircleCheck className="w-3.5 h-3.5"/></button>
          }
        </div>
      </div>
    </div>
  );
};
