---
title: "Progressive Disclosure (Agents)"
date: 2026-05-21
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [context-engineering, patterns]
tags: [concept, ai-agents, llm, context, retrieval, architecture, exploration, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/patterns]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://machinelearningmastery.com/effective-context-engineering-for-ai-agents-a-developers-guide/
    hash: sha256:30fc2e997d5e967efa4139893703044847197b7ecb4ae74190e8459d3fcb0a7c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Progressive Disclosure (Agents)

## Definition
**Progressive disclosure** (in agent contexts) is the strategy of allowing agents to incrementally discover and load relevant context through autonomous exploration, rather than pre-loading all potentially relevant information upfront. Each retrieval action yields context that informs the next decision, enabling agents to assemble understanding layer by layer while maintaining a lean context window.

## Explanation
The naive approach to giving an agent information is to dump everything it might need into the context at the start. This creates immediate problems: the context is noisy, expensive, and often contains stale or irrelevant data. It also doesn't scale — for any non-trivial task domain, "everything relevant" would exceed context limits.

Progressive disclosure is the alternative. The agent starts with lightweight references (file paths, directory listings, URLs, identifiers) and explores incrementally. Each step reveals more structure:

1. A directory listing reveals what files exist and their names (naming conventions hint at purpose)
2. A file's size suggests its complexity before reading it
3. A file's timestamp signals relative recency/relevance
4. Reading the first N lines of a file reveals its structure and whether it's worth reading fully
5. A search result suggests where the relevant content might be before fetching it

Each retrieval is informed by all previous retrievals. The agent builds a mental model progressively, loading only what the current reasoning step actually requires.

### Implicit signals in structure
A key insight from Anthropic's work: the *metadata and structure* of a file system or database already carries significant signal before any content is loaded:

- `tests/test_utils.py` vs `src/core_logic/test_utils.py` — same filename, radically different implied purpose
- File size: 3KB suggests a config file; 450KB suggests a data file worth querying rather than reading
- Modification timestamps: a file last touched 3 years ago is probably stable; yesterday's file is probably hot
- Directory hierarchy: `docs/` vs `src/` vs `scripts/` vs `tests/` — structure alone narrows the search

Agents that understand these implicit signals can make efficient retrieval decisions with minimal upfront context.

### Note-taking as persistence layer
Progressive disclosure works in concert with [[agentic-note-taking]]: as the agent discovers things worth remembering across steps, it writes them to a notes file. The notes accumulate structured understanding while the active context stays lean. On a context reset, reading the notes file restores the agent's navigational knowledge without reloading everything that was explored.

### Trade-offs
| Approach | Speed | Freshness | Context size | Tooling complexity |
|---|---|---|---|---|
| Pre-load everything | Fast | May be stale | Large | Low |
| Pure progressive disclosure | Slower (tool calls) | Fresh | Lean | High |
| Hybrid (upfront config + JIT exploration) | Balanced | Fresh | Controlled | Medium |

## Key Properties
- **Exploration-driven** — context is assembled through agent-initiated tool calls, not pre-processed pipelines
- **Signal-efficient** — each retrieval yields maximum information per token by leveraging metadata, structure, and naming conventions
- **Fresh-by-default** — content is fetched at the moment it's needed; stale-index problems don't apply
- **Requires good tooling** — the agent needs well-designed exploration tools (grep, glob, head/tail, directory listings) and heuristics for using them
- **Naturally scope-limiting** — agents converge on relevant subsets rather than accumulating irrelevant context

## Relationships
- Enabled by [[just-in-time-context]]: progressive disclosure is what JIT context *looks like in practice* during an agent's exploration phase
- Complements [[agentic-note-taking]]: notes provide persistent memory for discoveries made during progressive exploration
- Managed by [[context-engineering]]: progressive disclosure is one strategy within the broader context engineering toolkit
- Constrained by [[attention-budget]]: each exploration step consumes tokens; good progressive disclosure is efficient with those steps
- Contrasts with pre-computed [[retrieval-augmented-generation]]: RAG pre-computes embeddings offline; progressive disclosure retrieves live during inference

## Applications
- **Coding agents:** Start with project root listing → identify key directories → read relevant config files → locate specific files via grep/glob → read only what's needed for the current edit
- **Research agents:** Start with a search query → read titles/abstracts → select relevant papers → read specific sections → follow citation chains only when needed
- **Data analysis agents:** Start with schema/table listing → sample a few rows → run targeted queries → drill into specific columns or time ranges based on findings
- **File system navigation:** Use `ls` with timestamps and sizes before `cat`; use `head` before reading full files; use `grep` before loading entire files into context

## Study
- Flashcards: [[flashcards/progressive-disclosure-agents|Practice this concept]]

## Sources
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — primary source; introduces the concept with Claude Code examples
- [Effective Context Engineering for AI Agents: A Developer's Guide — Machine Learning Mastery](https://machinelearningmastery.com/effective-context-engineering-for-ai-agents-a-developers-guide/) — developer-focused guide to the same principles

## See Also
- [[just-in-time-context]]
- [[agentic-note-taking]]
- [[context-engineering]]
- [[attention-budget]]
- [[context-compaction]]
- [[retrieval-augmented-generation]]
- [[agent-skills-open-standard]] — the SKILL.md spec's three-tier loading model is a normative instance of this pattern, with concrete token budgets rather than informal guidance
