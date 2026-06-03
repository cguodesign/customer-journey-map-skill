---
name: journey
description: This skill should be used when the user wants to "create a customer journey", "map a journey", "build a CJM", "update my journey", "modify the journey map", "express the journey for stakeholders" (as a storyline, one-page brief, engineering handoff, or interactive HTML map), "review a journey for gaps", "find other journeys worth mapping", "create a service blueprint", or needs help structuring, evolving, presenting, or reviewing customer journey understanding.
---

# Journey Skill

Build, evolve, and express customer journey maps as long-term living documents.

## Modes

Detect which mode the user needs from conversation context:

- **Plan** — User wants to build a new journey or add to one in progress.
- **Modify** — User returns with new information to update an existing journey.
- **Express** — User wants to render the journey for a specific audience.
- **Review** — User wants to step back: assess a whole journey's health, or discover other journeys worth mapping across their portfolio.

Mode tracks where the project is in its lifecycle — early discussion leans Plan;
sharing/evaluating leans Express; active building leans Modify; a mature, stable map
leans Review. Infer the phase and bias accordingly (see "Lifecycle & surfacing").

---

## Routing

One hop from intent to the right place. Detect the signal, enter the mode, load only
what that mode needs, surface the affordances for the user's phase.

| When the user… | Mode | Load | Then |
|----------------|------|------|------|
| starts fresh, or the map is sparse | Plan | `references/journey.format.md`; `references/journey.schema.md` (to suggest fields) | scaffold; offer a full draft |
| returns with new information | Modify | the journey file; `journey.format.md`; the Provenance rules below; `journey.schema.md` if new fields appear | show a diff before writing |
| wants to share or present | Express | the journey file; for HTML also `references/html-rendering-guide.md` + `assets/templates/*` | ask audience + goal; name the four formats |
| has a mature map, or asks "what's missing / what next" | Review | every file in `./.journey/`; `journey.schema.md` (category coverage); `html-rendering-guide.md` if visualizing | health review + adjacent journeys |
| introduces a novel concept needing a field | (current mode) | `journey.schema.md` → "Custom field conventions" | propose a namespace, register it in the preamble |
| pre-sets which dimensions to track | Plan | `journey.schema.md` → "Category activation" | honor `active-categories`; suggest within them |
| has more than one journey in `./.journey/` | (any) | list them; ask which if intent is ambiguous | disambiguate before loading |
| has no storage available | Express / Modify | — | paste-back flow (see Storage) |

Load on demand — never read every reference up front. Pull a reference only when the
row calls for it.

**Naming new fields.** Before writing any field that is not in the schema vocabulary,
recognize it as a custom field and route through the custom-field flow (propose a
namespace, register it in the preamble) — this includes ad-hoc summaries like
`backstageSummary`. For a high-level summary of detail already captured **on a step**
(frontstage / backstage / support), use that **composite field** with
`_provenance: auto-composite` instead of inventing one; the schema has no
milestone-level composite, so a cross-step rollup is either a registered custom field
or a step-level composite — never an unregistered ad-hoc field.

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
   - Narrative / empathy, strong arc with per-step scenes → Storyboard (a film-storyboard table; the visual cousin of the Storyline)

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

### One-page brief mechanics

- **Decision-first**: Lead with the ask; restate it as a single decision line at the end.
- **Structure**: Problem (with the data that exists) → proposed fix → the ask → cost of inaction.
- **One page**: Ruthless. It must survive a 90-second skim.
- **Inline attribution**: Cite sources inline. Never invent a metric the journey doesn't carry — if a claim is un-sourced, frame it as a hypothesis and recommend instrumenting it.

### Engineering handoff mechanics

- **Spec-shaped**: Sections per addressable fix, each mapped to its journey step.
- **Current vs required**: State today's behavior, then the required behavior.
- **Acceptance criteria as checkboxes**: Write each criterion as a `- [ ]` Markdown checkbox — specific, testable, one assertion per box.
- **Edge cases, systems, dependencies**: List them explicitly; note build order.
- **Source references inline**: Cite the journey fields each requirement derives from.

---

## Review mode

The user has a mature map and wants to step back — assess it, or find what to map
next. Two jobs:

### 1. Journey health review

Load the full journey and report its soft spots — don't just summarize it back:

- **Thin coverage** — milestones/steps with only the required fields, where richer
  detail would help.
- **Missing failure paths** — steps with no `failureMode`/`recoveryPath` where things
  realistically break.
- **Evidence gaps** — high-stakes claims (drop-off, moments of truth) that carry no
  `_provenance: source:` marker. These are model-authored guesses worth validating
  with real research. Name them.
- **Moments of truth** — surface the make-or-break steps so the user can prioritize.
- **Category lopsidedness** — e.g. rich on emotion, silent on systems/accessibility —
  offered as "want to go deeper on X?", never as a demand.

### 2. Adjacent-journey discovery (portfolio)

From the current journey — and any others in storage — propose **other user journeys
worth mapping**. Good candidates:

- A failure path significant enough to deserve its own journey (e.g. the
  dispute/chargeback journey behind a payments map).
- Other personas implied but not mapped (the admin, the support agent, the returning user).
- Upstream/downstream journeys (what happened before step 1; what happens after the exit).
- High-frequency edge cases the main happy path glosses over.

Scan `./.journey/` for existing journeys; present a short **portfolio index** and spot
gaps or overlaps. Propose adjacencies as a ranked shortlist with one line of rationale
each — do **not** auto-create them. When the user picks one, switch to Plan for it.

---

## Lifecycle & surfacing capabilities

The vocabulary is deep (≈100 fields) but must stay invisible until relevant. Surface
capability by naming concrete next actions at transition points — never by listing
fields or dumping a menu. Bias what you surface to the project phase:

- **Early / sparse map (discovery)** — offer to scaffold fast: "want me to draft the
  whole arc, then we refine?" Keep friction low; don't interrogate.
- **Map exists, user wants to share (evaluation)** — name the Express formats: "I can
  express this — storyline (to feel it), brief (to decide), engineering handoff (to
  build), or an interactive map (to explore)."
- **Building Interactive HTML** — after stating your rendering/interaction pick, name
  the options the user can't see: "I can also theme it to your brand, add a dark
  version, or switch the view — swimlane (backstage), timeline (the wait), emotion
  curve (the arc), or a storyboard (frame-by-frame, like a film)."
- **Actively changing (development)** — invite updates plainly ("tell me what
  changed"), stay quiet otherwise, lean on the diff.
- **Mature / stable map** — proactively offer Review: "want me to check the whole map
  for soft spots and point out adjacent journeys worth mapping?"

Rules: surface **affordances** (modes → Express formats → HTML options), layered by
depth, never the field/category list. If the user asks what you can do, give a
one-paragraph tour (build, update, express, review), not a catalog.

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

When `./.journey/` holds more than one journey, do not assume the most recent. If the
user's request names or clearly implies one, load that file. Otherwise list the
journeys and ask which one before reading or writing.

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
