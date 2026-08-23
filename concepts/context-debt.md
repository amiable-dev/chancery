---
title: "Context Debt"
date: 2026-06-05
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [static-analysis, agentic-coding]
tags: [concept, ai-agents, governance, architecture, technical-debt, code-quality, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/static-analysis, topic/agentic-coding]
status: draft
sources:
  - url: https://www.oreilly.com/radar/context-as-code/
    hash: sha256:36f3b757baaa836f0f6e1f54a9b603b618a1fdb5f731a93fa19abb4ddb351653
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Context Debt

## Definition
The accumulation of risk arising from governance artifacts (intent files, boundary declarations, threat models, Semgrep rules) that have become stale, incorrect, or unowned relative to the codebase they govern — causing them to enforce wrong constraints with the full authority of the enforcement mechanism.

## Explanation
The [[context-compilation-pattern]] establishes governance artifacts (`intent.md`, `boundaries.md`, `threat-model.md`, `semgrep-rule.yml`) as the mechanism through which architectural constraints are enforced at build time. These artifacts are powerful precisely because they are authoritative: violations are blocked by CI, not flagged for discussion. But this authority cuts both ways.

If an artifact declares the wrong constraint — because the architecture evolved, the domain rules changed, or the threat model was never updated after a system redesign — the pipeline will enforce that wrong constraint with the same certainty it would enforce a correct one. Context debt is the accumulated risk of this condition.

The phrase deliberately echoes *technical debt*: just as skipped refactoring creates compounding maintenance burdens, skipped governance artifact maintenance creates compounding misgovernance burdens. The difference is visibility:

- Technical debt usually shows up as friction and slow development
- Context debt can actively block legitimate changes or, worse, permit harmful ones through gaps in an outdated rule set

### Forms of Context Debt

**Overly restrictive stale rules:** A `boundaries.md` that forbids a pattern that has since been deliberately adopted (e.g., a new approved library) creates spurious CI failures that developers learn to work around — eroding trust in the governance system.

**Overly permissive stale rules:** A `threat-model.md` that doesn't reflect a new integration surface allows adversarial input paths that the current rules don't cover. The governance system appears to pass while the actual risk has grown.

**Orphaned ownership:** Artifacts without explicit owners drift toward staleness on a timeline proportional to the pace of architectural change. No one is responsible for updating them, so no one does.

**Schema drift:** The module boundaries declared in `boundaries.md` no longer match the actual directory structure of `src/` after a refactor — the rules target the wrong paths and are effectively no-ops.

### The Authoritative Failure
Context debt is worse than having no governance artifacts in one specific way: a codebase without governance fails open (no enforcement). A codebase with stale governance fails with false confidence — the engineering team believes the system is governed when it isn't, or is blocked from correct changes by rules that no longer apply.

## Key Properties
- **Invisible by default:** The governance pipeline still runs and shows green/red; only semantic review reveals whether the artifacts reflect current intent
- **Authority-amplified risk:** The enforcement mechanism is agnostic to artifact correctness; it enforces whatever is declared
- **Ownership-dependent:** Context debt accumulates when artifact ownership is unclear or unassigned
- **Versioning-mitigable:** Treated as production code with version control, review processes, and changelogs, governance artifacts can be kept current
- **Compounding:** As the gap between declared boundaries and actual architecture widens, the cost of reconciliation grows — just like technical debt

## Relationships
- Produced by [[context-compilation-pattern]] when artifacts are not maintained: the pattern's power is proportional to artifact freshness; staleness converts governance into liability
- Analogous to technical debt in [[prompts-as-infrastructure]]: prompts as infrastructure are subject to the same versioning and review discipline requirement; stale prompts are a form of context debt
- Related to but distinct from [[context-rot]]: context rot is a *model* performance degradation in long context windows; context debt is a *governance artifact* correctness degradation over time
- Managed like production code in [[agentic-sdlc]]: governance artifacts require the same version control, CI integration, and ownership model as application source
- Exacerbates [[comprehension-debt]]: stale boundary artifacts can permit architectural drift that the enforcement mechanism was specifically designed to prevent

## Applications
- **Artifact ownership policy:** Every governance artifact should have an explicit owner (individual or team) responsible for its correctness, analogous to CODEOWNERS for source files
- **Governance artifact review cycles:** Include governance artifacts (`/context/**`) in sprint-level review cadences — at minimum, review when the bounded context they govern changes significantly
- **Onboarding governance artifacts:** When adopting the Context Compilation Pattern on an existing codebase, treat the initial authoring of artifacts as a significant engineering investment; context debt starts from day one if artifacts are rushed
- **Audit signal:** In compliance contexts, the age and last-modified dates of governance artifacts are a signal for context debt risk; stale threat models in regulated domains are a direct audit finding
- **Conductor project application:** Boundary declarations for Conductor's core modules should be reviewed whenever a major subsystem changes; the reviewer is not just checking code but checking whether the governance artifact still reflects the correct intent

## Study
- Flashcards: [[flashcards/context-debt|Practice this concept]]

## Sources
- [Context as Code — O'Reilly Radar](https://www.oreilly.com/radar/context-as-code/) — explicitly warns that "stale context is as dangerous as stale code" and that governance artifacts "require strict versioning, explicit ownership, and periodic review just like the executable logic they constrain"

## See Also
- [[context-compilation-pattern]]
- [[comprehension-debt]]
- [[context-rot]]
- [[prompts-as-infrastructure]]
- [[agentic-sdlc]]
- [[architecture-boundary-enforcement]]
