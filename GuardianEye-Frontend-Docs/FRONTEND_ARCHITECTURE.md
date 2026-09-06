# Frontend Architecture
## GuardianEye — Technical Architecture Specification

## 1. Technology Stack (approved, do not substitute without cause)

```
React · TypeScript · Vite
Tailwind CSS · shadcn/ui · CSS variables/design tokens
React Router
TanStack Query (server state) · Zustand (UI/app state)
React Hook Form · Zod
Recharts
Lucide (icons)
Native/backend-specified WebSocket client
Vitest (unit) · Playwright (E2E)
```

## 2. Folder Structure

```
src/
├── app/                # app shell, providers, root routing
├── routes/             # route definitions/lazy-loaded pages
├── layouts/            # AppShell, AuthLayout, etc.
├── components/
│   ├── ui/              # design-system primitives (Button, Badge, Card...)
│   ├── intelligence/     # RiskOrbit, RiskFactorList, BehaviourDNA, etc.
│   ├── monitoring/        # CameraFeed, CameraGrid, CameraHealth
│   ├── incidents/          # IncidentCard, IncidentTable, IncidentDrawer
│   ├── evidence/            # EvidenceViewer, ReplayTimeline
│   ├── analytics/            # TrendChart, DrillDownPanel
│   ├── spatial/                # WarehouseMap, RiskHeatmap, ZoneCard
│   ├── ai/                      # AIMessage, AIContextCard, AssistantPanel
│   ├── review/                   # ReviewCard, ReviewQueue
│   ├── datasets/                   # DatasetVersionList
│   ├── models/                       # ModelRegistryTable
│   └── reports/                        # ReportBuilder, ReportPreview
├── features/            # feature-level composition (per page/domain)
├── api/                 # typed API client functions, one module per domain
├── services/            # cross-cutting services (auth, websocket manager)
├── hooks/               # useIncidents(), useRiskAssessment(), useAuth(), ...
├── stores/              # Zustand stores (ui, selection, filters, session)
├── types/               # from TYPESCRIPT_DATA_CONTRACTS.md
├── utils/                # formatting, enum-label resolution, etc.
├── config/               # design tokens, feature flags, env
└── styles/               # Tailwind config, global CSS variables
```

Keep API logic, domain/business logic, state management, UI components, and
utilities properly separated. Do not embed API calls or backend-shape
assumptions directly inside page components — go through `api/` + `hooks/`.

## 3. API Layer

- One typed client module per backend domain (`api/incidents.ts`,
  `api/alerts.ts`, `api/analytics.ts`, `api/assistant.ts`, etc.), each
  exporting typed functions built on a shared `apiClient` (fetch/axios
  wrapper) that handles: base URL, auth header injection, JSON
  parsing, standardized error unwrapping (`ApiError` shape from
  `TYPESCRIPT_DATA_CONTRACTS.md`), and 401/403 handling.
- No component calls `fetch`/`axios` directly — always through `api/` +
  a TanStack Query hook in `hooks/`.
- Centralize pagination/filter/sort parameter building in one utility so
  every list screen (Incidents, Alerts, Videos, Reviews, Datasets, Models)
  composes query params identically.

## 4. State Management

**TanStack Query — server state:**
- All API responses (incidents, alerts, analytics, evidence, assistant
  responses, etc.).
- Query keys namespaced by domain + params, e.g.
  `["incidents", { status, riskLevel, zoneId, page }]`.
- WebSocket events trigger **targeted** `queryClient.invalidateQueries` or
  `setQueryData` calls (see `WEBSOCKET_AND_STATE_SPEC.md`) — never a global
  refetch-everything on every event.

**Zustand — UI/application state:**
- Selected warehouse, selected zone/camera (cross-page context),
  sidebar collapsed state, active filters (mirrored to URL params),
  command palette open/closed, drawer/modal state, local user
  preferences (e.g. saved views, if backend supports persistence).
- Never duplicate server data into Zustand — Zustand holds *what the user
  is looking at*, not *what the backend returned*.

## 5. Routing

React Router, route-level code splitting (lazy `import()` per top-level
page). Protected routes wrap every authenticated route; unauthenticated
users are redirected to `/login`. Route guard checks both "is authenticated"
and "has permission for this route" (mirrored RBAC — backend remains
authoritative on every mutating action).

## 6. WebSocket Layer

One centralized `WebSocketManager` service (see
`WEBSOCKET_AND_STATE_SPEC.md` for full spec) — never open ad hoc WebSocket
connections from individual page components. The manager owns: connection
lifecycle, auth, subscription scoping (by warehouse), reconnection/backoff,
heartbeat, malformed-message handling, and event routing into TanStack Query
cache updates / Zustand state patches / toast notifications.

## 7. Responsibility Boundary (restated, architecturally enforced)

Frontend layers only ever: **display, interact, filter, explain, navigate,
review, visualize.** No component computes risk, behaviour classification,
damage probability, root cause, or recommendations — those always come from
an API response. Enforce this in code review: any `risk =`, `behaviour =`,
or similar derived-intelligence assignment inside a component that isn't a
straight pass-through of an API field is a defect.

## 8. Error & Loading Architecture

- A shared `<AsyncBoundary>` (or equivalent) wraps data-dependent regions,
  rendering one of: loading skeleton (context-specific, see
  `RESPONSIVE_ACCESSIBILITY_TESTING.md`), empty state (context-specific
  copy), error state (human-readable message from `ApiError.error.message`,
  retry action), or the real content.
- Global API client intercepts `401` → redirect to login; `403` → render a
  "not authorized" state, never leak permission internals; 5xx → generic
  "something went wrong, retry" without stack traces.

## 9. Performance Architecture

- Route-level lazy loading; virtualized lists for incidents/alerts/reviews
  at scale; debounced search inputs; throttled high-frequency WebSocket UI
  updates (e.g. batch risk-orbit animation ticks); memoized chart data
  transforms; image/video lazy loading; bundle-size budget tracked in CI.
- Server-side pagination/filtering/sorting always preferred over
  client-side — never fetch "all incidents" and filter in the browser.

## 10. Security Architecture (frontend responsibilities)

- No secrets/API keys in frontend code or bundle.
- Evidence URLs rendered exactly as returned (potentially signed/expiring) —
  never constructed client-side.
- Sanitize any HTML rendering path (assistant answers, notes fields) — no
  `dangerouslySetInnerHTML` without sanitization.
- Respect backend authorization on every mutating action; a disabled/hidden
  button is UX, not security — the backend call must also be guarded.

## 11. Design-to-Backend Mapping Doc

If the project owner supplies additional design references (Figma,
screenshots, brand assets), maintain
`frontend/docs/design-to-backend-mapping.md` mapping:
```
Design Component → GuardianEye Feature → Backend Endpoint → Backend Data
→ Frontend Component
```
so visual requirements never silently drift from what the backend can
actually supply.
