---
journey: First-time online payments setup
created: 2026-06-01
last-modified: 2026-06-01
personas:
  - name: Maya
    role: Solo founder of a small handmade goods business, moderate tech comfort, no payments experience
    type: primary
structure: Journey > Milestone > Step
---

## Milestone: research

- title: Research & Orientation
- description: Maya realizes she needs online payments and starts figuring out how the landscape works

### Step: realize-need

- persona: [Maya]
- description: Sales are happening via DMs and manual bank transfers; Maya decides she needs a proper checkout

### Step: google-options

- persona: [Maya]
- description: Searches "how to accept payments online" and gets overwhelmed by the number of providers, jargon, and conflicting advice

### Step: ask-peers

- persona: [Maya]
- description: Asks other small business owners in a Facebook group or forum what they use; gets a mix of strong opinions (Stripe, PayPal, Square) with no clear winner

### Step: compare-providers

- persona: [Maya]
- description: Tries to compare providers on fees, features, and ease of setup; struggles to find apples-to-apples comparisons because pricing structures differ

---

## Milestone: choose-provider

- title: Choose a Payment Provider
- description: Maya commits to a provider and payment platform pairing

### Step: narrow-to-two

- persona: [Maya]
- description: Narrows choices to two providers based on peer recommendations and what integrates with her store platform

### Step: hit-fee-confusion

- persona: [Maya]
- description: Tries to understand fee structures — percentage vs flat fee, international fees, chargeback fees, payout timing — and isn't sure what she'll actually pay

### Step: make-decision

- persona: [Maya]
- description: Picks a provider based on a combination of peer trust, perceived simplicity, and fee estimates; decision feels uncertain

---

## Milestone: account-setup

- title: Account & Verification
- description: Maya creates her payment provider account and completes identity/business verification

### Step: create-account

- persona: [Maya]
- description: Signs up on the provider's site; enters email, business name, basic info

### Step: provide-business-details

- persona: [Maya]
- description: Asked for business type, address, EIN/tax ID, estimated volume — some fields she's unsure how to answer (e.g., MCC code, expected monthly volume)

### Step: identity-verification

- persona: [Maya]
- description: Uploads ID documents and waits for verification; unclear how long this will take or what happens if it fails

### Step: connect-bank-account

- persona: [Maya]
- description: Links her bank account for payouts; nervous about entering bank details into yet another platform

- duration: 3 business days (verification wait)
- waitTime: 3 business days with zero feedback
- emotion: Anxiety → suspicion → abandonment
- painPoint:
  - "No feedback during the 3-day wait — most people think it's broken"
  - "High abandonment at this step — people give up during the silence"
- failureMode: Maya assumes verification failed or the platform is broken and abandons the setup entirely
- momentOfTruth: This is where the journey lives or dies — the silent wait is the single biggest drop-off point

---

## Milestone: integration

- title: Connect to Store
- description: Maya connects the payment provider to her online store so customers can actually check out

### Step: find-integration-path

- persona: [Maya]
- description: Looks for how to connect provider to her store platform; finds plugin/app or embed instructions but isn't sure which integration method to choose

### Step: install-and-configure

- persona: [Maya]
- description: Installs the plugin or pastes API keys into her store settings; follows a tutorial but encounters a setting she doesn't understand (e.g., webhook URL, capture mode)

### Step: configure-checkout

- persona: [Maya]
- description: Sets up which payment methods to accept (cards, Apple Pay, etc.), currency, tax handling; unsure what her customers expect

---

## Milestone: test-and-launch

- title: Test & Go Live
- description: Maya verifies everything works and accepts her first real payment

### Step: test-checkout

- persona: [Maya]
- description: Runs a test transaction; either it works first try or she hits an error and has to troubleshoot with limited technical knowledge

### Step: first-real-sale

- persona: [Maya]
- description: A real customer completes checkout; Maya checks obsessively to confirm the money will actually arrive in her bank account

### Step: first-payout

- persona: [Maya]
- description: Receives first payout in her bank account days later; finally feels like the system is real and working
