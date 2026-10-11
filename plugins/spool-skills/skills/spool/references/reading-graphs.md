# Reading graphs

Reads require a bound checkout (`.spool/context.toml`). They run against a SQLite projection rebuilt from that checkout. The projection lives in the local cache (`SPOOL_CONTEXT_CACHE` or the user cache under `spool/context`). It is not source of truth. Never commit it and never put it on the context remote.

| MCP | CLI |
| --- | --- |
| `spl_resolve` `{ "node": "<id>" }` | `spl resolve --node <id>` |
| `spl_graph` `{}` | `spl graph` |
| `spl_search` `{ "query": "incident" }` | `spl search --query incident` |
| `spl_filter` `{ "labels": ["Task"], "predicates": [...] }` | `spl filter --label Task --property-text status=open` |
| `spl_search_expand` | `spl search-expand --query incident --direction out --edge-type RELATES_TO` |
| `spl_query_context` | `spl query-context --label Task --property-text status=open --direction both` |

`spl_search` requires `query`. `spl_filter` accepts `labels` and `predicates` (`key` plus one of `textEquals`, `numberEquals`, `numberMin`, `numberMax`). CLI filter flags are repeatable `--label`, `--property-text key=value`, `--property-number key=value`, `--property-min key=value`, and `--property-max key=value`. Indexed filters apply only to scalar schema properties marked indexed.

`spl_query_context` and `spl_search_expand` take one seed selector: `query`, or `label` / `labels` / `predicates`. Do not combine `query` with filters. Do not pass `id`. `direction` is `out` (default), `in`, or `both`. Optional: `edge_types` (CLI `--edge-type`, repeatable) and `seed_limit` (CLI `--seed-limit`).

The `context` CLI group is bind and the one-shot export. Querying is `query-context`.
