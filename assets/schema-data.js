window.JOURNEY_SCHEMA={
  "categories": [
    {
      "letter": "A",
      "name": "Emotional / Cognitive"
    },
    {
      "letter": "B",
      "name": "Physical / Spatial / Channel"
    },
    {
      "letter": "C",
      "name": "Temporal"
    },
    {
      "letter": "D",
      "name": "People / Actors"
    },
    {
      "letter": "E",
      "name": "Actions / Behaviors"
    },
    {
      "letter": "F",
      "name": "Systems / Technology"
    },
    {
      "letter": "G",
      "name": "Service Design Layers"
    },
    {
      "letter": "H",
      "name": "Business / Metrics"
    },
    {
      "letter": "I",
      "name": "Design / Opportunities"
    },
    {
      "letter": "J",
      "name": "Failure / Risk"
    },
    {
      "letter": "K",
      "name": "Path / Flow"
    },
    {
      "letter": "L",
      "name": "Communication / Content"
    },
    {
      "letter": "M",
      "name": "Accessibility / Inclusion"
    }
  ],
  "fields": [
    {
      "name": "emotion",
      "category": "A",
      "description": "Named emotion (frustrated, delighted, anxious...)",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "Spark of interest, cautious optimism"
        },
        {
          "step": "read-and-assess-fit",
          "value": "Mix of excitement and self-doubt"
        }
      ]
    },
    {
      "name": "emotionValence",
      "category": "A",
      "description": "Positive/negative/neutral (-2 to +2)",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "1"
        },
        {
          "step": "read-and-assess-fit",
          "value": "0"
        }
      ]
    },
    {
      "name": "emotionIntensity",
      "category": "A",
      "description": "Strength of feeling (low/medium/high)",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "low"
        },
        {
          "step": "read-and-assess-fit",
          "value": "medium"
        }
      ]
    },
    {
      "name": "thinking",
      "category": "A",
      "description": "Internal monologue / self-talk",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "\"This could actually be a good fit — let me see what they want\""
        },
        {
          "step": "read-and-assess-fit",
          "value": "\"I hit most of these, but not all — is it worth my time?\""
        }
      ]
    },
    {
      "name": "cognitiveLoad",
      "category": "A",
      "description": "Processing demand (high/medium/low)",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "medium"
        },
        {
          "step": "fill-application-form",
          "value": "high"
        }
      ]
    },
    {
      "name": "motivation",
      "category": "A",
      "description": "What drives forward at this step",
      "examples": []
    },
    {
      "name": "anxiety",
      "category": "A",
      "description": "Specific fears or doubts",
      "examples": []
    },
    {
      "name": "expectation",
      "category": "A",
      "description": "What person expects will happen next",
      "examples": []
    },
    {
      "name": "trust",
      "category": "A",
      "description": "Level of trust in provider",
      "examples": []
    },
    {
      "name": "effort",
      "category": "A",
      "description": "Perceived effort required",
      "examples": [
        {
          "step": "create-account",
          "value": "Yet another login and password to manage"
        },
        {
          "step": "check-status-or-follow-up",
          "value": "High emotional cost for near-zero information gain"
        }
      ]
    },
    {
      "name": "confidence",
      "category": "A",
      "description": "Self-assessed confidence of doing the right thing",
      "examples": []
    },
    {
      "name": "informationNeed",
      "category": "A",
      "description": "What information needed to proceed",
      "examples": []
    },
    {
      "name": "channel",
      "category": "B",
      "description": "Interaction channel (web, mobile, phone, in-store...)",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "LinkedIn / job board / careers page"
        },
        {
          "step": "click-apply",
          "value": "Careers portal (ATS-hosted)"
        }
      ]
    },
    {
      "name": "touchpoint",
      "category": "B",
      "description": "Specific branded interaction point",
      "examples": [
        {
          "step": "click-apply",
          "value": "\"Apply\" button, landing her on the portal"
        }
      ]
    },
    {
      "name": "device",
      "category": "B",
      "description": "Physical device used",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "Phone, in a gap between other things"
        }
      ]
    },
    {
      "name": "place",
      "category": "B",
      "description": "Physical location",
      "examples": []
    },
    {
      "name": "environment",
      "category": "B",
      "description": "Environmental context (noisy, private, on-the-go...)",
      "examples": []
    },
    {
      "name": "physicalEvidence",
      "category": "B",
      "description": "Tangible artifacts encountered (receipt, signage...)",
      "examples": []
    },
    {
      "name": "channelTransition",
      "category": "B",
      "description": "Cross-channel handoff description",
      "examples": [
        {
          "step": "click-apply",
          "value": "Employer-branded careers page hands off to a third-party ATS portal with different branding and different UX conventions"
        }
      ]
    },
    {
      "name": "duration",
      "category": "C",
      "description": "How long this step takes",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "~30 sec skim"
        },
        {
          "step": "read-and-assess-fit",
          "value": "~5-10 min"
        }
      ]
    },
    {
      "name": "waitTime",
      "category": "C",
      "description": "Idle/waiting time (not value-adding)",
      "examples": [
        {
          "step": "wait-in-silence",
          "value": "Days to several weeks, often indefinite"
        },
        {
          "step": "hear-back",
          "value": "Weeks; for many applicants the branch never resolves at all"
        }
      ]
    },
    {
      "name": "frequency",
      "category": "C",
      "description": "How often this occurs (once, daily, per-transaction)",
      "examples": [
        {
          "step": "check-status-or-follow-up",
          "value": "Every few days at first, tapering off as hope fades"
        }
      ]
    },
    {
      "name": "trigger",
      "category": "C",
      "description": "What initiates this step",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "Active search, alert email, or a link shared by a contact"
        }
      ]
    },
    {
      "name": "deadline",
      "category": "C",
      "description": "Time pressure associated",
      "examples": []
    },
    {
      "name": "pacing",
      "category": "C",
      "description": "Perceived speed (rushed, leisurely, stalled)",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "normal"
        },
        {
          "step": "fill-application-form",
          "value": "stalled"
        }
      ]
    },
    {
      "name": "coActors",
      "category": "D",
      "description": "Other people present/involved",
      "examples": []
    },
    {
      "name": "frontlineStaff",
      "category": "D",
      "description": "Customer-facing employee(s)",
      "examples": []
    },
    {
      "name": "backstageStaff",
      "category": "D",
      "description": "Non-visible supporting staff",
      "examples": [
        {
          "step": "wait-in-silence",
          "value": "Recruiter screens or filters; many applications never get human eyes"
        }
      ]
    },
    {
      "name": "responsibleTeam",
      "category": "D",
      "description": "Internal team/department responsible",
      "examples": []
    },
    {
      "name": "thirdParty",
      "category": "D",
      "description": "External partners or vendors",
      "examples": []
    },
    {
      "name": "handoff",
      "category": "D",
      "description": "Person-to-person or team-to-team handoff",
      "examples": [
        {
          "step": "wait-in-silence",
          "value": "Recruiter → Hiring Manager for shortlist review — the transfer where the queue actually stalls"
        }
      ]
    },
    {
      "name": "doing",
      "category": "E",
      "description": "What person is physically doing (verb-based)",
      "examples": [
        {
          "step": "fill-application-form",
          "value": "Re-entering work history field by field after uploading a resume"
        },
        {
          "step": "submit-application",
          "value": "Hits Submit"
        }
      ]
    },
    {
      "name": "frontstageAction",
      "category": "E",
      "description": "Visible employee action",
      "examples": []
    },
    {
      "name": "backstageAction",
      "category": "E",
      "description": "Invisible employee action",
      "examples": [
        {
          "step": "click-apply",
          "value": "Creates a candidate session and applies the employer's account-gate policy"
        },
        {
          "step": "submit-application",
          "value": "Records the submission, fires the automated confirmation email, and enqueues the application for the AI screen"
        }
      ]
    },
    {
      "name": "supportProcess",
      "category": "E",
      "description": "Internal process supporting this step",
      "examples": []
    },
    {
      "name": "inputRequired",
      "category": "E",
      "description": "Information/material person must provide",
      "examples": [
        {
          "step": "fill-application-form",
          "value": "Full work history, education, work-authorization answers, EEO/demographic questions"
        }
      ]
    },
    {
      "name": "outputProduced",
      "category": "E",
      "description": "What is produced/delivered",
      "examples": []
    },
    {
      "name": "workaround",
      "category": "E",
      "description": "Unofficial user-invented alternative",
      "examples": [
        {
          "step": "check-status-or-follow-up",
          "value": "Emails a recruiter or messages an employee on LinkedIn to get a signal"
        }
      ]
    },
    {
      "name": "decision",
      "category": "E",
      "description": "Choice the person must make",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "Apply now, bookmark for later, or pass"
        }
      ]
    },
    {
      "name": "systems",
      "category": "F",
      "description": "Backend systems involved (CRM, database...)",
      "examples": [
        {
          "step": "click-apply",
          "value": [
            "ATS"
          ]
        },
        {
          "step": "create-account",
          "value": [
            "ATS",
            "Email service"
          ]
        }
      ]
    },
    {
      "name": "tools",
      "category": "F",
      "description": "Tools used by staff or customer",
      "examples": []
    },
    {
      "name": "technology",
      "category": "F",
      "description": "Specific technology enabling this step",
      "examples": []
    },
    {
      "name": "dataFlow",
      "category": "F",
      "description": "What data moves where",
      "examples": [
        {
          "step": "fill-application-form",
          "value": "Resume PDF into the parser, parser output into pre-filled form fields, form contents into the candidate record; parse errors propagate into the record Maya never gets to see"
        },
        {
          "step": "ai-resume-screen",
          "value": "Parsed resume fields and role criteria feed a match score, which decides the routing written back to the candidate record"
        }
      ]
    },
    {
      "name": "automation",
      "category": "F",
      "description": "What is automated vs. manual",
      "examples": [
        {
          "step": "click-apply",
          "value": "Fully automated; no human involved"
        },
        {
          "step": "fill-application-form",
          "value": "Parsing is automated; correcting what it got wrong is entirely manual"
        }
      ]
    },
    {
      "name": "dependencies",
      "category": "F",
      "description": "Technical dependencies that must be met",
      "examples": []
    },
    {
      "name": "notification",
      "category": "F",
      "description": "System notifications triggered",
      "examples": [
        {
          "step": "receive-confirmation",
          "value": "Automated \"application received\" acknowledgment"
        },
        {
          "step": "outcome-fast-rejection",
          "value": "Automated rejection, often without saying an AI made the call"
        }
      ]
    },
    {
      "name": "policy",
      "category": "F",
      "description": "Business rules governing this step",
      "examples": [
        {
          "step": "create-account",
          "value": "Employer's ATS configuration requires an account before the form is shown"
        },
        {
          "step": "ai-resume-screen",
          "value": "An employer-configured match threshold decides who a human ever sees"
        }
      ]
    },
    {
      "name": "frontstage",
      "category": "G",
      "description": "Everything visible to customer (composite)",
      "examples": []
    },
    {
      "name": "backstage",
      "category": "G",
      "description": "Everything invisible but directly supporting (composite)",
      "examples": [
        {
          "step": "click-apply",
          "value": "The ATS opens a candidate session at the redirect and applies the employer's configured account-gate policy"
        },
        {
          "step": "submit-application",
          "value": "One Submit fans out into three automated processes — the ATS writes the candidate record, the mail service sends a templated acknowledgment, and the application enters the AI screening queue"
        }
      ]
    },
    {
      "name": "supportProcesses",
      "category": "G",
      "description": "Organizational processes enabling backstage",
      "examples": []
    },
    {
      "name": "lineOfVisibility",
      "category": "G",
      "description": "What is/isn't visible to customer at this step",
      "examples": [
        {
          "step": "click-apply",
          "value": "Maya sees a redirect; the session creation and the account-gate decision behind it are invisible"
        },
        {
          "step": "submit-application",
          "value": "Everything past Submit is invisible — record creation, mail send, screening queue"
        }
      ]
    },
    {
      "name": "valueExchange",
      "category": "G",
      "description": "What value is exchanged (money, data, time, attention)",
      "examples": [
        {
          "step": "submit-application",
          "value": "Maya gives 40 minutes of unpaid labour and a complete personal data record; she gets a confirmation screen"
        }
      ]
    },
    {
      "name": "serviceRecovery",
      "category": "G",
      "description": "Recovery action if failure occurs",
      "examples": []
    },
    {
      "name": "orchestration",
      "category": "G",
      "description": "How multiple channels/actors are coordinated",
      "examples": [
        {
          "step": "wait-in-silence",
          "value": "None — nothing connects internal ATS status to candidate communication"
        }
      ]
    },
    {
      "name": "kpi",
      "category": "H",
      "description": "Key performance indicator at this step",
      "examples": []
    },
    {
      "name": "metric",
      "category": "H",
      "description": "Specific quantitative measurement",
      "examples": []
    },
    {
      "name": "conversionRate",
      "category": "H",
      "description": "Drop-off or conversion at this step",
      "examples": []
    },
    {
      "name": "cost",
      "category": "H",
      "description": "Cost to serve at this step",
      "examples": []
    },
    {
      "name": "revenueImpact",
      "category": "H",
      "description": "Revenue generated or at risk",
      "examples": []
    },
    {
      "name": "dropoffRate",
      "category": "H",
      "description": "Percentage who abandon",
      "examples": []
    },
    {
      "name": "volumePerPeriod",
      "category": "H",
      "description": "Transaction volume",
      "examples": []
    },
    {
      "name": "owner",
      "category": "H",
      "description": "Business owner of this step",
      "examples": []
    },
    {
      "name": "painPoint",
      "category": "I",
      "description": "Specific friction or problem",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "Vague or inflated requirements make it hard to judge fit"
        },
        {
          "step": "click-apply",
          "value": "Redirected to a clunky third-party portal that breaks the flow"
        }
      ]
    },
    {
      "name": "opportunity",
      "category": "I",
      "description": "Design or business opportunity",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "Mark which requirements are actually firm and which are wish-list"
        },
        {
          "step": "create-account",
          "value": "Let people apply first and create the account at submit — or offer a guest apply"
        }
      ]
    },
    {
      "name": "momentOfTruth",
      "category": "I",
      "description": "Critical make-or-break moment",
      "examples": [
        {
          "step": "fill-application-form",
          "value": "Whether the form respects her time or wastes it"
        },
        {
          "step": "submit-application",
          "value": "The instant after Submit — did it go through, and what now?"
        }
      ]
    },
    {
      "name": "insight",
      "category": "I",
      "description": "Research insight relevant to this step",
      "examples": []
    },
    {
      "name": "desiredOutcome",
      "category": "I",
      "description": "JTBD desired outcome statement",
      "examples": []
    },
    {
      "name": "recommendation",
      "category": "I",
      "description": "Specific recommended action",
      "examples": []
    },
    {
      "name": "priority",
      "category": "I",
      "description": "Priority rating (must-fix, should-fix, nice-to-have)",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "should-fix"
        },
        {
          "step": "create-account",
          "value": "must-fix"
        }
      ]
    },
    {
      "name": "failureMode",
      "category": "J",
      "description": "What can go wrong",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "Talks self out of applying (\"I only meet 7 of 10 bullets\")"
        },
        {
          "step": "create-account",
          "value": "Abandons here rather than make an account"
        }
      ]
    },
    {
      "name": "failureProbability",
      "category": "J",
      "description": "Likelihood of failure",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "high"
        },
        {
          "step": "create-account",
          "value": "high"
        }
      ]
    },
    {
      "name": "failureImpact",
      "category": "J",
      "description": "Severity if failure occurs",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "medium"
        },
        {
          "step": "create-account",
          "value": "high"
        }
      ]
    },
    {
      "name": "recoveryPath",
      "category": "J",
      "description": "What happens after failure",
      "examples": [
        {
          "step": "fill-application-form",
          "value": "Start over, often from scratch"
        }
      ]
    },
    {
      "name": "escalation",
      "category": "J",
      "description": "Escalation path",
      "examples": []
    },
    {
      "name": "fallback",
      "category": "J",
      "description": "System fallback if primary fails",
      "examples": []
    },
    {
      "name": "bottleneck",
      "category": "J",
      "description": "Capacity constraint",
      "examples": [
        {
          "step": "wait-in-silence",
          "value": "Hiring Manager review capacity; a shortlist can sit for weeks behind higher-priority work"
        }
      ]
    },
    {
      "name": "risk",
      "category": "J",
      "description": "Named risk",
      "examples": [
        {
          "step": "ai-resume-screen",
          "value": "Criteria proxies (school, keywords, employment gaps) encode bias at scale, invisibly and unappealably"
        }
      ]
    },
    {
      "name": "next",
      "category": "K",
      "description": "What follows this step",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "→ read-and-assess-fit"
        },
        {
          "step": "read-and-assess-fit",
          "value": "→ click-apply"
        }
      ]
    },
    {
      "name": "previous",
      "category": "K",
      "description": "What preceded this step",
      "examples": []
    },
    {
      "name": "branchCondition",
      "category": "K",
      "description": "What determines which path is taken",
      "examples": [
        {
          "step": "ai-resume-screen",
          "value": "AI match vs. no match"
        },
        {
          "step": "hear-back",
          "value": "Rejection vs. advance to interview vs. permanent silence (ghosting)"
        }
      ]
    },
    {
      "name": "parallelPath",
      "category": "K",
      "description": "Steps happening simultaneously",
      "examples": [
        {
          "step": "submit-application",
          "value": "→ receive-confirmation, → ai-resume-screen (both kick off from the same Submit)"
        }
      ]
    },
    {
      "name": "entryPoint",
      "category": "K",
      "description": "Can users enter journey here (bool)",
      "examples": [
        {
          "step": "see-the-posting",
          "value": "true"
        }
      ]
    },
    {
      "name": "exitPoint",
      "category": "K",
      "description": "Can users leave journey here (bool)",
      "examples": [
        {
          "step": "create-account",
          "value": "true"
        },
        {
          "step": "outcome-fast-rejection",
          "value": "true"
        }
      ]
    },
    {
      "name": "optionality",
      "category": "K",
      "description": "Is this step required or optional",
      "examples": []
    },
    {
      "name": "message",
      "category": "L",
      "description": "What is communicated to customer",
      "examples": [
        {
          "step": "receive-confirmation",
          "value": "\"We've received your application\" — no timeline, no next step, no name"
        },
        {
          "step": "outcome-fast-rejection",
          "value": "\"We've decided to move forward with other candidates\""
        }
      ]
    },
    {
      "name": "tone",
      "category": "L",
      "description": "Tone of communication",
      "examples": [
        {
          "step": "receive-confirmation",
          "value": "Templated, impersonal"
        },
        {
          "step": "outcome-fast-rejection",
          "value": "Templated, final, no route to reply"
        }
      ]
    },
    {
      "name": "contentType",
      "category": "L",
      "description": "Type of content (help article, video, tooltip...)",
      "examples": []
    },
    {
      "name": "cta",
      "category": "L",
      "description": "Call-to-action presented",
      "examples": []
    },
    {
      "name": "accessibilityBarrier",
      "category": "M",
      "description": "Barriers for people with disabilities",
      "examples": [
        {
          "step": "create-account",
          "value": "Password rules, CAPTCHA, and an email round-trip stack up as a hard stop before any content is reached"
        },
        {
          "step": "fill-application-form",
          "value": "Timed session expiry punishes anyone who needs longer — assistive-tech users, people on slow connections, people filling this in between shifts"
        }
      ]
    },
    {
      "name": "inclusionConsideration",
      "category": "M",
      "description": "Who might be excluded",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "Candidates without that insider context read every bullet as a hard requirement and self-eliminate before the funnel even starts"
        },
        {
          "step": "ai-resume-screen",
          "value": "Non-linear careers, career breaks, and non-standard resume formats score worst — the people the format serves least are filtered out first"
        }
      ]
    },
    {
      "name": "literacyRequirement",
      "category": "M",
      "description": "Reading/digital literacy needed",
      "examples": [
        {
          "step": "read-and-assess-fit",
          "value": "Job descriptions are written in internal jargon and inflated requirement lists; reading them accurately is insider knowledge"
        }
      ]
    },
    {
      "name": "economicBarrier",
      "category": "M",
      "description": "Cost or resource barriers",
      "examples": []
    },
    {
      "name": "culturalConsideration",
      "category": "M",
      "description": "Cultural norms that affect this step",
      "examples": []
    }
  ]
};