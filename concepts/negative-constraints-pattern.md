---
title: "Negative Constraints Pattern"
date: 2026-05-21
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding, patterns]
tags: [concept, ai-agents, engineering, workflow, process, patterns, specifications, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding, topic/patterns]
status: draft
sources:
  - url: https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts
    hash: sha256:48cbeb1d2cba082fd5540d215f39ae992c00da84156ad65c22a798933b87a9e0
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Negative Constraints Pattern

## Definition

A specification pattern in which a task or story explicitly lists what it does NOT do, does NOT modify, and does NOT implement — using negation to define scope boundaries as precisely as positive acceptance criteria define outcomes. Used in [[agentic-story-template|Agentic Story Templates]] to prevent AI agent scope creep and to communicate intent unambiguously to both agents and human reviewers.

## Explanation

Positive acceptance criteria define success. Negative constraints define the boundary. Both are required for unambiguous, reviewable agent execution.

**The problem negative constraints solve:**

When an AI agent is handed a task, it applies its own reasoning to fill in gaps. A capable agent will make reasonable-looking decisions about what "should" be changed. Without explicit scope exclusions, it might:

- Refactor adjacent code that "clearly should be improved" while fixing the target bug
- Add a helper function to a shared module when it could have been scoped to the feature module
- Update a configuration file to enable a new flag while implementing the feature
- Clean up imports, rename variables, or apply style conventions across the file while it's in there

Each individual decision is defensible. Collectively, they create a patch that's harder to review, harder to revert if there's a regression, and harder to merge if a parallel agent touched the same code.

**The pattern:**

```markdown
## Negative Constraints

- Does NOT modify `auth/middleware.py`
- Does NOT change the `User` model schema
- Does NOT implement pagination (deferred to story #47)
- Does NOT change error response format for existing endpoints
```

**Negative constraints serve two audiences:**

1. **The agent:** Explicit exclusions override the agent's "helpful" instinct to improve adjacent code. If the agent can see "Does NOT modify X," it won't touch X even if it looks improvable.

2. **The reviewer:** A human reviewing the PR can check: "Did anything happen that shouldn't have?" — making scope violations immediately visible rather than requiring full diff analysis.

**Relationship to Invariants to Preserve:**
These two are related but distinct:
- *Invariants to preserve* define existing behaviour that must remain unchanged — "the `GET /users` response format must remain unchanged"
- *Negative constraints* define files, modules, or capabilities that are explicitly out of scope — "this story does NOT touch `GET /users` at all"

Both belong in an [[agentic-story-template|Agentic Story]], serving complementary roles.

**Documentation maintenance tables as negative constraints:**
The same pattern can be applied to documentation — a `CLAUDE.md` can include a maintenance table that defines exactly which docs update when specific changes occur. By implication, docs not in the table are not the agent's responsibility during this change — a form of standing negative constraint.

## Key Properties

- Negative constraints are as important as positive acceptance criteria for agent task definition
- They prevent scope creep through explicit exclusion, not inference
- They make PR review more efficient — reviewers have a specific checklist of "things that should NOT have changed"
- They are cheap to write during planning and expensive to reconstruct during review
- Can be expressed at multiple levels: file-level, module-level, behaviour-level, capability-level

## Relationships

- Required element of [[agentic-story-template|Agentic Story Template]]: every story should have a Negative Constraints section
- Supports [[contract-driven-execution|Contract-Driven Execution]]: negative constraints are part of the contract (what is explicitly out of scope)
- Addresses failure mode of [[spec-driven-development|Spec-Driven Development]]: implicit scope assumptions cause drift; negative constraints make scope explicit
- Core to [[agentic-agile|Agentic-Agile]] practice: governance at the backlog level includes constraining scope, not just defining it
- Related to [[constrained-agent-actions|Constrained Agent Actions]]: negative constraints are the task-level expression of constrained actions; constrained agent actions is the system-level pattern

## Applications

**Adding negative constraints to existing workflows:**
Any issue template used by agents should include a Negative Constraints section — even if it's often empty. An explicitly empty section is better than an absent one: it signals that the agent has considered exclusions, not forgotten them.

**Common negative constraints categories:**
- *File exclusions:* "Does NOT modify `<filename>`"
- *Schema preservation:* "Does NOT change the shape of `<model/interface>`"
- *Deferred scope:* "Does NOT implement `<feature>` (see #<issue>)"
- *Behaviour preservation:* "Does NOT change error handling for `<existing path>`"
- *Cascading changes:* "Does NOT update callers of the refactored function" (constrains the blast radius)

**Our practice gap:**
Our issue templates don't currently have a Negative Constraints section. Adding one would immediately improve PR review quality and reduce the risk of unintended side effects in multi-agent conductor runs.

## Sources

- [Agentic-Agile: Why Agent Development Needs Agile (Not Just Prompts)](https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts) — Microsoft; Negative Constraints are a required section of the Agentic Story template

## See Also

- [[agentic-story-template]]
- [[contract-driven-execution]]
- [[agentic-agile]]
- [[constrained-agent-actions]]
