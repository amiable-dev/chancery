---
tags: [flashcards, observability, telemetry, cost-model, domain/observability, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Observability generations (1.0 vs 2.0) — Flashcards

#flashcards/observability

## Definition: the storage split <!-- kb:card:a71fc7 -->
What is the 'observability generations' framing (1.0 vs 2.0), and what's the defining storage-model split?
?
Observability 1.0 stores metrics, logs and traces separately (the 'three pillars') with aggregation decided at write time. Observability 2.0 stores arbitrarily-wide structured events as a single source of truth, queried at read time.

## Why it's a major version <!-- kb:card:cb179c -->
Why is the 1.0-to-2.0 shift framed as a backwards-incompatible major version rather than an incremental change?
?
Because the two storage models are mutually exclusive — telemetry can't simultaneously be scattered across separate pillar stores and consolidated into one canonical wide-event store.

## Cost control <!-- kb:card:801eec -->
How does cost control differ between observability 1.0 and 2.0?
?
1.0 costs multiply because metrics pricing tracks cardinality (so 'custom metrics' really means unique values), forcing teams to suppress detail to control the bill. 2.0 pays once for wide events and controls cost by sampling.

## Debugging style <!-- kb:card:c842fe -->
How does debugging style differ between observability 1.0 and 2.0?
?
1.0 debugging is search-first: flipping between static dashboards and pattern-matching shapes by eye, so the best debugger is whoever has seen the system longest. 2.0 is analysis-first: an interrogative loop starting from the user's experience, favoring the most curious debugger.

## Developer orientation <!-- kb:card:8d4213 -->
How does observability 2.0 change what counts as 'done' for a developer's work, compared to 1.0?
?
1.0 treats the job as finished at deploy, waiting for pages if something breaks. 2.0 expects instrumenting as you write code and inspecting its real production behavior before the work counts as done.
