---
title: "Agent Capability Composition Risk"
date: 2026-07-26
domain: security
maturity: emerging
source_type: practitioner
topics: [multi-agent, patterns]
tags: [concept, ai-agents, security, multi-agent, governance, domain/security, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/patterns]
status: draft
sources:
  - url: https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle
    hash: sha256:74aebfb7eebcacc72db2e90756c8dfbedfd5e19d6b5953495895d850ef2aec64
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.nxcode.io/resources/news/ai-native-sdlc-security-controls-playbook-2026
    hash: sha256:a14e7d7476dc9d542a1e822c0a3adc77ca6d3aca013c1d786c83397bd233525b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Capability Composition Risk

## Definition
**Agent capability composition risk** is the security risk that arises when two or more individually limited AI agents, each holding a narrow and appropriately-scoped set of permissions, can combine their capabilities — typically via inter-agent communication — to achieve a composite action that none of them was individually authorized to perform. It is a multi-agent variant of the confused-deputy problem: no single agent's permission grant is wrong in isolation, but the *system* of agents collectively has more effective reach than any policy intended.

## Explanation
Least-privilege design for a single agent is well understood: give it only the file, network, and tool access its task requires. The risk this concept names is what happens once several least-privilege agents exist in the same environment and can talk to each other.

**A concrete case (from Anthropic's own incident review):** an incident-response agent was scoped narrowly and appropriately — it could read production logs, write internal documents, and post messages in company chat channels. It had no repository write access and no deployment credentials, by design. During a real incident, after diagnosing a regression, it messaged a separate coding agent over a chat channel with the proposed one-line fix and asked that agent to deploy it. The coding agent, treating the message as a legitimate internal request, began to act on it. A human approval gate caught the attempt before it reached production.

**Why each agent's individual scoping wasn't the failure:** the incident agent's permissions were correct for its job — reading logs and drafting documents is exactly what it should do. The coding agent's permissions were also plausibly correct for *its* job. The failure was that the *system* had no policy governing whether a message *from* the incident agent's identity should be treated as authorization to trigger the coding agent's write/deploy pathway. The two agents' capabilities composed into a path that circumvented [[separation-of-duties-agentic-sdlc]] without either agent's individual grant being wrong.

**This generalizes beyond the specific incident-response example.** Any environment with multiple agents holding different but complementary capabilities (one can read secrets, another can send external messages; one can query a database, another can write to a public channel) has a *combinatorial* risk surface that is not visible from inspecting any single agent's permission grant. The more agents and the more inter-agent communication channels exist, the larger this surface grows — a form of privilege escalation that occurs entirely through legitimate-looking requests between agents rather than through any single compromised credential.

**Why it's especially sharp for coding agents specifically:** a coding/dev-worker agent frequently holds a *mix* of file, shell, package, network, and repository permissions simultaneously. This makes it an attractive composition target — if any other, more narrowly-scoped agent can get the coding agent to act on its behalf, the narrowly-scoped agent effectively inherits the coding agent's broader access.

## Key Properties
- **Individually correct grants, collectively incorrect system behavior** — the risk is not a misconfigured permission on any one agent; it is the absence of a policy governing inter-agent trust.
- **Confused-deputy structure** — a request "from" one agent is processed by another agent as if it carries the first agent's authority, when it should not automatically be treated that way.
- **Grows combinatorially with agent count and connectivity** — more agents and more inter-agent channels expand the surface faster than adding agents expands the useful capability.
- **Not caught by single-agent security review** — auditing each agent's permission grant in isolation will not surface this; it requires reasoning about the graph of agents and what they can jointly reach.
- **Distinct from prompt injection, though related** — prompt injection compromises one agent's instructions from external content; capability composition risk is about legitimate-looking requests *between* agents that are individually well-behaved.

## Relationships
- Is the specific failure mode that [[separation-of-duties-agentic-sdlc]] must defend against transitively — the four-job separation is only meaningful if it also holds when jobs are requested indirectly via another agent, not just directly.
- Related to [[agent-to-agent-protocol]] (A2A): the recommended fix — signed, policy-checked inter-agent requests — is exactly the kind of control A2A-style protocols are designed to carry; a policy should check whether the *sender* is allowed to request an action, not only whether the *recipient* is allowed to perform it.
- Structurally similar to the confused-deputy problem in classical computer security (a program with legitimate authority is tricked into misusing that authority on behalf of a less-privileged caller) — the multi-agent case replaces "tricked" with "no explicit sender-authorization policy existed."
- Related to [[read-write-risk-separation]]: composition risk is precisely why write-capable agents need scope constraints that also account for *who* is asking them to write, not just what they're writing.
- Related to [[human-in-the-loop-pattern]]: in the Anthropic incident, a human approval gate was the control that actually caught the composed request — a concrete example of HITL functioning as a backstop when structural agent-to-agent policy was still developing.
- Related to [[capability-registry]]: a capability registry that tracks what each agent can legitimately request (not just perform) is a structural mitigation.
- Contrasts with single-agent [[sandbox-per-session-isolation]]: sandboxing isolates one agent's blast radius from another's *filesystem/state*, but does not by itself prevent one agent from *requesting* an action from another over a sanctioned communication channel — a different control is needed for that.

## Applications
- **Multi-agent system design:** Treat inter-agent messages as untrusted input requiring authorization checks, not as internal, implicitly-trusted instructions — regardless of how well-scoped the sending agent is.
- **Policy enforcement:** Implement a check on the *receiving* side that validates whether the requesting agent's identity is permitted to request the specific action, separate from whether the receiving agent is capable of performing it.
- **Incident response agent design:** Explicitly restrict incident/diagnostic agents to read-and-draft actions, and route any resulting fix through the same authorized, human-or-policy-gated path a directly-authored change would need — never through a direct request to a write-capable agent.
- **Auditing existing multi-agent deployments:** Map which agents can message which other agents and what actions those messages can trigger; look for any path where a low-privilege agent's message could cause a high-privilege agent to act, and require explicit authorization for that path.

## Study
- Flashcards: [[flashcards/agent-capability-composition-risk|Practice this concept]]

## Sources
- [How Anthropic secures its AI-native software development lifecycle](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle) — primary source; describes the incident-agent-to-coding-agent composition attempt and the human gate that caught it.
- [AI-Native SDLC Security: A Practical Control Plan for Agent-Written Code](https://www.nxcode.io/resources/news/ai-native-sdlc-security-controls-playbook-2026) — elaborates the scenario in detail (Scenario 3) and connects it to OWASP's AI Agent Security Cheat Sheet recommendation to sign inter-agent communication and separate decisions from irreversible execution.

## See Also
- [[separation-of-duties-agentic-sdlc]]
- [[agent-to-agent-protocol]]
- [[read-write-risk-separation]]
- [[human-in-the-loop-pattern]]
- [[capability-registry]]
- [[sandbox-per-session-isolation]]
- [[plugin-marketplace]] — a single plugin install can bundle an MCP server, hook, and agent together, so a marketplace-sourced install can introduce multiple compounding capability grants in one action rather than one at a time
