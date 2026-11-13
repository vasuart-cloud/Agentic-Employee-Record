import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PersonaSwitcherModal } from './components/common/PersonaSwitcherModal';
import { DemoGuideModal } from './components/common/DemoGuideModal';
import { ToastContainer } from './components/common/ToastContainer';

// Operational & Credentialing Views
import { WeeklyOperationsDashboard } from './components/dashboard/WeeklyOperationsDashboard';
import { EmployeeDossier } from './components/dossier/EmployeeDossier';
import { ComplianceQueueView } from './components/compliance/ComplianceQueueView';
import { CredentialVerificationQueue } from './components/compliance/CredentialVerificationQueue';
import { TasksQueueView } from './components/tasks/TasksQueueView';

// Admin Views
import { ComplianceSetupWizard } from './components/admin/ComplianceSetupWizard';
import { AIGovernanceHub } from './components/admin/AIGovernanceHub';
import { CommandCenter } from './components/admin/CommandCenter';
import { AgentDetailPage } from './components/admin/AgentDetailPage';
import { AgentWorkflowBuilder } from './components/admin/AgentWorkflowBuilder';
import { AgentEvalsView } from './components/admin/AgentEvalsView';
import { ObservabilityView } from './components/admin/ObservabilityView';
import { GuardrailsView } from './components/admin/GuardrailsView';
import { BusinessValueView } from './components/admin/BusinessValueView';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { UsersRolesView } from './components/admin/UsersRolesView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { AuditLogView } from './components/audit/AuditLogView';

// Executive Views
import { ExecutiveOverview } from './components/executive/ExecutiveOverview';

// Modals
import { KillSwitchModal } from './components/modals/KillSwitchModal';
import { TraceDetailModal } from './components/modals/TraceDetailModal';
import { EvalFailureModal } from './components/modals/EvalFailureModal';
import { RollbackModal } from './components/modals/RollbackModal';
import { UserRoleId } from './types';
import { Lock } from 'lucide-react';

const RoleRestrictedView: React.FC<{ requiredRole: string; targetRoleKey: UserRoleId }> = ({
  requiredRole,
  targetRoleKey
}) => {
  const { switchRole } = useApp();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-xl mx-auto my-12 text-center shadow-xs space-y-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-600">
        <Lock className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Role-Restricted Governance Screen
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
          This screen belongs to <strong>{requiredRole}</strong>. Switch perspectives below to test this workflow.
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={() => switchRole(targetRoleKey)}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors"
        >
          Switch to {requiredRole}
        </button>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentScreen, activeRoleId } = useApp();
  const isPriya = activeRoleId === 'admin_priya';
  const isAlex = activeRoleId === 'cred_alex';

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
        {/* Maya / Operations & Shared Dossier Routes */}
        {currentScreen === 'weekly_overview' && <WeeklyOperationsDashboard />}
        {(currentScreen === 'employees' || currentScreen === 'employee_records') && <EmployeeDossier />}
        {currentScreen === 'compliance_cases' && <ComplianceQueueView />}
        {(currentScreen === 'tasks' || currentScreen === 'employee_requests') && <TasksQueueView />}
        {currentScreen === 'audit_packets' && <AuditLogView />}
        {currentScreen === 'analytics' && <AnalyticsView />}

        {/* Credentialing Queue (Alex + Read-only Admin view for Priya) */}
        {currentScreen === 'credential_verification' && <CredentialVerificationQueue />}

        {/* Priya Policy & Rule Governance Routes */}
        {(currentScreen === 'policy_library' ||
          currentScreen === 'rule_builder' ||
          currentScreen === 'rule_test_lab') &&
          (isPriya ? (
            <ComplianceSetupWizard />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}

        {currentScreen === 'rule_versions' &&
          (isPriya || isAlex ? (
            <ComplianceSetupWizard />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma or Alex Morgan (Approver)"
              targetRoleKey="admin_priya"
            />
          ))}

        {/* AI Governance & Admin Subviews (Priya Only) */}
        {currentScreen === 'ai_governance' &&
          (isPriya ? (
            <AIGovernanceHub />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {currentScreen === 'command_center' &&
          (isPriya ? (
            <CommandCenter />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {(currentScreen === 'agents' || currentScreen === 'agent_detail') &&
          (isPriya ? (
            <AgentDetailPage />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {currentScreen === 'agent_workflows' &&
          (isPriya ? (
            <AgentWorkflowBuilder />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {currentScreen === 'evals' &&
          (isPriya || isAlex ? (
            <AgentEvalsView />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {currentScreen === 'observability' &&
          (isPriya ? (
            <ObservabilityView />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {(currentScreen === 'guardrails' || currentScreen === 'settings') &&
          (isPriya ? (
            <GuardrailsView />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}

        {/* Integrations, Audit & Access */}
        {currentScreen === 'integrations' &&
          (isPriya || activeRoleId === 'hr_ops_maya' ? (
            <IntegrationsView />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma or Maya (HR Ops)"
              targetRoleKey="admin_priya"
            />
          ))}
        {currentScreen === 'audit_access' &&
          (isPriya ? (
            <div className="space-y-8">
              <UsersRolesView />
              <AuditLogView />
            </div>
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {currentScreen === 'users_roles' &&
          (isPriya ? (
            <UsersRolesView />
          ) : (
            <RoleRestrictedView
              requiredRole="Priya Sharma (Healthcare Compliance Admin)"
              targetRoleKey="admin_priya"
            />
          ))}
        {currentScreen === 'audit_logs' && <AuditLogView />}

        {/* David Executive & Business Value */}
        {(currentScreen === 'executive_overview' ||
          currentScreen === 'risk_by_facility' ||
          currentScreen === 'readiness_trends' ||
          currentScreen === 'pilot_scorecard') &&
          (activeRoleId === 'chro_david' || isPriya ? (
            <ExecutiveOverview />
          ) : (
            <RoleRestrictedView
              requiredRole="David Miller (CHRO)"
              targetRoleKey="chro_david"
            />
          ))}
        {currentScreen === 'business_value' &&
          (activeRoleId === 'chro_david' || isPriya ? (
            <BusinessValueView />
          ) : (
            <RoleRestrictedView
              requiredRole="David Miller (CHRO)"
              targetRoleKey="chro_david"
            />
          ))}
      </main>

      {/* Modals & Notifications */}
      <PersonaSwitcherModal />
      <DemoGuideModal />
      <KillSwitchModal />
      <TraceDetailModal />
      <EvalFailureModal />
      <RollbackModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}
