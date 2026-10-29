'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { categories, type CategoryItem } from '@/lib/services-data';

function CategoryCard({
  item,
  index,
}: {
  item: CategoryItem;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item.type !== 'video' || !cardRef.current || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: [0, 0.5, 1.0] }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [item.type, prefersReducedMotion]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      transition={{
        duration: 0.55,
        delay: prefersReducedMotion ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#F6F4EE] shadow-sm transition-all duration-300 hover:shadow-2xl hover:bg-[#F2EFE8] min-h-[480px] sm:min-h-[520px]"
    >
      <Link
        href={`/start-project?service=${encodeURIComponent(item.serviceParam)}`}
        className="flex h-full flex-col justify-between p-8 sm:p-10 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-4 rounded-3xl"
        aria-label={`Start a project: ${item.titlePrefix} ${item.accent}`}
      >
        {/* Top Text Info */}
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-[#141413]">
            {item.titlePrefix ? `${item.titlePrefix} ` : ''}
            <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent inline-block">
              {item.accent}
            </em>
          </h3>
          <p className="mt-3 text-base leading-relaxed text-[#4A4945]">
            {item.description}
          </p>
        </div>

        {/* Bottom Media Area */}
        <div className="relative mt-8 flex h-56 sm:h-64 w-full items-end justify-center overflow-hidden">
          {item.type === 'video' ? (
            <video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
                className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryGrid() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1450px] px-6 md:px-12">
        {/* Centered Heading */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center mb-14 sm:mb-16"
        >
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#141413] sm:text-5xl lg:text-[4rem]">
            Browse our other{' '}
            <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent inline-block">
              categories
            </em>
          </h2>
        </motion.div>

        {/* 6-Card Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <CategoryCard key={cat.id} item={cat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
