import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="z-10 py-16 px-6 md:px-12 border-t border-foreground/5 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col space-y-4">
          <span className="font-serif text-xl tracking-[0.2em]">216</span>
          <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Paris • Fondée en 2024
          </span>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest font-bold">Boutique</span>
            <Link href="/shop" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Collection
            </Link>
            <Link href="/marque" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              La marque
            </Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest font-bold">Légal</span>
            <Link href="/conditions" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Conditions générales
            </Link>
            <Link href="/confidentialite" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
