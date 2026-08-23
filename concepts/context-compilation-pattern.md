---
title: "Context Compilation Pattern"
date: 2026-06-05
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [static-analysis, agentic-coding, patterns]
tags: [concept, ai-agents, architecture, governance, ci-cd, static-analysis, code-generation, build-time, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/static-analysis, topic/agentic-coding, topic/patterns]
status: draft
sources:
  - url: https://www.oreilly.com/radar/context-as-code/
    hash: sha256:36f3b757baaa836f0f6e1f54a9b603b618a1fdb5f731a93fa19abb4ddb351653
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Context Compilation Pattern

## Definition
A build-time governance framework that constrains AI code generation through two layered enforcement mechanisms: (1) structured context injection — assembling versioned governance artifacts (intent, boundaries, threat models) into the agent's prompt before inference — and (2) post-generation deterministic static analysis (e.g., Semgrep) that makes declared architectural boundary violations impossible to merge into a codebase.

## Explanation
As AI agents generate syntax at machine speed, human code review can no longer act as the architectural quality gate — there is simply too much output. The Context Compilation Pattern rebuilds that gate upstream, in the IDE and CI/CD pipeline, before a single line reaches a human reviewer.

The pattern distinguishes itself from prompt engineering: it doesn't ask a probabilistic model for a better answer. It mechanically constrains what the model is *allowed to generate* and deterministically *rejects* non-conformant output via static analysis.

### The 4 Steps

**Step 1 — Context Artifacts (`/context/` directory)**
The most strategically valuable code in a governed repository may no longer live in `src/`. It lives in `/context`. Per bounded context (e.g., `/billing`, `/risk`, `/frontend`), the team authors:
- `intent.md` — what the module is for, in plain language
- `boundaries.md` — structural invariants: dependency direction, allowed communication paths, forbidden imports, permitted event emissions
- `threat-model.md` — adversarial constraints as declarative abuse scenarios (prompt injection, secrets exfiltration) that must be mechanically blocked
- `semgrep-rule.yml` — the machine-readable, deterministic enforcement of `boundaries.md` for the CI runner

**Key separation:** `boundaries.md` constrains the LLM (natural language); `semgrep-rule.yml` constrains the CI runner (deterministic YAML). They are twin artifacts, always authored together.

Example: a `boundaries.md` declaring *"no external network I/O in the billing domain"* is paired with a Semgrep rule that blocks `import smtplib` / `import requests` in `src/billing/**`. The human cannot merge code that violates this rule.

**Step 2 — Context Compiler**
Rather than dumping all Markdown files into the system prompt (which causes "lost in the middle" degradation), the compiler is a deterministic context assembly layer that scopes artifacts to the relevant module. In practice it may be:
- A manual selection step (developer points IDE to the right Markdown files)
- A simple bash/Python script that concatenates global + module-specific `.md` files into the system prompt, and hands `.yml` rules to the CI runner
- An MCP tool that allows the agent to dynamically assemble the correct boundaries within the IDE

**Step 3 — Strict Boundary Hierarchy (conflict resolution)**
When governance artifacts conflict, LLMs don't throw a compilation error — they hallucinate a dangerous compromise. The hierarchy prevents this by imposing deterministic precedence before the prompt is assembled:

```
Threat model > Boundaries > Coding standards > Intent + acceptance criteria
```

Conflict resolution is not LLM negotiation between Markdown files. It is deterministic CI rejection. If a feature request (intent.md) conflicts with a boundary constraint (boundaries.md), the CI build fails and the developer must reconcile them explicitly before regenerating.

**Step 4 — Adversarial Verification**
Post-generation, CI parses the generated syntax with the paired Semgrep rules. This is not an LLM safety check — it is a deterministic AST check. Any declared boundary violation becomes physically impossible to merge. The "adversarial" framing is deliberate: the static rules are authored *expecting* the LLM to attempt boundary violations and designed to catch them reliably.

### Why "Context Compilation"
The analogy to a compiler is precise: a traditional compiler mechanically rejects code that violates syntax and type rules, freeing developers to focus on application logic. The Context Compiler mechanically rejects *architecturally* invalid code, freeing reviewers to focus on business logic and intent. Neither guarantees correctness — but both eliminate a whole class of structural failures before execution.

## Key Properties
- **Dual enforcement:** soft (prompt biases generation toward compliance) + hard (CI deterministically rejects violations)
- **Deterministic precedence:** boundary hierarchy is fixed and applied before inference, not negotiated during it
- **Module-scoped:** artifacts are scoped to bounded contexts, not applied globally — avoids context window overload
- **Versioned and owned:** governance artifacts are production code; stale artifacts create [[context-debt]]
- **Human-authored rules:** Semgrep/CI rules are human-authored or human-reviewed; the LLM reads the Markdown but doesn't generate the enforcement gate

## Relationships
- Extends [[context-engineering]]: context engineering optimises *what* to inject; the Context Compilation Pattern adds *governance* to the injection — boundaries and threat models, not just instructions
- Operationalises [[architecture-boundary-enforcement]]: where Fallow detects boundary violations post-hoc, this pattern prevents them at generation time and makes them unmerge-able
- Versioned like [[prompts-as-infrastructure]]: governance artifacts require the same version control, ownership, and review discipline as source code
- Prevents [[comprehension-debt]]: by maintaining explicit architectural invariants that resist AI-generated drift
- Addresses [[circular-hallucination]]: deterministic static checks catch violations the same AI would miss when reviewing its own output
- Produces [[context-debt]] when stale: outdated governance artifacts enforce wrong constraints with full authority
- Deploys via [[agentic-pipeline-verification]]: the pattern's adversarial verification step is a CI gate in the agentic pipeline
- Uses [[model-context-protocol]] as context compiler: MCP is one implementation path for dynamic boundary assembly in the IDE
- Builds on [[deterministic-grounding]]: the static analysis enforcement layer is a form of deterministic grounding at the code structure level

## Applications
- **Enterprise regulated codebases:** Payment systems, insurance underwriting, logistics orchestrators — anywhere "does the code ship?" is insufficient and "who is liable when it does the wrong thing?" is the real question
- **AI-assisted SDLC:** Any team using coding agents (GitHub Copilot, Claude Code, Cursor) without boundary enforcement is vulnerable to architectural drift at machine speed
- **Bounded-context isolation:** Domain-driven design implementations where domain layer isolation (no direct DB driver access, no external I/O in core domain) must be maintained across continuous AI-assisted development
- **Threat model operationalisation:** Converting architectural decisions and threat models from ADR documents into executable, merge-blocking constraints
- **OpenClaw parallel:** `AGENTS.md`, `SOUL.md`, and workspace governance files are a form of context artifacts — this pattern provides the theoretical framework for why that approach works and how it could be extended with deterministic enforcement

## Study
- Flashcards: [[flashcards/context-compilation-pattern|Practice this concept]]

## Sources
- [Context as Code — O'Reilly Radar](https://www.oreilly.com/radar/context-as-code/) — primary source; introduces the pattern with concrete code examples for billing domain governance

## See Also
- [[context-engineering]]
- [[comprehension-debt]]
- [[context-debt]]
- [[circular-hallucination]]
- [[architecture-boundary-enforcement]]
- [[prompts-as-infrastructure]]
- [[agentic-pipeline-verification]]
- [[deterministic-grounding]]
- [[model-context-protocol]]
- [[agentic-sdlc]]
