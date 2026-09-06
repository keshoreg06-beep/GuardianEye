# Component Library
## GuardianEye — Reusable Component Specifications

Every component's props are tied directly to the data contracts in
`TYPESCRIPT_DATA_CONTRACTS.md` — build these once in `components/` and reuse
everywhere; do not recreate variants per page.

## Design-System Primitives (`components/ui/`)
`Button, Badge, Card, Table, Tabs, Dialog, Drawer, Tooltip, Skeleton,
Toast/Notification, EmptyState, ErrorState, LoadingState, FilterBar,
CommandPalette, StatusDot` — all driven by the design tokens in
`DESIGN_SYSTEM.md` §11.

## Intelligence Components (`components/intelligence/`)

**`RiskBadge`** — props: `level: RiskLevel, score?: number`. Renders label +
score + icon/shape per level — never color alone.

**`RiskOrbit`** — props: `assessment: RiskAssessment`. The "Risk Orbit"
visualization (§ Design System) — center score/level, animated transition
when `assessment` changes via WebSocket-driven refetch. Never computes a
score; purely renders `risk_score`/`risk_level`.

**`RiskFactorList`** — props: `factors: RiskFactor[], explanation: string`.
Renders the "WHY?" breakdown list exactly as returned by the backend.

**`RiskPulse`** — wraps a child indicator with a subtle pulse animation,
active only when `level` is `HIGH`/`CRITICAL`.

**`BehaviourDNA`** — props: `sequence: string[], event: BehaviourEvent`.
Renders the temporal stage sequence (e.g. `APPROACH → PICKUP → MOVEMENT →
ACCELERATION → LOSS_OF_CONTROL → DROP → IMPACT → STATIONARY`) from the
backend's actual `sequence` field; each stage clickable to reveal
per-stage confidence/timestamp/observation text where the backend provides
it.

**`DamagePanel`** — props: `damage: DamagePrediction`. Renders probability +
category + status, visually distinguishing `POTENTIAL_DAMAGE` from any
`CONFIRMED_*` state (different badge treatment, never equal visual weight).

**`ClassificationTag`** — props: `classification: EvidenceClassification`.
Renders `OBSERVED / INFERRED / PREDICTED / ESTIMATED / CONFIRMED / UNKNOWN`
consistently everywhere this distinction matters (risk, root cause,
recommendations, predictions, counterfactuals, AI answers).

**`RootCausePanel`**, **`RecommendationPanel`**, **`CounterfactualPanel`** —
each renders its respective backend object directly (`RootCause`,
`Recommendation`, `Counterfactual`), always paired with a `ClassificationTag`
and never phrased as guaranteed fact/outcome.

## Monitoring Components (`components/monitoring/`)

**`CameraFeed`** — props: `camera: Camera, detections?: Detection[],
tracks?: Track[]`. Renders video + (if backend provides them) bounding-box
and track-ID overlays + behaviour/risk labels. Renders nothing invented if
`detections`/`tracks` are absent.

**`CameraGrid`** — props: `cameras: Camera[], selectedId, onSelect`. Grid of
smaller feeds + one large selected feed.

**`CameraHealth`** — props: `camera: Camera`. Renders only fields the
backend actually returns (`status`, and `fps`/latency **only if present** —
never fabricated).

**`LiveIndicator`** — props: `state: "LIVE"|"DEGRADED"|"RECONNECTING"|
"OFFLINE"`. The global "Live Edge" motif.

## Incident Components (`components/incidents/`)

**`IncidentCard`** / **`IncidentTable`** — props: `incident: IncidentSummary`.
Consistent status/risk/behaviour badges; click → Incident Details.

**`IncidentDrawer`** — contextual drawer preview (used from dashboard, map,
alerts) showing a condensed `IncidentDetail` with an "Open Full Investigation"
action.

**`StatusBadge`** — props: `status: IncidentStatus | AlertStatus`. Single
shared component for both incident and alert lifecycles, mapping each enum
value to a consistent color/label.

## Evidence Components (`components/evidence/`)

**`EvidenceViewer`** — props: `evidence: Evidence`. Image/video viewer with
playback controls, seek, fullscreen, timestamps, event markers; switches
between snapshot/clip cleanly. Renders a clear "evidence unavailable" state
if URLs are null.

**`ReplayTimeline`** — props: `evidence: Evidence, behaviourEvent:
BehaviourEvent`. Pre-event/event/post-event navigation synchronized with the
video player and the Behaviour DNA sequence.

## Analytics Components (`components/analytics/`)

**`TrendChart`** — props: `data, xKey, series[], onPointClick`. Wraps
Recharts with consistent tooltip/legend/interaction styling; `onPointClick`
drives drill-down into underlying incidents.

**`DrillDownPanel`** — contextual panel/drawer shown after a chart
interaction, listing the underlying incidents for that data point.

## Spatial Components (`components/spatial/`)

**`WarehouseMap`** — props: `zones: Zone[], cameras: Camera[], entities?`.
Renders only zones with a real `polygon`; entity/trajectory layers rendered
only if the backend supplies live positions. Toggleable layers per
`PAGE_SPECIFICATIONS.md` §Warehouse Map.

**`RiskHeatmap`** — props: `points: HeatmapPoint[], type`. Renders backend
heatmap data; never hard-coded coordinates.

**`ZoneCard`** — hover/click summary panel: risk, incident count, dominant
behaviour, recent event, cameras — all from real zone-scoped API data.

## AI Components (`components/ai/`)

**`AIMessage`** — props: `response: AssistantResponse`. Renders answer text,
confidence (if present), and clickable `evidence_refs[]`; renders the
"insufficient evidence" state distinctly when flagged.

**`AIContextCard`** — a compact evidence reference chip (incident/camera/
zone) used inline within `AIMessage` and elsewhere evidence needs citing.

**`SuggestedQuestions`** — props: `suggestions: string[]`. Only render
questions the backend can meaningfully answer (context-aware suggestions
from the assistant response or a curated, backend-capability-gated list).

## Review Components (`components/review/`)

**`ReviewCard`** — props: `item: ReviewItem, onSubmit`. Evidence + predicted
behaviour + confidence + the four verdict actions
(`CORRECT/INCORRECT/CHANGE_BEHAVIOUR/UNCERTAIN`); on `CHANGE_BEHAVIOUR`,
populates a selector from the real `/api/v1/behaviours` taxonomy — never a
hard-coded list.

**`EmergingBehaviourBadge`** — distinct treatment for
`classification: "EMERGING"|"AMBIGUOUS"` events, communicating system
learning rather than a hard classification error.

## Dataset/Model Components (`components/datasets/`, `components/models/`)

**`DatasetVersionList`**, **`ModelRegistryTable`** — only built/rendered if
the corresponding backend endpoints exist (§ Backend Integration Map §11);
render real metrics/lifecycle states only, never placeholder numbers.

## Reporting Components (`components/reports/`)

**`ReportBuilder`**, **`ReportPreview`** — filters + preview wired to real
backend report endpoints; export actions (PDF/CSV) call the actual backend
capability, never a client-generated fake export unless explicitly
requested as a stated fallback.

## Component Contract Discipline

Every component listed here takes its data via typed props matching
`TYPESCRIPT_DATA_CONTRACTS.md` — never an inline ad hoc shape. If a
component needs a field not in the current contract, update
`BACKEND_INTEGRATION_MAP.md` + `TYPESCRIPT_DATA_CONTRACTS.md` first (after
confirming the real backend supports it), then the component.
