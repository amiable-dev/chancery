---
tags: [flashcards, knowledge-management, pkm, llm, wiki]
sr-due: 2026-07-08
sr-interval: 1
sr-ease: 250
---

# Knowledge Compounding — Flashcards

#flashcards/knowledge-management

## Definition <!-- kb:card:8464eb -->
What is knowledge compounding?
?
The property of an incrementally-maintained knowledge base whereby each new addition yields increasing marginal value — because it integrates against the full context of everything previously ingested. The 100th source benefits from the synthesis built by the previous 99. Coined by Karpathy as the core differentiator between the LLM Wiki pattern and stateless RAG.

## Mechanism <!-- kb:card:1656ba -->
How does knowledge compounding work in two directions?
?
**Forward:** New sources are integrated against the existing wiki, noting confirmations, contradictions, new connections, and superseded claims — not just indexed in isolation.
**Backward:** Query answers can be filed back into the wiki as new pages, so explorations compound the knowledge base just like ingested sources do.

## vs RAG <!-- kb:card:78d09f -->
What is the key difference between knowledge compounding and RAG retrieval?
?
RAG is stateless: every query re-derives synthesis from raw document chunks, discarding the work when the session ends. Knowledge compounding is stateful: each ingestion and query enriches a persistent, cross-linked wiki. RAG accumulates raw documents; compounding wikis accumulate synthesised knowledge.

## Enabling condition <!-- kb:card:e85044 -->
Why can LLMs enable knowledge compounding when humans can't sustain it?
?
The bottleneck is maintenance: keeping 15+ inter-linked pages consistent when a new source arrives is tedious for humans and systems quickly become stale. LLMs absorb this cost naturally — they don't get bored, don't forget cross-references, and can touch 15 files in one pass. The compounding loop only works when maintenance cost is near zero.

## Application <!-- kb:card:e873d2 -->
Where does knowledge compounding apply in this vault?
?
Every staged link synthesised into a concept note compounds the vault's context. The next synthesis benefits from all prior ones: cross-links form automatically, contradictions are surfaceable, and gaps become visible. The pipeline (staging → concepts) is a compounding loop — each cycle adds more value than the last.
