import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationScreen, UserRoleId } from '../../types';
import { House, ClipboardList, Users, ShieldCheck, BookOpen, Database, Building2, TrendingUp, Calculator, BadgeCheck, FileCheck2, Settings2, ChevronDown, ChevronRight, X, ArrowRight } from 'lucide-react';

type MenuItem = { id: NavigationScreen; label: string; icon: React.ComponentType<{ className?: string }>; description?: string };

const simpleMenus: Record<UserRoleId, MenuItem[]> = {
  hr_ops_maya: [
    { id:'weekly_overview', label:'My work queue', icon:ClipboardList, description:'What needs action today' },
    { id:'compliance_cases', label:'Cases to resolve', icon:ShieldCheck, description:'Open issues & owners' },
    { id:'employees', label:'Employee records', icon:Users, description:'Evidence & verification' }
  ],
  admin_priya: [
    { id:'admin_onboarding',label:'Set up compliance',icon:ShieldCheck,description:'Start here · 5 guided steps' },
    { id:'policy_library',label:'Policies & rules',icon:BookOpen,description:'Sources, rules and test lab' },
    { id:'integrations',label:'Data connections',icon:Database,description:'Workday & repositories' }
  ],
  chro_david: [
    { id:'executive_overview',label:'Workforce overview',icon:Building2,description:'Readiness & risk' },
    { id:'risk_by_facility',label:'Risk by facility',icon:TrendingUp,description:'Where attention is needed' },
    { id:'business_value',label:'Business value',icon:Calculator,description:'Transparent pilot assumptions' }
  ],
  cred_alex: [
    { id:'credential_verification',label:'Verify credentials',icon:BadgeCheck,description:'Primary-source checks' },
    { id:'employees',label:'Employee dossiers',icon:Users,description:'Review evidence' },
    { id:'rule_versions',label:'Approve rules',icon:FileCheck2,description:'Independent sign-off' }
  ]
};

const advanced: Partial<Record<UserRoleId, MenuItem[]>> = {
  hr_ops_maya: [
    {id:'employee_requests',label:'Employee messages',icon:ClipboardList},
    {id:'audit_packets',label:'Audit packets',icon:FileCheck2},
    {id:'analytics',label:'Operations analytics',icon:TrendingUp},
    {id:'integrations',label:'Sync history',icon:Database}
  ],
  admin_priya: [
    {id:'rule_builder',label:'Detailed rule editor',icon:Settings2},
    {id:'rule_test_lab',label:'Test results',icon:ClipboardList},
    {id:'rule_versions',label:'Version history',icon:FileCheck2},
    {id:'credential_verification',label:'Credential queue',icon:BadgeCheck},
    {id:'ai_governance',label:'AI governance',icon:ShieldCheck},
    {id:'audit_access',label:'Audit & access',icon:FileCheck2}
  ],
  chro_david: [
    {id:'readiness_trends',label:'Readiness trends',icon:TrendingUp},
    {id:'pilot_scorecard',label:'Pilot scorecard',icon:ClipboardList}
  ],
  cred_alex: [
    {id:'compliance_cases',label:'Exceptions',icon:ShieldCheck},
    {id:'audit_packets',label:'Evidence packets',icon:FileCheck2}
  ]
};

export const Sidebar: React.FC = () => {
  const { activeRoleId, currentScreen, setCurrentScreen, isMobileSidebarOpen, setIsMobileSidebarOpen, currentPersona } = useApp();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = (id: NavigationScreen) => {setCurrentScreen(id);setIsMobileSidebarOpen(false);};
  const renderItem = (item: MenuItem, compact=false) => {
    const Icon = item.icon;
    const current = currentScreen === item.id || (item.id==='employees' && currentScreen==='employee_records');
    return (
      <button key={item.id} type="button" onClick={()=>navigate(item.id)} aria-current={current?'page':undefined}
        className={`w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-colors ${current?'bg-teal-50 border border-teal-200 text-teal-950':'hover:bg-slate-50 border border-transparent text-slate-700'}`}>
        <Icon className={`w-4 h-4 shrink-0 ${current?'text-teal-700':'text-slate-500'}`}/>
        <span className="min-w-0 flex-1">
          <span className={`block text-sm ${current?'font-semibold':'font-medium'}`}>{item.label}</span>
          {!compact && item.description && <span className="block text-[11px] text-slate-500 mt-0.5">{item.description}</span>}
        </span>
        {current && <ChevronRight className="w-4 h-4 text-teal-700 shrink-0"/>}
      </button>
    );
  };
  const nav=(
    <div className="bg-white h-full border-r border-slate-200 w-64 flex flex-col">
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Explore the product</div>
        <button className="lg:hidden text-slate-500" onClick={()=>setIsMobileSidebarOpen(false)} aria-label="Close navigation"><X className="w-5 h-5"/></button>
      </div>
      <div className="px-3 pt-3">
        <button onClick={()=>navigate('demo_home')} className={`w-full flex gap-2 items-center rounded-xl px-3 py-3 text-sm font-semibold ${currentScreen==='demo_home'?'bg-teal-700 text-white':'bg-slate-900 text-white hover:bg-slate-800'}`}>
          <House className="w-4 h-4"/> All 3 demo stories <ArrowRight className="w-4 h-4 ml-auto"/>
        </button>
      </div>
      <nav className="p-3 space-y-1 overflow-y-auto flex-1" aria-label="Main navigation">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">{currentPersona.roleLabel}</div>
        {simpleMenus[activeRoleId].map(item=>renderItem(item))}
        <div className="pt-4">
          <button onClick={()=>setShowAdvanced(v=>!v)} aria-expanded={showAdvanced}
            className="flex items-center w-full gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900">
            <Settings2 className="w-4 h-4"/>
            More tools
            <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${showAdvanced?'rotate-180':''}`}/>
          </button>
          {showAdvanced && <div className="space-y-1 pl-2">{(advanced[activeRoleId]||[]).map(item=>renderItem(item,true))}</div>}
        </div>
      </nav>
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-800">Synthetic demonstration</div>
        <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">Workday, licensing board and employee notifications use simulated adapters. No live employee data.</div>
      </div>
    </div>
  );
  return <>
    <aside className="hidden lg:block shrink-0 h-full">{nav}</aside>
    {isMobileSidebarOpen&&<div className="fixed inset-0 z-50 flex lg:hidden"><button aria-label="Dismiss navigation" onClick={()=>setIsMobileSidebarOpen(false)} className="absolute inset-0 bg-slate-950/60"/><div className="relative h-full">{nav}</div></div>}
  </>;
};
