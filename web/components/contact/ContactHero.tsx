"use client";

import Image from "next/image";
import React from "react";
import { motion } from "motion/react";

export default function ContactHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center md:mb-14"
    >
      {/* 1. Pill Label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center rounded-full border border-[#141413]/10 bg-white px-4 py-1.5 shadow-xs"
      >
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#141413]">
          CONTACT US
        </span>
      </motion.div>

      {/* 2. Headline (h1) */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-5 text-4xl font-bold tracking-[-0.03em] text-[#141413] sm:text-5xl lg:text-[54px]"
      >
        Get in touch
      </motion.h1>

      {/* 3. Response-time subline */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 text-base text-[#141413] sm:text-lg"
      >
        We&apos;ll respond to you in{" "}
        <span className="font-semibold text-[#43B97F]">24 hours</span>
      </motion.p>

      {/* 4. Avatars (Two overlapping circular photos) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 flex items-center justify-center -space-x-2"
        aria-label="AdsPolisher creative directors"
      >
        <div className="relative h-[68px] w-[68px] overflow-hidden rounded-full border-[3px] border-[#FCFCFC] bg-[#EDE9FE] shadow-sm">
          <Image
            src="/team/headshot-1.svg"
            alt="AdsPolisher Creative Director"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative h-[68px] w-[68px] overflow-hidden rounded-full border-[3px] border-[#FCFCFC] bg-[#FFEDD5] shadow-sm">
          <Image
            src="/team/headshot-2.svg"
            alt="AdsPolisher Performance Lead"
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* 5. Intro copy */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-5 max-w-lg text-sm leading-relaxed text-[#6B6B6B] sm:text-base"
      >
        Tell us a bit about your project and what you&apos;re hoping to achieve.
        We review every inquiry and will follow up if it looks like a good fit.
      </motion.p>
    </motion.div>
  );
}
