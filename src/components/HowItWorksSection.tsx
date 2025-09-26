import squeezie from "@/assets/squeezie.jpg";

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-primary font-semibold mb-4">Comment ça marche</div>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Trouver des nouveaux sponsors n'a jamais été aussi simple
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="text-center relative">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Recherchez des sponsors dans votre niche
            </h3>
            <p className="text-muted-foreground">
              Définisez votre niche avec les filtres avancés et recevez des sponsors sur mesue qui fit avec votre contenu.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center relative">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
                <img 
                  src={squeezie} 
                  alt="Squeezie" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Analysez les collaborations de vos concurrents
            </h3>
            <p className="text-muted-foreground">
              Découvrez quelles marques sponsorisent des créateurs similaires à vous et identifiez de nouvelles opportunités.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center relative">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Contactez directement les bons interlocuteurs
            </h3>
            <p className="text-muted-foreground">
              Obtenez les contacts des décideurs en 1 clic et lancez votre prospection avec les bonnes personnes.
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