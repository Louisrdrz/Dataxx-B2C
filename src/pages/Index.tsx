import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import YouTuberCarousel from "@/components/YouTuberCarousel";
import ProblemSection from "@/components/ProblemSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PositioningSection from "@/components/PositioningSection";
import LeadFormSection from "@/components/LeadFormSection";
import FoundersSection from "@/components/FoundersSection";
import SupportersMarqueeSection from "@/components/SupportersMarqueeSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      {/* Section "Comment ça marche" positionnée juste sous le hero */}
      <HowItWorksSection />
      {/* Parcours classique ensuite */}
      <ProblemSection />
      <PositioningSection />
      <FoundersSection />
      <SupportersMarqueeSection />
      <LeadFormSection />
      <Footer />
    </div>
  );
};

export default Index;
