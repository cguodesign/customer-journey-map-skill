# Customer Journey Map Skill

**A living customer journey map that lives in your conversation — not in a Figma file nobody opens again.**

Most journey maps die the week they're made: a beautiful artifact, frozen, stale by
the next sprint. This skill makes the map a *living document* your AI builds, updates,
and reshapes with you across the whole life of a project — then renders it for whoever's
in the room. You just talk; it does the structure.

**▶ [Explore the live showcase →](https://cguodesign.github.io/customer-journey-map-skill/)**

---

## What it does — by where you are in the work

You don't invoke modes or learn commands. You describe your situation, and the skill
meets you where you are:

| Where you are | What you say | What the skill does |
|---|---|---|
| **Kicking off** — a fuzzy idea of a user flow | *"Map how a first-time buyer sets up online payments."* | Builds a structured journey from the conversation — milestone by milestone, no form to fill. |
| **Something changed** — new research, a shipped feature | *"We just launched instant verification — fold it in."* | Updates with a **diff**: what changed, why, and the downstream steps it touches — never a silent redraw. |
| **Bringing others along** — a kickoff, a VP, the dev team | *"Turn this into something for Monday's kickoff."* | Renders the same map for that audience — a story, a one-pager, a spec, or an interactive map. |
| **The map has matured** — what now? | *"Where's it weak, and what should we map next?"* | Reviews it for soft spots and proposes the adjacent journeys worth mapping. |

---

## What you're actually working with

**A real, structured map — written from a conversation.** You describe the flow in plain
words; the skill maintains a canonical journey file: milestones, steps, and the fields
that actually matter on each one. No diagramming, no template.

```markdown
### Step: wait-for-bank-verification
- persona: [Maya]
- emotion: Anxiety → suspicion → abandonment
- duration: 3 business days
- painPoint: "No feedback during the wait — most people think it's broken"
- failureMode: Assumes verification failed and abandons setup entirely
- momentOfTruth: The single biggest drop-off point in the journey
```

**A ~100-field vocabulary you never have to learn.** Underneath sits the language of
service design — emotion, channels, backstage systems, failure modes, metrics,
accessibility, and more (NN/g, Forrester, Shostack's service blueprints, Jobs-to-be-Done).
But you never pick from a menu: mention a frustrating wait and `duration` + `painPoint`
appear; describe a backend bot and the backstage layer shows up. The depth is there when
the conversation calls for it, invisible when it doesn't.

**A living document.** The map is a file that persists across sessions and grows by diff.
Come back in three weeks and it's still your expert collaborator who's been on the project
the whole time — not a blank slate.

**Provenance, automatically.** Every field quietly tracks what *you* asserted, what's
backed by *evidence you cited*, and what the model *inferred itself*. So when it builds you
a brief, it won't dress a guess up as a statistic — it flags the hypothesis and tells you
to go measure it.

---

## Express it for any audience

Once the map exists, the same understanding renders for whoever needs it. (Full versions
in [`demos/gallery/`](demos/gallery/).)

**Storyline** — makes a team *feel* the experience. For kickoffs, empathy-building.
> *Maya runs a small online store. She is not a developer… A customer fills a cart, gets
> to the payment screen, asks "Wait, you don't take card?" — and disappears.*
> *…She hits submit. And then the story stops. No progress bar. No estimate. Just a screen,
> and silence. So Maya does what anyone does in a silence that long: she assumes it's
> broken.*[^1]

**One-page brief** — for a VP with 90 seconds and a decision to make.
> **Ask:** Approve 2 sprints to add status feedback to bank verification.
> **The problem in one line:** New merchants finish signup, hit a 3-business-day wait with
> *zero feedback*, conclude the product is broken, and quit — one step before going live.

**Engineering handoff** — spec-shaped, for the team that has to build it.
> **Acceptance criteria**
> - [ ] After KYC submission, the owner sees a status page with current state + estimated completion date.
> - [ ] Status reflects **real** backend state, not a fake progress bar.

**Interactive HTML** — a self-contained, explorable map. The same journey renders however
the room needs; you just ask:

| Effect | What you say |
|---|---|
| ![Multi-view — emotion curve / timeline / cards](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/hero-multiview.png) | *"Make an interactive map our team can pull up in the review."* |
| ![Brand-themed swimlane service blueprint](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/swimlane-themed.png) | *"Render it as a swimlane, themed to our brand colors."* |
| ![Dark-mode timeline](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/timeline-dark.png) | *"Give me a dark timeline where the weeks-long wait dwarfs every step."* |
| ![Film storyboard](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/storyboard.png) | *"Turn it into a storyboard — frame by frame, like a film."* |

> Across all of them: nobody quotes a hard drop-off percentage. The map carries no cited
> evidence, so the skill frames the abandonment as a *hypothesis* — it won't invent a
> statistic to make a slide look better. Give it real analytics and the number lands with
> its source attached.

[^1]: Every beat traces back to a step in the journey file via footnotes — readable with or without them.

---

## See it across a project

The map changes gear with your project and **persists between sessions**. One journey,
four phases ([`demos/scripts/00-hero-lifecycle.md`](demos/scripts/00-hero-lifecycle.md)
runs this end to end):

1. **Kickoff — build.** *"Map someone applying for a job through an online portal… the big
   thing is the 'application black hole.'"* → the full arc appears, fast.
2. **Evaluation — express.** *"Make an interactive HTML our hiring team can pull up."* → the
   map above, in a browser.
3. **Development — update.** *"We added an AI screen that auto-rejects in 24h, but passers
   still hit the black hole."* → a diff that folds in the fork and keeps the rest intact.
4. **Stable — review.** *"Step back — where's it weak, and what else should we map?"* → soft
   spots named (it once caught an orphaned branch in a map it had built itself) and a ranked
   list of adjacent journeys to map next.

---

## Quickstart

It's a standard **Agent Skill** — Claude Code and Codex both read the format, just from
different folders:

```bash
# Claude Code
git clone --depth 1 https://github.com/cguodesign/customer-journey-map-skill ~/.claude/skills/journey

# Codex
git clone --depth 1 https://github.com/cguodesign/customer-journey-map-skill ~/.agents/skills/journey
```

Use both? Clone once into `~/.agents/skills/journey` and symlink `~/.claude/skills/journey` to it.

Then just start talking:

> "Help me map the journey of a small business owner setting up online payments for the first time."

It activates automatically from its description; the map is written to `./.journey/`. In
Codex you can also type `$journey` to invoke it, or `/skills` to browse. **New here?** Take
the 10-minute guided tour in [`demos/walkthrough.md`](demos/walkthrough.md).

> Team collaboration (one shared, synthesized map across many contributors) is on the
> roadmap. Today the skill is tuned for an individual building deep, durable customer
> understanding.

---

## Under the hood

```
SKILL.md                          # Behavior contract (the entry point)
references/
  journey.schema.md               # 13 categories, ~100 fields, provenance + composite rules
  journey.format.md               # Canonical markdown format
  html-rendering-guide.md         # Interactive HTML: rendering matrix, color, data mapping
assets/templates/                 # 5 rendering modes (card, timeline, swimlane, emotion, storyboard) + interaction + wireframe templates
examples/                         # Golden examples
demos/                            # Journey sources + expression examples (markdown), runnable scripts, guided walkthrough
```

The interactive HTML renderings and screenshots live on the
[showcase site](https://cguodesign.github.io/customer-journey-map-skill/) (the `gh-pages`
branch), **not** in the installed skill — so a `--depth 1` clone stays lean.

**Foundations:** NN/g Journey Mapping, Forrester CX Index, Shostack Service
Blueprinting, Jobs-to-be-Done (Christensen), Adaptive Path Experience Maps, the Double
Diamond.

## License

MIT
