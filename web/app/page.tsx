import AdSpolisherHero from "../components/landing/AdSpolisherHero";
import WhyAdSpolisherSection from "../components/landing/WhyAdSpolisherSection";
import ServicesSection from "../components/landing/ServicesSection";
import CreativeShowcaseSection from "../components/landing/CreativeShowcaseSection";

export default function Home() {
  return (
    <main id="top">
      <AdSpolisherHero />
      <WhyAdSpolisherSection />
      <ServicesSection />
      <CreativeShowcaseSection />
    </main>
  );
}
