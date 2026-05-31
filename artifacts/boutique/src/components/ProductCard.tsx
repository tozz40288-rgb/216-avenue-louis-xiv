import { Link } from "wouter";
import { Product, formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const productGradients: Record<string, string> = {
  tshirt:    "linear-gradient(160deg, #d4d4d4 0%, #b0b0b0 100%)",
  hoodie:    "linear-gradient(160deg, #1a1a1a 0%, #3a3a3a 100%)",
  crewneck:  "linear-gradient(160deg, #2a2a2a 0%, #555 100%)",
  jogging:   "linear-gradient(160deg, #1c1c1c 0%, #404040 100%)",
  short:     "linear-gradient(160deg, #c8c8c8 0%, #999 100%)",
  bonnet:    "linear-gradient(160deg, #222 0%, #555 100%)",
  casquette: "linear-gradient(160deg, #1a1a1a 0%, #3d3d3d 100%)",
};

export default function ProductCard({ product }: ProductCardProps) {
  const gradient = productGradients[product.id] || "linear-gradient(160deg, #e2e2e2 0%, #c8c8c8 100%)";

  return (
    <Link href={`/shop/${product.id}`} className="group block border border-foreground/10 hover:border-foreground/30 transition-colors cursor-pointer">
      <div className="aspect-[3/4] relative overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ background: gradient }}
        />
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[0.6rem] uppercase tracking-widest bg-background/80 backdrop-blur-sm px-2 py-1 font-semibold">
              {product.badge}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-[0.6rem] uppercase tracking-[0.2em] font-semibold">Voir le produit</p>
        </div>
      </div>

      <div className="p-5 border-t border-foreground/10 flex justify-between items-center">
        <div>
          <h3 className="font-serif text-base tracking-wide group-hover:text-muted-foreground transition-colors">{product.name}</h3>
          <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground mt-0.5">{product.category}</p>
        </div>
        <span className="font-medium text-sm whitespace-nowrap ml-4">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}
