---
tags: [flashcards, circular-hallucination, ai-agents, code-review, llm, failure-modes]
sr-due: 2026-06-05
sr-interval: 1
sr-ease: 250
---

# Circular Hallucination — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f6804e -->
What is circular hallucination in AI code review?
?
A verification failure where an AI reviews output generated from the same underspecified inputs that shaped the original generation. The reviewer shares the generator's blind spots, producing self-reinforcing agreement rather than genuine verification. The model politely revalidates what it cannot see is wrong.

## The Circular Loop <!-- kb:card:15589b -->
Describe the anatomy of a circular hallucination in code review.
?
```
Vague ticket → AI generates code → AI reviews code → "Looks good!" → Merge
      ↑                                   ↓
      └──────── same ambiguous intent ────┘
```
Both models see the same feature intent but not the architectural constraint that makes the generated approach wrong. The review validates the code against the same incomplete spec that drove generation.

## Why Multi-Model Doesn't Solve It <!-- kb:card:2c5eb2 -->
Does using multiple AI models for review (e.g., LLM Council) break circular hallucination? Why or why not?
?
Not automatically. Adding more models doesn't break the circularity if all models share the same missing context (the architectural constraints). Models may agree because they all see the same incomplete picture, not because the code is correct.
**Breaking the loop requires** injecting explicit boundary constraints into the review prompt — or better, using deterministic static analysis (Semgrep) that doesn't share the LLM's blind spots at all.

## Relationship <!-- kb:card:4c6baa -->
What is the relationship between circular hallucination and comprehension debt?
?
Circular hallucination is one of the primary *mechanisms* through which comprehension debt accumulates undetected. AI review of AI-generated code from the same vague spec validates architectural violations rather than catching them — allowing debt to compound while appearing reviewed and approved.

## Mitigation <!-- kb:card:e18ea1 -->
What are the two ways to break a circular hallucination loop?
?
1. **Inject explicit constraints before generation** — the [[context-compilation-pattern]] provides `boundaries.md` to both the generator and reviewer, so architectural invariants are visible to both
2. **Use deterministic post-generation checks** — Semgrep/AST rules that don't hallucinate and don't share the LLM's missing context, making violations physically unmerge-able regardless of what the AI reviewer says
