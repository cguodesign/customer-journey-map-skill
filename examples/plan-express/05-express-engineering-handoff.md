# Express: Engineering Handoff

> Audience: Platform team (owns onboarding systems)
> Goal: Turn journey findings into actionable tickets with acceptance criteria

---

## Onboarding Journey — Engineering Spec

**Source**: Journey file `first-time-onboarding.md` (2026-05-16)  
**Scope**: Two highest-impact fixes from onboarding journey analysis

---

### Ticket 1: Recommendation Engine — Immediate Trigger

**Problem**: Recommendation engine currently waits 30s of inactivity before suggesting "Start with a Board." By that time, 60% of users have either taken no action or clicked into complex features (Goals/Sprints) and bounced. (source: product-analytics-2026-Q1)

**Current behavior**:
- User lands on `/workspace`
- Timer starts (30s)
- If no click detected after 30s → show bottom notification "Tip: Start with a Board"
- If user has already navigated away → notification shows on wrong page or not at all

**Required behavior**:
- User lands on `/workspace` for the first time (no boards exist)
- Immediately show "Create a Board" as the primary CTA in workspace center (not bottom notification)
- Suppress sidebar navigation to Goals, Sprints, Automations, Reports until user has created first board
- After first board created → unlock full sidebar, remove CTA

**Acceptance criteria**:
- [ ] First-time user on empty workspace sees "Create a Board" CTA within 500ms of page load
- [ ] Sidebar items Goals, Sprints, Automations, Reports are visually muted (not hidden) with tooltip "Available after you create your first board"
- [ ] After first board creation, full sidebar unlocks without page refresh
- [ ] Existing users (with boards) see normal workspace — no CTA, full sidebar
- [ ] Recommendation engine 30s timer is disabled for empty-workspace state (remove, don't just hide)

**Systems affected**:
- Recommendation Engine service
- Workspace frontend (sidebar component, workspace empty state)
- User state flag: `has_first_board` (may need new attribute)

**Edge cases**:
- User who received a shared board (but didn't create one): treat as "has board" — unlock sidebar
- User who deletes their only board: re-enter empty state, show CTA again

---

### Ticket 2: Invite Flow — Default Member Role

**Problem**: Invite flow requires team lead to choose Admin/Member/Guest for each invitee before sending. Permission differences aren't clear from UI. Users hesitate and delay invites by hours/days. 40% of board-creators never invite in first week. (source: product-analytics-2026-Q1)

**Current behavior**:
- User navigates to `/settings/team/invite`
- For each email entered, user must select role from dropdown: Admin / Member / Guest
- No explanation of role differences beyond truncated tooltip
- Send button disabled until all roles selected

**Required behavior**:
- User navigates to `/settings/team/invite`
- Enters email addresses (batch paste supported)
- All invitees default to "Member" role
- Single text link below input: "Change roles after inviting →" (links to team management)
- Send button active immediately after valid emails entered
- Role selection is available but collapsed/secondary (expandable "Advanced: set individual roles" section)

**Acceptance criteria**:
- [ ] Default role for all new invites is "Member" without user selection
- [ ] Email input supports paste of multiple addresses (comma, semicolon, or newline separated)
- [ ] Send button is active when ≥1 valid email is entered (no role selection required)
- [ ] "Change roles after inviting" link navigates to `/settings/team` with role management UI
- [ ] "Advanced: set individual roles" section is collapsed by default, expandable
- [ ] If seat limit is reached, show clear message with seat count and upgrade link BEFORE user enters emails (not after clicking Send)

**Systems affected**:
- Invite flow frontend (`/settings/team/invite` component)
- Billing System (seat validation — move check to page load, not submit)
- Team management API (default role parameter)

**Edge cases**:
- Admin inviting another Admin: advanced section must be used (cannot default non-Member roles)
- Free tier seat limit: show remaining seats count on page load, not as error after submit
- Duplicate email (already invited): show inline warning per-email, don't block batch send

---

### Dependencies between tickets

Ticket 1 (recommendation engine) and Ticket 2 (invite flow) are independent — can be developed in parallel.

Ticket 1 is higher priority: it affects the earlier funnel stage. A user who never creates a board will never reach the invite flow.

### Measurement

After both tickets ship, instrument:
- Time-to-first-board (target: median < 60s, down from current ~3 min)
- First-week invite rate (target: > 70%, up from current 60%)
- "First collaborative moment" (teammate's first action) — new metric, needs instrumentation
