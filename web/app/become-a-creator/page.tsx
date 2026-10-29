import type { Metadata } from "next";
import CreatorApplyHero from "@/components/creator/CreatorApplyHero";
import CreatorApplyForm from "@/components/creator/CreatorApplyForm";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata: Metadata = {
  title: "Become a Creator | AdsPolisher",
  description:
    "Apply to join the AdsPolisher creative network. Collaborate on high-converting paid social ads, motion graphics, and ad copywriting for fast-growing brands.",
};

export default function BecomeACreatorPage() {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-[#FCFCFC] text-[#141413]">
        <section className="bg-[#FCFCFC] px-6 pb-24 pt-16 md:px-12">
          <CreatorApplyHero />
          <CreatorApplyForm />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
