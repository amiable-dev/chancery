---
tags: [flashcards, ai-agents, integration, mcp, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# MCP abstraction tax — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:479191 -->
What is the "MCP abstraction tax"?
?
The argument that inserting a tool protocol between an agent and an existing system is not free — every translation layer loses fidelity relative to the underlying API — so protocol adoption should be justified by what it buys, rather than taken as the default integration path.

## Why fidelity is lost <!-- kb:card:4d6ecd -->
Why does wrapping a system in a protocol server lose fidelity relative to the underlying API?
?
The server must project the system's operations onto a fixed shape of named tools with declared schemas; anything that doesn't fit — parameter combinations, error nuance, pagination, composability — is dropped, flattened or re-encoded, and reading the projection also costs context tokens.

## CLI as the comparison point <!-- kb:card:5f9848 -->
What does a well-built command-line tool already give an agent that a protocol wrapper would add?
?
Discoverable operations through help output, structured responses, predictable error handling, and composition with everything else on the machine — without a server to run or a schema to keep synchronized.

## When the protocol earns its cost <!-- kb:card:ac9801 -->
When does adopting a protocol server actually earn its cost, according to this argument?
?
Where multi-client interoperability, an OAuth authentication boundary, or per-tenant governed access is the actual requirement.

## Tax scales with API size <!-- kb:card:af70d3 -->
How does the size and complexity of the wrapped API affect how much abstraction tax a protocol wrapper pays?
?
For a small, well-shaped API the cost is low; for a large API the wrapper becomes an incomplete reimplementation, and the agent ends up working against the wrapper's model of the system rather than the system itself.
