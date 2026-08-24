---
title: Search-first discovery for agentic resources
date: 2026-08-24
tags:
  - concept
  - ai-agents
  - mcp
  - architecture
  - discovery
status: draft
sources:
  - url: https://agenticresourcediscovery.org/spec/
  - url: https://github.com/ards-project/ard-spec
---

# Search-first discovery for agentic resources

## Definition

Search-first discovery for agentic resources is the practice of treating callable AI capabilities, tools, MCP servers, skills, agents, as things a client discovers dynamically through an external search or index at the moment they are needed, rather than as a fixed list the client must pre-install or hold entirely inside the model's own context window before it can act.

## Explanation

The pattern responds to a specific scaling failure: the conventional approach of injecting every available tool's description into the LLM's context window works for a handful of tools but breaks down as the number of installable capabilities grows toward the thousands, both because the token cost of listing them all becomes prohibitive and because a model's ability to pick correctly among many similar descriptions degrades well before the context window itself fills up. Search-first discovery moves that selection problem out of the model and into a dedicated external service: the service indexes capability descriptions ahead of time, often with richer signals than a short tool description could carry, such as representative example queries, publisher identity, or usage patterns, and answers a natural-language or structured query with a short, ranked list of matching capabilities, so the model's context only ever holds the few results relevant to the current request instead of the entire catalog. This is the same shift that turned early hand-curated web directories into search engines: a directory that must be browsed in full does not scale past a few hundred entries, while a search index scales because relevance ranking, not exhaustive enumeration, is what selects the right entry.

## Key Properties

- Capability selection happens outside the model, in an external search or index service, instead of by listing every option inside the context window
- The index can carry richer selection signals, such as representative queries, publisher identity and usage history, than a short in-context tool description could afford
- Scales with catalog size the way a search engine scales past a directory: relevance ranking replaces exhaustive enumeration
- A client discovers a capability only when it is needed for the current request, rather than holding a fixed, pre-installed list

## Relationships

- [[domain-anchored-federated-identifiers]] — search-first discovery needs a stable way to name what it finds across independent registries; domain-anchored identifiers are the naming scheme this specification pairs with search-first discovery so results stay portable across federated indexes.

## Applications

Deciding when to stop listing every available tool in an agent's system prompt and instead stand up or query an external capability-search service: once the tool count grows past what a model can reliably choose among in-context, index capabilities externally with richer selection signals and let the model issue a query instead of holding the full list; useful for any platform whose available tools, skills or sub-agents grow faster than the context window can absorb.

## Sources

- https://agenticresourcediscovery.org/spec/
- https://github.com/ards-project/ard-spec

## See Also

- [[domain-anchored-federated-identifiers]]
