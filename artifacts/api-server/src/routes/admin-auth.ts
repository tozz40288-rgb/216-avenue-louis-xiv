import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";

const router: IRouter = Router();

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    next();
    return;
  }

  const authHeader = req.headers["x-admin-password"];
  if (!authHeader || authHeader !== password) {
    res.status(401).json({ error: "Non autorisé" });
    return;
  }

  next();
}

router.post("/admin/login", (req: Request, res: Response): void => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    res.json({ ok: true });
    return;
  }

  if (password !== adminPassword) {
    res.status(401).json({ error: "Mot de passe incorrect" });
    return;
  }

  res.json({ ok: true });
});

export default router;
