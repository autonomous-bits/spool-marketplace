# Review

Review the Spool pull request in GitHub. On the context remote, stock git is the review plane:

```sh
git log
git diff main...feature -- nodes edges schema.toml assets
```

Spool MCP and CLI mutate, query, validate, merge, and prune the bound graph. They do not wrap review. Agent writes already open a short-lived branch and a pull request into the protected branch; review and land that pull request with GitHub and stock git.

File-graph merge of two context-git branches remains `spl_merge_*` / `spl merge`. See [Merges](merges.md).
