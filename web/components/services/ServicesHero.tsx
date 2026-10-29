'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function ServicesHero() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      router.push('/start-project');
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid company email address.');
      return;
    }

    router.push(`/start-project?email=${encodeURIComponent(trimmed)}`);
  };

  const floatUp = prefersReducedMotion
    ? {}
    : {
        animate: { y: [-6, 6, -6] },
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
      };

  const floatDown = prefersReducedMotion
    ? {}
    : {
        animate: { y: [6, -6, 6] },
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
      };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="mx-auto max-w-[1450px] px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column (55% / 7 cols) */}
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-bold leading-[1.05] tracking-tight text-[#141413] sm:text-5xl lg:text-[4.5rem]"
            >
              Ads that stop the scroll,{' '}
              <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent inline-block transition-transform hover:scale-105">
                polished
              </em>{' '}
              by experts
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[640px] text-lg leading-relaxed text-[#4A4945] sm:text-xl"
            >
              Static ads, carousels, and copy that are art-directed by experienced creatives,
              so you can launch and keep testing.
            </motion.p>

            {/* Email capture form */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 max-w-[650px]"
            >
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 rounded-2xl border border-[#141413]/15 bg-white p-2 shadow-sm transition focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/20"
              >
                <label htmlFor="hero-email" className="sr-only">
                  Your company email
                </label>
                <input
                  id="hero-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Your company email"
                  className="flex-1 bg-transparent px-4 py-3 text-base text-[#141413] placeholder-[#6B7280] outline-none"
                />
                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#141413] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                >
                  <span>Get started</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>

              {error && (
                <p role="alert" className="mt-2 text-sm text-rose-600">
                  {error}
                </p>
              )}
            </motion.div>
          </div>

          {/* Right Column: Tilted Decorative Collage (45% / 5 cols) */}
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:col-span-5 lg:max-w-none">
            <div
              className="relative aspect-[600/520] w-full"
              aria-hidden="true"
            >
              {/* Card 1: Left tilted (-6deg) */}
              <motion.div
                {...floatUp}
                className="absolute left-0 top-6 w-[56%] rounded-2xl bg-[#EDE9FE] p-2.5 shadow-xl -rotate-6 transition-transform duration-300 hover:scale-105"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-inner">
                  <Image
                    src="/services/slider/billie-print-ad-miss-pickle.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 240px, 300px"
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>

              {/* Card 2: Top Right tilted (+4deg) */}
              <motion.div
                {...floatDown}
                className="absolute right-0 top-0 w-[54%] rounded-2xl bg-[#FEF3C7] p-2.5 shadow-xl rotate-4 transition-transform duration-300 hover:scale-105 z-10"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-inner">
                  <Image
                    src="/services/slider/social-anjar-1.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 240px, 300px"
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>

              {/* Card 3: Bottom Center tilted (-2deg) */}
              <motion.div
                {...floatUp}
                className="absolute bottom-2 left-[24%] w-[58%] rounded-2xl bg-[#DCFCE7] p-2.5 shadow-2xl -rotate-2 transition-transform duration-300 hover:scale-105 z-20"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-inner">
                  <Image
                    src="/services/slider/folio-3.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 240px, 300px"
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
