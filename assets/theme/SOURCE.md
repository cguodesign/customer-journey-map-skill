# Theme source

`journey-tokens.css` and paper / midnight / blueprint / contrast are verbatim
snapshots from https://github.com/cguodesign/customer-journey-map-skill
at commit f30cc0bb9a8052d3fd4a0279881f535ab06db599 (2026-10-13 retrieval).
The rendering and interaction references in ../template-library are from the same commit.

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
