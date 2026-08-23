---
tags: [flashcards, security, static-analysis, standards, ci-cd]
sr-due: 2026-06-07
sr-interval: 1
sr-ease: 250
---

# SARIF Format — Flashcards

#flashcards/security

## Definition <!-- kb:card:37b448 -->
What is SARIF, and what problem does it solve?
?
SARIF (Static Analysis Results Interchange Format) is an OASIS standard JSON schema (version 2.1.0) for expressing static analysis tool outputs in a vendor-neutral, machine-readable format. It solves the fragmentation problem where every scanner had its own output format, requiring custom parsers for every CI/IDE integration. Any SARIF-emitting tool now works with any SARIF-consuming platform (GitHub Code Scanning, VS Code, Azure DevOps, SonarQube).

## Structure <!-- kb:card:1b31f4 -->
What are the four key SARIF structural elements and what does each represent?
?
- `run`: a single invocation of the analysis tool (one scan = one run)
- `rule`: a named finding type (maps to a CVE ID or advisory in security tools)
- `result`: a specific instance of a rule triggering (one vulnerability finding)
- `location`: where in the codebase the finding was found (file + line number)

## Application <!-- kb:card:8c8910 -->
How do you integrate a SARIF-producing security scanner into GitHub Code Scanning?
?
```yaml
- name: Run scanner
  run: cve-lite . --sarif > results.sarif
- name: Upload to GitHub Code Scanning
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif
```
GitHub then shows findings as inline PR annotations, Security tab alerts, and can block PR merges on new findings.

## Fingerprinting <!-- kb:card:3246ae -->
What is a SARIF fingerprint and why does it matter for deduplication?
?
A fingerprint is a stable hash uniquely identifying a specific finding — computed from the rule, location, and result content. Across repeated scans, the same vulnerability at the same location produces the same fingerprint. This lets CI systems track a finding's lifecycle (introduced in PR #X, still open in PR #Y, fixed in PR #Z) without re-alerting on known issues.

## AI Usage <!-- kb:card:b23b65 -->
How does SARIF benefit AI-assisted security workflows?
?
SARIF gives LLMs structured, rich finding data: rule descriptions, severity levels, precise file/line locations, help URLs, and fix suggestions — all in a standard format. A code review agent consuming SARIF from multiple tools (vulnerability scanner + linter + type checker) can synthesise a unified, prioritised triage plan without needing custom parsers per tool.
