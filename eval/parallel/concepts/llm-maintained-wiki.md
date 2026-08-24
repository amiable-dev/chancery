---
title: LLM-maintained wiki
date: 2026-08-24
domain: knowledge-management
maturity: emerging
source_type: practitioner
tags: [concept, knowledge-management, ai-agents, memory, domain/knowledge-management, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.aibuilderclub.com/blog/karpathy-llm-wiki
    hash: sha256:4018178174683320ffd5f3942cf55802c9872e851c2a539deb5c7971ae817668
    retrieved: 2026-08-24
    reachability: ok
    class: external-secondary
---

# LLM-maintained wiki

## Definition

The **LLM-maintained wiki** is the pattern, popularised by an April 2026 gist of Andrej Karpathy's, in which an LLM incrementally builds and maintains a persistent wiki as its knowledge substrate — writing and revising pages as material arrives — instead of retrieving over raw documents each session.

## Explanation

The pattern targets a compounding problem: the more one reads, the less one retains, and every LLM session starts from zero. Retrieval-augmented setups answer this by searching source documents at query time, but the sources stay unprocessed — nothing accumulates. The wiki pattern moves the work to write time: the model distils incoming material into named, linked pages and revises them as understanding changes, so the knowledge base compounds and any future session (or human) reads consolidated pages rather than re-deriving from raw sources. It is a pattern, not a tool — the staged source is third-party coverage of the gist, and the primary artifact remains the better reference for specifics. The trade against retrieval is explicit: maintenance cost and the risk of distillation errors are accepted in exchange for persistence, legibility, and curation — the wiki is inspectable and correctable in a way an embedding index is not.

## Key Properties

- Distillation happens at write time; knowledge accumulates in named, linked, revisable pages
- Sessions read consolidated pages instead of re-retrieving raw sources
- Human-legible and correctable, unlike an embedding index
- Accepts maintenance cost and distillation risk in exchange for compounding

## Relationships

- [[retrieval-augmented-generation]] — positions itself as the write-time alternative to RAG's query-time retrieval: distil into maintained pages once rather than search raw sources every session
- [[ebbinghaus-forgetting-curve]] — supplies the mechanism behind the problem the wiki pattern solves — unreviewed knowledge decays on this curve, so distillation into revisable pages replaces re-reading
- [[context-layer]] — contrasting substrates for agent knowledge: the wiki distils at write time into curated pages, the context layer indexes sources at read time and layers curation on top

## Applications

Personal or team knowledge bases maintained by an agent across sessions; giving a long-running agent durable memory whose contents a human can audit and correct.

## Sources

- https://www.aibuilderclub.com/blog/karpathy-llm-wiki

## See Also

- [[retrieval-augmented-generation]]
