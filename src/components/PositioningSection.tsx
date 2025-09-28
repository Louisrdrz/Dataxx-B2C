const PositioningSection = () => {
  return (
    <section className="py-14 px-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden relative">
        {/* léger dégradé bas */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-red-50/40 to-transparent" />

        {/* entêtes colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 md:px-6 pt-6">
          <div className="text-center text-xl font-semibold text-secondary">Sans Dataxx</div>
          <div className="text-center text-xl font-semibold text-secondary">Avec Dataxx</div>
        </div>

        {/* contenu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 md:px-6 pb-6">
          {/* Sans Dataxx */}
          <div>
            <ul className="space-y-6">
              {[
                "Perdre du temps avec des recherches manuelles",
                "Trop de vidéos non sponsorisées = opportunités manquées",
                "Passer du temps avec des sponsors qui ne sont pas intéressés",
                "Difficulté à trouver des opportunités immédiates de sponsoring",
                "Perdre des heures à chercher des contacts de marques sur Internet.",
                "Chercher des bases de données de sponsors saturées",
                "Manque de visibilité sur le marché du sponsoring",
                "Envoyer des emails de masse, en espérant des réponses.",
                "Attendre passivement que les sponsors vous contactent",
              ].map((item) => (
                <li key={item} className="flex items-center gap-4 text-secondary/90 text-[1rem] md:text-[1.05rem]">
                  {/* icône croix */}
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-500">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Avec Dataxx */}
          <div>
            <div className="flex flex-col gap-3">
              {/* carte 1 */}
              <div className="relative rotate-[-1deg] md:self-center w-full md:w-[72%]">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Accédez à tout le marché du sponsoring à jour
                  </div>
                  <p className="text-secondary/80 text-sm">Toutes les marques, collaborations et opportunités en un seul endroit.</p>
                </div>
              </div>

              {/* carte 2 */}
              <div className="relative rotate-[1deg] md:self-end w-full md:w-[70%] -mt-1.5">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Recherche rapide et efficace
                  </div>
                  <p className="text-secondary/80 text-sm">Trouvez des sponsors pertinents en quelques clics grâce aux filtres avancés.</p>
                </div>
              </div>

              {/* carte 3 */}
              <div className="relative rotate-[-1.5deg] md:self-start md:ml-1 w-full md:w-[70%] -mt-1.5">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Recommandations personnalisées
                  </div>
                  <p className="text-secondary/80 text-sm">Des marques prêtes à collaborer, adaptées à vos talents.</p>
                </div>
              </div>

              {/* carte 4 */}
              <div className="relative rotate-[1.5deg] md:self-end md:mr-2 w-full md:w-[68%] -mt-1.5">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Alertes par mail
                  </div>
                  <p className="text-secondary/80 text-sm">Soyez informé des nouvelles opportunités en temps réel.</p>
                </div>
              </div>

              {/* carte 5 */}
              <div className="relative rotate-[-2deg] md:self-start md:ml-2 w-full md:w-[74%] -mt-1">
                <div className="bg-white rounded-xl border border-emerald-200 shadow p-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 12l4 4 8-8" /></svg>
                    </span>
                    Obtenez les contacts des décideurs en 1 clic
                  </div>
                  <p className="text-secondary/80 text-sm">Fini les recherches interminables, tout est à portée de main.</p>
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


