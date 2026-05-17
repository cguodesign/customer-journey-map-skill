# Golden Example: Plan + Express

## Scenario

A product designer wants to map the onboarding journey for a project management SaaS tool. She has some interview notes and analytics but mostly works from memory and intuition.

---

## Conversation transcript (simulated)

### User:

I want to map our onboarding journey for new users of our project management tool. The main persona is a team lead who just got the tool approved for their team.

### Claude (Plan mode):

Got it. Let's build this out. Starting with:

- **Persona**: Team Lead (just got tool approved for team)
- **Journey**: First-time onboarding for project management SaaS

Let's walk through what happens after they get approval. What's the first thing they do?

### User:

They get an email with a signup link from the admin who purchased. They click it, land on a signup page, create their account. Pretty standard.

### Claude:

I'll structure that as two steps under an "Account Creation" milestone.

A couple of questions as we go:
- What system sends that email — is it automated from the admin's purchase, or does the admin manually forward something?
- If the email doesn't arrive (spam filter, wrong address), where does the team lead go?

### User:

It's automated from our billing system when the admin adds a seat. If it doesn't arrive... honestly they usually Slack the admin and the admin resends or shares the link directly.

### Claude:

Good — that gives us a failure path. I notice you mentioned Slack as the fallback channel. Want me to capture **channel** on these steps so we can see where each interaction happens?

### User:

Yeah sure, that makes sense.

### Claude:

Here's what I have so far:

**Milestone: Account Creation**

1. **Receive invite email** — Team lead gets automated email from billing system with signup link. Channel: Email. Failure: email doesn't arrive → Slack admin for link.
2. **Create account** — Clicks link, fills signup form. Channel: Web app. 

What happens after they create the account?

### User:

They land on this empty workspace. It's supposed to be a "getting started" experience but honestly our data shows 60% of people just stare at it and don't know what to do first. It's a blank canvas with too many options.

### Claude:

That's a critical moment. I'm capturing the emotion here — sounds like confusion/overwhelm. And that 60% number — is that from analytics?

### User:

Yeah, from our product analytics. 60% don't take any action in the first 3 minutes after landing on the empty workspace.

### Claude:

Got it. I'll note that with source attribution since it's from analytics data.

What are the options they see on this blank canvas? And what do they *eventually* figure out to do (the ones who don't drop off)?

### User:

There's a sidebar with like 8 different features — boards, timelines, docs, goals, sprints, etc. The successful ones usually click "Create a board" because it's the most visual and familiar. But we lose people who click into Goals or Sprints first because those require more setup and context.

### Claude:

So there's a branching point here — people who pick the "right" first action (boards) vs those who stumble into complex features. Want me to capture the failure mode on those alternative paths?

### User:

Yes. And actually there's a backstage issue here — our recommendation engine is supposed to suggest "start with a board" but it only triggers after 30 seconds of inactivity, which is too late for some people who've already clicked into something confusing.

### Claude:

That's great backstage context. I'll capture the system, its timing issue, and the gap between designed intent and actual behavior.

After they successfully create their first board — what's the next milestone?

### User:

The next big thing is inviting their team. That's when the tool becomes actually useful. But there's friction there too — they need to figure out permissions, decide who gets what role, and send invites. About 40% of people who create a board never invite anyone in the first week.

### Claude:

That's a major drop-off. Let me make "Team Invitation" its own milestone since it's a distinct goal. I'm noticing we keep tracking:
- **Channels** (where things happen)
- **Emotions** (confusion, overwhelm)  
- **Failure modes** (what goes wrong)
- **Backstage systems** (what's supporting or failing behind the scenes)
- **Metrics** (your analytics numbers)

Want me to keep suggesting from those categories and stop offering others unless you bring them up?

### User:

Yeah that's the right set for this journey. Let's keep going with team invitation.

### Claude:

Noted — I'll focus on those five categories. Here's the Team Invitation milestone...

---

*[Conversation continues through Team Invitation and First Project milestones, building out ~12 steps total across 4 milestones]*
