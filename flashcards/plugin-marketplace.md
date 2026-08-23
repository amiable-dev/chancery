---
tags: [flashcards, plugin-marketplace]
sr-due: 2026-07-27
sr-interval: 1
sr-ease: 250
---

# Plugin Marketplace — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:ced0b1 -->
What is a plugin marketplace?
?
A catalogue (`marketplace.json`, with a `name`, `owner`, and `plugins[]` array) that lists installable plugins and where to fetch each from, hosted on an ordinary git repository rather than a centralized registry. Each listed plugin carries its own `.claude-plugin/plugin.json` manifest bundling skills, agents, hooks, MCP servers, and LSP servers into one versioned unit.

## Application <!-- kb:card:19caf0 -->
When would you deliberately set an explicit `version` field on a plugin instead of omitting it?
?
When unreviewed auto-updates on every git commit would be unacceptable — e.g., a plugin touching deploy credentials or other sensitive capabilities. Omitting `version` in a git-hosted marketplace means every commit counts as a new release; setting it means users only get updates when the field is bumped, giving the maintainer explicit control over what ships.

## Relationship <!-- kb:card:639122 -->
How does plugin marketplace distribution relate to the plugin extension trust model?
?
The marketplace schema itself sits at the open end of the trust model spectrum by default — it has no built-in signing, sandboxing, or provenance requirement. Curation (like Anthropic's automated validation and safety screening for `claude-plugins-community`) is a policy an operator layers on top, not a guarantee the protocol enforces. A marketplace's actual trust level depends entirely on what the operator adds.

## Mechanism <!-- kb:card:80c835 -->
Why does copying a plugin into an install-time cache directory break references like `../shared-utils`?
?
Because installation copies only the plugin's own directory into an isolated cache location — files outside that directory are never copied alongside it, so relative paths reaching outside the plugin root resolve to nothing at install time. The documented workaround is symlinks.

## Edge Case <!-- kb:card:06ec46 -->
Why does re-checking reserved marketplace names on every load (not just at registration) matter for security?
?
It closes a time-of-check-to-time-of-use gap: a marketplace could register a non-reserved name that later becomes reserved (e.g., as Anthropic adds official/protected names). Because the check re-runs on every load, that marketplace stops loading and is flagged as untrusted going forward, instead of silently keeping trusted status it obtained before the name was protected.
