---
tags: [flashcards, security, static-analysis, standards, domain/standards, maturity/established, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# SARIF format — Flashcards

#flashcards/security

## Definition <!-- kb:card:89401b -->
What is SARIF?
?
A standardized JSON schema for static analysis tool output, letting findings from any scanner be read by any consumer without a tool-specific parser.

## The quadratic problem it removes <!-- kb:card:7c8513 -->
What problem does a shared interchange format like SARIF remove?
?
Without it, every consumer (dashboard, triage queue, PR annotator, policy gate) needs a parser per tool; SARIF collapses that to one parser per consumer and one emitter per tool.

## Rule catalog location <!-- kb:card:d8bd5d -->
Where does a SARIF document's rule catalog live, and what does each rule carry?
?
At tool.driver.rules — each rule has an id, short/full descriptions, a default severity level, and a properties bag (conventionally a numeric security-severity score).

## Result structure <!-- kb:card:bf869d -->
How does a SARIF result tie back to its rule and pinpoint its location?
?
Each result carries a ruleId referencing the rule catalog, a level, a message, and locations giving an artifact URI plus a region (start line and column).

## Why rules and results are separate <!-- kb:card:a0e7bb -->
Why does SARIF separate the rule catalog from the findings list?
?
So remediation guidance and severity travel with the report itself, rather than living only in the tool's own documentation.

## Platform integration <!-- kb:card:38910a -->
What practical consequence does SARIF have for getting a scanner's alerts onto GitHub pull requests?
?
Emitting SARIF is the integration path — GitHub Code Scanning has consumed SARIF uploads since 2019, so any scanner can surface alerts on PRs by producing it.
