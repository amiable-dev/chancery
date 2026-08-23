---
tags: [flashcards, reliability]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Redundancy as Investment — Flashcards

#flashcards/reliability

## Definition <!-- kb:card:2b410f -->
What is "redundancy as investment"?
?
The framing of redundant infrastructure (replicas, multi-region, load balancers, backups) as a deliberate hedge against downtime cost, not wasted spare capacity — the decision is a comparison of ongoing redundancy cost vs. expected outage cost.

## Application <!-- kb:card:9d32bd -->
When should a team invest in redundancy?
?
When the expected cost of downtime (lost revenue, SLA penalties, reputational damage, incident labor) exceeds the ongoing cost of maintaining spare capacity — true for most customer-facing, revenue-generating, or trust-sensitive systems.

## Examples <!-- kb:card:ff126f -->
Name three concrete forms of redundancy and what failure scope each protects against.
?
Load balancers (single-instance failure), database replicas (data/hardware failure), message queues (traffic-spike overload), multi-region/multi-AZ deployment (region-level failure).

## Relationship <!-- kb:card:7188aa -->
How does redundancy as investment relate to weakest-link reliability?
?
Redundancy is the mechanism; weakest-link tolerance is the goal. Weakest-link reliability identifies that a single fragile dependency threatens the whole system; redundancy is how you make that dependency's failure survivable instead of fatal.
