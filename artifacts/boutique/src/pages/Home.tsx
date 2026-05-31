import { Link } from "wouter";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = products.slice(0, 6);

  return (
    <main className="flex-1 pt-16 z-10 relative">
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 flex flex-col items-center text-center px-4">
          <h1 className="text-white font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8 leading-[1.05]">
            Brut.<br />
            Confiant.<br />
            Silencieux.
          </h1>
          <Link
            href="/shop"
            className="inline-block bg-white text-black px-8 py-4 text-xs tracking-[0.2em] font-bold uppercase hover:bg-black hover:text-white border border-white transition-colors duration-300"
          >
            Découvrir la Collection
          </Link>
        </div>
      </section>

      <section className="py-32 px-6 bg-background text-foreground flex justify-center">
        <div className="max-w-2xl text-center space-y-8">
          <p className="font-serif text-2xl md:text-4xl leading-snug">
            Une marque parisienne full oversize. On s'adresse à ceux qui
            s'habillent sans avoir à s'expliquer.
          </p>
          <p className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-medium">
            Délibéré • Sans hâte • Intemporel
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Collection
            </p>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight">
              La Boutique
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-block border border-foreground text-foreground px-8 py-4 text-xs tracking-[0.2em] font-bold uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Voir toute la collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
