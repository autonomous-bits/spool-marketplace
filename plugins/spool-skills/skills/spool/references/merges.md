# Merges

File-graph merge compares two context-git branches as node and edge files. Preview first. Reuse the preview id and a caller-owned transaction id.

- **MCP:** `spl_merge_preview` with required `source` and `target`.
- **CLI:**

```sh
spl merge preview --source feature --target main
spl merge apply --source feature --target main --transaction merge-42 \
  --preview <preview-id> --author alice --message "Merge feature"
```

`spl_merge_apply` requires `source`, `target`, `transaction_id`, and `preview_id`. `author` and `message` are optional. A clean, exact preview opens a short-lived branch and a pull request.

When the preview conflicts, inspect the cached merge and resolve it:

```sh
spl merge conflicts --transaction merge-42
spl merge resolve --transaction merge-42 --preview <preview-id> \
  --selections selections.json
spl merge finalize --transaction merge-42
```

MCP equivalents: `spl_merge_conflicts` (`transaction_id`), `spl_merge_resolve` (`transaction_id`, `preview_id`, `selections`, optional `overrides`), `spl_merge_finalize` (`transaction_id`, optional `author` and `message`).

`selections` is an array of `{ "conflictId": "...", "choice": "source" }` or `"target"`. `overrides` is an optional mutation-operation array for schema-derived semantic conflicts. CLI: `--selections <file>` and optional `--overrides <file>`.

Abort with `spl_merge_abort` / `spl merge abort --transaction merge-42`.
