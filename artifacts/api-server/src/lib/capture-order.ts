import { eq } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import type { Order } from "@workspace/db";
import { logger } from "./logger";

export type CustomerData = {
  prenom: string;
  nom: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
};

export type OrderItem = {
  id?: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
};

export type SerializedOrder = {
  id: string;
  status: string;
  createdAt: Date;
  customer: CustomerData;
  items: OrderItem[];
  total: number;
};

export function serializeOrder(o: Order): SerializedOrder {
  return {
    id: o.id,
    status: o.status,
    createdAt: o.createdAt,
    customer: o.customer as CustomerData,
    items: o.items as OrderItem[],
    total: Number(o.total),
  };
}

export async function sendConfirmationEmail(
  order: SerializedOrder,
  origin: string
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const trackingUrl = `${origin}/suivi/${order.id}`;
  const dateFormatted = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 0;font-size:13px;color:#333;border-bottom:1px solid #f0f0f0;">
            <strong>${item.name}</strong>${item.size ? `<span style="color:#999;font-size:12px;"> — Taille ${item.size}</span>` : ""}
            <span style="color:#999;font-size:12px;"> × ${item.quantity}</span>
          </td>
          <td style="padding:10px 0;font-size:13px;color:#111;font-weight:600;text-align:right;border-bottom:1px solid #f0f0f0;">${item.price}&nbsp;€</td>
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:48px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">
      <tr>
        <td style="background:#111111;padding:36px 48px;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:18px;letter-spacing:6px;color:#ffffff;">• • •</p>
          <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#ffffff;font-weight:600;">216 Avenue Louis XIV</p>
        </td>
      </tr>
      <tr>
        <td style="padding:48px 48px 0 48px;text-align:center;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;">
          <p style="margin:0 0 12px 0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#999;">Confirmation de commande</p>
          <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;color:#111;line-height:1.3;">
            Votre commande est confirmée.
          </h1>
          <p style="margin:0;font-size:14px;color:#555;line-height:1.8;">
            Bonjour <strong>${order.customer.prenom}</strong>,<br/>
            nous avons bien reçu votre commande du <strong>${dateFormatted}</strong>.
          </p>
        </td>
      </tr>
      <tr><td style="padding:36px 48px 0 48px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;"><hr style="border:none;border-top:1px solid #e8e8e8;margin:0;"/></td></tr>
      <tr>
        <td style="padding:24px 48px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:50%;">
                <p style="margin:0 0 4px 0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#aaa;">Référence</p>
                <p style="margin:0;font-size:13px;font-weight:700;color:#111;">${order.id}</p>
              </td>
              <td style="width:50%;text-align:right;">
                <p style="margin:0 0 4px 0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#aaa;">Date</p>
                <p style="margin:0;font-size:14px;color:#111;">${dateFormatted}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="padding:0 48px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;"><hr style="border:none;border-top:1px solid #e8e8e8;margin:0;"/></td></tr>
      <tr>
        <td style="padding:24px 48px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;">
          <p style="margin:0 0 16px 0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#aaa;">Détail de la commande</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml}
            <tr>
              <td style="padding:16px 0 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#111;font-weight:700;">Total payé</td>
              <td style="padding:16px 0 0 0;font-size:20px;color:#111;font-weight:700;text-align:right;font-family:Georgia,serif;">${order.total}&nbsp;€</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 48px;text-align:center;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;">
          <a href="${trackingUrl}" style="display:inline-block;background:#111;color:#fff;padding:16px 40px;font-size:10px;letter-spacing:4px;text-transform:uppercase;font-weight:700;text-decoration:none;">
            Suivre ma commande →
          </a>
        </td>
      </tr>
      <tr>
        <td style="background:#111111;padding:28px 48px;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:18px;letter-spacing:6px;color:#fff;">• • •</p>
          <p style="margin:0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#888;">216 Avenue Louis XIV — Paris</p>
          <p style="margin:8px 0 0 0;font-size:10px;color:#555;">
            <a href="${origin}" style="color:#888;text-decoration:none;">Boutique</a>
            &nbsp;·&nbsp;
            <a href="${origin}/contact" style="color:#888;text-decoration:none;">Contact</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
  </table>
</body>
</html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "216 Avenue Louis XIV <onboarding@resend.dev>",
      to: [order.customer.email],
      subject: `Commande confirmée — ${order.id}`,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    logger.error({ err }, "Resend confirmation email error");
  }
}

export async function captureStripeSession(
  sessionId: string,
  origin: string
): Promise<SerializedOrder> {
  const existing = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.sessionId, sessionId));

  if (existing.length > 0) {
    return serializeOrder(existing[0]);
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY!;
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(stripeKey);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const meta = session.metadata || {};
  const customer: CustomerData = {
    prenom: meta.prenom || "",
    nom: meta.nom || "",
    email: session.customer_details?.email || meta.email || "",
    adresse: session.shipping_details?.address?.line1 || meta.adresse || "",
    codePostal:
      session.shipping_details?.address?.postal_code || meta.code_postal || "",
    ville: session.shipping_details?.address?.city || meta.ville || "",
    pays: session.shipping_details?.address?.country || meta.pays || "FR",
  };

  const items: OrderItem[] =
    session.line_items?.data.map((item) => ({
      name: item.description || "",
      size: "",
      quantity: item.quantity || 1,
      price: (item.amount_total || 0) / 100,
    })) || [];

  const total = (session.amount_total || 0) / 100;

  const [order] = await db
    .insert(ordersTable)
    .values({
      sessionId,
      customer,
      items,
      total: total.toFixed(2),
      status: "pending",
    })
    .returning();

  const serialized = serializeOrder(order);

  sendConfirmationEmail(serialized, origin).catch((err) => {
    logger.error({ err }, "Confirmation email error");
  });

  return serialized;
}
