---
title: Retrieval as composition
aliases: ["Retrieval as composition"]
date: 2026-08-24
domain: llm
maturity: emerging
source_type: practitioner
tags: [concept, llm, retrieval, orchestration, domain/llm, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
    hash: sha256:b20520de2900c93455d4757c6d6ed3ab57f2a8351623246c60ee9dbfe22da7ef
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# Retrieval as composition

## Definition

**Retrieval as composition** replaces 'retrieve top-k and paste' with an orchestration engine: scope is resolved before any search, then a dynamic graph of predicate-gated strategies runs in parallel, contributions are merged under explicit token budgets, and the executed graph is logged so every answer's provenance is a readable trace.

## Explanation

Heterogeneous context breaks single-strategy retrieval: one revenue question may need a warehouse schema, a validated SQL example, a wiki definition, and a thread about a known data issue — different levels of different hierarchies in different indexes. Scope comes first: users configure bundles ('skills' — a slice of the map packaged with instructions for a purpose), compiled once into an authoritative filter clause reused by every retrieval path and re-checked on the way out, since rules referencing deleted assets must match nothing and out-of-scope items sneak in through graph traversals. Retrieval itself is a strategy graph: each strategy declares a firing predicate ('entity phrases exist and no warehouse candidates do') and contributes candidates; hierarchy gates route on counts; repair strategies fetch a parent when only orphaned children matched. Two disciplines govern cost: know when *not* to call an LLM (count thresholds route stages — few candidates fetched wholesale, hundreds get an LLM filter, thousands get vector search plus reranker first), and budget tokens at every layer with graceful degradation (full metadata → summary → name only). 'Was the right item retrieved?' and 'did it survive into the tokens the model read?' are different failures needing different metrics; logging the executed graph turns 'why didn't it know X?' into a five-minute trace read.

## Key Properties

- Scope resolution precedes search; one compiled filter clause, enforced in and out
- Strategies are predicate-gated and parallel; the graph's shape emerges per query
- Count thresholds decide when an LLM is worth calling; token budgets degrade detail gracefully
- Retrieved versus survived-the-budget are distinct failure modes
- The executed graph is logged as the answer's provenance

## Relationships

- [[context-layer]] — implements the composition verb of that architecture at query time
- [[retrieval-augmented-generation]] — generalises RAG's single retrieve-then-generate step into an orchestrated portfolio of retrieval strategies

## Applications

Retrieval layers over heterogeneous corpora; debugging retrieval by reading executed strategy graphs; cost control by routing on candidate counts before invoking models.

## Sources

- https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/

## See Also

- [[context-layer]]
- [[retrieval-augmented-generation]]
