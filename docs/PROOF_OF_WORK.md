# KiteTradeAgent Proof of Work

This repository is a public Kite AI project build with source prompts, runnable code, verification commands, a Vercel deployment, and a rendered screenshot.

## Public Links

- GitHub repo: https://github.com/gnanam1990/kitetrade-agent
- Live Vercel URL: https://kitetrade-agent.vercel.app
- Deployment URL: https://kitetrade-agent-anc3pl6f1-gnanam1990s-projects.vercel.app
- Vercel inspect URL: https://vercel.com/gnanam1990s-projects/kitetrade-agent/3NpVNgJejPipBnGWRZDMucJD9DUi
- Vercel deployment ID: `dpl_3NpVNgJejPipBnGWRZDMucJD9DUi`

## Commit Trail

The visible public history is intentionally split into meaningful work units:

1. `feat: build KiteTradeAgent MVP`
2. `chore: add Vercel deployment config`
3. `docs: add deployment proof of work`

## Verification Evidence

Local verification completed before deployment:

```bash
pnpm install --frozen-lockfile=false
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm --filter @kitetrade-agent/web build
```

Vercel verification completed during deployment:

- Install command: `pnpm install --frozen-lockfile=false`
- Build command: `pnpm --filter @kitetrade-agent/web build`
- Output directory: `packages/web/dist`
- Ready state: `READY`

## Rendered Screenshot

![KiteTradeAgent rendered app](./screenshot.jpg)

## Safety Notes

- This is a preview-safe Kite AI application.
- Risky, fund-moving, or wallet actions are clearly approval-first in the product copy and code.
- No official mainnet contract address is invented by this project.
