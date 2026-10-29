"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function LandingPageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock body scroll during initial reveal
    document.body.style.overflow = "hidden";

    const startTime = performance.now();
    const duration = 900; // ms

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(rawProgress);

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
        }, 120);
      }
    };

    const animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="landing-loader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.75,
              ease: [0.77, 0, 0.175, 1], // cinematic cubic-bezier
            },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#141413] px-6 text-[#F7F5F0]"
          aria-label="Loading AdsPolisher"
        >
          {/* Subtle ambient radial glow behind brand */}
          <div
            className="pointer-events-none absolute h-[380px] w-[380px] rounded-full blur-[100px] opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(217, 72, 15, 0.5) 0%, rgba(245, 158, 11, 0.2) 60%, transparent 80%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mb-6"
            >
              <Image
                src="/logo/adspolisher_color.png"
                alt="AdsPolisher"
                width={190}
                height={60}
                priority
                className="h-12 w-auto object-contain brightness-105"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#ECEAE4]/60 sm:text-[13px]"
            >
              Engineered to convert · Built to stop the scroll
            </motion.p>

            {/* Progress Bar Container */}
            <div className="w-56 overflow-hidden rounded-full bg-white/10 p-0.5 sm:w-64">
              <motion.div
                className="h-1 rounded-full bg-gradient-to-r from-[#D9480F] via-[#F59E0B] to-[#D9480F]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Percentage counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-3 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-widest text-[#ECEAE4]/50"
            >
              <span>SYSTEM INITIALIZING</span>
              <span>·</span>
              <span className="text-[#F7F5F0]">{progress}%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
