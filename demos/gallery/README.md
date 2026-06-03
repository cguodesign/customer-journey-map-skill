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

## Rendering showcase — explore live

The same skill, the same kind of map, rendered as interactive HTML across the modes —
**[explore them live →](https://cguodesign.github.io/customer-journey-map-skill/#demos)**.
The interactive HTML files live on the showcase site (kept out of the installed skill so
clones stay lean); the source journeys stay here. The first three are **one journey**
shown three ways — rendering is a choice, not a fixed output.

| Rendering × interaction | Journey | Live |
|---|---|---|
| Multi-view (emotion / timeline / cards), scroll | Job application | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--multiview.html) |
| Timeline, scroll, **dark mode** | Job application | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--timeline-dark.html) |
| Swimlane × **zoom-pan** | Job application | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--swimlane-zoompan.html) |
| Swimlane, scroll, **brand-themed** | Food delivery | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/food-delivery--swimlane-themed.html) |
| **Storyboard**, scroll | Job application | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--storyboard.html) |

Source journeys: `job-application-portal.md`, `food-delivery-order.md`. Regenerate any
rendering with `../scripts/02-express-four-ways.md`.

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
