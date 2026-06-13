import { X, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartPanel() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={closeCart}
      />
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background flex flex-col border-l border-foreground/10">
        <div className="px-6 h-24 flex items-center justify-between border-b border-foreground/10">
          <h2 className="font-serif text-xl tracking-wide">
            Votre sélection{" "}
            <span className="font-sans text-2xl font-normal text-muted-foreground">
              {totalItems > 0 ? `(${totalItems})` : ""}
            </span>
          </h2>
          <button
            onClick={closeCart}
            className="text-foreground hover:opacity-70 transition-opacity"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center py-24 border-t border-foreground/10">
              <ShoppingBag size={32} className="mb-6 text-muted-foreground" />
              <p className="font-serif text-xl mb-2">Votre panier est vide</p>
              <p className="text-sm text-muted-foreground mb-8 tracking-wide">
                Découvrez notre collection et ajoutez vos pièces.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="inline-block border border-foreground text-foreground px-8 py-4 text-xs tracking-[0.2em] font-bold uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                Explorer la boutique
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="py-6 border-b border-foreground/10 flex items-start gap-4 px-6"
                >
                  <div className="w-16 h-20 shrink-0 overflow-hidden bg-foreground/5">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #e2e2e2 0%, #c8c8c8 100%)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-serif text-base tracking-wide leading-tight">{item.product.name}</p>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-muted-foreground hover:text-foreground transition-colors ml-4 shrink-0"
                        aria-label="Supprimer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
                      Taille : {item.size}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-foreground/20">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-medium text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 pt-8 pb-6 space-y-4 border-t border-foreground/10">
            <div className="flex justify-between items-center text-sm">
              <span className="uppercase tracking-widest text-xs font-semibold">Total</span>
              <span className="font-serif text-xl">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Livraison calculée à l'étape suivante.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] font-bold uppercase hover:opacity-80 transition-opacity mt-4 block text-center"
            >
              Finaliser ma commande
            </Link>
            <button
              onClick={closeCart}
              className="block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2 w-full"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
