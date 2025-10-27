import logo from "@/assets/logo.png";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="text-white bg-[#0b1220]">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        {/* Top row */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Slogan */}
          <div className="md:col-span-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-extrabold leading-snug text-white">
              {t('footer.title')}
            </h3>
          </div>

          {/* spacer hidden on mobile */}
          <div className="hidden md:block" />

          {/* Adresse */}
          <div className="md:col-span-1 text-center md:text-right">
            <h4 className="text-base md:text-lg font-semibold mb-1">{t('footer.address')}</h4>
            <p className="text-gray-300 text-sm">4 Impasse Reille, 75014, Paris</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 pt-6" />

        {/* Bottom row: stacked on mobile, refined layout on desktop */}
        <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <img src={logo} alt="Dataxx" className="h-7 w-7 object-contain" />
            <span className="text-gray-300 text-sm">© 2025 Dataxx. {t('footer.rights')}</span>
          </div>
          <div className="text-center md:flex md:items-center md:gap-4">
            <a href="mailto:contact@dataxx.fr" className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white text-[#0b1220] text-sm font-semibold shadow hover:shadow-md transition md:px-5 md:py-2.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              contact@dataxx.fr
            </a>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 md:mt-0">
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 text-white border border-white/30 flex items-center justify-center hover:bg-white hover:text-[#111827] transition">
                <svg className="w-4 h-4 md:w-4.5 md:h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.83v2.11h.05c.53-1 1.83-2.11 3.77-2.11 4.03 0 4.77 2.65 4.77 6.1V24h-3.99v-7.4c0-1.77-.03-4.05-2.47-4.05-2.47 0-2.85 1.93-2.85 3.93V24H8V8.5z"/></svg>
              </a>
              <a href="mailto:contact@dataxx.fr" aria-label="Email" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 text-white border border-white/30 flex items-center justify-center hover:bg-white hover:text-[#111827] transition">
                <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>
          <div className="text-center md:text-right">
            <a href="/mentions-legales" className="text-gray-300 hover:text-white underline text-sm">{t('footer.legal')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;