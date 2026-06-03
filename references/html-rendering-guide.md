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
| **Storyboard** | Film-storyboard table: one frame per step (Cut / Frame / Action / Dialogue / Time) | Narrative journey where the audience should move through it frame by frame — the visual cousin of the Storyline. Kickoffs, empathy, presentations |

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
| **Storyboard**   | ✓ | ✓ | — | — |

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

if audience should move through the journey frame-by-frame (narrative/empathy,
   the journey has a strong emotional arc and per-step "scenes"):
    rendering = storyboard   # the visual cousin of the Storyline express format

# Step 3: Overlays and multi-view
if active_categories include emotional AND rendering != emotion-curve:
    offer emotion-curve as overlay OR as multi-view tab

if audience is mixed (multiple needs):
    offer multi-view with relevant rendering modes as tabs

# User can always override any recommendation
```

---

## Color Strategy

### Principles

1. **Palette type must match data semantics.**
   - **Categorical** (distinct hues, equal perceptual weight): unordered groups — personas, channels, service layers. Limit to 6–8 distinct hues; beyond that, group as "Other" or restructure.
   - **Sequential** (single hue, light-to-dark): ordered magnitude — duration, drop-off rate, priority score. Never use rainbow gradients.
   - **Diverging** (two hues meeting at neutral midpoint): data with meaningful center — emotion valence (negative ↔ positive), satisfaction delta.

2. **Use perceptually uniform color space (LCH/CIELAB) for interpolation.** Equal numerical steps must produce equal perceived color change. HSL/RGB create misleading brightness variation that biases interpretation. When generating intermediate steps between two brand colors, interpolate in LCH, not HSL.

3. **Encoding hierarchy: Position > Size > Shape > Color.** Color is reinforcement, never the sole encoding. Every color-coded element must carry a secondary indicator (icon, pattern, text label, or position) so the visualization reads in grayscale.

4. **Encode with the right color dimension.**
   - Hue → categorical/nominal (no inherent order)
   - Lightness → ordinal/sequential (intensity encodes magnitude)
   - Saturation → emphasis only (not for primary data encoding)

5. **Respect natural semantic associations.** Red = negative/hot/danger, green = positive/growth, orange = warning, blue = neutral/cold/trust. Violating these (e.g., green for loss) creates cognitive friction. When brand colors conflict with semantic expectations, use brand for chrome/identity and semantic colors for data.

### Theming & White-label Architecture

All colors must be defined as CSS custom properties at `:root`, organized in three tiers:

```
/* Tier 1: Brand seed (user provides these) */
--brand-primary: ...;
--brand-secondary: ...;
--brand-surface: ...;
--brand-text: ...;

/* Tier 2: Semantic palette (derived from seed or overridden) */
--color-layer-frontstage-bg: ...;
--color-layer-backstage-bg: ...;
--color-valence-negative-2: ...;
--color-valence-positive-2: ...;
--color-marker-critical: ...;
--color-marker-warning: ...;

/* Tier 3: Component scope (local overrides) */
--card-border: var(--color-layer-frontstage-border);
--minimap-dot-fill: var(--color-valence-neutral);
```

**Derivation strategy when user provides only brand colors:**
1. Use brand primary for chrome (headers, active tab, selected state).
2. Derive sequential palette from brand primary by stepping lightness in LCH (5 stops, L from 95 down to 35).
3. Keep semantic data colors (valence, markers) independent of brand — these must maintain universal meaning.
4. Surface and text colors: respect brand surface/text for backgrounds and body text.

**Swap themes by reassigning Tier 1 variables.** No rebuild, no code change. This enables white-label deployments where each client sets 3–4 brand values.

### Dark Mode

**Do not invert. Re-derive.**

- Background: use `#121212` or similar dark grey, never pure `#000000` (causes halation).
- Surfaces: layer with subtle lightness increments (`#1e1e1e`, `#2a2a2a`, `#333333`).
- Text: use `#e0e0e0` for body, `#ffffff` for headings. Never full-white body text on full-black.
- Data colors: maintain the same hue and semantic meaning, but increase lightness by 10–15% and reduce chroma slightly so colors remain legible against dark backgrounds.
- Borders: lighten to ~30% opacity white (`rgba(255,255,255,0.3)`).
- Markers: keep the same hues but increase contrast against dark surface. Test every marker color pair against the dark surface for WCAG 3:1 minimum.

Implement via `@media (prefers-color-scheme: dark)` overriding Tier 1 and Tier 2 variables. Alternatively, support a `.dark` class toggle on `<html>` for manual switching.

### Accessibility

- **Contrast minimums**: 3:1 for data visualization shapes (≥ 3×3px). 4.5:1 for text labels. Test all color pairs in both light and dark modes.
- **Colorblind safety**: Blue-orange is universally safe across deuteranopia, protanopia, and tritanopia. Avoid red-green combinations as sole differentiators. When the palette requires red and green (e.g., valence), always pair with a secondary encoding (icon, pattern, position).
- **Reference palettes**: Okabe-Ito (8 colors, universally distinguishable), Cividis (sequential, colorblind-optimized).
- **Test tools**: Sim Daltonism, Coblis, or browser DevTools color vision simulation.

### Default Palette

The following defaults are provided for use when no brand colors are specified. All values are CSS custom property names — override at Tier 1 to theme.

**Service layers (categorical):**

| Layer | Light bg | Light border | Dark bg | Dark border |
|-------|----------|-------------|---------|------------|
| Customer / Frontstage | `#fff9e6` | `#c9a227` | `#2a2518` | `#d4a72c` |
| Backstage | `#ffffff` | `#aaaaaa` | `#1e1e1e` | `#666666` |
| Support / Infrastructure | `#f3f3f3` | `#999999` | `#252525` | `#777777` |
| Evidence / Physical | `#fafafa` | `#cccccc` | `#1a1a1a` | `#555555` |
| Muted / Optional | `#f5f5f5` | dashed `#cccccc` | `#1c1c1c` | dashed `#555555` |

**Emotion valence (diverging):**

| Valence | Light | Dark |
|---------|-------|------|
| -2 (very negative) | `#fecaca` | `#991b1b` |
| -1 (negative) | `#fed7aa` | `#9a3412` |
| 0 (neutral) | `#e5e7eb` | `#4b5563` |
| +1 (positive) | `#bbf7d0` | `#166534` |
| +2 (very positive) | `#86efac` | `#15803d` |

**Markers (semantic, fixed across themes):**

| Marker | Visual | Position | Trigger field |
|--------|--------|----------|---------------|
| Moment of truth | Red dot `#ef4444` | Top-right | `momentOfTruth: true` |
| Failure point | Dark yellow dot `#8b6914` | Top-left | `failureMode` present |
| Pain point | Orange underline | Below field text | `painPoint` present |
| Opportunity | Green dashed border | Around field text | `opportunity` present |
| Source provenance | 📎 icon | Inline after field | `_provenance: source: ...` |
| User-modified | ✏️ icon | Inline after field | `_provenance: user-modified` |

### Color Application Rules

1. **Layer color > emotion color** in Swimlane mode. Show emotion via left-border bar instead.
2. **Dual encoding**: every color-coded element must also carry a non-color indicator (icon, pattern, or text label).
3. **Print**: all background colors at 50% opacity. Markers and text labels preserved.
4. **10–20 color range**: when persona count, channel count, or category count exceeds 8, shift from distinct hues to a lightness-stepped single-hue palette grouped by semantic cluster. Never display 20 equally-weighted distinct hues.
5. **Brand colors for chrome, semantic colors for data.** Do not repurpose brand red as "negative valence" — brand identity and data encoding must remain independent channels.

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

### Storyboard Mapping

One row ("cut") per step, in a Cut / Frame / Action / Dialogue / Time table.

| Schema field | Visual |
|--------------|--------|
| Step index / `id` | Cut number |
| `emotionValence` (or inferred from `emotion`) | Frame background wash (diverging valence palette) |
| `description` / `touchpoint` / setting | Scene caption inside the frame (the "shot") + a stock line-art glyph chosen from `channel`/`doing`/`emotion` |
| `persona` | Initial chips, top-right of the frame |
| `momentOfTruth` | ★ marker (red) in the frame |
| `failureMode` present | ⚠ marker (dark yellow) in the frame |
| `description` + `doing` | Action column |
| `thinking` | Dialogue (the character's line) |
| `painPoint` / `failureMode` / `opportunity` | Notes under the dialogue |
| `emotion` | Emotion label |
| `duration` / `waitTime` | Time column |
| Milestone | Dark band separating cut groups |

The "Frame" is a stylized scene, not a real illustration — emotion wash + glyph +
caption + persona + markers. Template: `assets/templates/rendering/storyboard.html`.

---

## Technical Constraints

- Zero external dependencies — no CDN, no framework, no build step
- Single self-contained HTML file with embedded CSS + vanilla JS
- File size < 200KB including all styles, scripts, and journey data
- Browser support: Chrome, Safari, Firefox (last 2 versions)
- Offline-capable, embeddable as iframe
- Interactions (filter, sort, search, expand/collapse, keyboard nav) are baked into templates
