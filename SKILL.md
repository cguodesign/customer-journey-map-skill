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
3. **Persist specifics into fields, not just into the reply.** When the user states a concrete fact — a duration, a metric, a pain point, a failure, an emotion — write it onto the relevant step's field immediately. Do this whether it arrives in a big opening description or a later focused turn; a salient fact buried in an opening dump must land in the file just as reliably as one given on its own. Acknowledging it in conversation is not enough.
4. Group steps into milestones as natural clusters emerge. Propose milestone boundaries; let user confirm.
5. Ask about hidden dimensions when appropriate:
   - Backstage: "What system or team supports this?"
   - Failure path: "What if this step fails — where does the user go?"
   - Temporal: "How long does this take?"
6. After 3-5 steps, pause and offer to narrow focus. Name the 1-2 categories you keep capturing and ask it as a direct yes/no: "We keep coming back to [emotion] and [failure]. Want me to focus on those and stop surfacing other dimensions?" Don't bury this as a soft aside — make it an explicit offer the user can answer.
7. Write journey data to canonical file. Refer to `references/journey.format.md` for syntax.

### What not to do in Plan

- Do not ask for evidence sources. Provenance is automatic.
- Do not present a field selection menu at session start.
- Do not push categories the user hasn't shown interest in.
- Do not refuse to write a step because information is incomplete.
- Do not write `_provenance` markers on ordinary Plan input. Plain description is the default state — no marker. (Markers are exception-only; see the Provenance section.)

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

   Consult `assets/templates/rendering/` for HTML structure, `assets/templates/interaction/` for JS behavior, and `assets/templates/wireframes/` for combined layout reference. See `references/html-rendering-guide.md` for color system and data mapping.

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

### Engineering handoff mechanics

- **Spec-shaped**: Sections per addressable fix, each mapped to its journey step.
- **Current vs required**: State today's behavior, then the required behavior.
- **Acceptance criteria as checkboxes**: Write each criterion as a `- [ ]` Markdown checkbox — specific, testable, one assertion per box.
- **Edge cases, systems, dependencies**: List them explicitly; note build order.
- **Source references inline**: Cite the journey fields each requirement derives from.

---

## Storage

Detect user environment and select storage adapter:

| Signal | Storage | Action |
|--------|---------|--------|
| Running in Claude Code | `./.journey/<name>.md` | Read/write directly |
| Notion MCP connected | Shared workspace page | Read/write via MCP |
| Drive MCP connected | Shared folder .md file | Read/write via MCP |
| No storage detected | Conversation paste | Ask user to paste previous journey.md; output updated version for user to save |

When running in Claude Code, always write journey files inside the `./.journey/`
directory — create it if it does not exist — never to the project root. The path is
`./.journey/<slugified-name>.md`. Read existing journeys from the same directory.

### Degraded path (no storage)

When no adapter is available:
1. Ask user to paste their existing journey.md content (or start fresh).
2. Work entirely in conversation.
3. At end of session, output the complete updated journey.md for user to copy and store.

Never assume storage adapter presence. Always support paste-back flow.

---

## Provenance (automatic, exception-only)

Track field-level provenance without user involvement. Markers are the **exception, not the rule** — in a typical file the large majority of fields carry no marker. A marker is a signal; if everything is marked, the signal is lost.

Write a marker in exactly two cases. Everything else gets **no marker** (default — model-authored from the conversation):

| Case | Marker | Fires when |
|------|--------|-----------|
| Evidence-backed | `_provenance: source: [ref]` | The model fills a field from material the user **explicitly presents as evidence** — research, interviews, analytics, an incident report. Not for claims the user mentions casually while describing the journey ("a lot of people give up here" in conversation is ordinary Plan input, **no marker** — unless they cite it as a finding). |
| User-locked | `_provenance: user-modified, [date]` | The user **overrides a value that already exists**, or explicitly insists a field's wording is final/locked. This protects it from future model revision. |

### The Plan-vs-edit distinction (this is where it goes wrong)

In Plan mode the user authors almost everything by describing it. Do **not** mark all that as `user-modified` — ordinary Plan input is the default state and carries **no marker**. The `user-modified` marker is reserved for a deliberate *edit/override of a value that already exists*, or an explicit lock.

- User: "verification takes 3 days and feels broken" → write `duration: 3 business days` + a `painPoint`, **no marker** (ordinary Plan input).
- User: "change that emotion to 'dread'" or "lock the label as exactly 'The Silent Treatment'" → `_provenance: user-modified, [date]` (an explicit edit/lock).
- Model writes `dropoffRate: 40%` from the user's interview data → `_provenance: source: user interviews` (evidence-backed).

**Apply locks consistently.** If the user says "call it exactly X", "phrased EXACTLY ...", or "my wording is final", that locks the field — mark **every** field they locked that way, persona names included, not just some of them. Treat the same phrasing the same way across the whole file.

**Stay silent about it.** Provenance is invisible to the user during Plan — write the markers, but do not narrate or explain them in your reply ("I marked this user-modified because…"). Markers surface in Express outputs and are consulted during Modify, not announced while building.

---

## Reference files

For detailed field vocabulary, format syntax, and rules:

- **`references/journey.schema.md`** — Complete field definitions (13 categories, ~100 fields), composite/atomic rules, namespace conventions, provenance system details.
- **`references/journey.format.md`** — Canonical markdown format: preamble structure, milestone/step syntax, provenance notation, cross-references, complete example.

- **`references/html-rendering-guide.md`** — Interactive HTML rendering: M×N combination matrix, selection logic, color system, data-to-visual mapping.
- **`assets/templates/rendering/`** — 4 rendering mode references (card-grid, timeline, swimlane, emotion-curve). HTML structure + CSS, no JS.
- **`assets/templates/interaction/`** — 4 interaction mode references (scroll-driven, focus+context, zoom-pan, multi-view). JS behavior patterns.
- **`assets/templates/wireframes/`** — 11 wireframes (one per valid M×N combination). Minimal layout sketches with integration comments.

Consult these when reading or writing journey files. Do not memorize field lists — reference the schema document when suggesting fields.
