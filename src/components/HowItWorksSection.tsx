import squeezie from "@/assets/squeezie.jpg";
import amixem from "@/assets/amixem.jpg";
import mcfly from "@/assets/mcfly-carlito.jpg";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import avatarDG from "@/assets/avatars/dg.jpg";
import avatarDM from "@/assets/avatars/dm.jpg";
import avatarRS from "@/assets/avatars/rs.jpg";
import dataxxLogo from "@/assets/logo.png";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
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
                    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#faf6ff" />
                    </linearGradient>
                    <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(268 83% 60%)" />
                      <stop offset="100%" stopColor="hsl(292 76% 60%)" />
                    </linearGradient>
                    <filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  <rect width="600" height="340" fill="url(#halo1)" />
                  {/* Carte stylisée avec pins */}
                  <g transform="translate(60,40)">
                    <rect x="0" y="0" width="360" height="220" rx="20" fill="url(#cardGrad)" stroke="#ececf1" />
                    {/* grille */}
                    <path d="M30 60 L330 60 M30 110 L330 110 M30 160 L330 160" stroke="#e9e9f2" />
                    <path d="M100 30 L100 190 M200 30 L200 190 M270 30 L270 190" stroke="#e9e9f2" />
                    {/* chemin de connexion */}
                    <path d="M95 140 C 150 70 230 140 300 95" fill="none" stroke="url(#pathGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                    {/* pins avec ombre et halo */}
                    <g filter="url(#ds)">
                      {/* pin violet (avec halo ping) */}
                      <circle cx="97" cy="140" r="10" className="animate-ping" fill="hsl(268 83% 60% / .25)" />
                      <path d="M85 140 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="hsl(268 83% 60%)" />
                      <circle cx="97" cy="140" r="5" fill="#fff" />
                      {/* pin orange */}
                      <path d="M220 100 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="#f59e0b" />
                      <circle cx="232" cy="100" r="5" fill="#fff" />
                      {/* pin bleu */}
                      <path d="M300 95 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="#60a5fa" />
                      <circle cx="312" cy="95" r="5" fill="#fff" />
                      {/* pin rose */}
                      <path d="M170 165 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22" fill="hsl(292 76% 60%)" />
                      <circle cx="182" cy="165" r="5" fill="#fff" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto mb-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
              <h3 className="text-secondary text-2xl font-bold mb-2">Cartographie du territoire</h3>
              <p className="text-gray-600">
                Accédez à une vision exhaustive des entreprises locales et nationales pertinentes,
                organisées par secteur, taille et potentiel de partenariat.
              </p>
            </div>
          </div>

          {/* Bloc 2 - Profilage & Agent IA (Listes) */}
          <div ref={(el) => el && (refs.current[1] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:100ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Fiche identité entreprise (alignée à la DA du bloc 5) */}
              <div className="absolute inset-0 p-6">
                <div className="h-full w-full rounded-2xl border border-primary/10 bg-white overflow-hidden">
                  {/* top bar */}
                  <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-200 flex items-center gap-1 px-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  </div>
                  {/* Header avec logo Dataxx + chips */}
                  <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={dataxxLogo} alt="Dataxx" className="h-7 w-7 rounded-md" />
                      <div>
                        <div className="h-3 w-40 bg-gray-200 rounded" />
                        <div className="h-3 w-24 bg-gray-100 rounded mt-2" />
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20 text-xs">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="currentColor"><rect x="3" y="10" width="3" height="10" rx="1" /><rect x="9" y="6" width="3" height="14" rx="1" /><rect x="15" y="3" width="3" height="17" rx="1" /></svg>
                        CA
                      </span>
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20 text-xs">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="currentColor"><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><rect x="5" y="13" width="14" height="6" rx="2" /></svg>
                        Effectifs
                      </span>
                    </div>
                  </div>
                  {/* Corps: lignes avec icônes dédiées */}
                  <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {/* CA */}
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                        <rect x="3" y="10" width="3" height="10" rx="1" />
                        <rect x="9" y="6" width="3" height="14" rx="1" />
                        <rect x="15" y="3" width="3" height="17" rx="1" />
                      </svg>
                      <span className="text-secondary/90 min-w-[150px]">Chiffre d’affaires</span>
                      <span className="flex-1 h-2 bg-gray-100 rounded" />
                    </div>
                    {/* Effectifs */}
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                        <circle cx="8" cy="8" r="3" />
                        <circle cx="16" cy="8" r="3" />
                        <rect x="5" y="13" width="14" height="6" rx="2" />
                      </svg>
                      <span className="text-secondary/90 min-w-[150px]">Effectifs</span>
                      <span className="flex-1 h-2 bg-gray-100 rounded" />
                    </div>
                    {/* Descriptif activité */}
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <rect x="7" y="8" width="10" height="2" rx="1" fill="#fff" />
                        <rect x="7" y="12" width="8" height="2" rx="1" fill="#fff" />
                      </svg>
                      <span className="text-secondary/90 min-w-[150px]">Descriptif activité</span>
                      <span className="flex-1 h-2 bg-gray-100 rounded" />
                    </div>
                    {/* Historique sponsoring */}
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                        <path d="M12 2l2.39 4.84L20 8l-4 3.9.95 5.53L12 15.9 7.05 17.43 8 13.9 4 10l5.61-1.16L12 2z" />
                      </svg>
                      <span className="text-secondary/90 min-w-[150px]">Historique sponsoring</span>
                      <span className="flex-1 h-2 bg-gray-100 rounded" />
                    </div>
                    {/* Image de marque */}
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                        <path d="M12 21s-6-4.35-8.5-7A5.5 5.5 0 0112 5.5 5.5 5.5 0 0120.5 14c-2.5 2.65-8.5 7-8.5 7z" />
                </svg>
                      <span className="text-secondary/90 min-w-[150px]">Image de marque</span>
                      <span className="flex-1 h-2 bg-gray-100 rounded" />
                    </div>
                  </div>
                  {/* footer CTA */}
                  <div className="px-5 pb-4 flex items-center gap-2">
                    <div className="meetsponsors-gradient text-white text-xs font-semibold px-3 py-2 rounded-full">Voir fiche</div>
                    <div className="text-primary border border-primary/30 text-xs font-medium px-3 py-2 rounded-full bg-white">Exporter</div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-12">
          {/* Bloc 4 - Identification des décideurs (Listes) */}
          <div ref={(el) => el && (refs.current[3] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:100ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 sm:px-6">
                {/* DG */}
                <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                  <img src={avatarDG} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                  <div className="flex-1 text-left">
                    <div className="text-secondary text-sm font-medium">Directeur général</div>
                    <div className="text-gray-500 text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 break-words">
                      <span className="whitespace-nowrap">+33 6 XX XX XX XX</span>
                      <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-gray-400/70" />
                      <span className="break-all">jean.dupond@entreprise.fr</span>
                    </div>
                  </div>
                </div>
                {/* DM */}
                <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                  <img src={avatarDM} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                  <div className="flex-1 text-left">
                    <div className="text-secondary text-sm font-medium">Directeur Marketing</div>
                    <div className="text-gray-500 text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 break-words">
                      <span className="whitespace-nowrap">+33 6 XX XX XX XX</span>
                      <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-gray-400/70" />
                      <span className="break-all">claire.martin@entreprise.fr</span>
                    </div>
                  </div>
                </div>
                {/* RS */}
                <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                  <img src={avatarRS} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                  <div className="flex-1 text-left">
                    <div className="text-secondary text-sm font-medium">Responsable Sponsoring</div>
                    <div className="text-gray-500 text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 break-words">
                      <span className="whitespace-nowrap">+33 6 XX XX XX XX</span>
                      <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-gray-400/70" />
                      <span className="break-all">thomas.bernard@entreprise.fr</span>
                    </div>
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

          {/* Bloc 5 - Emailing intelligent (nouveau visuel) */}
          <div ref={(el) => el && (refs.current[4] = el)} className="opacity-0 translate-y-6 transition-all duration-700 [transition-delay:200ms]">
            <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Email composer stylisé */}
              <div className="absolute inset-0 p-6">
                <div className="w-full h-full rounded-2xl border border-primary/10 bg-white overflow-hidden">
                  {/* top bar */}
                  <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-200 flex items-center gap-1 px-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  </div>
                  {/* fields */}
                  <div className="px-5 py-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-12">À:</span>
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20">
                          <span className="h-4 w-4 rounded-full bg-gradient-to-br from-primary to-accent" /> marketing@entreprise.fr
                        </span>
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20">
                          <span className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400" /> communication@entreprise.fr
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-12">Objet:</span>
                      <div className="flex-1 h-2 rounded bg-gray-100" />
                    </div>
                  </div>
                  {/* body */}
                  <div className="px-5 pb-4">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-secondary leading-relaxed">
                      Bonjour {"{Nom}"},<br/>
                      Nos analyses sur <span className="bg-primary/10 text-primary font-medium">votre image de marque</span> et votre
                      <span className="bg-accent/10 text-primary font-medium"> historique sponsoring</span> indiquent une forte affinité avec le {"{Club Y}"}.<br/>
                      Nous recommandons une activation conjointe mêlant brand content et visibilité stade, alignée sur vos KPI.
                      <ul className="list-disc pl-5 mt-2">
                        <li>Audience cible compatible</li>
                        <li>Moments forts de calendrier adaptés</li>
                        <li>Mesure de performance intégrée</li>
                      </ul>
                      Cordialement,<br/>
                      L’équipe Dataxx
                    </div>
                  </div>
                  {/* footer */}
                  <div className="px-5 pb-4 flex items-center gap-2">
                    <div className="meetsponsors-gradient text-white text-xs font-semibold px-3 py-2 rounded-full">Envoyer</div>
                    <div className="text-primary border border-primary/30 text-xs font-medium px-3 py-2 rounded-full bg-white">Personnaliser</div>
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
              {/* Kanban avec DA unifiée */}
              <div className="absolute inset-0 p-6">
                <div className="w-full h-full rounded-2xl border border-primary/10 bg-white overflow-hidden">
                  <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-200" />
                  <div className="p-4 grid grid-cols-3 gap-4 text-sm">
                    {["Prospect", "En négo", "Signé"].map((col, idx) => (
                      <div key={col} className="bg-primary/5 rounded-xl border border-primary/10 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-secondary font-medium">{col}</span>
                          <span className="h-5 w-5 rounded-full bg-primary/20" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-9 rounded-lg bg-white border border-gray-200 flex items-center gap-2 px-2">
                            <div className="h-5 w-5 rounded-md" style={{ background: "linear-gradient(135deg, hsl(268 83% 60%), hsl(292 76% 60%))" }} />
                            <span className="text-secondary/90">Novalytics</span>
                          </div>
                          {(idx !== 2) && (
                            <div className="h-9 rounded-lg bg-white border border-gray-200 flex items-center gap-2 px-2">
                              <div className="h-5 w-5 rounded-md" style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)" }} />
                              <span className="text-secondary/90">ThermaTech</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <div className="meetsponsors-gradient text-white text-xs font-semibold px-3 py-2 rounded-full">Créer opportunité</div>
                    <div className="text-primary border border-primary/30 text-xs font-medium px-3 py-2 rounded-full bg-white">Importer</div>
                  </div>
                </div>
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