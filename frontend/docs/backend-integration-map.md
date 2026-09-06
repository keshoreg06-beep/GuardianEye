# Backend Integration Map

Status: F0 contract verification only.
Source of truth: the implemented backend under `backend/app`, not the product brief or later-phase UI assumptions.

## 1. Contract source and versioning

The actual backend is a FastAPI application created in `backend/app/main.py` and routes are mounted through `backend/app/api/v1/router.py`.

Verified facts:
- API root prefix is `/api/v1` via `settings.API_V1_STR` in `backend/app/core/config.py`.
- OpenAPI is served at `/api/v1/openapi.json` and docs are served at `/api/v1/docs`.
- The root liveness endpoint is `/health`.
- All implemented feature routes are registered under the v1 router namespace.
- There is no evidence of a `/v2` or alternate API version strategy in this repo.

Authentication model:
- Protected endpoints require a bearer token via `HTTPBearer` and `get_current_user()` in `backend/app/api/deps.py`.
- Token validation requires a valid access token payload with `type == "access"`.
- User existence and active status are checked before access is granted.
- Role enforcement is centralized by `require_roles()` for role-gated actions.

## 2. Supported backend surface

| Domain | Real endpoint(s) | Method | Auth | Contract summary |
| --- | --- | --- | --- | --- |
| Health | `/health`, `/api/v1/health` | GET | No | App liveness and service metadata |
| Auth | `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/refresh`, `/api/v1/auth/me` | POST, GET | Login/register/refresh are public; `/me` is protected | JWT-based login and profile retrieval |
| Users | `/api/v1/users` | GET | Protected | User list/profile queries |
| Videos | `/api/v1/videos/upload`, `/api/v1/videos`, `/api/v1/videos/{video_id}`, `/api/v1/videos/{video_id}/jobs` | POST, GET | Protected | Upload, query, and job metadata |
| Tracks | `/api/v1/tracks` and related track routes | GET | Protected | Tracking data retrieval |
| Zones | `/api/v1/zones` and related zone routes | GET, POST | Protected | Zone definitions and screening |
| Interactions | `/api/v1/interactions` | GET | Protected | Interaction/event feed capabilities |
| Behaviours | `/api/v1/behaviours/video/{video_id}` | GET | Protected | Behaviour event retrieval per video |
| Risk | `/api/v1/risks/event/{behaviour_event_id}` | GET | Protected | Deterministic risk scoring for a behaviour event |
| Alerts | `/api/v1/alerts`, `/api/v1/alerts/acknowledge` | GET, POST | Protected | Active alert listing and acknowledgements |
| Incidents | `/api/v1/incidents`, `/api/v1/incidents/{incident_id}`, `/api/v1/incidents/status` | GET, POST | Protected | Incident CRUD and lifecycle transitions |
| Evidence | `/api/v1/evidence/incident/{incident_id}` | GET | Protected | Evidence package and overlay retrieval |
| Replay | `/api/v1/replay/{incident_id}` | GET | Protected | Incident replay details |
| Analytics | `/api/v1/analytics/dashboard` | GET | Protected | Operational dashboard summary and heatmap metrics |
| Digital twin | `/api/v1/digital-twin/topology` | GET | Protected | Warehouse topology, zones, and camera viewpoints |
| Assistant | `/api/v1/assistant/chat` | POST | Protected | Grounded warehouse safety copilot |
| Storage | `/api/v1/storage` and related routes | POST, GET | Protected | Storage operations and file references |

## 3. Contract-level details by feature

### 3.1 Authentication and RBAC

Verified implementation:
- `backend/app/api/v1/auth.py`
- `backend/app/api/deps.py`
- `backend/app/core/security.py`

Endpoints:
- `POST /api/v1/auth/login` -> returns JWT access and refresh tokens (`Token` schema)
- `POST /api/v1/auth/register` -> creates a user (`UserCreate` / `UserResponse`)
- `POST /api/v1/auth/refresh` -> exchanges refresh token for access token
- `GET /api/v1/auth/me` -> returns current authenticated user

Request/response shape:
- `LoginRequest` includes `email` and `password`
- `Token` includes `access_token`, `refresh_token`, `token_type`, `expires_in`
- `UserResponse` includes role and account metadata

Frontend integration note:
- The frontend should treat login and refresh as authenticated API flows, never as local-only state.
- Protected routes require bearer tokens, so the client should add `Authorization: Bearer <token>` headers from the auth response.

### 3.2 Dashboard / analytics

Verified implementation:
- `backend/app/api/v1/analytics.py`
- `backend/app/schemas/analytics.py`

Endpoint:
- `GET /api/v1/analytics/dashboard`

Response model:
- `DashboardSummaryResponse`
  - `total_videos_processed`
  - `total_incidents_detected`
  - `critical_incidents`
  - `open_alerts`
  - `estimated_damage_loss_usd`
  - `mean_time_to_acknowledge_seconds`
  - `behaviour_distribution`
  - `risk_heatmaps`
  - `operational_health_status`

Frontend mapping:
- This is the real dashboard summary contract behind the app shell and KPI widgets.
- The frontend must not substitute fabricated metrics or static placeholders.

### 3.3 Alerts

Verified implementation:
- `backend/app/api/v1/alerts.py`
- `backend/app/schemas/alert.py`

Endpoints:
- `GET /api/v1/alerts`
- `POST /api/v1/alerts/acknowledge`

Request model:
- `AlertAcknowledgeRequest` includes `alert_id` and optional `comment`

Response model:
- `AlertResponse` includes `id`, `behaviour_event_id`, `zone_id`, `alert_level`, `message`, `status`, `deduplication_key`, `acknowledged_by`, `acknowledged_at`, `created_at`

Frontend mapping:
- This is the real contract for alert badges, top-of-screen counters, and acknowledgement actions.

### 3.4 Incidents lifecycle

Verified implementation:
- `backend/app/api/v1/incidents.py`
- `backend/app/schemas/incident.py`

Endpoints:
- `GET /api/v1/incidents`
- `GET /api/v1/incidents/{incident_id}`
- `POST /api/v1/incidents`
- `POST /api/v1/incidents/status`

Important request fields:
- `IncidentCreateRequest`: `behaviour_event_id`, `warehouse_id`, `zone_id`, `camera_id`, `title`, `summary`, `severity`
- `IncidentStatusUpdateRequest`: `incident_id`, `new_status`, `change_reason`, `assigned_to`, `resolution_notes`

Supported lifecycle statuses:
- `DETECTED`, `ALERTED`, `ACKNOWLEDGED`, `UNDER_REVIEW`, `CONFIRMED`, `REJECTED`, `ACTION_TAKEN`, `RESOLVED`

Frontend mapping:
- This is the real source for incident list, detail, and state-transition behavior.

### 3.5 Risk assessment

Verified implementation:
- `backend/app/api/v1/risks.py`
- `backend/app/schemas/risk.py`

Endpoint:
- `GET /api/v1/risks/event/{behaviour_event_id}`

Response model:
- `RiskAssessmentResponse`
  - `id`, `behaviour_event_id`
  - `risk_score`, `risk_level`, `is_actionable`
  - `recommended_action`, `factors`, `breakdown`

The backend returns a deterministic risk assessment based on the incident/behaviour context rather than a generic frontend rule engine.

### 3.6 Behaviour detection feed

Verified implementation:
- `backend/app/api/v1/behaviours.py`
- `backend/app/schemas/behaviour.py`

Endpoint:
- `GET /api/v1/behaviours/video/{video_id}`

Returned objects include:
- `id`, `video_id`, `behaviour_type`, `severity`, `start_frame`, `end_frame`, `start_time_seconds`, `end_time_seconds`, `duration_seconds`, `confidence`, `description`, `evidence`, `keyframe_indices`

Frontend mapping:
- This is the actual source for timeline and event-level analysis views.

### 3.7 Evidence package

Verified implementation:
- `backend/app/api/v1/evidence.py`
- `backend/app/schemas/evidence.py`

Endpoint:
- `GET /api/v1/evidence/incident/{incident_id}`

Returned objects include:
- `snapshot_path`, `clip_path`, `pre_event_seconds`, `post_event_seconds`, `sha256_checksum`, `overlay_data`

This is the contract for visual evidence review and forensic artifact presentation.

### 3.8 Digital twin topology

Verified implementation:
- `backend/app/api/v1/digital_twin.py`
- `backend/app/schemas/digital_twin.py`

Endpoint:
- `GET /api/v1/digital-twin/topology`

Response model includes:
- `warehouse_id`, `warehouse_name`, `dimensions_meters`
- `zones` with polygon metadata and risk multipliers
- `cameras` with positions and coverage zones
- `active_entity_count`

This contract is the backend’s explicit spatial model for digital-twin UI work.

### 3.9 Assistant / grounded AI

Verified implementation:
- `backend/app/api/v1/assistant.py`
- `backend/app/schemas/assistant.py`

Endpoint:
- `POST /api/v1/assistant/chat`

Request model:
- `query`, optional `warehouse_id`, optional `max_citations`

Response model:
- `answer`, `grounded_citations`, `is_grounded`, `confidence`, `suggested_followups`

This is the supported feature behind a grounded copilot experience.

## 4. Actual integration hooks for frontend

The current frontend app shell is wired as a React + TypeScript + Vite app, but the contract is still backend-driven.

Verified frontend service contract:
- `frontend/src/services/api.ts` calls the real backend via `baseURL: '/api/v1'`.
- It hits `/analytics/dashboard`, `/incidents`, `/alerts`, `/digital-twin/topology`, and `/assistant/chat`.
- The service does not implement mock data fallback for production use.

This means the F0 contract rule is:
- use backend live data only;
- if the backend is absent or unavailable, fail explicitly rather than inventing UI data.

## 5. Blockers and non-supported runtime features

The following were verified as absent from the implemented backend repo:

1. Camera live stream endpoints
   - No `/cameras`, `/live`, or equivalent stream inventory route was found in the implemented v1 router.
   - This is a clear gap versus a frontend “live streams” screen if one expects real camera streams from the backend.

2. WebSocket or streaming events layer
   - No WebSocket endpoint or real-time push service was found in the backend router set.
   - This means long-lived event streaming is not currently implemented in the repo as verified.

3. Camera management and device health APIs
   - No explicit camera registration, health-check, or control API was found in the v1 router surface.

4. Production-grade auth UI state
   - Auth is implemented as bearer-token based backend auth; the frontend still needs a real auth session layer, not a mock or static user profile.

## 6. F0 conclusion

The actual repo supports a credible warehouse safety operations stack with the following core capabilities:
- secure auth and RBAC
- incident tracking
- alert acknowledgement
- behaviour and risk analysis
- dashboard analytics
- evidence retrieval
- digital-twin topology
- grounded assistant chat

The repo does not currently support a true live camera stream or real-time push system in the implemented API surface, and no backend contract should be invented beyond what is verified here.

This is the stop point for F0. No later-phase UI implementation or speculative feature work is included in this contract map.
