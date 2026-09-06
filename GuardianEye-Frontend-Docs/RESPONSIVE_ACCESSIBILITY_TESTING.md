# Responsive, Accessibility & Testing Specification
## GuardianEye Frontend

## 1. Responsive Breakpoints

Desktop is the primary operational surface. Test/support at minimum:
```
1920 × 1080   1440 × 900   1280 × 800
1024 × 768    768 × 1024   390 × 844
```

## 2. Mobile Is a Recomposition, Not a Shrink

Mobile priorities, in order: Command Center summary → Alerts → Incident
review → Incident details → Camera viewing. Use bottom navigation where
appropriate, swipeable panels, expandable sections, full-screen evidence,
simplified visualizations. Example condensed mobile Command Center:
```
COMMAND CENTER
RISK  78 HIGH
3 ACTIVE INCIDENTS
2 CRITICAL ALERTS
[ VIEW LIVE ]  [ VIEW INCIDENTS ]
```

## 3. Accessibility Requirements

- Full keyboard navigation across every interactive surface (nav, tables,
  drawers, command palette, video controls).
- Semantic HTML; visible focus states everywhere; ARIA labels on
  icon-only controls and custom components (RiskOrbit, BehaviourDNA, map
  layers).
- Screen-reader support for critical status information (risk level,
  incident status, connection state) — not conveyed by color/icon alone.
- Sufficient contrast ratios across the dark theme (verify against WCAG AA
  at minimum for text and status indicators).
- `prefers-reduced-motion` respected — disable/simplify orbit pulses, page
  transitions, live-stream insert animations accordingly.
- **Severity is never color-only** — always paired with text label +
  icon/shape.

## 4. Frontend Testing Strategy

**Unit (Vitest):** design-system primitives, intelligence components
(`RiskBadge`, `RiskFactorList`, `ClassificationTag`, `BehaviourDNA`), utility
functions (enum-label resolution, formatting), Zustand store logic.

**Integration:** API hooks against a mocked backend matching
`TYPESCRIPT_DATA_CONTRACTS.md` exactly; WebSocket manager event-routing
logic (simulate each event type from §WebSocket spec and assert the correct
targeted cache update occurs — not a broad invalidation).

**E2E (Playwright):** full flows — login → Command Center loads real data →
open an incident → evidence renders → replay works → AI Assistant answers a
question with evidence references → human review submission → analytics
reflects the update. Run against the actual running backend wherever
feasible for true integration confidence, in addition to a mocked-backend
CI pass.

**Browser QA (minimum):** Chrome desktop, then check across the breakpoint
list (§1) on real or emulated devices. Verify at each: no console errors, no
broken images/routes, no failed API requests, no WebSocket failures, no
layout overflow, no inaccessible controls, no broken interactions.

## 5. Mandatory Per-Change Audit Checklist

```
[ ] Build succeeds
[ ] TypeScript check passes
[ ] Lint passes
[ ] Unit tests pass
[ ] Integration tests pass (where applicable)
[ ] Relevant E2E tests pass
[ ] API integration validated against real/mock backend contract
[ ] WebSocket behavior validated (where applicable)
[ ] No console errors
[ ] No failed network requests
[ ] Responsive check across breakpoints
[ ] Accessibility check (keyboard, contrast, ARIA, reduced motion)
[ ] No hard-coded/fabricated data introduced
```
Never proceed to the next unit of work with a known critical failure in any
of the above.

## 6. Performance Testing

Track and keep within budget: initial bundle size, route-level chunk sizes,
Time-to-Interactive on the Command Center, WebSocket-driven re-render
frequency (should be surgical, not global), chart render time with realistic
data volumes, virtualized-list scroll performance for large incident/alert
sets. Measure real numbers — do not estimate or assume.

## 7. Security Testing (frontend-facing)

Verify: no secrets in the bundle, expired/invalid JWT correctly redirects to
login, 403 responses render the "not authorized" state (never a stack
trace or raw error), evidence URLs are rendered as-issued (never
constructed/guessed client-side), any user-generated or AI-generated text
rendered as HTML is sanitized, and RBAC-hidden UI does not leave a
backend action reachable/executable for an unauthorized role via direct
API calls from devtools (confirm backend actually rejects it).
