---
tags: [flashcards, ai-agents, configuration, workflow, skills]
sr-due: 2026-06-23
sr-interval: 1
sr-ease: 250
---

# Reusable Agent Skills — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:830010 -->
What are reusable agent skills?
?
Markdown documents with YAML frontmatter that the agent loads **on demand** when a specific task type is triggered. Unlike config files (always in context), skills are only fetched when relevant — keeping baseline context lean while providing rich task-specific procedures when needed.

## Key distinction <!-- kb:card:7cc526 -->
What is the key distinction between a skill and a config file?
?
- **Config file:** Always loaded (every turn) — project rules, hard limits, tooling constraints
- **Skill:** On demand (task-triggered) — step-by-step procedures for specific task types
The split: config = what the project requires; skill = how to do a specific kind of work.

## SkillsBench result <!-- kb:card:6009e6 -->
What did SkillsBench demonstrate about skills vs. model size?
?
Claude **Haiku** with human-curated skills: **27.7%**
Claude **Opus** without skills: **22.0%**
A cheap model with good skills **outperforms** the flagship without them. And model-generated skills showed **zero gains** — human curation is what makes the difference, not having a machine write the skills.

## Good skill qualities <!-- kb:card:f32010 -->
What makes an effective agent skill?
?
- Concrete step-by-step procedures (not principles — actions)
- Includes anti-patterns and what-not-to-do
- Human-written and reviewed (not auto-generated)
- Covers one distinct task type
- Short enough to load without dominating context

## Relationship to context <!-- kb:card:eb30a7 -->
How do skills manage context window pressure?
?
By lazy-loading: procedures are only in context when the task that needs them is active. Once the task is done, the skill falls out of the active context. This keeps the baseline context lean and reduces context rot from permanently-loaded boilerplate.
