---
title: Payments platform team
owner: payments-platform
tags: [team, on-call]
related: [cbd-payments-service/runbook, cbd-dashboard/team, cbd-reporter/team]
---

# Payments platform team

We own the payments microservice, its contracts, and the event stream.

| Name | Role |
|---|---|
| Asha Mehta | Engineering lead |
| Tom Iwu | Senior engineer, acquirer integrations |
| Rosa Lindqvist | Engineer, settlement |
| Dan Okafor | Product |

Slack: `#payments-platform`. For anything customer-facing and urgent, use
`#payments-incident` instead, because the first channel is muted overnight.

## On-call

One engineer on a weekly rota, Wednesday to Wednesday. The rota lives in
PagerDuty and the current holder is pinned in `#payments-platform`.

On-call covers the service and the event stream. It does not cover the
dashboard, which is web platform, or the settlement report, which is data
platform and is not paged out of hours.

Start at [the runbook](runbook.md). If it does not cover what you are seeing,
add a section when the incident is over, while you still remember.

## Asking us for a contract change

Open a pull request against `contracts/` with the regenerated artifact and tag
us. The diff is the conversation, and it is reviewable by whoever consumes it.

Adding a field is safe and needs no coordination. Renaming or removing one
needs a consumer to have moved first, so tell us who reads it and we will help
work out the order.

## What we will say no to

Direct database access, and anything that requires consumers to import our
TypeScript. Both have been asked for and both are answered by the committed
contract instead.
