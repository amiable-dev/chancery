# Agentic-Agile: Why Agent Development Needs Agile (Not Just Prompts)

**Source:** https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> "A bad system will beat a good person every time" ~Dr. William Edwards Deming (with apologies) I started vibe coding by writing prompts (often dictated

---

_“A bad system will beat a good person \[or agent\] every time”_ _~Dr. William Edwards Deming_ _(with apologies)_

I started _vibe coding_ by writing prompts (often dictated into my phone), refining them with an agent in M365 Copilot, and creating handoff files to use with GitHub Copilot CLI. The results were predictably non-deterministic.

Prompt-driven development is a typical starting pattern: a developer opens a chat session, writes a prompt, reviews the output, adjusts, re-prompts. Maybe they get something useful. Maybe they spend an afternoon debugging emergent behavior that nobody specified and nobody tested. Then the process evolves to Spec-Driven Development: the developer creates specifications defining the “why and the “what.” They institute constraints and validation criteria, and the agent delivers more consistent code requiring less debugging.

But how do we scale this to teams of many humans and agents working in parallel? How do we persist development over large projects and codebases that exhaust most of the agent context window during initial grounding? How do we get better over time?

Several of my colleagues and I have started talking about a model we’re calling **Agentic-Agile development** as one methodology to address these problems.

## Agentic-Agile Methodology: Wait! **Hear me out!**

I’m fortunate in my role at Microsoft as a Partner Tech Strategist (PTS) to work in a global team managing joint product and co-innovation with our leading _Data & AI_ and partners. We come with a combination of engineering and product management backgrounds and spend most of our time focused on getting teams working better together across organizations. Adding agents to the development team, while ensuring continuous improvement, is proving a natural extension of our role.

The original [Agile Manifesto](https://agilemanifesto.org/) taught us to value individuals and interactions, working software, customer collaboration, and responding to change. It was so successful that for some it became dysfunctional dogma (see [The Death of Agile: Why Big Tech Is Ditching Scrum and What They Use Instead | by Ibrahim Irfan | Medium](https://medium.com/@ibrahim2128/the-death-of-agile-why-big-tech-is-ditching-scrum-and-what-they-use-instead-2d9bf1f189fc)).

But Agile and Scrum were designed for maintaining team velocity while maintaining alignment in working toward rapidly shifting business goals. Today’s problems are similar but with agents, the time scale and the makeup of the team have changed. Our processes need to be flexible to evolve and maintain that alignment with agents as part of the team. That doesn’t mean we need to abandon processes.

This article is the introduction to a longer series detailing my and some colleagues’ practices that we hope will be helpful to others on the same path. I’ll often reference some of my personal projects, like _Minthe_ which started as an attempt to build a [chief of staff agent](https://platform.claude.com/cookbook/claude-agent-sdk-01-the-chief-of-staff-agent) in [Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python). _Minthe_ has become my larger experiment in Agentic-Agile development and also has helped to bootstrap several other projects.

This isn’t a finished process, and we would really like your feedback and participation to continue to improve the framework.

-   **Read the full version of** [**Toward an Agentic-Agile Manifesto**](https://github.com/microsoft/agentic-agile-template/blob/main/MANIFESTO.md)
-   **Explore the** [**Agentic-Agile Template | GitHub**](https://github.com/microsoft/agentic-agile-template)

[![A screenshot of a waterfall roadmap of features taken from GitHub Projects (dark mode)](https://devblogs.microsoft.com/wp-content/uploads/2026/05/Screenshot-2026-05-14-170647-1024x883.webp)](https://devblogs.microsoft.com/wp-content/uploads/2026/05/Screenshot-2026-05-14-170647.webp)

A roadmap view of _Minthe_ (time not to scale)

## The Problem: Development Without Process

Prompt-driven development works for small, self-contained tasks: Generate a function. Refactor a module. Write a test. These are bounded problems with clear outputs that modern AI coding agents handle well. Spec-Driven Development expands the scope of the tasks that can be delivered but it doesn’t scale over time without careful grooming and maintenance.

The breakdown happens when scope grows. A multi-module system. An integration layer with external dependencies. A feature that spans files, schemas, and behavioral contracts. At that scale, prompt-driven development produces a set of familiar failures:

-   **No backlog:** There is no structured list of what needs to be built, in what order, with what dependencies. Work gets discovered during implementation, not planned before it.
-   **No concept of done:** Each prompt session ends when the developer feels satisfied, not when a contract is fulfilled. “Good enough” replaces “contract satisfied.”
-   **No phased delivery:** Everything is attempted at once. There is no staged rollout, no incremental validation, no ability to pause and redirect.
-   **No governance:** Safety constraints, validation rules, and quality gates are bolted on after the fact, if they are added at all.

The result is predictable. Agents produce code that works in isolation but breaks under integration. Behavior drifts across sessions because there is no shared state defining expected behavior, or because durable memory systems contain stale and conflicting information. Defects escape into production because there was no structured review gate to catch them. The developer compensates by spending more time reviewing and correcting, which erodes the time savings that agents were supposed to provide.

This is not a model problem; it is a process problem. Upgrading the model does not fix missing acceptance criteria. A more capable agent working against an ambiguous spec produces more sophisticated drift, not less.

Agentic-Agile addresses this through codifying processes and standards in documentation for both humans (`README.md` files throughout the repo) and agents (e.g. `.github/copilot-instructions.md`, `CLAUDE.md`, `STYLE.md`).

[![A screenshot of a VSCode window showing two markdown files from the agentic-agile-template repo: copilot-instructions.md and CLAUDE.md](https://devblogs.microsoft.com/wp-content/uploads/2026/05/Screenshot-2026-05-14-184307-1024x484.webp)](https://devblogs.microsoft.com/wp-content/uploads/2026/05/Screenshot-2026-05-14-184307-scaled.webp)

.github/copilot-instructions.md and CLAUDE.md from the agentic-agile-template

For example, the [agentic-agile-template](https://github.com/microsoft/agentic-agile-template) the `.github/copilot-instructions.md` can be used to guide consistent GitHub Copilot behavior for code writing or testing standards:

```
# Copilot Instructions

> This file provides GitHub Copilot with project-specific context. 

## Project Description

<!-- Replace this with a 2-3 sentence description of your project. -->
<!-- Example: "A REST API for task management built with Node.js and Express. Uses PostgreSQL for storage and JWT for authentication." -->

[Describe your project here]

## Coding Style

<!-- Define the conventions Copilot should follow when generating code. -->

- **Language:** [e.g., TypeScript, Python, Go]
- **Formatting:** [e.g., Prettier with default config, Black for Python]
- **Naming:** [e.g., camelCase for variables, PascalCase for classes]
- **Imports:** [e.g., absolute imports only, group by stdlib/third-party/local]
- **Error handling:** [e.g., always use typed errors, never swallow exceptions]

## Testing Approach

<!-- Describe how tests should be written and organized. -->

- **Framework:** [e.g., Jest, pytest, Go testing]
- **Location:** [e.g., `__tests__/` directories alongside source, `tests/` at root]
- **Naming:** [e.g., `test_<function_name>`, `describe/it` blocks]
- **Coverage expectations:** [e.g., all public functions must have tests]
```

**Note:**

Agentic-Agile development is not inherently tied to a particular tool chain or model family. We’re using GitHub repos and issue templates with GitHub Copilot to illustrate the pattern. Similarly, the agent instructions here are written across a combination of instructions for GPT-5.5 (\`.github/copilot-instructions.md\`) and Claude models (\`CLAUDE.md\`) as the most commonly used in GitHub Copilot.

If you are using Anthropic models in GitHub Copilot CLI, `CLAUDE.md` includes persistent instructions to ensure that every development phase includes documentation that must be updated by agents (including itself):

```
## Documentation Maintenance

<!--
  Define which documents exist, and when each should be updated.
  This prevents documentation from drifting out of sync with code.
-->

| Document | Update When |
|----------|-------------|
| `README.md` | Project scope, setup, or usage changes |
| `CLAUDE.md` | Process, conventions, or structure changes |
| `STYLE.md` | Style conventions change |
| `CONTRIBUTING.md` | Contribution process changes |
| API docs | Endpoints added, modified, or removed |
| [Your doc] | [Your trigger] |
```

**Ask your agent to edit:**

You can manually edit the template files or ask your Copilot to customize them with you. Try asking your agent to consolidate the instructions from one to the other, or to update them for your preferred agents and tools.

Remember, just like original Agile, this should be flexible! Human teams choose the branching strategy that makes sense for their project, what frameworks and languages to use, which CI gates provide sufficient safety without blocking work. Agentic-Agile processes can adapt to and incorporate these too, but you MUST keep your agents in the loop. Again from the template’s documentation files:

````
## Development Process

<!--
  Describe how work flows from idea to merged code. Agents use this to
  understand your workflow expectations: how to structure PRs, when to
  run tests, what review looks like.

  The process below is an Agentic-Agile template. Adapt it to your team.
-->

### Workflow

```
Plan → Issue → Implement → Review → Merge → Docs
```

| Phase | Description |
|-------|-------------|
| **Plan** | Define what to build. Identify scope, dependencies, and file ownership. |
| **Issue** | Create a GitHub Issue with structured scope, acceptance criteria, and negative constraints. |
| **Implement** | Build the feature in a feature branch. Follow coding conventions. Write tests. |
| **Review** | Submit a PR. Every PR receives review that checks correctness, test coverage, and convention compliance. |
| **Merge** | Merge to the integration branch after review approval. |
| **Docs** | Update documentation affected by the change. Close the issue. |
````

## Agents as Partners, Not Just Tools

Most teams treat AI agents as tools to be configured: pick a model, write a prompt, tune the parameters, receive product. Agentic-Agile treats agents as contributors to the team. Every action an agent takes is a development action, with the same downstream consequences as a human commit.

[![Wide cinematic scene of a steampunk workshop where a diverse team of engineers and architects stands in a circle around a glowing miniature model of a futuristic green city. The model features vertical gardens, solar towers, wind turbines, canals, and transit systems illuminated with flowing energy lines. Human collaborators in brass-accented, Victorian-style attire work alongside holographic, gear-like AI constructs that appear to adjust the city in real time. The space is filled with mechanical instruments, pipes releasing steam, and floating translucent interfaces showing diagrams and workflows. Warm amber lighting from lamps contrasts with cool green and blue light from the model, with soft haze and volumetric beams creating a dramatic, collaborative atmosphere.](https://devblogs.microsoft.com/wp-content/uploads/2026/05/the-agentic-agile-team-m365designer.webp)](https://devblogs.microsoft.com/wp-content/uploads/2026/05/the-agentic-agile-team-m365designer.webp)

“The Agentic-Agile Team” ~M365 Copilot Designer 2026

Agents create files, introduce dependencies, write tests. They can also enrich human prompts and specs and create issues in backlog. As you become more comfortable, give the agents the autonomy to research, make architectural decisions, and document these in ADR docs and updates to issues. However, if agents are doing development work, you need to agree with them on development process.

The same engineering discipline that prevents human teams from shipping broken software applies to human-agent teams: structured planning, clear acceptance criteria, incremental delivery, and review gates. A team that would never ship a human-authored module without code review should not ship agent-authored modules without equivalent scrutiny.

```
---
name: Agentic Story
about: A structured story for human-agent development
title: ''
labels: ''
assignees: ''
---

## Summary

<!-- What does this story deliver? One sentence describing the outcome. -->

## Context / Motivation

<!-- Why is this work needed? What problem does it solve or what capability does it enable? -->

## Scope

### Files to Create or Modify

<!-- Explicit list of files this story will touch. This prevents overlap with parallel stories. -->

- `path/to/file1.ext` — description of changes
- `path/to/file2.ext` — description of changes

### Interfaces to Implement

<!-- APIs, contracts, or integration points this story must satisfy. -->

- 

### Invariants to Preserve
ds
<!-- Existing behavior, contracts, or constraints that must NOT be broken. -->

- 

## Acceptance Criteria

<!-- Specific, testable conditions that must be true when this story is complete. -->

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Negative Constraints

<!-- What this story explicitly does NOT do. Prevents scope creep and clarifies boundaries. -->

- Does NOT modify ...
- Does NOT implement ...
- Does NOT change the behavior of ...

## Dependencies

<!-- Other issues or stories that must be completed before this one can start. -->

- Depends on #
- Blocked by #

## File Ownership

<!-- Explicit list of files this story owns exclusively during its wave. No other story in the same wave should touch these files. -->

| File | Owner (this story) | Notes |
|------|-------------------|-------|
| `path/to/file.ext` | ✅ | |
```

The underlying idea is not new. It is the foundational insight of Agile, applied to a new collaboration model. What Agile recognized for human teams, Agentic-Agile Development recognizes for human-agent partnerships: iteration, contracts, and reflection prevent the same class of failures.

## The Agentic-Agile Team: Process Rigor for Human-Agent Partnership

Agentic-Agile Development is the application of Agile engineering practices to human-agent development. Not a new framework, but a recognition that existing Agile practices, adapted for agent collaboration, solve the coordination and governance problems that prompt-driven development creates.

Core principles:

-   **Specs in Backlog first:** Every capability is an issue. Every issue has acceptance criteria. Ambiguous requirements become structured contracts before any agent executes. Grooming is not administrative overhead; it is the primary design mechanism.
-   **Contract-driven execution**: Agents operate against specifications, not open-ended prompts. Each story defines inputs, outputs, and invariants. The exit condition is not “good enough” but “contract satisfied.”
-   **Incremental delivery**: Work is organized into priority groups with clear exit criteria between them. Each increment produces a testable, reviewable result before the next begins.
-   **Governance from day one**: Safety constraints, validation rules, and review gates are part of the process design, not afterthoughts.

In practice, this looks like a system where different types of workflows, each with distinct behavioral requirements, are decomposed into independent stories with clear contracts. Each workflow type gets its own specification, its own acceptance criteria, and its own validation path.

**Use /plan to discuss strategy**

Ask your agent for recommendations on sequencing of issues in backlog, how granularly to break up work in an epic, or what is missing from a spec.

The shift is fundamental. Instead of “let the agent figure it out,” the discipline becomes: define the contract, constrain the execution, validate the output.

## Evidence: In Practice

With _Minthe_ I authored specifications docs from prompts before any implementation code was written. After the first few iterations, we realized that design docs were being updated by agents and drifting from the original specs, but changing original spec docs led to more potential for drift. This introduced confusion for agents reading conflicting info, particularly in swarms.

The partnership evolved through recognizable stages: first, we designed and handed off. Then we alternated layers. Eventually, we ran multiple agents in parallel with review gates between waves.

After interrupting a few refactoring loops, we moved to using the GitHub repo issues to document new specs and features. Every capability became an issue with acceptance criteria. GitHub Copilot CLI (mostly with Claude models) easily adapted to reading and executing from issues as locked specifications during delivery. Mandating that all issue work be done in separate branches reduced collisions in parallelization. The closed issues and PR comments became historical reference points for subsequent iterations to refer to what had been done and what the intent was there, while capturing expanded requirements and specs in new issues. Parent-child, blocker relationships between issues further enhanced traceability.

[![Screenshot of Minthe epic backlog on GitHub Mobile](https://devblogs.microsoft.com/wp-content/uploads/2026/05/Minthe-epic-backlog-for-blog-1024x472.webp)](https://devblogs.microsoft.com/wp-content/uploads/2026/05/Minthe-epic-backlog-for-blog-scaled.webp)

Minthe epic backlog on GitHub Mobile

What matters is how it changes the relationship between the human and the agent. This is a partnership, not a hierarchy. The human’s role is architecture and specification: a Scrum Coach who facilitates the collaboration rather than directing every action. The agent contributes implementation within constraints. Review is shared responsibility.

Shortly after this, we introduced a _retrospective_ process where I asked an agent to review session files, git commit logs, PRs and other data to find where we could improve.

The methodology has since been applied to several, unrelated projects in different domain from the original chief of staff agent. The patterns (spec-first backlog, phased planning, agent context files) transferred without explicit reference to the original project. The methodology appears to be genuinely portable rather than project-specific. That portability is the real test: a methodology that only works on the project where it was invented is not a methodology.

## Why Governance Cannot Be Deferred

A common objection: “We will add guardrails later, once we know what we are building.” In agentic development, this is backwards. Agents make decisions at execution speed. Without upfront constraints, they will make reasonable-looking choices that violate architectural invariants, introduce security gaps, or create dependencies that are expensive to unwind.

We learned this the hard way. Our CI pipeline was not Story 1. Quality issues accumulated across waves before any automated gate existed. By the time we added the pipeline, we had already built on assumptions that had never been validated. This required reopening and redeveloping the features. Along with CI gates, adding adversarial code reviews during each delivery wave and unit tests as part of acceptance criteria in each issue made a huge difference in work-product delivered.

Governance in Agentic-Agile Development is not a phase. It is a property of the backlog itself. Safety constraints are acceptance criteria on stories. Review gates sit between execution waves, not at the end of the project. Validation infrastructure, including CI/CD, linting, and automated tests, is the first story implemented, not the last.

The measurement is straightforward: if you are catching architectural violations during final review rather than during story execution, your governance is too late. Move it earlier.

We’re planning a deeper dive on this for the next installment in the series.

## The Short Version

-   Do not start with prompts; start with specs written as issues in your backlog.
    
    **Issues first!**
    
    No work should be committed without an associated issue! Remind agents to create new or update issues if unplanned work emerges.
    
-   Give humans and agents consistent and persistent instructions as documentation (markdown) in the repo and keep it up-to-date.
-   Make acceptance criteria the contract.
-   Deliver in increments or waves. Try asking your agent to sequence and group work.
-   Put governance in the backlog from day one.
-   Use PRs, CI, and retrospectives to improve the process.

My apologies for deliberately misquoting Dr. Deming at the beginning: of course he meant that individual contributors cannot overcome a rigid, poorly implemented system imposed on them. But by the same _token_ (apologies also for the pun), teams of humans and agents cannot meet their goals without clear guidance and a framework to build within.

We’re early in our exploration of Agentic-Agile methodology but already find that incorporating spec-first development into Agile practices improves our outcomes. Stay tuned to this series and the [agentic-agile-template](https://github.com/microsoft/agentic-agile-template) for deeper dive topics like epic decomposition for swarming, conducting retrospectives with agents, and evaluation frameworks.

## Getting Started

1.  Copy the [microsoft/agentic-agile-template](https://github.com/microsoft/agentic-agile-template) repo on GitHub.
2.  Clone your repo locally, switch to `/plan` mode, and ask GitHub Copilot to:
    1.  read the contents of the repo for grounding and
    2.  ask you clarifying questions to customize the template for your project.
3.  If you don’t already have a backlog, create high-level issues for the major capabilities your product needs to deliver. **Remember to create an issue describing what CI/CD tooling and gates are appropriate for your project (or ask Copilot for a suggestion)**
4.  Go back into `/plan` mode and ask the agent to work with to review the backlog and decide on which items to tackle first.
5.  Pick that issue and ask Copilot to improve the description to conform to the ‘agentic-agile-template’.
6.  When you feel comfortable with the issue description, ask Copilot to implement it and see what happens.
7.  Keep working the process: every ambiguous capability becomes an issue. Every issue gets acceptance criteria. Every acceptance criterion becomes a contract that guides agent execution.

Comment here and let us know how it went.

## Resources

-   [The Agentic-Agile Manifesto](https://github.com/microsoft/agentic-agile-template/blob/main/MANIFESTO.md): Full manifesto with all thirteen principles
-   [Agentic-Agile Template | GitHub](https://github.com/microsoft/agentic-agile-template): Issue templates, agent context files, and starter backlog structure
-   The original [Agile Manifesto](https://agilemanifesto.org/)
-   [Andrej Karpathy: Software is changing (Again) | Y Combinator YouTube](https://www.youtube.com/watch?v=LCEmiRjPEtQ)

## Author

![Daniel Epstein](https://devblogs.microsoft.com/wp-content/uploads/2026/05/daniel-epstein-96x96.webp)

I lead strategic technology initiatives that connect product innovation with measurable business outcomes. Through over 20 years in technology and media, I’ve driven programs that align engineering, product, and business teams to deliver solutions at scale.
