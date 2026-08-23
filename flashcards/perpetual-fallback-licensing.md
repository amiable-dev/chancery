---
tags: [flashcards, licensing, ux, patterns]
sr-due: 2026-05-03
sr-interval: 1
sr-ease: 250
---

# Perpetual Fallback Licensing — Flashcards

#flashcards/licensing

## Definition <!-- kb:card:15ec77 -->
What is perpetual fallback licensing?
?
A pattern where an expired license grants continued access to a limited/frozen feature set rather than complete revocation — the software "falls back" to a perpetual baseline instead of going dark.

## API Signal <!-- kb:card:ab3136 -->
What API response distinguishes "perpetual fallback" from "invalid license"?
?
A distinct `status: "fallbacked"` response from the validate endpoint — vs `status: "active"` (valid) or `status: "invalid"` (revoked/never valid). This requires the licensing platform to differentiate expiry from invalidity.

## Code Pattern <!-- kb:card:7aa437 -->
Sketch the branching logic for perpetual fallback in a license validation handler.
?
```js
if (data.status === 'active') {
  // Full access
} else if (data.status === 'fallbacked') {
  // Expired — grant limited/frozen feature set
} else {
  // Invalid — prompt for license key
}
```

## Business Rationale <!-- kb:card:d52701 -->
Why would a developer implement perpetual fallback instead of a hard cut-off?
?
- Reduces churn from "subscription anxiety" (fear of losing work/access)
- Keeps lapsed users in the product ecosystem — re-subscription reactivates full features
- Makes one-time purchase positioning credible ("buy once, keep forever with updates for a year")
- Avoids data hostage situations (users can still access their own files)

## Real-World Example <!-- kb:card:923731 -->
Name a major real-world example of perpetual fallback licensing.
?
JetBrains IDEs — after 12 months of subscription payments, users receive a perpetual fallback license for the version available at the 12-month mark. New features require continued subscription; the baseline version is kept permanently.

## Relationship to LaaS <!-- kb:card:3790e3 -->
How does perpetual fallback relate to Licensing-as-a-Service platforms?
?
LaaS platforms (e.g. Keyforge) implement it as a product configuration option — when enabled, the `validate` endpoint returns `status: "fallbacked"` for expired (but previously valid) licenses instead of `isValid: false`. The app developer defines what "limited mode" means.

## Scope Decision <!-- kb:card:96068b -->
Who decides what features are available in "fallback mode"?
?
The developer — it's a product decision, not a platform constraint. Common choices: feature freeze at expiry date, core functionality only, read-only access, usage caps (N exports/month), or last purchased version locked.
