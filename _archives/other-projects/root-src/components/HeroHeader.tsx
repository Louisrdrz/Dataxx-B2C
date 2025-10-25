import { motion } from "framer-motion";

type HeroHeaderProps = {
  badge?: string;
  titleTarget?: string;
  titleBetter?: string;
  titleActivate?: string;
  titleMore1?: string;
  titleEarn?: string;
  titleMore2?: string;
  subtitle?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryClick?: () => void;
  secondaryHref?: string;
};

export default function HeroHeader({
  badge = "Texte badge",
  titleTarget = "Titre A",
  titleBetter = "accentué.",
  titleActivate = "Titre B",
  titleMore1 = "accentué.",
  titleEarn = "Titre C",
  titleMore2 = "accentué.",
  subtitle = "Sous-titre.",
  description = "Paragraphe descriptif.",
  primaryCta = "CTA principal",
  secondaryCta = "CTA secondaire",
  onPrimaryClick,
  secondaryHref = "#",
}: HeroHeaderProps) {
  return (
    <>
    <section className="pt-12 sm:pt-16 md:pt-32 pb-6 sm:pb-8 px-4 sm:px-6 relative overflow-hidden bg-transparent">
      {/* Halo subtil en fond */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/20 via-transparent to-transparent"></div>
      {/* Blobs animés élégants */}
      <div className="pointer-events-none absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-fuchsia-400/30 via-purple-400/20 to-transparent blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-400/25 via-sky-400/20 to-transparent blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[260px] rounded-[999px] bg-gradient-to-t from-rose-300/20 to-transparent blur-2xl animate-fadeIn" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-6xl mx-auto mb-6 sm:mb-10 md:mb-16">
          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight"
          >
            <span className="inline-block mr-3 text-slate-900">{titleTarget}</span>
            {titleBetter && (
              <span className="inline-block mr-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">
                {titleBetter}
              </span>
            )}
            <span className="inline-block mr-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800">
                {titleActivate}
              </span>
            </span>
            {titleMore1 && (
              <span className="inline-block mr-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">
                {titleMore1}
              </span>
            )}
            <br className="hidden md:block" />
            <span className="inline-block text-slate-900">{titleEarn}</span>
            <span className="inline-block ml-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800">
              {titleMore2}
            </span>
          </motion.h1>

          {/* Sous-titre */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-700 font-medium mb-3 sm:mb-4 md:mb-6 leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto font-light px-4"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <button
              onClick={onPrimaryClick ?? (() => { window.location.href = "/demo"; })}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 font-medium border-0 rounded-md w-full sm:w-auto inline-flex items-center justify-center"
            >
              {primaryCta}
              <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </button>

            <a
              href={secondaryHref}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 font-medium bg-white rounded-md w-full sm:w-auto inline-flex items-center justify-center"
            >
              {secondaryCta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
    <style>{`
      @keyframes blob {
        0%, 100% { transform: translate3d(0,0,0) scale(1); }
        33% { transform: translate3d(30px,-20px,0) scale(1.05); }
        66% { transform: translate3d(-20px,20px,0) scale(0.98); }
      }
      .animate-blob { animation: blob 18s ease-in-out infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      @keyframes fadeInSoft { from { opacity: 0; } to { opacity: 1; } }
      .animate-fadeIn { animation: fadeInSoft 1.4s ease-in forwards; }
    `}</style>
  </>
  );
}


