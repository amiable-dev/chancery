---
tags: [flashcards, knowledge-management, knowledge-graph, ai-agents, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Typed knowledge graph layer — Flashcards

#flashcards/knowledge-management

## Typed knowledge graph layer: definition <!-- kb:card:b0e7fb -->
What is a typed knowledge graph layer?
?
A structure extracted at ingest time that augments a prose knowledge base: entities (people, projects, libraries, concepts, files, decisions) get types and attributes, and their connections become semantically distinct edges (uses, depends on, contradicts, caused, fixed, supersedes) that queries can traverse instead of keyword-matching.

## Typed edges vs plain wikilinks <!-- kb:card:46b171 -->
How does a typed edge differ from an ordinary wikilink?
?
A wikilink only says A relates to B; a typed edge can say 'A caused B, confirmed by 3 sources, confidence 0.9' — a claim a query can act on.

## When the graph is extracted <!-- kb:card:f7fe83 -->
When does entity and relationship extraction happen, and why does that matter?
?
During ingest — the model emits entities and relationships alongside the prose it writes — so the graph stays current without separate modeling work.

## Traversal example: impact query <!-- kb:card:ec343f -->
How does the graph answer a question like 'what is the impact of upgrading Redis'?
?
The system starts at the Redis node and walks outward through depends-on and uses edges to find everything downstream — catching structural connections that keyword search misses because they aren't textual.

## Graph augments, doesn't replace, the wiki <!-- kb:card:c2baff -->
What is the division of labor between the wiki's pages and the typed graph layer?
?
Pages remain the layer for reading; the graph carries navigation and discovery — the graph augments the wiki rather than replacing it.
