---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- data-science
- statistics
- time-series
- anomaly-detection
---


# Statistical Anomaly Detection (Time Series) — Flashcards

#flashcards/data-science


## Definition <!-- kb:card:7fb694 -->
What is statistical anomaly detection in time series?
?
The use of statistical measures — Z-scores and rate-of-change thresholds — to programmatically identify data points that deviate significantly from expected behaviour, flagging them as anomalies for further processing or review.

## Z-Score <!-- kb:card:eb0ebe -->
How does Z-score anomaly detection work in time series?
?
Z = (value − mean) / std_dev. Any point where |Z| > 3 (more than 3 standard deviations from the mean) is flagged as a spike anomaly. It catches sudden absolute deviations but is sensitive to the global distribution and misses slow drifts.

## Growth Rate <!-- kb:card:80c893 -->
What is growth rate detection, and why combine it with Z-score?
?
Growth rate = (today − yesterday) / yesterday. A threshold (e.g. >40%) flags rapid relative increases. Combined with Z-score using OR logic, it catches regime changes that Z-score alone misses during sustained growth periods.

## Severity Classification <!-- kb:card:2523f7 -->
How is severity classified after an anomaly is detected?
?
By comparing the flagged value against a rolling window baseline (e.g. 7-day mean):
- ≥100% relative increase → CRITICAL
- ≥40% relative increase → WARNING  
- <40% (or below an absolute minimum) → MINOR
An absolute minimum threshold prevents false alarms from high % changes on tiny values.

## Limitation <!-- kb:card:2c7e0a -->
What is the main limitation of Z-score and growth-rate anomaly detection?
?
They are univariate (one metric at a time), threshold-sensitive (require tuning), and lack contextual reasoning. They label *whether* something is unusual but can't determine *why* — that's where an LLM agent adds value downstream.
