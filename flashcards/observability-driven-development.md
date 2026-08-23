---
tags: [flashcards, observability, software-engineering, development-practices, slo]
sr-due: 2026-04-26
sr-interval: 1
sr-ease: 250
---

# Observability-Driven Development — Flashcards

#flashcards/observability

## Definition <!-- kb:card:344053 -->
What is Observability-Driven Development (ODD)?
?
A software development methodology (Majors, Fong-Jones, Miranda) that treats observability as an integral part of the development cycle, not an operational afterthought. Instrumentation is written alongside code, production is the authoritative verification environment, and a deploy is the *beginning* of gaining confidence — not the end.

## Core principle <!-- kb:card:922a5a -->
What does ODD mean by "deploying to production is the beginning of gaining confidence, not the denouement"?
?
In traditional development, passing tests + CI = done. In ODD, deploying to production begins the verification phase: the developer actively queries telemetry to confirm the new code path behaves as expected. They don't consider the work done until they can see it working in production telemetry — not just in staging.

## Staging critique <!-- kb:card:79b89b -->
Why does ODD say "debug in production, not in staging"?
?
Staging environments lie. They lack production traffic patterns, data distribution, load, and user behaviour. Bugs that manifest 0.01% of the time with real traffic never appear in staging. ODD argues that good production observability + progressive delivery (feature flags, canaries) is actually *less risky* than trusting staging — because you have real signal and a fast rollback path.

## TDD-Telemetry <!-- kb:card:f0639a -->
What is Martin Thwaites's TDD-Telemetry approach and why does it matter?
?
An extension of ODD that treats telemetry as a first-class test assertion:
1. Write a test: "This endpoint should emit a span with attributes X, Y, Z"
2. Run the test (fails — no instrumentation yet)
3. Add instrumentation to make it pass

This makes telemetry a tested, versioned, contract-guaranteed artefact — not an afterthought. Ensures instrumentation exists and is correct by construction.

## Alerting model <!-- kb:card:b06a07 -->
How does ODD's alerting model differ from traditional threshold alerting?
?
ODD uses **SLO-based error budget alerting** rather than infrastructure thresholds:
- Traditional: "Alert if CPU > 80%" — misses novel failures, causes alert fatigue
- ODD: "Alert when error budget burns at > 14.4× normal rate" — catches any user-impacting failure regardless of cause; user experience is the north star

## Production testing <!-- kb:card:2ebb8b -->
How does ODD make testing in production *safer* than traditional staging-first approaches?
?
By combining progressive delivery with observability:
- Feature flags: roll out to 1% of users → query telemetry → expand or revert
- Canary deployments: one pod vs the fleet → compare telemetry → promote or abort
- Argo Rollouts/Flagger: automate the observe-decide loop

The small blast radius + immediate rollback capability + real production signal makes this less risky than deploying with full confidence based on staging results.
