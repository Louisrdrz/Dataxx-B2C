import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import YouTuberCarousel from "@/components/YouTuberCarousel";
import ProblemSection from "@/components/ProblemSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <YouTuberCarousel />
      <ProblemSection />
      <BenefitsSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default Index;
