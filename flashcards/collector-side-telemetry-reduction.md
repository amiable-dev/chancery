---
tags: [flashcards, observability, sampling, cost-control, domain/observability, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Collector-side telemetry reduction — Flashcards

#flashcards/observability

## Definition <!-- kb:card:36c4a1 -->
What is collector-side telemetry reduction, and where in the pipeline does the keep-or-drop decision happen?
?
Deciding what telemetry is worth storing inside the collector process between instrumented services and the storage backend (not at instrumentation time or query time), so spend falls with volume while every error, slow, and debug-flagged trace is still stored in full.

## Key mechanism: head vs. tail sampling <!-- kb:card:c1c36d -->
Why can tail-based sampling keep all failed traces while head-based sampling structurally cannot?
?
Head-based sampling decides at the first span, before the trace's outcome is known, so it must sample failures at the same rate as successes. Tail-based sampling buffers the complete trace and decides only after it finishes, so policy can key on the actual outcome.

## Canonical tail-sampling policy <!-- kb:card:e83e76 -->
What is the canonical tail-sampling policy shape for collector-side telemetry reduction?
?
Keep everything with an error status, everything above a latency threshold, and anything carrying a debug header; drop health-check/readiness routes outright; sample the routine remainder at a few percent.

## Other cost levers <!-- kb:card:4c3d0c -->
Besides trace sampling, what two other collector-side levers cut telemetry cost, and what does each target?
?
Attribute trimming (truncating/deleting fat span attributes like full SQL text or headers) reduces per-span size; label normalization (stripping per-instance labels, templating route names) reduces metric series cardinality, a cost driver billed separately from volume.

## Validation and measurement discipline <!-- kb:card:467c3b -->
How should a collector-side reduction rollout be validated and measured?
?
Roll out one strategy at a time, validating each with deliberate tests (trigger a known error, inject latency, check dashboards, fire a test alert) before starting the next; measure the actual reduction from the collector's own accepted-vs-exported span counters, not from next month's invoice.
