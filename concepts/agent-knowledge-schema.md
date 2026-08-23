---
title: "Agent Knowledge Schema"
date: 2026-04-14
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, context-engineering]
tags: [concept, knowledge-management, ai-agents, pkm, architecture, meta, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/context-engineering]
status: draft

sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    hash: sha256:9cec05f1dcdf4fc0162cfd801b68c448df9b7ee1fa4ee94c17c5c607909ab3ff
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    hash: sha256:38e4f6b3bc571142fda8122633d849887afb108c2ab5b84251a024bab995c2dc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Knowledge Schema

## Definition
A domain-specific configuration document (typically `CLAUDE.md`, `AGENTS.md`, or similar) that transforms a generic LLM into a disciplined knowledge worker by encoding: entity types and relationship vocabularies, ingest rules, page creation criteria, quality standards, contradiction handling policy, consolidation schedules, and privacy/scope boundaries. It is co-evolved between the human and the LLM over time and is considered the single most important file in an LLM knowledge base.

## Explanation
Without a schema, an LLM operates on a knowledge base in an ad hoc, inconsistent way — sometimes creating new pages when it should update existing ones, sometimes writing facts without provenance, sometimes extracting different entity types from session to session.

The Agent Knowledge Schema is the *constitution* of the knowledge base. It specifies:

**1. Entity taxonomy:**  
What kinds of things exist in this domain? For a software engineering context:
- Person, Project, Library, Service, Concept, Decision, Bug, File

**2. Relationship vocabulary:**  
What kinds of edges can connect entities?
- `uses`, `depends_on`, `owns`, `fixed`, `caused`, `supersedes`, `contradicts`, `relates_to`

**3. Ingest rules:**  
- How to process different source types (article, PR, debug session, meeting note)
- When to create a new page vs. update an existing one
- What metadata is required on every ingested item

**4. Quality standards:**  
- Minimum source count before a claim is considered established
- Confidence scoring formula and decay schedule
- Self-healing lint rules (orphan detection, stale claim flagging)

**5. Contradiction resolution policy:**  
- Default: newer source with higher authority wins
- Override: human review required for architectural decisions

**6. Consolidation schedule:**  
- Hourly: working memory lint
- Daily: episodic compression
- Weekly: semantic consolidation pass
- Monthly: retention decay review

**7. Privacy and scope:**  
- Which entities are private vs. shared
- What categories are auto-stripped on ingest (credentials, PII)

**Co-evolution:**  
The schema starts rough and becomes more precise through use. After a few dozen ingests and lint passes, it reflects how the domain *actually works* rather than how someone imagined it would. A mature schema is transferable — share it with someone in the same domain and they start with a running-start.

## Key Properties
- Single most important file in an LLM knowledge base.
- Co-evolved between human and LLM — not written once and forgotten.
- Defines vocabulary for [[typed-knowledge-graph]] entity extraction.
- Controls [[knowledge-confidence-scoring]] formula and decay schedule.
- Encodes contradiction resolution rules for [[knowledge-supersession]].
- Defines consolidation thresholds for [[knowledge-consolidation-tiers]].
- Transferable to similar domains — schema-as-intellectual-asset.

## Relationships
- Governs all other concepts in this cluster: [[typed-knowledge-graph]], [[knowledge-confidence-scoring]], [[knowledge-supersession]], [[knowledge-consolidation-tiers]], [[retention-decay-knowledge]], [[knowledge-crystallisation]].
- Analogous to [[prompts-as-infrastructure]] but at knowledge-base level rather than individual prompt level.
- Related to [[agentic-sdlc]]: schema co-evolution is an ongoing engineering discipline, not a one-time setup.

## Applications
- **New knowledge base setup:** Start with a minimal schema (entity types + ingest rules), then expand as gaps appear.
- **Domain transfer:** A schema developed for software engineering can be adapted for research, legal, or product domains by changing entity taxonomy and relationship vocabulary.
- **Quality governance:** Schema-encoded quality standards enable automated lint — the LLM knows what "good" looks like without human reminders.
- **Onboarding:** New contributors (human or agent) read the schema to understand how the knowledge base works.
- **PoC path:** Start with `AGENTS.md` as an implicit schema (we already have this). Add explicit sections: entity taxonomy, ingest rules for staging notes, contradiction handling policy. Measure whether schema-guided ingests are more consistent than prior ad hoc ones.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — schema-as-constitution concept, co-evolution principle
- [Andrej Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — original CLAUDE.md pattern

## See Also
- [[prompts-as-infrastructure]]
- [[typed-knowledge-graph]]
- [[knowledge-confidence-scoring]]
- [[knowledge-consolidation-tiers]]
- [[agentic-sdlc]]
- [[llm-wiki-pattern]]
- [[open-knowledge-format]]
