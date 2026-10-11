# Batch authoring

A mutation batch is a JSON array of graph operations. Pass it to `spl_mutate` (`operations`) or `spl mutate --operations` so the bound context graph is written through a short-lived branch and pull request. Change `schema.toml` only with `spl_schema_migrate`.

```json
[
  {
    "action": "add",
    "entity": "node",
    "id": "rate-limit-observation",
    "title": "The API returns 429 after 100 requests per minute",
    "labels": ["Observation"],
    "properties": {
      "limit": {"kind": "integer", "integer": 100}
    }
  }
]
```

`action` is `add`, `update`, or `delete`. `entity` is `node` or `edge`. Those values are the batch contract.

```sh
spl mutate --operations mutations.json --message "Record rate limit"
```

MCP:

```json
{
  "operations": [],
  "author": "agent <agent@example.com>",
  "message": "Record rate limit"
}
```

Each node is one atomic idea: one fact, decision, requirement, question, or task. Its title must stand alone. Put relationships in edges.

| Good atomic title | Bad title | Why the bad title fails |
| --- | --- | --- |
| `The API returns 429 after 100 requests per minute` | `Rate limits and retries` | Combines an observation and a proposed response. |
| `Retry HTTP 429 responses with exponential backoff` | `Make the API reliable` | Too broad; it contains many possible changes. |
| `Password reset links expire after 30 minutes` | `Fix password reset and email templates` | Combines independent work items. |
| `Should audit logs retain IP addresses for 30 days?` | `Security questions` | Does not state a single answerable question. |

Use stable, descriptive ids. Add an edge when a relationship matters:

```json
[
  {
    "action": "add",
    "entity": "node",
    "id": "retry-429",
    "title": "Retry HTTP 429 responses with exponential backoff",
    "labels": ["Requirement"]
  },
  {
    "action": "add",
    "entity": "edge",
    "id": "retry-429-addresses-rate-limit",
    "source": "retry-429",
    "target": "rate-limit-observation",
    "type": "ADDRESSES"
  }
]
```

Properties are typed values: `null`, `bool`, `integer`, `float`, `string`, `list`, or `map`. `list` and `map` values recursively contain typed values. Node operations may carry `labels` and `properties`. Edge operations may carry `type`, `source`, `target`, and `properties`. Use `spl mutate --help` before authoring unfamiliar fields.
