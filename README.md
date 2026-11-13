# Agentic Employee Records — Workforce Credential & Compliance Readiness (Healthcare Demo Prototype)

> **Synthetic Discovery Prototype (BioVanguard Health Systems)**  
> Complements Workday HCM and enterprise HR systems as a continuous workforce credentialing, applicability, evidence-tracking, and readiness layer.

---

## What Runs Locally in This Prototype

1. **Normalized Healthcare Workforce Domain Model (`src/types/index.ts`, `src/data/mockData.ts`)**
   - Separate entities for `Worker`, `Facility`, `EmploymentAssignment` (including concurrent multi-state assignments), `PolicyDocument`, `RuleDefinition`, `CredentialRequirement`, `EvidenceItem`, `CredentialVerification`, `ComplianceCase`, `EscalationRecord`, `ReviewDecision`, `RemediationTask`, `CommunicationThread`, `SyncTransaction`, `HRMSMirrorRecord`, and `AuditEvent`.
   - Four independent state dimensions:
     1. `EvidenceDocumentState` (Upload / classification — **uploading never verifies licensure**)
     2. `CredentialVerificationState` (Authoritative Primary Source Verification)
     3. `ClinicalDutyEligibilityState` (Clinical leadership decision only)
     4. `ExternalSyncState` (Scoped Workday staging writeback)
2. **Enforced Role & Privacy Boundaries (`src/domain/authorization.ts`, `src/domain/workflows.ts`)**
   - **Maya (HR Operations Lead):** Weekly triage, outreach, ordinary HR/training evidence, final administrative closure (blocked from clinical PSV and clinical duty authorization).
   - **Priya Sharma (Healthcare Compliance Admin):** Policy Library, Rule Builder, Executable Test Lab, Integrations, AI Governance (blocked from self-approving her own rule versions).
   - **Alex Morgan (Credentialing / Clinical Compliance Reviewer):** Simulated Primary Source Verification (`VERIFIED_ACTIVE`, `RESTRICTED`, `VERIFICATION_FAILED`, `UNVERIFIED`), clinical escalation review, and independent rule sign-off.
   - **David Miller (CHRO / VP People):** Read-only facility risk exposure, preboarding readiness, and capacity-vs-cash ROI modeling.
   - **Occupational Health PHI Exclusion:** Raw medical/ADA details are permanently blocked from HR, Admin, Executive views, Workday payloads, and exported evidence packets.
3. **Deterministic Rule Engine & Executable Test Lab (`src/domain/rules.ts`)**
   - Evaluates multi-state & job-profile applicability, Form I-9 List A vs List B+C acceptability, and sandbox test fixtures (`TP/TN/FP/FN`, returning `null` / `N/A` on zero denominator).
   - Draft rule `RULE-CA-PHARM-DRAFT` initially fails `FIX-05` (`Out-of-State Nevada License`) until the admin enables `disallowOutOfStateLicense` and reruns.
4. **Whole-File Readiness Recomputation (`src/domain/readiness.ts`)**
   - Readiness percentages are computed across *all* applicable requirements for a worker. Resolving 1 of 2 open cases leaves the worker Amber until every requirement is satisfied.
5. **Simulated Workday Integration Adapter (`src/integrations/MockWorkdayAdapter.ts`)**
   - Targets only `Workday_Custom_Compliance_Staging__c`, keeps Workday master identity/payroll read-only, supports HTTP 504 timeout simulation, and executes idempotent per-transaction retries.

---

## What Is Explicitly Simulated (Not Live Production)

- **Workday HCM & Licensing Boards / CVOs:** All inbound worker events, outbound staging writebacks, and board verification checks use local deterministic fixtures (`MockWorkdayAdapter` and simulated PSV fixtures). No live external API calls are made.
- **Browser Persona Switcher & Access Control:** Enforced in browser state for walkthroughs; production requires enterprise SSO (SAML/OIDC) and server-side RBAC.
- **Demonstration Event History:** Stored locally in `localStorage` and explicitly labeled `"Demonstration Event History (browser-local, not tamper-proof)"`. Production requires an append-only WORM/server audit store.
- **File Uploads:** Browser `<input type="file">` uses session-memory `URL.createObjectURL` previews without storing raw file bytes in `localStorage` and without performing server-side OCR or authenticity verification.

---

## Production Engineering Requirements

To move from discovery prototype to production deployment:
1. Replace browser persona switching with enterprise SSO (SAML 2.0 / OIDC) and server-side policy enforcement.
2. Implement authenticated Workday RaaS / REST / Studio connectors with encrypted secrets and dead-letter queues.
3. Integrate accredited CVO / state licensing board primary-source verification APIs.
4. Persist audit events in an immutable, tamper-evident server-side audit store with tenant isolation and KMS encryption.
5. Complete formal legal, HIPAA Business Associate, and InfoSec reviews before handling real PHI or clinical privileging workflows.

---

## Local Commands

```bash
npm install
npm test      # Runs domain unit tests via tsx --test src/domain/domain.test.ts
npm run lint  # TypeScript check (tsc --noEmit)
npm run build # Vite production bundle
npm run dev   # Starts Express + Vite dev server on port 3000
```
