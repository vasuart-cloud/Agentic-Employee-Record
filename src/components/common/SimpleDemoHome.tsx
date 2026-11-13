import React from 'react';
import { ArrowRight, BadgeCheck, CheckCircle2, ClipboardCheck, ShieldCheck, Users, Play, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoScenarioId } from '../../types';

const STORIES: {
  id: DemoScenarioId;
  number: string;
  title: string;
  audience: string;
  duration: string;
  description: string;
  steps: string[];
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'scenario_1_expired_pharmacist',
    number: '01',
    title: 'Resolve an expired credential',
    audience: 'Maya · HR Operations, with Alex · Credentialing',
    duration: '4 min',
    description: 'Follow one employee from an expired license alert to outreach, authoritative verification, safe closure and Workday staging.',
    steps: ['Understand the alert', 'Contact the employee', 'Verify & resolve'],
    icon: Users
  },
  {
    id: 'scenario_5_priya_policy_publish',
    number: '02',
    title: 'Set up compliance policies',
    audience: 'Priya · Compliance Admin, with Alex · Approver',
    duration: '3 min',
    description: 'Configure the organization, use a sample policy, update a rule, run real sandbox tests and obtain an independent sign-off.',
    steps: ['Choose policy', 'Configure & test', 'Request approval'],
    icon: ShieldCheck
  },
  {
    id: 'scenario_6_david_executive',
    number: '03',
    title: 'See workforce risk & value',
    audience: 'David · CHRO',
    duration: '2 min',
    description: 'View clinical risks by facility, onboarding readiness and a transparent, editable business-value model.',
    steps: ['Facility risks', 'Workforce readiness', 'Business value'],
    icon: ClipboardCheck
  }
];

export const SimpleDemoHome: React.FC = () => {
  const { launchDemoScenario, resetScenario, computedMetrics, organization } = useApp();

  return (
    <div className="space-y-7 pb-10">
      <section className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold uppercase tracking-wide">
          <BadgeCheck className="w-4 h-4" />
          Healthcare workforce readiness · Guided product tour
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 max-w-3xl">
          Three simple stories. One clearer path to compliance.
        </h1>
        <p className="text-sm text-slate-600 mt-3 max-w-3xl leading-relaxed">
          See how HR resolves a document problem, Compliance sets trustworthy rules, and leadership tracks risk and value.
          Pick a story to enter the right workspace automatically. No setup or technical knowledge needed.
        </p>
        <div className="flex flex-wrap gap-2 mt-5 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
            {computedMetrics.sampleWorkersCount} synthetic employee profiles
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
            {computedMetrics.totalApplicableRequirements} sample requirements
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            Workday and licensing boards simulated
          </span>
        </div>
      </section>

      <section aria-labelledby="stories-title">
        <div className="mb-4">
          <h2 id="stories-title" className="text-lg font-semibold text-slate-900">Choose what you want to see</h2>
          <p className="text-sm text-slate-600 mt-1">Start with Story 1 for the fastest explanation of the product.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STORIES.map((story) => {
            const Icon = story.icon;
            return (
              <article key={story.id} className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">{story.duration} · Story {story.number}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-950">{story.title}</h3>
                  <div className="text-xs text-teal-800 font-medium">{story.audience}</div>
                  <p className="text-sm text-slate-600 leading-relaxed min-h-20">{story.description}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 space-y-2 flex-1">
                  {story.steps.map((step, index) => (
                    <div key={step} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                      <span>{index + 1}. {step}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => launchDemoScenario(story.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2.5"
                  >
                    <Play className="w-4 h-4" />
                    Start story
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetScenario(story.id)}
                    aria-label={'Reset ' + story.title}
                    title="Restart only this story"
                    className="px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-600">
          <strong className="text-slate-800">What this demo proves:</strong> A received document is not the same as a verified license;
          clinical duty authorization and Workday synchronization remain separate decisions. This browser prototype uses
          synthetic data and simulated external integrations. {organization.name} is a fictional organization.
        </div>
      </aside>
    </div>
  );
};
