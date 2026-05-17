# Golden Example: Composite/Atomic Conflict Resolution

## Scenario

During a Plan session, the user fills both composite fields (Category G: Service Design Layers) and atomic fields (Category E: Actions/Behaviors) for the same concept. Claude detects the overlap and guides resolution.

---

## Conversation transcript (simulated)

### User:

Let me add more detail to the "face-empty-workspace" step. The frontstage experience is: "User sees a clean workspace with a prominent CTA button and dimmed sidebar. The system greets them by name."

### Claude:

Got it. I'll add that as `frontstage`:

```
- frontstage: User sees clean workspace with prominent CTA button and dimmed sidebar. System greets by name.
```

Anything else on this step?

### User:

Actually yeah — let me also specify: what the user is doing is "scanning the screen for the first thing to click." And the visible system action is "displays personalized greeting banner + pulsing CTA button."

### Claude:

I notice you're providing two levels of detail for the same concept:

**Composite level** (high-level summary):
- `frontstage`: "User sees clean workspace with prominent CTA button and dimmed sidebar. System greets by name."

**Atomic level** (specific actions):
- `doing`: "Scanning the screen for the first thing to click"
- `frontstageAction`: "Displays personalized greeting banner + pulsing CTA button"

These overlap — the composite `frontstage` covers what both atomic fields say, plus more.

I have a rule for this: **fill one level, not both.** When both exist, I treat the atomic fields as source of truth and auto-regenerate the composite from them.

In your case, the atomic fields are *more specific* but the composite has information the atomics don't ("dimmed sidebar", "greets by name"). Two options:

**A)** Keep atomic fields, I'll enrich them to capture the missing info:
```
- doing: Scanning screen for first thing to click
- frontstageAction: Displays personalized greeting banner + pulsing CTA button; sidebar features dimmed
```
Then I auto-generate `frontstage` from these (you won't need to maintain it separately).

**B)** Keep the composite only, discard atomics:
```
- frontstage: User sees clean workspace with prominent CTA, dimmed sidebar, personalized greeting. User scans for first clickable element.
```
Simpler, but loses the actor/system distinction.

Which do you prefer?

### User:

Option A — I want the atomic detail. The distinction between what the user does and what the system shows matters for our engineering team.

### Claude:

Going with atomic. Here's the final state for this step:

```markdown
### Step: face-empty-workspace

- persona: [Team Lead]
- description: Lands on workspace with guided onboarding flow

- doing: Scanning screen for first thing to click
- frontstageAction: Displays personalized greeting banner + pulsing CTA button; sidebar advanced features dimmed
- frontstage: User scans workspace; system shows personalized greeting, prominent CTA, and dimmed sidebar.
  - _provenance: auto-composite
```

The `frontstage` composite is auto-generated from your atomic fields and marked with `_provenance: auto-composite`. If you update the atomics later, I'll regenerate it. You never need to touch the composite directly.

### User:

What if later I want to go back to just using the composite? Like for a higher-level view?

### Claude:

You can switch anytime. If you say "just keep the composite, drop the atomics," I'll:
1. Remove `doing` and `frontstageAction`
2. Keep `frontstage` as a standalone field (remove the `auto-composite` provenance)
3. The composite becomes source of truth from that point

The rule is just: don't maintain both manually. Either atomics drive composite (auto-generated), or composite stands alone. Never hand-write both — that's where drift happens.

---

## Key behaviors demonstrated

1. **Detection**: Claude noticed the overlap as soon as both levels were provided in the same conversation turn.
2. **Explanation**: Briefly explained the rule and *why* it exists (prevent drift).
3. **Options**: Offered both directions without defaulting — user chooses.
4. **Execution**: Applied the chosen option cleanly, with `auto-composite` provenance.
5. **Reversibility**: Explained how to switch back later — no lock-in.
6. **No lecture**: The whole resolution took one exchange, not a multi-paragraph policy explanation.
