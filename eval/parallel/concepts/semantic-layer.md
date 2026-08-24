---
title: Semantic layer
date: 2026-08-24
domain: data
maturity: emerging
source_type: practitioner
tags: [concept, data, analytics, architecture, domain/data, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    hash: sha256:52b9aa4d85844d1297a66a66f03904fc0d72fc860de4eb0fb9196fe3e6f1e8c7
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Semantic layer

## Definition

A **semantic layer** is a shared definition tier between raw data stores and everything that consumes them — dashboards, APIs, notebooks, agents — holding the metric formulas, joins, access rules and business vocabulary in one place, so that a term like active customer or recognised revenue has exactly one computable meaning rather than one per query that happens to mention it.

## Explanation

The mechanism is indirection with a single owner: consumers request a named metric along with dimensions and filters, and the layer compiles that request into the query the warehouse actually runs, applying the joins and the business rules the definition implies. What it prevents is drift by copy — without it, business logic disperses into ad-hoc warehouse tables, dashboard-local formulas and application code, each fork correct on the day it was written and quietly divergent afterwards, which is at its most damaging precisely where numbers drive decisions and two teams present different values for the same word. Agentic access has made the gap sharper rather than introducing it: a model asked to translate a question into SQL can only use rules present in the schema, so whenever the real definition lives outside the tables — revenue recognition timing, exclusions, allocation policies — naive text-to-SQL produces answers that are confidently wrong and structurally plausible, and a semantic layer is what puts those rules where a generator can be made to use them. The idea predates the modern data stack and has returned in code-first form, with cloud warehouses embedding their own versions under vendor-specific names, standalone tools offering a layer portable across engines, and a recent multi-vendor interchange specification attempting to make definitions portable between them. The cost is honest and front-loaded: it is a modelling exercise, and the recommended path is one domain at a time, because enterprise-wide rollouts tend to leave legacy reports running beside the new layer and thereby recreate the inconsistency the layer existed to remove. The source is Thoughtworks' Technology Radar, a consultancy's editorial read of its own engagements.

## Key Properties

- Metric formulas, joins, access rules and vocabulary are defined once and compiled into queries on demand
- Consumers ask for a named metric with dimensions rather than writing the join and filter logic themselves
- Removes definition drift across dashboards, ad-hoc tables and application code
- Gives text-to-SQL and agent access a place to read business rules that do not exist in the schema
- Costs upfront modelling; partial rollouts that leave legacy reports in parallel reintroduce the divergence

## Relationships

- [[agent-legible-architecture]] — extends the same argument from code to data — a model cannot reason safely about behaviour it cannot see in the source, and business rules living outside the schema are exactly such invisible behaviour until a definition layer makes them explicit
- [[attested-computation]] — attested computation supplies the verification half of what a semantic layer's shared definitions need to be trustworthy — a semantic layer fixes what a metric means, an attested computation's receipt lets a consumer mechanically confirm a reported number came from running that blessed definition.

## Applications

Giving BI tools, APIs and agents one definition of the metrics a business argues about; making natural-language querying safe over a warehouse whose rules are not in its schema; consolidating a dashboard estate where the same metric name resolves differently per report.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- [[agent-legible-architecture]]
