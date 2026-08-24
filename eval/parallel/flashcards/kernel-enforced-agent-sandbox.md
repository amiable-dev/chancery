---
tags: [flashcards, security, agents, sandboxing, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Kernel-enforced agent sandbox — Flashcards

#flashcards/security

## Definition <!-- kb:card:194fde -->
What makes a kernel-enforced agent sandbox different from a prompt-based or tool-logic restriction?
?
The boundary is held by OS kernel primitives beneath the agent, inherited by every process it spawns — so a prompt-injected or misbehaving agent can't negotiate its way out, it can only run into the wall.

## Filesystem isolation <!-- kb:card:3b34c9 -->
How does the filesystem layer stay safe even under a broad directory grant?
?
Access defaults to deny (ungranted paths don't exist from inside the sandbox), the working directory is read-only until opted in, and dotfiles are masked even when a whole directory is granted — so granting a home directory doesn't hand over SSH keys or credential files.

## Network isolation rationale <!-- kb:card:ed37a7 -->
What is the design rationale behind the network layer's default-deny egress proxy?
?
Exfiltration needs a destination — an allow-list of methods, hosts and paths (with private ranges and cloud metadata endpoints blocked) bounds the damage of a successful injection instead of trying to detect the injection itself.

## Credential injection <!-- kb:card:e3e069 -->
How does credential injection let an agent use a secret it can never read?
?
The agent holds only a placeholder token; the proxy substitutes the real secret solely on requests that already match the allow-list — only the placeholder ever reaches logs, transcripts and model context, so a leaked placeholder is inert off the proxy.

## The general rule <!-- kb:card:839306 -->
What general principle does this sandbox design encode about where controls should live?
?
A control an agent can be talked out of is not a control — enforcement has to sit beneath the agent, in the kernel, not inside its own reasoning or tool logic.
