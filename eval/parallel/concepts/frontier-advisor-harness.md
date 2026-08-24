---
title: Frontier model as callable advisor
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, orchestration, inference-cost, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://fireworks.ai/blog/open-source-agents-frontier-advisors
    class: external-primary
---

# Frontier model as callable advisor

## Definition

A **frontier advisor harness** runs the agent loop on a cheaper open-weights worker model and exposes a stronger, more expensive model to it as an ordinary callable tool, so escalation is a decision the worker makes mid-trajectory at its own points of uncertainty rather than a routing decision taken up front by a separate classifier or orchestrator; the strong model advises and reviews on a minority of sub-tasks instead of executing the task end to end, which turns the frontier dependency into a per-workload cost dial rather than a load-bearing component.

## Explanation

The mechanism is self-invoked escalation. There is no external router: the worker holds the trajectory, and where it reaches an uncertain step — validation most often, drafting sometimes — it calls the advisor for guidance or review, then continues with the response folded in. The signature in traces is asymmetric: advisor calls are sparse, about 0.83 per task in the reported run, while the worker's turn count rises noticeably downstream of each one, so the strong model does less of the writing and more of the steering, and the worker goes on to do work it would not have known to do on its own. That asymmetry is what makes the economics work, because the expensive model is billed for a few short steering turns rather than the whole long trajectory, and the call rate becomes a knob to raise on complex matters and lower on routine ones. The source is a vendor post from Fireworks with Harvey, run on a 100-task distribution-mirrored slice of Harvey's open-sourced Legal Agent Benchmark: an open worker with a frontier advisor scored 18 of 100 on the strict all-criteria-pass metric for $368, against 14 of 100 for the frontier model end to end at $954 and 12 of 100 for the worker alone at $121. Read the headline carefully, because the post itself reports an all-pass standard error near 2.5 tasks per 100, so beating the frontier baseline by 4 tasks is roughly one standard error and the direction of the result is stronger evidence than its size. What survives the version churn is the design point: keep open weights at the core and let the loop pull frontier intelligence in only where it changes the answer.

## Key Properties

- No external router — the worker itself decides when to escalate, mid-trajectory, at its own points of uncertainty
- Advisor calls are sparse and steering-shaped; the worker's turn count rises downstream of each one
- The advisor invocation rate is an explicit cost/quality dial, tunable per workload
- Reported run: open worker plus frontier advisor at 18/100 all-pass for $368, versus the frontier model end to end at 14/100 for $954
- Vendor-reported on a 100-task slice whose all-pass standard error is about 2.5 tasks, so the margin over the frontier baseline is roughly one standard error

## Relationships

- [[agent-harness]] — is a pure harness intervention in that sense — the weights are untouched and only the orchestration around the model moves, which is why the quality change arrives without any training run
- [[rl-learned-orchestration]] — pursues the same goal of spending a strong model only where it pays, but through a coordinator trained end-to-end, where this pattern uses the worker's own uncertainty as the routing policy and is therefore buildable without an RL run
- [[model-harness-coevolution]] — supplies the caveat that governs these numbers — scores attach to model-plus-harness pairs, so a hybrid-harness result is a claim about that combination and not about either model on its own
- [[rubric-as-training-signal]] — is the inference-time counterpart to that training-time intervention — both close the gap to a frontier model from an open-weights base, one by restructuring how the model is called and the other by restructuring the model
- [[orchestration-as-provider-hedge]] — the frontier advisor harness is a second architecture for de-risking the same frontier-model dependency the provider-hedge argument targets — turning it into a per-workload cost dial the worker invokes at its own points of uncertainty, rather than a swappable pool member routed to up front.

## Applications

Cutting agent inference cost on long-horizon, rubric-graded work without giving up frontier-quality outcomes: run the loop on an open-weights worker and let it call a stronger model on the validation or drafting steps it is unsure of, then tune the call rate per workload. It is also the structure to reach for when a frontier API is a dependency you want to make optional rather than load-bearing.

## Sources

- https://fireworks.ai/blog/open-source-agents-frontier-advisors

## See Also

- [[agent-harness]]
- [[rl-learned-orchestration]]
- [[rubric-as-training-signal]]
