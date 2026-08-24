# Databricks Open-Sources Omnigent: A Meta-Harness That Composes, Governs, and Shares AI Agents Across Claude Code, Codex, and Pi

**Source:** https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Databricks open-sources Omnigent, an Apache 2.0 meta-harness for composing, governing, and sharing AI agents from one unified interface

---

Databricks released **[Omnigent](https://github.com/omnigent-ai/omnigent)**, an open source ‘meta-harness’ for AI agents. The project ships under the Apache 2.0 license. The Databricks AI team built it with Neon.

A harness is the wrapper around a model that turns it into an agent. Claude Code, Codex, and Pi are harnesses. Omnigent sits one level above them. It treats each harness as an interchangeable part of a larger system.

Many engineers now juggle four or five agents at once. They copy text between coding agents, search tools, Docs, and Slack. Each harness only understands its own sessions. Omnigent adds a shared layer where composition, control, and collaboration live.

## **What is Omnigent**

Omnigent is a common interface above command-line agents and agent SDKs. It wraps terminal coding agents such as Claude Code, Codex, and Pi. It also wraps SDKs like OpenAI Agents and the Claude Agents SDK.

The design rests on one observation. However a harness calls its model internally, the user-facing interface is the same. Messages and files go in. Text streams and tool calls come out. Omnigent standardizes that interface so harnesses become swappable.

You supply the models and the infrastructure. Omnigent runs the agents on top. It can coordinate several of them as interchangeable workers under one orchestrator.

## **How Omnigent Works**

The architecture has two parts. A runner wraps any agent in a sandboxed session with a uniform API. A server provides policies and sharing. The server exposes every session over the terminal, the app, and web APIs.

One command starts a session in your terminal. It also launches a local web UI at `localhost:6767`. The same session appears in the browser or on a phone. Messages, sub-agents, terminals, and files stay in sync.

The CLI installs under two names, `omnigent` and `omni`. They are interchangeable. On first run, it detects model credentials already in your environment.

![](https://www.marktechpost.com/wp-content/uploads/2026/06/Screenshot-2026-06-13-at-9.49.47-PM-1.png)

https://omnigent.ai/

## **Composition, Control, and Collaboration**

**Databricks team frames Omnigent around three capabilities**:

-   **Composition** means combining models, harnesses, and techniques without rewriting code. You switch between Claude Code, Codex, Pi, and custom agents with one-line changes.
-   **Control** means stateful, contextual policies. They track agent actions and enforce guardrails at the meta-harness layer, not through prompts. One example pauses an agent after every $100 it spends. Another requires human approval to `git push` once the agent installs a new npm package.
-   **Collaboration** means sharing live agent sessions by URL. Teammates watch the agent work and chat with it in real time. They can comment on files, co-drive the session, or fork the conversation.

An OS sandbox, called Omnibox, underpins this. It can lock down OS access and transform network requests. For instance, it can keep your GitHub token hidden from the agent. The token is injected only in the egress proxy on approved requests.

## **Use Cases and Examples**

**Two example agents ship with the repository:**

-   **Polly** is a multi-agent coding orchestrator. It writes no code itself. It plans, then delegates work to coding sub-agents in parallel git worktrees. Each diff routes to a reviewer from a different vendor than the writer. You merge the result.
-   **Debby** is a brainstorming partner with two heads. One head is Claude, the other GPT. Every question goes to both, with answers shown side by side. Type `/debate` and the heads critique each other before converging.

Other practical patterns follow the same shape. A frontier advisor model can guide a cheaper open-source worker. A lead agent can orchestrate parallel subagents. Different LLMs can handle planning, search, and code generation in one flow.

## **Interactive Concept Demo**

Marktechpost team has created a interactive demo (below) that lets you experience Omnigent’s meta-harness workflow firsthand. You pick a task for the **Polly** orchestrator, which plans it and delegates to three sub-agents: **Claude Code, Codex, and Pi** that are running in parallel and streaming their steps live. A session cost meter ticks up as they work, and the two policy toggles show Omnigent’s control layer in action: the cost budget pauses the run at $3.00 for your approval, and a contextual policy halts a `git push` that follows an npm install until you allow it. Once the sub-agents finish, each diff is cross-reviewed by a different vendor than the one that wrote it, then marked ready to merge. Terminal, Web, and Mobile tabs show the same session staying in sync across interfaces. It’s an illustrative simulation, no live models are called.

## **Omnigent vs a Single Harness**

Capability

Single harness (e.g., Claude Code)

Omnigent meta-harness

Agents and models

One harness; swap models inside it

Claude Code, Codex, Pi, SDKs, custom — interchangeable

Switching cost

Re-integrate per tool

One-line change

Interfaces

Terminal or that tool’s own UI

Terminal, web, desktop, mobile, APIs — same session

Governance

Allow / deny lists, often prompt-based

Stateful contextual policies at the harness layer

Cost control

Manual tracking

Budget policy pauses at set thresholds

Collaboration

Copy-paste between tools

Live shared sessions, co-drive, and fork

Sandbox

Tool-dependent

OS sandbox plus egress-proxy secret injection

Cloud execution

Local machine

Disposable Modal or Daytona sandboxes

License

Varies

Apache 2.0, open source

## **Getting Started**

**Omnigent needs Python 3.12+, Node.js 22 LTS, and tmux. One command installs everything:**

```
curl -fsSL https://omnigent.ai/install.sh | sh
```

**Then set up model credentials:**

```
omni setup
```

Omnigent accepts four credential types. They are a first-party API key and a Claude or ChatGPT subscription. The others are an OpenAI- or Anthropic-compatible gateway and a Databricks workspace. The `/model` command switches models mid-session.

A custom agent is a short YAML file. It declares a prompt, a harness, tools, and optional sub-agents.

```
name: my_agent
prompt: You are a helpful data analyst.

executor:
  harness: claude-sdk          # or: codex, codex-native, claude-native, openai-agents, pi

tools:
  researcher:
    type: agent
    prompt: Search for relevant information and summarize it.
```

**Run it with one command:**

```
omnigent run path/to/my_agent.yaml
```

**Policies use the same YAML approach. This builtin caps spend with a soft warning first:**

```

Policies use the same YAML approach. This builtin caps spend with a soft warning first:

policies:
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params:
      max_cost_usd: 5.00          # hard spend cap
      ask_thresholds_usd: [3.00]  # soft warning on the way
```

Policies stack across three levels. They are server-wide, per-agent, and per-session. The stricter session rules are checked first.

## **Strengths and Limitations**

#### **Strengths**

-   One interface to Claude Code, Codex, Pi, and custom agents
-   Sessions reachable from terminal, web, desktop, and phone
-   Policies that track state, not just allow or deny
-   Live session sharing replaces copy-pasting between tools
-   Cloud sandboxes on Modal and Daytona need no local laptop
-   Apache 2.0 license with targets like Fly.io, Railway, and Render

#### **Limitations**

-   The project is alpha and early in its lifecycle
-   It requires Python, Node.js, and tmux setup
-   You bring your own models, infrastructure, and spend
-   Roadmap items like the Omnigent Server MCP are not shipped yet
-   Off-network teammates need an always-on deployed server to join

* * *

Check out the **[Repo](https://github.com/omnigent-ai/omnigent), [Quick start](https://omnigent.ai/quickstart/install),** and **[Technical details](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) .** Also, feel free to follow us on **[Twitter](https://x.com/intent/follow?screen_name=marktechpost)** and don’t forget to join our **[150k+ML SubReddit](https://www.reddit.com/r/machinelearningnews/)** and Subscribe to **[our Newsletter](https://www.aidevsignals.com/)**. Wait! are you on telegram? **[now you can join us on telegram as well.](https://t.me/machinelearningresearchnews)**

Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? **[Connect with us](https://forms.gle/wbash1wF6efRj8G58)**

[![](https://www.marktechpost.com/wp-content/uploads/2019/06/Screen-Shot-2021-09-14-at-9.02.24-AM-150x150.png)](https://www.marktechpost.com/author/6flvq/)

##### [Asif Razzaq](https://www.marktechpost.com/author/6flvq/)

Asif Razzaq is the CEO of Marktechpost Media Inc.. As a visionary entrepreneur and engineer, Asif is committed to harnessing the potential of Artificial Intelligence for social good. His most recent endeavor is the launch of an Artificial Intelligence Media Platform, Marktechpost, which stands out for its in-depth coverage of machine learning and deep learning news that is both technically sound and easily understandable by a wide audience. The platform boasts of over 2 million monthly views, illustrating its popularity among audiences.
