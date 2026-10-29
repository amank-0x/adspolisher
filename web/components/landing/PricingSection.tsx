"use client";

import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

interface PackageItem {
  id: string;
  name: string;
  priceMain: string;
  priceSub: string;
  popular?: boolean;
  headerBg: string;
  summary: string;
  deliverables: string[];
  turnaroundAndRevisions: string[];
  processAndScope: string[];
  ctaLabel: string;
  ctaHref: string;
}

const PACKAGES: PackageItem[] = [
  {
    id: "ad-audit",
    name: "Ad Audit",
    priceMain: "$295",
    priceSub: "/fixed price",
    headerBg: "#5EEAD4",
    summary:
      "For brands already running ads that want to diagnose creative fatigue and unlock quick conversion wins.",
    deliverables: [
      "Frame-by-frame review of up to 10 existing ads",
      "Visual hierarchy, hook & CTA clarity scoring",
      "Competitor ad library benchmark comparison",
      "Annotated before-and-after redesign wireframes",
      "Prioritized 30-day optimization action checklist",
    ],
    turnaroundAndRevisions: [
      "48-hour guaranteed turnaround",
      "1 follow-up Q&A refinement session",
      "Delivered via interactive board + PDF report",
    ],
    processAndScope: [
      "Audited by a Senior Performance Art Director",
      "Clear, fixed scope with zero recurring commitment",
      "Audit fee credited if you upgrade to a package",
    ],
    ctaLabel: "Book an Ad Audit",
    ctaHref: "/start-project?package=ad-audit",
  },
  {
    id: "creative-package",
    name: "Creative Package",
    priceMain: "Starting at $795",
    priceSub: "/project",
    popular: true,
    headerBg: "#F472B6",
    summary:
      "For businesses that need scroll-stopping ad visuals and persuasive copy variations ready to launch.",
    deliverables: [
      "6 custom ad creatives tailored to your brand",
      "Multi-ratio exports (4:5 feed, 9:16 story, 1:1 square)",
      "6 persuasive ad copy & headline variations",
      "3 distinct hook angles for A/B creative testing",
      "Editable source files & launch-ready assets",
    ],
    turnaroundAndRevisions: [
      "48–72 hour first-draft delivery",
      "2 full rounds of human-reviewed revisions included",
      "AI-assisted speed + 100% human quality control",
    ],
    processAndScope: [
      "Senior Ad Designer + Direct-Response Copywriter",
      "Upfront deliverable checklist before work starts",
      "Streamlined project review & approval workflow",
    ],
    ctaLabel: "Start Creative Package",
    ctaHref: "/start-project?package=creative-package",
  },
  {
    id: "custom-campaign",
    name: "Custom Campaign",
    priceMain: "Request a Quote",
    priceSub: "/custom scope",
    headerBg: "#818CF8",
    summary:
      "For product launches, multi-channel ad campaigns, or ongoing monthly creative production at scale.",
    deliverables: [
      "Custom volume of static & motion ad creatives",
      "Full campaign strategy & audience messaging matrix",
      "Short-form video ad hooks (Reels, TikTok, Shorts)",
      "Landing page design matched to your ad angles",
      "Structured A/B testing roadmap across channels",
    ],
    turnaroundAndRevisions: [
      "Dedicated sprint schedule (3–5 day milestones)",
      "Custom revision limits tailored to project scope",
      "Priority production queue & multi-brand support",
    ],
    processAndScope: [
      "Senior Art Director + Copywriter + Strategist pod",
      "Tailored scope and transparent fixed quotation",
      "Flexible one-off campaign or monthly capacity",
    ],
    ctaLabel: "Request a Custom Quote",
    ctaHref: "/start-project?package=custom-campaign",
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-[#111110] py-24 text-white lg:py-32"
      aria-label="Pricing and packages"
    >
      {/* Subtle Studio Ambient Glow Behind Cards */}
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(circle at 20% 55%, rgba(94, 234, 212, 0.22), transparent 45%), radial-gradient(circle at 50% 45%, rgba(244, 114, 182, 0.18), transparent 50%), radial-gradient(circle at 80% 55%, rgba(129, 140, 248, 0.22), transparent 45%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-12">
        {/* Top Centered Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[720px] text-center"
        >
          <h2 className="text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Choose the{" "}
            <em
              className="font-serif italic font-normal text-[#FDE68A]"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, 'Times New Roman', serif",
              }}
            >
              creative package
            </em>
            <br />
            your brand needs.
          </h2>

          <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
            Clear deliverables, predictable turnaround times, and defined revision
            rounds—no hidden agency retainers.
          </p>
        </motion.div>

        {/* 3-Column Pricing Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.16,
              },
            },
          }}
          className="mt-16 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`flex flex-col justify-between rounded-[24px] bg-white p-5 text-[#141413] shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-shadow duration-300 sm:p-6 ${
                pkg.popular ? "ring-2 ring-[#F472B6]" : ""
              }`}
            >
              <div>
                {/* Top Inset Colored Header Banner */}
                <div
                  className="rounded-2xl p-6 text-[#141413] sm:p-7"
                  style={{ backgroundColor: pkg.headerBg }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {pkg.name}
                    </h3>
                    {pkg.popular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#141413] shadow-sm">
                        <span className="text-[#D9480F]">✦</span> MOST POPULAR
                      </span>
                    )}
                  </div>

                  <div className="my-4 h-[1px] w-full bg-[#141413]/20" />

                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.5rem]">
                      {pkg.priceMain}
                    </span>
                    {pkg.priceSub && (
                      <span
                        className="font-serif text-lg italic text-[#141413]/85"
                        style={{
                          fontFamily:
                            "'Playfair Display', Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {pkg.priceSub}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="px-2 pt-5 sm:px-3">
                  <p className="min-h-[44px] text-sm leading-relaxed text-[#4A4945] font-medium sm:text-[15px]">
                    {pkg.summary}
                  </p>

                  {/* Category 1: Deliverables */}
                  <div className="mt-7">
                    <h4 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#141413]">
                      Services &amp; Deliverables
                    </h4>
                    <ul className="mt-3.5 space-y-3">
                      {pkg.deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-between gap-2.5 text-sm leading-normal text-[#2B2A27] font-medium"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-extrabold text-emerald-600">✓</span>
                            <span>{item}</span>
                          </div>
                          <span
                            className="shrink-0 text-xs text-neutral-400"
                            title="Included in package scope"
                          >
                            ⓘ
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 2: Turnaround & Revisions */}
                  <div className="mt-7">
                    <h4 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#141413]">
                      Turnaround &amp; Revisions
                    </h4>
                    <ul className="mt-3.5 space-y-3">
                      {pkg.turnaroundAndRevisions.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-between gap-2.5 text-sm leading-normal text-[#2B2A27] font-medium"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-extrabold text-emerald-600">✓</span>
                            <span>{item}</span>
                          </div>
                          <span className="shrink-0 text-xs text-neutral-400">
                            ⓘ
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 3: Management & Scope */}
                  <div className="mt-7">
                    <h4 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#141413]">
                      Workflow &amp; Scope
                    </h4>
                    <ul className="mt-3.5 space-y-3">
                      {pkg.processAndScope.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-between gap-2.5 text-sm leading-normal text-[#2B2A27] font-medium"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-extrabold text-emerald-600">✓</span>
                            <span>{item}</span>
                          </div>
                          <span className="shrink-0 text-xs text-neutral-400">
                            ⓘ
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Boxed CTA Button */}
              <div className="mt-10 px-2 pb-2 sm:px-3">
                <Link
                  href={pkg.ctaHref}
                  className={`group flex w-full items-center justify-center gap-2.5 rounded-xl border-[1.75px] border-[#141413] px-6 py-4 text-sm font-bold tracking-wide transition-all ${
                    pkg.popular
                      ? "bg-[#141413] text-white hover:border-[#D9480F] hover:bg-[#D9480F]"
                      : "bg-white text-[#141413] hover:bg-[#141413] hover:text-white"
                  }`}
                >
                  <span>{pkg.ctaLabel}</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-current text-xs transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
