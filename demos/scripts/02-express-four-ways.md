# Demo 02 — Express: one journey, four audiences

**Shows:** the two-question selection flow, then the same map rendered as Storyline,
Brief, Engineering handoff, and Interactive HTML.
**Prereq:** run Demo 01 first (needs `./.journey/online-payments-setup.md`), or point the
skill at `../gallery/payments-journey.md`. **New session.**

Run these as four independent asks (you can do them in one session; each is self-contained).

---

### 2a — Storyline (for a kickoff: make them *feel* it)
```
Turn my online payments journey into a storyline I can present at our product kickoff on Monday. I want the team to FEEL what these owners go through — especially that brutal verification wait. Make it vivid.
```
**Expect:** a named character (Maya), a 3-act arc with the 3-day wait as the pivot, and
**footnote** provenance. Save the result as `../gallery/payments-storyline.md`.

### 2b — One-page brief (for a VP: help them *decide*)
```
Now give me a one-page brief for my VP to approve 2 sprints to fix the verification flow. She cares about impact and cost of inaction and has 90 seconds.
```
**Expect:** ask→problem→fix→cost, fits one page, inline attribution, no invented %.
Save as `../gallery/payments-brief.md`.

### 2c — Engineering handoff (for the dev team: help them *build*)
```
The platform team needs to build that fix. Give me an engineering handoff they can create tickets from — what to build, acceptance criteria, edge cases, systems involved.
```
**Expect:** spec-shaped, acceptance criteria as `- [ ]` checkboxes, edge cases, a systems
table. Save as `../gallery/payments-handoff.md`.

### 2d — Interactive HTML (for a workshop: let them *explore*)
```
Create an interactive HTML version my design team can use as a workshop reference. Save it to demos/gallery/payments-journey.html.
```
**Expect:** the skill picks a rendering + interaction mode from the data shape and step
count (≤15 steps → scroll-driven; emotional arc → emotion-curve, often multi-view with a
card grid). A single self-contained `.html` — open it in a browser.

---

✅ **Pass looks like:** four genuinely different artifacts from one map, each matched to
its audience, each surfacing the verification dip as the centerpiece. Because the source
journey has no cited evidence, every format frames the drop-off as a *hypothesis*, never a
fake number — that's the provenance discipline, working.
