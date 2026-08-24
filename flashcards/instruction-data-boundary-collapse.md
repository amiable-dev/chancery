---
tags: [flashcards, security, llm, prompt-injection, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Instruction and data boundary collapse — Flashcards

#flashcards/security

## Definition <!-- kb:card:b3a075 -->
What is instruction and data boundary collapse?
?
Inside a model's context window there is no privilege level distinguishing instructions from data — system prompts, retrieved documents, user messages, tool results and fetched content all arrive as one undifferentiated token stream through the same weights, so any text reaching the window can influence control flow.

## Why it's easy to miss <!-- kb:card:8ed199 -->
Why is the boundary collapse easy to overlook even though an architecture diagram shows clear separations?
?
Outside the model, the separations (permission scopes, schema contracts, sandboxes, execution policies) still hold — they just quietly stop existing at the inference call itself.

## Resistance is learned, not structural <!-- kb:card:a796e8 -->
Why doesn't a model's resistance to crude 'ignore previous instructions' overrides mean the boundary is intact?
?
That resistance is learned behaviour with a probability attached, not a structural guarantee — indirect injections dressed as legitimate context (a line in an email, a field in a tool response) survive it.

## Consequence for soundness <!-- kb:card:b23d0b -->
What does the collapse imply about using successful code execution as evidence a system is sound?
?
Risk has migrated from build time, where compilers and type systems used to catch it, to run time — so generated code executing successfully is no longer a usable proxy for soundness.

## What counts as proof a boundary held <!-- kb:card:3ab467 -->
What must be true of any mechanism that claims a security boundary held?
?
It must be something the token stream cannot reach — a static check, an enforced permission scope, or a sandbox — rather than another model reading the same context.
