import stadeRennais from "@/assets/Logo_Stade_Rennais_FC.svg.png";
import { useLanguage } from "@/hooks/useLanguage";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const TrustedBySection = () => {
  const { t, language } = useLanguage();
  const partners = [
    {
      src: stadeRennais,
      name: t('trust.club.rennais.name'),
      league: t('trust.club.rennais.league'),
      alt: "Stade Rennais F.C.",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  
  return (
    <>
    <section id="partenariat" className="pt-12 sm:pt-16 pb-0 px-0 relative scroll-mt-28">
      <div className="relative w-full">
        {/* Tag title only */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-primary tracking-widest text-sm sm:text-base md:text-lg font-semibold uppercase">
            {language === 'fr' ? 'Nos partenaires' : 'Our partners'}
          </div>
        </div>

        {/* Bandeau violet en fond */}
        <div className="w-full rounded-none overflow-hidden shadow-2xl">
          <div className="bg-[#0b1220] px-4 sm:px-8 py-6 sm:py-10">
            {/* Mobile-only carousel */}
            <div className="sm:hidden relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y select-none -ml-2">
                  {partners.map((p) => (
                    <div key={p.alt} className="min-w-0 shrink-0 grow-0 basis-full pl-2">
                      <div className="flex flex-col items-center justify-center py-6">
                        <img src={p.src} alt={p.alt} className="h-28 xs:h-32 object-contain drop-shadow" />
                        <div className="mt-4 text-center">
                          <p className="text-base font-semibold text-white">{p.name}</p>
                          <p className="text-xs text-white/70">{p.league}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Arrows (discrètes mais visibles) */}
              <button
                aria-label="Précédent"
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur border border-white/20 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                aria-label="Suivant"
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur border border-white/20 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Desktop/tablet static layout (unchanged) */}
            <div className="hidden sm:flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12">
          {/* Stade Rennais */}
          <div className="group flex flex-col items-center">
            <img 
              src={stadeRennais} 
              alt="Stade Rennais F.C." 
              className="h-14 sm:h-20 md:h-24 object-contain transition-all duration-300 group-hover:scale-105" 
            />
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-white">{t('trust.club.rennais.name')}</p>
                <p className="text-xs text-white/70">{t('trust.club.rennais.league')}</p>
            </div>
          </div>

            {/* autres logos retirés */}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default TrustedBySection;


