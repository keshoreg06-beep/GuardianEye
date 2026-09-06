# Backend Capability Matrix

Status: F0 evidence-based mapping of implemented backend capabilities.

Legend:
- SUPPORTED = confirmed in the live backend route set and schemas
- PARTIALLY SUPPORTED = implemented, but scoped or weakly represented in current repo
- NOT SUPPORTED = no verified implementation in the backend contract
- UNKNOWN = not enough repo evidence to confirm a production contract

## Capability matrix

| Capability | Status | Evidence | Notes |
| --- | --- | --- | --- |
| User authentication | SUPPORTED | `backend/app/api/v1/auth.py`, `backend/app/api/deps.py`, `backend/app/core/security.py` | JWT-based auth with token validation and active-user checks |
| User registration | SUPPORTED | `backend/app/api/v1/auth.py` | Public registration endpoint exists |
| Role-based authorization | SUPPORTED | `backend/app/api/deps.py` | `require_roles()` enforces allowed roles |
| Video upload and metadata | SUPPORTED | `backend/app/api/v1/videos.py` | Upload and list/detail endpoints exist |
| Behaviour event retrieval | SUPPORTED | `backend/app/api/v1/behaviours.py` | Query by video id retrieving behaviour timeline |
| Risk scoring | SUPPORTED | `backend/app/api/v1/risks.py`, `backend/app/schemas/risk.py` | Deterministic assessment by behaviour event |
| Alert listing | SUPPORTED | `backend/app/api/v1/alerts.py` | Current active alerts supported |
| Alert acknowledgement | SUPPORTED | `backend/app/api/v1/alerts.py` | Endpoint exists and updates alert state |
| Incident lifecycle management | SUPPORTED | `backend/app/api/v1/incidents.py` | List, detail, create, status transition supported |
| Evidence package retrieval | SUPPORTED | `backend/app/api/v1/evidence.py` | Incident evidence package and overlays |
| Dashboard analytics | SUPPORTED | `backend/app/api/v1/analytics.py`, `backend/app/schemas/analytics.py` | KPI summary and operational health |
| Digital twin topology | SUPPORTED | `backend/app/api/v1/digital_twin.py` | Spatial zones, coverage, positions |
| Grounded copilot / assistant chat | SUPPORTED | `backend/app/api/v1/assistant.py`, `backend/app/schemas/assistant.py` | Query + grounded citations |
| Replay of incidents | SUPPORTED | `backend/app/api/v1/replay.py` | Retrieval of incident replay details |
| Storage operations | SUPPORTED | `backend/app/api/v1/storage.py` | Storage metadata and file operations |
| Live camera streams | NOT SUPPORTED | router inspection + no stream endpoints in v1 router | No verified live streaming contract |
| Real-time websocket update layer | NOT SUPPORTED | repo-wide route scan; no WebSocket usage found | No push-based event system observed |
| Camera inventory / device management | PARTIALLY SUPPORTED | `digital_twin` includes camera topology, but no explicit management API | Camera metadata exists in spatial model, but full management API is not evidenced |
| Notifications center / push notification service | NOT SUPPORTED | no push, pubsub, or notification route found | Not implemented in current backend repo |
| Multi-version API evolution | UNKNOWN | `settings.API_V1_STR = "/api/v1"` only | Versioning is v1-only as implemented |
| Location-based rule engine | PARTIALLY SUPPORTED | zone, behaviour, risk modules are present; no broad rule configuration API found | core support exists, but admin/editor API is not fully evidenced |
| F1 and later UI enhancements | NOT SUPPORTED in F0 | F0 scope explicitly excludes later-phase design and implementation | Keep this phase documentation-only |

## Product-level interpretation

The repo’s implemented backend is mature enough for the following user workflows:
- warehouse operations overview
- alert review and acknowledgement
- incident case tracking
- risk/behaviour analytics
- evidence review and incident replay
- grounded AI analysis based on warehouse context

The repo does not yet show a verified implementation for:
- live camera streams
- high-frequency real-time event pushes
- a full device/camera operational control plane
- a versioned API beyond `/api/v1`

## F0 gate status

The backend capability matrix supports a contract-first frontend plan, but it clearly forbids adding features that do not exist or cannot be verified in the live backend contract.

Proceeding into F1 design should only happen after confirming the missing features above are either intentionally out of scope or will be added in a separate backend milestone.
