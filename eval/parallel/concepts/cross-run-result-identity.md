---
title: Cross-run result identity and baselining
date: 2026-08-24
domain: standards
maturity: established
source_type: vendor-doc
tags: [concept, static-analysis, security, tooling, domain/standards, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html
    class: external-primary
---

# Cross-run result identity and baselining

## Definition

**Cross-run result identity** is the problem of deciding whether a finding an analysis tool reports today is the same condition it reported yesterday — after the file has been edited, reformatted or moved — together with the standardized fields that answer it: a content-derived fingerprint, an equivalence-class identifier, a state relative to a named baseline run, and an in-band record of findings deliberately waived.

## Explanation

Without a notion of sameness, a scanner can only report a count, so every run re-litigates the whole backlog and no pipeline can say what a given change introduced. SARIF 2.1.0 formalizes sameness as equivalence classes over results: two results are logically identical when they represent the same condition even though the objects differ — code inserted above moves a finding to a new line without changing what it is. It then standardizes three ways a results-management system can express that grouping. A fingerprint is computed by the producer from the result's content and is required, so far as feasible, to survive changes that do not affect logical identity such as the line number or the root of the source enlistment; its property name is a versioned hierarchical string like a hash method plus /v2, so an algorithm can improve without breaking comparisons — a consumer comparing two results uses the greatest version present in both. Alternatively a management system can assign an opaque correlationGuid per equivalence class, carrying no readable information, and either way each individual result keeps its own distinct guid, so identical fingerprints never collapse two occurrences into one record. Layered on identity is baselining: a run may name a baseline run, and each result then carries a state of new, unchanged, updated or absent, which is what converts a scan into a delta — how many problems this change introduced and how many stopped appearing. The third leg is suppression recorded in the log itself, with a kind saying whether the waiver came from a source-level construct or an external store and a status of accepted, under review or rejected, so a deliberate non-fix travels as reviewable data rather than as invisible tool configuration — the compliance case where a team must show an auditor that every result was seen and either fixed or explicitly waived. The design worth carrying elsewhere is the division of labour: identity is computed by the producer, which alone knows the content; the delta is computed by the consumer against a baseline it names; and the standard fixes the slots without mandating the hashing algorithm, so match quality stays each tool's own problem. This comes from the ratified OASIS specification text, whose normative clauses make conformance machine-checkable.

## Key Properties

- Logical identity, not object identity: the same condition survives moving to a different line
- Fingerprints are producer-computed and must resist re-rooting and line shifts; versioned key names let a comparer pick the greatest common version
- An opaque correlationGuid can denote an equivalence class instead of, or alongside, a fingerprint, while each result keeps a distinct guid
- baselineState — new, unchanged, updated, absent — against a named baseline run turns a scan into a delta
- Suppressions live in the log with a kind and a review status, making waived findings auditable rather than configuration
- The specification standardizes the slots for identity, not the algorithm that fills them

## Relationships

- [[sarif-format]] — is the container this machinery lives in — the same document that normalizes what a tool found also carries the fields that decide whether it had found it before, which is what lets a platform ingest scans as deltas rather than as fresh backlogs

## Applications

Annotating a pull request with only the findings the change introduced instead of a repository's entire backlog; keeping a triage decision attached to an issue after the surrounding file is reformatted; producing audit evidence that every reported result was either fixed or explicitly accepted.

## Sources

- https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html

## See Also

- [[sarif-format]]
