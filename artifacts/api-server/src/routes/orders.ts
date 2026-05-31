import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import {
  serializeOrder,
  captureStripeSession,
} from "../lib/capture-order";
import { requireAdmin } from "./admin-auth";

const router: IRouter = Router();

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

router.post("/orders/capture", async (req, res): Promise<void> => {
  const { sessionId } = req.body as { sessionId?: string };

  if (!sessionId) {
    res.status(400).json({ error: "sessionId requis" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: "Stripe non configuré" });
    return;
  }

  const origin =
    (req.headers.origin as string) ||
    `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

  const order = await captureStripeSession(sessionId, origin);
  req.log.info({ orderId: order.id }, "Order captured via /orders/capture");
  res.json({ order });
});

router.get("/orders", requireAdmin, async (req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt));

  res.json({ orders: orders.map(serializeOrder) });
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  res.json({ order: serializeOrder(order) });
});

router.patch("/orders/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { status } = req.body;

  if (!STATUS_OPTIONS.includes(status)) {
    res.status(400).json({ error: "Statut invalide" });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  req.log.info({ orderId: id, status }, "Order status updated");
  res.json({ order: serializeOrder(order) });
});

export default router;
