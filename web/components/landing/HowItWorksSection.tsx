"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, ClipboardCheck, Sparkles, ArrowRight } from "lucide-react";

type ZigzagRow = {
  titleBefore: string;
  titleItalic: string;
  titleAfter: string;
  description: string;
  image: string;
  imageAlt: string;
  imageLeft: boolean;
};

const ZIGZAG_ROWS: ZigzagRow[] = [
  {
    titleBefore: "Attract more ",
    titleItalic: "customers",
    titleAfter: "",
    description:
      "Share your product, target audience, and campaign objectives. Work with expert ad creatives to craft a high-converting look for your brand that sets you apart from the competition and grows your reach.",
    image: "/landing/howItsWorks/attract-more-customers.png",
    imageAlt: "Attract more customers with high-converting ad creative",
    imageLeft: false,
  },
  {
    titleBefore: "Keep your brand ",
    titleItalic: "consistent",
    titleAfter: "",
    description:
      "Select an Ad Audit, Creative Package, or Custom Campaign. We organize your brand assets, typography, and messaging angles so every social ad, display banner, and video hook stays 100% aligned with your identity.",
    image: "/landing/howItsWorks/keep-your-brand-consistent.png",
    imageAlt: "Keep brand identity consistent across all campaigns",
    imageLeft: true,
  },
  {
    titleBefore: "Create an ",
    titleItalic: "original",
    titleAfter: " look",
    description:
      "Generic templates blend into the feed. AdsPolisher combines AI-assisted research and speed with senior human art direction to build unique, scroll-stopping ad variations tailored to your business.",
    image: "/landing/howItsWorks/create-an-original-look.png",
    imageAlt: "Original creative and scroll-stopping ad variations",
    imageLeft: false,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how"
      className="w-full border-t border-[#141413]/10 bg-[#F7F5F0] py-24 text-[#141413] lg:py-32"
      aria-label="How AdsPolisher works"
    >
      <div className="mx-auto max-w-[1320px] px-6 md:px-12">
        {/* ── PART A: ALTERNATING ZIG-ZAG FEATURE ROWS ── */}
        <div className="space-y-24 lg:space-y-32">
          {ZIGZAG_ROWS.map((row) => (
            <div
              key={row.image}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
            >
              {/* Text Column */}
              <div
                className={`lg:col-span-5 ${
                  row.imageLeft ? "order-1 lg:order-2" : "order-1"
                }`}
              >
                {/* Heading */}
                <h3 className="mt-4 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-[#141413] sm:text-5xl">
                  {row.titleBefore}
                  <em
                    className="font-serif italic font-normal text-[#D9480F]"
                    style={{
                      fontFamily:
                        "'Playfair Display', Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {row.titleItalic}
                  </em>
                  {row.titleAfter}
                </h3>

                {/* Body Copy */}
                <p className="mt-5 max-w-[440px] text-base leading-[1.65] text-[#4A4945]">
                  {row.description}
                </p>
              </div>

              {/* Image Column */}
              <div
                className={`lg:col-span-7 ${
                  row.imageLeft ? "order-2 lg:order-1" : "order-2"
                }`}
              >
                <div className="relative mx-auto aspect-[16/10] w-full max-w-[640px]">
                  <Image
                    src={row.image}
                    alt={row.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PART B: WORKFLOW & PROCESS CARDS ("Why Brands Switch") ── */}
        <div className="mt-28 lg:mt-36">
          {/* Split Header with why-switching-art */}
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 mb-12">
            <div className="lg:col-span-5 pb-4">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#D9480F]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-[1px] bg-[#D9480F]"
                  aria-hidden="true"
                />
                04 / REVIEW, TRACK &amp; SCALE
              </div>
              <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-[#141413] sm:text-5xl">
                Why brands are{" "}
                <em
                  className="font-serif italic font-normal text-[#D9480F]"
                  style={{
                    fontFamily:
                      "'Playfair Display', Georgia, 'Times New Roman', serif",
                  }}
                >
                  switching
                </em>
                <br className="hidden sm:inline" />
                <span className="mx-2 inline-block text-[#D9480F]">⇄</span>
                to AdsPolisher
              </h2>
            </div>

            <div className="lg:col-span-7">
              <div className="relative mx-auto h-[220px] w-full max-w-[600px] sm:h-[260px] lg:ml-auto">
                <Image
                  src="/landing/howItsWorks/why-switching-art.png"
                  alt="AdsPolisher creative collaboration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>

          {/* 3-Column Bento Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {/* Card 1: Vetted Creative Specialists */}
            <div className="flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#EFECE6] p-8 pb-0 border border-black/[0.04] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-[1.75px] border-[#141413] bg-[#EDE9FE] text-[#6D28D9]">
                  <Users size={20} strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-xl font-bold leading-snug text-[#141413]">
                  Work with vetted ad creatives
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4A4945]">
                  Don&apos;t rely on random freelancers by luck. Every campaign
                  is reviewed and polished by senior designers and
                  direct-response copywriters.
                </p>
              </div>
              <div className="relative mt-6 h-[190px] w-full">
                <Image
                  src="/landing/howItsWorks/why-switching-vetted-illustrators.png"
                  alt="Vetted ad creatives"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Card 2: Streamlined Project & Revision Tracking */}
            <div className="flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#EFECE6] p-8 pb-0 border border-black/[0.04] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-[1.75px] border-[#141413] bg-[#FCE7F3] text-[#BE185D]">
                  <ClipboardCheck size={20} strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-xl font-bold leading-snug text-[#141413]">
                  Keep track of all your projects
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4A4945]">
                  One simple place to submit briefs, review ad variations,
                  request revisions, and approve final deliverables without
                  messy email threads.
                </p>
              </div>
              <div className="relative mt-6 h-[190px] w-full">
                <Image
                  src="/landing/howItsWorks/why-switching-keep-track.png"
                  alt="Project tracking and revision management"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Card 3: AI-Accelerated Speed & Output */}
            <div className="flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#EFECE6] p-8 border border-black/[0.04] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-[1.75px] border-[#141413] bg-[#CCFBF1] text-[#0F766E]">
                  <Sparkles size={20} strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-xl font-bold leading-snug text-[#141413]">
                  Unrivaled creative speed
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4A4945]">
                  Get unmatched creative output when you put AI-assisted
                  workflows in the hands of experienced human performance
                  designers.
                </p>
              </div>

              {/* Interactive UI Action Card at the bottom of Card 3 */}
              <div className="mt-6 rounded-2xl border border-[#141413]/10 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-[#141413]">
                      AdsPolisher
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-600/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Ready in 48–72h
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Brief intake</span>
                    <span className="text-emerald-700 font-semibold">Approved ✓</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full w-4/5 rounded-full bg-[#D9480F]" />
                  </div>
                </div>
                <Link
                  href="/start-project"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#141413] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#D9480F]"
                >
                  Start your project <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
