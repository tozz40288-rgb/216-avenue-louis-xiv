import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="flex-1 z-10 relative">
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Erreur 404
        </p>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tight mb-6">
          Page introuvable
        </h1>
        <p className="text-sm text-muted-foreground mb-10 max-w-sm">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="border border-foreground text-foreground px-8 py-4 text-xs tracking-[0.2em] font-bold uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
