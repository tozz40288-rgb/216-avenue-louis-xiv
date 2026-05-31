import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

type Genre = "tous" | "homme" | "femme";
type Categorie = "tous" | "Haut" | "Bas" | "Accessoire";

const categorieLabels: Record<Categorie, string> = {
  tous: "Tout",
  Haut: "Vêtements Hauts",
  Bas: "Vêtements Bas",
  Accessoire: "Accessoires",
};

export default function Shop() {
  const [genre, setGenre] = useState<Genre>("tous");
  const [categorie, setCategorie] = useState<Categorie>("tous");

  const filtered = products.filter((p) => {
    const genreMatch =
      genre === "tous" ||
      p.genre === "unisexe" ||
      p.genre === genre;
    const catMatch = categorie === "tous" || p.category === categorie;
    return genreMatch && catMatch;
  });

  return (
    <main className="flex-1 pt-28 z-10 relative">
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Collection
            </p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
              La Boutique
            </h1>
          </div>

          {/* Genre filter */}
          <div className="mb-6 border-t border-foreground/10 pt-8">
            <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-4">
              Genre
            </p>
            <div className="flex gap-2">
              {(["tous", "homme", "femme"] as Genre[]).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGenre(g);
                    setCategorie("tous");
                  }}
                  className={`px-6 py-3 text-[0.65rem] uppercase tracking-[0.2em] font-semibold border transition-colors duration-200 ${
                    genre === g
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/20 text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {g === "tous" ? "Tous" : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Catégorie filter */}
          <div className="mb-10 border-t border-foreground/10 pt-6">
            <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-4">
              Catégorie
            </p>
            <div className="flex flex-wrap gap-2">
              {(["tous", "Haut", "Bas", "Accessoire"] as Categorie[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategorie(c)}
                  className={`px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.15em] font-medium border transition-colors duration-200 ${
                    categorie === c
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/20 text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {categorieLabels[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Résultats */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center border-t border-foreground/10">
              <p className="font-serif text-2xl mb-2">Aucun article</p>
              <p className="text-sm text-muted-foreground">
                Aucun produit ne correspond à cette sélection.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 border-t border-foreground/10 pt-6">
                <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                  {filtered.length} article{filtered.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
