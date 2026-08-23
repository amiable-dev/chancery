---
title: "Intent-Gap Linting"
date: 2026-05-13
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [static-analysis, agentic-coding]
tags: [concept, static-analysis, code-quality, ai-agents, linting, ci-cd, engineering, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/static-analysis, topic/agentic-coding]
status: draft
sources:
  - url: https://docs.rs/antislop/latest/antislop/
    hash: sha256:d6dfe772918ac3671f6a980e58c8ebeceed0cf96bfe1b26c5c4885c8cd18549a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/skew202/antislop
    hash: sha256:14c901821ff723d4dce799f34be7298841c74bd78acfc48fbbbf2cd2b5ef24c0
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Intent-Gap Linting

## Definition
Intent-Gap Linting is a static analysis discipline that targets the gap between *syntactically valid code* and *code that fulfils its stated intent*. Rather than checking style, formatting, or type correctness, intent-gap linters scan for signals that a developer (or AI) was not confident in their implementation: placeholder comments, deferral language, hedging phrases, structural stubs, and mock data left in production paths.

## Explanation
Software quality tooling has historically operated at three layers:
1. **Compiler / type checker** — Is the code syntactically and structurally valid?
2. **Style linter** (ESLint, Clippy, Rubocop) — Does the code conform to team conventions?
3. **Test suite** — Does the code behave correctly at runtime?

Intent-gap linting adds a fourth layer between 2 and 3: **Does the code *communicate completion and confidence*?**

This layer became relevant with the rise of AI-assisted development. LLMs reliably produce [[ai-code-slop]] — a predictable class of incompleteness signals — that slips through layers 1 and 2 undetected.

**How it works (antislop architecture):**

```
Source files
     │
     ├─► Tree-sitter AST parse ──► Structural stub detection
     │                              (empty functions near placeholder comments)
     │
     └─► Regex pattern scan ──────► Comment + string signal detection
                                    (TODO/FIXME, "for now", "should work", ...)
                                          │
                                          ▼
                               Per-file findings + sloppy score (0–100)
                               JSON output for CI integration
```

**Hybrid parsing is the key design choice:** AST mode catches *structural* slop (empty function bodies) with high precision, since the parser understands code structure. Regex-only mode is ~10x faster and catches *comment/text-level* slop equally well — most slop is in comments and string literals, not in structural patterns. Antislop combines both, and regex-only is the default for hot paths.

**Profiles as graduated enforcement:**
- **Core profile** — stubs and placeholders only. Zero false positives. Designed as a CI blocker.
- **Standard profile** — adds deferrals, hedging, and mock data. For daily development use.
- **Strict profile** — maximum coverage. For audits, security reviews, pre-release gates.

**The MECE contract with standard linters:**
Intent-gap linters make an explicit promise: *if ESLint or Clippy catches it, antislop won't flag it*. This is not overlap reduction — it is a design principle. The tool is additive. Teams can add it without fear of duplicating their existing linter noise. In CI, the stack looks like:

```
ESLint → Clippy → tests → antislop (Core)
```

Each layer has a different job. None duplicates another.

**Multi-language support via tree-sitter:**
Antislop supports 18 languages. Languages with full AST support (Python, JS/TS, Go, Rust, Ruby, Java, C/C++, C#, Scala, Haskell, Lua) get structural stub detection. Languages with regex-only support (Kotlin, PHP, Perl, R, Swift) get comment/text detection. The regex path is fast enough that Python AST scan takes 4ms; 50k-line codebases scan in ~400ms.

**Performance:** The underlying scanner is a Rust binary distributed via Homebrew, npm, and Cargo. The npm package installs the Rust binary — there is no Node.js analysis layer; Node is the installer wrapper only.

## Key Properties
- **Layer 4 of the quality stack:** Additive to compiler, linter, and tests — not a replacement
- **MECE with standard linters:** Explicit non-overlap contract; no duplicated noise
- **Hybrid AST + regex:** AST for structural precision, regex for speed and text-level detection
- **Graduated profiles:** Core (CI blocker), Standard (daily), Strict (audit)
- **CI-native:** JSON output mode + GitHub Actions integration built in
- **Extensible:** Per-project `antislop.toml` for custom patterns
- **Language-agnostic:** 18 languages with the same unified slop taxonomy across all

## Relationships
- Detects [[ai-code-slop]]: the slop categories are the taxonomy this discipline was designed around
- Uses [[ast-based-code-analysis]]: tree-sitter AST parsing is the structural detection layer
- Complements [[agent-powered-sast]]: SAST catches security vulnerabilities; intent-gap linting catches incompleteness. Both are additive to standard linting
- Fits into [[agentic-pipeline-verification]]: intent-gap linting is a natural CI gate in agentic development workflows
- Cousin of [[architecture-boundary-enforcement]] and [[dead-code-detection]]: all three are static analysis disciplines that target issues invisible to syntax linters
- Complements [[fallow-codebase-intelligence]]: Fallow targets dead code and structural debt; intent-gap linting targets incomplete and uncertain code

## Applications
- **CI/CD quality gate:** Add antislop Core as a hard PR blocker in any repo receiving AI-generated code
- **Pre-release audit:** Run Strict profile to surface all uncertainty signals before a release
- **Legacy codebase triage:** Identify the highest-slop modules in an existing codebase as a proxy for AI-generated technical debt
- **Agent output validation:** Run intent-gap linting on code produced by coding agents before it enters review, as a fast sanity check
- **Sloppy score trending:** Track per-file scores over time to measure whether AI assistance quality is improving or degrading

## Study
- Flashcards: [[flashcards/intent-gap-linting|Practice this concept]]

## Sources
- [antislop — docs.rs](https://docs.rs/antislop/latest/antislop/) — Rust API, module taxonomy (config, detector, profile, report, walker)
- [antislop — GitHub](https://github.com/skew202/antislop) — Community profiles, TOML configuration reference

## See Also
- [[ai-code-slop]]
- [[ast-based-code-analysis]]
- [[agent-powered-sast]]
- [[agentic-pipeline-verification]]
- [[architecture-boundary-enforcement]]
- [[dead-code-detection]]
- [[fallow-codebase-intelligence]]
