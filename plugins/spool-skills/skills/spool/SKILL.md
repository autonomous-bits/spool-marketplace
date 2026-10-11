---
name: spool
description: Use native Spool MCP tools (`spl_*`) by default, falling back to the local CLI (`spl`) when MCP is unavailable. Bind a code repository to a context git remote, then mutate, query, validate, merge, and prune the bound graph.
---

# Spool

Spool stores solution context as human-diffable graph files in a git remote. Git is the source of truth. Bind a code repository with `.spool/context.toml`, then query and mutate through the KEEP CLI and MCP tools.

## Interaction protocol

Use Spool's native MCP tools (`spl_*`) whenever the MCP server is available. Use the `spl` CLI when MCP is unavailable, the transport fails, or the work is a shell script or CI job. Successful CLI commands write JSON to stdout. Failures are structured JSON on stderr and a non-zero exit.

This plugin does not bundle an MCP server configuration. Run `spl mcp` (stdio) from an `spl` binary whose `spl --help` lists the bound context-git commands, and point the client at that binary. Confirm the installed surface with `spl --help` and `spl <command> --help` instead of assuming an older release matches this skill.

Context-management tools are bound-only. If `.spool/context.toml` is missing, they fail closed. Bind explicitly:

```sh
spl context init --remote https://github.com/org/solution-context.git
```

That writes `.spool/context.toml` (`solution_id`, `remote`, `protected_branch`). Repeat it in each code repository that shares the same context remote. Do not infer a remote from a directory name, a git origin URL, or a leftover store.

## Locks

1. **Explicit bind.** Unbound writes are refused. There is no auto-discovery.
2. **Every agent write is a short-lived branch and a pull request.** `spl_mutate`, `spl_schema_migrate`, `spl_asset_add`, `spl_prune`, file-graph merge apply/finalize, and `spl_context_export` open a branch and a PR. They do not update the protected branch directly. An identical or empty diff does not open a PR.
3. **Projection rebuild is local-only.** Reads use a SQLite projection rebuilt from the bound checkout (user cache, or `SPOOL_CONTEXT_CACHE`). It is not source of truth. Never commit it and never put it on the context remote.
4. **Review plane.** Review the Spool pull request in GitHub. On the context remote, stock git is history and diff (`git log`, `git diff`). Spool does not wrap that review plane.

## MCP tool to CLI mapping

| MCP tool | CLI fallback | Role |
| --- | --- | --- |
| *(CLI only)* | `spl context init --remote <url>` | Write `.spool/context.toml` and seed an empty remote |
| `spl_context_export` | `spl context export` / `spl context migrate-once` | One-shot escape hatch (below) |
| `spl_mutate` | `spl mutate --operations <file>` | Node/edge batch → short-lived branch + PR |
| `spl_query_context` | `spl query-context` | Evidence-focused bounded context |
| `spl_search` | `spl search --query <text>` | Lexical search on the projection |
| `spl_search_expand` | `spl search-expand` | Seed retrieval plus bounded expansion |
| `spl_filter` | `spl filter` | Labels and indexed property predicates |
| `spl_resolve` | `spl resolve --node <id>` | One node by stable id |
| `spl_graph` | `spl graph` | Full bound snapshot |
| `spl_schema_migrate` | `spl schema migrate --schema <file>` | `schema.toml` plus optional conforming batch → PR |
| `spl_validate` | `spl validate` | Bound checkout against `schema.toml` |
| `spl_asset_add` | `spl asset add --file <path>` | Ingest a reference file → PR |
| `spl_asset_read` | `spl asset read` | Stream asset bytes |
| `spl_merge_preview` | `spl merge preview --source <s> --target <t>` | Three-way file-graph preview |
| `spl_merge_apply` | `spl merge apply` | Clean preview → short-lived branch + PR |
| `spl_merge_conflicts` | `spl merge conflicts --transaction <id>` | Inspect a conflicted merge |
| `spl_merge_resolve` | `spl merge resolve` | Selections plus optional overrides |
| `spl_merge_finalize` | `spl merge finalize --transaction <id>` | Resolved merge → short-lived branch + PR |
| `spl_merge_abort` | `spl merge abort --transaction <id>` | Drop a conflicted merge |
| `spl_prune` | `spl prune` | `Ephemeral` nodes and cascading edges → PR |
| `spl_version` | `spl version` | Binary provenance |

`spl mcp` serves this tool set. `spl completion` and `spl help` inspect the CLI.

Graph operation objects inside a mutate batch use an `action` of `add`, `update`, or `delete`. That field is the batch contract, not a CLI command. Change `schema.toml` only with `spl_schema_migrate`.

## Escape hatch

If you still have a leftover `.spl` store, run `context export` / `migrate-once` once into the bound context git remote, then stop using `.spl`. Export is lossy; re-run is overwrite-at-own-risk.

MCP: `spl_context_export`. CLI: `spl context export` or `spl context migrate-once`. Kept: nodes, edges, schema, assets. The `context` command group is bind and this export only. Querying the graph is `spl_query_context` / `spl query-context`.

## Invocation rules

1. **Native queries.** Use `spl_search`, `spl_filter`, `spl_resolve`, `spl_query_context`, `spl_search_expand`, and `spl_graph` (or the CLI forms). Do not pipe graph JSON through ad-hoc parsers.
2. **`spl_resolve`.** Requires `node`.
3. **`spl_query_context` and `spl_search_expand`.** Pass `query` or label/predicate filters, never both. Do not pass `id`. `direction` is `out` (default), `in`, or `both`. Optional: `edge_types`, `seed_limit`, `label` / `labels`, `predicates`.
4. **`spl_merge_apply`.** Requires `source`, `target`, `transaction_id`, and `preview_id`. `author` and `message` are optional. Preview first and reuse that preview id.
5. **`spl_prune`.** Call with `dry_run: true` first. A real prune opens a short-lived branch and a pull request. It removes `Ephemeral` nodes and cascading edges. It is not object-store cleanup.
6. **Assets.** Non-text assets at or above 512 KiB use Git LFS (bind field `lfs_threshold_kib` overrides the default). This skill does not change that policy.

## Command index

| Topic | Reference |
| --- | --- |
| Bind, mutate, export | [Working changes](references/working-changes.md) |
| Mutation batches | [Batch authoring](references/batch-authoring.md) |
| GitHub and stock git review | [Review](references/review.md) |
| `schema migrate`, `validate` | [Schemas](references/schemas.md) |
| `resolve`, `search`, `filter`, `search-expand`, `query-context`, `graph` | [Reading graphs](references/reading-graphs.md) |
| File-graph `merge` | [Merges](references/merges.md) |
| `prune` | [Maintenance](references/maintenance.md) |
| Flags, assets, `mcp`, `version` | [CLI help](references/cli-help.md) |
