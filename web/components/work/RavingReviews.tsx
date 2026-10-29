'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { reviewItems } from '@/lib/work-data';
import { StarRating } from './StarRating';

const REVIEW_AVATAR_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-blue-100 text-blue-700',
  'bg-indigo-100 text-indigo-700',
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function AnimatedStat({ value, suffix = '' }: { value: number; suffix?: string }) {
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

    const duration = 1000;
    const startTime = performance.now();

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
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

export function RavingReviews() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full pt-12 pb-24 sm:pt-16 sm:pb-32">
      <div className="mx-auto max-w-[1250px] px-6">
        {/* Section Heading with Motion */}
        <motion.h2
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl"
        >
          Raving{' '}
          <em className="font-serif italic text-[#4F46E5] font-normal font-accent">
            Reviews
          </em>
        </motion.h2>

        {/* 2-Column Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
          {reviewItems.map((item, index) => {
            const avatarColor = REVIEW_AVATAR_COLORS[index % REVIEW_AVATAR_COLORS.length];
            const initials = getInitials(item.reviewerName);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : (index % 2) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col-reverse overflow-hidden rounded-2xl border border-[#141413]/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#141413]/20 lg:h-[370px] lg:flex-row"
              >
                {/* Left Content Half */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 lg:p-5">
                  <div>
                    {/* Title Quote */}
                    <h3 className="text-base font-bold leading-snug text-[#141413] sm:text-lg lg:text-[17px] line-clamp-2">
                      &ldquo;{item.title}&rdquo;
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#4A4945] line-clamp-2">
                      {item.excerpt}
                    </p>

                    {/* Reviewer Row */}
                    <div className="mt-3 flex items-center gap-3">
                      {item.avatar ? (
                        <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#4F46E5] ring-offset-2 ring-offset-white transition-transform duration-300 group-hover:scale-105">
                          <Image
                            src={item.avatar}
                            alt={item.reviewerName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full text-sm sm:text-base font-bold tracking-wider ring-2 ring-[#4F46E5] ring-offset-2 ring-offset-white transition-transform duration-300 group-hover:scale-105 ${avatarColor}`}
                          aria-hidden="true"
                        >
                          {initials}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#141413] sm:text-[15px]">
                          {item.reviewerName}
                        </span>
                        <div className="mt-0.5">
                          <StarRating rating={item.rating} size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2x2 Stats Box */}
                  <div className="mt-3.5 rounded-xl bg-[#F6F4EE] p-3 sm:p-3.5 transition-colors duration-300 group-hover:bg-[#f1eee6]">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      {/* Concepts */}
                      <div>
                        <div className="font-serif italic text-2xl sm:text-[26px] text-[#141413] font-accent leading-none">
                          <AnimatedStat value={item.stats.concepts} />
                        </div>
                        <div className="mt-0.5 text-[11px] sm:text-xs text-[#4A4945]">
                          Concepts created
                        </div>
                      </div>

                      {/* Revisions */}
                      <div>
                        <div className="font-serif italic text-2xl sm:text-[26px] text-[#141413] font-accent leading-none">
                          <AnimatedStat value={item.stats.revisions} />
                        </div>
                        <div className="mt-0.5 text-[11px] sm:text-xs text-[#4A4945]">
                          Revisions
                        </div>
                      </div>

                      {/* Delivered */}
                      <div>
                        <div className="font-serif italic text-2xl sm:text-[26px] text-[#141413] font-accent leading-none">
                          <AnimatedStat value={item.stats.delivered} />
                        </div>
                        <div className="mt-0.5 text-[11px] sm:text-xs text-[#4A4945]">
                          Delivered assets
                        </div>
                      </div>

                      {/* Turnaround */}
                      <div>
                        <div className="font-serif italic text-2xl sm:text-[26px] text-[#141413] font-accent leading-none">
                          <AnimatedStat value={item.stats.turnaroundHours} suffix="h" />
                        </div>
                        <div className="mt-0.5 text-[11px] sm:text-xs text-[#4A4945]">
                          Turnaround
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Image Half */}
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#F1EFE9] lg:aspect-auto lg:w-[44%] xl:w-[45%]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 380px, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RavingReviews;
