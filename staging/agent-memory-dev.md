# agentmemory

**Source:** https://www.agent-memory.dev/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Persistent memory for AI coding agents. Runs locally. Zero external databases.

---

ZERO EXTERNAL DATABASES · v

0.9.29

Give your coding agent a memory that survives the session. 95.2% retrieval recall on LongMemEval-S with about 92% fewer input tokens than full-context replay, all on your own machine.

AS FEATURED IN

95.2

%

RETRIEVAL R@5 · LONGMEMEVAL-S

92

%

FEWER INPUT TOKENS PER SESSION

54

MCP TOOLS

130

REST ENDPOINTS

0

EXTERNAL DATABASES

1718

TESTS PASSING

The stack

## Three layers.  
No framework tax.

Built on the iii engine: every memory operation is a worker, a function, or a trigger. No external databases, queues, or vector stores. The entire runtime is one process.

01

### Hooks

12 auto-capture hooks piped into every coding agent. Every tool call, every prompt, every stop becomes a compressed observation, stamped with its origin and agent.

02

### Recall

Hybrid retrieval on the primary recall path: BM25, vector, and knowledge graph scores ranked together, reranked on device. Superseded versions stay out of results.

03

### Consolidate

With an LLM provider key, consolidation runs on session stop: raw observations compress into semantic memories, duplicates merge, stale rows decay, audit rows record it all.

What's inside

## Twelve things you did not want to build.

agentmemory is not a library or a vector store. It is a complete memory runtime: capture, recall, consolidate, observe, federate.

-   12AUTO-HOOKS
    
    ### Capture everything
    
    Every session start, prompt, tool call, and stop fires into the memory pipeline with no glue code. Install the plugin and capture begins.
    
-   54MCP TOOLS
    
    ### Native MCP surface
    
    memory\_save, memory\_recall, memory\_smart\_search, memory\_sessions, governance, audit, export: the full surface behind a single MCP server. Saving a near-duplicate returns a similarTo hint instead of a second copy.
    
-   130REST ENDPOINTS
    
    ### HTTP first
    
    Every MCP tool has a REST twin under /agentmemory/\*. Curl it, fetch it from the browser, or proxy it from your own agent.
    
-   BM25\+ VECTOR + GRAPH
    
    ### Hybrid recall
    
    The primary recall path ranks lexical, semantic, and graph scores together, reranked on device. Superseded versions stay out of results while their history stays queryable.
    
-   5ORIGIN CHANNELS
    
    ### Provenance built in
    
    Every record carries write-time provenance: user, agent, tool, import, or shared. Pass agentId through save and recall to scope memory per agent.
    
-   AUTOCONSOLIDATION
    
    ### Raw to semantic
    
    Activates with an LLM provider key. Consolidation runs on session stop: observations compress into semantic memories, duplicates merge, stale rows decay with retention scoring, and audit rows record the sweep.
    
-   ∞REPLAY
    
    ### JSONL session import
    
    Point agentmemory at a Claude Code JSONL transcript and it rehydrates the session, indexes it for search, and derives crystals and lessons from what it finds.
    
-   GRAPHEXTRACTION
    
    ### Knowledge graph
    
    Entities and relations extract from observations when an LLM provider key is set and graph extraction is enabled. Query with /agentmemory/graph. Visualize in the viewer. Temporal edges supported.
    
-   IDXLESSON RECALL
    
    ### Lessons that resurface
    
    Save a lesson once, recall it by relevance later. Lessons live in a dedicated BM25 index with confidence and recency reranking, with save, recall, and delete over MCP and REST.
    
-   MESHFEDERATION
    
    ### Peer-to-peer sync
    
    Register another agentmemory node and push or pull memories over authenticated HTTPS. A bearer token is required; no silent syncs.
    
-   MDOBSIDIAN EXPORT
    
    ### Your notes, hydrated
    
    Mirror memories to a sandboxed vault directory as frontmatter-tagged markdown, ready for Obsidian's graph view.
    
-   0EXTERNAL DBs
    
    ### One process
    
    Runs as a single Node process with zero external services. State lives on disk as JSON. agentmemory stop flushes indexes before exit, in Docker mode too.
    

Command center

## Two UIs.  
One memory runtime.

agentmemory ships a real-time viewer for your memories and an engine-level console for every function, trigger, and OTel span. Both are first-class, installed inline by the CLI on first run.

### Ship-with viewer · port 3113

The agentmemory server auto-starts a real-time viewer on port 3113. No install, no config. Tabs refresh live as hooks fire, and any past session replays in place.

-   LIVE OBSERVATION STREAM · EVERY HOOK AS IT FIRES
-   SESSION EXPLORER · REPLAY ANY PAST SESSION
-   MEMORY BROWSER · FILTER BY PROJECT / TYPE / CONFIDENCE
-   KNOWLEDGE GRAPH VISUALIZATION · FORCE-DIRECTED
-   HEALTH DASHBOARD · HEAP / RSS / EVENT LOOP LAG

```
$ open http://localhost:3113
```

Ship-with viewer · port 3113

![agentmemory viewer live demo](https://www.agent-memory.dev/demo.gif)

Live

## Memory that types back.

agentmemory@localhost:3111

IDLE

VS.

## Vs. the field.

Only the agentmemory number is ours, measured on LongMemEval-S and reproducible from the repo. Competitor figures are their own published claims on their own benchmarks — different datasets, shown for ballpark. Ship what you want; we just picked the one with receipts.

AGENTMEMORYMEM0LETTAZEP / GRAPHITI

RETRIEVAL95.2% (LongMemEval-S)68.5% (LoCoMo)83.2% (LoCoMo)63.8% (LongMemEval)

EXTERNAL DEPS0Qdrant / pgvectorPostgres + vectorNeo4j

REST ENDPOINTS130———

MCP TOOLS54———

AUTO-CAPTURE HOOKS12Manual add()Agent self-edits—

NATIVE AGENT PLUGINS6———

OPEN SOURCEYes (Apache-2.0)YesYesYes

BUILDERS USING AGENTMEMORY

## In the wild.

Verbatim from the Product Hunt launch thread. Each card links back to the source comment.

HOW THEY USE IT

WHAT THEY SAY

Works with

## Seven native plugins.  
Rest MCP-native.

Native plugins for Claude Code, Copilot CLI, Codex CLI, OpenClaw, Hermes, pi, and Cursor. OpenCode gets a plugin that attributes each session to its own project. Every other MCP client gets it for free. \`agentmemory connect <agent>\` auto-wires them all.

Ship it

## One install.  
Any agent.

Runs on your machine. Data stays local. Capture and recall need no LLM key; add one for Anthropic, OpenAI, Gemini, MiniMax, or OpenRouter to activate consolidation, graph extraction, and LLM compression.

1\. INSTALL ONCE

2\. START THE MEMORY SERVER

3\. RUN THE DEMO

ZERO-INSTALL PATH: NPX

4\. WIRE UP ANY AGENT

One MCP JSON fits almost everything. Pick your agent on the left, or paste the universal config on the right.

AGENTS

[CursorOPEN](cursor://anysphere.cursor-deeplink/mcp/install?name=agentmemory&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBhZ2VudG1lbW9yeS9tY3AiXSwiZW52Ijp7IkFHRU5UTUVNT1JZX1VSTCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzExMSJ9fQ%3D%3D)[VS CodeOPEN](vscode:mcp/install?%7B%22name%22%3A%22agentmemory%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40agentmemory%2Fmcp%22%5D%2C%22env%22%3A%7B%22AGENTMEMORY_URL%22%3A%22http%3A%2F%2Flocalhost%3A3111%22%7D%7D)

Cursor / VS Code are one-click via deeplink. Others copy the right snippet directly to your clipboard.

UNIVERSAL MCP JSONWORKS FOR CLAUDE DESKTOP · CURSOR · CLINE · ROO · WINDSURF · GEMINI · WARP · DROID · KIRO · ANTIGRAVITY · QWEN · MERGE INTO EXISTING mcpServers

```
{
  "mcpServers": {
    "agentmemory": {
      "command": "npx",
      "args": ["-y", "@agentmemory/mcp"],
      "env": {
        "AGENTMEMORY_URL": "http://localhost:3111"
      }
    }
  }
}
```
