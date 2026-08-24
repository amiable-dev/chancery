# llms.txt does nothing for Google Search — so what's it for?

**Source:** https://baselinelabs.ai/blog/llms-txt-google-search
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Google's docs confirm Search ignores llms.txt and adoption studies show near-zero effect. So why do Stripe, Vercel and Anthropic still ship it?

---

Technical SEO · GEO

Google's June 2026 Search Central documentation is unambiguous: **Google Search does not use llms.txt** - not for rankings, not for AI Overviews, not at all. Third-party adoption studies back that up: across hundreds of thousands of domains, **97% of llms.txt files were never fetched** and statistical models found zero citation effect. Yet Stripe, Vercel, Cloudflare, Anthropic and Mastercard all ship the file. They know exactly what they are doing. They are building for a different audience entirely: coding agents and agentic browsers that do read it.

![George, the Baseline Labs mascot, holding a clipboard](https://baselinelabs.ai/george-clipboard.png)

What Google actually said

## Search Central made it official in June 2026

Google's AI optimisation guide, updated June 15 2026, now states directly: _"You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search (including its generative AI capabilities), as Google Search itself doesn't use them."_ The update was added, in Google's words, "to address questions from the community" - a diplomatic way of saying the hype had outrun the facts. John Mueller had flagged the same thing on Reddit months earlier, comparing llms.txt to the keywords meta tag: a file that describes what a site claims to be about, when Google would rather just read the site. Gary Illyes confirmed in July 2025 that Google does not support it and has no plans to.

0

Google Search signals derived from llms.txt (per Google, Jun 2026)

10.13%

Adoption rate across ~300,000 domains (SE Ranking)

97%

Of llms.txt files never fetched in May 2026 (Ahrefs)

The adoption numbers

## Widely deployed, rarely read, zero measurable effect

SE Ranking analysed roughly **300,000 domains** and found ~10% had adopted the file - but when they ran both a statistical model and an XGBoost classifier to check whether the file correlated with AI citations, the result was flat: **no effect**, and removing it actually improved the model's accuracy. Adoption was nearly identical across traffic tiers (low-traffic sites: 9.88%, mid: 10.54%, high: 8.27%) - meaning it is not something high-performers are doing and others are copying. Ahrefs found a similar picture from the read side: of **137,210 domains** they tracked (a technical-skew sample, so an upper bound on true adoption), **97% saw zero requests** in May 2026. Of the 3% that were fetched, only 19.5% of those requests came from named AI tools - GPTBot first, Claude Code second. The Chrome Lighthouse audit accounted for roughly 1 in every 1,000 fetches.

Study

Sample

Key finding

SE Ranking (late 2025)

~300,000 domains

No citation effect; removing variable improved model accuracy

Ahrefs (May 2026)

137,210 domains

97% never fetched; 19.5% of fetches from named AI tools

Limy.AI (90-day log)

500M+ AI bot events

~408 targeted llms.txt fetches total

Otterly.AI (server log)

62,100 AI bot visits

84 targeted llms.txt (0.1% of AI traffic)

Limy.AI's 90-day server-log study put the sheer scale in perspective: out of more than **500 million AI bot events**, roughly **408 targeted llms.txt**. Otterly.AI's parallel test found just 84 of 62,100 AI bot visits - **0.1%** - hit the file at all. Those numbers are tiny, but they are the actual signal from the actual logs.

Who actually reads it

## Who actually reads it: coding agents and agentic browsers

Rankings are not the reason these companies publish llms.txt. They ship it because a specific and growing class of tools reads it by convention: Cursor, Windsurf, Claude Code, GitHub Copilot, Cline and Aider all look for `/llms.txt` and `/llms-full.txt` as a navigation hint when a developer asks the agent to "use the Stripe docs" or "query the Vercel API." LangChain's open-source `mcpdoc` MCP server exposes llms.txt as a first-class data source. For these agents, the file is what a sitemap is for Googlebot: a structured index of where the useful content lives, so the agent does not have to crawl and guess. Chrome's Lighthouse 13.3 - released May 7 2026 - moved llms.txt auditing out of experimental status and into the default "Agentic Browsing" category, pointing in the opposite direction from the Search team. It is a split inside Google: Search says skip it, Chrome says audit it.

6

Major coding agents that fetch llms.txt by default

8

Known major shippers (Stripe, Vercel, Cloudflare, OpenAI, Anthropic, Mastercard…)

Caveats

## The honest nuances

A few things worth holding alongside the headline numbers:

**The Chrome/Search split is real.** Lighthouse 13.3 audits llms.txt under "Agentic Browsing" while Search Central says to skip it. Each team is right on its own terms, because they are optimising for different crawlers and use cases. If agentic browsing grows as a traffic source, the Lighthouse team may end up on the right side of history.

**Mueller's gameability critique has merit.** A file that tells AI what a site claims to be about - without any verification - is structurally similar to the keywords meta tag. No major AI vendor (OpenAI, Anthropic, Google, Meta, Mistral) has committed to it as a citation signal in production. Until one does, treating it as a GEO lever is speculation.

**One early case was directional, not proof.** A single self-reported proof-of-concept (dev5310, February 2026) found that after submitting llms.txt to Search Console, Google AI Mode cited it as a top source within 24 hours - while tracked keyword rankings did not move. This is directional and interesting, but it is n=1, self-reported, and not a reproducible study. We note it for completeness, not as evidence of a broad effect.

**The cost of shipping it is low.** Half a day to draft, no ongoing maintenance, no risk of penalties. That makes it a cheap asymmetric bet: if agent traffic grows and the file matters, you are ready; if it stays noise, you have lost almost nothing. The framing to use is agent-readiness infrastructure - not a ranking or citation lever.

What Mueller actually said

## "Comparable to the keywords meta tag"

John Mueller's Reddit comment is the clearest framing from inside Google: _"AFAIK none of the AI services have said they're using LLMs.TXT (and you can tell when you look at your server logs that they don't even check for it). To me, it's comparable to the keywords meta tag - this is what a site-owner claims their site is about… why not just check the site directly?"_ The analogy is exact: the keywords meta tag was ignored because site owners abused it; llms.txt carries the same structural risk. Gary Illyes, separately, confirmed in July 2025 that Google does not support it and is not planning to. The June 2026 docs make Google's standing position official rather than reversing an earlier one.

The bottom line

## Build it for the agents that actually read it

llms.txt does nothing for search ranking. The data from Ahrefs, SE Ranking, Limy.AI and Otterly.AI all agree: it has no measurable effect on AI citations in the products most people think of as "AI search." Google has now put that in writing. It is a navigation convention for the growing layer of coding agents and agentic browsers that crawl your docs when a developer asks them a question. Stripe and Vercel ship it because their primary audience increasingly includes developers working inside Cursor and Claude Code. If yours does too, it is worth the half-day to write one. If your audience is consumers finding you through Google or Perplexity, invest that time in something the models actually use: [high-quality, well-structured content that answers the sub-questions AI engines actually search for](https://baselinelabs.ai/blog/optimise-for-sub-questions).

[Generate your llms.txt with Baseline](https://baselinelabs.ai/llms-txt)

Sources: [Google Search Central - AI optimisation guide (Jun 2026)](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · [Search Engine Roundtable - Barry Schwartz](https://www.seroundtable.com/google-llms-txt-files-hurt-help-41512.html) · [SE Ranking - llms.txt adoption study](https://seranking.com/blog/llms-txt/) · [Ahrefs - llms.txt study (137,210 domains)](https://ahrefs.com/blog/llmstxt-study/) · [Limy.AI - server-log analysis](https://limy.ai/blog/llms.txt-in-2026-the-full-guide) · [Search Engine Journal - Chrome vs Search split](https://www.searchenginejournal.com/googles-llms-txt-guidance-depends-on-which-product-you-ask/) · [Search Engine Journal - Mueller keywords meta tag comparison](https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/) · [dev5310 - single self-reported case study (directional only)](https://www.dev5310.com/en/lab/llms-txt-is-powering-ai-answers)

Image (brand-treated from licensed original): Server rack by Marián Hubinský, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/w/index.php?curid=119218838). Treated versions of the CC BY-SA original are shared under the same licence.
