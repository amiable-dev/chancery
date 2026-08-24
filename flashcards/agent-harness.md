---
tags: [flashcards, ai-agents, architecture, context, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent harness — Flashcards

#flashcards/ai-agents

## Agent = model + harness <!-- kb:card:beed2e -->
What is the 'agent = model + harness' boundary rule, and what counts as harness?
?
The model supplies raw intelligence; everything else — system prompts, tools and their descriptions, bundled infrastructure (filesystems, sandboxes, browsers), orchestration logic, and hooks/middleware for deterministic steps — is harness.

## Design method: derive from a missing behavior <!-- kb:card:a7f54a -->
What design method does the harness framing force when building an agent system?
?
Start from a behaviour the raw model cannot produce (e.g. durable state, code execution, knowledge past training cutoff) and derive the harness feature that supplies it.

## Filesystem as foundational primitive <!-- kb:card:1d83ab -->
Why is the filesystem called the foundational harness primitive?
?
It serves as workspace, context offload, cross-session persistence, and a coordination surface for multiple agents and humans working together.

## Bash over pre-built tools <!-- kb:card:42917d -->
Why do harnesses favor a general-purpose bash/code-execution tool over pre-building every specific tool?
?
Code execution is the general-purpose action, so the harness author doesn't need to anticipate and pre-build every capability in advance.

## Context management is core harness work <!-- kb:card:2b544b -->
What three context-rot countermeasures does a harness typically supply?
?
Compaction when the window nears full, offloading bulky tool outputs to disk, and progressive disclosure of skill instructions.
