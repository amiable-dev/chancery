---
title: Tail latency histograms
date: 2026-08-24
domain: observability
maturity: established
source_type: practitioner
tags: [concept, observability, monitoring, latency, domain/observability, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://sre.google/sre-book/monitoring-distributed-systems/
    hash: sha256:0b46517deadbdc47994f359966cc29ba0390ef5eee4f68988a189a49c73c2f3b
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Tail latency histograms

## Definition

**Tail latency histograms** are the practice of collecting request counts bucketed by latency, with bucket boundaries spaced roughly exponentially, rather than recording individual latencies or averaging them — so that a slow tail shows up as its own visible population instead of being absorbed into a mean that describes no request anyone actually made.

## Explanation

The mechanism is a bet about where the interesting information is. A service averaging 100 ms at 1,000 requests per second can comfortably have 1% of requests taking five seconds; and if 1% of requests run fifty times the average, the remaining 99% must be about twice as fast as the average — so believing most requests sit near the mean is, without a measured distribution, simply hope. The damage compounds across a fan-out: when a page is assembled from several backends, the 99th percentile of one backend becomes the median of the frontend, which is why tail latency is a system property rather than a per-service curiosity. Bucketing by factors of roughly three — nought to ten milliseconds, ten to thirty, thirty to a hundred, a hundred to three hundred — makes the shape of the distribution legible at a cost that does not grow with request rate, since each request only increments a counter. The same trick generalizes to sampling resolution: rather than shipping per-second CPU samples, record utilization each second into buckets of 5% granularity and aggregate every minute, which preserves brief hotspots without paying collection and retention costs for raw samples. The governing rule is to pick resolution per signal against what the target actually requires — a minute-resolution CPU average hides the spikes that drive tail latency, while probing a service targeting three nines for a success status more than once or twice a minute buys nothing at all. The same warning applies beyond latency: CPU and database fullness are routinely imbalanced, so their means mislead for the same reason.

## Key Properties

- Collect bucketed counts rather than raw latencies or means, with boundaries spaced roughly exponentially
- One backend's 99th percentile becomes the frontend's median when a page fans out across services
- Means mislead for CPU and storage fullness too, since both are commonly distributed unevenly
- In-process bucketing followed by periodic aggregation keeps high resolution affordable
- Measurement resolution should be chosen per signal against the availability target, not uniformly

## Relationships

- [[four-golden-signals]] — depends on this for two of its four members, because a mean latency signal is nearly useless as a page trigger and saturation is read partly off the latency tail
- [[wide-events-single-source-of-truth]] — makes the opposite trade — histograms discard per-request identity to make aggregates cheap, where wide events keep it so that questions nobody anticipated remain answerable afterwards

## Applications

Instrumenting request latency in a new service; settling a dispute where the average looks healthy but users report slowness; choosing sampling granularity for expensive signals such as CPU utilization.

## Sources

- https://sre.google/sre-book/monitoring-distributed-systems/

## See Also

- [[four-golden-signals]]
- [[wide-events-single-source-of-truth]]
