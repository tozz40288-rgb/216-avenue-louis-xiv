import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db, ordersTable } from "@workspace/db";

const router: IRouter = Router();

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  size: z.string(),
  quantity: z.number().int().positive(),
});

const CustomerSchema = z.object({
  prenom: z.string().min(1),
  nom: z.string().min(1),
  email: z.string().min(1),
  adresse: z.string().min(1),
  codePostal: z.string().min(1),
  ville: z.string().min(1),
  pays: z.string().min(1),
});

const CheckoutBodySchema = z.object({
  items: z.array(ItemSchema).min(1),
  customer: CustomerSchema,
});

router.post("/checkout", async (req, res): Promise<void> => {
  const parsed = CheckoutBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Données invalides" });
    return;
  }

  const { items, customer } = parsed.data;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (stripeKey) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(stripeKey);

      const origin = req.headers.origin || process.env.APP_URL || "";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: customer.email,
        line_items: items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: `${item.name} — Taille ${item.size}`,
              metadata: { productId: item.id, size: item.size },
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        shipping_address_collection: {
          allowed_countries: ["FR", "BE", "CH", "LU"],
        },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout`,
        metadata: {
          prenom: customer.prenom,
          nom: customer.nom,
          email: customer.email,
          adresse: customer.adresse,
          code_postal: customer.codePostal,
          ville: customer.ville,
          pays: customer.pays,
        },
      });

      res.json({ url: session.url });
    } catch (err: unknown) {
      req.log.error({ err }, "Stripe checkout error");
      res.status(500).json({ error: "Erreur lors du paiement" });
    }
    return;
  }

  const subtotal = items.reduce((sum: number, i) => sum + i.price * i.quantity, 0);
  const livraison = subtotal >= 100 ? 0 : 5;
  const total = subtotal + livraison;

  const [order] = await db
    .insert(ordersTable)
    .values({
      customer,
      items,
      total: total.toFixed(2),
      status: "pending",
    })
    .returning();

  req.log.info({ orderId: order.id }, "New order created (no Stripe)");
  res.status(201).json({ orderId: order.id });
});

export default router;
