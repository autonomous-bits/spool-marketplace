---
name: spool
description: Use the local Spool CLI (`spl`) to initialize repositories, stage and commit graph changes, manage branches and merges, query graph snapshots, validate schemas, and maintain repository integrity.
---

# Spool

Spool is a local, content-addressed graph version-control system.

## Interaction Protocol

Use the local `spl` CLI. It writes successful JSON results to stdout and structured failures to
stderr. Do not edit the resolved Spool state directory directly. The `spl` executable must be
available on the user's `PATH`.

## Command Reference

| Task | CLI command |
| --- | --- |
| Working changes | `spl add`, `spl status`, `spl commit` |
| Branches | `spl branch list`, `spl branch create`, `spl switch` |
| Reading graphs | `spl resolve`, `spl search`, `spl filter`, `spl context`, `spl graph` |
| History | `spl diff`, `spl history`, `spl branches-containing` |
| Merges | `spl merge preview/apply/conflicts/resolve/finalize/abort` |
| Maintenance | `spl init`, `spl validate`, `spl fsck`, `spl gc`, `spl prune` |
| Assets, workspaces, and remotes | corresponding `spl` commands |

## Branch Strategy & User Elicitation

Before staging or committing changes:
1. **Check the active branch**: Run `spl branch list`.
2. **Elicit user intent**: Unless the user has already specified a target branch, prompt the user to clarify whether changes should be:
   - Committed directly to the current branch (e.g. `main`), or
   - Isolated on a new dedicated branch to allow review, diffing, and isolated merging.
3. **Execute branch setup**: If a new branch was requested or agreed upon:
   ```sh
   spl branch create <new-branch> --from-branch <current-branch>
   spl switch <new-branch>
   ```

Before merging a feature branch containing transient planning data, use
`spl prune --branch <branch> --dry-run`. After reviewing its output, run `spl prune` to commit
removal of nodes labeled `Ephemeral` and their incident edges. `prune` refuses branches with staged
changes and requires `--force` for the protected default branch.

## Invocation Rules & Pitfalls

1. **Native queries only**: Use direct Spool CLI queries. Do not pipe JSON output to Python, jq,
   awk, or ad-hoc shell parsing scripts.
2. **Resolve**: `spl resolve` requires `--node <node-id>`.
3. **Diff**: Use `--base-branch` and `--target-branch`.
4. **Merge**: `spl merge apply` requires the preview ID, transaction ID, source, target, author,
   and message.
5. **Context and search-expand**: Use `--query` or `--label`, and `--max-depth`; never use `id`
   as a query parameter.

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
