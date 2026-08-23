---
tags: [flashcards, ai-agents, safety, security, prompt-injection]
sr-due: 2026-05-10
sr-interval: 1
sr-ease: 250
---

# Tool Output Inspection — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:22200a -->
What is tool output inspection?
?
A server-side safety layer that scans results returned by agent tools — file reads, shell output, web fetches, external API responses — **before** those results enter the LLM's context. When content appears to be attempting to hijack agent behaviour, a warning is injected into context alongside the content, telling the agent to treat it as untrusted and anchor on original user intent.

## What It Defends Against <!-- kb:card:cc4351 -->
What attack does tool output inspection specifically defend against?
?
**Indirect prompt injection via tool outputs** — where adversaries plant instructions in the environment (crafted files, webpages with hidden directives, API responses with embedded commands) that the agent reads and might follow. Unlike direct injection (in the user's message), this vector exploits the agent's trust in its own tool outputs.

## Why Warning Injection, Not Blocking <!-- kb:card:8cdaa6 -->
Why does tool output inspection use warning injection rather than blocking suspect content?
?
Blocking would be too aggressive — legitimate documents may contain instruction-like text (legal documents, inline code comments, technical specifications). Warning injection passes the content through while giving the model meta-information to apply appropriate skepticism and anchor on the original user intent, preserving functionality while adding a safety signal.

## Tool Types Covered <!-- kb:card:9205c6 -->
What tool output types does inspection apply to?
?
- **File reads** — project files could contain instructions from malicious dependencies
- **Web fetches** — webpages can embed hidden directives (indirect prompt injection)
- **Shell output** — executed commands may return output designed to redirect the agent
- **External tool responses** — API responses, MCP tool results, other integration outputs

## Multi-Agent Extension <!-- kb:card:113f31 -->
How does tool output inspection extend to multi-agent systems?
?
At the **return boundary from subagents**: when a subagent completes a task and returns results to an orchestrator, a return check evaluates the subagent's full execution history for prompt injection before results flow back to the orchestrating agent. The orchestrator doesn't blindly trust what the subagent returns.

## Complementary Layer <!-- kb:card:3b80b2 -->
How does tool output inspection relate to the transcript classifier?
?
They protect different layers of the same pipeline:
- **Tool output inspection** → input layer: what flows INTO LLM context
- **[[transcript-classifier]]** → output layer: what actions the LLM executes
An injection that partially evades inspection may still be caught by the classifier when it manifests as a suspicious action.
