import squeezie from "@/assets/squeezie.jpg";
import amixem from "@/assets/amixem.jpg";
import mcfly from "@/assets/mcfly-carlito.jpg";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Section "Comment ça marche" style MeetSponsors (3 + 2 blocs)
const HowItWorksSection = () => {
  const refs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* grille de fond subtile */}
      <div className="absolute inset-0 -z-10">
        <svg viewBox="0 0 1440 900" className="w-full h-full opacity-60">
          <defs>
            <pattern id="ms-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0V60" fill="none" stroke="#eef2ff" />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="url(#ms-grid)" />
        </svg>
      </div>

      {/* glow radial */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,hsl(268_83%_60%_/_0.15),transparent_60%)]" />

      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="text-primary tracking-widest text-sm font-semibold mb-4 uppercase">Fonctionnalités clés</div>
          <h2 className="text-secondary text-4xl md:text-6xl font-extrabold leading-tight">
            Trouver des nouveaux sponsors n'a
            <br className="hidden md:block" />
            jamais été aussi simple
          </h2>
        </div>

        {/* Rangée 1 : 3 blocs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Bloc 1 - Mapping intelligent (Loupe) */}
          <div ref={(el) => el && (refs.current[0] = el)} className="opacity-0 translate-y-6 transition-all duration-700">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0">
                <svg viewBox="0 0 600 340" className="w-full h-full">
                  {/* halo */}
                  <defs>
                    <radialGradient id="halo1" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="hsl(268 83% 60% / .08)" />
                      <stop offset="100%" stopColor="hsl(292 76% 60% / 0)" />
                    </radialGradient>
                  </defs>
                  <rect width="600" height="340" fill="url(#halo1)" />
                  {/* Carte stylisée avec pins */}
                  <g transform="translate(60,40)">
                    <rect x="0" y="0" width="360" height="220" rx="20" fill="#fafafa" stroke="#e5e7eb" />
                    {/* routes/limites */}
                    <path d="M30 60 L330 60 M30 110 L330 110 M30 160 L330 160" stroke="#e5e7eb" />
                    <path d="M100 30 L100 190 M200 30 L200 190 M270 30 L270 190" stroke="#e5e7eb" />
                    {/* pins */}
                    <g>
                      <path d="M85 95 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="hsl(268 83% 60%)" />
                      <circle cx="97" cy="95" r="5" fill="#fff" />
                    </g>
                    <g>
                      <path d="M220 145 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="hsl(292 76% 60%)" />
                      <circle cx="232" cy="145" r="5" fill="#fff" />
                    </g>
                    <g>
                      <path d="M290 80 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="#60a5fa" />
                      <circle cx="302" cy="80" r="5" fill="#fff" />
                    </g>
                    <g>
                      <path d="M160 60 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="#f59e0b" />
                      <circle cx="172" cy="60" r="5" fill="#fff" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
              <h3 className="text-secondary text-2xl font-bold mb-2">Cartographie du territoire</h3>
              <p className="text-gray-600">
                Cartographiez votre territoire de sponsoring. Accédez à une vision exhaustive des entreprises locales et nationales pertinentes,
                organisées par secteur, taille et potentiel de partenariat.
              </p>
            </div>
          </div>

          {/* Bloc 2 - Profilage & Agent IA (Listes) */}
          <div ref={(el) => el && (refs.current[1] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:100ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="bg-primary/5 rounded-full px-4 py-2 w-[70%] max-w-[360px] flex items-center gap-3 border border-primary/10">
                  <img src={squeezie} alt="Squeezie" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 text-left text-secondary text-sm font-medium">Squeezie</div>
                  <div className="flex gap-1">
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                  </div>
                </div>
                <div className="bg-primary/5 rounded-full px-4 py-2 w-[70%] max-w-[360px] flex items-center gap-3 border border-primary/10">
                  <img src={amixem} alt="Amixem" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 text-left text-secondary text-sm font-medium">Amixem</div>
                  <div className="flex gap-1">
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                  </div>
                </div>
                <div className="bg-primary/5 rounded-full px-4 py-2 w-[70%] max-w-[360px] flex items-center gap-3 border border-primary/10">
                  <img src={mcfly} alt="Mcfly et Carlito" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 text-left text-secondary text-sm font-medium">Mcfly & Carlito</div>
                  <div className="flex gap-1">
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                    <span className="h-3 w-6 rounded-full bg-primary/20" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
              <h3 className="text-secondary text-2xl font-bold mb-2">Profilage & Agent IA</h3>
              <p className="text-gray-600">
                Notre IA collecte et met à jour en continu : chiffre d’affaires, effectifs, historique sponsoring, signaux économiques,
                actualités, engagements RSE et image de marque.
              </p>
            </div>
          </div>

          {/* Bloc 3 - Scoring IA de compatibilité (Jauge) */}
          <div ref={(el) => el && (refs.current[2] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:200ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 300 200" className="w-[85%]">
                  <defs>
                    <linearGradient id="grad-top" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(268 83% 60%)" />
                      <stop offset="100%" stopColor="hsl(292 76% 60%)" />
                    </linearGradient>
                  </defs>
                  <path d="M20 160 A130 130 0 0 1 280 160" fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round" />
                  <path d="M20 160 A130 130 0 0 1 200 70" fill="none" stroke="url(#grad-top)" strokeWidth="14" strokeLinecap="round" />
                  <circle cx="150" cy="160" r="6" fill="#6d28d9" />
                  <text x="150" y="110" textAnchor="middle" fill="#111827" fontSize="28" fontWeight="700">86%</text>
                </svg>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
              <h3 className="text-secondary text-2xl font-bold mb-2">Scoring IA de compatibilité</h3>
              <p className="text-gray-600">Un score d’affinité calcule automatiquement le “fit” entre votre club et chaque entreprise, selon vos objectifs business et vos valeurs.</p>
            </div>
          </div>
        </div>

        {/* Rangée 2 : 3 blocs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {/* Bloc 4 - Identification des décideurs (Listes) */}
          <div ref={(el) => el && (refs.current[3] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:100ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
                {/* DG */}
                <div className="bg-primary/5 rounded-2xl w-full max-w-[420px] h-14 flex items-center gap-3 border border-primary/10 px-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-primary/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor">
                      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="15.5" cy="10" r="1.5" fill="currentColor" />
                      <path d="M8 15c1.5 1.2 3.5 1.2 5 0" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-secondary text-sm font-medium">Directeur général</div>
                    <div className="text-gray-500 text-xs">+33 6 XX XX XX XX · jean.dupond@XXX.fr</div>
                  </div>
                </div>
                {/* DM */}
                <div className="bg-primary/5 rounded-2xl w-full max-w-[420px] h-14 flex items-center gap-3 border border-primary/10 px-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-primary/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor">
                      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="15.5" cy="10" r="1.5" fill="currentColor" />
                      <path d="M8 15c1.5 1.2 3.5 1.2 5 0" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-secondary text-sm font-medium">Directeur Marketing</div>
                    <div className="text-gray-500 text-xs">+33 6 XX XX XX XX · claire.martin@XXX.fr</div>
                  </div>
                </div>
                {/* RS */}
                <div className="bg-primary/5 rounded-2xl w-full max-w-[420px] h-14 flex items-center gap-3 border border-primary/10 px-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-primary/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor">
                      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="15.5" cy="10" r="1.5" fill="currentColor" />
                      <path d="M8 15c1.5 1.2 3.5 1.2 5 0" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-secondary text-sm font-medium">Responsable Sponsoring</div>
                    <div className="text-gray-500 text-xs">+33 6 XX XX XX XX · thomas.bernard@XXX.fr</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
              <h3 className="text-secondary text-2xl font-bold mb-2">Identification des décideurs</h3>
              <p className="text-gray-600">Retrouvez les décideurs clés et laissez l’IA enrichir leurs coordonnées pour engager la conversation au bon niveau.</p>
            </div>
          </div>

          {/* Bloc 5 - Emailing intelligent (Chat) */}
          <div ref={(el) => el && (refs.current[4] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:200ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Carte e-mail complète */}
              <div className="absolute inset-0 p-6">
                <div className="w-full h-full rounded-2xl border border-primary/10 bg-white">
                  <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                    <div className="text-sm font-medium text-secondary">Rédaction IA</div>
                  </div>
                  <div className="px-5 py-3 space-y-2 text-sm">
                    <div className="flex gap-2"><span className="text-gray-500 w-12">À:</span><span className="text-secondary">marketing@entreprise-x.fr</span></div>
                    <div className="flex gap-2"><span className="text-gray-500 w-12">De:</span><span className="text-secondary">commercial@club-y.fr</span></div>
                    <div className="flex gap-2"><span className="text-gray-500 w-12">Objet:</span><span className="text-secondary">Partenariat {"{Entreprise X}"} × {"{Club Y}"}</span></div>
                  </div>
                  <div className="px-5 py-4 text-sm text-secondary leading-relaxed">
                    Bonjour {"{Nom}"},<br/><br/>
                    En analysant votre image de marque et votre historique sponsoring, notre IA identifie une forte affinité avec le {"{Club Y}"}. Les valeurs partagées
                    et vos campagnes récentes montrent un alignement naturel pour une activation commune (brand content + présence stade).<br/><br/>
                    Nous proposons une collaboration axée sur la performance, avec des activations adaptées à vos objectifs et un suivi précis des KPI.
                    <br/><br/>
                    Seriez-vous disponible pour un échange de 15 minutes cette semaine ?
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">5</div>
              <h3 className="text-secondary text-2xl font-bold mb-2">Emailing intelligent</h3>
              <p className="text-gray-600">L’IA génère des messages personnalisés et optimisés pour maximiser vos taux de réponse.</p>
            </div>
          </div>

          {/* Bloc 6 - CRM intégré (Pipeline) */}
          <div ref={(el) => el && (refs.current[5] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:300ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8">
                {[
                  { title: "Prospect", companies: ["Novalytics", "GreenFlux"] },
                  { title: "En négo", companies: ["ThermaTech", "BlueWave", "Solaria"] },
                  { title: "Signé", companies: ["UrbanEdge"] },
                ].map((col) => (
                  <div key={col.title} className="bg-primary/5 rounded-2xl border border-primary/10 p-3">
                    <div className="text-secondary text-sm font-medium mb-3">{col.title}</div>
                    <div className="space-y-2">
                      {col.companies.map((name) => (
                        <div key={name} className="h-10 rounded-xl bg-white border border-gray-200 flex items-center gap-3 px-3">
                          <div className="h-6 w-6 rounded-md" style={{ background: "linear-gradient(135deg, hsl(268 83% 60%), hsl(292 76% 60%))" }} />
                          <span className="text-sm text-secondary">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">6</div>
              <h3 className="text-secondary text-2xl font-bold mb-2">CRM intégré</h3>
              <p className="text-gray-600">Centralisez vos échanges, suivez vos discussions, organisez vos relances et pilotez vos opportunités.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4">
            <button className="meetsponsors-gradient text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:-translate-y-1 transition-all">Essayer Dataxx</button>
            <button className="btn-secondary">Voir une démo</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;