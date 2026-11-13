import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BadgeCheck, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

export const CredentialVerificationQueue: React.FC = () => {
  const {
    activeRoleId,
    switchRole,
    can,
    cases,
    requirements,
    verifications,
    openWorkerDossier,
    runPrimarySourceVerification
  } = useApp();

  const [selectedOutcomeByCase, setSelectedOutcomeByCase] = useState<
    Record<string, 'VERIFIED_ACTIVE' | 'RESTRICTED' | 'VERIFICATION_FAILED' | 'UNVERIFIED'>
  >({});

  const canRunPSV = can('RUN_PRIMARY_SOURCE_VERIFICATION');

  const psvCases = cases.filter((c) => {
    const req = requirements.find((r) => r.requirementId === c.requirementId);
    return req?.verificationMethod === 'PRIMARY_SOURCE_VERIFICATION';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Credential Primary Source Verification (PSV) Queue
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Authoritative board verification queue. Uploading a file never satisfies PSV; only Credentialing Reviewer (Alex Morgan) can execute simulated board checks.
          </p>
        </div>

        {!canRunPSV.allowed && (
          <button
            onClick={() => switchRole('cred_alex', 'credential_verification')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch to Alex Morgan (Credentialing Reviewer)</span>
          </button>
        )}
      </div>

      {!canRunPSV.allowed && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
          <strong>Read-Only View for {activeRoleId}:</strong> {canRunPSV.reason}
        </div>
      )}

      <div className="space-y-3">
        {psvCases.map((c) => {
          const outcome = selectedOutcomeByCase[c.id] || 'VERIFIED_ACTIVE';
          const latestVerif = verifications.find((v) => v.requirementId === c.requirementId);

          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold text-teal-800">{c.caseNumber}</span>
                  <span className="font-semibold text-slate-900">{c.workerName}</span>
                  <span className="text-slate-500">
                    ({c.role} · {c.facilityName})
                  </span>
                </div>
                <div className="font-medium text-slate-800">{c.title}</div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                  <span>Document: <strong>{c.documentState}</strong></span>
                  <span>PSV State: <strong>{c.verificationState}</strong></span>
                  <span>Clinical: <strong>{c.clinicalEligibilityState.replace(/_/g, ' ')}</strong></span>
                </div>
                {latestVerif && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    Last PSV Receipt: <span className="font-mono">{latestVerif.receiptReference}</span> ({latestVerif.returnedStatus} by {latestVerif.verifierName})
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {c.verificationState === 'RESTRICTED' && (
                  <span className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Restricted / Escalated</span>
                  </span>
                )}

                {canRunPSV.allowed && c.workflowState !== 'resolved' && (
                  <>
                    <select
                      value={outcome}
                      onChange={(e) =>
                        setSelectedOutcomeByCase((prev) => ({
                          ...prev,
                          [c.id]: e.target.value as any
                        }))
                      }
                      aria-label={`Simulated PSV fixture for ${c.workerName}`}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                    >
                      <option value="VERIFIED_ACTIVE">VERIFIED_ACTIVE (Active)</option>
                      <option value="RESTRICTED">RESTRICTED (Board Hold)</option>
                      <option value="VERIFICATION_FAILED">VERIFICATION_FAILED (503 Error)</option>
                      <option value="UNVERIFIED">UNVERIFIED (Mismatch)</option>
                    </select>
                    <button
                      onClick={() => runPrimarySourceVerification(c.id, outcome)}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5"
                    >
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>Run PSV Fixture</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => openWorkerDossier(c.workerId, c.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1"
                >
                  <span>Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
