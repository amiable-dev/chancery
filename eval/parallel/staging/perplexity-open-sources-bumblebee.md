# Perplexity Open-Sources Bumblebee: A Read-Only Supply-Chain Scanner for Developer Endpoints

**Source:** https://www.marktechpost.com/2026/05/23/perplexity-open-sources-bumblebee-a-read-only-supply-chain-scanner-for-developer-endpoints/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Perplexity open-sources Bumblebee, a read-only Go-based scanner that checks developer endpoints for supply-chain package exposure

---

Attackers increasingly target the packages, editor extensions, and AI tool configs on developer machines and not just production systems. Perplexity has open-sourced an internal tool it uses to address this problem.

Perplexity released [Bumblebee on GitHub](https://github.com/perplexityai/bumblebee). The tool is a read-only inventory collector for macOS and Linux developer endpoints. It is written entirely in Go and carries zero non-stdlib dependencies. Perplexity already uses it internally to protect developer systems behind its search product, Comet browser, and Computer agent.

## **Problem that Bumblebee Solves**

If you are a software engineer or data scientist, you likely have dozens of packages installed locally. You have editor extensions, browser add-ons, and possibly MCP (Model Context Protocol) configs on your machine. When a new vulnerability surfaces, your security team faces one urgent question: which developer machines are exposed right now?

Existing tools do not fully answer this. SBOMs (Software Bills of Materials) and vulnerability scanners cover build artifacts and repositories. EDR (Endpoint Detection and Response) products track what processes ran or touched the network. Neither checks local developer state — lockfiles, package metadata, extension manifests, and AI tool configs scattered across a laptop’s filesystem.

Bumblebee fills that gap. When an advisory names a package, extension, or version, it answers which machines show a match in their on-disk metadata right now. The ecosystem scope was also deliberate: the covered ecosystems map to recent active supply-chain campaigns, including the Mini Shai-Hulud series, which hit npm, PyPI, RubyGems, Go modules, and Composer packages across companies including TanStack, SAP, and Zapier.

## **How Bumblebee Works**

Bumblebee is a one-shot scanner. Each invocation performs a single scan and exits. Cadence is the operator’s responsibility — cron, launchd, systemd, or MDM fleet tooling. It outputs structured records as NDJSON (newline-delimited JSON), one per line, with diagnostics going to stderr.

The tool supports three scan profiles. The `baseline` profile scans common global and user package roots, language toolchains, editor extensions, browser extensions, and MCP configs. The `project` profile targets configured development directories such as `~/code` or `~/src`. The `deep` profile sweeps operator-supplied roots, typically a bare home directory during an active incident.

Internally, Perplexity uses Bumblebee inside a five-step workflow. A threat signal arrives from public disclosures or third-party intel feeds. Perplexity Computer then drafts a catalog update, entering the signal as a structured entry with ecosystem, package name, and version — and opens a GitHub PR with source links. A human dev reviews and merges the PR. Bumblebee then runs on endpoints with the updated catalog, and findings are shared with the security team.

![](https://www.marktechpost.com/wp-content/uploads/2026/05/Screenshot-2026-05-23-at-1.20.14-AM-1.png)

Image source: https://www.perplexity.ai/hub/blog/perplexity-is-open-sourcing-bumblebee

## **What Bumblebee Scans**

**Bumblebee covers four surface areas that existing tools typically handle separately.**

For language package managers, it reads from npm, pnpm, Yarn, Bun, PyPI, Go modules, RubyGems, and Composer. It reads lockfiles and installed package metadata directly — sources like `package-lock.json`, `pnpm-lock.yaml`, `go.sum`, and `*.dist-info/METADATA`. Note that `bun.lockb`, Bun’s binary lockfile format, is not parsed in v0.1; only the text `bun.lock` format is supported.

For AI agent configs, Bumblebee reads MCP JSON host configuration files: `mcp.json`, `.mcp.json`, `claude_desktop_config.json`, `mcp_config.json`, `mcp_settings.json`, `cline_mcp_settings.json`, and `~/.gemini/settings.json` for Gemini CLI. Non-JSON MCP configs such as Codex `config.toml` and Continue YAML are not parsed in v0.1. It parses these files for server inventory but does not emit environment values or environment key names found in `env` blocks.

For editor extensions, it reads manifests from VS Code, Cursor, Windsurf, and VSCodium. For browser extensions, it covers Chromium-family browsers — Chrome, Comet, Edge, Brave, and Arc — plus Firefox.

npm packages can carry `postinstall` scripts that execute automatically on `npm install`. A scanner that invokes npm to check exposure has already triggered the attack it was looking for. Bumblebee avoids this entirely by never running install scripts or lifecycle hooks, never invoking npm, pnpm, bun, or pip, never reading application source files, and performing no process or network monitoring. It is not an EDR.

## **Output and Exposure Catalog**

Each package record includes the hostname, OS, architecture, ecosystem, package name, version, source file, and a `confidence` field. Confidence is `high` when exact identity and version came from canonical metadata, `medium` when identity is reliable but version or source is partial, and `low` when only a config path or spec reference is found.

Security teams supply their own exposure catalogs — simple JSON files specifying ecosystem, package name, and affected versions. When Bumblebee finds a match, it emits a finding record including severity, catalog ID, and evidence. Each finding is fully traceable back to which catalog entry triggered it. The repo also includes a `threat_intel/` directory with maintained exposure catalogs built from public supply-chain campaign reporting.

## **Getting Started**

**Bumblebee requires Go 1.25 or later. Install with:**

```
go install github.com/perplexityai/bumblebee/cmd/bumblebee@latest
```

After install, `bumblebee selftest` verifies the binary works correctly against embedded fixtures. The tool is licensed under Apache License 2.0. The current release is v0.1.1.

## **Key Takeaways**

-   Bumblebee is Perplexity’s open-sourced, read-only developer endpoint scanner for supply-chain exposure checks.
-   It covers npm, pnpm, Yarn, Bun, PyPI, Go modules, RubyGems, Composer, MCP configs, editor extensions, and browser extensions.
-   Three scan profiles — `baseline`, `project`, and `deep` — support routine inventory and active incident response.
-   The tool never executes install scripts or invokes package managers, preventing scan-triggered attacks.
-   Built in Go with zero non-stdlib dependencies; available now on GitHub under Apache 2.0.

* * *

Check out the **[GitHub Repo](https://github.com/perplexityai/bumblebee)** and **[Technical details](https://www.perplexity.ai/hub/blog/perplexity-is-open-sourcing-bumblebee).** Also, feel free to follow us on **[Twitter](https://x.com/intent/follow?screen_name=marktechpost)** and don’t forget to join our **[150k+ ML SubReddit](https://www.reddit.com/r/machinelearningnews/)** and Subscribe to **[our Newsletter](https://www.aidevsignals.com/)**. Wait! are you on telegram? **[now you can join us on telegram as well.](https://t.me/machinelearningresearchnews)**

Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? **[Connect with us](https://forms.gle/MTNLpmJtsFA3VRVd9)**

[![](https://www.marktechpost.com/wp-content/uploads/2019/06/Screen-Shot-2021-09-14-at-9.02.24-AM-150x150.png)](https://www.marktechpost.com/author/6flvq/)

##### [Asif Razzaq](https://www.marktechpost.com/author/6flvq/)

Asif Razzaq is the CEO of Marktechpost Media Inc.. As a visionary entrepreneur and engineer, Asif is committed to harnessing the potential of Artificial Intelligence for social good. His most recent endeavor is the launch of an Artificial Intelligence Media Platform, Marktechpost, which stands out for its in-depth coverage of machine learning and deep learning news that is both technically sound and easily understandable by a wide audience. The platform boasts of over 2 million monthly views, illustrating its popularity among audiences.
