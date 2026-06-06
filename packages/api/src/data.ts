import { buildActivity, demoAddress, type ActivityEvent, type ApprovalRequest, type ProductItem, type ProductModule } from "@kitetrade-agent/core";

export const modules: ProductModule[] = [
  {
    "id": "module_1",
    "name": "Strategy Builder",
    "description": "Create rule-based trading and rebalancing strategies.",
    "preview": "live"
  },
  {
    "id": "module_2",
    "name": "Portfolio Tracker",
    "description": "Track balances, allocation, PnL placeholders, and exposure.",
    "preview": "preview"
  },
  {
    "id": "module_3",
    "name": "Swap Route Analyzer",
    "description": "Analyze potential routes and costs before execution.",
    "preview": "preview"
  },
  {
    "id": "module_4",
    "name": "Risk Guardrails",
    "description": "Enforce maximum loss, slippage, token, recipient, and frequency limits.",
    "preview": "preview"
  },
  {
    "id": "module_5",
    "name": "Execution + Audit Logs",
    "description": "Approval-first execution flow and immutable decision history.",
    "preview": "preview"
  }
];

export const items: ProductItem[] = [
  {
    "id": "strategy_1",
    "name": "Strategy Builder",
    "description": "Create rule-based trading and rebalancing strategies.",
    "owner": demoAddress,
    "status": "active",
    "risk": "medium",
    "moduleId": "module_1",
    "budgetKite": "5",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "strategy_2",
    "name": "Portfolio Tracker",
    "description": "Track balances, allocation, PnL placeholders, and exposure.",
    "owner": demoAddress,
    "status": "active",
    "risk": "high",
    "moduleId": "module_2",
    "budgetKite": "50",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "strategy_3",
    "name": "Swap Route Analyzer",
    "description": "Analyze potential routes and costs before execution.",
    "owner": demoAddress,
    "status": "draft",
    "risk": "low",
    "moduleId": "module_3",
    "budgetKite": "0",
    "createdAt": "2026-06-06T02:00:00.000Z"
  }
];

export const activity: ActivityEvent[] = [
  buildActivity(items[0], "KiteTradeAgent preview event accepted", new Date("2026-06-06T02:10:00.000Z")),
  buildActivity(items[1], "Risky Kite action queued for explicit approval", new Date("2026-06-06T02:20:00.000Z")),
];

export const approvals: ApprovalRequest[] = [
  {
    id: "approval_1",
    itemId: items[1].id,
    status: "pending",
    reason: "High-risk or fund-moving Kite action requires explicit approval.",
    risk: "high",
    requestedAt: "2026-06-06T02:20:00.000Z",
  },
];

export function createItem(input: Pick<ProductItem, "name" | "description" | "owner">) {
  const item: ProductItem = {
    id: `strategy_${Date.now()}`,
    name: input.name,
    description: input.description,
    owner: input.owner,
    status: "draft",
    risk: "low",
    moduleId: modules[0].id,
    budgetKite: "0",
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  return item;
}
