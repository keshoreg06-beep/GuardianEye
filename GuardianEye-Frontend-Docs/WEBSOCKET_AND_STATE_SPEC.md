# WebSocket & State Management Specification
## GuardianEye Frontend — Real-Time Architecture

## 1. Centralized WebSocket Manager

Build **one** `WebSocketManager` service — never open ad hoc connections
from individual pages/components.

```
BACKEND WEBSOCKET → WEBSOCKET MANAGER → EVENT ROUTER
→ APPLICATION STATE / QUERY CACHE → UI
```

Responsibilities: connect using the real backend protocol
(`/ws/events?token=<JWT>&warehouse_id=`, per `BACKEND_INTEGRATION_MAP.md`
§8), authenticate, scope subscription to the active warehouse, handle
reconnection with backoff, heartbeat (if the backend protocol requires it),
malformed-message tolerance (log + drop, never crash the app), and route
each parsed `WsEnvelope` to the correct handler.

## 2. Connection State Machine

```
CONNECTING → LIVE → (on drop) → RECONNECTING → LIVE
                                 ↳ (repeated failure) → OFFLINE
LIVE → (degraded signal from backend, if provided) → DEGRADED → LIVE
```
Drives the global `LiveIndicator` component (`● LIVE / DEGRADED /
RECONNECTING / OFFLINE`). Clicking the indicator can surface basic
connection diagnostics.

## 3. Event → State-Update Table

| Event | Handler action |
|---|---|
| `NEW_INCIDENT` | `queryClient.setQueryData`/prepend into the incidents list cache for the affected warehouse/zone scope; invalidate `["analytics","overview"]`; push into live event stream store; show toast/badge |
| `RISK_ESCALATED` | Patch the specific incident's cached risk fields only (no broader invalidation); trigger the `RiskOrbit`/`RiskBadge` transition animation for that entity |
| `ALERT_CREATED` | Prepend into the alerts cache grouped by severity; badge the Alerts nav item |
| `CAMERA_OFFLINE` | Patch that camera's cached `status` field; update the Camera Health tile in place |
| `PROCESSING_COMPLETE` / `PROCESSING_FAILED` | Patch the specific `processing_jobs`/video cache entry; toast |
| `REVIEW_UPDATED` / `REVIEW_REQUIRED` | Invalidate `["reviews","pending"]`; badge the Review Queue nav item |

**Golden rule:** one event updates only the relevant slice of UI state via
targeted `setQueryData`/`invalidateQueries` calls or a Zustand patch — never
a full page reload, never a blanket refetch of unrelated queries.

## 4. TanStack Query Conventions

- Query keys namespaced by domain + serialized params:
  `["incidents", {status, riskLevel, zoneId, page}]`,
  `["incident", incidentId]`, `["alerts", {status}]`,
  `["analytics","overview", {warehouseId, range}]`,
  `["assistant","conversation", conversationId]`.
- Mutations (status updates, review submissions, alert actions) use
  `onSuccess` to patch/invalidate the precise affected query keys — not a
  broad `invalidateQueries()` with no key.
- Stale time tuned per domain: near-real-time data (incidents, alerts,
  camera health) short/zero stale time relying on WebSocket push;
  slower-changing data (warehouses, zones, behaviour taxonomy) longer stale
  time.

## 5. Zustand Store Boundaries

Separate stores by concern, each holding only **UI/selection state**, never
server data:
- `sessionStore` — current user/role (hydrated from `/api/v1/users/me`,
  cached via TanStack Query, mirrored into Zustand only for quick
  synchronous access if needed).
- `selectionStore` — selected warehouse/zone/camera (cross-page context per
  `UX_INTERACTION_FLOWS.md`).
- `uiStore` — sidebar collapsed, active drawer/modal, command palette open.
- `filterStore` — active list filters, mirrored to/from URL query params so
  filtered views are shareable/bookmarkable.
- `liveEventStore` — the rolling live event stream feed shown on the
  Command Center (populated by the WebSocket manager, capped length, not
  persisted server data).

## 6. Animation-on-Update Rules

- Numeric metric changes (e.g. `72 → 75`): brief transition, not a jump-cut.
- New incidents: insert into the live stream/list with a short highlight,
  preserving scroll position/context.
- Risk changes: animate only the affected Risk Orbit/badge, not the whole
  dashboard.
- Never flash the entire screen for any single event.

## 7. Failure Handling

Handle explicitly (never silent failure): WebSocket connect failure, auth
rejection on the socket, malformed message payloads, repeated reconnect
failure (surface `OFFLINE` state + manual retry action), and REST API
failures parallel to a WebSocket outage (the app must remain usable via
polling/manual refresh fallback if real-time is down).
