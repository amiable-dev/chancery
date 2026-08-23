---
title: "CycloneDX SBOM"
date: 2026-06-07
domain: standards
maturity: established
source_type: vendor-doc
topics: [supply-chain, provenance]
tags: [concept, security, supply-chain, sbom, standards, compliance, vulnerability-management, domain/standards, maturity/established, source-type/vendor-doc, topic/supply-chain, topic/provenance]
status: draft
sources:
  - url: https://cyclonedx.org/
    hash: sha256:aaf47d9c2afd605c6853663728f07ded0a18951e06ae98495fbbe0504f5c1f93
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cyclonedx.org/specification/overview/
    hash: sha256:d20b6e29f73a8885ae9cdc4e55f168a33d68b48f2e9b8055edf5d1b7a6173447
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cybersecuritynews.com/owasp-cve-lite-cli-tool/
    hash: sha256:ebc798162d63dc7ecb6ce1aeb130ff1f34f4a6660a5dbd6ee34ef0476a0548a9
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.dependencytrack.org/datasources/osv/
    hash: sha256:1a04f7c73040c3eac9e1e717b05e216f5364f904bffea7f7a39394afb801aa12
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# CycloneDX SBOM

## Definition
CycloneDX is an OWASP-maintained, open standard for Software Bill of Materials (SBOM) and related supply chain documents. An SBOM is a formal inventory of all components — libraries, frameworks, operating system packages — that make up a software artifact. CycloneDX extends beyond pure SBOM to cover SaaS BOM, Hardware BOM, AI/ML BOM, Vulnerability Disclosure Reports (VDR), and Vulnerability Exploitability eXchange (VEX) documents, making it a full-stack supply chain transparency standard.

## Explanation
An SBOM answers: "What exactly is in this software?" It's the software equivalent of a food nutrition label. CycloneDX provides the schema (JSON or XML) for expressing that inventory in a machine-readable, interchange-friendly format.

**Core SBOM use cases:**
- **Compliance:** Increasingly mandated by regulation (US Executive Order 14028, EU CRA, NIST SSDF). A vendor may need to provide an SBOM with every software delivery
- **Incident response:** When a new CVE drops (e.g. Log4Shell), security teams with SBOMs can instantly query "do any of our products include log4j?" rather than grepping repos manually
- **License management:** SBOMs capture component licenses; legal/compliance teams audit for GPL contamination without reading every lockfile
- **Supply chain risk:** SBOMs enable continuous monitoring — as new advisories drop, scan the SBOM inventory automatically

**CycloneDX 1.4 structure (as supported by CVE Lite CLI `--cdx`):**
```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "version": 1,
  "serialNumber": "urn:uuid:...",
  "metadata": {
    "timestamp": "2026-06-07T01:00:00Z",
    "tools": [{ "vendor": "OWASP", "name": "cve-lite-cli", "version": "1.0.0" }],
    "component": { "type": "application", "name": "my-app", "version": "1.2.3" }
  },
  "components": [{
    "type": "library",
    "name": "express",
    "version": "4.18.2",
    "purl": "pkg:npm/express@4.18.2",
    "licenses": [{ "license": { "id": "MIT" } }],
    "externalReferences": [{ "type": "website", "url": "https://expressjs.com" }]
  }],
  "vulnerabilities": [{
    "id": "GHSA-xxxx-xxxx",
    "ratings": [{ "severity": "critical", "score": 9.8, "method": "CVSSv3" }],
    "affects": [{ "ref": "pkg:npm/express@4.18.2" }]
  }]
}
```

**Key CycloneDX concept: purl (Package URL)**
Each component is identified by a `purl` — a standardised URI scheme (`pkg:npm/lodash@4.17.21`) that uniquely identifies a package across ecosystems. This enables cross-tool comparison: if two different SBOMs both reference `pkg:npm/lodash@4.17.21`, they're unambiguously referring to the same artifact.

**VEX (Vulnerability Exploitability eXchange):**
CycloneDX 1.4+ includes VEX support. Where an SBOM says "we include component X," a VEX document says "CVE-Y in component X is NOT exploitable in our context because [reason]." This allows a vendor to proactively communicate risk status rather than leaving downstream consumers to guess. CycloneDX VEX is one of three competing VEX formats (along with CSAF and OpenVEX).

**CycloneDX vs SPDX:**
The other major SBOM standard is SPDX (Linux Foundation). CycloneDX is more security-focused (VEX, VDR, pedigree, provenance); SPDX is more license-compliance-focused. Both are accepted by most regulatory frameworks. Most organisations pick one; both are increasingly required.

## Key Properties
- OWASP-maintained: vendor-neutral, open governance
- Full-stack: SBOM + SaaSBOM + HBOM + AI-BOM + VDR + VEX — not just software inventories
- purl-based component identification: ecosystem-neutral package identity
- Machine-readable: JSON and XML representations; tooling ecosystem is large (Syft, CycloneDX-cli, dependency-track)
- VEX support: communicate exploitability status, not just presence of vulnerable components

## Relationships
- Addresses [[supply-chain-endpoint-gap]]: SBOMs provide the inventory layer needed to rapidly assess exposure during supply chain incidents
- Complements [[osv-advisory-database]]: OSV advisory IDs are referenced in CycloneDX vulnerability records
- Complements [[sarif-format]]: SARIF = finding results; CycloneDX = component inventory. Both are supply chain transparency artifacts, used together for full-picture compliance
- Related to [[agent-attestation-standards]]: SBOMs are a form of supply chain attestation

## Applications
- **Regulatory compliance:** Generate a CycloneDX SBOM at build time; attach to release artifacts for customer/regulator delivery
- **Continuous monitoring:** Feed SBOM into Dependency-Track (OWASP); monitor for new CVEs matching your component inventory in real-time
- **Incident response speed:** When Log4Shell 2.0 drops, query the SBOM database: "which releases include log4j?" — answer in seconds, not days
- **License auditing:** Export all component licenses from the SBOM; flag GPL-licensed components in commercial products
- **AI/ML transparency:** CycloneDX AI-BOM captures model provenance, training data sources, and evaluation metrics alongside traditional software components

## Study
- Flashcards: [[flashcards/cyclonedx-sbom|Practice this concept]]

## Sources
- [cyclonedx.org](https://cyclonedx.org/) — official specification and tooling ecosystem
- [CycloneDX specification overview](https://cyclonedx.org/specification/overview/) — schema and BOM types
- [OWASP CVE Lite CLI](https://cybersecuritynews.com/owasp-cve-lite-cli-tool/) — `--cdx` flag for generating CycloneDX 1.4 SBOMs from dependency scans
- [Dependency-Track](https://docs.dependencytrack.org/datasources/osv/) — OWASP tool that consumes CycloneDX SBOMs and continuously monitors against OSV

## See Also
- [[supply-chain-endpoint-gap]]
- [[osv-advisory-database]]
- [[sarif-format]]
- [[agent-attestation-standards]]
- [[direct-vs-transitive-vulnerability]]
