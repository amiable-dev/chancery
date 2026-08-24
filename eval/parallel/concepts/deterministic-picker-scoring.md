---
title: Deterministic-picker scoring
aliases:
  - Deterministic picker pattern
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, evaluation, llm-as-judge, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://github.com/FareedKhan-dev/all-agentic-architectures
    class: external-primary
---

# Deterministic-picker scoring

## Definition

**Deterministic-picker scoring** is a design discipline for any place a language model is asked to judge: instead of letting the model emit a numeric score or name a winner directly, the model is required to commit to categorical features — booleans and enumerated labels — about each candidate, and ordinary program code composes those features into the deciding signal. Judgement stays with the model; the arithmetic that turns judgement into a decision moves into code, where it is reproducible, testable and inspectable.

## Explanation

The pathology it escapes is that a model asked to rate something on a numeric scale returns values clustered in a narrow band: candidates of visibly different quality all come back around the same number, so the differences that would drive a ranking sit inside the model's own noise, and instructing it to be harsher shifts the band without widening its discrimination. Asking for discrete, individually checkable facts instead — does this output cite a source, is the tone formal or casual, which of four failure categories applies — puts the model on the kind of question it answers comparatively reliably, and leaves the weighting, thresholds and tie-breaking as ordinary program state. That relocation buys three things: the decision is reproducible given the same feature vector, the weights can be unit-tested and changed without re-prompting or re-validating the model, and a decision can be explained afterwards by pointing at the feature that flipped it. The cost is that the discriminating features must be named in advance, which is the actual design work the pattern demands. It is worth being precise about what the discipline does not do: it makes a judgement legible and stable, not correct — if the model misreads a feature, the composed decision is confidently wrong in a traceable way. The source is a solo-authored open-source library that adopts this as its house style and reports applying it in thirteen of its thirty-five patterns with nine more immune by construction, which is the author's own accounting rather than an independent evaluation of the technique.

## Key Properties

- The model commits to booleans and enums; code composes them into the deciding signal
- Escapes the flat-band pathology in which numeric self-ratings cluster too tightly to rank candidates
- Weights, thresholds and tie-breaks become program state — unit-testable and changeable without re-prompting
- Decisions are explainable after the fact by pointing at the feature that changed the outcome
- Requires naming the discriminating features up front; it makes judgement inspectable, not correct

## Relationships

- [[deterministic-agentic-capability-matrix]] — extends that procedure one level down: the matrix decides which workflow steps reach a model at all, and this discipline splits the steps that do into a model-judged feature part and a code-decided arithmetic part, so even a call that genuinely needs reasoning gives up its deciding logic to fixed rules
- [[interchangeable-agentic-architectures]] — is the scoring convention that catalog applies inside its patterns wherever one has to rank or accept a candidate, which is what makes patterns from different papers comparable on the same task suite rather than each carrying its own idiosyncratic self-rating

## Applications

Designing an LLM-as-judge, reranking or self-critique step so its ordering is reproducible; replacing an existing one-to-ten self-rating in an eval harness or agent loop with an enum-and-boolean rubric composed in code; making a routing decision auditable by keeping the routing arithmetic outside the prompt.

## Sources

- https://github.com/FareedKhan-dev/all-agentic-architectures

## See Also

- [[deterministic-agentic-capability-matrix]]
- [[interchangeable-agentic-architectures]]
