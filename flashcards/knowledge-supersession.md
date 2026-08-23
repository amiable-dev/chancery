---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- knowledge-management
- ai-agents
- pkm
- versioning
---


# Knowledge Supersession — Flashcards

#flashcards/knowledge-management


## Definition <!-- kb:card:970d4f -->
What is Knowledge Supersession?
?
A structured mechanism for replacing outdated claims where the new claim explicitly supersedes the old one: both versions are preserved, linked, and timestamped. The old claim is marked `stale/superseded` rather than deleted, providing a full provenance trail.

## Application <!-- kb:card:0fe693 -->
When would you use Knowledge Supersession?
?
Whenever new information contradicts or updates an existing fact — e.g., a service migrates databases, an architecture decision is reversed, or a newer source provides stronger evidence. Instead of overwriting silently, supersession creates an auditable chain of how knowledge evolved.

## Relationship <!-- kb:card:0be424 -->
How does Knowledge Supersession differ from simply adding an annotation?
?
Supersession is a structural operation, not a note: it updates confidence scores on both claims, creates bidirectional links, timestamps the event, and changes how the knowledge base navigates the claims. An annotation is passive; supersession is active and affects retrieval behaviour.

## Contrast <!-- kb:card:d24fe2 -->
What is the difference between supersession and deletion?
?
Supersession preserves the old claim (marked stale, linked to successor) for audit and rollback. Deletion removes provenance. If the new claim turns out to be wrong, a superseded old claim can be reinstated; a deleted one cannot.
