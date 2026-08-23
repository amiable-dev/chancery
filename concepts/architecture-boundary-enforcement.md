---
title: "Architecture Boundary Enforcement"
date: 2026-05-02
domain: software-engineering
maturity: established
source_type: practitioner
topics: [static-analysis]
tags: [concept, architecture, static-analysis, code-quality, typescript, design-patterns, domain/software-engineering, maturity/established, source-type/practitioner, topic/static-analysis]
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
---

# Architecture Boundary Enforcement

## Definition
A static analysis technique that codifies intended architectural layer or module boundaries as rules, then detects violations by inspecting the import graph of a codebase. An "architecture boundary" defines which modules may import which other modules; a "boundary violation" is an import edge that crosses a prohibited boundary.

## Explanation
Large codebases are typically structured in layers (e.g., presentation → application → domain → infrastructure) or modules (e.g., feature A must not directly depend on feature B's internals). These boundaries are usually documented in ADRs or READMEs but not enforced by any tooling — leading to "architecture drift" where actual dependencies gradually diverge from intended structure.

**The enforcement model:**

```jsonc
// fallow.json — example boundary config
{
  "boundaries": [
    {
      "name": "domain isolation",
      "from": "src/domain/**",
      "disallow": ["src/infrastructure/**", "src/presentation/**"]
    },
    {
      "name": "feature isolation",
      "from": "src/features/auth/**",
      "disallow": ["src/features/billing/**"]
    }
  ]
}
```

When Fallow runs with boundary rules configured, it compares each import edge in the module graph against the rule predicates. An import from `src/domain/user.ts` → `src/infrastructure/database.ts` would trigger the first rule above as a boundary violation.

**Why drift happens:**
- Developers take shortcuts under deadline pressure
- AI agents don't know your architecture rules — they pattern-match on existing imports and reproduce them
- Refactoring creates temporary cross-boundary imports that never get cleaned up
- New team members add imports without knowing the intended structure

**Architecture drift is cumulative:** each violation makes the next one more likely (the existing violation serves as a precedent). Static enforcement breaks this feedback loop.

**Integration with CI:** `fallow dead-code --boundary-violations` (boundary violations are surfaced as dead-code-category findings) or `fallow audit` including boundary checks. Violations can be treated as blocking (fail) or warning depending on team policy.

## Key Properties
- **Rule-based** — boundaries are explicit predicates on file path patterns
- **Graph-enforced** — violations are detected in the module graph, not by grepping imports
- **CI-compatible** — `fallow audit` produces pass/warn/fail verdicts suitable for PR gates
- **Monorepo-aware** — rules can span workspace packages, not just directories
- **CODEOWNERS integration** — `--group-by owner` clusters violations by responsible team

## Relationships
- Depends on [[module-graph-analysis]]: boundary violations are edges in the module graph that violate rule predicates
- Used by [[fallow-codebase-intelligence]]: architectural boundary enforcement is one of Fallow's four analysis domains
- Related to [[dead-code-detection]]: both are dead-code-category findings in Fallow; boundary violations and dead code often cluster together
- Related to [[agentic-sdlc]]: AI agents operating without boundary rules will reproduce drift; enforcement is part of AI-safe SDLC hygiene

## Applications
- **Layer architecture enforcement:** ensure domain layer has no direct infrastructure imports
- **Feature isolation:** prevent feature modules from importing each other's internals (only through public APIs)
- **Monorepo package discipline:** enforce that app packages don't import from internal libs of sibling packages
- **Post-AI-review gate:** AI agents pattern-match on existing imports; CI boundary checks catch when they follow a bad precedent
- **ADR operationalization:** convert architecture decision records into executable rules in `fallow.json`

## Study
- Flashcards: [[flashcards/architecture-boundary-enforcement|Practice this concept]]

## Sources
- [fallow-rs/fallow on GitHub](https://github.com/fallow-rs/fallow)
- [Fallow docs](https://docs.fallow.tools)

## See Also
- [[module-graph-analysis]]
- [[fallow-codebase-intelligence]]
- [[dead-code-detection]]
- [[agentic-sdlc]]
- [[context-compilation-pattern]]
