---
tags: [flashcards, ai-agents, loop-engineering, context-engineering]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Prompt → Context → Harness → Loop — Flashcards

#flashcards/ai-agents

## Structure <!-- kb:card:bd9506 -->
What are the four layers in the engineering-stack progression, and what does each one optimize?
?
1. **Prompt engineering** (~2022–24): wording individual instructions
2. **Context engineering** (2025): curating everything the model sees at inference time
3. **Harness engineering** (early 2026): the full environment, tools, and constraints around the model
4. **Loop engineering** (June 2026): the cycle that repeatedly runs the harness until a checkable goal is met

## Nesting Principle <!-- kb:card:ec1a7c -->
How do the four layers relate to each other — replacement or containment?
?
Containment, not replacement. Each layer wraps the previous ones: a loop contains a harness, a harness contains context, context contains prompts. You still write prompts and curate context even once you're doing loop engineering.

## Diagnostic Use <!-- kb:card:684f61 -->
Why is this progression useful as a diagnostic tool when an agent workflow underperforms?
?
A failure at one layer can masquerade as a failure at another — e.g. a missing-tool problem (harness layer) is often mistakenly "fixed" by rewriting a prompt (prompt layer). Checking each layer in order (prompt → context → harness → loop) helps correctly locate where the actual gap is before investing in a fix.
