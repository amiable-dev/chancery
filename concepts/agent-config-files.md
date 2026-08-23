---
title: "Agent Config Files (AGENTS.md / CLAUDE.md)"
aliases: ["Agent Config Files (AGENTS.md / CLAUDE.md)"]
date: 2026-06-23
domain: ai-agents
maturity: established
source_type: practitioner
topics: [context-engineering, agentic-coding, workflow]
tags: [concept, ai-agents, configuration, workflow, project-setup, skills, domain/ai-agents, maturity/established, source-type/practitioner, topic/context-engineering, topic/agentic-coding, topic/workflow]
status: draft
sources:
  - url: https://newsletter.systemdesign.one/p/agentic-engineering
    hash: sha256:4348e1666b2fd47113aea3b3b5bceb8dfcaf370266ef152e866b36e38742d0d4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://arxiv.org/abs/2602.12670
    hash: sha256:8f3fdf981db51074afc598d8d99f32663f4107866d7fe283819850da8269291a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69
    hash: sha256:f041e2f6202d4dad79856cbe698f460cc51ae46eb6d8b13a8a4353d5a638e51e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.xda-developers.com/claude-md-helping-your-projects-is-myth/
    hash: sha256:1492d6be0eb7ab02389f2822ace120f3fa7e25dfb1041e1e685da3c0b441f1b3
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Config Files (AGENTS.md / CLAUDE.md)

## Definition

A **project-level Markdown file** that the agent loads at the start of every session and keeps in its context window throughout. It encodes project-specific rules, tooling conventions, hard limits, and behavioral constraints — the layer above the harness's own system prompt that tells the agent what *your* project expects, not what agents do in general.

## Explanation

Every agent ships with a harness-level system prompt that covers generic tool use and framework conventions. But that prompt knows nothing about your codebase: which package manager you use, which formatter is canonical, whether tests use pytest or unittest, which files are off-limits.

Without a config file, the agent defaults to whatever appeared most frequently in training data. That means pip when your project uses uv, black when you use ruff, defensive comment-heavy code when you prefer lean implementations.

**The config file is always-on:**  
Unlike [[reusable-agent-skills|skills]] (which are loaded on demand for specific tasks), the config file is present for every agent turn. This is its power — and its cost. Every token in the config file occupies context window space for every iteration, making its quality disproportionately important (see [[context-rot]]).

**What belongs in a config file:**
- Hard limits: "Never commit secrets", "Always run tests before marking a task complete"
- Tooling stack: which package manager, test runner, linter, formatter the project uses
- Project conventions: naming patterns, file structure, comment style
- Behavioral rules: "Read a file before editing it", "Ask before deleting files"
- Emergency stops: patterns of actions that should always trigger human approval

**What does NOT belong:**
- Generic AI-generated boilerplate — studies confirm this produces *worse* outcomes than no file at all
- Documentation about the codebase structure (use a knowledge base or live documentation instead)
- Information that's only relevant for specific tasks (use skills instead)

**Naming conventions:**
The industry has largely, but not universally, converged on:
- `AGENTS.md` — Claude Code, OpenClaw, most frameworks
- `CLAUDE.md` — older Claude Code convention
- `CURSOR.md` — Cursor rules
- `.github/copilot-instructions.md` — GitHub Copilot

The content format and intent is identical regardless of filename.

**Treating config files like code:**
- Keep under 100 lines
- Review changes to it with the same rigour as production code
- Remove any line that isn't consistently improving outcomes
- Treat it like a Makefile: precise, purposeful, minimal

**Config files vs. Skills:**
| | Config File | [[reusable-agent-skills|Skill]] |
|--|-------------|--------|
| When loaded | Always | On demand |
| Content | Project rules, hard limits | Task-specific procedures |
| Size | Under 100 lines | As long as needed |
| Cost | Paid every turn | Paid only when loaded |
| Token pressure | High — always in context | Low — only when relevant |

**The SkillsBench finding:**  
Research showed Claude Haiku with human-curated skills scored 27.7% on the SkillsBench benchmark — beating Claude Opus *without* skills at 22.0%. Config files and skills together represent the highest-leverage configuration investment. Critically, model-generated skills showed zero gains — the quality of the instructions matters more than the quantity.

## Key Properties

- **Always-on** — present in every turn's context window, not loaded on demand
- **Project-scoped** — encodes what makes *this* project different from defaults, not generic agent behaviour
- **Hard-limit vehicle** — the primary mechanism for encoding non-negotiable behavioral constraints
- **Quality-sensitive** — generic boilerplate actively degrades model performance; every line must earn its place
- **Short** — target under 100 lines; each line incurs constant context cost

## Limitations & Counter-Evidence

The case above is the mainstream one. The empirical picture is weaker than the practice's popularity suggests, and the note would be misleading without it.

- **The measured benefit has collapsed as models improved.** Studies circa 2024 reported up to **36%** improvement from repo-level context files. A 2026 ETH Zurich study puts it at roughly **5%** over baseline for human-written files — and *negative* for AI-generated ones. Frontier models now infer from the codebase what the file used to have to tell them.
- **There is a measurable tax.** Context files have been found to increase agent steps and reasoning-token usage by **up to 20%**. On a per-token billing model that can exceed the benefit outright.
- **High-level overviews are the worst offenders** — architecture summaries and "what this project does" prose describe exactly what the model can derive by reading the code. What survives scrutiny is the irreducible, non-inferable material: exact tool/test/lint commands, hard limits, and local gotchas.
- **The durable value may be organisational, not computational.** A plausible reading of the evidence: the file's main benefit was always forcing the *team* to codify its workflow explicitly. The agent-performance gain was a side effect, and it is the side effect that has decayed.
- **This strengthens the retrieval-over-injection argument.** If always-on context yields ~5%, the case shifts toward on-demand loading — [[reusable-agent-skills|skills]], [[model-context-protocol|MCP]]-served context, and retrievable docs — rather than front-loading. See [[progressive-disclosure-agents]].

Caveat on the caveat: [[automatic-prompt-caching|prompt caching]] blunts the *cost* side of this tradeoff considerably, and none of this evidence touches the hard-limit/safety-constraint use case, where the value is deterministic behaviour rather than measured task-score uplift.

## Relationships

- Distinct from [[reusable-agent-skills]]: skills are on-demand; config files are always loaded
- Interacts with [[context-rot]]: config files live in the context window permanently; low-quality files accelerate context rot
- Interacts with [[prompt-caching]]: with caching enabled, the config file's cost drops to near-zero per turn after the first — removing the main argument for keeping config files minimal
- Shapes [[react-agent-pattern]] behaviour: the agent reads the config file before each reasoning step, so its rules are always within the model's attention
- Part of the same layer as [[agent-harness]]: config files extend the harness's system prompt with project context
- Related to [[attention-budget]]: every line in the config file competes for the model's attention budget

## Applications

- **New project setup:** Before writing any code, create `AGENTS.md` with: package manager, test runner, formatter, one-liners on naming conventions, hard limits (never auto-commit, never delete files without confirmation).
- **Preventing regression:** Add a rule to the config file each time an agent makes the same mistake twice — turns one-time corrections into permanent behavioural constraints.
- **OpenClaw setup:** `AGENTS.md`, `SOUL.md`, `USER.md`, and `TOOLS.md` collectively constitute the config layer. `SOUL.md` and `USER.md` are human-readable config that shapes identity and relationship context. `TOOLS.md` encodes environment-specific knowledge.
- **Auditing config bloat:** Periodically review which rules are actually preventing problems vs. which were added defensively. Remove anything that's never been enforced or invoked.

## Study
- Flashcards: [[flashcards/agent-config-files|Practice this concept]]

## Sources

- [Agentic Engineering (System Design Newsletter)](https://newsletter.systemdesign.one/p/agentic-engineering) — "Configuration" section; "Treat it the way you would treat a Makefile: as code, not documentation"
- [SkillsBench benchmark (arXiv:2602.12670)](https://arxiv.org/abs/2602.12670) — empirical evidence that cheap model + curated skills > expensive model without; human-curated skills only
- [30 Core Agentic Engineering Concepts Every Developer Should Know](https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69) — config files as always-on layer; distinction from skills
- [CLAUDE.md helping your projects is a myth](https://www.xda-developers.com/claude-md-helping-your-projects-is-myth/) (2026-03-20) — summarises the ETH Zurich study: ~5% uplift vs. the ~36% claimed in 2024 studies, plus up to 20% extra reasoning tokens. Source of the *Limitations & Counter-Evidence* section.

## See Also

- [[reusable-agent-skills]]
- [[automatic-prompt-caching]] — stable config files are ideal cache targets; caching drops per-turn cost 10×
- [[llm-cache-write-economics]] — economics of caching large config prefixes
- [[prompt-caching]]
- [[context-rot]]
- [[agent-harness]]
- [[attention-budget]]
- [[react-agent-pattern]]
