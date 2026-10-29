'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import type { FeatureBlockItem } from '@/lib/services-data';

export default function FeatureBlock({
  title,
  accent,
  titleSuffix,
  body,
  image,
  imageAlt,
  reverse = false,
}: FeatureBlockItem) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1450px] px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col justify-center ${reverse ? 'lg:pl-6' : 'lg:pr-6'}`}
          >
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#141413] sm:text-5xl lg:text-[4rem]">
              {title}{' '}
              <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent inline-block">
                {accent}
              </em>
              {titleSuffix && ` ${titleSuffix}`}
            </h2>

            <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-[#4A4945] sm:text-xl">
              {body}
            </p>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex items-center justify-center ${
              reverse ? 'lg:order-first' : ''
            }`}
          >
            <div className="relative w-full max-w-[620px] overflow-hidden rounded-3xl">
              <Image
                src={image}
                alt={imageAlt}
                width={624}
                height={522}
                className="h-auto w-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
