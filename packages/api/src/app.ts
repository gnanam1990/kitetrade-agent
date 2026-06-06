import { Hono } from "hono";
import { cors } from "hono/cors";
import { assertEvmAddress } from "@kitetrade-agent/core";
import { activity, approvals, createItem, items, modules } from "./data.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: [process.env.WEB_ORIGIN ?? "http://localhost:5173"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true, service: "kitetrade-agent" }));
app.get("/modules", (c) => c.json({ modules }));
app.get("/strategies", (c) => c.json({ strategies: items, items }));

app.post("/strategies", async (c) => {
  const body = (await c.req.json().catch(() => null)) as { name?: string; description?: string; owner?: string } | null;
  if (!body?.name || !body.description || !body.owner) return c.json({ error: "name, description, and owner are required" }, 400);
  try {
    return c.json({ item: createItem({ name: body.name, description: body.description, owner: assertEvmAddress(body.owner) }) }, 201);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Invalid item" }, 400);
  }
});

app.get("/strategies/:id", (c) => {
  const item = items.find((entry) => entry.id === c.req.param("id"));
  if (!item) return c.json({ error: "Item not found" }, 404);
  return c.json({ item });
});

app.get("/runs", (c) => c.json({ runs: activity, activity }));
app.get("/approvals", (c) => c.json({ approvals }));

app.post("/approvals/:id/approve", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "approved";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/approvals/:id/deny", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "denied";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/webhooks/:triggerId", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, string>;
  return c.json({
    accepted: true,
    triggerId: c.req.param("triggerId"),
    preview: true,
    message: "Webhook accepted into preview runtime. Production secrets must be env-only.",
    receivedKeys: Object.keys(body),
  });
});

app.get("/portfolio", (c) => c.json({ route: "/portfolio", product: "KiteTradeAgent", preview: true, modules }));
app.get("/strategies/new", (c) => c.json({ route: "/strategies/new", product: "KiteTradeAgent", preview: true, modules }));
app.get("/routes", (c) => c.json({ route: "/routes", product: "KiteTradeAgent", preview: true, modules }));
app.get("/risk", (c) => c.json({ route: "/risk", product: "KiteTradeAgent", preview: true, modules }));
app.get("/approvals", (c) => c.json({ route: "/approvals", product: "KiteTradeAgent", preview: true, modules }));
app.get("/executions", (c) => c.json({ route: "/executions", product: "KiteTradeAgent", preview: true, modules }));
app.get("/settings", (c) => c.json({ route: "/settings", product: "KiteTradeAgent", preview: true, modules }));
