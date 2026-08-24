---
title: Spec-driven SLO rule generation
date: 2026-08-24
domain: reliability
maturity: emerging
source_type: practitioner
tags: [concept, reliability, observability, sre, domain/reliability, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://github.com/slok/sloth
    hash: sha256:d68c7bc39a3d4ad595ce5b27274cd979b433a75602ca4b7a7350c581ab2ba7c7
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Spec-driven SLO rule generation

## Definition

**Spec-driven SLO rule generation** is the practice of declaring a service's objective once in a compact spec — the target percentage, the period, and the two queries that count bad events and total events — and compiling that mechanically into the whole set of monitoring artifacts it implies, instead of hand-writing recording rules, metadata and burn-rate alerts per service.

## Explanation

The compiler's input is a few lines per objective: a name, an objective such as 99.9, and an SLI given as an error query and a total query with the evaluation window left as a placeholder the generator fills in. From that it emits three layers — recording rules that precompute the error ratio at every window the alerting scheme needs, metadata rules that carry the objective and its labels so dashboards can read them, and page-severity and ticket-severity alert rules implementing the multiwindow multi-burn-rate scheme, with routing and severity labels attached. The point is not saving keystrokes but removing a class of expertise-gated error: window arithmetic and burn-rate thresholds are derived once inside the generator rather than re-derived, and mistyped, by every team. Because generation is deterministic, the spec becomes the reviewable artifact — diffable in a pull request, checkable by a validate command in CI, and identical in shape across services, which is what makes a single generic dashboard and one alert-routing convention work org-wide. Extension points follow from the same structure: custom SLI plugins let an organization codify its own query patterns, a Kubernetes operator mode reads the same spec from a custom resource beside the workload, and importing a vendor-neutral spec format keeps the declaration portable if the generator changes. The evidence here is a maintained open-source project's own README, which asserts uniformity and reliability rather than measuring them; what it does make checkable is the transformation itself, since the repository publishes an example spec next to the exact rules it produces.

## Key Properties

- Input is a small per-service spec: objective, period, and templated error/total event queries
- Output is generated SLI recording rules, SLO metadata rules, and paired page/ticket burn-rate alerts
- Window arithmetic and burn thresholds live in the generator, not in each team's hand-written rules
- Deterministic output makes the spec reviewable in a pull request and validatable in CI before it reaches monitoring
- Uniform generated label shape lets one dashboard and one routing convention cover every service

## Relationships

- [[slo-burn-rate-alerting]] — turns that method into a compile target — the spec states only the objective and the SLI, and the generator derives the multiwindow multi-burn rules the SRE Workbook specifies, so no team re-derives the window math
- [[build-time-generation-governance]] — spec-driven SLO generation and build-time generation governance share a declare-once-compile-everywhere pattern applied to different artifacts — monitoring rules in one case, code-generation constraints in the other — where one declared spec becomes both a generation-time bias and a deterministic enforcement rule.

## Applications

Rolling SLOs out across many teams with one reviewable spec per service; replacing hand-maintained Prometheus alert rules with generated ones; gating SLO changes in a GitOps pipeline by validating the spec before the rules are ever applied.

## Sources

- https://github.com/slok/sloth

## See Also

- [[slo-burn-rate-alerting]]
