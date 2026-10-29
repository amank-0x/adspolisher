'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const LEFT_COL_1 = [
  '/work/wall-of-fame/Elvis-Lives-A-Star-Spangled-Tribute-3-1024x845.jpg',
  '/work/slide/Bison-Managed-401k-Thumbnail.jpg',
];

const LEFT_COL_2 = [
  '/work/wall-of-fame/Cordova-Lanes.jpg',
  '/work/slide/CooperFence-BishopeState.jpg',
];

const RIGHT_COL_1 = [
  '/work/wall-of-fame/Night-Swim-PSSC.jpg',
  '/work/slide/Minimal-Graphics-for-Modern-Appeal-Soto.jpg',
];

const RIGHT_COL_2 = [
  '/work/wall-of-fame/Why-Buy-Gold.jpg',
  '/work/slide/Dawn-Heidlebaugh-Social-2.jpg',
];

export function WorkHero() {
  const prefersReducedMotion = useReducedMotion();

  const driftUpAnimate = prefersReducedMotion ? undefined : { y: [-8, 8, -8] };
  const driftDownAnimate = prefersReducedMotion ? undefined : { y: [8, -8, 8] };
  const driftTransition = prefersReducedMotion
    ? undefined
    : { duration: 7, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <section className="relative overflow-hidden pt-16 pb-14 md:pb-16">
      {/* Decorative Left Collage (hidden below lg) */}
      <div
        className="pointer-events-none absolute left-0 top-0 hidden h-full w-[260px] xl:w-[320px] select-none lg:block overflow-hidden"
        aria-hidden="true"
      >
        <div className="flex h-full gap-4 -ml-12 xl:-ml-6">
          {/* Col 1 */}
          <motion.div
            animate={driftUpAnimate}
            transition={driftTransition}
            className="flex flex-col gap-4 pointer-events-auto"
          >
            {LEFT_COL_1.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -4 }}
                className="relative h-44 w-36 xl:h-52 xl:w-44 overflow-hidden rounded-xl bg-neutral-200 shadow-md transition-shadow hover:shadow-xl cursor-default"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Col 2 (offset vertically) */}
          <motion.div
            animate={driftDownAnimate}
            transition={driftTransition}
            className="flex flex-col gap-4 mt-14 pointer-events-auto"
          >
            {LEFT_COL_2.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -4 }}
                className="relative h-44 w-36 xl:h-52 xl:w-44 overflow-hidden rounded-xl bg-neutral-200 shadow-md transition-shadow hover:shadow-xl cursor-default"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Right Collage (hidden below lg) */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[260px] xl:w-[320px] select-none lg:block overflow-hidden"
        aria-hidden="true"
      >
        <div className="flex h-full gap-4 -mr-12 xl:-mr-6 justify-end">
          {/* Col 1 (offset vertically) */}
          <motion.div
            animate={driftDownAnimate}
            transition={driftTransition}
            className="flex flex-col gap-4 mt-12 pointer-events-auto"
          >
            {RIGHT_COL_1.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -4 }}
                className="relative h-44 w-36 xl:h-52 xl:w-44 overflow-hidden rounded-xl bg-neutral-200 shadow-md transition-shadow hover:shadow-xl cursor-default"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Col 2 */}
          <motion.div
            animate={driftUpAnimate}
            transition={driftTransition}
            className="flex flex-col gap-4 pointer-events-auto"
          >
            {RIGHT_COL_2.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -4 }}
                className="relative h-44 w-36 xl:h-52 xl:w-44 overflow-hidden rounded-xl bg-neutral-200 shadow-md transition-shadow hover:shadow-xl cursor-default"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Heading Text */}
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Animated Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#141413] shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4F46E5] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4F46E5]" />
          </span>
          <Sparkles className="h-3 w-3 text-[#4F46E5]" />
          <span>Curated Portfolio</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-semibold tracking-tight text-[#141413] sm:text-5xl lg:text-[4.5rem] leading-[1.08]"
        >
          AdsPolisher&apos;s{' '}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block"
          >
            <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent transition-transform hover:scale-105 inline-block">
              art
            </em>
          </motion.span>{' '}
          gallery
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-base text-[#4A4945] sm:text-lg"
        >
          Ads, social posts, and campaigns crafted by our team.
        </motion.p>
      </div>
    </section>
  );
}

export default WorkHero;
