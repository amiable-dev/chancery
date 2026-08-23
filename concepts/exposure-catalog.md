---
title: "Exposure Catalog"
date: 2026-05-25
domain: security
maturity: emerging
source_type: practitioner
topics: [supply-chain]
tags: [concept, security, supply-chain, vulnerability-management, threat-intelligence, domain/security, maturity/emerging, source-type/practitioner, topic/supply-chain]
status: draft
sources:
  - url: https://github.com/perplexityai/bumblebee
    hash: sha256:ee78cdb69f095f1cc2a9c5c8d545052a89b75121ea1d2d113afdd09e4c56d19d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.marktechpost.com/2026/05/23/perplexity-open-sources-bumblebee-a-read-only-supply-chain-scanner-for-developer-endpoints/
    hash: sha256:15fe0fcf0d429c982865c7713bf80c85898b8e512175f26db9a06198c289c22a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Exposure Catalog

## Definition
An Exposure Catalog is an operator-supplied, structured data file that specifies known-compromised packages, extensions, or configurations — identified by ecosystem, package name, and affected version ranges — used to match against an inventory of installed artefacts to produce actionable findings. It is distinct from a CVE database or SBOM: it targets *actively exploited supply-chain compromises* rather than generic vulnerability advisories.

## Explanation
A CVE database (NVD, OSV, Snyk) is broad and general: it covers vulnerabilities in packages and assigns severity scores. An exposure catalog is narrower and more operational: it encodes what a security team needs to answer *right now* given a specific incident or threat signal.

**Anatomy of an exposure catalog entry:**

```json
{
  "id": "bumblebee-2026-0041",
  "severity": "critical",
  "description": "Malicious postinstall in react-scripts 5.0.2 (Mini Shai-Hulud campaign)",
  "ecosystem": "npm",
  "package": "react-scripts",
  "affected_versions": ["5.0.2"],
  "source": "https://socket.dev/advisory/...",
  "created_at": "2026-05-22T14:00:00Z"
}
```

When Bumblebee scans a machine and finds `react-scripts@5.0.2` in a `package-lock.json`, it emits a **finding record** citing this catalog entry — including the catalog ID, severity, and the source file that contained the match.

**How Perplexity uses exposure catalogs operationally:**

1. A threat signal arrives (public disclosure, third-party intel feed)
2. Perplexity Computer drafts a catalog update PR: translates the advisory into the structured entry format
3. A human engineer reviews and merges the PR
4. The updated catalog is distributed to fleet tooling; Bumblebee scans run against it
5. Findings are sent to the security team

This [[human-in-the-loop-pattern|human-in-the-loop]] review step is intentional: automated catalog generation would reduce latency but increase false positive risk. The PR review gates quality.

**Catalog scope vs. CVE databases:**

| Property | CVE/NVD | OSV | Exposure Catalog |
|---|---|---|---|
| Coverage | Broad (any vuln) | Open-source vulns | Curated, operator-specific |
| Latency | Days–weeks | Hours–days | Minutes (if CI is fast) |
| Signal type | All severity levels | All severity levels | Active supply-chain campaigns only |
| False positive risk | High (many irrelevant) | Medium | Low (operator-curated) |
| Match specificity | Version ranges + CWEs | Version ranges | Exact versions or ranges |
| Trigger for update | NVD publication | OSV feed | Threat signal (incident, intel) |

**The threat_intel/ directory (Bumblebee):**

Bumblebee ships with a `threat_intel/` directory containing community-maintained exposure catalogs derived from public supply-chain campaign reporting — including the Mini Shai-Hulud campaign series that hit npm, PyPI, RubyGems, Go modules, and Composer across TanStack, SAP, and Zapier. This provides a starting point without requiring operators to build catalogs from scratch.

**Confidence in findings:**

A finding's reliability depends on the intersection of the inventory record's confidence (high/medium/low, based on metadata quality) and the catalog entry's specificity (exact version vs. version range). Bumblebee exposes both in each finding record, enabling responders to prioritise high-confidence exact matches for immediate action while investigating medium/low-confidence matches separately.

## Key Properties
- **Operator-controlled** — each organisation curates its own catalog, enabling tuning for their risk profile and development ecosystem
- **Lightweight format** — simple JSON; no database, no API server required; can be versioned in git alongside the scanner
- **Campaign-oriented** — designed to capture active supply-chain campaigns, not all vulnerabilities
- **Traceable findings** — every finding includes which catalog entry triggered it, enabling immediate pivoting to the source advisory
- **Composable** — multiple catalogs can be combined; community catalogs (like Bumblebee's `threat_intel/`) can supplement operator catalogs

## Relationships
- Consumed by [[developer-endpoint-inventory]] tools to produce actionable findings from raw inventory records
- Complements CVE databases (NVD, OSV) but is narrower in scope and faster to update
- Related to [[mitre-attack-framework]]: ATT&CK provides the tactic/technique taxonomy for how supply chain attacks operate; exposure catalogs encode the specific artefacts of individual campaigns
- Related to [[blast-radius-dependency-tracing]]: blast radius tracing tells you what code is affected; exposure catalogs tell you which installed packages are the source of compromise
- Related to threat intelligence feeds (commercial and community): exposure catalogs are a structured, queryable distillation of that intelligence

## Applications
- **Post-advisory triage:** When a supply chain advisory drops, add an entry to your catalog and run a fleet scan within minutes. Know exactly which machines need remediation before the end of the day.
- **Continuous fleet monitoring:** Keep a catalog of all packages involved in historical campaigns; run daily baseline scans and alert on any new installations matching catalog entries.
- **Merging community intelligence:** Pull Bumblebee's `threat_intel/` catalogs as a dependency, overlay your org's internal catalog, scan against the combined set.
- **AI-assisted catalog authoring:** Use an LLM (or Perplexity Computer, as in Perplexity's internal workflow) to draft catalog entries from advisory text, then have a human review before merging — reducing manual effort while preserving quality control.
- **Cross-team communication:** Because catalog entries are structured and versioned in git, security teams can communicate exposure status to engineering teams with precise, reproducible references.

## Study
- Flashcards: [[flashcards/exposure-catalog|Practice this concept]]

## Sources
- [perplexityai/bumblebee (github.com)](https://github.com/perplexityai/bumblebee) — catalog format specification and `threat_intel/` community catalogs
- [Perplexity Open-Sources Bumblebee (marktechpost.com)](https://www.marktechpost.com/2026/05/23/perplexity-open-sources-bumblebee-a-read-only-supply-chain-scanner-for-developer-endpoints/) — Perplexity's internal catalog workflow with AI-assisted PR authoring

## See Also
- [[developer-endpoint-inventory]]
- [[supply-chain-endpoint-gap]]
- [[read-only-security-scanning]]
- [[blast-radius-dependency-tracing]]
- [[mitre-attack-framework]]
