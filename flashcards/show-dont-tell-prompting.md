---
tags: [flashcards, prompt-engineering, workflows, requirements]
sr-due: 2026-07-08
sr-interval: 1
sr-ease: 250
---

# Show-Don't-Tell Prompting — Flashcards

#flashcards/prompt-engineering

## Definition <!-- kb:card:deb496 -->
What is show-don't-tell prompting?
?
A requirements technique where, instead of describing what you want in words, you point the AI at a concrete reference example and ask it to infer and apply the *underlying structural logic* of that example to your context — bypassing the vocabulary gap between your intent and your ability to articulate it.

## Application <!-- kb:card:b4ea9b -->
When would you use show-don't-tell prompting?
?
Whenever you know what you want when you see it but lack the domain vocabulary to describe it precisely — for visual design, code style, writing tone, data structure, or any domain where the gap between your intent and your articulation is large.

## Key principle <!-- kb:card:6d7421 -->
What is the "vocabulary gap" problem that show-don't-tell solves?
?
When you know what you want but can't express it precisely, attempts to describe it produce paraphrases of the intent rather than the thing itself. A reference example lets the model read the structure directly, bypassing the need to translate intent into vocabulary you may not have.

## Mechanics <!-- kb:card:731ff9 -->
What's the key framing for show-don't-tell prompting?
?
Ask the model to read the structural logic *beneath* the surface, not copy the surface. Frame it as: "Analyse how this is actually built — what compositional choices make it work — then give my version those same underlying principles." This produces structure transfer, not cloning.

## Relationship <!-- kb:card:c15dd4 -->
How does show-don't-tell prompting relate to the blind spot pass?
?
Both address the same root problem: the limits of explicit articulation. A blind spot pass surfaces what you don't know you don't know (unknown unknowns); show-don't-tell bypasses what you know you want but can't describe (vocabulary unknowns). They're complementary pre-task techniques.

## Contrast <!-- kb:card:56b25f -->
What distinguishes show-don't-tell prompting from asking the AI to copy an example?
?
Show-don't-tell explicitly asks for *structural principle extraction and transfer*, not imitation. The goal is to understand why the reference works (the abstract logic) and apply that logic to a new context — not to reproduce the reference's specific content or appearance.
