---
title: Targeted profiling rollout
aliases:
  - Profiling as an optimisation programme
date: 2026-08-24
domain: observability
maturity: emerging
source_type: practitioner
tags: [concept, observability, performance, operations, domain/observability, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://fatihkoc.net/posts/ebpf-parca-observability/
    class: external-secondary
---

# Targeted profiling rollout

## Definition

**Targeted profiling rollout** is the discipline of treating continuous profiling as a time-boxed optimisation programme aimed at a handful of the most expensive services rather than as one more always-on monitoring layer switched on fleet-wide — sequenced only after metrics, logs and trace correlation already work, and delivered self-service to the team that owns the code, on the observation that profiles nobody owns become flamegraphs nobody acts on.

## Explanation

Both failure modes it guards against are organisational rather than technical. The first is sequencing: a team hears low-overhead visibility, enables profiling everywhere before alerts link to runbooks or logs correlate with traces, and ends up operating another storage system whose output nobody has the context to interpret. Profiling optimises a system that is already debuggable; it does not substitute for the foundation. The second is routing. If site reliability engineers read the profiles and file tickets asking service teams to optimise code those teams did not know was hot, adoption dies at the ticket queue, because the people who can act are not the people looking. The fix is to put a service's own top CPU functions in front of its owning team as a routine weekly artifact so optimisation becomes part of the normal development cycle. The recommended shape is deliberately narrow and finite: take the services with the largest compute spend, profile them for a few weeks, fix the top few hotspots, measure the change, and only then widen. The adopt, wait and skip criteria fall out of the same economics — adopt when compute is a significant line item, when performance incidents recur with unclear causes, or when a polyglot estate makes per-language agents impractical; wait when nobody has capacity to own retention, storage and triage; skip where compute cost is immaterial or where security policy forbids the elevated kernel capabilities the agents require, a constraint worth settling before the rollout rather than during it. The transferable lesson generalises well past profiling: telemetry whose findings have no owner and no target becomes shelfware no matter how cheap it was to collect.

## Key Properties

- Sequenced after metrics, logs and trace correlation work, because profiling optimises rather than debugs
- Scoped to the highest-compute services for a fixed window, then measured before expanding
- Delivered self-service to owning teams; routing findings through a central team as tickets kills adoption
- Adopt on compute cost, recurring unclear incidents or polyglot fleets; wait on capacity; skip on immaterial spend or kernel-capability policy
- Retention, storage backend and lifecycle policy need budgeting before the first deployment

## Relationships

- [[continuous-profiling]] — is what this discipline is applied to, and the reason it is needed — the technique is cheap enough to enable everywhere, which is exactly how it turns into unread dashboards
- [[collector-side-telemetry-reduction]] — applies the same cost discipline to a different signal, both holding that the real constraint on telemetry is what someone will act on rather than what is technically capturable
- [[symptom-based-alerting]] — shares its habit of matching each signal to a decision and an audience: that practice decides what should wake a person, this one decides what should be collected and who is expected to act on it

## Applications

Planning a profiling adoption that survives its first quarter; deciding which services to instrument first when compute spend is the motivation; making the case to defer profiling in a team whose alerting foundation is still incomplete.

## Sources

- https://fatihkoc.net/posts/ebpf-parca-observability/

## See Also

- [[continuous-profiling]]
- [[collector-side-telemetry-reduction]]
- [[symptom-based-alerting]]
