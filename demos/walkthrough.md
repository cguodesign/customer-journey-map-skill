# Guided walkthrough — see the skill work in ~10 minutes

A narrated, replayable tour. Follow it top to bottom in one or two fresh sessions and
you'll watch a journey get built, grow, and turn into four different deliverables. This is
the "show someone what this is" path.

> Setup once: make sure the `journey` skill is loaded (see `scripts/SETUP.md`), then
> `claude` in a fresh session. You play the user; paste the **bold** lines.

---

## Scene 1 — From a sentence to a map (2 min)

You're a PM with a vague goal and no template. Just talk.

**Paste:**
> Help me map the journey of a small business owner setting up online payments for the first time — online store, e-commerce checkout. I'll fill in details as you go.

Notice what *doesn't* happen: no form, no field menu, no "first, choose your dimensions."
It just starts building from what you said. That's the whole design philosophy — schema-rich
underneath, but the user only ever has a conversation.

**Paste:**
> All your calls — draft the whole thing.

It commits: invents a believable persona, lays down milestones and steps, writes a real file
to `./.journey/`. It moves forward on reasonable assumptions instead of interrogating you.

## Scene 2 — The detail that proves it's listening (2 min)

Give it the one fact that matters most.

**Paste:**
> The hardest part is bank verification — it takes 3 business days with no feedback, so most people think it's broken and a ton just give up there.

Now **open the file** (`./.journey/online-payments-setup.md`) and find the verification step.
The 3 days, the "feels broken," the abandonment — they're **in the map as structured fields**
(`duration`, `painPoint`, `failureMode`), not just politely acknowledged in the reply. The map
is the memory, and it actually wrote your fact down.

Quick check, if you like:
```bash
grep -c "_provenance" ./.journey/online-payments-setup.md   # → 0
```
Zero provenance markers. Everything here is plain conversation, so nothing is flagged. (Markers
are reserved for explicit edits and cited evidence — you'll see one appear in Scene 4.)

## Scene 3 — One map, four rooms (3 min)

Same journey. Four audiences. Watch the skill ask *who's this for* and *what should they do*,
then reshape completely.

**Paste:**
> Turn this into a storyline for Monday's kickoff — I want the team to feel that verification wait.

→ a character named Maya, a story with a pivot, footnotes tracing each beat to the map.

**Paste:**
> Now a one-page brief for my VP to approve 2 sprints to fix it.

→ ask, problem, cost of inaction, a fix table — fits on one screen.

**Paste:**
> And an engineering handoff the platform team can make tickets from.

→ acceptance criteria as `- [ ]` checkboxes, edge cases, systems involved.

**Paste:**
> Finally, an interactive HTML version for a workshop. Save it to demos/gallery/payments-journey.html

→ a single self-contained file. Open it in a browser and click around.

Four deliverables, one source of truth. Compare them to the finished versions in `gallery/`.

## Scene 4 — Honesty under pressure (1 min)

Notice something across all four: nobody ever quoted a hard drop-off percentage. The map has
no cited evidence, so the skill frames the abandonment as a *hypothesis* every time — it won't
invent a statistic to make the slide look better. Now give it a real number:

**Paste:**
> Actually our analytics show 38% abandon at the verification step — that's measured, last quarter.

Re-open the map: that figure lands with `_provenance: source: …`. The skill draws a hard line
between what you *described* and what you *measured*.

## Scene 5 — It's not about payments (2 min, optional)

Open a **new session** and run the first two turns of `scripts/03-new-domain-healthcare.md`
(a patient's first specialist visit) or `scripts/04-new-domain-onboarding.md` (an employee's
first week). Same behaviors — organic emergence, backstage layers, fact persistence — in a
domain with no software in it at all.

---

### What you just saw
- A map built from conversation, no template.
- Facts persisted as structured data, not chat fluff.
- One journey expressed for four different audiences.
- Provenance that tells description apart from evidence.
- The same engine working across wildly different domains.

Next: skim `gallery/` for the finished artifacts, or `scripts/` to run any piece on its own.
