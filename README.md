# Spool Marketplace

Install Spool's MCP-enabled knowledge-graph authoring skills for GitHub Copilot CLI.

## Install

Register this marketplace, then install the Spool skills plugin:

```sh
copilot plugin marketplace add autonomous-bits/spool-marketplace
copilot plugin install spool-skills@spool-marketplace
```

The `spool-skills` plugin includes:

- a native stdio MCP server that launches `spl mcp`; install the Spool `spl` v1.9.0 or later
  executable and ensure it is on your `PATH`.
- `spool` — work with Spool graphs using native `spl_*` MCP tools, with the `spl` CLI as a fallback.
- `spool-architecture` — author and query architectural knowledge.
- `spool-engineering-standards` — author and query engineering standards.
- `spool-product` — author and query product knowledge.
- `spool-technical-implementation` — capture technical implementation knowledge.

Start a new Copilot session after installation and use `/skills list` to confirm the skills and
`/mcp` to confirm the `spool` server are available.

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