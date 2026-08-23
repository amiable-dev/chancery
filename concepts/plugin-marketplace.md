---
title: "Plugin Marketplace"
date: 2026-07-27
domain: ai-agents
maturity: emerging
source_type: vendor-doc
topics: [supply-chain, mcp]
tags: [concept, ai-agents, plugins, distribution, supply-chain, security, domain/ai-agents, maturity/emerging, source-type/vendor-doc, topic/supply-chain, topic/mcp]
status: draft
sources:
  - url: https://code.claude.com/docs/en/plugin-marketplaces
    hash: sha256:4624bf87c49335fb64227bf3e2be29b121e55568227fa497fa220ea1527cb23d
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/anthropics/claude-plugins-official
    hash: sha256:0c81934055f04a45fcff0115c9cde734530262bfa29b6669a8972e954953ca50
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://code.claude.com/docs/en/discover-plugins
    hash: sha256:fbae956be778cdef4df71bd9715d6a24249939a39100ea95c5c3d7c606a2d07b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Plugin Marketplace

## Definition
A **plugin marketplace** is a catalogue — a `marketplace.json` file declaring a `name`, an `owner`, and a `plugins[]` array — that lists installable plugins and where to fetch each one from, hosted on an ordinary git repository rather than a centralized package registry. Each listed plugin is itself a directory carrying a `.claude-plugin/plugin.json` manifest that can bundle skills, agents, hooks, MCP servers, and LSP servers into one versioned, distributable unit.

## Explanation
Where a *skill* solves how an agent capability is authored and packaged, a marketplace solves how it is **distributed**: discovery, versioning, and updates across a team or community, without a central package host.

**Mechanically, it's just git.** A marketplace is a directory with `.claude-plugin/marketplace.json`; hosting it means pushing that directory to GitHub, GitLab, or any other git remote. Users add it with `/plugin marketplace add <path-or-repo>` and install individual plugins with `/plugin install <plugin-name>@<marketplace-name>`, then `/reload-plugins` to activate. There is no equivalent of an npm registry or app store server — the git repository *is* the registry.

**Each `plugins[]` entry's `source` field is polymorphic:**
```json
{ "name": "code-formatter", "source": "./plugins/formatter", "version": "2.1.0" },
{ "name": "deployment-tools", "source": { "source": "github", "repo": "company/deploy-plugin" } }
```
It can be a relative path within the same marketplace repo, or an object pointing at a separate git repository — so a marketplace can bundle plugins it hosts directly, or simply aggregate pointers to plugins hosted elsewhere.

**Versioning has a sharp, easy-to-miss edge.** If a plugin manifest *sets* a `version` field, users only receive an update when that field is bumped — an explicit release model. If `version` is *omitted* and the marketplace is hosted in git, **every commit to the plugin's source counts as a new version** — a continuous-deployment model chosen implicitly, by omission, rather than by explicit design.

**Real-world marketplace tiers exist on a curation spectrum.** Anthropic runs `anthropics/claude-plugins-official` (internal, Anthropic-authored plugins) and a separate `anthropics/claude-plugins-community` marketplace where third-party submissions pass automated validation and safety screening before listing — a middle ground between a fully open registry and a closed, single-author one. This mirrors the general [[plugin-extension-trust-model]] spectrum from open/unvetted to curated to sandboxed.

**Installation copies, it doesn't link.** Installing a plugin copies it into a local cache directory, which means a plugin cannot reference files outside its own directory (`../shared-utils` breaks at install time) — symlinks are the documented workaround. Plugin skills are namespaced by plugin name to avoid collisions, e.g. `/quality-review-plugin:quality-review`.

**Anti-impersonation is name-based, not content-based.** Certain marketplace names (`claude-plugins-official`, `anthropic-marketplace`, `agent-skills`, and impersonating variants) are reserved and blocked for third parties. Critically, this check runs **on every load, not just at registration** — a marketplace that registered a name before it became reserved will stop loading and be reported as untrusted the next time a user refreshes it. There is exactly one marketplace per name per user; registering a second marketplace under a name already in use *replaces* the first, which is a subtle takeover vector if a name is ever abandoned and re-claimed.

## Key Properties
- **No central registry** — distribution is git, hosted anywhere; discovery relies on marketplace URLs being shared, not a canonical index
- **Version resolution is a silent default** — omitting `version` opts a plugin into "every commit is a release," which is easy to do unintentionally
- **Install-time copy breaks external references** — plugins are self-contained by construction; cross-plugin file sharing needs symlinks
- **Reserved names are re-validated continuously**, not just once at marketplace registration
- **Curation is a marketplace-level policy choice, not a protocol guarantee** — the schema itself has no required security review step; screening (as in `claude-plugins-community`) is something a marketplace operator layers on top

## Relationships
- Distributes the unit that [[agent-config-files]]-style skills are packaged into — a marketplace is the delivery mechanism for skills, agents, hooks, MCP servers, and LSP servers bundled together.
- Sits at the open end of the [[plugin-extension-trust-model]] spectrum by default — signing, sandboxing, and provenance are not part of the marketplace schema itself; a marketplace operator must add curation (as Anthropic does for `claude-plugins-community`) to move toward the trust model's safer end.
- Is the concrete distribution surface behind [[supply-chain-endpoint-gap]] — a plugin installed from a third-party marketplace is exactly the kind of on-disk, unbuilt artefact that SBOM and EDR tooling both miss.
- Complements [[shadow-mcp-detection]]: that concept detects *unsanctioned* MCP servers at the network boundary after installation; plugin marketplace trust (reserved names, curation, signing) is the earlier control point, before installation happens.
- Connects to [[agent-capability-composition-risk]]: a plugin can bundle an MCP server, a hook, *and* an agent in one install — meaning marketplace-sourced third-party code can introduce multiple, compounding capability grants in a single action rather than one at a time.

## Applications
- **Team plugin distribution:** a company can host an internal marketplace (e.g., in a private git repo) listing vetted internal tools — commit workflows, PR review agents, deploy helpers — installed the same way as any public marketplace.
- **Choosing a version model deliberately:** set an explicit `version` field for any plugin where unreviewed auto-updates on every commit would be unacceptable (e.g., anything touching deploy credentials); omit it only for low-risk, frequently-iterated internal tools where "always latest" is desired.
- **Vetting before install:** before running `/plugin marketplace add` against a third-party marketplace, check whether it's the reserved-name-protected official/community tier or an arbitrary open one — the latter carries the full weight of [[plugin-extension-trust-model]]'s "open, no sandbox" risk profile.
- **Auditing existing installs:** because installed plugins are copied into a local cache, an inventory of that cache directory is a concrete, checkable list of exactly what third-party code is active — the kind of endpoint-level fact that closes part of the [[supply-chain-endpoint-gap]].

## Sources
- [Create and distribute a plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces) — primary source; full `marketplace.json`/`plugin.json` schema, versioning semantics, reserved names, install/cache behaviour. Fetched 2026-07-27.
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) — real-world official marketplace repo; documents the official vs. community (screened, third-party) marketplace tiers.
- [Discover and install prebuilt plugins](https://code.claude.com/docs/en/discover-plugins) — describes `claude-plugins-community` as passing "automated validation and safety screening" before listing.

## See Also
- [[plugin-extension-trust-model]]
- [[supply-chain-endpoint-gap]]
- [[shadow-mcp-detection]]
- [[agent-capability-composition-risk]]
- [[agent-config-files]]
- [[agent-skills-open-standard]] — marketplaces distribute bundles that often contain skills conforming to this spec; the spec defines the file format, marketplaces add discovery/trust on top
