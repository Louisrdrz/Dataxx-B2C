import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HeroHeader from "@/components/HeroHeader";
// import YouTuberCarousel from "@/components/YouTuberCarousel";
// Section Problème retirée
import HowItWorksSection from "@/components/HowItWorksSection";
// Sections supprimées de la structure demandée
import PositioningSection from "@/components/PositioningSection";
// import LeadFormSection from "@/components/LeadFormSection";
// import BenefitsSection from "@/components/BenefitsSection";
// Anciennes sections retirées: FoundersSection et SupportersMarqueeSection
import TrustedBySection from "@/components/TrustedBySection";
import DataxxSlices from "@/components/DataxxSlices";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
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
        description={"Dataxx aide les clubs, ligues, fédérations et athlètes à identifier,\nqualifier et signer plus de sponsors grâce à l’IA"}
        primaryCta="Demander une démo"
        secondaryCta="En savoir plus"
        secondaryHref="#features"
      />
      {/* Confiance juste sous les CTA */}
      <TrustedBySection />
      {/* Parcours classique ensuite */}
      <HowItWorksSection />
      <PositioningSection />
      {/* Sections importées de l'ancien site (ajoutées tout en bas) */}
      <DataxxSlices />
      <Footer />
    </div>
  );
};

export default Index;
