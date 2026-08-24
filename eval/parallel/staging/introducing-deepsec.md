# Introducing deepsec: The security harness for finding vulnerabilities in your codebase

**Source:** https://vercel.com/blog/introducing-deepsec-find-and-fix-vulnerabilities-in-your-code-base
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Today we're open sourcing deepsec, an AI security harness that runs on your infrastructure, with your keys, against your code.

---

Today we’re open sourcing [deepsec](https://deepsec.sh/): a security harness powered by coding agents. It runs on your own infrastructure and surfaces hard-to-find issues in large codebases.

You can run `deepsec` on your laptop without setting up a cloud service for privileged source code access. For inference, you can use your existing Claude or Codex subscription without any additional setup.

Scanning large repos can take multiple days on a single machine. To run research jobs in parallel, `deepsec` supports optional fanout to Vercel Sandboxes for remote execution. Scans on Vercel’s codebases routinely scale up to 1,000+ concurrent sandboxes.

## [Copy link to heading](#architecture)Architecture

At its core, `deepsec` uses `claude` and `codex` to perform tailored investigation of a codebase using Opus 4.7 at max effort and GPT 5.5 at xhigh reasoning.

Scans start with static analysis to identify security-sensitive files, then coding agents investigate each candidate, tracing data flows, checking for mitigations, and producing actionable findings with severity ratings. Here is the workflow:

-   **Scan**: It starts by performing a regex-only scan of all files for security-sensitive areas that subsequent steps will focus on.
    
-   **Investigate**: Agents investigate each file identified in the scan.
    
-   **Revalidate**: A second agent run validates investigation findings to remove false positives and reclassify severity.
    
-   **Enrich**: Once investigation is complete, an agent uses git metadata and other optional services to identify the contributors responsible for fixing each issue.
    
-   **Export**: The `export` command formats the findings as instructions so that they can be turned into tickets for humans and coding agents.
    

![](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F16zhakmcmgpsn3ikDILmx8%2Fd2a6ed16f0d114f2304e36083925e4f3%2FDesktop_-_Light.png&w=1920&q=75)![](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F6xs2Sm1QG5Tl3qedOopPrR%2F398afeab2fb08e4ecf455be91a543636%2FDesktop_-_Dark__1_.png&w=1920&q=75)![](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F6R1f490NKgJrvNWCO6ABoY%2F30dc547cd0aac875362d9d7c9003439b%2FMobile_-_Light__1_.png&w=1920&q=75)![](https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F6Pkd85ftTovuB8Jipj6ZA4%2F0e580f774ed8a744645f9a91df21ca6d%2FMobile_-_Dark__1_.png&w=1920&q=75)

## [Copy link to heading](#running-deepsec-on-production-code)Running `deepsec` on production code

`deepsec` has been highly useful on our own monorepos and for our customers' codebases. During development, we ran `deepsec` on several open source repositories of Vercel customers and partners.

> We’ve been on a lookout for a tool to do security scans on our open source repositories. deepsec’s scan have been the most thorough, with most findings, and good true-positive rate.
> 
> ![](https://assets.vercel.com/image/upload/f_auto,c_fill,w_32,h_32,q_75/contentful/image/e5382hct74si/ZzOwpKoXxG6tJ5W5skFqX/44a84e78066d130391ff7fe65f5324d8/james-perkins-unkey.jpeg)
> 
> James Perkins Co-founder and CEO @ Unkey

For example, `deepsec` scanned the [open source version](https://github.com/dubinc/dub) of [dub.co](http://dub.co/). Dub is a marketing attribution platform for affiliate programs and short links that is also available as SaaS. It features authenticated access, interacts with a database, and runs several backend services, creating a large security surface. When we shared our `deepsec` findings with founder Steven Tey, he replied:

> We get a lot of automated security reports, but most of them aren't actionable. deepsec is the first tool that's surfaced the kind of issues we'd actually want a security engineer to flag, and it runs on infrastructure we control.
> 
> ![](https://assets.vercel.com/image/upload/f_auto,c_fill,w_32,h_32,q_75/contentful/image/e5382hct74si/6vu9TJmh0riAAFpgEQLJvO/f64b1deccd5a156f481c1e0156eb1d05/steven-tey-dub.jpeg)
> 
> Steven Tey Founder and CEO @ dub.co

Running against Vercel’s own monorepos, `deepsec` identified subtle edge cases in auth conditions, leading us to develop a [custom scanner plugin](https://deepsec.sh/docs/writing-matchers) that covers every authentication path in our code.

### [Copy link to heading](#false-positives-and-best-uses)False positives and best uses

Some of `deepsec`'s findings will be false positives. In our experience the false positive rate is roughly 10-20%. Given the impact of true positive findings in our own research, we’ve been happy with this outcome, and we built the `revalidate` step to have the agent further verify its findings to reduce false positives.

`deepsec` works best for applications and services. It may be usable for libraries and frameworks, but those would likely require custom prompts and scanners.

## [Copy link to heading](#customization-and-plugins)Customization and plugins

`deepsec` ships with a plugin system for adapting it to your codebase. The most common plugins are custom scanners: regex matchers tuned to your auth model, data layer, or team conventions. We recommend using `deepsec` with your coding agent and asking it to write those matchers based on findings from an initial scan:

```
Inspect previous runs against ./my-app.Are there custom deepsec matchers we should add to find more candidates for vulnerabilities?
```

## [Copy link to heading](#do-i-need-access-to-a-special-“cyber-model”)Do I need access to a special “cyber model”?

Both Anthropic and OpenAI offer “cyber” versions of their most capable models, fine-tuned to accept security tasks the base models won’t. `deepsec` works with these, but is also fully functional with off-the-shelf models.

`deepsec` ships with a classifier that checks whether the task was refused after each research step. In our experience, for the prompt that `deepsec` is using, refusals are a non-issue for both Opus 4.7 and GPT 5.5.

## [Copy link to heading](#getting-started)Getting started

To get started, run `npx deepsec init` at the root of your repository. This will create a directory called `./.deepsec`, which is used to configure the system and store a catalog of your `deepsec` investigations. From there, follow the output of the command. Read the full [documentation](https://deepsec.sh/docs/getting-started).

## [Copy link to heading](#feedback-welcome)Feedback welcome

While we’ve used `deepsec` extensively, it is still early in its development. Feedback and contributions [on GitHub](https://github.com/vercel-labs/deepsec) are welcome.
