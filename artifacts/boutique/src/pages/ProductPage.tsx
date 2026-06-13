import { useState } from "react";
import { useRoute, Link } from "wouter";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

const productGradients: Record<string, string> = {
  hoodie:    "linear-gradient(160deg, #1a1a1a 0%, #3a3a3a 100%)",
  crewneck:  "linear-gradient(160deg, #2a2a2a 0%, #555 100%)",
  jogging:   "linear-gradient(160deg, #1c1c1c 0%, #404040 100%)",
  short:     "linear-gradient(160deg, #c8c8c8 0%, #999 100%)",
  bonnet:    "linear-gradient(160deg, #222 0%, #555 100%)",
  casquette: "linear-gradient(160deg, #1a1a1a 0%, #3d3d3d 100%)",
};

export default function ProductPage() {
  const [, params] = useRoute("/shop/:id");
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  const product = products.find((p) => p.id === params?.id);

  if (!product) {
    return (
      <main className="flex-1 pt-28 z-10 relative">
        <div className="px-6 py-32 text-center">
          <p className="text-muted-foreground text-sm mb-4">Produit introuvable</p>
          <Link href="/shop" className="text-xs uppercase tracking-widest hover:opacity-50">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  const gradient = productGradients[product.id] || "linear-gradient(160deg, #e2e2e2 0%, #c8c8c8 100%)";
  const isSingleSize = product.sizes.length === 1 && product.sizes[0] === "Unique";

  const handleAdd = () => {
    const size = isSingleSize ? "Unique" : selectedSize;
    if (!size) {
      setError(true);
      return;
    }
    setError(false);
    addItem(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <main className="flex-1 pt-16 z-10 relative">
      <section className="px-6 md:px-12 py-16 pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/shop"
              className="text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Boutique
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-[3/4] w-full overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: gradient }}
                />
              )}
            </div>

            <div className="md:pl-16 py-6 flex flex-col justify-start">
              {product.badge && (
                <span className="text-[0.6rem] uppercase tracking-widest font-semibold text-muted-foreground mb-3">
                  {product.badge}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-5xl tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
                {product.category}
              </p>
              <p className="font-serif text-2xl mb-8">
                {formatPrice(product.price)}
              </p>

              <div className="border-t border-foreground/10 pt-8">
                <p className="text-sm text-muted-foreground leading-relaxed mb-10">
                  {product.description}
                </p>

                {!isSingleSize && (
                  <div className="mb-8">
                    <p className="text-[0.6rem] uppercase tracking-widest font-semibold mb-3">
                      Taille
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setError(false);
                          }}
                          className={`w-12 h-12 border text-xs font-medium tracking-wide transition-colors ${
                            selectedSize === size
                              ? "bg-foreground text-background border-foreground"
                              : "border-foreground/20 hover:border-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 mt-2 uppercase tracking-widest">
                        Veuillez sélectionner une taille
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleAdd}
                  className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] font-bold uppercase hover:opacity-80 transition-opacity"
                >
                  {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
                </button>

                <div className="mt-10 space-y-3 border-t border-foreground/10 pt-6">
                  <p className="text-xs text-muted-foreground">Livraison offerte dès 100 €</p>
                  <p className="text-xs text-muted-foreground">Retours sous 14 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
