# Demo 03 — New domain: a patient's first specialist visit

**Shows:** the skill works far outside software/payments, and that organic field
emergence surfaces domain-specific dimensions (backstage staff, wait times, anxiety,
hand-offs between people).
**Time:** ~4 min · **New session.** Produces `./.journey/specialist-visit.md`.

---

### Turn 1
```
Let's map a customer journey — but it's healthcare, not software. A patient who's been referred to a specialist for the first time, from getting the referral to leaving the first appointment. Start simple: the steps and how the patient feels.
```
**Watch for:** it adapts to the domain (no software assumptions); persona is a patient.

### Turn 2 (introduce backstage actors → expect service-layer fields to emerge)
```
Behind the scenes there's a lot the patient never sees: the referral has to be faxed and approved by insurance, a scheduling coordinator plays phone tag to book them, and records get requested from the original doctor. The patient just waits, not knowing any of this is happening.
```
**Watch for:** emergence of `backstage` / `systems` / `lineOfVisibility` — the invisible
work captured as its own layer.

### Turn 3 (introduce a wait + emotion → expect temporal + failure fields)
```
The worst part is the wait between referral and appointment — often 3 to 6 weeks. People get anxious, some give up and never book, and a lot show up having forgotten why they were referred.
```
**Watch for:** the wait persisted as `duration`/`waitTime`, plus `painPoint`/`failureMode`
on that step — same persistence behavior as the payments demo, different domain.

### Turn 4 (optional — a cited number → expect a `source:` marker)
```
Our clinic's own data shows about 1 in 5 referrals never result in a booked appointment.
```
**Watch for:** a `dropoffRate`-style field marked `_provenance: source: …` because you
cited it as clinic data (vs. the earlier "some give up", which stays unmarked).

---

✅ **Pass looks like:** a coherent non-software journey, service-layer fields emerging only
once you mention backstage work, and provenance correctly distinguishing your cited clinic
number from casual description. Express it with Demo 02's prompts if you want the full set.
