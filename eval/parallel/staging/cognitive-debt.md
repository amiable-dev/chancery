# Cognitive Debt: The AI Risk Nobody's Measuring

**Source:** https://michellepellon.com/blog/2026-02-23-cognitive-debt
**Added:** 2026-08-24
**Tags:** #unsorted

---

> AI-generated code is eroding the shared mental models teams need to maintain their systems. Research from neuroscience, productivity measurement, and code quality analysis converges on the same conclusion.

---

Technical debt is familiar territory for any technology leader. But as AI-generated code becomes the norm, a subtler and more serious liability is emerging: **cognitive debt** — the erosion of the shared mental models your team needs to maintain, adapt, and safely evolve your systems over time.

Margaret-Anne Storey coined the term at a recent Thoughtworks retreat, calling it a silent drain on collective system knowledge — one that accumulates _even when the AI-produced code is flawless_. This isn't a code quality problem. It's a comprehension problem. And it threatens your team's ability to respond when something inevitably breaks.

What caught my attention wasn't just Storey's framing — it's how rapidly the research is converging from multiple directions. Neuroscience, productivity measurement, code quality analysis, and cognitive psychology are all arriving at the same conclusion: **we are trading understanding for velocity, and the cost is compounding.**

## The Neuroscience: AI Use Weakens the Neural Pathways You Need Most

MIT Media Lab's "Your Brain on ChatGPT" study ([Kosmyna et al., 2025](https://arxiv.org/abs/2506.08872)) used EEG to measure brain connectivity during writing tasks across three conditions: unassisted, search-engine-assisted, and LLM-assisted. Neural coupling dropped with tool use across the board, but LLM users showed the weakest connectivity, the least ownership of their output, and the poorest recall.

The most striking finding: participants who built understanding first and _then_ used AI outperformed on every measure. Those who started with AI lost ground — and couldn't recover it later.

## The Productivity Illusion: Slower, and They Don't Know It

METR's 2025 randomized controlled trial ([METR, 2025](https://arxiv.org/abs/2507.09089)) is the most rigorous field study available on AI-assisted development productivity. They tracked 16 experienced open-source developers across 246 real-world tasks in large, mature codebases.

The result: developers using AI tools took **19% longer**, not faster. Before the study, they predicted AI would save them 24%. After experiencing the slowdown firsthand, they _still_ believed it helped by 20%.

Developers were slower, and they didn't know it.

The researchers attributed the gap to several factors — AI's lack of implicit repository knowledge, time spent reviewing and correcting suggestions, and the overhead of context-switching between human reasoning and AI output. This doesn't mean AI tools are useless. But the "just ship faster" narrative deserves far more scrutiny than it's getting.

## The Code Quality Signal: Refactoring Is Disappearing

GitClear's longitudinal analysis of 211 million lines of code (2020–2024) found that refactoring dropped from 25% of changed lines in 2021 to under 10% by 2024, while code duplication roughly quadrupled. A separate CodeRabbit analysis of 470 GitHub pull requests found AI-co-authored code contained **1.7× more major issues** and **2.74× more security vulnerabilities** than human-written code.

This is where cognitive debt meets technical debt and compounds it. Kent Beck's "[Tidy First?](https://www.oreilly.com/library/view/tidy-first/9781098151232/)" principle is instructive: refactoring isn't just cleanup — it's where developers consolidate their mental models of a system. When AI eliminates that step, teams lose both the structural improvement _and_ the understanding that comes with it.

## The Cognitive Offloading Effect

Gerlich ([2025](https://doi.org/10.3390/soc15010006)) surveyed 666 participants and found cognitive offloading strongly correlated with AI use (_r_ = +0.72) and inversely correlated with critical thinking (_r_ = −0.75). Younger participants showed higher dependence and lower critical thinking scores. This isn't software-specific, but it maps directly to Storey's framework: more offloading, less independent reasoning, weaker shared understanding.

None of this is entirely new. In 1985, Peter Naur argued that a program isn't its code — it's a _theory_ held by its developers ([Naur, 1985](https://doi.org/10.1016/0165-6074\(85\)90032-7)). Code is only a partial representation. If the people who hold the theory leave, the program effectively dies. In the AI era, Naur's insight takes on new urgency: if developers never build the theory in the first place, cognitive debt starts at commit zero.

* * *

## What to Do About It

Martin Fowler, writing from the same retreat where Storey presented, posed the right question ([Fowler, 2026](https://martinfowler.com/)): do we need a refactoring-like discipline — not for the code, but for the team's understanding?

I believe we do. Here's a structured approach, sequenced by priority and scaled by the maturity of your AI adoption.

### Layer 1: Change the Culture (Start Here)

The single most important finding across all of this research is the METR perception gap. Your developers think AI is making them faster. The data says otherwise. That isn't an individual failing — it's a leadership problem.

If your culture celebrates velocity above all else and treats AI as a pure accelerant, your team has no incentive to slow down and comprehend what's being generated. They'll accept the output, ship it, and move on — accumulating cognitive debt they cannot see.

The first intervention isn't a process or a template. It's **explicit permission from leadership to spend time understanding.**

**Budget for comprehension.** When estimating AI-assisted work, add 20–30% for the team to actually understand what was produced. If a feature normally takes 10 hours and half the work comes from AI, estimate 12–13. Across a sprint, that means budgeting 8–12 additional hours for deeper review, walkthroughs, and documentation. This isn't overhead. This is the work.

**Protect refactoring time.** The GitClear data — refactoring collapsing from 25% to under 10% — is the canary in the coal mine. If AI is eliminating the step where developers build mental models, you need to reintroduce it deliberately.

**Stop treating AI adoption as a success metric.** "Percentage of code generated by AI" tells you nothing about whether your team understands what they're shipping. It's the equivalent of measuring a writer's productivity by word count.

**Name the problem.** Most teams don't have language for what they're experiencing — they just know certain systems feel opaque and changes feel risky. Giving your team the concept of cognitive debt creates shared vocabulary for a real phenomenon.

### Layer 2: Lightweight Practices for Every Team

These two habits have the highest ratio of value to ceremony. They work at any scale.

**Decision logs.** For each significant change — especially AI-generated — capture what changed, why this approach over alternatives, and what you expect going forward. This is a lightweight version of Architecture Decision Records. Naur argued that a program's theory can never be fully documented, but documentation serves as scaffolding for rebuilding theory when needed. In fast-moving AI environments with limited human deliberation, that scaffolding becomes essential. A shared doc, a thorough PR description, a Notion page — format matters less than the habit.

**Ownership, not just review.** Code review catches bugs. What you need is a _theory review_ — someone who can answer three questions about any significant change: _What does this do and why? What did we intentionally leave out? How would this change if requirements shifted?_ If no one on the team can answer all three, the change isn't ready — regardless of whether tests pass. Reserve this for critical systems, data pipelines, and integrations. Let low-risk changes flow with standard review. The goal is building a habit of ownership, not creating bottlenecks.

### Layer 3: The Full Discipline (For High-Stakes Systems)

These practices add friction, which means they need to earn their place. Apply them selectively — to the systems where a failure of understanding would be most costly.

**Design intent before generation.** Before prompting AI to build anything significant, articulate the mental model: what is this component supposed to do, what are its boundaries, what assumptions are we making? Even three bullet points. This is Beck's "make the hard change easy" applied to AI workflows — you build the theory first so the generated code has something to attach to.

A tension worth naming: much of AI's value is exploratory. Sometimes you prompt to discover what's possible, not to implement a plan. Beck's own Explore/Expand/Extract model acknowledges this. So apply design intent to _implementation_, not exploration. When prototyping, let the AI run. When building for production, slow down and articulate intent first. The MIT study's clearest finding supports this literally — understanding first, AI second.

**Structured comprehension loops.** After any non-trivial AI generation, run a deliberate cycle: (1) ask the AI to explain the logic and tradeoffs in plain language, (2) have the developer restate the explanation in their own words, and (3) document gaps between expectation and output. Step 2 is critical. Neuroscience is clear: passively reading an AI explanation doesn't build neural pathways. You have to actively reconstruct the reasoning. This is the difference between reading a textbook and solving the problem set.

**Monthly theory rebuilds.** Pick a critical system component each month and walk through it as a team: how does it work, what design decisions were made, what's changed, what assumptions are we still relying on? Storey calls these "knowledge-sharing checkpoints." Think of them as disaster recovery drills for understanding. If the team can't reconstruct the theory of a system without referring to the AI that built it, cognitive debt has crossed into dangerous territory.

* * *

## How to Know You're Already in Trouble

Cognitive debt doesn't announce itself through failing builds. It surfaces as a pattern of subtle signals.

**Hesitation.** Developers avoid touching certain components — not due to technical complexity, but because nobody is confident they understand the ripple effects.

**The AI-first reflex.** When the default response to "how does this work?" is pasting code into an LLM rather than reading it or asking a teammate, the team's internal theory is already eroding.

**Knowledge concentration.** System understanding collapses to one or two people — usually whoever prompted the AI in the first place. In AI-augmented environments, this happens faster because the prompter is often the only person who understands the intent behind the code.

**Rising change cost.** Modifications that should be straightforward take longer than expected. Debugging time increases. Side effects surface in unexpected places. The system is becoming a black box the team routes around rather than reasons about.

If you're seeing two or more of these, you're carrying meaningful cognitive debt. The question is whether you address it deliberately or wait for the incident that forces you to.

* * *

## The Bottom Line

This isn't an anti-AI argument. I use these tools daily, and they make certain work dramatically more efficient. It's an argument for applying the same discipline to AI that we'd apply to any powerful capability with hidden costs.

Start with the culture — give your team permission and time to understand what they're shipping. Add decision logs and ownership practices to catch the worst gaps. Layer in the heavier disciplines where stakes justify them.

The teams that thrive over the next few years won't be the ones that ship fastest. They'll be the ones that maintain a living, shared theory of their systems while moving at speed.

Cognitive debt is real. The research is converging. And unlike technical debt, it won't show up in your build logs.

## References

1\. Storey, M.-A. (2026). "[How Generative and Agentic AI Shift Concern from Technical Debt to Cognitive Debt](https://margaretstorey.com/)." margaretstorey.com.

2\. Kosmyna, N., et al. (2025). "[Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task](https://arxiv.org/abs/2506.08872)." arXiv:2506.08872.

3\. METR (2025). "[Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://arxiv.org/abs/2507.09089)." arXiv:2507.09089.

4\. Gerlich, M. (2025). "[AI Tools in Society: Impacts on Cognitive Offloading and the Future of Critical Thinking](https://doi.org/10.3390/soc15010006)." _Societies_, 15(1), 6.

5\. Naur, P. (1985). "[Programming as Theory Building](https://doi.org/10.1016/0165-6074\(85\)90032-7)." _Microprocessing and Microprogramming_, 15(5), 253–261.

6\. Fowler, M. (2026). "[Fragments: February 9](https://martinfowler.com/)." martinfowler.com.

7\. Beck, K. (2023). _[Tidy First? A Personal Exercise in Empirical Software Design](https://www.oreilly.com/library/view/tidy-first/9781098151232/)_. O'Reilly Media.
