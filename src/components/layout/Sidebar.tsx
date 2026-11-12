import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationScreen } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  CheckSquare, 
  Mail, 
  FileCheck, 
  BarChart3, 
  DollarSign, 
  ListChecks, 
  FileText, 
  FlaskConical, 
  GitBranch, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  Eye, 
  ShieldAlert, 
  FileSpreadsheet, 
  Network, 
  UserCheck, 
  Settings,
  AlertOctagon,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: NavigationScreen;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'default' | 'danger' | 'warning' | 'success';
}

export const Sidebar: React.FC = () => {
  const { 
    activeRoleId, 
    currentScreen, 
    setCurrentScreen, 
    currentEnvironment, 
    setCurrentEnvironment, 
    killSwitchState,
    computedMetrics,
    connectors
  } = useApp();

  const isKilled = killSwitchState.isTriggered;
  const connectedCount = connectors.filter(c => c.status === 'Connected').length;

  // Maya's Operations Nav Items
  const hrOpsNav: { title: string; items: NavItem[] }[] = [
    {
      title: 'OPERATIONS',
      items: [
        { 
          id: 'weekly_overview', 
          label: 'Weekly Overview', 
          icon: LayoutDashboard,
          badge: computedMetrics.openCasesCount > 0 ? `${computedMetrics.openCasesCount}` : undefined,
          badgeVariant: 'warning'
        },
        { 
          id: 'employees', 
          label: 'Employees', 
          icon: Users,
          badge: `${computedMetrics.totalMonitored}`
        },
        { 
          id: 'compliance_cases', 
          label: 'Compliance Cases', 
          icon: AlertTriangle,
          badge: computedMetrics.criticalCasesCount > 0 ? `${computedMetrics.criticalCasesCount} Critical` : undefined,
          badgeVariant: 'danger'
        },
        { 
          id: 'tasks', 
          label: 'Remediation Tasks', 
          icon: CheckSquare,
          badge: '1'
        },
        { 
          id: 'messages', 
          label: 'Employee Requests', 
          icon: Mail
        },
        { 
          id: 'audit_packets', 
          label: 'Audit Packets', 
          icon: FileCheck 
        }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Operational Analytics', icon: BarChart3 },
        { 
          id: 'business_value', 
          label: 'Business Value', 
          icon: DollarSign,
          badge: `${computedMetrics.totalMinutesSaved}m saved`,
          badgeVariant: 'success'
        }
      ]
    }
  ];

  // Priya's Compliance Admin Nav Items
  const adminNav: { title: string; items: NavItem[] }[] = [
    {
      title: 'COMPLIANCE & RULES',
      items: [
        { id: 'setup_checklist', label: 'Setup Checklist', icon: ListChecks },
        { id: 'policies_rules', label: 'Policies & Rules', icon: FileText, badge: '3 Policies' },
        { id: 'rule_test_lab', label: 'Rule Test Lab', icon: FlaskConical, badge: 'Sandbox' },
        { id: 'rule_versions', label: 'Rule Versions & Gates', icon: GitBranch }
      ]
    },
    {
      title: 'AI CONTROL CENTER',
      items: [
        { id: 'agents', label: 'AI Agents', icon: Cpu, badge: '4 Active' },
        { id: 'agent_workflows', label: 'Agent Workflows', icon: Workflow },
        { id: 'evals', label: 'Evals & Gates', icon: ShieldCheck, badge: 'Pass', badgeVariant: 'success' },
        { id: 'observability', label: 'Observability & Traces', icon: Eye },
        { id: 'guardrails', label: 'Guardrails & Safety', icon: ShieldAlert }
      ]
    },
    {
      title: 'PLATFORM',
      items: [
        { 
          id: 'integrations', 
          label: 'HRMS & Integrations', 
          icon: Network, 
          badge: `${connectedCount} Live`,
          badgeVariant: 'success'
        },
        { id: 'users_roles', label: 'Users & Roles', icon: UserCheck },
        { id: 'audit_logs', label: 'Audit Logs', icon: FileSpreadsheet },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  // David's Executive Nav Items
  const executiveNav: { title: string; items: NavItem[] }[] = [
    {
      title: 'EXECUTIVE SUITE',
      items: [
        { id: 'executive_overview', label: 'Executive Overview', icon: ShieldCheck },
        { 
          id: 'business_value', 
          label: 'Business Value & ROI', 
          icon: DollarSign,
          badge: `${computedMetrics.northStarAuditReadyPercent}% Ready`,
          badgeVariant: 'success'
        },
        { id: 'analytics', label: 'Audit SLA Trends', icon: BarChart3 }
      ]
    }
  ];

  const currentNavGroups = activeRoleId === 'admin_priya' 
    ? adminNav 
    : activeRoleId === 'chro_david' 
    ? executiveNav 
    : hrOpsNav;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none h-full overflow-y-auto">
      <div className="p-3 pt-4 space-y-5">
        {currentNavGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id || 
                  (item.id === 'employees' && currentScreen === 'employee_records') ||
                  (item.id === 'agents' && currentScreen === 'agent_detail');

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-bold border-l-2 border-teal-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1.5 ${
                        item.badgeVariant === 'danger' ? 'bg-rose-100 text-rose-800 font-semibold' :
                        item.badgeVariant === 'warning' ? 'bg-amber-100 text-amber-800 font-semibold' :
                        item.badgeVariant === 'success' ? 'bg-emerald-100 text-emerald-800 font-semibold' :
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
        ))}
      </div>

      {/* Bottom Environment & Health Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Environment</span>
            <span className="text-teal-700 font-semibold">{currentEnvironment}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-0.5 rounded-md text-[11px] font-semibold text-center">
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

        {/* System Status / Kill Switch Status */}
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
              {isKilled ? 'PAUSED — STOPPED' : 'Agents: Governed'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">99.8%</span>
        </div>
      </div>
    </aside>
  );
};
