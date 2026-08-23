---
tags: [flashcards, static-analysis, code-quality, duplication]
sr-due: 2026-05-02
sr-interval: 1
sr-ease: 250
---

# Code Clone Detection — Flashcards

#flashcards/static-analysis

## Definition <!-- kb:card:521156 -->
What is code clone detection?
?
Static analysis that finds duplicated code across a codebase — from verbatim copy-paste (Type-1) to structurally similar blocks with renamed variables (Type-2) to semantically equivalent logic implemented differently (Type-3/4). Requires cross-file analysis.

## Clone Types <!-- kb:card:d22fa7 -->
What are the four types of code clones?
?
- Type 1 (exact): verbatim copy, possibly different whitespace/comments
- Type 2 (renamed): same structure, different variable/function names
- Type 3 (near-miss): similar structure with some added/removed statements
- Type 4 (semantic): different code that computes the same result

## Algorithm <!-- kb:card:175131 -->
Why does Fallow use a suffix-array algorithm for clone detection instead of pairwise comparison?
?
Pairwise comparison is O(n²) — quadratic in the number of code blocks, too slow for large codebases. Suffix-array construction is O(n log n), reducing clone detection to near-linear time and making it feasible in CI.

## Default Mode <!-- kb:card:7d8940 -->
What does Fallow's default "mild" duplication mode detect?
?
AST-normalized clones — it normalizes the AST before comparison, catching renamed variables and minor restructuring (Type-2 clones), not just exact token matches. More useful than strict mode without the false-positive rate of semantic mode.

## Application <!-- kb:card:47466c -->
When is `--group-by owner` useful for duplication analysis?
?
When clone groups span multiple teams' CODEOWNERS files — it surfaces cross-team duplication that should be extracted into a shared library, and routes the refactoring conversation to the right owners.
