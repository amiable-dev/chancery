---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- mcp
- ai-agents
- integration
- protocols
---


# MCP Tool Patterns — Flashcards

#flashcards/mcp


## Definition <!-- kb:card:42c508 -->
What is MCP (Model Context Protocol) and what problem does it solve?
?
MCP is a standardised server/client protocol (from Anthropic) that allows AI assistants to discover and invoke typed tools and resources from external systems. It solves the integration problem: instead of custom APIs per tool, every MCP-compatible AI client can call any MCP server using the same protocol.

## Pattern <!-- kb:card:227494 -->
What is the "scoped context tool" pattern in MCP design?
?
A tool that returns precisely the context an AI needs for a task, rather than raw data. Example: `get_review_context(files_changed)` returns structural summaries and blast-radius scope instead of full file contents — minimising token usage while preserving semantic signal.

## Design rule <!-- kb:card:7fef27 -->
What makes a good tool description in an MCP server?
?
Tool descriptions are read by the AI at connect time as part of its context. Write them for AI readability — clear, precise, action-oriented — not for human documentation. The description is the AI's primary guide for deciding when and how to call the tool.

## Pattern <!-- kb:card:977f34 -->
What is the "progressive disclosure" MCP tool pattern?
?
Start with a summary tool that returns high-level results plus a `has_more` flag. Provide a companion `get_details(id)` tool for follow-up. This avoids flooding the AI's context with data it may not need, letting it choose the right level of detail for the task.

## Relationship <!-- kb:card:1de835 -->
How do MCP tool patterns relate to constrained agent actions?
?
MCP's explicit tool schema (name + description + typed JSON input schema) is a constraint mechanism: the AI can only invoke tools the server exposes, with inputs the schema allows. This bounds agent behaviour to intended capabilities, which is the core goal of constrained agent action patterns.
