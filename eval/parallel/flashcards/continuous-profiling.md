---
tags: [flashcards, observability, performance, profiling, domain/observability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Continuous profiling — Flashcards

#flashcards/observability

## Definition <!-- kb:card:bcedd5 -->
What is continuous profiling?
?
Always-on statistical sampling of a fleet's stack traces, taken from outside the process so no application code changes and every language is covered equally, aggregated over time into flamegraphs that answer which functions a service actually spends its CPU on.

## Key mechanism: sampling economics <!-- kb:card:d715df -->
How does a continuous profiler sample process stacks, and why does this make always-on collection affordable?
?
A per-node agent samples the stack of every running process at a low fixed rate (around 19 samples per second per logical CPU), shipping aggregates to a central store as time series. It is affordable because the output is a distribution, not a ledger: missing samples cost precision, not correctness — unlike per-request tracing at the same coverage.

## Profiles vs. traces <!-- kb:card:fea577 -->
What is the difference between what a profile answers and what a trace answers?
?
A trace follows one request across services with timing and context, answering why that request was slow. A profile describes aggregate on-CPU behaviour, answering where a service's compute goes overall. Neither substitutes for the other.

## Latency and CPU cost decouple <!-- kb:card:453db8 -->
How can latency and CPU cost decouple in a profile's view of a service, in both directions?
?
A slow request can have a cheap profile if it spent its time waiting on I/O, and a fast request can have an expensive profile if it is CPU-bound well inside its latency budget.

## Semantic limit <!-- kb:card:c54dce -->
What does a profile fail to tell you, and whose job is it to supply that missing context?
?
A profile knows a symbol, not who owns it, what it costs, or which user-facing objective it threatens — that context remains the job of deliberate instrumentation and its metadata. Kernel-side collection extends instrumentation rather than replacing it.
