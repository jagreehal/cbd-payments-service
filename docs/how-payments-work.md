---
title: How a payment works
owner: payments-platform
tags: [domain, payments, lifecycle]
related: [cbd-reporter/daily-settlement-report, cbd-dashboard/what-the-dashboard-shows]
---

# How a payment works

A payment moves through three states and never goes backwards.

```text
processing ──▶ completed
     │
     └───────▶ failed
```

`processing` means we have accepted the request and not yet heard back from the
acquirer. `completed` means the money moved. `failed` means it did not, and the
`reason` tells you whether to retry.

## What a payment is made of

| Field | Notes |
|---|---|
| `id` | Ours, not the acquirer's. Stable for the life of the payment |
| `amount` | Positive. Major units, so 10.50 is ten pounds fifty |
| `currency` | `GBP`, `USD`, or `EUR`. Adding one is a contract change |
| `status` | `processing`, `completed`, or `failed` |
| `createdAt` | When we accepted the request, not when the money moved |

`createdAt` catches people out. A payment created at 23:58 and settled at 00:03
belongs to the earlier day by creation and the later day by settlement, and
those two numbers will never agree. Reporting uses `settledAt` from the event.
See the daily settlement report.

## Amounts are decimal, and that is a decision

We accept `10.50` rather than `1050`. Minor units avoid floating point, and
every payments engineer will tell you so.

We took the readable version because this service is a demonstration and the
schema is the point. A real ledger should use integer minor units, or a decimal
type, and should say so in this document instead of this paragraph.

## Two events, and why failure carries less

```text
payment.completed  ->  the whole payment, plus settledAt
payment.failed     ->  paymentId, reason, failedAt
```

A completed payment ships its full state because consumers reconcile against
it. A failed one ships an id and a reason, because there is no settled amount
to reconcile and repeating the requested amount invites someone to sum a column
of money that never moved.

## Retrying

`failed` is terminal for that payment id. A retry is a new payment with a new
id, which keeps the audit trail honest and stops a single id from carrying two
outcomes.

Callers that retry automatically should treat `processing` as unknown rather
than pending, and wait for the event.
