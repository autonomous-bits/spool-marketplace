# CLI help

`spl` writes successful results as JSON on stdout and structured failures on stderr. Help text is human-readable.

```sh
spl --help
spl <command> --help
spl merge --help
```

`spl --help` lists the KEEP surface: `asset`, `completion`, `context`, `filter`, `graph`, `help`, `mcp`, `merge`, `mutate`, `prune`, `query-context`, `resolve`, `schema`, `search`, `search-expand`, `validate`, `version`.

Context-management commands require `.spool/context.toml` (`solution_id`, `remote`, `protected_branch`) and refuse an unbound checkout.

## Command index

| Command | Purpose |
| --- | --- |
| `context init` | Bind this code repo to a context git remote |
| `context export`, `context migrate-once` | One-shot export into that remote |
| `query-context` | Evidence-focused bounded graph context |
| `search`, `filter`, `search-expand`, `resolve`, `graph` | Query the bound checkout |
| `mutate` | Node/edge batch → short-lived branch + PR |
| `schema migrate`, `validate` | Schema write and bound validation |
| `merge preview/apply/conflicts/resolve/finalize/abort` | File-graph merge |
| `prune` | Remove `Ephemeral` nodes and cascading edges |
| `asset add`, `asset read` | Store and stream reference assets |
| `mcp` | KEEP MCP server over stdio |
| `version` | Build provenance as JSON |
| `completion`, `help` | Shell completion and command help |

All commands accept `-h, --help`.

## Bind and export

```sh
spl context init --remote https://github.com/org/solution-context.git
```

```text
context init
  --remote <url>             context git remote (required)
  --solution-id <id>         defaults to the current directory name
  --protected-branch <name>  defaults to main
  --repository-id <id>       code-repo namespace for node IDs
  --author <text>            git author for the layout seed
```

If you still have a leftover `.spl` store, run `context export` / `migrate-once` once into the bound context git remote, then stop using `.spl`. Export is lossy; re-run is overwrite-at-own-risk.

```text
context export / migrate-once
  --from <path>     leftover store directory
  --branch <name>   snapshot to export
  --author <text>
  --message <text>
```

The `context` command group is not the query verb. Use `query-context`.

## Mutate

```sh
spl mutate --operations mutations.json --message "Record requirement"
```

```text
mutate
  --operations <path|->  JSON mutation-operation array (required; - reads stdin)
  --author <text>
  --message <text>
```

Bound-only. One batch becomes one git commit on a short-lived branch plus a pull request. Identical or empty diffs do not open a PR. Use `schema migrate` when changing `schema.toml`.

## Reading graphs

```sh
spl resolve --node <node-id>
spl graph
spl search --query incident
spl filter --label Task --property-text status=open
spl search-expand --query incident --direction out --edge-type RELATES_TO
spl query-context --label Task --property-text status=open --direction both
```

```text
resolve
  --node <id>                 stable node id (required)

search
  --query <text>              lexical query (required)

filter
  --label <label>             required node label (repeatable)
  --property-text <key=value>
  --property-number <key=value>
  --property-min <key=value>
  --property-max <key=value>

search-expand / query-context
  --query <text>              exclusive with typed filters
  --label / property-*        typed seed selector
  --direction out|in|both     default: out
  --edge-type <type>          repeatable
  --seed-limit <n>
```

Queries use the local projection rebuilt from the checkout. Do not commit that projection.

## Schemas

```sh
spl schema migrate --schema people.toml --batch people-mutations.json
spl validate
```

```text
schema migrate
  --schema <path>  target TOML schema (required)
  --batch <path>   optional JSON mutation-operation array
  --author <text>
  --message <text>

validate
  (no flags; bound checkout)
```

## Assets

```sh
spl asset add --file docs/architecture.md --title "Architecture notes"
spl asset read --node notes
```

```text
asset add
  --file <path>    required
  --title <text>
  --id <id>
  --author <text>
  --message <text>

asset read [locator-or-node-id]
  --locator <path-or-hash>
  --node <id>
```

`asset add` writes the file under `assets/`, links an `Asset` node, and opens a short-lived branch and pull request. `asset read` streams raw bytes to stdout. MCP `spl_asset_read` takes `target` (path, hash, or node id) and returns text or base64. Non-text assets at or above 512 KiB use Git LFS. The bind file may set `lfs_threshold_kib`. Text, JSON, and TOML stay in plain git.

## Merges

```sh
spl merge preview --source feature --target main
spl merge apply --source feature --target main --transaction merge-42 \
  --preview <preview-id> --message "Merge feature"
spl merge conflicts --transaction merge-42
spl merge resolve --transaction merge-42 --preview <preview-id> \
  --selections selections.json
spl merge finalize --transaction merge-42
spl merge abort --transaction merge-42
```

See [Merges](merges.md).

## Prune

```sh
spl prune --dry-run
spl prune --author alice --message "Prune transient plan"
```

Removes `Ephemeral` nodes and cascading edges on the bound checkout. A write opens a short-lived branch and a pull request.

## MCP, version, completion

```sh
spl mcp
spl version
spl completion --help
spl help query-context
```

`mcp` exposes the KEEP tool set over stdio, matching `spl --help`.
