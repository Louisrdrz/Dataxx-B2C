const BenefitsSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-primary font-semibold mb-4">Bénéfices</div>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Plus de sponsors que de places dans vos vidéos
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            De la recherche à la prospection, MeetSponsors vous guide à chaque étape et vous permet de cibler les sponsors les plus pertinents, sans effort inutile
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Trouvez les sponsors parfaits pour votre niche
            </h3>
            <p className="text-muted-foreground">
              Utilisez nos outils de recherche avancée pour trouver rapidement des sponsors dans votre niche. Filtrez par langue, secteur, audience et bien plus encore.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h1v-1a3 3 0 016 0v1h4v-3a7 7 0 00-14 0v3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Soyez informé des nouvelles opportunités de sponsoring
            </h3>
            <p className="text-muted-foreground">
              Recevez des alertes par mail dès qu'une nouvelle marque entre sur le marché du sponsoring dans votre niche. Soyez parmi les premiers à sécuriser ces opportunités.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Ciblez les marques qui ont déjà travaillé avec vos concurrents
            </h3>
            <p className="text-muted-foreground">
              Identifiez les marques qui sponsorisent des YouTubers similaires et maximisez vos chances de collaboration en les ciblant directement.
            </p>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Chaque semaine, recevez les sponsors les plus pertinents pour vos talents
            </h3>
            <p className="text-muted-foreground">
              Notre algorithme analyse en continu le marché et sélectionne les 5 sponsors ayant le plus de chances de collaborer avec vos YouTubeurs.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Contactez directement les décideurs clés
            </h3>
            <p className="text-muted-foreground">
              Accédez aux contacts clés des marques, éliminez les intermédiaires et négocier directement avec les bonnes personnes.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-4">
              Ciblez les sponsors les plus actifs
            </h3>
            <p className="text-muted-foreground">
              Identifiez facilement les marques actives dans le sponsoring YouTube, et concentrez vos efforts là où les opportunités sont réelles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;