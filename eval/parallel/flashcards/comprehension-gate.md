---
tags: [flashcards, code-review, human-ai-interaction, software-engineering, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Comprehension gate — Flashcards

#flashcards/code-review

## Definition <!-- kb:card:0f7426 -->
What is a comprehension gate?
?
A merge precondition satisfied by the human rather than the machine: before a model-authored change lands, the person accountable for it must demonstrate understanding of it, canonically by passing a model-generated quiz about the change's behaviour.

## Canonical form and pass bar <!-- kb:card:cb3055 -->
What is the canonical form of a comprehension gate, and why must the score be perfect?
?
A model-generated explainer plus a quiz about the change's behaviour, which the reviewer must pass perfectly. A partial pass would identify the misunderstanding but merge it anyway, so the bar is deliberately set at a perfect score.

## Motivation: diffs under-represent behaviour <!-- kb:card:b01579 -->
Why is reading a diff not sufficient evidence of understanding a change?
?
A diff shows only the lines that moved; whether those lines behave as intended depends on the surrounding system and untouched code paths, which the reviewer must hold in their head and typically does not — especially after a long agentic session that outran what its operator tracked.

## Limitation: accountability, not correctness <!-- kb:card:ca5073 -->
What does a comprehension gate fail to verify, and why?
?
It does not verify correctness — a quiz written by the same model that wrote the code shares its blind spots. It verifies only that a human can answer for what is shipping.

## Dual use as reviewer pitch <!-- kb:card:dc37d0 -->
Besides gating the change's author, what second purpose does the explainer-plus-quiz artifact serve?
?
It doubles as the reviewer-facing pitch: outside reviewers start with the same unknowns the author began with, so the same artifact accelerates their approval and shows that the failure modes an expert would ask about were considered.
