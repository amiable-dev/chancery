---
tags: [flashcards, ai-agents, devops, specifications, prompts]
sr-due: 2026-04-23
sr-interval: 1
sr-ease: 250
---

# Specification-Driven Development — Flashcards

#flashcards/devops

## Definition <!-- kb:card:6e6072 -->
What is specification-driven development?
?
An engineering practice where structured, versioned specification files replace ephemeral prompts as the primary input for AI-assisted development. Specs define what to build, why, constraints, and acceptance criteria — stored alongside code as durable artefacts consumed by both humans and agents.

## Prompts vs Specs <!-- kb:card:a1ce2a -->
How do prompts differ from specifications in AI-assisted development?
?
Prompts are ephemeral, ad hoc, and optimised for a single interaction — they live in chat windows and disappear. Specifications are durable, structured, and designed to be consumed by both humans and agents across the entire feature lifecycle.

## Maturity Curve <!-- kb:card:82e53a -->
What are the four stages of the specification maturity curve?
?
1. Ad hoc prompts — one-off, no standardisation
2. Template prompts — reusable templates, fragile for complex work
3. Structured specs — versioned files with acceptance criteria
4. Living specs — continuously updated, linked to code and tests, used by pipelines for verification

## Living Specs <!-- kb:card:e4ff8a -->
What makes "living specs" the highest-maturity stage?
?
Living specs are continuously updated, linked to code and tests, and used by CI/CD pipelines for verification — enabling "pipeline-as-specification" where the pipeline validates that implementations match spec acceptance criteria, not just that they compile and pass generic tests.

## Dual Benefit <!-- kb:card:95e8db -->
What dual benefit do well-written specifications provide?
?
They serve as both agent input (task context with acceptance criteria) and documentation — reducing the overhead of maintaining separate design documents and user stories. One artefact, multiple consumers.

## Quality Correlation <!-- kb:card:bd607e -->
What determines agent output quality in specification-driven development?
?
The clarity and completeness of the specification. Teams adopting spec-driven development report significant improvement in agent output quality because the agent has clearer intent to work from.
