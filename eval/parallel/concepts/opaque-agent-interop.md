---
title: Opaque agent interoperability
date: 2026-08-24
domain: standards
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, protocols, interoperability, domain/standards, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://github.com/a2aproject/A2A
    hash: sha256:36485094246969fd98c7aefaafb29265226126d3bc32572bf114f02e976ceeba
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Opaque agent interoperability

## Definition

**Opaque agent interoperability** is the design stance that autonomous agents built by different parties on different frameworks should collaborate as peers — discovering each other's capabilities, negotiating how to interact, and working jointly on long-running tasks — while each keeps its internal state, memory, reasoning, and tool implementations entirely private; the Agent2Agent protocol (A2A) is its reference instantiation, an Apache-licensed open protocol contributed by Google and governed under the Linux Foundation.

## Explanation

The distinguishing choice is what crosses the boundary. In tool-style integration the caller drives an instrument it fully understands and controls; between opaque peers only task intent, negotiated modalities, and results cross, so neither side needs to expose proprietary logic or grant access to the other's memory. Four mechanisms make that workable in A2A. Discovery runs through an Agent Card, a published descriptor of what an agent can do and how to reach it, so capability lookup does not require a private integration; the roadmap adds authorization schemes and optional credentials to the card, plus a query for skills the card did not anticipate. Transport is JSON-RPC 2.0 over HTTPS, deliberately unremarkable so existing infrastructure applies. Interaction supports three shapes — synchronous request and response, server-sent-event streaming, and asynchronous push notification — because peer work is often long-running and cannot be held open in one request. Payloads carry text, files, and structured JSON, with modality negotiation for forms and media. Two honest caveats: opacity is a property of what the protocol requires, not a guarantee it enforces, and its cost is inspectability — a caller that cannot see a peer's reasoning must build trust from outputs and task lifecycle rather than from traces, which makes evaluation and debugging across an agent boundary materially harder. The source is the project's own README, so treat its ecosystem claims as self-description; the specification and six language SDKs are public and checkable.

## Key Properties

- Peers exchange task intent, modality negotiation, and results — never internal state, memory, or tool implementations
- Agent Cards publish capabilities and connection details, making discovery a lookup rather than a bespoke integration
- JSON-RPC 2.0 over HTTPS with three interaction shapes: synchronous, SSE streaming, and asynchronous push
- Long-running tasks are first-class, which is why streaming and push exist alongside request/response
- Opacity is required-nothing, not enforced-privacy, and it costs cross-boundary inspectability
- Open governance: Apache 2.0, Linux Foundation stewardship, SDKs in Python, Go, JS, Java, .NET, and Rust

## Relationships

- [[mcp-stateless-core]] — sits at the complementary layer — that protocol standardises how one agent reaches tools and context it controls, whereas this one standardises collaboration with a peer that stays a black box, and the two make opposite bets on state, since A2A makes the long-running task explicit where MCP removed protocol sessions entirely
- [[server-sent-events]] — is the streaming transport it uses to push incremental progress on tasks that outlive a single request/response exchange
- [[mcp-tool-poisoning]] — names the risk an Agent Card inherits, because any self-published capability descriptor that a remote agent reads is an untrusted string entering a model's context
- [[agent-state-residence]] — the peer-opacity A2A-style opaque interop guarantees is exactly about not exposing whichever state-residence choice — resent each turn or held behind a session id — an interoperating agent has made internally.
- [[harness-memory-lock-in]] — A2A-style opaque interop and harness memory lock-in frame the identical architectural fact from opposite sides — that an agent's memory lives inside its own harness rather than being externally visible is opaque interop's deliberate feature and lock-in's risk.

## Applications

Composing multi-vendor agent systems where a specialist agent must be invoked without exposing its prompts or data — cross-organisation workflows, agents from different frameworks orchestrated sequentially or hierarchically — and exposing an existing agent as a callable peer by publishing an Agent Card and serving the protocol.

## Sources

- https://github.com/a2aproject/A2A

## See Also

- [[mcp-stateless-core]]
- [[server-sent-events]]
- [[mcp-tool-poisoning]]
