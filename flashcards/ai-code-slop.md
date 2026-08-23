---
tags: [flashcards, ai-code-slop, code-quality, ai-agents]
sr-due: 2026-05-13
sr-interval: 1
sr-ease: 250
---

# AI Code Slop — Flashcards

#flashcards/code-quality

## Definition <!-- kb:card:b2727e -->
What is AI Code Slop?
?
A systematic class of code quality defects that AI coding assistants reliably introduce: lazy placeholders, deferred implementations, hedging language, structural stubs, and dummy data that persists into committed code. Slop is syntactically valid — it compiles and lints clean — but signals incomplete or uncertain intent.

## Five Categories <!-- kb:card:4cb735 -->
What are the five categories of AI code slop?
?
1. **Placeholder** — TODO/FIXME/HACK/XXX comments
2. **Deferral** — "for now", "temporary", "quick implementation"
3. **Hedging** — "hopefully", "should work", "this is a simple"
4. **Stub** — empty/pass-through functions near placeholder comments
5. **Noise** — redundant comments restating what the code obviously does

## Why It's Distinct <!-- kb:card:4c07d6 -->
Why doesn't standard linting (ESLint, Clippy) catch AI code slop?
?
Standard linters check syntactic correctness and style conformance. Slop is *semantically valid* code — the syntax is fine, the types check out. What's missing is the *intent*: the function exists but doesn't do what it claims. Slop lives in the gap between "valid code" and "complete implementation".

## Root Cause <!-- kb:card:584284 -->
Why do quantized or rushed LLMs produce more slop?
?
Quantization compresses model weights, degrading the model's ability to hold complex implementation plans across many tokens. Under this pressure, models stub-and-defer: start a function, lose the thread, then emit a placeholder comment and move on. The model is narrating its own incompleteness.

## CI Application <!-- kb:card:10e103 -->
How should AI code slop detection be used in CI?
?
Add a slop linter at the **Core profile** (stubs + placeholders only, zero false positives) as a hard PR blocker. The Core profile is specifically designed for this use case — high signal, no noise. Strict profile is reserved for audits and pre-release gates.

## Relationship <!-- kb:card:ea1c07 -->
How does AI code slop relate to intent-gap linting?
?
AI code slop is the *problem class*; intent-gap linting is the *discipline* designed to detect it. Intent-gap linters like antislop use hybrid AST + regex analysis to surface the five slop categories that syntax linters miss.
