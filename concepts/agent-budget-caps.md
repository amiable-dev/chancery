---
title: "Agent Budget Caps"
date: 2026-05-29
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, cost-control]
tags: [concept, ai-agents, architecture, patterns, resource-governance, autonomy, cost-control, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/cost-control]
status: draft
sources:
  - url: https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/
    hash: sha256:db47a3a23c8db34574379ae1c5cfd4ced48717fb33c56242b3fea87efae9620d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/vigolium/vigolium
    hash: sha256:b387e7b00f9203a8583c50ca541e01a95adb04047570713a6348e741874e2e12
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Budget Caps

## Definition
Agent Budget Caps are explicit, configurable upper bounds placed on the resource consumption of an autonomous AI agent across one or more dimensions — typically: token count (LLM inference cost), tool-call count (action breadth), triage iterations (re-planning cycles), and wall-clock duration (elapsed time). When any cap is reached, the agent halts and returns whatever it has accumulated, rather than running indefinitely.

## Explanation
Autonomous agents that run without resource limits exhibit two failure modes: they may run indefinitely when chasing a difficult lead, burning cost proportional to the complexity of the target; or they may produce diminishing-returns output after a certain depth, adding noise without new signal.

Budget caps are the mechanism that makes agentic automation **production-safe**. Rather than trusting the agent to know when to stop, the system imposes external boundaries and the agent works within them.

Vigolium, an open-source agentic vulnerability scanner, exposes four caps:

| Cap Type | Controls |
|---|---|
| **Token budget** | Total LLM inference cost per scan |
| **Tool-call budget** | Maximum number of actions/modules invoked |
| **Triage iteration cap** | How many re-plan cycles the agent can run |
| **Wall-clock cap** | Maximum elapsed time before forced stop |

Jessie Ho (Vigolium author) describes two clear failure modes from miscalibration:
- **Under-budget:** Agent is cut mid-investigation; outputs are low-confidence stubs that look complete but aren't
- **Over-budget:** Agent wanders, burns spend, and adds noise — more output doesn't mean more signal

His calibration heuristic: **start tight, loosen only when genuine work is getting cut off**. The signal for "too tight" is a specific finding that was truncated; the signal for "too loose" is repetitive or low-quality output filling the gap.

Different job shapes call for different cap profiles:
- **Time-boxed CI runs:** lean on wall-clock + iteration caps (always finishes)
- **Deep-dive single target:** loosen tokens, let the agent re-plan
- **Broad sweeps:** keep per-target budgets tight (one rabbit-hole target eats everything)

## Key Properties
- **Multi-dimensional:** Effective budgeting constrains multiple axes simultaneously; a single token cap is insufficient if the agent can make unlimited tool calls
- **Soft vs hard caps:** Some systems implement soft caps (agent warned, asked to conclude) before hard cutoffs (forced stop) to improve output quality
- **Start tight:** Default caps should be conservative; expand based on observed truncation, not upfront speculation
- **Failure mode asymmetry:** Under-budgeting produces silent, low-confidence stubs; over-budgeting produces noisy, verbose output — both look like "results" at a glance
- **Job-shape dependency:** Optimal caps are a function of the task type (broad vs deep), not a universal setting

## Relationships
- Related to [[constrained-agent-actions]]: both limit what agents can do, but in different dimensions — constrained actions limit output *vocabulary*; budget caps limit resource *consumption*
- Related to [[human-in-the-loop-pattern]]: budget caps can trigger HITL escalation when the agent halts with low confidence
- Related to [[agentic-pipeline-verification]]: budget caps are a prerequisite for predictable pipeline runtimes
- Complements [[two-tier-agent-execution-model]]: tier routing can pre-assign different budget profiles based on task sensitivity
- Related to [[attention-budget]]: attention-budget is a model-level concept (context window); agent-budget-caps operate at the orchestration/system level

## Applications
- **Security scanning:** Cap scan jobs so they always complete within a CI pipeline window, even against complex targets
- **Code review agents:** Token budgets prevent over-analysis of large PRs; wall-clock caps keep review latency predictable
- **Research agents:** Iteration caps prevent recursive rabbit-holes when crawling references
- **Customer support bots:** Tool-call caps limit how many APIs an agent can invoke per conversation, bounding both cost and blast radius
- **Any autonomous background agent:** Budget caps are the primary mechanism for preventing runaway spend in unattended LLM jobs

## Study
- Flashcards: [[flashcards/agent-budget-caps|Practice this concept]]

## Sources
- [Vigolium: Open-source vulnerability scanner](https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/) — primary source; author describes budget cap design and calibration heuristics
- [Vigolium GitHub](https://github.com/vigolium/vigolium) — implementation reference

## See Also
- [[constrained-agent-actions]]
- [[human-in-the-loop-pattern]]
- [[agentic-pipeline-verification]]
- [[attention-budget]]
- [[react-agent-pattern]]
