// OLD: import fireIcon from "@/assets/fire.svg";
const fireIcon = "/fire.svg";
// OLD: import arrowIcon from "@/assets/arrow-right.svg";
const arrowIcon = "/arrow-right.svg";
// OLD: import ppYoutuber from "@/assets/pp-youtuber.png";
const ppYoutuber = "/pp-youtuber.png";

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
        {/* Badge style ancien site */}
        <div className="flex items-center justify-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 text-purple-700 shadow-sm">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-yellow-900 text-xs">★</span>
            <span className="text-sm font-semibold">Plateforme propulsée par l'IA</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          La Plateforme IA qui réinvente<br />
          le sponsoring sportif
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          Dataxx aide les sportifs à identifier,<br />
          qualifier et signer plus de sponsors grâce à l'IA
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <button className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-purple-600 to-fuchsia-500">
            Découvrir Dataxx
          </button>
          <button className="px-8 py-4 rounded-full text-secondary font-semibold text-lg border border-gray-300/80 bg-white/70 backdrop-blur hover:bg-white transition-all">
            Voir une démo
          </button>
        </div>

        {/* Espace réservé pour contenu suivant */}
      </div>
    </section>
  );
};

export default HeroSection;