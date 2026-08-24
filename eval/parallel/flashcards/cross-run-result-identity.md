---
tags: [flashcards, static-analysis, security, tooling, domain/standards, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Cross-run result identity and baselining — Flashcards

#flashcards/static-analysis

## Definition <!-- kb:card:c1760e -->
What is cross-run result identity, and what problem does it solve?
?
The problem of deciding whether a finding an analysis tool reports today is the same condition it reported yesterday, after the file has been edited, reformatted, or moved — solved via standardized fields: a content-derived fingerprint, an equivalence-class identifier, a state relative to a named baseline run, and an in-band record of waived findings.

## Key mechanism: logical identity via equivalence classes <!-- kb:card:6342b1 -->
How does SARIF define "sameness" between two results across runs?
?
As logical identity via equivalence classes, not object identity: two results are the same when they represent the same condition even though the objects differ — e.g. code inserted above a finding moves it to a new line without changing what it is.

## Fingerprint versioning <!-- kb:card:787c59 -->
Who computes a SARIF result's fingerprint, and how is its property name structured to let the hashing algorithm evolve without breaking comparisons?
?
The producer computes it from the result's content, required (so far as feasible) to survive changes like line-number shifts or a moved source root. Its property name is a versioned hierarchical string (hash method plus /v2), so a consumer comparing two results uses the greatest version present in both.

## correlationGuid vs. per-result guid <!-- kb:card:a0b9d9 -->
What is a correlationGuid in SARIF, and how does it differ from each result's own guid?
?
An opaque identifier a management system can assign per equivalence class, carrying no readable information, used instead of or alongside a fingerprint. Each individual result still keeps its own distinct guid, so identical fingerprints never collapse two occurrences into one record.

## baselineState turns a scan into a delta <!-- kb:card:3e4527 -->
What does baselineState convert a scan into, and what are its four possible values?
?
It converts a scan into a delta against a named baseline run — how many problems a change introduced and how many stopped appearing. Values: new, unchanged, updated, or absent.

## In-band suppression for auditability <!-- kb:card:7b0d17 -->
How does SARIF record a deliberate non-fix (a waived finding), and why does this matter for compliance?
?
In the log itself, with a kind (source-level construct or external store) and a status (accepted, under review, or rejected) — so a deliberate non-fix travels as reviewable data rather than invisible tool configuration, letting a team show an auditor that every result was seen and either fixed or explicitly waived.
