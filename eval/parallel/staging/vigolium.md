# Vigolium: Open-source vulnerability scanner

**Source:** https://www.helpnetsecurity.com/2026/05/27/vigolium-open-source-vulnerability-scanner/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Vigolium, an open-source agentic vulnerability scanner, pairs LLM-driven audits with budget caps and a separate triage pass for findings.

---

Vigolium, an open-source vulnerability scanner that combines deterministic scanning with AI-driven auditing, launched its initial open-source release this month. The project ships 235+ scanner modules and an in-process agent runtime called olium that handles autonomous endpoint discovery, attack planning, and finding triage.

![Vigolium](https://img2.helpnetsecurity.com/posts2026/vigolium-main-workbench.webp "Vigolium")

The tool exposes two scanning paths. `vigolium scan` runs a multi-phase deterministic pipeline covering content discovery, browser-based spidering, and active and passive auditing. `vigolium agent` hands control to an LLM-driven harness that selects modules, generates custom JavaScript extensions, and runs source-code audits alongside dynamic scans.

### Budget caps and the cost of agent autonomy

Agentic security tooling raises a recurring question for operators: how much money and time should an autonomous auditor be allowed to consume before its output stops being useful. Vigolium exposes caps on tokens, tool calls, triage iterations, and wall-clock duration.

Jessie Ho, the tool’s author, told Help Net Security that operators should match the cap to the job. “Time-boxed pentests or CI runs: lean on the wall-clock and iteration caps so it always finishes. Deep dive on one target: loosen tokens and let it re-plan. Broad sweeps: keep per-target budgets tight, or one rabbit-hole target eats everything.”

He described two failure modes from underbudgeting and overbudgeting. “Too little budget and the agent gets cut mid-lead, you’re left with a low-confidence stub. Too much and it just wanders, burns money, and adds noise.” His guidance to new users is to start tight and loosen the caps only when genuine work is getting cut off.

### Triage as a separate phase

Plausible-sounding findings that fail to reproduce remain a persistent problem in LLM-assisted security testing. Ho said Vigolium handles this by running triage as its own pass after scanning. “The scanner finds candidates, then a separate pass re-checks each one against its evidence.”

On deduplication, the design favors merging over deletion. “It only collapses copies of the same issue, it never makes keep or kill calls on borderline ones. Anything the agent’s unsure about gets downgraded and shown, never quietly dropped.”

### Extensions, sandboxing, and a possible registry

Vigolium’s JavaScript engine lets users write custom scan modules and hooks with session-aware HTTP APIs. Extensions can execute arbitrary commands with no sandbox. Asked whether a community registry might emerge, Ho was cautious about the trust model such a system would require.

“Extensions run arbitrary code with no sandbox, so a registry is really just distributing executables, and signing only tells you who wrote it, not whether it’s safe.” Any sharing mechanism, he said, would need provenance and signing, an untrusted-by-default posture with explicit opt-in, and curation over open submission. “A small vetted set beats a big unvetted marketplace.”

### Open core, commercial console

Vigolium ships alongside a hosted product called Cloud Console. Ho drew the boundary between the two in operational terms. “The scanner is the open core, operations are commercial. Anything that finds bugs stays in the AGPL repo. The Console is just the ops layer on top: hosting, collaboration, scale, scheduling.”

Contributor confidence, he said, rests on the license and on visible behavior over time. “New detection lands in the open repo first. The day capability starts moving out of core to upsell the Console, that trust is gone.”

Vigolium is available for free on [GitHub](https://github.com/vigolium/vigolium).

![](https://img2.helpnetsecurity.com/posts/divider.gif)

**Must read:**

-   [25 open-source cybersecurity tools that don’t care about your budget](https://www.helpnetsecurity.com/2026/04/27/25-open-source-security-tools/)
-   [GitHub CISO on security strategy and collaborating with the open-source community](https://www.helpnetsecurity.com/2025/01/13/alexis-wales-github-ciso-security-strategy/)

![](https://img2.helpnetsecurity.com/posts2024/devider.webp)

**Subscribe to the Help Net Security ad-free monthly newsletter to stay informed on the essential open-source cybersecurity tools. [Subscribe here!](https://www.helpnetsecurity.com/newsletter/)**

![](https://img2.helpnetsecurity.com/posts2024/devider.webp)
