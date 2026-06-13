# KiteTrade Agent

> A controlled portfolio, trading, and rebalancing agent for the Kite network, built around strict guardrails and approval-first execution.

[![CI](https://github.com/gnanam1990/kitetrade-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/gnanam1990/kitetrade-agent/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

KiteTrade Agent is a pnpm/TypeScript monorepo for designing rule-based trading and
rebalancing strategies with portfolio tracking and risk guardrails on the Kite network.
It pairs a Vite + React frontend with a Hono API (deployed as a Vercel serverless
function) and a pure-TypeScript domain core for address/transaction validation, risk
policy, activity logging, and approval rules. The project is preview-stage: it
demonstrates the structure and safety model of such an agent, performs a real on-chain
read against Kite Mainnet, and keeps every risky or fund-moving action behind an explicit
approval gate. It does not move funds.

## Features

- **Strategy builder** — create rule-based trading and rebalancing strategy records.
- **Portfolio tracker** — display balances, allocation, exposure, and budget caps
  (display-only; PnL figures are placeholders).
- **Swap route analyzer** — placeholder view for routes and cost analysis before
  execution (preview).
- **Risk guardrails** — domain helpers for risk weighting and approval decisions
  (maximum loss, slippage, token, recipient, and frequency limits are described as
  policy; the enforcement surface is preview).
- **Approval-first execution + activity log** — high-risk or fund-moving actions are
  routed to a pending approval; activity is recorded as an append-only event list.
- **Live Kite Mainnet read** — `GET /chain/stats` returns the current block height over
  JSON-RPC via `viem`, plus gas/network stats from the KiteScan explorer.
- **Graceful degradation** — if the live API or chain infrastructure is unreachable, the
  frontend renders from bundled preview data and the chain endpoint returns a
  preview-safe payload.

## Tech stack

- **Frontend:** Vite, React 19, TypeScript, Tailwind CSS v4, lucide-react
- **API:** Hono (with `@hono/node-server` for local dev)
- **Chain access:** viem (Kite Mainnet/Testnet chain definitions, public client)
- **Tooling:** pnpm workspaces, TypeScript, Vitest, esbuild
- **Deploy:** Vercel Build Output API (v3)

## Architecture

A pnpm workspace of five packages plus a thin serverless entry point:

- `packages/core` — pure-TypeScript domain logic: types, EVM address/tx validation,
  risk weighting, and approval rules.
- `packages/connectors` — Kite chain constants, viem public client, KiteScan URL helper,
  and a small cached-fetch utility.
- `packages/worker` — `PreviewRuntime`, an in-memory queue that turns enqueued items
  into activity events.
- `packages/api` — the Hono app, routes, the live chain read, and bundled preview data.
- `packages/web` — the Vite + React single-page app.
- `server/index.ts` — Hono entry point that is esbuild-bundled into a single Vercel
  serverless function mounted at `/api`.

## Getting started

### Prerequisites

- Node.js 22
- pnpm 9.15.9 (declared via `packageManager`)

### Installation

```bash
pnpm install
```

### Configuration

Copy `.env.example` and adjust as needed. The project reads the following variables
(names only — never commit secret values):

| Variable | Purpose |
| --- | --- |
| `KITE_NETWORK` | Active network selector (e.g. `mainnet`). |
| `KITE_MAINNET_RPC` | Kite Mainnet JSON-RPC endpoint. |
| `KITE_MAINNET_API` | Kite Mainnet KiteScan API base. |
| `KITE_TESTNET_RPC` | Kite Testnet JSON-RPC endpoint. |
| `KITE_TESTNET_API` | Kite Testnet KiteScan API base. |
| `API_PORT` | Local API port (default `8787`). |
| `WEB_ORIGIN` | Allowed CORS origin for the API (default `http://localhost:5173`). |
| `VITE_API_URL` | Frontend API base in local dev; ignored in production (the SPA calls same-origin `/api`). |
| `WEBHOOK_SECRET_DEMO` | Local webhook secret placeholder. |
| `LLM_PROVIDER` | LLM provider selector; defaults to `preview`. |

### Running

```bash
pnpm dev
```

This runs the API and web app in parallel:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8787`

```bash
curl http://localhost:8787/health      # { "ok": true, "service": "kitetrade-agent" }
curl http://localhost:8787/chain/stats # live Kite Mainnet block height + gas
```

## API

The base path is `/api` (same-origin) in production and `http://localhost:8787` in local
dev.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Service health probe. |
| GET | `/meta` | Product and module metadata. |
| GET | `/modules` | Product modules. |
| GET | `/strategies` | List strategies. |
| POST | `/strategies` | Create a strategy (`name`, `description`, `owner` required; `owner` must be a valid EVM address). |
| GET | `/strategies/:id` | Fetch one strategy. |
| GET | `/runs` | Activity / run log. |
| POST | `/runs/simulate` | Simulate a run through the worker runtime (preview). |
| GET | `/approvals` | Pending approvals. |
| POST | `/approvals/:id/approve` · `/deny` | Resolve an approval. |
| GET | `/chain/stats` | Live Kite Mainnet block height + gas (degrades to a preview payload if infra is down). |
| POST | `/webhooks/:triggerId` | Preview webhook intake. |

Strategy, approval, and activity state is in-memory and resets on restart.

## Testing

```bash
pnpm -r typecheck
pnpm -r test
pnpm --filter @kitetrade-agent/web build
```

Tests cover the core validation/approval logic, the API routes (including the chain and
worker endpoints), and the worker runtime. The `connectors` and `web` packages currently
have no tests and pass with `--passWithNoTests`.

## Project structure

```txt
server/index.ts        Hono entry, bundled into a Vercel serverless function at /api
scripts/               Vercel Build Output API builder
packages/web/          Vite + React 19 SPA
packages/api/          Hono API (app, routes, live chain read, preview data)
packages/worker/       in-memory preview runtime
packages/core/         pure TypeScript domain logic
packages/connectors/   Kite chain constants, viem client, KiteScan + cached fetch
```

## Status

Preview / demonstration stage. What is real versus preview:

- **Real:** the monorepo structure, the Hono API and its routes, the pure-TypeScript
  core (address/tx validation, risk and approval rules), the worker runtime, and the live
  Kite Mainnet block-height read via `viem`.
- **Display-only / preview:** budgets, PnL, allocation, swap-route analysis, anomaly
  watch, and scoring are illustrative; budget caps and metrics are shown but do not
  constrain real spend.
- **Not implemented:** there is no fund-moving or signing path. No private keys are
  handled, no transactions are sent, and no payment claims are trusted. High-risk or
  fund-moving actions are routed to an explicit approval gate.
- No official Kite mainnet contract address is asserted in this repository.

## License

[MIT](LICENSE)
