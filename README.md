# Customer Journey Map Skill

**A living customer journey map that lives in your conversation — not in a Figma file nobody opens again.**

Most journey maps die the week they're made: a beautiful artifact, frozen, stale by
the next sprint. This skill makes the map a *living document* your AI builds, updates,
and reshapes with you across the whole life of a project — and that knows how to turn
itself into whatever the room needs.

You just talk. It does the structure.

---

## What it does

Four things, detected from how you talk to it — no commands to memorize:

| | | |
|---|---|---|
| 🟢 **Build** | "Map how a first-time buyer sets up online payments." | A structured journey appears, milestone by milestone, from plain conversation. |
| ✏️ **Update** | "We just launched instant verification — fold it in." | A *diff*, not a redraw: what changed, why, and what it ripples into. |
| 🎭 **Express** | "Turn this into something for Monday's kickoff." | One map → four audiences (below). |
| 🔭 **Review** | "What are we missing — and what should we map next?" | Soft-spot review + a shortlist of adjacent journeys worth mapping. |

### One map, four audiences

The same journey, rendered for whoever's in the room:

- **Storyline** — a character-driven narrative that makes a team *feel* the experience. For kickoffs and empathy.
- **One-page brief** — problem → fix → ask → cost of inaction. For a VP with 90 seconds and a decision to make.
- **Engineering handoff** — spec-shaped, acceptance criteria as checkboxes, edge cases, systems. For the team that has to build it.
- **Interactive HTML** — a self-contained, explorable map (swimlane, timeline, or emotion curve; themeable; dark mode). For workshops and reference.

See them all, built from one journey, in [`demos/gallery/`](demos/gallery/).

---

## Why it feels different

**You never fill out a form.** Underneath sits a ~100-field vocabulary drawn from
decades of service-design practice (NN/g, Forrester, Shostack's service blueprints,
Jobs-to-be-Done). But you never pick from a menu — fields *emerge* when the
conversation surfaces them. Mention a frustrating wait and `duration` + `painPoint`
appear; describe a backend bot and the backstage layer shows up. Schema-rich
underneath, one-conversation-wide on top.

**It knows what it knows.** Every field carries automatic, invisible provenance: it
quietly tracks what *you* asserted, what's backed by *evidence* you cited, and what
it *inferred itself*. So when it builds you a storyline, it won't dress up a guess as a
statistic — it'll flag the hypothesis and tell you to go measure it.

**It remembers.** The map is a real file that persists across sessions. Come back in
three weeks and it's still your expert collaborator who's been on the project the
whole time.

---

## Quickstart

Install so Claude Code discovers the skill:

```bash
# Personal (available in every project)
git clone https://github.com/cguodesign/customer-journey-map-skill ~/.claude/skills/journey

# …or per-project
git clone https://github.com/cguodesign/customer-journey-map-skill .claude/skills/journey
```

Then just start talking:

> "Help me map the journey of a small business owner setting up online payments for the first time."

It activates automatically. The map is written to `./.journey/`. From there:

> "Turn this into a storyline for our kickoff."
> "We added instant verification — update it."
> "Review the whole thing and tell me what else we should map."

**New here?** Run the 10-minute guided tour in [`demos/walkthrough.md`](demos/walkthrough.md),
or grab a copy-paste demo from [`demos/scripts/`](demos/scripts/).

---

## How it fits a project's life

The skill leans into a different gear at each phase — see [`docs/usage-model.md`](../docs/usage-model.md)
for the full model:

- **Discovery** → fast scaffolding from discussion.
- **Evaluation** → render it (often interactive HTML) and iterate.
- **Development** → surgical updates with a tracked diff.
- **Stable** → review the map for gaps and discover adjacent journeys.

> Team collaboration (one shared, synthesized map across many contributors) is on the
> roadmap (P1). Today the skill is tuned for an individual building deep, durable
> customer understanding.

---

## Under the hood

```
SKILL.md                          # Behavior contract (the entry point)
references/
  journey.schema.md               # 13 categories, ~100 fields, provenance + composite rules
  journey.format.md               # Canonical markdown format
  html-rendering-guide.md         # Interactive HTML: rendering matrix, color, data mapping
assets/templates/                 # Rendering, interaction, and wireframe templates
examples/                         # Golden examples (Plan → Express, Modify, schema evolution)
demos/                            # Gallery, runnable scripts, guided walkthrough
```

**Foundations:** NN/g Journey Mapping, Forrester CX Index, Shostack Service
Blueprinting, Jobs-to-be-Done (Christensen), Adaptive Path Experience Maps, the Double
Diamond.

## License

MIT
