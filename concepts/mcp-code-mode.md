---
title: "MCP Code Mode"
date: 2026-04-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [mcp, patterns, cost-control, context-engineering]
tags: [concept, mcp, ai-agents, architecture, token-efficiency, progressive-disclosure, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/mcp, topic/patterns, topic/cost-control, topic/context-engineering]
status: draft
sources:
  - url: https://blog.cloudflare.com/enterprise-mcp/
    hash: sha256:b6afb82e86c514d9d7c7684b8c129302c2647fefc41d29ee4d12e0d003bdca89
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://blog.cloudflare.com/code-mode-mcp/
    hash: sha256:011a68997781e4d1138bdf4949566ede7f9da8e003712220952726b8faa7058e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/#code-mode
    hash: sha256:2c2cab623f310bd355d3b5ca5c87ca7ddd968acee6aef1352cd154ca68cb4371
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# MCP Code Mode

## Definition
MCP Code Mode is a tool-design pattern that replaces static, exhaustive tool catalogues with two meta-tools — a `search` tool and an `execute` tool — through which an AI model writes JavaScript code to discover and invoke underlying tools on demand. Instead of loading all tool schemas into context upfront, the model discovers what it needs dynamically, reducing token consumption by 94%+ and keeping context cost fixed regardless of how many underlying tools are connected.

## Explanation
The standard MCP approach requires every tool's name, description, and full JSON Schema to be loaded into the model's context window at session start. For a server with 52 tools this costs ~9,400 tokens — before any work begins. Add more servers and the cost compounds. The context window fills with definitions the model may never use.

Code Mode inverts this: instead of the server pushing schemas to the model, the model pulls only what it needs by writing code.

**The two Code Mode tools:**

**`portal_codemode_search`** — gives the model access to a `codemode.tools()` function. The model writes JavaScript to call this function and filter the results:
```javascript
// portal_codemode_search
async () => {
  const tools = await codemode.tools();
  return tools
    .filter(t => t.name.includes("jira") || t.name.includes("drive"))
    .map(t => ({ name: t.name, params: Object.keys(t.inputSchema.properties || {}) }));
}
```
The full schema never enters context — only the filtered subset the model requested.

**`portal_codemode_execute`** — provides a `codemode` proxy object where each tool is a callable function. The model writes JavaScript to call tools, chain operations, and handle errors in a single invocation:
```javascript
// portal_codemode_execute
async () => {
  const tickets = await codemode.jira_search_jira_with_jql({
    jql: 'project = BLOG AND status = "In Progress"',
    fields: ["summary", "description"]
  });
  const doc = await codemode.google_workspace_drive_get_content({ fileId: "1aBcDeFgHiJk" });
  await codemode.jira_update_jira_ticket({
    issueKey: tickets[0].key,
    fields: { description: tickets[0].description + "\n\n" + doc.content }
  });
  return { updated: tickets[0].key };
}
```
That multi-step workflow is **two tool calls** (search, then execute) instead of three separate invocations with full schemas pre-loaded.

**Token economics:**

| Mode | Tools | Context tokens |
|------|-------|---------------|
| Standard MCP | 52 tools, 4 servers | ~9,400 |
| Code Mode | Same 52 tools, 4 servers | ~600 |
| Code Mode + more servers | N servers | Still ~600 |

The critical insight: Code Mode token cost is **fixed**. Adding more servers doesn't increase context overhead — the model only loads what it searches for.

**Execution environment:** Code runs in a sandboxed environment (Cloudflare's Dynamic Workers) on the portal server. The model writes code; the server executes it safely.

**Activation:** Append `?codemode=search_and_execute` to the [[mcp-server-portal]] URL. No client-side changes required.

**Tradeoffs:**
- Requires a model capable of writing valid JavaScript — works well with capable frontier models
- Discovery step adds one round-trip vs knowing the tool name upfront (mitigated by caching)
- Debugging tool failures means understanding JS errors, not just tool schema mismatches
- Best suited for portals connecting many MCP servers; overkill for a single server with 3 tools

## Key Properties
- **[[progressive-disclosure-agents|Progressive disclosure]]** — model pulls schema for tools it needs, not all schemas upfront
- **Fixed context cost** — O(1) context regardless of connected server count (vs O(N) for standard MCP)
- **Code-as-orchestration** — chaining, filtering, and error handling happen in model-generated JavaScript, not via separate tool calls
- **Server-side execution** — code runs sandboxed on the portal; model cannot execute arbitrary code on client
- **Zero client changes** — activated via URL parameter; existing MCP clients work without modification

## Relationships
- Extends [[mcp-tool-patterns]]: Code Mode is the "progressive disclosure" pattern taken to its logical extreme — the model writes code rather than receiving a filterable list
- Deployed via [[mcp-server-portal]]: portals are the deployment surface; Code Mode is an opt-in mode of the portal
- Related to [[model-context-protocol]]: Code Mode is built on top of MCP — the two Code Mode tools are standard MCP tools; the innovation is in what those tools expose
- Related to [[constrained-agent-actions]]: the sandboxed execution environment is a constraint mechanism — the model writes code but can only call approved tools via the `codemode` proxy
- Related to [[prompts-as-infrastructure]]: tool descriptions in Code Mode are fetched on demand by model-written code rather than injected into the prompt — a shift in how tool discovery is prompted

## Applications
- **Large enterprise MCP deployments:** Any organisation with >20 tools across multiple MCP servers benefits from Code Mode. Token savings compound as the server catalogue grows.
- **Platform teams building MCP portals:** Activate Code Mode to provide a cost-stable interface regardless of how many servers the platform team onboards
- **Cost attribution:** Reduced base token consumption means tool invocation costs dominate, making per-task cost estimates more accurate
- **API-first tool design:** Code Mode's model-written JS can call underlying tools with complex parameter logic that would require multiple round-trips in standard MCP (filtering, chaining, conditional branching)

## Study

> [!tip] Flashcards
> [[flashcards/mcp-code-mode|Review flashcards for this concept]]

## Sources
- [Scaling MCP adoption: Cloudflare's reference architecture (blog.cloudflare.com)](https://blog.cloudflare.com/enterprise-mcp/) — primary source; Code Mode design rationale and token benchmarks
- [Code Mode: powering Cloudflare's MCP server (blog.cloudflare.com)](https://blog.cloudflare.com/code-mode-mcp/) — earlier post on server-side Code Mode for Cloudflare's public API (99.9% token reduction)
- [MCP server portals: Code Mode (Cloudflare Developer Docs)](https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/#code-mode) — configuration reference

## See Also
- [[mcp-server-portal]]
- [[mcp-tool-patterns]]
- [[model-context-protocol]]
- [[constrained-agent-actions]]
- [[prompts-as-infrastructure]]
