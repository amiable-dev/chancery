# Agent Skills: The Open Standard for AI Agents

**Source:** https://neuralcoretech.com/agent-skills-open-standard-ai-agents/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Discover Agent Skills, the open SKILL.md standard that lets AI agents learn once and work across Claude, ChatGPT, Gemini, and more.

---

Table of Contents

-   [The open standard that lets you teach an AI agent something once — and never re-explain it again, across every tool you use](#penci-The_open_standard_that_lets_you_teach_an_AI_agent_something_once_%E2%80%94_and_never_re-explain_it_again_across_every_tool_you_use "The open standard that lets you teach an AI agent something once — and never re-explain it again, across every tool you use")

-   [What Is the Agent Skills Standard? (Quick Answer)](#penci-What_Is_the_Agent_Skills_Standard_Quick_Answer "What Is the Agent Skills Standard? (Quick Answer)")
-   [Timeline: From an Internal Claude Code Feature to a 32-Tool Standard](#penci-Timeline_From_an_Internal_Claude_Code_Feature_to_a_32-Tool_Standard "Timeline: From an Internal Claude Code Feature to a 32-Tool Standard")
-   [Architecture Deep Dive: Skills vs. MCP vs. Subagents vs. Old-Style Custom Instructions](#penci-Architecture_Deep_Dive_Skills_vs_MCP_vs_Subagents_vs_Old-Style_Custom_Instructions "Architecture Deep Dive: Skills vs. MCP vs. Subagents vs. Old-Style Custom Instructions")
-   [Where Skills Actually Live: A Directory Map Across Six Major Tools](#penci-Where_Skills_Actually_Live_A_Directory_Map_Across_Six_Major_Tools "Where Skills Actually Live: A Directory Map Across Six Major Tools")
-   [How to Build Your First Skill (10-Minute Walkthrough)](#penci-How_to_Build_Your_First_Skill_10-Minute_Walkthrough "How to Build Your First Skill (10-Minute Walkthrough)")
-   [The Skills Marketplace Economy in 2026](#penci-The_Skills_Marketplace_Economy_in_2026 "The Skills Marketplace Economy in 2026")
-   [7 High-ROI Skills Worth Building This Week](#penci-7_High-ROI_Skills_Worth_Building_This_Week "7 High-ROI Skills Worth Building This Week")
-   [Security Considerations Most Teams Skip](#penci-Security_Considerations_Most_Teams_Skip "Security Considerations Most Teams Skip")
-   [Skills vs. Custom GPTs vs. Gemini Gems: Which Customization Layer Actually Wins?](#penci-Skills_vs_Custom_GPTs_vs_Gemini_Gems_Which_Customization_Layer_Actually_Wins "Skills vs. Custom GPTs vs. Gemini Gems: Which Customization Layer Actually Wins?")
-   [What This Means for the Rest of 2026](#penci-What_This_Means_for_the_Rest_of_2026 "What This Means for the Rest of 2026")
-   [Frequently Asked Questions](#penci-Frequently_Asked_Questions "Frequently Asked Questions")
    -   [Related Reading on NeuralCoreTech](#penci-Related_Reading_on_NeuralCoreTech "Related Reading on NeuralCoreTech")
    -   [External References](#penci-External_References "External References")

### The open standard that lets you teach an AI agent something once — and never re-explain it again, across every tool you use

**TL;DR:** Agent Skills is an open specification — a folder containing a `SKILL.md` file — that lets any AI coding agent load specialized, on-demand expertise instead of forcing you to re-paste the same instructions every session. Anthropic published it as an independent open standard on December 18, 2025; within 48 hours Microsoft and OpenAI had adopted it, and by March 2026 more than 32 competing tools — Claude Code, Codex CLI, Gemini CLI, Cursor, GitHub Copilot, and Google Antigravity among them — were reading the exact same files. This guide breaks down the architecture, compares Skills against MCP and subagents, and gives you a working template to build your first skill today.

* * *

If you have spent any real time inside [our AI Tools & Platforms coverage](https://neuralcoretech.com/category/ai-tools-platforms/), you already know the single biggest source of friction in working with AI agents isn’t model intelligence — it’s repetition. You open a new chat, and the agent has forgotten your company’s commit message format, your PDF-handling process, your brand voice, your security review checklist. Multiply that three-minute re-explanation by every session, every week, across a team, and you’re losing hundreds of hours a year to a problem that has nothing to do with how smart the underlying model is.

Agent Skills is Anthropic’s answer to exactly that problem, and in 2026 it has quietly become one of the most consequential pieces of AI infrastructure released this cycle — arguably more consequential for day-to-day productivity than any single model launch, including the [Claude Fable 5 vs GPT-5.5 release cycle](https://neuralcoretech.com/claude-fable-5-vs-gpt-5-5-agentic-ai-architecture-2026/) we covered earlier this month. This article explains what Skills actually are, how the architecture works under the hood, how it stacks up against MCP and other customization layers, and how to put one to work in the next ten minutes.

## What Is the Agent Skills Standard? (Quick Answer)

**Agent Skills** is an open specification, available at [agentskills.io](https://agentskills.io/), that defines a portable format for packaging procedural knowledge for AI agents. The core unit is a directory containing a `SKILL.md` file with YAML frontmatter (a `name` and `description`) plus a Markdown body of instructions, optional scripts, and reference files. When a user’s request matches a skill’s description, the agent reads the file from disk and follows it — and ignores every skill that isn’t relevant, at zero context cost.

Anthropic’s own documentation describes Skills as modular capabilities that extend Claude’s functionality, each packaging instructions, metadata, and optional resources that Claude uses automatically when relevant. Crucially, Skills load on-demand and eliminate the need to repeatedly provide the same guidance across multiple conversations — which is exactly the repetition problem described above.

The format originated inside Claude Code in October 2025, but on December 18, 2025, Anthropic spun it out as an independent, vendor-neutral standard with a published specification and reference SDK, a move VentureBeat reported was explicitly modeled on how Anthropic’s earlier [Model Context Protocol](https://neuralcoretech.com/mcp-driven-agentic-ai-architecture-2026/) became the de facto standard for tool-calling. The bet paid off fast: within 48 hours, Microsoft had wired Agent Skills into VS Code via Copilot, and OpenAI had added support to both ChatGPT and Codex CLI.

## Timeline: From an Internal Claude Code Feature to a 32-Tool Standard

The speed of adoption is itself a story worth understanding if you’re deciding where to invest your team’s time:

-   **September–October 2025**: The `anthropics/skills` GitHub repository goes live; Skills ship as a Claude Code feature.
-   **December 18, 2025**: Anthropic publishes the open Agent Skills specification at agentskills.io, alongside an enterprise skill-management layer and a directory of partner-built skills from Atlassian, Canva, Cloudflare, Figma, Notion, Ramp, Stripe, and Zapier.
-   **December 18–20, 2025**: Microsoft (VS Code/Copilot) and OpenAI (ChatGPT, Codex CLI) ship support within 48 hours.
-   **January 2026**: Google’s agent-first IDE, Antigravity, formally adopts the standard.
-   **March 2026**: Adoption crosses 32 tools, including Gemini CLI, JetBrains Junie, AWS Kiro, and Block’s Goose — all reading identical `SKILL.md` files from the same folder structure.
-   **Q1 2026**: Anthropic ships “Skills 2.0,” adding built-in evaluations and richer enterprise governance controls.
-   **June 2026**: Marketplaces built on top of the standard — Vercel’s skills.sh and independent registries like Agensi — index tens of thousands of community-built skills, and mainstream AI newsletters are now running step-by-step guides like “how to turn any PDF into a Claude Skill” as everyday tips rather than power-user tricks.

For anyone who followed our breakdown of [agentic architecture and the MCP layer](https://neuralcoretech.com/mcp-driven-agentic-ai-architecture-2026/), the pattern should feel familiar: Anthropic ships a feature, open-sources the protocol behind it, and the rest of the industry standardizes around it faster than any single vendor could mandate. Skills is the second time this has happened in twelve months.

## Architecture Deep Dive: Skills vs. MCP vs. Subagents vs. Old-Style Custom Instructions

This is the question we get asked most by teams building production agent stacks, and it’s also where most explainers oversimplify. Skills, MCP, and subagents solve genuinely different problems, and the strongest 2026 architectures use all three together rather than picking one.

Layer

What It Actually Solves

Token Cost Model

Best Paired With

**Agent Skills**

“How should I do this?” — procedural knowledge, conventions, house style

Progressive disclosure: ~100 tokens per skill at idle, full body loaded only when triggered

Repeatable internal workflows (code review rules, document templates, SOPs)

**MCP (Model Context Protocol)**

“What can I access?” — structured connections to databases, APIs, and external tools

Tool schemas loaded per server, independent of Skills

Live data: CRMs, ticketing systems, internal databases

**Subagents**

“Who should do this part?” — task delegation to a separate context window

Full new context per spawned subagent

Long-horizon, multi-step tasks that would otherwise blow the main context budget

**Legacy custom instructions / `.cursorrules`**

Static, always-loaded preferences

Always consumes context, whether relevant or not

Short, universal preferences only — not large procedural knowledge

The architectural insight that makes Skills different from a long system prompt is **progressive disclosure**, and it’s worth understanding precisely because it determines how many skills you can realistically run at once. Per Anthropic’s documentation, a skill’s metadata is loaded at startup for roughly 100 tokens; the full instruction body — typically under 5,000 tokens — loads only once the agent decides the skill is relevant; and bundled scripts or reference files load only as needed, with executable code never entering the context window at all, since the agent reads only the script’s output. That third tier is the part most comparisons miss: you can bundle an entire internal API reference or a 40-page style guide into a skill, and it costs zero tokens until the specific page is actually needed.

This is also precisely why Skills and MCP are complementary rather than competing, as we noted in our [MCP production architecture analysis](https://neuralcoretech.com/mcp-driven-agentic-ai-architecture-2026/): MCP gives an agent the door into your database; a skill teaches it your team’s specific migration conventions once it’s through that door.

## Where Skills Actually Live: A Directory Map Across Six Major Tools

Because the format is identical everywhere, the only real difference between tools is the folder path. This is the table we wish existed when we first tried to share a skill across a mixed Claude Code / Codex CLI team:

Tool

Personal Skill Path

Project Skill Path

Management Method

Claude Code

`~/.claude/skills/`

`.claude/skills/`

Filesystem / Plugins

Claude API

n/a (workspace-wide)

`/v1/skills` endpoint

Skills API upload

claude.ai

Settings → Features (per-user)

n/a

ZIP upload via UI

OpenAI Codex CLI

`~/.agents/skills/` (USER scope)

`.agents/skills/`

`config.toml`, `$skill-installer`

Google Gemini CLI

`~/.gemini/skills/`

`.gemini/skills/`

`/skills` command

Cursor

n/a

`.cursor/skills/`

Filesystem

If your team already builds AI agents that touch the local filesystem and terminal — a topic we covered in depth in [our guide to connecting AI agents to local filesystems and terminal tools](https://neuralcoretech.com/ai-agents-local-filesystem-terminal-tools/) — this table matters practically, not just academically: copying a skill folder from `.claude/skills/` into `.gemini/skills/` is enough to make it work identically in Gemini CLI, with zero rewriting, because both tools implement the same open spec.

## How to Build Your First Skill (10-Minute Walkthrough)

You don’t need to learn a new syntax. Here’s the minimum viable `SKILL.md`, adapted directly from Anthropic’s reference structure:

markdown

```
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge
  documents. Use when working with PDFs or when the user mentions PDFs,
  forms, or document extraction.
---

# PDF Processing

## Quick start
Use pdfplumber to extract text from PDFs:

​```python
import pdfplumber
with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
​```

For advanced form filling, see FORMS.md.
```

Three things determine whether a skill actually fires when it should:

1.  **The `description` field does the heavy lifting.** It’s the only thing loaded into context by default, so it needs to state both _what_ the skill does and _when_ to use it — vague descriptions are the number-one reason skills silently fail to trigger.
2.  **Keep the main body under roughly 5,000 tokens.** If it’s longer, split detail into a secondary file (`FORMS.md`, `REFERENCE.md`) that the agent only opens when actually needed — that’s the progressive-disclosure tier doing its job.
3.  **Use the built-in skill-creator.** Both Claude and most Codex CLI/Gemini CLI implementations ship an interactive meta-skill that interviews you about the workflow and scaffolds the folder structure for you, which is faster than writing the frontmatter from scratch.

For deeper authoring guidance and edge cases, Anthropic’s own [Agent Skills documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) and [engineering deep-dive](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) are the most reliable primary sources, and the open-source [anthropics/skills repository](https://github.com/anthropics/skills) and [openai/skills catalog](https://github.com/openai/skills) both ship dozens of production-ready examples you can fork rather than write from zero.

## The Skills Marketplace Economy in 2026

What started as a handful of official examples has become a genuine ecosystem. Vercel’s skills.sh package manager now lists tens of thousands of installable skills with one-command installation (`npx skills add`) across every supported agent. Independent curated registries like Agensi review and security-scan submissions before listing them. Anthropic’s own partner directory ships ready-made skills from Atlassian, Canva, Cloudflare, Figma, Notion, Ramp, Stripe, and Zapier — meaning a small team can wire up enterprise-grade document, project-management, and CRM workflows without writing a single line of integration code.

This mirrors a pattern we tracked in our [Agentic AI Frameworks comparison of LangGraph, CrewAI, and AutoGen](https://neuralcoretech.com/agentic-ai-frameworks-2026-langgraph-crewai-autogen-symphonyagentic-ai-frameworks-2026-langgraph-crewai-autogen-symphony/): once an interoperability layer reaches critical mass, the value shifts from the protocol itself to the marketplace built on top of it. Skills is now far enough along that the marketplace, not the spec, is where most teams will spend their time in H2 2026.

## 7 High-ROI Skills Worth Building This Week

Based on the patterns we see working across the agent benchmarks in our [independent test of 12 AI agents on real business tasks](https://neuralcoretech.com/ai-agents-benchmark-2026-real-business-tasks/), these are the skills that consistently pay back the 20 minutes it takes to write them:

-   **Commit-message formatter** — encodes your team’s conventional-commits format so every agent-generated commit matches your CI’s lint rules automatically.
-   **Code review checklist** — security, performance, and style checks specific to your stack, run consistently instead of depending on whichever reviewer is online.
-   **Document brand-voice skill** — house style, banned phrases, and formatting rules for anything client-facing, so output doesn’t need a second editing pass.
-   **Onboarding/runbook skill** — turns your internal SOPs into something a new hire’s agent can follow on day one, not week three.
-   **PDF/spreadsheet processing skill** — fork Anthropic’s pre-built `pdf`, `xlsx`, `docx`, and `pptx` skills rather than rebuilding document handling from scratch.
-   **API reference skill** — bundle your internal API docs as reference files; the agent only loads the specific endpoint it needs, at zero cost for the rest.
-   **Incident-response skill** — a verification checklist that forces a second pass before an agent reports a monitoring result as resolved, which is exactly the failure category Anthropic flagged in Claude Fable 5’s own system card.

## Security Considerations Most Teams Skip

This is the part of the Skills conversation that gets the least attention relative to its actual risk, and it’s squarely inside the territory we cover in our [AI Security & Governance section](https://neuralcoretech.com/category/ai-security-governance/). Anthropic’s own guidance is blunt about it: a malicious Skill can direct Claude to invoke tools or execute code in ways that don’t match the Skill’s stated purpose, and depending on what access the agent has at execution time, that can mean data exfiltration or unauthorized system access — not a hypothetical, but a documented attack surface.

Three rules worth enforcing before your team installs anything from a public marketplace:

1.  **Treat every third-party skill like unreviewed software.** Read the full `SKILL.md`, every bundled script, and every referenced file before installing — not just the description.
2.  **Be especially wary of skills that fetch external URLs.** Fetched content can carry hidden instructions, and a skill that was safe at install time can become compromised later if its external dependency changes.
3.  **Scope network and filesystem access deliberately.** Claude Code skills inherit full local network access by default; Claude API skills run with no network access at all. Know which environment you’re deploying into before granting a skill broader permissions than the task requires.

## Skills vs. Custom GPTs vs. Gemini Gems: Which Customization Layer Actually Wins?

Capability

Agent Skills (SKILL.md)

OpenAI Custom GPTs

Gemini Gems

Cross-platform portability

Yes — open standard, works across 32+ tools unmodified

No — locked to ChatGPT

No — locked to Gemini

Progressive disclosure (zero idle cost)

Yes

Partial (knowledge files only)

Partial

Executable scripts, not just instructions

Yes

Limited (Actions/plugins)

Limited

Version control / code review friendly

Yes — plain files in your repo

No — managed in UI

No — managed in UI

Best fit

Engineering teams, repeatable technical workflows

Consumer-facing custom assistants

Google Workspace-centric workflows

The honest takeaway: Custom GPTs and Gemini Gems remain genuinely useful for quickly spinning up a consumer-facing assistant with a friendly setup wizard. But for any workflow your engineering or operations team wants version-controlled, code-reviewed, and portable across whichever model wins the next benchmark cycle, the open standard wins on every architectural dimension — which is exactly why 32 competing vendors adopted someone else’s spec instead of building their own.

## What This Means for the Rest of 2026

Skills adoption is converging with two other trends we’re tracking closely. First, the model layer itself is fragmenting: Sensor Tower’s most recent State of AI report put ChatGPT’s market share below 50% for the first time, with Gemini and Claude both gaining share — which means the teams best positioned for 2026 are the ones whose workflows aren’t locked to a single vendor’s proprietary customization layer. Second, our own [Claude Fable 5 vs GPT-5.5 architecture analysis](https://neuralcoretech.com/claude-fable-5-vs-gpt-5-5-agentic-ai-architecture-2026/) found that the strongest production setups already route different task types to different models — and a portable skill, by definition, follows the workflow wherever it’s routed, rather than needing to be rebuilt for whichever model wins the next quarter.

If you’re choosing where to invest engineering time this quarter, Skills is one of the few infrastructure bets in the agentic stack that is genuinely vendor-neutral, already production-proven, and cheap enough to start using today.

## Frequently Asked Questions

**Is Agent Skills free to use?** Yes. The `SKILL.md` format and specification are open and free. Anthropic’s own pre-built skills are largely Apache 2.0 licensed, and the vast majority of the community ecosystem on GitHub and skills.sh is free; only a small number of premium skills on third-party marketplaces carry a price.

**Do Agent Skills replace MCP?** No. They solve different problems and are designed to be used together: MCP provides structured access to external tools and data, while Skills package the procedural knowledge for how to use that access correctly.

**Can I use a Claude Skill in Cursor or Gemini CLI without rewriting it?** In most cases, yes. A skill that sticks to plain Markdown instructions and the standard frontmatter fields works unmodified across any tool that supports the open standard — only skill-specific extensions (like Claude Code’s context-forking) may need adjustment.

**Where do I find ready-made skills instead of writing my own?** Start with the official [anthropics/skills](https://github.com/anthropics/skills) and [openai/skills](https://github.com/openai/skills) repositories, then browse community marketplaces like skills.sh and Agensi for workflow-specific skills.

* * *

_This article reflects publicly available documentation and reporting as of June 17, 2026. Skill adoption figures, marketplace listing counts, and tool-specific directory paths may change as vendors update their implementations — always confirm against the official documentation for the tool you’re deploying to before a production rollout._

### Related Reading on NeuralCoreTech

-   [Claude Fable 5 vs GPT-5.5: Agentic AI Architecture Deep Dive & Benchmark Analysis](https://neuralcoretech.com/claude-fable-5-vs-gpt-5-5-agentic-ai-architecture-2026/) — our most recent frontier-model comparison
-   [MCP Agentic AI Systems: 2026 Production Architecture](https://neuralcoretech.com/mcp-driven-agentic-ai-architecture-2026/) — the protocol that paved the way for Skills
-   [How to Connect AI Agents to Your Local File System and Terminal Tools](https://neuralcoretech.com/ai-agents-local-filesystem-terminal-tools/) — the filesystem layer Skills run on top of
-   [12 AI Agents on Real Business Tasks: Benchmarks & Surprises](https://neuralcoretech.com/ai-agents-benchmark-2026-real-business-tasks/) — our independent agent benchmark series
-   [Best Agentic AI Frameworks 2026: LangGraph vs CrewAI](https://neuralcoretech.com/agentic-ai-frameworks-2026-langgraph-crewai-autogen-symphonyagentic-ai-frameworks-2026-langgraph-crewai-autogen-symphony/) — framework selection for production agents
-   [Browse all AI Tools & Platforms coverage →](https://neuralcoretech.com/category/ai-tools-platforms/)
-   [Browse all AI Security & Governance coverage →](https://neuralcoretech.com/category/ai-security-governance/)

### External References

[Agent Skills Open Standard Specification](https://agentskills.io/) — official spec and reference SDK | [Anthropic: Agent Skills Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — official product docs | [Anthropic Engineering: Equipping Agents for the Real World with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — architecture deep-dive | [anthropics/skills on GitHub](https://github.com/anthropics/skills) — official open-source skill examples | [openai/skills on GitHub](https://github.com/openai/skills) — OpenAI’s Codex skills catalog | [openai/codex on GitHub](https://github.com/openai/codex) — Codex CLI source | [Gemini CLI: Agent Skills Documentation](https://geminicli.com/docs/cli/skills/) — Google’s official implementation guide | [VentureBeat: Anthropic Launches Enterprise Agent Skills and Opens the Standard](https://venturebeat.com/ai/anthropic-launches-enterprise-agent-skills-and-opens-the-standard) — launch coverage | [The New Stack: Agent Skills, Anthropic’s Next Bid to Define AI Standards](https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/) — adoption analysis

You Might Also Like
