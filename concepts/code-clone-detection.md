---
title: "Code Clone Detection"
date: 2026-05-02
domain: software-engineering
maturity: established
source_type: practitioner
topics: [static-analysis]
tags: [concept, static-analysis, code-quality, duplication, refactoring, domain/software-engineering, maturity/established, source-type/practitioner, topic/static-analysis]
status: draft
sources:
  - url: https://github.com/fallow-rs/fallow
    hash: sha256:c9d8e33f047bc6cf1b0c52852a16031767a6b31545548f3a889cb58f44251b43
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.fallow.tools
    hash: sha256:e21629f777f02488472613e4a212628641a324c6b34e2fcefb422ae66554d777
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://dl.acm.org/doi/10.1145/1228677.1228686
    unreachable: true
    reason: HTTP 403
    checked: 2026-08-21
    class: unclassified
    reachability: blocked-4xx
---

# Code Clone Detection

## Definition
Static analysis that identifies duplicated code segments across a codebase, ranging from verbatim copy-paste (Type-1 clones) to structurally similar blocks with renamed variables (Type-2) to semantically equivalent logic implemented differently (Type-3/semantic clones). Detection algorithms range from token-hash matching to AST normalization to suffix-array construction.

## Explanation
Duplication is inevitable in any active codebase — developers copy-paste, AI agents regenerate similar patterns, refactoring leaves behind partial extractions. The problem compounds because:
- Each clone must be updated independently when requirements change
- Bug fixes in one clone must be manually propagated to others
- Clones signal extraction opportunities (a utility function that should exist but doesn't)
- AI-generated code tends to produce many near-duplicates because the model sees similar patterns and reproduces them

**Clone taxonomy:**

| Type | Description | Example |
|---|---|---|
| Type 1 (exact) | Verbatim copy, possibly with whitespace/comment differences | Literally the same block pasted twice |
| Type 2 (renamed) | Same structure, different variable/function names | `getUserById` and `getProductById` with identical logic |
| Type 3 (near-miss) | Similar structure with some added/removed statements | Validation logic that's mostly the same but one path has an extra guard |
| Type 4 (semantic) | Different code that computes the same result | Two implementations of the same algorithm |

**Detection algorithms:**
- **Exact/strict:** Token hashing — hash normalized token sequences, find collisions. Fast, no false positives.
- **Mild (AST-based):** Normalize AST subtrees before comparison. Catches renamed variables and minor restructuring. Fallow's default mode.
- **Weak:** Further normalizes string literals. Catches clones that differ only in constants.
- **Semantic:** Compare structural/behavioural signatures. More expensive, catches deeper redesigns of the same logic.

**Suffix-array approach (Fallow):** Rather than quadratic pairwise comparison (O(n²)), Fallow uses a suffix-array construction over the token stream, reducing clone detection to O(n log n) and making it feasible on large codebases in CI.

```bash
fallow dupes                        # Default (mild/AST-based)
fallow dupes --mode semantic        # Catch clones with renamed variables
fallow dupes --mode strict          # Exact token matches only
fallow dupes --skip-local           # Cross-directory only (ignore same-file dups)
fallow dupes --group-by owner       # Assign clone groups to CODEOWNERS teams
fallow dupes --trace src/utils.ts:42  # All clones of specific code location
```

**Output concepts:**
- **Clone family:** a set of files all containing variants of the same original block
- **Clone group:** a specific pair or set of clones within a family
- **Duplication rate:** (duplicated lines / total lines) × 100; a codebase health metric

## Key Properties
- **Cross-file scope** — file-local tools won't find clones in different modules
- **Multiple detection modes** — exact → mild → weak → semantic, trading precision for recall
- **Suffix-array algorithm** — linear-ish time, not quadratic pairwise
- **Clone family grouping** — clusters related clones for prioritized extraction
- **Ownership-aware** — `--group-by owner` surfaces cross-team duplication for coordination

## Relationships
- Used by [[fallow-codebase-intelligence]]: duplication is one of Fallow's four core analysis domains
- Builds on [[ast-based-code-analysis]]: AST normalization is the key preprocessing step for Type-2+ clone detection
- Related to [[dead-code-detection]]: extracted utility functions resolve both duplication and (if done right) dead export risk

## Applications
- **Post-AI-session review:** AI coding agents generate structurally similar code across files; clone detection surfaces extraction opportunities
- **Refactoring prioritization:** high-clone-count families → highest-value utility extractions
- **Bug propagation prevention:** find all clones before fixing a bug so the fix covers all instances
- **CODEOWNERS team alerts:** cross-team clones often indicate convergent evolution that should become a shared library
- **Monorepo deduplication:** identify logic that appears in multiple packages and should be extracted to a shared util

## Study
- Flashcards: [[flashcards/code-clone-detection|Practice this concept]]

## Sources
- [fallow-rs/fallow on GitHub](https://github.com/fallow-rs/fallow)
- [Fallow docs](https://docs.fallow.tools)
- [Clone taxonomy — Koschke 2007](https://dl.acm.org/doi/10.1145/1228677.1228686) — original classification of clone types

## See Also
- [[fallow-codebase-intelligence]]
- [[ast-based-code-analysis]]
- [[dead-code-detection]]
