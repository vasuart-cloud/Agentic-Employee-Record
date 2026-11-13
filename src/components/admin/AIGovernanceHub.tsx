import React, { useState } from 'react';
import { CommandCenter } from './CommandCenter';
import { AgentDetailPage } from './AgentDetailPage';
import { AgentWorkflowBuilder } from './AgentWorkflowBuilder';
import { AgentEvalsView } from './AgentEvalsView';
import { ObservabilityView } from './ObservabilityView';
import { GuardrailsView } from './GuardrailsView';

type GovernanceTab = 'overview' | 'agents' | 'workflows' | 'evals' | 'observability' | 'guardrails';

export const AIGovernanceHub: React.FC = () => {
  const [tab, setTab] = useState<GovernanceTab>('guardrails');

  const tabs: { id: GovernanceTab; label: string }[] = [
    { id: 'guardrails', label: 'Guardrails & Kill Switch' },
    { id: 'overview', label: 'Control Overview' },
    { id: 'agents', label: 'Agent Config' },
    { id: 'workflows', label: 'Workflow Graph' },
    { id: 'evals', label: 'Agent Evals' },
    { id: 'observability', label: 'Traces & Latency' }
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Bounded AI Governance &amp; Safety Controls
          </h1>
          <p className="text-xs text-slate-500">
            AI agents assist with triage, evidence extraction confidence, and outreach drafting — never authorizing clinical duties or bypassing PSV.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 text-xs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-lg font-medium ${
                tab === t.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'guardrails' && <GuardrailsView />}
      {tab === 'overview' && <CommandCenter />}
      {tab === 'agents' && <AgentDetailPage />}
      {tab === 'workflows' && <AgentWorkflowBuilder />}
      {tab === 'evals' && <AgentEvalsView />}
      {tab === 'observability' && <ObservabilityView />}
    </div>
  );
};
