# GUARDIANEYE FRONTEND — BUILD INSTRUCTIONS & MASTER PROMPT
### Standalone Document (Build Instructions + Ready-to-Paste Agentic Prompt)

> This document assumes the rest of the GuardianEye Frontend Requirements set
> exists alongside it (`FRONTEND_PRD.md`, `BACKEND_INTEGRATION_MAP.md`,
> `TYPESCRIPT_DATA_CONTRACTS.md`, `FRONTEND_ARCHITECTURE.md`,
> `DESIGN_SYSTEM.md`, `COMPONENT_LIBRARY.md`, `PAGE_SPECIFICATIONS.md`,
> `WEBSOCKET_AND_STATE_SPEC.md`, `UX_INTERACTION_FLOWS.md`,
> `RESPONSIVE_ACCESSIBILITY_TESTING.md`). Part A is the human-readable build
> guide; Part B is the exact text to paste into an agentic coding tool
> (Antigravity, Claude Code, or equivalent) to execute the build.

---

# PART A — BUILD INSTRUCTIONS

## A.1 Golden Rule

The GuardianEye backend already exists. Every frontend feature must be built
against its **real** contract — never invented. Before writing any screen:
inspect the live backend (OpenAPI schema, DB enums, WebSocket protocol,
auth/RBAC), confirm it matches `BACKEND_INTEGRATION_MAP.md` and
`TYPESCRIPT_DATA_CONTRACTS.md`, correct those documents if reality differs,
and only then build. If a needed capability doesn't exist on the backend,
log a Data/Backend Request (§A.7) — do not fake it.

## A.2 Build Order (F0–F20)

```
F0  Backend Contract Mapping         F11 AI Assistant
F1  Frontend Architecture Setup       F12 Human Review
F2  Design System                      F13 Datasets & Models (if supported)
F3  Authentication                      F14 Reports
F4  Application Shell                    F15 Settings
F5  Command Center                        F16 Full Real-Time Integration
F6  Live Monitoring                        F17 Full Frontend Testing
F7  Incidents & Alerts                      F18 Backend + Frontend Integration
F8  Evidence & Replay                        F19 Production Hardening
F9  Warehouse Map & Risk Heatmap               F20 Final Acceptance Test
F10 Analytics
```

Do not build randomly or out of order. Each level depends on the ones before
it (e.g. you cannot build Incident Details evidence/replay before
Authentication and the API layer exist).

### F0 — Backend Contract Mapping
Inspect the running backend directly (OpenAPI/`/docs`, DB schema, WebSocket
protocol, JWT/RBAC behavior, error format). Cross-check against
`BACKEND_INTEGRATION_MAP.md` and `TYPESCRIPT_DATA_CONTRACTS.md`; fix any
mismatch in the docs first. Do not proceed until this contract is genuinely
understood — this is the single most important gate in the whole build.

### F1 — Frontend Architecture Setup
Scaffold per `FRONTEND_ARCHITECTURE.md`: React + TypeScript + Vite +
Tailwind + shadcn/ui, routing, providers, a centralized typed API client,
TanStack Query + Zustand wiring, design tokens skeleton. Health-check page
that confirms it can reach the real backend.

### F2 — Design System
Implement the "Intelligence Layers" visual language from `DESIGN_SYSTEM.md`:
color tokens, typography, spacing/radius/shadow scales, and the core
component families in `COMPONENT_LIBRARY.md` (`ui/`, `intelligence/`
primitives like `RiskBadge`, `ClassificationTag`, `RiskOrbit`,
`BehaviourDNA`). Build these against realistic sample data shaped exactly
like `TYPESCRIPT_DATA_CONTRACTS.md` — not arbitrary mock shapes.

### F3 — Authentication
Real login/logout/session via the actual `/api/v1/auth/*` endpoints,
protected routes, RBAC-aware navigation, and explicit 401/403/expired-session
handling. No parallel/fake auth system.

### F4 — Application Shell
Sidebar, topbar, global search/command palette (`Ctrl+K`), notifications,
user menu, connection-state indicator, responsive nav — per
`PAGE_SPECIFICATIONS.md` §0.

### F5–F15 — Feature Pages
Build each page exactly per its section in `PAGE_SPECIFICATIONS.md`, wiring
every data view to its real endpoint in `BACKEND_INTEGRATION_MAP.md`:
Command Center (F5) → Live Monitoring (F6) → Incidents & Alerts (F7) →
Evidence & Replay (F8) → Warehouse Map & Risk Heatmap / Digital Twin (F9) →
Analytics (F10) → AI Assistant (F11) → Human Review (F12) → Datasets &
Models, only if the backend supports them (F13) → Reports (F14) → Settings
(F15). Skip or honestly stub (never fake) any sub-feature without backend
support.

### F16 — Full Real-Time Integration
Build the single centralized `WebSocketManager` per
`WEBSOCKET_AND_STATE_SPEC.md`; verify every event type
(`NEW_INCIDENT, RISK_ESCALATED, ALERT_CREATED, CAMERA_OFFLINE,
PROCESSING_COMPLETE/FAILED, REVIEW_UPDATED/REQUIRED`) triggers only its
documented **targeted** UI update — never a full-page or full-dashboard
refetch.

### F17 — Full Frontend Testing
Run TypeScript checks, lint, unit tests (Vitest), integration tests, and
Playwright E2E per `RESPONSIVE_ACCESSIBILITY_TESTING.md` §4. Fix every
discovered issue before moving on.

### F18 — Backend + Frontend Integration
Run the whole stack together — frontend, backend, AI pipeline, database,
storage, WebSockets — using real running services, not mocks. Execute the
full end-to-end flow in §A.6.

### F19 — Production Hardening
Full audit pass: security, performance, accessibility, responsiveness, API/
WebSocket failure handling, loading/empty/error states, RBAC, evidence
access, secrets, console errors, memory leaks.

### F20 — Final Acceptance
Only declare the frontend complete once every box in §A.8 is checked against
**real backend data**.

## A.3 Mandatory Per-Level Cycle

```
PLAN → IMPLEMENT → BUILD → TYPESCRIPT CHECK → LINT → UNIT TESTS
→ INTEGRATION TESTS (where applicable) → BROWSER TESTING (where applicable)
→ API/WEBSOCKET VALIDATION → CONSOLE/NETWORK INSPECTION
→ RESPONSIVE/ACCESSIBILITY INSPECTION → FIX ERRORS → RE-TEST
→ LEVEL AUDIT → GIT DIFF REVIEW → COMMIT → PUSH → VERIFY PUSH
→ REPORT → NEXT LEVEL
```
Never skip a stage. Never proceed past a level with a known critical error.
Never commit or push unverified work.

## A.4 Level Audit Template

```
GUARDIANEYE FRONTEND — LEVEL AUDIT
Level:                    Objective:
Implemented:              Files changed:
Tests run:                Test results:
Errors found:             Errors fixed:
Console/network check:    Responsive check:
Accessibility check:      Security check:
Backend contract check:   (confirms real endpoints used, no fabricated data)
Git branch:  Commit:  Commit message:  Push status:  Working tree:
Known limitations:
Employer input required:
Final status: PASSED / PASSED_WITH_LIMITATIONS / BLOCKED / FAILED
```

## A.5 Git Protocol

Repository already exists — inspect first, never blindly reinitialize:
```bash
git status
git remote -v
git branch --show-current
```
Never force-push, never delete history, never overwrite another
contributor's work. Commit only after every applicable check in §A.3 passes.
Use conventional-commit messages scoped to `frontend`:
```
feat(frontend): implement command center
feat(frontend): add incident management UI
feat(frontend): integrate realtime monitoring
fix(frontend): handle websocket reconnect
test(frontend): add incident e2e coverage
```
Push to the real current branch, verify the push landed, record the commit
hash in the level audit. Never vague messages like `update`/`changes`/`final`.

## A.6 Final End-to-End Flow (must pass against the real backend)

```
LOGIN → COMMAND CENTER → SELECT WAREHOUSE → LIVE MONITORING
→ SELECT CAMERA → RECEIVE REAL-TIME EVENT → BEHAVIOUR EVENT APPEARS
→ RISK APPEARS → INCIDENT CREATED → ALERT APPEARS → OPEN INCIDENT
→ VIEW EVIDENCE → REPLAY EVENT → VIEW BEHAVIOUR TIMELINE
→ VIEW RISK FACTORS → VIEW DAMAGE PREDICTION → VIEW ROOT CAUSE
→ VIEW RECOMMENDATION → VIEW SIMILAR INCIDENTS → HUMAN REVIEW
→ SUBMIT REVIEW → ANALYTICS UPDATE → OPEN AI ASSISTANT → ASK QUESTION
→ AI RETRIEVES RELEVANT EVIDENCE → OPEN SUPPORTING INCIDENT
```

## A.7 Data / Backend Request Protocol

When something genuinely required is unavailable (missing endpoint,
undocumented enum, missing design assets/credentials/sample data), stop and
log it — never invent a substitute:
```
GUARDIANEYE FRONTEND — DATA/BACKEND REQUEST
What I need:                          Why I need it:
Where it will be used:                 Accepted format:
Can development continue without it:    yes/no
If yes, honest fallback I'll build instead:
If no: BLOCKED — WAITING FOR INPUT
```

## A.8 Final Acceptance Checklist (abbreviated — see full version in
`FRONTEND_BUILD_PLAN_AND_GOVERNANCE.md` §9 for the complete list)

```
[ ] Architecture: clean React/TS, reusable components, central API/WS layer
[ ] Auth: login/logout/session/RBAC/401/403/expired-session all real
[ ] Every page wired to real backend data, no fabricated content anywhere
[ ] Risk/damage/root-cause/recommendations rendered, never recalculated
[ ] Real-time events trigger only targeted, correct UI updates
[ ] AI Assistant grounded, evidence-linked, insufficient-evidence handled
[ ] All states present: loading/empty/error/offline/reconnecting
[ ] TypeScript, lint, unit, integration, E2E all pass; build succeeds
[ ] No secrets, RBAC respected, no raw stack traces shown
[ ] Responsive + accessible across all target breakpoints
[ ] Visual identity passes the Final Design Test (`DESIGN_SYSTEM.md` §10)
```

---

# PART B — READY-TO-PASTE MASTER BUILD PROMPT

> Paste the block below as the system/task prompt for your agentic coding
> tool. It assumes the tool has access to the full GuardianEye Frontend
> Requirements documentation set as project context.

```
You are the senior frontend architect, UI/UX designer, React/TypeScript
engineer, integration engineer, and QA lead building the complete
GuardianEye frontend. I am the project owner/employer. The GuardianEye
backend already exists — your job is production integration, not a
prototype.

Read, before writing any code: FRONTEND_PRD.md, BACKEND_INTEGRATION_MAP.md,
TYPESCRIPT_DATA_CONTRACTS.md, FRONTEND_ARCHITECTURE.md, DESIGN_SYSTEM.md,
COMPONENT_LIBRARY.md, PAGE_SPECIFICATIONS.md, WEBSOCKET_AND_STATE_SPEC.md,
UX_INTERACTION_FLOWS.md, RESPONSIVE_ACCESSIBILITY_TESTING.md, and this
document's Part A.

NON-NEGOTIABLE RULES:
1. Every page, component, metric, chart, incident, alert, camera status,
   evidence item, AI response, risk score, behaviour, recommendation,
   prediction, or workflow state must be driven by real backend data
   reachable through BACKEND_INTEGRATION_MAP.md. Never invent data,
   endpoints, enums, or AI outputs. If something needed doesn't exist on
   the backend, stop and issue a Data/Backend Request (Part A §A.7) instead
   of faking it.
2. Do not redesign, rewrite, or break the existing backend to make the
   frontend easier. Report backend problems; propose the smallest safe fix;
   only touch the backend with explicit permission.
3. Locked stack: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React
   Router, TanStack Query, Zustand, React Hook Form + Zod, Recharts, Lucide,
   Vitest, Playwright. Do not substitute without cause.
4. Frontend responsibility boundary: display, interact, filter, explain,
   navigate, review, visualize — ONLY. Never compute behaviour, risk,
   damage probability, or root cause in the frontend; always render what
   the backend returns.
5. Visual identity follows DESIGN_SYSTEM.md exactly — the "Intelligence
   Layers" language, the anti-generic-dashboard rules, and the Final Design
   Test. Every important metric must lead to an investigation (drill-down),
   per UX_INTERACTION_FLOWS.md.
6. Every AI-derived claim (risk, root cause, recommendation, prediction,
   counterfactual, assistant answer) must carry an explicit
   Observed/Inferred/Predicted/Estimated/Confirmed/Unknown classification —
   sourced from real backend fields, never inferred client-side.
7. One centralized WebSocketManager; each real-time event updates only its
   documented, targeted slice of UI state (WEBSOCKET_AND_STATE_SPEC.md) —
   never a full-page or full-dashboard refetch.
8. Follow the exact per-level cycle in Part A §A.3 for every unit of work:
   plan → implement → build → typecheck → lint → test → audit → fix →
   verify → commit → push → report → next. Never skip a stage, never
   commit/push unverified work, never hide errors, never fabricate test
   results or claim completion without actually running and verifying.
9. Git repo already exists — inspect (`git status`, `git remote -v`,
   `git branch --show-current`) before any git operation; never force-push,
   never delete history, never reinitialize a repo that already has
   history.
10. After every level, produce the Level Audit (Part A §A.4) and the Git
    Release Report before moving to the next level.

Build in this exact order: F0 Backend Contract Mapping → F1 Architecture →
F2 Design System → F3 Authentication → F4 Application Shell → F5 Command
Center → F6 Live Monitoring → F7 Incidents & Alerts → F8 Evidence & Replay
→ F9 Warehouse Map & Risk Heatmap → F10 Analytics → F11 AI Assistant →
F12 Human Review → F13 Datasets & Models (only if backend supports) →
F14 Reports → F15 Settings → F16 Full Real-Time Integration →
F17 Full Frontend Testing → F18 Backend + Frontend Integration →
F19 Production Hardening → F20 Final Acceptance Test.

Do not start F5+ until F0–F4 are verified and audited. Do not declare F20
complete until the full end-to-end flow (Part A §A.6) passes against the
real running backend and every item in the Final Acceptance Checklist
(Part A §A.8) is checked.

Begin with F0. First response: confirm which backend documentation and live
backend access you have, list any discrepancies you find between the
documented contract and the real backend, list any missing information you
need from me before proceeding (design assets, credentials, sample data),
and then start the Backend Contract Mapping audit.
```
