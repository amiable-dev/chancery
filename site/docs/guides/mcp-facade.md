# MCP facade

`kb-mcp` is a local stdio MCP server for the consumers a shell can't reach cleanly — deep-research workflows, Python tooling, notebooks. It is a second *surface*, never a second implementation: every call delegates to the CLI, which is why its results are **byte-identical** and its refusals carry the same codes.

```console
$ claude mcp add kb -- kb-mcp        # from the repo you want governed
```

## Six tools, and only six

| tool | writes |
| --- | --- |
| `kb_search` | none — byte-identical to `kb query` phase 1 |
| `kb_read` | none — slug-resolved (never a path), superseded notes flagged |
| `kb_context` | none — the compiled bundle |
| `kb_propose` | quarantine/queue only (`url` · `staging-draft` · `queue-proposal`) |
| `kb_task` | none — phase-1 emission for any judgment verb |
| `kb_submit` | the **identical gated apply** — envelope checks, write-set guard, post-apply verify, rollback |

## The boundaries

- **Colocated only.** Stdio, no network listener, no auth of its own — a hosted surface is a separate, explicitly gated decision.
- **Writes are protected**: dirty-worktree refusal, proposal rate and size limits, every proposal stamped with its origin.
- **Read results are data.** A note that *instructs* your agent to call `kb_propose` is the classic confused-deputy loop — propose-only writes bound the blast radius, and human review of the quarantine is the backstop.
