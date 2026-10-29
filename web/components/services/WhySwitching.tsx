'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Users, ClipboardList, BadgeCheck, RefreshCw } from 'lucide-react';
import { whySwitchingCards } from '@/lib/services-data';

const ICONS = {
  Users,
  ClipboardList,
  BadgeCheck,
};

export default function WhySwitching() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1450px] px-6 md:px-12">
        {/* Header row with bleeding art */}
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Heading (7 cols) */}
          <div className="lg:col-span-6 pb-6">
            <motion.h2
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#141413] sm:text-5xl lg:text-[4rem]"
            >
              Why teams are{' '}
              <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent inline-block">
                switching
              </em>{' '}
              <span className="inline-flex items-center align-middle mx-1 text-[#4F46E5]">
                <RefreshCw className="h-8 w-8 sm:h-10 sm:w-10 animate-spin-slow" />
              </span>{' '}
              to AdsPolisher
            </motion.h2>
          </div>

          {/* Right Bleeding Art (6 cols) */}
          <div className="relative lg:col-span-6 flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[720px]"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
              }}
            >
              <Image
                src="/services/main/why-switching-art.png"
                alt=""
                width={1200}
                height={618}
                className="h-auto w-full object-contain"
                priority={false}
              />
            </motion.div>
          </div>
        </div>

        {/* 3 Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {whySwitchingCards.map((card, idx) => {
            const IconComponent = ICONS[card.iconName];

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                transition={{
                  duration: 0.55,
                  delay: prefersReducedMotion ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col justify-start rounded-3xl bg-[#F6F4EE] p-8 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:bg-[#F2EFE8] min-h-[300px] sm:min-h-[340px]"
              >
                {/* 56px accent-tinted circle */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5]/10 text-[#4F46E5] shadow-xs transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="h-7 w-7" />
                </div>

                {/* Card Title */}
                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#141413] sm:text-2xl">
                  {card.title}
                </h3>

                {/* Body Text */}
                <p className="mt-3 text-base leading-relaxed text-[#4A4945] sm:text-lg">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
