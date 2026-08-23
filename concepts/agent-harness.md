---
title: "Agent Harness"
date: 2026-04-14
domain: ai-agents
maturity: established
source_type: practitioner
topics: [patterns, orchestration]
tags: [concept, ai-agents, architecture, infrastructure, domain/ai-agents, maturity/established, source-type/practitioner, topic/patterns, topic/orchestration]
status: draft

sources:
  - url: https://blog.langchain.com/your-harness-your-memory/
    hash: sha256:b4beea2f09ed958a24d9e2115c68f79ada87fe196542096a8c2cefaa07f6fa09
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://blog.langchain.com/the-anatomy-of-an-agent-harness/
    hash: sha256:ec5b45fc8e270eeaa1a074e13524209f6fff056e41c93584127f32fa5aad1c50
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://code.claude.com/docs/en/overview
    hash: sha256:8cc59b0c11bd1b9a81e0d772f1551638ca30175c4f69732f7a850afa51e4030d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Harness

## Definition
An **agent harness** is the system of scaffolding that surrounds a large language model (LLM), enabling it to interact with tools, manage context, persist memory, and execute multi-step tasks. It is the runtime environment that transforms a bare model into a functioning agent.

## Explanation
Agents, by definition, are LLMs that interact with tools and external data sources. That interaction requires a system around the model — and that system is the harness.

The best-known harnesses include Claude Code (Anthropic), Codex (OpenAI), OpenCode, Letta Code, Deep Agents (LangChain), and Pi (which powers [[openclaw|OpenClaw]]). When Anthropic's Claude Code source code was leaked, it contained 512,000 lines — the harness is non-trivial engineering.

A common misconception is that as models improve, harnesses will shrink away. The opposite has been observed: what the harness handles *changes*, but harnesses remain essential. Scaffolding from 2023 (e.g. simple [[retrieval-augmented-generation|RAG]] chains) has been absorbed, but it has been replaced by more sophisticated orchestration — long-horizon task management, memory compaction, tool routing, and session persistence.

Even "built-in" capabilities like web search in OpenAI/Anthropic APIs are not model capabilities — they are lightweight harnesses sitting behind the API, orchestrating the model with external APIs via tool-calling.

### What the Harness Does
- Routes tool calls and manages results
- Loads system prompts and instruction files (AGENTS.md, CLAUDE.md)
- Manages context window — what goes in, what gets compressed
- Handles compaction: deciding what survives when context fills
- Reads and writes to short-term and long-term memory stores
- Exposes skill metadata to the agent
- Controls filesystem access and working directory representation
- Manages agent identity persistence across sessions

## Key Properties
- **Scaffolding, not model weights** — the harness is code, not learned parameters
- **Persistent** — harnesses are not going away; they evolve but remain necessary
- **Memory-coupled** — managing context and memory is a core harness responsibility, not a separable plugin
- **Defines agent behaviour** — two agents using the same model but different harnesses can behave very differently
- **Open or closed** — harnesses may be open source (Deep Agents, Pi/OpenClaw) or proprietary/behind APIs (Claude Agent SDK, Claude Managed Agents)

## Relationships
- Inseparable from [[memory-as-harness]]: memory management is not a plugin — it IS a core harness function
- Creates risk of [[agent-memory-lock-in]]: closed harnesses hold memory hostage to a platform
- Related to [[react-agent-pattern]]: ReAct is one pattern an agent harness might implement
- Related to [[supervisor-agent-pattern]]: orchestration of sub-agents is a harness-level concern
- Related to [[agentic-ai-platform-architecture]]: harnesses are the runtime layer within broader agentic platform stacks
- Related to [[meta-harness-pattern]]: a meta-harness sits one layer above individual harnesses, treating them as interchangeable parts of a richer composition/governance system

## Applications
- **Platform evaluation:** When choosing an agent platform, the openness of the harness is as important as model quality — it determines memory portability and long-term lock-in risk
- **Agent development:** Understanding harness responsibilities clarifies what belongs in scaffolding vs. what belongs in model prompting
- **Context engineering:** Harness design decisions directly control what information the agent sees and when — a form of [[context-engineering|context engineering]]
- **[[multi-agent-systems|Multi-agent systems]]:** In multi-agent architectures, each sub-agent has its own harness; the supervisor coordinates via harness-level interfaces

## Sources
- [Your harness, your memory — Harrison Chase, LangChain Blog](https://blog.langchain.com/your-harness-your-memory/) — primary source; argues harnesses are inseparable from memory and will persist as agents mature
- [The anatomy of an agent harness — LangChain Blog](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) — detailed breakdown of harness components
- [Claude Code overview](https://code.claude.com/docs/en/overview) — example of a production harness (512k lines of code)

## See Also
- [[memory-as-harness]]
- [[agent-memory-lock-in]]
- [[agentic-ai-platform-architecture]]
- [[prompts-as-infrastructure]]
- [[react-agent-pattern]]
- [[managed-agent-split-plane-architecture]]: the provider-managed variant — Anthropic owns the harness loop; you own execution
- [[meta-harness-pattern]]: the layer above harnesses that provides composition, governance, and collaboration
