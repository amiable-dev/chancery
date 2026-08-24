---
tags: [flashcards, ai-coding, code-quality, technical-debt, software-engineering]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# The AI coding maintainability gap — Flashcards

#flashcards/ai-coding

## Core pattern <!-- kb:card:c7e1cd -->
What structural pattern does the AI coding maintainability gap describe?
?
AI-assisted development's default workflow rewards shipping atomic, test-passing units while implicitly taxing maintenance work (dedup, refactoring, cross-file reuse, revisiting legacy code), so duplication rises while refactoring and upkeep fall as AI-authored commits grow.

## Four structural signals <!-- kb:card:5c7f8b -->
According to the concept's Key Properties, what four structural signals does this pattern hold across?
?
Duplication, refactoring rate, cross-file connectivity, and legacy-code touch.

## Duplication trend <!-- kb:card:643467 -->
By how much did duplicated code blocks per million changed lines rise from 2023 to the 2026 high, per GitClear's analysis?
?
81%.

## Refactoring trend <!-- kb:card:666741 -->
How did the share of changed lines that were moved or refactored change over the period GitClear measured?
?
It fell from roughly a fifth to under four percent, while copy/paste climbed past it.

## Mechanism, not model quality <!-- kb:card:039629 -->
Is the AI coding maintainability gap explained by AI-written code being individually worse, or by something else?
?
By an incentive gap: default AI-assisted workflows reward closing a ticket with a passing test, not the invisible multi-year upkeep work — not a claim about per-line code quality.

## Countermeasures <!-- kb:card:6325f9 -->
What process changes can counter the AI coding maintainability gap?
?
Budget dedicated refactor/legacy time, add automated duplicate-block tripwires, review specifically for error-masking, and measure structural signals rather than volume or velocity alone.
