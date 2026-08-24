---
title: Triage as a separate evidence pass
aliases:
  - Evidence re-check pass
  - Separate triage phase
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, agents, security, verification, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/
    class: external-secondary
---

# Triage as a separate evidence pass

## Definition

**Triage as a separate evidence pass** is the discipline of never letting the process that generates candidate findings also decide which of them are real: the generator emits candidates, and a distinct later pass re-checks each candidate against the evidence it cited, under two conservative rules — de-duplication that merges only demonstrable copies of the same issue, and uncertainty that downgrades a finding's confidence rather than dropping it.

## Explanation

The failure it addresses is specific to model-driven analysis: plausible-sounding findings that do not reproduce. Separating the passes helps because generation and verification are rewarded for opposite things. A pass searching for issues is rewarded for coverage and will accept a thin chain of reasoning to reach a candidate, since a missed issue costs it and a weak one does not; a pass whose only job is to test a candidate against its own cited evidence gains nothing from that candidate surviving. Running them as one step means the same reasoning that produced the claim also grades it, which is the arrangement most likely to preserve a motivated conclusion. Separation also makes the filter inspectable — its inputs and its verdicts become an artifact someone can audit, rather than an unlogged judgement buried inside the search. The two de-duplication rules encode the same caution about which way to fail: collapsing only provable copies means the pass never makes a keep-or-kill decision on borderline findings, and downgrading rather than dropping anything it is unsure about means uncertainty reaches the operator as a low-confidence entry instead of silence. Both choices push the error toward a noisier report rather than a quietly missing vulnerability, which is the right direction when a false negative is invisible and a false positive is merely irritating. The source is trade-press coverage of an interview with an open-source scanner's author, so this is stated design intent rather than a measured false-positive reduction.

## Key Properties

- Generation and verification are rewarded for opposite things, so one pass cannot serve both
- Each candidate is re-checked against the specific evidence it cited, as its own phase after the scan
- De-duplication merges only demonstrable copies and never makes keep-or-kill calls on borderline findings
- Uncertain findings are downgraded and still shown, never quietly dropped
- The failure direction is chosen deliberately: a noisier report beats an invisible false negative

## Relationships

- [[agent-budget-caps]] — governs whether this pass can do its job at all, because re-check iterations are one of the capped resources and a starved triage phase degrades into a rubber stamp
- [[risk-tiered-agent-change-control]] — generalises the same separation to change pipelines — creating a change and checking it are assigned to different identities for the reason triage is given its own pass, and both leave an evidence trail someone else can reconstruct
- [[independent-fix-verification]] — independent fix verification applies the identical separation-of-roles principle evidence-recheck triage states for finding triage — generator and checker must be different processes — to the fix side of the same pipeline: whoever proposed the remediation cannot be who confirms it worked.

## Applications

Structuring any LLM-driven detection pipeline — security scanning, code review, data-quality checks — as generate-then-verify rather than one combined judgement; setting dedup policy so uncertain duplicates surface downgraded instead of being collapsed away; auditing an agent's filter by reading the triage artifact rather than the final report.

## Sources

- https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/

## See Also

- [[agent-budget-caps]]
- [[risk-tiered-agent-change-control]]
