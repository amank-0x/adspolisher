import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import ServicesHero from '@/components/services/ServicesHero';
import WorkSlider from '@/components/services/WorkSlider';
import FeatureBlock from '@/components/services/FeatureBlock';
import WhySwitching from '@/components/services/WhySwitching';
import CreativeExtension from '@/components/services/CreativeExtension';
import ComparisonTable from '@/components/services/ComparisonTable';
import PricingSection from '@/components/landing/PricingSection';
import CategoryGrid from '@/components/services/CategoryGrid';
import FaqSection from '@/components/landing/FaqSection';
import { featureBlocks } from '@/lib/services-data';

export const metadata: Metadata = {
  title: 'Services | AdsPolisher',
  description:
    'Ad creative, copywriting, audits and campaign strategy, art-directed by experienced creatives.',
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FCFCFC] text-[#141413]">
      <PublicNavbar />
      <main className="flex-1 bg-[#FCFCFC] text-[#141413]">
        <ServicesHero />
        <WorkSlider />

        {/* Feature Block 1: Stand out from competitors */}
        <FeatureBlock {...featureBlocks[0]} />

        {/* Feature Block 2: Keep all your ads consistent (reverse) */}
        <FeatureBlock {...featureBlocks[1]} />

        {/* Feature Block 3: Create more than ever before */}
        <FeatureBlock {...featureBlocks[2]} />

        {/* Why teams are switching */}
        <WhySwitching />

        {/* Creative Extension (Stats Bento) */}
        <CreativeExtension />

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Pricing Section (Reused existing component with anchor id="pricing") */}
        <PricingSection
          heading={
            <>
              Choose the{' '}
              <em
                className="font-serif italic font-normal text-[#FDE68A]"
                style={{
                  fontFamily:
                    "'Playfair Display', Georgia, 'Times New Roman', serif",
                }}
              >
                creative capacity
              </em>
              <br />
              your team needs.
            </>
          }
        />

        {/* Categories Grid */}
        <CategoryGrid />

        {/* Marked Slot: Real success stories in action (not specified yet) */}
        {/* Marked Slot: GlobeSection "We know marketing" (separate spec) */}

        {/* FAQ Section (Reused existing component) */}
        <FaqSection />
      </main>
      <PublicFooter />
    </div>
  );
}
