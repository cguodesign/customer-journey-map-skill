# Express mode — playbook

Loaded when the user wants to render the journey for a specific audience.
Provenance rendering per format is below; cross-cutting Provenance rules live in `SKILL.md`.

Transform journey understanding into audience-appropriate output.

## Behavior

1. Ask two questions:
   - "Who is the audience?"
   - "What should they do, decide, or feel after seeing this?"
2. Select expression format:

| Expression | Use when... |
|---|---|
| **Storyline** | Audience needs to *feel* the journey. Kickoff, design crit, empathy-building. |
| **One-page brief** | Leadership needs to decide. Quick review, stakeholder sign-off. |
| **Interactive HTML** | Workshop/reference use. Layered, expandable, explorable. |
| **Engineering handoff** | Dev team needs to build. Acceptance criteria, spec-shaped. |

3. For Interactive HTML, select rendering mode + interaction mode:

   **Rendering** (from data shape):
   - Default → Card grid
   - Active categories include frontstage/backstage/support → Swimlane
   - Primary dimension is temporal/duration → Timeline
   - Emotional arc is focus → Emotion curve (or as overlay/multi-view tab)
   - Narrative / empathy, strong arc with per-step scenes → Storyboard (a film-storyboard table; the visual cousin of the Storyline)

   **Interaction** (from step count):
   - ≤ 15 steps → Scroll-driven
   - 16–60 steps → Focus+Context
   - \> 60 steps → Zoom-pan
   - Multiple audiences → Multi-view (tabs between rendering modes)

   Consult `assets/templates/rendering/` for HTML structure, `assets/templates/interaction/` for JS behavior, and `assets/templates/wireframes/` for combined layout reference. See `references/html-rendering-guide.md` for color system and data mapping.

   **Colour comes from tokens, never from literals.** Write every colour as `var(--…)`
   from the Tier-2 vocabulary, then let the script install the palette:

   ```
   journey.sh theme <file>.html --init          # default palette, follows the reader
   journey.sh theme <file>.html --preset paper  # or the user's own brand:
   journey.sh theme <file>.html --primary '<their colour>' --surface '<theirs>' --text '<theirs>'
   ```

   If the user mentions a brand colour, a house style, or "make it match our site", that
   is a Tier-1 seed and one command — not a rewrite of the rendering. Without local file
   access, inline `assets/theme/journey-tokens.css` verbatim between `/* tokens:begin */`
   and `/* tokens:end */` and put the seeds in a `:root{}` after it (see the guide's
   specificity note before pinning a dark theme by hand).

4. Render from journey file data. Include only active categories and filled fields. (Express only
   reads — with local file access, `journey.sh validate <name>` first if you're unsure the file is
   well-formed; rendering itself stays model-side, there is no `render` command.)
5. Show provenance in output:
   - Storyline: footnotes/endnotes (preserve narrative flow)
   - Brief: inline attribution markers
   - Interactive HTML: expandable provenance panels
   - Engineering handoff: inline source references

## Storyline mechanics

- **Character**: Specific name, role, recent context. Not "the user."
- **Scene**: Sensory detail — device, time, surroundings.
- **Arc**: Tension and turn, not flat sequence. Buildup → pivot → resolution.
- **Analogy**: When the journey resembles a familiar non-product experience, use it.
- **Voice**: Third-person, present-action verbs.

## One-page brief mechanics

- **Decision-first**: Lead with the ask; restate it as a single decision line at the end.
- **Structure**: Problem (with the data that exists) → proposed fix → the ask → cost of inaction.
- **One page**: Ruthless. It must survive a 90-second skim.
- **Inline attribution**: Cite sources inline. Never invent a metric the journey doesn't carry — if a claim is un-sourced, frame it as a hypothesis and recommend instrumenting it.

## Engineering handoff mechanics

- **Spec-shaped**: Sections per addressable fix, each mapped to its journey step.
- **Current vs required**: State today's behavior, then the required behavior.
- **Acceptance criteria as checkboxes**: Write each criterion as a `- [ ]` Markdown checkbox — specific, testable, one assertion per box.
- **Edge cases, systems, dependencies**: List them explicitly; note build order.
- **Source references inline**: Cite the journey fields each requirement derives from.
