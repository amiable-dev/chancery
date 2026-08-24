---
title: Request-level sandbox isolation
date: 2026-08-24
tags:
  - concept
  - developer-experience
  - kubernetes
  - testing
  - domain/infrastructure
  - maturity/emerging
  - source-type/vendor-doc
status: draft
sources:
  - url: https://www.signadot.com/docs/concepts/sandbox
---

# Request-level sandbox isolation

## Definition

Request-level sandbox isolation is the pattern of deploying only the changed services of a microservice stack as an ephemeral overlay on a shared baseline Kubernetes cluster, then steering individual requests into that overlay by attaching an opaque routing key to a well-known header and propagating that header along every downstream call, so a single cluster hosts many concurrent, isolated test environments without duplicating the full stack for each one.

## Explanation

The mechanism has two halves that must both hold for isolation to work. Request routing decides, at each hop, whether a call should go to the baseline service or to a sandboxed replacement; this is enforced either by configuring a service mesh such as Istio to route on the header, or by attaching a dedicated lightweight sidecar proxy to each workload when no mesh is present. Context propagation is the other half: the routing key must survive every hop between services, which cannot be inferred by watching traffic externally, so it has to be carried by the application layer itself, typically via an OpenTelemetry-based library that copies the header from each incoming request onto every outgoing one — automatic in some languages, requiring manual instrumentation in others. Because isolation rides entirely on this header rather than on network segmentation, any service that fails to propagate the header silently falls back to the baseline, which is both the mechanism's main failure mode and the reason both halves are necessary rather than either alone.

## Key Properties

- isolation carried by a header-borne routing key, not by network or namespace segmentation
- requires request routing (mesh or sidecar) and application-layer context propagation together — either alone is insufficient
- a dropped or unpropagated header silently falls through to the baseline service rather than failing loudly
- many concurrent sandboxes share one baseline cluster instead of each forking a full environment

## Relationships

- [[remocal-development]] — both isolate a slice of a Kubernetes cluster for one developer's changes, but remocal-development binds a local process to one remote pod's traffic while request-level sandbox isolation instead runs the changed services in-cluster and routes tagged requests to them, letting many sandboxes coexist on the same shared cluster

## Applications

Teams building per-pull-request preview or integration-test environments for a microservices stack can deploy only the changed services and route requests carrying that run's identifier into them, avoiding a full environment fork per branch; the same routing-key-plus-propagation mechanism generalizes to canary releases, dark launches, and any multi-tenant staging setup where a request's origin, not its destination host, must determine which service version handles it.

## Sources

- https://www.signadot.com/docs/concepts/sandbox

## See Also

- [[remocal-development]]
