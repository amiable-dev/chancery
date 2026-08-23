---
tags: [flashcards, prompt-engineering, workflows, agentic-coding]
sr-due: 2026-07-08
sr-interval: 1
sr-ease: 250
---

# Blind Spot Pass — Flashcards

#flashcards/prompt-engineering

## Definition <!-- kb:card:ebbf80 -->
What is a blind spot pass?
?
A pre-task prompt technique where you explicitly ask an AI to enumerate the traps, failure modes, prerequisites, and questions you didn't know to ask before beginning unfamiliar work — converting unknown unknowns into known unknowns before implementation starts.

## Application <!-- kb:card:c0e218 -->
When would you use a blind spot pass?
?
Before starting work in an unfamiliar domain, codebase, or technical area — especially before architectural decisions or any work where wrong-direction mistakes are expensive to reverse. Run it as the very first step, before writing any code or making structural choices.

## Mechanics <!-- kb:card:76f391 -->
How do you run a blind spot pass?
?
1. Describe the task you're about to start
2. Describe your experience level in the domain
3. Ask: "What are the questions I should be asking but haven't thought to ask? What are the traps and wrong turns for someone at my level? What assumptions am I probably making incorrectly?"
4. Use the output to refine your approach before proceeding

## Relationship <!-- kb:card:f60fb1 -->
How does a blind spot pass relate to the map-territory gap?
?
The blind spot pass is a direct tool for closing the map-territory gap — the distance between what you asked for and what actually needs to happen. By surfacing unknowns upfront, you make the map more accurate before committing to a direction.

## Phase <!-- kb:card:f8c5e3 -->
In the before/during/after framework for agentic work, where does the blind spot pass belong?
?
The **before** phase — it is a pre-task technique for surfacing unknowns before any implementation begins.

## Contrast <!-- kb:card:0a0fce -->
How does a blind spot pass differ from just asking the AI to do the task?
?
A blind spot pass asks the model what you *should have asked* — it inverts the prompting direction to surface the questions and risks you didn't know existed, rather than proceeding under your current (potentially flawed) assumptions.
