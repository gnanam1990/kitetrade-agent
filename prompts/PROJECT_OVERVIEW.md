# KiteTradeAgent — Project Prompt Pack

## One-line summary
Controlled portfolio, trading, and rebalancing agent with strict guardrails for Kite.

## Product positioning
A strategy and execution console where users define trading/rebalancing rules, simulate risk, require approvals, and audit every decision.

## Why this exists
Autonomous financial agents need strong controls: strategy templates, portfolio tracking, route analysis, limits, approval gates, and transparent audit logs. This must be testnet/PREVIEW first.

## Repository name
`kitetrade-agent`

## Header subtitle
`TRADE AGENT`

## Core routes
- `/`
- `/portfolio`
- `/strategies`
- `/strategies/new`
- `/routes`
- `/risk`
- `/approvals`
- `/executions`
- `/settings`


## Core modules
1. **Strategy Builder** — Create rule-based trading/rebalancing strategies.
2. **Portfolio Tracker** — Track wallet balances, allocation, PnL placeholders, and exposure.
3. **Swap Route Analyzer** — Analyze potential routes and costs before execution.
4. **Risk Guardrails** — Enforce maximum loss, slippage, token, recipient, and frequency limits.
5. **Execution + Audit Logs** — Approval-first execution flow and immutable decision history.

## API surface
- `GET /portfolio/:address`
- `POST /strategies`
- `PATCH /strategies/:id`
- `POST /routes/quote`
- `POST /trade/proposals`
- `POST /trade/proposals/:id/approve`
- `POST /trade/executions/:id/verify`


## Safety requirements
- No guaranteed profit language
- No investment advice
- Mainnet execution disabled until routes/contracts confirmed
- Every trade approval shows worst-case/slippage/risk


## Build philosophy
This is not a small demo. Build it as a serious productivity platform for Kite AI agents. Every UI screen must move the user toward a real workflow, decision, payment, approval, or operational outcome.
