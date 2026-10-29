"use client";

import Image from "next/image";
import { motion } from "motion/react";

type WhyPillar = {
  title: string;
  description: string;
  icon: "ai-human" | "tailored" | "scope" | "platform";
};

const PILLARS: WhyPillar[] = [
  {
    title: "AI-assisted speed with human quality control",
    description:
      "AI speeds up research, hook ideation and asset resizing. Experienced creatives review every deliverable for brand fit and quality.",
    icon: "ai-human",
  },
  {
    title: "Creative work tailored to your business",
    description:
      "Every concept, copy variation and campaign direction is shaped around your product, audience and goals.",
    icon: "tailored",
  },
  {
    title: "Clear deliverables and predictable scope",
    description:
      "Know what’s included before work begins, with defined packages, revision limits and turnaround expectations.",
    icon: "scope",
  },
  {
    title: "Your ad solutions in one place",
    description:
      "Bring creative production, copywriting, audits and campaign strategy together in one streamlined workflow.",
    icon: "platform",
  },
];

function SpotIcon({ type }: { type: WhyPillar["icon"] }) {
  return (
    <span className="why-icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === "ai-human" && (
          <>
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </>
        )}
        {type === "tailored" && (
          <>
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          </>
        )}
        {type === "scope" && (
          <>
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </>
        )}
        {type === "platform" && (
          <>
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" />
            <path d="M12 14c-3.5 0-6 2-6 4.5V20h12v-1.5c0-2.5-2.5-4.5-6-4.5z" />
            <circle cx="12" cy="10" r="2.5" fill="currentColor" />
          </>
        )}
      </svg>
    </span>
  );
}

export default function WhyAdSpolisherSection() {
  return (
    <section id="why-us" className="why-adspolisher-section">
      <div className="why-adspolisher-container">
        <div className="why-section-layout">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="why-section-intro"
          >
            <div>
              <h2>
                A full creative
                <br />
                partner,
                <br />
                <em>built</em> to scale
                <br />
                with yours
                <span aria-hidden="true" className="why-headline-spark">
                  ✦
                </span>
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.3 }}
              className="why-astronaut-artwork"
            >
              <Image
                src="/landing/experience-guy-astronaut.png"
                alt="AdsPolisher astronaut mascot holding a creative controller"
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 980px) 40vw, 36vw"
                className="why-astronaut-art"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.25,
                  staggerChildren: 0.14,
                },
              },
            }}
            className="why-pillars-grid"
          >
            {PILLARS.map((pillar) => (
              <motion.article
                key={pillar.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="why-pillar"
              >
                <SpotIcon type={pillar.icon} />
                <div className="why-pillar-copy">
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
