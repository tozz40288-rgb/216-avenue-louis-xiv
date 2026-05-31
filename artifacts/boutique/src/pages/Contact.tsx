import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nom.trim()) errs.nom = "Champ requis";
    if (!form.email.trim()) errs.email = "Champ requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email invalide";
    if (!form.message.trim()) errs.message = "Champ requis";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError(false);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        setSent(true);
      } else {
        setServerError(true);
      }
    } catch {
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 pt-28 z-10 relative">
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Nous contacter
            </p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
              Nous écrire
            </h1>
          </div>

          <div className="space-y-12 border-t border-foreground/10 pt-12">
            <div>
              <h2 className="text-xs uppercase tracking-widest font-bold mb-4">Délais de réponse</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nous répondons à chaque message sous 48h ouvrées.
              </p>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest font-bold mb-4">Réseaux sociaux</h2>
              <div className="flex flex-col space-y-2">
                <a
                  href="https://instagram.com/216avenuelouisxiv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div>
              {sent ? (
                <div className="py-12 text-center border border-foreground/10">
                  <div className="w-10 h-10 border border-foreground flex items-center justify-center mx-auto mb-6">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l5 5 7-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="font-serif text-2xl mb-3">Message envoyé.</p>
                  <p className="text-sm text-muted-foreground">Nous vous répondrons sous 48h ouvrées.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                      Nom <span className="text-foreground ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nom}
                      onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                      className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors"
                    />
                    {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                  </div>

                  <div>
                    <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                      Email <span className="text-foreground ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                      Message <span className="text-foreground ml-0.5">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={5}
                      className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors resize-none"
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  {serverError && (
                    <p className="text-xs text-red-500 uppercase tracking-widest">
                      Erreur lors de l'envoi — veuillez réessayer
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] font-bold uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    {loading ? "Envoi en cours…" : "Envoyer"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
