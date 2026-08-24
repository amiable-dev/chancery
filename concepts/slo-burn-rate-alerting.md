---
title: SLO burn-rate alerting
date: 2026-08-24
domain: reliability
maturity: established
source_type: practitioner
tags: [concept, observability, reliability, sre, domain/reliability, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://sre.google/workbook/alerting-on-slos/
    hash: sha256:77453677a42a9a711660c69e556b5a785a41685acab57ff18667a7fba561ccde
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# SLO burn-rate alerting

## Definition

**SLO burn-rate alerting** is the Google SRE Workbook's method for turning service-level objectives into pageable alerts: alert on the rate at which the error budget is being consumed, evaluated over multiple time windows simultaneously, rather than on raw error counts or instantaneous error rates.

## Explanation

The chapter (Thurgood et al.) evaluates any alerting strategy on four attributes — precision (fraction of alerts that mark significant events), recall (fraction of significant events alerted), detection time, and reset time — and shows why naive strategies fail them: alerting on instantaneous error rate is noisy (low precision), while alerting only when the whole budget is gone detects far too late. Burn rate fixes this by normalising consumption against the budget: a burn rate of 1 spends exactly the budget over the SLO window, higher rates spend it proportionally faster, so thresholds map directly to time-to-exhaustion. The mature form pairs a long window with a short one (for example one hour and five minutes at high burn) so alerts fire quickly on genuine spikes and reset promptly when the problem clears, and layers a slower ticket-severity pair beneath the paging pair. The worked examples use Prometheus syntax but the chapter is explicit that the approach applies in any alerting framework, and it treats low-traffic services — where a single request can dominate a short window — as a named hard case.

## Key Properties

- Four evaluation attributes: precision, recall, detection time, reset time
- Burn rate normalises error spend against the budget, mapping thresholds to time-to-exhaustion
- Multiwindow (long + short) evaluation gives fast firing and fast reset
- Multiple burn-rate tiers separate page-now from ticket-later

## Relationships

- _No relationships recorded yet._
- [[golden-dataset-retrieval-evals]] — the retrieval harness's nightly regression alerting applies this discipline — measured budgets with alerts on consumption — to context quality instead of request errors
- [[spec-driven-slo-generation]] — burn-rate alerting is exactly one of the artifacts spec-driven SLO generation's compiler generates mechanically from the compact spec — the same target percentage and period that define the SLO also parametrize the burn-rate windows, rather than being hand-tuned per service.

## Applications

Deriving paging thresholds from an SLO instead of hand-tuning error-rate alerts; auditing an existing alert set for precision/recall/detection/reset; handling low-traffic services where windows contain few events.

## Sources

- https://sre.google/workbook/alerting-on-slos/

## See Also

- _None yet._
