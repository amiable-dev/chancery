---
tags: [flashcards, developer-experience, kubernetes, testing, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Request-level sandbox isolation — Flashcards

#flashcards/developer-experience

## Definition <!-- kb:card:58d92c -->
What is request-level sandbox isolation?
?
Deploying only the changed services as an ephemeral overlay on a shared baseline Kubernetes cluster, then routing individual requests into that overlay via a header-borne routing key propagated on every downstream call.

## Two required halves <!-- kb:card:bbb8df -->
What two mechanisms must both hold for request-level sandbox isolation to work?
?
Request routing (mesh or sidecar deciding baseline vs. sandbox at each hop) and application-layer context propagation (carrying the routing key header across every hop) — either alone is insufficient.

## How routing is enforced <!-- kb:card:7eb7b0 -->
How is request routing to the sandbox enforced at each hop?
?
By configuring a service mesh such as Istio to route on the header, or by attaching a dedicated lightweight sidecar proxy to each workload when no mesh is present.

## How propagation works <!-- kb:card:484449 -->
How does the routing key survive every hop between services?
?
Via an OpenTelemetry-based library that copies the header from each incoming request onto every outgoing request — automatic in some languages, manual in others.

## Failure mode <!-- kb:card:278da7 -->
What happens when a service fails to propagate the routing header?
?
It silently falls back to the baseline service rather than failing loudly — this is the mechanism's main failure mode.

## vs. remocal development <!-- kb:card:73e187 -->
How does request-level sandbox isolation differ from remocal development in what it isolates?
?
Remocal development binds a local process to one remote pod's traffic; request-level sandbox isolation runs changed services in-cluster and routes tagged requests to them, letting many sandboxes coexist on the same shared cluster.
