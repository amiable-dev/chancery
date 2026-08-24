---
tags: [flashcards, prototyping, requirements, human-ai-interaction, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Disposable artifacts as specification — Flashcards

#flashcards/prototyping

## Definition <!-- kb:card:be20bc -->
What is 'disposable artifacts as specification'?
?
Having a model produce cheap, throwaway concretions — divergent mockups with fake data, a single-file prototype, a plan ordered by likely change — meant to be reacted to and discarded, because judgment people can't state in advance reliably appears once they see a candidate in front of them.

## Key mechanism <!-- kb:card:06a0de -->
Why does the technique deliberately produce several divergent options rather than one?
?
Divergent options elicit preference; a single option only elicits acquiescence.

## Economics of discovery timing <!-- kb:card:5ebe76 -->
Why is discovering a criterion against a throwaway mock cheaper than discovering it mid-implementation?
?
A small spec change can imply a drastically different implementation, and an agent that has already built the wrong thing reverts it poorly — so the same criterion costs minutes against a mock but costs the implementation if found later.

## Code as reference <!-- kb:card:83985b -->
Why is existing source code a stronger reference for desired behaviour than a screenshot or description?
?
Code carries structure and semantics rather than just appearance, even across languages.

## Review plan ordering <!-- kb:card:1f933f -->
How should a review plan be ordered, and why?
?
By likelihood of change — front-loading decisions like data models, type interfaces and user-facing flows, and burying mechanical work — so review attention lands where changing your mind is still cheap.
