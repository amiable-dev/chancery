---
title: Temporal fakes
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, testing, simulation, observability, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    class: external-secondary
---

# Temporal fakes

## Definition

A **temporal fake** is a stand-in for an external system that holds internal state and evolves it over time the way the real system would, rather than returning fixed responses to matched requests — so a test can start a condition, watch it develop, and observe the downstream consequences unfold, instead of asserting against a snapshot the fake was told to produce.

## Explanation

The difference from a conventional mock is a state machine plus a clock. A mock answers each call from a table of request-response pairs and has no notion of what happened before or what should happen next; a temporal fake models the entity — a device, a fabric, a service — and drives its readings forward through a scenario, so a fault injected now produces the metric drift, the threshold crossing, the alert and the recovery in the order and over the durations the real thing would. That is what makes it the right tool for systems whose behaviour only exists in time: alerting rules, anomaly detection, dashboards and cascading-failure paths cannot be validated against a static response, and the real conditions are often impossible to produce deliberately — the illustrative case is an observability stack for GPU data centres, where validating a thermal-throttle alert would otherwise mean overheating real hardware, so the team built fakes for the hardware telemetry and fabric domains with scenarios for throttling, error storms, link flaps and power-supply failures, parameterised by intensity and duration. Two structural details make it a pattern rather than an anecdote: a registry defines which failure scenarios are valid, and the injection interface is exposed to an agent, so the agent can trigger a fault and then verify for itself that the metric moved, the alert fired and the dashboard updated — a closed loop with no hardware and no human. The cost is fidelity risk, and it is the serious one: a fake that drifts from the system it imitates produces green pipelines that certify nothing, so the simulator itself becomes something to keep honest. Building such simulators used to be prohibitive, which is the part of the practice that changed; the source is Thoughtworks' Technology Radar reporting one team's experience rather than a controlled comparison.

## Key Properties

- Holds an internal state machine and advances it over time, rather than replaying fixed request-response pairs
- Makes time-dependent behaviour testable: alert thresholds, anomaly detection, cascading failures, recovery
- Replaces conditions that are unsafe, expensive or impossible to produce on real hardware
- A scenario registry plus a machine-callable injection interface lets an agent trigger faults and verify the effects itself
- Fidelity drift is the failure mode — an inaccurate fake yields confidence in a pipeline that verifies nothing

## Relationships

- _No relationships recorded yet._
- [[agentic-test-layer-scoping]] — temporal fakes supply a test-double technique fitted to layered agentic testing's outermost deterministic-shell layer — a temporal fake lets a shell-layer test exercise a realistic evolving sequence against an external dependency, rather than the single fixed response a conventional mock returns.
- [[golden-trajectory-regression]] — temporal fakes sit in tension with golden-trajectory regression's approach to test fidelity — a recorded baseline is exactly the kind of snapshot assertion temporal fakes are built to replace with a system that evolves state live during the test.

## Applications

Developing and testing an observability stack — alert rules, dashboards, anomaly detection — before or without the hardware it monitors; exercising failure and recovery paths against dependencies that cannot be broken on demand; giving an agent a safe environment in which to trigger faults and confirm the system reacted.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- _None yet._
