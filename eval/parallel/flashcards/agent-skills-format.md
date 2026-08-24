---
tags: [flashcards, standards, ai-agents, context, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent Skills format — Flashcards

#flashcards/standards

## Definition of Agent Skills <!-- kb:card:181e95 -->
What is the Agent Skills format?
?
An open format for packaging agent capabilities as a folder containing a SKILL.md file (name/description metadata plus task instructions), optionally bundling scripts, templates and reference material, portable across any skills-compatible agent.

## The three stages of progressive disclosure <!-- kb:card:133b03 -->
What are the three stages of progressive disclosure through which a skill's content loads?
?
Discovery (only the name and description load at startup), activation (a matching task pulls the full SKILL.md into context), and execution (the agent follows the instructions, running bundled code or reading referenced files as needed).

## Why the standing context cost stays small <!-- kb:card:1e6cc8 -->
Why can an agent hold many skills without a large standing context footprint?
?
Because full instructions load only on demand at activation — at startup, each skill contributes just its name and description.

## Origin and standardization <!-- kb:card:2ac0b0 -->
Who originated the Agent Skills format, and what is its adoption status?
?
Anthropic originated it, but it was released as an open standard with multi-product adoption beyond its originator.
