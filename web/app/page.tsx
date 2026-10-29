import AdSpolisherHero from "../components/landing/AdSpolisherHero";
import WhyAdSpolisherSection from "../components/landing/WhyAdSpolisherSection";
import ServicesSection from "../components/landing/ServicesSection";
import CreativeShowcaseSection from "../components/landing/CreativeShowcaseSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import FaqSection from "../components/landing/FaqSection";
import { PublicFooter } from "../components/public/PublicFooter";

export default function Home() {
  return (
    <main id="top">
      <AdSpolisherHero />
      <WhyAdSpolisherSection />
      <ServicesSection />
      <CreativeShowcaseSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <PublicFooter />
    </main>
  );
}
