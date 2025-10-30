import React, { useCallback, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import useEmblaCarousel from "embla-carousel-react";
import { Users, Building2, Mail, ShieldCheck } from "lucide-react";

const WhyDataxxSection: React.FC = () => {
  const { t } = useLanguage();
  // New metric cards replacing previous 4 blocks
  const cards = [
    { value: "200k", label: "décideurs référencés", icon: <Users className="w-5 h-5" /> },
    { value: "100k", label: "entreprises référencées", icon: <Building2 className="w-5 h-5" /> },
    { value: "500k", label: "mails & téléphones", icon: <Mail className="w-5 h-5" /> },
    { value: "100%", label: "Conforme au RGPD", icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selected, setSelected] = useState(0);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);
  
  return (
    <>
    <section id="benefices-section" className="relative pt-20 md:pt-24 pb-0">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* Colonne gauche: texte + KPIs + CTA */}
          <div>
            <h2 className="text-secondary text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center md:text-left">{t('why.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-justify md:text-left">
              {t('why.description')}
            </p>
            {/* Chiffres sous le texte (style carte sur mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div className="p-4 rounded-2xl bg-white/80 ring-1 ring-gray-200 shadow-sm text-center sm:p-0 sm:bg-transparent sm:ring-0 sm:shadow-none sm:text-left">
                <div className="text-5xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">70%</div>
                <p className="text-slate-600 mt-2 leading-snug">{t('why.metric1')}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 ring-1 ring-gray-200 shadow-sm text-center sm:p-0 sm:bg-transparent sm:ring-0 sm:shadow-none sm:text-left">
                <div className="text-5xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">5×</div>
                <p className="text-slate-600 mt-2 leading-snug">{t('why.metric2')}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 ring-1 ring-gray-200 shadow-sm text-center sm:p-0 sm:bg-transparent sm:ring-0 sm:shadow-none sm:text-left">
                <div className="text-5xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">3&nbsp;min</div>
                <p className="text-slate-600 mt-2 leading-snug">{t('why.metric3')}</p>
              </div>
            </div>
            {/* CTA primaire (centré en mobile, gauche en desktop) */}
            <div className="mt-6 flex justify-center md:justify-start">
              <a href="/login" className="inline-flex items-center gap-2 rounded-[14px] px-7 py-3.5 bg-[#0b1220] text-white shadow-lg shadow-black/10 hover:shadow-black/20 transition">
                Se connecter
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          {/* Colonne droite: mobile carousel + desktop grid (aligné en bas sur desktop) */}
          <div className="md:self-end w-full">
            {/* Mobile carousel */}
            <div className="sm:hidden relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-2">
                  {cards.map((c, idx) => (
                    <div key={`${c.label}-${idx}`} className="min-w-0 shrink-0 grow-0 basis-full pl-2">
                      <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-5 text-center">
                        <div className="w-12 h-12 rounded-xl shadow-sm bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center mx-auto">
                          {c.icon}
                        </div>
                        {c.value && (
                          <div className="mt-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{c.value}</div>
                        )}
                        <div className="mt-2 text-gray-700 text-sm">{c.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                aria-label="Précédent"
                onClick={() => emblaApi && emblaApi.scrollPrev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 hover:bg-white text-secondary border border-gray-200 shadow z-10 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                aria-label="Suivant"
                onClick={() => emblaApi && emblaApi.scrollNext()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 hover:bg-white text-secondary border border-gray-200 shadow z-10 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              </button>
              <div className="mt-3 flex justify-center">
                <span className="text-xs font-medium text-primary px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  {selected + 1}/4
                </span>
              </div>
            </div>

            {/* Desktop grid unchanged */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cards.map((c, idx) => (
                <div key={`${c.label}-${idx}`} className="rounded-2xl border border-gray-200 shadow-sm bg-white p-5">
                  <div className="w-10 h-10 rounded-xl shadow-sm bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
                    {c.icon}
                  </div>
                  {c.value && (
                    <div className="mt-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{c.value}</div>
                  )}
                  <div className="mt-2 text-gray-700 text-sm">{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* (les chiffres sont désormais à gauche sous le texte) */}
        </div>
      </div>
    </section>
  </>
  );
};

export default WhyDataxxSection;


