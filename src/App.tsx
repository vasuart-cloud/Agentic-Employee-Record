import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoGuideBar } from './components/demo/DemoGuideBar';

// Admin & Control Center Views
import { CommandCenter } from './components/admin/CommandCenter';
import { AgentDetailPage } from './components/admin/AgentDetailPage';
import { AgentWorkflowBuilder } from './components/admin/AgentWorkflowBuilder';
import { AgentEvalsView } from './components/admin/AgentEvalsView';
import { ObservabilityView } from './components/admin/ObservabilityView';
import { GuardrailsView } from './components/admin/GuardrailsView';
import { BusinessValueView } from './components/admin/BusinessValueView';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { UsersRolesView } from './components/admin/UsersRolesView';

// Operations & Insights Views
import { EmployeeDossier } from './components/dossier/EmployeeDossier';
import { ComplianceQueueView } from './components/compliance/ComplianceQueueView';
import { TasksQueueView } from './components/tasks/TasksQueueView';
import { AuditLogView } from './components/audit/AuditLogView';
import { IntegrationsView } from './components/integrations/IntegrationsView';

// Modals
import { KillSwitchModal } from './components/modals/KillSwitchModal';
import { TraceDetailModal } from './components/modals/TraceDetailModal';
import { EvalFailureModal } from './components/modals/EvalFailureModal';
import { RollbackModal } from './components/modals/RollbackModal';

const MainContent: React.FC = () => {
  const { currentScreen } = useApp();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
      {/* 6-Min CEO Demo Navigation Bar */}
      <DemoGuideBar />

      {/* Main Viewport Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl w-full mx-auto">
        {currentScreen === 'command_center' && <CommandCenter />}
        {currentScreen === 'agents' && <AgentDetailPage />}
        {currentScreen === 'agent_detail' && <AgentDetailPage />}
        {currentScreen === 'agent_workflows' && <AgentWorkflowBuilder />}
        {currentScreen === 'evals' && <AgentEvalsView />}
        {currentScreen === 'observability' && <ObservabilityView />}
        {currentScreen === 'guardrails' && <GuardrailsView />}
        {currentScreen === 'business_value' && <BusinessValueView />}
        {currentScreen === 'analytics' && <AnalyticsView />}
        {currentScreen === 'employee_records' && <EmployeeDossier />}
        {currentScreen === 'compliance_cases' && <ComplianceQueueView />}
        {currentScreen === 'tasks' && <TasksQueueView />}
        {currentScreen === 'audit_logs' && <AuditLogView />}
        {currentScreen === 'integrations' && <IntegrationsView />}
        {currentScreen === 'users_roles' && <UsersRolesView />}
        {currentScreen === 'settings' && <GuardrailsView />}
      </main>

      {/* Modals & Slide-overs */}
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
