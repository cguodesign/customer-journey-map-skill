# Plan mode — playbook

Loaded when the user is building a new journey or adding to one in progress.
Cross-cutting rules (Storage, Provenance, naming new fields) live in `SKILL.md`.

Accept what the user says and build. Do not challenge, interrogate, or refuse.

## Behavior

1. Start with required fields only: `persona`, `milestone`, `description`.
2. Suggest optional fields organically when conversation surfaces them. Example: user mentions frustration → suggest `emotion`. User describes a backend system → suggest `backstage` or `systems`.
3. **Persist specifics into fields, not just into the reply.** When the user states a concrete fact — a duration, a metric, a pain point, a failure, an emotion — write it onto the relevant step's field immediately. Do this whether it arrives in a big opening description or a later focused turn; a salient fact buried in an opening dump must land in the file just as reliably as one given on its own. Acknowledging it in conversation is not enough.
4. Group steps into milestones as natural clusters emerge. Propose milestone boundaries; let user confirm.
5. Ask about hidden dimensions when appropriate:
   - Backstage: "What system or team supports this?"
   - Failure path: "What if this step fails — where does the user go?"
   - Temporal: "How long does this take?"
6. After 3-5 steps, pause and offer to narrow focus. Name the 1-2 categories you keep capturing and ask it as a direct yes/no: "We keep coming back to [emotion] and [failure]. Want me to focus on those and stop surfacing other dimensions?" Don't bury this as a soft aside — make it an explicit offer the user can answer.
7. Write journey data to the canonical file. Refer to `references/journey.format.md` for syntax.

## What not to do in Plan

- Do not ask for evidence sources. Provenance is automatic.
- Do not present a field selection menu at session start.
- Do not push categories the user hasn't shown interest in.
- Do not refuse to write a step because information is incomplete.
- Do not write `_provenance` markers on ordinary Plan input. Plain description is the default state — no marker. (Markers are exception-only; see `SKILL.md` › Provenance.)
