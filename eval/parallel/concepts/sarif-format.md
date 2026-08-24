---
title: SARIF format
aliases:
  - Static Analysis Results Interchange Format
  - SARIF 2.1.0
date: 2026-08-24
domain: standards
maturity: established
source_type: practitioner
tags: [concept, security, static-analysis, standards, domain/standards, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://dev.to/shivasurya/unlocking-the-power-of-sarif-the-backbone-of-modern-static-analysis-9lc
    hash: sha256:b6d1f3a65cf2193b48f8e02153e830d4d68a04c1896c66372967d85df1afdb1d
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# SARIF format

## Definition

**SARIF**, the Static Analysis Results Interchange Format, is a standardized JSON schema for the output of static analysis tools: one document carries an array of runs, each recording the tool that produced it, the catalog of rules that tool could fire, and the results it found — every result naming the rule it came from, a message, and the source locations it applies to — so that findings from any scanner can be read by any consumer without a parser written for that scanner.

## Explanation

The problem it removes is quadratic. Every analyzer that invents its own report format obliges every consumer — a dashboard, a triage queue, a pull-request annotator, a policy gate — to write and maintain a parser per tool, so adding either side of the pipeline costs work on the other. A single schema collapses that to one parser per consumer and one emitter per tool. The anatomy is small enough to implement directly: a document declares its schema and version (2.1.0 is the current OASIS standard); each entry in runs carries a tool object whose driver names the engine, its version, and a rules array where each rule holds an identifier, short and full descriptions, a default severity level, and a properties bag conventionally used for a numeric security-severity score; each entry in results carries the ruleId that ties it back to that catalog, a level, a message, and locations giving an artifact URI plus a region with start line and column. Separating the rule catalog from the findings is what makes remediation guidance and severity travel with the report rather than living in the tool's documentation, and pinning locations to file and region is what lets a consumer render a finding inline in a diff. The practical consequence is that emitting SARIF is the price of admission to platform ingestion — GitHub Code Scanning has consumed it since 2019, and uploading a SARIF file is how an arbitrary scanner surfaces alerts on pull requests. The source is a developer-blog explainer written around a specific open-source SAST product, and the product material is chaff, but the schema anatomy it lays out is checkable against the OASIS specification.

## Key Properties

- JSON schema standardized at OASIS; version 2.1.0 is the one tools emit in practice
- Top-level runs array, one entry per tool execution, each with its own tool and results
- Rule catalog lives at tool.driver.rules and carries id, descriptions, default severity and a properties bag
- Each result references its rule by ruleId and pins locations to an artifact URI plus a line and column region
- Consumed directly by GitHub Code Scanning, which is why SARIF output is the integration path for arbitrary scanners

## Relationships

- [[osv-format]] — covers the other half of the finding lifecycle — OSV standardizes what is publicly known to be vulnerable in a dependency, while SARIF standardizes what a tool observed in your own source
- [[cyclonedx-object-model]] — applies the same interchange-format strategy to a different artifact — CycloneDX standardizes the statement of what a system is made of, SARIF the statement of what an analyzer found in it
- [[cross-run-result-identity]] — SARIF is the standardized output format whose result objects are where the fingerprint, equivalence-class and baseline-state fields cross-run result identity requires actually get carried between tool runs.

## Applications

Making an in-house or open-source scanner consumable by code-scanning platforms by emitting SARIF instead of a bespoke report; aggregating findings from several analyzers into one triage view with a single parser; gating pull requests on severity read from the rule catalog rather than from tool-specific exit codes.

## Sources

- https://dev.to/shivasurya/unlocking-the-power-of-sarif-the-backbone-of-modern-static-analysis-9lc

## See Also

- [[osv-format]]
- [[cyclonedx-object-model]]
