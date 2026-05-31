import { Router, type IRouter, type Request, type Response } from "express";
import { captureStripeSession } from "../lib/capture-order";

const router: IRouter = Router();

router.post("/webhook/stripe", async (req: Request, res: Response): Promise<void> => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    res.status(503).json({ error: "Webhook secret non configuré" });
    return;
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    res.status(400).json({ error: "Signature manquante" });
    return;
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur signature";
    req.log.warn({ err }, "Webhook signature invalide");
    res.status(400).json({ error: msg });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as import("stripe").Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const origin = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
      try {
        const order = await captureStripeSession(session.id, origin);
        req.log.info({ orderId: order.id }, "Order captured via webhook");
      } catch (err: unknown) {
        req.log.error({ err }, "Webhook capture error");
        res.status(500).json({ error: "Erreur capture commande" });
        return;
      }
    }
  }

  res.json({ received: true });
});

export default router;
