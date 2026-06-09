# scripts/ — the deterministic toolbelt

One bash dispatcher, **`journey.sh <cmd>`**, in POSIX shell + awk/grep/sed — no
Python/Node, so it runs in any agent's shell (Claude Code, Codex, …). Full design
rationale and decisions live in the internal `docs/data-layer.md`.

**Principle (from usage-model.md › Design principles):** the LLM decides *what*; these
scripts enforce *how* — placement, validation, logging, search. Generative/judgment work
stays with the model; mechanical/correctness work is deterministic here.

## Commands — build order

| # | `journey.sh …` | Does | Status |
|---|----------------|------|--------|
| 1 | `commit` | Block-level node CRUD (`insert`/`replace`/`remove` a step or milestone by id) → place + validate + log. **The write path.** | ⬜ |
| 2 | `validate` | Well-formed file + field names ∈ schema (field list awk-extracted from `references/journey.schema.md`). Called by `commit`; also standalone. | ⬜ |
| 3 | `query` / `search` | Filter/search across `./.journey/*.md` + the changelogs (audit). | ⬜ |
| 4 | `render` | LLM picks mode/params; a fill step produces HTML. Lower priority (LLM does it today). | ⬜ |

## Key decisions (see data-layer.md for the why)

- **Ids** are stable semantic slugs; display numbers are render-time. Insert is positioned
  by `--after <id>` / `--before <id>`, never by index.
- **Document order is authoritative** for sequence; `commit` regenerates linear `next:`
  links; explicit branch links are preserved.
- **`replace` diffs** the new block against the old to preserve provenance on untouched
  fields (no clobber). **Atomic write**: temp → `validate` → `mv`. **`flock`** when shared.
- **Changelog**: per-journey sidecar `./.journey/<name>.log`, TSV —
  `iso_time \t author \t journey \t op \t target \t note`. Written only by `commit`.

## Efficiency

Edits become **O(change), not O(file)** — the model emits one block + an op instead of
re-writing the file. `query` reads the markdown live (no index) until portfolio scale
demands one. Scripts run in milliseconds; they exist to move mechanical work off the
expensive/slow model.
