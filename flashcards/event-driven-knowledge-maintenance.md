---
tags: [flashcards, knowledge-management, ai-agents, automation, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Event-driven knowledge maintenance — Flashcards

#flashcards/knowledge-management

## Definition <!-- kb:card:9e8339 -->
What is event-driven knowledge maintenance?
?
Replacing a manually-run knowledge base operating loop with hooks bound to lifecycle events (new source, session start/end, query, write, schedule) so maintenance runs automatically instead of depending on someone remembering.

## Event-to-action mapping <!-- kb:card:2647b3 -->
Name three lifecycle events in event-driven knowledge maintenance and the action each one triggers.
?
A new source triggers ingest, entity extraction, and index updates; session end triggers compression into observations; a scheduled tick triggers lint, consolidation, and retention decay.

## Quality gate on writes <!-- kb:card:8e7506 -->
What keeps automated content from filling the knowledge base with low-quality material?
?
Generated content is scored for structure, citations, and consistency; content below threshold is flagged or rewritten, and only content scoring above a threshold files back into the wiki.

## Self-healing lint <!-- kb:card:bc598a -->
How does event-driven lint differ from advisory lint?
?
It acts rather than just reporting: orphan pages are linked or flagged, stale claims are marked, and broken cross-references are repaired automatically.

## Contradiction handling <!-- kb:card:e30074 -->
How does the system resolve a contradiction detected on write, by default?
?
It proposes a resolution automatically based on source recency, source authority, and supporting-observation count, with a human able to override it.

## Crystallization <!-- kb:card:2318f2 -->
What happens to a completed research or debugging thread under crystallization?
?
It is automatically distilled into a structured digest page (question, findings, entities, lessons), and its lessons are extracted as standalone facts.
