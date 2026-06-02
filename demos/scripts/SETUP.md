# Demo setup — read this first

Every script in this folder is a list of **messages you paste, one at a time**, into a
fresh session that has the `journey` skill loaded. You play the user; the skill responds.

## 1. Load the skill

Install the skill so Claude Code discovers it (any one of these):

```bash
# Personal (every project)
git clone https://github.com/cguodesign/customer-journey-map-skill ~/.claude/skills/journey
# …or per-project
git clone https://github.com/cguodesign/customer-journey-map-skill .claude/skills/journey
```

Already working inside this repo? The skill is `remote/SKILL.md`. Start a session from a
directory where `.claude/skills/journey` resolves to it. Confirm with `/` — you should
see `journey` in the skill list.

## 2. Start a fresh session per demo

Run each script in its **own** new session so state doesn't bleed between demos.

```bash
claude
```

## 3. Where things get written

- **Journey files** land in `./.journey/<name>.md` (the skill creates the folder).
- **Express outputs** (storyline, brief, handoff) come back **in the conversation**;
  copy the ones you want to keep into `demos/gallery/`.
- **Interactive HTML** is written as a file — tell the skill to save it under
  `demos/gallery/` (or move it there afterward).

Tip: run a demo from inside the repo so `./.journey/` is easy to find, then copy the
keepers into `demos/gallery/`.

## 4. How to read what you get

Compare behavior, not wording — the skill is non-deterministic, so phrasing will vary.
What should be stable:
- Plan builds straight away, no field-selection menu.
- Facts you state land **in the file**, not just in the reply.
- Pure Plan input → **no `_provenance` markers**; explicit edits/locks → `user-modified`;
  cited research → `source:`.
- Express always asks **who's the audience** + **what should they do/feel** before rendering.

The companion test reports in `../../../tests/results/` (local, not shipped) show the
same behaviors verified run-by-run if you want ground truth.
