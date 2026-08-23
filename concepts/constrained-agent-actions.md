---
title: "Constrained Agent Actions Pattern"
aliases: ["Constrained Agent Actions Pattern"]
date: 2026-04-14
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, safety]
tags: [concept, ai-agents, architecture, patterns, safety, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/safety]
status: draft

sources:
  - url: https://towardsdatascience.com/building-an-ai-agent-to-detect-and-handle-anomalies-in-time-series-data/
    hash: sha256:13f56bff4e75e004d638762d7bdea54bab55d032600312ffdac22cb0e9c5acbb
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Constrained Agent Actions Pattern

## Definition
A safety design pattern in which an LLM-powered agent is restricted to a fixed, finite vocabulary of valid output decisions — typically 2–5 choices — with any invalid response automatically mapped to a safe default (usually a human escalation action).

## Explanation
Most LLMs are generative and can produce arbitrary text. In autonomous decision-making systems, unconstrained output is dangerous: a novel or malformed response can trigger unexpected downstream behaviour or be silently ignored. The Constrained Agent Actions pattern addresses this by:

1. Defining a small, exhaustive set of valid decisions (e.g. `FIX_ANOMALY`, `KEEP_ANOMALY`, `FLAG_FOR_REVIEW`).
2. Instructing the agent via prompt to return **only** one of those strings — nothing else.
3. Validating the response at call time and falling back to the safest action (typically human review) if validation fails.

**Example from anomaly detection:**
```python
VALID_ACTIONS = {"FIX_ANOMALY", "KEEP_ANOMALY", "FLAG_FOR_REVIEW"}

decision = response.messages[-1].content.strip()
decision = decision if decision in VALID_ACTIONS else "FLAG_FOR_REVIEW"
```

The agent still exercises LLM reasoning (it reads context — date, count, severity — and applies decision rules) but the *surface* it exposes to the rest of the system is fully deterministic and enumerable.

The pattern is intentionally narrow: three data points in, one of three strings out. The narrowness is a feature, not a limitation — it makes the agent safe to run autonomously in production.

## Key Properties
- **Bounded output space:** All valid outputs are known at design time and can be enumerated.
- **Fail-safe default:** Invalid or missing responses resolve to the least harmful option (escalation).
- **Prompt + validation layered:** Prompt asks nicely; code enforces strictly. Neither alone is sufficient.
- **LLM reasoning preserved:** The agent still contextualises the decision; only the vocabulary is constrained, not the reasoning.
- **Auditable:** Every decision is one of N known values, making logging and alerting straightforward.

## Relationships
- Related to [[human-in-the-loop-pattern]]: the `FLAG_FOR_REVIEW` action is the HITL escape valve; constrained actions make HITL routing deterministic
- Contrast with [[react-agent-pattern]]: ReAct agents have open-ended tool selection; constrained-action agents are closed-loop with no tool calls
- Complements [[supervisor-agent-pattern]]: a supervisor can use constrained routing decisions to dispatch to specialist sub-agents
- Related to [[negative-constraints-pattern]]: per-task story-level expression of constrained actions in an Agentic-Agile workflow
- Related to [[contract-driven-execution]]: contracts encode constrained actions formally as invariants and negative constraints per story

## Applications
- **Anomaly handling:** Fix / keep / escalate decisions on flagged data points (as in the time-series tutorial)
- **Content moderation:** Approve / reject / escalate decisions on flagged content
- **Incident triage:** Page on-call / auto-remediate / acknowledge decisions in monitoring systems
- **Document classification:** Archive / action / route decisions in inbox automation
- Any situation where "LLM reasons, but system must be safe to run unattended"

## Study
- Flashcards: [[flashcards/constrained-agent-actions|Practice this concept]]

## Sources
- [Building an AI Agent to Detect and Handle Anomalies in Time-Series Data](https://towardsdatascience.com/building-an-ai-agent-to-detect-and-handle-anomalies-in-time-series-data/) — primary example using `FIX_ANOMALY / KEEP_ANOMALY / FLAG_FOR_REVIEW` with COVID-19 data

## See Also
- [[human-in-the-loop-pattern]]
- [[react-agent-pattern]]
- [[supervisor-agent-pattern]]
- [[ai-as-control-plane]]
- [[two-tier-agent-execution-model]]: a complementary pattern that constrains *which* agents can execute at all (vs. constraining what output is valid)
- [[agent-budget-caps]]: a complementary constraint dimension — budget caps limit resource *consumption*, constrained actions limit output *vocabulary*
