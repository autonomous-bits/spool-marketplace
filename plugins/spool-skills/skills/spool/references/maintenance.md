# Maintenance

## Graph pruning

`spl_prune` / `spl prune` removes nodes labeled `Ephemeral` and their cascading incident edges from the bound context checkout. A non-dry-run opens a short-lived branch and a pull request. Unbound checkouts are refused. A zero-match run is a no-op.

```sh
spl prune --dry-run
spl prune --author alice --message "Prune transient plan"
```

MCP: `spl_prune` with optional `dry_run`, `author`, and `message`. Preview with `dry_run: true` before writing.

This is graph cleanup of temporary planning nodes. It is not object-store or pack cleanup. Object storage on the context remote is ordinary git.
