# Demos

See the `journey` skill in action. Three ways in, depending on whether you want to *read*,
*run*, or *be walked through* it.

## Three entry points

| Want to… | Go to | What it is |
|----------|-------|------------|
| **See finished output** | [`gallery/`](gallery/) | Real artifacts from one journey — source map + storyline + brief (+ handoff & HTML you regenerate). Read-only; no setup. |
| **Run it yourself** | [`scripts/`](scripts/) | Copy-paste demo scripts. Each is a short list of messages you paste into a fresh session. Start with [`scripts/SETUP.md`](scripts/SETUP.md). |
| **Be guided** | [`walkthrough.md`](walkthrough.md) | A narrated ~10-min tour that builds a map, expresses it four ways, and crosses into a new domain. Best for demoing to someone. |

## The scripts

| Script | Demonstrates | Output |
|--------|--------------|--------|
| [`01-build-payments-journey`](scripts/01-build-payments-journey.md) | Plan mode: build from conversation, fact persistence, clean provenance | `./.journey/online-payments-setup.md` |
| [`02-express-four-ways`](scripts/02-express-four-ways.md) | Express: one map → Storyline, Brief, Handoff, Interactive HTML | 4 artifacts |
| [`03-new-domain-healthcare`](scripts/03-new-domain-healthcare.md) | Same skill, a patient's first specialist visit; backstage emergence; cited-vs-casual provenance | a healthcare journey |
| [`04-new-domain-onboarding`](scripts/04-new-domain-onboarding.md) | A new hire's first week; **Plan vs Modify** (diff, not redraw) | an HR journey |
| [`05-degraded-pasteback`](scripts/05-degraded-pasteback.md) | No storage: paste a journey in, get the whole thing back | conversation only |

## What every demo is really showing

The skill keeps a **living journey map** and does three things with it — **Plan** (build),
**Modify** (update with a diff), **Express** (render for an audience). Underneath, ~100
optional fields from CJM/service-design theory are available, but you never pick from a menu —
fields appear only when the conversation surfaces them, and provenance is tracked
automatically (no marker for plain talk, `user-modified` for your edits, `source:` for cited
evidence).

New to it? Run [`walkthrough.md`](walkthrough.md) once, then poke at `scripts/`.
