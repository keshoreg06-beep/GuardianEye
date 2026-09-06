# TypeScript Data Contracts
## GuardianEye Frontend — Types Mirroring the Backend Contract

These types mirror `BACKEND_INTEGRATION_MAP.md` exactly. Drop into
`src/types/` as the single source of truth for API response shapes. Regenerate
or hand-adjust against the live OpenAPI schema before final integration —
these are the documented baseline, not a guess.

```typescript
// src/types/enums.ts

export type UserRole =
  | "ADMIN" | "SUPERVISOR" | "SAFETY_OFFICER" | "ANALYST" | "OPERATOR";

export type CameraStatus = "ONLINE" | "OFFLINE" | "DEGRADED";
export type SourceType = "file" | "rtsp" | "vms" | "webcam";

export type JobStatus = "QUEUED" | "RUNNING" | "DONE" | "FAILED";

export type TrackStatus = "ACTIVE" | "LOST" | "REACQUIRED";

// Fetch canonical list from /api/v1/behaviours — this is the documented
// baseline; always resolve unknown values gracefully rather than crashing.
export type BehaviourCode =
  | "NORMAL" | "DROP" | "DRAG" | "THROW" | "ROUGH_HANDLING"
  | "INCORRECT_STACKING" | "UNSTABLE_STACKING" | "INCORRECT_PLACEMENT"
  | "IMPROPER_EQUIPMENT_USAGE" | "UNSAFE_LOADING_SEQUENCE"
  | "UNKNOWN" | "AMBIGUOUS" | "EMERGING";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type DamageStatus =
  | "NOT_OBSERVED" | "POTENTIAL_DAMAGE"
  | "CONFIRMED_BY_HUMAN" | "CONFIRMED_BY_EXTERNAL_SYSTEM";

export type IncidentStatus =
  | "DETECTED" | "ALERTED" | "ACKNOWLEDGED" | "UNDER_REVIEW"
  | "CONFIRMED" | "REJECTED" | "ACTION_TAKEN" | "RESOLVED";

export type AlertStatus =
  | "OPEN" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";

export type ReviewVerdict =
  | "CORRECT" | "INCORRECT" | "CHANGE_BEHAVIOUR" | "UNCERTAIN";

export type ModelStatus =
  | "TRAINING" | "EVALUATION" | "CANDIDATE" | "APPROVED"
  | "DEPLOYED" | "REJECTED" | "RETIRED";

// Applies to any AI-derived claim surfaced in the UI (risk, root cause,
// recommendation, prediction). Drive this from backend fields where present
// (e.g. `is_ai_inferred`), never infer it client-side.
export type EvidenceClassification =
  | "OBSERVED" | "INFERRED" | "PREDICTED" | "ESTIMATED"
  | "CONFIRMED" | "UNKNOWN";
```

```typescript
// src/types/entities.ts
import {
  CameraStatus, SourceType, JobStatus, TrackStatus, BehaviourCode,
  RiskLevel, DamageStatus, IncidentStatus, AlertStatus, ReviewVerdict,
  ModelStatus, UserRole,
} from "./enums";

export interface User {
  id: string; email: string; role: UserRole;
}

export interface Warehouse { id: string; name: string; }

export interface Zone {
  id: string; warehouse_id: string; name: string;
  zone_type: "loading_bay" | "staging" | "storage" | "pedestrian_lane"
    | "forklift_lane" | "restricted";
  polygon: Array<[number, number]> | null;
}

export interface Camera {
  id: string; warehouse_id: string; zone_id: string | null;
  source_type: SourceType; stream_url: string | null;
  status: CameraStatus; fps: number | null; resolution: string | null;
  last_seen: string | null;
}

export interface VideoRecord {
  id: string; camera_id: string | null; storage_url: string;
  duration_seconds: number | null; uploaded_at: string;
}

export interface ProcessingJob {
  id: string; video_id: string; status: JobStatus;
  progress: number; error_message: string | null;
  created_at: string; completed_at: string | null;
}

export interface Detection {
  frame_id: number; timestamp: number; class: string;
  confidence: number; bbox: [number, number, number, number];
  track_id?: string;
}

export interface Track {
  id: string; video_id: string; track_id: string; object_class: string;
  trajectory: Array<{ frame: number; x: number; y: number; w: number;
    h: number; velocity?: number; acceleration?: number }>;
  first_seen: number; last_seen: number; status: TrackStatus;
}

export interface RiskFactor { label: string; value: number; }

export interface RiskAssessment {
  risk_score: number; risk_level: RiskLevel; confidence: number;
  factors: RiskFactor[]; explanation: string;
}

export interface DamagePrediction {
  damage_probability: number; damage_category: string;
  damage_status: DamageStatus; confidence: number;
}

export interface Evidence {
  clip_url: string | null; snapshot_url: string | null;
  trajectory: unknown[]; checksum: string | null;
}

export interface RootCause {
  category: string; description: string;
  is_ai_inferred: boolean; confidence: number;
}

export interface Recommendation {
  text: string; reason?: string;
  estimated_risk_reduction: [number, number]; confidence: number;
}

export interface Counterfactual {
  observed_risk: number; alternative_risk: number;
  alternative_scenario: string; assumptions?: string[];
}

export interface BehaviourEvent {
  id: string; video_id: string; behaviour: BehaviourCode;
  primary_track_id: string | null; confidence: number;
  start_ts: number; end_ts: number; zone_id: string | null;
  classification: "KNOWN" | "UNKNOWN" | "AMBIGUOUS";
  sequence?: string[]; // Behaviour DNA, e.g. ["APPROACH","PICKUP",...]
}

export interface IncidentSummary {
  incident_id: string; status: IncidentStatus; behaviour: BehaviourCode;
  zone: string; camera_id: string; risk_level: RiskLevel;
  confidence: number; damage_status: DamageStatus; created_at: string;
}

export interface IncidentDetail extends IncidentSummary {
  risk: RiskAssessment;
  damage: DamagePrediction;
  evidence: Evidence;
  root_cause?: RootCause;
  recommendation?: Recommendation;
  counterfactual?: Counterfactual;
}

export interface Alert {
  id: string; incident_id: string; severity: RiskLevel;
  status: AlertStatus; created_at: string;
}

export interface SimilarIncident {
  incident_id: string; similarity: number; date: string;
  zone: string; behaviour: BehaviourCode; risk_level: RiskLevel;
  evidence_url?: string;
}

export interface AssistantEvidenceRef {
  type: "incident" | "camera" | "evidence" | "zone";
  id: string; label: string;
}

export interface AssistantResponse {
  answer: string;
  insufficient_evidence?: boolean;
  evidence_refs: AssistantEvidenceRef[];
  follow_up_suggestions: string[];
}

export interface ReviewItem {
  behaviour_event_id: string; predicted_behaviour: BehaviourCode;
  confidence: number; evidence: Evidence;
}

export interface ReviewSubmission {
  behaviour_event_id: string; verdict: ReviewVerdict;
  corrected_behaviour_id?: string; notes?: string;
}

export interface ModelVersion {
  id: string; model_id: string; version: string;
  dataset_version_id: string | null; training_date: string | null;
  metrics: Record<string, number>; status: ModelStatus;
  approved_by: string | null; deployment_date: string | null;
}

export interface HeatmapPoint {
  zone_id: string; value: number; }

export interface AnalyticsOverview {
  total_incidents: number; high_risk: number; critical: number;
  potential_damage: number; most_risky_zone: string | null;
  most_frequent_behaviour: BehaviourCode | null;
}

export interface ApiError {
  error: { code: string; message: string };
}
```

```typescript
// src/types/websocket.ts

export type WsEventType =
  | "NEW_INCIDENT" | "RISK_ESCALATED" | "ALERT_CREATED"
  | "CAMERA_OFFLINE" | "PROCESSING_COMPLETE" | "PROCESSING_FAILED"
  | "REVIEW_UPDATED" | "REVIEW_REQUIRED";

export interface WsEnvelope<T = unknown> {
  type: WsEventType;
  payload: T;
}

export interface NewIncidentPayload {
  incident_id: string; risk_level: string; behaviour: string;
  zone: string; timestamp: string;
}
export interface RiskEscalatedPayload {
  incident_id: string; old_level: string; new_level: string;
}
export interface AlertCreatedPayload {
  alert_id: string; incident_id: string; severity: string;
}
export interface CameraOfflinePayload { camera_id: string; }
export interface ProcessingPayload { job_id: string; video_id: string; }
export interface ReviewRequiredPayload { behaviour_event_id: string; }
```

## Notes on Using These Contracts

- Treat every `?`/`| null` marking as deliberate — render an honest empty
  state rather than assuming a value exists.
- `is_ai_inferred`, `damage_status`, `classification`, and similar
  classification fields are the **only** legitimate source for the
  Observed/Inferred/Predicted/Estimated/Confirmed/Unknown badge — never
  compute this client-side from other heuristics.
- Confirm field names/casing against the live OpenAPI schema before final
  wiring; this document is the documented baseline synchronized with
  `BACKEND_INTEGRATION_MAP.md`, not a guarantee of the live backend's exact
  serialization.
