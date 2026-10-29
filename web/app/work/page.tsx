import { Metadata } from 'next';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { WorkHero } from '@/components/work/WorkHero';
import { WorkCarousel } from '@/components/work/WorkCarousel';
import { WallOfFame } from '@/components/work/WallOfFame';
import { RavingReviews } from '@/components/work/RavingReviews';

export const metadata: Metadata = {
  title: 'Our Work | AdsPolisher',
  description: "A look at the ad creatives, social posts, and campaigns we've delivered.",
};

export default function WorkPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FCFCFC] text-[#141413]">
      <PublicNavbar />
      <main className="flex-1 bg-[#FCFCFC] text-[#141413]">
        <WorkHero />
        <WorkCarousel />
        <WallOfFame />
        <RavingReviews />
      </main>
      <PublicFooter />
    </div>
  );
}
