# Schemas

`schema migrate` is the schema editor. Routine node and edge edits use `spl_mutate`.

Author the target schema in TOML, optionally include a conforming mutation batch, and write both through a short-lived branch and pull request:

- **MCP:** `spl_schema_migrate` with required `schema_toml` (inline TOML or a path to a schema file) and optional `operations`, `author`, and `message`.
- **CLI:**

```sh
spl schema migrate --schema people.toml --batch people-mutations.json --message "Migrate people schema"
spl validate
```

`--schema` is required. `--batch` is optional. The command validates the candidate graph against the target schema before opening a pull request. Identical schema content is a no-op (no empty PR).

`spl_validate` / `spl validate` checks the bound checkout against `schema.toml`. It takes no arguments. Unbound checkouts are refused.
