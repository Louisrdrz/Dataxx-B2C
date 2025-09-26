import { Button } from "@/components/ui/button";
import fireIcon from "@/assets/fire.svg";
import arrowIcon from "@/assets/arrow-right.svg";
import ppYoutuber from "@/assets/pp-youtuber.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Curves */}
      <div className="absolute inset-0 -z-10">
        <svg
          viewBox="0 0 1200 800"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0 100% 60% / 0.1)" />
              <stop offset="100%" stopColor="hsl(340 100% 85% / 0.2)" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z"
            fill="url(#curveGradient)"
            className="animate-float"
          />
          <path
            d="M0,600 Q400,400 800,600 T1200,600 L1200,800 L0,800 Z"
            fill="hsl(340 100% 85% / 0.15)"
            className="animate-float"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Top Banner */}
        <div className="flex items-center justify-center mb-8 animate-fade-in-up">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 hover-lift">
            <img src={fireIcon} alt="Fire" className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium text-secondary mr-2">
              10000+ Sponsors actifs
            </span>
            <span className="text-sm font-bold text-primary mr-2">
              · Voir les sponsors
            </span>
            <img src={arrowIcon} alt="Arrow" className="w-4 h-4" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Trouvez des sponsors prêts<br />
          <span className="text-gradient">à investir dans vos talents</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          MeetSponsors analyse tout le marché YouTube et trouve les sponsors qui ont le plus de chances de collaborer avec vos talents
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Button className="btn-meetsponsors text-lg px-8 py-4 h-auto">
            Trouvez des sponsors
          </Button>
          <Button className="btn-secondary text-lg px-8 py-4 h-auto">
            Voir une démo
          </Button>
        </div>

        {/* YouTube Channel Card */}
        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="youtube-card max-w-sm hover-lift">
            <div className="flex items-center mb-4">
              <img 
                src={ppYoutuber} 
                alt="Ma chaîne YouTube" 
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="text-left">
                <h3 className="font-semibold text-secondary">Ma chaîne YouTube</h3>
                <p className="text-muted-foreground text-sm">24000 abonnés</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Gaming</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Lifestyle</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Tech</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;