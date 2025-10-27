import React, { useMemo, useState } from "react";
import dataxxLogo from "@/assets/logo.png";
import avatarDG from "@/assets/avatars/dg.jpg";
import avatarDM from "@/assets/avatars/dm.jpg";
import avatarRS from "@/assets/avatars/rs.jpg";

type Key = "mapping" | "profil" | "scoring" | "contacts" | "emailing" | "pipeline";
const buttons: Array<{ key: Key; name: string; color: string; icon: React.ReactNode }> = [
  { key: "mapping", name: "Cartographie", color: "from-violet-500 to-fuchsia-500", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="7" /><path d="M21 21l-5.2-5.2"/></svg> },
  { key: "profil", name: "Profilage IA", color: "from-blue-500 to-cyan-500", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4Z"/></svg> },
  { key: "scoring", name: "Scoring", color: "from-amber-500 to-orange-500", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17a9 9 0 0118 0"/><path d="M3 17h18"/></svg> },
  { key: "contacts", name: "Décideurs", color: "from-emerald-500 to-lime-500", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 21a6 6 0 0112 0M10 21a6 6 0 0112 0"/></svg> },
  { key: "emailing", name: "Emailing", color: "from-rose-500 to-pink-500", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v12H4z"/><path d="M22 6l-10 7L2 6"/></svg> },
  { key: "pipeline", name: "Pipeline", color: "from-purple-600 to-indigo-600", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="6" height="16" rx="2"/><rect x="10" y="8" width="6" height="12" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/></svg> },
];

const AllInOneSection: React.FC = () => {
  const [active, setActive] = useState<Key>("mapping");

  const content = useMemo(() => {
    switch (active) {
      case "mapping":
        return {
          title: "Cartographie du territoire",
          text: "Accédez à une vision exhaustive des entreprises locales et nationales pertinentes, organisées par secteur, taille et potentiel de partenariat.",
          visual: (
            <div className="relative h-[300px] md:h-[340px]">
              <svg viewBox="0 0 520 230" className="absolute inset-0 w-full h-full">
                <defs>
                  <clipPath id="hex-fr-a"><polygon points="380,115 320,219 200,219 140,115 200,11 320,11" /></clipPath>
                  <linearGradient id="hex-fill-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#f7f5ff" /></linearGradient>
                  <pattern id="grid-fr-a" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#eef2ff" /></pattern>
                  <radialGradient id="halo-fr-a" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="hsl(268 83% 60% / .18)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <linearGradient id="link-fr-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="hsl(268 83% 60%)" /><stop offset="100%" stopColor="hsl(292 76% 60%)" /></linearGradient>
                  <filter id="dot-shadow-a" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.18" /></filter>
                </defs>
                <g>
                  <polygon points="380,115 320,219 200,219 140,115 200,11 320,11" fill="url(#hex-fill-a)" stroke="#e7e7f3" strokeWidth="2" />
                  <g clipPath="url(#hex-fr-a)"><rect x="140" y="11" width="240" height="208" fill="url(#grid-fr-a)" /><circle cx="260" cy="115" r="120" fill="url(#halo-fr-a)" /></g>
                </g>
                <g filter="url(#dot-shadow-a)" fill="#10b981">
                  <circle cx="280" cy="85" r="6" /><circle cx="325" cy="135" r="6" /><circle cx="350" cy="170" r="6" /><circle cx="205" cy="150" r="6" /><circle cx="215" cy="120" r="6" /><circle cx="295" cy="45" r="6" /><circle cx="210" cy="95" r="6" /><circle cx="265" cy="170" r="6" /><circle cx="365" cy="160" r="6" />
                </g>
                <path d="M280 85 C 300 95 315 115 325 135" stroke="url(#link-fr-a)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
                <path d="M280 85 C 310 120 335 145 350 170" stroke="url(#link-fr-a)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M280 85 C 260 110 235 135 205 150" stroke="url(#link-fr-a)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6" />
              </svg>
              <div className="absolute left-3 top-3 flex gap-2"><span className="px-2.5 py-1 rounded-full bg-primary/10 text-secondary text-xs border border-primary/20">Région</span><span className="px-2.5 py-1 rounded-full bg-primary/10 text-secondary text-xs border border-primary/20">Secteur</span><span className="px-2.5 py-1 rounded-full bg-primary/10 text-secondary text-xs border border-primary/20">Potentiel</span></div>
            </div>
          ),
        };
      case "profil":
        return {
          title: "Profilage & Agent IA",
          text: "Des fiches entreprises enrichies automatiquement: CA, effectifs, historique sponsoring, signaux économiques, actualités, engagements RSE et image de marque.",
          visual: (
            <div className="h-[300px] md:h-[340px] rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white overflow-hidden p-4">
              <div className="px-2.5 py-2 flex items-center gap-2.5 border-b border-gray-100"><img src={dataxxLogo} alt="Dataxx" className="h-7 w-7 rounded-md ring-1 ring-gray-200" /><div className="min-w-0"><div className="text-secondary font-semibold leading-tight text-[13px]">Dataxx</div><div className="text-[10px] text-gray-500">Fiche identité</div></div></div>
              <div className="px-3 py-3 space-y-2 text-[12px]">
                <div className="flex items-center gap-2"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M9 7h6a1 1 0 110 2H9a1 1 0 100 2h5a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6a1 1 0 110-2h1a3 3 0 010-2H6a1 1 0 110-2h1V7a1 1 0 112 0v1Zm4 6H9a1 1 0 100 2h4a1 1 0 110 2H9a3 3 0 01-3-3v-4a3 3 0 013-3h4a1 1 0 110 2Z"/></svg></span><div className="flex-1 flex items-center justify-between gap-2"><span className="text-gray-700 font-semibold">Chiffre d’affaires</span><span className="font-medium text-secondary text-[12px]">250M – 500M€</span></div></div>
                <div className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">Activité</div><p className="text-secondary/90 leading-snug">Plateforme IA de cartographie et qualification des entreprises pour le sponsoring sportif.</p></div></div>
                <div className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M5 4h14v2H5V4Zm2 4h10v2H7V8Zm-2 4h14v2H5v-2Zm2 4h7v2H7v-2Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">Historique sponsoring</div><p className="text-secondary/90 leading-snug">Partenariats récents avec clubs pros et événements nationaux.</p></div></div>
                <div className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 4l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 16.9 6.22 18.7l.91-5.32L3.27 9.62l5.34-.78L12 4Z"/></svg></span><div className="flex-1"><div className="text-gray-700 font-semibold">Image de marque</div><p className="text-secondary/90 leading-snug">Innovante, data‑driven et orientée performance mesurable.</p></div></div>
              </div>
            </div>
          ),
        };
      case "scoring":
        return {
          title: "Scoring IA de compatibilité",
          text: "Un score d’affinité calcule automatiquement le fit entre votre club et chaque entreprise.",
          visual: (
            <div className="h-[300px] md:h-[340px] flex items-center justify-center">
              <svg viewBox="0 0 300 200" className="w-[85%]"><defs><linearGradient id="grad-top-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="hsl(268 83% 60%)" /><stop offset="100%" stopColor="hsl(292 76% 60%)" /></linearGradient></defs><path d="M20 160 A130 130 0 0 1 280 160" fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round" /><path d="M20 160 A130 130 0 0 1 200 70" fill="none" stroke="url(#grad-top-a)" strokeWidth="14" strokeLinecap="round" /><circle cx="150" cy="160" r="6" fill="#6d28d9" /><text x="150" y="110" textAnchor="middle" fill="#111827" fontSize="28" fontWeight="700">86%</text></svg>
            </div>
          ),
        };
      case "contacts":
        return {
          title: "Identification des décideurs",
          text: "Retrouvez les décideurs clés (marketing, sponsoring, direction) et enrichissez leurs coordonnées.",
          visual: (
            <div className="flex flex-col items-center justify-center gap-4 px-4 sm:px-6">{[{img:avatarDG,role:"Directeur général"},{img:avatarDM,role:"Directeur Marketing"},{img:avatarRS,role:"Responsable Sponsoring"}].map((p)=> (<div key={p.role} className="bg-primary/5 rounded-2xl w-full max-w-[520px] min-h-14 flex items-center gap-3 border border-primary/10 px-4 py-2"><img src={p.img} alt="Avatar IA" className="w-8 h-8 rounded-full object-cover border border-primary/20" /><div className="flex-1 text-left"><div className="text-secondary text-sm font-medium">{p.role}</div><div className="flex flex-wrap items-center gap-2 pt-0.5"><button className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-white">Révéler le téléphone</button><button className="text-[11px] px-2.5 py-1 rounded-full meetsponsors-gradient text-white">Révéler l'email</button></div></div></div>))}</div>
          ),
        };
      case "emailing":
        return {
          title: "Emailing intelligent",
          text: "Générez des messages personnalisés alignés sur l’image de marque et l’historique sponsoring.",
          visual: (
            <div className="w-full h-[300px] md:h-[340px] rounded-2xl border border-primary/10 bg-white overflow-hidden"><div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-200 flex items-center gap-1 px-3"><span className="h-2.5 w-2.5 rounded-full bg-primary/60" /><span className="h-2.5 w-2.5 rounded-full bg-accent/60" /><span className="h-2.5 w-2.5 rounded-full bg-gray-300" /></div><div className="px-5 py-3 space-y-2 text-[11px]"><div className="flex items-center gap-2"><span className="text-gray-500 w-12">À:</span><div className="flex gap-2 flex-wrap"><span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-secondary border border-primary/20"><span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-primary to-accent" /> prenom.nom@entreprise.fr</span></div></div><div className="flex items-center gap-2"><span className="text-gray-500 w-12">Objet:</span><div className="flex-1"><span className="inline-flex max-w-full items-center px-2 py-1 rounded-md bg-gray-100 text-secondary border border-gray-200">Opportunité de partenariat entre Groupe Samsic et SRFC</span></div></div></div><div className="px-4 pb-2"><div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-[10px] text-secondary leading-relaxed whitespace-pre-line">{`Bonjour Benjamin,

Nous avons suivi avec beaucoup d’intérêt votre partenariat récent avec le Lou Rugby, qui illustre parfaitement votre engagement en faveur de l’ancrage territorial et du sport de haut niveau.

Au SRFC, nous partageons cette vision et pensons qu’il serait intéressant d’échanger afin d’explorer les opportunités d’un partenariat mutuellement bénéfique.

Bien à vous,`}</div></div></div>
          ),
        };
      case "pipeline":
        return {
          title: "CRM intégré",
          text: "Suivez votre pipeline de prospection, organisez vos relances et pilotez vos opportunités.",
          visual: (
            <div className="w-full h-[300px] md:h-[340px] rounded-2xl bg-white/90 ring-1 ring-primary/10 overflow-hidden flex flex-col"><div className="px-5 py-3 border-b border-gray-100"><div className="text-secondary font-semibold">Mes contrats</div></div><div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] flex-1">{[{ title: "Prospects", tone: "ring-gray-200", items: ["Novalytics", "ThermaTech", "DataSphere", "PulseAI"], badge: "bg-gradient-to-br from-primary to-accent text-white" },{ title: "En négo", tone: "ring-primary/20", items: ["BlueWave", "GreenPulse", "AeroLink"], badge: "bg-gradient-to-br from-primary to-accent text-white" },{ title: "Signé", tone: "ring-emerald-200", items: ["HexaTech"], badge: "bg-emerald-100 text-emerald-700" }].map((col) => (<div key={col.title} className={`rounded-2xl bg-white/80 ring-1 ${col.tone} p-2.5 pt-3 flex flex-col`}><div className="flex items-center justify-between mb-1.5"><div className="text-secondary font-medium text-[11px] whitespace-nowrap leading-none">{col.title}</div><span className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[8px] font-semibold ${col.badge}`}>{col.items.length}</span></div><div className="flex flex-col gap-1.5 mt-1.5">{col.items.map((name) => (<span key={name} className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-white/95 ring-1 ring-gray-200 shadow-sm shadow-inner max-w-full"><span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" /><span className="text-secondary/90 truncate max-w-[150px] md:max-w-[160px] lg:max-w-[180px]">{name}</span></span>))}</div></div>))}</div></div>
          ),
        };
      default:
        return { title: "", text: "", visual: null } as const;
    }
  }, [active]);

  return (
    <section className="relative py-20 md:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-secondary text-3xl md:text-5xl font-extrabold leading-tight">Une plateforme tout‑en‑un</h2>
          <p className="text-gray-600 mt-3 md:text-lg">Les six applications Dataxx</p>
        </div>
        {/* Boutons cliquables */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-10">
          {buttons.map((b) => (
            <button key={b.key} onClick={() => setActive(b.key)} className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg transition-transform ${active === b.key ? "scale-105" : "hover:scale-105"}`} aria-pressed={active === b.key}>
              <span className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${b.color} opacity-95`} />
              <span className="relative z-10 text-white flex items-center justify-center h-full">{b.icon}</span>
              {active === b.key && <span className="absolute -inset-1 rounded-3xl ring-4 ring-primary/30" />}
            </button>
          ))}
        </div>

        {/* Grand container 2 colonnes */}
        <div className="rounded-3xl border border-primary/10 bg-white/90 backdrop-blur-sm shadow-md p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="text-center md:text-left">
                <div className="mx-auto mb-3 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold shadow">{(buttons.findIndex(b=>b.key===active)+1) || 1}</div>
                <h3 className="text-secondary text-2xl font-bold mb-2">{content.title}</h3>
              </div>
              <p className="text-gray-700 md:text-lg leading-relaxed">{content.text}</p>
            </div>
            <div>
              {content.visual}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllInOneSection;


