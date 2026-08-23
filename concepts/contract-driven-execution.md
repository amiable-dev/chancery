---
title: "Contract-Driven Execution"
date: 2026-05-21
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding]
tags: [concept, ai-agents, engineering, workflow, process, specifications, contracts, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding]
status: draft
sources:
  - url: https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts
    hash: sha256:48cbeb1d2cba082fd5540d215f39ae992c00da84156ad65c22a798933b87a9e0
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Contract-Driven Execution

## Definition

A principle in which AI agents operate against formally specified stories or tasks that define inputs, outputs, invariants, and explicit exit conditions — rather than open-ended prompts or informal specifications. The exit condition for a story is "contract satisfied," not "good enough." A core principle of [[agentic-agile|Agentic-Agile]] development.

## Explanation

Contract-Driven Execution shifts the agent's frame from "produce something reasonable" to "satisfy a defined contract." The difference is subtle but consequential:

**Prompt/spec framing:** "Build a REST API for user management with auth."

**Contract framing:** "Implement `POST /users` and `POST /auth/token` per the OpenAPI spec in `docs/api.yaml`. Must preserve existing `User` model shape. Must not modify `auth/middleware.py`. Exit when: both endpoints return correct responses for the test cases in `tests/test_users.py` and `tests/test_auth.py`. Failing tests is not acceptable delivery."

The contract version has:
- **Explicit inputs:** the OpenAPI spec, existing model shape
- **Explicit outputs:** two endpoints passing named tests
- **Invariants to preserve:** existing User model, auth middleware untouched
- **Negative constraints:** files that must NOT be modified (see [[negative-constraints-pattern]])
- **Deterministic exit condition:** all named tests pass — binary, not judgement-based

**Why this matters for agents specifically:**
Human developers can infer intent, ask questions, and exercise professional judgement about "good enough." Agents are better served by unambiguous contracts — they will fill in ambiguity with plausible-looking decisions that may violate unstated assumptions. The contract makes those assumptions explicit.

**The "more sophisticated drift" problem:**
A more capable model working against an ambiguous spec produces *more sophisticated drift* — code that looks good, compiles, passes basic review, but violates unstated invariants in ways that are harder to catch than obvious failures. Contract-driven execution is the mitigation: invariants are stated, not assumed.

**Relationship to acceptance criteria:**
Contract-driven execution is the per-story operationalisation of acceptance criteria. Every story in the Agentic-Agile backlog should read like a contract:

| Contract Element | Story Section |
|-----------------|---------------|
| Inputs | Scope → Files to create/modify; Dependencies |
| Outputs | Acceptance Criteria (testable conditions) |
| Invariants | Interfaces to implement + Invariants to preserve |
| Negative constraints | Negative Constraints ("Does NOT modify...") |
| Exit condition | All acceptance criteria checkboxes satisfied |

**What "contract satisfied" means in practice:**
The agent's job is done when all acceptance criteria pass — not when it has a running demo, not when the code looks sensible. This enables autonomous execution (the agent knows when to stop) and structured review (the reviewer knows exactly what to verify).

## Key Properties

- Exit condition is binary and objective: "contract satisfied" vs. "contract not satisfied"
- Invariants are explicit — what must NOT change is as important as what must be built
- Enables autonomous agent execution without constant human steering
- Prevents scope creep by defining the boundary of the work formally
- Supports parallel execution: non-overlapping contracts can run in parallel safely

## Relationships

- Core principle of [[agentic-agile|Agentic-Agile]]: contract-driven execution is how Agentic-Agile backlog items are specified and closed
- Formalisation of [[spec-driven-development|Spec-Driven Development]]: adds invariants, negative constraints, and binary exit conditions to informal specs
- Implemented by [[agentic-story-template|Agentic Story Template]]: the template encodes contract elements as structured sections
- Supports [[negative-constraints-pattern|Negative Constraints Pattern]]: negative constraints are a required element of every contract
- Related to [[constrained-agent-actions|Constrained Agent Actions]]: contract-driven execution operationalises constraints at the task level
- Related to [[behavioral-qa-agents|Behavioral QA for Agents]]: acceptance criteria in contracts define the behavioral tests that QA must verify

## Applications

**Implementing contract-driven execution in practice:**
1. Write the story scope before any implementation begins (backlog grooming is design work)
2. Define acceptance criteria as checkboxes — binary pass/fail per item
3. List invariants explicitly: "Must preserve existing X schema", "Must not break Y"
4. Add a Negative Constraints section: everything the story explicitly does NOT do
5. List file ownership — what this story owns exclusively during its wave

**Our conductor workflow:**
Our GitHub Issues already contain acceptance criteria and sometimes negative constraints. The gap is invariant specification — we don't always list what existing behaviour must be preserved. Adding an "Invariants to Preserve" section to our issue templates would tighten contract coverage.

**Detecting contract violations:**
If review catches architectural violations that weren't in the acceptance criteria, the contract was underspecified — move the invariant check earlier into the story definition, not the review gate.

## Sources

- [Agentic-Agile: Why Agent Development Needs Agile (Not Just Prompts)](https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts) — Microsoft; "The exit condition is not 'good enough' but 'contract satisfied'"

## See Also

- [[agentic-agile]]
- [[agentic-story-template]]
- [[negative-constraints-pattern]]
- [[spec-driven-development]]
- [[constrained-agent-actions]]
- [[behavioral-qa-agents]]
