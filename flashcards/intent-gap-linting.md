---
tags: [flashcards, intent-gap-linting, static-analysis, code-quality]
sr-due: 2026-05-13
sr-interval: 1
sr-ease: 250
---

# Intent-Gap Linting — Flashcards

#flashcards/static-analysis

## Definition <!-- kb:card:5bbf1d -->
What is intent-gap linting?
?
A static analysis discipline that targets the gap between *syntactically valid code* and *code that fulfils its stated intent*. It scans for signals that a developer (or AI) lacked confidence in their implementation: placeholder comments, deferral language, hedging phrases, structural stubs, and mock data in production paths.

## The Four Layers <!-- kb:card:001b4c -->
What layer of the quality stack does intent-gap linting occupy?
?
Layer 4, between style linting and tests:
1. Compiler / type checker — syntactic validity
2. Style linter (ESLint, Clippy) — conventions
3. **Intent-gap linter** — semantic completeness / confidence signals
4. Test suite — runtime correctness

## MECE Contract <!-- kb:card:98b24f -->
What is the MECE contract between intent-gap linters and standard linters?
?
Mutually Exclusive, Collectively Exhaustive: if ESLint or Clippy catches something, the intent-gap linter won't flag it. The tools are designed to be additive — no duplicated noise. Each layer has a distinct job.

## Hybrid Parsing <!-- kb:card:1dab5f -->
Why does antislop use both AST and regex parsing?
?
**AST mode** (tree-sitter) catches *structural* slop — empty function bodies near placeholder comments — with high precision because the parser understands code structure. **Regex mode** is ~10x faster and catches *comment/text-level* slop equally well, since most slop lives in comments and string literals. Combining both gives full coverage with a fast default path.

## Profiles <!-- kb:card:040bab -->
What are the three antislop profiles and when do you use each?
?
- **Core** — stubs + placeholders only, zero false positives → CI hard blocker
- **Standard** — adds deferrals, hedging, mock data → daily development use
- **Strict** — maximum coverage → audits, security reviews, pre-release gates

## Application <!-- kb:card:924b4c -->
When should you add intent-gap linting to a repo?
?
Any repo that receives AI-generated code. Add the Core profile as a hard PR blocker — it's low-friction because zero false positives. Run Strict profile before releases or security reviews. Use sloppy score trending over time to measure AI assistance quality.

## Relationship to SAST <!-- kb:card:dc8690 -->
How does intent-gap linting differ from Agent-Powered SAST?
?
SAST catches *security vulnerabilities* (data flows, injection points, auth gaps). Intent-gap linting catches *incompleteness* (stubs, deferrals, hedging). Both are additive to standard linting but at completely different layers and targeting different failure modes.
