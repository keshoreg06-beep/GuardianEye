# Page Specifications
## GuardianEye — Screen-by-Screen Requirements

Every section below states what to build **where the backend supports it**
(see `BACKEND_INTEGRATION_MAP.md`). If a referenced endpoint doesn't exist,
omit the sub-feature or show an honest "not yet available" state — never a
fabricated version.

## 0. Application Shell

**Sidebar:** GuardianEye branding, primary nav (Command Center · Monitor
[Live Monitoring, Cameras, Videos] · Intelligence [Incidents, Alerts,
Evidence/Replay, Analytics] · Spatial [Warehouse Map, Risk Heatmap, Digital
Twin] · AI [Assistant] · Learning [Review Queue, Datasets, Models,
Evaluation] · Reporting [Reports] · System [Settings]), active-route
highlighting, notification badges, collapsible (icon-only + tooltips when
collapsed).

**Topbar:** left = page title + breadcrumb + selected warehouse; center =
global search; right = live/system status, notifications, AI Assistant
shortcut, user menu, logout.

**Global search / Command Palette:** `Ctrl+K`, searches incidents, cameras,
zones, alerts, evidence, reports, warehouses; exposes actions ("Open Command
Center", "Search Incidents", "Ask AI", etc.); optional letter-shortcuts
(`G D`, `G I`, ...). Keyboard-navigable.

Navigation visibility may reflect RBAC for UX; backend remains the
enforcement authority on every action.

## 1. Authentication / Login

GuardianEye-branded login (see `DESIGN_SYSTEM.md` for the visual treatment):
email/password form, validation, loading state, and explicit handling of
`401 Unauthorized`, `403 Forbidden`, expired session, invalid credentials,
and backend-unavailable — via the real `/api/v1/auth/login` endpoint. No
alternate/fake auth system. Protects all private routes.

## 2. Command Center (primary screen)

**Purpose:** answer "what is happening in the warehouse right now?" — what,
where, how serious, why, what changed, what to investigate, what to do.
Asymmetric layout, not a KPI-card grid.

**Header:** title, selected warehouse, backend-supported time range selector
(only ranges the backend actually offers — e.g. Current/Today/Shift/24h/7d/
30d), last-updated timestamp, connection state.

**KPI modules** (only those backend provides): Current Risk, Active
Incidents, Critical Alerts, Cameras Online/Offline, Potential Damage,
Processing Jobs, Behaviour Events — each an interactive module with an
"Investigate/View" action, not a static card.

**Live Situation View:** spatial visualization of zones/cameras/entities
where backend data supports it (real geometry only); zone hover shows risk/
camera count/incident count/activity; click opens zone intelligence.

**Risk Orbit** (`RiskOrbit` component): current overall risk score/level,
optionally with supporting rings for backend-supported dimensions; animates
on real value changes only.

**Risk Distribution:** LOW/MEDIUM/HIGH/CRITICAL breakdown from real data,
filterable, clickable into filtered incident list.

**Active Incidents list:** ID, timestamp, camera, zone, behaviour, risk,
confidence, damage status, incident status — each row clickable → Incident
Details.

**Behaviour Trends:** chart using the real behaviour enum values (§Backend
Integration Map §4), interactive (hover/click/drill-down).

**High-Risk Zones:** zone, risk score, incident count, dominant behaviour,
recent event — clickable drill-down.

**Camera Health:** name, zone, online/offline, processing status, and
FPS/latency **only if returned by backend**.

**Live Event Stream:** real-time list (timestamp, severity, description,
camera/zone), each entry clickable/filterable/expandable, linked to evidence
where available — driven by WebSocket events (§Backend Integration Map §8).

**Event Timeline:** visual timeline (not just a table) of recent events;
clicking an event opens incident/evidence/context.

## 3. Live Monitoring

Professional operations interface, not a basic CCTV viewer.

**Layout:** main viewing area (large selected feed) + camera rail/grid
(smaller feeds) + intelligence sidebar (detected objects, active tracks,
behaviour, risk, alerts, camera state) + event timeline synchronized with
the feed where backend data supports it.

**Camera Feed:** video, timestamp, camera, zone, and — only if backend
provides them — detection boxes, track IDs, trajectories, behaviour/risk
labels. Overlays stay visually clean (no label clutter); real confidence
values only.

**Camera Health:** meaningful visualization (e.g. `● ONLINE`, health %,
latency, FPS) using **only** values the backend actually returns; degraded
state shown distinctly when backend reports it.

**Camera transitions:** smooth expand on selection, preserve zone/event
context; Camera → Incident preserves visual context rather than reloading
cold.

## 4. Videos

Where backend supports video management: list, metadata, processing status,
source, timestamp, duration, associated warehouse/camera, processing result,
linked incidents/evidence — all real backend data, including real job
status polling/WebSocket updates.

## 5. Incidents (Investigation Workspace)

Not a generic CRUD table. Search, filter (risk, behaviour, zone, camera,
status, date/time), sort, and **server-side pagination** — never load
unlimited records client-side.

**Table/list:** Incident, Timestamp, Camera, Zone, Behaviour, Risk,
Confidence, Damage, Status, Actions — strong visual hierarchy (risk +
behaviour prominent, metadata secondary). Status badges use only real
backend lifecycle values (§Backend Integration Map §6); only expose actions
actually permitted by backend/RBAC for the current status.

## 6. Incident Details (Signature Screen)

Header: Incident ID, behaviour, risk level, zone, camera, timestamp.

**Summary panel:** status, risk score/level, behaviour confidence, involved
objects/track IDs, workflow stage where available.

**Evidence:** snapshot, pre/event/post-event clips, metadata (timestamps,
camera, frame range, tracks, trajectory, behaviour sequence, checksum where
useful) — via `EvidenceViewer`, using real evidence URLs only.

**Incident Replay:** dedicated timeline (pre-event → event → post-event) —
seek, playback speed, timestamp inspection, behaviour-transition markers,
fullscreen — via `ReplayTimeline`.

**Behaviour DNA:** the real backend event sequence rendered via
`BehaviourDNA`, each stage clickable to show confidence/timestamp/
observation text where the backend provides it. Never invented client-side.

**Risk Intelligence:** `RiskOrbit`/`RiskFactorList` — score, level,
confidence, factor breakdown, explanation — exactly as returned; never
recalculated.

**"Why did this happen?" panel:** primary factor, contributing factors,
confidence, classification (`ClassificationTag`) — sourced from the
backend's root-cause/context data.

**Damage Intelligence:** `DamagePanel` — probability, predicted mode,
status — visually distinct from confirmed damage.

**Counterfactual ("What-If Safety"):** only if backend supports it —
observed vs. alternative scenario, estimated risk difference, assumptions,
explicitly labelled ESTIMATE/PREDICTION/SIMULATION.

**Root Cause:** primary cause, contributing factors, confidence,
classification, supporting evidence — never invented.

**Prevention Recommendation:** action, reason, confidence, source — never
fabricated.

**Similar Incidents:** via backend similarity search — similarity, date,
zone, behaviour, risk, evidence link; clicking opens the related incident.

**Audit history:** status changes with actor/timestamp/reason, from the real
audit log if exposed.

## 7. Alerts Center

Operational inbox grouped by severity (Critical/High/Medium), with
acknowledge/investigate/dismiss/resolve actions restricted to real backend
lifecycle states (§Backend Integration Map §6) and RBAC-permitted actions
only. Clicking an alert opens a contextual **Alert Drawer** (incident, risk,
camera, timestamp, evidence preview, recommendation, action buttons).

## 8. Notification Center

Critical alerts, system issues, camera issues, model events, review
requests, processing completion — subtle animation for new items, no
constant interruption.

## 9. Warehouse Map

Operational map (not a generic map product). Zones, cameras, people,
vehicles, equipment, products, trajectories, incidents, risk areas — **only
where backend geometry/data supports each layer**. Toggleable layers
(Cameras/People/Vehicles/Risk/Incidents/Historical Risk/Heatmap — only those
actually available). No invented geometry/coordinates. Zone hover → mini
intelligence card; click → full zone intelligence.

## 10. Risk Heatmap

Where supported: Incident Density, Risk Intensity, Damage Probability,
Behaviour Frequency layers; filterable by time/zone/behaviour/risk; real
backend data only, no hard-coded coordinates.

## 11. Digital Twin

Where backend geometry/live-entity data supports it: simplified 2D
operational visualization (warehouse, zones, cameras, people, equipment,
products, trajectories, risk zones, incidents). Not a physically accurate 3D
simulation unless explicitly required/supported. Hover/click → contextual
intelligence panel.

## 12. Analytics

Analytical storytelling, not a wall of charts. Only metrics the backend
actually supports: total/high-risk/critical incidents, behaviour frequency/
trends, damage probability, risk trends, zone risk, recurrent incidents,
severity, response/resolution time, prevention metrics, process-stage
metrics, shift/hour/day/week trends. Filters (date, shift, warehouse, zone,
camera, behaviour, risk, product, equipment, status) update charts/lists
together. Every chart supports drill-down (`TrendChart` + `DrillDownPanel`)
into underlying incidents → Incident Details. Avoid 3D charts, unnecessary
pies, decorative/non-functional graphs.

## 13. AI Assistant

An investigative intelligence interface, not a generic chatbot skin.
Architecture per `BACKEND_INTEGRATION_MAP.md` §10. Context-aware suggested
questions (only ones the backend can answer). Answers render via `AIMessage`
with confidence, evidence references (clickable), and explicit
insufficient-evidence handling. Never fabricates timestamps, incidents,
risk, objects, behaviours, damage, or root causes — grounding rules in
§Backend Integration Map §10 are absolute. Always distinguishes Observed/
Inferred/Predicted/Estimated/Confirmed/Unknown.

## 14. Human Review

Workspace communicating "AI detects and explains; humans validate and
decide." Review queue + `ReviewCard` (evidence, predicted behaviour,
confidence, the four verdict actions). `CHANGE_BEHAVIOUR` populates from the
real behaviour taxonomy. Distinct `EmergingBehaviourBadge` treatment for
`UNKNOWN`/`AMBIGUOUS`/`EMERGING` events, framed as system learning rather
than error.

## 15. Datasets (only if backend supports)

Dataset version, sample count, label distribution, quality, creation date,
status; version history visualization. Real metrics only.

## 16. Model Registry (only if backend supports)

Model lifecycle (`TRAINING → EVALUATION → CANDIDATE → APPROVED →
DEPLOYED`, plus `REJECTED/RETIRED`), real metrics (precision, recall, F1,
latency, version, dataset). Never invented.

## 17. Reports

Executive intelligence reports using real backend report capability:
warehouse, date range, risk summary, behaviour trends, incident summary,
damage exposure, recommendations, prevention metrics, operational trends.
No fabricated report data or capability.

## 18. Settings

Only sections the backend actually supports: Profile, Organization,
Warehouses, Cameras, Notifications, Roles, Integrations, AI Settings,
Security, Data Retention. Respect backend permissions per role.

## 19. System Monitoring (if monitoring data available)

CPU, GPU, RAM, FPS, inference latency, queue depth, processing time, camera
status, API latency, database/Redis health, storage usage, failed jobs —
real backend/monitoring data only (Prometheus/Grafana may back this at the
infrastructure level).

## Cross-Cutting States (apply to every page)

- **Loading:** context-specific skeletons (e.g. "CONNECTING TO CAMERA ● ● ●"
  for camera, "ANALYZING INCIDENT — Retrieving evidence... Evaluating
  intelligence..." for AI) — not a single generic spinner everywhere.
- **Empty:** always actionable copy, e.g. "NO ACTIVE INCIDENTS — your
  warehouse currently has no detected high-priority incidents. [View
  Historical Incidents]" / "NO CAMERAS CONNECTED — Connect a camera source
  to begin live warehouse intelligence. [Configure Cameras]".
- **Error:** human-readable, actionable (e.g. "CAMERA CONNECTION LOST — C14
  has stopped transmitting. Last frame: 14:32:08. [Retry Now] [View Camera
  Health]"). Never a raw stack trace.
- **Feedback:** every action confirms itself ("✓ Alert acknowledged", "✓
  Review submitted", "✓ Settings saved").
- **Dangerous actions:** explicit confirm dialog before consequential
  backend-workflow actions (e.g. confirming an incident).
