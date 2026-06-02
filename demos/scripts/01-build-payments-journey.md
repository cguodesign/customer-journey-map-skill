# Demo 01 — Plan: build a journey from a conversation

**Shows:** organic field emergence, milestone grouping, fact persistence (a stated fact
lands in the file), and clean provenance (no markers on plain Plan input).
**Time:** ~3 min · **New session.** Produces `./.journey/online-payments-setup.md`
(the canonical journey behind the whole gallery).

---

### Turn 1 — paste this
```
Help me map the journey of a small business owner setting up online payments for the first time. This is for an online store — e-commerce checkout, not in-person card readers. I'll fill in details as you go.
```
**Watch for:** it starts building (persona + first milestone), does **not** show a field
menu, may ask one or two grounding questions.

### Turn 2 — paste this
```
All your calls — draft the whole thing, I'll correct it after.
```
**Watch for:** a full first draft written to `./.journey/…md` (milestones + steps), with a
reasonable persona it invented rather than stalling for input.

### Turn 3 — paste this
```
The hardest part is bank account verification — it takes 3 business days, and during that wait there's no feedback at all, so most people think it's broken and a ton of them just give up right there.
```
**Watch for (the key moment):** open `./.journey/online-payments-setup.md` and confirm
the verification step now carries these as real fields — not just acknowledged in chat:
```
- duration: 3 business days …
- painPoint: … "most people think it's broken" / "give up during the silence"
- failureMode: … abandons the setup
```

### Then check provenance
```bash
grep -c "_provenance" ./.journey/online-payments-setup.md   # expect 0 — pure Plan input
```

✅ **Pass looks like:** the 3-day fact is in the file, and there are zero provenance markers.
Keep this journey — Demo 02 expresses it four ways. (A reference copy lives at
`../gallery/payments-journey.md`.)
