import { useEffect, useState } from "react";
import { useRoute } from "wouter";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  customer: {
    prenom: string;
    nom: string;
    email: string;
    adresse: string;
    codePostal: string;
    ville: string;
    pays: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
  }>;
  total: number;
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function Suivi() {
  const [, params] = useRoute("/suivi/:id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/orders/${params.id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.order) setOrder(data.order);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <main className="flex-1 pt-28 z-10 relative">
        <div className="px-6 py-32 text-center">
          <p className="text-muted-foreground text-sm">Chargement…</p>
        </div>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="flex-1 pt-28 z-10 relative">
        <div className="px-6 py-32 text-center">
          <p className="font-serif text-2xl mb-3">Commande introuvable</p>
          <p className="text-sm text-muted-foreground">Vérifiez votre lien ou contactez-nous.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-28 z-10 relative">
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Suivi de commande
            </p>
            <h1 className="font-serif text-4xl tracking-tight">
              #{order.id}
            </h1>
          </div>

          <div className="border border-foreground/10 p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Statut</p>
                <p className="font-semibold text-sm uppercase tracking-widest">
                  {statusLabels[order.status] || order.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                <p className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-6 mb-6">
              <p className="text-xs uppercase tracking-widest font-semibold mb-3">Livraison à</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.prenom} {order.customer.nom}
              </p>
              <p className="text-sm text-muted-foreground">{order.customer.adresse}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.codePostal} {order.customer.ville}, {order.customer.pays}
              </p>
            </div>

            <div className="border-t border-foreground/10 pt-6">
              <p className="text-xs uppercase tracking-widest font-semibold mb-4">Articles</p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      {item.name} — {item.size} × {item.quantity}
                    </span>
                    <span className="text-muted-foreground">{item.price * item.quantity} €</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-foreground/10 pt-3 mt-3 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{order.total} €</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
