---
tags: [flashcards, ai-agents, configuration, workflow]
sr-due: 2026-06-23
sr-interval: 1
sr-ease: 250
---

# Agent Config Files — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f66306 -->
What is an agent config file (AGENTS.md / CLAUDE.md)?
?
A project-level Markdown file the agent loads at the start of every session and keeps in its context window throughout. It encodes project-specific rules, tooling conventions, hard limits, and behavioral constraints — the layer above the harness's system prompt that tells the agent what *this* project expects.

## Always-on vs on-demand <!-- kb:card:5a20fc -->
What is the key distinction between a config file and a skill?
?
| | Config file | Skill |
|--|-------------|-------|
| When loaded | **Always** (every turn) | **On demand** (when relevant) |
| Content | Project rules, hard limits | Task-specific procedures |
| Size | Under 100 lines | As long as needed |
| Cost | Paid every turn | Paid only when loaded |

## What belongs <!-- kb:card:e833c7 -->
What belongs in an agent config file?
?
- Hard limits: "Never commit secrets", "Always run tests first"
- Tooling stack: which package manager, test runner, linter the project uses
- Project conventions: naming patterns, file structure
- Behavioral rules: "Read a file before editing it"
**Does NOT belong:** generic AI-generated boilerplate (actively degrades performance), documentation about code structure (use a knowledge base), task-specific procedures (use skills)

## SkillsBench finding <!-- kb:card:74147a -->
What did the SkillsBench benchmark show about config files and skills?
?
Claude Haiku with **human-curated skills** (27.7%) beat Claude Opus **without** skills (22.0%). The cheapest model with good instructions outperformed the flagship without. Critically, model-generated skills showed **zero gains** — quality of human-written instructions matters more than model size.

## Why under 100 lines? <!-- kb:card:aeab1a -->
Why should agent config files be kept under 100 lines?
?
Every line in a config file is in the context window for every single agent turn. Generic or low-quality lines dilute the signal, making the model attend less effectively to the important rules (context rot and attention budget effects). Each line must earn its place — if it's not consistently improving outcomes, remove it.
