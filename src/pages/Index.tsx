import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HeroHeader from "@/components/HeroHeader";
// import YouTuberCarousel from "@/components/YouTuberCarousel";
// Section Problème retirée
import HowItWorksSection from "@/components/HowItWorksSection";
// Sections supprimées de la structure demandée
import PositioningSection from "@/components/PositioningSection";
import WhyDataxxSection from "@/components/WhyDataxxSection";
// import LeadFormSection from "@/components/LeadFormSection";
// import BenefitsSection from "@/components/BenefitsSection";
// Anciennes sections retirées: FoundersSection et SupportersMarqueeSection
import TrustedBySection from "@/components/TrustedBySection";
import DataxxSlices from "@/components/DataxxSlices";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const Index = () => {
  return (
    <div id="top" className="min-h-screen">
      <Header />
      {/* Hero avec design ancien site mais contenu actuel */}
      <HeroHeader
        badge="Plateforme propulsée par l'IA"
        titleTarget="La Plateforme IA qui réinvente"
        titleBetter=""
        titleActivate=""
        titleMore1=""
        titleEarn="le sponsoring"
        titleMore2="sportif"
        subtitle=""
        description={"Dataxx aide les acteurs du sport à identifier, qualifier et signer plus de sponsors grâce à l’IA"}
        primaryCta="Demander une démo"
        secondaryCta="En savoir plus"
        secondaryHref="#features"
      />
      {/* Confiance juste sous les CTA - Temporairement retirée */}
      {/* <Reveal>
        <TrustedBySection />
      </Reveal> */}
      {/* Parcours classique ensuite */}
      <Reveal>
        <HowItWorksSection />
      </Reveal>
      {/* Tag 'BÉNÉFICES' au-dessus de Pourquoi choisir Dataxx */}
      <div id="benefices" className="max-w-7xl mx-auto px-6 mt-6 md:mt-8 scroll-mt-36">
        <div className="text-center mb-2">
          <div className="text-primary tracking-widest text-sm font-semibold uppercase">BÉNÉFICES</div>
        </div>
      </div>
      <div className="mt-2">
        <Reveal>
          <WhyDataxxSection />
        </Reveal>
      </div>
      <PositioningSection />
      {/* Tag 'ÉQUIPE' au-dessus des fondateurs */}
      <div id="equipe" className="max-w-7xl mx-auto px-6 mt-6 md:mt-8 scroll-mt-36">
        <div className="text-center mb-2">
          <div className="text-primary tracking-widest text-sm font-semibold uppercase">ÉQUIPE</div>
        </div>
      </div>
      {/* Sections importées de l'ancien site (ajoutées tout en bas) */}
      <Reveal>
        <DataxxSlices />
      </Reveal>
      <Footer />
    </div>
  );
};

export default Index;
