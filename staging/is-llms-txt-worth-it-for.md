# Is llms.txt Worth It for AI Search?

**Source:** https://www.greadme.com/blog/seo/is-llms-txt-worth-it-for-ai-search
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Google has officially confirmed it does not use llms.txt for Search or its AI features. Reports that OpenAI's crawler fetches the file are disputed. Here is what the evidence actually shows and whether creating an llms.txt file is worth your time.

---

## TL;DR

-   **For Google, no.** Google has officially confirmed in its own documentation that it does not need or use llms.txt to surface your site in Search or AI features (AI Overviews and AI Mode).
-   **For OpenAI, there is no official support.** OpenAI's own crawler documentation controls its bots through robots.txt and never mentions llms.txt. Reports of it fetching the file are anecdotal and disputed — and fetching is not the same as using it for citations.
-   **One real use case:** the Lighthouse "Agentic Browsing" audit checks for llms.txt to help browser agents understand site structure — a separate product goal from Search ranking.
-   **The verdict:** creating the file takes minutes and is low-risk, but it does nothing for Google. Treat it as an optional experiment for non-Google agents, not an AI-search ranking tactic.

## What Is llms.txt — and Why Everyone Is Asking If It Is Worth It

**llms.txt is a file you place at `yoursite.com/llms.txt` — a plain-text (Markdown) document that points AI models to your most important content, a bit like robots.txt but aimed at large language models instead of search crawlers.** It was put forward by Answer.AI's Jeremy Howard in September 2024 and is explicitly a proposal — "to help LLMs use a website at inference time" — not an adopted standard. That distinction matters: no search engine or AI company is obligated to read it. The question everyone is really asking is simpler: if I spend time creating one, will AI search engines reward me? For Google, the answer is a documented no. For other systems, the honest answer is "it depends, and the payoff is unproven."

This article is a close reading of the primary sources, not speculation. Every claim below links directly to a primary source — Google's own documentation, on-the-record statements from its Search team, or the specific reports being cited — so you can verify each one yourself.

## Does Google Use llms.txt? No — and Google Says So Directly

Google has addressed this in two official documents, and the wording leaves little room for interpretation.

In its guide [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (last updated May 15, 2026), under the section titled **"Mythbusting generative AI search: what you don't need to do,"** Google states:

> "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in generative AI search."

An llms.txt file is exactly the kind of machine-readable Markdown file that sentence describes. Google adds that while it may discover and crawl many file types on a site, that does not mean any such file receives special treatment in AI features.

The same position appears in AI Features and Your Website (last updated December 10, 2025):

> "You don't need to create new machine readable files, AI text files, or markup to appear in these features. There's also no special schema.org structured data that you need to add."

### Google's Search Team Has Said the Same Thing On the Record

This is not only a documentation footnote. At Google's Search Central Deep Dive event in the Asia Pacific region (July 23, 2025), Gary Illyes stated that ranking in AI Overviews just needs normal SEO, and that Google does not support llms.txt and is not planning to — as reported by Search Engine Land.

John Mueller went further, comparing llms.txt to the long-ignored keywords meta tag and noting that no AI services had requested the file. According to Search Engine Journal, both Illyes and Amir Taboul confirmed Google was not pursuing it. (For the keywords meta tag context: that was an old HTML tag where site owners listed target keywords; Google stopped using it for ranking many years ago because it was so easily abused.)

## What OpenAI Officially Says — and Why People Still Recommend llms.txt

Google is not the only company with a public position. OpenAI documents its web crawlers — GPTBot, OAI-SearchBot, OAI-AdsBot, and ChatGPT-User — in its [official crawler documentation](https://developers.openai.com/api/docs/bots), and that page tells site owners to control those bots with **robots.txt**. The word "llms.txt" does not appear on it at all. In other words, OpenAI has no documented mechanism that reads your llms.txt file.

So why does the "OpenAI uses llms.txt" belief persist? There are two real reasons, and it helps to separate them from the official record.

### 1\. OpenAI publishes its own llms.txt — for its documentation

OpenAI hosts an llms.txt-format file for its _own_ developer docs — for example llms-full.txt, a single-file Markdown export of its API documentation. Anthropic and Perplexity do the same for their docs. That is exactly the file's designed purpose: the official proposal describes llms.txt as a way to help LLMs use a site "at inference time" — a clean entry point so coding assistants can load documentation. A company publishing an llms.txt for its API docs is not the same as that company's crawler reading _your_ llms.txt to rank or cite you.

### 2\. Anecdotal reports of OpenAI fetching the file

Separately, Search Engine Roundtable reported one site owner's server logs (Ray Martinez) that appeared to show OpenAI fetching his llms.txt roughly every 15 minutes. But this is anecdotal and disputed: other log analyses found the major AI crawlers do not regularly request the file, and John Mueller stated plainly that no AI system currently uses it. No official OpenAI source confirms it.

Either way, the most important distinction holds: **a crawler fetching your file is not proof it changes which sources ChatGPT cites.** There is no official confirmation, from any AI company, that a third-party llms.txt improves AI citation rates. What we can say with confidence is narrower: Google documents that it does not use it, OpenAI documents robots.txt and not llms.txt, and llms.txt itself remains an unadopted proposal.

## The One Place llms.txt Genuinely Does Something: Browser Agents

There is a legitimate point of confusion worth clearing up so no one accuses Google of contradicting itself. Lighthouse — Google's open-source page-auditing tool — recently introduced an "Agentic Browsing" category, and that category _does_ check whether your site has an llms.txt file.

That is not Google Search reversing its position. It is a separate product team with a separate goal: helping autonomous browser agents (AI tools that navigate sites on a user's behalf) understand a site's structure. It has nothing to do with Search ranking or AI Overview citations. The honest framing is "left hand and right hand," not "Google lied." If your audience includes emerging browser-agent traffic, an llms.txt file may help those agents — but that is a forward-looking, niche benefit, not a Search win.

## llms.txt Across AI Systems: Who Actually Uses It?

Here is the full picture in one place, based only on what is publicly confirmed as of June 2026:

System

Uses llms.txt?

What the evidence shows

Google Search, AI Overviews, AI Mode

**No**

Confirmed in two official Google docs and repeatedly on the record by Illyes, Mueller, and Taboul.

OpenAI (ChatGPT crawler)

No official support

OpenAI's crawler docs control its bots via robots.txt and never mention llms.txt. Anecdotal fetching reports exist but are disputed and unconfirmed.

Browser agents (via Lighthouse Agentic Browsing)

Checks for it

A separate Google product goal — site-structure help for agents, not Search ranking.

Other AI crawlers (Claude, Perplexity, etc.)

No confirmation

Log analyses suggest ClaudeBot and PerplexityBot don't request the file; no official statement either way.

## So Is It Worth Creating? A Practical Verdict

The decision comes down to cost versus confirmed payoff. The cost is genuinely low — a basic llms.txt file is a short Markdown document you can write in a few minutes. The confirmed payoff is also low: zero for Google, and unproven everywhere else.

### If your goal is Google visibility: skip it

An llms.txt file will not help you appear in Google Search, AI Overviews, or AI Mode. Google has confirmed this directly. The time is far better spent on the work Google actually rewards — original, experience-led content, clean technical SEO, and genuine authority. See our breakdown of [what Google officially says about AI search optimization](https://www.greadme.com/blog/seo/google-official-ai-search-optimization-guide).

### If you want to experiment for non-Google agents: it is low-risk

The file's designed use is documentation, and browser-agent tooling now checks for it, so a minimal llms.txt — especially one that points to your docs — is a reasonable, cheap experiment if you want to be early on agent-driven traffic. Just keep expectations honest: no AI company officially uses your llms.txt for citations yet.

### If you do create one, consider noindexing it

John Mueller suggested it can make sense to noindex your llms.txt file so the file itself does not get indexed as a regular page in search results. That keeps it available to AI crawlers that request it without cluttering your indexed pages.

## How to Tell If AI Models Actually Cite Your Site

The reason llms.txt feels tempting is that site owners want a lever for AI visibility. But the real lever is not a file — it is whether AI systems judge your content good enough to cite. The way to know is to measure it directly rather than guess.

Tools like [Greadme's AI Visibility Analyzer](https://www.greadme.com/visibility-analyzer) test whether AI models actually mention your domain when users ask questions in your niche, giving you a measurable baseline instead of hope. When your appearance rate is low, the fix is the same as it has always been: better content, stronger authority, and clean technical health — not an llms.txt file. For the mechanics of how AI engines choose sources, see [how ChatGPT, Perplexity, and Google pick citations](https://www.greadme.com/blog/seo/chatgpt-google-ai-citations-explained) and the [SEO vs AEO guide](https://www.greadme.com/blog/seo/seo-vs-aeo-answer-engine-complete-guide).

## FAQ

### Does Google crawl or use llms.txt?

No. Google's official documentation states you don't need machine-readable files, AI text files, or Markdown to appear in its generative AI features, and Google's Search team has confirmed on the record that it does not support llms.txt and is not planning to.

### Does OpenAI or ChatGPT use llms.txt?

Not according to OpenAI's own documentation. Its official crawler docs control GPTBot, OAI-SearchBot, and ChatGPT-User through robots.txt and never mention llms.txt. OpenAI does publish an llms.txt for its own API docs, but that is a documentation export for developers — not proof its crawlers read yours. Anecdotal reports of OpenAI fetching third-party llms.txt files exist but are disputed, and no official source confirms any citation benefit.

### If no one officially uses it, why do OpenAI, Anthropic, and Perplexity all have llms.txt files?

Because the file's real, designed purpose is documentation. The official proposal frames llms.txt as a way to help LLMs use a site "at inference time" — so coding assistants can load clean Markdown docs. OpenAI, Anthropic, and Perplexity publish llms.txt files for their developer documentation for exactly that reason. Hosting one for your docs can be genuinely useful; it is just not the same as a search-ranking or AI-citation signal.

### Is llms.txt the same as robots.txt?

No. [robots.txt](https://www.greadme.com/blog/seo/how-to-set-up-robots-txt-correctly-complete-guide) controls which crawlers are allowed to access which parts of your site. llms.txt is a proposed file that lists and summarizes your key content for AI models. One is an access rulebook; the other is a content guide — and only robots.txt is an established standard that search engines actually obey.

### Will an llms.txt file help me rank in AI Overviews?

No. Google has stated that ranking in AI Overviews relies on the same normal SEO that powers regular Search — quality, crawlable, authoritative content. There is no separate AI ranking system that an llms.txt file unlocks.

### Lighthouse checks for llms.txt — doesn't that mean Google recommends it?

Not for Search. The Lighthouse "Agentic Browsing" audit is run by a different product team and is about helping browser agents understand site structure, not about Search ranking or AI citations. It is not Google Search contradicting its own guidance.

### Should I create an llms.txt file?

If your goal is Google visibility, no — it does nothing there. If you want to experiment for OpenAI's crawler or emerging browser agents, it is cheap and low-risk to add one (and you may want to noindex it). Just don't expect a confirmed boost in AI citations from it.

## Conclusion

Is llms.txt worth it for AI search? For Google, no — and that is not opinion, it is Google's [own documented position](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), repeated on the record by its Search team. For other systems, the official record is thinner than the hype suggests: OpenAI's crawler docs reference only robots.txt, llms.txt remains an unadopted proposal, and the one confirmed use is companies publishing an llms.txt for their own documentation. Reports of OpenAI fetching third-party files are anecdotal and disputed, and no one has shown a measurable citation benefit. So the file is not proven useless — it is just unproven and Google-irrelevant. Create one if you want to experiment cheaply with agent-driven traffic, but if you are chasing AI search visibility, put the same time into original content and solid SEO. That is the lever every AI system, including Google, actually rewards.
