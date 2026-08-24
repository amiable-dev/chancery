---
title: Per-product agent runtime isolation
date: 2026-08-24
domain: infrastructure
maturity: emerging
source_type: vendor-doc
tags: [concept, platform-engineering, ai-agents, reliability, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.langchain.com/blog/how-schneider-electric-built-their-llmops-foundations-at-enterprise-scale-with-langsmith
    class: external-primary
---

# Per-product agent runtime isolation

## Definition

**Per-product agent runtime isolation** is the decision to run each AI product on its own dedicated agent-runtime stack — its own server process, database and cache — instead of on one centralized runtime shared across the organisation, so every squad owns the latency, cost and incident response for its own agents and no single faulty deployment or resource exhaustion can degrade every agent at once. The price, stated rather than hidden, is more infrastructure to operate and more upgrades to coordinate.

## Explanation

Two arguments motivate it and they pull the same way. The organisational one is you-build-it-you-run-it: a platform team that ships foundations and paved paths rather than a turnkey runtime keeps each squad accountable for the latency, cost and pager duty of what it built, and that accountability is only credible if the squad actually controls the runtime. The blast-radius one is that a shared agent runtime is a systemic single point of failure, where one bad deploy or one resource-hungry agent degrades every agent in the company, while per-product stacks confine an incident to a single use case. The part that keeps this from degenerating is easy to miss: every product starts from the same templated runtime configuration, carrying the allow-listed base image, the corporate certificate bundle and the standard routes, so N stacks do not become N snowflakes. Isolation without a shared template merely multiplies drift; the template is what makes the multiplication survivable. The team is straightforward that the trade-off is real and unfinished — more charts to upgrade, more versions to pin, more lifecycle to manage — and names it as their next investment. This is a practitioner account on a vendor blog, describing choices made under one enterprise's constraints of critical infrastructure, data residency and multi-cloud deployment, but the reasoning travels further than the specific stack does.

## Key Properties

- One runtime stack per AI product; no shared central agent runtime
- Organisational rationale: squads own latency, cost and incident response for what they build
- Blast-radius rationale: a central runtime turns one bad deploy into an all-agent outage
- Admitted cost: more infrastructure to operate and more upgrades to coordinate, named as the next investment area
- A shared templated configuration per product is what stops N runtimes becoming N snowflakes

## Relationships

- [[paved-road-mcp-platform]] — applies the same philosophy to runtimes rather than to servers — the platform ships a template that makes the governed configuration the default, instead of a shared service every team is obliged to run on
- [[agent-harness]] — is what is being replicated here, since the runtime, its state stores and its orchestration are all harness, making this a decision about how many copies of that harness an organisation is willing to operate
- [[llmops-maturity-gates]] — is the discipline that makes this affordable, because a measured capability floor is what keeps independently-operated runtimes from diverging into unmaintainable variants

## Applications

Choosing between a shared agent platform and per-team runtimes once an organisation runs more than a handful of agentic products, especially where losing every agent at once is unacceptable. The paired obligation is to ship the runtime template first, so isolation buys blast-radius containment without also buying configuration drift.

## Sources

- https://www.langchain.com/blog/how-schneider-electric-built-their-llmops-foundations-at-enterprise-scale-with-langsmith

## See Also

- [[paved-road-mcp-platform]]
- [[agent-harness]]
- [[llmops-maturity-gates]]
