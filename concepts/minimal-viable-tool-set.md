---
title: "Minimal Viable Tool Set"
date: 2026-04-29
domain: ai-agents
maturity: established
source_type: practitioner
topics: [patterns, context-engineering]
tags: [concept, ai-agents, llm, tools, architecture, design, context, domain/ai-agents, maturity/established, source-type/practitioner, topic/patterns, topic/context-engineering]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/engineering/writing-tools-for-agents
    hash: sha256:5bce9bf3c33fd92faf6d1a9b6d7d681d209ca37bd227070edd7a44da930f9735
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Minimal Viable Tool Set

## Definition
**Minimal viable tool set** is the principle that an agent should be equipped with the smallest set of well-defined, non-overlapping tools sufficient to accomplish its task domain — and no more. Each tool should have a clearly distinct purpose, self-contained behaviour, and unambiguous decision criteria for when to invoke it.

## Explanation
Tools define the contract between an agent and its action/information space. Well-designed tools are one of the most leverage-dense investments in agent architecture — they determine what the agent *can* do and, critically, *how confidently it can decide what to do next*.

The failure mode is **tool bloat**: providing an agent with a large, overlapping set of tools in the hope that more options will improve coverage. In practice, this degrades performance in two ways:
1. **Decision confusion:** When multiple tools could plausibly handle the same situation, the model must reason about the decision. This costs attention and increases error rates.
2. **Context cost:** Tool definitions consume tokens in the context window. More tools = less room for task-relevant information.

Anthropic's heuristic: *"If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better."*

### Principles for tool design
- **Single responsibility** — each tool does one thing, clearly defined
- **Non-overlapping** — no two tools should plausibly apply to the same input
- **Robust error handling** — tools should fail gracefully and return useful error messages
- **Token efficiency** — tool outputs should be minimal by default; avoid returning full objects when summaries suffice
- **Descriptive parameters** — parameter names and descriptions should be unambiguous and play to the model's strengths (prefer semantic names over positional conventions)
- **Model-aligned interface** — tools designed with language model cognition in mind (not just human API conventions)

### The curation mindset
Building a minimal viable tool set is an active curation process, not a "more is better" accumulation. Start with the minimum tools needed to accomplish the task, observe where the agent gets stuck or makes wrong tool choices, then add targeted tools for demonstrated gaps — not anticipated ones.

## Key Properties
- **Curated, not exhaustive** — deliberately minimal; additions require justification
- **Decision-unambiguous** — every tool has a clear decision boundary; no tool should compete with another for the same situation
- **Maintenance-friendly** — fewer tools means fewer interfaces to keep updated, fewer edge cases, and cleaner context pruning
- **Context-efficient** — compact tool set leaves more tokens for task-relevant information

## Relationships
- Core principle within [[context-engineering]]: tool design is a context management concern, not just a capability concern
- Tools are one of the components of [[attention-budget]] expenditure — every tool definition costs tokens
- Related to [[mcp-tool-patterns]]: MCP tools follow the same design principles but over a protocol layer
- Related to [[react-agent-pattern]]: in ReAct loops, tool decision quality directly determines reasoning quality at each step
- Related to [[constrained-agent-actions]]: minimal tool sets are a form of agent action constraint — limiting the action space reduces errors

## Applications
- **Agent bootstrap:** When designing a new agent, enumerate the minimum viable tool set before writing any code — treat tool design as an upfront architecture decision
- **Tool audits:** Periodically review the tool set for tools that are never used, rarely used, or frequently confused with each other
- **Multi-tool disambiguation:** When two tools overlap, either merge them into one, or add explicit disambiguation rules to the system prompt
- **Output minimisation:** Configure tools to return summaries by default, with a `verbose` or `detail` parameter for when full output is needed

## Sources
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — primary source; tool bloat as a top failure mode
- [Writing tools for AI agents – with AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/writing-tools-for-agents) — companion piece on tool design principles

## See Also
- [[context-engineering]]
- [[attention-budget]]
- [[mcp-tool-patterns]]
- [[react-agent-pattern]]
- [[constrained-agent-actions]]
