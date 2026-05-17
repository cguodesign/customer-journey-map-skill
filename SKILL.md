---
name: journey
description: This skill should be used when the user wants to "create a customer journey", "map a journey", "build a CJM", "update my journey", "modify the journey map", "express the journey for stakeholders", "create a service blueprint", or needs help structuring, evolving, or presenting customer journey understanding.
---

# Journey Skill

Build, evolve, and express customer journey maps as long-term living documents.

## Modes

Detect which mode the user needs from conversation context:

- **Plan** — User wants to build a new journey or add to one in progress.
- **Modify** — User returns with new information to update an existing journey.
- **Express** — User wants to render the journey for a specific audience.

---

## Plan mode

Accept what the user says and build. Do not challenge, interrogate, or refuse.

### Behavior

1. Start with required fields only: `persona`, `milestone`, `description`.
2. Suggest optional fields organically when conversation surfaces them. Example: user mentions frustration → suggest `emotion`. User describes a backend system → suggest `backstage` or `systems`.
3. Group steps into milestones as natural clusters emerge. Propose milestone boundaries; let user confirm.
4. Ask about hidden dimensions when appropriate:
   - Backstage: "What system or team supports this?"
   - Failure path: "What if this step fails — where does the user go?"
   - Temporal: "How long does this take?"
5. After 3-5 steps, offer a meta-pause: "I notice we keep capturing [categories]. Want me to focus on those and stop suggesting others?"
6. Write journey data to canonical file. Refer to `references/journey.format.md` for syntax.

### What not to do in Plan

- Do not ask for evidence sources. Provenance is automatic.
- Do not present a field selection menu at session start.
- Do not push categories the user hasn't shown interest in.
- Do not refuse to write a step because information is incomplete.

---

## Modify mode

Load the existing journey file. Ask "What changed?" — do not assume redraw.

### Behavior

1. Read the journey file from storage (see Storage section below).
2. Ask what new information the user is bringing (new research, incidents, product changes).
3. Compare new information against existing steps:
   - Confirmed: step still holds, possibly upgrade provenance.
   - Contradicted: flag the conflict, ask how to resolve.
   - Stale: step references something that no longer exists.
   - New: previously hidden steps now visible.
4. Output changes as a diff summary before writing:
   - What changed
   - Why (based on new material)
   - What downstream steps may be affected
5. Write back to journey file. Mark provenance on updated fields:
   - User directly changes a field → `_provenance: user-modified, [date]`
   - Model updates from user material → `_provenance: source: [reference]`
6. Respect existing `user-modified` fields — do not silently overwrite. Ask before changing them.

---

## Express mode

Transform journey understanding into audience-appropriate output.

### Behavior

1. Ask two questions:
   - "Who is the audience?"
   - "What should they do, decide, or feel after seeing this?"
2. Select expression format:

| Expression | Use when... |
|---|---|
| **Storyline** | Audience needs to *feel* the journey. Kickoff, design crit, empathy-building. |
| **One-page brief** | Leadership needs to decide. Quick review, stakeholder sign-off. |
| **Interactive HTML** | Workshop/reference use. Layered, expandable, explorable. |
| **Engineering handoff** | Dev team needs to build. Acceptance criteria, spec-shaped. |

3. For Interactive HTML, select rendering mode + interaction mode:

   **Rendering** (from data shape):
   - Default → Card grid
   - Active categories include frontstage/backstage/support → Swimlane
   - Primary dimension is temporal/duration → Timeline
   - Emotional arc is focus → Emotion curve (or as overlay/multi-view tab)

   **Interaction** (from step count):
   - ≤ 15 steps → Scroll-driven
   - 16–60 steps → Focus+Context
   - \> 60 steps → Zoom-pan
   - Multiple audiences → Multi-view (tabs between rendering modes)

   Use the matching template from `assets/templates/` as base. Inject journey data into the template's `journeyData` object. Consult `references/html-rendering-guide.md` for color system and data mapping.

4. Render from journey file data. Include only active categories and filled fields.
5. Show provenance in output:
   - Storyline: footnotes/endnotes (preserve narrative flow)
   - Brief: inline attribution markers
   - Interactive HTML: expandable provenance panels
   - Engineering handoff: inline source references

### Storyline mechanics

- **Character**: Specific name, role, recent context. Not "the user."
- **Scene**: Sensory detail — device, time, surroundings.
- **Arc**: Tension and turn, not flat sequence. Buildup → pivot → resolution.
- **Analogy**: When the journey resembles a familiar non-product experience, use it.
- **Voice**: Third-person, present-action verbs.

---

## Storage

Detect user environment and select storage adapter:

| Signal | Storage | Action |
|--------|---------|--------|
| Running in Claude Code | `./.journey/<name>.md` | Read/write directly |
| Notion MCP connected | Shared workspace page | Read/write via MCP |
| Drive MCP connected | Shared folder .md file | Read/write via MCP |
| No storage detected | Conversation paste | Ask user to paste previous journey.md; output updated version for user to save |

### Degraded path (no storage)

When no adapter is available:
1. Ask user to paste their existing journey.md content (or start fresh).
2. Work entirely in conversation.
3. At end of session, output the complete updated journey.md for user to copy and store.

Never assume storage adapter presence. Always support paste-back flow.

---

## Provenance (automatic)

Track field-level provenance without user involvement.

- Model-generated content → no marker (default).
- User explicitly changes a field → mark `_provenance: user-modified, [date]`.
- Model infers from user-provided material → mark `_provenance: source: [ref]`.

Provenance is invisible to user during Plan. Visible in Express outputs and consulted during Modify.

---

## Reference files

For detailed field vocabulary, format syntax, and rules:

- **`references/journey.schema.md`** — Complete field definitions (13 categories, ~100 fields), composite/atomic rules, namespace conventions, provenance system details.
- **`references/journey.format.md`** — Canonical markdown format: preamble structure, milestone/step syntax, provenance notation, cross-references, complete example.

- **`references/html-rendering-guide.md`** — Interactive HTML rendering: M×N combination matrix, selection logic, color system, data-to-visual mapping.
- **`assets/templates/*.html`** — 11 self-contained HTML templates (one per valid rendering × interaction combination). Inject journey data into the `journeyData` JS object.

Consult these when reading or writing journey files. Do not memorize field lists — reference the schema document when suggesting fields.
