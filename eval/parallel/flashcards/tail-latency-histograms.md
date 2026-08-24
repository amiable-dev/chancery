---
tags: [flashcards, observability, monitoring, latency, domain/observability, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Tail latency histograms — Flashcards

#flashcards/observability

## Tail latency histograms: definition <!-- kb:card:158dd4 -->
What is a tail latency histogram, and why is it preferred over recording averages?
?
Request counts bucketed by latency, with boundaries spaced roughly exponentially, instead of raw latencies or means — so a slow tail shows up as its own visible population instead of being absorbed into a mean that describes no request anyone actually made.

## Why averages hide the tail <!-- kb:card:0b749d -->
If a service averages 100ms and 1% of requests take five seconds, what does that imply about the other 99% of requests?
?
The remaining 99% must run about twice as fast as the average — believing most requests sit near the mean, without a measured distribution, is simply hope.

## Tail latency compounds across fan-out <!-- kb:card:f7f0e5 -->
Why is tail latency a system property rather than a per-service curiosity?
?
When a page is assembled from several backends, one backend's 99th percentile becomes the frontend's median.

## Why bucketing is cheap <!-- kb:card:b59e6b -->
Why does bucket-based latency collection cost the same regardless of request rate?
?
Each request only increments a counter in its bucket, rather than recording and storing an individual latency value.

## Choosing measurement resolution per signal <!-- kb:card:c85004 -->
What is the governing rule for choosing measurement resolution, according to this concept?
?
Pick resolution per signal against what the target actually requires — e.g. minute-resolution CPU averages hide the spikes that drive tail latency, but probing a three-nines service more than once or twice a minute buys nothing.
