const Footer = () => {
  return (
    <footer className="text-white bg-gradient-to-b from-[hsl(268_83%_22%)] to-[hsl(268_83%_18%)]">
      <div className="max-w-7xl mx-auto px-6 py-5 md:py-6">
        {/* Top row compact */}
        <div className="grid md:grid-cols-3 gap-4 items-start">
          {/* Slogan */}
          <div className="md:col-span-1">
            <h3 className="text-lg md:text-xl font-extrabold leading-snug text-white">
              Nous réinventons le sponsoring sportif grâce à l’IA.
            </h3>
          </div>

          {/* Espace milieu vide pour aérer */}
          <div />

          {/* Adresse en haut à droite (plus compacte) */}
          <div className="md:col-span-1 md:text-right">
            <h4 className="text-base md:text-lg font-semibold mb-1">Adresse</h4>
            <p className="text-gray-300 text-sm">4 Impasse Reille, 75014, Paris</p>
          </div>
        </div>

        {/* Bottom row: contact centré + mentions à droite + copyright à gauche */}
        <div className="border-t border-white/10 mt-4 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo.png" alt="Dataxx" className="h-7 w-7 object-contain" />
            <span className="text-gray-300 text-sm">© 2025 Dataxx. Tous droits réservés.</span>
          </div>
          <div className="text-center flex-1">
            <a href="mailto:contact@dataxx.fr" className="underline hover:text-white text-gray-300 text-sm">contact@dataxx.fr</a>
            <div className="flex items-center justify-center gap-3 mt-2">
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white text-[#111827] flex items-center justify-center hover:opacity-90 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.83v2.11h.05c.53-1 1.83-2.11 3.77-2.11 4.03 0 4.77 2.65 4.77 6.1V24h-3.99v-7.4c0-1.77-.03-4.05-2.47-4.05-2.47 0-2.85 1.93-2.85 3.93V24H8V8.5z"/></svg>
              </a>
              <a href="mailto:contact@dataxx.fr" aria-label="Email" className="w-8 h-8 rounded-full bg-white text-[#111827] flex items-center justify-center hover:opacity-90 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>
          <div className="text-right w-40">
            <a href="/mentions-legales" className="text-gray-300 hover:text-white underline text-sm">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;