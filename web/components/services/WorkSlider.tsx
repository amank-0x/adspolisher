'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { sliderItems } from '@/lib/services-data';

export default function WorkSlider() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const updateScrollButtons = () => {
    if (!scrollerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateScrollButtons();
    scroller.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      scroller.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const handlePrev = () => {
    if (!scrollerRef.current) return;
    const firstCard = scrollerRef.current.querySelector('[data-slider-card]') as HTMLElement;
    const step = firstCard ? firstCard.offsetWidth + 32 : 382;
    scrollerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!scrollerRef.current) return;
    const firstCard = scrollerRef.current.querySelector('[data-slider-card]') as HTMLElement;
    const step = firstCard ? firstCard.offsetWidth + 32 : 382;
    scrollerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Recent ad work"
      className="relative w-full py-6 md:py-10"
    >
      {/* Navigation Arrows */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-3 sm:px-8">
        {/* Prev Arrow */}
        <motion.button
          type="button"
          onClick={handlePrev}
          disabled={!canScrollLeft}
          aria-label="Previous"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`pointer-events-auto hidden md:flex [@media(pointer:coarse)]:hidden h-[54px] w-[54px] items-center justify-center rounded-full border border-black/5 bg-white text-[#141413] shadow-lg transition-all duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] ${
            !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>

        {/* Next Arrow */}
        <motion.button
          type="button"
          onClick={handleNext}
          disabled={!canScrollRight}
          aria-label="Next"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`pointer-events-auto hidden md:flex [@media(pointer:coarse)]:hidden h-[54px] w-[54px] items-center justify-center rounded-full border border-black/5 bg-white text-[#141413] shadow-lg transition-all duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] ${
            !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Horizontal Scroller */}
      <motion.div
        ref={scrollerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="no-scrollbar flex w-full gap-[24px] sm:gap-[30px] lg:gap-[32px] overflow-x-auto scroll-smooth snap-x snap-mandatory pl-6 sm:pl-10 lg:pl-12 pr-12 outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        style={{ scrollbarWidth: 'none' }}
      >
        {sliderItems.map((item, index) => (
          <div
            key={item.id}
            data-slider-card
            role="group"
            aria-label={`${index + 1} of ${sliderItems.length}`}
            className="group relative h-[260px] w-[260px] sm:h-[310px] sm:w-[310px] lg:h-[350px] lg:w-[350px] shrink-0 snap-start overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F1EFE9] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 310px, 350px"
              priority={index < 2}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
