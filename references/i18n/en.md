# Language pack — English (`en`)

One row per schema field, in schema order. Read this pack when the conversation is in
English and you need to map the user's words to a field, or to label fields in a rendering.

- **Field** is the key written in the journey file. Keys are always these schema names,
  in every language; never write a label or a synonym as a key.
- **Label** is the display name: column headers, legends and field names in renderings
  and written expressions.
- **Also called** lists words people use for the same concept. When the user's word is
  here, use that row's field. When it fits two rows, ask which one they mean.
- Field values (what the user said) are not translated unless the user asks.
- A custom field has no row. Label it from its registered description.
- `journey.sh validate` reads these packs: a key that matches a label or synonym is
  rejected with the field to use instead.

| Field | Label | Also called |
|---|---|---|
| `journey` | Journey | journey name, journey title |
| `created` | Created | creation date |
| `last-modified` | Last modified | modified date, updated |
| `personas` | Personas | cast, actors |
| `id` | ID | identifier, slug |
| `title` | Title | name, heading |
| `description` | Description | summary |
| `persona` | Persona | actor, who |
| `milestone` | Milestone | stage, phase |
| `emotion` | Emotion | feeling, mood |
| `emotionValence` | Emotion score | valence, sentiment score, emotional rating |
| `emotionIntensity` | Emotion intensity | intensity, strength of feeling |
| `thinking` | Thinking | thoughts, inner monologue, self-talk, mental model |
| `cognitiveLoad` | Cognitive load | mental load, mental effort, complexity |
| `motivation` | Motivation | goal, drive, why |
| `anxiety` | Anxiety | worry, fear, doubt, concern |
| `expectation` | Expectation | expected outcome, assumption |
| `trust` | Trust | credibility, trust in provider |
| `effort` | Effort | perceived effort, hassle, work required |
| `confidence` | Confidence | self-confidence, certainty |
| `informationNeed` | Information need | knowledge gap, question, info needed |
| `channel` | Channel | medium |
| `touchpoint` | Touchpoint | interaction point, screen, page |
| `device` | Device | hardware |
| `place` | Place | location, where |
| `environment` | Environment | setting, context, surroundings |
| `physicalEvidence` | Physical evidence | artifact, props, receipt, signage |
| `channelTransition` | Channel switch | channel handoff, cross-channel, channel change |
| `duration` | Duration | time taken, how long |
| `waitTime` | Wait time | waiting, waiting time, queue time, idle time, hold time |
| `frequency` | Frequency | how often, recurrence |
| `trigger` | Trigger | cause, what starts it |
| `deadline` | Deadline | time pressure, due date, urgency |
| `pacing` | Pace | tempo, speed |
| `coActors` | Others involved | co-actors, companions, other people |
| `frontlineStaff` | Frontline staff | front-line staff, agent, representative, customer service |
| `backstageStaff` | Backstage staff | back-office staff, behind-the-scenes staff |
| `responsibleTeam` | Responsible team | team, department, accountable team |
| `thirdParty` | Third party | partner, vendor, supplier, external party |
| `handoff` | Handoff | hand-off, handover, transfer |
| `doing` | Doing | action, activity, what they do |
| `frontstageAction` | Frontstage action | visible employee action |
| `backstageAction` | Backstage action | invisible employee action, behind-the-scenes action |
| `supportProcess` | Support process | supporting process |
| `inputRequired` | Input required | required input, inputs, what they must provide |
| `outputProduced` | Output | output produced, deliverable, result |
| `workaround` | Workaround | hack, shortcut, unofficial path |
| `decision` | Decision | choice, decision point |
| `systems` | Systems | backend systems, platforms |
| `tools` | Tools | software used |
| `technology` | Technology | tech, tech stack |
| `dataFlow` | Data flow | data movement, data |
| `automation` | Automation | automated, automated vs manual |
| `dependencies` | Dependencies | prerequisites, depends on |
| `notification` | Notification | alert, SMS, push |
| `policy` | Policy | business rule, rules, regulation |
| `frontstage` | Frontstage | front stage, customer-facing |
| `backstage` | Backstage | back stage, behind the scenes |
| `supportProcesses` | Support processes | organizational processes |
| `lineOfVisibility` | Line of visibility | visibility line |
| `valueExchange` | Value exchange | exchange of value, what is exchanged |
| `serviceRecovery` | Service recovery | recovery plan, make-good |
| `orchestration` | Orchestration | coordination |
| `kpi` | KPI | key performance indicator |
| `metric` | Metric | measure, measurement |
| `conversionRate` | Conversion rate | conversion, progression rate |
| `cost` | Cost | cost to serve |
| `revenueImpact` | Revenue impact | revenue, revenue at risk |
| `dropoffRate` | Drop-off rate | drop-off, abandonment rate |
| `volumePerPeriod` | Volume | volume per period, transaction volume |
| `owner` | Owner | business owner |
| `painPoint` | Pain point | pain, friction, problem, issue |
| `opportunity` | Opportunity | improvement, idea, opportunity area |
| `momentOfTruth` | Moment of truth | make-or-break moment, critical moment, key moment |
| `insight` | Insight | finding, research finding, learning |
| `desiredOutcome` | Desired outcome | ideal outcome, job to be done, JTBD |
| `recommendation` | Recommendation | suggestion, next action, fix |
| `priority` | Priority | severity, importance |
| `failureMode` | Failure mode | what can go wrong, failure, error case |
| `failureProbability` | Failure likelihood | failure probability, likelihood |
| `failureImpact` | Failure impact | impact, consequence |
| `recoveryPath` | Recovery path | recovery, how they recover |
| `escalation` | Escalation | escalation path |
| `fallback` | Fallback | backup, plan B |
| `bottleneck` | Bottleneck | capacity constraint, choke point |
| `risk` | Risk | named risk, hazard |
| `next` | Next | next step, leads to |
| `previous` | Previous | previous step, comes from |
| `branchCondition` | Branch condition | condition, branch rule |
| `parallelPath` | Parallel path | in parallel, simultaneous steps |
| `entryPoint` | Entry point | entry, way in |
| `exitPoint` | Exit point | exit, way out |
| `optionality` | Optionality | optional, required or optional |
| `message` | Message | copy, what we say, communication |
| `tone` | Tone | voice, tone of voice |
| `contentType` | Content type | format, content format |
| `cta` | Call to action | CTA, button |
| `accessibilityBarrier` | Accessibility barrier | accessibility, a11y, disability barrier |
| `inclusionConsideration` | Inclusion | inclusion consideration, who is excluded |
| `literacyRequirement` | Literacy requirement | reading level, digital literacy |
| `economicBarrier` | Economic barrier | affordability, financial barrier |
| `culturalConsideration` | Cultural consideration | culture, cultural norms |
