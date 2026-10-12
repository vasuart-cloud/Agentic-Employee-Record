import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Layers, 
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AgentSandbox: React.FC = () => {
  const { 
    isSandboxRunning, 
    sandboxTestResult, 
    runSandboxTest, 
    setCurrentScreen 
  } = useApp();

  const [selectedEmployee, setSelectedEmployee] = useState('Maya Thompson (EMP-10482)');
  const [selectedScenario, setSelectedScenario] = useState('Incomplete I-9 supporting evidence');
  const [selectedPolicy, setSelectedPolicy] = useState('Employment Verification v4.2');
  const [selectedAgentVersion, setSelectedAgentVersion] = useState('Compliance Agent v2.5 Draft');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-slate-800">
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block mb-0.5">
            ISOLATED AGENT SIMULATION ENVIRONMENT
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Test Compliance Agent
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Run controlled scenarios before changing production behavior.
          </p>
        </div>

        <button
          onClick={runSandboxTest}
          disabled={isSandboxRunning}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs"
        >
          {isSandboxRunning ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-teal-200" />
              <span>Simulating Agent Execution...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Run Test Scenario</span>
            </>
          )}
        </button>
      </div>

      {/* Scenario Selectors Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Test Employee Record
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          >
            <option value="Maya Thompson (EMP-10482)">Maya Thompson (EMP-10482)</option>
            <option value="Daniel Kim (EMP-10419)">Daniel Kim (EMP-10419)</option>
            <option value="Olivia Carter (EMP-10884)">Olivia Carter (EMP-10884)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Test Scenario
          </label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          >
            <option value="Incomplete I-9 supporting evidence">Incomplete I-9 supporting evidence</option>
            <option value="Expired clinical state licensure">Expired clinical state licensure</option>
            <option value="Missing annual handbook signature">Missing annual handbook signature</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Policy Version
          </label>
          <select
            value={selectedPolicy}
            onChange={(e) => setSelectedPolicy(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          >
            <option value="Employment Verification v4.2">Employment Verification v4.2</option>
            <option value="Employment Verification v4.1">Employment Verification v4.1</option>
            <option value="Clinical Licensure Standard v3.8">Clinical Licensure Standard v3.8</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Candidate Agent Version
          </label>
          <select
            value={selectedAgentVersion}
            onChange={(e) => setSelectedAgentVersion(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-500"
          >
            <option value="Compliance Agent v2.5 Draft">Compliance Agent v2.5 Draft</option>
            <option value="Compliance Agent v2.4 Prod">Compliance Agent v2.4 (Current Prod)</option>
          </select>
        </div>
      </div>

      {/* Simulated Live Execution Progress */}
      {isSandboxRunning && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-teal-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <span>Agent Sandbox Runtime Active...</span>
          </div>
          <div className="space-y-1.5 text-slate-600 pl-4 border-l-2 border-teal-500">
            <div>1. Retrieving employee record for Maya Thompson (EMP-10482)... <span className="text-teal-700">[128ms]</span></div>
            <div>2. Finding documents across Workday & SharePoint... <span className="text-teal-700">[310ms]</span></div>
            <div>3. Applying Employment Verification Policy v4.2 Section 2 rules... <span className="text-teal-700">[85ms]</span></div>
            <div>4. Evaluating List B vs List C evidence... <span className="text-teal-700">[610ms]</span></div>
            <div>5. Generating structured finding & remediation proposal... <span className="text-teal-700">[220ms]</span></div>
          </div>
        </div>
      )}

      {/* Test Output Card */}
      {sandboxTestResult === 'completed' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Scenario Test Result: PASS
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded">
                Expected: FLAG · Actual: FLAG
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">FINDING STATUS</span>
                <span className="font-bold text-rose-700">I-9 Evidence Incomplete</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">AGENT CONFIDENCE</span>
                <span className="font-bold text-teal-700">94%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">POLICY APPLIED</span>
                <span className="font-bold text-slate-800">Policy v4.2</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">LOCATED EVIDENCE</span>
                <span className="font-bold text-slate-800">Texas Driver's License</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">MISSING EVIDENCE</span>
                <span className="font-bold text-rose-700">List C Authorization Doc</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">ACTION PROPOSED</span>
                <span className="font-bold text-teal-800">Request via secure portal</span>
              </div>
            </div>
          </div>

          {/* Section 13: Test Comparison (Production vs Draft) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Compare Production Agent (v2.4) vs Draft Agent (v2.5)
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluates model delta, token efficiency, and attribution fidelity.
                </p>
              </div>
              <span className="text-xs text-teal-800 font-bold">18% Lower Tokens in Draft</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-500 text-[11px] block font-sans">Production Agent v2.4</span>
                <div className="flex justify-between">
                  <span>Outcome:</span>
                  <span className="font-bold text-slate-900">FLAG</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-bold text-slate-700">91%</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Count:</span>
                  <span className="text-slate-700">2,240 tokens</span>
                </div>
                <div className="flex justify-between">
                  <span>Citation Links:</span>
                  <span className="text-slate-700">Repository level</span>
                </div>
              </div>

              <div className="p-3.5 bg-white border-2 border-teal-500/60 rounded-lg space-y-2">
                <span className="font-bold text-teal-800 text-[11px] block font-sans">Draft Candidate Agent v2.5</span>
                <div className="flex justify-between">
                  <span>Outcome:</span>
                  <span className="font-bold text-slate-900">FLAG</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-bold text-teal-700">94% (+3% boost)</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Count:</span>
                  <span className="text-emerald-700 font-bold">1,845 tokens (-18%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Citation Links:</span>
                  <span className="text-teal-700 font-bold">Document & Page level</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-600">
                <strong>Safety Verification:</strong> No unintended changes to compliance decision rules.
              </div>
              <button
                onClick={() => setCurrentScreen('evals')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Promote to Eval Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
