# GitHub - e2b-dev/E2B: Open-source, secure environment with real-world tools for enterprise-grade agents.

**Source:** https://github.com/e2b-dev/e2b
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Open-source, secure environment with real-world tools for enterprise-grade agents. - e2b-dev/E2B

---

[![E2B Logo](https://github.com/e2b-dev/E2B/raw/main/readme-assets/logo-black.png#gh-light-mode-only)](https://github.com/e2b-dev/E2B/blob/main/readme-assets/logo-black.png#gh-light-mode-only) [![E2B Logo](https://github.com/e2b-dev/E2B/raw/main/readme-assets/logo-white.png#gh-dark-mode-only)](https://github.com/e2b-dev/E2B/blob/main/readme-assets/logo-white.png#gh-dark-mode-only)

## What is E2B?

[](#what-is-e2b)

[E2B](https://e2b.dev/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=E2B) is an open-source infrastructure that allows you to run AI-generated code in secure isolated sandboxes in the cloud. To start and control sandboxes, use our [JavaScript SDK](https://www.npmjs.com/package/e2b) or [Python SDK](https://pypi.org/project/e2b).

## Run your first Sandbox

[](#run-your-first-sandbox)

### 1\. Install SDK

[](#1-install-sdk)

JavaScript / TypeScript

```
npm i e2b
```

Python

```
pip install e2b
```

### 2\. Get your E2B API key

[](#2-get-your-e2b-api-key)

1.  Sign up to E2B [here](https://e2b.dev/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=E2B).
2.  Get your API key [here](https://e2b.dev/dashboard?tab=keys&utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=E2B).
3.  Set environment variable with your API key

```
E2B_API_KEY=e2b_***
```

### 3\. Start a sandbox and run commands

[](#3-start-a-sandbox-and-run-commands)

JavaScript / TypeScript

import Sandbox from 'e2b'

const sandbox \= await Sandbox.create()
const result \= await sandbox.commands.run('echo "Hello from E2B!"')
console.log(result.stdout) // Hello from E2B!

Python

from e2b import Sandbox

with Sandbox.create() as sandbox:
    result \= sandbox.commands.run('echo "Hello from E2B!"')
    print(result.stdout)  \# Hello from E2B!

### 4\. Code execution with Code Interpreter

[](#4-code-execution-with-code-interpreter)

If you need to execute code with [`runCode()`](https://e2b.dev/docs/code-interpreting?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=E2B)/[`run_code()`](https://e2b.dev/docs/code-interpreting?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=E2B), install the [Code Interpreter SDK](https://github.com/e2b-dev/code-interpreter):

```
npm i @e2b/code-interpreter  # JavaScript/TypeScript
pip install e2b-code-interpreter  # Python
```

import { Sandbox } from '@e2b/code-interpreter'

const sandbox \= await Sandbox.create()
const execution \= await sandbox.runCode('x = 1; x += 1; x')
console.log(execution.text)  // outputs 2

### 5\. Check docs

[](#5-check-docs)

Visit [E2B documentation](https://e2b.dev/docs?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=E2B).

### 6\. E2B cookbook

[](#6-e2b-cookbook)

Visit our [Cookbook](https://github.com/e2b-dev/e2b-cookbook/tree/main) to get inspired by examples with different LLMs and AI frameworks.

## Self-hosting

[](#self-hosting)

Read the [self-hosting guide](https://github.com/e2b-dev/infra/blob/main/self-host.md) to learn how to set up the [E2B infrastructure](https://github.com/e2b-dev/infra) on your own. The infrastructure is deployed using Terraform.

Supported cloud providers:

-   🟢 AWS
-   🟢 Google Cloud (GCP)
-   Azure
-   General Linux machine
