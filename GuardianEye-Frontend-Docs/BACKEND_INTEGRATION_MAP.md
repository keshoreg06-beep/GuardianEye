# Backend Integration Map
## GuardianEye Frontend ↔ Existing Backend Contract (Authoritative)

This document maps every frontend feature to the **actual GuardianEye backend
contract** (REST + WebSocket + auth + RBAC + enums), as defined in the
backend's own API/database specification. Treat this file as the frontend's
single source of truth for integration — build nothing that isn't traceable
to a row in these tables. If the live backend differs from what's written
here, **the live backend wins**: update this file first, then the frontend
code.

> Base path convention used throughout: `/api/v1/...`. Confirm the exact
> prefix against the running backend's OpenAPI schema (`/docs` or
> `/openapi.json`) before finalizing the API client — do not assume.

## 1. Authentication & Session

| Frontend need | Endpoint | Method | Auth | Notes |
|---|---|---|---|---|
| Login | `/api/v1/auth/login` | POST | none | `{email, password}` → `{token, role}` |
| Refresh token | `/api/v1/auth/refresh` | POST | Bearer | → `{token}` |
| Current user | `/api/v1/users/me` | GET | Bearer | role, permissions, warehouse scope |
| List users (Admin) | `/api/v1/users` | GET/POST | Bearer (Admin) | user management screen |

**Roles (RBAC):** `ADMIN, SUPERVISOR, SAFETY_OFFICER, ANALYST, OPERATOR`.
Frontend route guarding and nav visibility must mirror these roles, but the
backend is the enforcement authority — a hidden nav item is a UX nicety, not
security.

**Session handling:** store JWT in memory/secure storage per backend
guidance; handle `401` (redirect to login), `403` (show "not authorized",
never a stack trace), and token refresh transparently via the API client's
response interceptor.

## 2. Warehouses, Zones, Cameras (Settings + Map data source)

| Frontend need | Endpoint | Method |
|---|---|---|
| List/create warehouses | `/api/v1/warehouses` | GET / POST |
| List/create/update/delete zones | `/api/v1/zones?warehouse_id=` | GET / POST / PUT / DELETE |
| List/create cameras | `/api/v1/cameras?warehouse_id=` | GET / POST |
| Update camera | `/api/v1/cameras/{id}` | PUT |
| Camera health | `/api/v1/cameras/{id}/health` | GET |

**Zone schema (drives Warehouse Map & Risk Heatmap):** `id, warehouse_id,
name, zone_type (loading_bay|staging|storage|pedestrian_lane|forklift_lane|
restricted), polygon (list of [x,y])`. The frontend **never invents polygon
geometry** — if a zone lacks a polygon, render it in a list view only, not on
the spatial map.

**Camera schema:** `id, warehouse_id, zone_id, source_type
(file|rtsp|vms|webcam), stream_url, status (ONLINE|OFFLINE|DEGRADED), fps,
resolution, last_seen`. Only display FPS/latency/health numbers the backend
actually returns — never fabricate them (see PAGE_SPECIFICATIONS.md §Live
Monitoring).

## 3. Video & Processing (Videos page)

| Frontend need | Endpoint | Method |
|---|---|---|
| Upload video | `/api/v1/videos/upload` | POST (multipart) → `{video_id}` |
| List videos | `/api/v1/videos` | GET |
| Video detail | `/api/v1/videos/{id}` | GET |
| Trigger processing | `/api/v1/videos/{id}/process` | POST → `{job_id}` |
| Job status | `/api/v1/jobs/{id}` | GET → `{status, progress, error_message}` |

Job `status` enum: `QUEUED, RUNNING, DONE, FAILED`. Poll or (preferably)
subscribe to `PROCESSING_COMPLETE` / `PROCESSING_FAILED` WebSocket events
(§8) instead of hard-polling where the backend supports push updates.

## 4. Detection / Tracking / Behaviour (read-only inspection)

| Frontend need | Endpoint |
|---|---|
| Detections for a video | `GET /api/v1/detection?video_id=` |
| Tracks for a video | `GET /api/v1/tracks?video_id=` |
| Single track detail | `GET /api/v1/tracks/{id}` → trajectory, velocity, acceleration, status |
| Behaviour taxonomy (enum source) | `GET /api/v1/behaviours` |
| Behaviour events | `GET /api/v1/behaviours/events?video_id=&behaviour_id=&zone_id=&date_from=&date_to=` |
| Interactions | `GET /api/v1/interactions?video_id=` |

**Behaviour taxonomy (fetch from `/api/v1/behaviours`, do not hard-code
beyond this reference list):**
```
NORMAL, DROP, DRAG, THROW, ROUGH_HANDLING, INCORRECT_STACKING,
UNSTABLE_STACKING, INCORRECT_PLACEMENT, IMPROPER_EQUIPMENT_USAGE,
UNSAFE_LOADING_SEQUENCE, UNKNOWN, AMBIGUOUS, EMERGING
```
Always resolve display labels/colors from the fetched enum, not a frontend
constant — if the backend adds a behaviour, the UI must handle it gracefully
(fallback badge style + raw label) rather than breaking.

**Track status:** `ACTIVE, LOST, REACQUIRED` — a `LOST→REACQUIRED` transition
must never be presented to the user as a new/duplicate object.

## 5. Risk / Damage / Predictions

| Frontend need | Endpoint |
|---|---|
| Risk assessment for an event | `GET /api/v1/risk/{behaviour_event_id}` |
| Damage prediction for an event | `GET /api/v1/damage/{behaviour_event_id}` |
| Predictive risk for a zone | `GET /api/v1/predictions?zone_id=` |

**Risk response shape (drives Risk Orbit, Risk Factor list):**
```json
{"risk_score": 84, "risk_level": "HIGH", "confidence": 0.91,
 "factors": [{"label": "Behaviour severity", "value": 25},
             {"label": "Drop height", "value": 18}],
 "explanation": "Product was dropped from approximately 1.0 m during unloading."}
```
`risk_level` enum: `LOW, MEDIUM, HIGH, CRITICAL`. **Never recompute this in
the frontend** — render exactly what the backend returns.

**Damage response shape:**
```json
{"damage_probability": 0.82, "damage_category": "packaging_deformation",
 "damage_status": "POTENTIAL_DAMAGE", "confidence": 0.81}
```
`damage_status` enum: `NOT_OBSERVED, POTENTIAL_DAMAGE, CONFIRMED_BY_HUMAN,
CONFIRMED_BY_EXTERNAL_SYSTEM`. The UI must never render `POTENTIAL_DAMAGE`
with the same visual weight as a `CONFIRMED_*` state.

## 6. Incidents, Alerts, Evidence, Replay

| Frontend need | Endpoint |
|---|---|
| List incidents (filters) | `GET /api/v1/incidents?status=&risk_level=&zone_id=&date_from=&date_to=` |
| Incident detail | `GET /api/v1/incidents/{id}` |
| Update incident status | `PATCH /api/v1/incidents/{id}/status` `{status, notes}` |
| List alerts | `GET /api/v1/alerts?status=` |
| Update alert status | `PATCH /api/v1/alerts/{id}/status` `{status}` |
| Evidence for incident | `GET /api/v1/evidence/{incident_id}` |
| Replay/timeline data | `GET /api/v1/replay/{incident_id}` |

**Incident status enum (lifecycle — drives status badge + allowed actions):**
```
DETECTED → ALERTED → ACKNOWLEDGED → UNDER_REVIEW → CONFIRMED/REJECTED
→ ACTION_TAKEN → RESOLVED
```
**Alert status enum:** `OPEN, ACKNOWLEDGED, INVESTIGATING, RESOLVED,
DISMISSED`. Only render action buttons (`Acknowledge / Investigate /
Dismiss / Resolve`) that are valid for the current status **and** permitted
for the current user's role — fetch/derive allowed-transitions from the
backend response if it provides one; otherwise apply the documented lifecycle
order defensively.

**Incident detail response (drives the whole Incident Details page):**
```json
{
  "incident_id": "GE-10428", "status": "UNDER_REVIEW",
  "behaviour": "ROUGH_HANDLING", "zone": "Loading Bay 2", "camera_id": "CAM-04",
  "risk": {"score": 84, "level": "HIGH", "confidence": 0.91, "factors": {...}},
  "damage": {"probability": 0.82, "category": "packaging_deformation",
             "status": "POTENTIAL_DAMAGE", "confidence": 0.81},
  "evidence": {"clip_url": "...", "snapshot_url": "...",
               "trajectory": [...], "checksum": "..."},
  "root_cause": {"category": "process", "description": "...",
                 "is_ai_inferred": true, "confidence": 0.68},
  "recommendation": {"text": "...", "estimated_risk_reduction": [35, 50],
                      "confidence": 0.74},
  "counterfactual": {"observed_risk": 82, "alternative_risk": 31,
                      "alternative_scenario": "..."}
}
```
Every nested object here maps 1:1 to a UI panel in
`PAGE_SPECIFICATIONS.md` §Incident Details — use `is_ai_inferred` /
`confidence` fields directly to drive the Observed/Inferred badge, never
infer this classification client-side.

**Evidence URLs** (`clip_url`, `snapshot_url`) are backend-issued, potentially
signed/expiring — the frontend must not construct or guess these URLs, only
render what the API returns, and must handle an expired-URL error gracefully
(re-fetch the incident detail to get a fresh URL).

## 7. Root Cause / Recommendations / Counterfactual / Similar Incidents

| Frontend need | Endpoint |
|---|---|
| Root cause detail | `GET /api/v1/root-cause/{incident_id}` |
| Recommendation detail | `GET /api/v1/recommendations/{incident_id}` |
| Counterfactual detail | `GET /api/v1/counterfactual/{incident_id}` |
| Similar incidents | `GET /api/v1/search/similar-incidents?incident_id=` |

All three of root cause / recommendation / counterfactual carry a
confidence/estimate framing — the UI copy must always say "Estimated" /
"AI-inferred" per the field values, never present them as guaranteed outcomes.

## 8. WebSocket Contract (real-time layer)

```
WS /ws/events?token=<JWT>&warehouse_id=<id>
```

| Event type | Payload (typical) | Frontend effect |
|---|---|---|
| `NEW_INCIDENT` | `{incident_id, risk_level, behaviour, zone, timestamp}` | Insert into live event stream + incident list; badge/notification |
| `RISK_ESCALATED` | `{incident_id, old_level, new_level}` | Animate the affected Risk Orbit/badge only |
| `ALERT_CREATED` | `{alert_id, incident_id, severity}` | Add to Alerts Center, grouped by severity |
| `CAMERA_OFFLINE` | `{camera_id}` | Update camera health tile; do not reload the page |
| `PROCESSING_COMPLETE` | `{job_id, video_id}` | Update Videos page row; toast |
| `REVIEW_REQUIRED` | `{behaviour_event_id}` | Add to Human Review queue badge |

**Rule:** one WebSocket event updates only the relevant slice of UI state
(via targeted TanStack Query cache invalidation or Zustand state patch) —
never a full page reload or full dashboard re-fetch. See
`WEBSOCKET_AND_STATE_SPEC.md` for the manager architecture.

## 9. Analytics / Heatmap / Digital Twin

| Frontend need | Endpoint |
|---|---|
| KPI overview | `GET /api/v1/analytics/overview` |
| Behaviour frequency | `GET /api/v1/analytics/behaviours` |
| Zone/location analytics | `GET /api/v1/analytics/locations` |
| Shift comparison | `GET /api/v1/analytics/shifts` |
| Heatmap data | `GET /api/v1/heatmap?type=incident_density\|risk_intensity\|damage_probability\|behaviour_frequency` |
| Digital twin live state | `GET /api/v1/digital-twin/state` |

Only render the Digital Twin page if `/api/v1/digital-twin/state` (or
equivalent) actually returns zone/camera/entity geometry — otherwise show the
2D Warehouse Map fed purely by `zones`/`cameras` without live entity
positions.

## 10. AI Assistant / Search

| Frontend need | Endpoint |
|---|---|
| Ask assistant (text) | `POST /api/v1/assistant/query` `{text, conversation_id?, lang}` → `{answer, evidence_refs[], follow_up_suggestions[]}` |
| Ask assistant (voice, if supported) | `POST /api/v1/assistant/voice` multipart audio |
| Similar incidents | `GET /api/v1/search/similar-incidents?incident_id=` |

**Grounding contract:** every `evidence_refs[]` entry must be rendered as a
clickable reference (to the incident/camera/evidence it names) — never as
plain unlinked text. If `answer` indicates insufficient evidence (backend
convention — confirm exact signal, e.g. an `insufficient_evidence: true` flag
or a specific string), render the "insufficient evidence" state defined in
`PAGE_SPECIFICATIONS.md` §AI Assistant rather than a normal answer bubble.

## 11. Human Review / Datasets / Models / Evaluation

| Frontend need | Endpoint |
|---|---|
| Pending reviews | `GET /api/v1/reviews?status=pending` |
| Submit review | `POST /api/v1/reviews` `{behaviour_event_id, verdict, corrected_behaviour_id?, notes}` |
| Datasets | `GET /api/v1/datasets` |
| Dataset versions | `POST /api/v1/datasets/versions` `{dataset_id, notes}` |
| Models | `GET /api/v1/models` |
| Model versions | `GET /api/v1/models/{id}/versions` |
| Approve model version | `POST /api/v1/models/{id}/versions/{version_id}/approve` (Admin/ML lead only) |
| Evaluation metrics | `GET /api/v1/evaluation/{model_version_id}` |

**Review verdict enum:** `CORRECT, INCORRECT, CHANGE_BEHAVIOUR, UNCERTAIN`.
**Model status enum:** `TRAINING, EVALUATION, CANDIDATE/APPROVED, DEPLOYED,
RETIRED, REJECTED` — confirm exact enum against the live backend (some builds
use `CANDIDATE`, others `EVALUATION→APPROVED` directly; do not assume).

Build the Datasets/Models/Evaluation screens **only if these endpoints
exist** in the running backend — otherwise omit the nav section entirely
rather than shipping a dead page.

## 12. Config / Audit / System

| Frontend need | Endpoint |
|---|---|
| Risk thresholds | `GET/PUT /api/v1/config/thresholds` |
| Products config | `GET/POST /api/v1/config/products` |
| Equipment config | `GET /api/v1/config/equipment` |
| Audit log | `GET /api/v1/audit?entity_type=&entity_id=&date_from=&date_to=` |
| System health | `GET /api/v1/system/health` |
| System metrics | `GET /api/v1/system/metrics` |

## 13. Standard Error Shape

```json
{ "error": { "code": "STRING_CODE", "message": "Human readable message" } }
```
The API client must surface `error.message` in UI-facing error states and log
`error.code` for diagnostics — never show raw stack traces or unhandled
exception text to the user.

## 14. Contract-Change Discipline

If, during implementation, the running backend's actual response shape,
enum values, or endpoint path differs from this document:
1. Do not silently code around the discrepancy.
2. Update this map to reflect reality.
3. Note the discrepancy in the Data/Backend Request log
   (`FRONTEND_BUILD_PLAN_AND_GOVERNANCE.md`).
4. Only then implement against the corrected contract.

Never modify backend behavior to suit frontend convenience without explicit
sign-off — propose the smallest safe change instead.
