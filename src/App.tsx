import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PersonaSwitcherModal } from './components/common/PersonaSwitcherModal';

// Operations Views
import { WeeklyOperationsDashboard } from './components/dashboard/WeeklyOperationsDashboard';
import { EmployeeDossier } from './components/dossier/EmployeeDossier';
import { ComplianceQueueView } from './components/compliance/ComplianceQueueView';
import { TasksQueueView } from './components/tasks/TasksQueueView';

// Admin Views
import { ComplianceSetupWizard } from './components/admin/ComplianceSetupWizard';
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

// Unauthorized access state component
const RoleRestrictedView: React.FC<{ requiredRole: string; targetRoleKey: 'admin_priya' | 'hr_ops_maya' }> = ({ 
  requiredRole, 
  targetRoleKey 
}) => {
  const { switchRole } = useApp();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-xl mx-auto my-12 text-center shadow-xs space-y-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500 font-bold">
        🔒
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Role-Restricted Administration Page
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          This governance view is restricted to <strong>{requiredRole}</strong>. Frontline HR operations users can switch personas below to test administrative flows.
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={() => switchRole(targetRoleKey)}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
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
  const isMaya = activeRoleId === 'hr_ops_maya';
  const isDavid = activeRoleId === 'chro_david';

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
      {/* Main Viewport Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl w-full mx-auto">
        {/* Operations screens */}
        {currentScreen === 'weekly_overview' && <WeeklyOperationsDashboard />}
        {currentScreen === 'employees' && <EmployeeDossier />}
        {currentScreen === 'employee_records' && <EmployeeDossier />}
        {currentScreen === 'compliance_cases' && <ComplianceQueueView />}
        {currentScreen === 'tasks' && <TasksQueueView />}
        {currentScreen === 'messages' && <TasksQueueView />}
        {currentScreen === 'audit_packets' && <AuditLogView />}

        {/* Compliance Admin screens */}
        {currentScreen === 'setup_checklist' && (
          isPriya ? <ComplianceSetupWizard /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'compliance_wizard' && (
          isPriya ? <ComplianceSetupWizard /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'policies_rules' && (
          isPriya ? <ComplianceSetupWizard /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'rule_test_lab' && (
          isPriya ? <ComplianceSetupWizard /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'rule_versions' && (
          isPriya ? <ComplianceSetupWizard /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'command_center' && <CommandCenter />}
        {currentScreen === 'agents' && <AgentDetailPage />}
        {currentScreen === 'agent_detail' && <AgentDetailPage />}
        {currentScreen === 'agent_workflows' && (
          isPriya ? <AgentWorkflowBuilder /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'evals' && (
          isPriya ? <AgentEvalsView /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'observability' && (
          isPriya ? <ObservabilityView /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}
        {currentScreen === 'guardrails' && (
          isPriya ? <GuardrailsView /> : <RoleRestrictedView requiredRole="Priya Sharma (HR Compliance Admin)" targetRoleKey="admin_priya" />
        )}

        {/* Platform & Integrations */}
        {currentScreen === 'integrations' && <IntegrationsView />}
        {currentScreen === 'users_roles' && <UsersRolesView />}
        {currentScreen === 'audit_logs' && <AuditLogView />}
        {currentScreen === 'settings' && <GuardrailsView />}

        {/* Insights & Executive */}
        {currentScreen === 'business_value' && <BusinessValueView />}
        {currentScreen === 'analytics' && <AnalyticsView />}
        {currentScreen === 'executive_overview' && <ExecutiveOverview />}
      </main>

      {/* Persona Switcher Welcome Modal */}
      <PersonaSwitcherModal />

      {/* Admin Modals & Slide-overs */}
      <KillSwitchModal />
      <TraceDetailModal />
      <EvalFailureModal />
      <RollbackModal />
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
