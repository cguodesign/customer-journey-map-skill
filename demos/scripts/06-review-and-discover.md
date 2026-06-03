# Demo 06 — Review: find the soft spots and what to map next

**Shows:** Review mode (phase d) — a journey health review + discovery of adjacent
journeys across your portfolio. The gear for a mature map.
**Prereq:** at least one journey in `./.journey/` (run Demo 01, or the Hero demo). Having
**two** journeys in the folder makes the portfolio view more interesting.
**Time:** ~3 min · **New session.**

---

### Turn 1
```
Step back and review my journey — where is it still weak or thin? And what other user journeys should we be mapping while we're at it?
```

**Watch for — the health review:**
- **Evidence gaps** — high-stakes claims (drop-off, moments of truth) with no
  `_provenance: source:` marker, named as guesses worth validating.
- **Thin coverage** — steps carrying only required fields.
- **Missing failure paths** — high-impact steps with no `recoveryPath`.
- **Structural issues** — orphaned branches, dangling cross-references.
- **Category lopsidedness** — offered as "want to go deeper on X?", never demanded.

**Watch for — adjacent-journey discovery:**
- A ranked shortlist of *other* journeys worth mapping, each with a one-line rationale:
  downstream journeys, other personas (the staff side of the same system), a failure
  path big enough to deserve its own map, high-frequency variants.
- If you have more than one journey in `./.journey/`, it gives a portfolio view and
  spots gaps/overlaps.

It **proposes, doesn't act** — when you pick one, it switches to Plan to build it.

---

✅ **Pass looks like:** a review that finds real soft spots (not a flattering summary),
and an adjacency list you'd actually act on. In test report 17, Review caught a genuine
graph bug in a map the skill itself had built — a good sign it's doing real work.
