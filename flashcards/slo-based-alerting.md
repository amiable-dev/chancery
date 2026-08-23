---
tags: [flashcards, observability, sre, reliability, slo, alerting]
sr-due: 2026-04-26
sr-interval: 1
sr-ease: 250
---

# SLO-Based Alerting — Flashcards

#flashcards/observability

## Definition <!-- kb:card:04f861 -->
What is SLO-based alerting?
?
An alerting methodology that fires on the **rate of error budget consumption** rather than infrastructure metric thresholds. Instead of alerting when CPU > 80%, it alerts when the service is depleting its reliability margin (error budget) fast enough to exhaust it before the measurement window ends — measuring user impact as the north star, not infrastructure proxies.

## Key terms <!-- kb:card:6bf0bf -->
Define SLI, SLO, and error budget in the context of SLO-based alerting.
?
- **SLI (Service Level Indicator):** A precise measurement of service behaviour from the user's perspective. Example: "Fraction of requests completing in < 500ms with status 2xx"
- **SLO (Service Level Objective):** A target for an SLI. Example: "99.9% of requests complete in < 500ms over a rolling 30-day window"
- **Error budget:** The allowed failure margin. 99.9% SLO = 0.1% can fail = ~43 minutes of downtime per 30 days

## Burn rate <!-- kb:card:5608ad -->
What is error budget burn rate, and how is it used in alerting?
?
Burn rate = how fast the budget is being consumed relative to the ideal (SLO-allowed) rate.
- **Burn rate 1x:** Depleting at exactly the SLO-allowed rate (would exhaust at window end — acceptable)
- **Burn rate 14.4x:** Would exhaust the entire monthly budget in 2 hours — immediate page warranted
- **Burn rate 6x:** Would exhaust in ~5 hours — ticket/urgent review warranted

Two-window alerting: fast burn (1h window, 14.4x) for emergencies + slow burn (6h window, 6x) for gradual degradation.

## Advantage over thresholds <!-- kb:card:26753d -->
Why does SLO-based alerting reduce both alert fatigue AND missed incidents versus threshold alerting?
?
- **Reduces alert fatigue:** Only fires when users are genuinely impacted; no alerts for high CPU while users are happy
- **Catches unknown unknowns:** Any failure mode that degrades user experience burns the budget — no threshold required for novel failures
- **Self-calibrating:** Thresholds need tuning; error budget burn rate is derived from actual user impact

## Cultural effect <!-- kb:card:b94591 -->
What is the cultural benefit of error budgets for engineering and product teams?
?
Error budgets create a shared, business-legible reliability language:
- "We have 12 minutes of error budget left this month" is universally understood by engineering AND product/business
- Teams with healthy budgets can ship faster (the budget is theirs to spend)
- Teams near exhaustion freeze deploys automatically — a data-driven, not authority-driven decision
- Reliability becomes a joint product-engineering decision, not just an SRE concern

## Application <!-- kb:card:70b1a2 -->
How would you apply SLO-based alerting to an LLM agent's response quality?
?
Define a quality SLO: "95% of agent responses must score > 0.7 on the quality evaluator within 30 days." The SLI is the LLM-as-judge score on sampled responses. When quality degrades (e.g., a prompt change causes score drops), the error budget burns. When burn rate exceeds threshold, fire an alert → review prompt changes → roll back if needed. Same mechanics as latency SLOs, applied to a quality dimension.
