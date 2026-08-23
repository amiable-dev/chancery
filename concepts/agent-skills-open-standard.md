---
title: "Agent Skills Open Standard (SKILL.md Specification)"
aliases: ["Agent Skills Open Standard (SKILL.md Specification)"]
date: 2026-07-27
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [protocols, context-engineering]
tags: [concept, ai-agents, standards, interoperability, context-engineering, skills, domain/standards, maturity/emerging, source-type/vendor-doc, topic/protocols, topic/context-engineering]
status: draft
sources:
  - url: https://agentskills.io/specification.md
    hash: sha256:2b1dbb4fd80c31748d15812c4ebd3e66c09383d0c792801f617718684489e40d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://agentskills.io/home
    hash: sha256:60403a5b54531e66647bc330f08ad149e07d1de303baf1c203deba27a79e8e1b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.agensi.io/learn/agent-skills-open-standard
    hash: sha256:4fbc40f478d4f42408851c65870d67395081973ab2f9970628d15841ad33fb12
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://neuralcoretech.com/agent-skills-open-standard-ai-agents/
    hash: sha256:e1097872ac1c53a949aff70aba9e4e6cb7448049a36cf78d83877d358d7ee6d9
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Skills Open Standard (SKILL.md Specification)

## Definition

The **Agent Skills open standard** is a formal, cross-vendor specification (hosted at **agentskills.io**) for `SKILL.md` — a single Markdown file with YAML frontmatter that packages a reusable agent capability. It defines the exact directory layout, the frontmatter schema, and a three-tier progressive-loading model, so that the *same* skill directory can be read unmodified by competing agent products. It is distinct from [[reusable-agent-skills|the general practice of writing reusable skills]]: that concept describes the pattern, this concept is the ratified spec that pattern now has to conform to.

## Explanation

Originally developed by Anthropic and released as an independent open standard, Agent Skills has become the most widely adopted of the agent-primitive standards — notably more so than heavier proposals like [[model-context-protocol|MCP]] or [[agentic-resource-discovery|ARD]]. The client showcase at agentskills.io lists direct competitors reading identical files: Claude Code, OpenAI Codex, Google's Gemini CLI, GitHub Copilot, VS Code, Cursor, JetBrains Junie, Block's Goose, OpenCode, OpenHands, Letta, and Amp, among others.

**Why it spread where other standards haven't:** the whole format is a directory with one required file, two required fields (`name`, `description`), and a convention for lazy-loading the rest. There is no negotiation protocol, no runtime handshake, no server to stand up — it is closer to a filesystem convention than a network protocol, which sharply lowers the cost of any given vendor supporting it.

**The complete frontmatter schema:**

| Field | Required | Constraints |
|---|---|---|
| `name` | Yes | ≤64 chars; lowercase alphanumeric + hyphens; no leading/trailing/consecutive hyphens; must match the parent directory name |
| `description` | Yes | ≤1024 chars, non-empty; must describe *what it does* and *when to use it*, with keywords the agent can match against |
| `license` | No | License name or reference to a bundled license file |
| `compatibility` | No | ≤500 chars; environment requirements — intended product, system packages, network access |
| `metadata` | No | Free-form string→string map for client-specific properties (this is also where version pinning is pushed — see Key Properties) |
| `allowed-tools` | No | Space-separated pre-approved tool list, e.g. `Bash(git:*) Bash(jq:*) Read`. **Experimental** — the only security-adjacent field in the spec, and support varies by implementation |

**Directory layout:**
```
skill-name/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation loaded on demand
└── assets/           # Optional: templates, resources
```

**The three-tier progressive disclosure model** (with explicit token budgets, not just informal guidance):
1. **Metadata** (~100 tokens) — `name` + `description` for *every* installed skill, loaded at agent startup
2. **Instructions** (<5000 tokens recommended) — the full `SKILL.md` body, loaded only once the skill activates
3. **Resources** (as needed) — files under `scripts/`, `references/`, `assets/`, loaded only when the task actually requires them

This is the same mechanism described more generally in [[progressive-disclosure-agents]], but here it is a normative part of a spec rather than an emergent architectural pattern — the spec sets concrete token-budget targets (500-line ceiling on `SKILL.md`, one-level-deep file references) that authors are expected to design against.

**Validation tooling:** the reference implementation ships `skills-ref`, invoked as `skills-ref validate ./my-skill`, which checks frontmatter validity and naming conventions against the spec — a concrete artifact for CI gating, not just a paper standard.

## Key Properties

- **Two required fields only** (`name`, `description`) — the entire mandatory surface area of the format
- **No version field at the top level** — versioning is unspecified and relegated to the free-form `metadata` map; there is no dependency resolution or compatibility-range mechanism, a real gap for anything distributed at scale
- **No signing or provenance in the spec itself** — trust, packaging, and distribution live in vendor-specific plugin/marketplace layers (see [[plugin-marketplace]]), not in the standard
- **`allowed-tools` is the only security-relevant field, and it's experimental** — the spec does not yet standardize sandboxing or capability scoping
- **Directory-name/`name`-field coupling is enforced** — this is what lets tooling (like `skills-ref`) validate mechanically rather than just by convention
- **Description quality is the actual trigger mechanism** — the spec explicitly instructs authors to write for agent activation, not just human readers, turning a documentation task into something closer to prompt engineering

## Relationships

- Formalizes [[reusable-agent-skills]]: that concept describes the practice (lazy-loaded, task-scoped procedures); this concept is the ratified cross-vendor spec the practice now converges on
- Normative instance of [[progressive-disclosure-agents]]: the three-tier loading model here has concrete token budgets, whereas the general concept describes the pattern without prescribing numbers
- Contrasts with [[agent-config-files]]: config files are always-on and per-project; skills are on-demand and (per this standard) portable across projects and vendors
- Adjacent to [[plugin-marketplace]] and [[isv-distribution-platform]]: the standard defines the *file format*, but distribution, discovery, and trust are left to marketplace layers built on top of it
- Related to [[agent-capability-composition-risk]]: as skill counts grow per agent, the `allowed-tools` field's experimental/inconsistent status becomes a governance gap
- Related to [[llms-txt]]: agentskills.io's own documentation is indexed via an `llms.txt` file, making the standard's own docs a live example of that other convention

## Applications

- **Compliance auditing:** run `skills-ref validate ./skill-dir` across a `skills/` directory to confirm every skill is spec-compliant before publishing or sharing it — OpenClaw's own `skills/<name>/SKILL.md` layout (`name` + `description` frontmatter) is spec-compliant as-is.
- **Portability as a hedge against lock-in:** skills written to this spec are, in principle, loadable by Cursor, Codex, Gemini CLI, or Goose without modification — directly relevant to [[agent-memory-lock-in]] risk analysis.
- **Description-first authoring:** since `description` is the sole activation signal, write it as a triggering prompt ("what it does and when to use it," with keywords) rather than generic documentation — a lesson worth folding into any `skill-creator`-style workflow.
- **CI gating for published skills:** wire `skills-ref validate` into a pipeline for any skill intended for external distribution, given the lack of a version/dependency model to fall back on.

## Sources

- [Agent Skills Specification](https://agentskills.io/specification.md) — primary source, complete format spec. Fetched 2026-07-27.
- [Agent Skills Overview](https://agentskills.io/home) — official overview and per-vendor client showcase.
- [What Is the Agent Skills Open Standard?](https://www.agensi.io/learn/agent-skills-open-standard) — secondary summary confirming Claude Code, Cursor, Codex CLI, OpenCode adoption.
- [neuralcoretech.com: Agent Skills — The Open Standard for AI Agents](https://neuralcoretech.com/agent-skills-open-standard-ai-agents/) — secondary; source of the disputed 2025-12-18 publication date and "32 tools by March 2026" adoption figures (unverified, marketing-adjacent).

## See Also

- [[reusable-agent-skills]]
- [[progressive-disclosure-agents]]
- [[agent-config-files]]
- [[plugin-marketplace]]
- [[llms-txt]]
- [[agent-memory-lock-in]]
