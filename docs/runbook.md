---
title: Payments service runbook
owner: payments-platform
tags: [runbook, payments]
related: [cbd-handbook/repository-layout, cbd-handbook/incident-communications]
---

Anything on this page that moved money the customer can see is also a
communications problem. The incident communications policy says who tells them
and when, and it is not this team's call.

## Payment stuck in processing

The local demonstration writes to `events.ndjson`. Check it for a
`payment.completed` event with the payment id. A deployed adapter should check
the configured Kafka topic, NATS subject, SQS queue, or equivalent destination.

No event within 5 minutes means the settle step or transport adapter died.
Restart the failed module and replay from the last acknowledged event.

## Reporter shows INVALID events

First remove any broker envelope and inspect the event payload. The payload is
off-contract when JSON Schema validation still fails after unwrapping.
`pnpm run check` in this repo will name a drifted schema; regenerate contracts
and ship a versioned event instead.

## Dashboard request fails

Regenerate the frontend client from `contracts/openapi.json` and run its
typecheck. If the generated client compiles but the live request fails, compare
the deployed microservice version with the OpenAPI artifact used by the
frontend build.
