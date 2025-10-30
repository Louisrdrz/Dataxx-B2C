const bullets = [
  "Les clubs sportifs manquent de temps et d’outils pour identifier les bons sponsors.",
  "La recherche repose souvent sur le réseau ou sur des fichiers incomplets, pas sur de la donnée riche et mise à jour.",
  "Les sponsors veulent des partenariats alignés avec leurs valeurs et leur stratégie (RSE, innovation, ancrage territorial), mais les clubs ne disposent pas d’assez d’informations pour argumenter efficacement."
];

const ProblemSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* halo subtil */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,hsl(268_83%_60%_/_0.14),transparent_60%)]" />

      <div className="max-w-7xl mx-auto">
        {/* En-tête homogène */}
        <div className="text-center mb-14">
          <div className="text-primary tracking-widest text-sm font-semibold mb-4 uppercase">Problème</div>
          <h2 className="text-secondary text-4xl md:text-6xl font-extrabold leading-tight">
            Les méthodes actuelles freinent vos revenus sponsoring
          </h2>
        </div>

        {/* Grille visuelle des problèmes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {bullets.map((text, idx) => (
            <div key={idx} className="group relative rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl">
              {/* icône décorative */}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-inner">
                {/* exclamation icon */}
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <p className="text-secondary leading-relaxed">{text}</p>
              {/* effet bordure gradient au survol */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent group-hover:ring-primary/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;