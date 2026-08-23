---
tags: [flashcards, reliability]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Weakest-Link Reliability — Flashcards

#flashcards/reliability

## Definition <!-- kb:card:15508e -->
What is weakest-link reliability?
?
The principle that a system's overall reliability is bounded by its most fragile dependency, not by the average quality of its components. Reliability comes from designing the system to tolerate the failure of any single part, not from making every part flawless.

## Design Shift <!-- kb:card:4a6f7f -->
What question should engineers ask instead of "how do we make this component perfect"?
?
"What happens if this component fails? Can something else take over? How fast can we recover? Can users keep working while it's fixed?" — designing around failure rather than trying to eliminate every failure.

## Application <!-- kb:card:7e6911 -->
When would you apply weakest-link reliability thinking?
?
During dependency risk reviews before shipping a feature — enumerate every dependency and ask whether the system tolerates its failure, rather than assuming it will just work.

## Relationship <!-- kb:card:6784f6 -->
How does weakest-link reliability relate to redundancy as investment?
?
Redundancy is the concrete mechanism that implements weakest-link tolerance: if one replica, region, or instance fails, a redundant one absorbs the load so the weak link doesn't become a full outage.
