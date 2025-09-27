import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import YouTuberCarousel from "@/components/YouTuberCarousel";
import ProblemSection from "@/components/ProblemSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SolutionSection from "@/components/SolutionSection";
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
      {/* Carousel retiré pour Dataxx */}
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <PositioningSection />
      <HowItWorksSection />
      <FoundersSection />
      <SupportersMarqueeSection />
      <LeadFormSection />
      <Footer />
    </div>
  );
};

export default Index;
