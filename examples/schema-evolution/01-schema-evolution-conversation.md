# Golden Example: Schema Evolution

## Scenario

A service designer at a healthcare company wants to map the patient referral journey. She starts with just a rough idea — no pre-selection of fields. This example shows how the skill organically proposes fields, clusters them into categories, and eventually the user codifies their selection.

---

## Conversation transcript (simulated)

### User:

I want to map the patient referral journey — when a GP refers a patient to a specialist.

### Claude (Plan mode):

Got it. Let's build this out.

- **Journey**: Patient referral (GP to specialist)
- **Persona**: Who's the primary actor — the patient, the GP, or both?

### User:

The patient is primary. But the GP and the specialist's office are both heavily involved.

### Claude:

Setting up personas:
- **Patient** (primary) 
- **GP** (secondary)
- **Specialist Office** (secondary)

What's the first thing that happens?

### User:

The GP tells the patient during the appointment that they need to see a specialist. It's usually a quick mention at the end — "I'm going to refer you to a cardiologist" — and the patient often doesn't fully process it because the appointment is ending.

### Claude:

Good starting point. I notice you're describing an emotional/cognitive state — the patient not fully processing. Want me to capture that as `cognitiveLoad` or `thinking` on this step?

### User:

Yeah, let's capture what the patient is thinking. They're usually focused on what the GP just told them about their condition, not on the logistics of the referral.

### Claude:

Here's the first step:

**Milestone: Referral Initiation**

**Step: gp-mentions-referral**
- persona: [Patient, GP]
- description: GP mentions at end of appointment that patient needs specialist referral
- thinking: "Still processing what GP said about my condition — referral is background noise"

What happens after the appointment ends?

### User:

The patient goes home and... usually nothing for a while. The GP's office is supposed to send the referral to the specialist, but the patient doesn't know what's happening behind the scenes. There's this gap of 2-5 days where the patient has no information.

### Claude:

That's a waiting state with no visibility. I'm hearing two things:

1. A **backstage process** (GP office sends referral) that's invisible to the patient
2. A **wait time** with no communication

Want me to capture the backstage system and the temporal dimension here?

### User:

Yes both. And actually the backstage is interesting — the referral goes through the Practice Management System, then to the Health Information Exchange, then lands at the specialist's booking system. It's like 3 systems with no patient visibility.

### Claude:

Great backstage detail. Here's what I have:

**Step: invisible-referral-processing**
- persona: [Patient]
- description: Patient waits at home with no information while referral moves through systems
- thinking: "Did the doctor actually send it? Should I call?"
- waitTime: 2-5 days typical
- anxiety: Growing uncertainty about whether referral was sent
- backstage:
  - system: Practice Management System → Health Information Exchange → Specialist Booking System
  - action: Referral data transferred across 3 systems
  - failureMode: Data loss at HIE handoff; duplicate referrals; wrong specialist matched
- lineOfVisibility: Patient sees nothing — no confirmation, no tracking, no timeline

I notice I'm pulling from a few categories here:
- **Emotional/Cognitive** (thinking, anxiety)
- **Temporal** (waitTime)
- **Service Design Layers** (backstage, lineOfVisibility)
- **Systems/Technology** (the three systems)

These seem important for a healthcare referral journey. Want me to keep surfacing fields from these, and also from **Failure/Risk** since you mentioned failure modes?

### User:

Yes exactly. Failure modes are critical in healthcare — a lost referral can mean weeks of delay for a patient with a serious condition. Keep all of those active.

### Claude:

Noted. Activating: **Emotional/Cognitive**, **Temporal**, **Service Design Layers**, **Systems/Technology**, **Failure/Risk**.

I'll suggest from these categories as we build out steps. What happens after the wait?

### User:

Eventually the specialist's office calls the patient to schedule. But "eventually" can be anywhere from 3 days to 3 weeks depending on the specialist's backlog. And sometimes they never call — the referral got lost in the system.

### Claude:

**Step: specialist-office-calls**
- persona: [Patient, Specialist Office]
- description: Specialist office calls patient to schedule appointment
- waitTime: 3 days to 3 weeks (variable by specialist backlog)
- anxiety: Grows with each passing day — "maybe they lost it"
- backstage:
  - system: Specialist Booking System
  - action: Staff reviews incoming referrals, calls patients in queue order
  - failureMode: Referral stuck in queue; patient record incomplete (missing phone number from HIE transfer); staff doesn't call because referral data is illegible
- failureMode: Patient never receives call
  - failureProbability: medium (estimated 10-15% of referrals have some processing failure)
  - failureImpact: high (weeks of additional delay for potentially serious condition)
- recoveryPath: → patient-calls-gp-to-follow-up
- serviceRecovery: None designed — system has no timeout/escalation for unprocessed referrals

The service recovery gap here is alarming — no timeout, no escalation. Want me to flag that as an opportunity?

### User:

Absolutely. That's one of the main reasons we're mapping this journey — to find these invisible failure points.

### Claude:

Adding:
- opportunity: "Automated referral tracking with patient-visible status + escalation at 5-day timeout"
  - priority: must-fix

### User:

Also — I just realized there's a compliance angle here. Referrals have to be processed within certain timeframes depending on the urgency category. A routine referral has 30 days, urgent has 48 hours. Our systems don't enforce these.

### Claude:

That's important. There's no pre-defined field for compliance timelines in the standard categories, but this is clearly a healthcare-specific concept. Want me to create a custom field for this?

I'd suggest: `vertical_complianceDeadline` — the regulatory timeframe for processing this type of referral.

### User:

Perfect. And let's also add `vertical_urgencyCategory` — routine, urgent, or emergency.

### Claude:

Adding two custom fields:
- `vertical_complianceDeadline`: Regulatory processing timeframe (e.g., "48 hours" for urgent, "30 days" for routine)
- `vertical_urgencyCategory`: Clinical urgency classification (routine / urgent / emergency)

I'll register these in the preamble. They'll be available on any step going forward.

Updated preamble:
```yaml
active-categories: [emotional, temporal, service-layers, systems, failure]
custom-fields:
  - vertical_complianceDeadline: "Regulatory max processing time by urgency category"
  - vertical_urgencyCategory: "Clinical urgency classification (routine/urgent/emergency)"
```

---

*[Conversation continues, building out 10 more steps across 4 milestones: Referral Initiation, Invisible Processing, Scheduling, and Specialist Visit]*

---

## Summary: How schema evolved organically

| Session point | What happened | Schema change |
|---------------|---------------|---------------|
| Step 1 | User described patient "not processing" | `thinking` field introduced |
| Step 2 | User described waiting with no visibility | `waitTime`, `backstage`, `lineOfVisibility` introduced |
| Step 2 | Multiple categories surfacing naturally | **Meta-pause**: Claude proposes 5 categories |
| Step 2 | User confirms + adds Failure/Risk | Categories codified in preamble |
| Step 3 | User describes variable wait times | `failureProbability`, `failureImpact` introduced |
| Step 3 | No service recovery exists | `serviceRecovery` introduced + opportunity flagged |
| Step 4 | Healthcare compliance need surfaces | **Custom fields** created: `vertical_complianceDeadline`, `vertical_urgencyCategory` |

### Key observations

1. **No upfront selection was needed.** The user didn't know they'd need `lineOfVisibility` or `serviceRecovery` until the conversation surfaced invisible backstage processes.

2. **Meta-pause happened naturally** after the second step, when multiple categories were clearly active. Timing felt right — earlier would have been premature.

3. **Custom fields emerged from domain specifics.** The pre-defined vocabulary doesn't cover healthcare compliance timelines — that's exactly what the `vertical_*` namespace is for.

4. **The user never felt burdened.** Each field was proposed in context ("I notice you're describing X — want to capture that as Y?"), not presented as a checklist.
