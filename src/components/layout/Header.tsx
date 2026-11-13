import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { USER_PERSONAS } from '../../data/mockData';
import { DemoScenarioId, UserRoleId } from '../../types';
import {
  ShieldCheck,
  Search,
  ChevronDown,
  HelpCircle,
  Play,
  RotateCcw,
  Menu,
  AlertOctagon,
  UserCheck,
  X
} from 'lucide-react';

const SCENARIOS: { id: DemoScenarioId; title: string; subtitle: string }[] = [
  {
    id: 'scenario_1_expired_pharmacist',
    title: '1. Expired License Escalation (Daniel Kim)',
    subtitle: 'Maya triage -> Employee portal upload -> Alex PSV -> Multi-req closure'
  },
  {
    id: 'scenario_2_newhire_nurse',
    title: '2. New Hire Preboarding (Elena Alvarez)',
    subtitle: 'Texas RN starting in 7 days · Admin vs Clinical Duty split'
  },
  {
    id: 'scenario_3_suspended_license',
    title: '3. Restricted Board Status (Marcus Vance)',
    subtitle: 'Negative PSV blocks closure & triggers clinical leadership escalation'
  },
  {
    id: 'scenario_4_workday_retry',
    title: '4. Workday Staging Retry (Hannah Abbott)',
    subtitle: 'HTTP 504 writeback recovery with idempotency key'
  },
  {
    id: 'scenario_5_priya_policy_publish',
    title: '5. Rule Test Lab & Sign-Off (Priya -> Alex)',
    subtitle: 'Failing FIX-05 draft -> fix & rerun -> independent approval'
  },
  {
    id: 'scenario_6_david_executive',
    title: '6. Executive Readiness & Value (David)',
    subtitle: 'Facility risk, sample denominators & capacity vs cash ROI'
  }
];

export const Header: React.FC = () => {
  const {
    activeRoleId,
    currentPersona,
    switchRole,
    organization,
    workers,
    cases,
    openWorkerDossier,
    launchDemoScenario,
    activeScenarioId,
    resetDemoData,
    setIsDemoGuideOpen,
    setIsMobileSidebarOpen,
    killSwitchState,
    setCurrentScreen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const scenarioRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (scenarioRef.current && !scenarioRef.current.contains(e.target as Node)) {
        setScenarioOpen(false);
        setConfirmReset(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const filteredWorkers = searchQuery.trim()
    ? workers
        .filter(
          (w) =>
            w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.primaryFacilityName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const filteredCases = searchQuery.trim()
    ? cases
        .filter(
          (c) =>
            c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.workerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const primaryRoles: UserRoleId[] = ['hr_ops_maya', 'admin_priya', 'chro_david'];
  const supportingRoles: UserRoleId[] = ['cred_alex'];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 z-30">
      {/* Left: Mobile Menu + Brand + Honest Demo Label */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 truncate tracking-tight">
                Agentic Employee Records
              </span>
              <span className="hidden md:inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Demo data only · As of {organization.demoReferenceDate}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 truncate hidden sm:block">
              {organization.name} · {currentPersona.workspaceLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Quick Worker / Case Search */}
      <div className="hidden md:block relative flex-1 max-w-sm" ref={searchRef}>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search workers, IDs, or cases..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {searchOpen && searchQuery.trim() !== '' && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 text-xs max-h-80 overflow-y-auto">
            {filteredWorkers.length === 0 && filteredCases.length === 0 ? (
              <div className="p-3 text-slate-500 text-center">No matching synthetic workers or cases.</div>
            ) : (
              <>
                {filteredWorkers.length > 0 && (
                  <div className="mb-1.5">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Workers
                    </div>
                    {filteredWorkers.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          openWorkerDossier(w.id);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-medium text-slate-900">{w.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {w.primaryRole} · {w.primaryFacilityName}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                          {w.employeeNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredCases.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-t border-slate-100">
                      Cases
                    </div>
                    {filteredCases.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          openWorkerDossier(c.workerId, c.id);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-semibold text-teal-700">
                            {c.caseNumber}
                          </span>
                          <span className="text-[11px] text-slate-500">{c.workerName}</span>
                        </div>
                        <div className="text-[11px] text-slate-700 truncate">{c.title}</div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: Kill Switch Alert, Demo Scenarios, Demo Guide (?), Persona Switcher */}
      <div className="flex items-center gap-2 shrink-0">
        {killSwitchState.isTriggered && (
          <button
            onClick={() => setCurrentScreen('ai_governance')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold hover:bg-rose-100"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Kill Switch Active</span>
          </button>
        )}

        {/* Demo Scenario Launcher */}
        <div className="relative" ref={scenarioRef}>
          <button
            onClick={() => setScenarioOpen((o) => !o)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
          >
            <Play className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden sm:inline">Demo Scenarios</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {scenarioOpen && (
            <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs">
              <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-900">Guided Demo Scenarios</span>
                <span className="text-[10px] font-mono text-slate-500">Synthetic Data</span>
              </div>

              <div className="py-1 space-y-0.5 max-h-80 overflow-y-auto">
                {SCENARIOS.map((sc) => {
                  const active = activeScenarioId === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        launchDemoScenario(sc.id);
                        setScenarioOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                        active ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{sc.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{sc.subtitle}</div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-1 border-t border-slate-100 px-1.5">
                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data to Baseline</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <span className="text-[11px] text-amber-900 font-medium">
                      Reset all cases &amp; logs?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-600 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          resetDemoData();
                          setConfirmReset(false);
                          setScenarioOpen(false);
                        }}
                        className="px-2 py-1 rounded bg-amber-700 text-white font-semibold text-[11px]"
                      >
                        Confirm Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Guide (?) */}
        <button
          onClick={() => setIsDemoGuideOpen(true)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
          title="Demo Guide & Architecture Boundaries"
          aria-label="Open Demo Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Persona Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-semibold shrink-0 overflow-hidden">
              {currentPersona.avatarUrl ? (
                <img
                  src={currentPersona.avatarUrl}
                  alt={currentPersona.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentPersona.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="text-left hidden sm:block leading-tight">
              <div className="font-semibold text-slate-900">{currentPersona.name}</div>
              <div className="text-[10px] text-slate-500">{currentPersona.roleLabel}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs">
              <div className="px-2.5 py-1.5 border-b border-slate-100">
                <div className="font-semibold text-slate-900">Switch Demo Perspective</div>
                <div className="text-[10px] text-slate-500">
                  Simulated browser persona control (Demo Mode)
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                {primaryRoles.map((rId) => {
                  const p = USER_PERSONAS[rId];
                  const active = activeRoleId === rId;
                  return (
                    <button
                      key={rId}
                      onClick={() => {
                        switchRole(rId);
                        setRoleOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 ${
                        active ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 flex items-center justify-between gap-2">
                          <span>{p.name}</span>
                          <span className="text-[10px] font-medium text-teal-800">{p.roleLabel}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {p.jobToBeDone}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-1.5 mt-1">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Supporting Limited-Role Reviewer
                </div>
                {supportingRoles.map((rId) => {
                  const p = USER_PERSONAS[rId];
                  const active = activeRoleId === rId;
                  return (
                    <button
                      key={rId}
                      onClick={() => {
                        switchRole(rId);
                        setRoleOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 ${
                        active ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 flex items-center justify-between gap-2">
                          <span>{p.name}</span>
                          <span className="text-[10px] font-medium text-slate-600">{p.roleLabel}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {p.jobToBeDone}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
