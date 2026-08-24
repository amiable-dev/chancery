---
tags: [flashcards, prompting, human-ai-interaction, software-engineering, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Unknowns inventory in prompting — Flashcards

#flashcards/prompting

## Unknowns inventory: four quadrants <!-- kb:card:467c61 -->
What are the four quadrants of an unknowns inventory?
?
Known knowns (what the prompt can state), known unknowns (gaps you can name), unknown knowns (criteria you'd recognise but wouldn't think to write down), and unknown unknowns (considerations absent from your model of the problem).

## What bounds agent output quality <!-- kb:card:32137a -->
According to this framing, what bounds the quality of an agent's output?
?
Not the model, but how much of the unknowns inventory the instruction has surfaced.

## Over- and under-specification: same failure <!-- kb:card:9a058b -->
Why are instructing too specifically and instructing too vaguely the same underlying failure?
?
Both leave the instruction silent about what the author doesn't know, so the agent can't tell which parts of the plan are load-bearing and which are guesses — too-specific gets followed past the point where pivoting was right, too-vague gets filled with generic defaults.

## Each quadrant needs a different remedy <!-- kb:card:24d0d9 -->
Why can't one method close all four quadrants of an unknowns inventory?
?
Known unknowns close by research or asking; unknown knowns are tacit and only surface when something concrete is put in front of you to react to; unknown unknowns require an interlocutor who already knows the territory to map it for you.

## Where agentic skill actually lives <!-- kb:card:3039d2 -->
What does this framing say the real skill in agentic work is, if not prompt phrasing?
?
The discipline of enumerating and closing unknowns before the expensive step begins — a discipline that improves with practice.

## Why stating your own starting point matters <!-- kb:card:2709ee -->
Why is declaring your own experience, prior attempts, and confidence itself useful prompt content?
?
It tells the agent which quadrant it is helping with.
