# Changelog

All notable changes to the journey skill are listed here. Versions follow
[Semantic Versioning](https://semver.org): a patch release fixes bugs, a minor
release adds capability, a major release changes a file format in a way that
older journey files or logs cannot be read.

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
