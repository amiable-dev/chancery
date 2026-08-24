---
tags: [flashcards, ai-agents, mcp, architecture, discovery]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Search-first discovery for agentic resources — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:788a85 -->
What is search-first discovery for agentic resources?
?
Treating callable AI capabilities (tools, MCP servers, skills, agents) as things a client discovers dynamically via external search at the moment needed, rather than as a fixed list pre-loaded into the model's context.

## Scaling failure it solves <!-- kb:card:7b5ef7 -->
Why does listing every tool description in the context window break down as tool count grows?
?
The token cost becomes prohibitive, and a model's ability to pick correctly among many similar descriptions degrades well before the context window itself fills up.

## Where selection moves <!-- kb:card:c72b2c -->
Where does capability selection happen under search-first discovery, instead of inside the model?
?
In a dedicated external search or index service that indexes capability descriptions ahead of time and returns a short, ranked list matching a query.

## Richer signals <!-- kb:card:0738c1 -->
What richer selection signals can an external index carry that a short in-context tool description cannot?
?
Representative example queries, publisher identity, and usage patterns.

## Historical analogy <!-- kb:card:6afc40 -->
What earlier shift in web technology is search-first agent discovery analogous to?
?
The shift from hand-curated web directories, which don't scale past a few hundred entries, to search engines, where relevance ranking rather than exhaustive enumeration selects the right entry.

## Companion naming scheme <!-- kb:card:39a29f -->
What does search-first discovery need alongside a search/index service to keep results portable across federated indexes?
?
A stable naming scheme, domain-anchored federated identifiers, so discovered capabilities can be named consistently across independent registries.
