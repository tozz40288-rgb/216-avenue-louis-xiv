import { useEffect, useState } from "react";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  customer: { prenom: string; nom: string; email: string };
  total: number;
  items: Array<{ name: string; size: string; quantity: number }>;
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusOptions = Object.keys(statusLabels);
const SESSION_KEY = "admin_pw";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authenticated, setAuthenticated] = useState(
    () => !!sessionStorage.getItem(SESSION_KEY)
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const savedPassword = () => sessionStorage.getItem(SESSION_KEY) || "";

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      sessionStorage.setItem(SESSION_KEY, password);
      setAuthenticated(true);
    } else {
      setAuthError("Mot de passe incorrect.");
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch("/api/orders", {
      headers: { "x-admin-password": savedPassword() },
    })
      .then((r) => {
        if (r.status === 401) {
          sessionStorage.removeItem(SESSION_KEY);
          setAuthenticated(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  }, [authenticated]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const r = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": savedPassword(),
        },
        body: JSON.stringify({ status }),
      });
      const data = await r.json();
      if (data?.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: data.order.status } : o))
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  if (!authenticated) {
    return (
      <main className="flex-1 pt-28 z-10 relative">
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Interface privée
              </p>
              <h1 className="font-serif text-4xl tracking-tight">Admin</h1>
            </div>
            <form onSubmit={login} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full border border-foreground/20 bg-background px-4 py-3 text-sm outline-none focus:border-foreground/60 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
              {authError && (
                <p className="text-xs text-red-500">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-widest font-medium hover:opacity-80 transition-opacity"
              >
                Accéder
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-28 z-10 relative">
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Interface privée
              </p>
              <h1 className="font-serif text-4xl tracking-tight">Commandes</h1>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setAuthenticated(false);
              }}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Déconnexion
            </button>
          </div>

          {loading ? (
            <p className="text-muted-foreground text-sm">Chargement…</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucune commande pour le moment.
            </p>
          ) : (
            <div className="space-y-0 border-t border-foreground/10">
              {orders.map((order) => (
                <div key={order.id} className="border-b border-foreground/10 py-6">
                  <div className="flex flex-wrap gap-6 justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        #{order.id}
                      </p>
                      <p className="font-medium text-sm">
                        {order.customer.prenom} {order.customer.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>

                    <div className="text-sm">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Articles
                      </p>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-muted-foreground">
                          {item.name} — {item.size} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <div className="text-right">
                      <p className="font-serif text-xl mb-3">{order.total} €</p>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border border-foreground/20 bg-background px-3 py-2 text-xs uppercase tracking-widest outline-none"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {statusLabels[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
