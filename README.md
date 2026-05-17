# Customer Journey Map Skill

A Claude Code skill for building, evolving, and expressing customer journey maps as long-term living documents.

## What it does

This skill gives Claude the ability to work with customer journey maps across three modes:

- **Plan** — Build a new journey from conversation. Starts with just persona, milestone, and description. Optional fields (emotion, backstage, systems, failure modes, etc.) emerge organically as the conversation surfaces them.
- **Modify** — Update an existing journey with new research, incidents, or product changes. Diff-based: shows what changed, why, and what downstream steps may be affected.
- **Express** — Render the journey for a specific audience in one of four formats: Storyline (literary), One-page brief (leadership), Interactive HTML (workshop reference), or Engineering handoff (spec-shaped).

## Key design decisions

- **Schema-rich, user-light.** ~100 pre-defined optional fields from CJM/service design theory, but users never see a field selection menu. Fields appear when conversation naturally surfaces them.
- **Provenance is automatic.** Model-generated content carries no marker. User modifications and source-backed claims are tracked at the field level without user involvement.
- **Step is the atomic unit.** Not "moment", not "touchpoint". Steps group into lightweight Milestones (id + title + description).
- **Format-first, storage-pluggable.** Journey data lives in a canonical markdown format. Storage adapters (local file, Notion MCP, Drive MCP, or paste-back) are detected at runtime.

## File structure

```
SKILL.md                          # Behavior contract (entry point)
references/
  journey.schema.md               # Field vocabulary: 13 categories, ~100 fields
  journey.format.md               # Canonical markdown format specification
  html-rendering-guide.md         # Interactive HTML: color strategy, data mapping
assets/templates/
  rendering/                      # 4 rendering mode references (HTML + CSS, no JS)
    card-grid.html
    timeline.html
    swimlane.html
    emotion-curve.html
  interaction/                    # 4 interaction mode references (JS behavior patterns)
    scroll-driven.html
    focus-context.html
    zoom-pan.html
    multi-view.html
  wireframes/                     # 11 wireframes (one per valid M x N combination)
    card-scroll.html
    card-focus-context.html
    card-multiview.html
    timeline-scroll.html
    timeline-focus-context.html
    timeline-zoom-pan.html
    swimlane-scroll.html
    swimlane-focus-context.html
    swimlane-zoom-pan.html
    emotion-scroll.html
    emotion-multiview.html
examples/
  plan-express/                   # Full Plan -> Express golden example
  modify/                         # Modify mode example
  schema-evolution/               # Field emergence and composite/atomic conflict
```

## Interactive HTML

The Express mode supports Interactive HTML output via an M x N matrix of rendering modes and interaction modes:

|                  | Scroll | Focus+Context | Zoom-pan | Multi-view |
|------------------|:---:|:---:|:---:|:---:|
| **Card grid**    | + | + | - | + |
| **Timeline**     | + | + | + | - |
| **Swimlane**     | + | + | + | - |
| **Emotion curve**| + | - | - | + |

Selection is automatic based on step count (interaction) and data shape (rendering), with user override always available.

## Usage

Add this skill to a Claude Code project:

```bash
claude mcp add-skill customer-journey-map https://github.com/cguodesign/customer-journey-map-skill
```

Then start a conversation:

- "Help me map the onboarding journey for new users"
- "I have new research — let me update the journey"
- "Turn this into a storyline for Monday's kickoff"
- "Create an interactive HTML for the design team"

## Theoretical foundations

Field vocabulary draws from: NN/g Journey Mapping, Forrester CX Index, Shostack Service Blueprinting, Jobs-to-be-Done (Christensen), Adaptive Path Experience Maps, and the Double Diamond design process.

## License

MIT
