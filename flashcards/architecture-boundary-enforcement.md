---
tags: [flashcards, architecture, static-analysis, code-quality]
sr-due: 2026-05-02
sr-interval: 1
sr-ease: 250
---

# Architecture Boundary Enforcement — Flashcards

#flashcards/architecture

## Definition <!-- kb:card:333681 -->
What is architecture boundary enforcement?
?
Static analysis that codifies intended layer/module boundaries as rules (which directories/modules may import which others), then detects violations by inspecting import edges in the module graph. Turns architecture decisions from documentation into executable constraints.

## Why Drift Happens <!-- kb:card:a8bf9c -->
Why do architectural boundaries erode over time?
?
Deadline pressure encourages shortcuts; AI agents pattern-match on existing imports and reproduce violations; refactoring creates temporary cross-boundary imports that never get cleaned; new team members don't know the intended structure. Each violation makes the next more likely (precedent effect).

## Rule Format <!-- kb:card:68ca16 -->
How would you express "domain layer must not import infrastructure" as a Fallow rule?
?
```json
{
  "boundaries": [{
    "name": "domain isolation",
    "from": "src/domain/**",
    "disallow": ["src/infrastructure/**"]
  }]
}
```
Fallow compares each import edge against `from`/`disallow` predicates and reports violations.

## CI Integration <!-- kb:card:918537 -->
How should architecture boundary enforcement be integrated into CI?
?
Run `fallow audit` (or `fallow dead-code --boundary-violations`) on PR commits. Configure violations as either blocking (fail) or warning depending on team policy. Treat it like a test suite — violations fail the build.

## Relationship to AI Agents <!-- kb:card:ca4d86 -->
Why is boundary enforcement especially important when AI coding agents are contributing code?
?
Agents pattern-match on existing imports without knowing your architecture rules. If a boundary has already been violated once, the agent will likely reproduce the pattern. CI enforcement catches violations before they become precedents.
