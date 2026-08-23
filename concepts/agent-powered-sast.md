---
title: "Agent-Powered SAST"
date: 2026-05-10
domain: security
maturity: emerging
source_type: practitioner
topics: [static-analysis, agentic-coding, devops]
tags: [concept, security, ai-agents, static-analysis, sast, vulnerability-scanning, devops, domain/security, maturity/emerging, source-type/practitioner, topic/static-analysis, topic/agentic-coding, topic/devops]
status: draft
sources:
  - url: https://vercel.com/blog/introducing-deepsec-find-and-fix-vulnerabilities-in-your-code-base
    hash: sha256:c399354b792311861802cc040665b089cec906337d86e15faccc460eeb453a35
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/vercel-labs/deepsec/
    hash: sha256:13c7e4e41d95145ee3fb285e04f06a795a7ad5b24d326fa6a78568e2a1c48732
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent-Powered SAST

## Definition
Agent-Powered Static Application Security Testing (SAST) is a security analysis methodology where coding agents — rather than deterministic rule engines — investigate a codebase for vulnerabilities. A lightweight static pass (typically regex) identifies candidate files, and then AI agents perform the deep investigation: tracing data flows, checking for mitigations, and producing severity-rated findings.

## Explanation
Traditional SAST tools operate on fixed rule sets: they match patterns (regex, AST signatures, taint-flow rules) and flag anything that matches. This is fast but produces high false-positive rates and misses context-dependent vulnerabilities (e.g., a SQL string that looks dangerous but is safely parameterised elsewhere).

Agent-powered SAST inverts the depth/breadth trade-off: a cheap static pass quickly narrows the candidate surface, then agents apply genuine reasoning to each candidate — reading multiple files, tracing function calls across modules, and assessing whether mitigations actually hold. The result is fewer, higher-confidence findings that a human or downstream agent can act on directly.

Vercel's `deepsec` exemplifies this pattern:
- **Scan phase:** Fast regex over all files to find security-sensitive patterns (auth checks, DB queries, file ops, deserialisation).
- **Investigate phase:** A coding agent (Opus 4.7 / GPT-5.5) reads each candidate in context, traces data flows, checks for mitigations, and rates severity.
- **Revalidate phase:** A second independent agent reviews findings to remove false positives — see [[multi-agent-revalidation]].
- **Enrich phase:** Git metadata (blame, authors) links each finding to the responsible contributor.
- **Export phase:** Findings formatted as actionable tickets for humans or downstream agents.

False positive rate in practice: ~10–20%, significantly lower than pure static tools which routinely exceed 50%.

## Key Properties
- **Hybrid static-agent pipeline:** Static phase for breadth, agent phase for depth and reasoning
- **Context-aware:** Agents read multiple files and trace across function boundaries — something rule-engines can't do
- **Extensible via plugins:** Custom regex matchers tuned to project-specific auth patterns, data layers, or conventions
- **Model-agnostic:** Works with standard frontier models (Opus 4.7, GPT-5.5); cyber-tuned models are optional
- **Infrastructure-local:** Source code never needs to leave your infrastructure — only inference calls go out
- **Parallelisable:** Candidates can fan out to parallel sandboxes for large monorepos (e.g., 1,000+ concurrent Vercel Sandboxes)

## Relationships
- Builds on [[agentic-pipeline-verification]]: the multi-stage pipeline pattern applies to security scanning specifically
- Pairs with [[multi-agent-revalidation]]: the revalidate step is the false-positive-reduction complement to agent investigation
- Contrasts with [[ai-assisted-penetration-testing]]: pen testing is offensive/adversarial; agent-powered SAST is defensive and operates on your own codebase
- Related to [[ast-based-code-analysis]]: traditional SAST uses AST; agent-powered SAST uses agent reasoning instead of (or on top of) AST matching
- Related to [[blast-radius-dependency-tracing]]: both analyse cross-file code flows, but from different angles (security vs. impact)
- Enabled by [[agent-harness]]: the harness provides the execution environment, parallelism, and tool access for agents

## Applications
- **Security audits of large monorepos:** Fan out to hundreds of parallel sandboxes for fast turnaround on millions of lines
- **Continuous integration gates:** Run on PRs to catch regressions in security-sensitive paths
- **Custom auth/data-layer scanning:** Write plugin matchers for your specific auth model after an initial scan surfaces patterns
- **Ownership attribution:** Use enrichment phase to route findings directly to the responsible team or contributor
- **Bootstrapping security posture:** Run once on a legacy codebase with no prior security investment to surface the highest-severity issues first

## Study
- Flashcards: [[flashcards/agent-powered-sast|Practice this concept]]

## Sources
- [Introducing deepsec: The security harness for finding vulnerabilities in your codebase](https://vercel.com/blog/introducing-deepsec-find-and-fix-vulnerabilities-in-your-code-base) — Primary source; Vercel's open-source implementation and architecture rationale
- [deepsec GitHub](https://github.com/vercel-labs/deepsec/) — Open-source implementation

## See Also
- [[multi-agent-revalidation]]
- [[refusal-classifier]]
- [[agentic-pipeline-verification]]
- [[ai-assisted-penetration-testing]]
- [[agent-harness]]
- [[reachability-aware-vulnerability-scanning]]: shallow complement to agent-powered SAST — import-level reachability filtering reduces the surface before agents do deep analysis
- [[sarif-format]]: SARIF is the standard output format for surfacing agent-powered SAST findings in GitHub Code Scanning and other CI platforms
