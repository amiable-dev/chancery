---
tags: [flashcards, llm, standards]
sr-due: 2026-07-27
sr-interval: 1
sr-ease: 250
---

# llms.txt — Flashcards

#flashcards/llm

## Definition <!-- kb:card:e33501 -->
What is llms.txt?
?
A community-proposed (not formally governed) plain Markdown file served at a site's root listing pages an AI agent should read first. It has no provider commitment as a search/citation signal — its measured real-world use is as a navigation index for coding agents and agentic browsers reading developer documentation.

## Application <!-- kb:card:b23490 -->
When would you use llms.txt?
?
On a developer documentation site (API/SDK/CLI docs) so coding agents like Claude Code or Cursor can navigate it when a developer asks the agent to use those docs. Do NOT publish it expecting any effect on Google Search or AI Overviews — multiple independent studies (SE Ranking, Ahrefs, Limy.AI, Otterly.AI) plus Google's own June 2026 Search Central guidance confirm it has zero measured search/citation effect.

## Relationship <!-- kb:card:5b9b43 -->
How does llms.txt relate to the Agent-to-Agent (A2A) Protocol?
?
Both are "agent-readable web" mechanisms but sit at opposite ends of the maturity spectrum: A2A is formally governed (Linux Foundation, v1.0, signed Agent Cards, 150+ member orgs) and solves agent-to-agent delegation; llms.txt is an ungoverned community convention solving a narrower agent-to-documentation navigation problem with ~10% adoption and no citation effect. The pattern that predicts which standards survive: solving a problem for developers building agents beats solving a problem for marketers courting agents.

## Evidence <!-- kb:card:e51755 -->
What evidence shows llms.txt has no effect on AI search visibility?
?
Google's Search Central AI-optimisation guide (June 15 2026) states Search doesn't use machine-readable files like it at all. SE Ranking's analysis of ~300,000 domains found zero correlation between llms.txt and AI citations (removing it as a model feature improved accuracy). Ahrefs found 97% of llms.txt files across 137,210 domains were never fetched in May 2026.
