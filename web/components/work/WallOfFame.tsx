'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { fameItems } from '@/lib/work-data';
import { StarRating } from './StarRating';

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function WallOfFame() {
  const [visibleCount, setVisibleCount] = useState(9);
  const prefersReducedMotion = useReducedMotion();

  const displayedItems = fameItems.slice(0, visibleCount);
  const hasMore = visibleCount < fameItems.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <section className="relative w-full py-16 sm:py-24">
      <div className="mx-auto max-w-[1250px] px-6">
        {/* Section Heading with Motion */}
        <motion.h2
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl"
        >
          Wall of{' '}
          <em className="font-serif italic text-[#4F46E5] font-normal font-accent">
            Fame
          </em>
        </motion.h2>

        {/* 3-Column Grid */}
        <div className="mt-10 grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-3">
          {displayedItems.map((item, index) => {
            const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const initials = getInitials(item.reviewerName);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : (index % 3) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(20,20,19,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(20,20,19,0.12)]"
              >
                {/* Top Image (aspect ~3/2) */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#F1EFE9]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 390px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col justify-between p-7">
                  {/* Top row: Avatar + Name & Stars */}
                  <div className="flex items-center gap-4">
                    {item.avatar ? (
                      <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-full bg-neutral-200 transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={item.avatar}
                          alt={item.reviewerName}
                          fill
                          sizes="70px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full text-xl font-bold tracking-wider transition-transform duration-300 group-hover:scale-105 ${avatarColor}`}
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="text-xl font-semibold text-[#141413]">
                        {item.reviewerName}
                      </span>
                      <div className="mt-1">
                        <StarRating rating={item.rating} size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Quote below clamped to 2 lines */}
                  <blockquote className="mt-5 text-lg leading-relaxed text-[#4A4945] line-clamp-2">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Show More Button (only rendered if items.length > visibleCount) */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <motion.button
              type="button"
              onClick={handleShowMore}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-[6px] border border-[#141413] border-b-2 bg-white px-8 py-3 text-sm font-semibold tracking-wide text-[#141413] shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            >
              Show more
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}

export default WallOfFame;
