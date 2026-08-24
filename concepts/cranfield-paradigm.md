---
title: Cranfield paradigm
date: 2026-08-24
domain: knowledge-management
maturity: established
source_type: research
tags: [concept, evaluation, retrieval, history, domain/knowledge-management, maturity/established, source-type/research]
status: draft
sources:
  - url: https://en.wikipedia.org/wiki/Cranfield_experiments
    hash: sha256:c86b6c49167cdf802bd315c1f367e92b0f1f721699ead8efac66604841f2aeb4
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Cranfield paradigm

## Definition

The **Cranfield paradigm** is the retrieval-evaluation model established by Cyril Cleverdon's 1960s indexing experiments at Cranfield: a fixed document collection, a fixed query set, and per-query relevance judgments, so that competing retrieval methods can be compared on identical, reusable ground truth.

## Explanation

The experiments themselves predate computers — two phases comparing indexing systems by hand — but their design became the template for all subsequent retrieval evaluation, distributed electronically and reused for decades. Two of their findings remain live warnings. First, Cranfield 1 found implementation detail dominating methodology: one indexing method moved from least to most efficient after minor changes to how data was arranged on the cards — a caution against attributing wins to architecture when the delta lives in tuning. Second, the predecessor Gull study collapsed because two expert groups judging the same results each rejected over 30% of the other's relevance calls — the original demonstration that relevance judgment is not self-evident ground truth, which is why later paradigm instantiations fixed judgments per query up front rather than adjudicating after the fact. The paradigm's lineage runs from Vannevar Bush's memex framing of the field through Cranfield to TREC's institutionalization.

## Key Properties

- Fixed collection + fixed queries + relevance judgments = reusable, comparable evaluation
- Cranfield 1: implementation detail can dominate methodology in measured deltas
- Gull study: expert judges rejected 30%+ of each other's relevance calls
- Template for TREC and every golden-dataset harness since

## Relationships

- [[memex]] — traces its field's founding framing to that vision, which the Cranfield work turned into measurable engineering
- [[golden-dataset-retrieval-evals]] — is the sixty-year-old original of which that practice is the modern instantiation

## Applications

The design template for any retrieval eval set; historical grounding for why judgments are fixed before systems are compared, and why inter-judge disagreement must be designed for rather than assumed away.

## Sources

- https://en.wikipedia.org/wiki/Cranfield_experiments

## See Also

- [[memex]]
- [[golden-dataset-retrieval-evals]]
