import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationScreen, UserRoleId } from '../../types';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  FileCheck2,
  BarChart3,
  BookOpen,
  Sliders,
  FlaskConical,
  GitBranch,
  BadgeCheck,
  Bot,
  Database,
  Shield,
  Building2,
  MapPin,
  TrendingUp,
  Calculator,
  ClipboardCheck,
  X
} from 'lucide-react';

interface NavItem {
  id: NavigationScreen;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeRoleId,
    currentScreen,
    setCurrentScreen,
    computedMetrics,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    organization
  } = useApp();

  const menusByRole: Record<UserRoleId, { sectionLabel: string; items: NavItem[] }[]> = {
    hr_ops_maya: [
      {
        sectionLabel: 'HR Operations',
        items: [
          { id: 'weekly_overview', label: 'Weekly Work Queue', icon: LayoutDashboard },
          { id: 'employees', label: 'Employees & Credentials', icon: Users },
          {
            id: 'compliance_cases',
            label: 'Cases & Escalations',
            icon: AlertTriangle,
            badge: computedMetrics.openCasesCount
          },
          {
            id: 'employee_requests',
            label: 'Employee Requests',
            icon: MessageSquare,
            badge: computedMetrics.awaitingEmployeeCount
          },
          { id: 'tasks', label: 'Tasks & Follow-ups', icon: CheckSquare },
          { id: 'audit_packets', label: 'Evidence & Audit Packets', icon: FileCheck2 },
          { id: 'analytics', label: 'Operations Analytics', icon: BarChart3 }
        ]
      }
    ],
    admin_priya: [
      {
        sectionLabel: 'Policy & Rule Governance',
        items: [
          { id: 'policy_library', label: 'Policy Library', icon: BookOpen },
          { id: 'rule_builder', label: 'Rule Builder', icon: Sliders },
          { id: 'rule_test_lab', label: 'Test Lab', icon: FlaskConical },
          { id: 'rule_versions', label: 'Rule Versions & Approvals', icon: GitBranch }
        ]
      },
      {
        sectionLabel: 'Verification & Platform',
        items: [
          {
            id: 'credential_verification',
            label: 'Credential Verification',
            icon: BadgeCheck,
            badge: computedMetrics.pendingPSVCount
          },
          { id: 'ai_governance', label: 'AI Governance', icon: Bot },
          {
            id: 'integrations',
            label: 'Integrations & Data Mapping',
            icon: Database,
            badge: computedMetrics.syncFailedCount
          },
          { id: 'audit_access', label: 'Audit & Access', icon: Shield }
        ]
      }
    ],
    chro_david: [
      {
        sectionLabel: 'Executive Insights',
        items: [
          { id: 'executive_overview', label: 'Executive Overview', icon: Building2 },
          { id: 'risk_by_facility', label: 'Risk by Facility', icon: MapPin },
          { id: 'readiness_trends', label: 'Readiness Trends', icon: TrendingUp },
          { id: 'business_value', label: 'Business Value', icon: Calculator },
          { id: 'pilot_scorecard', label: 'Pilot Scorecard', icon: ClipboardCheck }
        ]
      }
    ],
    cred_alex: [
      {
        sectionLabel: 'Credentialing & Approvals',
        items: [
          {
            id: 'credential_verification',
            label: 'Credential Verification Queue',
            icon: BadgeCheck,
            badge: computedMetrics.pendingPSVCount
          },
          {
            id: 'compliance_cases',
            label: 'Cases & Escalations',
            icon: AlertTriangle,
            badge: computedMetrics.clinicalEscalationsPending
          },
          { id: 'employees', label: 'Employees & Credentials', icon: Users },
          { id: 'rule_versions', label: 'Pending Rule Sign-Off', icon: GitBranch },
          { id: 'audit_packets', label: 'Evidence & Audit Packets', icon: FileCheck2 }
        ]
      }
    ]
  };

  const sections = menusByRole[activeRoleId] || menusByRole.hr_ops_maya;

  const isItemActive = (itemId: NavigationScreen) => {
    if (currentScreen === itemId) return true;
    if (itemId === 'employees' && currentScreen === 'employee_records') return true;
    if (itemId === 'audit_access' && (currentScreen === 'audit_logs' || currentScreen === 'users_roles'))
      return true;
    if (
      itemId === 'ai_governance' &&
      ['command_center', 'agents', 'agent_detail', 'agent_workflows', 'evals', 'observability', 'guardrails'].includes(
        currentScreen
      )
    )
      return true;
    return false;
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 shrink-0">
      <div className="lg:hidden px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900">Navigation</span>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-1 text-slate-500 hover:text-slate-700"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.sectionLabel}>
            <div className="px-2.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.sectionLabel}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentScreen(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200/80'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active ? 'text-teal-700' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded tabular-nums ${
                          active
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Honest Simulated Environment Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 text-[11px] space-y-1.5">
        <div className="font-semibold text-slate-800">Simulated Demo Environment</div>
        <div className="text-slate-600 leading-relaxed">
          Sample: <span className="font-mono font-semibold tabular-nums">{computedMetrics.sampleWorkersCount}</span> workers ·{' '}
          <span className="font-mono font-semibold tabular-nums">{computedMetrics.totalApplicableRequirements}</span> requirements.
          Enterprise context: {organization.enterpriseHeadcountContext.toLocaleString()}.
        </div>
        <div className="text-[10px] text-slate-500">
          Workday &amp; licensing board adapters are simulated in browser.
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block h-full shrink-0">{navContent}</aside>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full">{navContent}</div>
        </div>
      )}
    </>
  );
};
