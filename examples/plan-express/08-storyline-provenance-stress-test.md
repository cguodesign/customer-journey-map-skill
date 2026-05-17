# Storyline: Provenance Stress Test

> Audience: Design team all-hands
> Goal: Test whether heavy footnote density breaks narrative pacing
> Source journey: Patient referral (healthcare) — 8 steps, most fields have provenance

---

## The Storyline

Dr. Patel wraps up the appointment at 4:47pm — thirteen minutes over schedule, the next patient already waiting. She turns to Amira and says what she's said four times today: "I'm going to refer you to cardiology."[^1]

Amira nods. She's still thinking about the blood pressure numbers Dr. Patel showed her two minutes ago — 158 over 94, written on a yellow sticky note she's now clutching.[^2] The word "cardiology" registers as background noise. She wants to ask what it means, practically, for her life. But the doctor is already standing up.

She drives home. Makes dinner. Tells her husband she needs to see "a heart doctor." He asks when. She doesn't know.[^3]

Three days pass. Then four. Amira checks her phone each morning — nothing from the clinic, no text, no email, no portal notification.[^4] On day five she calls the GP's office. The receptionist says "let me check" and puts her on hold for nine minutes.[^5] The referral was sent, she's told. It's "in the system."[^6] Which system? Whose system? The receptionist doesn't say.

Behind the scenes — invisible to Amira, invisible even to Dr. Patel — her referral has traveled from the Practice Management System to the Regional Health Information Exchange, where it sat in a queue for 72 hours because the HIE batch-processes non-urgent referrals twice weekly.[^7] It then landed in St. Mary's Cardiology booking system on day four, where it joined 340 other pending referrals.[^8]

On day eight, a scheduling coordinator named James opens Amira's referral. Her phone number transferred correctly. Her insurance did not — the HIE truncated the field at 15 characters, cutting off the group number.[^9] James puts the referral in a "needs manual review" pile. He has forty-three of those today.

Day twelve. James calls Amira at 2:15pm. She's in a meeting and can't answer.[^10] He leaves a voicemail: "This is St. Mary's Cardiology calling about your referral. Please call us back at..." She listens to it at 5:30pm, calls back, gets the after-hours message. She will try again tomorrow.

Day thirteen. She calls at 9:03am. Hold music: seven minutes.[^11] James pulls up her file, asks for the insurance group number, and offers three dates — all at least four weeks out. The earliest available is November 14th.[^12] Six weeks from the day Dr. Patel said "cardiology." Amira takes it. She doesn't know if six weeks matters for 158/94. She doesn't know who to ask.

She marks it on her calendar and tries not to think about it. She will think about it seventeen times before November 14th.[^13]

---

## Footnotes

[^1]: Referral mention typically happens in final 2 minutes of appointment (source: GP-workflow-observation-2026-09, n=12 observed appointments).

[^2]: Patients retain diagnosis information but not logistics from same appointment (source: patient-interviews-2026-09, 8 of 11 participants).

[^3]: Patients cannot articulate referral timeline expectations (source: patient-interviews-2026-09, participant 3, 7, 9).

[^4]: No patient-facing communication exists between referral send and specialist contact (source: system-audit-2026-08).

[^5]: Mean hold time for GP reception: 7.2 minutes (source: telephony-analytics-2026-Q3).

[^6]: Reception staff cannot see referral status beyond "sent" (source: staff-interviews-2026-09, Practice Manager confirmed).

[^7]: HIE batch-processes non-urgent referrals on Tuesdays and Fridays only (source: HIE-technical-spec-v4.2, section 3.1.4).

[^8]: St. Mary's Cardiology pending queue: 280-400 referrals at any time (source: specialist-booking-dashboard-2026-09).

[^9]: Insurance field truncation: HIE field limit is 15 characters; 23% of referrals arrive with incomplete insurance data (source: St-Marys-data-quality-report-2026-Q2).

[^10]: 38% of first-contact calls from specialists go unanswered (source: specialist-telephony-analytics-2026-Q3).

[^11]: Mean hold time for St. Mary's scheduling: 6.8 minutes (source: specialist-telephony-analytics-2026-Q3).

[^12]: Median wait-to-appointment for non-urgent cardiology: 5.2 weeks (source: NHS-referral-benchmarks-2026).

[^13]: Patients report thinking about pending specialist appointments "several times per week" with associated anxiety (source: patient-interviews-2026-09, 9 of 11 participants).

---

## Assessment: Does footnote density break narrative pacing?

**Footnote count**: 13 footnotes across ~600 words of narrative (~1 per 46 words).

**Verdict**: **Narrative holds.** The story reads cleanly without footnotes — they're numbered references at the bottom, not inline interruptions. A reader who wants the pure story ignores them. A reader who wants evidence checks them.

**Key factors that make it work:**
1. Footnotes are **end-of-sentence only** — never mid-clause.
2. The narrative doesn't *depend* on footnote content to make sense.
3. Numbers are unobtrusive (superscript in rendered markdown).
4. Footnotes are grouped at the end, not interleaved with text.

**When it would break:**
- If footnotes appeared mid-sentence: "She drove home[^1] and made dinner[^2]" — too choppy.
- If every sentence had one — but natural narrative rhythm means some sentences are connective tissue, not claims.
- If footnote content leaked into the narrative: "She called (hold time averaged 7.2 minutes per telephony analytics)."

**Recommendation for format.md**: Codify these rules:
1. Footnote markers appear at end of sentence only.
2. Maximum density: ~1 per 40 words (roughly 1 per 2-3 sentences).
3. If provenance density would exceed this, batch multiple sources into a single footnote.
4. Narrative must read coherently with all footnotes removed.
