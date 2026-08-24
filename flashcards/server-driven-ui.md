---
tags: [flashcards, mobile, architecture, frontend, domain/software-distribution, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Server-driven UI — Flashcards

#flashcards/mobile

## Definition <!-- kb:card:582d82 -->
What is server-driven UI?
?
An architecture that splits the client into a generic renderer plus a component vocabulary, while the server supplies a payload describing which components appear, in what order, and with what data — so screens change via payload, not a new build.

## The client/server contract <!-- kb:card:05e60a -->
What does each half of the client-server contract carry in server-driven UI?
?
The client ships a fixed component vocabulary plus layout/interaction logic; the server sends a structured document (typically JSON) naming components, their content and their actions, which the renderer walks to produce the screen.

## Why it matters most on mobile <!-- kb:card:e9999e -->
Why does release decoupling matter most on mobile specifically?
?
Otherwise every UI change waits on app store review and on users updating; server-driven UI lets experiments, merchandising and flow changes move at deploy speed instead of release-cycle speed.

## Protocol accretion failure <!-- kb:card:61ef39 -->
What is the recognizable failure mode of a server-driven UI payload format over time?
?
It accretes into a configuration language that can express anything, is understood by nobody, and can't be changed without breaking older clients still in the wild.

## Versioning overhead <!-- kb:card:708821 -->
Why is versioning a permanent overhead in server-driven UI, and where does debugging get harder?
?
A payload must stay renderable by every client version still installed, and debugging spans a boundary where the failing screen exists in no single repository.

## Recommended scope <!-- kb:card:255e86 -->
How is server-driven UI recommended to be scoped, and why?
?
To the highly dynamic parts of an app rather than as a blanket replacement for all UI — the protocol and versioning costs are real, and a proprietary framework investment pays off mainly at a scale where many teams and platforms share the same surfaces.
