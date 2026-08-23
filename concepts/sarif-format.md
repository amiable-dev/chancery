---
title: "SARIF (Static Analysis Results Interchange Format)"
aliases: ["SARIF (Static Analysis Results Interchange Format)"]
date: 2026-06-07
domain: standards
maturity: established
source_type: vendor-doc
topics: [static-analysis, protocols]
tags: [concept, security, static-analysis, tooling, standards, ci-cd, interoperability, domain/standards, maturity/established, source-type/vendor-doc, topic/static-analysis, topic/protocols]
status: draft
sources:
  - url: https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning
    hash: sha256:f9ad7634c90684ae35f31eb6179f816a1b5ec26b5df6d0b5df30f3c3ffcf6149
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html
    hash: sha256:518a9c7ebe692d6e0a9c962798af0b62b90615380c966de369521ebedda741a0
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://dev.to/shivasurya/unlocking-the-power-of-sarif-the-backbone-of-modern-static-analysis-9lc
    hash: sha256:b6d1f3a65cf2193b48f8e02153e830d4d68a04c1896c66372967d85df1afdb1d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cybersecuritynews.com/owasp-cve-lite-cli-tool/
    hash: sha256:ebc798162d63dc7ecb6ce1aeb130ff1f34f4a6660a5dbd6ee34ef0476a0548a9
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# SARIF (Static Analysis Results Interchange Format)

## Definition
SARIF (Static Analysis Results Interchange Format) is an OASIS standard JSON schema (version 2.1.0) for expressing the output of static analysis tools in a vendor-neutral, machine-readable format. It allows findings from any static analysis tool — linters, security scanners, vulnerability detectors — to be consumed by any SARIF-aware platform (GitHub Code Scanning, Azure DevOps, VS Code, SonarQube) without custom integration work.

## Explanation
Before SARIF, every static analysis tool had its own output format. Integrating a new scanner into GitHub required a custom parser. Integrating it into VS Code required another. Each IDE or CI platform that wanted to show findings had to write adapters for every tool it wanted to support.

SARIF's core insight: standardise the *result* structure, not the analysis. Any tool that can write SARIF can plug into any platform that reads it.

**SARIF document structure:**
```json
{
  "version": "2.1.0",
  "runs": [{
    "tool": {
      "driver": {
        "name": "cve-lite-cli",
        "version": "1.0.0",
        "rules": [{ "id": "GHSA-xxxx", "shortDescription": {...}, "helpUri": "..." }]
      }
    },
    "results": [{
      "ruleId": "GHSA-xxxx-xxxx",
      "level": "error",
      "message": { "text": "jsonwebtoken@0.1.0 contains a critical CVE. Fix: npm update express-jwt" },
      "locations": [{
        "physicalLocation": {
          "artifactLocation": { "uri": "package-lock.json" },
          "region": { "startLine": 42 }
        }
      }]
    }]
  }]
}
```

**Key SARIF concepts:**
- `run`: a single invocation of a tool (one run = one scan)
- `rule`: a named finding type (maps to CVE/advisory ID in security tools)
- `result`: a specific instance of a rule being triggered (one vulnerability finding)
- `level`: `error` (critical/high), `warning` (medium), `note` (low/info)
- `location`: where in the codebase the finding was made (file + line)
- `fingerprint`: a stable hash for a result, so deduplication works across runs (same finding doesn't re-alert)

**GitHub Code Scanning integration:**
GitHub's Code Scanning feature ingests SARIF files uploaded via the `upload-sarif` action or GitHub API. Once uploaded, findings appear as annotations on PRs (inline code comments), as security alerts in the Security tab, and can gate PR merges if configured. Any tool that outputs SARIF becomes a first-class participant in GitHub's security workflow:

```yaml
- name: Run CVE Lite CLI
  run: cve-lite . --sarif > results.sarif
- name: Upload to GitHub Code Scanning
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif
```

**Why SARIF matters for AI-assisted workflows:**
LLMs consuming SARIF have structured, rich finding data: rule descriptions, severity, precise location, help URLs, and remediation guidance — all in a standard format. A code review agent that can parse SARIF can synthesise findings from multiple tools (vulnerability scanner, linter, type checker) into a unified triage plan.

## Key Properties
- OASIS standard (not proprietary): widely implemented across GitHub, Azure DevOps, VS Code, SonarQube
- Tool-agnostic: any static analysis tool can emit SARIF; any SARIF consumer can display results
- Version stable: SARIF 2.1.0 is the current standard as of 2026; backward-compatible increments expected
- Rich result model: includes rule metadata, help URIs, fingerprints, severity, location, and fix suggestions
- Fingerprinting: stable result identity across scans enables deduplication and tracking of open/closed findings

## Relationships
- Enables [[agent-powered-sast]] results to flow into CI/CD platforms: SARIF is the handoff format between AI scanners and human-visible tooling
- Complements [[agentic-pipeline-verification]]: pipeline verification agents can consume SARIF as structured input for synthesis
- Related to [[osv-advisory-database]]: OSV advisory IDs become SARIF `ruleId` values; the advisory detail becomes the `rule.shortDescription` / `helpUri`
- Related to [[cyclonedx-sbom]]: both are supply-chain artifact standards; SARIF captures findings, CycloneDX captures inventory

## Applications
- **Multi-tool CI aggregation:** Run 3 different security scanners (Trivy, cve-lite, semgrep), emit SARIF from each, upload all three to GitHub Code Scanning — one unified alert view
- **PR-blocking rules:** Configure GitHub to block PRs that introduce new SARIF `error`-level findings from a trusted scanner
- **AI synthesis:** Give a review agent multiple SARIF files; ask it to synthesise a prioritised fix plan
- **Finding tracking:** SARIF fingerprints enable tracking a finding across multiple PRs — "this vulnerability was introduced in PR #123, first seen in scan run X"
- **IDE integration:** VS Code SARIF Viewer extension renders SARIF results inline in the editor — developers see findings without leaving their IDE

## Study
- Flashcards: [[flashcards/sarif-format|Practice this concept]]

## Sources
- [GitHub SARIF support docs](https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning) — GitHub-specific SARIF requirements and integration guide
- [OASIS SARIF 2.1.0 specification](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html) — canonical standard
- [DEV.to: Unlocking the Power of SARIF](https://dev.to/shivasurya/unlocking-the-power-of-sarif-the-backbone-of-modern-static-analysis-9lc) — accessible overview of SARIF architecture and use cases
- [OWASP CVE Lite CLI](https://cybersecuritynews.com/owasp-cve-lite-cli-tool/) — `--sarif` flag: dependency scanner → SARIF output → GitHub Code Scanning

## See Also
- [[agent-powered-sast]]
- [[agentic-pipeline-verification]]
- [[osv-advisory-database]]
- [[cyclonedx-sbom]]
- [[ast-based-code-analysis]]
