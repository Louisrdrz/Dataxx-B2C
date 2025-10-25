import React from "react";

const WhyDataxxSection: React.FC = () => {
  return (
    <section id="benefices-section" className="relative py-20 md:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* Colonne gauche: texte + KPIs + CTA */}
          <div>
            <h2 className="text-secondary text-3xl md:text-5xl font-extrabold leading-tight mb-4">Pourquoi choisir Dataxx ?</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Dataxx n’est pas qu’une base de données : c’est une plateforme intelligente conçue pour transformer la prospection sponsoring en un levier stratégique de croissance.
              Nos agents IA combinent données économiques, signaux marché et analyse contextuelle pour offrir à vos équipes une vision que personne d’autre n’a.
            </p>
            {/* Chiffres sous le texte */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left mb-8">
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">70%</div>
                <p className="text-slate-600 mt-1 leading-snug">de temps gagné sur la phase de qualification et de veille</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">5×</div>
                <p className="text-slate-600 mt-1 leading-snug">de sponsors touchés sur une saison</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">3&nbsp;min</div>
                <p className="text-slate-600 mt-1 leading-snug">pour comprendre une entreprise et la contacter</p>
              </div>
            </div>
            {/* CTA primaire centré */}
            <div className="mt-6 flex justify-start">
              <a href="/demo" className="inline-flex items-center gap-2 rounded-[14px] px-7 py-3.5 bg-[#0b1220] text-white shadow-lg shadow-black/10 hover:shadow-black/20 transition">
                Demander une démo
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          {/* Colonne droite: 2x2 cartes différenciantes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Vision 360° du marché",
                desc:
                  "Une cartographie dynamique des entreprises qui révèle les futurs sponsors potentiels avant vos concurrents.",
                tone: "from-violet-50 to-white",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                  </svg>
                ),
              },
              {
                title: "Agents IA experts",
                desc:
                  "Chaque agent collecte et actualise en continu : sponsoring, signaux économiques, image de marque, RSE et actualités.",
                tone: "from-amber-50 to-white",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 9a4 4 0 018 0c1.7 0 3 1.3 3 3 0 1.2-.7 2.3-1.8 2.8-.3 1.7-1.8 3.2-3.7 3.2H11c-2.2 0-4-1.8-4-4 0-.2 0-.5.1-.7A3 3 0 018 9z" />
                    <path d="M9 12h1M14 12h1M11 15h2" />
                  </svg>
                ),
              },
              {
                title: "ROI immédiat et mesurable",
                desc:
                  "Hausse rapide du taux de signature et du panier moyen, avec un retour sur investissement dès la première saison.",
                tone: "from-blue-50 to-white",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 17l6-6 4 4 8-8" />
                    <path d="M21 21H3" />
                  </svg>
                ),
              },
              {
                title: "Avantage concurrentiel durable",
                desc:
                  "Prospection enrichie en continu par l’IA : vous contactez les bonnes entreprises au bon moment et gardez l’avance.",
                tone: "from-emerald-50 to-white",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                ),
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-gray-200 shadow-sm bg-white">
                <div className="p-5">
                  <div className="w-10 h-10 rounded-xl shadow-sm bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
                    {c.icon}
                  </div>
                  <h3 className="mt-4 text-secondary font-semibold text-lg">{c.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm">{c.desc}</p>
                </div>
                {/* couleur de fond supprimée */}
              </div>
            ))}
          </div>

          {/* (les chiffres sont désormais à gauche sous le texte) */}
        </div>
      </div>
    </section>
  );
};

export default WhyDataxxSection;


