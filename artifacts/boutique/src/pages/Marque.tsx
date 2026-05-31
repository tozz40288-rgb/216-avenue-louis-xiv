export default function Marque() {
  return (
    <main className="flex-1 pt-28 z-10 relative">
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              À propos
            </p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
              La marque
            </h1>
          </div>

          <div className="space-y-12 border-t border-foreground/10 pt-12">
            <p className="font-serif text-2xl md:text-3xl leading-snug">
              Une marque parisienne full oversize. On s'adresse à ceux qui
              s'habillent sans avoir à s'expliquer.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-4">
                  Le concept
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Délibéré. Sans hâte. Intemporel. Chaque pièce est pensée pour
                  durer, conçue avec des matières sélectionnées — coton premium,
                  tissus lourds grattés — et une coupe qui impose le respect sans
                  l'exiger.
                </p>
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-4">
                  Les valeurs
                </h2>
                <ul className="space-y-3">
                  {["Délibéré", "Sans hâte", "Intemporel"].map((v) => (
                    <li key={v} className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                      — {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Paris • Fondée en 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
