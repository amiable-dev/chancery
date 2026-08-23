---
title: "Statistical Anomaly Detection (Time Series)"
date: 2026-04-14
domain: data
maturity: established
source_type: practitioner
tags: [concept, data-science, statistics, time-series, anomaly-detection, domain/data, maturity/established, source-type/practitioner]
status: draft

sources:
  - url: https://towardsdatascience.com/building-an-ai-agent-to-detect-and-handle-anomalies-in-time-series-data/
    hash: sha256:13f56bff4e75e004d638762d7bdea54bab55d032600312ffdac22cb0e9c5acbb
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Statistical Anomaly Detection (Time Series)

## Definition
The use of statistical measures — such as Z-scores and rate-of-change thresholds — to programmatically identify data points in a time series that deviate significantly from expected behaviour, flagging them as anomalies for further processing or review.

## Explanation
Before any LLM agent can reason about an anomaly, the anomaly must first be *detected*. Statistical methods provide fast, interpretable, and reproducible detection that doesn't require model training.

### Z-Score (Spike Detection)
A Z-score measures how many standard deviations a value is from the series mean:

```
Z = (value - mean) / std_dev
```

Any point with `|Z| > 3` (i.e. more than 3σ from the mean) is flagged as a spike. This catches sudden absolute deviations.

**Limitation:** Sensitive to the global distribution of the series. A slow drift upward won't trigger it if the mean shifts too.

### Growth Rate (Trend Detection)
Day-over-day percentage change:

```
growth_rate = (today - yesterday) / yesterday
```

A threshold (e.g. >40%) flags rapid relative increases — catching regime changes that Z-score alone might miss during sustained growth periods.

### Combining Both
Using both signals with OR logic gives broader coverage:

```python
anomalies = set(spike_indices + growth_rate_indices)
```

A point flagged by either method is considered anomalous. This is a binary label (YES/NO) — it says *whether* something is unusual, not *how* unusual or *why*.

### Severity Classification via Rolling Baseline
Once flagged, anomalies are classified into severity tiers by comparing the flagged value against a rolling window baseline (e.g. 7-day mean):

| Relative growth vs baseline | Severity |
|---|---|
| ≥ 100% increase | CRITICAL |
| ≥ 40% increase | WARNING |
| < 40% increase (or < absolute threshold) | MINOR |

An absolute minimum threshold (e.g. 500 units) prevents false alarms from high percentage changes on tiny absolute values.

## Key Properties
- **Deterministic:** Same inputs always produce the same anomaly labels — no stochasticity.
- **Interpretable:** Z-score and growth rate are human-readable; explainable to stakeholders.
- **Threshold-sensitive:** Requires tuning; wrong thresholds cause high false-positive or false-negative rates.
- **Univariate:** Classic Z-score/growth-rate methods work on a single metric at a time; multivariate cases need more complex approaches (e.g. isolation forests, LSTM autoencoders).
- **Historical context via rolling window:** Severity classification against a rolling baseline adds local context that global statistics miss.

## Relationships
- Feeds into [[constrained-agent-actions]]: statistical detection produces the anomaly label + severity that the agent prompt consumes
- Contrast with ML-based detection (isolation forests, LSTM autoencoders): statistical methods are simpler, faster, and more interpretable but less adaptive
- Related to [[human-in-the-loop-pattern]]: CRITICAL anomalies escalate to humans after statistical classification

## Applications
- **Time-series monitoring:** Detecting spikes in server metrics, traffic, sales, epidemiological data
- **Financial data quality:** Flagging erroneous trades or reporting errors before model training
- **IoT sensor data:** Catching sensor faults or real events in streaming telemetry
- **Preprocessing for ML:** Labelling anomalies before feeding clean data to forecasting models

## Sources
- [Building an AI Agent to Detect and Handle Anomalies in Time-Series Data](https://towardsdatascience.com/building-an-ai-agent-to-detect-and-handle-anomalies-in-time-series-data/) — step-by-step implementation with Z-score + growth rate detection on COVID-19 case data

## See Also
- [[constrained-agent-actions]]
- [[human-in-the-loop-pattern]]
