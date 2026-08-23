---
title: "Reusable Agent Skills (On-Demand Workflows)"
aliases: ["Reusable Agent Skills (On-Demand Workflows)"]
date: 2026-06-23
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [workflow, patterns, context-engineering]
tags: [concept, ai-agents, configuration, workflow, skills, reuse, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/workflow, topic/patterns, topic/context-engineering]
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
---

# Reusable Agent Skills (On-Demand Workflows)

## Definition

**Reusable agent skills** (also called rules, workflow files, or SKILL.md files) are Markdown documents with YAML frontmatter that the agent loads **on demand** when a specific task type is triggered. Unlike [[agent-config-files|config files]] (always in context), skills are fetched only when the agent determines they're relevant — keeping the baseline context lean while giving the agent access to rich task-specific procedures.

## Explanation

As agents tackle complex, recurring tasks — test-driven development, debugging sessions, code reviews, release management — they benefit from detailed, task-specific procedures rather than making those up on the fly. But embedding all these procedures in the always-on config file would inflate the context window permanently, accelerating [[context-rot]].

Skills solve this with lazy loading: the agent identifies that a specific task is needed, loads the relevant skill document, and follows the procedure within it. When the task is done, the skill can be unloaded (or simply falls out of attention as newer content arrives).

**The YAML frontmatter contract:**
Skills are identified and triggered by metadata in their frontmatter:
- `name` — the skill's canonical identifier
- `description` — used by the agent (or human) to determine relevance
- `globs` (optional) — file patterns that auto-trigger the skill (e.g., `*.test.ts` triggers a testing skill)
- `trigger` — keywords or conditions for loading the skill

**Skills vs. config files:**
| | Skills | Config files |
|--|--------|-------------|
| When loaded | On demand | Every turn |
| Content | Task procedures, step-by-step workflows | Project rules, hard limits |
| Size | As long as needed | Under 100 lines |
| Context cost | Only when relevant | Every iteration |
| Example | "How to run a TDD cycle" | "Always use pytest" |

**The SkillsBench finding:**  
Research across 86 tasks in 11 domains showed Claude Haiku with human-curated skills (27.7%) beat Claude Opus without skills (22.0%). Two critical lessons:
1. **Model-generated skills showed zero benefit** — the quality of human-curated instructions matters more than generating skills automatically
2. **A cheap model with good skills outperforms an expensive model without them** — skills are higher-leverage than model upgrades

**Skills in practice:**
- **Claude Code:** `.claude/skills/*.md` with YAML frontmatter; auto-loaded by `globs` or manually invoked
- **OpenClaw:** `skills/<name>/SKILL.md` with description and trigger; loaded when the available skills list matches the task
- **Cursor rules:** Similar on-demand rule loading per file type
- **Compound Engineering:** Skills plus a "Compound" phase where the agent writes new skills based on patterns learned in the current session (though the SkillsBench finding suggests human curation outperforms auto-generated skills)

**What makes a good skill:**
- Concrete, step-by-step procedures — not principles, but actions
- Includes anti-patterns and what-not-to-do, not just what to do
- Short enough to load without dominating context
- Human-written and reviewed, not auto-generated from an earlier agent run
- Covers one distinct task type (split if multiple tasks are covered)

## Key Properties

- **Lazy-loaded** — only in context when the agent needs them; not burned on every turn
- **Task-scoped** — covers one specific procedure or task type, not general project rules
- **Human-curated** — effectiveness depends on quality of human-written instructions; model-generated skills show no empirical benefit
- **Composable** — multiple skills can be loaded simultaneously for complex tasks that span multiple procedures
- **Metadata-driven** — YAML frontmatter describes when to load and what the skill covers

## Relationships

- Distinct from [[agent-config-files]]: config files are always-on rules; skills are on-demand procedures
- Reduces [[context-rot]]: by loading procedures only when needed, skills keep the baseline context lean
- Benefits from [[prompt-caching]]: frequently-used skills that remain loaded across a session can be cached to reduce per-turn cost
- Validated by SkillsBench (arXiv:2602.12670): empirical evidence that skill quality matters more than model size
- Related to [[attention-budget]]: skills only consume attention budget during the turns when they're loaded
- Related to [[agent-session-distillation]]: distillation can extract reusable procedures from session history into new skill files (with human curation step)
- Formalized by [[agent-skills-open-standard]]: as of July 2026 this practice has a ratified cross-vendor spec (agentskills.io) with an exact frontmatter schema, naming rules, and a reference validator — adopted unmodified by Claude Code, Codex, Cursor, Gemini CLI, and others

## Applications

- **TDD workflow skill:** A skill that enforces Red-Green-Refactor discipline — agent loads it when working on a test file, follows the procedure, unloads when done.
- **Code review skill:** Loaded when reviewing a PR; provides a checklist of security, performance, and quality dimensions to check.
- **Debugging skill:** Loaded when a test fails; provides a systematic procedure for isolating, understanding, and fixing the failure.
- **Release management skill:** Loaded when tagging a release; covers changelog, version bump, tag, and announcement steps.
- **OpenClaw pattern:** The `skills/` directory contains `<name>/SKILL.md` files. Skills listed in `<available_skills>` are only read when the task matches — the agent is instructed to read the skill file before proceeding, not to rely on memory of previous reads.

## Sources

- [Agentic Engineering (System Design Newsletter)](https://newsletter.systemdesign.one/p/agentic-engineering) — "Reusable Workflows" section; SkillsBench results and human curation lesson
- [SkillsBench benchmark (arXiv:2602.12670)](https://arxiv.org/abs/2602.12670) — 86-task evaluation showing human-curated skills beat model-generated; Haiku+skills > Opus without
- [30 Core Agentic Engineering Concepts Every Developer Should Know](https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69) — skills as the on-demand layer of the configuration taxonomy

## See Also

- [[agent-config-files]]
- [[prompt-caching]]
- [[context-rot]]
- [[attention-budget]]
- [[agent-session-distillation]]
- [[agent-skills-open-standard]]
