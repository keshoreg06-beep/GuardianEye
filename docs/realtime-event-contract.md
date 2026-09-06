# GuardianEye Real-time Event Contract

This contract is intentionally narrow. It covers the backend event layer that is grounded in the repo’s verified state transitions:

- `AlertService.create_alert_if_actionable()` creates actionable alerts
- `IncidentService.create_incident()` creates a new incident in `DETECTED`
- `IncidentService.update_incident_status()` transitions through the allowed lifecycle states
- `AlertService.acknowledge_alert()` acknowledges an open alert

## WebSocket endpoint

- Path: `/api/v1/ws/events`
- Query params:
  - `token` required for authenticated subscriptions
  - `warehouse_id` optional to filter the stream to a warehouse

## Event envelope

```json
{
  "event": "INCIDENT_STATUS_CHANGED",
  "warehouse_id": "wh-123",
  "timestamp": "2026-01-01T12:00:00Z",
  "data": {
    "incident_id": "INC-ABCD1234",
    "from_status": "DETECTED",
    "to_status": "ALERTED",
    "change_reason": "Escalated to active response"
  }
}
```

## Supported event names

- `connection_ok` — emitted immediately after accepting a valid websocket subscription
- `connection_error` — emitted when the JWT token is missing/invalid
- `ALERT_CREATED` — emitted when an alert is created from an actionable behaviour risk
- `ALERT_ACKNOWLEDGED` — emitted when an alert status is changed to `ACKNOWLEDGED`
- `INCIDENT_STATUS_CHANGED` — emitted when an incident transitions between lifecycle states
- `INCIDENT_CREATED` — emitted when a new incident record is created in `DETECTED`

## Authentication behavior

The websocket requires a valid JWT access token. The backend validates `token` using the same decode logic as the REST auth system and rejects invalid or expired tokens.

## Publishing behavior

The event bus is intentionally in-memory and does not claim Redis pub/sub or Celery integration. It is only a minimal infrastructure layer for backend-owned event dispatching in the repository’s current state.

## Scope boundaries

This contract does not invent unsupported features such as:

- per-camera live stream broadcasting
- multi-room dashboard subscriptions beyond warehouse filtering
- arbitrary job status events not tied to verified backend entities
- frontend-specific transport semantics beyond websocket JSON payloads
