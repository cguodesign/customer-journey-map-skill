# Golden Example: Express Selection Conversation

## Scenario

After building the onboarding journey in Plan mode, the user wants to create an output. This example shows the two-question selection process before Claude picks an expression format.

---

## Conversation transcript (simulated)

### Example 1: Clear audience → Storyline

**User:**

Okay I think the journey is solid. Can you turn this into something I can present?

**Claude:**

Sure — two quick questions so I produce the right thing:

1. **Who's the audience?** (e.g., leadership, design team, engineering, workshop participants, mixed)
2. **After they see this, what should happen?** (e.g., feel empathy, make a decision, start building, explore details)

**User:**

It's for our product team kickoff next Monday. I want them to *feel* what new users go through — not just see a diagram. I want them to leave the meeting motivated to fix the onboarding.

**Claude:**

That's a **Storyline** — literary, character-driven, emotional arc. Your team should walk away feeling the frustration and "aha" moments the user feels, not just understanding the structure.

I'll write it with:
- A specific character (not "the user")
- Scene-level detail (time of day, what's on their screen, their internal monologue)
- Emotional tension that builds toward the key drop-off moments
- Provenance as footnotes (so the story flows, but data nerds can check sources)

Give me a moment...

---

### Example 2: Clear audience → Engineering handoff

**User:**

I need to hand this off to the platform team so they know what to build.

**Claude:**

Two questions:

1. **Who specifically on the platform team?** (the whole team, a specific squad, a tech lead reviewing scope?)
2. **What should they do after reading?** (create tickets, estimate effort, understand requirements, push back on scope?)

**User:**

The whole platform team. They should be able to create Jira tickets directly from what I give them. Acceptance criteria, edge cases, the works.

**Claude:**

That's an **Engineering handoff** — spec-shaped, precise, with acceptance criteria they can copy into tickets.

I'll organize it as:
- One section per addressable fix (mapped to specific journey steps)
- Current behavior vs required behavior
- Acceptance criteria as checkboxes
- Edge cases called out explicitly
- Systems affected and dependencies
- Source references inline (so they know what's a data-backed requirement vs a design decision)

Working on it...

---

### Example 3: Ambiguous → Claude helps choose

**User:**

Can you output this journey for me?

**Claude:**

Happy to. A couple of questions to make sure it's useful:

1. **Who's going to read this?** 
2. **What do you want them to do or feel after?**

**User:**

Hmm, it's for a few different people actually. My VP needs to approve budget for fixes, but I also want the design team to use it as a reference during their sprint.

**Claude:**

Those are two different audiences with different needs:

- **VP (budget approval)** → **One-page brief**. Decision-focused, shows the problem and cost of inaction, asks for specific approval. Quick to read.
- **Design team (sprint reference)** → **Interactive HTML**. Explorable, layered — they can drill into specific steps, see backstage detail, expand evidence. Lives as a bookmark they come back to.

Want me to produce both? Or prioritize one?

**User:**

Both. VP brief first.

**Claude:**

Starting with the One-page brief for your VP, then I'll do the Interactive HTML for design. 

For the brief — what's the specific ask? Budget for engineering headcount? Approval to deprioritize another project? Or just awareness?

**User:**

I want approval to dedicate 2 sprints of platform team time to fixing the empty workspace and invite flow.

**Claude:**

Got it. I'll frame the brief around: here's the problem (with numbers), here's the proposed fix (2 specific changes), here's what you're asking for (2 sprints), here's what happens if we don't (continued drop-off). Writing now...

---

### Example 4: User specifies format directly

**User:**

Give me the storyline version.

**Claude:**

Got it — Storyline. One question: who's reading it? The character voice and emotional emphasis shifts depending on whether this is for a design crit, a leadership meeting, or a team kickoff.

**User:**

It's for a design crit on Thursday.

**Claude:**

Perfect. For a design crit I'll lean into the *specific moments where design fails the user* — the choices we made that create friction. The arc will build toward "we designed this problem, we can design the fix." Writing...

---

## Key behaviors demonstrated

1. **Always asks two questions** before producing output — even if user names a format directly (Example 4 still asks about audience).
2. **Questions are brief** — not a form, not a menu. Natural language.
3. **Claude maps answers to expression types** explicitly: "That's a Storyline" / "That's an Engineering handoff."
4. **Ambiguous cases get options** (Example 3) with reasoning for each.
5. **Claude clarifies purpose** even within a format (Example 4: "for a design crit I'll emphasize X").
6. **No friction for clear cases** — if user says "engineering handoff" Claude doesn't force them through the full selection ritual, just confirms audience context.
