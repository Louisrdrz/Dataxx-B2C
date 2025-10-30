const bullets = [
  {
    title: "Toute l’information centralisée",
    desc:
      "Fini les outils dispersés et les recherches manuelles interminables : tout est regroupé dans une plateforme unique.",
  },
  {
    title: "Gains de productivité massifs",
    desc: "Des semaines de prospection et de veille réduites à quelques clics grâce à l’IA.",
  },
  {
    title: "Automatisation des tâches chronophages",
    desc: "Identification des contacts, enrichissement des données, rédaction des emails… l’IA s’occupe du répétitif.",
  },
  {
    title: "Ciblage intelligent et efficace",
    desc: "Priorisez les entreprises réellement capables et prêtes à sponsoriser, selon vos critères business et vos valeurs.",
  },
  {
    title: "Accélération des revenus sponsoring",
    desc: "Identifiez des sponsors encore non sollicités mais parfaitement alignés avec votre club.",
  },
  {
    title: "Argumentaire renforcé",
    desc: "Accédez à des données précises (CA, RSE, historique sponsoring, signaux business) pour convaincre plus vite.",
  },
  {
    title: "Plus de sponsors, plus vite",
    desc: "Augmentez considérablement votre pipeline de partenaires et maximisez vos chances de signature.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,hsl(268_83%_60%_/_0.14),transparent_60%)]" />
      <div className="max-w-7xl mx-auto">
        {/* En-tête homogène */}
        <div className="text-center mb-14">
          <div className="text-primary tracking-widest text-sm font-semibold mb-4 uppercase">Bénéfices</div>
          <h2 className="text-secondary text-4xl md:text-6xl font-extrabold leading-tight">
            Ce que Dataxx vous apporte concrètement
          </h2>
        </div>

        {/* Cartes de bénéfices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {bullets.map((b, i) => (
            <div key={i} className="group relative rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-inner">
                {/* star icon */}
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent group-hover:ring-primary/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;