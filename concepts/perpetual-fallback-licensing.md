---
title: "Perpetual Fallback Licensing"
date: 2026-05-03
domain: software-distribution
maturity: established
source_type: practitioner
topics: [patterns]
tags: [concept, licensing, ux, desktop-apps, monetisation, saas, patterns, domain/software-distribution, maturity/established, source-type/practitioner, topic/patterns]
status: draft
sources:
  - url: https://keyforge.dev/guides/how-to-license-tauri-app
    hash: sha256:a41624296c5afde1cd15efc86e5e98c755ac0e00cd28c9749accedf12b85cfde
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://keyforge.dev/blog/perpetual-fallback-desktop-apps
    hash: sha256:3d6ce62de0108536db9e430a85462f1112d063ac93f65849a6cdb47057a8a0df
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.jetbrains.com/store/terms/license_personal.html
    unreachable: true
    reason: HTTP 404
    checked: 2026-08-21
    class: unclassified
    reachability: dead-no-archive
---

# Perpetual Fallback Licensing

## Definition
A software licensing pattern in which an expired (but previously valid) license grants continued access to a limited, frozen feature set rather than triggering a complete access revocation — the software "falls back" to a perpetual baseline rather than going dark.

## Explanation
When a time-limited or subscription license expires, there are two common outcomes:

1. **Hard cut-off:** The software stops working entirely. The user must renew to regain access.
2. **Perpetual fallback:** The software continues to run with a reduced or frozen feature set — typically the feature set available at the time of purchase — until the user chooses to upgrade.

The perpetual fallback model is common in desktop software that can be sold as either a perpetual one-time purchase or a subscription. After a subscription lapses, the user retains the "as-of-purchase" functionality permanently but loses access to new features added during the subscription window.

**Implementation (Keyforge example):**
When perpetual fallback is enabled on a product, the `validate` endpoint returns `status: "fallbacked"` instead of `status: "invalid"` or `isValid: false`. The app code branches on this:

```js
const data = await res.json();

if (data.status === 'active') {
  // Full access — all features unlocked
} else if (data.status === 'fallbacked') {
  // Expired subscription — grant limited/frozen feature set
  enterLimitedMode();
} else {
  // Invalid key or no key — prompt re-entry
  promptLicenseKey();
}
```

The server differentiates `fallbacked` from `invalid`: a `fallbacked` license *was* valid and is now expired; an `invalid` license was never valid, has been revoked, or has exceeded its activation limit. This allows the app to give different UX responses to each state.

**What "limited mode" means is entirely up to the developer.** Common patterns:
- Feature freeze: user keeps all features available at their subscription expiry date, but no new features
- Core functionality only: advanced/premium features disabled, baseline version usable indefinitely
- Read-only mode: data can be viewed but not edited or synced
- Usage caps: limited to N projects, N exports, N API calls per month

**Why this matters for customers:**
- Eliminates the "subscription anxiety" where customers fear losing their work if they cancel
- Makes one-time purchase positioning credible: "buy once, keep forever (with updates for a year)"
- Reduces churn driven by fear rather than actual product dissatisfaction
- Common in professional tools (e.g., JetBrains IDEs, Sketch) where users have substantial project investment

**Why this matters for developers:**
- Creates a softer conversion funnel: lapsed users don't disappear, they remain users who might re-subscribe for new features
- Avoids support burden of users locked out of their own data
- Differentiates from pure SaaS in a market fatigued by subscription-everything

## Key Properties
- **Graceful degradation:** Expired ≠ broken; app remains functional in a defined reduced state
- **Status differentiation:** Requires a licensing API that returns distinct statuses (`active` / `fallbacked` / `invalid`) rather than a binary `isValid` boolean
- **Developer-defined scope:** What "limited mode" includes is a product decision, not a platform constraint
- **Anti-churn mechanism:** Users who cancel subscriptions stay on the product radar; re-subscription reactivates full features without friction
- **Trust signal:** Signals to prospective buyers that a purchase has lasting value even if they later stop paying

## Relationships
- Implemented via [[licensing-as-a-service]]: the `status: "fallbacked"` response in the LaaS validation API is the mechanism that enables this pattern in practice
- Complementary to [[license-gated-software-distribution]]: distribution-level gating can also implement perpetual fallback by continuing to serve the last permitted version of the binary after expiry
- Related to [[isv-distribution-platform]]: ISV platforms that support version-locked distribution can enforce "you keep the version you paid for" without any app-level code changes

## Applications
- **Professional desktop tools (IDEs, design tools):** JetBrains "perpetual fallback license" is the canonical example — after 12 months of subscription, users keep the year-1 release permanently
- **Indie Tauri/Electron apps with annual plans:** An annual subscription with fallback lets users justify the cost as "one year of updates + permanent license" rather than pure rental
- **Enterprise software with budget cycles:** Enterprises whose licenses lapse during procurement delays can keep working in limited mode rather than losing access entirely — reduces emergency renewals and goodwill damage
- **Trial-to-paid with rollback:** A generous trial in "full mode" that falls back to limited mode after expiry, rather than a time-bomb cut-off — lower friction and less adversarial
- **Archival/legacy access:** Users on long-expired licenses can still open their existing project files in read-only mode, preventing data hostage situations

## Study
- Flashcards: [[flashcards/perpetual-fallback-licensing|Practice this concept]]

## Sources
- [How to add license keys to a Tauri app | Keyforge](https://keyforge.dev/guides/how-to-license-tauri-app) — Describes the `status: "fallbacked"` API response and implementation pattern
- [Perpetual fallback access for desktop apps | Keyforge Blog](https://keyforge.dev/blog/perpetual-fallback-desktop-apps) — In-depth treatment of the pattern, business rationale, and UX patterns
- [JetBrains Perpetual Fallback License](https://www.jetbrains.com/store/terms/license_personal.html) — Real-world canonical example of perpetual fallback in a major professional IDE

## See Also
- [[licensing-as-a-service]]
- [[license-gated-software-distribution]]
- [[isv-distribution-platform]]
- [[open-core-model]]: related monetisation strategy — open core uses structural openness as the trust guarantee rather than contractual fallback rights
