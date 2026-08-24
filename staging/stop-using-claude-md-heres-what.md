# Stop using CLAUDE.md; here's what actually works for AI-assisted development

**Source:** https://www.xda-developers.com/claude-md-helping-your-projects-is-myth/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Do you really need custom context files for every repository?

---

[![4](https://static0.xdaimages.com/wordpress%2Fwp-content%2Fauthors%2F6411f599ad4df-joe-rice-jones-headshot.jpg?fit=crop&w=90&h=90)](https://www.xda-developers.com/author/joe-rice-jones/)

Published Mar 19, 2026, 3:00 PM EDT

Maker, meme-r, and unabashed geek, Joe has been writing about technology since starting his career in 2018 at KnowTechie. He's covered everything from Apple to apps and crowdfunding and loves getting to the bottom of complicated topics. In that time, he's also written for SlashGear and numerous corporate clients before finding his home at XDA in the spring of 2023.

He was the kid who took apart every toy to see how it worked, even if it didn't exactly go back together afterward. That's given him a solid background for explaining how complex systems work together, and he promises he's gotten better at the putting things back together stage since then.

When [using an LLM for tasks](https://www.xda-developers.com/i-stick-to-my-self-hosted-llms-instead-of-chatgpt/) like software development, one of the problems to solve is how to give the AI context around your workflow. Crafted prompts were the first attempt, then something called [AGENTS.md](https://www.infoq.com/news/2025/08/agents-md/) came onto the scene early in 2025. This AI-readable README file for code repositories was designed to capture institutional knowledge [and skills](https://www.xda-developers.com/claude-code-skills-everyone-should-use/) in a format that LLMs can parse, thereby improving the quality of the output code.

It was also designed for [agentic coding tools](https://www.xda-developers.com/claude-code-isnt-just-for-developers/) so they would not require human intervention, and it probably helped at the time. It's become a de facto standard across the industry, but a [recent research paper by ETH Zurich](https://arxiv.org/pdf/2602.11988) puts some doubt on its usefulness. That could simply be due to the rapid pace of the AI industry over the last year, but perhaps something else is at play, and better prompting and other skills are a better use of your time when starting agentic coding tasks.

## What is CLAUDE.md, and why are people using it?

### Or more non-specifically, AGENTS.md

   ![init claude code in obsidian for memory storage](https://static0.xdaimages.com/wordpress/wp-content/uploads/wm/2026/02/claude-code-obsidian-init.jpg?q=49&fit=crop&w=825&dpr=2)

AGENTS.md [is an open format for guiding coding agents](https://agents.md/), designed by OpenAI, that works with pretty much any agentic coding tool and is now stewarded by the Agentic AI Foundation. OpenAI's site says its main repo has 88 AGENTS.md files, and they're made up of natural-language notes, like you would use to onboard a junior developer at a software company.

\# Sample AGENTS.md file

\## Dev environment tips  
\- Use \`pnpm dlx turbo run where 

\` to jump to a package instead of scanning with \`ls\`.  
\- Run \`pnpm install --filter \` to add the package to your workspace so Vite, ESLint, and TypeScript can see it.  
\- Use \`pnpm create vite@latest  -- --template react-ts\` to spin up a new React + Vite package with TypeScript checks ready.  
\- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.

\## Testing instructions  
\- Find the CI plan in the .github/workflows folder.  
\- Run \`pnpm turbo run test --filter 

\` to run every check defined for that package.  
\- From the package root you can just call \`pnpm test\`. The commit should pass all tests before you merge.  
\- To focus on one step, add the Vitest pattern: \`pnpm vitest run -t ""\`.  
\- Fix any test or type errors until the whole suite is green.  
\- After moving files or changing imports, run \`pnpm lint --filter \` to be sure ESLint and TypeScript rules still pass.  
\- Add or update tests for the code you change, even if nobody asked.

\## PR instructions  
\- Title format: \[

\] <br>- Always run \`pnpm lint\` and \`pnpm test\` before committing.

It's a mix of documentation and instructions, and the fact it makes you think about your workflow and put it down in writing is my favorite part. Institutional knowledge disappears as people move to other companies, and without codification, someone will have to rebuild processes in the future.

   ![claude](https://static0.xdaimages.com/wordpress/wp-content/uploads/sharedimages/2026/02/claude.png?q=70&fit=contain&w=420&dpr=1)

## Where the context files break down

### Research points toward minimal impact at best

-   ![Claude first response to document prompt](https://static0.xdaimages.com/wordpress/wp-content/uploads/wm/2026/03/claude-first-response-to-document-prompt.png?q=49&fit=contain&w=1920&h=1080&dpr=2)
    
-   ![Claude response to novel prompt](https://static0.xdaimages.com/wordpress/wp-content/uploads/wm/2026/02/claude-response-to-novel-prompt.png?q=49&fit=contain&w=1920&h=1080&dpr=2)
    
-   ![Chatgpt PC build prompt](https://static0.xdaimages.com/wordpress/wp-content/uploads/wm/2026/01/chatgpt-pc-build-prompt-1.jpg?q=49&fit=contain&w=1913&h=959&dpr=2)
    
-   ![ChatGPT three paragraphs trick](https://static0.xdaimages.com/wordpress/wp-content/uploads/wm/2024/03/chatgpt-prompt-tricks-three-paragraphs.png?q=49&fit=contain&w=2940&h=1714&dpr=2)
    
-   ![apple intelligence writing tools compose prompt with ChatGPT](https://static0.xdaimages.com/wordpress/wp-content/uploads/2024/06/apple-wwdc24-apple-intelligence-chatgpt-writing-tools-compose-prompt-240610_big-jpg-large_2x.jpg?q=49&fit=contain&w=1960&h=1102&dpr=2)
    
    Source: Apple
    

Repository-level context files have been [extensively studied over the years](https://www.emergentmind.com/topics/repository-level-context-files). The earlier papers show up to 36% improvement when utilizing this method, so you can't blame any of the LLM creators for pushing the use of AGENTS.md or similar files. The problem is that the studies showing improvement on that scale are two years old or older, which is an eon in AI development.

Recent studies from 2026 show up to 5% over-baseline output, or, in some cases, a negative effect when those context files are generated by AI. That surprised me. I would have thought that LLM-generated context files would work better, because it can see the connections between the codebase, but I was mistaken.

But while that's interesting, the tests showing that human-created context files only barely make a difference are more consequential. After all, these files take considerable time to create and tweak. They're probably still worth creating, but as a proper organizational handbook of what to do, because the improvements to agentic coding over the last year alone make them obsolete.

The other piece of the puzzle is that context files increase the number of steps the agents take to find solutions, and increase reasoning token use by up to 20%. That's a high cost when API usage is involved, especially for single-digit improvements at best.

### What could we do instead?

   ![formulating prompt in LM Studio](https://static0.xdaimages.com/wordpress/wp-content/uploads/wm/2026/02/formulating-prompt-in-lm-studio.png?q=49&fit=crop&w=825&dpr=2)

The authors of the latest study offer some suggestions here, like including the minimum necessary requirements, such as specific tools or commands, if using AGENTS.md or CLAUDE.md files. High-level overviews are functionally useless, as the LLM can glean this from studying your codebase.

The other insight is that the current agent-developer "best practices" are anything but, and lag behind the actual implementation of frontier coding models. If anything, going back to basic principles is the way forward, using tighter context and retrieval methods instead of monolithic instructions, and tighter prompting using explicit restrictions like "respond with (1) analysis, (2) patch, (3) tests to update.

Really, anything you would have put in an AGENTS.md file could be better placed in a [Model Context Protocol (MCP)](https://www.xda-developers.com/mcp-accidentally-became-best-common-language-services-talk/) server or a retrievable document, and have the agent call the relevant domain knowledge as it needs, rather than front-loading the context window with instructions it might not need.

### AGENTS.md might be of limited use, but it does make you think about your workflow

Having large, per-repository AGENTS.md files to give context to your LLM was designed to work around context window restrictions. Reality is often not as neat, and the additional token burn combined with additional instruction space might actually be hurting your projects instead. But the general idea is good, and that's why Claude has [Claude Skills](https://www.xda-developers.com/claude-skills-changed-how-i-use-claude/), essentially the same file format for repeatable individual tasks instead of building repository-specific ones.
