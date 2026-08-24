# OpenClaw Docs

**Source:** https://docs.openclaw.ai/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> OpenClaw is a multi-channel gateway for AI agents that runs on any OS.

---

## OpenClaw 🦞

![OpenClaw](https://docs.openclaw.ai/assets/openclaw-hero-light.png) ![OpenClaw](https://docs.openclaw.ai/assets/openclaw-hero-dark.png)

> _"EXFOLIATE! EXFOLIATE!"_ — A space lobster, probably

**Any OS gateway for AI agents across Discord, Google Chat, iMessage, Matrix, Microsoft Teams, Signal, Slack, Telegram, WhatsApp, Zalo, and more.**

Send a message, get an agent response from your pocket. Run one Gateway across channel plugins, WebChat, and mobile nodes.

Developed in the open by the [OpenClaw Foundation](https://openclaw.org/), a non-profit.

## Browse docs

Mobile browsers may show the section menu without the full desktop tab bar. Use these hub links to reach the same top-level docs areas from the page body.

[

**Get started**

Overview, showcase, first steps, and setup guides.



](https://docs.openclaw.ai/)[

**Install**

Install paths, updates, containers, hosting, and advanced setup.



](https://docs.openclaw.ai/install)[

**Channels**

Messaging channels, pairing, routing, access groups, and channel QA.



](https://docs.openclaw.ai/channels)[

**Agents**

Architecture, sessions, context, memory, and multi-agent routing.



](https://docs.openclaw.ai/concepts/architecture)[

**Capabilities**

Tools, skills, cron, webhooks, and automation capabilities.



](https://docs.openclaw.ai/tools)[

**ClawHub**

Plugin marketplace, publishing, curation, and trust guidance.



](https://docs.openclaw.ai/clawhub)[

**Models**

Providers, model configuration, failover, and local model services.



](https://docs.openclaw.ai/providers)[

**Platforms**

macOS, Windows, iOS, Android, nodes, and web surfaces.



](https://docs.openclaw.ai/platforms)[

**Gateway & Ops**

Gateway configuration, security, diagnostics, and operations.



](https://docs.openclaw.ai/gateway)[

**Reference**

CLI reference, schemas, RPC, release notes, and templates.



](https://docs.openclaw.ai/cli)[

**Help**

Troubleshooting, FAQs, testing, diagnostics, and environment checks.



](https://docs.openclaw.ai/help)

## What is OpenClaw?

OpenClaw is a **self-hosted gateway** that connects your favorite chat apps — Discord, Google Chat, iMessage, Matrix, Microsoft Teams, Signal, Slack, Telegram, WhatsApp, Zalo, and more via channel plugins — to AI coding agents. You run a single Gateway process on your own machine (or a server), and it becomes the bridge between your messaging apps and an always-available AI assistant.

**Who is it for?** Developers and power users who want a personal AI assistant they can message from anywhere — without giving up control of their data or relying on a hosted service.

**What makes it different?**

-   **Self-hosted**: runs on your hardware, your rules
-   **Multi-channel**: one Gateway serves every configured channel plugin simultaneously
-   **Agent-native**: built for coding agents with tool use, sessions, memory, and multi-agent routing
-   **Open source**: MIT licensed, community-driven

**What do you need?** Node 26 (recommended), or another supported release: Node 22.22.3+, Node 24.15+, or Node 25.9+. You also need an API key from your chosen provider and 5 minutes. For best quality and security, use the strongest latest-generation model available.

## How it works

```
flowchart LR
  A["Chat apps + plugins"] --> B["Gateway"]
  B --> C["OpenClaw agent"]
  B --> D["CLI"]
  B --> E["Web Control UI"]
  B --> F["macOS app"]
  B --> G["iOS and Android nodes"]
```

The Gateway is the single source of truth for sessions, routing, and channel connections.

## Key capabilities

[

**Multi-channel gateway**

Discord, iMessage, Signal, Slack, Telegram, WhatsApp, WebChat, and more with a single Gateway process.



](https://docs.openclaw.ai/channels)[

**Plugin channels**

Channel plugins add Matrix, Nostr, Twitch, Zalo, and more; official plugins install on demand.



](https://docs.openclaw.ai/tools/plugin)[

**Multi-agent routing**

Isolated sessions per agent, workspace, or sender.



](https://docs.openclaw.ai/concepts/multi-agent)[

**Media support**

Send and receive images, audio, and documents.



](https://docs.openclaw.ai/nodes/images)[

**Web Control UI**

Browser dashboard for chat, config, sessions, and nodes.



](https://docs.openclaw.ai/web/control-ui)[

**Mobile nodes**

Pair iOS and Android nodes for camera, screen, and voice-enabled workflows.



](https://docs.openclaw.ai/nodes)

## Quick start

-   ### Install OpenClaw
    
    On npm 12 or npm 11.16+:
    
    bash
    
    ```
    npm install -g openclaw@latest --allow-scripts=openclaw
    ```
    
    On npm 11.15 and earlier, omit `--allow-scripts=openclaw`.
    
-   ### Onboard and install the service
    
    bash
    
    ```
    openclaw onboard --install-daemon
    ```
    
-   ### Chat
    
    Open the Control UI in your browser and send a message:
    
    bash
    
    ```
    openclaw dashboard
    ```
    
    Or connect a channel ([Telegram](https://docs.openclaw.ai/channels/telegram) is fastest) and chat from your phone.
    

Need the full install and dev setup? See [Getting Started](https://docs.openclaw.ai/start/getting-started).

## Dashboard

Open the browser Control UI after the Gateway starts.

-   Local default: [http://127.0.0.1:18789/](http://127.0.0.1:18789/)
-   Remote access: [Web surfaces](https://docs.openclaw.ai/web) and [Tailscale](https://docs.openclaw.ai/gateway/tailscale)

![OpenClaw](https://docs.openclaw.ai/whatsapp-openclaw.jpg)

## Configuration (optional)

Config lives at `~/.openclaw/openclaw.json`.

-   If you **do nothing**, OpenClaw uses the bundled OpenClaw agent runtime; DMs share the agent's main session, and each group chat gets its own session.
-   If you want to lock it down, start with `channels.whatsapp.allowFrom` and (for groups) mention rules.

Example:

json5

```
{  channels: {    whatsapp: {      allowFrom: ["+15555550123"],      groups: { "*": { requireMention: true } },    },  },  messages: { groupChat: { mentionPatterns: ["@openclaw"] } },}
```

## Start here

[

**Docs hubs**

All docs and guides, organized by use case.



](https://docs.openclaw.ai/start/hubs)[

**Configuration**

Core Gateway settings, tokens, and provider config.



](https://docs.openclaw.ai/gateway/configuration)[

**Remote access**

SSH and tailnet access patterns.



](https://docs.openclaw.ai/gateway/remote)[

**Channels**

Channel-specific setup for Discord, Feishu, Microsoft Teams, Telegram, WhatsApp, and more.



](https://docs.openclaw.ai/channels/telegram)[

**Nodes**

iOS and Android nodes with pairing, camera, screen, and device actions.



](https://docs.openclaw.ai/nodes)[

**Help**

Common fixes and troubleshooting entry point.



](https://docs.openclaw.ai/help)

## Learn more
