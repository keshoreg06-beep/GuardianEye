# GUARDIANEYE — Frontend Requirements Documentation Set

Complete, backend-integrated frontend requirements package for the GuardianEye
AI-powered warehouse behaviour, risk, damage-prevention, evidence, and
operational-intelligence platform. This set is written **against the existing
GuardianEye backend contract** (the API surface, database schema, WebSocket
events, and behaviour taxonomy already defined in the backend documentation
set) so the frontend integrates correctly on the first attempt — no invented
endpoints, no invented data shapes.

## Document Index

| # | Document | Purpose |
|---|---|---|
| 1 | `README.md` | This file |
| 2 | `FRONTEND_PRD.md` | Product requirements — purpose, users, scope, principles, non-goals |
| 3 | `BACKEND_INTEGRATION_MAP.md` | **Source of truth** — every frontend feature mapped to its real backend endpoint, schema, auth, permission, and WebSocket event |
| 4 | `TYPESCRIPT_DATA_CONTRACTS.md` | TypeScript types mirroring the backend Pydantic/DB schema, ready to drop into `src/types/` |
| 5 | `FRONTEND_ARCHITECTURE.md` | Folder structure, API layer, state management, routing, responsibility boundaries |
| 6 | `DESIGN_SYSTEM.md` | Visual identity ("Intelligence Layers"), color/typography/motion tokens, anti-generic-dashboard rules |
| 7 | `COMPONENT_LIBRARY.md` | Reusable component specs with props tied directly to backend data contracts |
| 8 | `PAGE_SPECIFICATIONS.md` | Screen-by-screen requirements (Command Center → Settings) |
| 9 | `WEBSOCKET_AND_STATE_SPEC.md` | Real-time event contract + TanStack Query/Zustand state architecture |
| 10 | `UX_INTERACTION_FLOWS.md` | Navigation model, drill-down flows, information hierarchy, signature "WOW" interactions |
| 11 | `RESPONSIVE_ACCESSIBILITY_TESTING.md` | Breakpoints, accessibility requirements, full QA/testing plan |
| 12 | `FRONTEND_BUILD_PLAN_AND_GOVERNANCE.md` | F0–F20 build levels, audit/git protocol, final acceptance checklist |

## How to Use This Set

1. **Before writing any code**, read `BACKEND_INTEGRATION_MAP.md` and
   `TYPESCRIPT_DATA_CONTRACTS.md` — these are authoritative. If the real
   backend differs from what's documented here, the real backend wins; update
   these docs to match and proceed.
2. Read `FRONTEND_PRD.md` and `DESIGN_SYSTEM.md` for product intent and visual
   language before building any screen.
3. Use `PAGE_SPECIFICATIONS.md` + `COMPONENT_LIBRARY.md` as the implementation
   spec for each screen.
4. Follow `FRONTEND_BUILD_PLAN_AND_GOVERNANCE.md` for build order, and its
   acceptance checklist to know when a page is actually done.

## Governing Rule

Every page, component, metric, chart, incident, alert, camera status, evidence
item, AI response, risk score, behaviour, recommendation, prediction,
workflow, or status shown in the frontend must be driven by **real backend
data** reachable through the contract in `BACKEND_INTEGRATION_MAP.md`. If a
capability isn't in the backend contract, it is not built — it is flagged as
a data/backend request instead (see `FRONTEND_BUILD_PLAN_AND_GOVERNANCE.md`
§ Data Request Protocol).
