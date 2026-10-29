import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import StartProjectForm from "@/components/contact/StartProjectForm";
import FaqSection from "@/components/landing/FaqSection";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata: Metadata = {
  title: "Start a Project | AdsPolisher",
  description:
    "Tell us about your ad project. We review every inquiry and respond within 24 hours.",
};

export default function StartProjectPage() {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-[#FCFCFC] text-[#141413]">
        <section className="bg-[#FCFCFC] px-6 pb-24 pt-16 md:px-12">
          <ContactHero />
          <StartProjectForm />
        </section>
        <FaqSection hideContactLink />
      </main>
      <PublicFooter />
    </>
  );
}
