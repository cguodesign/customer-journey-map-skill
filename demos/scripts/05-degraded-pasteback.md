# Demo 05 — Degraded path: no storage, paste-back

**Shows:** the skill works with **no file access at all** — you paste a journey in, it
works in conversation, and hands the whole thing back for you to save. Useful in any chat
context (claude.ai, a sandbox without write access, etc.).
**Time:** ~2 min · **New session** (ideally one without file write, but it works anywhere —
the point is the paste-in / hand-back behavior).

---

### Turn 1 — paste a journey inline + ask for a change
```
I built this journey in another tool and don't have the file here — I'm just pasting it. Update it: we added instant verification via Plaid last month, so for supported banks the 3-day wait is gone; the old 3-day path stays as a fallback for unsupported banks. Give me back the whole updated journey to save.

---
journey: First-time online payments setup
created: 2026-05-20
last-modified: 2026-05-20
personas:
  - name: Maya
    role: Small business owner, first-time online payments
    type: primary
structure: Journey > Milestone > Step
---

## Milestone: verification
- title: Account & Verification
- description: Maya creates an account and gets verified to accept payments

### Step: bank-verification
- persona: [Maya]
- description: Waits for bank account verification before going live
- emotion: Anxiety — assumes it's broken
- duration: 3 business days
- failureMode: Gives up during the silent 3-day wait
- next: → first-payment

## Milestone: go-live
- title: Go Live
- description: Maya takes her first real payment

### Step: first-payment
- persona: [Maya]
- description: First successful card payment
- emotion: Relief
- exitPoint: true
---
```

**Watch for:**
- It **accepts the pasted content** as the source of truth — no error about missing storage.
- It shows a short **diff** and handles the contradiction by **branching** (instant path +
  3-day fallback), not deleting the old wait.
- It outputs the **complete updated journey** in a copy-paste block for you to save.

---

✅ **Pass looks like:** a fully in-conversation Modify that never needed a filesystem, ending
with the whole journey handed back to you. This is the fallback that makes the skill usable
anywhere, not just in Claude Code.
