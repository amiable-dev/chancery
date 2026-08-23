---
title: "Agentic-Agile"
date: 2026-05-21
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [workflow, agentic-coding]
tags: [concept, ai-agents, agile, engineering, workflow, process, methodology, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/workflow, topic/agentic-coding]
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
  - url: https://github.com/microsoft/agentic-agile-template/blob/main/MANIFESTO.md
    hash: sha256:4aa58f0afe0a94dec1ce4010c2feffdcdfc1c30266f9e681c1d53286924021b2
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agentic-Agile

## Definition

A software development methodology that applies Agile engineering practices — structured backlog, acceptance criteria, incremental delivery, and explicit governance — to human-agent development teams. Agentic-Agile treats agents as team contributors subject to the same process discipline as human developers, rather than as tools to be configured and prompted ad hoc.

## Explanation

Agentic-Agile emerged from a recognition that the failures of [[spec-driven-development|Spec-Driven Development]] at scale are *process failures*, not model failures. Upgrading the underlying AI model does not fix missing acceptance criteria or absent governance. A more capable agent working against an ambiguous spec produces "more sophisticated drift, not less" — better-looking broken code that is harder to catch.

The methodology sits at the top of a three-level maturity ladder:

| Level | Approach | Fails Because |
|-------|----------|--------------|
| 1 | **Prompt-Driven** | No backlog, no concept of done, no governance. Works for isolated tasks, breaks at scale. |
| 2 | **Spec-Driven** | Specs defined upfront, but no backlog lifecycle, no incremental delivery, no change governance. Specs drift as agents modify them. |
| 3 | **Agentic-Agile** | Full Agile discipline applied to human+agent teams. Addresses coordination, governance, and parallelism. |

**Core principles:**

1. **Specs in backlog first** — Every capability is a structured issue. Backlog grooming is the primary design mechanism; ambiguous requirements are resolved into contracts *before* any agent executes.

2. **Contract-driven execution** — Agents operate against [[contract-driven-execution|specifications as contracts]], not open-ended prompts. Each story defines inputs, outputs, and invariants. Exit condition is "contract satisfied," not "good enough."

3. **Incremental delivery** — Work organised into priority waves with clear exit criteria between them. Each increment produces a testable, reviewable result before the next begins.

4. **Governance from day one** — Safety constraints, validation rules, and CI/CD review gates are properties of the backlog itself — acceptance criteria on stories, not afterthoughts added post-delivery.

**Process codified in docs:** Standards live in machine-readable files (`CLAUDE.md`, `.github/copilot-instructions.md`, `STYLE.md`) readable by both humans and agents. Documentation maintenance tables define *when* each doc must be updated, preventing documentation drift between sessions.

**The human role shifts:** From directing every action to acting as architecture-and-specification author — a Scrum Coach who facilitates the collaboration rather than managing individual implementation steps. The agent contributes implementation within constraints; review is shared responsibility.

**Governance cannot be deferred.** Agents make decisions at execution speed. Without upfront constraints, they make reasonable-looking choices that violate architectural invariants or introduce security gaps. CI/CD pipelines, linting, and automated tests should be the *first* stories implemented, not the last.

Microsoft's reference implementation: [agentic-agile-template](https://github.com/microsoft/agentic-agile-template) — a GitHub template repo with issue templates, instruction files, and manifesto.

## Key Properties

- Process is the fix, not the model — swapping models without fixing process produces better-looking failures
- Agents are contributors, not tools — same review gates and acceptance criteria as human commits
- Documentation is dual-audience — every process file serves both human and agent readers simultaneously
- Governance is a backlog property — safety constraints are acceptance criteria on stories, not a final phase
- Retrospectives apply — agents can review git logs, PR comments, and session data to identify process improvements

## Relationships

- Extends [[agentic-sdlc|Agentic SDLC (ASDLC)]]: Agentic-Agile is the process methodology within the broader ASDLC lifecycle; ASDLC defines lifecycle phases, Agentic-Agile defines *how* work flows through them
- Builds on [[spec-driven-development|Spec-Driven Development]]: the intermediate maturity stage that Agentic-Agile supersedes at scale
- Operationalised through [[contract-driven-execution|Contract-Driven Execution]]: the principle governing how agents receive and exit work
- Uses [[agentic-story-template|Agentic Story Template]]: the structured issue format that encodes contracts and governance
- Related to [[human-agent-collaboration-zones|Human-Agent Collaboration Zones]]: collaboration zones define where Agentic-Agile governance applies (IDE, PR, CI/CD, Production)
- Related to [[agentic-devops-maturity-model|Agentic DevOps Maturity Model]]: Agentic-Agile is effectively a maturity-level-3 process discipline for agent-involved codebases

## Applications

**When Agentic-Agile is appropriate:**
- Multi-module systems where agents work across files and integration boundaries
- Parallel agent execution (multiple agents working on the same codebase simultaneously)
- Long-running projects that outlast individual agent context windows
- Teams wanting reproducible, auditable agent contributions

**Our current practice (from staging note):**
A conductor workflow (GitHub Issues → agent picks up → implements → PR → council review → merge) is essentially Agentic-Agile without the formal label: a kanban backlog, structured issue templates, a multi-model review gate. Gaps to consider:
- **File ownership per wave** — not currently enforced; worth adding for parallel agent runs
- **Negative constraints** — "Does NOT modify..." in issue templates to prevent scope creep
- **Documentation maintenance tables** — explicit "update this doc when X changes" rules

## Sources

- [Agentic-Agile: Why Agent Development Needs Agile (Not Just Prompts)](https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts) — Microsoft Partner Tech Strategist team; primary source for the methodology
- [Agentic-Agile Template on GitHub](https://github.com/microsoft/agentic-agile-template) — Reference implementation with issue templates, instruction files, and manifesto
- [Toward an Agentic-Agile Manifesto](https://github.com/microsoft/agentic-agile-template/blob/main/MANIFESTO.md) — Full manifesto document

## See Also

- [[agentic-sdlc]]
- [[spec-driven-development]]
- [[contract-driven-execution]]
- [[agentic-story-template]]
- [[negative-constraints-pattern]]
- [[human-agent-collaboration-zones]]
- [[agentic-devops-maturity-model]]
