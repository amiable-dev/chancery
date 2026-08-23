---
title: "Specification-Driven Development"
date: 2026-04-23
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding]
tags: [concept, ai-agents, devops, engineering, specifications, prompts, documentation, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding]
status: draft
sources:
  - url: https://devblogs.microsoft.com/all-things-azure/agentic-devops-practices-principles-strategic-direction/
    hash: sha256:31b745b269ded03375f3cda8695f34924bfaa550de884bd1fd2ba1c79042f1c7
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Specification-Driven Development

## Definition
An engineering practice in which structured, versioned specification files replace ephemeral prompts as the primary input for AI-assisted development. Specifications define what needs to be built, why it matters, the technical constraints, user expectations, and acceptance criteria — and are stored alongside code as durable, reviewable artefacts consumed by both humans and agents throughout a feature's lifecycle.

## Explanation
The early era of AI-assisted development was dominated by *prompt engineering*: developers experimented with phrasing tricks and formatting hacks to coax better outputs. This phase was exploratory but fundamentally fragile — prompts are ephemeral, ad hoc, and disappear when the chat session ends.

Specification-driven development treats agent inputs with the same rigour as code. A well-written specification gives an agent the same information a product manager would give an experienced engineer: business context, technical constraints, user expectations, and definition of done.

**The Specification Maturity Curve:**

| Stage | Practice | Agent Effectiveness |
|-------|----------|---------------------|
| Ad Hoc Prompts | One-off prompts in chat; no standardisation | Inconsistent; depends on individual prompt skill |
| Template Prompts | Reusable prompt templates for common tasks | More consistent for routine work; fragile for complex tasks |
| Structured Specs | Versioned spec files with acceptance criteria and constraints | Substantially improved; agents can validate against clear criteria |
| Living Specs | Specs updated continuously, linked to code and tests, used by pipelines | Highest quality; enables pipeline-as-specification and continuous compliance |

The "Living Specs" endpoint is where specifications become operational pipeline inputs — pipelines verify that implementations match spec acceptance criteria, not just that they compile and pass generic tests.

**Dual benefit:** Well-written specifications serve as documentation, reducing the overhead of maintaining separate design documents. They're not additional work; they replace prompt engineering and design docs simultaneously.

## Key Properties
- Specifications are version-controlled alongside code (not in chat windows or wikis)
- They are consumed by both humans (as documentation) and agents (as task context)
- Acceptance criteria within specs enable agents to self-validate output
- Living specs are continuously updated and linked to tests — enabling pipeline-as-specification
- Quality of agent output correlates directly with specification clarity

## Relationships
- Related to [[prompts-as-infrastructure]]: specification-driven development is the application-layer evolution of treating prompts as infrastructure artefacts
- Enables [[agentic-pipeline-verification]]: living specs feed the semantic verification layer directly
- Required for [[agentic-devops-maturity-model]] Level 3 transition
- Related to [[repository-as-agent-interface]]: specifications are stored in the repository and become operational inputs alongside skill profiles
- Related to [[agentic-sdlc]]: specification-driven development is the requirements/design phase discipline within an ASDLC

## Applications
- **Feature development:** Write a spec file before assigning a task to an agent. Include business context, constraints, and acceptance criteria. Store it in the repository.
- **PR review:** Reviewers validate implementation against the specification, not just general correctness
- **Pipeline automation:** CI/CD checks that implementation matches spec acceptance criteria (semantic verification layer)
- **Documentation reduction:** Specifications replace design docs and user stories — one artefact, multiple consumers
- **Measuring agent quality:** Track "specification revision cycles before agent success" as a proxy for spec clarity

## Study
- Flashcards: [[flashcards/specification-driven-development|Practice this concept]]

## Sources
- [DevOps Playbook for the Agentic Era — Microsoft Azure DevBlogs](https://devblogs.microsoft.com/all-things-azure/agentic-devops-practices-principles-strategic-direction/) — Primary source; Section 5 covers the full specification maturity curve

## See Also
- [[prompts-as-infrastructure]]
- [[agentic-pipeline-verification]]
- [[repository-as-agent-interface]]
- [[agentic-sdlc]]
- [[agentic-devops-maturity-model]]
