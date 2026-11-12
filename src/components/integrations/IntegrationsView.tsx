import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Network, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Sliders, 
  Database, 
  ExternalLink, 
  History, 
  Layers, 
  ArrowDownUp,
  FileCheck,
  ShieldCheck,
  RotateCcw,
  Eye,
  X
} from 'lucide-react';
import { HRMSConnector } from '../../types';

export const IntegrationsView: React.FC = () => {
  const { 
    connectors, 
    fieldMappings, 
    syncRuns, 
    hrmsMirror, 
    runConnectorSync, 
    retryFailedSync,
    currentPersona,
    complianceCases
  } = useApp();

  const [activeTab, setActiveTab] = useState<'connectors' | 'field_mappings' | 'sync_activity' | 'hrms_mirror'>('connectors');
  const [selectedConnector, setSelectedConnector] = useState<HRMSConnector>(connectors[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedMirrorEmpId, setSelectedMirrorEmpId] = useState<string>('EMP-10419');
  const [isInspectPayloadOpen, setIsInspectPayloadOpen] = useState(false);

  const danielMirror = hrmsMirror['EMP-10419'] || {
    employeeId: 'EMP-10419',
    workerName: 'Daniel Kim',
    jobProfile: 'Clinical Research Pharmacist',
    department: 'R&D Operations',
    location: 'California',
    workerStatus: 'Active',
    complianceStatus: 'NON_COMPLIANT_EXPIRED_LICENSE',
    licenseNumber: 'RPH-84920',
    licenseExpiration: '2026-09-15',
    auditVerified: false,
    lastSyncTimestamp: '2026-11-12 14:15:00 UTC'
  };

  const danielCase = complianceCases.find(c => c.employeeId === 'EMP-10419');

  const handleSyncNow = async (connectorId: string) => {
    setIsSyncing(true);
    await runConnectorSync(connectorId);
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              Simulated Integrations Engine
            </span>
            <span className="text-xs text-slate-400">· Read-Only Master / Approved Compliance Writeback</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            HRMS & Document Repositories
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            The HRMS (Workday) remains the system of record for employee identity. Agentic Employee Records writes back only verified compliance metadata.
          </p>
        </div>

        {/* Global Sync CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSyncNow('conn-workday')}
            disabled={isSyncing}
            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Workday Now'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('connectors')}
          className={`pb-2.5 transition-colors flex items-center gap-1.5 ${
            activeTab === 'connectors' ? 'text-teal-700 border-b-2 border-teal-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Configured Connectors ({connectors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('field_mappings')}
          className={`pb-2.5 transition-colors flex items-center gap-1.5 ${
            activeTab === 'field_mappings' ? 'text-teal-700 border-b-2 border-teal-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Field Mappings ({fieldMappings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sync_activity')}
          className={`pb-2.5 transition-colors flex items-center gap-1.5 ${
            activeTab === 'sync_activity' ? 'text-teal-700 border-b-2 border-teal-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Sync Activity & Retries</span>
        </button>

        <button
          onClick={() => setActiveTab('hrms_mirror')}
          className={`pb-2.5 transition-colors flex items-center gap-1.5 ${
            activeTab === 'hrms_mirror' ? 'text-teal-700 border-b-2 border-teal-600 font-bold' : 'hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>HRMS Mirror Viewer</span>
          {danielMirror.auditVerified && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
              Synced
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CONNECTORS */}
      {activeTab === 'connectors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connectors.map((conn) => {
              const isSelected = selectedConnector.id === conn.id;
              return (
                <div
                  key={conn.id}
                  onClick={() => setSelectedConnector(conn)}
                  className={`border rounded-xl p-4 bg-white cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-teal-500 shadow-xs ring-1 ring-teal-500' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                      {conn.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      conn.status === 'Connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      conn.status === 'Configured' ? 'bg-slate-100 text-slate-600' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {conn.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mb-1">{conn.name}</h3>
                  <div className="text-[11px] text-slate-500 mb-3 truncate font-mono">
                    {conn.endpointUrl}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Records Synced:</span>
                      <span className="font-semibold text-slate-800">{conn.recordsSynced.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sync Cadence:</span>
                      <span className="font-semibold text-slate-800">{conn.syncFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Metadata Writeback:</span>
                      <span className={`font-semibold ${conn.writebackEnabled ? 'text-teal-700' : 'text-slate-400'}`}>
                        {conn.writebackEnabled ? 'Enabled (Approved only)' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Connector Detail Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>{selectedConnector.name}</span>
                  <span className="text-xs font-mono font-normal text-slate-500">({selectedConnector.id})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Last successful sync: {selectedConnector.lastSyncTimestamp}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Connection to ${selectedConnector.name} verified successfully.`)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  Test Connection
                </button>
                <button
                  onClick={() => handleSyncNow(selectedConnector.id)}
                  disabled={isSyncing}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
                >
                  Trigger Incremental Sync
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-1 font-semibold">Simulated Gateway Endpoint</div>
                <div className="font-mono text-slate-800 truncate">{selectedConnector.endpointUrl}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-1 font-semibold">Security & Protocol</div>
                <div className="text-slate-800">OAuth 2.0 Bearer Token (Simulated Enterprise Tenant)</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-1 font-semibold">Scope & Permissions</div>
                <div className="text-slate-800">Worker Master (Read) · Compliance Custom Attributes (Write)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIELD MAPPINGS */}
      {activeTab === 'field_mappings' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Workday HCM &rarr; Agentic Compliance Field Mappings</span>
            <span className="text-slate-500 font-mono">12 Active Attribute Mappings</span>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/60 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="px-5 py-2.5">Source Attribute (Workday)</th>
                <th className="px-5 py-2.5">Direction</th>
                <th className="px-5 py-2.5">Target Compliance Attribute</th>
                <th className="px-5 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fieldMappings.map((fm) => (
                <tr key={fm.id} className="hover:bg-slate-50">
                  <td className="px-5 py-2.5 font-mono text-slate-900 font-semibold">{fm.sourceField}</td>
                  <td className="px-5 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                      {fm.direction}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 font-mono text-teal-800 font-semibold">{fm.targetField}</td>
                  <td className="px-5 py-2.5">
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {fm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: SYNC ACTIVITY & RETRIES */}
      {activeTab === 'sync_activity' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900">Sync Execution Log & Recovery Queue</h2>
              <p className="text-xs text-slate-500">Inspect historical runs, payload counts, and retry failed operations</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
            {syncRuns.map((sr) => (
              <div key={sr.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sr.connectorName}</span>
                    <span className="font-mono text-slate-400 text-[10px]">· {sr.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      sr.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {sr.status}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Direction: <strong>{sr.direction}</strong> · Timestamp: {sr.timestamp} ({sr.durationMs}ms)
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    Fetched: {sr.recordsFetched} | Updated: {sr.recordsUpdated} | Failed: {sr.recordsFailed} | Key: {sr.idempotencyKey}
                  </div>
                  {sr.errorMessage && (
                    <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded mt-2">
                      {sr.errorMessage}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {sr.status === 'FAILED' ? (
                    <button
                      onClick={() => retryFailedSync(sr.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Outbound Sync</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Recorded
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HRMS MIRROR VIEWER */}
      {activeTab === 'hrms_mirror' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-700" />
                  Workday HCM Local Mirror (Live Synchronized Replica)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify how compliance verification status is mirrored in the enterprise HRMS without overwriting master identity records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInspectPayloadOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-700" />
                  <span>Inspect Before/After Payload</span>
                </button>
              </div>
            </div>

            {/* Worker Selector */}
            <div className="flex items-center gap-3 mb-4 text-xs">
              <span className="font-bold text-slate-700">Select Worker Record:</span>
              <div className="flex gap-2">
                {['EMP-10419', 'EMP-10482', 'EMP-10884'].map((id) => (
                  <button
                    key={id}
                    onClick={() => setSelectedMirrorEmpId(id)}
                    className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors ${
                      selectedMirrorEmpId === id
                        ? 'bg-teal-700 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {id} {id === 'EMP-10419' ? '(Daniel Kim)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Mirror Object Card */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-200 pb-2">
                <span>WORKDAY_WORKER_PROFILE // JSON_REPLICA</span>
                <span className="text-[10px]">Last Mirror Sync: {danielMirror.lastSyncTimestamp}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">HRMS Master Data (Read-Only)</div>
                  <div className="text-slate-800">Worker ID: <strong>{danielMirror.employeeId}</strong></div>
                  <div className="text-slate-800">Legal Name: <strong>{danielMirror.workerName}</strong></div>
                  <div className="text-slate-800">Job Profile: <strong>{danielMirror.jobProfile}</strong></div>
                  <div className="text-slate-800">Supervisory Org: <strong>{danielMirror.department}</strong></div>
                  <div className="text-slate-800">Location: <strong>{danielMirror.location}</strong></div>
                  <div className="text-slate-800">Status: <strong>{danielMirror.workerStatus}</strong></div>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg border bg-white">
                  <div className="text-teal-800 text-[10px] uppercase font-bold flex items-center justify-between">
                    <span>Approved Compliance Metadata (Written Back)</span>
                    {danielMirror.auditVerified ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        VERIFIED COMPLIANT
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                        NON COMPLIANT
                      </span>
                    )}
                  </div>
                  <div className="text-slate-800">Compliance Status: <strong>{danielMirror.complianceStatus}</strong></div>
                  <div className="text-slate-800">State License #: <strong>{danielMirror.licenseNumber || 'N/A'}</strong></div>
                  <div className="text-slate-800">License Expiration: <strong className={danielMirror.auditVerified ? 'text-emerald-700' : 'text-rose-700'}>{danielMirror.licenseExpiration}</strong></div>
                  <div className="text-slate-800">Audit Verified: <strong>{danielMirror.auditVerified ? 'true' : 'false'}</strong></div>
                  {danielMirror.lastVerifiedBy && (
                    <div className="text-slate-600 text-[11px]">
                      Verified By: <strong>{danielMirror.lastVerifiedBy}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Before / After Payload Modal */}
      {isInspectPayloadOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Workday HCM Outbound Writeback Payload Diff
                </h3>
              </div>
              <button 
                onClick={() => setIsInspectPayloadOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Comparing Workday worker record for <strong>Daniel Kim (EMP-10419)</strong> before vs after Maya approved the renewal evidence:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1">
                <div className="text-rose-800 font-bold text-[11px] mb-2">BEFORE REMEDIATION</div>
                <div className="text-slate-700">&#123;</div>
                <div className="text-slate-700 pl-3">"workerId": "EMP-10419",</div>
                <div className="text-rose-700 font-bold pl-3">"complianceStatus": "NON_COMPLIANT_EXPIRED",</div>
                <div className="text-rose-700 font-bold pl-3">"licenseExpiration": "2026-09-15",</div>
                <div className="text-slate-700 pl-3">"auditVerified": false,</div>
                <div className="text-slate-700 pl-3">"slaStatus": "OVERDUE"</div>
                <div className="text-slate-700">&#125;</div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                <div className="text-emerald-800 font-bold text-[11px] mb-2">AFTER HR APPROVAL & SYNC</div>
                <div className="text-slate-700">&#123;</div>
                <div className="text-slate-700 pl-3">"workerId": "EMP-10419",</div>
                <div className="text-emerald-700 font-bold pl-3">"complianceStatus": "VERIFIED_COMPLIANT",</div>
                <div className="text-emerald-700 font-bold pl-3">"licenseExpiration": "2028-09-15",</div>
                <div className="text-emerald-700 font-bold pl-3">"auditVerified": true,</div>
                <div className="text-slate-700 pl-3">"verifiedBy": "Maya (HR Operations)",</div>
                <div className="text-slate-700 pl-3">"verifiedAt": "2026-11-12T14:40:00Z"</div>
                <div className="text-slate-700">&#125;</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsInspectPayloadOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800"
              >
                Close Diff Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
