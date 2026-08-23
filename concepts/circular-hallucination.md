---
title: "Circular Hallucination"
date: 2026-06-05
domain: ai-safety
maturity: emerging
source_type: practitioner
topics: [evaluation, safety]
tags: [concept, ai-agents, code-review, verification, llm, failure-modes, governance, domain/ai-safety, maturity/emerging, source-type/practitioner, topic/evaluation, topic/safety]
status: draft
sources:
  - url: https://www.oreilly.com/radar/context-as-code/
    hash: sha256:36f3b757baaa836f0f6e1f54a9b603b618a1fdb5f731a93fa19abb4ddb351653
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Circular Hallucination

## Definition
A verification failure mode in which an AI model reviews or validates output that was generated from the same underspecified inputs that shaped the original generation — producing self-reinforcing agreement rather than genuine verification. The reviewing model politely revalidates the generating model's blind spots, because both share the same missing context.

## Explanation
The term reframes a common practice — using AI to review AI-generated code — to expose its structural flaw: if the same vague Jira ticket drives both generation and review, the reviewer has no additional information to catch what the generator missed.

Consider a concrete scenario:

1. Developer gives an AI agent a ticket: "Add an email notification after a successful payment"
2. Agent generates code that imports SMTP library directly into the billing domain
3. Developer then asks an AI to review the generated code
4. The AI reviewer, operating from the same vague ticket with no explicit architectural constraints, gives a positive review — the code is syntactically correct, well-structured, and fulfils the stated requirement

The review is circular: the reviewer's assessment is conditioned on the same ambiguous intent signal. The architectural violation (SMTP import in billing domain, breaking bounded context isolation) is invisible to both models because neither was given the constraint that makes it a violation.

The "hallucination" framing is deliberate: the review *appears* to provide verification but produces a confident, plausible-sounding assessment from false premises. The reviewer isn't lying — it's validating what it sees, against unstated rules it doesn't have.

### Why Multi-Model Review Doesn't Solve It
Adding more models to the review doesn't break the circularity if they all share the same blind spot (the missing architectural constraint). This is why the [[context-compilation-pattern]] argues for *deterministic* CI enforcement rather than relying on LLM review as the primary architectural gate — a Semgrep rule doesn't hallucinate, and it doesn't share the LLM's blind spots.

Multi-model review (e.g., LLM Council) remains valuable for catching *local* issues — logic errors, risky patterns, implementation mistakes — but is structurally insufficient for catching *architectural drift* unless the architectural constraints are explicitly encoded in the review prompt or verified by a deterministic gate.

### The "Circular" Anatomy
```
Vague ticket → AI generates code → AI reviews code → "Looks good!" → Merge
       ↑                                    ↓
       └────────── same ambiguous intent ───┘
```

Breaking the loop requires injecting explicit constraints *before* generation (the context compilation pattern) or *before* review (providing architectural boundaries to the reviewer). Without this, the loop is closed and self-validating.

## Key Properties
- **Input-conditioned:** the failure arises from shared underspecification, not model capability
- **Confident output:** like other hallucination types, produces a plausible, authoritative-sounding result
- **Locally correct, architecturally blind:** generated and reviewed code may be technically functional while violating structural invariants
- **Invisible from the outside:** CI goes green, tests pass, review is positive — the failure is only visible when architectural constraints are explicitly checked
- **Amplified by speed:** AI-speed generation makes circular review loops run many times per day, compounding the architectural debt

## Relationships
- Produces [[comprehension-debt]]: circular hallucination is one of the primary mechanisms through which comprehension debt accumulates undetected
- Addressed by [[context-compilation-pattern]]: injecting explicit governance artifacts (boundaries.md) into both the generator and the reviewer, plus adding deterministic static checks, breaks the circular loop
- Mitigated by [[multi-agent-revalidation]]: structurally distinct agents (different context, different constraints) can break the circularity if they have access to explicit architectural boundaries
- Contrasts with [[agentic-pipeline-verification]]: deterministic pipeline verification (Semgrep, AST checks) does not share the LLM's blind spots and is immune to circular hallucination
- Exacerbated by [[context-rot]]: stale or vague context makes both generation and review rely on more inference and less explicit constraint, widening the shared blind spot

## Applications
- **Code review design:** AI-assisted code review should always supply explicit architectural constraints (boundaries.md, ADRs, domain rules) to the reviewer — not just the diff and the Jira ticket
- **SDLC governance:** Circular hallucination is the argument for *deterministic* post-generation checks (Semgrep, type checkers, architecture linters) as the primary gate, with AI review as a secondary signal
- **Multi-model review:** Even using multiple models (e.g., LLM Council) does not break circular hallucination unless architectural constraints are injected; models agree on what they see but share the same missing knowledge
- **Audit:** When a team claims AI-reviewed AI-generated code is architecturally sound, the circular hallucination risk is a specific audit question: were the architectural constraints explicitly provided to the reviewing model?

## Study
- Flashcards: [[flashcards/circular-hallucination|Practice this concept]]

## Sources
- [Context as Code — O'Reilly Radar](https://www.oreilly.com/radar/context-as-code/) — coins the term and explains why AI-reviewing-AI from the same vague spec produces self-validation, not verification

## See Also
- [[comprehension-debt]]
- [[context-compilation-pattern]]
- [[multi-agent-revalidation]]
- [[agentic-pipeline-verification]]
- [[context-rot]]
- [[context-debt]]
