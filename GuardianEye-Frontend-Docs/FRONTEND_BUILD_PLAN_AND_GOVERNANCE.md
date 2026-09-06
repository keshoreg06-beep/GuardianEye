# Frontend Build Plan & Governance
## GuardianEye — Build Levels, Git/Audit Protocol, Data-Request Protocol, Final Acceptance

## 1. Build Order (F0–F20)

```
F0  Backend Contract Mapping        F11 AI Assistant
F1  Frontend Architecture Setup      F12 Human Review
F2  Design System                     F13 Datasets & Models (if supported)
F3  Authentication                     F14 Reports
F4  Application Shell                   F15 Settings
F5  Command Center                       F16 Full Real-Time Integration
F6  Live Monitoring                       F17 Full Frontend Testing
F7  Incidents & Alerts                     F18 Backend + Frontend Integration
F8  Evidence & Replay                       F19 Production Hardening
F9  Warehouse Map & Risk Heatmap              F20 Final Acceptance Test
F10 Analytics
```

**F0 — Backend Contract Mapping (do this before any major UI work):**
Inspect the real backend (OpenAPI schema, DB schema, WebSocket protocol,
enums, auth/RBAC, error format). Confirm or correct
`BACKEND_INTEGRATION_MAP.md` and `TYPESCRIPT_DATA_CONTRACTS.md` against
reality. Do not proceed to F1+ until this contract is genuinely understood.

**F1 — Architecture:** scaffold per `FRONTEND_ARCHITECTURE.md` (React+TS+
Vite+Tailwind+shadcn/ui, routing, providers, API client, state management,
design tokens).

**F2 — Design System:** implement branding, typography, colors, spacing,
core primitives, and the intelligence/evidence/risk component families from
`COMPONENT_LIBRARY.md`.

**F3 — Authentication:** real login/session/logout, protected routes,
permissions, RBAC UX, 401/403/expired-session handling.

**F4 — Application Shell:** sidebar, topbar, navigation, notifications, user
menu, global search/command palette, responsive nav, connection indicator.

**F5–F15** — build each page per `PAGE_SPECIFICATIONS.md`, wiring every data
view to the real endpoint in `BACKEND_INTEGRATION_MAP.md`; skip/omit any
sub-feature the backend doesn't yet support rather than faking it.

**F16 — Full Real-Time Integration:** verify WebSocket auth, connection,
reconnection, and every event → targeted state-update path in
`WEBSOCKET_AND_STATE_SPEC.md` actually fires correctly against the real
backend.

**F17 — Full Frontend Testing:** TypeScript, lint, unit, integration,
Playwright E2E — fix all discovered issues (see
`RESPONSIVE_ACCESSIBILITY_TESTING.md` §4–5).

**F18 — Full Backend/Frontend Integration:** test frontend + backend + AI +
database + storage + WebSockets together using actual running services, not
mocks.

**F19 — Production Hardening:** security, performance, accessibility,
responsiveness, API/WebSocket-failure handling, loading/empty/error states,
authentication/RBAC, evidence access, secrets, console errors, memory leaks
— full audit pass.

**F20 — Final Acceptance:** only declare the frontend complete after the
Final Acceptance Checklist (§5) passes in full, against real backend data.

## 2. Mandatory Per-Level Cycle

```
PLAN → IMPLEMENT → BUILD → TYPESCRIPT CHECK → LINT → UNIT TESTS
→ INTEGRATION TESTS (where applicable) → BROWSER TESTING (where applicable)
→ API/WEBSOCKET VALIDATION → CONSOLE/NETWORK INSPECTION
→ RESPONSIVE/ACCESSIBILITY INSPECTION → FIX ERRORS → RE-TEST
→ LEVEL AUDIT → GIT DIFF REVIEW → COMMIT → PUSH → VERIFY PUSH
→ REPORT → NEXT LEVEL
```
Never proceed past a level with a known critical error. Never commit or push
an unverified level.

## 3. Git Protocol

The repository already exists — inspect first, never blindly `git init`:
```bash
git status
git remote -v
git branch --show-current
```
Never force-push, never delete history, never overwrite another
contributor's work unless explicitly instructed.

**Commit only verified work** — every applicable box in the per-level cycle
(§2) must pass first. **Commit messages** use conventional-commit style,
specific to the change:
```
feat(frontend): implement command center
feat(frontend): add incident management UI
feat(frontend): integrate realtime monitoring
fix(frontend): handle websocket reconnect
test(frontend): add incident e2e coverage
```
Never vague messages (`update`, `changes`, `final`). Push to the actual
current branch (`git push origin <branch>`), verify the push landed, and
record the commit hash in the level audit.

## 4. Level Audit Template

After every level, produce:
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
Never mark a level `PASSED` while a critical error or fabricated-data issue
remains.

## 5. Data / Backend Request Protocol

When a feature genuinely needs something not yet available — a missing
endpoint, an undocumented enum, missing design assets, missing credentials,
missing sample data/screenshots — stop and log it rather than inventing a
substitute:
```
GUARDIANEYE FRONTEND — DATA/BACKEND REQUEST
What I need:            [exact requirement]
Why I need it:           [reason]
Where it will be used:    [feature/page]
Accepted format:           [format]
Can development continue without it:  yes/no
If yes, what I'll build instead (honest fallback, not a fake):
If no: BLOCKED — WAITING FOR INPUT
```
Do not fabricate: logos, Figma files, screenshots, color palettes,
credentials, warehouse layouts, camera configs, sample videos/evidence,
sample backend responses, business/permission rules, report formats,
notification rules.

## 6. Backend-Change Discipline

The backend already exists — do not redesign or modify it just to make the
frontend easier to build. If a real backend problem blocks frontend work:
document it, confirm it's a genuine blocker (not a convenience request),
report it, propose the smallest safe fix, and only change the backend with
explicit permission — preserving existing contracts wherever possible.

## 7. Anti-Pattern Reminder (do not ship any of these)

Fake/mock data presented as real; disconnected pages not wired to real
endpoints; generic AI-dashboard visual clichés (see `DESIGN_SYSTEM.md` §9);
duplicated AI/risk logic computed in the frontend; unhandled 401/403/5xx;
raw stack traces shown to users; unbounded client-side lists with no
pagination; uncontrolled WebSocket connections opened per-page; silently
broken backend contracts.

## 8. Final Acceptance — End-to-End Test

The frontend is not complete until this full flow works against the real
running backend:
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

## 9. Final Acceptance Checklist

```
ARCHITECTURE
[ ] Clean React/TS architecture  [ ] Reusable components  [ ] Central API layer
[ ] WebSocket layer               [ ] State management     [ ] Proper routing

AUTHENTICATION
[ ] Login/logout  [ ] Session handling  [ ] Protected routes
[ ] RBAC          [ ] 401/403 handling   [ ] Expired-session handling

COMMAND CENTER / MONITORING / INCIDENTS / EVIDENCE
[ ] Real backend data throughout    [ ] Interactive drill-down everywhere
[ ] Live monitoring + overlays (where backend supports)
[ ] Incident list/detail/status/audit history
[ ] Evidence viewer + replay + Behaviour DNA

INTELLIGENCE
[ ] Risk (score/level/factors/confidence) rendered, never recalculated
[ ] Damage status correctly distinguished (potential vs confirmed)
[ ] Root cause / recommendations / counterfactual labelled appropriately
[ ] Similar incidents linked

ANALYTICS / SPATIAL / AI / REVIEW
[ ] Analytics filters + drill-down + incident linking
[ ] Warehouse map / risk heatmap / digital twin (where supported)
[ ] AI Assistant grounded, evidence-linked, insufficient-evidence handling
[ ] Human review queue + verdict actions + emerging-behaviour treatment

ML MANAGEMENT / REPORTING / SETTINGS (only if backend supports)
[ ] Datasets/Models with real metrics only
[ ] Reports with real data only
[ ] Settings scoped to real permissions

RELIABILITY / QUALITY / SECURITY / UX
[ ] Loading/empty/error/offline/reconnecting states everywhere
[ ] TypeScript, lint, unit, integration, E2E all pass
[ ] Production build succeeds, no critical console errors
[ ] No hardcoded secrets, secure evidence access, RBAC respected
[ ] Responsive across all breakpoints, accessible, reduced-motion support

VISUAL QUALITY
[ ] Distinctive GuardianEye identity, passes the Final Design Test
[ ] No generic-dashboard anti-patterns present
```

Do not declare the frontend complete until every applicable box is checked
against the real backend.
