# Frontend Product Requirements Document (PRD)
## GuardianEye — Frontend

## 1. Purpose

Define what the GuardianEye frontend must do, for whom, under what visual and
interaction principles, and how completeness will be judged — as a single
source of truth for a production frontend build against the existing backend.

## 2. Product Identity

GuardianEye is an AI-powered warehouse safety, behaviour-intelligence,
risk-intelligence, damage-prevention, evidence, prevention, and
operational-intelligence platform. Its backend pipeline:

```
VIDEO → AI PERCEPTION → OBJECT DETECTION → MULTI-OBJECT TRACKING
→ SPATIAL UNDERSTANDING → INTERACTION UNDERSTANDING → TEMPORAL REASONING
→ BEHAVIOUR INTELLIGENCE → CONTEXT → RISK INTELLIGENCE → DAMAGE PREDICTION
→ ALERT → EVIDENCE → INCIDENT → ROOT CAUSE → PREVENTION → HUMAN REVIEW
→ LEARNING → ANALYTICS → AI ASSISTANT
```

The frontend's job is to make this pipeline **understandable and
actionable**. The intended user journey through every screen is:

```
SEE → UNDERSTAND → INVESTIGATE → PREDICT → ACT → LEARN
```

The frontend is the **primary operational interface** for the whole system —
not a supplementary dashboard.

## 3. Absolute Governing Rule

Every displayed data point must trace to a real backend endpoint, schema
field, enum value, or WebSocket event (see `BACKEND_INTEGRATION_MAP.md`).
Never invent: incidents, risk scores, camera states, evidence, analytics,
model metrics, warehouse geometry, AI predictions, or production data of any
kind. If required backend information/capability is missing, stop and issue a
data/backend request (see `FRONTEND_BUILD_PLAN_AND_GOVERNANCE.md`) rather than
fabricating it.

## 4. Responsibility Boundary

**Frontend does:** display, interact, filter, explain, navigate, review,
visualize.

**Backend/AI does:** object detection, tracking, behaviour reasoning, risk
calculation, damage prediction, root cause, recommendations, similarity
search, AI retrieval, database, evidence generation.

The frontend must never independently infer behaviour, risk, damage, root
cause, or AI observations — it renders and explains what the backend already
computed.

## 5. Target Users / Personas

| Persona | Primary Need |
|---|---|
| Warehouse Supervisor | Live situational awareness, fast incident investigation |
| Safety Officer | Risk trends, root cause, review queue, compliance evidence |
| Operations/Logistics Manager | Analytics, damage-prevention ROI, zone/shift performance |
| Reviewer / Safety Analyst | Human review workspace, behaviour correction |
| Admin | Users, warehouses, cameras, zones, retention, RBAC configuration |
| ML/Data lead | Dataset versions, model registry, evaluation metrics (only if backend supports) |

## 6. Scope

### 6.1 In Scope (build these, gated by backend support — see §7)
Authentication & RBAC · Application shell (sidebar/topbar/search) · Command
Center · Live Monitoring · Incidents & Alerts · Evidence & Replay · Warehouse
Map & Risk Heatmap · Digital Twin (if geometry supported) · Analytics · AI
Assistant · Human Review · Datasets & Model Registry (if backend supports) ·
Reports · Settings · full real-time (WebSocket) synchronization.

### 6.2 Out of Scope (v1)
Any capability with no backing backend endpoint. A generic
chatbot-with-no-grounding. A physically accurate 3D warehouse simulation.
Automated disciplinary/punitive workflows. Facial recognition beyond what the
backend explicitly supports and requires.

## 7. Feature-Gating Principle

Every optional feature section in `PAGE_SPECIFICATIONS.md` is written as
**"where backend supports it."** Before implementing, confirm the endpoint
exists in `BACKEND_INTEGRATION_MAP.md`. If it doesn't:
1. Do not build a fake version.
2. Log it in the Data/Backend Request log (see governance doc).
3. Either omit the section or show an honest "not yet available" empty state.

## 8. Design Principles (see `DESIGN_SYSTEM.md` for full detail)

1. **Investigation over observation** — every important metric should lead
   somewhere (`HIGH RISK 87 → Risk Factors → Incident → Evidence →
   Recommendation`).
2. **Evidence-first trust** — every claim shows confidence and an
   Observed/Inferred/Predicted/Estimated/Confirmed/Unknown classification;
   uncertain information must never look certain.
3. **Distinctive, industrial-intelligence aesthetic** — not a generic
   AI-SaaS/admin-panel/cybersecurity-dashboard template (see the anti-pattern
   list in `DESIGN_SYSTEM.md` §9).
4. **Real-time as a first-class citizen** — WebSocket-driven, surgical UI
   updates, not full-page refreshes.
5. **Responsible AI surfaced in the UI** — human review is always visible and
   available; AI never presents an inference as a fact.

## 9. Success Criteria

- Every applicable item in the Final Acceptance Checklist
  (`FRONTEND_BUILD_PLAN_AND_GOVERNANCE.md` §5) passes.
- The full end-to-end flow (login → live event → incident → evidence →
  root cause → recommendation → human review → analytics → AI assistant)
  works against the **real running backend**, not mocked data.
- TypeScript, lint, unit, integration, and E2E tests all pass; production
  build succeeds; no critical console errors.
- The product passes the Final Design Test in `DESIGN_SYSTEM.md` §10.

## 10. Constraints & Assumptions

- The backend is already substantially built; this frontend integrates with
  it rather than redesigning it. Backend changes are proposed, never made
  unilaterally (see governance doc).
- Desktop is the primary operational surface; mobile/tablet is a
  recomposed, priority-ordered experience, not a shrink of desktop.
- If the project owner later supplies Figma/branding/reference designs,
  those become authoritative for visuals — mapped via
  `frontend/docs/design-to-backend-mapping.md` — but never at the cost of
  breaking a real backend contract.
