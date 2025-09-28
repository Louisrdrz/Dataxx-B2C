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
    <section className="pt-16 sm:pt-32 pb-8 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-violet-50/20 via-white to-blue-50/15">
      {/* Halo subtil en fond */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/20 via-transparent to-transparent"></div>
      {/* Blobs animés élégants */}
      <div className="pointer-events-none absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-fuchsia-400/30 via-purple-400/20 to-transparent blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-indigo-400/25 via-sky-400/20 to-transparent blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[260px] rounded-[999px] bg-gradient-to-t from-rose-300/20 to-transparent blur-2xl animate-fadeIn" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-6xl mx-auto mb-16 sm:mb-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-full text-sm font-medium mb-6 sm:mb-8 border border-slate-200/50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zm11 2l1.2 2.4L19.6 9 17.2 9.6 16 12l-1.2-2.4L12.4 9l2.4-1.6L16 3zM21 14l.8 1.6L23 17l-1.2.4L21 19l-.8-1.6L18 17l1.2-1.4L21 14z" />
            </svg>
            <span className="tracking-wide">{badge}</span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 sm:mb-8 leading-[1.1] tracking-tight"
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
            <br className="hidden sm:block" />
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
              className="text-lg sm:text-xl md:text-2xl text-slate-700 font-medium mb-4 sm:mb-6 leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto font-light"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={onPrimaryClick}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 font-medium border-0 rounded-md w-full sm:w-auto inline-flex items-center justify-center"
            >
              {primaryCta}
              <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </button>

            <a
              href={secondaryHref}
              className="px-6 sm:px-8 py-3 sm:py-4 text-base border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 font-medium bg-white rounded-md w-full sm:w-auto inline-flex items-center justify-center"
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


