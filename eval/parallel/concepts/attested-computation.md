---
title: Attested computation
date: 2026-08-24
domain: standards
maturity: emerging
source_type: vendor-doc
tags: [concept, provenance, agents, data, domain/standards, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
    class: external-primary
---

# Attested computation

## Definition

An **attested computation** is a document that carries not only what a value means but the sanctioned way to produce it — a runtime, a typed list of named parameters, the computation itself, an executor that runs it and returns a receipt, and a deterministic checker that inspects that receipt — so a consumer can confirm mechanically that the number it was shown came from running the blessed computation, rather than from something an agent improvised that merely looks right.

## Explanation

The mechanism is a deliberately narrow surface. The agent may supply values for declared parameters and nothing else; it must not author or edit the computation. Binding those values into an executable artifact is the consumer's job, and the checker independently re-derives the same binding and compares it against what actually ran — comparing the expanded, compiled artifact the receipt carries, so a rewritten query, a swapped computation file or a mutated dependency all fail. That parameter-only surface is precisely what turns "did the sanctioned thing run" from a judgement call into a string comparison, and the checker is ordinary deterministic code with no model in the loop, meant to run on the consumer's side. Fidelity is handled the same way: the displayed value is re-read from the receipt's authoritative source by job identifier rather than taken from the agent's own text, closing the gap where a correct run is reported with an incorrect number. The pattern separates two things usually conflated — verification confirms the definition still matches policy and is document-level, slow and stored, while attestation confirms one run produced its value legitimately and is per-call, runtime and never stored — so a stale definition can still attest cleanly and a freshly verified definition still needs attestation on every run. Each computation is its own document because the runtime is what gives parameters their meaning, because one computation backs many consumers, and because trust state is per computation: revenue, profit and margin expire and attest independently. The source is the Open Knowledge Format specification, which fixes the interface and openly defers the receipt wire format, the checker's ABI, sandboxing and caching to a later revision, so this is a stated design pattern rather than a shipped runtime.

## Key Properties

- The agent fills declared parameters only and may never author or edit the computation
- Comparison happens on the expanded artifact the receipt carries, so rewritten queries or swapped files fail the check
- Fidelity is established by re-reading the value from the authoritative source by job id, not from the agent's text
- Verification (the definition still matches policy) and attestation (this run was sanctioned) are distinct and both required
- The checker is deterministic consumer-side code with no model involved

## Relationships

- [[agent-maintained-knowledge-bundle]] — is the corpus convention that defines this as a document type, and this answers the question provenance cannot — not where a claim came from, but whether this particular number was produced the sanctioned way
- [[context-layer]] — faces the failure this guards against, since a layer that hands an agent the schema and semantics of a metric has given it everything it needs to write a plausible query of its own instead of the organization's blessed one
- [[semantic-layer]] — attested computation supplies the verification half of what a semantic layer's shared definitions need to be trustworthy — a semantic layer fixes what a metric means, an attested computation's receipt lets a consumer mechanically confirm a reported number came from running that blessed definition.

## Applications

Serving finance or operations metrics to an agent so the figure it reports can be proved to come from the sanctioned query; gating a dashboard, report or answer on a failed attestation instead of displaying a number nobody can trace to a run.

## Sources

- https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md

## See Also

- [[agent-maintained-knowledge-bundle]]
- [[context-layer]]
