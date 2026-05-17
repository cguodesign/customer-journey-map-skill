# Express: Interactive HTML

> Audience: Design team workshop
> Goal: Explorable reference — team can drill into any step's detail, evidence, and backstage

---

## Output description

The Interactive HTML expression produces a single self-contained `.html` file with embedded CSS and JavaScript. No build step required — open in any browser.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Journey: First-time onboarding — PM SaaS               │
│  Personas: Team Lead, Admin, Billing System, Rec Engine  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Account Creation] → [First Action] → [Team Invite] → [Collab]
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ▼ Milestone: First Meaningful Action            │   │
│  │                                                   │   │
│  │  ● face-empty-workspace                          │   │
│  │    "Lands on empty workspace..."                  │   │
│  │    😟 Confusion → overwhelm                      │   │
│  │    ⚡ 60% drop-off in 3 min                      │   │
│  │    [+ Backstage] [+ Failure] [+ Evidence]        │   │
│  │                                                   │   │
│  │  ● stumble-into-complex-feature                  │   │
│  │    ...                                            │   │
│  │                                                   │   │
│  │  ● create-first-board                            │   │
│  │    ...                                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Interaction model

1. **Milestone navigation bar** (top): Horizontal pill buttons. Click to scroll to milestone section. Active milestone highlighted.

2. **Step cards**: Each step is a card showing:
   - Step name and description (always visible)
   - Emotion indicator (emoji + text, always visible)
   - Key metric if present (always visible)
   - Expandable sections (collapsed by default):
     - **[+ Backstage]**: System, action, failure mode, owner
     - **[+ Failure]**: Failure modes, recovery paths, branch conditions
     - **[+ Evidence]**: Fields with `_provenance: source:` markers, showing source reference
     - **[+ Opportunities]**: Pain points and opportunities

3. **Flow arrows**: Connecting lines between step cards showing `next` and `recoveryPath` relationships. Happy path in solid line, failure/recovery in dashed.

4. **Persona filter**: Toggle which personas are highlighted. Dimming steps where selected persona isn't involved.

5. **Provenance panel** (bottom drawer): Click any field with provenance to see full attribution. Shows:
   - Source reference
   - Date of last modification
   - Whether user-modified or model-inferred

### Technical approach

```html
<!DOCTYPE html>
<html>
<head>
  <title>Journey: First-time onboarding</title>
  <style>
    /* Self-contained CSS — card layout, expandable sections, 
       flow arrows via CSS/SVG, persona filter highlights */
  </style>
</head>
<body>
  <div id="journey-container">
    <!-- Generated from journey file data -->
    <!-- Each milestone → section -->
    <!-- Each step → card component -->
    <!-- Expandable details via <details>/<summary> elements -->
  </div>
  <script>
    // Minimal JS: expand/collapse, persona filtering, 
    // scroll-to-milestone, provenance panel toggle
    // No framework dependencies — vanilla JS only
  </script>
</body>
</html>
```

### Key design decisions for HTML expression

- **Self-contained**: Single file, no external dependencies. Works offline.
- **Progressive disclosure**: Summary visible; detail on demand via expand.
- **Print-friendly**: Collapsed state prints cleanly as overview. Expanded state prints full detail.
- **Accessible**: Semantic HTML, keyboard navigable, screen-reader friendly expand/collapse.
- **Provenance visible**: Source-attributed fields have a small "📎" indicator; click reveals source.

---

## Note

This golden example describes the *specification* for the Interactive HTML output rather than including the full HTML code. When the skill generates this expression, it produces the actual `.html` file following these design principles.
