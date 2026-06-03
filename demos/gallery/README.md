# Gallery — sample outputs

Finished artifacts produced by the journey skill, all from **one** source journey, so
you can see the range of what a single map turns into.

| File | Format | Shows |
|------|--------|-------|
| `payments-journey.md` | **Source journey** (Plan output) | The canonical map everything else is rendered from — 5 milestones, 15 steps, persona Maya. |
| `payments-storyline.md` | Express → **Storyline** | Character-driven narrative for a kickoff; footnote provenance. |
| `payments-brief.md` | Express → **One-page brief** | Leadership decision doc; problem→fix→ask→cost; inline attribution. |
| `payments-handoff.md` | Express → **Engineering handoff** | *(regenerate via `scripts/02`)* spec with `- [ ]` acceptance criteria. |
| `payments-journey.html` | Express → **Interactive HTML** | *(regenerate via `scripts/02`)* self-contained explorable map. |

## Rendering showcase — `renderings/`

The same skill, the same kind of map, rendered as interactive HTML across the modes.
Open any file in a browser. The first three are **one journey** (`job-application-portal.md`)
shown three ways — proof that rendering is a choice, not a fixed output.

| File | Journey | Rendering × interaction | Shows |
|------|---------|-------------------------|-------|
| `job-application--multiview.html` | Job application | Multi-view (emotion / timeline / cards), scroll | Mixed-stakeholder view with a "sit in the silence" counter |
| `job-application--timeline-dark.html` | Job application | Timeline, scroll, **dark mode** | The weeks-long wait dwarfing the minute-long steps |
| `job-application--swimlane-zoompan.html` | Job application | Swimlane × **zoom-pan** | Pannable wall-display service blueprint |
| `food-delivery--swimlane-themed.html` | Food delivery | Swimlane, scroll, **brand-themed** (`#6C2BD9`) | Customer lane vs. hidden backstage machinery |
| `job-application--storyboard.html` | Job application | **Storyboard**, scroll | Film-frame "cuts" (Cut / Frame / Action / Dialogue / Time) — the visual cousin of the Storyline |

Source journeys for these live alongside: `job-application-portal.md`, `food-delivery-order.md`.

## How these were made / how to refresh them

The storyline and brief here are real skill outputs, lightly curated. The interactive
HTML and engineering handoff are best **generated live** (the HTML is a large
self-contained file; the handoff is conversational) — run `../scripts/02-express-four-ways.md`
in a session with the skill loaded and save the outputs here.

To regenerate the whole set from scratch, run `../scripts/01-build-payments-journey.md`
then `../scripts/02-express-four-ways.md`.

> Provenance note: the source journey carries **no `_provenance: source:` markers** —
> every field is model-authored from conversation. That's why the storyline and brief
> honestly frame the abandonment as a *hypothesis*, not a measured statistic. This is
> the skill's provenance discipline on display, not a gap.
