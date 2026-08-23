---
title: "Tools for Certainty, Agents for Discovery"
date: 2026-07-13
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, orchestration]
tags: [concept, ai-agents, architecture, reliability, determinism, multi-agent, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/orchestration]
status: draft
sources:
  - url: https://www.infoq.com/presentations/reliable-ai-platforms/
    hash: sha256:fa755eebcd198b9755000bc27e7269c2f02dba5c2d230183ad305e6338d1dc28
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Tools for Certainty, Agents for Discovery

## Definition
An architectural principle for reliable agentic systems stating that deterministic sub-problems (counting, joins, lookups, well-defined transformations) should be delegated to deterministic tools or runbooks, while the LLM's reasoning capacity ("tokens") is reserved for higher-order, open-ended discovery tasks that genuinely require judgment. The principle explicitly rejects the false dichotomy that a system must be *either* deterministic *or* AI-driven — determinism is the grounding that makes agentic discovery reliable, not the opposite of AI.

## Explanation
Coined by Aaron Erickson (NVIDIA) in an InfoQ talk drawn from the **LLo11yPop** GPU-fleet observability project, this principle names a pattern that experienced practitioners often reach for intuitively but rarely state explicitly.

**The false dichotomy it corrects:**
In many organisations, "I need that to be deterministic" has become an implicit way of saying "I don't want AI here," because arguing against AI outright is politically unviable while arguing for determinism sounds like sound engineering. This framing wrongly forces every design decision into an either/or: deterministic *or* agentic. Erickson's counter-framing: determinism and agentic reasoning are complementary layers, not competing philosophies. Determinism is the off-ramp that keeps agentic discovery from driving off a cliff.

**How the split is made in practice:**
When an LLM keeps getting a specific operation wrong — a join, a count, a particular category of query — the fix is not more prompting or a bigger model. Instead, give the agent a parametrized query pattern or runbook rule (a Cursor-rule-style "when you hit X, use pattern Y") for that operation. This:
- Simplifies the problem for the LLM without removing its ability to reason about *when* to apply the pattern
- Keeps discoverability — the agent still decides whether the situation calls for the pattern
- Offloads the deterministic part to code, which is cheaper, faster, and 100% reproducible
- Saves tokens that would otherwise be spent re-deriving a known-correct operation

**Why this improves reliability, not just efficiency:**
Constraining what an LLM is asked to do measurably raises accuracy. Throwing a general LLM at "answer any question about this GPU fleet" performs worse than narrow, purpose-built agents (see [[supervisor-agent-pattern]] and its retrieval/analyst/orchestrator/action hierarchy) each paired with deterministic tools for their specific certain sub-tasks. The LLM's job shrinks to the part that actually needs judgment: deciding which tool to use, interpreting ambiguous signals, and synthesising results — not re-deriving arithmetic or SQL joins it has already been shown how to do reliably.

**The "paradox of choice" corollary:**
LLMs suffer the same paradox of choice as humans facing an overwhelming menu ("Cheesecake Factory menu" analogy) — too many plausible options degrade decision quality. Narrowing the option space (fewer tools, fewer valid outputs, fewer ambiguous paths) is itself a way of applying "tools for certainty": constraining the *decision surface*, not just the computation, to what's actually necessary.

## Key Properties
- **Not anti-AI** — determinism is presented as an enabling constraint, not a rejection of agentic capability
- **Task-level split, not system-level split** — the same workflow uses both deterministic tools and LLM reasoning at different steps, not a global choice between the two
- **Runbook-driven correction** — the fix for a recurring LLM error is a parametrized deterministic pattern, not a longer prompt or bigger model
- **Token economy** — every deterministic operation offloaded from the LLM leaves more of its context/reasoning budget for genuinely ambiguous work
- **Narrowing improves accuracy** — both in tool count and in output vocabulary, smaller option spaces produce more reliable agent decisions

## Relationships
- Complements [[constrained-agent-actions]]: constrained actions bound the *output* vocabulary; tools-for-certainty bounds *which sub-problems* the LLM is even asked to solve
- Complements [[minimal-viable-tool-set]]: both argue that narrowing an agent's decision surface improves reliability, one at the tool-catalog level, the other at the certainty/discovery task-split level
- Related to [[deterministic-grounding]]: deterministic grounding focuses on traceable, reproducible *retrieval* outputs; tools-for-certainty is the broader principle of routing *any* deterministic sub-problem (not just retrieval) to non-LLM code
- Implemented via [[supervisor-agent-pattern]]: the retrieval-agent tier in a supervisor hierarchy is a direct application of "tools for certainty" — narrow agents that convert questions into deterministic queries
- Related to [[negative-constraints-pattern]]: a runbook rule ("when you hit X, use pattern Y") functions like a positive constraint that narrows the LLM's action space, the mirror image of a negative exclusion
- Related to [[rare-context]]: constraining an agent to deterministic tools only works once the tools themselves encode the organisation's rare, company-specific context (e.g., what "zombie node" means)

## Applications
- **Observability/ops agents:** When an agent repeatedly mishandles a specific join or count against production data, add a parametrized query template for that exact pattern rather than trying to prompt-engineer around it
- **Multi-agent hierarchies:** Structure retrieval agents around single queries/tables/APIs (fully deterministic conversion of question → query) so that only analyst/orchestrator layers above them need genuine reasoning
- **Cost control:** Auditing where an agent burns tokens re-deriving known-correct operations is a signal that a runbook/tool extraction opportunity exists
- **Vendor evaluation:** Systems that promise "fully agentic, zero deterministic scaffolding" for complex operational domains should be treated skeptically — reliable production agentic systems in practice always have a deterministic substrate

## Study
- Flashcards: [[flashcards/tools-for-certainty-agents-for-discovery|Practice this concept]]

## Sources
- [Designing AI Platforms for Reliability: Tools for Certainty, Agents for Discovery](https://www.infoq.com/presentations/reliable-ai-platforms/) — Aaron Erickson (NVIDIA), InfoQ presentation on the LLo11yPop GPU-fleet observability project

## See Also
- [[constrained-agent-actions]]
- [[minimal-viable-tool-set]]
- [[deterministic-grounding]]
- [[supervisor-agent-pattern]]
- [[negative-constraints-pattern]]
- [[rare-context]]
- [[multi-agent-systems]]
- [[observability]]
