---
title: Comprehension gate
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: vendor-doc
tags: [concept, code-review, human-ai-interaction, software-engineering, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    hash: sha256:ddab0eb45dd176c5a5d118c577770304f076a84b2d8a65d68ed5670f43f44198
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Comprehension gate

## Definition

A **comprehension gate** is a merge precondition satisfied by the human rather than the machine: before a model-authored change lands, the person accountable for it must demonstrate that they understand it — canonically by passing a quiz the model generates about the change's behaviour — on the premise that reading a diff is not evidence of understanding when the behaviour depends on code paths the diff does not show.

## Explanation

The gate targets a specific gap opened by fast agentic work. A long session can produce far more change than its operator tracked, and a diff shows only the lines that moved; whether those lines behave as intended depends on the surrounding system, which the reviewer must hold in their head and typically does not. A generated report plus a quiz forces the issue in both directions: producing it makes the model state the change's intent, its interaction with existing paths, and the intuition behind it, and answering it reveals to the reviewer exactly which parts they had been nodding along to. Setting the bar at a perfect score is deliberate — a partial pass identifies the misunderstanding but merges it anyway. The same artifact serves the wider review: people asked to approve a change begin with the unknowns its author began with, so packaging the prototype, the plan, and the deviations into one explainer both accelerates approval and demonstrates that the failure modes an expert would have asked about were considered. The practice does not verify correctness — a quiz written by the same model that wrote the code shares its blind spots — but it does verify that a human can answer for what is shipping.

## Key Properties

- The gate is on human understanding, not on tests, lint, or model self-review
- Motivated by diffs under-representing behaviour that depends on untouched code paths
- Canonical form is a model-generated explainer plus a quiz the reviewer must pass perfectly
- The same artifact doubles as the reviewer-facing pitch, since reviewers start with the author's original unknowns
- Does not establish correctness — an author-written quiz inherits the author's blind spots — only accountability

## Relationships

- [[deviation-log]] — feeds it, since the recorded departures from plan are what a reviewer is least able to reconstruct from the diff alone
- [[unknowns-inventory-prompting]] — closes its loop after the fact — the quiz measures which unknowns the session left the operator still holding
- [[shared-mental-model-erosion]] — a comprehension gate is the direct countermeasure shared-mental-model erosion calls for — forcing verified understanding, a passed quiz rather than a read diff, before merge is exactly the practice that stops comprehension liability accruing silently.

## Applications

Gating merges of long agent sessions on a self-administered quiz; packaging plan, prototype, and deviations into a single explainer to get review and approval from people who did not watch the work happen.

## Sources

- https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns

## See Also

- [[deviation-log]]
- [[unknowns-inventory-prompting]]
