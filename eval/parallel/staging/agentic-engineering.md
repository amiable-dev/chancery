# Agentic Engineering

**Source:** https://newsletter.systemdesign.one/p/agentic-engineering
**Added:** 2026-08-24
**Tags:** #unsorted

---

> 30 Core Agentic Engineering Concepts, Explained Simply.
What an agent is, how to configure one, when to use multiple, and how to keep them from doing damage.

---

-   _[Share this post](https://newsletter.systemdesign.one/p/agentic-engineering/?action=share) & I'll send you some rewards for the referrals._
    

How do you keep up with agentic engineering when a new tool ships every week?

You do not…

You learn the ideas behind the tools, and let the tools come and go.

The pace will not slow down. New models, new frameworks, a new _“this changes everything_” launch every few days. Chase all of it, and you spend more time switching tools than using them.

But underneath the noise, it is the same few ideas every time.

One calls it a skill, the next calls it a rule; it's the same job underneath.

Learn the idea, and it stops mattering which tool you pick.

By the end of this newsletter, you can read any agent post or news drop and see which of these ideas it actually covers, instead of feeling behind every time something new ships.

Onward.

## [”How to adopt externalized authorization: step-by-step roadmap” eBook by Cerbos (Sponsor)](https://solutions.cerbos.dev/how-to-adopt-externalized-authorization?utm_campaign=system_design_june_2026&utm_source=newsletter&utm_medium=email&utm_content=&utm_term=)

[

![](https://substackcdn.com/image/fetch/$s_!7YsV!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5dc78d8b-e765-47b1-8796-f5a99f5bbd74_1800x1013.png)

](https://solutions.cerbos.dev/how-to-adopt-externalized-authorization?utm_campaign=system_design_june_2026&utm_source=newsletter&utm_medium=email&utm_content=&utm_term=)

Hardcoded authorization logic doesn’t scale. As systems grow and requirements change, those tightly coupled permissions end up slowing down development, creating security risks, and making compliance a nightmare.

This **[80-page eBook](https://solutions.cerbos.dev/how-to-adopt-externalized-authorization?utm_campaign=system_design_june_2026&utm_source=newsletter&utm_medium=email&utm_content=&utm_term=)** breaks down how hundreds of engineering teams have tackled this problem. It walks through the practical steps for moving from hardcoded permissions to externalized authorization.

What’s in it:

-   Step-by-step adoption strategy from planning to PoC rollout
    
-   Frameworks, policy examples, code samples
    
-   Lessons from teams who’ve made the transition
    

If you’re dealing with authorization complexity, this might save you some of the trial and error.

[Download free eBook](https://solutions.cerbos.dev/how-to-adopt-externalized-authorization?utm_campaign=system_design_june_2026&utm_source=newsletter&utm_medium=email&utm_content=&utm_term=)

(Thanks to [Cerbos](https://solutions.cerbos.dev/how-to-adopt-externalized-authorization?utm_campaign=system_design_june_2026&utm_source=newsletter&utm_medium=email&utm_content=&utm_term=) for partnering on this post.)

I want to introduce **[Paul Hoekstra](https://paulhoekstra.substack.com/subscribe)** as the guest author.

[

![](https://substackcdn.com/image/fetch/$s_!x-R_!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F70536c2e-7c91-4f9e-bd75-9a924d933d88_1179x563.png)

](https://paulhoekstra.substack.com/subscribe)

Paul is a data engineer at Digital Power, a data and AI consultancy, and writes **[Paul’s Pipeline](https://paulhoekstra.substack.com/subscribe)**, a free newsletter on AI, data, and side projects.

This newsletter pulls out the ideas that keep mattering, whichever tool you pick. If it leaves you wanting more, he has a four-part series on the layers covered in this newsletter: configuration, capability, orchestration, and guardrails.

_**Here’s what you’ll find inside this newsletter:**_

[

![](https://substackcdn.com/image/fetch/$s_!M9gA!,w_2400,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F982a6e25-adc8-41af-aec6-7412231fc2cf_1456x1050.png)

](https://substackcdn.com/image/fetch/$s_!M9gA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F982a6e25-adc8-41af-aec6-7412231fc2cf_1456x1050.png)

-   **Foundations.** What an agent is, how it runs, where its state lives, and the patterns you build once you have more than one.
    
-   **Configuration.** How you shape the agent’s behavior before it writes a line of code: config files, reusable workflows, prompt caching, and the context rot that limits all of it.
    
-   **Capability.** What the agent can reach for once it is running: live documentation, AI-native search, long-term memory, and knowledge it queries but never owns.
    
-   **Orchestration.** How you coordinate multiple agents without letting them step on each other.
    
-   **Guardrails.** What stops the agents from doing damage: sandboxing, permissions, hooks, and the commit gates that catch the rest.
    
-   **Observability.** How you see what an agent actually did after it stopped typing: tracing, logging, replay, and metrics.
    

Let’s dive in!

“Agent” gets used for almost anything these days.

Let us pin it down:

An agent is a large language model (**LLM**) that runs in a loop, has access to tools[1](#footnote-1), and decides what to do next. Instead of a single answer to a prompt, the model produces a chain of actions. And each action builds on the result of the last.

Coding is the most obvious use case so far.

The loop fits naturally there. Small building blocks. Fast feedback from tests and errors. Files the agent can edit directly. The same shape works for research agents, ops automation, customer support, and content workflows.

Use an agent when:

-   Task is open-ended (”debug this failing test”, not “format this date”)
    
-   The next step depends on the result of the last one
    
-   You cannot script the path in advance
    

But skip the agent when a single prompt or a plain script will do.

[

![](https://substackcdn.com/image/fetch/$s_!jZ8a!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffeaaa4ed-cb9b-47ca-89e8-6ccff483f3ca_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!jZ8a!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffeaaa4ed-cb9b-47ca-89e8-6ccff483f3ca_1456x819.png)

Loops are not free.

Every time round the loop costs time and money, and they add up fast. The agent gets less predictable. And it gets harder to debug: the runs are longer, and the agent does not always make the same choices twice.

You do not have to pick one mode for everything.

Use a single prompt or a plain script for easy problems. Reserve the agent for tasks where its flexibility earns the cost.

An agent loop has a recognizable shape.

Three steps, repeated until something says we are done:

-   First, the model **thinks**. It reads the current state of the conversation and decides what to do next.
    
-   The model then **acts**. It emits a tool call. The harness[2](#footnote-2) around the model receives the call, validates it, and runs it: file read, shell command, MCP request, whatever fits.
    
-   Finally, the model **observes**. The tool result joins the conversation as new context. The next iteration starts with that result in scope.
    

This pattern goes by a few names.

ReAct (from [the original paper](https://arxiv.org/abs/2210.03629)), Think-act-observe, agent loop.

The name changes, but the loop does not.

A single model call has to predict the entire path up front and commit to it. The loop replaces that prediction with feedback. The model takes one step, observes what actually happened, and decides the next step based on the actual result rather than a guess.

This is why an agent can recover from its own mistakes.

A failing test returns a stack trace. A blocked command returns an error. Each one is just the next observation, and the next iteration plans against it. The loop catches a wrong first step on the next pass, instead of letting it poison everything after it.

Two variations sit on top of this basic loop:

-   **Parallelism**. Modern agents can fire several tool calls inside a single act step. That cuts wall-clock time on read-heavy work. It also causes conflicts when two parallel calls try to edit the same thing. We will come back to ways of handling that when we get to subagents (concept 17).
    

-   **Blocking vs non-blocking**. Most agents run synchronously: conversation waits while a tool runs, then the result comes back as the observation. Some run asynchronously and fire off long-running jobs in the background. Async unlocks fan-out, at the cost of more complexity.
    

“State” gets used in two senses.

One is _workflow progress_: which step the agent is on and what is left. _Agent loops_ carry that sense across iterations (concept 17). This concept is the other sense: everything the agent knows at any moment.

It breaks into two halves with very different properties:

-   **Context window**: everything the model can see right now. Your latest message, the system prompt, the agent’s previous tool calls, and the results of those calls. It has a hard ceiling (the token cap) and a soft one (concept 9, context rot). When a session ends, the context window is gone.
    

-   **Everything outside it**: what the model cannot see until it fetches it. Files on disk, database entries. Memory that survives across sessions (concept 14). Knowledge the agent only queries and never owns (concept 15). The model cannot reason over any of it directly, but the agent can pull pieces into context on demand.
    

[

![](https://substackcdn.com/image/fetch/$s_!CCPD!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F51b338b7-597e-47ea-9d60-14a83c24f615_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!CCPD!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F51b338b7-597e-47ea-9d60-14a83c24f615_1456x819.png)

So, where should your state actually live?

Files are usually the right default. They are diffable, versionable, and easy for both you and the agent to edit. Memory works well for facts that survive across sessions but do not need git history. Databases earn their place when the state needs to be queried by structure or shared across processes.

Multiple agents make the state harder.

Two agents reading the same file is fine. Two agents writing to it is the canonical race condition. Git worktrees (concept 16) give each agent its own working copy.

Subagents are friendlier: each starts with a fresh context window, and the parent passes in only what it needs. If the parent has to pass more than a few paragraphs, the split between the two is probably wrong.

Once you have multiple agents to work with, the question is how to compose them.

There are a handful of useful patterns to know:

The simplest is **planner/executor**.

One agent plans, another executes. The split keeps each agent in a context shape that suits it: open-ended thinking on one side, tight execution on the other. Useful for long tasks where you want planning quality separate from how the implementation goes.

[

![](https://substackcdn.com/image/fetch/$s_!3Gir!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1b4f231b-01c1-4de8-b5bc-4a0dde689cb1_1456x540.png)

](https://substackcdn.com/image/fetch/$s_!3Gir!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1b4f231b-01c1-4de8-b5bc-4a0dde689cb1_1456x540.png)

**Router/specialist** sits one level above.

A router agent takes the incoming request and dispatches it to one of several specialists. Each specialist has a tighter system prompt and a smaller toolset: a security reviewer, a debug specialist, a docs writer, a test author. Cheaper, because most calls hit a smaller model. Easier to reason about, because each specialist’s behavior is bounded.

[

![](https://substackcdn.com/image/fetch/$s_!vZJf!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb90d84ea-5536-4f55-8cd0-f0137392f3af_1456x540.png)

](https://substackcdn.com/image/fetch/$s_!vZJf!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb90d84ea-5536-4f55-8cd0-f0137392f3af_1456x540.png)

**Map-reduce parallelism** is the workhorse for read-heavy fan-out.

Send a single task out across many subagents and merge their results. _“Review this pull request”_ splits into one subagent per file, and the results merge into a single summary. Cost is bounded by the longest individual subagent. Quality is bounded by how well the aggregator merges.

[

![](https://substackcdn.com/image/fetch/$s_!1xKb!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F67495903-3327-40bd-b302-17b451cd2de3_1456x540.png)

](https://substackcdn.com/image/fetch/$s_!1xKb!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F67495903-3327-40bd-b302-17b451cd2de3_1456x540.png)

These patterns are not exclusive.

Real workflows combine them: a planner spawns a router, the router fans out work map-reduce style, and the merged result comes back for review.

Every pattern relies on handoffs between agents.

Each handoff carries a compressed summary, so the next agent does not start from scratch. That is what makes the patterns useful: they define where one agent’s job ends and the next one’s begins. Those seams are where work tends to break.

That’s the foundation done.

Next come the four practical layers, starting with how you shape the agent’s behavior before it touches any code.

_Get 1+ referral & I’ll send you my Leetcode Master Template!_

[Share](https://newsletter.systemdesign.one/p/agentic-engineering?utm_source=substack&utm_medium=email&utm_content=share&action=share)

Let’s dive in!

Every agent starts with a system prompt.

The harness builder bakes in a block of instructions that covers tool use and the harness’s own conventions. The system prompt does not know anything about your project.

Agent config files are the layer above.

The agent loads a project-level Markdown file at the start of every session, and the file remains in the context window for each subsequent step. The file tells the agent your standards, limits, conventions, and behavioral rules.

Claude Code calls this file `CLAUDE.md`.

Most other tools have settled on `AGENTS.md`. A bit like Apple and USB-C: the industry wants a standard, but not everyone follows it.

It matters because agents default to whatever looked most plausible in their training data. Without a config file, you get `pip install` when your project uses `uv`, `black` when you use `ruff`, and defensive sludge wrapped around every change.

With one, the agent reads a set of hard rules before it writes a line of code.

[

![](https://substackcdn.com/image/fetch/$s_!OUZA!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0607fbd1-0cf1-43b9-a5c8-b8eff7f8b445_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!OUZA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0607fbd1-0cf1-43b9-a5c8-b8eff7f8b445_1456x819.png)

A useful config is short and specific:

-   Hard limits on function length
    
-   The package manager and tooling stack you actually use
    
-   A few behavioral rules like “never commit secrets” or “always read a file before editing it.”
    

Anything generic or AI-generated dilutes the file and makes the rest harder for the model to attend to.

Keep it under 100 lines. Cut anything that is not consistently improving outcomes. Treat it the way you would treat a `Makefile`: as code, not documentation, reviewed when it changes.

If config files are always on, reusable workflow files are on demand.

They are still just Markdown, but with `YAML` frontmatter that controls when the agent loads them. Examples are Claude Code skills (in `.claude/skills/`) and Cursor rules.

The frontmatter[3](#footnote-3) does most of the work. A `name` and `description` tell the agent when the skill is relevant. An optional `globs` field narrows it further by file type or path pattern. Whether the skill actually helps depends on the quality of the instructions inside it.

Researchers built [SkillsBench](https://arxiv.org/abs/2602.12670), a benchmark of 86 tasks across 11 domains, and provided models with brief written workflows for approaching each task.

Claude Haiku scored 27.7% with human-curated skills. That beat the 22.0% Opus scored without them. The cheapest model with good instructions outperformed the flagship without.

[

![](https://substackcdn.com/image/fetch/$s_!_2Qa!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcf4b6814-229e-4b05-9c42-4ce2564d4ec8_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!_2Qa!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcf4b6814-229e-4b05-9c42-4ce2564d4ec8_1456x819.png)

There is a second lesson in the data.

When the researchers let the model write its own skills, the gains disappeared. Given everything we know about context rot, that should surprise no one. Generic AI-generated boilerplate makes things worse, not better.

The rough division of labor is simple: **config files** for always-relevant project rules, **skills** for reusable task-specific procedures.

The live prompt for what is unique about the current task.

If you are using an agent for coding, a framework on top helps.

The agent follows a documented process for planning, test-driven development (**TDD**), debugging, and code review. No more falling back on whatever it remembers from training. The mechanism is a chain of skills, hooks, and slash commands[4](#footnote-4) wired together into a repeatable process.

_Here are a few options worth knowing:_

-   [Superpowers](https://github.com/obra/superpowers) ships a curated library of skills for common workflows: brainstorming, TDD, debugging, and code review. It also adds `HARD-GATE` directives and anti-rationalization tables. These push the agent to use the skills rather than skip them.
    

-   [Get Shit Done](https://github.com/gsd-build/get-shit-done) does something similar, but through slash commands, hooks, and meta-prompting instead of skills.
    

-   [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) splits work into Plan, Work, Review, and Compound phases. The last phase captures patterns and solutions into a searchable knowledge base, so each feature makes the next one easier.
    

They differ in shape but share a thread: get the agent to understand what it is building, tell it how to go to work, and check the result against what you actually wanted.

Prompt caching stores the _stable prefix_ of the conversation so the model does not pay the full price to re-read it every turn.

Most agentic tools handle this in the background, but it is worth understanding because it changes the economics of long config files.

The mechanism is the same across providers:

The first call sends the full prefix, including the config file and any reusable workflows the agent has loaded, and pays a small premium to write that prefix into the cache. Later turns re-read it at a steep discount. Latency improves, too, because the model does not reprocess the same tokens.

[

![](https://substackcdn.com/image/fetch/$s_!tDKV!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff7171e07-34bd-4ab9-9991-25f0e8ffd942_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!tDKV!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff7171e07-34bd-4ab9-9991-25f0e8ffd942_1456x819.png)

The catch is the cache time to live (**TTL**).

Caches expire after a period of inactivity, somewhere between a few minutes and an hour, depending on the provider. An active session keeps the cache warm. A long pause (coffee, Slack, a spec to read) lets it expire and forces a rewrite on the next call.

If your tooling lets you configure the TTL, longer windows cost more to write but stay warm through bigger gaps in activity. The choice depends on how active you expect to be. Longer TTL when you will keep coming back. Shorter TTL when you might not.

Without prompt caching, you would think carefully about the size of your config file. With it, the cost is closer to a rounding error.

Model performance drops as the context window fills up.

Prompt caching saves your wallet, but those tokens still sit there, and the model has to look past each one to get to what you want it to focus on.

_Even the latest models show this:_

-   Drop a few specific facts into a long document and ask a model to find them. [GPT-5.5](https://llm-stats.com/blog/research/gpt-5-5-vs-gpt-5-4) scores 98.1% on short documents and 74.0% on documents stretching to a million tokens.
    
-   [Claude Opus 4.7](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7) drops from 59.2% at 256K to 32.2% at 1M.
    

A [recent study](https://arxiv.org/abs/2602.11988) confirmed the same effect for instruction quality. Stuffing the system prompt with generic AI-generated boilerplate produced worse results than having no file at all.

[

![](https://substackcdn.com/image/fetch/$s_!yGjy!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5004b923-978f-4757-bf36-5b871fa94525_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!yGjy!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5004b923-978f-4757-bf36-5b871fa94525_1456x819.png)

Transformers[5](#footnote-5) work by having every token attend to every other token in the context. Each token’s “attention” is a weighted distribution across the rest, with the weights summing to one.

Double the context, and each token’s share of that weight roughly halves. The model splits its finite attention budget across more material. The relevant signal gets diluted by everything around it.

There is a training distribution effect on top of that.

Most of what these models learned from is short. Behavior in very long contexts is partly extrapolation. Retrieval drops the further you push from the lengths the model trained on most.

The takeaway runs through every other concept in this layer.

Config files, skills, MCPs, even memory: every token competes with everything else for the model’s attention. Keep the things you need lean. Cut anything that is not pulling its weight.

That covers configuration. Now we look at what the agent can actually reach for once it starts running.

## [AI research is easy—verification is hard (Partner)](https://www.apodex.ai/)

[

![](https://substackcdn.com/image/fetch/$s_!jz52!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8885c86d-3003-4955-9c1a-a17e89abdcdb_1280x640.png)

](https://www.apodex.ai/)

Most AI research agents can find information.

The harder problem is correctness — whether an answer is actually right, not just well-formed.

Many systems reason, search, and verify within the same context window. When they make mistakes, they often review their own work using the same signals that produced the error. This creates a subtle failure mode: outputs can look consistent, pass internal checks, and still be wrong.

[Apodex](https://www.apodex.ai/) refers to this as _pseudo-correctness_ — answers that appear valid under the model’s own evaluation, but do not actually solve the underlying problem.

Apodex is built differently.

As a **Self-Evolving Heavy-Duty Solver**, it separates generation from verification. Specialist agents build solutions from evidence, while independent verifier agents audit the result before it is finalized.

Instead of asking whether an answer “looks correct,” Apodex evaluates whether it _actually holds_. Verification is structured across three axes:

-   **Comprehension** — did it capture the real problem?
    
-   **Causality** — does it address the true cause?
    
-   **Empirical grounding** — is it validated through execution?
    

This shifts verification from self-review to independent audit, reducing pseudo-correctness at the system level.

On LiveCodeBench v6, the heavy-duty configuration improves a 397B model from 82.0 to 85.1 under identical parameters, driven primarily by the verifier layer. It also achieves 79.0 on SWE-bench Verified and 58.4 on Terminal-Bench v2.

The Apodex 1.0 release includes Apodex-1.0-H, Apodex-mini, AgentOS, and open-weight models at 0.8B, 2B, and 4B.

See how verified AI research works:

[Try Apodex for free (early access)](https://www.apodex.ai/)

For developers who want to dive deeper:

-   [GitHub](https://github.com/ApodexAI/AgentHarness)
    
-   [Hugging Face](https://huggingface.co/collections/apodex/apodex-1)
    
-   [API Platform](https://platform.apodex.ai/)
    
-   [Discord Community](https://discord.gg/TDJA59TCng)
    

Let’s keep going!

MCP is a standard for giving agents access to external tools and services.

Originally an Anthropic spec, now broadly adopted across the ecosystem. Here’s the basic idea: _a tool exposes itself through a protocol the agent already understands, so you stop hand-rolling glue code per tool and per agent._

Yet MCP gets a lot of heat.

The basic criticism is that it is redundant and slurps context. Why add a new protocol when agents can already use command-line interfaces (CLIs), scripts, and direct API calls?

[

![](https://substackcdn.com/image/fetch/$s_!WA_q!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fade130e1-9212-4a96-b7d6-76273b527a29_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!WA_q!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fade130e1-9212-4a96-b7d6-76273b527a29_1456x819.png)

A fully loaded MCP is expensive.

By 2026, deferred tool loading is the norm. The agent starts with a list of tool names and descriptions. The full schema only loads when the agent decides to use a tool. With deferred loading, a stack like GitHub + Exa + Context7 + DeepWiki costs about 607 tokens before any tools are used. The fully loaded version costs around 5,500. A few plain skills calling CLIs directly cost about 300.

So MCPs are still heavier than the leanest alternative.

But they solve real problems: _standardization, auth, permissions, organizational distribution_. And they are getting leaner. Whether MCP itself is the protocol that wins is a separate question.

Models have knowledge cutoffs.

When the agent does not know an API signature, it usually does not say so. It guesses... confidently. And because the guess looks plausible, you only catch the mistake at runtime.

[Context7](https://context7.com/) pulls live library docs into the agent’s context.

The agent gets current documentation and working examples. Not whatever version was in the training data. This wipes out an entire class of bugs where it confidently calls functions that have been renamed, moved, or deprecated.

[DeepWiki](https://deepwiki.com/) goes one level out.

It generates AI-powered docs for GitHub repositories. Point it at an unfamiliar codebase and ask, _“How does the authentication flow work?_” and you get an answer grounded in the actual repo instead of generic vibes.

The pattern is the same: separate “knowing how to code” from “knowing the current state of the world.” Prompting helps with the first. Live data solves the second.

AI-native search engines are built for agents to consume.

Existing web search returns HTML pages designed for humans. The agent has to chew through ads, navigation, and unrelated content to find what matters. AI-native search returns the bits directly.

[

![](https://substackcdn.com/image/fetch/$s_!eNhv!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff91b89f4-ba0e-4984-a71b-fef0cf520d29_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!eNhv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff91b89f4-ba0e-4984-a71b-fef0cf520d29_1456x819.png)

[Exa](https://exa.ai/) is what I reach for.

It returns structured search results, extracted content, highlights, and summaries. I use it to find docs, discussions, and real-world examples the model would not have from training data alone.

Token efficiency makes a real difference when you use it in automated workflows. The agent gets answers without burning context on a parsing tax it should not have to pay.

Skills and MCPs can turn the agent into a specialist in output formats other than application code: _design files, presentations, architecture diagrams, and videos._

[Figma’s MCP server](https://www.figma.com/blog/introducing-claude-code-to-figma/) lets the agent read design data directly: layout, components, variables, and spacing. Instead of describing a user interface (UI) in words or pasting screenshots, you point the agent at a frame, and it generates code from the actual design spec. It works in both directions, so the agent can also push back to the Figma canvas.

[Frontend-slides](https://github.com/zarazhangrui/frontend-slides) is a Claude Code skill that generates complete HTML presentations from a prompt. It produces a single, self-contained file with inline CSS and JavaScript that runs in the browser. All the diagrams in this newsletter came from one-shots with this skill.

[draw.io](http://draw.io/) takes the same approach for architecture diagrams. The `.drawio` file format is plain `mxGraph` XML, so anything that can produce structured XML can produce a diagram. Point the agent at a Terraform repository with a `draw.io skill` or MCP loaded. The agent walks the resource graph. It writes a matching `.drawio` file next to the code that defines the infrastructure. Wire the regeneration into continuous integration (**CI**). Your architecture diagrams stop drifting from your actual stack.

[Remotion best practices](https://skills.sh/remotion-dev/skills/remotion-best-practices) does the same for video. Where frontend-slides produces a file you open in a browser, Remotion produces a file you render into a video.

The pattern that ties them together is simple: a skill or MCP that knows how to write code for a specific visual format. The agent is already great at writing code. This just teaches what kind.

Every agent session starts fresh.

The decisions you walked through yesterday, the context you built up: _gone_. You start every morning by re-explaining your project from scratch.

Persistent memory closes that gap.

The simplest version is `MEMORY.md`, a flat Markdown file in your project directory. The agent reads it at the start of every session. It can write back to it during one. The file holds conventions, architectural decisions, session summaries, and working context. The bits you do not want to keep retyping.

The limitation is how it scales.

`MEMORY.md` sits in the system prompt, just like the config file, so the same token cost and context pressure apply. Once it grows past a certain size, it gradually turns into a wall of text the model skims past.

That is where plugins like [episodic-memory](https://github.com/obra/episodic-memory) come in.

It indexes your past conversation files, embeds them as vectors[6](#footnote-6), and exposes MCP tools to semantically search across them. Documentation usually captures what you decided. Session history often captures why: _options you considered, dead ends you ruled out, trade-offs that led to the final call._

Start with a flat memory file.

Reach for a searchable layer when `grep` stops being enough.

Plenty of useful context never lived in your AI coding session to begin with.

Meeting notes, design docs, specs, technical writeups. All of this still matters, and none of it shows up in your conversation history.

[

![](https://substackcdn.com/image/fetch/$s_!-lfq!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F121a44b6-0adb-46e0-92e3-1419eea69289_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!-lfq!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F121a44b6-0adb-46e0-92e3-1419eea69289_1456x819.png)

[QMD](https://github.com/tobi/qmd) (built by Shopify CEO Tobi Lutke) is the tool I reach for here.

It is an on-device search engine for your broader knowledge base, exposed to the agent through an MCP server. The agent queries it during a session, just as it queries Exa or Context7.

Persistent memory holds what the agent learns over time. Knowledge search covers materials the agent never helped produce.

A single agent with the right configuration and tools can already do a lot. But once you have more than one running at the same time, you need a way to coordinate them.

_Get 2+ referrals & I’ll send you my Interview Mistakes to Avoid PDF!_

[Share](https://newsletter.systemdesign.one/p/agentic-engineering?utm_source=substack&utm_medium=email&utm_content=share&action=share)

Let’s dive in!

Subagents are delegated workers with a bounded scope.

Each subagent gets its own prompt, a limited toolset, and a clean context window. When it finishes, only the compressed result returns to the parent. Not the full reasoning chain or the intermediate steps, instead only the final answer.

[

![](https://substackcdn.com/image/fetch/$s_!Qw9I!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9fb0b6ea-8307-41bf-9fe5-299ea9a40adc_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!Qw9I!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9fb0b6ea-8307-41bf-9fe5-299ea9a40adc_1456x819.png)

The obvious benefit is parallelism.

The bigger benefit is compression. Test output, long docs, random side quests: _all of that stays in the subagent’s context._ The main thread stays clean enough to actually think.

You define a subagent as a Markdown file with YAML frontmatter:

-   `description` is the routing signal that tells the parent when to reach for the subagent.
    
-   `tools` field controls what it can access.
    
-   `model` field lets you run cheap work on a cheaper model.
    

When many subagents run on the same repo in parallel, their writes can collide.

Git worktrees solve this.

A worktree is a separate checkout that shares the `.git` directory but has its own working tree and branch. Two agents work on the same codebase at the same time without touching each other’s files.

Claude Code supports this natively, setting `isolation: “worktree”` in a subagent definition runs it in an isolated checkout automatically.

An agent loop re-runs a single agent with fresh context each iteration, tracking progress in files and git.

The [Ralph loop](https://github.com/snarktank/ralph) showed how powerful this is when it went viral early last year. Agents worked for hours without the output getting worse. The context window never filled up with stale reasoning and dead ends.

It uses the same compression principle as subagents. Keep the live context small. And push the state out to the file system. Then restart with a clean slate. The difference is subagents do this once per delegation. While Agent loops do it every iteration.

It works especially well for grindy, well-bounded work:

-   Migrating a large codebase one file at a time.
    
-   Processing a queue of items.
    
-   Refactoring across many call sites.
    

The model focuses on each step without dragging the previous nine into the prompt.

Claude Code ships this pattern as [/goal](https://code.claude.com/docs/en/goal).

You set a completion condition, like “all tests in `test/auth` pass and the lint step is clean”. Claude then keeps working across turns. After each turn, a small evaluator model checks whether the condition holds.

The loop stops when it does.

Once you are running many agents in parallel, you need a layer above them.

Spawning agents is easy, but coordinating them is hard. They duplicate work, lose track of progress, and come back with five incompatible versions of reality.

[

![](https://substackcdn.com/image/fetch/$s_!isjy!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6dc95f87-9a0e-4f61-aece-c380de2d83ba_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!isjy!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6dc95f87-9a0e-4f61-aece-c380de2d83ba_1456x819.png)

[Conductor](https://conductor.build/) is built for exactly this.

It gives Claude Code and Codex a single UI for parallel sessions in isolated workspaces. A built-in diff viewer handles the merging. [JetBrains Air](https://air.dev/) does the same inside the JetBrains ecosystem. It uses Docker containers or git worktrees per task.

[Vibe kanban](https://github.com/BloopAI/vibe-kanban) goes lighter: _a standalone app with its own server and a kanban UI for managing agent tasks._ You break work into cards, assign them to agents, and track progress visually.

[Cline Kanban](https://cline.bot/kanban) works across agents (Claude Code, Codex, Cline). It adds auto-commit and dependency-aware parallelization.

[Paperclip](https://github.com/paperclipai/paperclip) goes the furthest.

It markets itself as the orchestration layer for zero-human companies. There are org charts, task delegation, budget ceilings, and a governance layer where a human “board” approves high-impact decisions.

Probably overkill for solo developers, but a fascinating concept.

Managed agents are long-running agent sessions on vendor infrastructure, accessed via API.

Anthropic provides the harness, sandbox, tool loop, and container[7](#footnote-7). You define the agent (model, prompt, tools, optionally MCP servers and skills). Your app sends user events and receives streamed tool calls and messages back over server-sent events (**SSE**).

A session is a long-running process on Anthropic’s infrastructure, not yours.

It can grind through hours of tool calls while your app just streams events. Subagents are supported. The coordinator runs them in parallel as isolated threads on the same container filesystem. i.e., no need to babysit a local Claude Code window.

[

![](https://substackcdn.com/image/fetch/$s_!bbmB!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe8c420b5-963c-4da1-84df-c510da37cc07_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!bbmB!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe8c420b5-963c-4da1-84df-c510da37cc07_1456x819.png)

The catch is billing.

Managed Agents go through pay-as-you-go API tokens[8](#footnote-8), not Claude Pro or Max plans. The plans are still significantly more price-efficient for personal use. Use Claude Code with worktrees for your own repo. And reach for Managed Agents when you are building a product that runs agents for other people.

Many agents running in parallel can move fast. They can also do serious damage if nothing stops them. The next layer is what stops them…

_Get 3+ referrals & I’ll send you Popular Interview Questions PDF!_

[Share](https://newsletter.systemdesign.one/p/agentic-engineering?utm_source=substack&utm_medium=email&utm_content=share&action=share)

Let’s keep going!

Sandboxing isolates what the agent can read, write, or reach over the network.

The other guardrails focus on not trusting what the agent sees. Sandboxing limits what happens when trust is misplaced.

Most modern agent harnesses ship with some form of built-in sandbox. On Linux, they typically lean on bubblewrap (`bwrap`); on macOS, Apple’s Sandbox framework.

The shape is similar across implementations. The agent can read the project directory and system libraries. It can write to the project directory and a sandboxed temp directory. It can only reach the network through an allowed list. Credential directories like `/.ssh`, `/.aws`, `~/.gnupg`, and `~/.docker` are blocked from reading.

The walls are there whether the agent agrees with them or not.

[

![](https://substackcdn.com/image/fetch/$s_!zvMR!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2a620175-4394-45d8-9a2a-e9d985cb0ce6_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!zvMR!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2a620175-4394-45d8-9a2a-e9d985cb0ce6_1456x819.png)

If you want full isolation, running the agent inside a Docker container with `--network none` goes further.

No host filesystem beyond the mounted project; no credentials; no outbound connections. Overkill for some workflows, but for code review or analysis, it turns an entire class of worst-case scenarios into non-events.

For agent-generated code running at scale, [Cloudflare’s Dynamic Workers](https://blog.cloudflare.com/dynamic-workers/) offer per-execution sandboxes. They start within milliseconds, block network access, and inject credentials on the server side.

**Prevents:** blast radius from any other layer failing. A poisoned config file, a successful prompt injection, a permission-list bug: sandboxing is the wall that stops the consequences from leaving your project directory.

**Use when:** always. The built-in sandbox in your harness is usually free. Reach for Docker or Dynamic Workers when the work is high volume, untrusted, or both.

Permissions are allow/deny lists for tool calls, file reads, and shell commands.

They are the baseline control for what the agent can do without having to ask each time.

Agents are not malicious. They are reward-hacky problem solvers:

-   Hit them with a permission error, and they reach for `chmod 777`[9](#footnote-9).
    
-   A dependency will not install cleanly, and they try `curl | sh`[10](#footnote-10).
    
-   A test keeps failing, and they start commenting out assertions.
    
-   A git push gets blocked, and they try force-pushing to main.
    

A typical setup uses two layers:

-   **Project-level settings** (committed to the repo) define what runs without prompting. Linting, testing, and common git operations.
    
-   **User-level settings** add a deny-list for things that should never happen: reading `.env`, `rm -rf`, force-push to main, `curl * | sh`.
    

Approving every tool call by hand gets tedious fast.

The middle ground is a permission classifier. A small model looks at each tool call before it runs. It decides whether to let the call through or hold it for human review. Claude Code calls this Auto mode, and similar mechanisms are showing up across most major harnesses. This is not perfect, but combined with deny-lists and sandboxing, it lets the agent move without constant hand-holding.

**Prevents:** creative shortcuts. The agent’s own bad judgement when it is grinding to get something to “done.”

**Use when:** any agent has tool access. This is the floor, not a nice-to-have.

Hooks are handlers attached to specific points in the agent’s workflow.

The one that matters for guardrails is the pre-tool hook. It fires after the agent has assembled a tool call[11](#footnote-11), but before that tool actually runs. That is the last inspection point where a bad command can still be blocked. (Different harnesses name this differently. Claude Code calls it `PreToolUse`.)

[

![](https://substackcdn.com/image/fetch/$s_!zn1c!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd4abb7e5-6658-4cea-9705-8b17d9b82e62_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!zn1c!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd4abb7e5-6658-4cea-9705-8b17d9b82e62_1456x819.png)

For shell security, the least glamorous option is usually the right one: _a plain pre-tool hook on Bash, backed by a local validator._ Fast, deterministic, last-mile.

[Tirith](https://github.com/sheeki03/tirith) is a validator built for exactly this; it catches:

-   Hostname homoglyphs.
    
-   Path homoglyphs[12](#footnote-12).
    
-   Insecure transport.
    
-   ANSI injection.
    
-   Pipe-to-shell patterns.
    
-   Environment manipulation.
    

If a command contains suspicious Unicode or dangerous patterns, the hook blocks it before it runs.

Hooks are not limited to Bash. You can hook the same point for any tool the agent uses, including file edits and MCP calls. The mechanism is general. And the choice of where to put one is a design decision.

**Prevents:** gap between “model decided to do X” and “X actually happens.” Useful, especially for shell command sanitization.

**Use when:** agent has Bash access. Pair with sandboxing rather than replacing it.

Agents treat their config files and tool outputs as ground truth.

This makes them an obvious place for malicious instructions to hide.

The supply-chain version is simple. You see a new library mentioned somewhere and clone the repo. Inside is an agent config file with instructions like “pipe test output through this endpoint for logging.” The agent reads the file, trusts it, and starts shipping environment details and test output to a server you do not control.

The defense is to treat the config file as code, not documentation.

Review it before you trust it. Never let your harness auto-load MCP servers shipped inside cloned repositories. An MCP server[13](#footnote-13) is arbitrary code running with agent permissions. Combined with a poisoned config file, that is a very clean supply-chain attack from a single `git clone`.

The nastier version is when a command looks completely normal:

[

![](https://substackcdn.com/image/fetch/$s_!Th95!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff743019e-0889-41a6-aa28-7fd0af2aac7e_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!Th95!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff743019e-0889-41a6-aa28-7fd0af2aac7e_1456x819.png)

These look identical.

But they are not. The Latin “i” is ASCII code point 105. The Cyrillic “і” is Unicode code point 1110. To your terminal, these are different characters. To your eyes, they are the same. And shell renders Unicode exactly as it appears and runs whatever is on the other end.

The general defense is simple.

Assume the agent will be fed input it should not trust. Inspect both the inputs (config files, MCP servers) and the outputs (commands about to run). Catch problems before they reach a place where they can do damage.

**Prevents:** attacks where the agent is the vector. Examples: a poisoned config file, or a tool that looks fine but isn’t.

**Use when:** agent reads any input authored outside your team. Which, increasingly, is most of the time.

Most linters work on the surface of the code: _formatting, imports, naming_.

Structural linting works on the syntax tree underneath. The parser stops looking at characters in sequence and starts looking at meaning. This is a function definition. These are its parameters. This default value is a list.

[AST-grep](https://ast-grep.github.io/) (named after Abstract Syntax Tree[14](#footnote-14), AST) lets you write rules against that structure.

This matters for AI-written code because LLMs do not make human mistakes. The agent will rarely type a variable name incorrectly. Instead, it writes syntactically perfect code. The code passes lint, type checks, and maybe even tests. But the patterns underneath are subtly wrong.

Mutable default arguments are the classic example:

[

![](https://substackcdn.com/image/fetch/$s_!eqc-!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F97baaac1-5fce-4058-9321-d1ec1c4f7183_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!eqc-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F97baaac1-5fce-4058-9321-d1ec1c4f7183_1456x819.png)

This catches `def process(items=[])`.

The default list is created once at function definition and shared across every call. A pattern the agent learned from millions of training examples without understanding why it is dangerous.

If the agent keeps producing the same anti-pattern, encode it as a rule and stop having the same conversation forever. Each rule comes with tests, and once it exists, you wire it into pre-commit and CI.

**Prevents:** structurally bad code that linters and type checkers do not flag. Especially the LLM favorites: mutable defaults and swallowed exceptions. Or bare excepts that catch `KeyboardInterrupt` along with real errors.

**Use when:** agent writes code in a language with a parser you can target (which is most languages now).

Local quality gates that block bad code before it becomes a commit.

[Pre-commit](https://pre-commit.com/) is the dominant implementation. You define a set of checks, and every commit has to pass them before it becomes history.

What changes with agents is not the mechanism but the value of being slightly distrustful. Rules that can feel rigid for humans are often exactly right for agents. The agent does not get annoyed, ignore the rule, or promise to tidy things up later. It hits the gate, fails, reads the error, and tries again.

Without this gate, there is nothing between the agent’s output and your git history.

It hardcodes a secret into a config file, commits it, and now you are doing incident response because the model wanted the test to pass quickly.

Here’s a useful four-layer config[15](#footnote-15):

-   Standard hooks for the basics: trailing whitespace, valid YAML and TOML, file size limit.
    
-   Ruff for linting and formatting, with `--fix` to auto-correct what it can.
    
-   Bandit for security issues like hardcoded passwords and `eval()`.
    
-   AST-grep for the structural rules from concept 24.
    

[

![](https://substackcdn.com/image/fetch/$s_!Bbbd!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F352a8669-7362-437a-8262-31b23f05e8ba_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!Bbbd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F352a8669-7362-437a-8262-31b23f05e8ba_1456x819.png)

The corrective loop is what makes this so valuable.

The agent writes code, tries to commit, gets rejected, rewrites the function, and commits cleanly a few seconds later. The enforcement teaches.

**Prevents:** bad code becoming git history. Hardcoded secrets, banned patterns, lint errors.

**Use when:** any project where an agent has commit access. Which is essentially every project an agent works on.

Second layer of automated checks. Pre-commit runs on your laptop before each commit. CI runs on a shared server whenever someone pushes code. The two together catch what each would miss alone.

When code is pushed and a PR is opened, a fresh server clones the repository and runs the same checks as pre-commit. Lint, type checks, tests, security scans, and structural rules. Just running where the agent cannot quietly skip them.

_One practical note_: add a `concurrency` block to your CI config that cancels stale runs when a new push arrives. Agents are prolific little branch goblins. Without this, you burn through CI minutes on runs that were obsolete thirty seconds after they started.

[

![](https://substackcdn.com/image/fetch/$s_!aDtd!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc9bb7b6e-e379-4335-bb3e-db2a3595e126_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!aDtd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc9bb7b6e-e379-4335-bb3e-db2a3595e126_1456x819.png)

**Prevents:** local-only enforcement. Misconfigured pre-commit hooks, `--no-verify` slips, broken clean-checkout assumptions.

**Use when:** any repo has multiple agents or humans pushing code. Which is almost all of them.

Ready for the best part?

Once an agent has run, the question is what actually happened.

Tracing is the answer at the highest level: _a step-by-step record of the run, structured so you can navigate it._

[

![](https://substackcdn.com/image/fetch/$s_!opGH!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5726c435-f07a-49d2-b623-ccced727be59_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!opGH!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5726c435-f07a-49d2-b623-ccced727be59_1456x819.png)

Here’s what a useful trace shows:

-   Tree of tool calls (subagent A called tool X, which called tool Y).
    
-   How long each step took.
    
-   The inputs and outputs at every node.
    
-   Model’s stated reasoning at each decision point.
    

The shape matters as much as the contents: a _flat list of tool calls is hard to follow, a tree gives you the structure of the reasoning._

The agent itself produces some of this for free. Most harnesses log tool calls and their results. Going further requires more setup. You need to capture intermediate model thoughts, timing, model versions, and system prompts at the moment of each call. This means a tracing-aware harness or a dedicated layer like LangSmith, Helicone[16](#footnote-16), or an open-source OpenTelemetry agent tracer.

Once you have traces, every other observability concept gets easier:

-   replay starts from a trace
    
-   metrics aggregate over many traces
    
-   failure investigation almost always begins by opening one and walking it step by step
    

Logging is the substrate everything else builds on.

A raw, append-only record of inputs, outputs, and tool calls per run. Without it, traces have nothing to structure, replay has nothing to rerun, and metrics have nothing to count.

[

![](https://substackcdn.com/image/fetch/$s_!8l3l!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2267cac0-2169-4306-bb05-a15e72d8d81b_1456x819.png)

](https://substackcdn.com/image/fetch/$s_!8l3l!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2267cac0-2169-4306-bb05-a15e72d8d81b_1456x819.png)

Here’s the minimum useful set:

-   Every model call: full prompt, response, latency, tokens, model version.
    
-   Every tool call: name, parameters, result, latency.
    
-   Every error.
    
-   A session ID tying them together.
    

Skip the cleverness here.

Verbose, append-only, structured as JSON Lines is the format that survives.

The design call is what you keep and for how long. Token budgets and storage costs are something to keep in mind, but losing the inputs to a session that produced an unexplained outcome is much worse than the storage bill.

Default to keeping everything and trimming later, not the other way round.

Once you have a complete log of a session, you can rerun it.

Hand the harness the same inputs. Swap the model calls between the recorded responses and the fresh ones. Watch the agent take the same path. Or a different one.

The use cases split cleanly.

To reproduce a bug, replay with recorded model responses, and you get exactly the same trace. That is what you want when isolating a failure in the harness or a tool. To test a fix, replay with fresh model calls and you see whether your change to the harness, system prompt[17](#footnote-17), or a tool fixes the failure.

Replaying against a different model is trickier.

Sometimes a bug only shows up on a specific model version, and an upgrade silently breaks something. Replay helps catch it before your users do.

Most of what you can measure about an agent is proxy data:

-   Latency per session
    
-   Latency per tool call
    
-   Token and dollar cost
    
-   Tool call counts
    
-   Failure counts
    

All of it falls out of the logs without much extra plumbing[18](#footnote-18).

Proxy data is enough to spot the obvious failure modes. A session running up the bill. An agent stuck in a loop because nothing tells it to stop. You will catch a lot of nonsense just by watching the basics.

Outcome data is harder.

The honest version of “did the agent succeed” is not something the agent itself can report on. “Task complete” is a claim, not a measurement. To get a real outcome signal, you need to anchor to artifacts the agent did not produce: _a test that passed in CI, a PR that merged, a deploy that did not roll back._

Wiring those up is brittle and project-specific. But it is the only way to know whether the proxy numbers are pointing in the right direction.

That was a lot of concepts, so a quick recap before you close the tab.

_Foundations_ gave you what an agent is, how it runs, where its state lives, and the patterns you compose them in.

The four practical layers cover what comes after that.

_Configuration_ shapes how the agent behaves before it writes a line of code. _Capability_ is what it can reach for. _Orchestration_ coordinates multiple agents without letting them step on each other. _Guardrails_ stop them from doing damage.

_Observability_ is how you see what actually happened once the agent stopped typing.

If you are starting from zero, here is a recommended order for picking these up:

-   Write a project config file (concept 5)
    
-   Wire up MCP for live docs (concept 10)
    
-   Turn the default sandbox on (concept 20)
    
-   Start using subagents for read-heavy work (concept 16)
    

This is a good place to start.

👋 I’d like to thank **[Paul Hoekstra](https://paulhoekstra.substack.com/subscribe)** for writing this newsletter!

He’s a data engineer at Digital Power, a data and AI consultancy, and writes **[Paul’s Pipeline](https://paulhoekstra.substack.com/subscribe)**, a free newsletter on AI, data, and side projects.

Louis and I launched the **[GENERATIVE AI MASTERCLASS](https://newsletter.systemdesign.one/subscribe?yearly=true)** (newsletter series exclusive to PAID subscribers).

[

![](https://substackcdn.com/image/fetch/$s_!Lz0V!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0de1c782-57c1-4638-baae-2c455d6623fb_1200x630.png)

](https://newsletter.systemdesign.one/subscribe?yearly=true)

When you upgrade, you’ll get:

-   **Simple breakdown of real-world architectures**
    
-   Frameworks you can plug into your work or business
    
-   **Proven systems behind ChatGPT, Perplexity, and Copilot**
    

**👉 [CLICK HERE TO JOIN THE GENERATIVE AI MASTERCLASS](https://newsletter.systemdesign.one/subscribe?yearly=true)**

If you find this newsletter valuable, share it with a friend, and subscribe if you haven’t already. There are [group discounts](http://newsletter.systemdesign.one/subscribe?group=true), [gift options](http://newsletter.systemdesign.one/subscribe?gift=true), and [referral rewards](https://newsletter.systemdesign.one/leaderboard) available.

**Want to reach 210K+ tech professionals at scale?** 📰

If your company wants to reach 210K+ tech professionals, [advertise with me](https://newsletter.systemdesign.one/p/sponsorship).

Thank you for supporting this newsletter.

You are now 210,001+ readers strong, very close to 210k. Let’s try to get 211k readers by 27 June. Consider sharing this post with your friends and get rewards.

Y’all are the best.

[

![system design newsletter](https://substackcdn.com/image/fetch/$s_!6oWl!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2e739087-a910-4643-be36-997b6dd5b4af_800x500.png "system design newsletter")

](https://substackcdn.com/image/fetch/$s_!6oWl!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2e739087-a910-4643-be36-997b6dd5b4af_800x500.png)

[Share](https://newsletter.systemdesign.one/p/agentic-engineering?utm_source=substack&utm_medium=email&utm_content=share&action=share)

[1](#footnote-anchor-1)

A tool is something an AI can use to interact with the outside world, such as reading files, searching the web, running code, or calling APIs.

[2](#footnote-anchor-2)

The harness is the code around the model that runs its tool calls and feeds the results back. The model decides; the harness does.

[3](#footnote-anchor-3)

Frontmatter is a small block of metadata placed at the top of a Markdown file.

[4](#footnote-anchor-4)

-   Skills: reusable instruction files that teach the agent how to do a specific task.
    
-   Hooks: automatic checks or actions that run at certain points, like before a shell command executes.
    
-   Slash commands: shortcut commands you type, like `/review` or `/test`, to trigger a predefined workflow.
    

[5](#footnote-anchor-5)

The transformer is the neural network architecture behind modern LLMs. Introduced by Google in 2017, it processes a whole sequence of tokens at once and learns which parts to pay attention to. Almost every model you have heard of (GPT, Claude, Gemini) is a transformer under the hood

[6](#footnote-anchor-6)

A vector is a numerical representation of text that lets computers search for similar meanings.

[7](#footnote-anchor-7)

-   Harness
    
    -   The software that runs the agent.
        
    -   Manages prompts, tool calls, retries, permissions, and the agent loop.
        
    -   Example: Claude Code’s runtime.
        
-   Sandbox
    
    -   A safety boundary that limits what the agent can access.
        
    -   Restricts files, network access, credentials, and system resources.
        
    -   Prevents the agent from causing damage outside its allowed area.
        
-   Tool Loop
    
    -   Repeated cycle of:
        
        1.  Think
            
        2.  Use a tool
            
        3.  Observe the result
            
        4.  Repeat
            
        
        This is what makes an agent different from a single prompt.
        
-   Container
    
    -   An isolated environment where the agent runs code and tools.
        
    -   Has its own filesystem, processes, and dependencies.
        
    -   Similar to a lightweight virtual machine (e.g., Docker container).
        

[8](#footnote-anchor-8)

A pay-as-you-go API means you pay based on how much AI you use, not a fixed monthly subscription. The unit of usage is usually tokens.

A token is roughly:

-   1 word ≈ 1-1.5 tokens
    
-   “Hello world” = about 2 tokens
    
-   A long article = thousands of tokens
    

Think of it like:

-   Claude Pro = Netflix
    
    -   fixed monthly fee
        
    -   use within plan limits
        
-   API = electricity bill
    
    -   pay for exactly what you consume
        

[9](#footnote-anchor-9)

`chmod` changes file permissions. And `777` gives absolutely everyone full access.

[10](#footnote-anchor-10)

`curl` downloads content from the internet. `sh` executes shell commands.

[11](#footnote-anchor-11)

A tool call is a structured request from an AI agent to execute a tool, such as reading a file, running a command, or calling an API.

[12](#footnote-anchor-12)

A homoglyph is a character that looks like another character but is actually different.

-   Hostname homoglyph: a website/domain name containing look-alike characters from different alphabets.
    
-   Path homoglyph: a file path containing look-alike characters that visually resemble normal letters but point somewhere else.
    

[13](#footnote-anchor-13)

An MCP server is a program that exposes tools, resources, or services to AI agents through the Model Context Protocol.

[14](#footnote-anchor-14)

An Abstract Syntax Tree (AST) is a structured representation of code that describes its meaning and structure rather than its raw text.

[15](#footnote-anchor-15)

-   Standard hooks = file sanitation
    
-   Ruff = code quality
    
-   Bandit = security
    
-   AST-grep = structural correctness
    

Workflow:

[16](#footnote-anchor-16)

-   LangSmith is an observability and debugging platform for LLM apps and agents.
    
-   Helicone is like an analytics and monitoring layer for AI API calls.
    

A simple rule:

-   Want to know why an agent made a bad decision? → LangSmith
    
-   Want to know which model cost you $2,000 yesterday? → Helicone
    

[17](#footnote-anchor-17)

A system prompt is the hidden instruction set that defines an AI agent's role, rules, and behavior.

-   User prompt = what the user wants
    
-   System prompt = rules the agent must follow
    

[18](#footnote-anchor-18)

Plumbing is the underlying infrastructure and integration code that connects systems together behind the scenes
