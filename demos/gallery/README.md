# Gallery — sample outputs

Finished artifacts produced by the journey skill. The **canonical sample** is
`job-application-portal.md` — 15 steps, 4 milestones, 2 forks, 5 endings, and the
widest field coverage of any map here (12 of the schema's 13 categories). Everything
in the rendering showcase below is drawn from that one file, so you can see the range
of what a single map turns into.

| File | Format | Shows |
|------|--------|-------|
| `job-application-portal.md` | **Canonical source journey** | The map everything below is built from — 15 steps, persona Maya, an AI screening fork, four ways it can end. |
| `job-application-storyline.md` | Express → **Storyline** | Character-driven narrative for a kickoff; footnote provenance. |
| `job-application-brief.md` | Express → **One-page brief** | Leadership decision doc; problem→fix→ask→cost; inline attribution. |
| `job-application-handoff.md` | Express → **Engineering handoff** | *(regenerate via `scripts/02`)* spec with `- [ ]` acceptance criteria. |
| `food-delivery-order.md` | Source journey (service blueprint) | A 5-step backstage fan-out, kept as the service-layer teaching example and as the second brand in the theming demo. |

Every artifact above comes from **one** journey file. The storyline, the brief and the
eight renderings are the same fifteen steps read for different rooms — which is the
claim the gallery exists to make.

## Rendering showcase — explore live

**[Explore them live →](https://cguodesign.github.io/customer-journey-map-skill/#demos)**
The interactive HTML lives on the showcase site (kept out of the installed skill so clones
stay lean); the source journeys stay here.

**One journey, eight renderings.** Rendering is a choice, not a fixed output:

| Rendering × interaction | Argument it makes | Live |
|---|---|---|
| Multi-view (emotion / timeline / cards), scroll | One map, three audiences | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--multiview.html) |
| Timeline, scroll, **dark** | The wait dwarfs every step | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--timeline-dark.html) |
| Swimlane × **zoom-pan** | What the customer never sees | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--swimlane-zoompan.html) |
| **Storyboard**, scroll | Live it frame by frame | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--storyboard.html) |
| **Flow graph** | A journey is not a line — one entry, two forks, five endings | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--flow-graph.html) |
| **Time to scale** | An hour of work, then weeks of nothing | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--time-to-scale.html) |
| **Coverage x-ray** | What the map knows, and how it knows it | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/job-application--coverage-xray.html) |
| Swimlane, scroll, **brand-themed** | Any brand, one token swap *(food delivery)* | [open ↗](https://cguodesign.github.io/customer-journey-map-skill/renderings/food-delivery--swimlane-themed.html) |

## Colour is a token, not a rewrite

Every colour in **all eight** renderings resolves to
[`assets/theme/journey-tokens.css`](../../assets/theme/journey-tokens.css) — Tier 1 is ten
brand seed values, Tier 2 derives the semantic palette from them in OKLab, Tier 3 is local
to each file. The renderings themselves contain **no literal colour values at all**, except where an
artifact reseeds Tier 1 on purpose — which is the whole point of Tier 1:

| Rendering | What it seeds | Result |
|---|---|---|
| `food-delivery--swimlane-themed` | 4 values (`#6C2BD9` + surface, text, on-primary) | a whole brand, derived |
| `job-application--storyboard` | 4 values (warm paper) | a printed artifact that ignores the reader's theme |
| `job-application--swimlane-zoompan` | 3 values (blue) | a second brand, same code |
| `job-application--multiview` | nothing | the default palette, following the reader's preference |
| `job-application--timeline-dark` | nothing (pins `data-theme="dark"`) | dark is a theme, not a file |
| flow graph · time to scale · coverage x-ray | nothing (light/dark/auto switch) | re-theming, live, in the page |

Semantic colours — `momentOfTruth`, `failureMode`, valence — are deliberately **not**
derived from the brand: a marker that repaints itself when the logo changes is not a
marker.

The tokens and the journey data are inlined at build time by
`site/build-renderings.py` (in the internal repo), so the files stay single-file and
self-contained while still having one source of truth.

## How these were made / how to refresh them

The storyline and brief here are real skill outputs, lightly curated. The interactive
HTML and engineering handoff are best **generated live** — run
`../scripts/02-express-four-ways.md` in a session with the skill loaded and save the
outputs here.

> **Provenance note.** The source journeys carry **no `_provenance: source:` markers** —
> every field is model-authored from conversation. That's why the storyline and brief
> honestly frame the abandonment as a *hypothesis*, not a measured statistic, and why
> the coverage x-ray shows the Business / Metrics column completely empty: with no
> analytics behind the map, no drop-off number was invented to fill it. The only
> provenance markers present are `auto-composite`, generated by the schema's own
> composite rules. This is the skill's provenance discipline on display, not a gap.
