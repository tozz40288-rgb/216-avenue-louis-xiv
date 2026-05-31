import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");
  const [captured, setCaptured] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    if (sessionId && !captured) {
      setCaptured(true);
      fetch("/api/orders/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.order?.id) setOrderId(data.order.id);
        })
        .catch(() => {});
    }
  }, [sessionId]);

  return (
    <main className="flex-1 pt-16 z-10 relative">
      <section className="px-6 md:px-12 py-24">
        <div className="flex flex-col items-center text-center py-24 max-w-lg mx-auto">
          <div className="w-14 h-14 border border-foreground flex items-center justify-center mb-8">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l5 5 7-8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Commande confirmée
          </p>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight mb-6">
            Merci pour votre commande.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Un email de confirmation vous a été envoyé avec votre lien de suivi.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            Livraison estimée : 3 à 5 jours ouvrés.
          </p>

          {orderId && (
            <Link
              href={`/suivi/${orderId}`}
              className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] font-bold uppercase hover:opacity-80 transition-opacity mb-4 block text-center"
            >
              Suivre ma commande
            </Link>
          )}

          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </section>
    </main>
  );
}
