---
title: Budget caps for autonomous agents
aliases:
  - Agent budget caps
  - Cap-to-job-shape matching
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, operations, cost-control, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/
    class: external-secondary
---

# Budget caps for autonomous agents

## Definition

**Budget caps for autonomous agents** are operator-set hard limits on what a self-directed agent may consume — tokens, tool calls, re-check iterations, wall-clock duration — chosen to match the shape of the job rather than fixed once globally, on the premise that an agent's output degrades in both directions: too small a budget cuts it off mid-lead and leaves a low-confidence stub, while too large a budget lets it wander, spend, and add noise.

## Explanation

An agent that chooses its own next action has no internal stopping rule tied to the value of continuing, so the cap is the operator's only lever on where it stops, and which cap binds is a property of the job rather than of the agent. A time-boxed engagement or a CI run leans on the wall-clock and iteration caps, because the requirement is that the run always finishes inside a window even if it finishes incomplete. A deep investigation of a single target loosens the token cap instead, because the value there comes from the agent being able to abandon a hypothesis and re-plan, which is precisely the behaviour a tight token budget forecloses. A broad sweep across many targets needs per-target budgets rather than one pooled allowance, because a single target that turns into a rabbit hole will otherwise consume the entire run and starve every target after it. The two failure modes are worth separating because they present asymmetrically: underbudgeting fails visibly and honestly — a lead cut mid-investigation is legible as a stub — whereas overbudgeting produces plausible additional output that costs money and dilutes the genuine findings, so it is the harder error to notice from the report alone. That asymmetry is what justifies the operating rule of starting tight and loosening only when real work is demonstrably being cut off: it calibrates against the failure you can see. The source is trade-press coverage built on an interview with the author of an open-source agentic scanner, so this is a practitioner's operating judgement rather than a measured result.

## Key Properties

- Four distinct cap types — tokens, tool calls, re-check iterations, wall-clock duration — that bind under different job shapes
- Time-boxed and CI runs lean on wall-clock and iteration caps so the run always terminates
- Deep single-target work loosens the token cap, because re-planning after a dead end is what tokens buy
- Broad sweeps need per-target budgets, or one rabbit-hole target eats the whole allowance
- Underbudgeting fails visibly as a low-confidence stub; overbudgeting fails invisibly as cost and noise, so start tight and loosen on evidence

## Relationships

- [[agent-loop-anatomy]] — supplies the slot these caps fill — they are the independent termination exits that anatomy requires, expressed as resource limits rather than as goal tests
- [[evidence-recheck-triage]] — consumes one of these budgets directly, since re-check iterations are a capped resource — starving the triage pass turns off the check it exists to be

## Applications

Setting per-job rather than per-tool budgets when running LLM-driven scanners, research agents or batch harnesses; choosing per-target caps for fan-out workloads so one pathological target cannot starve the rest; diagnosing a disappointing agent run by asking which cap bound first.

## Sources

- https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/

## See Also

- [[agent-loop-anatomy]]
- [[evidence-recheck-triage]]
