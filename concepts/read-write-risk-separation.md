---
title: "Read-Write Risk Separation"
date: 2026-07-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [patterns, safety]
tags: [concept, ai-agents, safety, governance, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/patterns, topic/safety]
status: draft
sources:
  - url: https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/
    hash: sha256:98569296763f146a6a01b895405a16ace647694b25d45fc669dcf276959a559b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Read-Write Risk Separation

## Definition
A safety design principle for agentic systems holding that read operations (fetching, inspecting, summarizing data) and write operations (modifying production systems, sending communications, taking irreversible actions) belong to fundamentally different risk categories, and an agent's permission boundaries should be designed to reflect that difference from the start rather than granting broad, undifferentiated access by default.

## Explanation
LLMs can hallucinate, reason incorrectly, and produce wrong answers with high confidence — and they do so in ways that are not reliably self-detectable. For a read-only agent, the cost of this is bounded: a wrong summary or a bad search result is annoying but recoverable, because nothing in the world has changed as a result. For an agent with write access — to a database, a production config, a user-facing communication channel — the same confident-but-wrong output becomes an action with real, potentially irreversible consequences.

The principle argues for treating these as different risk tiers rather than a single "agent has tool access" category, with three concrete mechanisms:
- **Output validation before any write executes** — a check between the model's proposed action and its execution, so a malformed or nonsensical write is caught rather than applied.
- **Scope constraints** — limiting *what* the agent can touch even when it has write access at all (e.g., a specific table, a specific channel, a specific set of files), so a wrong decision has a bounded blast radius rather than system-wide reach.
- **Human-in-the-loop confirmation for high-stakes or irreversible actions** — inserting a human checkpoint specifically at the moment before an action that can't be easily undone, rather than for every action uniformly.

The underlying design move is to size permissions to actual risk rather than granting broad access by default and hoping validation elsewhere catches problems — i.e., permission boundaries should be a deliberate design decision per capability, not an afterthought bolted on once something has already gone wrong.

## Key Properties
- Risk categorization is binary at the top level (read vs. write) but the mitigations are graduated — not every write needs a human checkpoint, only high-stakes or irreversible ones.
- Scope constraints and output validation are preventive (reduce the chance or impact of a bad write); human-in-the-loop is a circuit breaker (stops a specific action before it executes).
- This is a permission-boundary-by-default posture, not a one-time audit — it needs to be reflected in how each new tool or capability is granted, not just reviewed periodically.
- Directly connects to [[agentic-error-compounding]]: since agent errors compound across steps, a wrong write is far more dangerous than a wrong read precisely because it changes the state subsequent steps (and other systems/people) will act on.

## Relationships
- Builds on [[ai-agent-anti-patterns]]: this is the fix for the "ungoverned write access" anti-pattern (#7 in the catalogue).
- Related to [[human-in-the-loop-pattern]]: HITL is the specific mechanism this principle prescribes for high-stakes/irreversible writes.
- Related to [[tool-output-inspection]]: output validation before a write is a form of tool output inspection applied specifically at the read/write boundary.
- Related to [[agentic-error-compounding]]: explains why write actions specifically (not reads) are the primary vector for compounding damage.
- Related to [[constrained-agent-actions]]: constraining an agent's output vocabulary is a complementary mechanism for reducing the risk surface of write-capable decisions.

## Applications
Apply when granting a new tool or capability to an agent: first ask whether it reads or writes, then ask what the actual blast radius of a wrong write would be. Use that answer to decide the mitigation tier — pure validation for low-stakes, reversible writes (e.g., updating a draft note); scope constraints plus validation for medium-stakes writes (e.g., updating a specific database row); human-in-the-loop confirmation for high-stakes or irreversible writes (e.g., sending an external communication, deleting data, executing a financial transaction).

## Study
- Flashcards: [[flashcards/read-write-risk-separation|Practice this concept]]

## Sources
- [Building AI Agents? Here Are Some Anti-Patterns to Avoid](https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/) — source of the read/write risk-category framing and the three mitigation mechanisms.

## See Also
- [[ai-agent-anti-patterns]]
- [[human-in-the-loop-pattern]]
- [[tool-output-inspection]]
- [[agentic-error-compounding]]
- [[constrained-agent-actions]]
- [[agent-capability-composition-risk]]: composition risk is exactly why write-capable agents need scope constraints that also account for *who* is asking them to write, not just what they're writing
