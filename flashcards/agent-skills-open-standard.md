---
tags: [flashcards, ai-agents, standards]
sr-due: 2026-07-27
sr-interval: 1
sr-ease: 250
---

# Agent Skills Open Standard (SKILL.md) — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f3c5f8 -->
What is the Agent Skills open standard?
?
A formal, cross-vendor specification (hosted at agentskills.io) for `SKILL.md` — a Markdown file with YAML frontmatter that packages a reusable agent capability in a standard directory layout, readable unmodified by competing agent products (Claude Code, Codex, Gemini CLI, Cursor, Copilot, and others).

## Required fields <!-- kb:card:ab37f5 -->
What are the only two required frontmatter fields in the SKILL.md spec, and what are their constraints?
?
`name` (≤64 chars, lowercase alphanumeric + hyphens, no leading/trailing/consecutive hyphens, must match the parent directory name) and `description` (≤1024 chars, non-empty, must describe what the skill does and when to use it).

## Progressive disclosure <!-- kb:card:347e7b -->
What are the three loading tiers the SKILL.md spec defines, with their token budgets?
?
1. Metadata (~100 tokens): name + description, loaded at startup for all skills. 2. Instructions (<5000 tokens recommended): the full SKILL.md body, loaded on activation. 3. Resources (as needed): scripts/, references/, assets/ files, loaded only when required.

## Versioning gap <!-- kb:card:ec78c0 -->
Does the SKILL.md spec have a top-level version field or dependency resolution?
?
No. There is no version field at the top level — versioning is pushed into the free-form `metadata` map, with no dependency resolution or compatibility-range mechanism. This is a notable gap for anything distributed at scale.

## Security-adjacent field <!-- kb:card:c5983d -->
Which frontmatter field is the only security-relevant one in the spec, and what's its status?
?
`allowed-tools` — a space-separated pre-approved tool list (e.g. `Bash(git:*) Bash(jq:*) Read`). It's marked experimental, and support varies between agent implementations.

## Relationship <!-- kb:card:94b135 -->
How does the Agent Skills open standard relate to the general practice of "reusable agent skills"?
?
Reusable agent skills describes the general practice (lazy-loaded, task-scoped procedures written as Markdown+frontmatter). The Agent Skills open standard is the ratified cross-vendor spec that formalizes that practice with an exact schema, naming rules, and a reference validator (`skills-ref`).

## Application <!-- kb:card:4e70bd -->
Why does portability under this standard matter for avoiding agent harness lock-in?
?
Because skills written to the spec are, in principle, loadable unmodified by Cursor, Codex, Gemini CLI, or Goose — reducing dependency on any single vendor's harness, directly mitigating agent memory/tooling lock-in risk.
