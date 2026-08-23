---
title: "Typed Knowledge Graph"
date: 2026-04-14
domain: knowledge-management
maturity: emerging
source_type: practitioner
topics: [pkm, memory]
tags: [concept, knowledge-management, ai-agents, pkm, graph, architecture, domain/knowledge-management, maturity/emerging, source-type/practitioner, topic/pkm, topic/memory]
status: draft

sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
    hash: sha256:9cec05f1dcdf4fc0162cfd801b68c448df9b7ee1fa4ee94c17c5c607909ab3ff
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/rohitg00/agentmemory
    hash: sha256:68a15ff9d16ad1dc8aadffa8f18fe6ce1f1ae3285d5cf97cbb0d193ae4c4edac
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Typed Knowledge Graph

## Definition
A structured overlay on top of a markdown wiki where LLM-extracted entities (people, projects, tools, concepts, decisions) are represented as typed nodes connected by semantically typed edges (e.g., `uses`, `depends_on`, `contradicts`, `supersedes`, `caused`). Enables graph traversal queries that surface connections keyword search misses.

## Explanation
A flat markdown wiki with wikilinks is a *weak graph* — pages connect to pages, but the nature of the connection is implicit. A Typed Knowledge Graph makes structure explicit:

**Entity types:**  
- People (name, role, project ownership)  
- Projects (status, dependencies, decisions)  
- Libraries/tools (version, used_by, alternatives)  
- Concepts (definition, related_to, contradicts)  
- Decisions/ADRs (rationale, superseded_by, affects)  
- Files/modules (contains, depends_on, changed_by)

**Typed edge examples:**
```
React -[used_by]-> AuthService
AuthMigration -[depends_on]-> PostgreSQL
ADR-005 -[supersedes]-> ADR-002
Bug-2026-03 -[caused_by]-> ConfigDrift
```

**Graph traversal vs. keyword search:**  
Query: *"What's the impact of upgrading Redis?"*  
- Keyword search: finds documents mentioning Redis.  
- Graph traversal: starts at the Redis node, walks `used_by` and `depends_on` edges, surfaces every service that will be affected — including those that mention Redis only indirectly.

**Layered architecture:**  
The graph doesn't replace markdown pages — it augments them. Pages are for human reading; the graph is for navigation, discovery, and LLM-assisted query answering. The graph is typically stored as a separate `knowledge-graph.json` or embedded in frontmatter.

## Key Properties
- Entities are typed — not all nodes are the same kind of thing.
- Edges carry semantic type, confidence, and timestamp.
- Graph traversal is the primary query mechanism for relational questions.
- Extracted automatically on ingest; curated manually over time.
- Does not require a graph database — a JSON adjacency list works at small-to-medium scale.

## Relationships
- Works alongside [[knowledge-confidence-scoring]]: edges carry confidence scores derived from source evidence.
- Feeds [[hybrid-search-reciprocal-rank-fusion]]: graph traversal is the third stream alongside BM25 and vector search.
- [[agent-knowledge-schema]] defines entity types, relationship vocabularies, and extraction rules.
- [[knowledge-crystallisation]] produces structured entity-relationship digests that populate the graph.

## Applications
- **Impact analysis:** "What breaks if we change X?" — traverse `depends_on` edges from X.
- **Onboarding:** New team member asks "who owns what?" — traverse `owned_by` and `works_on` edges.
- **Contradiction detection:** When a new fact conflicts with an existing edge, flag it for [[knowledge-supersession]].
- **Cross-domain discovery:** Connections between concepts that span different wiki sections surface only via graph traversal.
- **PoC path:** Run a one-shot extraction pass across existing staging + permanent notes to produce a basic `knowledge-graph.json` (entities + typed relationships). Doesn't need a graph DB — just enough to answer "what connects to what" and validate whether graph queries find connections keyword search misses.

## Sources
- [LLM Wiki v2 — Rohit Ghumare](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) — entity extraction, typed relationships, graph traversal patterns
- [agentmemory (GitHub)](https://github.com/rohitg00/agentmemory) — reference implementation

## See Also
- [[knowledge-confidence-scoring]]
- [[hybrid-search-reciprocal-rank-fusion]]
- [[agent-knowledge-schema]]
- [[knowledge-crystallisation]]
- [[codebase-knowledge-graphs]] — domain-specific typed knowledge graph where entities are code constructs (functions, classes, modules) and edges are typed code relationships (CALLS, IMPORTS, INHERITS)
