---
title: MCP abstraction tax
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, integration, mcp, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    hash: sha256:52b9aa4d85844d1297a66a66f03904fc0d72fc860de4eb0fb9196fe3e6f1e8c7
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# MCP abstraction tax

## Definition

The **MCP abstraction tax** is the argument that inserting a tool protocol between an agent and an existing system is not free: every layer of translation loses fidelity relative to the underlying API, and the losses compound with the complexity of what is being wrapped — so protocol adoption should be justified by what it buys, typically structured tool contracts, an authentication boundary and governed multi-tenant access, rather than adopted as the default integration path.

## Explanation

The mechanism of the loss is straightforward once stated: a protocol server must project a system's operations onto a fixed shape of named tools with declared schemas, and everything the original interface expressed that does not fit that projection — parameter combinations, error nuance, pagination behaviour, composability — is either dropped, flattened or re-encoded, at the cost of context tokens the agent spends reading the projection. For a small, well-shaped API this costs little; for a large one the wrapper becomes an incomplete reimplementation, and the agent works against the wrapper's model of the system rather than the system. The comparison that makes this concrete is that a competently built command-line tool already gives an agent most of what a protocol server would: discoverable operations through help output, structured responses it can parse, predictable error handling, and composition with everything else on the machine, without a server to run or a schema to keep synchronized. That is why the caution arrives beside the rise of skills and CLI-driven agents rather than as an isolated opinion. The claim is not that the protocol is wrong — it earns its place where interoperability across many clients, an OAuth boundary or per-tenant governance is the actual requirement — but that the question of whether protocol-level interoperability is needed at all should be asked before the wrapper is written. The source is Thoughtworks' Technology Radar placing the practice in its caution ring, an editorial judgement drawn from engagements and from named practitioner essays it cites rather than from measurement.

## Key Properties

- Every protocol layer between an agent and an API loses fidelity, and the loss grows with the wrapped API's complexity
- The projection into named tools with fixed schemas also costs context tokens the agent must spend reading it
- A CLI with good help output, structured responses and predictable errors covers many of the same needs with no server
- The protocol earns its cost where multi-client interoperability, an auth boundary or multi-tenant governance is the real requirement
- The stance is default-off, not rejection: ask what interoperability is needed before wrapping

## Relationships

- [[code-mode-mcp]] — attacks the same overhead from inside the protocol — having the model write code against tool definitions keeps the surface out of context, which is the in-protocol answer to the cost this caution answers by not adopting the protocol at all
- [[mcp-attack-surface-taxonomy]] — prices the other half of the decision — adopting a server by default also adopts the categories of exposure that taxonomy enumerates, so the governance benefit has to outweigh a governance burden as well as a fidelity loss
- [[agent-tool-ergonomics]] — tool ergonomics names the design failure the MCP abstraction tax describes, in ergonomic terms — a poorly justified protocol wrapper is exactly the kind of translation layer that fails to return the smallest high-signal result an agent needs.

## Applications

Deciding whether to expose an internal system to agents as a protocol server or as a documented CLI; reviewing a proposed integration layer for what it actually adds over the API it wraps; trimming an agent's tool surface when context cost outweighs the convenience of a wrapper.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- [[code-mode-mcp]]
- [[mcp-attack-surface-taxonomy]]
