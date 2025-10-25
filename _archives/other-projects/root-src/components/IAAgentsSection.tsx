import React from "react";

const Feature = ({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-secondary font-semibold mb-1">{title}</div>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const IAAgentsSection = () => {
  return (
    <section id="ia-agents" className="py-12 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight mb-4">
            Nos agents de veille IA
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            <span className="mr-2">👉</span>
            Une veille automatisée et enrichie en temps réel pour ne manquer aucune opportunité de sponsoring.
          </p>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 items-center">
          {/* Animated visual */}
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto w-full max-w-5xl h-[420px] rounded-3xl border border-gray-200 bg-white/80 shadow-lg overflow-hidden">
              <svg viewBox="0 0 720 360" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="flow" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(268 83% 60%)" />
                    <stop offset="100%" stopColor="hsl(292 76% 60%)" />
                  </linearGradient>
                </defs>
                {/* paths from agents to hub */}
                <path id="p1" d="M120 60 C 240 60 260 120 360 180" fill="none" stroke="url(#flow)" strokeWidth="2" opacity="0.35" />
                <path id="p2" d="M120 300 C 240 300 260 240 360 180" fill="none" stroke="url(#flow)" strokeWidth="2" opacity="0.35" />
                <path id="p3" d="M620 80 C 520 120 460 140 360 180" fill="none" stroke="url(#flow)" strokeWidth="2" opacity="0.35" />
                <path id="p4" d="M620 300 C 520 260 460 220 360 180" fill="none" stroke="url(#flow)" strokeWidth="2" opacity="0.35" />
                <path id="p5" d="M80 180 C 220 180 260 180 360 180" fill="none" stroke="url(#flow)" strokeWidth="2" opacity="0.35" />

                {/* moving dots along paths */}
                <circle r="5" fill="url(#flow)">
                  <animateMotion dur="3.5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" path="M120 60 C 240 60 260 120 360 180" />
                </circle>
                <circle r="5" fill="url(#flow)">
                  <animateMotion dur="3.5s" begin="0.4s" repeatCount="indefinite" path="M120 300 C 240 300 260 240 360 180" />
                </circle>
                <circle r="5" fill="url(#flow)">
                  <animateMotion dur="3.8s" begin="0.8s" repeatCount="indefinite" path="M620 80 C 520 120 460 140 360 180" />
                </circle>
                <circle r="5" fill="url(#flow)">
                  <animateMotion dur="3.2s" begin="0.6s" repeatCount="indefinite" path="M620 300 C 520 260 460 220 360 180" />
                </circle>
                <circle r="5" fill="url(#flow)">
                  <animateMotion dur="3.4s" begin="0.2s" repeatCount="indefinite" path="M80 180 C 220 180 260 180 360 180" />
                </circle>
              </svg>

              {/* agents chips */}
              {/* Left - Top: Historique sponsoring */}
              <div className="absolute left-[48px] top-[36px] w-[320px] flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">🏆</div>
                  <span className="text-slate-800 text-sm font-semibold">Historique sponsoring</span>
                </div>
                <div className="mt-3 w-full rounded-lg bg-white/95 border border-gray-200 shadow p-3 text-xs text-slate-600">
                  Clubs, sports ou événements déjà soutenus, type de partenariat, date.
                </div>
              </div>
              {/* Left - Middle: Actualités */}
              <div className="absolute left-[48px] top-[180px] w-[320px] flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 text-white flex items-center justify-center">📰</div>
                  <span className="text-slate-800 text-sm font-semibold">Actualités récentes</span>
                </div>
                <div className="mt-3 w-full rounded-lg bg-white/95 border border-gray-200 shadow p-3 text-xs text-slate-600">
                  Annonces stratégiques, lancements de produits, communication d’entreprise.
                </div>
              </div>
              {/* Left - Bottom: Signaux éco */}
              <div className="absolute left-[48px] bottom-[36px] w-[320px] flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 text-white flex items-center justify-center">€</div>
                  <span className="text-slate-800 text-sm font-semibold">Signaux économiques</span>
                </div>
                <div className="mt-3 w-full rounded-lg bg-white/95 border border-gray-200 shadow p-3 text-xs text-slate-600">
                  Levées de fonds, fusions/acquisitions, appels d’offres gagnés, croissance sectorielle.
                </div>
              </div>
              {/* Right - Top: RSE */}
              <div className="absolute right-[48px] top-[60px] w-[320px] flex flex-col items-end text-right">
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 text-sm font-semibold">Engagements RSE</span>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 text-white flex items-center justify-center">🌱</div>
                </div>
                <div className="mt-3 w-full rounded-lg bg-white/95 border border-gray-200 shadow p-3 text-xs text-slate-600">
                  Mixité, durabilité, inclusion, transition écologique.
                </div>
              </div>
              {/* Right - Bottom: Image de marque */}
              <div className="absolute right-[48px] bottom-[60px] w-[320px] flex flex-col items-end text-right">
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 text-sm font-semibold">Image de marque</span>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-white flex items-center justify-center">★</div>
                </div>
                <div className="mt-3 w-full rounded-lg bg-white/95 border border-gray-200 shadow p-3 text-xs text-slate-600">
                  Positionnement, notoriété, perception publique.
                </div>
              </div>

              {/* Identity card (hub) – version pro/épurée */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[120px] rounded-2xl bg-white/95 border border-gray-200 shadow-md"></div>
            </div>
          </div>

          {/* Feature list removed temporarily to focus on animation */}
        </div>
      </div>
    </section>
  );
};

export default IAAgentsSection;


