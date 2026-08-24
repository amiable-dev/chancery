---
tags: [flashcards, security, retrieval, rag, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Access control at the retrieval layer — Flashcards

#flashcards/security

## Definition <!-- kb:card:4309c2 -->
What is access control at the retrieval layer?
?
Moving authorization out of the application and into search itself: every indexed chunk carries the roles/entitlements permitted to see it, and at query time the retriever restricts candidates to chunks matching the caller's authenticated identity — so unauthorized content is never retrieved or put in the prompt.

## Why not filter after generation <!-- kb:card:537d8b -->
Why is filtering a model's output after generation not a sound way to prevent unauthorized disclosure?
?
A model that has already seen a document can reveal it in forms no output filter reliably catches — a paraphrase, an aggregate, an inference — so the only durable boundary is one the unauthorized content never crosses in the first place.

## Single enforcement point <!-- kb:card:f3a381 -->
Why does enforcing access control at the retrieval layer cover more interfaces than application-level checks?
?
Every consuming interface — chat, agent, batch job — reaches the corpus through the same query path, so one filter at retrieval covers all of them instead of each application needing its own check.

## Design constraints <!-- kb:card:610aba -->
What three conditions does access control at the retrieval layer depend on to work correctly?
?
Entitlements captured at indexing time and re-synchronised as source permissions change (a stale tag leaks silently); identity arriving with the query rather than inferred; and a vector store that supports high-performance metadata filtering.

## Without it <!-- kb:card:36d69d -->
What does an internal knowledge base's retrieval index become if access control isn't enforced there?
?
The one system that has read everything and enforces nothing — the opposite of the zero-trust-shaped foundation this technique provides.
