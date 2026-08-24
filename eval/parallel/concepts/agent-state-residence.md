---
title: Agent state residence
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, architecture, scaling, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/stateful-vs-stateless-agent-design-tradeoffs-for-scalable-agentic-systems/
    hash: sha256:89d984d4ba5d9c18c0f1dac5c761c91ab5ed41ac9a4d00410d00106e52503068
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Agent state residence

## Definition

**Agent state residence** is the choice of where an agent's conversation state physically lives — resent by the caller on every turn, or held by the agent behind a session identifier in a store it owns — a few lines of application code that decide whether the service scales by adding interchangeable instances or requires a persistence tier on the path of every request.

## Explanation

In the client-held arrangement the handler rebuilds the message list from scratch on each call: a system prompt, whatever transcript the caller passed in, then the new message; it invokes the model, returns the reply, and retains nothing. Any instance can therefore answer any request and ordinary round-robin routing is sufficient, but the caller must resend the whole conversation every turn, so request payload and prompt tokens grow with conversation length and per-turn cost climbs steadily through a session. In the server-held arrangement the caller sends only a session id and the new message; the handler loads that session's history from a store, appends, calls the model, appends the reply, and writes back. The client payload stays flat, and because the server now owns the transcript it can trim or summarise it in place instead of forcing the client to resend a growing history, and it can suspend a run mid-flight — waiting on a tool, an external system, or a human approval — and resume it later. What that buys is paid for in topology: a database is now on every turn's critical path, and if the history is kept in the process that happened to serve earlier turns rather than in shared storage, horizontal scaling produces stranded sessions, an amnesia visible only to the unlucky user routed to a different node. The decision rule is a match between workflow and infrastructure — client-held for single-turn task pipelines such as extraction, summarisation or classification, where the lightweight architecture is genuinely enough; server-held for long-running assistants and multi-turn conversations, where resending everything is the greater cost. The source is a tutorial whose two short implementations, one function-local and one backed by a keyed table, illustrate the tradeoff rather than measure it; the model provider and free-tier details in it are incidental to the pattern.

## Key Properties

- Client-held state: every instance is interchangeable, but the full transcript is resent per turn and prompt tokens grow with the conversation
- Server-held state: the caller sends a session id and one message; the server reads, appends, calls, appends and writes back
- Only server-held state permits server-side trimming or summarisation and suspension around tools or human approval
- Server-held state puts a store on the critical path of every turn; keeping it process-local strands sessions on the node that served earlier turns
- A code-level decision that fixes deployment shape — load balancing, sticky routing and whether a shared cache tier is required

## Relationships

- [[mcp-stateless-core]] — applies the client-held side of this choice at the protocol layer — MCP drops the session so any instance can serve any call, and makes what would have been hidden session state an explicit handle the model passes back as an argument
- [[agent-checkpoint-resume]] — is what the server-held side becomes for workflows spanning days — durable state stops being a replayed transcript and becomes an explicit state machine, which is how a stored session survives restarts without the history growing without bound
- [[memory-as-harness-capability]] — argues the deeper version of this decision — where state lives is only the first of the context-management choices that produce an agent's memory, and none of them can be bolted on from outside the harness
- [[opaque-agent-interop]] — the peer-opacity A2A-style opaque interop guarantees is exactly about not exposing whichever state-residence choice — resent each turn or held behind a session id — an interoperating agent has made internally.
- [[server-driven-ui]] — server-driven UI and state residence share a resent-not-remembered architecture applied at different layers — a stateless renderer trades a per-request payload for no persistence tier on the receiving side, the same way a caller-resends design keeps a service instance stateless.

## Applications

Choosing between a stateless request handler and a session store when putting an agent behind a load balancer; diagnosing conversations that lose their history under horizontal scaling; deciding where to place summarisation when a long chat outgrows its context window.

## Sources

- https://machinelearningmastery.com/stateful-vs-stateless-agent-design-tradeoffs-for-scalable-agentic-systems/

## See Also

- [[mcp-stateless-core]]
- [[agent-checkpoint-resume]]
