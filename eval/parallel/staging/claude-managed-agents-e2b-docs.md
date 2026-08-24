# Claude Managed Agents - E2B Docs

**Source:** https://docs.e2b.dev/agents/claude-managed-agents
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Use E2B as the sandbox runtime for Claude Managed Agents self-hosted environments.

---

[Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) can use a self-hosted environment when you want tool calls to run in your own infrastructure. Claude runs the agentic loop and reasoning process; E2B provides isolated sandbox infrastructure for the environment where tool calls execute. The reusable `E2B/claude-managed-agents-webhooks` template receives webhooks and routes each Claude Managed Agents session to a persistent E2B worker sandbox.

## Install dependencies

Export the values you will pass to the webhook sandbox:

## Start the webhook sandbox

Start the public template with auto-resume enabled. The template starts a webhook server on port `8000`. Because the signing key only appears after you register a webhook endpoint, write the router config now and add the signing key to the same sandbox after registration.

## Register the webhook

In the [Claude Console webhooks settings](https://platform.claude.com/settings/workspaces/default/webhooks), create a webhook endpoint using the printed URL:

Subscribe it to:

Save the generated signing key, export it locally, then write it into the same webhook sandbox.

## Run an end-to-end smoke test

Create or select a Claude Managed Agents agent in the [Claude Console](https://platform.claude.com/workspaces/default/agents), then create a session with that agent and the same `ANTHROPIC_ENVIRONMENT_ID` you wrote into the webhook sandbox. Creating the session does not start work; the `user.message` event does.

Use a small shell task for the first smoke test:

Claude should answer:

Then check the webhook sandbox:

A healthy run has:

-   `/health` returning `ok: true`.
-   Router logs showing `routing work` and `assigned session`.
-   A session-to-sandbox assignment in the router’s assignment store.
-   The assigned worker sandbox’s `worker.log` showing the shell tool execution and successful results posted back to Claude.
-   The Claude Managed Agents session returning to `session.status_idle`.

The assignment store records the worker sandbox ID for each routed session. Connect to that sandbox and check `/opt/anthropic-managed-agents-js/worker.log` when you need the tool execution logs. If the session stays at `requires_action`, check `/opt/anthropic-managed-agents-js/webhook.log` in the router sandbox first, then check `/opt/anthropic-managed-agents-js/worker.log` in the assigned worker sandbox. Stale environment keys, missing signing keys, archived sessions, and failed tool-result posts show up there.

## Runtime behavior

The worker sandbox runs tool calls with `/mnt/session` as its workdir. File tools are constrained to that workdir, skills are downloaded under `/mnt/session/skills/<name>/`, and generated artifacts should be written under `/mnt/session/outputs`. The webhook sandbox is the router. It keeps a session-to-sandbox assignment store and starts worker sandboxes with E2B auto-resume and pause-on-timeout settings.

## Session-scoped sandboxes

By default, the public webhook template gives each Claude Managed Agents session its own E2B worker sandbox. Follow-up turns for the same session reconnect to the same worker and reuse its `/mnt/session` filesystem. The sandbox is the isolated execution environment, not the place where Claude’s reasoning loop runs. Use [cloud buckets](https://docs.e2b.dev/storage/cloud-buckets), [Archil](https://docs.e2b.dev/storage/archil), or [volumes](https://docs.e2b.dev/volumes) when files need to outlive a sandbox or be shared across many sandboxes. If you want to run that router in your own service instead of in E2B, use the cookbook’s [`app-webhooks/` example](https://github.com/e2b-dev/e2b-cookbook/tree/main/examples/anthropic-managed-agents/javascript/app-webhooks). It receives webhooks in your app, claims work there, and routes each session to its own E2B sandbox by default.

## Clean up

Remove the webhook endpoint in the Claude Console before deleting the router sandbox. Then kill the router sandbox and any assigned worker sandboxes you no longer need.
