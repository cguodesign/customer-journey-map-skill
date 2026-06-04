# Modify mode — playbook

Loaded when the user returns with new information to update an existing journey.
Cross-cutting rules (Storage, Provenance) live in `SKILL.md`.

Load the existing journey file. Ask "What changed?" — do not assume redraw.

## Behavior

1. Read the journey file from storage (see `SKILL.md` › Storage).
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
5. Write back to the journey file. Mark provenance on updated fields:
   - User directly changes a field → `_provenance: user-modified, [date]`
   - Model updates from user material → `_provenance: source: [reference]`
6. Respect existing `user-modified` fields — do not silently overwrite. Ask before changing them.
