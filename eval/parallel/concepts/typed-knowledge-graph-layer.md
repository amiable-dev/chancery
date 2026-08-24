---
title: Typed knowledge graph layer
date: 2026-08-24
tags:
  - concept
  - knowledge-management
  - knowledge-graph
  - ai-agents
status: draft
sources:
  - url: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
---

# Typed knowledge graph layer

## Definition

A **typed knowledge graph layer** augments a prose knowledge base with structure extracted at ingest time: people, projects, libraries, concepts, files and decisions become entities with types and attributes, their connections become semantically distinct edges such as uses, depends on, contradicts, caused, fixed and supersedes, and queries can traverse the graph instead of matching keywords — pages remain the layer for reading while the graph carries navigation and discovery.

## Explanation

The mechanism is replacing untyped links with edges that mean something. A wikilink says only that A relates to B; a typed edge can say 'A caused B, confirmed by 3 sources, confidence 0.9', which a query can act on. Extraction happens during ingest — the model emits entities and relationships alongside the prose it writes — so the graph stays current without separate modeling work. Traversal is what pays for the structure: asked the impact of upgrading Redis, the system starts at the Redis node and walks outward through depends-on and uses edges to find everything downstream, catching connections keyword search misses because they are structural rather than textual. The layer explicitly augments rather than replaces the wiki's pages — the same division found in code tooling, where prose and diagrams serve reading while graphs serve exact structural questions. The source is a practitioner extension gist mirroring what its author built in agentmemory, a memory engine for coding agents; the design is asserted from production use, not from a controlled comparison.

## Key Properties

- Entities extracted at ingest — people, projects, libraries, concepts, files, decisions — each with a type and attributes
- Edges are typed (uses, depends on, contradicts, caused, fixed, supersedes) and can carry provenance and confidence
- Impact queries walk the graph outward from a node instead of keyword-searching pages
- Augments pages rather than replacing them: pages for reading, graph for navigation and discovery

## Relationships

- [[llm-wiki-architecture]] — upgrades that architecture's flat wikilinked pages by layering typed entities and edges over the wiki, so navigation and impact queries stop depending on untyped links alone
- [[code-knowledge-graph]] — applies the same construction — typed nodes and typed edges answering structural questions by traversal — to a general knowledge corpus instead of a codebase
- [[hybrid-search-fusion]] — supplies the graph-traversal stream that hybrid search fuses with keyword and vector results

## Applications

Impact analysis over accumulated project knowledge, such as what depends on a library or what a decision caused; entity pages that stay consistent because relationships are data rather than prose; traversal-based context assembly for agent queries.

## Sources

- https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2

## See Also

- [[code-knowledge-graph]]
- [[llm-wiki-architecture]]
