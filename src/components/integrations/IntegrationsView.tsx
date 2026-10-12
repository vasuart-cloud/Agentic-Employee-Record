import React from 'react';
import { 
  Network, 
  CheckCircle, 
  RefreshCw, 
  Lock, 
  Database, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const connectors = [
    {
      id: 'INT-WD-01',
      name: 'Workday Human Capital Management',
      type: 'HCM (Master Worker Record)',
      status: 'Connected',
      lastSync: '4 minutes ago',
      indexedCount: 12480,
      permissions: 'Read-only',
      authType: 'OAuth 2.0 / Bearer'
    },
    {
      id: 'INT-SP-02',
      name: 'Microsoft 365 / SharePoint HR Archive',
      type: 'Document Repository',
      status: 'Connected',
      lastSync: '11 minutes ago',
      indexedCount: 84390,
      permissions: 'Read-only',
      authType: 'Service Principal'
    },
    {
      id: 'INT-DS-03',
      name: 'DocuSign Enterprise e-Signature',
      type: 'E-Signature',
      status: 'Connected',
      lastSync: '18 minutes ago',
      indexedCount: 19400,
      permissions: 'Read-only',
      authType: 'OAuth 2.0 / Bearer'
    },
    {
      id: 'INT-ST-04',
      name: 'Sterling Screening & Background Verification',
      type: 'Background Screening',
      status: 'Connected',
      lastSync: '1 hour ago',
      indexedCount: 12480,
      permissions: 'Read-only',
      authType: 'API Key'
    },
    {
      id: 'INT-SAP-05',
      name: 'SAP SuccessFactors HCM',
      type: 'Secondary HCM / Subsidiary',
      status: 'Connected',
      lastSync: '2 hours ago',
      indexedCount: 1200,
      permissions: 'Read-only',
      authType: 'OAuth 2.0 / Bearer'
    }
  ];

  return (
    <div className="space-y-6 pb-12 text-xs text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest mb-0.5">
          CONNECTED SYSTEMS & PROVENANCE
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Enterprise HCM & Content Connectors
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Read-only, zero-data-loss synchronization layer linking Workday, SAP, SharePoint, and DocuSign.
        </p>
      </div>

      {/* Positioning Statement Card */}
      <div className="p-5 rounded-2xl bg-white border border-teal-200 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold text-slate-900">
            "Your HCM knows who works here. Agentic Employee Records makes every employee file complete, explainable and defensible."
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            We do not replace your system of record. Workday, SAP SuccessFactors, or Oracle HCM remain authoritative for employee master data. Our agentic layer continuously discovers evidence, flags gaps, routes remediations, and compiles audit proof across your fragmented storage estates.
          </p>
        </div>
      </div>

      {/* Connector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((conn) => (
          <div key={conn.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-wider block">
                  {conn.type}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {conn.name}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Connected</span>
              </span>
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Last Scanned:</span>
                <span className="text-slate-800 font-mono">{conn.lastSync}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Indexed Records:</span>
                <span className="text-slate-900 font-mono font-bold">{conn.indexedCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Access Scope:</span>
                <span className="text-teal-800 font-semibold">{conn.permissions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authentication:</span>
                <span className="text-slate-700 font-mono text-[10px]">{conn.authType}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-slate-400 font-mono">AES-256 In-Transit</span>
              <button
                onClick={() => alert(`Synchronizing metadata from ${conn.name}...`)}
                className="text-teal-700 hover:text-teal-800 flex items-center gap-1 font-bold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
