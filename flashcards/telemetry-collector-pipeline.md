---
tags: [flashcards, observability, telemetry, architecture, domain/observability, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Telemetry collector pipeline — Flashcards

#flashcards/observability

## Telemetry collector: definition <!-- kb:card:c0e4a5 -->
What is a telemetry collector, architecturally?
?
A vendor-agnostic process placed between instrumented services and observability backends that receives telemetry in many protocols, processes it, and exports it to one or more destinations.

## Collector pipeline stages <!-- kb:card:f2573b -->
What are the three stages of a telemetry collector's pipeline, and what does each make independently swappable?
?
Receivers (wire protocol accepted), processors (transformation applied), exporters (destination written to) — each swappable without touching the others.

## Collector deployment forms <!-- kb:card:d9485f -->
In what two forms can a telemetry collector be deployed?
?
As a per-host agent beside the workload, or as a standalone gateway — one codebase covering traces, metrics, and logs replaces several vendor-specific agents.

## Why collector adoption is cheap <!-- kb:card:8c39bd -->
Why is adopting a telemetry collector unusually low-cost as infrastructure changes go?
?
Default OTLP exporters in each language already assume a local collector endpoint, so launching one starts receiving telemetry with no application code changes — a deployment, not a migration.

## Collector stability granularity <!-- kb:card:9b7e8c -->
At what granularity is a telemetry collector's stability actually documented?
?
Per component — each receiver, processor, and exporter documents its own maturity. The operational question is never whether the Collector is stable, but which components a pipeline uses.

## What collectors offload from services <!-- kb:card:fe92b6 -->
What operational concerns does inserting a collector move out of every service and into one shared configuration?
?
Retrying, batching, encryption, sensitive-field filtering, and fan-out to multiple backends.
