---
tags: [flashcards, dead-code-detection, static-analysis, testing]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Deletion confidence for dead code — Flashcards

#flashcards/dead-code-detection

## Core practice <!-- kb:card:b55067 -->
What does 'deletion confidence for dead code' treat a static analyzer's dead-code finding as?
?
A candidate, not a verdict — to be confirmed against dynamic evidence before deletion.

## Static tool limitation <!-- kb:card:a31bc7 -->
Why can static dead-code tools produce false positives?
?
They examine source text without running it, so they can't see code reachable via metaprogramming, dynamic dispatch, or undeclared entry points.

## Dynamic tool limitation <!-- kb:card:cebd4a -->
What limits the trustworthiness of a dynamic (runtime-observation) 'unused' finding?
?
The length of the observation window — a path exercised once a quarter looks identically dead to a truly dead one until the tool has watched long enough to catch it.

## Combined confidence rule <!-- kb:card:e51264 -->
When does this practice say it's safe to delete a flagged piece of code?
?
Only once static analysis flags it and a sufficiently long dynamic observation window has also failed to exercise it.

## Sizing the observation window <!-- kb:card:9c46b2 -->
How should the dynamic observation window's length be chosen?
?
As a judgment call tied to the code's own usage cadence — e.g. quarterly billing logic needs a longer window than a request handler hit every second — not a fixed default.
