---
tags: [flashcards, ai-agents, knowledge-management, epistemology]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Curated-over-Mined Precedence — Flashcards

#flashcards/knowledge-management

## Definition <!-- kb:card:36ea87 -->
What is curated-over-mined precedence?
?
The rule that human-curated context items must structurally outrank mined metadata on conflict, while learnings mined from usage feed back only as ranking tie-breakers — they influence retrieval but cannot veto it.

## Differentiation <!-- kb:card:fae492 -->
Why does mined behavioral signal get "influence, not veto" power while curated notes get veto power?
?
Because curated notes are explicitly asserted by a human who vouched for them, making them auditable and correctable at the source. Mined behavioral signal is inferred, not asserted — if it could veto outright, one spurious pattern (a bad query run twice) could silently suppress a correct result with no human having endorsed the override.

## Application <!-- kb:card:878000 -->
How would this principle change a wiki-lint operation that currently deletes `[[links]]` to nonexistent targets?
?
Instead of vetoing (deleting) unresolved forward-references outright, treat them as pending, influence-weighted assertions that may resolve once the target concept note lands — avoiding "forward-reference whack-a-mole" from a rule that behaves like a veto.
