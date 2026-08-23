---
title: "Observability-Driven Development (ODD)"
aliases: ["Observability-Driven Development (ODD)"]
date: 2026-04-26
domain: observability
maturity: established
source_type: practitioner
topics: [devops, workflow]
tags: [concept, observability, software-engineering, development-practices, slo, production, domain/observability, maturity/established, source-type/practitioner, topic/devops, topic/workflow]
status: draft
sources:
  - url: https://www.honeycomb.io/blog/time-to-version-observability-signs-point-to-yes
    hash: sha256:bbb44491850eca4b17dac1e9e9d7291ac013763fe8221b273408832634419d7e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://newsletter.pragmaticengineer.com/p/observability-the-present-and-future
    hash: sha256:4c5bddd32cec13002773a89c5f2463fdd97e1a0208bc3f43ec5fd150114a36d7
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Observability-Driven Development (ODD)

## Definition
A software development methodology, articulated by Charity Majors, Liz Fong-Jones, and George Miranda, that treats observability as an integral part of the development cycle rather than an operational afterthought. ODD holds that instrumentation should be written alongside code, that production is the authoritative environment for verifying behaviour, and that deploying code is the *beginning* of gaining confidence — not the end.

## Explanation
Traditional software development treats observability as an ops concern: developers write code, tests verify it in staging, and SREs instrument it in production after the fact. ODD inverts this:

> "Your job as a developer isn't done until you know it's working in production. Deploying to production is the beginning of gaining confidence in your code, not the denouement." — Charity Majors

**The four ODD principles:**

**1. Instrument during development, not after**
Every feature should ship with the telemetry needed to understand it in production. Before merging, ask: "If this code behaves unexpectedly in production, do I have the instrumentation to understand why?" If not, add it. Instrumentation is a functional requirement, not a non-functional one.

**2. Debug in production, not in staging**
Staging environments lie. They lack production traffic patterns, data distribution, and scale. A bug that manifests 0.01% of the time with real traffic never appears in staging. ODD treats production as the canonical debugging environment, made safe by good instrumentation and progressive delivery.

**3. Use production to verify, not just monitor**
After deploying, actively verify the new code path is behaving as expected by querying telemetry. Don't wait for users to report problems or for alerts to fire. "Show me traces for the new checkout flow from the last 30 minutes" should be a routine post-deploy action.

**4. Shift observability left**
The developer who writes the code should be able to see it running in production within minutes of deployment. Observability tooling should be part of the development workflow, not a specialised SRE skill.

**Martin Thwaites's TDD-Telemetry approach:**

An extension of ODD that combines TDD with telemetry as a first-class test assertion:
1. Write the test: "When this endpoint is called, it should emit a span with attributes X, Y, Z"
2. Run the test (it fails — no instrumentation yet)
3. Add the instrumentation to make the test pass
4. The instrumentation is guaranteed correct by the test suite

This makes telemetry a tested, versioned, contract-guaranteed artefact — not an afterthought.

**SLO-based alerting (the ODD alerting model):**

ODD replaces threshold alerting ("alert if CPU > 80%") with SLO-based error budget alerting:

| | Threshold Alerting (O11y 1.0) | SLO-Based Alerting (ODD) |
|---|---|---|
| **Alert on** | Infrastructure metrics exceeding thresholds | Error budget burn rate |
| **North star** | "Is the metric healthy?" | "Are users experiencing good service?" |
| **Unknown failures** | Missed (no threshold for novel failures) | Caught (any deviation burns the error budget) |
| **Alert fatigue** | High (thresholds tuned imperfectly) | Lower (fewer, higher-signal alerts) |
| **Cultural effect** | Engineering ↔ ops divide | Shared language for engineering ↔ product |

**Error budgets:**
An SLO of 99.9% availability means 0.1% of requests can fail — the "error budget." The error budget is a shared contract: if it's full, go fast. If it's running low, slow down and stabilise. "We have 43 minutes of downtime budget remaining this month" is universally understandable.

**Testing in production safely:**

ODD makes production the *safest* testing environment:
- **Feature flags + observability:** Roll to 1% of users → query telemetry → compare flag=on vs flag=off cohorts → expand or roll back
- **Canary deployments:** Deploy to one pod → compare its telemetry against the fleet baseline → promote or abort
- **Progressive delivery:** Argo Rollouts or Flagger automate the observe-decide loop

The key insight: staging gives false confidence because it can't replicate production conditions. Good production observability + progressive delivery is actually less risky than trusting staging.

**2025 DORA Report connection:**

DORA 2025 findings aligned with ODD principles showed teams using ODD practices achieved:
- 60% reduction in median customer wait time
- 1% continuous monthly improvement via systematic A/B testing in production
- Rapid LLM billing discrepancy detection via real-time cost telemetry

## Key Properties
- **Instrumentation as a deliverable** — spans, metrics, and attributes are shipped alongside feature code
- **Production is the source of truth** — not staging, not load tests
- **Verification is active, not passive** — query telemetry post-deploy; don't wait for alerts
- **Error budgets replace thresholds** — user experience defines "broken", not infrastructure metrics
- **Developer ownership** — the engineer who wrote the code owns understanding it in production
- **Progressive delivery as safety net** — small blast radius + observability = fast rollback

## Relationships
- Builds on [[observability]]: ODD requires the three pillars as infrastructure; it's the methodology *around* them
- Deeply connected to [[observability-2-0]]: ODD's "ask arbitrary questions" philosophy only works with O11y 2.0's ad-hoc query model
- Related to [[slo-based-alerting]]: ODD's alerting model is SLOs; error budget burn rate replaces threshold alerting
- Related to [[agentic-sdlc]]: ODD principles apply directly to AI agent development — instrument agents, verify in production, roll back on quality regressions
- Related to [[behavioral-qa-agents]]: production verification in ODD is effectively continuous behavioral QA
- Related to [[human-in-the-loop-pattern]]: progressive delivery and production verification create natural human decision points

## Applications
- **Feature flag-driven rollout:** Ship feature behind flag → route 1% → query "latency for flag=on vs flag=off" → expand or revert, all with production data
- **LLM agent iteration:** Deploy prompt change to canary → Langfuse shows quality score regression → auto-rollback without users noticing
- **Post-deploy verification routine:** Every deploy triggers a 15-minute window where the developer watches key traces/metrics for their code path before considering it done
- **Error budget conversations:** Monthly engineering-product meeting uses error budget burn rates as the shared language for "can we ship faster vs do we need to stabilise?"

## Study
- Flashcards: [[flashcards/observability-driven-development|Practice this concept]]

## Sources
- [It's Time to Version Observability — Honeycomb](https://www.honeycomb.io/blog/time-to-version-observability-signs-point-to-yes) — ODD framing in context of O11y 2.0
- Majors, Fong-Jones, Miranda. *Observability Engineering* (O'Reilly, 2022) — foundational text
- [Observability: Present and Future — Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/observability-the-present-and-future) — Charity Majors interview with practitioner perspective
- Observability Landscape Guide 2025–2026

## See Also
- [[observability]]
- [[observability-2-0]]
- [[slo-based-alerting]]
- [[agentic-sdlc]]
- [[behavioral-qa-agents]]
