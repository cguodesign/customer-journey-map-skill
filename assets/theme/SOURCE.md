# Theme source

`journey-tokens.css` and paper / midnight / blueprint / contrast are verbatim
snapshots from https://github.com/cguodesign/customer-journey-map-skill:
tokens and the rendering and interaction references in ../template-library
from master commit 1ce519d (PR #4, the neutral default, squash-merged
2026-11-01; retrieved from the PR branch the same day).

The picker's first entry, "Default", is not a preset file: it is the skill's own
shipped palette (white paper, near-black ink, one red for the moment of truth),
reached with `journey.sh theme map.html --init` and no `--preset`.

Graphite is a new reusable Tier-1 preset, authored for this website.
The copy here is canonical; it has NOT been published in the skill repository.

Build: tools/build_themes.py reads the same preset files for both CSS and the picker.
The upstream token file is unchanged. Its :root selectors are mechanically scoped to
[data-journey-theme] in generated journey-theme.css to isolate examples from site chrome.
Semantic derivation formulas are unchanged. Component colors only consume semantic tokens.

To install Graphite into an existing skill, copy presets/graphite.css into its
assets/theme/presets/ directory, then run:

    bash "$JOURNEY_SKILL/scripts/journey.sh" theme map.html --init --preset graphite

JOURNEY_SKILL is the absolute path to the installed skill, not a new CLI executable.
