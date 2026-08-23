---
tags: [flashcards, contract-driven-execution, ai-agents, engineering, process, specifications]
sr-due: 2026-05-21
sr-interval: 1
sr-ease: 250
---

# Contract-Driven Execution — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:331737 -->
What is Contract-Driven Execution?
?
A principle where AI agents operate against formally specified stories defining inputs, outputs, invariants, and explicit exit conditions. The exit condition is "contract satisfied" — not "good enough." Every element of ambiguity is resolved before execution begins.

## Exit Condition <!-- kb:card:8991ae -->
What distinguishes "contract satisfied" from "good enough"?
?
"Good enough" is a human judgement call — subjective and inconsistent. "Contract satisfied" is binary: all acceptance criteria checkboxes pass, all invariants are preserved, all negative constraints respected. It's verifiable without expert context, which enables autonomous agent execution and efficient review.

## Sophisticated Drift <!-- kb:card:05030a -->
What is the "more sophisticated drift" problem, and how does contract-driven execution solve it?
?
A more capable model filling in ambiguity produces plausible-looking code that violates unstated invariants — harder to catch than obvious failures. Contracts solve this by making invariants explicit: what must NOT change is stated, not assumed.

## Contract Elements <!-- kb:card:9b70f3 -->
What are the five elements of a complete contract?
?
1. **Inputs** — files to create/modify, existing dependencies
2. **Outputs** — acceptance criteria (specific, testable, binary)
3. **Invariants** — existing behaviour/contracts that must NOT be broken
4. **Negative constraints** — explicit scope exclusions ("Does NOT modify X")
5. **Exit condition** — all acceptance criteria satisfied

## Relationship to Specs <!-- kb:card:0340af -->
How is contract-driven execution different from ordinary spec-driven development?
?
Specs define "why" and "what" but leave invariants and scope boundaries implicit. Contracts add explicit invariants, negative constraints, and binary exit conditions — making the difference between "spec satisfied" and "contract satisfied" unambiguous and agent-executable.

## Application <!-- kb:card:593c5b -->
How would you upgrade an existing GitHub issue to be contract-driven?
?
Add three things: (1) an **Invariants to Preserve** section listing what must NOT change, (2) a **Negative Constraints** section listing what this story explicitly does NOT do, and (3) ensure acceptance criteria are binary checkboxes — testable pass/fail, not descriptive goals.
