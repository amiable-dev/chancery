---
tags: [flashcards, llmops, platform-engineering, governance, domain/governance, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# LLMOps maturity gates — Flashcards

#flashcards/llmops

## Definition <!-- kb:card:0a7af5 -->
What are LLMOps maturity gates?
?
A codified maturity model over a small fixed set of LLM operational capabilities, scored automatically from the observability platform's API, and consumed by lifecycle reviews that decide whether a use case advances stages.

## Four capability axes <!-- kb:card:7c4da7 -->
What four capability axes make up LLMOps maturity gates?
?
Instrumented for tracing; has an offline evaluation suite; has online evaluators running in production; user feedback is flowing back and being reused.

## Machine-checkable scoring <!-- kb:card:5c2388 -->
How is a product's maturity score determined, and why does that matter?
?
Automatically, by a scheduled job querying the observability platform's API — not by team self-report — so adoption becomes a dashboard nobody argues with instead of an optimistic survey.

## Enforcement via stage gates <!-- kb:card:512126 -->
What makes the maturity model actually change behavior rather than just report it?
?
The score is wired into lifecycle stage-gate reviews (exploration, incubation, industrialization, operations), so an uninstrumented product cannot advance to the next stage.

## Why both halves are required <!-- kb:card:f957a0 -->
Why is neither automated measurement alone nor a stage gate alone sufficient?
?
Automated measurement without a gate is decoration; a gate without machine-checkable evidence is a rubber stamp. The pairing of both is what transfers to other portfolios.
