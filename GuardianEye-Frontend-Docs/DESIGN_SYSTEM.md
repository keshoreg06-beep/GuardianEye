# Design System
## GuardianEye — "Intelligence Layers" Visual Language

## 1. Product Feel

GuardianEye must feel: intelligent, industrial, futuristic-but-practical,
professional, trustworthy, data-rich, highly interactive, operational, fast,
enterprise-grade. Visual identity communicates: vision, protection,
intelligence, awareness, prediction, precision, industrial reliability.

## 2. The Core Design Rule

**Every important visualization should lead to an investigation** — not
just be looked at.
```
HIGH RISK 87 → click → Risk Factors → click factor → Related Incidents
→ Evidence → Behaviour Timeline → Root Cause → Recommendation
```
This "click deeper" philosophy must exist throughout the application, not
just on one showcase page.

## 3. "Intelligence Layers" Design Language

Important information is presented as **layered panels**, not plain cards,
communicating the pipeline: `Observed Data → Behaviour → Risk → Damage →
Action`. Example:
```
RISK INTELLIGENCE
87  HIGH

WHY?
+31  Unstable load
+22  Rapid movement
+18  Human proximity
+09  Historical zone risk
+07  Equipment proximity

[ INVESTIGATE ]
```
The system should explain itself, not just report a number.

## 4. Color System

Sophisticated industrial **dark theme** as the primary application theme,
using multiple tonal surfaces rather than one flat black:
```
#070B12  Application background
#0B111A  Navigation
#101923  Panels
#151F2B  Elevated panels
#1D2936  Borders/dividers
```
(Conceptual starting points — adopt the repository's existing tokens if a
suitable system already exists.) Build depth via tonal hierarchy, subtle
borders, shadows, blur, transparency, elevation — never "everything is
black."

**Accent (primary):** electric/cyan-blue — used for active navigation,
interaction, live state, selected state, intelligence indicators, important
links.

**Risk colors:** `LOW → green · MEDIUM → amber · HIGH → orange · CRITICAL →
red`. **Risk must never depend on color alone** — always pair with a text
label, score, icon, and shape/indicator.

**Gradients:** used selectively (login hero, intelligence visualizations,
heatmaps, AI assistant presence, selected states) — most surfaces stay clean
and flat.

## 5. Typography

Professional modern typeface (Inter, Geist, IBM Plex Sans, or Manrope).
Clear hierarchy: large metrics bold/compact/highly readable; operational
information medium weight; metadata smaller/muted. Not everything is bold.

## 6. Shape, Radius, Surfaces

Avoid the "everything is a rounded pill" AI-generated look. Use small/
moderate radius for operational components, moderate radius for major
panels, appropriate radius for buttons. Cards are **not** all identical
dimensions — use asymmetric layouts, wide visual regions, compact
intelligence modules, timelines, drawers, layered panels, spatial
visualizations.

## 7. Glass, Shadow, Iconography, Motion

- **Glassmorphism:** sparing use only — floating controls, map controls,
  camera overlays, command palette, AI assistant. Never the whole app.
- **Shadows:** subtle depth via surface contrast, low-opacity shadows,
  borders, elevation — avoid excessive glow.
- **Icons:** one consistent library (Lucide). Never icon-only for critical
  information — always pair with text.
- **Motion:** 150–300ms interaction transitions, subtle hover states, smooth
  number transitions, chart transitions, contextual drawer transitions, page
  transitions, event-insertion animations. Avoid bouncing, screen-wide
  flashing, constant pulsing, particles. Respect `prefers-reduced-motion`.

## 8. Signature Motifs

- **"Live Edge"** — subtle global status indicator: `● LIVE / DEGRADED /
  RECONNECTING / OFFLINE`. Understated, not flashy.
- **"Risk Pulse"** — a subtle pulse only around active/high-priority risk
  indicators; never constant/distracting flashing.
- **"Intelligence Thread"** — a recurring visual motif connecting the
  pipeline (`CAMERA → BEHAVIOUR → RISK → DAMAGE → ACTION`) reused across
  incident details, Command Center, evidence viewer, AI assistant,
  analytics — this becomes GuardianEye's signature visual identity.
- **"Behaviour DNA"** — a temporal sequence visualization (see
  `COMPONENT_LIBRARY.md`) rendering the backend's actual behaviour-event
  sequence, each stage clickable where data supports it.

## 9. Anti-Generic-Dashboard Rules (mandatory)

**Avoid:** excessive purple gradients, generic glowing headings, floating
blobs, giant rounded cards, excessive glassmorphism, generic AI
illustrations/robot graphics, stock warehouse photography, huge KPI cards
everywhere, repetitive card grids, random icon combos, unnecessary 3D
graphics, excessive pill buttons, meaningless animation, decorative (non-
functional) charts, generic chatbot UI, generic cybersecurity visuals.

**Use instead:** industrial command-center layouts, live operational
visualization, evidence-first investigation, spatial intelligence,
digital-twin interaction, camera intelligence, Behaviour DNA, risk
intelligence panels, contextual drawers, timeline investigation, real-time
state transitions, AI evidence references, human-review workflows.

## 10. Final Design Test (apply before marking any page complete)

```
Does this look like a real enterprise product?
Is it visually unique to GuardianEye?
Does the interface communicate intelligence?
Can the user investigate, not just view?
Are real-time events visually meaningful?
Are evidence and confidence visible?
Can the user move alert → incident → evidence quickly?
Does the warehouse feel spatial and alive?
Does the AI Assistant connect to real GuardianEye intelligence?
Is the design professional without excessive neon?
Does it avoid generic AI-generated dashboard patterns?
Does every important metric have a useful interaction?
Does every prediction clearly identify itself as a prediction?
Does every important claim have supporting evidence?
Is AI intelligence clearly separated from human validation?
Does it work at desktop, tablet, and mobile sizes?
Does it work with actual backend data?
```
Any "no" → redesign or fix before marking the page done.

## 11. Design Tokens (centralize, do not hard-code per-component)

Centralize: colors, typography scale, spacing scale, radius scale, shadow
scale, transition durations/easings, z-index scale, breakpoints, semantic
status colors (risk levels, connection states, damage status). All pages
must draw from the same token set — no per-page one-off colors or spacing.

## 12. Design Consistency Requirement

All pages must feel like one product: same button styles, same badge
styles, same spacing rhythm, same risk representation, same navigation
patterns. No duplicated one-off components that reinvent an existing design
system primitive.
