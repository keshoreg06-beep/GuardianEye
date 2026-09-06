# UX Interaction Flows
## GuardianEye — Navigation Model, Drill-Downs, Information Hierarchy

## 1. The Core User Journey

Every screen should move the user through:
```
SEE → UNDERSTAND → INVESTIGATE → PREDICT → ACT → LEARN
```

## 2. Information Hierarchy (apply to every screen's layout)

```
LEVEL 1  What needs attention now?
LEVEL 2  What is happening?
LEVEL 3  Why is it happening?
LEVEL 4  What evidence supports it?
LEVEL 5  What should I do?
```

## 3. Data → Action Principle

Every important metric leads somewhere:
```
HIGH RISK 87 → Risk Factors → Incident → Evidence → Recommendation
```
Never display an important number without a working interaction path when
one exists in the product.

## 4. Primary Action Language

`INVESTIGATE →` is the consistent primary action across Command Center,
Alerts, Incidents, camera events, Analytics, Map, and AI Assistant.
Contextual secondary actions:
- **Incident:** Investigate, Acknowledge, Review Evidence, View Camera
- **Camera:** Open Live, View Events, Camera Health
- **Zone:** View Risk, View Incidents, View Cameras, Ask AI

Only show actions actually supported by the current backend state/RBAC.

## 5. Signature Page Transitions (preserve context, don't reload cold)

- **Dashboard → Incident:** selected incident visually transitions into the
  investigation view.
- **Map → Zone:** selected zone opens its intelligence panel in place.
- **Camera → Incident:** camera context carries into the evidence/incident
  view.
- **Analytics → Incident:** a chart point opens the relevant incident in a
  drawer before a full navigation, if the user wants to stay in context.

## 6. Contextual Drawers vs. Modals

- **Prefer drawers** for investigation without losing current context:
  camera details, zone details, incident preview, alert preview, AI
  evidence, analytics drill-down.
- **Use modals sparingly**, only for confirmation, destructive actions,
  focused configuration, or important workflow decisions.

## 7. Cross-Page Context (Zustand `selectionStore`)

If the user selects Zone B4 on the Map, that selection should remain
available as context/filter when they subsequently open Analytics,
Incidents, Cameras, or the AI Assistant — wherever technically
appropriate. Implement via the shared selection store, not per-page local
state.

## 8. Global Filter System

One reusable filter framework (Warehouse, Zone, Camera, Behaviour, Risk,
Date, Shift, Product, Equipment, Status — only those backend-supported).
Active filters render as removable chips (e.g. `Warehouse: Main · Zone: B4 ·
Risk: High+ · Date: Today`). Filters mirror to URL params for shareable/
bookmarkable views.

## 9. Signature "WOW" Interactions (build these deliberately, not as an
afterthought)

1. **Risk Zone drill-down** — click a high-risk zone on the map → risk,
   recent incidents, dominant behaviour, cameras, evidence.
2. **Behaviour DNA animation** — opening an incident animates through its
   real sequence (`APPROACH → PICKUP → MOVEMENT → LOSS_OF_CONTROL → DROP
   → IMPACT`).
3. **Analytics spike drill-down** — click a risk spike on a chart →
   underlying incidents → camera → evidence.
4. **AI evidence-grounded answer** — asking "Why did risk increase in Zone
   B4?" returns explanation + confidence + clickable evidence/incident
   references.
5. **Camera → Incident transition** — clicking a live event transitions
   camera context directly into incident investigation.
6. **Risk Orbit transition** — a real backend risk change animates the
   orbit naturally, not via full re-render.
7. **Spatial layer toggling** — map layers (Cameras/People/Vehicles/
   Incidents/Risk/Heatmap) toggle smoothly; only implement layers the
   backend actually supports.

## 10. Onboarding (first-time users, optional/lightweight)

Short welcome flow only — 3–4 lines communicating the SEE → UNDERSTAND →
INVESTIGATE → PREVENT loop and a single "Connect Warehouse" call to action
if setup is genuinely required. No long tutorial. Only expose setup steps
actually supported by the backend.

## 11. Feedback for Every Action

Every user action gets explicit confirmation (`✓ Alert acknowledged`, `✓
Review submitted`, `✓ Camera connected`, `✓ Settings saved`, `✓ Report
generated`) — never a silent no-op appearance.

## 12. Dangerous Action Confirmation

Consequential/state-changing actions (e.g. confirming an incident) require
an explicit confirm step naming exactly what will change, backed by the
real backend workflow — never assume the action is safe to fire
immediately.

## 13. Trust Design Rule

Always expose: timestamp, source camera, evidence, confidence, status, risk
level, classification (Observed/Inferred/Predicted/Estimated/Confirmed/
Unknown). Uncertain information must never *look* certain in layout, size,
or color weight.
