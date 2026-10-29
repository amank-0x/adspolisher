"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "motion/react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What services does AdsPolisher provide?",
    answer:
      "We provide four core advertising services: Ad Creative & Design (static visuals, carousels, and display banners), Ad Copywriting (hooks, headlines, and primary ad text), Ad Audit & Optimization (reviewing your existing ads for conversion leaks), and Campaign Strategy (audience positioning and creative testing roadmaps).",
  },
  {
    question: "Do you work with businesses internationally?",
    answer:
      "Yes. We work asynchronously with founders, marketing teams, and agencies worldwide. All creative briefs, feedback rounds, and final asset deliveries happen online through our streamlined project workflow.",
  },
  {
    question: "How does AI fit into your creative process?",
    answer:
      "We use AI to speed up early-stage market research, hook ideation, and multi-ratio format resizing. Every single concept, layout, and final deliverable is art-directed, reviewed, and refined by experienced human creatives to ensure brand accuracy and quality.",
  },
  {
    question: "Can I request a custom package?",
    answer:
      "Absolutely. If your campaign requires a specific mix of static ads, short-form video hooks, copy variations, or landing page design, select Request a Quote and we will build a tailored scope and fixed quotation before any work begins.",
  },
  {
    question: "How many revisions are included?",
    answer:
      "Every standard Creative Package includes 2 full rounds of human-led revisions so we can fine-tune visuals, copy, and layouts to your exact preferences. Custom campaigns include flexible revision limits defined upfront in your project scope.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Standard first drafts for Ad Audits, Ad Copywriting, and Creative Packages are delivered within 48 to 72 business hours after your brief is approved. Larger custom campaigns typically run in structured 3-to-5-day milestone sprints.",
  },
  {
    question: "Do you guarantee ad performance?",
    answer:
      "No—and you should be cautious of any studio that promises guaranteed ROAS. Actual ad performance depends on many factors outside creative alone, including your product, pricing, landing page, and media buying budget. What we do guarantee is high-converting creative best practices, clear visual hierarchy, strong hooks, and on-time delivery.",
  },
  {
    question: "How do payments and project approvals work?",
    answer:
      "Fixed-price packages are paid upfront when submitting your creative brief; custom campaigns can be split into milestone payments. Once we deliver your drafts, you can leave feedback directly on the assets, approve the final versions in one click, and immediately download all source and launch-ready files.",
  },
];

export default function FaqSection({
  hideContactLink = false,
}: {
  hideContactLink?: boolean;
} = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="w-full border-t border-[#141413]/10 bg-white py-24 text-[#141413] lg:py-32"
      aria-label="Frequently Asked Questions"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        {/* 5/12 Left + 7/12 Right Grid with constrained question stack */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* LEFT COLUMN (lg:col-span-5): Heading + Sub-Links + Enlarged Transparent faq-bear */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start lg:sticky lg:top-28 lg:col-span-5"
          >
            <h2 className="text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-[#141413] sm:text-5xl lg:text-[3.5rem]">
              Have more
              <br />
              questions?
            </h2>

            <p className="mt-5 text-base leading-relaxed text-[#4A4945] sm:text-lg lg:text-[1.125rem]">
              {hideContactLink ? (
                <>
                  Explore our{" "}
                  <Link
                    href="/#pricing"
                    className="font-semibold text-[#4F46E5] underline decoration-[#4F46E5] decoration-2 underline-offset-4 transition-colors hover:text-[#D9480F] hover:decoration-[#D9480F]"
                  >
                    Pricing Packages
                  </Link>{" "}
                  or{" "}
                  <a
                    href="#start-project-form"
                    className="font-semibold text-[#4F46E5] underline decoration-[#4F46E5] decoration-2 underline-offset-4 transition-colors hover:text-[#D9480F] hover:decoration-[#D9480F]"
                  >
                    fill out the form above!
                  </a>
                </>
              ) : (
                <>
                  Explore our{" "}
                  <a
                    href="#pricing"
                    className="font-semibold text-[#4F46E5] underline decoration-[#4F46E5] decoration-2 underline-offset-4 transition-colors hover:text-[#D9480F] hover:decoration-[#D9480F]"
                  >
                    Pricing Packages
                  </a>{" "}
                  or{" "}
                  <Link
                    href="/start-project"
                    className="font-semibold text-[#4F46E5] underline decoration-[#4F46E5] decoration-2 underline-offset-4 transition-colors hover:text-[#D9480F] hover:decoration-[#D9480F]"
                  >
                    send us a message!
                  </Link>
                </>
              )}
            </p>

            {/* Enlarged Transparent faq-bear Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.32, duration: 0.7 }}
              className="relative mt-10 h-[280px] w-[290px] pl-1 sm:mt-12 sm:h-[330px] sm:w-[340px] lg:mt-14 lg:h-[380px] lg:w-[380px]"
            >
              <Image
                src="/landing/faq-bear.svg"
                alt="AdsPolisher FAQ mascot"
                fill
                sizes="(max-width: 640px) 290px, (max-width: 1024px) 340px, 380px"
                className="object-contain object-left-bottom"
                priority
              />
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN (lg:col-span-7): Decreased Width Soft Cream Accordion Stack */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.24,
                  staggerChildren: 0.1,
                },
              },
            }}
            className="w-full max-w-[660px] space-y-3.5 lg:col-span-7 lg:ml-auto"
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="overflow-hidden rounded-xl bg-[#F6F4EE] transition-colors duration-200 hover:bg-[#EFECE4]"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                    className="flex w-full items-center justify-between gap-4 px-7 py-[22px] text-left"
                  >
                    <span className="text-base font-bold leading-snug text-[#141413] sm:text-[17px]">
                      {item.question}
                    </span>

                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center text-[#141413] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="h-[18px] w-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-7 pb-6 pt-0 text-sm leading-[1.65] text-[#4A4945] sm:text-[15px]">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
