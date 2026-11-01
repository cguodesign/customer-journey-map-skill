# Changelog

All notable changes to the journey skill are listed here. Versions follow
[Semantic Versioning](https://semver.org): a patch release fixes bugs, a minor
release adds capability, a major release changes a file format in a way that
older journey files or logs cannot be read.

## [0.2.0] - 2026-11-01

### Added
- Language packs: `references/i18n/en.md`, `fr.md`, `ja.md` and `zh.md` list
  every schema field with its display label in that language and the words
  people use for it. The skill reads the pack for the conversation language
  to match the user's words to an existing field instead of inventing a
  custom one, and to label fields the same way in every rendering. Field
  keys in journey files stay the English schema names.
- `journey.sh validate` suggests the field to use for an unknown key:
  `unknown field (not in schema): "waitingTime" — did you mean "waitTime"?`.
  It catches case and separator variants, small typos, near-misses of a
  registered custom field, and labels or synonyms from the language packs.

### Changed
- `journey.sh validate` rejects a step line whose key is not a field name at
  all, such as `- Wait time: 3 days` or `- 等待时间: 3 天`, and names the
  field it most likely means. These lines used to pass without being checked.
- The default palette is neutral: white paper, near-black ink, a grey scale
  between them, and one red reserved for the moment of truth. Emotion valence
  is drawn as a lightness ramp (hollow points for positive, solid for negative)
  instead of a green/red pair, and automation is a grey dashed line. The old
  warm dark seed with an orange accent is gone. The in-page **Dark** switch
  gives the neutral dark; `theme --preset midnight` keeps its own blue-black
  palette.
- Renderings open light. The in-page switch reads **Light · Dark · Paper ·
  Brand**, with Light selected; it used to open dark.
- Dark mode re-derives from the same neutral seed (zinc-950 paper, zinc-50
  ink, a lighter red), including `--brand-on-primary`, which the dark blocks
  did not set before.
- The `opportunity` marker is derived darker than the positive valence fill it
  shares a seed with, so a dashed opportunity border stays visible on a light
  fill.
- Templates take their typeface from the `--font` token instead of a
  hard-coded system stack, and the emotion-curve template draws a flat ink
  tint under the curve instead of a green-to-red gradient.
- Default type stack prefers Geist / Geist Mono when installed, falling back
  to the system faces; default radius is 6px.

## [0.1.2] - 2026-10-19

### Fixed
- `journey.sh commit … insert-milestone` logs the new milestone as the target
  and puts the anchor in the default note, so `audit --target <new-id>` shows
  the insert; it used to log the anchor. The block must start with a
  `## Milestone: <id>` line, a positional id that disagrees with the block is
  refused, and an id that already exists is refused with a message naming it.
- `journey.sh commit … register-field` refuses a name without a namespace
  prefix and suggests one (`urgency` → `team_urgency`). It used to register
  the name with a warning, but `validate` rejects any non-schema field without
  a `<scope>_` prefix, so the field could never be used. A bare prefix such as
  `team_` and names with spaces or other characters a field line cannot hold
  are refused too.

## [0.1.1] - 2026-10-11

### Fixed
- `journey.sh`: `new`, `commit` and `validate` no longer fail on Linux. The
  schema-mtime lookup tried BSD `stat -f` first, which GNU `stat` also accepts
  (as "filesystem status"), so the field-list cache path was corrupted and every
  field was rejected.
- `journey.sh validate` rejects a top-level `- _provenance:` line. It has to be
  indented under the field it annotates, and the error shows the correct form.
- `journey.sh query moment-no-evidence` now counts a source only when it sits on
  `momentOfTruth` itself (or the step has `metric`, `kpi` or `dropoffRate`). A
  source on an unrelated field, such as `emotionValence`, no longer hides a
  moment of truth that has no backing.
- `journey.sh audit` keeps records written in the same second in the order they
  were written; they used to be ordered by author, journey and operation.
- `journey.sh commit … insert-step` logs the new step as the target and puts the
  anchor in the default note, so `audit --target <new-id>` shows the insert.
  The block must now start with a `### Step: <id>` line, a positional id that
  disagrees with the block is refused, and an id that already exists is refused
  with a message naming it.

## [0.1.0] - 2026-10-11

First tagged release: a snapshot of the skill as it stood, with the mode
playbooks, schema and format references, the `journey.sh` data layer, the HTML
templates and renderings, and the examples.
