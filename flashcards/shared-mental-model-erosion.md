---
tags: [flashcards, software-engineering, cognition, engineering-management, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Shared mental-model erosion — Flashcards

#flashcards/software-engineering

## Definition <!-- kb:card:050b26 -->
What does "shared mental-model erosion" name, and why is it a comprehension liability rather than a quality one?
?
The degradation of a team's collective theory of its own systems (what components do, why, what was left out) that accumulates when code is generated rather than reasoned into existence; it accrues even when the generated code is entirely correct, so it never shows up in a build log or test result.

## Naur's theory of programming <!-- kb:card:a3b527 -->
What claim from Peter Naur (1985) underlies this concept, and how does AI-assisted development shift its failure mode?
?
A program is a theory held by its developers, of which the code is only a partial representation. Classically the theory existed and then dispersed as people left; with AI-assisted generation the theory is never built at all, so the deficit starts at the first commit.

## Refactoring and mental models <!-- kb:card:b99dd6 -->
Why does reduced refactoring compound this erosion, and what did GitClear's longitudinal analysis find?
?
Refactoring is how developers consolidate their model of a system by handling it; when generation removes the occasion to refactor, the team loses the cleanup and the understanding together. GitClear's analysis of 211 million lines found refactoring falling from about a quarter of changed lines in 2021 to under a tenth by 2024, with duplication roughly quadrupling.

## METR perception gap <!-- kb:card:9d5ccc -->
What did METR's randomized trial find about experienced developers using AI tools, and why is the gap called the sharpest managerial consequence?
?
Sixteen experienced open-source developers were 19% slower with AI tools across 246 tasks, yet predicted a 24% speedup beforehand and still believed in a 20% speedup afterward — a team that cannot feel the slowdown will not spend time on comprehension unless leadership makes that time legitimate.

## Warning signs <!-- kb:card:7a9733 -->
What are the four behavioral warning signs of shared mental-model erosion listed in the concept?
?
Hesitation to touch particular components, an AI-first reflex when asked how something works, system knowledge concentrated in whoever wrote the original prompt, and rising cost of modifications.
