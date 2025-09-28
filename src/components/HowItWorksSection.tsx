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
    <section className="relative py-24 px-6 overflow-hidden bg-transparent">
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
          <div className="text-primary tracking-widest text-sm font-semibold mb-4 uppercase">Comment ça marche</div>
          <h2 className="text-secondary text-3xl md:text-5xl font-extrabold leading-tight">
            Trouver des nouveaux sponsors n'a
            <br className="hidden md:block" />
            jamais été aussi simple
          </h2>
        </div>

        {/* Carrousel en continu - 3 cartes visibles */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 md:gap-10 animate-[how-scroll_22s_linear_infinite] hover:pause">
            {[0,1,2,3,4,5,0,1,2].map((i, idx) => (
              <div key={idx} className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px]">
                {i === 0 && (
                  <div className="opacity-100 translate-y-0">
                    <div className="relative min-h-[320px] sm:h-[320px] rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
                      <div className="absolute inset-0 p-6 flex">
                        <div className="mx-auto w-full max-w-[520px] h-full rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white shadow-sm overflow-hidden">
                          {/* Top bar */}
                          <div className="h-10 border-b border-gray-100 flex items-center justify-between px-3">
                            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div>
                            <div className="flex-1 max-w-xs mx-3 h-7 rounded-full bg-gray-100 border border-gray-200" />
                            <div className="flex items-center gap-2"><span className="h-6 w-16 rounded-full bg-gray-100 border border-gray-200" /><span className="h-6 w-16 rounded-full bg-gray-100 border border-gray-200" /></div>
                          </div>
                          {/* Carte de France stylisée */}
                          <div className="relative h-[230px]">
                            <svg viewBox="0 0 520 230" className="absolute inset-0 w-full h-full">
                              <defs>
                                <clipPath id="hex-fr">
                                  <polygon points="380,115 320,219 200,219 140,115 200,11 320,11" />
                                </clipPath>
                                <linearGradient id="hex-fill" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#ffffff" />
                                  <stop offset="100%" stopColor="#f7f5ff" />
                                </linearGradient>
                                <pattern id="grid-fr" width="28" height="28" patternUnits="userSpaceOnUse">
                                  <path d="M28 0H0V28" fill="none" stroke="#eef2ff" />
                                </pattern>
                                <radialGradient id="halo-fr" cx="50%" cy="50%" r="60%">
                                  <stop offset="0%" stopColor="hsl(268 83% 60% / .18)" />
                                  <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                                <linearGradient id="link-fr" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="hsl(268 83% 60%)" />
                                  <stop offset="100%" stopColor="hsl(292 76% 60%)" />
                                </linearGradient>
                                <filter id="dot-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                  <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.18" />
                                </filter>
                              </defs>

                              {/* Hexagone (France) */}
                              <g>
                                <polygon points="380,115 320,219 200,219 140,115 200,11 320,11" fill="url(#hex-fill)" stroke="#e7e7f3" strokeWidth="2" />
                                <g clipPath="url(#hex-fr)">
                                  <rect x="140" y="11" width="240" height="208" fill="url(#grid-fr)" />
                                  <circle cx="260" cy="115" r="120" fill="url(#halo-fr)" />
                                </g>
                              </g>

                              {/* Villes principales */}
                              <g filter="url(#dot-shadow)" fill="#10b981">
                                <circle cx="280" cy="85" r="6" />
                                <circle cx="325" cy="135" r="6" />
                                <circle cx="350" cy="170" r="6" />
                                <circle cx="205" cy="150" r="6" />
                                <circle cx="215" cy="120" r="6" />
                                <circle cx="295" cy="45" r="6" />
                                <circle cx="210" cy="95" r="6" />
                                <circle cx="265" cy="170" r="6" />
                                <circle cx="365" cy="160" r="6" />
                              </g>

                              {/* Liaisons */}
                              <path d="M280 85 C 300 95 315 115 325 135" stroke="url(#link-fr)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
                              <path d="M280 85 C 310 120 335 145 350 170" stroke="url(#link-fr)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6" />
                              <path d="M280 85 C 260 110 235 135 205 150" stroke="url(#link-fr)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6" />

                              {/* Légende */}
                              <g transform="translate(345,22)">
                                <rect width="135" height="28" rx="8" fill="#ffffff" stroke="#e5e7eb" />
                                <circle cx="14" cy="14" r="5" fill="#10b981" />
                                <text x="28" y="19" fill="#0f172a" fontSize="11" fontWeight="600">Villes à fort potentiel</text>
                              </g>
                            </svg>
                            {/* Filtres chips */}
                            <div className="absolute left-3 top-3 flex gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-secondary text-xs border border-primary/20">Région</span>
                              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-secondary text-xs border border-primary/20">Secteur</span>
                              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-secondary text-xs border border-primary/20">Potentiel</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="mx-auto mb-2 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow">1</div>
                      <h3 className="text-secondary text-xl font-bold mb-1">Cartographie du territoire</h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        Accédez à une vision exhaustive des entreprises locales et nationales pertinentes,
                        organisées par secteur, taille et potentiel de partenariat.
                      </p>
                    </div>
                  </div>
                )}
                {i === 1 && (
                  <div className="opacity-100 translate-y-0">
                    <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
                      <div className="absolute inset-0 p-6">
                        <div className="h-full w-full rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
                          <div className="px-3 py-2.5 flex items-center gap-2.5 border-b border-gray-100">
                            <img src={dataxxLogo} alt="Dataxx" className="h-7 w-7 rounded-md ring-1 ring-gray-200" />
                            <div className="min-w-0">
                              <div className="text-secondary font-semibold leading-tight text-[13px]">Dataxx</div>
                              <div className="text-[10px] text-gray-500">Fiche identité</div>
                            </div>
                          </div>
                          <div className="px-3 py-2.5 space-y-2 text-[12px]">
                            <div className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M9 7h6a1 1 0 110 2H9a1 1 0 100 2h5a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6a1 1 0 110-2h1a3 3 0 010-2H6a1 1 0 110-2h1V7a1 1 0 112 0v1Zm4 6H9a1 1 0 100 2h4a1 1 0 110 2H9a3 3 0 01-3-3v-4a3 3 0 013-3h4a1 1 0 110 2Z"/></svg></span><div className="flex-1 flex items-center justify-between gap-2"><span className="text-gray-700 font-semibold">Chiffre d’affaires</span><span className="font-medium text-secondary text-[12px]">250M – 500M€</span></div></div>
                            <div className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">Activité</div><p className="text-secondary/90 leading-snug">Plateforme IA de cartographie et qualification des entreprises pour le sponsoring sportif.</p></div></div>
                            <div className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M5 4h14v2H5V4Zm2 4h10v2H7V8Zm-2 4h14v2H5v-2Zm2 4h7v2H7v-2Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">Historique sponsoring</div><p className="text-secondary/90 leading-snug">Partenariats récents avec clubs pros et événements nationaux.</p></div></div>
                            <div className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 4l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 16.9 6.22 18.7l.91-5.32L3.27 9.62l5.34-.78L12 4Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">Image de marque</div><p className="text-secondary/90 leading-snug">Innovante, data‑driven et orientée performance mesurable.</p></div></div>
                          </div>
                          <div className="px-3 pb-3 flex items-center gap-2"><span className="meetsponsors-gradient text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full">Voir fiche</span><span className="text-primary border border-primary/20 text-[10px] font-medium px-2.5 py-1.5 rounded-full bg-white">Exporter</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="mx-auto mb-2 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow">2</div>
                      <h3 className="text-secondary text-xl font-bold mb-1">Profilage & Agent IA</h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        Notre IA collecte et met à jour en continu : chiffre d’affaires, effectifs, historique sponsoring,
                        signaux économiques, actualités, engagements RSE et image de marque.
                      </p>
                    </div>
                  </div>
                )}
                {i === 2 && (
                  <div className="opacity-100 translate-y-0">
                    <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
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
                    <div className="mt-4 text-center">
                      <div className="mx-auto mb-2 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow">3</div>
                      <h3 className="text-secondary text-xl font-bold mb-1">Scoring IA de compatibilité</h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        Un score d’affinité calcule automatiquement le “fit” entre votre club et chaque entreprise,
                        selon vos objectifs business et vos valeurs.
                      </p>
                    </div>
                  </div>
                )}
                {i === 3 && (
                  <div className="opacity-100 translate-y-0">
                    <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 sm:px-6">
                        <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                          <img src={avatarDG} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                          <div className="flex-1 text-left">
                            <div className="text-secondary text-sm font-medium">Directeur général</div>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <button className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-white hover:bg-primary/5 transition-colors">Révéler le téléphone</button>
                              <button className="text-[11px] px-2.5 py-1 rounded-full meetsponsors-gradient text-white transition-colors">Révéler l'email</button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                          <img src={avatarDM} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                          <div className="flex-1 text-left">
                            <div className="text-secondary text-sm font-medium">Directeur Marketing</div>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <button className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-white hover:bg-primary/5 transition-colors">Révéler le téléphone</button>
                              <button className="text-[11px] px-2.5 py-1 rounded-full meetsponsors-gradient text-white transition-colors">Révéler l'email</button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2">
                          <img src={avatarRS} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                          <div className="flex-1 text-left">
                            <div className="text-secondary text-sm font-medium">Responsable Sponsoring</div>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <button className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-white hover:bg-primary/5 transition-colors">Révéler le téléphone</button>
                              <button className="text-[11px] px-2.5 py-1 rounded-full meetsponsors-gradient text-white transition-colors">Révéler l'email</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="mx-auto mb-2 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow">4</div>
                      <h3 className="text-secondary text-xl font-bold mb-1">Identification des décideurs</h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        Retrouvez les décideurs clés et laissez l’IA enrichir leurs coordonnées pour engager la conversation au bon niveau.
                      </p>
                    </div>
                  </div>
                )}
                {i === 4 && (
                  <div className="opacity-100 translate-y-0">
                    <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
                      <div className="absolute inset-0 p-6">
                        <div className="w-full h-full rounded-2xl border border-primary/10 bg-white overflow-hidden">
                          <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-200 flex items-center gap-1 px-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                            <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                          </div>
                          <div className="px-5 py-3 space-y-2 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 w-12">À:</span>
                              <div className="flex gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20">
                                  <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-primary to-accent" /> prenom.nom@entreprise.fr
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 w-12">Objet:</span>
                              <div className="flex-1">
                                <span className="inline-flex max-w-full items-center px-2 py-1 rounded-md bg-gray-100 text-secondary border border-gray-200">
                                  Opportunité de partenariat entre Groupe Samsic et SRFC
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 pb-2">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-[10px] text-secondary leading-relaxed whitespace-pre-line">{`Bonjour Benjamin,

Nous avons suivi avec beaucoup d’intérêt votre partenariat récent avec le Lou Rugby, qui illustre parfaitement votre engagement en faveur de l’ancrage territorial et du sport de haut niveau.

Au SRFC, nous partageons cette vision et pensons qu’il serait intéressant d’échanger afin d’explorer les opportunités d’un partenariat mutuellement bénéfique.

Bien à vous,`}</div>
                          </div>
                          <div className="px-5 pb-4 flex items-center gap-2">
                            <div className="meetsponsors-gradient text-white text-xs font-semibold px-3 py-2 rounded-full">Envoyer</div>
                            <div className="text-primary border border-primary/30 text-xs font-medium px-3 py-2 rounded-full bg-white">Personnaliser</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="mx-auto mb-2 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow">5</div>
                      <h3 className="text-secondary text-xl font-bold mb-1">Emailing intelligent</h3>
                      <p className="text-gray-600 text-sm md:text-base">L’IA génère des messages personnalisés et optimisés pour maximiser vos taux de réponse.</p>
                    </div>
                  </div>
                )}
                {i === 5 && (
                  <div className="opacity-100 translate-y-0">
                    <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ring-1 ring-primary/10 shadow-md group">
                      <div className="absolute inset-0 p-6">
                        <div className="w-full h-full rounded-2xl bg-white/90 ring-1 ring-primary/10 overflow-hidden flex flex-col">
                          <div className="px-5 py-3 border-b border-gray-100">
                            <div className="text-secondary font-semibold">Mes contrats</div>
                          </div>
                          <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] flex-1">
                            {[
                              { title: "Prospects", tone: "ring-gray-200", items: ["Novalytics", "ThermaTech", "DataSphere", "PulseAI"], badge: "bg-gradient-to-br from-primary to-accent text-white" },
                              { title: "En négo", tone: "ring-primary/20", items: ["BlueWave", "GreenPulse", "AeroLink"], badge: "bg-gradient-to-br from-primary to-accent text-white" },
                              { title: "Signé", tone: "ring-emerald-200", items: ["HexaTech"], badge: "bg-emerald-100 text-emerald-700" },
                            ].map((col) => (
                              <div key={col.title} className={`rounded-2xl bg-white/80 ring-1 ${col.tone} p-2.5 pt-3 flex flex-col`}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="text-secondary font-medium text-[11px] whitespace-nowrap leading-none">{col.title}</div>
                                  <span className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[8px] font-semibold ${col.badge}`}>{col.items.length}</span>
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1.5">
                                  {col.items.map((name) => (
                                    <span key={name} className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-white/95 ring-1 ring-gray-200 shadow-sm shadow-inner max-w-full">
                                      <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                                      <span className="text-secondary/90 truncate max-w-[150px] md:max-w-[160px] lg:max-w-[180px]">{name}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="mx-auto mb-2 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow">6</div>
                      <h3 className="text-secondary text-xl font-bold mb-1">CRM intégré</h3>
                      <p className="text-gray-600 text-sm md:text-base">Centralisez vos échanges, suivez vos discussions, organisez vos relances et pilotez vos opportunités.</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes how-scroll { 0%{ transform: translateX(0);} 100%{ transform: translateX(-50%);} }`}</style>
        {/* Frise retirée à la demande */}
      </div>
    </section>
  );
};

export default HowItWorksSection;