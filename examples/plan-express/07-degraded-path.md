# Golden Example: Degraded Path (Paste-back flow)

## Scenario

A product manager uses Claude.ai without any MCP connection. She mapped a journey last month and now wants to update it. She copies the journey.md content from her local notes and pastes it into the conversation.

---

## Conversation transcript (simulated)

### User:

I want to update my onboarding journey. Here's the current file:

```
---
journey: First-time onboarding — Project management SaaS
created: 2026-05-16
last-modified: 2026-05-16
personas:
  - name: Team Lead
    role: Recently got tool approved, responsible for rolling out to team
    type: primary
  - name: Admin
    role: Purchased seats, manages billing
    type: secondary
active-categories: [emotional, physical-channel, failure, service-layers]
---

## Milestone: account-creation

- title: Account Creation
- description: Team lead receives invite and creates their account

### Step: receive-invite-email

- persona: [Team Lead]
- description: Receives automated invite email from billing system with signup link

- channel: Email
- emotion: Mild excitement, anticipation
- failureMode: Email doesn't arrive
- recoveryPath: → slack-admin-for-link
- next: → create-account

### Step: create-account

- persona: [Team Lead]
- description: Clicks signup link, fills form, creates account

- channel: Web app /signup
- emotion: Neutral — routine form filling
- duration: ~2 min
- next: → face-empty-workspace

## Milestone: first-action

- title: First Meaningful Action
- description: Team lead navigates empty workspace and takes first action

### Step: face-empty-workspace

- persona: [Team Lead]
- description: Lands on empty workspace with sidebar showing 8 feature options

- channel: Web app /workspace
- emotion: Confusion → overwhelm
- dropoffRate: 60% take no action in first 3 min
  - _provenance: source: product-analytics-2026-Q1
- failureMode: User clicks into Goals or Sprints
- next: → create-first-board

### Step: create-first-board

- persona: [Team Lead]
- description: Clicks "Create a board", names it, sees empty board

- channel: Web app /boards/new
- emotion: Relief → cautious optimism
- duration: ~1 min
- next: → explore-board-features
```

We shipped some changes. The empty workspace now has a guided flow, and our drop-off improved. Can you update this?

### Claude (Modify mode):

Got it — I've read your journey file. I can see 4 steps across 2 milestones, with active categories: emotional, physical-channel, failure, service-layers.

You mentioned you shipped changes to the empty workspace and drop-off improved. Tell me:

1. What does the new guided flow look like?
2. What's the new drop-off number?

### User:

The new guided flow shows a big "Create your first board" button in the center of the workspace immediately on load. We also dimmed the advanced features in the sidebar. Drop-off went from 60% to 28%.

### Claude:

Significant improvement. Here's what I'll change on `face-empty-workspace`:

**Changes:**
- `description`: Update to reflect new guided CTA
- `emotion`: Likely shifted from "confusion → overwhelm" — what are you seeing now?
- `dropoffRate`: 60% → 28% with new source
- `failureMode`: Is "clicks into Goals/Sprints" still happening with dimmed sidebar?
- `backstage`: Should we add the guided flow system as backstage?

### User:

Emotion is more like "directed — I know what to click." Failure mode still exists but much rarer — maybe 10% still explore sidebar despite dimming. And yes, let's note the guided flow in backstage.

### Claude:

Here's your updated journey file. I've marked changes with provenance where appropriate:

---

```
---
journey: First-time onboarding — Project management SaaS
created: 2026-05-16
last-modified: 2026-08-20
personas:
  - name: Team Lead
    role: Recently got tool approved, responsible for rolling out to team
    type: primary
  - name: Admin
    role: Purchased seats, manages billing
    type: secondary
active-categories: [emotional, physical-channel, failure, service-layers]
---

## Milestone: account-creation

- title: Account Creation
- description: Team lead receives invite and creates their account

### Step: receive-invite-email

- persona: [Team Lead]
- description: Receives automated invite email from billing system with signup link

- channel: Email
- emotion: Mild excitement, anticipation
- failureMode: Email doesn't arrive
- recoveryPath: → slack-admin-for-link
- next: → create-account

### Step: create-account

- persona: [Team Lead]
- description: Clicks signup link, fills form, creates account

- channel: Web app /signup
- emotion: Neutral — routine form filling
- duration: ~2 min
- next: → face-empty-workspace

## Milestone: first-action

- title: First Meaningful Action
- description: Team lead navigates workspace and takes first action via guided flow

### Step: face-empty-workspace

- persona: [Team Lead]
- description: Lands on workspace with prominent "Create your first board" CTA and dimmed advanced features in sidebar
  - _provenance: user-modified, 2026-08-20

- channel: Web app /workspace
- emotion: Directed — clear next step visible
  - _provenance: user-modified, 2026-08-20
- dropoffRate: 28% take no action in first 3 min (down from 60% pre-guided-flow)
  - _provenance: source: product-analytics-2026-Q2
- backstage:
  - system: Guided Onboarding Flow
  - action: Shows centered CTA immediately on first load; dims sidebar advanced features
  - note: Previously no guidance for 30s; this was the primary fix
- failureMode: ~10% still explore dimmed sidebar features despite visual de-emphasis
  - _provenance: user-modified, 2026-08-20
- next: → create-first-board

### Step: create-first-board

- persona: [Team Lead]
- description: Clicks "Create a board", names it, sees empty board

- channel: Web app /boards/new
- emotion: Relief → cautious optimism
- duration: ~1 min
- next: → explore-board-features
```

---

**Diff summary:**
| Step | What changed |
|------|-------------|
| `face-empty-workspace` | Description updated (guided CTA); emotion shifted; dropoff 60%→28%; backstage added; failure mode updated to 10% |
| Milestone `first-action` | Description updated to mention guided flow |
| Preamble | `last-modified` updated to 2026-08-20 |

Copy this updated version and save it wherever you keep your journey files. Next time you want to update, paste the latest version back here and we'll pick up where we left off.
