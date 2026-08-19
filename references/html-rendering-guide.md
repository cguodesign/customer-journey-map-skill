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
| **Flow graph** | Node-link graph of `next` / `branchCondition` / `parallelPath`, laid out by document order | The journey is **not** a line: it forks, loops, or has several endings. The only mode that shows a step with no way out of it |
| **Time to scale** | One horizontal strip, segments drawn in proportion to real `duration` / `waitTime` (log or true scale) | Waiting dominates the experience and the evenly-spaced Timeline is hiding it. Turns "the black hole" from a phrase into a measurement |
| **Coverage x-ray** | Matrix of steps × schema categories, cells shaded by field count, provenance overlaid | The audience is the map's *authors*. Shows where the map is thick, where it is thin, and what is asserted without evidence |

### Interaction Modes

| Mode | Behavior | Choose when |
|------|----------|-------------|
| **Scroll-driven** | Linear scroll, no navigation chrome | Step count ≤ 15, or mobile-first, or print use case |
| **Focus+Context** | Sticky minimap, scroll spy, breadcrumb | Step count 15–60. Primary recommendation for workshop use |
| **Zoom-pan** | Canvas pan/zoom, corner minimap | Step count > 60, or complex spatial layout |
| **Multi-view** | Tab bar switching between rendering modes | Multiple audiences need different perspectives on same data |

### Valid Combination Matrix

|                    | Scroll | Focus+Context | Zoom-pan | Multi-view |
|--------------------|:---:|:---:|:---:|:---:|
| **Card grid**      | ✓ | ✓ | — | ✓ |
| **Timeline**       | ✓ | ✓ | ✓ | — |
| **Swimlane**       | ✓ | ✓ | ✓ | — |
| **Emotion curve**  | ✓ | — | — | ✓ |
| **Storyboard**     | ✓ | ✓ | — | — |
| **Flow graph**     | ✓ | ✓ | ✓ | — |
| **Time to scale**  | ✓ | — | — | — |
| **Coverage x-ray** | ✓ | — | — | — |

The last three are **analytical** rather than sequential: they answer a question about the
map instead of walking through it. Offer them alongside a sequential mode, not instead of
one — a room that has never seen the journey needs the walk first.

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

# Analytical modes — these answer a question ABOUT the map. Offer, don't substitute.
if the map branches (>1 branchCondition, or any exitPoint besides the last step,
   or a parallelPath) AND the question is "where does this actually go?":
    offer flow-graph        # the only mode that can show a step with no way out

if duration/waitTime are populated AND the waits dwarf the actions
   (or the user says "how much of this is waiting?"):
    offer time-to-scale     # an evenly-spaced timeline is throwing the time away

if the audience is the map's own authors — "where is this thin?", "what are we
   asserting without evidence?", a review/health pass:
    offer coverage-xray     # steps × categories, with provenance overlaid

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

### The token layer — where colour actually comes from

**Renderings do not contain colours. They contain token names.** The palette ships as
`assets/theme/journey-tokens.css` and is *inlined* into each rendering (a rendering must
survive being emailed, so it cannot link a stylesheet). Two marked regions carry it:

```
/* tokens:begin */   the shipped three-tier system, written by the script   /* tokens:end */
/* theme:begin */    this artifact's own Tier-1 seeds, usually empty        /* theme:end */
```

Never write these regions by hand. `journey.sh theme <file>` owns them:

```
journey.sh theme map.html --init                 # default palette, follows the reader
journey.sh theme map.html --preset paper         # paper | midnight | blueprint | contrast
journey.sh theme map.html --primary '#6C2BD9' --surface '#fff' --text '#1a1320'
journey.sh theme map.html --clear                # back to default
journey.sh theme map.html                        # report what it currently carries
```

**The three tiers**

| Tier | What | Who writes it |
|------|------|---------------|
| 1 · seed | ~10 brand values | the user, or `journey.sh theme` — **the only place a literal colour belongs** |
| 2 · semantic | valence, markers, layers, ink, rules — all derived from Tier 1 | the shipped token file |
| 3 · component | local aliases inside one rendering (`--mot-color: var(--marker-critical)`) | you, when writing the rendering |

**When you write a rendering, you consume Tier 2.** Every colour is `var(--…)`. If you
find yourself typing `#` in a rendering, that value belongs in Tier 1 instead.

**Tier 2 vocabulary**

```
ground      --bg  --surface-1  --surface-2  --surface-3
ink         --ink  --ink-muted  --ink-faint  --ink-ghost
rules       --line  --line-soft  --line-strong
accent      --accent  --accent-soft  --accent-line  --accent-ink  --ink-on-accent
valence     --valence-n2  --valence-n1  --valence-0  --valence-p1  --valence-p2
markers     --marker-critical (momentOfTruth)   --marker-fail (failureMode)
            --marker-opportunity                --marker-pain (painPoint)
            --marker-machine (automation)
layers      --layer-customer-bg/-ln  --layer-backstage-bg/-ln  --layer-support-bg/-ln
actors      --actor-primary  --actor-system  --actor-backstage  --actor-none
categorical --cat-1 … --cat-5 (+ -soft)  — unordered groups only: milestones, lanes, channels
fixed       --ink-on-fill  --shadow-ink  — pair with data, NOT with the page; never flip these
```

**Three rules that are not style preferences:**

1. **Semantic colours are independent of the brand.** `--marker-critical` seeds from
   `--brand-attention`, not `--brand-primary`. A marker that repaints itself when the
   logo changes is not a marker.
2. **Valence is the field; markers are annotations laid on top of it.** The valence stops
   are held one step back from full strength on purpose. A marker that reads as just
   another data point has failed.
3. **`--ink-on-fill` and `--shadow-ink` do not flip with the theme.** They pair with
   saturated data fills and with shadows, both of which stay put. Inverting them is the
   classic dark-mode bug.

### Dark mode, and the specificity trap

Dark is a *theme*, not a file. The token file re-derives the dark palette from the same
seeds — mixing toward ink instead of toward surface, never an inversion — and is selected
by **both** `prefers-color-scheme` and `[data-theme]`, so a manual toggle wins in either
direction.

The trap, which `journey.sh theme` exists to handle for you: the dark blocks are selected
by `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`, and **both
out-specify a bare `:root`**. So

- an artifact that reseeds Tier 1 must also pin `data-theme` on `<html>`, or its theme
  silently does nothing for every reader whose system is set to dark;
- and a **dark** reseed must additionally match that specificity
  (`:root, :root[data-theme="dark"]{…}`), because pinning dark alone still loses.

Pinning light is enough on its own. Pinning dark is not. The command derives the mode from
the surface colour and writes the matching selector; hand-edit and you own this.

### Accessibility floor (unchanged by theming)

- 3:1 contrast for data shapes, 4.5:1 for text, in **both** themes.
- Colour is never the sole encoding — pair with position, a glyph, a numeral, or a label.
- The categorical seeds are Okabe-Ito: distinguishable under all three common
  colour-vision deficiencies. A brand that overrides them owns redoing that check.
- Blue-orange is the safe pair. Red-green always needs a second channel.


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
| Customer Actions | `description`, `doing` | `--layer-customer-bg` / `--layer-customer-ln` |
| Frontstage | `frontstage`, `frontstageAction` | `--layer-customer-bg` / `--layer-customer-ln` |
| Backstage | `backstage`, `backstageAction` | `--layer-backstage-bg` / `--layer-backstage-ln` |
| Support Processes | `supportProcess`, `systems` | `--layer-support-bg` / `--layer-support-ln` |

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
