'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'motion/react';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setCurrent(value);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(easeOut * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {current}
      {suffix}
    </span>
  );
}

export default function CreativeExtension() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-[#F4F4F6] py-20 lg:py-28 rounded-b-[48px] sm:rounded-b-[60px] overflow-hidden">
      <div className="mx-auto max-w-[1450px] px-6 md:px-12">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#141413] sm:text-5xl lg:text-[4rem]">
            The creative{' '}
            <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent inline-block">
              extension
            </em>{' '}
            of your team
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[1fr_1fr_2.1fr] lg:h-[670px]">
          {/* Cell A (Left, Full Height): Dark Indigo */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={prefersReducedMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-[#1E1B4B] p-8 sm:p-10 shadow-xl transition-all duration-300 min-h-[380px] lg:min-h-0"
          >
            <div>
              <span className="font-serif italic font-accent text-5xl sm:text-6xl lg:text-7xl text-white block leading-none">
                Every
              </span>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-white/75 sm:text-base">
                Creative Category
              </p>
            </div>

            {/* Bottom Anchored Graphics Art */}
            <div className="relative mt-8 w-full flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[554/488]">
                <Image
                  src="/services/creative-extension/type-of-graphics-min.png"
                  alt="Type of graphics preview"
                  fill
                  sizes="320px"
                  className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

          {/* Middle Stack: 2 Rows (Cell B & Cell C) */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:h-full">
            {/* Cell B (Middle Top): Dark Wine */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 flex-col justify-center overflow-hidden rounded-[32px] bg-[#3B0A24] p-8 sm:p-10 shadow-xl transition-all duration-300 min-h-[220px]"
            >
              <div className="font-serif italic font-accent text-5xl sm:text-6xl lg:text-[4rem] text-[#FF5CAA] leading-none">
                48–72h
              </div>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-white/80 sm:text-base">
                Average first draft turnaround
              </p>
            </motion.div>

            {/* Cell C (Middle Bottom): Dark Forest */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 flex-col justify-center overflow-hidden rounded-[32px] bg-[#0B3B2E] p-8 sm:p-10 shadow-xl transition-all duration-300 min-h-[220px]"
            >
              <div className="font-serif italic font-accent text-5xl sm:text-6xl lg:text-[4rem] text-[#2DE0C8] leading-none">
                <AnimatedNumber value={2} suffix=" Rounds" />
              </div>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-white/80 sm:text-base">
                Human-led revisions included
              </p>
            </motion.div>
          </div>

          {/* Cell D (Right, Full Height): Dark Indigo with Customer Satisfaction Art */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={prefersReducedMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-[#1E1B4B] p-8 sm:p-10 shadow-xl transition-all duration-300 min-h-[380px] lg:min-h-0"
          >
            {/* Top Illustration Area */}
            <div className="relative w-full aspect-[1200/671] overflow-hidden rounded-2xl bg-white/5 p-4 flex items-center justify-center">
              <Image
                src="/services/creative-extension/customer-satisfaction-rate-2-min.png"
                alt="High creative satisfaction rating metrics"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Bottom Left Big Metric */}
            <div className="mt-6">
              <div className="font-serif italic font-accent text-6xl sm:text-7xl lg:text-[5rem] text-white leading-none">
                <AnimatedNumber value={100} suffix="%" />
              </div>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-white/80 sm:text-base">
                Art-directed by senior creatives
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
