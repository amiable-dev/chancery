---
tags: [flashcards, knowledge-management, ai-agents, memory, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# LLM-maintained wiki — Flashcards

#flashcards/knowledge-management

## Definition <!-- kb:card:a0086a -->
What is the LLM-maintained wiki pattern?
?
An LLM incrementally builds and maintains a persistent wiki as its knowledge substrate — writing and revising pages as material arrives — instead of retrieving over raw documents each session.

## Write-time distillation <!-- kb:card:f0d994 -->
What is the core mechanism behind the LLM-maintained wiki pattern?
?
It moves the work to write time: the model distils incoming material into named, linked pages and revises them as understanding changes, so future sessions read consolidated pages instead of re-deriving from raw sources.

## Contrast with RAG <!-- kb:card:6cbfe0 -->
How does the LLM-maintained wiki pattern differ from retrieval-augmented generation?
?
RAG searches unprocessed source documents at query time, so nothing accumulates; the wiki pattern distills material into revisable pages at write time, so knowledge compounds.

## Legibility advantage <!-- kb:card:eccb1a -->
What advantage does a maintained wiki have over an embedding index?
?
It is human-legible and correctable — a person can inspect and fix a page — unlike an embedding index.

## Trade-off accepted <!-- kb:card:098473 -->
What cost does the wiki pattern accept in exchange for compounding knowledge?
?
Maintenance cost and the risk of distillation errors, traded for persistence, legibility, and curation.
