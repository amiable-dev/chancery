---
tags: [flashcards, reliability]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Blameless Postmortems — Flashcards

#flashcards/reliability

## Definition <!-- kb:card:a9ecbc -->
What is a blameless postmortem?
?
An incident-review practice that investigates why a mistake was *possible* within the system (missing safeguards, monitoring gaps, stale docs) rather than who made the mistake — treating enabling conditions as the fixable root cause.

## Application <!-- kb:card:b2a92e -->
Why does blameless review culture lead to more reliable systems over time?
?
Because engineers who know a postmortem targets system improvement, not punishment, report problems and near-misses earlier — surfacing small issues while they're still cheap to fix, before they compound into larger outages.

## Relationship <!-- kb:card:a0b35d -->
How does a blameless postmortem relate to weakest-link reliability?
?
A blameless postmortem is how a team discovers which dependency was the weakest link and why it was left unprotected — the review process that surfaces where weakest-link tolerance was missing.

## Anti-pattern contrast <!-- kb:card:86e148 -->
What does blameless postmortem practice have in common with treating AI agent failures as anti-patterns rather than one-off mistakes?
?
Both reframe "who/what caused this specific failure" as the wrong diagnostic question, favoring "what recurring gap in the system allowed this pattern to happen" instead.
