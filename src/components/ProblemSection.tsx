import { Button } from "@/components/ui/button";
import checkTick from "@/assets/check-tick.svg";

const ProblemSection = () => {
  const withoutMeetSponsors = [
    "Perdre du temps avec des recherches manuelles",
    "Trop de vidéos non sponsorisées = opportunités manquées",
    "Passer du temps avec des sponsors qui ne sont pas intéressés",
    "Difficulté à trouver des opportunités immédiates de sponsoring",
    "Perdre des heures à chercher des contacts de marques sur Internet.",
    "Chercher des bases de données de sponsors saturées",
    "Manque de visibilité sur le marché du sponsoring YouTube",
    "Envoyer des emails de masse, en espérant des réponses.",
    "Attendre passivement que les sponsors vous contactent"
  ];

  const withMeetSponsors = [
    {
      title: "Accédez à tout le marché du sponsoring YouTube à jour",
      description: "Consultez toutes les marques, collaborations et opportunités en un seul endroit."
    },
    {
      title: "Recherche rapide et efficace",
      description: "Trouvez des sponsors pertinents en quelques clics grâce à des filtres avancés."
    },
    {
      title: "Recommandations personnalisées",
      description: "Recevez des marques prêtes à collaborer, adaptées spécifiquement à vos talents."
    },
    {
      title: "Alertes par mail",
      description: "Soyez informé des nouvelles opportunités en temps réel"
    },
    {
      title: "Obtenez les contacts des décideurs en 1 clic",
      description: "Fini les recherches interminables, tout est à portée de main"
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
            PROBLEME
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
          {/* Without MeetSponsors */}
          <div className="bg-red-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-lg font-semibold text-red-600 mb-2">Sans</div>
              <div className="text-2xl font-bold text-primary">meetsponsors</div>
            </div>
            <ul className="space-y-4">
              {withoutMeetSponsors.map((item, index) => (
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

          {/* With MeetSponsors */}
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-lg font-semibold text-green-600 mb-2">Avec</div>
              <div className="text-2xl font-bold text-primary">meetsponsors</div>
            </div>
            <ul className="space-y-6">
              {withMeetSponsors.map((item, index) => (
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