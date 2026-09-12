---
name: spool
description: Use native Spool MCP tools (`spl_*`) by default, falling back to the local CLI (`spl`) when MCP is unavailable. Initialize repositories, stage and commit graph changes, manage branches and merges, query graph snapshots, validate schemas, and maintain repository integrity.
---

# Spool

Spool is a local, content-addressed graph version-control system.

## Interaction Protocol: MCP Default with CLI Fallback

Use Spool's native MCP tools (`spl_*`) as the primary interface whenever they are available. They
provide typed input schemas, in-memory mutation staging through `spl_add`, serialized repository
access, structured conflict handling, and warning preservation.

Use the `spl` CLI when MCP is unavailable, has a transport or protocol failure, or when running
shell scripts and CI. CLI commands write successful JSON results to stdout and structured failures
to stderr. Do not edit the resolved Spool state directory directly.

This plugin does not bundle an MCP server configuration. Configure the Spool MCP server separately
to use the native tools. The `spl` executable must be available on the user's `PATH`.

## MCP Tool to CLI Mapping

| MCP tool | CLI fallback |
| --- | --- |
| `spl_add`, `spl_status`, `spl_commit` | `spl add`, `spl status`, `spl commit` |
| `spl_branch_list`, `spl_branch_create`, `spl_switch` | `spl branch list`, `spl branch create`, `spl switch` |
| `spl_resolve`, `spl_search`, `spl_filter`, `spl_context`, `spl_graph` | `spl resolve`, `spl search`, `spl filter`, `spl context`, `spl graph` |
| `spl_diff`, `spl_history`, `spl_branches_containing` | `spl diff`, `spl history`, `spl branches-containing` |
| `spl_merge_*` | `spl merge preview/apply/conflicts/resolve/finalize/abort` |
| `spl_init`, `spl_validate`, `spl_fsck`, `spl_gc`, `spl_prune` | `spl init`, `spl validate`, `spl fsck`, `spl gc`, `spl prune` |
| `spl_asset_*`, `spl_workspace_*`, `spl_remote_*`, `spl_push`, `spl_pull` | corresponding `spl` commands |

## Branch Strategy & User Elicitation

Before staging or committing changes:
1. **Check the active branch**: Call `spl_branch_list`, or run `spl branch list` when using the CLI.
2. **Elicit user intent**: Unless the user has already specified a target branch, prompt the user to clarify whether changes should be:
   - Committed directly to the current branch (e.g. `main`), or
   - Isolated on a new dedicated branch to allow review, diffing, and isolated merging.
3. **Execute branch setup**: If a new branch was requested or agreed upon, call `spl_branch_create`
   followed by `spl_switch`, or use the CLI fallback:
   ```sh
   spl branch create <new-branch> --from-branch <current-branch>
   spl switch <new-branch>
   ```

Before merging a feature branch containing transient planning data, call
`spl_prune(branch: "<branch>", dry_run: true)`. After reviewing its output, call `spl_prune` to
commit removal of nodes labeled `Ephemeral` and their incident edges. With the CLI fallback, use
`spl prune --branch <branch> --dry-run`; `prune` refuses branches with staged changes and requires
`--force` for the protected default branch.

## Invocation Rules & Pitfalls

1. **Native queries only**: Use native Spool query tools or their direct CLI counterparts. Do not
   pipe JSON output to Python, jq, awk, or ad-hoc shell parsing scripts.
2. **Resolve**: `spl_resolve` requires `node`; its CLI equivalent requires `--node <node-id>`.
3. **Diff**: Use `base_branch` and `target_branch`, or CLI `--base-branch` and `--target-branch`.
4. **Merge**: `spl_merge_apply` requires `preview_id`, `transaction_id`, `source`, `target`,
   `author`, and `message`.
5. **Context and search-expand**: Use `query` or labels/predicates, never `id`; use `max_depth`,
   not `depth`. The CLI equivalents are `--query` or `--label`, and `--max-depth`.

## Command index

| Commands | Reference |
| --- | --- |
| `init`, `add`, `status`, `commit` | [Working changes](references/working-changes.md) |
| Authoring `add` batches and atomic ideas | [Batch authoring](references/batch-authoring.md) |
| `branch`, `switch`, `history`, `branches-containing`, `diff`, `cherry-pick` | [Branches and history](references/branches-and-history.md) |
| `schema migrate`, `validate` | [Schemas](references/schemas.md) |
| `resolve`, `search`, `filter`, `search-expand`, `context` | [Reading graphs](references/reading-graphs.md) |
| `merge`, `merge preview`, `merge apply`, `merge conflicts`, `merge resolve`, `merge finalize`, `merge abort` | [Merges](references/merges.md) |
| `fsck`, `gc`, `prune` | [Maintenance](references/maintenance.md) |
| `asset add`, `asset read` | [CLI help](references/cli-help.md) |
| `workspace init`, `workspace attach`, `migrate` | [Multi-repo workspaces](references/workspaces.md) |
| `remote`, `push`, `pull`, `clone`, `mcp` | [CLI help](references/cli-help.md) |
| `version`, `completion`, `help` | [CLI help](references/cli-help.md) |
