---
tags: [flashcards, testing, simulation, observability, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Temporal fakes — Flashcards

#flashcards/testing

## Temporal fake: definition <!-- kb:card:e0f09c -->
What is a temporal fake?
?
A stand-in for an external system that holds internal state and evolves it over time like the real system, so a test can watch a condition develop and observe downstream consequences — rather than asserting against a fixed snapshot.

## Temporal fake vs conventional mock <!-- kb:card:939483 -->
What distinguishes a temporal fake from a conventional mock?
?
A state machine plus a clock: a mock answers each call from a fixed request-response table with no memory of past or future, while a temporal fake models the entity and drives its readings forward through a scenario over time.

## Why time-dependent systems need temporal fakes <!-- kb:card:ab08f3 -->
Why can't alerting rules, anomaly detection, dashboards, and cascading-failure paths be validated against a static mocked response?
?
Their behaviour only exists in time — a fault must produce metric drift, a threshold crossing, an alert, and a recovery in the order and durations the real system would, which a fixed snapshot response cannot express.

## Temporal fakes: illustrative use case <!-- kb:card:1fdfb4 -->
What real-world example motivates temporal fakes, and what conditions do they replace?
?
An observability stack for GPU data centres: validating a thermal-throttle alert would otherwise mean overheating real hardware, so fakes for hardware telemetry and fabric were built with scenarios for throttling, error storms, link flaps, and power-supply failures.

## Temporal fakes and agent-driven testing <!-- kb:card:51904c -->
What two structural details let an agent close the testing loop with a temporal fake, without hardware or a human?
?
A registry defining which failure scenarios are valid, and an injection interface exposed to the agent — so the agent can trigger a fault and then verify for itself that the metric moved, the alert fired, and the dashboard updated.

## Temporal fakes: fidelity risk <!-- kb:card:c09782 -->
What is the serious failure mode of a temporal fake?
?
Fidelity drift — if the fake no longer matches the real system it imitates, it produces green pipelines that certify nothing, so the simulator itself must be kept honest.
