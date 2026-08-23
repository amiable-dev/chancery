---
title: "Agent-to-Agent (A2A) Protocol"
aliases: ["Agent-to-Agent (A2A) Protocol"]
date: 2026-04-15
domain: standards
maturity: established
source_type: vendor-doc
topics: [protocols, multi-agent]
tags: [concept, ai-agents, protocols, multi-agent, google, domain/standards, maturity/established, source-type/vendor-doc, topic/protocols, topic/multi-agent]
status: draft
sources:
  - url: https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
    hash: sha256:55f07564b0ccc171b138511c32ec95c934d491c38382df24f5f413aa16f502ae
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/google-a2a/A2A
    hash: sha256:36485094246969fd98c7aefaafb29265226126d3bc32572bf114f02e976ceeba
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent-to-Agent (A2A) Protocol

## Definition
An open protocol, originated by Google (April 2025) and transferred to **Linux Foundation governance** (June 2025), for standardising communication, task delegation, and capability discovery between AI agents. A2A defines how one agent (client agent) discovers another agent's capabilities, submits tasks, exchanges context, and receives results — enabling interoperable multi-agent systems that can coordinate across vendors, frameworks, and deployment environments. As of **v1.0** (April 2026), A2A is vendor-neutral with 150+ member organisations and real enterprise production use — materially more mature than the "early Google proposal" framing suggests.

> [!note] 2026-07-27 update
> Confirmed current per [[llms-txt|the agent-readable-web research]]: Linux Foundation governance, v1.0 shipped April 2026 with signed Agent Cards, an agent directory, and AP2 payments integration. SDKs now span Python, JavaScript, Java, Go and C#; 22,000+ stars on the core repo. Discovery has moved to a signed `.well-known/agent-card.json` manifest (see Signed Agent Cards below) — treat the plain `/.well-known/agent.json` description further down as the pre-v1.0 baseline.

## Explanation
Where [[model-context-protocol|MCP]] standardises how agents connect to *tools and data*, A2A standardises how agents connect to *each other*. The two protocols are complementary: MCP for tool invocation, A2A for agent delegation.

**Core A2A concepts:**

- **Agent Card** — a JSON manifest (served at `/.well-known/agent.json`) declaring an agent's identity, capabilities, supported modalities, and authentication requirements. Discovery is HTTP-based; any client can fetch it.
- **Task** — the fundamental unit of delegation. A client agent creates a Task with an input message and receives status updates and artifacts as the remote agent works.
- **Message** — the communication primitive. Messages carry `Parts`: text, files (binary/URI), or structured data. Multi-modal by design.
- **Artifact** — the output of a completed Task. May be streaming (for long-running work) or final.
- **Push notifications** — for long-running Tasks, the remote agent pushes updates rather than requiring polling.

**Interaction lifecycle:**
1. Client discovers agent via Agent Card (or a registry)
2. Client creates a Task (`POST /tasks/send` or `/tasks/sendSubscribe` for streaming)
3. Remote agent executes and returns status + artifacts
4. Client uses artifacts or passes them to the next agent in a workflow

**Key design decisions:**
- **HTTP/JSON-based** — fits existing enterprise infrastructure; no custom transport required
- **Opaque task execution** — remote agents don't expose internals; A2A is about the interface, not implementation
- **Authentication-aware** — Agent Card declares supported auth schemes (OAuth2, API key, etc.)
- **Enterprise-ready** — designed for production deployments with enterprise auth, [[observability|observability]] hooks, and compliance in mind

A2A launched as an open specification with backing from 50+ technology partners (Atlassian, Box, Salesforce, ServiceNow, etc.) and is supported by Google ADK, LangGraph, and CrewAI. By its April 2026 v1.0 release, the Linux Foundation reported 150+ supporting organisations (up from ~50 a year earlier) and enterprise production deployments across supply chain, financial services, insurance, and IT operations.

**v1.0 additions (April 2026):**
- **Signed Agent Cards** — Agent Cards can now be cryptographically signed (an `AgentCardSignature` field) for identity verification across organisational boundaries, closing the provenance gap that A2A previously lacked and that the skills/plugins ecosystem still lacks.
- **Agent directory** — a registry layer for discovering signed Agent Cards beyond direct point-to-point fetch (operational status not independently confirmed as of this update).
- **AP2 payments integration** — agent-to-agent payment flows layered on top of task delegation.
- **Multi-protocol support and enterprise multi-tenancy**, plus a defined migration path for pre-v1.0 adopters.

## Key Properties
- **Peer-to-peer by design** — no central broker required; agents talk directly via HTTP
- **Transport independence** — works over standard HTTPS; no specialised messaging infrastructure needed
- **Capability-first discovery** — Agent Cards enable runtime capability negotiation, not hard-coded dependencies
- **Streaming-native** — Server-sent events support real-time artifact delivery for long-running tasks
- **Modality-agnostic** — text, files, images, structured data all expressible as Parts
- **Complementary to MCP** — A2A handles agent↔agent; MCP handles agent↔tool

## Relationships
- Complements [[model-context-protocol|MCP]]: MCP for tools/data, A2A for agent delegation — both address different integration boundaries
- Enables [[multi-agent-systems]]: A2A is the coordination protocol that makes heterogeneous multi-agent collaboration practical
- Related to [[agentic-ai-platform-architecture]]: A2A coordination is the inter-agent communication mechanism in Layer 1 (orchestration)
- Related to [[supervisor-agent-pattern]]: supervisor agents delegate to sub-agents; A2A is one way that delegation can be standardised
- Related to [[human-in-the-loop-pattern]]: A2A tasks can include human approval steps via push notifications and task status transitions

## Applications
- **Cross-vendor agent pipelines:** A research agent (Anthropic-based) delegates a data processing subtask to a specialist agent (Google-based) — A2A provides the common interface
- **Enterprise agent marketplaces:** Organisations publish internal specialist agents with Agent Cards; orchestrators discover and delegate at runtime
- **Homelab multi-agent:** Autobot delegating research tasks to Hermes via A2A would give both agents a standard, observable interface instead of custom NATS conventions
- **Long-running workflow coordination:** A2A's streaming artifacts and push notifications handle tasks that take minutes or hours without polling overhead

## Study

> [!tip] Flashcards
> [[flashcards/agent-to-agent-protocol|Review flashcards for this concept]]

## Sources
- [Introducing the Agent2Agent Protocol (Google)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) — official announcement, April 2025
- [A2A GitHub Repository](https://github.com/google-a2a/A2A) — open specification and reference implementations

## See Also
- [[model-context-protocol]]
- [[multi-agent-systems]]
- [[supervisor-agent-pattern]]
- [[agentic-ai-platform-architecture]]
- [[human-in-the-loop-pattern]]
- [[agentic-resource-discovery]] — ARD provides the discovery layer that helps agents *find* A2A endpoints before connecting
- [[llms-txt]] — the counter-example: an ungoverned convention with no citation effect, contrasted with A2A's formally-governed, production-adopted trajectory
