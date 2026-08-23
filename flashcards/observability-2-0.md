---
tags: [flashcards, observability, wide-events, honeycomb]
sr-due: 2026-04-26
sr-interval: 1
sr-ease: 250
---

# Observability 2.0 — Flashcards

#flashcards/observability

## Definition <!-- kb:card:a8c1a2 -->
What is Observability 2.0?
?
A paradigm coined by Charity Majors (Honeycomb) that replaces the siloed metrics/logs/traces model with **arbitrarily-wide structured events** as a single source of truth. Aggregation happens at read time (not write time), enabling arbitrary ad-hoc queries and unlimited cardinality without predetermining questions in advance.

## Core distinction <!-- kb:card:79651b -->
What is the fundamental architectural difference between Observability 1.0 and 2.0?
?
- **1.0:** Multiple sources of truth (metrics store + logs store + traces store); aggregation at write time; you decide upfront what questions you'll ask
- **2.0:** Single source of truth (wide structured events); aggregation at read time; you can ask any question later without pre-aggregation

## Wide events <!-- kb:card:dd8a8c -->
What is a "wide structured event" in Observability 2.0?
?
A single JSON object (also called a canonical log line) emitted per request/operation containing *hundreds* of fields: user ID, request ID, service, latency, error, feature flag state, A/B variant, trace ID, build version, customer tier, etc. Metrics, logs, and traces are *derived* from this single event at query time — they are not stored separately.

## Cardinality <!-- kb:card:5223b0 -->
Why does Observability 2.0 claim "infinite cardinality"?
?
In 1.0, metrics-based tools charge for cardinality (unique tag value combinations), making high-cardinality dimensions like user IDs prohibitively expensive. In 2.0, every field in the event is equally queryable at read time using columnar storage — user ID is just another column, not a special "custom metric." You can query "show me requests for user 12345" without incurring extra cost.

## Cost model <!-- kb:card:3d7e64 -->
How does the cost model differ between O11y 1.0 and 2.0?
?
- **1.0:** Pay to store data multiple times across N backend types; costs grow as a multiplier of traffic; dropping high-cardinality data is the only cost lever
- **2.0:** Pay to store data once; surgical tail-based sampling controls cost without sacrificing coverage of errors; as costs grow, value grows proportionally

## Storage requirement <!-- kb:card:2e300e -->
What kind of storage engine does Observability 2.0 require and why?
?
Columnar storage designed for high-cardinality ad-hoc queries (e.g., Honeycomb's proprietary database, ClickHouse). Traditional time-series databases (Prometheus, InfluxDB) pre-aggregate at write time and can't support the "ask anything later" query model. This is why O11y 2.0 can't just be implemented on top of existing metric backends.

## Relationship <!-- kb:card:d3ddc8 -->
How does Observability 2.0 relate to the existing three-pillar observability model?
?
It supersedes it architecturally — you cannot simultaneously store data "across multiple pillars" AND as "a single source of truth" (these are backwards-incompatible approaches). However, the practical industry trajectory is a *hybrid*: wide events for debugging and investigation, metrics retained for cheap long-term trending and alerting.
