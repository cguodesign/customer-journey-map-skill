# Express: One-Page Brief

> Audience: VP Product, quarterly planning review
> Goal: Secure prioritization of onboarding improvements for next quarter

---

## Onboarding Journey — Key Findings & Recommendations

**Journey**: First-time onboarding for team leads (post-purchase)  
**Data basis**: Product analytics Q1 2026 + 5 user interviews  
**Last updated**: 2026-05-16

---

### The problem in one sentence

New team leads successfully create accounts but get stuck at two critical drop-off points: the empty workspace (60% inaction rate) and team invitation (40% never invite in first week).

---

### Journey health summary

| Milestone | Conversion | Key issue |
|-----------|-----------|-----------|
| Account Creation | ~95% | Low friction; spam filter is minor edge case |
| First Action | **40%** take action within 3 min | Empty workspace overwhelm; recommendation engine fires too late |
| Team Invitation | **60%** of board-creators eventually invite | Permission model confusion delays action by days |
| First Collaboration | — (not yet measured) | Dependent on invitation success |

---

### Two decisions needed

**1. Fix the empty workspace (high impact, medium effort)**

The recommendation engine triggers after 30 seconds of inactivity — but by then, users have already clicked into complex features (Goals, Sprints) and bounced. 

Proposal: Trigger immediately on first load. Default to "Create a Board" as primary CTA. Suppress advanced features until user has completed first board.

**2. Simplify team invitation (medium impact, low effort)**

Users hesitate because the Admin/Member/Guest permission model isn't self-explanatory. No "just invite everyone at default" shortcut exists.

Proposal: Default all invites to "Member" with a single "change roles later" link. Remove permission selection from the initial invite flow.

---

### What happens if we don't act

- 60% of new users never experience the "alive workspace" moment that drives retention
- Team leads who don't invite within the first week are 3x more likely to churn (inference — needs validation)[^1]
- Competitor tools with guided onboarding capture users during this exact gap

---

### Recommended next steps

1. **This quarter**: Ship recommendation engine timing fix (immediate trigger) + "Create a Board" as default CTA
2. **This quarter**: Simplify invite flow (default Member role, defer permission configuration)
3. **Next quarter**: Instrument "first collaborative moment" to measure if fixes propagate downstream

---

[^1]: The 3x churn inference is based on combining invitation analytics with retention data but has not been validated through controlled analysis. Treat as hypothesis.
