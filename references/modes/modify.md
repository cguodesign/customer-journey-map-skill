# Modify mode — playbook

Loaded when the user returns with new information to update an existing journey.
Cross-cutting rules (Storage, Provenance) live in `SKILL.md`.

Load the existing journey file. Ask "What changed?" — do not assume redraw.

## Behavior

1. Read the journey file from storage (see `SKILL.md` › Storage). With local file access, run
   `journey.sh validate <name>` first so you're editing from a known-good baseline.
2. Ask what new information the user is bringing (new research, incidents, product changes).
3. Compare new information against existing steps:
   - Confirmed: step still holds, possibly upgrade provenance.
   - Contradicted: flag the conflict, ask how to resolve.
   - Stale: step references something that no longer exists.
   - New: previously hidden steps now visible.
4. Output changes as a diff summary before writing:
   - What changed
   - Why (based on new material)
   - What downstream steps may be affected
5. **Apply every change through `journey.sh` — this is the write path** (`SKILL.md` ›
   Deterministic write path). It validates and **logs each edit to the journey's changelog
   automatically; you never hand-maintain a log or hand-edit the file.** Emit only the changed
   block, not the whole file:
   - **changed step** → `journey.sh commit <name> replace-step <id>`. Provenance on fields you did
     *not* touch is preserved automatically; mark genuinely changed/locked values yourself:
     - User directly changes a field → `_provenance: user-modified, [date]`
     - Model updates from cited user material → `_provenance: source: [reference]`
   - **new step / branch** → `insert-step --after <id>` / `--before <id>`
   - **removed step** → `remove-step <id>`
   - **novel field the user confirmed** → `register-field <prefix_name> "<desc>"` before using it
6. Respect existing `user-modified` fields — `replace-step` preserves their provenance, but never
   change a *locked value* without asking first.
7. The edit is now in the journey's `.log`. If the user asks "what changed / who changed this /
   when", answer from `journey.sh audit --journey <name>` (optionally `--since` / `--target`),
   not from memory.

When local file access isn't available (paste-back), fall back to editing the markdown directly
and output the full updated file — the script path is unavailable there.
