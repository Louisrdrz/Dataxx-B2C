import fireIcon from "@/assets/fire.svg";
import arrowIcon from "@/assets/arrow-right.svg";
import ppYoutuber from "@/assets/pp-youtuber.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden bg-white">
      {/* Background Tunnel/Funnel */}
      <div className="absolute inset-0 -z-10">
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="tunnelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(268 83% 60% / 0.10)" />
              <stop offset="50%" stopColor="hsl(292 76% 60% / 0.08)" />
              <stop offset="100%" stopColor="hsl(270 100% 98% / 0.15)" />
            </linearGradient>
          </defs>
          
          {/* Tunnel Effect - Multiple curved paths */}
          <path
            d="M0,200 Q200,100 400,150 Q600,200 800,150 Q1000,100 1200,200 Q1300,250 1440,200 L1440,700 Q1300,650 1200,700 Q1000,750 800,700 Q600,650 400,700 Q200,750 0,700 Z"
            fill="url(#tunnelGradient)"
            className="animate-float"
          />
          
          <path
            d="M0,350 Q150,250 300,300 Q500,350 700,300 Q900,250 1100,300 Q1250,350 1440,300 L1440,800 Q1250,750 1100,800 Q900,850 700,800 Q500,750 300,800 Q150,850 0,800 Z"
            fill="hsl(270 100% 98% / 0.10)"
            className="animate-float"
            style={{ animationDelay: "2s" }}
          />
          
          <path
            d="M0,500 Q100,400 250,450 Q450,500 650,450 Q850,400 1050,450 Q1200,500 1440,450 L1440,900 L0,900 Z"
            fill="hsl(268 83% 60% / 0.05)"
            className="animate-float"
            style={{ animationDelay: "4s" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Top Banner */}
        <div className="flex items-center justify-center mb-12 animate-fade-in-up">
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <img src={fireIcon} alt="Fire" className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium text-secondary mr-3">
              10000+ Sponsors actifs
            </span>
            <span className="text-sm font-semibold text-primary mr-3">
              · Voir les sponsors
            </span>
            <img src={arrowIcon} alt="Arrow" className="w-4 h-4" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          La plateforme IA qui accélère<br />
          vos revenus sponsoring
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          Dataxx analyse le marché et identifie les<br />
          partenaires qui ont le plus de chances de collaborer avec vos talents
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
            Découvrir Dataxx
          </button>
          <button className="bg-white hover:bg-gray-50 text-secondary border-2 border-gray-200 hover:border-primary/20 font-semibold px-8 py-4 rounded-full transition-all duration-300 text-lg">
            Voir une démo
          </button>
        </div>

        {/* Espace réservé pour contenu suivant */}
      </div>
    </section>
  );
};

export default HeroSection;