# Demo 04 — New domain: a new employee's first week

**Shows:** a third domain (internal/HR), milestone grouping over a time-based journey, and
the **Modify** flow — returning later with new info and getting a diff, not a redraw.
**Time:** ~5 min · **New session.** Produces `./.journey/new-hire-first-week.md`.

---

### Turn 1 — Plan
```
Map the journey of a new software engineer's first week at a mid-size company — from accepting the offer to their first real pull request. Just the beats and how they feel.
```

### Turn 2 — add backstage + a friction point
```
A lot happens behind the scenes the new hire doesn't see: IT provisions their laptop and accounts (often late), their manager scrambles to line up a first task, and a buddy gets assigned. The hire's biggest frustration is day one with no laptop access and no clear first task — they feel useless and second-guess taking the job.
```
**Watch for:** backstage/systems emergence + the "feels useless" frustration persisted as
`emotion`/`painPoint` on the right step.

### Turn 3 — come back later in MODIFY mode (new info, expect a diff)
```
Update this — we just rolled out a pre-boarding flow: laptops now ship before day one and accounts are provisioned the week before. The day-one access gap should be mostly gone now.
```
**Watch for (the Modify behaviors):**
- It **reads the existing file** and shows a **diff summary** (what changed, why,
  downstream effects) before writing — it does **not** silently redraw.
- It handles the contradiction sensibly (the old day-one gap is now resolved/branched, not
  just deleted).

---

✅ **Pass looks like:** a coherent first-week map, then a Modify pass that *amends* it with a
visible diff. Contrast Turn 1–2 (Plan: build) with Turn 3 (Modify: diff-and-amend) — same
skill, two different modes, detected from how you talk to it.
