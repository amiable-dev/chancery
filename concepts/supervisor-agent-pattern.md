---
title: "Supervisor Agent Pattern"
date: 2026-04-14
domain: ai-agents
maturity: established
source_type: practitioner
topics: [multi-agent, orchestration, patterns]
tags: [concept, ai-agents, architecture, patterns, multi-agent, domain/ai-agents, maturity/established, source-type/practitioner, topic/multi-agent, topic/orchestration, topic/patterns]
status: draft

sources:
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    hash: sha256:7380d808df58d13eab6825b0abb44ce95b2e7e379a8882cd80acaee96625d7be
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/engineering/multi-agent-research-system
    hash: sha256:af479a5cbb0b52add5efe63a066a1f713ef4c068d7ff6ad6c9c4bc09b496f026
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://langchain-ai.github.io/langgraph/concepts/multi_agent/
    hash: sha256:cd23991b4e02a17e5a224a1f8265c5a187ab366b40b8f8a14608371feb8f6e25
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Supervisor Agent Pattern

## Definition

A multi-agent architecture pattern in which a **supervisor agent** performs centralised planning and task assignment, delegating work to specialised **worker agents** and deciding at each step which agent to invoke next or when the overall objective has been met. The supervisor manages the workflow; workers execute within their specialisation.

## Explanation

When a problem is complex enough to benefit from specialised sub-agents but coordination overhead would overwhelm any single agent, the Supervisor Pattern provides a clean separation of concerns: one agent plans and orchestrates, others execute.

**Core structure:**
- **Supervisor** — receives the user goal, breaks it into sub-tasks, assigns sub-tasks to the most appropriate worker, aggregates results, and decides if the goal is achieved or if more work is needed.
- **Worker agents** — each has a specific domain or capability. They receive focused tasks from the supervisor and return results without needing to understand the broader goal.

**Decision loop:**  
After each worker returns, the supervisor reassesses: Is the objective met? What's the next agent to invoke? This is often implemented as a ReAct loop at the supervisor level — the supervisor reasons about which worker to call next, observes the result, and iterates.

**Real-world example:**  
Anthropic's Multi-Agent Research System uses this pattern: a central agent plans the research process based on the user query, then dispatches dedicated parallel sub-agents to research individual aspects, and synthesises their outputs. The supervisor handles planning and synthesis; workers handle search and reading.

**Scaling variant — Hierarchical Agent Pattern:**  
When the number of worker agents grows too large for a single supervisor, the pattern extends into a hierarchy: team-level supervisors manage groups of workers, with a master supervisor coordinating the team supervisors. Example: an e-commerce fulfilment system with a master agent → regional supervisors (NA, EU, APAC) → warehouse-level agents (inventory, picking, packing, shipping).

**Comparison to [[react-agent-pattern|ReAct Agent Pattern]]:**  
A single ReAct agent is self-contained and loops alone. The Supervisor Pattern is a coordination layer on top — the supervisor may use ReAct internally, but it primarily manages *other agents* rather than doing the work itself.

## Key Properties

- **Centralised planning** — the supervisor holds the strategic view; workers hold domain expertise
- **Specialisation** — each worker agent has narrow, deep capability; the supervisor has broad, shallow orchestration logic
- **Dynamic task assignment** — the supervisor decides which worker to invoke at runtime, not at design time (unlike static pipelines)
- **Goal-tracking** — the supervisor maintains awareness of the original objective and evaluates progress after each worker response
- **Composable** — workers can themselves be supervisor+worker sub-systems (hierarchical extension)

## Relationships

- Related to [[react-agent-pattern|ReAct Agent Pattern]]: supervisors often implement their coordination logic as a ReAct loop; workers may themselves be ReAct agents
- Related to [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]]: HITL can be inserted as a special "worker" that the supervisor delegates to when human judgment is required
- Related to [[agentic-sdlc|Agentic SDLC (ASDLC)]]: Supervisor Pattern is selected during ASDLC's design phase when complexity warrants centralised planning
- Related to [[agentic-ai-platform-architecture|Agentic AI Platform Architecture]]: the orchestration layer of a full agentic platform provides the infrastructure (agent registry, A2A coordination) that supervisor systems depend on
- Instance of: multi-agent coordination patterns (alongside Event-Driven, Blackboard, and Market-Based patterns from Confluent)

## Applications

**When to use:**
- **Complex, multi-faceted goals** that naturally decompose into sub-tasks with different skill requirements
- **Parallel research or analysis** — fire multiple specialist agents simultaneously for speed
- **Dynamic routing** — the optimal agent for a given sub-task isn't known at design time
- **Enterprise workflow automation** — business processes with distinct functional domains (sales, fulfilment, support) each handled by a specialist agent

**When NOT to use:**
- Simple, linear workflows where a [[react-agent-pattern|ReAct Agent Pattern]] or sequential pipeline is sufficient — the supervisor adds coordination overhead
- When all steps are deterministic and can be hardcoded — no LLM reasoning needed for routing

**[[openclaw|OpenClaw]] analogy:**  
The OpenClaw main session functions as a supervisor — it receives goals and routes sub-tasks to spawned sub-agents (`sessions_spawn`) or background workers. Each sub-agent is a worker specialised to its task.

## Sources

- [From Prompts to Production: a Playbook for Agentic Development](https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/) — InfoQ practitioner playbook
- [Anthropic Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system) — production example of the Supervisor Pattern
- [LangGraph Multi-Agent Concepts](https://langchain-ai.github.io/langgraph/concepts/multi_agent/) — reference implementation

## See Also

- [[react-agent-pattern|ReAct Agent Pattern]]
- [[human-in-the-loop-pattern|Human-in-the-Loop Pattern]]
- [[agentic-sdlc|Agentic SDLC (ASDLC)]]
- [[agentic-ai-platform-architecture|Agentic AI Platform Architecture]]
- [[orchestration-model]]: the next evolution of the supervisor pattern — coordination logic is *learned* end-to-end rather than handwritten in prompt instructions
- [[thinker-worker-verifier-pattern]]: a structured specialisation of supervisor-pattern role decomposition (TRINITY, ICLR 2026)
