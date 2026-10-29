'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { carouselItems, type CarouselItem } from '@/lib/work-data';
import { WorkCaseModal } from './WorkCaseModal';

// Repeat items 3 times for seamless infinite loop (Set 0, Set 1, Set 2)
const MULTIPLIER = 3;
const REPEATED_ITEMS = Array.from({ length: MULTIPLIER }).flatMap((_, setIdx) =>
  carouselItems.map((item) => ({
    ...item,
    uniqueKey: `${item.id}-set-${setIdx}`,
    setIdx,
  }))
);

interface CarouselCardProps {
  item: CarouselItem;
  displayIndex: number;
  total: number;
  onOpenModal: (item: CarouselItem) => void;
}

function CarouselCard({ item, displayIndex, total, onOpenModal }: CarouselCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (item.type !== 'video' || !cardRef.current) return;

    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          videoRef.current
            ?.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser autoplay policy prevented playback
            });
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.6, 1.0] }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [item.type, prefersReducedMotion]);

  const toggleManualPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div
      ref={cardRef}
      data-carousel-card
      role="group"
      aria-label={`${displayIndex + 1} of ${total}`}
      className="group relative flex w-[78vw] sm:w-[360px] lg:w-[440px] shrink-0 snap-start flex-col"
    >
      {/* Media container */}
      <motion.div
        whileHover={prefersReducedMotion ? undefined : { y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#F1EFE9] shadow-sm transition-shadow duration-300 group-hover:shadow-xl"
      >
        {item.type === 'video' ? (
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Reduced motion or manual toggle control button */}
            {prefersReducedMotion && (
              <button
                type="button"
                onClick={toggleManualPlayback}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
            )}
          </div>
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 360px, 440px"
            priority={displayIndex < 2}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </motion.div>

      {/* Info below media */}
      <div className="mt-4 flex flex-col items-start gap-1">
        <p className="w-full truncate text-base text-[#4A4945]" title={item.caption}>
          {item.caption}
        </p>
        <button
          type="button"
          onClick={() => onOpenModal(item)}
          className="group/btn inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#4F46E5] transition-colors hover:text-[#D9480F] focus:outline-none focus:underline"
        >
          <span>SEE MORE</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

export function WorkCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null);
  const isAdjustingRef = useRef(false);

  // Helper to compute pixel width of one full set of 8 cards
  const getSetWidth = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;
    const cards = scroller.querySelectorAll('[data-carousel-card]');
    if (cards.length >= carouselItems.length * 2) {
      const card0 = cards[0] as HTMLElement;
      const cardNextSet = cards[carouselItems.length] as HTMLElement;
      if (card0 && cardNextSet) {
        return cardNextSet.offsetLeft - card0.offsetLeft;
      }
    }
    return 0;
  }, []);

  // Initialize scroll position in Set 1 (the middle set)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const initScroll = () => {
      const setWidth = getSetWidth();
      if (setWidth > 0 && scroller.scrollLeft < 10) {
        isAdjustingRef.current = true;
        scroller.scrollLeft = setWidth;
        setTimeout(() => {
          isAdjustingRef.current = false;
        }, 50);
      }
    };

    // Small delay to ensure layout is measured accurately
    const timer = setTimeout(initScroll, 60);
    window.addEventListener('resize', initScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initScroll);
    };
  }, [getSetWidth]);

  // Seamless infinite repositioning on scroll
  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isAdjustingRef.current) return;

    const setWidth = getSetWidth();
    if (setWidth <= 0) return;

    // Scrolled into Set 2 -> snap back to Set 1
    if (scroller.scrollLeft >= setWidth * 2 - 50) {
      isAdjustingRef.current = true;
      scroller.scrollLeft -= setWidth;
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    }
    // Scrolled back near the beginning of Set 0 -> snap forward to Set 1
    else if (scroller.scrollLeft <= 50) {
      isAdjustingRef.current = true;
      scroller.scrollLeft += setWidth;
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    }
  }, [getSetWidth]);

  const handlePrev = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const setWidth = getSetWidth();
    if (setWidth > 0 && scroller.scrollLeft <= setWidth * 0.2) {
      scroller.scrollLeft += setWidth;
    }

    const firstCard = scroller.querySelector('[data-carousel-card]') as HTMLElement;
    const cardStep = firstCard ? firstCard.offsetWidth + 30 : 470;
    scroller.scrollBy({ left: -cardStep, behavior: 'smooth' });
  };

  const handleNext = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const setWidth = getSetWidth();
    if (setWidth > 0 && scroller.scrollLeft >= setWidth * 1.8) {
      scroller.scrollLeft -= setWidth;
    }

    const firstCard = scroller.querySelector('[data-carousel-card]') as HTMLElement;
    const cardStep = firstCard ? firstCard.offsetWidth + 30 : 470;
    scroller.scrollBy({ left: cardStep, behavior: 'smooth' });
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
      aria-label="Featured projects"
      className="relative w-full py-8 md:py-12"
    >
      {/* Navigation Arrows (always active and infinite) */}
      <div className="pointer-events-none absolute inset-x-4 top-[calc(280px-32px+2rem)] sm:top-[calc(280px-32px+3rem)] z-20 flex justify-between px-2 sm:px-6">
        {/* Prev Arrow */}
        <motion.button
          type="button"
          onClick={handlePrev}
          aria-label="Previous project"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="pointer-events-auto hidden md:flex [@media(pointer:coarse)]:hidden h-16 w-16 items-center justify-center rounded-full border border-black/5 bg-white text-[#141413] shadow-lg transition-all duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        >
          <ChevronLeft className="h-7 w-7" />
        </motion.button>

        {/* Next Arrow */}
        <motion.button
          type="button"
          onClick={handleNext}
          aria-label="Next project"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="pointer-events-auto hidden md:flex [@media(pointer:coarse)]:hidden h-16 w-16 items-center justify-center rounded-full border border-black/5 bg-white text-[#141413] shadow-lg transition-all duration-200 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        >
          <ChevronRight className="h-7 w-7" />
        </motion.button>
      </div>

      {/* Horizontal Scroller with Infinite Repeating Cards */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="no-scrollbar flex w-full gap-[30px] overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 sm:px-12 lg:px-[max(2rem,calc((100vw-1250px)/2))] outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {REPEATED_ITEMS.map((item, index) => (
          <CarouselCard
            key={item.uniqueKey}
            item={item}
            displayIndex={index % carouselItems.length}
            total={carouselItems.length}
            onOpenModal={(item) => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Modal Dialog */}
      <WorkCaseModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

export default WorkCarousel;
