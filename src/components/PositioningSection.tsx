const PositioningSection = () => {
  const leftItems = [
    "Des heures perdues à chercher des informations éparpillées.",
    "Prospection manuelle, lente et inefficace.",
    "Contacts difficiles à trouver, bases de données vite obsolètes.",
    "Impossible de prioriser les bonnes entreprises.",
    "Trop peu de sponsors identifiés = opportunités manquées.",
    "Emails envoyés “à l’aveugle” sans personnalisation.",
    "Manque de visibilité sur le marché du sponsoring.",
    "Attente passive que les sponsors se manifestent",
  ];

  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden relative">
        {/* fond bi-colore avec dégradé central doux */}
        <div className="absolute inset-0 pointer-events-none opacity-70 bg-gradient-to-r from-rose-50 via-white to-emerald-50" />
        {/* léger dégradé bas */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-emerald-50/30 to-transparent" />

        {/* entêtes colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 md:px-6 pt-6">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[1rem] md:text-lg font-semibold uppercase tracking-wide text-rose-700 bg-white/85 backdrop-blur-sm border border-rose-200 shadow-sm">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </span>
              Sans Dataxx
            </span>
          </div>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[1rem] md:text-lg font-semibold uppercase tracking-wide text-emerald-700 bg-white/85 backdrop-blur-sm border border-emerald-200 shadow-sm">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
              </span>
              Avec Dataxx
            </span>
          </div>
        </div>

        {/* contenu */}
        {/* Grille des contenus avec alignement de bas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 md:px-6 pb-6 mt-4 md:mt-6 items-end">
          {/* Sans Dataxx */}
          <div>
            <div className="flex flex-col gap-3">
              {leftItems.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const rotateClass = isEven ? "rotate-[-0.6deg] md:self-start md:ml-1" : "rotate-[0.6deg] md:self-end md:mr-1";
                const widthClass = isEven ? "md:w-[68%]" : "md:w-[66%]";
                return (
                  <div key={item} className={`relative ${rotateClass} w-full ${widthClass}`}>
                    <div className="bg-white rounded-xl border border-red-200 shadow p-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </span>
                        <p className="text-secondary/90 leading-relaxed text-sm md:text-[0.95rem]">{item}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Avec Dataxx */}
          <div>
            <div className="flex flex-col gap-3">
              {/* carte 1 */}
              <div className="relative rotate-[-0.6deg] md:self-center w-full md:w-[70%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Toute l’information centralisée
                  </div>
                  <p className="text-secondary/80 text-sm">Entreprises, contacts, historique sponsoring, actualités… tout en un seul outil.</p>
                </div>
              </div>

              {/* carte 2 */}
              <div className="relative rotate-[0.6deg] md:self-end w-full md:w-[68%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Productivité décuplée
                  </div>
                  <p className="text-secondary/80 text-sm">Des semaines de recherche réduites à quelques clics.</p>
                </div>
              </div>

              {/* carte 3 */}
              <div className="relative rotate-[-0.8deg] md:self-start md:ml-1 w-full md:w-[68%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Identification instantanée des décideurs
                  </div>
                  <p className="text-secondary/80 text-sm">Les bons contacts trouvés en 1 clic grâce à l’IA.</p>
                </div>
              </div>

              {/* carte 4 */}
              <div className="relative rotate-[0.8deg] md:self-end md:mr-2 w-full md:w-[66%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Ciblage intelligent
                  </div>
                  <p className="text-secondary/80 text-sm">Priorité aux entreprises réellement capables et prêtes à sponsoriser.</p>
                </div>
              </div>

              {/* carte 5 */}
              <div className="relative rotate-[-1deg] md:self-start md:ml-2 w-full md:w-[70%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Automatisation de la prospection
                  </div>
                  <p className="text-secondary/80 text-sm">Moins de tâches chronophages, plus de signatures.</p>
                </div>
              </div>

              {/* carte 6 */}
              <div className="relative rotate-[-0.5deg] md:self-center w-full md:w-[68%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Emailing IA optimisé
                  </div>
                  <p className="text-secondary/80 text-sm">Messages personnalisés: plus de réponses, plus vite.</p>
                </div>
              </div>

              {/* carte 7 */}
              <div className="relative rotate-[0.6deg] md:self-end w-full md:w-[66%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Pipeline intégré
                  </div>
                  <p className="text-secondary/80 text-sm">Suivi clair des échanges et relances organisées.</p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PositioningSection;


