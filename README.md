# KiteTradeAgent

Controlled portfolio, trading, and rebalancing agent with strict guardrails for Kite.

This repository is built from the staged OpenCode prompt pack in `prompts/`.

## Product promise

Design controlled trading and rebalancing strategies with portfolio tracking and strict guardrails.

## Proof of Work

- Live Vercel deployment: https://kitetrade-agent.vercel.app
- Public proof report: [docs/PROOF_OF_WORK.md](docs/PROOF_OF_WORK.md)
- Rendered screenshot: [docs/screenshot.jpg](docs/screenshot.jpg)

## Core modules

- **Strategy Builder** — Create rule-based trading and rebalancing strategies.
- **Portfolio Tracker** — Track balances, allocation, PnL placeholders, and exposure.
- **Swap Route Analyzer** — Analyze potential routes and costs before execution.
- **Risk Guardrails** — Enforce maximum loss, slippage, token, recipient, and frequency limits.
- **Execution + Audit Logs** — Approval-first execution flow and immutable decision history.

## What is real

- Vite + React + TypeScript frontend with the required product routes.
- Hono API with health, strategies, runs, approvals, webhook, and route metadata endpoints.
- Pure TypeScript core package for Kite-safe validation, risk policies, activity logs, and approval rules.
- Worker runtime simulation for queued strategy activity.
- Kite constants, KiteScan helper, cached fetch, and RPC helper in `packages/connectors`.
- Tests for core validation, API routes, and worker execution.

## What is PREVIEW

- Agentic decisions, payment verification, fund movement, trading, security, and scoring behavior are preview-safe unless explicitly verified by backend code.
- Client-submitted payment claims are not trusted.
- Fund-moving or risky actions require explicit approval.
- No official mainnet contract address is invented in this repo.

## Structure

```txt
packages/web/          Vite + React 19 frontend
packages/api/          Hono API server
packages/worker/       background jobs and runtime simulation
packages/core/         pure TypeScript domain logic
packages/connectors/   KiteScan, RPC, webhook, LLM, wallet/API connectors
```

## Run locally

```bash
pnpm install
pnpm dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:8787`

Health check:

```bash
curl http://localhost:8787/health
```

Expected:

```json
{ "ok": true, "service": "kitetrade-agent" }
```

## Verification

```bash
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm --filter @kitetrade-agent/web build
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src
```

The two grep commands should return zero hits.
