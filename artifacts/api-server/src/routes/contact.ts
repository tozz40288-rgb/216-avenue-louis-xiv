import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db, contactMessagesTable } from "@workspace/db";

const router: IRouter = Router();

const ContactBodySchema = z.object({
  nom: z.string().min(1),
  email: z.string().min(1),
  message: z.string().min(1),
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = ContactBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Tous les champs sont requis" });
    return;
  }

  const { nom, email, message } = parsed.data;

  await db.insert(contactMessagesTable).values({ nom, email, message });

  const resendKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!resendKey || !contactEmail) {
    req.log.warn("RESEND_API_KEY ou CONTACT_EMAIL manquant — message sauvegardé sans email");
    res.json({ ok: true });
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:48px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;">
      <tr>
        <td style="background:#111111;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 4px 0;font-size:16px;letter-spacing:6px;color:#ffffff;">• • •</p>
          <p style="margin:0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#ffffff;font-weight:600;">216 Avenue Louis XIV</p>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 40px 0 40px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;">
          <p style="margin:0 0 8px 0;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#aaa;">Nouveau message</p>
          <h1 style="margin:0 0 28px 0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#111;">Message de contact</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px 28px 40px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;">
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #ececec;">
                <p style="margin:0 0 3px 0;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Nom</p>
                <p style="margin:0;font-size:14px;color:#111;font-weight:600;">${nom}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;">
                <p style="margin:0 0 3px 0;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Email</p>
                <p style="margin:0;font-size:14px;color:#111;">
                  <a href="mailto:${email}" style="color:#111;text-decoration:none;">${email}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px 36px 40px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;">
          <p style="margin:0 0 8px 0;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Message</p>
          <div style="background:#f7f7f7;padding:20px;font-size:14px;color:#333;line-height:1.8;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 40px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8;border-bottom:1px solid #e8e8e8;text-align:center;">
          <a href="mailto:${email}?subject=Re: votre message — 216 Avenue Louis XIV" style="display:inline-block;background:#111;color:#fff;padding:14px 32px;font-size:9px;letter-spacing:3px;text-transform:uppercase;font-weight:700;text-decoration:none;">
            Répondre à ${nom}
          </a>
        </td>
      </tr>
      <tr>
        <td style="background:#111111;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#555;">Paris • Fondée en 2024</p>
        </td>
      </tr>
    </table>
  </td></tr>
  </table>
</body>
</html>`;

  try {
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
        to: [contactEmail],
        reply_to: email,
        subject: `Nouveau message de ${nom} — 216 Avenue Louis XIV`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      req.log.error({ err }, "Resend contact error");
    }
  } catch (err: unknown) {
    req.log.error({ err }, "Contact send error");
    res.status(500).json({ error: "Erreur lors de l'envoi" });
    return;
  }

  res.json({ ok: true });
});

export default router;
