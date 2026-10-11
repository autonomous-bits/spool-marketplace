# Spool Marketplace

Install Spool knowledge-graph authoring skills for GitHub Copilot CLI.

## Install

Register this marketplace, then install the Spool skills plugin:

```sh
copilot plugin marketplace add autonomous-bits/spool-marketplace
copilot plugin install spool-skills@spool-marketplace
```

The `spool-skills` plugin includes:

- `spool` — bind a code repository to a context git remote and use KEEP MCP tools (`spl_*`), with the `spl` CLI as fallback. Install an `spl` build whose `spl --help` lists `context`, `mutate`, `query-context`, and `mcp`, and ensure it is on your `PATH`.
- `spool-architecture` — author and query architectural knowledge.
- `spool-engineering-standards` — author and query engineering standards.
- `spool-product` — author and query product knowledge.
- `spool-technical-implementation` — capture technical implementation knowledge.

These skills are the discovery path for how agents operate Spool. They teach the bound context-git surface only: explicit `.spool/context.toml`, MCP/CLI KEEP tools, short-lived branch and pull request on every write, and GitHub plus stock git for review. If you still have a leftover `.spl` store, run `context export` / `migrate-once` once into the bound context git remote, then stop using `.spl`. Export is lossy; re-run is overwrite-at-own-risk.

Start a new Copilot session after installation and use `/skills list` to confirm the skills are
available.

## Development

The marketplace catalog is at `.github/plugin/marketplace.json`. The portable
Agent Plugins 1.0 package is at `plugins/spool-skills`; every skill is an
immediate subdirectory of `skills/` containing a `SKILL.md`.

Validate the catalog and package locally:

```sh
node .github/scripts/validate-marketplace.mjs
```

The skill content originates from
[autonomous-bits/spool](https://github.com/autonomous-bits/spool) and is
distributed under its Apache-2.0 license.