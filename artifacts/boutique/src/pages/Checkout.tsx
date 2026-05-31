import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function Checkout() {
  const { items, totalPrice, totalItems } = useCart();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const livraison = totalPrice >= 100 ? 0 : 5;
  const total = totalPrice + livraison;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nom.trim()) errs.nom = "Requis";
    if (!form.prenom.trim()) errs.prenom = "Requis";
    if (!form.email.trim()) errs.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email invalide";
    if (!form.adresse.trim()) errs.adresse = "Requis";
    if (!form.ville.trim()) errs.ville = "Requis";
    if (!form.codePostal.trim()) errs.codePostal = "Requis";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (items.length === 0) return;
    setLoading(true);
    setServerError(false);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            size: i.size,
            quantity: i.quantity,
          })),
          customer: form,
        }),
      });
      const data = await r.json();
      if (r.ok && data.url) {
        window.location.href = data.url;
      } else if (r.ok && data.orderId) {
        navigate(`/checkout/success?order=${data.orderId}`);
      } else {
        setServerError(true);
      }
    } catch {
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex-1 pt-28 z-10 relative">
        <div className="px-6 py-32 text-center">
          <p className="font-serif text-2xl mb-4">Votre panier est vide</p>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-16 z-10 relative">
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Paiement sécurisé
            </p>
            <h1 className="font-serif text-4xl tracking-tight">
              Finaliser la commande
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs uppercase tracking-widest font-bold mb-6 pb-2 border-b border-foreground/10">
                    Informations de livraison
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          value={form.prenom}
                          onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
                          className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors"
                        />
                        {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
                      </div>
                      <div>
                        <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                          Nom *
                        </label>
                        <input
                          type="text"
                          value={form.nom}
                          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                          className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors"
                        />
                        {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                        Email *
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
                        Adresse *
                      </label>
                      <input
                        type="text"
                        value={form.adresse}
                        onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
                        className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors"
                      />
                      {errors.adresse && <p className="text-xs text-red-500 mt-1">{errors.adresse}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                          Ville *
                        </label>
                        <input
                          type="text"
                          value={form.ville}
                          onChange={(e) => setForm((f) => ({ ...f, ville: e.target.value }))}
                          className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors"
                        />
                        {errors.ville && <p className="text-xs text-red-500 mt-1">{errors.ville}</p>}
                      </div>
                      <div>
                        <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          value={form.codePostal}
                          onChange={(e) => setForm((f) => ({ ...f, codePostal: e.target.value }))}
                          className="w-full border border-foreground/20 focus:border-foreground bg-transparent px-4 py-3 text-sm outline-none transition-colors"
                        />
                        {errors.codePostal && <p className="text-xs text-red-500 mt-1">{errors.codePostal}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-widest font-semibold mb-1.5 text-muted-foreground">
                        Pays
                      </label>
                      <select
                        value={form.pays}
                        onChange={(e) => setForm((f) => ({ ...f, pays: e.target.value }))}
                        className="w-full border border-foreground/20 focus:border-foreground bg-background px-4 py-3 text-sm outline-none transition-colors"
                      >
                        <option>France</option>
                        <option>Belgique</option>
                        <option>Suisse</option>
                        <option>Luxembourg</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-6 pb-2 border-b border-foreground/10">
                  Récapitulatif ({totalItems} article{totalItems > 1 ? "s" : ""})
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex justify-between items-start text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium whitespace-nowrap ml-4">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-foreground/10 pt-4 space-y-2 text-sm mb-8">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>{livraison === 0 ? "Offerte" : formatPrice(livraison)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-foreground/10">
                    <span>Total</span>
                    <span className="font-serif text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                {serverError && (
                  <p className="text-xs text-red-500 uppercase tracking-widest mb-4">
                    Une erreur est survenue — veuillez réessayer
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] font-bold uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Traitement en cours…" : "Payer maintenant"}
                </button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Paiement 100% sécurisé
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
