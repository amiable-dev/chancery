---
title: "Agentic Story Template"
date: 2026-05-21
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding]
tags: [concept, ai-agents, engineering, workflow, process, templates, specifications, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding]
status: draft
sources:
  - url: https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts
    hash: sha256:48cbeb1d2cba082fd5540d215f39ae992c00da84156ad65c22a798933b87a9e0
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/microsoft/agentic-agile-template
    hash: sha256:64857da5c308c877599a647aa9e657a9765030ef7df2e7a8f04cd62680e3c1db
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agentic Story Template

## Definition

A structured GitHub Issue template designed for human-agent development teams that encodes the full [[contract-driven-execution|contract]] for a unit of work. It includes explicit scope (files to touch), interfaces to implement, invariants to preserve, acceptance criteria, negative constraints (what the story does NOT do), dependencies, and per-wave file ownership — giving agents an unambiguous specification to execute against.

## Explanation

Traditional issue templates serve human readers who can fill in implicit context. The Agentic Story Template is written for a dual audience: human developers AND AI agents. Every field exists to resolve an ambiguity that would otherwise cause agent drift.

**Structure of an Agentic Story:**

```markdown
## Summary
One sentence describing the outcome. (What does this story deliver?)

## Context / Motivation
Why is this work needed? What problem does it solve?

## Scope
### Files to Create or Modify
- `path/to/file.ext` — description of changes
(Explicit list prevents overlap with parallel stories)

### Interfaces to Implement
- APIs, contracts, or integration points this story must satisfy

### Invariants to Preserve
- Existing behaviour, contracts, or constraints that must NOT be broken

## Acceptance Criteria
- [ ] Specific, testable condition 1
- [ ] Specific, testable condition 2

## Negative Constraints
- Does NOT modify ...
- Does NOT implement ...
- Does NOT change the behavior of ...

## Dependencies
- Depends on #<issue-number>
- Blocked by #<issue-number>

## File Ownership
| File | Owner (this story) | Notes |
|------|-------------------|-------|
| `path/to/file.ext` | ✅ | |
```

**Why each section matters:**

- **Files to Create or Modify:** Makes scope explicit so parallel agents don't touch the same file (the file ownership problem in multi-agent parallelism)
- **Interfaces to Implement:** Defines the API surface the story must produce — gives the agent a structural target, not just a behavioural description
- **Invariants to Preserve:** The "must NOT break" list — states what the agent cannot touch even when it would seem like a reasonable optimisation
- **Acceptance Criteria:** Binary, testable conditions that define "contract satisfied" — the agent knows when to stop
- **Negative Constraints:** See [[negative-constraints-pattern]] — explicit exclusions that prevent scope creep and clarify boundaries to human reviewers
- **File Ownership:** Defines which story owns which file exclusively during its wave — prevents write conflicts in parallel execution

**Agents executing against issues:**
In practice, agents like GitHub Copilot CLI or Claude can be pointed at a specific issue and instructed to implement it. The closed issues and PR comments become a historical record for subsequent iterations — "what was done and why" — while new requirements go into new issues rather than modifying locked specs.

**Using issues as locked specifications:**
Once an issue enters execution, it functions as a read-only spec. Agents that would otherwise modify the spec document (causing drift) are instead constrained to work against the issue and close it — new requirements go into new issues.

## Key Properties

- Dual-audience: readable by humans and directly executable by agents
- Every field resolves a specific category of agent ambiguity or coordination failure
- Issues as locked specs prevent the spec-drift problem of [[spec-driven-development|Spec-Driven Development]]
- Closed issues + PR comments form a persistent audit trail and context window for future agents
- Scalable to parallel execution via explicit file ownership per wave

## Relationships

- Operationalises [[contract-driven-execution|Contract-Driven Execution]]: the template is the artifact that encodes a contract
- Core artifact of [[agentic-agile|Agentic-Agile]]: every backlog item in Agentic-Agile should use this template format
- Prevents problems from [[spec-driven-development|Spec-Driven Development]]: spec drift is prevented by treating issues as locked specs
- Uses [[negative-constraints-pattern|Negative Constraints Pattern]]: the Negative Constraints section is a required template element
- Related to [[human-agent-collaboration-zones|Human-Agent Collaboration Zones]]: the template governs the PR zone — agents submit PRs that human reviewers validate against the template's acceptance criteria

## Applications

**Adopting this template in our conductor workflow:**
Our current GitHub issues already have acceptance criteria but are missing:
1. **Invariants to Preserve** section — what existing behaviour must not break
2. **Negative Constraints** section — explicit scope exclusions
3. **File Ownership** table — critical if/when we run multiple conductor agents in parallel

Kanban cards could be augmented with equivalent fields, or GitHub Issues can remain the execution layer with a board serving as the higher-level project view.

**When to use an Agentic Story vs. a regular issue:**
Any work that an agent will implement autonomously in its own branch warrants an Agentic Story. Regular issues (bug reports, questions, discussions) don't need the full template.

## Sources

- [Agentic-Agile: Why Agent Development Needs Agile (Not Just Prompts)](https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts) — Microsoft; the Agentic Story template is included verbatim in the article
- [Agentic-Agile Template on GitHub](https://github.com/microsoft/agentic-agile-template) — Reference implementation including the issue template

## See Also

- [[agentic-agile]]
- [[contract-driven-execution]]
- [[negative-constraints-pattern]]
- [[spec-driven-development]]
- [[human-agent-collaboration-zones]]
