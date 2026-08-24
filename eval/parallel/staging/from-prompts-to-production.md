# From Prompts to Production: a Playbook for Agentic Development

**Source:** https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> In this article, author Abhishek Goswami shares a practitioner's playbook with development practices, that describes building agentic AI applications and scaling them in production.

---

### Key Takeaways

-   Instead of applying traditional software development life cycle (SDLC) to autonomous agentic AI systems, we need a new agentic software development life cycle (ASDLC) that emphasizes not just what agents should do, but also what they must never do.
-   Agentic system development need not be ad-hoc. Reusable patterns exist that address common agentic challenges, such as Supervisor Pattern, ReAct Agents, and Human-in-the-Loop. We need a way to integrate these in the regular development process without restricting developer creativity.
-   Prompts, tool manifests, policy configurations, memory schemas, and evaluation datasets require versioning and systematic Infrastructure-as-Code treatment. We need a way to reduce prompt-related production failures and to use version control, semantic diffing, and formal change approval processes.
-   Agentic systems require fundamentally different quality assurance approaches that are more behavioral in nature. We need specific tools and methodologies that help formalize this process and integrate it with standard development practices.
-   Model Context Protocol (MCP) provides vendor-neutral standards for agent-tool integration, reducing integration development time and improving maintainability. We need an integrated development experience with MCP's JSON-RPC 2.0 to be adopted by OpenAI, Google DeepMind, and Microsoft.

Large language models (LLMs) generate text from a learned probability distribution. On their own, they do not have the ability to take real-world actions. Agentic AI is the layer that wraps an LLM in an iterative process of improvement involving reflection, tool use, planning, and multiagent collaboration. It is the bridge between the core technology of LLMs (such as GPT-5, Claude Opus 4.1, etc.) and real-world business value. Therefore, it is absolutely essential for enterprises to learn how to develop, ship, secure, and operate Agentic AI applications in production.

This article is a practitioner's playbook that describes building agentic AI applications and scaling them in production. This article focuses on development practices setting developers on a path to scaling agents in production.

## Introduction

Andrew Ng, cofounder of [Google Brain](https://en.wikipedia.org/wiki/Google_Brain) and one of AI's most influential experts, mentioned in his "[Letters from Andrew Ng](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/)" blog that Agentic AI will dominate most of the progress in AI because of its unprecedented practical applications. It therefore has the potential to drive business processes, as articulated in this [Agentic Design Patterns](https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-3-tool-use/) letter.

Agentic AI builds on the concept of reasoning, taking actions and then reasoning again until the LLM concludes that the goal of a particular execution has been achieved. That's why, in a study conducted on various agentic methodologies, while a zero-shot approach with GPT-3.5 and GPT-4 at coding benchmarks achieved about [48% and 67% accuracy](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/), respectively, Agentic AI's iterative looping over GPT-3.5 achieved 95.1% accuracy.

The foundational model improvements from GPT-3.5 to GPT-4 are overshadowed by iterative agentic looping mechanisms even with relatively outdated models. What does this mean for enterprises? According to Andrew Ng, in this [Scale Up Interview](https://www.insightpartners.com/ideas/andrew-ng-why-agentic-ai-is-the-smart-bet-for-most-enterprises/), it means that building practical applications with agentic AI should be a priority for most businesses, rather than chasing the latest foundational models.

**The Prototype to Production Gap**

Traditional software development involves prototyping to prove a concept and then following an almost similar, but larger scale, process to build and deploy in production. For Agentic AI, the concept remains largely the same, notwithstanding a fundamental difference: agents are not behaviorally consistent, so the controlled environment of a prototype does not represent a real-world environment. With agentic systems, we're dealing with nondeterministic behavior, emergent capabilities, and autonomous decision-making. For example, testing a nondeterministic system is a fundamental departure from the established software engineering practice of expressing test scenarios in terms of inputs and fixed expected outputs.

## Understanding Agentic Development

Enterprise teams are constantly trying to increase their Agentic AI footprint and, in doing so, are facing the classical problem of product-market fit. The dilemma where it all begins, starts with two diametrically opposite questions:

"Do I see a real-world problem that can be solved by the application of Agentic AI?"

**vs.**

"Given that I want to apply Agentic AI, which of my existing problems are the best candidates?"

The key is to understand that a fixed deterministic workflow involving almost no subjective decisions would be better done using a traditional approach. Agentic AI excels when nondeterministic decisions are involved, with the possibility of taking real-world actions based on those decisions.

The SDLC for AI systems fundamentally has different properties. [Agile research](https://arxiv.org/abs/2501.09434) by A. Gill identifies six attributes that differentiate AI systems from conventional software: autonomy, adaptiveness, content generation, decision-making, predictability, and recommendation capabilities. These attributes require what is termed "decision science integration within agile SDLC frameworks", moving beyond feature development to behavioral orchestration.

Likewise, the International Organization for Standardization established the first comprehensive framework for AI system development by publishing [ISO/IEC 5338:2023](https://www.iso.org/standard/81118.html), "Information technology – Artificial intelligence – AI system life cycle processes". This standard emphasizes risk management throughout development and explicitly addresses the challenges of autonomous system behavior verification.

These paradigms reflect deeper changes in how we should conceive software creation for nondeterministic systems.

## Architecture and Design Patterns

Before diving deeper into development practices let us review some architecture and design patterns helpful for agentic application development. These general design patterns can be used by developers to streamline agentic application development.

Agents control input/output to and from the LLM such that the LLM always returns a structured output which can be interpreted and translated into one or more function calls (called the agent's tools). The agent simply looks up the tool in its pool of tool references and calls it with the arguments provided by the LLM output.

This process can be done just once, or in a loop following various design patterns.

### Core Architecture Patterns for Agentic Application Development

There are some core patterns covering a majority of production use cases. Developers of agentic applications need to be comfortable with these core patterns.

#### ReAct Agent

The ReAct agent is based on the foundational paper published on the subject and can be found here, [ReAct Agent](https://arxiv.org/abs/2210.03629). [ReAct](https://arxiv.org/abs/2210.03629) is one of the most versatile agent patterns. It is composed of a loop between the Agent, LLM, and tool calls until a breaking condition is met or induced via external logic.

The below depiction of a high level ReAct agent loop shows what happens in a single loop interaction. The steps are numbered sequentially from one to eight. These steps are repeated in every iteration until a breaking condition is met.

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/179figure-1-1770382724623.jpg)

**Figure 1: ReAct Agent Loop**

The ReAct pattern is particularly effective for workflows where the agent must iteratively investigate a problem. For example, a database debugging agent might execute a query, analyze the slow performance, examine existing indexes, and continue this loop until a root cause is found.

Below is a pseudocode snippet for a core ReAct loop (Reason → Act → Observe)

```
def react_agent_loop(user_query, available_tools, max_iterations=5):
    """
    ReAct pattern: Iterative reasoning and action until goal achieved
    """
    conversation_history = []
    conversation_history.append({"role": "user", "content": user_query})
    
    for iteration in range(max_iterations):
        # STEP 1: Reason - LLM decides next action
        llm_response = llm_client.generate(
            messages=conversation_history,
            tools=available_tools,
            temperature=0.7
        )
        
        # STEP 2: Act - Execute tool if LLM chose one
        if llm_response.has_tool_call():
            tool_name = llm_response.tool_call.name
            tool_args = llm_response.tool_call.arguments
            
            # Execute the selected tool
            tool_result = execute_tool(tool_name, tool_args, available_tools)
            
            # Add tool result to conversation
            conversation_history.append({
                "role": "assistant",
                "content": None,
                "tool_calls": [llm_response.tool_call]
            })
            conversation_history.append({
                "role": "tool",
                "content": tool_result,
                "tool_call_id": llm_response.tool_call.id
            })
            
            # STEP 3: Observe - Check if we should continue
            if should_terminate(tool_result, user_query):
                break
        else:
            # LLM provided final answer without tool use
            return llm_response.content
    
    # Generate final response after all iterations
    final_response = llm_client.generate(
        messages=conversation_history + [{
            "role": "user",
            "content": "Provide final answer based on above"
        }]
    )
    return final_response.content


def should_terminate(tool_result, original_query):
    """
    Breaking condition logic - could be:
    - Explicit completion signal from LLM.
    - Confidence threshold met.
    - Error state requiring human intervention (Human in the loop)
    """
    if "COMPLETE" in tool_result:
        return True
    if "ERROR" in tool_result and "ESCALATE" in tool_result:
        return True
    return False
```

#### Supervisor Agent Pattern

In a multi-agent environment where the use cases are complex enough, it often helps to have centralized planning before carrying out individual tasks. This pattern consists of a supervisor agent for centralized planning and assigning work to several specialized worker agents. The supervisor decides at each step which agent to invoke next or end the workflow if the objectives have been met. A real-world example of this pattern is Anthropic's [Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system), which uses multiple agents to explore complex research topics with a central agent that plans the research process based on user queries and then uses dedicated parallel agents to perform individual steps of the plan.

Figure 2 below shows how a supervisor agent would look like:

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/137figure-2-1770382724623.jpg)

**Figure 2: Supervisor Agent Pattern**

\[Click here to [expand image above to full-size](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/137figure-2-1770382724623.jpg)\]

#### Hierarchical Agent Pattern

When there are too many worker agents for a given supervisor, the agentic system becomes inefficient and a hierarchical system can solve the problem by creating teams of agents each with its own supervisor and a higher level supervisor to manage the team level supervisors.

For Example, an e-commerce order fulfillment system might use a hierarchical pattern where a master fulfillment agent coordinates regional supervisors (e.g., North America, Europe, Asia), each managing specialized warehouse agents for inventory checking, picking, packing, and shipping.

Below is a depiction of the [Hierarchical agent pattern](https://langchain-ai.github.io/langgraph/concepts/multi_agent/):

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/116figure-3-1770382724623.jpg)

**Figure 3: Hierarchical Agents**

\[Click here to [expand image above to full-size](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/116figure-3-1770382724623.jpg)\]

#### Human-in-the-Loop Pattern

Many workflows have decision points that can be unblocked only by human oversight and approval. These scenarios can benefit from a combination of AI driven efficiency and human-provided decisions or reviews to unlock enormous productivity. The [Magentic-UI](https://langchain-ai.github.io/langgraph/concepts/multi_agent/) research by Microsoft is specifically focused on human-in-the-loop agentic systems.

Let us consider a loan approval workflow as an example to illustrate this pattern.

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/82figure-4-1770382724623.jpg)

**Figure 4: Human in the Loop Pattern**

### Additional Patterns Reference

Other Agentic AI patterns are listed in the table below with links for further exploration of each specific pattern.

**Pattern**

**Description**

**Authority Source**

**When to use**

Sequential Orchestration

Linear pipeline processing

[Microsoft AI Agents Orchestration Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

When workflow has clear step-by-step dependencies.

Concurrent Orchestration

Parallel task execution

Microsoft AI Agents Orchestration Patterns

When workflow has independent parallel tasks.

Handoff Pattern

Task passing between agents

Microsoft AI Agents Orchestration Patterns

When the most optimal agent for some task is not known in advance and assigned during workflow.

Event-Driven Pattern

Asynchronous coordination

[Confluent: Event Driven Multi Agent Systems](https://www.confluent.io/blog/event-driven-multi-agent-systems/)

Scalable distributed systems

Scheduler-Agent-Supervisor

Enterprise workflow management

[Microsoft Scheduler Agent Supervisor](https://learn.microsoft.com/en-us/azure/architecture/patterns/scheduler-agent-supervisor)

Complex business processes

Blackboard Pattern

Shared knowledge coordination

Confluent: Event Driven Multi Agent Systems

Knowledge intensive tasks

Market-Based Pattern

Economic coordination mechanisms

Confluent: Event Driven Multi Agent Systems

Resource allocation scenarios

**Table 1: Reference Table for Other Patterns**

## Planning Your Agentic Implementation

As a first step, a practical way of isolating parts of your application suitable for agentic AI is by asking a few simple questions and answering them iteratively. The evolution of your answers over multiple iterations helps streamline decision making.

**Question**

**Purpose**

**Iteration 1**

**Iteration 2**

**Iteration 3**

**Do I have well-defined workflows in the application?**

Identify application scopes and boundaries before identifying agentic components.

Yes. There are some clearly defined workflows where individual steps can be identified.  
There are some others that need clarification.

Yes. All my workflows are complete and clearly defined (provide link to documentation).

All workflows documented.

**Which workflow steps involve nondeterministic decision making?**

Identify where LLM reasoning adds value vs. deterministic logic.

The following are clear as of now –  
Workflow 1, Step 3  
Workflow 3, Step 2  
…

The list is complete. Added: Workflow 2, Step 1; Workflow 4, Step 5.

Complete mapping with reasoning requirements documented.

**Have we prepared a capability matrix (see Table 3) for each of these workflows?**

Isolate deterministic and agentic components to optimize cost and reliability.

Workflow 1 capability matrix is ready.

The capability matrix for all workflows is ready.

All matrices reviewed and validated.

**Have we identified tool requirements for each agent?**

Determine architecture patterns (ReAct, Supervisor) and integration complexity.

Initial list: Database access, email API, payment gateway for Workflow 1

Complete tool inventory with authorization requirements mapped (provide documentation link).

Tool manifests created and MCP (Model Context Protocol) schemas defined.

**Have we identified input/output contracts for each agentic component?**

Define clear interfaces to enable testing and reduce unexpected behaviors.

Drafted contracts for 3 out of 7 agentic components.

All contracts are defined. Need validation on data formats.

Contracts validated with sample data.(provide documentation link).

**Do we have clear success criteria for agentic components?**

Enable measurable quality gates and behavioral testing strategies.

Basic metrics identified: accuracy, response time.

Comprehensive criteria added: behavioral consistency, failure handling, escalation triggers.

Success criteria with measurable thresholds defined.  
(documentation link).

**Do we have a tracing approach defined to trace agentic steps such as LLM calls, Tool calls, etc.?**

Enable debugging, auditability, and behavioral regression testing. Critical for nondeterministic systems where runtime LLM decisions must be traceable.

Identified need for LangSmith/OpenTelemetry. Evaluating tracing platforms.

Tracing framework selected. Instrumentation points identified for all agentic components.

Tracing implemented with retention policy and golden trajectory baselines capture.

**Table 2: Example of Iterative Assessment of Agentic AI Components**

Once these high-level analysis results are available, you can proceed to designing individual workflow capability matrices (see Table 3) or plan other development activities.

The above process done diligently will act as a guiding checklist for the rest of the development. For example, the third question in the table above (e.g., "Have we prepared a capability matrix (see Table 3) for each of these workflows?") can be used to create a set of capability matrices (see Table 3 in the next section), one for each workflow of your application, such that each workflow scope gets broken down into agentic and non-agentic parts. We need to remember that agents involve LLM calls and tool calls, possibly running in a loop. You can observe from Figure 5 (depicting agentic tracing using [LangSmith](https://docs.langchain.com/langsmith/home)) that LLM calls introduce significant latency, therefore we don't want to use agents to implement components where deterministic or fixed rules are applicable. The guideline is, if my code can take a clear, unambiguous decision based on some fixed rule, there is no need for agentic reasoning in those parts of the application, given that agentic reasoning via LLM comes at the expense of simplicity and performance.

## Implementing Agentic Features (The Capability Matrix Approach)

One of the most widespread anti-patterns in agentic application development is the attempt to make everything agentic. Based on the above principles, the requirements analysis for an agentic application must include a systematic process for identifying which part of the application should leverage nondeterministic LLM reasoning and which parts should embody deterministic rules. It is critical to avoid this anti-pattern when some tasks would rather be done better deterministically. Let us look at a simple illustrative use case, an agentic customer support system that orchestrates end-to-end customer service workflows. Table 3 below lists each step of one such example workflow and attempts to outline the correct way of addressing its objectives.

We break down each workflow step and analyze if it should be deterministic (rule-based, predictable) or nondeterministic (requiring LLM reasoning). The core insight is to recognize that most production applications would contain a combination of deterministic (fixed rule-based) and nondeterministic (reasoning based) capabilities.

**Support Workflow**: Customer submits a support request stating that they can't access their account and download invoices.

**Workflow Step**

**What happens**

**Deterministic Component**

**Agentic Component**

Initial Ticket Reception

The system should create a ticket and identify the customer channel used.

Generating Ticket ID.  
Determining the customer channel used (email/IVR/Web).  
Customer ID lookup.  
SLA timer initialization on the ticket.

Understanding the customer intent by analyzing request content.  
Identifying core issues such as "account not accessible", "invoices cannot be downloaded", etc.

Classification and Routing

The system should determine a ticket category and assign a specific group or queue.

Group/Queue assignment based on classification results from the agentic part of the previous step.

Determining the issue category and intent (Classification).  
Assessing priority by combining urgency signals in the original text content of the request and business rules.  
Assessing complexity of the problem (isolated or dependent issue).

Knowledge base search and Solution mapping

The system should look for existing solutions.

Database look up to identify knowledge base metadata.  
Caching for frequent look ups.  
Knowledge base look up to retrieve existing solutions.

Query generation for lookups.  
Determining the relevance of searched solutions to the current problem.  
Combining existing solutions into a solution for the current issue, if possible.

Optional Solution Initiation

The system should determine if a solution can be applied or not.

Executing the deterministic rules for applying the solution, for example, database lookup, and command executions.

Decision on applying a solution based on information so far.

Generation of Response

The system should generate an appropriate response for the customer.

Response generation flow, including:  
\- Response template.  
\- Resolving runtime placeholders (customer name, ticket IDs).  
\- Response routing.

Qualitative decisions on the response, such as:  
\- Customer personalization.  
\- Verbiage of the response based on urgency or priority.

Solution or Response Delivery

The system should send the response.

Response sending flow, including:  
\- Determining customer's preferred channel (e.g., email).  
\- Logging and metrics generation.  
\- Sending the response on the preferred channel.

Nondeterministic insights such as:  
\- Decision on whether or not to follow up with the customer.  
\- Assess the solution's effectiveness.

Solution Managing and Closure

System should manage ticket's lifecycle to closure

Customer notifications and alerts.  
SLA tracking.  
Closure notification by determining stakeholders for communication.

Closure recommendations.  
Summary generation and improvements in existing solution steps, if applicable.

**Table 3: Workflow Capability Matrix**

This capability matrix approach helps bring out the following key insights. Nondeterministic reasoning from unstructured/structured text content is the clear dividing line between agentic and non-agentic application components. Any action that needs to be taken based on dynamic reasoning such as understanding customer intent or whether to follow up for a given issue or not, needs to be implemented as Agentic by possibly creating a function calling tool that the agent invokes based on LLM reasoning. Any action based on the current application/system state can and should be coded as a traditional non-agent rule based implementation.

Most of the applications, even if they are good candidates for Agentic approach, would still involve a significant portion that should be rule-based and not agentic.

Architecture and thus development should be driven by reliability requirements. Functionalities that do not have alternative interpretations will result in definite and certain failure blocking an application feature. Such cases should always be deterministic, for example SLA should be a fixed value based on the type of ticket, or ticket ID generation should follow a fixed logic. Functionalities for which alternative interpretations are possible can benefit from LLM reasoning, such as different kinds of response verbiage based on current solution and user personalization, or different API calls, or query executions.

Cost optimization gets built in because LLM calls can be expensive and should be used only for genuine nondeterministic tasks.

Therefore, any agentic workflow or use case should define:

-   High-Level Deterministic Container, which defines boundaries for a workflow.
-   Mapping for every workflow step.
-   Classification of workflow steps based on reasoning requirements.

## Development Workflows

### Developer Workflow – Implementing Agent Persona and Planning Logic

There is no restriction on the way agents can be orchestrated. They can be run sequentially, concurrently, or by using an arbitrary coordination strategy. However, most of the applications can fit into one of the standard orchestration patterns. Microsoft Azure's agent orchestration research identifies five primary coordination [patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns), each optimized for different operational requirements :

**Sequential Orchestration**

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/63figure-5-1770382724623.jpg)

**Figure 5: Sequential Orchestration (ref: [Microsoft Orchestration Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns))**

Agents execute in predefined linear order, with each agent processing output from the previous stage. This pattern proves optimal for document processing workflows where quality gates between stages are critical. [JPMorgan Chase's COiN](https://medium.com/@arahmedraza/how-jpmorgan-uses-ai-to-save-360-000-legal-hours-a-year-6e94d58a557b) (Contract Intelligence) system demonstrates the power of sequential document analysis, processing twelve thousand commercial credit agreements in seconds with near-zero error rates, saving three hundred sixty thousand legal hours annually.

**Concurrent Orchestration**

Multiple agents execute tasks concurrently with result synthesis. This pattern reduces latency for tasks with independent sub-components. [Google Cloud's Agent Assist](https://cloud.google.com/agent-assist) demonstrates concurrent processing benefits, achieving twenty-eight percent more conversations handled and fifteen percent quicker response times for customer service workflows.

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/44figure-6-1770382724623.jpg)

**Figure 6: Concurrent Orchestration (ref: [Microsoft Orchestration Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns))**

**Hierarchical Orchestration**

Supervisor agents coordinate specialized worker agents, enabling sophisticated task decomposition. [Recent research by Zhang et al.](https://arxiv.org/html/2506.12508v1) demonstrates that AgentOrchestra's hierarchical framework consistently outperforms flat-agent architectures, achieving 95.3 percent accuracy on complex benchmarks. Independent validation by [Liu et al.](https://arxiv.org/html/2502.14282v1) shows three-tier hierarchical architectures achieve thirty-two percent absolute improvement in task success rates over previous state-of-the-art methods.

Apart from these examples, the choice between single-shot, looped, and multi-agent orchestration depends on task complexity and reliability requirements. Single-shot systems, described in [an article by Max Pavlov](https://maxpavlov.medium.com/single-vs-multi-agent-systems-when-to-build-which-1f336c676bd7), work well for bounded tasks with clear success criteria, such as simple data validations or API calls. Similarly looped systems (see [Google's Agent Development Kit](https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/)), enable iterative refinement but require sophisticated termination conditions to prevent infinite loops, such as quality thresholds, iteration limits or early termination strategies. Multi-agent orchestration provides the highest capabilities for complex tasks but demands careful coordination mechanisms, with systems consuming up to fifteen times more tokens on average (see [Anthropic's research agent](https://www.anthropic.com/engineering/multi-agent-research-system)).

**Autonomy Level Design**

This type of orchestration requires explicit decisions about human oversight integration. The framework defines four types: Human-in-the-Loop (direct intervention), Human-on-the-Loop (meaningful control), Human-above-the-Loop (strategic governance), and Human-behind-the-Loop (post-operational analysis), see [Pawel Rzeszucinski, AI and Human Loop](https://medium.com/@pawel.rzeszucinski_55101/ai-humans-and-loops-04ee67ac820b). Similarly, [Amazon Bedrock's multi-agent collaboration framework](https://aws.amazon.com/bedrock/agents/) demonstrates that combining different orchestration approaches with built-in guardrails achieves optimal balance between automation efficiency and operational safety.

## Developer Workflow – Versioning

Agentic systems bring new and more complex versioning requirements. Compared to the standard versioning of a typical non-agentic backend application, there are multiple new touchpoints creating new points of failure, for example, system prompts, tools, LLM configuration, and other resources. Let us look at each of them to evaluate ways to manage versions of these components.

Microsoft's Azure AI platform identifies some critical agentic artifact categories that require versioning:

**Prompt Templates or System Prompts**

Research demonstrates that agents show up to sixty-three percent coefficient of variation in execution paths for identical inputs ([Mark Hornbeek](https://devops.com/reimagining-ci-cd-ai-engineered-continuous-integration/)). Therefore, prompts must be versioned not only for tracking changes, but also for enabling rollback when modifications introduce behavioral drift. Modern prompt management platforms provide Git-based version control with performance monitoring (see [PortKey versioning guide](https://portkey.ai/docs/product/prompt-engineering-studio/prompt-versioning)), runtime prompt control for production agents ([Launch Darkly](https://launchdarkly.com/blog/ai-configs-ga-runtime-control-prompts-models/)), and comprehensive observability frameworks (such as [LangSmith](https://docs.langchain.com/langsmith/home)). The [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) provides standardized interfaces for agent-tool integration, ensuring versioning and consistency for agentic operational environments. Using these tools we can also change prompts at runtime while keeping proper version control.

**Tool Manifests**

JSON/YAML specifications defining available functions, their parameters, and authorization requirements. Tool manifests require dependency management similar to software packages, because tool additions or modifications can fundamentally alter agent capabilities. For example, the output from a tool call, when added to the prompt for next LLM call may influence the behavior of the LLM decision for the next step of an Agentic workflow.

The below diagram depicts the versioning components involved in a typical general versioning process that can be used here.

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/32figure-7-1770382724623.jpg)

**Figure 7: Agentic Versioning Components**

\[Click here to [expand image above to full-size](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/32figure-7-1770382724623.jpg)\]

## Version Controlled Prompt and Policies

Needless to say, prompts are among the most direct ways to control the behavior and decision making of LLMs in agentic systems and thus require sophisticated management to avoid any drifts (intentional or unintentional). In fact, prompt drift is identified as the most critical failure mode in a research conducted by [RisingWave](https://risingwave.com/blog/6-open-source-ci-cd-tools-in-2024/). The majority of production agent failures trace to uncontrolled prompt modifications that interact unpredictably with system updates or data changes.

Therefore prompts should be treated as Infrastructure as Code (IaC), storing them in Git repositories with formal change approval processes. Organizations implementing this approach use progressive delivery patterns, including A/B testing for prompt changes, with automatic rollback triggers when behavioral metrics drift beyond acceptable thresholds (see [Open Policy Agent](https://github.com/open-policy-agent/opa)).

**Golden Trajectories as Regression Tests**

So what is the basic foundation of behavioral regression testing in case of agentic AI? I would say, it's the concept of "golden trajectories". Golden trajectories refer to validated agent interaction sequences that are basically traces capturing not just final outputs, but complete reasoning chains, tool invocations, and decision points. Frameworks like LangChain and [LangSmith](https://docs.langchain.com/langsmith/home) allow us to instrument agentic tool functions and other parts of the code for traceability. This traceability provides a way to audit agent interactions with tools, LLMs, and other interfaces. The following example of such a system shows all agentic interactions taking place during a workflow execution.

![](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/24figure-8-1770382724623.jpg)

**Figure 8: Anatomy of a Golden Trajectory using LangSmith tracing platform.**

\[Click here to [expand image above to full-size](https://imgopt.infoq.com/fit-in/3000x4000/filters:quality\(85\)/filters:no_upscale\(\)/articles/prompts-to-production-playbook-for-agentic-development/en/resources/24figure-8-1770382724623.jpg)\]

The production trace in Figure 8, above, is from a CVE patching agent shows everything needed for behavioral regression testing: the complete reasoning chain across multiple LLM calls, tool invocation with parameters, the decision gates that prevented infinite loops, and full state capture including git context. When this agent's prompts are modified, its new execution can be compared against this baseline, any significant deviations trigger automatic rollback.

## Automated Testing of Agents

How should testing an agentic system be different from testing a traditional application? Testing of agentic applications (automated or otherwise) must be based on a solid understanding of the architectural differences between deterministic and nondeterministic systems. Agentic applications are nondeterministic because they use LLMs for reasoning and taking actions by tool calling.

### Testing Approaches

The various approaches described here draw some ideas from the "[Rethinking Testing for LLM Applications](https://arxiv.org/html/2508.20737)" paper's insight that an agentic system must be viewed as comprising roughly of three layers:

#### System Shell

Includes the deterministic components such as API interfaces, integration components, and tool calling modules.

#### Orchestration

Responsible for constructing the execution time input prompt for LLM using the current application state, user input and other variables. This prompt is distinct but is derived from an agent's static system prompt template, containing placeholders for runtime values that might come from user inputs or application state computations.

#### LLM Inference Core

The core LLM service is considered to be a black box, but can be influenced by prompt manipulations and/or current application state.

Based on this understanding let us look at the some essential testing paradigms explored in [this comprehensive guide](https://dev.to/aws/beyond-traditional-testing-addressing-the-challenges-of-non-deterministic-software-583a) on testing nondeterministic software.

**Property-Based Testing**

Property based testing entails validating that a system's behavior satisfies logical properties across randomly generated inputs (see [QuickCheck paper](https://doi.org/10.1145/351240.351266)). [Hypothesis](https://hypothesis.works/), the leading property-based testing framework, demonstrates much higher bug detection rates for AI systems compared to traditional unit testing.

**Behavioral Test Harnesses**

Behavioral testing harnesses provide mock APIs, simulated user interactions, and controlled failure scenarios.

**Metamorphic Testing**

The metamorphic approach described in the [Rethinking Testing paper](https://arxiv.org/html/2508.20737), focuses on relationships between inputs and outputs rather than correctness of individual outputs, particularly effective for AI systems where ground truth may be subjective.

### Testing Type Mapping with Scope, Checks and Tools

The tabular illustration below shows various types of testing methodologies applicable to any agentic application with applicable scope, relevant checks and identifying frameworks/tools.

**Testing Type**

**Scope/Boundary**

**Checks**

**Tools/Framework**

Unit Testing

Individual agent functions (tools)

Prompt parsing accuracy.  
Tool invocation correctness.  
Response format validation.

PyTest + [Hypothesis](https://hypothesis.works/).  
Jest for JS agents.  
Property-based testing.

Integration Testing

Agent-to-system interactions.

API connectivity.  
Database access patterns.  
Authentication flows.

Testcontainers.  
WireMock.  
Agent testing harnesses.

Behavioral Testing

End-to-end agent behavior.

Task completion order.  
Reasoning consistency and structural output validation.  
Tool selection consistency.  
Overall correctness relative to task goals.

Microsoft Agent Testing Framework.  
Custom behavioral harnesses.

Scenario Testing

Real-world use cases.

Domain-specific workflows.  
Edge case handling.  
Multi-turn conversations.

Golden trajectory validation.  
Agent interaction tracing (e.g., using [LangSmith](https://docs.langchain.com/langsmith/home)).  
Metamorphic testing suites (see [Rethinking Testing paper](https://arxiv.org/html/2508.20737)).

Chaos Testing

Resilience under adversity.

Prompt injection resistance.  
Tool failure handling.  
Resource exhaustion scenarios.

Chaos Monkey for AI.  
Custom adversarial frameworks.

**Table 4: Testing Types for Agentic Applications**

## Conclusion

Development of agentic AI applications has unique challenges when scaling for production. These challenges range from identifying agentic components, to implementing, deploying, testing and tracing these agents. In practice, applications using agentic AI are seldom entirely agentic, which means the application will most likely have some non-agentic components. Therefore each development practice gets more complex with agents impacting implementation, testing, and other aspects of the application. For example, it is not as straightforward now to define expected outputs for testing an application because agents may produce different but equally acceptable behavior when running under the same inputs on different occasions (due to different outputs from LLMs). We have tried to trace such impact on all the major development practices and address them using practical solutions evolved through experience on actual production development of agentic AI applications.

## About the Author

#### **Abhishek Goswami**

Show moreShow less
