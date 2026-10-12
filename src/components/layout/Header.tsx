import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Server, 
  AlertOctagon,
  ChevronDown,
  UserCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    currentEnvironment, 
    setCurrentEnvironment,
    currentUser,
    killSwitchState
  } = useApp();

  const isKilled = killSwitchState.isTriggered;

  return (
    <header className="relative bg-white border-b border-slate-200 text-slate-800 z-30 select-none">
      <div className="px-6 py-2.5 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setCurrentScreen('command_center')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:border-teal-500 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                Agentic Employee Records
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                ADMIN CONSOLE
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setCurrentScreen('command_center')}
            className={`py-1 transition-colors ${
              currentScreen === 'command_center'
                ? 'text-teal-700 font-bold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Command Center
          </button>

          <button
            onClick={() => setCurrentScreen('agents')}
            className={`py-1 transition-colors ${
              currentScreen === 'agents' || currentScreen === 'agent_detail'
                ? 'text-teal-700 font-bold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Agents
          </button>

          <button
            onClick={() => setCurrentScreen('agent_workflows')}
            className={`py-1 transition-colors ${
              currentScreen === 'agent_workflows'
                ? 'text-teal-700 font-bold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Workflows
          </button>

          <button
            onClick={() => setCurrentScreen('evals')}
            className={`py-1 transition-colors ${
              currentScreen === 'evals'
                ? 'text-teal-700 font-bold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Evals & Gates
          </button>

          <button
            onClick={() => setCurrentScreen('observability')}
            className={`py-1 transition-colors ${
              currentScreen === 'observability'
                ? 'text-teal-700 font-bold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Observability
          </button>

          <button
            onClick={() => setCurrentScreen('business_value')}
            className={`py-1 transition-colors ${
              currentScreen === 'business_value'
                ? 'text-teal-700 font-bold border-b-2 border-teal-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Business Value
          </button>
        </nav>

        {/* Zone 3: Environment selector + System Alert Pill + User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Environment Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={currentEnvironment}
              onChange={(e) => setCurrentEnvironment(e.target.value as any)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Sandbox">Sandbox</option>
            </select>
          </div>

          {/* Kill Switch Live Alert if Active */}
          {isKilled && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>EMERGENCY STOP ACTIVE</span>
            </div>
          )}

          {/* Admin User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-slate-300"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                HR Compliance Admin
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
