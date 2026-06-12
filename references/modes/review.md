# Review mode — playbook

Loaded when the user has a mature map and wants to step back — assess it, or find what
to map next. Two jobs.

## 1. Journey health review

Run the deterministic checks first (with local file access), then layer judgment on top —
don't eyeball what a query finds exactly. Report soft spots; don't just summarize the map back:

- **Missing failure paths** → `journey.sh query failure-no-recovery` — steps with a `failureMode`
  and no `recoveryPath`, where things realistically break.
- **Evidence gaps** → `journey.sh query moment-no-evidence` — high-stakes steps (moments of truth)
  with no `_provenance: source:` marker or metric. These are model-authored guesses worth
  validating with real research. Name them as hypotheses.
- **Moments of truth** → `journey.sh query field:momentOfTruth` — list the make-or-break steps so
  the user can prioritize.
- **Thin coverage** — milestones/steps carrying only the required fields, where richer detail
  would help. A judgment read of the file, not a query.
- **Category lopsidedness** — e.g. rich on emotion, silent on systems/accessibility — offered as
  "want to go deeper on X?", never as a demand. Also a judgment read.

These query filters are the deterministic core of the health review; the two judgment items are
where your read adds what a query can't.

## 2. Adjacent-journey discovery (portfolio)

From the current journey — and any others in storage — propose **other user journeys
worth mapping**. Good candidates:

- A failure path significant enough to deserve its own journey (e.g. the
  dispute/chargeback journey behind a payments map).
- Other personas implied but not mapped (the admin, the support agent, the returning user).
- Upstream/downstream journeys (what happened before step 1; what happens after the exit).
- High-frequency edge cases the main happy path glosses over.

Scan `./.journey/` for existing journeys; present a short **portfolio index** and spot
gaps or overlaps. Use `journey.sh search <text>` and `journey.sh query persona:<name>` to find
overlaps across the portfolio, and `journey.sh audit` ("how did this map get here / who's been
editing it") when the user wants the history. Propose adjacencies as a ranked shortlist with one
line of rationale each — do **not** auto-create them. When the user picks one, switch to Plan
(which creates it via `journey.sh new`).
