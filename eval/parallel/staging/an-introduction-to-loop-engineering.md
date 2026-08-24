# An Introduction to Loop Engineering

**Source:** https://machinelearningmastery.com/an-introduction-to-loop-engineering/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> In this article, you will learn what loop engineering is, where it came from, and how to design autonomous AI agent cycles that run reliably without constant human supervision.

---

In this article, you will learn what loop engineering is, where it came from, and how to design autonomous AI agent cycles that run reliably without constant human supervision.

Topics we will cover include:

-   The origin and definition of loop engineering, and how it fits into the broader progression from prompt engineering to context engineering to harness engineering.
-   The anatomy of a reliable loop, including its essential components, common patterns, and the pseudocode skeleton that underlies nearly every production implementation today.
-   The three hardest problems in loop engineering — context management, termination, and verification — and the failure modes that result from getting any one of them wrong.

![An Introduction to Loop Engineering](https://machinelearningmastery.com/wp-content/uploads/2026/07/MLM-Shittu-An-Introduction-to-Loop-Engineering-scaled-1.png)

## Introduction

A few months ago, a developer’s evening looked like this: open the coding agent, type an instruction, wait, read what came back, paste the error into the chat, wait again, nudge it in a slightly different direction, and repeat until the feature actually worked or until it was time to sleep. The agent was doing real work, but the human was still holding it the entire time, one turn after another, like driving a car that needs a hand on the wheel every three seconds.

That evening looks different now for a growing number of engineers. They write one instruction, close the laptop, and come back the next morning to a draft pull request, a triaged issue list, or a green CI build, along with a readable trail of what the agent tried and why. Nobody stood over it, typing the next prompt. What changed wasn’t the model. It was what got built around the model.

The name that stuck for that shift is **loop engineering**, and it went from a niche phrase to something people were debating on every timeline within about a week in June 2026. This article walks through where the term came from, the research it actually descends from, what a loop is made of, and how to build a small one of your own.

## What Loop Engineering Actually Means

Loop engineering is the practice of designing the system that prompts, checks, remembers, and re-runs an AI agent, instead of a person doing all of that by hand, turn by turn. The unit of work stops being a single prompt or even a single conversation. It becomes a loop: a repeating cycle where the model takes an action, gets feedback from its environment, uses that feedback to decide what to do next, and keeps going until a real, checkable condition is met.

It helps to hold this next to the thing it’s replacing. A chain runs in a fixed order: step A leads to step B, which leads to step C, and that’s it. A loop is dynamic. The agent might go from A to B, discover B didn’t work, revise its approach, and only then move to C, or it might loop back to A entirely. MindStudio’s breakdown of the concept puts it plainly: a loop continues until a task is genuinely complete, a stopping condition triggers, or the agent determines it can’t go any further. That’s a fundamentally different shape of work than “ask once, get an answer, copy it out.”

The other framing worth sitting with is the “_recursive goal_” idea. Instead of typing each next step, you define a purpose — something like “_make the test suite pass_” or “_triage every open issue and draft fixes for the straightforward ones_” — and the agent iterates on its own toward that purpose: inspect the code, make a change, run a check, read the outcome, decide the next move. The skill shifts from writing one very good sentence to designing a cycle you trust enough to walk away from.

## How This Became a Term Almost Overnight

It’s worth being specific about the timeline here, because the speed is part of the story.

On June 7, 2026, developer Peter Steinberger, known for the OpenClaw agent project, [posted on X](https://x.com/steipete/status/2063697162748260627) that the relevant skill had already changed: you shouldn’t be prompting coding agents anymore, you should be designing the loops that prompt them for you. That post reportedly crossed 6.5 million views within days and dominated agent-focused conversation for the following week.

The very next day, Google engineer and author Addy Osmani published [an essay titled simply “Loop Engineering”](https://addyosmani.com/blog/loop-engineering/) that took Steinberger’s claim and gave it an actual anatomy: automations, worktrees, skills, connectors, and sub-agents, plus a sixth piece underneath all of it — external memory. That essay is what turned a viral take into a vocabulary that other people could build on and argue about.

It wasn’t only outsiders making this case. Boris Cherny, who leads Claude Code at Anthropic, is quoted by Osmani as saying, “**I don’t prompt Claude anymore. I have loops running that prompt Claude, and figuring out what to do. My job is to write loops.**” When the person building one of the most-used coding agents on the market says he’s stopped prompting it directly, the idea has clearly moved past a fringe opinion.

The timing makes sense once you look at what changed underneath it. By mid-2026, coding agents had gotten good enough to run unattended for genuinely long stretches, recovering from their own mistakes along the way, rather than needing correction every second or third step. Once a single agent run can last an hour and touch dozens of files, the bottleneck isn’t the sharpness of your prompt anymore. It’s whether you’ve built a cycle that keeps the agent productive, checked, and pointed at the right goal for the whole hour — including the part where nobody’s watching.

## Where It Fits: Prompt, Context, Harness, Loop

Loop engineering didn’t appear out of nowhere, and it helps to see it as the newest layer in a steady progression outward, each one wrapping the previous layer rather than replacing it.

Prompt engineering came first, roughly 2022 through 2024. The skill was wording: giving the model a role, breaking a task into steps, providing examples, and asking it to reason step by step. It optimized expression, and its ceiling was real — even a perfectly worded prompt can’t hand the model facts it was never given.

Context engineering followed in 2025. The focus moved from the words themselves to everything the model actually sees at the moment it responds: conversation history, retrieved documents, tool output, and any other information assembled for that step. Shopify’s Tobi Lütke offered a definition that stuck in mid-2025, describing it as providing all the context needed for a task to be plausibly solvable by the model. Andrej Karpathy endorsed a similar framing around the same period, and by September 2025, [Anthropic had formalized the idea](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) as curating and maintaining the optimal set of tokens available during inference. Prompt engineering effectively became one ingredient within context engineering rather than a separate discipline.

Harness engineering arrived in early 2026 as agents started doing longer, more autonomous, multi-step work in real production settings. The harness is the full environment around an agent — the scaffolding, the tools it’s given, the constraints it operates under, and the feedback loops that catch its mistakes. It’s what makes an agent dependable instead of merely capable, and it nests both prior layers inside it: a harness contains context, and context contains prompts.

Loop engineering is the layer sitting on top of all three. Where harness engineering asks what environment an agent needs, loop engineering asks a narrower, more operational question: what cycle keeps the agent working toward the goal, and when exactly does that cycle stop? None of these layers replaced the one before it. You still write prompts, you still curate context, you still build a harness. Loop engineering is simply the part where all of that gets put into motion and given a rhythm.

![A nested-rings diagram of four concentric circles labeled from the center outward as Prompt Engineering (2022–2024), Context Engineering (2025), Harness Engineering (early 2026), and Loop Engineering (2026) as the outermost ring, with a small caption noting each layer contains the one before it.](https://www.kdnuggets.com/wp-content/uploads/KDN-Shittu-A-nested-rings-diagram-of-four-concentric-circles.png)

Each layer of the engineering stack wraps and contains the ones before it.  

## The Research Behind the Buzzword

It’s tempting to treat loop engineering as something invented in a single week in June, but the mechanics behind it are closer to five years old, and knowing the lineage is what separates a real understanding of the idea from just repeating the trend piece.

The direct ancestor is the [ReAct pattern](https://arxiv.org/abs/2210.03629), short for Reason plus Act, introduced by Yao and colleagues in 2022 out of research connected to Princeton and Google. The core idea was to interleave reasoning steps with action steps: the model thinks about what to do, takes an action, observes what actually happened, thinks again in light of that observation, and acts again. That interleaving — reason, act, observe, repeat — is the base loop that essentially every modern coding agent still runs today.

A year later, [Reflexion](https://arxiv.org/abs/2303.11366), from Shinn and colleagues in 2023, added something ReAct didn’t have: memory and self-critique. A Reflexion-style agent runs three distinct roles instead of one: an Actor that does the work, an Evaluator that scores the result, and a Self-Reflection step that writes an actual verbal lesson — something like “the patch failed because the import path was wrong” — into an episodic memory the agent reads back on its next attempt. That’s the mechanism behind a loop that visibly improves within a single session, without anyone retraining the underlying model.

Anthropic’s own December 2024 guide, [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents), named two more patterns worth knowing. The evaluator-optimizer pattern has one model generate a candidate solution while a second model checks it against explicit criteria and hands back feedback, cycling until the evaluation actually passes. The orchestrator-workers pattern has a central model that dynamically breaks a large task into smaller pieces, hands each piece to its own worker with a clean context window, and then combines the results. If Osmani’s “sub-agents” and “worktrees” sounded familiar, this is the formal version of the same idea.

The point of walking through all four of these isn’t trivia. It’s that “loop engineering” is a product name and a rallying phrase for a research direction that’s been quietly accumulating results since 2022. The June 2026 moment didn’t invent the loop. It gave regular developers — not just researchers — a reason and a vocabulary to start building one deliberately.

## The Anatomy of a Loop

Strip away the branding and a loop that’s actually reliable — rather than one that spins its wheels or runs forever — tends to have the same handful of components, no matter which tool or team built it.

1.  It needs a **goal** with a genuinely testable termination condition. “Make the app better” gives an agent nothing to check against, so it either runs forever or stops arbitrarily based on a guess. “Make every test in the auth module pass” is checkable in a literal, mechanical sense, and that difference is the whole ballgame.
2.  It needs a **tool set** that actually touches the real environment: code execution so it can see whether something runs, file system access to read and write, a terminal for commands, a test runner and a linter to generate honest feedback. A loop’s feedback is only as trustworthy as the tools producing it. An agent that can reason brilliantly but can’t run its own code is just guessing with extra steps.
3.  It needs **context management**. Every iteration of a loop adds more to the record — the code written, the errors hit, the decisions made along the way — and a context window is a fixed size. Left unmanaged, a long loop either overflows that window or, more insidiously, starts attending less carefully to what actually matters as the transcript grows, a problem people increasingly call context rot.
4.  It needs **explicit termination and escalation logic**: a real success condition, a real failure condition (a maximum number of iterations, a token or time budget, repeated identical errors with no progress), and a defined path to hand the problem to a human instead of continuing to burn resources on a dead end.
5.  And it needs **error handling** that actually distinguishes a recoverable problem — a bad import, a failing assertion — from a hard blocker, such as a missing credential or an undefined API. A loop that retries the exact same action after the exact same error isn’t adapting. It’s spinning.

![A circular flowchart with four nodes arranged clockwise, Reason, Act, Observe, and Decide, arrows connecting each to the next. From the Decide node, one arrow loops back to Reason, and two more branch outward to boxes labeled Success: verifier confirms goal met and Escalate: hand off to a human, making the two real exits visually distinct from the loop itself.](https://www.kdnuggets.com/wp-content/uploads/KDN-Shittu-A-circular-flowchart-with-four-nodes-arranged-clockwise-Reason-Act-Observe-and-Decide-1.png)

The core loop cycle, with its two real exits: verified success and human escalation.  

## A Loop in Pseudocode

The anatomy above is easier to hold onto once you see it as an actual structure rather than a list of nouns. Here’s the skeleton that sits underneath nearly every production loop in use today, reduced to its essentials and heavily commented:

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

\# state holds the goal itself plus a running scratchpad of what's

\# been tried so far; this is what gets fed back into the model

\# on every iteration

state \= init\_state(goal)

for step in range(MAX\_STEPS):                         \# hard cap so the loop can never run forever

    thought \= model.reason(state)                     \# ReAct's "reason" half: think before acting

    action  \= model.choose\_action(state)              \# ...then commit to one concrete tool call

    result \= tools.execute(action)                    \# actually touch the environment: run code,

                                                      \# read a file, call a test runner, etc.

    state \= update(state, thought, action, result)    \# fold the outcome back in

    state \= compact(state)                            \# summarize or prune old steps so the

                                                      \# context window doesn't overflow

    if verifier.passes(state):                        \# deterministic check, not a self-report

        return success(state)

    if no\_progress(state) or budget.exhausted():

        return escalate\_to\_human(state)               \# stop circling a dead end

return escalate\_to\_human(state)                       \# ran out of steps without a pass, hand back

Almost every interesting design decision in loop engineering is really a decision about one line in this skeleton. What exactly counts as `verifier.passes` — a passing test suite, a clean lint run, a human’s manual approval — determines whether the loop’s idea of “**done**” means anything at all. How `compact` works — whether it summarizes old steps into shorter notes or drops them outright — determines whether the loop survives long enough to finish a real task. How `no_progress` gets detected — usually by noticing that the last few steps produced the same error or left the state unchanged — is what keeps a stuck agent from quietly burning your token budget for an hour. The model itself is treated almost like a fixed component in the middle. Engineering is everything wrapped around it.

## The Building Blocks People Actually Ship With

The pseudocode above is the concept in its purest form, but Addy Osmani’s breakdown of what Codex and Claude Code actually ship today is the more concrete, tool-level version of the same idea, and it’s worth walking through directly.

Automations are the heartbeat: something that fires on a schedule or in response to an event and starts a run without a person kicking it off. In the Codex app, this lives in an Automations tab where you pick a project, a prompt, and a cadence, and results land in a triage inbox rather than your inbox directly. Claude Code reaches the same place through scheduled tasks, cron, and hooks, plus an in-session primitive worth knowing on its own — `/goal` — which keeps an agent working across turns until a condition you wrote is actually verified true, with a separate small model checking whether it’s done rather than the model that did the work grading its own output.

Worktrees solve the collision problem that shows up the moment more than one agent touches a repository at once. A git worktree is a separate working directory on its own branch that still shares the same repository history, so one agent’s edits can’t physically overwrite another’s. Both major coding agents build this in natively now, which matters because running agents in parallel without this is the exact same headache as two engineers pushing to the same lines without talking to each other first.

Skills are how a project stops getting re-explained from scratch every single session. A skill is just a folder with a `SKILL.md` file describing conventions, build steps, and the “we don’t do it this way because of that one incident” knowledge that a fresh agent would otherwise have to guess at. Written down once, it gets read on every subsequent run instead of being re-derived.

Plugins and connectors, built on MCP, are what let a loop reach outside the filesystem into your actual tools — an issue tracker, a database, a staging API, and a Slack channel. Without them, a loop can tell you what it would do. With them, it actually does it.

**Sub-agents** split the one who writes from the one who checks, on the reasonable theory that a model is a fairly generous grader of its own homework. A second agent, sometimes running a different model entirely, reviews the first one’s output against the spec before it ships.

**Building block**

**What it does in the loop**

**Why it matters**

Automations

Starts a run on a schedule or event

Turns a one-time session into something recurring

Worktrees

Isolates parallel agents on separate branches

Prevents agents from overwriting each other’s edits

Skills

Stores project knowledge outside the conversation

Stops the agent from re-deriving context every run

Plugins/connectors

Connects the agent to real external tools via MCP

Lets the loop act, not just describe what it would do

Sub-agents

Separates the agent that writes from the one that checks

Catches mistakes the original agent talked itself into

External state

A markdown file or tracked board outside the model

The model forgets between runs; the record doesn’t

That last row is the one it’s easy to underrate. The model itself has no memory between runs, so whatever the loop has learned has to live somewhere durable — a file, a board, a log — that the next run reads back on its own. It sounds almost too simple to matter, and yet it’s the same trick every long-running agent setup ultimately depends on.

## Common Loop Patterns and When Each One Fits

Not every task calls for the same shape of loop, and picking the wrong one is a common source of wasted tokens and unnecessary complexity.

The retry loop is the simplest version: try something, check if it worked, retry if it didn’t. It suits short, atomic tasks with a clear pass or fail line — writing a function against a known test, or generating output that needs to match a spec. The failure mode to watch for is retrying the same broken approach indefinitely without varying the strategy.

The plan-execute-verify loop generates a plan first, then works through it step by step, checking each step before moving to the next. It fits multi-step work where order matters and an early mistake compounds — refactoring a shared module, or standing up a new service. The risk here is over-committing to a plan that turns out to be wrong two steps in, rather than revising it.

The explore-narrow loop tries several approaches — either at once or in sequence — and narrows toward whichever one is producing the best intermediate signal. It’s the right shape for genuinely unfamiliar territory: debugging an error nobody’s seen before, or exploring an unfamiliar API’s actual behavior. The cost is context: running several paths at once is expensive, so pruning early and often matters more here than anywhere else.

Human-in-the-loop deserves to be named as a real pattern rather than treated as a fallback tacked onto the others. The agent runs until it hits genuine ambiguity or the end of a decision with real stakes, pauses, and waits for a person before continuing. It’s the right choice whenever a wrong assumption is expensive to unwind — a production database change, or a customer-facing decision. The failure mode is the opposite of the others: interrupting so often that the human isn’t actually saving any time by having an agent in the loop at all.

## Stacking Loops for Production Systems

Everything so far describes a single loop running once. Production systems tend to stack several of these on top of each other, and [LangChain’s own account of this](https://www.langchain.com/blog/the-art-of-loop-engineering) is a genuinely useful way to see how that stacking works, using their internal documentation-writing agent as a running example throughout.

1.  The first layer is the agent loop itself: a model calling tools repeatedly until a task is complete. For a docs-writing agent, that’s receiving a request for an improvement, planning the change, and using tools to clone a repository, read files, write the updated documentation, and open a pull request.
2.  The second layer is a verification loop wrapped around the first. The agent’s output doesn’t always land correctly on the first pass, so a grader — sometimes a deterministic check, sometimes another model acting as a judge — scores the result against a rubric and sends it back with specific feedback when it falls short. For the docs agent, the grader runs tests confirming every link resolves, every CI check passes, and the diff only touches what was actually requested. The tradeoff is real: verification adds latency and cost to every run, and it’s worth paying that cost specifically when quality matters more than speed, which describes most production use cases.
3.  The third layer is an event-driven loop, and it’s really about the integration layer — connecting the agent to the systems around it so it runs continuously rather than only when someone remembers to invoke it. An event fires — a new document lands, a schedule triggers, a webhook arrives — and the agent runs on its own as a standing component inside a larger system rather than a tool someone opens manually. The docs agent in LangChain’s example fires whenever a message lands in a specific Slack channel, with no person deciding in the moment that now is the time to run it.
4.  The fourth and, by LangChain’s own account, most important layer is a hill-climbing loop, and this is the one that automates improvement rather than just automating work. Every run produces a trace — a record of what the model did, which tools it called, what feedback the grader gave — and those traces carry a real signal about what’s working and what isn’t. The hill-climbing loop runs an analysis pass over a batch of traces and uses what it finds to rewrite the harness itself — adjusting a prompt, tightening a grader, fixing a tool description. For the docs agent, that analysis pass files an issue requesting a specific prompt or tool change whenever multiple traces point at the same recurring problem. The detail worth noticing is that the feedback arrow doesn’t just loop back to the top of the same cycle; it reaches in and updates the inner loop directly, so each pass through the outer loop makes the inner ones measurably better than they were before.

**Loop**

**What it does**

**Impact**

Agent loop

Model calls tools repeatedly until the task is complete

Automates the work itself

Verification loop

Output is scored against a rubric and retried with feedback on failure

Ensures quality and correctness

Event-driven loop

Real events trigger runs that update a live system

Automates work at scale, not just on demand

Hill-climbing loop

Traces from past runs feed an analysis pass that improves the harness

Compounding, ongoing improvement

LangChain’s own framing is candid about where the field’s attention has actually been: most teams have spent their time on loops one and two so far, and the genuine, less-explored value sits in three and four, where an agent stops being something you invoke and starts being something embedded in your systems that keeps getting better in response to real signal.

## The Three Hard Parts, and Where Loops Actually Fail

If loop engineering has a core curriculum underneath all the naming and tooling, it’s three specific problems, and getting any one of them wrong is the difference between a loop that runs cleanly for an hour and one that overflows, spins, or quietly lies to you.

1.  **Context management** is the first. The context window functions as an agent’s working memory, and it has a hard limit. In a long-running loop, every step appends more to that record — more thoughts, more tool output, more errors — and unmanaged, that record either overflows outright or degrades in quality as it grows, with the model attending less reliably to what actually matters buried inside an increasingly long transcript. The fix is context engineering applied inside the loop itself: compacting old steps into shorter summaries, pruning stale output, and isolating sub-agents so a side task runs in its own clean window and reports back only its conclusion.
2.  **Termination** is the second, and it’s arguably the single most expensive mistake to get wrong. A loop needs several independent exits stacked on top of each other: a verifier confirming the actual goal was met, a hard ceiling on iterations, a token or wall-clock budget, and a subtler one — no-progress detection — catching the case where the last several steps produced the same error or left the state functionally unchanged. Without that layered set of exits, a loop either runs forever or stops arbitrarily on a guess, and neither is acceptable in something meant to run unattended.
3.  **Verification** is the third, and it’s really a question of trust. The gold standard is deterministic verification — tests, type checkers, compilers, linters — because these return an objective pass or fail that the model can’t argue its way around. An LLM acting as its own judge is more flexible and genuinely necessary for anything that can’t be mechanically checked, but it’s also more gameable, and a model grading work it produced itself is a structurally weak check. The strongest loops lean on a deterministic verifier wherever one exists at all, and reserve model judgment specifically for the parts of a task that truly can’t be quantified any other way.

Those three problems produce a fairly predictable set of failure modes when they’re handled badly. Context overflow and rot, where the window fills and output quality degrades without any obvious error message. No-progress loops, where an agent repeats the same failing move indefinitely. Objective misspecification — sometimes called reward hacking — is where a loop optimizes a checkable proxy instead of the real goal; the textbook case is an agent that deletes a failing test to make its CI status turn green. Hallucinated success, where an agent reports it’s done without any real verification behind that claim. And plain cost blowup, where a long loop quietly burns far more tokens than the task ever needed. Every one of these has the same underlying fix: a genuine, external, deterministic check inside the cycle — not the agent’s own word for it.

## Where Humans Still Belong in the Loop

None of this is an argument for removing people from the process, and it’s worth covering that honestly rather than as an afterthought bolted onto the end.

An automated grader can confirm every link resolves or every test passes. It has no way to notice that the framing of a document is wrong for its actual audience, or that an action is sensitive enough that it shouldn’t be executed without someone watching. That kind of judgment — built from context, experience, and taste that’s hard to write down as a rule — is exactly where a human’s review earns its place, and the natural checkpoints show up at every level of the stack described above. In the base agent loop, that means requiring explicit human approval before a genuinely sensitive tool call — a financial transaction, or a database write.

In the verification loop, it can mean a human acting as the grader directly for workflows where the stakes are too high to trust a rubric alone. Further out, it can mean a human approving output before it ever reaches an end user, or reviewing a proposed harness change before it actually ships. None of these checkpoints is exotic to add. They’re a deliberate design choice, the same as any other part of the loop.

## What Loop Engineering Is Not

It’s worth naming the pushback directly, since hype outran a balanced view of this in the first few weeks the term was circulating. Not every developer needs to be running autonomous agent fleets by next Tuesday. For a genuinely one-off task, an interactive session with a capable agent is often just faster and safer than the overhead of engineering a full loop around it, and treating loop engineering as mandatory for every kind of work misreads what it’s actually good for.

A loop also doesn’t remove the human’s judgment from the equation; it just relocates where that judgment gets applied. Someone still owns the goal, the definition of what counts as done, and the final call on whether an output is genuinely correct. A loop that optimizes a badly specified objective will chase the wrong thing with real efficiency, and a fast loop without genuine verification behind it just produces wrong answers more quickly than a slow one would. The discipline that actually matters is keeping a real, external check — tests, types, or a human gate — inside every cycle, not just at the very end of it.

## Building a Small Loop Yourself

The most useful place to start is the simplest possible version of everything above, not the fully stacked, four-layer system described earlier. One goal, stated specifically enough to be checkable. One deterministic verifier — an actual test suite rather than a model’s self-assessment. A hard cap on iterations. And exactly one escalation path for when the loop gets stuck, rather than several half-built ones.

The task worth picking first is something recurring and genuinely low-stakes: a nightly triage pass over new issues, a scheduled report summarizing the week’s activity, a lint-and-fix pass over a single directory. Resist the urge to reach for parallel worktrees, sub-agents, or a full hill-climbing layer before that first, simple loop has actually run cleanly for a couple of weeks. The stacked version described earlier in this article is what a team builds after they’ve confirmed the base loop’s verifier means what they think it means, not what they build on day one.

## Conclusion

The real shift underneath all of this isn’t that the work got easier. It’s that the leverage point has moved. When a model can write the code itself, the scarce skill stops being the ability to phrase one very good instruction and becomes the ability to design a cycle that stays correct, verified, and pointed at the right goal while nobody’s actively watching it. That’s a systems-engineering habit, closer to designing a thermostat than to writing a sentence, and it’s exactly why the people closest to this work insist on calling it engineering rather than a trick.

Build the loop. But build it the way someone who intends to stay the engineer would — checking what it produced, understanding why it stopped where it did, and treating “done” as a claim worth verifying rather than one worth taking on faith.

##### No comments yet.
