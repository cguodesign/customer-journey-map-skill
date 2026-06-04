---
name: journey
description: This skill should be used when the user wants to "create a customer journey", "map a journey", "build a CJM", "update my journey", "modify the journey map", "express the journey for stakeholders" (as a storyline, one-page brief, engineering handoff, or interactive HTML map), "review a journey for gaps", "find other journeys worth mapping", "create a service blueprint", or needs help structuring, evolving, presenting, or reviewing customer journey understanding.
---

# Journey Skill

Build, evolve, and express customer journey maps as long-term living documents.

This file is a **thin router**: detect the mode, load that mode's playbook, and apply the
cross-cutting rules below (Storage, Provenance, naming, surfacing). The depth of each mode
lives in its playbook and is loaded only when that mode is active.

## Modes

Detect the mode from conversation context; load its playbook on demand:

- **Plan** — build a new journey, or add to one in progress. → `references/modes/plan.md`
- **Modify** — update an existing journey with new information. → `references/modes/modify.md`
- **Express** — render the journey for a specific audience. → `references/modes/express.md`
- **Review** — assess a mature map's health, or discover adjacent journeys. → `references/modes/review.md`

Mode tracks where the project is in its lifecycle — early discussion leans Plan;
sharing/evaluating leans Express; active building leans Modify; a mature, stable map
leans Review. Infer the phase and bias accordingly (see "Lifecycle & surfacing").

---

## Routing

One hop from intent to the right place. Detect the signal, enter the mode, load only what
that mode needs, surface the affordances for the user's phase.

| When the user… | Mode | Load | Then |
|----------------|------|------|------|
| starts fresh, or the map is sparse | Plan | `references/modes/plan.md`; `references/journey.format.md`; `references/journey.schema.md` (to suggest fields) | scaffold; offer a full draft |
| returns with new information | Modify | `references/modes/modify.md`; the journey file; `journey.format.md`; Provenance (below); `journey.schema.md` if new fields appear | show a diff before writing |
| wants to share or present | Express | `references/modes/express.md`; the journey file; for HTML also `references/html-rendering-guide.md` + `assets/templates/*` | ask audience + goal; name the four formats |
| has a mature map, or asks "what's missing / what next" | Review | `references/modes/review.md`; every file in `./.journey/`; `journey.schema.md` (category coverage); `html-rendering-guide.md` if visualizing | health review + adjacent journeys |
| introduces a novel concept needing a field | (current mode) | `journey.schema.md` → "Custom field conventions" | propose a namespace, register it in the preamble |
| pre-sets which dimensions to track | Plan | `journey.schema.md` → "Category activation" | honor `active-categories`; suggest within them |
| has more than one journey in `./.journey/` | (any) | list them; ask which if intent is ambiguous | disambiguate before loading |
| has no storage available | Express / Modify | — | paste-back flow (see Storage) |

Load on demand — never read every reference up front. Pull a reference only when the row
calls for it.

**Naming new fields.** Before writing any field that is not in the schema vocabulary,
recognize it as a custom field and route through the custom-field flow (propose a namespace,
register it in the preamble) — this includes ad-hoc summaries like `backstageSummary`. For a
high-level summary of detail already captured **on a step** (frontstage / backstage /
support), use that **composite field** with `_provenance: auto-composite` instead of
inventing one; the schema has no milestone-level composite, so a cross-step rollup is either
a registered custom field or a step-level composite — never an unregistered ad-hoc field.

---

## Lifecycle & surfacing capabilities

The vocabulary is deep (≈100 fields) but must stay invisible until relevant. Surface
capability by naming concrete next actions at transition points — never by listing fields or
dumping a menu. Bias what you surface to the project phase:

- **Early / sparse map (discovery)** — offer to scaffold fast: "want me to draft the whole
  arc, then we refine?" Keep friction low; don't interrogate.
- **Map exists, user wants to share (evaluation)** — name the Express formats: "I can express
  this — storyline (to feel it), brief (to decide), engineering handoff (to build), or an
  interactive map (to explore)."
- **Building Interactive HTML** — after stating your rendering/interaction pick, name the
  options the user can't see: "I can also theme it to your brand, add a dark version, or
  switch the view — swimlane (backstage), timeline (the wait), emotion curve (the arc), or a
  storyboard (frame-by-frame, like a film)."
- **Actively changing (development)** — invite updates plainly ("tell me what changed"), stay
  quiet otherwise, lean on the diff.
- **Mature / stable map** — proactively offer Review: "want me to check the whole map for soft
  spots and point out adjacent journeys worth mapping?"

Rules: surface **affordances** (modes → Express formats → HTML options), layered by depth,
never the field/category list. If the user asks what you can do, give a one-paragraph tour
(build, update, express, review), not a catalog.

---

## Storage

Detect user environment and select storage adapter:

| Signal | Storage | Action |
|--------|---------|--------|
| Running in Claude Code | `./.journey/<name>.md` | Read/write directly |
| Notion MCP connected | Shared workspace page | Read/write via MCP |
| Drive MCP connected | Shared folder .md file | Read/write via MCP |
| No storage detected | Conversation paste | Ask user to paste previous journey.md; output updated version for user to save |

When running in Claude Code, always write journey files inside the `./.journey/` directory —
create it if it does not exist — never to the project root. The path is
`./.journey/<slugified-name>.md`. Read existing journeys from the same directory.

When `./.journey/` holds more than one journey, do not assume the most recent. If the user's
request names or clearly implies one, load that file. Otherwise list the journeys and ask
which one before reading or writing.

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

The mode playbooks (loaded per the Routing table):

- **`references/modes/{plan,modify,express,review}.md`** — the per-mode behavior, loaded only when that mode is active.

For field vocabulary, format syntax, and HTML rendering:

- **`references/journey.schema.md`** — Complete field definitions (13 categories, ~100 fields), composite/atomic rules, namespace conventions, provenance system details.
- **`references/journey.format.md`** — Canonical markdown format: preamble structure, milestone/step syntax, provenance notation, cross-references, complete example.
- **`references/html-rendering-guide.md`** — Interactive HTML rendering: combination matrix, selection logic, color system, data-to-visual mapping.
- **`assets/templates/rendering/`** — 5 rendering modes (card-grid, timeline, swimlane, emotion-curve, storyboard). HTML structure + CSS.
- **`assets/templates/interaction/`** — 4 interaction modes (scroll-driven, focus+context, zoom-pan, multi-view). JS behavior patterns.
- **`assets/templates/wireframes/`** — wireframes per valid combination. Minimal layout sketches with integration comments.

Consult these when reading or writing journey files. Do not memorize field lists — reference the schema document when suggesting fields.
