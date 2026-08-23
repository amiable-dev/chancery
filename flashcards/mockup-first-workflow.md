---
tags: [flashcards, workflows, agentic-coding, prototyping]
sr-due: 2026-07-08
sr-interval: 1
sr-ease: 250
---

# Mockup-First Workflow — Flashcards

#flashcards/workflows

## Definition <!-- kb:card:acc418 -->
What is a mockup-first workflow?
?
An agentic development pattern where, before touching production data or real system state, you instruct the AI to generate multiple radically different rough prototypes populated with fake/placeholder data — so you can identify and discard wrong directions while changes are still cheap.

## Application <!-- kb:card:f3910f -->
When would you use a mockup-first workflow?
?
Before committing to any significant implementation: UI layouts, data model design, API shapes, content structure, or algorithm selection. Any decision where discovering the wrong direction late is expensive, and where you struggle to articulate your preferences upfront.

## Key principle <!-- kb:card:7f6d16 -->
Why ask for "wildly different" versions rather than one mockup?
?
A single mockup that's 70% right tempts you to patch rather than reconsider. Multiple divergent versions force comparative evaluation and surface preferences you didn't know you had — constraints emerge through comparison that don't emerge from a single option.

## Key principle <!-- kb:card:07fd2b -->
Why must mockups use fake data rather than blank placeholders?
?
Realistic-looking fake data exposes layout, density, and interaction assumptions that blank wireframes hide. A dashboard with real-looking numbers and edge-case strings looks completely different from one with `[VALUE]` placeholders — the design problem only becomes visible with representative content.

## Relationship <!-- kb:card:6ad926 -->
How does the mockup-first workflow relate to the knowledge pipeline staging pattern?
?
They share the same structure: draft something cheap → elicit a reaction → decide → commit. The mockup-first workflow is the agentic coding equivalent of the staging-note → review → promote pipeline.

## Phase <!-- kb:card:8ba347 -->
In the before/during/after framework, where does mockup-first belong?
?
The **during** phase (early iteration) — it happens after unknowns are surfaced (blind spot pass) but before real implementation begins.
