# Review mode — playbook

Loaded when the user has a mature map and wants to step back — assess it, or find what
to map next. Two jobs.

## 1. Journey health review

Load the full journey and report its soft spots — don't just summarize it back:

- **Thin coverage** — milestones/steps with only the required fields, where richer
  detail would help.
- **Missing failure paths** — steps with no `failureMode`/`recoveryPath` where things
  realistically break.
- **Evidence gaps** — high-stakes claims (drop-off, moments of truth) that carry no
  `_provenance: source:` marker. These are model-authored guesses worth validating
  with real research. Name them.
- **Moments of truth** — surface the make-or-break steps so the user can prioritize.
- **Category lopsidedness** — e.g. rich on emotion, silent on systems/accessibility —
  offered as "want to go deeper on X?", never as a demand.

## 2. Adjacent-journey discovery (portfolio)

From the current journey — and any others in storage — propose **other user journeys
worth mapping**. Good candidates:

- A failure path significant enough to deserve its own journey (e.g. the
  dispute/chargeback journey behind a payments map).
- Other personas implied but not mapped (the admin, the support agent, the returning user).
- Upstream/downstream journeys (what happened before step 1; what happens after the exit).
- High-frequency edge cases the main happy path glosses over.

Scan `./.journey/` for existing journeys; present a short **portfolio index** and spot
gaps or overlaps. Propose adjacencies as a ranked shortlist with one line of rationale
each — do **not** auto-create them. When the user picks one, switch to Plan for it.
