import { motion } from "framer-motion";

export default function DataxxSlices() {
  return (
    <>
      {/* Rencontrez nos fondateurs */}
      <section
        id="equipe"
        className="py-8 sm:py-12 relative overflow-hidden bg-transparent scroll-mt-28"
      >
        {/* Fond unifié par le body — pas de calque local */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Rencontrez nos fondateurs
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-light max-w-2xl mx-auto">
              L'équipe derrière Dataxx, combinant expertise en IA, opérations et technologie
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Clément Authier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center flex flex-col h-full"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                  <img
                    src="/src/assets/clem.jpeg"
                    alt="Clément Authier"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    CEO
                  </span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">Clément Authier</h3>
              <p className="text-purple-600 font-semibold mb-4 text-base sm:text-lg">CEO & Co-founder</p>
              <div className="mt-auto">
                <a
                  href="https://www.linkedin.com/in/cl%C3%A9ment-authier-3a8a75206/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 hover:bg-purple-200 rounded-full text-purple-600 hover:text-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Martin Masseline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center flex flex-col h-full"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                  <img
                    src="/src/assets/martin.jpeg"
                    alt="Martin Masseline"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    CPO
                  </span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">Martin Masseline</h3>
              <p className="text-blue-600 font-semibold mb-4 text-base sm:text-lg">CPO & Co-founder</p>
              <div className="mt-auto">
                <a
                  href="https://www.linkedin.com/in/martin-masseline-5282a01ba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Louis Rodriguez */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center flex flex-col h-full"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                  <img
                    src="/src/assets/louis.jpeg"
                    alt="Louis Rodriguez"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pink-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    CTO
                  </span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">Louis Rodriguez</h3>
              <p className="text-pink-600 font-semibold mb-4 text-base sm:text-lg">CTO & Co-founder</p>
              <div className="mt-auto">
                <a
                  href="https://www.linkedin.com/in/louis-rodriguez1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 hover:bg-pink-200 rounded-full text-pink-600 hover:text-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pour les Clubs. Par les Supporters */}
      <section className="py-0 overflow-hidden bg-gradient-to-b from-violet-50/20 via-white to-blue-50/15">
        <div className="relative py-12 sm:py-20">
          <div
            className="flex items-center whitespace-nowrap animate-scroll-text"
            style={{ animation: "scroll-text 18s linear infinite" }}
          >
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="text-2xl sm:text-4xl md:text-5xl font-bold mx-8 sm:mx-16 tracking-tight flex items-center"
              >
                <span className="text-slate-900">Pour les</span>
                <span className="mx-2"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">Clubs.</span>
                <span className="ml-4 sm:ml-8 text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800">
                  Par les Supporters
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

  {/* Logos défilants (sens inverse) */}
  <section className="py-0 overflow-hidden bg-transparent">
    <div className="relative py-8 sm:py-12">
      {(() => {
        // Récupère toutes les images dans assets et assets/logos
        const all = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,svg,webp}", { eager: true, as: "url" }) as Record<string, string>;

        // Normalisation insensible à la casse/diacritiques et aux séparateurs
        const norm = (s: string) =>
          s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");
        const getBase = (p: string) => {
          const file = p.split("/").pop() || "";
          return file.replace(/\.(png|jpe?g|svg|webp)$/i, "");
        };

        const wantedRaw = [
          "HEC_Paris",
          "CloudforStartups",
          "logo-french-tech",
          "Logo_Stade_Rennais_FC",
          "logo-polytechnique",
        ];
        const wanted = wantedRaw.map(norm);

        // Sélectionne les logos correspondants aux basenames attendus
        const entries = Object.entries(all);
        const found: string[] = [];
        entries.forEach(([path, url]) => {
          const nbase = norm(getBase(path));
          if (wanted.some((w) => nbase.includes(w) || w.includes(nbase))) {
            found.push(url);
          }
        });

        // Nettoyage: retirer explicitement certains fichiers non désirés
        const blacklist = ["/rs.jpg", "/logo.png"]; // chemins partiels à exclure
        const items = found.length
          ? Array.from(new Set(found)).filter((url) => !blacklist.some((b) => url.toLowerCase().includes(b)))
          : [];
        // Ajoute un espace large entre les répétitions pour éviter de voir deux fois le même logo simultanément
        const renderItems = ([...items, null, ...items]) as Array<string | null>;
        return (
          <div
            className="flex items-center whitespace-nowrap animate-scroll-logos-reverse"
            style={{ animation: "scroll-logos-reverse 30s linear infinite" }}
          >
            {renderItems.map((src, i) => (
              src ? (
                <img
                  key={`logo-${i}`}
                  src={src}
                  alt="logo partenaire"
                  className="h-[56px] sm:h-[64px] md:h-[72px] w-auto mx-12 sm:mx-16 object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              ) : (
                <span key={`gap-${i}`} className="inline-block w-[100vw]" />
              )
            ))}
          </div>
        );
      })()}
    </div>
  </section>

      {/* Keyframes nécessaires */}
      <style>
        {`
          @keyframes scroll-logos {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-logos-reverse {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          @keyframes scroll-text {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>

      {/* Section Google Start Program retirée à la demande (footer conservé ailleurs) */}
    </>
  );
}


