---
tags: [flashcards, ai-agents, context-engineering, retrieval]
sr-due: 2026-05-21
sr-interval: 1
sr-ease: 250
---

# Progressive Disclosure (Agents) — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:989bdd -->
What is progressive disclosure in the context of AI agents?
?
A strategy where agents incrementally discover and load relevant context through autonomous exploration, rather than pre-loading everything upfront. Each retrieval informs the next decision, assembling understanding layer by layer while keeping the context window lean.

## Application <!-- kb:card:d92763 -->
How would a coding agent use progressive disclosure when working on an unfamiliar codebase?
?
1. Start with a directory listing — names and sizes hint at structure
2. Identify key directories (src/, tests/, config/)
3. Read relevant config files to understand the project
4. Use grep/glob to locate specific files relevant to the task
5. Read only the files actually needed for the current edit — not the whole codebase

## Implicit Signals <!-- kb:card:89a996 -->
What implicit signals does file system structure provide to an agent doing progressive disclosure?
?
- **File names:** `tests/test_utils.py` vs `src/core_logic/test_utils.py` implies different purposes
- **File size:** 3KB suggests config; 450KB suggests data worth querying not reading
- **Timestamps:** recent modification = active code; old = stable/legacy
- **Directory hierarchy:** `docs/` vs `src/` vs `scripts/` narrows search before any file is read

## Relationship <!-- kb:card:f281e6 -->
How does progressive disclosure differ from retrieval-augmented generation (RAG)?
?
RAG pre-computes embeddings offline and retrieves at query time using similarity search — it's a pre-inference pipeline. Progressive disclosure retrieves *during* inference via agent tool calls, is driven by the agent's own reasoning about what to look at next, and always fetches live content (no stale index risk).

## Trade-off <!-- kb:card:b40e54 -->
What is the main trade-off of progressive disclosure vs. pre-loading context?
?
**Progressive disclosure:** slower (each step is a tool call at runtime), but fresh content, lean context, and retrieval is task-guided.
**Pre-loading:** faster (no runtime fetching), but risks stale data, large/noisy context, and loads content that may not be relevant to the actual task.
The hybrid approach — upfront config files + JIT exploration — balances both.
