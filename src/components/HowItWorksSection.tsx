// Fonctionnalités clés Dataxx

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-primary font-semibold mb-4">Fonctionnalités clés</div>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Intelligence sponsoring boostée par des agents IA
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="text-center relative">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Cartographie intelligente des entreprises
            </h3>
            <p className="text-muted-foreground">
              Locale, nationale et internationale. Filtres sectoriels, affinitaires et territoriaux.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center relative">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Fiches détaillées enrichies par IA
            </h3>
            <p className="text-muted-foreground">
              CA, effectifs, historique sponsoring, signaux business, actualités, contacts décisionnaires.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center relative">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Scoring IA et pipeline de prospection
            </h3>
            <p className="text-muted-foreground">
              Compatibilité club/entreprise, priorisation, relances, suivi des discussions et dashboards.
            </p>
          </div>
        </div>

        {/* Connecting lines for desktop */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-32">
          <svg width="600" height="2" className="text-gray-300">
            <line x1="0" y1="1" x2="600" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="10,5" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;