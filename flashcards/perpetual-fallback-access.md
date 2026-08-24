---
tags: [flashcards, licensing, software-business, desktop-software, domain/software-distribution, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Perpetual fallback access — Flashcards

#flashcards/licensing

## Definition <!-- kb:card:cbb5fb -->
What is perpetual fallback access?
?
A licensing design where an expired licence degrades a locally installed app into a limited but permanently usable mode instead of disabling it — the licence boundary gates future value (new versions and features) rather than revoking value already delivered.

## Why a hard cutoff backfires <!-- kb:card:cf8bcc -->
Why does a hard licence cutoff not reliably drive renewals?
?
It makes renewing, migrating to a competitor, and pirating roughly equal in effort, so which one a lapsed user picks is unpredictable. A degraded fallback mode collapses that choice, because the zero-effort option is now the incumbent product still working.

## Two implementations <!-- kb:card:f94d4c -->
What are the two implementations of perpetual fallback access, and when does each apply?
?
Updates-window licensing, for products with clean version boundaries — the customer permanently keeps the last version released inside their paid update window. Graceful degradation, for products without a clean split — a genuinely useful limited mode that expired licences run in indefinitely.

## The third licence state <!-- kb:card:a8c2a2 -->
What must a licence check return for perpetual fallback access to work, and why?
?
A third state distinct from 'active' and 'unlicensed' (e.g. 'fallback'), so the client applies a feature set rather than raising an error. For offline-capable software this state can be resolved locally from a signed token, with no server round trip.

## Why desktop stakes are higher <!-- kb:card:7bc87d -->
Why are the stakes of a hard licence cutoff higher for desktop software than for web apps?
?
The app sits on the user's machine and often holds years of work in a proprietary format, so going dark can mean files the owner can no longer open — producing support tickets, chargebacks, and one-star reviews rather than renewals.

## Anti-piracy logic and its dependency <!-- kb:card:aa80ce -->
How does perpetual fallback access deter piracy, and what does the whole pattern depend on to keep working?
?
By incentive removal, not enforcement: a working fallback leaves an ordinary lapsed customer — the realistic threat, not crackers — nothing to gain by circumventing the check. But this only holds if renewal is frictionless and self-serve; without a one-click path back, the user just stays in the degraded mode forever.
