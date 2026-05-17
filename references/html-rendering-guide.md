# Interactive HTML — Rendering Reference

Runtime reference for the Interactive HTML expression. Guides rendering mode selection, color assignment, and data-to-visual mapping.

---

## Combination Selection

The Interactive HTML output combines one **rendering mode** (layout structure) with one **interaction mode** (navigation behavior). These are orthogonal — choose independently.

### Rendering Modes

| Mode | Structure | Choose when |
|------|-----------|-------------|
| **Card grid** | Vertical card stack grouped by milestone | Default. Most versatile, mobile-friendly |
| **Timeline** | Horizontal axis, steps as nodes | Duration/temporal dimension is primary |
| **Swimlane** | Horizontal lanes per service layer | Active categories include frontstage/backstage/support |
| **Emotion curve** | Valence line chart over steps | Emotional arc is the focus. Also works as overlay on other modes |

### Interaction Modes

| Mode | Behavior | Choose when |
|------|----------|-------------|
| **Scroll-driven** | Linear scroll, no navigation chrome | Step count ≤ 15, or mobile-first, or print use case |
| **Focus+Context** | Sticky minimap, scroll spy, breadcrumb | Step count 15–60. Primary recommendation for workshop use |
| **Zoom-pan** | Canvas pan/zoom, corner minimap | Step count > 60, or complex spatial layout |
| **Multi-view** | Tab bar switching between rendering modes | Multiple audiences need different perspectives on same data |

### Valid Combination Matrix

|                  | Scroll | Focus+Context | Zoom-pan | Multi-view |
|------------------|:---:|:---:|:---:|:---:|
| **Card grid**    | ✓ | ✓ | — | ✓ |
| **Timeline**     | ✓ | ✓ | ✓ | — |
| **Swimlane**     | ✓ | ✓ | ✓ | — |
| **Emotion curve**| ✓ | — | — | ✓ |

### Selection Logic

```
# Step 1: Interaction mode (from step count)
if step_count <= 15:       interaction = scroll-driven
elif step_count <= 60:     interaction = focus+context
else:                      interaction = zoom-pan

# Step 2: Rendering mode (from data shape)
rendering = card-grid  # default

if active_categories include service-layers (frontstage, backstage, support):
    rendering = swimlane

if primary_analysis_dimension == temporal/duration:
    rendering = timeline

# Step 3: Overlays and multi-view
if active_categories include emotional AND rendering != emotion-curve:
    offer emotion-curve as overlay OR as multi-view tab

if audience is mixed (multiple needs):
    offer multi-view with relevant rendering modes as tabs

# User can always override any recommendation
```

---

## Color System

### Service Layer Colors

Used as primary palette in Swimlane mode. In Card grid / Timeline, applied to expandable sections.

| Layer | Background | Border | Applied to |
|-------|-----------|--------|------------|
| Customer / Frontstage | `#fff9e6` | `#c9a227` | Customer-visible actions, frontstage sections |
| Backstage | `#ffffff` | `#aaaaaa` | Internal processes not visible to customer |
| Support / Infrastructure | `#f3f3f3` | `#999999` | Systems, tools, platforms |
| Evidence / Physical | `#fafafa` | `#cccccc` | Tangible touchpoints, artifacts |
| Muted / Optional | `#f5f5f5` | dashed `#cccccc` | Optional steps, low priority |

### Emotion Valence Colors

Applied to card left-border bar, emotion badges, and emotion curve fill.

| Valence | Label | Hex | 
|---------|-------|-----|
| -2 | Very negative | `#fecaca` |
| -1 | Negative | `#fed7aa` |
| 0 | Neutral | `#e5e7eb` |
| +1 | Positive | `#bbf7d0` |
| +2 | Very positive | `#86efac` |

### Markers

| Marker | Visual | Position | Trigger field |
|--------|--------|----------|---------------|
| Moment of truth | Red dot `#ef4444` | Top-right | `momentOfTruth: true` |
| Failure point | Dark yellow dot `#8b6914` | Top-left | `failureMode` present |
| Pain point | Orange underline | Below field text | `painPoint` present |
| Opportunity | Green dashed border | Around field text | `opportunity` present |
| Source provenance | 📎 icon | Inline after field | `_provenance: source: ...` |
| User-modified | ✏️ icon | Inline after field | `_provenance: user-modified` |

### Color Priority Rules

1. **Layer color > emotion color** in Swimlane mode. Show emotion via left-border bar instead.
2. **Accessibility**: every color-coded element must also carry a non-color indicator (icon, pattern, or text label).
3. **Print**: all background colors at 50% opacity. Markers and text labels preserved.

---

## Data Mapping

How journey schema fields map to visual elements in the HTML output.

### Card Collapsed State

| Schema field | Visual |
|--------------|--------|
| Step `id` | Card anchor / URL hash target |
| `description` | Body text (1 line, truncated) |
| `emotion` | Colored badge with text |
| `emotionValence` | Left border bar color |
| `dropoffRate` / primary metric | Top-right numeric badge |
| `momentOfTruth` | Red dot marker |
| `failureMode` | Yellow dot marker |
| `persona` | Avatar initial pill |
| `duration` | Clock icon + text |
| `channel` | Small pill tag |

### Card Expanded State (additional)

| Schema field | Visual |
|--------------|--------|
| `frontstage` | Expandable section, yellow background |
| `backstage` | Expandable section, grey background |
| `supportProcess` / `systems` | Expandable section, light grey background |
| `painPoint` | Orange-underlined label |
| `opportunity` | Green dashed-border label |
| `failureMode` (detail) | Risk section with description |
| `next` | Solid flow arrow to target step |
| `recoveryPath` | Dashed flow arrow to recovery step |
| `_provenance` | 📎 or ✏️ icon on relevant fields, detail on hover |

### Swimlane Lane Mapping

| Lane | Source fields | Color |
|------|-------------|-------|
| Customer Actions | `description`, `doing` | `#fff9e6` / `#c9a227` |
| Frontstage | `frontstage`, `frontstageAction` | `#fff9e6` / `#c9a227` |
| Backstage | `backstage`, `backstageAction` | `#ffffff` / `#aaaaaa` |
| Support Processes | `supportProcess`, `systems` | `#f3f3f3` / `#999999` |

Divider lines between lanes:
- **Line of Interaction** — between Customer and Frontstage
- **Line of Visibility** — between Frontstage and Backstage
- **Line of Internal Interaction** — between Backstage and Support

### Timeline Node Mapping

| Schema field | Visual |
|--------------|--------|
| Step sequence | X-axis position |
| `duration` | Node width (proportional) or label |
| `emotionValence` | Node color |
| Milestone boundaries | Background band color segments |

### Emotion Curve Mapping

| Schema field | Visual |
|--------------|--------|
| Step sequence | X-axis |
| `emotionValence` | Y-axis value (-2 to +2) |
| `emotion` (text) | Tooltip on hover |
| Milestone boundaries | Vertical divider lines with labels |

---

## Technical Constraints

- Zero external dependencies — no CDN, no framework, no build step
- Single self-contained HTML file with embedded CSS + vanilla JS
- File size < 200KB including all styles, scripts, and journey data
- Browser support: Chrome, Safari, Firefox (last 2 versions)
- Offline-capable, embeddable as iframe
- Interactions (filter, sort, search, expand/collapse, keyboard nav) are baked into templates
