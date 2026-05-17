# Journey Format Specification

This document defines the canonical markdown format for journey files produced and consumed by the Journey Skill.

---

## File conventions

- Extension: `.md`
- Encoding: UTF-8
- Default location: `./.journey/<name>.md` (Claude Code), or equivalent in shared storage
- One journey per file

---

## Document structure

A journey file has three sections in order:

```
1. Preamble (journey-level metadata)
2. Milestones (ordered list of milestone headings)
3. Steps (nested under their parent milestone)
```

---

## 1. Preamble

The preamble is a YAML-like block at the top of the file, wrapped in `---` fences.

```markdown
---
journey: First-time onboarding
created: 2026-05-16
last-modified: 2026-05-16
personas:
  - name: Sarah
    role: Design manager, recently switched jobs
    type: primary
  - name: IT-Bot
    role: Automated onboarding system
    type: system
structure: Journey > Milestone > Step
active-categories: [emotional, service-layers, failure]
custom-fields:
  - team_urgency: "Internal priority rating"
  - vertical_complianceTier: "Regulatory tier for this flow"
---
```

### Preamble fields

| Field | Required | Description |
|-------|----------|-------------|
| `journey` | yes | Journey name/title |
| `created` | yes | ISO date of creation |
| `last-modified` | yes | ISO date of last modification |
| `personas` | yes | Array of persona objects (name, role, type) |
| `structure` | no | Hierarchy description (default: `Journey > Milestone > Step`) |
| `active-categories` | no | Which optional field categories are active (omit = organic mode) |
| `custom-fields` | no | User-defined field registry with descriptions |

### Persona types

- `primary` — the main actor whose journey this is
- `secondary` — other human actors involved
- `system` — automated systems/bots
- `backstage` — staff/teams not visible to primary actor

---

## 2. Milestones

Milestones are `## ` level headings. They appear in journey order.

```markdown
## Milestone: account-setup

- title: Account Setup
- description: User creates and configures their account for first use
```

### Milestone format rules

- Heading format: `## Milestone: <id>`
- `id` is kebab-case, unique within the file
- `title` and `description` are required fields, written as bullet list items
- No other required fields on milestones

---

## 3. Steps

Steps are `### ` level headings, nested under their parent milestone.

```markdown
### Step: discover-signup-page

- persona: [Sarah]
- description: Finds the signup link in the Slack welcome channel

- emotion: Cautious curiosity
- channel: Slack #welcome
- duration: ~2 min
- touchpoint: Welcome channel auto-post
- backstage:
  - system: IT-Bot
  - action: Auto-posts link via Slack webhook
  - failureMode: Bot token expires quarterly
- failureMode: Link expired or not posted
- recoveryPath: Ask colleague manually → colleague shares link in DM
- next: → attempt-first-configuration
```

### Step format rules

- Heading format: `### Step: <id>`
- `id` is kebab-case, unique within the file
- Required fields appear first: `persona`, `description`
- Optional fields follow after a blank line separator
- Fields are bullet list items (`- fieldName: value`)
- Nested/complex values use indented sub-bullets

---

## Field value formats

### Simple values

```markdown
- emotion: Frustrated
- duration: ~8 min
- channel: Web app
```

### Array values

```markdown
- persona: [Sarah, IT-Bot]
- systems: [CRM, Config-service, Slack API]
```

### Nested object values

Use indented sub-bullets:

```markdown
- backstage:
  - system: Config-service
  - action: Serves configuration UI
  - failureMode: 12s cold start
  - owner: Platform-team
```

### Multi-value fields (multiple entries of same type)

Repeat the field name with indexed sub-objects:

```markdown
- painPoint:
  - "Didn't know what half the options meant"
  - "Page felt broken during cold start"
- opportunity:
  - description: Guided defaults with explain-this tooltip
    effort: medium
    impact: high
  - description: Progressive disclosure — show 3 essential fields first
    effort: low
    impact: medium
```

### Cross-references

Use `→ <step-id>` syntax for references to other steps:

```markdown
- next: → attempt-first-configuration
- recoveryPath: → ask-colleague-for-help
- branchCondition: If config fails → abandon-flow
```

---

## Provenance notation

Provenance is written as an indented `_provenance` sub-field on any field that carries non-default tracking.

### No provenance (default — model-generated)

Field is written cleanly with no metadata:

```markdown
- emotion: Frustrated
```

### User-modified

```markdown
- emotion: Frustrated
  - _provenance: user-modified, 2026-05-16
```

### Source-based (model inferred from material)

```markdown
- dropoffRate: 40%
  - _provenance: source: analytics-2024-Q3
```

### Multiple provenance on nested fields

Each sub-field can carry its own provenance independently:

```markdown
- backstage:
  - system: Config-service
  - action: Serves configuration UI
    - _provenance: user-modified, 2026-05-16
  - failureMode: 12s cold start
    - _provenance: source: incident-report-2024-08
```

### Provenance rules

1. Default state (model-generated) carries **no marker** — field is written cleanly.
2. Only `user-modified` and `source: [ref]` are written.
3. Provenance attaches to the **immediate field above it** (indentation determines scope).
4. In most journey files, the majority of fields will have no provenance marker.

---

## Composite vs atomic fields

When both composite and atomic fields exist for the same concept on a step:

```markdown
### Step: attempt-configuration

- persona: [Sarah]
- description: Tries to configure workspace settings

# Atomic (preferred when both exist):
- doing: Clicking through configuration wizard
- frontstageAction: System shows settings form
- inputRequired: Workspace name, team size, role

# Composite (auto-generated summary, marked):
- frontstage: User navigates settings wizard; system presents form requiring workspace name, team size, and role
  - _provenance: auto-composite
```

Rules:
- If atomic fields are filled, composite is auto-generated with `_provenance: auto-composite`
- If only composite is filled (high-level conversation), it stands alone without atomic breakdown
- Never manually fill both levels for the same concept

---

## Custom fields

Custom fields follow the namespace convention:

```markdown
- team_urgency: P1
  - _provenance: user-modified, 2026-05-16
- vertical_complianceTier: SOC2-required
- experiment_variantId: onboarding-v2-simplified
```

Custom fields must be registered in the preamble's `custom-fields` block to be recognized across sessions.

---

## Complete example

```markdown
---
journey: First-time onboarding
created: 2026-05-16
last-modified: 2026-05-16
personas:
  - name: Sarah
    role: Design manager, recently switched jobs
    type: primary
  - name: IT-Bot
    role: Automated onboarding system
    type: system
  - name: Platform-team
    role: Engineering team owning config service
    type: backstage
active-categories: [emotional, service-layers, failure, temporal]
---

## Milestone: awareness

- title: Awareness
- description: User discovers the product exists and finds entry point

### Step: discover-signup-page

- persona: [Sarah]
- description: Finds the signup link in the Slack welcome channel

- emotion: Cautious curiosity
- channel: Slack #welcome
- duration: ~2 min
- trigger: First day at new company, IT-Bot posts in channel
- backstage:
  - system: IT-Bot
  - action: Auto-posts signup link via Slack webhook
  - failureMode: Bot token expires quarterly, link not posted
- failureMode: Link expired or not posted
- recoveryPath: → ask-colleague
- next: → attempt-first-configuration

### Step: ask-colleague

- persona: [Sarah]
- description: Asks a teammate for the signup link directly

- emotion: Mild embarrassment
- channel: Slack DM
- duration: ~5 min (depends on colleague response time)
- waitTime: 1-30 min
- entryPoint: true
- next: → attempt-first-configuration

---

## Milestone: activation

- title: Activation
- description: User creates account and completes initial configuration

### Step: attempt-first-configuration

- persona: [Sarah]
- description: Opens configuration page and attempts to set up workspace

- emotion: Frustration → confusion
  - _provenance: source: interview-05
- channel: Web app /settings
- duration: ~8 min
- cognitiveLoad: high
- doing: Clicking through configuration wizard fields
- backstage:
  - system: Config-service
  - action: Serves configuration UI
  - failureMode: 12s cold start, perceived as broken
    - _provenance: source: incident-report-2024-08
  - owner: Platform-team
- painPoint:
  - "Didn't know what half the options meant"
    - _provenance: source: interview-05
  - "Page felt broken during cold start"
- failureMode: User abandons configuration
- recoveryPath: → ask-colleague-screenshare
- next: → complete-setup
- team_urgency: P1
  - _provenance: user-modified, 2026-05-16

### Step: ask-colleague-screenshare

- persona: [Sarah]
- description: Gets a colleague to screenshare their completed config as reference

- emotion: Relief mixed with frustration at needing help
- channel: Zoom / Slack huddle
- duration: ~15 min
- workaround: true
- next: → complete-setup

### Step: complete-setup

- persona: [Sarah]
- description: Successfully completes configuration with or without help

- emotion: Accomplishment, mild residual frustration
- channel: Web app /settings
- duration: ~3 min (with reference) / ~12 min (without)
- exitPoint: true
```

---

## Format versioning

This format is version `0.1`. The version is not written into journey files — it's implied by the skill version that produced them. Future format changes will be backward-compatible (additive fields, not breaking structure).

---

## Parsing notes (for model reference)

When reading a journey file:

1. Parse preamble between `---` fences as YAML-like key-value pairs.
2. Identify milestones by `## Milestone: <id>` headings.
3. Identify steps by `### Step: <id>` headings.
4. For each step, parse bullet items as fields. First-level bullets are field names; indented bullets are nested values or provenance.
5. `_provenance` sub-bullets always attach to the field on the line directly above them.
6. `→ <step-id>` is a cross-reference to another step in the file.
7. Fields not in the pre-defined vocabulary are treated as custom fields.

When writing a journey file:

1. Always write preamble first.
2. Order milestones by journey sequence.
3. Order steps within milestones by happy-path sequence; alternative/failure steps after the step they branch from.
4. Write required fields first, then optional fields after a blank line.
5. Only write provenance markers for non-default states.
6. Register any new custom fields in the preamble's `custom-fields` block.
