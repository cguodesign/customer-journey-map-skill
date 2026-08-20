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
### Step: wait-in-silence
- persona: [Maya, Recruiter, Hiring Manager, ATS]
- emotion: Hope curdling into anxiety, then resignation
- emotionValence: -2
- waitTime: Days to several weeks, often indefinite
- handoff: Recruiter → Hiring Manager for shortlist review
- bottleneck: Hiring Manager review capacity
- lineOfVisibility: Status changes exist inside the ATS and are deliberately not exposed
- painPoint: No status, no timeline, no closure
- momentOfTruth: This silence is the make-or-break of the whole experience
- priority: must-fix
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

Once the map exists, the same understanding renders for whoever needs it. Everything below
comes from **one** journey file — fifteen steps, read for different rooms. (Full versions in
[`demos/gallery/`](demos/gallery/).)

**Storyline** — makes a team *feel* the experience. For kickoffs, empathy-building.
> *Maya has a job. That is the first thing to understand about her, because it changes
> everything that follows… every single thing she does about our role happens in the margins
> of a day that already belongs to someone else.*
> *…At 10:20 she hits Submit. And here is the thing worth noticing: **she feels good.**
> That is the emotional high point of this entire journey, and it happens forty-three
> minutes in, with everything still ahead of her.*[^1]

**One-page brief** — for a VP with 90 seconds and a decision to make.
> **Ask:** Approve three changes — surface real status, disclose the AI screen, auto-close
> dead applications.
> **The problem in one line:** Candidates who pass our screen enter a queue with no status,
> no timeline, and no guaranteed ending — and the most common way our process concludes is
> that it doesn't.

**Engineering handoff** — spec-shaped, for the team that has to build it.
> **Acceptance criteria**
> - [ ] The portal shows the application's real internal state, not a static "Submitted".
> - [ ] When a role closes, every open application receives an outcome within 24h.
> - [ ] An automated rejection states that it was automated, and offers one correction path.

**Interactive HTML** — self-contained, explorable maps. Rendering is a *choice*, not a fixed
output; you just ask. All eight are live on the
[showcase site](https://cguodesign.github.io/customer-journey-map-skill/#demos).

| Effect | What you say |
|---|---|
| ![Multi-view — emotion curve / timeline / cards](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/hero-multiview.png) | *"Make an interactive map our team can pull up in the review."* |
| ![Flow graph showing the journey's forks, loop and dead end](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/flow-graph.png) | *"Show me where this journey actually forks — and where it dead-ends."* |
| ![The journey drawn to true time scale](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/time-to-scale.png) | *"Draw the time to scale. I want to see how much of this is waiting."* |
| ![Coverage and provenance matrix](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/coverage-xray.png) | *"Where is this map thin? What are we asserting without evidence?"* |
| ![Brand-themed swimlane service blueprint](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/swimlane-themed.png) | *"Render it as a swimlane, themed to our brand colors."* |
| ![Film storyboard](https://raw.githubusercontent.com/cguodesign/customer-journey-map-skill/gh-pages/img/storyboard.png) | *"Turn it into a storyboard — frame by frame, like a film."* |

Plus a dark timeline where the weeks-long wait dwarfs every step, and the whole service
blueprint on a pannable canvas.

**Your colours, in one line.** Every rendering opens dark and carries a **Dark · Light · Paper ·
Brand** switch, so you can see the palette re-derive before you commit to anything. Renderings
contain no literal colours — only token names — so re-theming isn't a rewrite either:

```bash
journey.sh theme map.html --primary '#6C2BD9' --surface '#fff' --text '#1a1320'
journey.sh theme map.html --preset paper     # or: midnight, blueprint, contrast
```

Four seed values re-derive the whole palette: lane tints, valence scale, rules, shadows,
dark mode. Semantic colours stay put on purpose — a *moment of truth* marker that repaints
itself when your logo changes isn't a marker.

> Across all of them: nobody quotes a hard drop-off percentage. The map carries no measured
> metrics, so the brief says so out loud and recommends instrumenting instead. The one number
> it does use — 43 minutes of doing inside ~6 weeks of waiting — is computed from the map's
> own time fields, and it says that too. Give it real analytics and the number lands with its
> source attached.

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
> roadmap — its data foundation is already in place: every change is attributed and logged
> to a per-journey changelog, and the dataset is queryable across journeys. What's still
> coming is multi-writer merge and shared-storage sync. Today the skill is tuned for an
> individual building deep, durable customer understanding.

---

## Under the hood

```
SKILL.md                          # Behavior contract (the entry point)
scripts/
  journey.sh                      # Deterministic backbone: validated writes, an audit log of every change, and theming
references/
  journey.schema.md               # 13 categories, ~100 fields, provenance + composite rules
  journey.format.md               # Canonical markdown format
  modes/                          # Per-mode playbooks (plan, modify, express, review), loaded on demand
  html-rendering-guide.md         # Interactive HTML: rendering matrix, color, data mapping
assets/theme/                     # journey-tokens.css (3-tier colour system) + presets; installed by `journey.sh theme`
assets/templates/                 # 5 rendering modes (card, timeline, swimlane, emotion, storyboard) + interaction + wireframe templates
examples/                         # Golden examples
demos/                            # Journey sources + expression examples (markdown), runnable scripts, guided walkthrough
```

**A deterministic backbone, in pure bash.** Writes don't go through the model's best effort —
they go through `scripts/journey.sh` (POSIX shell + awk, zero runtime deps): it validates every
edit against the schema, places nodes by stable id, and appends a per-journey changelog. So edits
are cheap (the model emits one changed block, not the whole file), a malformed write is rejected
before it lands, and the map carries a real **who-changed-what-when history** — the foundation for
many people sharing one set of journeys. The model still does the generative work (building from
conversation, prose, rendering); the script does the mechanical work (place, validate, log, query,
theme).

The interactive HTML renderings and screenshots live on the
[showcase site](https://cguodesign.github.io/customer-journey-map-skill/) (the `gh-pages`
branch), **not** in the installed skill — so a `--depth 1` clone stays lean.

**Foundations:** NN/g Journey Mapping, Forrester CX Index, Shostack Service
Blueprinting, Jobs-to-be-Done (Christensen), Adaptive Path Experience Maps, the Double
Diamond.

## License

MIT
