# GitHub - obra/superpowers: An agentic skills framework & software development methodology that works.

**Source:** https://github.com/obra/superpowers
**Added:** 2026-08-24
**Tags:** #unsorted

---

> An agentic skills framework & software development methodology that works. - obra/superpowers

---

Superpowers is a complete software development methodology for your coding agents, built on top of a set of composable skills and some initial instructions that make sure your agent uses them.

## Table of Contents

[](#table-of-contents)

-   [How it works](#how-it-works)
-   [Commercial Services](#commercial-services)
-   [Getting Started](#installation)
    -   [Claude Code](#claude-code)
    -   [Antigravity](#antigravity)
    -   [Codex App](#codex-app)
    -   [Codex CLI](#codex-cli)
    -   [Cursor](#cursor)
    -   [Devin CLI](#devin-cli)
    -   [Factory Droid](#factory-droid)
    -   [Gemini CLI](#gemini-cli)
    -   [GitHub Copilot CLI](#github-copilot-cli)
    -   [Grok Build CLI](#grok-build-cli)
    -   [Kimi Code](#kimi-code)
    -   [OpenCode](#opencode)
    -   [Pi](#pi)
    -   [Hermes Agent](#hermes-agent)
-   [The Basic Workflow](#the-basic-workflow)
-   [Community](#community)
-   [What's Inside](#whats-inside)
-   [Philosophy](#philosophy)
-   [Contributing](#contributing)
-   [Updating](#updating)
-   [License](#license)
-   [Visual companion telemetry](#visual-companion-telemetry)

## How it works

[](#how-it-works)

It starts from the moment you fire up your coding agent. As soon as it sees that you're building something, it _doesn't_ just jump into trying to write code. Instead, it steps back and asks you what you're really trying to do.

Once it's teased a spec out of the conversation, it shows it to you in chunks short enough to actually read and digest.

After you've signed off on the design, your agent puts together an implementation plan that's clear enough for an enthusiastic junior engineer with poor taste, no judgement, no project context, and an aversion to testing to follow. It emphasizes true red/green TDD, YAGNI (You Aren't Gonna Need It), and DRY.

Next up, once you say "go", it launches a _subagent-driven-development_ process, having agents work through each engineering task, inspecting and reviewing their work, and continuing forward. It's not uncommon for your agent to work autonomously for a couple hours at a time without deviating from the plan you put together.

There's a bunch more to it, but that's the core of the system. And because the skills trigger automatically, you don't need to do anything special. Your coding agent just has Superpowers.

## Commercial Services

[](#commercial-services)

If you're using Superpowers in enterprise and could benefit from commercial support, additional tooling, or managed spending, please don't hesitate to drop us a line at [sales@primeradiant.com](mailto:sales@primeradiant.com).

## Installation

[](#installation)

Installation differs by harness. If you use more than one, install Superpowers separately for each one.

### Claude Code

[](#claude-code)

Superpowers is available via the [official Claude plugin marketplace](https://claude.com/plugins/superpowers)

#### Official Marketplace

[](#official-marketplace)

-   Install the plugin from Anthropic's official marketplace:
    
    /plugin install superpowers@claude-plugins-official
    

#### Superpowers Marketplace

[](#superpowers-marketplace)

The Superpowers marketplace provides Superpowers and some other related plugins for Claude Code.

-   Register the marketplace:
    
    /plugin marketplace add obra/superpowers-marketplace
    
-   Install the plugin from this marketplace:
    
    /plugin install superpowers@superpowers-marketplace
    

### Antigravity

[](#antigravity)

Install Superpowers as a plugin from this repository:

agy plugin install https://github.com/obra/superpowers

Antigravity runs the plugin's session-start hook, so Superpowers is active from the first message. Reinstall with the same command to update.

### Codex App

[](#codex-app)

Superpowers is available via the [official Codex plugin marketplace](https://github.com/openai/plugins).

-   In the Codex app, click on Plugins in the sidebar.
-   You should see `Superpowers` in the Coding section.
-   Click the `+` next to Superpowers and follow the prompts.

### Codex CLI

[](#codex-cli)

Superpowers is available via the [official Codex plugin marketplace](https://github.com/openai/plugins).

-   Open the plugin search interface:
    
    /plugins
    
-   Search for Superpowers:
    
    superpowers
    
-   Select `Install Plugin`.
    

### Cursor

[](#cursor)

-   In Cursor Agent chat, install from marketplace:
    
    ```
    /add-plugin superpowers
    ```
    
-   Or search for "superpowers" in the plugin marketplace.
    

### Devin CLI

[](#devin-cli)

-   Install the plugin from this repository:
    
    devin plugins install obra/superpowers
    
-   Update to the latest version with:
    
    devin plugins update superpowers
    

### Factory Droid

[](#factory-droid)

-   Register the marketplace:
    
    droid plugin marketplace add https://github.com/obra/superpowers
    
-   Install the plugin:
    
    droid plugin install superpowers@superpowers
    

### Gemini CLI

[](#gemini-cli)

-   Install the extension:
    
    gemini extensions install https://github.com/obra/superpowers
    
-   Update later:
    
    gemini extensions update superpowers
    

### GitHub Copilot CLI

[](#github-copilot-cli)

-   Register the marketplace:
    
    copilot plugin marketplace add obra/superpowers-marketplace
    
-   Install the plugin:
    
    copilot plugin install superpowers@superpowers-marketplace
    

### Grok Build CLI

[](#grok-build-cli)

Superpowers is available via the [official Grok plugin marketplace](https://github.com/xai-org/plugin-marketplace).

-   Install the plugin from xAI's official marketplace:
    
    grok plugin install superpowers@xai-official --trust
    
-   Or open the marketplace in the TUI, search for Superpowers, and install it:
    
    ```
    /marketplace
    ```
    

### Kimi Code

[](#kimi-code)

Superpowers is available in Kimi Code's plugin marketplace.

-   Open Kimi Code's plugin manager:
    
    ```
    /plugins
    ```
    
-   Go to `Marketplace` > `Superpowers` and install it.
    
-   Or install directly from this repository:
    
    ```
    /plugins install https://github.com/obra/superpowers
    ```
    
-   Detailed docs: [docs/README.kimi.md](https://github.com/obra/superpowers/blob/main/docs/README.kimi.md)
    

### OpenCode

[](#opencode)

OpenCode uses its own plugin install; install Superpowers separately even if you already use it in another harness.

-   Tell OpenCode:
    
    ```
    Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
    ```
    
-   Detailed docs: [docs/README.opencode.md](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md)
    

### Pi

[](#pi)

Install Superpowers as a Pi package from this repository:

pi install git:github.com/obra/superpowers

For local development, run Pi with this checkout loaded as a temporary package:

pi -e /path/to/superpowers

The Pi package loads the Superpowers skills and a small extension that injects the `using-superpowers` bootstrap at session startup and again after compaction. Pi has native skills, so no compatibility `Skill` tool is required. Subagent and task-list tools remain optional Pi companion packages.

### Hermes Agent

[](#hermes-agent)

Install Superpowers as a Hermes plugin from this repository:

hermes plugins install obra/superpowers --enable

Restart any active Hermes sessions after installing. Note: Hermes has no post-compaction hook, so a very long session that compacts over its first turn loses the bootstrap — start a fresh session if skills stop triggering.

## The Basic Workflow

[](#the-basic-workflow)

1.  **brainstorming** - Activates before writing code. Refines rough ideas through questions, explores alternatives, presents design in sections for validation. Saves design document.
    
2.  **using-git-worktrees** - Activates after design approval. Creates isolated workspace on new branch, runs project setup, verifies clean test baseline.
    
3.  **writing-plans** - Activates with approved design. Breaks work into bite-sized tasks (2-5 minutes each). Every task has exact file paths, complete code, verification steps.
    
4.  **subagent-driven-development** or **executing-plans** - Activates with plan. Dispatches fresh subagent per task with two-stage review (spec compliance, then code quality), or executes in batches with human checkpoints.
    
5.  **test-driven-development** - Activates during implementation. Enforces RED-GREEN-REFACTOR: write failing test, watch it fail, write minimal code, watch it pass, commit. Deletes code written before tests.
    
6.  **requesting-code-review** - Activates between tasks. Reviews against plan, reports issues by severity. Critical issues block progress.
    
7.  **finishing-a-development-branch** - Activates when tasks complete. Verifies tests, presents options (merge/PR/keep/discard), cleans up worktree.
    

**The agent checks for relevant skills before any task.** Mandatory workflows, not suggestions.

## Community

[](#community)

Superpowers is built by [Jesse Vincent](https://blog.fsck.com/) and the rest of the folks at [Prime Radiant](https://primeradiant.com/).

-   **Discord**: [Join us](https://discord.gg/35wsABTejz) for community support, questions, and sharing what you're building with Superpowers
-   **Issues**: [https://github.com/obra/superpowers/issues](https://github.com/obra/superpowers/issues)
-   **Release announcements**: [Sign up](https://primeradiant.com/superpowers/) to get notified about new versions

## What's Inside

[](#whats-inside)

### Skills Library

[](#skills-library)

**Testing**

-   **test-driven-development** - RED-GREEN-REFACTOR cycle (includes testing anti-patterns reference)

**Debugging**

-   **systematic-debugging** - 4-phase root cause process (includes root-cause-tracing, defense-in-depth, condition-based-waiting techniques)
-   **verification-before-completion** - Ensure it's actually fixed

**Collaboration**

-   **brainstorming** - Socratic design refinement
-   **writing-plans** - Detailed implementation plans
-   **executing-plans** - Batch execution with checkpoints
-   **dispatching-parallel-agents** - Concurrent subagent workflows
-   **requesting-code-review** - Pre-review checklist
-   **receiving-code-review** - Responding to feedback
-   **using-git-worktrees** - Parallel development branches
-   **finishing-a-development-branch** - Merge/PR decision workflow
-   **subagent-driven-development** - Fast iteration with two-stage review (spec compliance, then code quality)

**Meta**

-   **writing-skills** - Create new skills following best practices (includes testing methodology)
-   **using-superpowers** - Introduction to the skills system

## Philosophy

[](#philosophy)

-   **Test-Driven Development** - Write tests first, always
-   **Systematic over ad-hoc** - Process over guessing
-   **Complexity reduction** - Simplicity as primary goal
-   **Evidence over claims** - Verify before declaring success

Read [the original release announcement](https://blog.fsck.com/2025/10/09/superpowers/).

## Contributing

[](#contributing)

The general contribution process for Superpowers is below. Keep in mind that we don't generally accept contributions of new skills and that any updates to skills must work across all of the coding agents we support.

1.  Fork the repository
2.  Switch to the 'dev' branch
3.  Create a branch for your work
4.  Follow the `writing-skills` skill for creating and testing new and modified skills
5.  Submit a PR, being sure to fill in the pull request template.

Skill-behavior tests use the drill eval harness from [superpowers-evals](https://github.com/prime-radiant-inc/superpowers-evals/), cloned into `evals/` — see `evals/README.md` for setup. Plugin-infrastructure tests live at `tests/` and run via the relevant `run-*.sh` or `npm test`.

See `skills/writing-skills/SKILL.md` for the complete guide.

## Updating

[](#updating)

Superpowers updates are somewhat coding-agent dependent, but are often automatic.

## License

[](#license)

MIT License - see LICENSE file for details

## Visual companion telemetry

[](#visual-companion-telemetry)

Because skills and plugins don't provide any feedback to creators, we have no idea how many of you are using Superpowers. By default, the Prime Radiant logo on brainstorming's optional visual companion feature is loaded from our website. It includes the version of Superpowers in use. It does not include any details about your project, prompt, or coding agent. We don't see your clicks or anything about what you're building. This helps us have a rough idea of how many folks are using Superpowers and which version of Superpowers they're using. It's 100% optional. To disable this, set the environment variable `SUPERPOWERS_DISABLE_TELEMETRY` to any true value. Superpowers also honors Claude Code's `DISABLE_TELEMETRY` and `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` opt-outs.
