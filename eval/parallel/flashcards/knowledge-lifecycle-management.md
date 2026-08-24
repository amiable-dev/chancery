---
tags: [flashcards, knowledge-management, memory, ai-agents, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Knowledge lifecycle management — Flashcards

#flashcards/knowledge-management

## Definition <!-- kb:card:093059 -->
What four mechanisms does knowledge lifecycle management use to treat claims as having a lifecycle rather than being equally valid forever?
?
Confidence scores (from source count, recency, contradictions), supersession (newer claims replace older ones), forgetting (unreinforced material fades in priority), and consolidation tiers (observations compress upward through working, episodic, semantic, procedural).

## Confidence scoring <!-- kb:card:8d49c5 -->
What three factors drive a claim's confidence score, and what two forces act on it over time?
?
Supporting-source count, recency of confirmation, and known contradictions; confidence decays with time and strengthens with each reinforcement.

## Supersession vs. deletion <!-- kb:card:70e0ef -->
What happens to an old claim when a newer one supersedes it?
?
The replacement is linked and timestamped to the original; the original is preserved but marked stale — it is not deleted, so contradictions resolve instead of accumulating as marginal notes.

## Class-dependent forgetting <!-- kb:card:9a954f -->
Does the class of a claim affect how fast it fades, and what happens to faded claims?
?
Yes — decay rate is class-dependent (e.g. architecture decisions fade slowly, transient bugs fade fast); faded claims are deprioritized, never deleted.

## Consolidation tiers <!-- kb:card:e330bd -->
What are the four consolidation tiers, from least to most compressed and durable?
?
Working, episodic, semantic, procedural — each tier is more compressed, more confident and longer-lived than the one below it.
