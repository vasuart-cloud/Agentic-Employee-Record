import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRoleId } from '../../types';
import { 
  ShieldCheck, 
  Search, 
  Server, 
  AlertOctagon, 
  ChevronDown, 
  RotateCcw, 
  Users, 
  HelpCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentPersona, 
    activeRoleId, 
    switchRole, 
    currentEnvironment, 
    setCurrentEnvironment, 
    killSwitchState, 
    setCurrentScreen,
    resetDemoData,
    setIsWelcomeModalOpen,
    employees,
    complianceCases,
    setSelectedEmployeeId,
    setSelectedCaseId
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isKilled = killSwitchState.isTriggered;

  // Search filtered results
  const searchResults = searchQuery.trim() ? {
    employees: employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4),
    cases: complianceCases.filter(c => 
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.documentType.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  } : null;

  return (
    <header className="relative bg-white border-b border-slate-200 text-slate-800 z-30 select-none">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Contextual Workspace */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => {
              if (activeRoleId === 'admin_priya') setCurrentScreen('setup_checklist');
              else if (activeRoleId === 'hr_ops_maya') setCurrentScreen('weekly_overview');
              else setCurrentScreen('executive_overview');
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  Agentic Employee Records
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  SaaS Layer
                </span>
              </div>
              <span className="text-[11px] font-medium text-teal-800 block leading-tight">
                {currentPersona.workspaceLabel}
              </span>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search synthetic employees, cases, rules..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50 text-xs">
              {searchResults.employees.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Employees
                  </div>
                  {searchResults.employees.map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmployeeId(emp.id);
                        if (emp.activeCaseId) setSelectedCaseId(emp.activeCaseId);
                        setCurrentScreen('employee_records');
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 flex items-center justify-between border-b border-slate-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{emp.name} · {emp.id}</div>
                        <div className="text-[11px] text-slate-500">{emp.role} — {emp.department}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        emp.healthStatus === 'Complete' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {emp.healthStatus}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.cases.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Compliance Cases
                  </div>
                  {searchResults.cases.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        setSelectedEmployeeId(c.employeeId);
                        setCurrentScreen('employee_records');
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 flex items-center justify-between border-b border-slate-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{c.caseNumber} · {c.employeeName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.documentType}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                        {c.severity}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.employees.length === 0 && searchResults.cases.length === 0 && (
                <div className="p-3 text-center text-slate-500 text-xs">
                  No matching employees or compliance cases found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Role Switcher, Env, Reset Demo, Guide */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Guide / Tour Button */}
          <button
            onClick={() => setIsWelcomeModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Persona & Product Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Roles Guide</span>
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            title="Reset demo data to initial seed state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Environment Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-xs font-medium text-slate-700">
            <Server className="w-3 h-3 text-slate-500" />
            <select
              value={currentEnvironment}
              onChange={(e) => setCurrentEnvironment(e.target.value as any)}
              className="bg-transparent border-none text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Sandbox">Sandbox</option>
            </select>
          </div>

          {/* Emergency Alert indicator */}
          {isKilled && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
              <span>KILL SWITCH ACTIVE</span>
            </div>
          )}

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <img
                src={currentPersona.avatarUrl}
                alt={currentPersona.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-slate-300"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  {currentPersona.name}
                  <span className="text-[10px] font-normal text-teal-700 font-medium">({currentPersona.roleLabel})</span>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight truncate max-w-[150px]">
                  {currentPersona.title}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 text-xs py-1">
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Switch Active Persona
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 font-semibold">
                    Role-Aware RBAC
                  </span>
                </div>

                <div className="p-1 space-y-1">
                  {(['admin_priya', 'hr_ops_maya', 'chro_david'] as UserRoleId[]).map((roleId) => {
                    const isSelected = activeRoleId === roleId;
                    const rData = roleId === 'admin_priya' ? {
                      name: 'Priya Sharma',
                      role: 'HR Compliance Admin',
                      desc: 'Policy setup, eval sandbox, rules & connectors'
                    } : roleId === 'hr_ops_maya' ? {
                      name: 'Maya',
                      role: 'HR Operations Manager',
                      desc: 'Weekly exceptions, Why flagged, outreach & closures'
                    } : {
                      name: 'David Miller',
                      role: 'VP People / CHRO',
                      desc: 'Executive business value & audit readiness'
                    };

                    return (
                      <button
                        key={roleId}
                        onClick={() => {
                          switchRole(roleId);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2.5 ${
                          isSelected 
                            ? 'bg-teal-50 border border-teal-200' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          isSelected ? 'bg-teal-600' : 'bg-slate-300'
                        }`} />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {rData.name}
                            <span className="text-[10px] font-medium text-teal-800">· {rData.role}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {rData.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      setIsWelcomeModalOpen(true);
                    }}
                    className="w-full text-center py-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800"
                  >
                    View Product Persona Story & Goals →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-left">
            <div className="flex items-center gap-3 text-slate-900 mb-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Reset Prototype Demo State?</h3>
                <p className="text-xs text-slate-500">Restore all seed cases, employees, and rules</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 my-4 leading-relaxed">
              This will restore all simulated records (including Daniel Kim's expired license, initial rule test fixtures, and Workday HRMS mirror) to their initial demo state.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
