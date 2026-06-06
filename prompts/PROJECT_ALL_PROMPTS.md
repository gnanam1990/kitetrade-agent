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

---


---

# STAGE_00_CONTEXT_AND_REPO_SETUP.md

# Stage 00 — Context and Repo Setup for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Create the initial monorepo for **KiteTradeAgent**: Controlled portfolio, trading, and rebalancing agent with strict guardrails for Kite.

This stage should establish a clean foundation only. Do not build all product modules yet.

## Product constraints
- Product name: `KiteTradeAgent`
- Repo name: `kitetrade-agent`
- Header subtitle: `TRADE AGENT`
- Positioning: A strategy and execution console where users define trading/rebalancing rules, simulate risk, require approvals, and audit every decision.

## Required monorepo structure

Create this structure:

```txt
packages/web/          Vite + React 19 + TypeScript + Tailwind v4 frontend
packages/api/          Hono API server
packages/worker/       background jobs and queues
packages/core/         pure TypeScript domain logic
packages/connectors/   KiteScan, RPC, webhook, LLM, wallet/API connectors
```

Only add `packages/contracts/` if a later stage explicitly needs contracts.

## Frontend requirements
- Vite React TypeScript project under `packages/web`.
- Tailwind v4 using inline `@theme` in CSS.
- Copy the design values from `THEME.md` exactly.
- Add Geist and Geist Mono Google font links in `index.html`.
- Add shared components:
  - `SiteHeader`
  - `SiteFooter`
  - `KiteLogo`
  - `AddressDisplay`
  - `PreviewBadge`
  - `StatusBadge`
  - `MonoValue`
  - `EmptyState`
  - `ErrorState`
- Build a basic landing page with hero, product promise, module cards, and PREVIEW honesty banner.

## Backend requirements
- Hono API in `packages/api`.
- Health route: `GET /health` returns `{ ok: true, service: "kitetrade-agent" }`.
- Shared environment loader with `.env.example`.
- Add CORS configured for local web dev.

## Core package requirements
- Add `packages/core/src/index.ts`.
- Add common types: `KiteAddress`, `TxHash`, `ISODate`, `RiskLevel`, `PreviewStatus`.
- Add validators for EVM address and tx hash.

## Connector package requirements
- Add Kite chain constants.
- Add KiteScan API base helper.
- Add cached fetch helper with TTL.
- Add placeholder RPC client helper using viem.

## Deliverables
- Full monorepo initialized.
- Root `package.json` with pnpm workspaces.
- Root `README.md` with what the product does.
- `.env.example` for all packages.
- Basic dev scripts:
  - `pnpm dev`
  - `pnpm -r typecheck`
  - `pnpm -r test`
  - `pnpm -r lint`

## Acceptance criteria
- Web app renders the landing page.
- API health route works.
- TypeScript builds.
- No forbidden fonts/colors.
- README clearly says what is real and what is PREVIEW.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_01_DATABASE_AND_TYPES.md

# Stage 01 — Database and Domain Types for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Design and implement the domain model, database schema, migrations, seed data, and TypeScript types for **KiteTradeAgent**.

Do not build final UI screens yet. Build the data foundation that later stages will use.

## Required entities from PRD
Implement types and database tables for these domain objects:

- `Strategy{id, owner_address, name, type, config_json, status, created_at}`
- `PortfolioSnapshot{id, wallet_address, balances_json, allocation_json, captured_at}`
- `RouteQuote{id, strategy_id, token_in, token_out, amount_in_raw, quote_json, risk_json, created_at}`
- `TradingPolicy{id, owner_address, max_trade_raw, daily_loss_cap_raw, max_slippage_bps, allowed_tokens_json, cooldown_seconds, approval_required}`
- `TradeExecution{id, strategy_id, proposal_json, status, approval_id, tx_hash, receipt_json, created_at}`
- `TradeAuditLog{id, execution_id, type, payload_json, created_at}`


## Database choice
Use SQLite for local MVP with Drizzle ORM or a clean query layer. Keep the schema portable so it can move to Postgres later.

## Required files

```txt
packages/core/src/types.ts
packages/core/src/validation.ts
packages/core/src/errors.ts
packages/api/src/db/schema.ts
packages/api/src/db/client.ts
packages/api/src/db/migrate.ts
packages/api/src/db/seed.ts
packages/api/src/repositories/
```

## Schema requirements
- Every table must have `id`, `created_at`, and where useful `updated_at`.
- Store addresses lowercase, but preserve display formatting in UI.
- Use JSON columns for flexible config payloads, but validate shape at API boundaries.
- Add indexes for address, status, created_at, foreign keys, and tx_hash where relevant.
- Add uniqueness constraints where duplicates would be dangerous.
- Add status enums in TypeScript and database-safe string values.

## TypeScript requirements
- Define strict types for every core entity.
- Define create/update input types separately from persisted entity types.
- Add Zod schemas for API request validation.
- Add helper functions for validating Kite addresses, tx hashes, amounts, and URLs.

## Seed data
Add realistic local seed data for demo mode:
- At least 3 users/owners.
- At least 5 main entities for the product.
- At least 10 events/logs/history rows where relevant.
- Seeded Kite-like addresses must be valid `0x` addresses.
- Mark all fake/demo records with `demo: true` or a clear `[MOCK]` label field.

## Acceptance criteria
- Migrations run from a clean database.
- Seed script populates useful demo data.
- API can import repositories without circular dependencies.
- Domain types are exported from `packages/core`.
- No UI claims seeded mock data is real.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_02_BACKEND_API.md

# Stage 02 — Backend API for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the Hono API surface for **KiteTradeAgent** using the schema from Stage 01.

## Required API endpoints
Implement these endpoints or their direct REST equivalent:

- `GET /portfolio/:address`
- `POST /strategies`
- `PATCH /strategies/:id`
- `POST /routes/quote`
- `POST /trade/proposals`
- `POST /trade/proposals/:id/approve`
- `POST /trade/executions/:id/verify`


## API architecture
Create:

```txt
packages/api/src/index.ts
packages/api/src/app.ts
packages/api/src/routes/
packages/api/src/middleware/error-handler.ts
packages/api/src/middleware/request-id.ts
packages/api/src/middleware/auth-placeholder.ts
packages/api/src/services/
packages/api/src/repositories/
```

## Requirements
- Every route validates input with Zod.
- Every route returns typed JSON.
- Errors use consistent shape:

```ts
{
  ok: false,
  error: { code: string; message: string; details?: unknown },
  request_id: string
}
```

- Success responses use:

```ts
{ ok: true, data: unknown, request_id: string }
```

- Add pagination to list endpoints using `limit`, `cursor`, or `page`.
- Add filters for status/date/address where useful.
- Add basic local auth placeholder based on `x-demo-owner-address` header, but keep it clearly marked as demo-only.
- Do not implement insecure production auth in this stage.

## Product-specific behavior
The API must support the major modules:

1. **Strategy Builder** — Create rule-based trading/rebalancing strategies.
2. **Portfolio Tracker** — Track wallet balances, allocation, PnL placeholders, and exposure.
3. **Swap Route Analyzer** — Analyze potential routes and costs before execution.
4. **Risk Guardrails** — Enforce maximum loss, slippage, token, recipient, and frequency limits.
5. **Execution + Audit Logs** — Approval-first execution flow and immutable decision history.

## OpenAPI/docs
- Add a generated or hand-written `packages/api/API.md`.
- Include request/response examples.
- Include curl examples for the core happy paths.

## Acceptance criteria
- API starts locally.
- Health endpoint works.
- CRUD/list/detail endpoints work for seeded data.
- Invalid payloads return 400 with useful messages.
- Demo auth is clearly marked as not production auth.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_03_WORKER_AND_AGENT_RUNTIME.md

# Stage 03 — Worker and Agent Runtime for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the background worker/runtime layer for **KiteTradeAgent**. This product should feel productive and agentic, not just CRUD screens.

## Worker package structure

```txt
packages/worker/src/index.ts
packages/worker/src/queue.ts
packages/worker/src/jobs/
packages/worker/src/scheduler.ts
packages/worker/src/logger.ts
packages/worker/src/config.ts
```

## Core runtime requirements
- Implement a simple durable job queue abstraction.
- Local MVP can use SQLite polling or an in-memory queue with persistent job table.
- Every job has `id`, `type`, `status`, `attempts`, `max_attempts`, `payload_json`, `last_error`, `created_at`, `run_at`, `finished_at`.
- Add exponential backoff helper.
- Add idempotency key support where a job can cause external effects.
- Add structured logs.

## Agentic requirements
Where this product needs AI/agent behavior, implement a provider abstraction:

```ts
interface AgentModelProvider {
  generateObject<T>(input: AgentPromptInput<T>): Promise<AgentResult<T>>;
  generateText(input: AgentTextInput): Promise<AgentTextResult>;
}
```

- Add a mock provider for local development.
- Add environment placeholders for real LLM provider later.
- Every AI output must be stored with prompt, model, input, output, and timestamp.
- Any action proposed by AI that can move funds or affect users must enter approval flow.

## Product-specific jobs
Create worker job stubs for each module:

- Strategy Builder
- Portfolio Tracker
- Swap Route Analyzer
- Risk Guardrails
- Execution + Audit Logs


Each job should have:
- input schema,
- handler,
- success path,
- failure path,
- timeline/audit log write,
- unit test with mock data.

## Acceptance criteria
- Worker starts locally.
- Worker can process at least one seeded/demo job.
- Failed jobs retry and eventually mark failed.
- Job logs are visible through API or database.
- AI/mock provider outputs are stored, not hidden.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_04_FRONTEND_SHELL_AND_THEME.md

# Stage 04 — Frontend Shell and Kite Theme for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the frontend shell for **KiteTradeAgent** with the attached Kite design system. Do not improvise the visual style.

## Required routes
Create route/page shells for:

- `/`
- `/portfolio`
- `/strategies`
- `/strategies/new`
- `/routes`
- `/risk`
- `/approvals`
- `/executions`
- `/settings`


## Required layout
- Sticky `SiteHeader` with Kite logo and `TRADE AGENT` subtitle.
- Main content container with cream background.
- `SiteFooter` linking to Kite, KiteScan, docs, and Discord.
- Left sidebar only if needed for app dashboards.
- Responsive mobile layout.

## Required shared UI components

```txt
components/ui/Button.tsx
components/ui/Card.tsx
components/ui/Input.tsx
components/ui/Textarea.tsx
components/ui/Select.tsx
components/ui/Tabs.tsx
components/ui/Badge.tsx
components/ui/PreviewBadge.tsx
components/ui/MonoValue.tsx
components/ui/AddressDisplay.tsx
components/ui/StatusDot.tsx
components/ui/EmptyState.tsx
components/ui/ErrorState.tsx
components/ui/ConfirmDialog.tsx
components/layout/AppShell.tsx
components/layout/SiteHeader.tsx
components/layout/SiteFooter.tsx
```

## Page shell requirements
Every route should have:
- Page title.
- Short description.
- At least one useful card/table/form placeholder.
- PREVIEW badge for data not wired yet.
- Empty state that explains what the user should do next.

## Visual rules
- Background: cream `#FEF8F0`.
- Primary CTA: sand `#9B8564`.
- Success: olive `#485C11`.
- Destructive/warning: warm rust `#A23A1A`.
- Cards: flat white/cream with `#E3D7C2` border.
- No glassmorphism, glow, violet, cyan, indigo, blue gradients, or neon.
- All addresses/hashes/numbers use Geist Mono.

## Data integration
- Create API client in `packages/web/src/lib/api.ts`.
- Load seeded/demo data from backend where possible.
- Show loading, error, and empty states.

## Acceptance criteria
- All routes render.
- Header/footer consistent.
- No forbidden colors/fonts.
- Demo data appears in at least 2 pages.
- UI looks like a sibling of the existing Kite product family.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_05_MODULE_01_STRATEGY_BUILDER.md

# Stage 05 — Module 1: Strategy Builder for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Strategy Builder** module for **KiteTradeAgent**.

## Module purpose
Create rule-based trading/rebalancing strategies.

## Product context
A strategy and execution console where users define trading/rebalancing rules, simulate risk, require approvals, and audit every decision.

## Features to implement
- Strategy templates
- Allocation targets
- Trigger conditions
- Allowed tokens
- Max slippage
- Approval mode
- Backtest placeholder


## Required data objects
- `Strategy{id, owner_address, name, type, config_json, status, created_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Strategies are disabled by default
- User must explicitly enable
- Backtest is PREVIEW unless historical data exists


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_06_MODULE_02_PORTFOLIO_TRACKER.md

# Stage 06 — Module 2: Portfolio Tracker for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Portfolio Tracker** module for **KiteTradeAgent**.

## Module purpose
Track wallet balances, allocation, PnL placeholders, and exposure.

## Product context
A strategy and execution console where users define trading/rebalancing rules, simulate risk, require approvals, and audit every decision.

## Features to implement
- Wallet holdings
- Token allocation
- KITE balance
- Stablecoin balance
- Exposure warnings
- Snapshot history


## Required data objects
- `PortfolioSnapshot{id, wallet_address, balances_json, allocation_json, captured_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Balances come from chain/API
- PnL is PREVIEW unless price source configured
- All values font-mono


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_07_MODULE_03_SWAP_ROUTE_ANALYZER.md

# Stage 07 — Module 3: Swap Route Analyzer for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Swap Route Analyzer** module for **KiteTradeAgent**.

## Module purpose
Analyze potential routes and costs before execution.

## Product context
A strategy and execution console where users define trading/rebalancing rules, simulate risk, require approvals, and audit every decision.

## Features to implement
- Token in/out
- Quote placeholder
- Liquidity warning
- Slippage estimate
- Route steps
- DEX contract verification marker


## Required data objects
- `RouteQuote{id, strategy_id, token_in, token_out, amount_in_raw, quote_json, risk_json, created_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- No route executes from analyzer alone
- Unverified routes are disabled
- Quotes marked PREVIEW if mock/external


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_08_MODULE_04_RISK_GUARDRAILS.md

# Stage 08 — Module 4: Risk Guardrails for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Risk Guardrails** module for **KiteTradeAgent**.

## Module purpose
Enforce maximum loss, slippage, token, recipient, and frequency limits.

## Product context
A strategy and execution console where users define trading/rebalancing rules, simulate risk, require approvals, and audit every decision.

## Features to implement
- Max trade size
- Daily loss cap
- Max slippage
- Allowed token list
- Cooldown period
- Kill switch
- Simulation mode


## Required data objects
- `TradingPolicy{id, owner_address, max_trade_raw, daily_loss_cap_raw, max_slippage_bps, allowed_tokens_json, cooldown_seconds, approval_required}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Policy engine blocks invalid trades
- Kill switch pauses strategies
- Reasons are displayed clearly


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_09_MODULE_05_EXECUTION_AUDIT_LOGS.md

# Stage 09 — Module 5: Execution + Audit Logs for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Execution + Audit Logs** module for **KiteTradeAgent**.

## Module purpose
Approval-first execution flow and immutable decision history.

## Product context
A strategy and execution console where users define trading/rebalancing rules, simulate risk, require approvals, and audit every decision.

## Features to implement
- Trade proposal
- Human approval
- Tx preparation
- Receipt verification
- Execution timeline
- Export audit report


## Required data objects
- `TradeExecution{id, strategy_id, proposal_json, status, approval_id, tx_hash, receipt_json, created_at}`
- `TradeAuditLog{id, execution_id, type, payload_json, created_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Mainnet auto-execution disabled by default
- Every execution requires policy pass
- Receipts verified after tx


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_10_KITE_WALLET_AND_PAYMENT_INTEGRATION.md

# Stage 10 — Kite Wallet and Payment Integration for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Add safe Kite chain integration to **KiteTradeAgent**. This stage should wire KiteScan, RPC, wallet connection, address views, tx verification, and payment-safety patterns where relevant.

## Required connector files

```txt
packages/connectors/src/kite-chain.ts
packages/connectors/src/kitescan.ts
packages/connectors/src/rpc.ts
packages/connectors/src/payment-verifier.ts
packages/connectors/src/address.ts
packages/web/src/lib/wallet.ts
packages/web/src/lib/chains.ts
```

## Kite constants
Use these defaults:

```txt
Mainnet RPC: https://rpc.gokite.ai/
Mainnet Chain ID: 2366
Mainnet Explorer: https://kitescan.ai/
Mainnet API: https://kitescan.ai/api/v2/
Testnet RPC: https://rpc-testnet.gokite.ai/
Testnet Chain ID: 2368
Native token: KITE, 18 decimals
Testnet USDT: 0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63, 18 decimals
```

## Wallet connection
- Add wagmi + RainbowKit only if this product needs wallet connection.
- Customize RainbowKit theme to sand accent, not default blue/violet.
- Add network switch UI for mainnet/testnet when appropriate.
- Never store private keys.

## Payment verification pattern
If the product accepts payment tx hashes, implement:

1. Fetch transaction receipt by hash.
2. Confirm receipt status success.
3. Confirm chain/network.
4. For ERC-20 payment, parse Transfer logs.
5. Verify token contract address.
6. Verify recipient address.
7. Verify amount is greater than or equal to expected amount.
8. Store verification result.
9. Reject invalid tx with clear reason.
10. Never grant access from client-claimed payment alone.

## UI integration
- Every address links to KiteScan.
- Every tx hash links to KiteScan.
- Use `font-mono` for address/hash/amount/block.
- Mark any unverified payment as PENDING or UNVERIFIED.
- Mark any mock/demo payment as `[MOCK]`.

## Product-specific integration points
- Strategy Builder
- Portfolio Tracker
- Swap Route Analyzer
- Risk Guardrails
- Execution + Audit Logs


For each module, identify whether it needs:
- address lookup,
- tx hash lookup,
- token balance,
- payment verification,
- wallet approval,
- receipt display,
- explorer links.

## Acceptance criteria
- KiteScan client can fetch latest transactions or address data in demo mode.
- Payment verifier has unit tests for valid, invalid, wrong-recipient, wrong-token, and insufficient-amount cases using mocked receipts.
- Wallet UI does not use forbidden RainbowKit colors.
- No mainnet payment feature is presented as production-ready unless token/contract addresses are confirmed.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_11_TESTING_SECURITY_AND_DEPLOYMENT.md

# Stage 11 — Testing, Security, and Deployment for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Harden **KiteTradeAgent** so it is not just a demo. Add tests, security checks, deployment docs, environment examples, and operational safety.

## Test requirements
Add tests for:
- Core domain logic.
- Zod validation.
- API route happy paths.
- API route failure paths.
- Worker job success/failure/retry.
- Payment verification logic if present.
- Policy/approval logic if present.
- UI smoke tests for critical pages if test stack exists.

## Security requirements
- No secrets in frontend code.
- No raw private keys in repository.
- `.env.example` contains names only, no real secrets.
- All external URLs are validated.
- HMAC verification for webhooks where relevant.
- Rate-limit write endpoints.
- Add request IDs and structured logs.
- Add clear PREVIEW/UNAUDITED warnings for risky modules.

## Production readiness checklist
Create `PRODUCTION_CHECKLIST.md` covering:
- Required environment variables.
- Database migration steps.
- Worker deployment steps.
- API deployment steps.
- Web deployment steps.
- RPC/API rate-limit considerations.
- Payment token address confirmation.
- Mainnet risk warnings.
- Backup/recovery expectations.

## Deployment docs
Create docs for:

```txt
docs/LOCAL_DEV.md
docs/DEPLOYMENT.md
docs/SECURITY.md
docs/API.md
```

## UI QA checklist
- Cream background.
- Sand primary buttons.
- Olive success states.
- Rust destructive/warning states.
- No violet/cyan/indigo/neon.
- No glassmorphism/glow/gradient text.
- All numbers/addresses/hashes in mono.
- PREVIEW badges on incomplete/heuristic/mock/unaudited parts.

## Acceptance criteria
- `pnpm -r typecheck` passes.
- Tests pass or documented skipped tests are justified.
- Security docs exist.
- Deployment docs exist.
- No forbidden visual patterns.
- Product can be demoed end-to-end locally with seeded data.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_12_FINAL_POLISH_README_AND_DEMO.md

# Stage 12 — Final Polish, README, and Demo Script for KiteTradeAgent

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Prepare **KiteTradeAgent** for a public-quality GitHub repo and product demo.

## README requirements
Rewrite `README.md` with:
- Product name and one-line summary.
- What problem it solves.
- Why it matters for Kite AI agents.
- Feature list by module.
- Architecture diagram in text form.
- Local development instructions.
- Environment variable list.
- Safety/PREVIEW/UNAUDITED notes.
- Verification commands.
- Deployment notes.
- Roadmap v0.2/v0.3.

## Demo script
Create `docs/DEMO_SCRIPT.md` with a 3–5 minute demo flow:
1. Open landing page.
2. Show main dashboard.
3. Create or inspect a core object.
4. Trigger the most important workflow.
5. Show audit/log/payment/approval output.
6. Explain what is real vs PREVIEW.

## Product polish
- Replace generic placeholder copy with product-specific text.
- Add helpful empty states.
- Add tooltips for complex chain/agent concepts.
- Add skeleton/loading states.
- Add error recovery messages.
- Add cross-links to KiteScan for all addresses/txs.
- Add visible “Built on Kite” footer.

## v0.2 roadmap
Create a roadmap section with:
- Production auth.
- Postgres migration.
- Real provider integrations.
- WebSocket/event subscriptions if relevant.
- Mainnet-safe execution only after confirmation/audit.
- Team/multi-user support.
- Usage-based billing if relevant.

## Final acceptance criteria
- A new developer can run the repo from README alone.
- A demo user can understand the product in under 30 seconds.
- The app feels like a serious Kite agent product, not a toy dashboard.
- All PREVIEW limitations are honest.
- Final grep checks pass.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.

