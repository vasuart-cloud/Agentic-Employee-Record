import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationScreen } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  CheckSquare, 
  Cpu, 
  Workflow, 
  CheckCircle2, 
  Eye, 
  ShieldAlert, 
  BarChart3, 
  DollarSign, 
  FileText, 
  Network, 
  UserCheck, 
  Settings,
  AlertOctagon,
  Activity
} from 'lucide-react';

interface NavItem {
  id: NavigationScreen;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    currentEnvironment, 
    setCurrentEnvironment,
    killSwitchState 
  } = useApp();

  const isKilled = killSwitchState.isTriggered;

  const operationsNav: NavItem[] = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'employee_records', label: 'Employee Records', icon: Users, badge: '12.4K' },
    { id: 'compliance_cases', label: 'Compliance Cases', icon: AlertTriangle, badge: '43' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '7' },
  ];

  const aiControlNav: NavItem[] = [
    { id: 'agents', label: 'Agents', icon: Cpu, badge: '4 Active' },
    { id: 'agent_workflows', label: 'Agent Workflows', icon: Workflow },
    { id: 'evals', label: 'Evals', icon: CheckCircle2, badge: 'Pass' },
    { id: 'observability', label: 'Observability', icon: Eye },
    { id: 'guardrails', label: 'Guardrails', icon: ShieldAlert },
  ];

  const insightsNav: NavItem[] = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'business_value', label: 'Business Value', icon: DollarSign, badge: '$64K' },
    { id: 'audit_logs', label: 'Audit Logs', icon: FileText },
  ];

  const platformNav: NavItem[] = [
    { id: 'integrations', label: 'Integrations', icon: Network },
    { id: 'users_roles', label: 'Users & Roles', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-4">
      <div className="px-3 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || 
            (item.id === 'agents' && currentScreen === 'agent_detail');

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-bold border-l-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-1.5 ${
                  item.badge === 'Pass' ? 'bg-emerald-100 text-emerald-800 font-semibold' :
                  item.badge === '43' ? 'bg-rose-100 text-rose-800 font-semibold' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0 select-none h-full overflow-y-auto">
      <div className="p-3 pt-4">
        {renderNavGroup('OPERATIONS', operationsNav)}
        {renderNavGroup('AI CONTROL CENTER', aiControlNav)}
        {renderNavGroup('INSIGHTS', insightsNav)}
        {renderNavGroup('PLATFORM', platformNav)}
      </div>

      {/* Bottom Environment & Health Card */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="mb-2.5">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Environment
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-md text-[11px] font-semibold text-center">
            {(['Production', 'Staging', 'Sandbox'] as const).map((env) => (
              <button
                key={env}
                onClick={() => setCurrentEnvironment(env)}
                className={`py-1 rounded transition-colors ${
                  currentEnvironment === env
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {env.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>

        {/* System Status Indicator */}
        <div className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
          isKilled 
            ? 'bg-rose-50 border-rose-200 text-rose-800' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-1.5">
            {isKilled ? (
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            )}
            <span className="font-semibold text-[11px] truncate">
              {isKilled ? 'PAUSED — STOPPED' : 'System: Healthy'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">99.9%</span>
        </div>
      </div>
    </aside>
  );
};
