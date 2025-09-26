import { Button } from "@/components/ui/button";
import checkTick from "@/assets/check-tick.svg";

const ProblemSection = () => {
  const withoutDataxx = [
    "Les clubs sportifs manquent de temps et d’outils pour identifier les bons sponsors.",
    "La recherche repose souvent sur le réseau ou sur des fichiers incomplets, pas sur de la donnée riche et mise à jour.",
    "Les sponsors veulent des partenariats alignés avec leurs valeurs et leur stratégie (RSE, innovation, ancrage territorial), mais les clubs ne disposent pas d’assez d’informations pour argumenter efficacement."
  ];

  const withDataxx = [
    {
      title: "Historique sponsoring consolidé",
      description: "Clubs, sports ou événements déjà soutenus."
    },
    {
      title: "Signaux économiques",
      description: "Levées de fonds, fusions/acquisitions, appels d’offres gagnés, croissance sectorielle."
    },
    {
      title: "Image de marque",
      description: "Positionnement, notoriété, perception publique."
    },
    {
      title: "Engagements RSE",
      description: "Mixité, durabilité, inclusion, transition écologique."
    },
    {
      title: "Actualités récentes",
      description: "Annonces stratégiques, lancement de produits, communication d’entreprise."
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <img src={checkTick} alt="Check" className="w-6 h-6 mr-2" />
            <span className="text-primary font-semibold">Sponsors trouvés</span>
          </div>
          <div className="text-2xl font-bold text-secondary mb-4">
            10000+ <span className="text-primary">Sponsors</span> actifs disponibles
          </div>
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg inline-block font-semibold">
            Problème que l’on résout
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Trop de temps perdu à chercher des sponsors ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fini la prospection au hasard. Accédez directement aux sponsors qui ont le plus de chances de collaborer avec vous.
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Without Dataxx */}
          <div className="bg-red-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-lg font-semibold text-red-600 mb-2">Sans</div>
              <div className="text-2xl font-bold text-primary">Dataxx</div>
            </div>
            <ul className="space-y-4">
              {withoutDataxx.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-red-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With Dataxx */}
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-lg font-semibold text-green-600 mb-2">Avec</div>
              <div className="text-2xl font-bold text-primary">Dataxx</div>
            </div>
            <ul className="space-y-6">
              {withDataxx.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">{item.title}</h4>
                    <p className="text-green-700 text-sm">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;