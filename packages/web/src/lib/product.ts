export const product = {
  name: "KiteTradeAgent",
  repo: "kitetrade-agent",
  subtitle: "TRADE AGENT",
  hero: "Design controlled trading and rebalancing strategies with portfolio tracking and strict guardrails.",
  positioning: "Controlled portfolio, trading, and rebalancing agent with strict guardrails for Kite.",
  entity: "strategies",
  entitySingular: "strategy",
  entityRoute: "/strategies",
  routes: [
  "/",
  "/portfolio",
  "/strategies",
  "/strategies/new",
  "/routes",
  "/risk",
  "/approvals",
  "/executions",
  "/settings"
],
  modules: [
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
],
};
