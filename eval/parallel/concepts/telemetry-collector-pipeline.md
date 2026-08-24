---
title: Telemetry collector pipeline
aliases:
  - OpenTelemetry Collector
date: 2026-08-24
domain: observability
maturity: established
source_type: vendor-doc
tags: [concept, observability, telemetry, architecture, domain/observability, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://opentelemetry.io/docs/collector/
    hash: sha256:0eb96678cc804084a4b6ac3e22d54e2946189f1e163c2e18cffd258c1e3dee86
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Telemetry collector pipeline

## Definition

A **telemetry collector** is a vendor-agnostic process placed between instrumented services and observability backends that receives telemetry in many protocols, processes it, and exports it to one or more destinations. Its architectural point is the hand-off: a service emits locally and returns to its work, and everything harder that happens next — retrying, batching, encrypting, filtering sensitive fields, fanning out to more than one backend — becomes configuration in one process rather than code duplicated into every service in every language. One codebase covers traces, metrics and logs, deployable either as a per-host agent beside the workload or as a standalone gateway, which is what removes the need to run several vendor-specific agents at once.

## Explanation

The mechanism is a three-stage pipeline of receivers, processors and exporters, which makes the wire protocol accepted, the transformation applied, and the destination written to three independently swappable choices rather than properties baked into whichever SDK each service compiled in. That decoupling is what the pattern actually buys, and it is why the recommendation splits by stage rather than by scale alone. Exporting straight from a language SDK to a backend is the fastest way to get value while first trying instrumentation, and is adequate in development or at small scale; in production a collector alongside the service is preferred because the service can offload quickly and a process designed for the job takes over the retry, batching, encryption and scrubbing that would otherwise be reimplemented per language and drift between them. The adoption cost is unusually low for an infrastructure change, since default OTLP exporters in each language already assume a local collector endpoint, so launching one starts receiving telemetry without editing application code — the switch is a deployment rather than a migration. Two things are worth reading carefully. The source is the project's own documentation overview, essentially a link hub carrying one coarse recommendation and a short rationale, so it argues the pattern rather than measuring it, and the actionable detail lives in the pages it links rather than in the page itself. And it discloses that the Collector's stability is mixed at the component level, with each receiver, processor and exporter documenting its own maturity, so the question that matters operationally is never whether the Collector is stable but which specific components a given pipeline is built from.

## Key Properties

- A pipeline of receivers, processors and exporters, making protocol, transformation and destination independently swappable
- One codebase covering traces, metrics and logs, replacing several vendor-specific agents
- Deployable as a per-host agent beside the workload or as a standalone gateway
- Moves retries, batching, encryption, sensitive-field filtering and multi-backend fan-out out of every service into one configuration
- Cheap to adopt because default OTLP exporters already target a local collector endpoint, so no application code changes
- Stability is documented per component rather than for the Collector as a whole

## Relationships

- [[collector-side-telemetry-reduction]] — is the highest-value use this pipeline is put to once it exists, moving the keep-or-drop decision into the processor stage where a complete trace can be judged rather than deciding at instrumentation or query time
- [[observability-generations]] — is the axis this component stays neutral on, since a collector will faithfully deliver the same telemetry into separate pillar stores or into a single wide-event store, so deploying one settles the transport question without settling the storage one
- [[pillars-as-wide-event-projections]] — describes a data model the processor stage can be used to converge on, normalising separately-emitted signals into one event stream before anything reaches storage

## Applications

Deciding when a service should stop exporting directly to a backend and hand off to a local collector instead, and consolidating retry, batching, encryption, scrubbing and multi-backend routing into one platform-owned configuration rather than into every service's instrumentation code.

## Sources

- https://opentelemetry.io/docs/collector/

## See Also

- [[collector-side-telemetry-reduction]]
- [[observability-generations]]
- [[pillars-as-wide-event-projections]]
