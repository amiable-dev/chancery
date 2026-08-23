---
title: "OSV Advisory Database"
date: 2026-06-07
domain: security
maturity: established
source_type: practitioner
topics: [supply-chain]
tags: [concept, security, vulnerability-management, supply-chain, open-source, standards, domain/security, maturity/established, source-type/practitioner, topic/supply-chain]
status: draft
sources:
  - url: https://osv.dev/
    hash: sha256:88345e8ab9676ce99f28d06275bb243f8dbd4d3e75602c62b285cbbd972efec7
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/ossf/osv-schema
    hash: sha256:a1515b556218642d913d084a9c8771f13745e294ac492072a03a7002ae40de4c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://openssf.org/blog/2023/05/02/getting-to-know-the-open-source-vulnerability-osv-format/
    hash: sha256:f71b7112ea2e582f3cb4aebf8ff5623286ed0676ec74d8ef57b96723beea81bc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cybersecuritynews.com/owasp-cve-lite-cli-tool/
    hash: sha256:ebc798162d63dc7ecb6ce1aeb130ff1f34f4a6660a5dbd6ee34ef0476a0548a9
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# OSV Advisory Database

## Definition
The Open Source Vulnerabilities (OSV) database is a distributed, community-maintained vulnerability advisory system backed by Google and the OpenSSF. It provides a machine-readable JSON schema (`OSV schema`) that maps vulnerability identifiers precisely to open-source package versions and commit hashes, aggregating advisories from dozens of upstream databases (GitHub Advisory Database, NVD, PyPI, npm, RubyGems, crates.io, etc.) into a single queryable feed.

## Explanation
Before OSV, vulnerability data was siloed. NVD had CPE strings that didn't align cleanly with package manager versions. GitHub Advisories were GitHub-specific. Each ecosystem had its own format. The result: tooling had to parse 10+ different schemas and guess at version matching.

OSV solves this by providing:
- **A canonical schema** (`ossf/osv-schema`) with a JSON format covering `id`, `aliases`, `affected[].package`, `affected[].ranges`, `affected[].versions`, `severity`, and `references`
- **Version range semantics** expressed directly in ecosystem terms (npm semver, Python PEP 440, Go module versions, git SHAs)
- **Aggregation**: the `osv.dev` API and bulk data downloads (`gs://osv-vulnerabilities` GCS bucket) consolidate advisories from the ecosystem-specific databases
- **Bidirectional aliasing**: an OSV entry lists all its aliases (GHSA-xxx, CVE-xxxx, RUSTSEC-xxxx), so tools can map between them

**The bulk download pattern:**
Tools like OWASP CVE Lite CLI use `cve-lite advisories sync` to download the full advisory corpus locally (~217K records in under 9 seconds). This enables offline/air-gapped scanning and makes repeated queries fast (SQLite lookup vs HTTP round-trip per package).

**Schema key fields:**
```json
{
  "id": "GHSA-xxxx-xxxx-xxxx",
  "aliases": ["CVE-2024-xxxxx"],
  "affected": [{
    "package": { "ecosystem": "npm", "name": "express" },
    "ranges": [{ "type": "SEMVER", "events": [{"introduced": "0"}, {"fixed": "4.20.0"}] }],
    "versions": ["4.18.0", "4.19.2"]
  }],
  "severity": [{ "type": "CVSS_V3", "score": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H" }]
}
```

**Coverage as of 2026:** ~217K+ advisories covering npm, PyPI, Go, Rust, Maven, NuGet, Hex, pub (Dart), and more.

## Key Properties
- Open: schema is a CNCF/OpenSSF standard; data is freely queryable via API or bulk download
- Ecosystem-native version matching: no CPE string guessing — versions expressed in the package manager's native semver/versioning semantics
- Aggregative: pulls from GitHub GHSA, NVD, RubyGems, PyPI, crates.io, Go, OSS-Fuzz, and community databases
- Aliased: maps OSV IDs ↔ CVE IDs ↔ GHSA IDs bidirectionally
- Offline-friendly: full corpus available as GCS bucket for air-gapped use

## Relationships
- Powers [[supply-chain-endpoint-gap]] tooling: OSV is the data layer that dependency scanners query to assess exposure
- Related to [[read-only-security-scanning]]: tools using OSV can do passive lockfile comparison without invoking package managers
- Complements [[cyclonedx-sbom]]: CycloneDX VEX documents reference OSV IDs to communicate which advisories are exploitable vs mitigated
- Related to [[direct-vs-transitive-vulnerability]]: OSV's version-range data enables precise determination of whether a lockfile's specific version is affected

## Applications
- **Dependency scanning:** Given a lockfile, resolve all installed versions, query OSV for matches — no code execution required
- **Offline/air-gapped CI:** Sync OSV bulk data to on-prem storage; scanners query the local copy
- **SBOM enrichment:** Attach OSV/CVE IDs to a CycloneDX or SPDX SBOM to produce a Vulnerability Disclosure Report
- **Diff-based alerting:** Subscribe to the OSV advisory feed; when a new advisory drops for a package you use, trigger re-scan
- **Custom advisory databases:** The OSV schema is open — internal/private CVEs can be expressed in the same format for unified tooling

## Study
- Flashcards: [[flashcards/osv-advisory-database|Practice this concept]]

## Sources
- [osv.dev](https://osv.dev/) — primary API and web interface for the OSV advisory database
- [ossf/osv-schema (GitHub)](https://github.com/ossf/osv-schema) — canonical schema specification
- [OpenSSF OSV format explainer](https://openssf.org/blog/2023/05/02/getting-to-know-the-open-source-vulnerability-osv-format/) — rationale and design
- [OWASP CVE Lite CLI](https://cybersecuritynews.com/owasp-cve-lite-cli-tool/) — example consumer of OSV bulk data

## See Also
- [[supply-chain-endpoint-gap]]
- [[read-only-security-scanning]]
- [[cyclonedx-sbom]]
- [[direct-vs-transitive-vulnerability]]
- [[reachability-aware-vulnerability-scanning]]
