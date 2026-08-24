---
title: Protocol feature lifecycle policy
aliases: ["Protocol feature lifecycle policy"]
date: 2026-08-24
domain: standards
maturity: emerging
source_type: vendor-doc
tags: [concept, standards, governance, protocols, domain/standards, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
    hash: sha256:41ac604fbe79fbb905ca0b2bed18394fccab871c1fd521c363c5cc913881b227
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# Protocol feature lifecycle policy

## Definition

The **MCP feature lifecycle policy** (SEP-2577/2596) gives every protocol feature an Active → Deprecated → Removed lifecycle with at least twelve months between deprecation and earliest removal, removal itself requiring a separate SEP — so implementers can build on a version knowing what they ship keeps working.

## Explanation

The policy is one of three governance mechanisms 2026-07-28 installs so that its own breaking changes stay exceptional: the lifecycle policy bounds removal, the extensions framework lets capabilities stabilise outside core, and Standards-Track SEPs can no longer reach Final until a matching scenario lands in the conformance suite — the same suite the SDK tier system scores official SDKs against, which turns 'the spec says' into 'the suite checks'. The release exercises the policy immediately by deprecating three core features with named replacements: Roots (tool parameters, resource URIs, or configuration), Sampling (direct LLM-provider integration), and Logging (stderr for stdio; OpenTelemetry for structure). All three are annotation-only — methods and capability flags keep working in this release and in every version published within a year. The pattern transfers beyond MCP: pair a dated deprecation window with named replacements and a conformance gate, and a protocol can evolve aggressively at the edges while staying safe to build on at the core.

## Key Properties

- Active → Deprecated → Removed; ≥12 months notice; removal needs its own SEP
- Conformance-suite gate: no Final SEP without a matching test scenario
- SDK tier system scores official SDKs against the same suite
- Worked example: Roots, Sampling, Logging deprecated with named replacements, annotation-only

## Relationships

- [[mcp-extensions-framework]] — complements that framework: extensions govern how capability enters the protocol, this policy governs how it leaves

## Applications

Deciding what MCP features to build against; a template for any protocol or platform that must evolve without breaking implementers.

## Sources

- https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/

## See Also

- [[mcp-extensions-framework]]
