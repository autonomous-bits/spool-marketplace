# Working changes

## Bind

Bind this code repository once:

```sh
spl context init --remote https://github.com/org/solution-context.git
```

Optional flags: `--solution-id`, `--protected-branch` (default `main`), `--repository-id`, `--author`. The command writes `.spool/context.toml` and seeds `schema.toml`, `nodes/`, `edges/`, and `assets/` on an empty remote, plus a `CodeRepository` node for this bind. Repeat it in each code repository that shares the same context remote. Context-management commands refuse to run without the bind file.

## Graph writes

Routine node and edge writes are one JSON mutation-operation batch. Each write opens a short-lived branch and a pull request. An identical or empty diff does not open a PR.

- **MCP:** `spl_mutate` with `operations` (required), plus optional `author` and `message`.
- **CLI:**

```sh
spl mutate --operations mutations.json --message "Record requirement"
cat mutations.json | spl mutate --operations - --message "Record requirement"
```

`--operations` is a file path or `-` for stdin. Use `spl_schema_migrate` / `spl schema migrate` when changing `schema.toml`. Use `spl_asset_add` for reference files and `spl_prune` for `Ephemeral` nodes.

## Escape hatch

If you still have a leftover `.spl` store, run `context export` / `migrate-once` once into the bound context git remote, then stop using `.spl`. Export is lossy; re-run is overwrite-at-own-risk.

```sh
spl context export
spl context migrate-once
```

MCP: `spl_context_export` with optional `from`, `branch`, `author`, and `message`. CLI flags: `--from` (leftover store directory), `--branch` (which snapshot to export), `--author`, `--message`. Kept: nodes, edges, schema, assets.
