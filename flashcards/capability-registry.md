---
tags: [flashcards, ai-agents, protocols, discovery, infrastructure]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# Capability Registry (Agentic) — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:b5fc56 -->
What is a capability registry in the ARD ecosystem?
?
An indexing and search service that crawls published AI Capability Catalogs, indexes their contents, and responds to agent discovery queries — returning matching capabilities alongside the trust metadata needed to verify the publisher before connecting. It is the search engine layer of the agentic web.

## Query Modes <!-- kb:card:ad4241 -->
What are the two ways an agent can resolve a capability in ARD?
?
1. **Registry query** — Submit a natural language intent query to a registry; it returns ranked matches from its index
2. **Direct domain fetch** — Bypass all registries and fetch `/.well-known/ai-catalog.json` directly from a known partner's domain

## What a Registry Returns <!-- kb:card:7016df -->
What does a registry return in response to a discovery query?
?
Matching capabilities *and* the trust metadata (trust manifest) required to verify the publisher's identity before connecting. The registry doesn't just find matches — it propagates the data needed for cryptographic verification.

## Enterprise Registry Features <!-- kb:card:0d5c3b -->
What additional features does Google Cloud's Agent Registry (enterprise ARD implementation) provide on top of basic discovery?
?
- Globally unique namespaced URNs for capabilities
- Agentic egress policies (which agents can call which capabilities)
- Tool pinning (lock to a specific capability version for compliance)
- Agent Identity integration for cryptographic publisher verification
- HIPAA and enterprise compliance enforcement

## Application <!-- kb:card:b50ef8 -->
Give an example of how a registry enables runtime capability discovery.
?
A production incident agent receives a page about a database anomaly. It has no pre-configured tool for the relevant database. It queries a registry with "database performance diagnostics for PostgreSQL" → registry returns two verified capabilities from trusted publishers → agent verifies their trust manifests → agent connects to the best match at runtime, without any hardcoded configuration.

## Analogy <!-- kb:card:81e5e8 -->
What familiar concept best captures the role of a capability registry?
?
A web search engine. Just as Google crawls publicly published web pages and makes them searchable, a capability registry crawls publicly published AI catalogs and makes capabilities searchable by intent. Multiple registries can coexist, each with their own indexing policies — just like Bing and DuckDuckGo index the same web independently.
