import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  User, 
  Calendar, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowLeft,
  ShieldCheck,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const EmployeeDossier: React.FC = () => {
  const { selectedEmployee, setCurrentScreen } = useApp();

  const [activeTab, setActiveTab] = useState<'checklist' | 'documents' | 'timeline'>('checklist');

  const checklistItems = [
    { name: 'Employment Agreement', status: 'Complete', source: 'DocuSign', rule: 'Policy v3.1', detail: 'Signed March 15, 2024' },
    { name: 'Form I-9 Employment Verification', status: 'Critical Gap', source: 'Workday + SharePoint', rule: 'Policy v4.2', detail: 'List B (Driver License) located. List C (SSN / Authorization) missing.' },
    { name: 'Background Verification Report', status: 'Complete', source: 'Sterling', rule: 'Standards v2.0', detail: 'Clear / Passed March 12, 2024' },
    { name: 'Tax Documents (Form W-4)', status: 'Complete', source: 'Workday', rule: 'Payroll 2024', detail: 'Electronic signature verified' },
    { name: 'Corporate Policy & Handbook Ack', status: 'Complete', source: 'DocuSign', rule: 'Ethics Charter v5', detail: 'Acknowledged March 18, 2024' },
    { name: 'Mandatory Cybersecurity Training', status: 'Expiring Soon', source: 'LMS Platform', rule: 'Security Standard', detail: 'Annual refresher due in 45 days' }
  ];

  return (
    <div className="space-y-6 pb-12 text-slate-800 text-xs">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('command_center')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Command Center</span>
        </button>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 text-teal-600" />
          <span>Last continuous scan: 8 minutes ago</span>
        </div>
      </div>

      {/* Header Profile */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={selectedEmployee.avatarUrl}
              alt={selectedEmployee.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {selectedEmployee.name}
                </h1>
                <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedEmployee.id}
                </span>
                <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold font-mono">
                  {selectedEmployee.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-mono">
                <span className="text-slate-800 font-semibold">{selectedEmployee.role}</span>
                <span>·</span>
                <span>{selectedEmployee.location}</span>
                <span>·</span>
                <span>Manager: <strong className="text-slate-700">{selectedEmployee.manager}</strong></span>
                <span>·</span>
                <span>Start Date: {selectedEmployee.startDate}</span>
              </div>
            </div>
          </div>

          {/* Health Score Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-5 shrink-0">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">FILE HEALTH SCORE</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-amber-700 font-mono">82</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <div className="text-[11px] text-amber-800 font-bold mt-0.5">
                Needs Attention
              </div>
            </div>

            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500"
                  strokeDasharray="82, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute font-mono text-xs font-bold text-slate-900">82%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Gap Card */}
      <div className="bg-rose-50 border border-rose-300 rounded-xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] font-mono">
              FLAGGED BY COMPLIANCE AGENT v2.4
            </span>
            <span className="text-xs font-bold text-slate-900">
              Form I-9 Evidence Incomplete (Confidence: 94%)
            </span>
          </div>
          <button
            onClick={() => setCurrentScreen('agent_detail')}
            className="text-xs text-teal-800 font-bold hover:underline"
          >
            Inspect in Sandbox →
          </button>
        </div>
        <p className="text-xs text-rose-950">
          Section 2 indicates List B + List C verification, but only one supporting document (Texas Driver License) was located in SharePoint. Second document missing.
        </p>
      </div>

      {/* Checklist Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 font-bold text-xs text-slate-900">
          Continuous Completeness Checklist
        </div>
        <div className="divide-y divide-slate-100">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    item.status === 'Complete' ? 'bg-emerald-500' :
                    item.status === 'Critical Gap' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    item.status === 'Complete' ? 'bg-emerald-50 text-emerald-800' :
                    item.status === 'Critical Gap' ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {item.detail} · Source: {item.source} · {item.rule}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
