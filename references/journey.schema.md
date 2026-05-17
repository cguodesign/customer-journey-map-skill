# Journey Schema Reference

Complete field vocabulary for the Journey Skill. This document defines all pre-defined fields, their categories, usage guidelines, and provenance rules.

---

## Schema principles

1. **Schema-rich, user-light.** The vocabulary is comprehensive; users activate what they need.
2. **Open for extension, closed for required fields.** Only 3 fields are required per step. Everything else is optional.
3. **Organic emergence.** Fields are suggested by the model during conversation, not demanded upfront.
4. **Category-level activation.** Users opt into categories (e.g., "emotional"), not individual fields.
5. **Provenance is automatic.** Users never manually annotate — the system marks non-default provenance.

---

## Core structure

```
Journey (preamble)
  └── Milestone (lightweight grouping)
       └── Step (atomic unit)
```

---

## Required fields

### Journey (preamble)

| Field | Type | Description |
|-------|------|-------------|
| `journey` | string | Journey name/title |
| `created` | date | ISO creation date |
| `last-modified` | date | ISO last modification date |
| `personas` | array | Persona definitions (name, role, type) |

### Milestone

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (kebab-case) |
| `title` | string | Human-readable name |
| `description` | string | What this group of steps covers |

### Step

| Field | Type | Description |
|-------|------|-------------|
| `persona` | array | Who is involved in this step |
| `milestone` | string | Parent milestone id (implicit from nesting) |
| `description` | string | What happens at this step |

---

## Optional field categories

### Category A: Emotional / Cognitive

Captures the internal experience of the actor at each step.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `emotion` | string | Named emotion (frustrated, delighted, anxious...) | User mentions feeling/reaction |
| `emotionValence` | number | Rating scale -2 (very negative) to +2 (very positive) | Quantifying emotional journey |
| `emotionIntensity` | enum | low / medium / high | Distinguishing mild from strong reactions |
| `thinking` | string | Internal monologue, self-talk, mental model | User describes what someone is "wondering" |
| `cognitiveLoad` | enum | low / medium / high | Step involves complexity or many options |
| `motivation` | string | What drives the person forward | User mentions goals or urgency |
| `anxiety` | string | Specific fears or doubts | User mentions worry or hesitation |
| `expectation` | string | What person expects will happen | Gap between expected and actual matters |
| `trust` | string | Level of trust in the provider | Trust dynamics are relevant |
| `effort` | string | Perceived effort required | Friction is a key theme |
| `confidence` | string | Self-assessed confidence | User mentions uncertainty about doing it right |
| `informationNeed` | string | What information needed to proceed | Knowledge gaps block progress |

**Origin frameworks:** NN/g Journey Maps, JTBD (Moesta), Forrester CX (CES), Adaptive Path.

---

### Category B: Physical / Spatial / Channel

Captures where and through what medium the step happens.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `channel` | string | Interaction channel (web, mobile, phone, in-store, email...) | User mentions where something happens |
| `touchpoint` | string | Specific branded interaction point within a channel | Distinguishing specific UI/artifact |
| `device` | string | Physical device used (phone, laptop, kiosk...) | Device context matters |
| `place` | string | Physical location (home, office, store, transit...) | Physical context affects behavior |
| `environment` | string | Environmental context (noisy, private, public, on-the-go...) | Context shapes experience |
| `physicalEvidence` | string | Tangible artifacts encountered (receipt, signage, packaging...) | Service blueprint depth needed |
| `channelTransition` | string | Cross-channel handoff description | Multi-channel journey |

**Origin frameworks:** Service Blueprint (Shostack), NN/g, Forrester, Adaptive Path.

---

### Category C: Temporal

Captures timing, duration, and rhythm of steps.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `duration` | string | How long this step takes | Time is a factor in experience |
| `waitTime` | string | Idle/waiting time (not value-adding) | Waiting is a pain point |
| `frequency` | string | How often this occurs (once, daily, per-transaction) | Repeated vs one-time matters |
| `trigger` | string | What initiates this step | Causation between steps is non-obvious |
| `deadline` | string | Time pressure or urgency | Deadline shapes behavior |
| `pacing` | enum | rushed / normal / leisurely / stalled | Pace affects emotional state |

**Origin frameworks:** Service Blueprint, JTBD, Forrester, Adaptive Path.

---

### Category D: People / Actors

Captures who else is involved beyond the primary persona.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `coActors` | array | Other people present or involved | Multiple people in the scene |
| `frontlineStaff` | string | Customer-facing employee(s) involved | Human service delivery |
| `backstageStaff` | string | Non-visible staff supporting this step | Backstage is relevant |
| `responsibleTeam` | string | Internal team/department owning this step | Ownership/accountability matters |
| `thirdParty` | string | External partners or vendors involved | External dependencies |
| `handoff` | string | Person-to-person or team-to-team transfer | Handoff is a failure risk |

**Origin frameworks:** Service Blueprint (Shostack), Stickdorn.

---

### Category E: Actions / Behaviors

Captures what people and systems are doing.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `doing` | string | What person is physically doing (verb-based) | Describing specific actions |
| `frontstageAction` | string | Visible employee action | Service blueprint detail |
| `backstageAction` | string | Invisible employee action | Hidden work needs visibility |
| `supportProcess` | string | Internal process supporting this step | Process mapping depth |
| `inputRequired` | string | Information/material person must provide | User must give something |
| `outputProduced` | string | What is produced or delivered at this step | Step has tangible output |
| `workaround` | string | Unofficial user-invented alternative path | Users not using designed path |
| `decision` | string | Choice the person must make | Decision point in the flow |

**Origin frameworks:** Service Blueprint, NN/g, JTBD.

---

### Category F: Systems / Technology

Captures the technical infrastructure enabling or constraining the step.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `systems` | array | Backend systems involved (CRM, database...) | Technical context matters |
| `tools` | string | Tools used by staff or customer | Tooling is part of the experience |
| `technology` | string | Specific technology enabling this step | Tech stack is relevant |
| `dataFlow` | string | What data moves where | Data handling matters |
| `automation` | string | What is automated vs manual | Automation boundary is interesting |
| `dependencies` | array | Technical dependencies that must be met | Dependencies create fragility |
| `notification` | string | System notifications triggered (email, SMS, push) | Notification is part of flow |
| `policy` | string | Business rules governing this step | Rules constrain behavior |

**Origin frameworks:** Service Blueprint (modern), Stickdorn.

---

### Category G: Service Design Layers

Captures the layered view from service blueprinting — frontstage/backstage/support.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `frontstage` | string | Everything visible to customer (composite summary) | High-level blueprint view |
| `backstage` | string | Everything invisible but directly supporting (composite) | High-level blueprint view |
| `supportProcesses` | string | Organizational processes enabling backstage | Deep blueprint view |
| `lineOfVisibility` | string | What is/isn't visible to customer at this step | Visibility boundary matters |
| `valueExchange` | string | What value is exchanged (money, data, time, attention) | Value dynamics are relevant |
| `serviceRecovery` | string | Designed recovery action if failure occurs | Recovery is planned |
| `orchestration` | string | How multiple channels/actors are coordinated | Multi-channel complexity |

**Composite field note:** `frontstage`, `backstage`, and `supportProcesses` are composite fields. When atomic fields from Category E (doing, frontstageAction, backstageAction, supportProcess) are also present, the composites auto-generate from atomics. See "Composite vs atomic rules" below.

**Origin frameworks:** Service Blueprint (Shostack), Stickdorn.

---

### Category H: Business / Metrics

Captures quantitative business impact and ownership.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `kpi` | string | Key performance indicator measured here | Measuring this step |
| `metric` | string | Specific quantitative measurement | Data exists for this step |
| `conversionRate` | string | Conversion or progression rate | Funnel analysis |
| `cost` | string | Cost to serve at this step | Cost optimization |
| `revenueImpact` | string | Revenue generated or at risk | Revenue attribution |
| `dropoffRate` | string | Percentage who abandon at this step | Retention/churn analysis |
| `volumePerPeriod` | string | Transaction volume | Scale context |
| `owner` | string | Business owner of this step | Accountability mapping |

**Origin frameworks:** Forrester CX, Service Blueprint, Stickdorn.

---

### Category I: Design / Opportunities

Captures insights, problems, and potential improvements.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `painPoint` | string | Specific friction or problem | User mentions frustration or blockers |
| `opportunity` | string | Design or business improvement opportunity | Improvement ideas surface |
| `momentOfTruth` | string | Critical make-or-break moment | Step has outsized impact |
| `insight` | string | Research insight relevant here | Research connects to this step |
| `desiredOutcome` | string | What ideal success looks like (JTBD-style) | Defining "done well" |
| `recommendation` | string | Specific recommended action | Actionable suggestion exists |
| `priority` | enum | must-fix / should-fix / nice-to-have | Prioritization needed |

**Origin frameworks:** NN/g, Design Council (Double Diamond), JTBD (Ulwick).

---

### Category J: Failure / Risk

Captures what can go wrong and how to recover.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `failureMode` | string | What can go wrong at this step | Fragility is worth capturing |
| `failureProbability` | enum | low / medium / high | Quantifying risk |
| `failureImpact` | enum | low / medium / high | Severity assessment |
| `recoveryPath` | string | What happens after failure (cross-ref to step) | Recovery flow exists |
| `escalation` | string | Escalation path when things go wrong | Escalation procedures matter |
| `fallback` | string | System fallback if primary path fails | Redundancy exists |
| `bottleneck` | string | Capacity constraint at this step | Capacity is a known issue |
| `risk` | string | Named risk | Risk register integration |

**Origin frameworks:** Service Blueprint, Stickdorn, service design practice.

---

### Category K: Path / Flow

Captures navigation and sequencing between steps.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `next` | string | What follows (cross-ref: `→ step-id`) | Default next step |
| `previous` | string | What preceded (cross-ref: `→ step-id`) | Backtracking matters |
| `branchCondition` | string | What determines which path is taken | Branching logic |
| `parallelPath` | string | Steps happening simultaneously | Concurrent activities |
| `entryPoint` | boolean | Can users enter the journey here | Multiple entry points |
| `exitPoint` | boolean | Can users leave the journey here | Multiple exit points |
| `optionality` | enum | required / optional / conditional | Step isn't always taken |

**Origin frameworks:** All journey frameworks, Service Blueprint.

---

### Category L: Communication / Content

Captures what is said/shown to the user.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `message` | string | What is communicated to customer | Communication design |
| `tone` | string | Tone of communication (formal, friendly, urgent) | Tone matters |
| `contentType` | string | Type of content (help article, video, tooltip, email) | Content strategy |
| `cta` | string | Call-to-action presented | Conversion context |

**Origin frameworks:** Forrester, content strategy practice.

---

### Category M: Accessibility / Inclusion

Captures barriers and considerations for equitable access.

| Field | Type | Description | Suggested when... |
|-------|------|-------------|-------------------|
| `accessibilityBarrier` | string | Barriers for people with disabilities | Accessibility review |
| `inclusionConsideration` | string | Who might be excluded at this step | Inclusion audit |
| `literacyRequirement` | string | Reading/digital literacy needed | Literacy varies across users |
| `economicBarrier` | string | Cost or resource barriers | Economic access varies |
| `culturalConsideration` | string | Cultural norms affecting this step | Cross-cultural deployment |

**Origin frameworks:** Inclusive design practice, service design.

---

## Composite vs atomic rules

Some fields overlap conceptually. The schema handles this with a precedence system.

### Composite fields

These summarize multiple atomic concerns into one narrative:

| Composite | Aggregates from (atomic) |
|-----------|-------------------------|
| `frontstage` | `doing`, `frontstageAction`, `touchpoint`, `physicalEvidence` |
| `backstage` | `backstageAction`, `backstageStaff`, `systems` |
| `supportProcesses` | `supportProcess`, `dependencies`, `policy` |

### Rules

1. **Fill one level, not both.** Users should provide either atomic-level detail or composite-level summary for a given concept.
2. **Atomic takes precedence.** If both exist on the same step, atomic fields are source of truth. Composite is auto-regenerated.
3. **Auto-composite is marked.** When composite is auto-generated from atomics, it carries `_provenance: auto-composite`.
4. **Context determines suggestion.** Model suggests atomic in detailed conversations, composite in high-level overviews.
5. **No forced conversion.** Model never pressures user to break a composite into atomics or vice versa.

---

## Custom field conventions

### Namespace prefixes

Custom fields use namespace prefixes to prevent collision:

| Prefix | Use for | Example |
|--------|---------|---------|
| `team_` | Team-internal concepts | `team_urgency`, `team_ownership` |
| `vertical_` | Industry-specific concepts | `vertical_complianceTier`, `vertical_clinicalRisk` |
| `experiment_` | Hypothesis tracking | `experiment_variantId`, `experiment_hypothesis` |
| `[freeform]_` | Any other user-defined scope | `onboarding_nuxScore` |

### Registration

Custom fields must be registered in the journey file's preamble `custom-fields` block:

```yaml
custom-fields:
  - team_urgency: "Internal priority rating (P0-P3)"
  - vertical_complianceTier: "Regulatory compliance tier for this step"
```

### Creation flow

When user introduces a custom field:
1. Model proposes a namespace prefix and asks user to confirm
2. Model adds field to preamble registry
3. Field is available for use on any step going forward

---

## Provenance system

### States

| State | Written as | Meaning |
|-------|-----------|---------|
| Model-generated | *(nothing)* | Default. No marker written. |
| User-modified | `_provenance: user-modified, <date>` | User explicitly changed this value |
| Source-based | `_provenance: source: <reference>` | Model inferred from user-provided material |
| Auto-composite | `_provenance: auto-composite` | Auto-generated from atomic fields |

### Scope

- Provenance applies to **any field** on any object (step, milestone, preamble field).
- Provenance attaches to the **specific field**, not the parent object.
- One field can only have one provenance state at a time (latest wins).

### Behavior rules

1. **Zero user burden.** Users never manually write or edit provenance markers.
2. **Default is clean.** Most fields in most files carry no provenance metadata.
3. **Modify mode reads provenance** to distinguish:
   - `user-modified` → user intentionally set this; don't overwrite without asking
   - `source: [ref]` → derived from specific evidence; check if source is still valid
   - *(none)* → model-generated; safe to update silently
4. **Express mode renders provenance** based on expression type:
   - Storyline: footnotes/endnotes
   - Brief: inline attribution markers
   - HTML: expandable evidence panel
   - Engineering handoff: inline source references

---

## Category activation

### Organic mode (default)

No `active-categories` in preamble. Model suggests fields from any category based on conversation context. After several steps, model offers a meta-pause to cluster observed categories.

### Explicit mode (advanced override)

User sets `active-categories` in preamble:

```yaml
active-categories: [emotional, service-layers, failure, temporal]
```

Model preferentially suggests fields from active categories. Fields from inactive categories are still allowed if user introduces them — they just aren't proactively suggested.

### Meta-pause behavior

After ~3-5 steps, if model notices consistent category usage, it offers:

> "I notice we've been capturing emotional states and failure modes on each step. Want me to keep suggesting from those categories and stop offering others unless you bring them up?"

User confirms → model adds to `active-categories` in preamble.

---

## Schema versioning

This schema is version `0.1`. Changes are additive — new categories or fields may be added. Existing field names and semantics are stable once published. Field removal is never done; deprecated fields are marked in this document but remain parseable.
