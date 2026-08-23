---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- knowledge-management
- ai-agents
- pkm
- graph
---


# Typed Knowledge Graph — Flashcards

#flashcards/knowledge-management


## Definition <!-- kb:card:806ea5 -->
What is a Typed Knowledge Graph in an LLM wiki context?
?
A structured overlay on markdown pages where LLM-extracted entities (people, projects, tools, concepts, decisions) are typed nodes connected by semantically typed edges (`uses`, `depends_on`, `contradicts`, `supersedes`, etc.). Enables graph traversal queries that surface relational connections keyword search misses.

## Application <!-- kb:card:1083df -->
When does graph traversal outperform keyword or vector search?
?
For relational queries — "what's the impact of upgrading Redis?", "what depends on service X?", "who owns the auth migration?" Graph traversal starts at a node and walks typed edges outward, finding downstream dependencies and connections that may not mention the search term explicitly.

## Relationship <!-- kb:card:596b76 -->
How does the Typed Knowledge Graph relate to wiki pages?
?
The graph augments pages, not replaces them. Pages are for human reading; the graph is for navigation and discovery. The graph is typically stored as `knowledge-graph.json` or in frontmatter, alongside the human-readable markdown.

## Key distinction <!-- kb:card:be1039 -->
What makes a knowledge graph "typed" vs. a standard wikilink graph?
?
Edge semantics. A standard wikilink says "A relates to B." A typed edge says "A depends_on B (confidence: 0.9, confirmed: 2026-03-15, sources: 3)." The type, confidence, and timestamp are what enable impact analysis, contradiction detection, and weighted traversal.
