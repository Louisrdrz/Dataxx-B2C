const SolutionSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-primary font-semibold mb-3">Notre solution</div>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Dataxx Sponsoring Intelligence
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
            Une plateforme IA de prospection sponsoring, boostée par des agents intelligents qui scannent en continu
            l’écosystème des entreprises pour fournir une vision complète et actionnable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h3 className="text-xl font-semibold text-secondary mb-3">Collecte et mise à jour continue</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Historique sponsoring: clubs, sports et événements déjà soutenus</li>
              <li>Signaux économiques: levées de fonds, M&A, appels d’offres, croissance sectorielle</li>
              <li>Image de marque: positionnement, notoriété, perception publique</li>
              <li>Engagements RSE: mixité, durabilité, inclusion, transition écologique</li>
              <li>Actualités récentes: annonces stratégiques, lancements produits, communication d’entreprise</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h3 className="text-xl font-semibold text-secondary mb-3">Analyse et recommandations IA</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Scoring de compatibilité club/entreprise selon critères business et affinitaires</li>
              <li>Priorisation des cibles à forte probabilité de signature</li>
              <li>Enrichissement automatique des contacts clés</li>
              <li>Pipeline de prospection intégré: suivi des discussions et relances</li>
              <li>Dashboards stratégiques: potentiel par secteur et par territoire</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;


