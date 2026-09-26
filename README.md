# cbd-payments-service

TypeScript producer. Zod schemas validate requests and events at runtime and
generate the published contracts, which are committed:

- `contracts/openapi.json`: read by cbd-dashboard at a tag
- `contracts/events/*.json`: read by cbd-reporter and cbd-catalog
- `docs/`: runbook, team page, and more, indexed by cbd-docs-site

```sh
pnpm install
pnpm run check        # fails if src/ and contracts/ disagree
pnpm run contracts    # regenerate after a schema change, then commit
pnpm start            # local server on :4000, writes events.ndjson
```

Consumers pin a tag. Publishing a contract change means merging it and
cutting a new tag (`git tag v1.1.0 && git push --tags`); nobody moves until
they bump their pin. `zod` is pinned exactly because its output is the contract.

## The six repositories

| Repo | Role |
|---|---|
| [cbd-handbook](https://github.com/jagreehal/cbd-handbook) | Owns the convention: docs frontmatter schema, docs checker, company policy |
| [cbd-payments-service](https://github.com/jagreehal/cbd-payments-service) | TypeScript producer: OpenAPI + event JSON Schemas + runbook |
| [cbd-dashboard](https://github.com/jagreehal/cbd-dashboard) | TypeScript consumer: typed client generated from the pinned OpenAPI |
| [cbd-reporter](https://github.com/jagreehal/cbd-reporter) | Python consumer: validates events against the pinned JSON Schemas |
| [cbd-docs-site](https://github.com/jagreehal/cbd-docs-site) | Aggregator: [one docs index](https://jagreehal.github.io/cbd-docs-site/) over every enrolled repo |
| [cbd-catalog](https://github.com/jagreehal/cbd-catalog) | Aggregator: [EventCatalog](https://jagreehal.github.io/cbd-catalog/) over every enrolled repo |

No repository imports another's source. Consumers read committed artifacts
at pinned tags over HTTPS; aggregators discover publishers by the
`cbd-publisher` GitHub topic.
