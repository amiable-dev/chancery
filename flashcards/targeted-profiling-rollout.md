---
tags: [flashcards, observability, performance, operations, domain/observability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Targeted profiling rollout — Flashcards

#flashcards/observability

## Targeted profiling rollout: definition <!-- kb:card:1957d6 -->
What is 'targeted profiling rollout', as opposed to fleet-wide always-on profiling?
?
Treating continuous profiling as a time-boxed optimisation programme aimed at a handful of the most expensive services, sequenced only after metrics/logs/trace correlation already work, and delivered self-service to the owning team — rather than switching profiling on everywhere as another monitoring layer.

## Why profiling must come after the foundation <!-- kb:card:4fb49d -->
What goes wrong when a team enables profiling everywhere before alerts link to runbooks and logs correlate with traces?
?
They end up operating another storage system whose output nobody has the context to interpret — profiling optimises a system that is already debuggable, it does not substitute for that foundation.

## Why routing kills profiling adoption <!-- kb:card:57df60 -->
Why does adoption die when SREs read profiles and file tickets asking service teams to optimise code, instead of giving teams the data directly?
?
The people who can act are not the people looking. The fix is to put a service's own top CPU functions in front of its owning team as a routine weekly artifact, so optimisation becomes part of the normal development cycle.

## The shape of a targeted rollout <!-- kb:card:549a8c -->
What is the recommended shape of a targeted profiling rollout?
?
Take the highest-compute-spend services, profile them for a few weeks, fix the top few hotspots, measure the change, and only then widen.

## Adopt, wait, or skip criteria <!-- kb:card:787844 -->
Under what conditions should a team adopt, wait on, or skip a profiling rollout?
?
Adopt when compute is a significant cost line, incidents recur with unclear causes, or the fleet is polyglot. Wait when nobody has capacity to own retention, storage, and triage. Skip when compute cost is immaterial or security policy forbids the required elevated kernel capabilities.

## The transferable lesson <!-- kb:card:0aaf59 -->
What general principle about telemetry does targeted profiling rollout illustrate, beyond profiling specifically?
?
Telemetry whose findings have no owner and no target becomes shelfware, no matter how cheap it was to collect.
