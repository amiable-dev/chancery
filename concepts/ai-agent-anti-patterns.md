---
title: "AI Agent Anti-Patterns"
date: 2026-07-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, multi-agent, orchestration]
tags: [concept, ai-agents, architecture, anti-patterns, production, reliability, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/multi-agent, topic/orchestration]
status: draft
sources:
  - url: https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/
    hash: sha256:98569296763f146a6a01b895405a16ace647694b25d45fc669dcf276959a559b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/news/building-effective-agents
    hash: sha256:a1f2257ff438964f64caa04bbfd0b5cc1f93f3236202a67412a5990369e3433a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# AI Agent Anti-Patterns

## Definition
A catalogue of recurring architectural and operational design mistakes that cause AI agent projects to fail in production. The core thesis: agent failures are rarely caused by the underlying model — they are caused by architecture, memory design, tooling decisions, and *how complexity gets introduced* over the project's lifetime. Anti-patterns split into two categories: **architectural** (baked in at design time — premature multi-agent systems, overloaded single agents, tool sprawl, hardcoded logic, missing memory design) and **operational** (only surface in production — no observability, ungoverned write access, context drift, deploying without evaluation).

## Explanation
Agentic systems fail differently from simple prompt-and-response systems, and that difference is *why* these anti-patterns matter more for agents than for chatbots. A chatbot's bad answer ends the interaction. An agent's bad decision mid-task keeps executing: it can call a tool with malformed parameters, write corrupted state that a later step depends on, or loop indefinitely because it cannot recognize it is stuck. See [[agentic-error-compounding]] for the underlying mechanism.

The nine anti-patterns identified (Machine Learning Mastery, 2026):

**Architectural:**
1. **Multi-agent architecture too soon** — teams design toward orchestrators and peer-to-peer coordination before validating whether a single agent solves the problem. Fix: start with one agent, add [[multi-agent-systems|multi-agent architecture]] only when measured data justifies the added coordination overhead.
2. **One agent doing everything** — a single agent with fifteen tools and sprawling instructions underperforms across all its responsibilities because optimizing for one input type hurts performance on others. Fix: narrow scope first, specialize before scaling, route inputs to specialized agents.
3. **Tool list sprawl** — every tool added is a tool the model must reason about on every turn; overlapping tools increase the odds of a bad choice and inflate prompt size. Fix: apply a [[minimal-viable-tool-set]] — discrete, non-overlapping, purpose-specific tools; treat "we need another tool for this edge case" as a signal to shrink scope, not grow the tool list.
4. **Hardcoded monolithic logic** — prompts and control flow embedded directly in code make every production change (prompt tweak, tool refactor, model swap) risk breaking something else. Fix: prompts in centralized configuration ([[prompts-as-infrastructure]]), tools as discrete units, agents composed from reusable components.
5. **No memory architecture** — treating an agent like a chatbot (pass conversation in, get response out) means an agent working a multi-step task has no reliable way to know what it did two steps ago or whether a prior tool call succeeded. Fix: build a [[layered-agent-memory-architecture]] from day one; retrofitting after deployment is a partial rebuild.

**Operational:**
6. **Shipping without observability** — agents are non-deterministic with opaque reasoning; you cannot read a stack trace to see why a decision was made. Fix: instrument the prompt chain, tool calls and parameters, reasoning path, and context flow from the first line of code (see [[observability]], [[llm-observability]]).
7. **Ungoverned write access** — read and write operations carry different risk categories, and an agent that can act on hallucinated or wrong reasoning needs guardrails between output and action. Fix: apply [[read-write-risk-separation]] — output validation, scope constraints, and human-in-the-loop confirmation for irreversible actions (see [[human-in-the-loop-pattern]], [[tool-output-inspection]]).
8. **Ignoring context drift** — context that was accurate at task start degrades as a long-running task proceeds; this is the same mechanism as [[context-rot]], applied to live task execution rather than static document retrieval. Fix: treat the context window as a finite, diminishing-returns resource — clear stale tool results, pull only what's needed, cap output size.
9. **Deploying without evaluation** — happy-path testing against a fixed example set only confirms the cases you already anticipated. Fix: run adversarial and edge-case inputs before deployment, tie success metrics to business outcomes rather than internal model performance, close the feedback loop from production failures (see [[genai-eval-envelope]], [[llm-as-a-judge]]).

## Key Properties
- Architectural anti-patterns are baked in at design time and are expensive to retrofit; operational anti-patterns only become visible once the system reaches production traffic.
- The common root cause across all nine is treating agent design like traditional software or chatbot design — under-specifying state, risk boundaries, and feedback loops that an autonomous, multi-step reasoning loop actually requires.
- None of the fixes require exotic tooling: they are disciplined defaults (start simple, instrument early, separate risk categories, treat context as scarce) rather than new frameworks.

## Relationships
- Builds on [[agentic-error-compounding]]: the reason these anti-patterns are agent-specific (not just general software anti-patterns) is that agent errors compound across a reasoning loop that keeps running after it has gone wrong.
- Related to [[multi-agent-systems]]: anti-pattern #1 is the misapplication of this pattern before it is justified by data.
- Related to [[minimal-viable-tool-set]]: anti-pattern #3 is exactly the failure mode this pattern exists to prevent.
- Related to [[context-rot]]: anti-pattern #8 is context rot manifesting during live agent execution rather than static long-context retrieval.
- Related to [[human-in-the-loop-pattern]] and [[tool-output-inspection]]: both are concrete mechanisms for fixing anti-pattern #7.
- Related to [[genai-eval-envelope]]: the evaluation philosophy that fixes anti-pattern #9.

## Applications
Use this catalogue as a pre-mortem checklist before designing or scaling an agent system: walk through each of the nine anti-patterns and ask whether the current or proposed design exhibits it. Particularly useful at two moments — (1) before adding a second agent or a new tool ("is this justified by measured data, or by aesthetics?"), and (2) before granting an agent write access to a production system or user-facing channel ("what's the blast radius if this action is wrong, and is there a human checkpoint?").

## Study
- Flashcards: [[flashcards/ai-agent-anti-patterns|Practice this concept]]

## Sources
- [Building AI Agents? Here Are Some Anti-Patterns to Avoid](https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/) — primary source; full catalogue with fix-per-anti-pattern summary table.
- [Building Effective AI Agents | Anthropic](https://www.anthropic.com/news/building-effective-agents) — referenced source on workflow routing and tool design principles.
- [Effective Context Engineering for AI Agents | Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — referenced source on context rot and context-as-finite-resource framing.

## See Also
- [[layered-agent-memory-architecture]]
- [[read-write-risk-separation]]
- [[agentic-error-compounding]]
- [[multi-agent-systems]]
- [[minimal-viable-tool-set]]
- [[context-rot]]
- [[human-in-the-loop-pattern]]
- [[genai-eval-envelope]]
- [[weakest-link-reliability]]
- [[blameless-postmortems]]
- [[context-engineering]]
