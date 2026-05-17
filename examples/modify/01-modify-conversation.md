# Golden Example: Modify

## Scenario

Three months after the initial Plan session, the product designer returns. The team shipped the recommendation engine fix, ran a new round of user interviews, and experienced an incident with the billing system. She wants to update the journey with new reality.

---

## Conversation transcript (simulated)

### User:

I want to update our onboarding journey. Three things changed since last time:
1. We shipped the recommendation engine fix — it now triggers immediately
2. We did 6 new interviews last month
3. Our billing system had a 4-hour outage last Tuesday that affected invites

### Claude (Modify mode):

Loading your journey file (`first-time-onboarding.md`, last modified 2026-05-16).

Three updates to integrate. Let me go through each against the existing steps.

---

**Update 1: Recommendation engine fix shipped**

This affects step `face-empty-workspace`. Currently the journey says:

> backstage → Recommendation Engine: "Supposed to suggest 'start with a board' but only triggers after 30s inactivity"

Since the fix shipped, this backstage description is now **stale**. The engine triggers immediately. Questions:

- Is the 60% drop-off number still accurate post-fix, or do you have new data?
- Should I update the backstage to reflect current behavior, and add a note that the timing issue is resolved?

### User:

Yes update the backstage. And actually we have new data: drop-off in first 3 min went from 60% to 35%. Still not great but significantly better.

### Claude:

Good — that's a meaningful improvement. I'll:
- Update backstage on `face-empty-workspace` to reflect immediate trigger
- Update `dropoffRate` from 60% → 35% with source attribution to your new data
- Keep the old 60% as historical reference? Or remove?

### User:

Keep it as a note — it's useful context for why we made the change.

### Claude:

Got it. Here's the diff for `face-empty-workspace`:

```diff
  - backstage:
-   - system: Recommendation Engine
-   - action: Supposed to suggest "start with a board" but only triggers after 30s inactivity
-   - failureMode: 30s delay means users have already clicked into confusing features
+   - system: Recommendation Engine
+   - action: Triggers "Create a Board" CTA immediately on first empty workspace load
+   - failureMode: CTA only shows for empty workspace — users who received shared boards skip it
+   - note: Previously had 30s delay (fixed 2026-06)

- - dropoffRate: 60% take no action in first 3 min
-   - _provenance: source: product-analytics-2026-Q1
+ - dropoffRate: 35% take no action in first 3 min (down from 60% pre-fix)
+   - _provenance: source: product-analytics-2026-Q2
```

Also, the `branchCondition` on this step may need updating — is the "clicks into Goals/Sprints" failure path less common now, or does it still happen?

### User:

It still happens but less. Maybe 15% now instead of whatever it was before. The CTA captures most people but some still explore the sidebar.

### Claude:

Noted. I'll add that data point to `stumble-into-complex-feature`.

---

**Update 2: New interview findings**

You did 6 new interviews. What did you learn that's different from what we have?

### User:

Two big findings:
1. The "wait for team" step is way more painful than we thought. People described checking the tool 5-6 times a day waiting for teammates. One person said "I felt like I was throwing a party and nobody came."
2. Several people mentioned they wished they could set up a board *before* inviting — like a demo board with sample content to show their team why they should join.

### Claude:

Finding 1 deepens the `wait-for-team` step — more emotion and behavior detail. I'll add:

```diff
  ### Step: wait-for-team
  - emotion: Anxiety → impatience ("did they get it?")
+ - emotion: Anxiety → obsessive checking → self-doubt ("did I pick the wrong tool?")
+   - _provenance: source: user-interviews-2026-08 (n=6)
+ - doing: Checks board 5-6 times per day for teammate activity
+   - _provenance: source: user-interviews-2026-08
+ - painPoint: "Throwing a party and nobody came" — solo tool feels worthless
+   - _provenance: source: user-interviews-2026-08, participant 3
```

Finding 2 is interesting — it suggests a **new step** we don't currently have: "prepare demo board for team." This would sit between `explore-board-features` and `realize-need-team`. Some users want to *show* value before inviting.

Want me to add it as an optional/branching step?

### User:

Yes! That's a great addition. Not everyone does it but the ones who do seem more successful at getting their team on.

### Claude:

Adding new step `prepare-demo-board`:

```markdown
### Step: prepare-demo-board

- persona: [Team Lead]
- description: Creates a polished example board with real tasks to show team why the tool is worth joining

- channel: Web app /boards/{id}
- emotion: Craftsmanship — wants to make a good impression
- duration: 15-30 min
- motivation: "If I show them something real, they'll get it faster"
  - _provenance: source: user-interviews-2026-08
- optionality: optional
- branchCondition: Users who want to "sell" the tool to reluctant teammates
- next: → realize-need-team
```

Placing it after `explore-board-features` with `optionality: optional`.

---

**Update 3: Billing system outage**

Tell me about the outage — how did it affect the journey?

### User:

Last Tuesday the billing system was down for 4 hours. During that time, nobody could send invites — they'd click Send and get a generic "something went wrong" error. No explanation. We got 12 support tickets in those 4 hours. Also, the invite email delivery was delayed for another 2 hours after the fix because of a queue backlog.

### Claude:

This affects step `send-invites`. I'll update the backstage and failure mode:

```diff
  - backstage:
    - system: Billing System
    - action: Validates seat count, triggers invite emails
-   - failureMode: Seat limit reached → confusing upgrade prompt
+   - failureMode:
+     - Seat limit reached → confusing upgrade prompt
+     - System outage → generic "something went wrong" error, no context (incident 2026-08-12, 4hr outage, 12 support tickets)
+       - _provenance: source: incident-report-2026-08-12
+     - Post-outage queue backlog → 2hr delivery delay even after fix
+       - _provenance: source: incident-report-2026-08-12
```

Also: should we add a `serviceRecovery` field here? The journey currently doesn't document what happens when the billing system fails — does the user get notified when it's fixed, or do they have to retry manually?

### User:

They have to retry manually. Nobody gets notified. That's actually a problem we should fix.

### Claude:

Good catch. I'll add:

```markdown
- serviceRecovery: None — user must manually retry. No notification when system recovers.
- opportunity: Auto-retry queued invites on system recovery + notify user "your invites have been sent"
```

---

## Diff summary

Here's the complete set of changes for this Modify session:

| Step | Change type | What changed |
|------|-------------|-------------|
| `face-empty-workspace` | Updated | Backstage reflects shipped fix; dropoff 60% → 35%; branch still exists but reduced |
| `stumble-into-complex-feature` | Updated | Added frequency data (15% of users post-fix) |
| `explore-board-features` | Updated | `next` field now branches to optional `prepare-demo-board` |
| **`prepare-demo-board`** | **New step** | Optional step for users who prep a demo board before inviting |
| `wait-for-team` | Updated | Richer emotion, behavior data (5-6x daily checking), new pain point quote |
| `send-invites` | Updated | Additional failure modes from incident; added serviceRecovery field + opportunity |

**Categories affected**: This session surfaced a new field (`serviceRecovery` from Service Design Layers category) not previously active. Adding to `active-categories`.

Shall I write all these changes to the journey file?

### User:

Yes, write it all.

### Claude:

Done. Journey file updated. `last-modified` set to 2026-08-15.
