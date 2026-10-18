# cbd-payments-service

TypeScript producer. Zod schemas validate requests and events at runtime and
generate the contracts we commit:

- `contracts/openapi.json`, which cbd-dashboard reads at a tag
- `contracts/events/*.json`, which cbd-reporter and cbd-catalog read

Our runbook and team pages live in `docs/`, and cbd-catalog indexes them.

```sh
pnpm install
pnpm run check        # fails if src/ and contracts/ disagree
pnpm run contracts    # regenerate after a schema change, then commit
pnpm start            # local server on :4000, writes events.ndjson
```

A pull request also runs `autocatalog drift`. It fails a breaking contract change
and names the consumers it reaches, including the ones other repositories
declare in the company catalog.

Consumers pin a tag. To publish a contract change, merge it and push a new tag
(`git tag v1.1.0 && git push --tags`). Consumers move when they bump their pin.
We pin `zod` to one version because its output is the contract.

## The six repositories

| Repo | Role |
|---|---|
| [cbd-handbook](https://github.com/jagreehal/cbd-handbook) | Owns the convention: docs frontmatter schema, docs check, company policy |
| [cbd-payments-service](https://github.com/jagreehal/cbd-payments-service) | TypeScript producer: OpenAPI, event JSON Schemas, runbook |
| [cbd-dashboard](https://github.com/jagreehal/cbd-dashboard) | TypeScript consumer: generates a typed client from the pinned OpenAPI |
| [cbd-reporter](https://github.com/jagreehal/cbd-reporter) | Python consumer: validates events against the pinned JSON Schemas |
| [cbd-docs-site](https://github.com/jagreehal/cbd-docs-site) | Retired: redirects to cbd-catalog |
| [cbd-catalog](https://github.com/jagreehal/cbd-catalog) | Aggregator: [the one site](https://jagreehal.github.io/cbd-catalog/) over the enrolled repos: docs index, `llms.txt`, docs manifest, `catalog.json` |

Consumers fetch committed artifacts over HTTPS at a pinned tag. The
aggregator finds publishers by the `cbd-publisher` GitHub topic.

The pattern and the argument behind it: [convention-based-design](https://github.com/jagreehal/convention-based-design).
