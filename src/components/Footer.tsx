const Footer = () => {
  return (
    <footer className="text-white bg-gradient-to-b from-[hsl(268_83%_22%)] to-[hsl(268_83%_18%)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Bloc slogan + CTA */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-extrabold leading-snug mb-6 text-white">
              Nous réinventons le sponsoring
              <br />
              sportif grâce à l’IA.
            </h3>
            <button className="meetsponsors-gradient text-white font-semibold px-6 py-3 rounded-full shadow-lg">
              Prendre rendez-vous
            </button>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contactez-nous :</h4>
            <p className="text-gray-300">
              Email : <a href="mailto:contact@dataxx.fr" className="underline hover:text-white">contact@dataxx.fr</a>
            </p>
            <div className="flex items-center gap-3 mt-4">
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white text-[#111827] flex items-center justify-center hover:opacity-90 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.83v2.11h.05c.53-1 1.83-2.11 3.77-2.11 4.03 0 4.77 2.65 4.77 6.1V24h-3.99v-7.4c0-1.77-.03-4.05-2.47-4.05-2.47 0-2.85 1.93-2.85 3.93V24H8V8.5z"/>
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:contact@dataxx.fr" aria-label="Email" className="w-9 h-9 rounded-full bg-white text-[#111827] flex items-center justify-center hover:opacity-90 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white text-[#111827] flex items-center justify-center hover:opacity-90 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM17.5 6a1 1 0 100 2 1 1 0 000-2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Adresse :</h4>
            <ul className="text-gray-300 space-y-2">
              <li>4 Impasse Reille</li>
              <li>75014 Paris</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="Dataxx" className="h-8 w-8 object-contain" />
            <span className="text-gray-300">© 2025 Dataxx. Tous droits réservés.</span>
          </div>
          <div className="hidden md:flex items-center gap-3"></div>
          <a href="#" className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(268_83%_60%)] to-[hsl(268_83%_70%)] text-white px-5 py-3 rounded-full shadow-lg">
            Réserver une Démo
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;