'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import type { CarouselItem } from '@/lib/work-data';

interface WorkCaseModalProps {
  item: CarouselItem | null;
  onClose: () => void;
}

export function WorkCaseModal({ item, onClose }: WorkCaseModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (item) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video'
          );
          if (focusable.length > 0) {
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Focus close button or container initially
      const timer = setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>('button[aria-label="Close modal"]');
        closeBtn?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
        document.body.style.overflow = '';
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-case-title"
          aria-describedby="modal-case-caption"
        >
          {/* Dimmed backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header with Close Button */}
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
                  Case Study
                </span>
                <h2 id="modal-case-title" className="text-xl font-bold text-[#141413]">
                  {item.clientName}
                </h2>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-[#141413] transition hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Media Area */}
            <div className="relative flex max-h-[58vh] min-h-[300px] w-full items-center justify-center bg-[#141413] overflow-hidden">
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  playsInline
                  autoPlay
                  className="max-h-[58vh] w-full object-contain"
                />
              ) : (
                <div className="relative h-[58vh] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Caption Body */}
            <div className="overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Project Overview
              </h3>
              <p id="modal-case-caption" className="mt-2 text-base leading-relaxed text-[#4A4945] sm:text-lg">
                {item.caption}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default WorkCaseModal;
