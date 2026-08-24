---
title: OSV format
date: 2026-08-24
domain: security
maturity: established
source_type: practitioner
tags: [concept, security, supply-chain, standards, domain/security, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://openssf.org/blog/2023/05/02/getting-to-know-the-open-source-vulnerability-osv-format/
    hash: sha256:f71b7112ea2e582f3cb4aebf8ff5623286ed0676ec74d8ef57b96723beea81bc
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# OSV format

## Definition

The **Open Source Vulnerability (OSV) format** is a minimal JSON schema for describing vulnerabilities in open source software, created within the OpenSSF Vulnerability Disclosures Working Group, whose defining choice is to identify affected code by git commit hashes or package-manager versions — the identifiers open source consumers actually use — rather than the looser product descriptions of general-purpose standards.

## Explanation

General vulnerability standards were designed for arbitrary software, and applied to the open source world they are clunky and lossy exactly where precision matters: saying which code is affected. OSV grew out of communicating fuzzing findings from OSS-Fuzz, was announced in 2021, and became an OpenSSF project. Because an OSV advisory pins ranges to commits or package versions, both producing and consuming advisories can be automated with little interpretation. Adoption followed the design: GitHub Security Advisories, the Rust, Go and Python ecosystems, Linux distributions, and client tooling such as Renovate, OWASP Dependency-Track and govulncheck, with osv.dev aggregating advisories across sources. GitHub's advisory database accepts community pull-request edits in OSV form — a distributed maintenance model the format's precision makes practical. The affected-version-range schema also directly informed CVE 5.0, which is the strongest sign the design solved a real gap in the incumbent standard.

## Key Properties

- Identifies affected code by git commit hash or package-manager version, not prose product ranges
- Minimal first-class JSON schema, designed for automated production and consumption
- Adopted by 18+ ecosystems and aggregated at osv.dev
- Its version-range schema informed the CVE 5.0 standard

## Relationships

- _No relationships recorded yet._
- [[vulnerability-range-events]] — vulnerability range events is the concrete range-event data model OSV's affected-ranges field actually implements — the introduced, fixed, last-affected and limit timeline is how OSV encodes affected ranges against commits or package versions instead of a prose description.

## Applications

Emitting machine-readable advisories for an open source project; querying osv.dev to match a dependency lockfile against known vulnerabilities; building scanners or update bots on a common advisory interchange.

## Sources

- https://openssf.org/blog/2023/05/02/getting-to-know-the-open-source-vulnerability-osv-format/

## See Also

- _None yet._
