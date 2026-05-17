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
  - name: Billing System
    role: Automated seat provisioning and invite emails
    type: system
  - name: Recommendation Engine
    role: Suggests first actions to new users
    type: system
active-categories: [emotional, physical-channel, failure, service-layers, business-metrics]
---

## Milestone: account-creation

- title: Account Creation
- description: Team lead receives invite and creates their account

### Step: receive-invite-email

- persona: [Team Lead]
- description: Receives automated invite email from billing system with signup link

- channel: Email
- emotion: Mild excitement, anticipation
- backstage:
  - system: Billing System
  - action: Auto-sends invite when admin adds a seat
  - failureMode: Email lands in spam, or admin entered wrong address
- failureMode: Email doesn't arrive
- recoveryPath: → slack-admin-for-link
- next: → create-account

### Step: slack-admin-for-link

- persona: [Team Lead, Admin]
- description: Team lead messages admin on Slack asking for the signup link

- channel: Slack DM
- emotion: Mild frustration, slight embarrassment
- duration: 1-30 min (depends on admin response time)
- waitTime: Variable — admin might be in meetings
- entryPoint: true
- next: → create-account

### Step: create-account

- persona: [Team Lead]
- description: Clicks signup link, fills form (name, password, team name), creates account

- channel: Web app /signup
- emotion: Neutral — routine form filling
- duration: ~2 min
- next: → face-empty-workspace

---

## Milestone: first-action

- title: First Meaningful Action
- description: Team lead navigates the empty workspace and takes their first productive action

### Step: face-empty-workspace

- persona: [Team Lead]
- description: Lands on empty workspace with sidebar showing 8 feature options

- channel: Web app /workspace
- emotion: Confusion → overwhelm
- cognitiveLoad: high
- dropoffRate: 60% take no action in first 3 min
  - _provenance: source: product-analytics-2026-Q1
- backstage:
  - system: Recommendation Engine
  - action: Supposed to suggest "start with a board" but only triggers after 30s inactivity
  - failureMode: 30s delay means users have already clicked into confusing features
- failureMode: User clicks into Goals or Sprints (complex features requiring setup)
- recoveryPath: → stumble-into-complex-feature
- next: → create-first-board
- branchCondition: If user clicks "Create a board" → happy path; if clicks Goals/Sprints → failure path

### Step: stumble-into-complex-feature

- persona: [Team Lead]
- description: Clicks into Goals or Sprints, encounters setup requirements they don't understand

- channel: Web app /goals or /sprints
- emotion: Confusion → frustration → "this isn't for me"
- cognitiveLoad: high
- painPoint: Complex features require context (OKR structure, sprint methodology) that new users don't have
- failureMode: User abandons tool entirely
- recoveryPath: → face-empty-workspace (back button)
- backstage:
  - system: Recommendation Engine
  - action: Does not intervene once user is in a feature
  - failureMode: No rescue mechanism for wrong-path users

### Step: create-first-board

- persona: [Team Lead]
- description: Clicks "Create a board", names it, sees empty board with column templates

- channel: Web app /boards/new
- emotion: Relief → cautious optimism ("okay I can work with this")
- duration: ~1 min
- next: → explore-board-features

### Step: explore-board-features

- persona: [Team Lead]
- description: Adds a few cards, rearranges columns, discovers drag-and-drop

- channel: Web app /boards/{id}
- emotion: Growing confidence, small delight moments
- duration: ~5 min
- next: → realize-need-team

---

## Milestone: team-invitation

- title: Team Invitation
- description: Team lead invites colleagues to make the tool collaborative

### Step: realize-need-team

- persona: [Team Lead]
- description: After creating board content alone, realizes the tool is only useful if team is on it

- channel: Web app
- emotion: Motivation shift — from exploring to evangelizing
- trigger: Either self-realization or prompt from tool ("Invite your team!")
- next: → navigate-invite-flow

### Step: navigate-invite-flow

- persona: [Team Lead]
- description: Finds the invite flow, confronts role/permission decisions

- channel: Web app /settings/team
- emotion: Hesitation — "what role should people have?"
- cognitiveLoad: medium
- decision: What permission level for each team member (Admin/Member/Guest)
- painPoint: Permission model not self-explanatory; no "just invite everyone with default" shortcut
- duration: ~5 min
- next: → send-invites

### Step: send-invites

- persona: [Team Lead]
- description: Enters email addresses and sends invite batch

- channel: Web app /settings/team/invite
- emotion: Commitment — "okay we're doing this"
- backstage:
  - system: Billing System
  - action: Validates seat count, triggers invite emails
  - failureMode: Seat limit reached → confusing upgrade prompt
- failureMode: Hits seat limit, doesn't understand pricing
- dropoffRate: 40% of board-creators never invite in first week
  - _provenance: source: product-analytics-2026-Q1
- next: → wait-for-team

### Step: wait-for-team

- persona: [Team Lead]
- description: Waits for team members to accept invites and show up

- channel: Web app (checking periodically) + Slack (nudging teammates)
- emotion: Anxiety → impatience ("did they get it?")
- waitTime: Hours to days
- duration: 1-3 days typical
- failureMode: Team members ignore invite; team lead feels tool is "dead"
- next: → first-collaborative-moment

---

## Milestone: first-collaboration

- title: First Collaboration
- description: Tool becomes genuinely useful as team works together

### Step: first-collaborative-moment

- persona: [Team Lead]
- description: Sees first teammate's activity on the board — comment, card move, or new card

- channel: Web app notification + board view
- emotion: Validation, relief, excitement ("it's alive!")
- trigger: Teammate takes first action
- momentOfTruth: true
- next: → establish-team-workflow

### Step: establish-team-workflow

- persona: [Team Lead]
- description: Starts defining team conventions — what boards mean, how to use labels, standup rituals

- channel: Web app + Slack (communicating norms)
- emotion: Ownership, investment
- duration: Ongoing over first 1-2 weeks
- exitPoint: true
