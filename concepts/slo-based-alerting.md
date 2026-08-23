---
title: "SLO-Based Alerting"
date: 2026-04-26
domain: reliability
maturity: established
source_type: practitioner
topics: [devops]
tags: [concept, observability, sre, reliability, slo, alerting, error-budget, domain/reliability, maturity/established, source-type/practitioner, topic/devops]
status: draft
sources:
  - url: https://sre.google/workbook/alerting-on-slos/
    hash: sha256:77453677a42a9a711660c69e556b5a785a41685acab57ff18667a7fba561ccde
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/slok/sloth
    hash: sha256:d68c7bc39a3d4ad595ce5b27274cd979b433a75602ca4b7a7350c581ab2ba7c7
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://openslo.com/
    hash: sha256:86a581514e6fd85740c1073c767ce3308eb62f289dbd29d62d2d009de3ee7527
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# SLO-Based Alerting

## Definition
An alerting methodology in which production systems alert on the **rate of error budget consumption** rather than on infrastructure metric thresholds. Instead of alerting when CPU > 80%, SLO-based alerting fires when the service is depleting its agreed reliability margin ("error budget") at a rate that will exhaust it before the measurement window closes — focusing on user experience as the north star rather than infrastructure health proxies.

## Explanation
**Threshold alerting** (the traditional approach) requires engineers to anticipate every failure mode in advance and configure a threshold for each. This creates two endemic problems:
1. **Alert fatigue** — imperfectly tuned thresholds generate noise, training engineers to ignore pages
2. **Unknown unknowns** — if you didn't anticipate the failure mode, there's no threshold for it

**SLO-based alerting** sidesteps these problems by measuring the *effect* on users rather than the *cause* in infrastructure.

**The building blocks:**

**SLI (Service Level Indicator):** A precise numerical measurement of service behaviour from the user's perspective.
- Good SLI: "Fraction of requests completing in < 500ms with status 2xx"
- Bad SLI: "Average CPU utilisation" (no user perspective)

**SLO (Service Level Objective):** A target for an SLI.
- "99.9% of requests complete in < 500ms over a rolling 30-day window"

**Error budget:** The allowed failure margin implied by the SLO.
- 99.9% SLO = 0.1% failure allowed = ~43 minutes of total downtime per 30-day window
- If 0.05% of requests fail in the first 15 days, half the budget is consumed

**Error budget burn rate:** How fast the budget is being consumed relative to the ideal rate.
- Burn rate 1x = depleting at exactly the SLO-allowed rate (would exhaust at window end)
- Burn rate 14.4x = depleting 14.4× normal rate (would exhaust in 2 hours instead of 30 days)

**Burn rate alerting types:**

| Alert Type | Trigger | Response Time | False Positive Risk |
|---|---|---|---|
| **Fast burn** | Burn rate > 14.4x (exhausts in 2h) | Immediate page | Low — genuine emergency |
| **Slow burn** | Burn rate > 6x over 6h window | Ticket next business day | Low — real degradation |
| **Budget threshold** | >50% of monthly budget consumed | Review and plan | Medium — may be scheduled maintenance |
| **Predictive** | Forecast shows exhaustion within 24h | Warning | Higher — model dependent |

**Why this is better than threshold alerting:**

CPU at 90% with users unaffected → no alert (correct). Service returning 200 OK but with p99 latency at 8 seconds → error budget burning fast → page (correct, even though CPU looks fine). Novel failure mode not anticipated (e.g., a new dependency causing timeouts) → affects user requests → error budget burns → alert (correct, even without a specific threshold for this failure mode).

**The cultural dimension:**

Error budgets create a shared language between engineering and product/business:
- "We have 12 minutes of error budget left this month" is universally understood
- Teams with full budgets can deploy faster (the budget is theirs to spend)
- Teams near budget exhaustion freeze deployments automatically
- Reliability becomes a joint product decision, not just an engineering concern

**The error budget policy:**

| Budget remaining | Action |
|---|---|
| > 50% | Normal velocity; deploy freely |
| 25–50% | Review deployments; no experimental features |
| < 25% | Freeze non-critical deploys; focus on reliability |
| Exhausted | Incident mode; all hands on reliability |

**SLO tooling:**

- **Sloth** — open-source SLO generator for Prometheus. Defines SLOs in YAML, auto-generates recording rules and alerting rules. GitOps-friendly.
- **OpenSLO** — vendor-neutral YAML spec for SLOs. Portable across platforms.
- **Nobl9** — commercial SLO management platform; integrates with Datadog, Prometheus, CloudWatch, New Relic. Unified SLO view across heterogeneous monitoring stacks.
- **Grafana + Prometheus** — native SLO alerting with `ALERTS_FOR_STATE` and burn-rate recording rules. Sufficient for many teams without additional tools.
- **Honeycomb** — derives SLOs from the same wide event stream used for debugging; no separate SLI measurement.

**Google's multi-window multi-burn-rate alert (best practice):**

Alert on two time windows simultaneously to catch both fast-moving and slow-moving incidents:
- Short window (1h) with high burn rate (14.4x): catches acute emergencies
- Long window (6h) with moderate burn rate (6x): catches slow degradations
Both windows must exceed threshold to trigger, reducing false positives.

## Key Properties
- **User-centric** — alerting on user experience impact, not infrastructure metrics
- **Unknown unknown coverage** — any failure that degrades user experience burns the budget; no threshold required
- **Reduced alert fatigue** — fewer alerts, all high signal (if budget burns fast, something is genuinely wrong)
- **Shared language** — error budget provides a business-legible reliability metric
- **Deployment feedback** — deploys that burn the budget are visible; rollback decisions are data-driven
- **Requires good SLIs** — the SLO is only as good as the accuracy of the underlying SLI measurement

## Relationships
- Core methodology of [[observability-driven-development]]: ODD's alerting model is error budget burn rates, not thresholds
- Measured using [[observability]]: SLIs are computed from trace/metric/log telemetry
- Natural complement to [[observability-2-0]]: Honeycomb derives SLOs from the same wide event stream used for debugging — no separate measurement
- Related to [[telemetry-pipeline]]: tail sampling policy in the pipeline is often aligned with SLO thresholds (keep all traces from SLO-violating requests)
- Related to [[agentic-sdlc]]: SLO-based rollbacks in agentic pipelines use error budget burn to trigger automatic rollback

## Applications
- **Deployment gating:** CI/CD pipeline checks error budget before promoting a canary. If the canary is burning budget 3× faster than baseline, promotion is blocked automatically.
- **On-call hygiene:** Replace 20 threshold-based alerts for a service with 2 burn-rate alerts (fast + slow). Fewer pages, all actionable.
- **Product-engineering reliability contracts:** Monthly SLO review meeting uses budget burn data: "We spent 43% of our error budget on the database migration. Do we want to schedule that kind of risk again?"
- **LLM quality SLOs:** "95% of agent responses must score > 0.7 on the quality evaluator within 30 days." LLM-as-judge scores become the SLI; budget burns when response quality degrades.
- **Homelab monitoring:** Set a simple availability SLO on Uptime Kuma monitors; compute burn rate weekly; know which service is consistently degrading before users notice.

## Sources
- [Google SRE Book — Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) — multi-window burn rate alerting patterns
- [Sloth — Open Source SLO Generator](https://github.com/slok/sloth) — Prometheus SLO tooling
- [OpenSLO Specification](https://openslo.com/) — vendor-neutral SLO definition format
- Observability Landscape Guide 2025–2026 — SLO tooling landscape

## See Also
- [[observability]]
- [[observability-driven-development]]
- [[observability-2-0]]
- [[telemetry-pipeline]]
- [[agentic-sdlc]]
