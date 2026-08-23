---
tags: [flashcards, ai-agents, protocols, multi-agent]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Agent-to-Agent (A2A) Protocol — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:b4c5b4 -->
What is the Agent-to-Agent (A2A) Protocol?
?
An open protocol by Google (2025) for standardising communication between AI agents. A2A enables one agent to discover another's capabilities, delegate tasks, exchange context, and receive results — making multi-agent systems interoperable across vendors and frameworks.

## Discovery <!-- kb:card:42b10a -->
How does A2A capability discovery work?
?
Via an **Agent Card** — a JSON manifest served at `/.well-known/agent.json`. It declares the agent's identity, capabilities, supported modalities, and authentication requirements. Any client can fetch it over HTTP; no pre-registration required.

## Task Lifecycle <!-- kb:card:daab4b -->
What is the A2A task lifecycle?
?
1. Client fetches Agent Card to discover capabilities
2. Client creates a Task (`POST /tasks/send` or `/tasks/sendSubscribe` for streaming)
3. Remote agent executes and returns status updates + artifacts
4. Client uses artifacts or passes them to the next agent

## Relationship <!-- kb:card:caae61 -->
How do MCP and A2A differ?
?
**MCP** is for agent → tool/data (what the agent can *do*)
**A2A** is for agent → agent (how agents *delegate to each other*)
They are complementary: MCP for tool invocation; A2A for task delegation.

## Application <!-- kb:card:001c52 -->
When would you use A2A instead of a custom API for agent coordination?
?
When you want interoperability across vendor boundaries (e.g., a LangGraph agent delegating to a Google ADK agent), or when you want standardised discovery, authentication, and streaming without building custom protocols. A2A's Agent Card + Task model handles long-running async work cleanly.

## Governance & Maturity (2026 update) <!-- kb:card:9eca4b -->
What changed with A2A's v1.0 release (April 2026), and who governs the protocol now?
?
A2A moved to **Linux Foundation** governance (June 2025) and shipped **v1.0** in April 2026 with: **signed Agent Cards** (cryptographic identity verification via `AgentCardSignature`), an **agent directory**, and **AP2 payments** integration. 150+ member organisations (up from ~50 a year prior), 22,000+ GitHub stars, SDKs in Python/JavaScript/Java/Go/C#, and real enterprise production deployments — materially more mature than its "early Google proposal" origin.
