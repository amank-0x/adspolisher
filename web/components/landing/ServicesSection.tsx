"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { motion } from "motion/react";

type Service = {
  id: "creative" | "copywriting" | "audit" | "strategy" | "motion" | "landing";
  titlePlain: string;
  titleSerif: string;
  description: string;
  accent: string;
  tone: string;
  image: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    id: "creative",
    titlePlain: "Ad Creative &",
    titleSerif: "Design",
    description:
      "High-converting visuals for social, display and paid campaigns, shaped to stop the scroll and fit every placement.",
    accent: "#D9480F",
    tone: "#F5F3ED",
    image: "/landing/services/advertisement.png",
    imageAlt: "Promotional ad creative example",
  },
  {
    id: "copywriting",
    titlePlain: "Ad",
    titleSerif: "Copywriting",
    description:
      "Psychology-backed headlines, video hooks and persuasive primary text tailored to your audience, offer and brand voice.",
    accent: "#1D4ED8",
    tone: "#F0F4F8",
    image: "/landing/services/graphic-design.png",
    imageAlt: "Campaign artwork used alongside ad copy concepts",
  },
  {
    id: "audit",
    titlePlain: "Ad Audit &",
    titleSerif: "Optimization",
    description:
      "A focused review of your ads to uncover creative fatigue, visual bottlenecks and practical ways to improve performance.",
    accent: "#0F766E",
    tone: "#EEF7F6",
    image: "/landing/services/web-design.png",
    imageAlt: "Landing page example reviewed as part of an ad audit",
  },
  {
    id: "strategy",
    titlePlain: "Campaign",
    titleSerif: "Strategy",
    description:
      "Audience direction, messaging angles and a clear creative testing plan before you spend on media.",
    accent: "#6D28D9",
    tone: "#F3F0F8",
    image: "/landing/services/presentation-design.png",
    imageAlt: "Campaign planning presentation example",
  },
  {
    id: "motion",
    titlePlain: "Motion &",
    titleSerif: "Video Ads",
    description:
      "Engaging 9:16 and 4:5 motion clips built around strong first-three-second hooks for Meta, TikTok and YouTube.",
    accent: "#EA580C",
    tone: "#FFF7ED",
    image: "/landing/services/motion-graphics.mp4",
    imageAlt: "Motion graphics video preview",
  },
  {
    id: "landing",
    titlePlain: "Landing Page",
    titleSerif: "Design",
    description:
      "Focused landing page concepts that carry your ad message through to a clear offer, strong proof and one next step.",
    accent: "#141413",
    tone: "#ECEAE4",
    image: "/landing/services/web-design.png",
    imageAlt: "Landing page and website design example",
  },
];

function ArtworkImage({ service }: { service: Service }) {
  return (
    <Image
      src={service.image}
      alt={service.imageAlt}
      fill
      sizes="(max-width: 760px) 88vw, (max-width: 1100px) 44vw, 620px"
      className={`service-art-image ${service.id === "copywriting" ? "object-contain object-right-bottom" : ""}`}
    />
  );
}

function ServiceArtwork({ service }: { service: Service }) {
  switch (service.id) {
    case "creative":
      return (
        <div className="service-artwork service-artwork--creative" aria-hidden="true">
          <div className="creative-poster">
            <div className="creative-poster-header"><span>AD CREATIVE</span><b>3.8x ROAS</b></div>
            <div className="creative-poster-image"><ArtworkImage service={service} /></div>
            <div className="creative-poster-footer"><i /><i /><i /><strong>4:5 FEED</strong></div>
          </div>
          <div className="creative-tag"><span>HIGH-PERFORMANCE</span><b>PAID SOCIAL</b></div>
        </div>
      );
    case "copywriting":
      return (
        <div className="service-artwork service-artwork--copywriting" aria-hidden="true">
          <div className="copywriting-card">
            <div className="copywriting-headline"><span>PRIMARY TEXT</span><b>The ad that cuts through the noise.</b></div>
            <div className="copywriting-lines"><i /><i /><i /></div>
            <div className="copywriting-cta"><span>HOOK VARIATIONS</span><b>3 Options</b></div>
          </div>
          <div className="copywriting-accent-image"><ArtworkImage service={service} /></div>
        </div>
      );
    case "audit":
      return (
        <div className="service-artwork service-artwork--audit" aria-hidden="true">
          <div className="audit-sheet">
            <div className="audit-header"><span>CREATIVE AUDIT</span><b>Score: 84 / 100</b></div>
            <div className="audit-rows">
              <div><i>✓</i><span>Hook strength</span><b>Strong</b></div>
              <div><i>!</i><span>Offer clarity</span><b>Needs focus</b></div>
              <div><i>✓</i><span>Visual hierarchy</span><b>Optimized</b></div>
            </div>
            <div className="audit-verdict">3 critical improvements identified</div>
          </div>
        </div>
      );
    case "strategy":
      return (
        <div className="service-artwork service-artwork--strategy" aria-hidden="true">
          <div className="strategy-flow">
            <div className="strategy-node strategy-node--audience"><span>01 / AUDIENCE</span><b>Who needs this?</b></div>
            <i className="strategy-connector" />
            <div className="strategy-node strategy-node--message"><span>02 / MESSAGE</span><b>Why choose you?</b></div>
            <i className="strategy-connector" />
            <div className="strategy-node strategy-node--creative"><span>03 / CREATIVE</span><b>Test &amp; learn</b><div className="strategy-slide"><ArtworkImage service={service} /></div></div>
          </div>
          <div className="strategy-caption"><span>CAMPAIGN FRAMEWORK</span><b>Audience → Angle → Asset</b></div>
        </div>
      );
    case "motion":
      return (
        <div className="service-artwork service-artwork--motion" aria-hidden="true">
          <div className="motion-phone">
            <div className="motion-phone-screen">
              <video src="/landing/services/motion-graphics.mp4" poster={service.image} autoPlay muted loop playsInline preload="metadata" />
              <span className="motion-play">▶</span>
              <span className="motion-tag">9:16 / REELS</span>
            </div>
            <div className="motion-phone-home" />
          </div>
          <div className="motion-timeline"><span>HOOK</span><i /><i /><i /><b>00:15</b></div>
        </div>
      );
    case "landing":
      return (
        <div className="service-artwork service-artwork--landing" aria-hidden="true">
          <div className="landing-browser">
            <div className="landing-browser-bar"><i /><i /><i /><span>CAMPAIGN LANDING PAGE</span></div>
            <div className="landing-page-preview">
              <div className="landing-page-copy"><span>BUILT FOR YOUR NEXT CAMPAIGN</span><b>Make the next click count.</b><i /><i /><strong>Explore the offer ↗</strong></div>
              <div className="landing-page-image"><ArtworkImage service={service} /></div>
            </div>
            <div className="landing-proof"><span>✓ Clear message</span><span>✓ One next step</span><span>✓ Mobile ready</span></div>
          </div>
        </div>
      );
  }
}

export default function ServicesSection() {
  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="services-heading"
        >
          <h2>
            Browse our core <em>capabilities</em>
          </h2>
          <p className="services-intro">
            Creative and campaign support to turn your ideas into marketing that works.
          </p>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0.25,
                staggerChildren: 0.12,
              },
            },
          }}
          className="services-grid"
        >
          {SERVICES.map((service) => (
            <motion.article
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 26 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`service-card service-card--${service.id}`}
              style={
                {
                  "--service-accent": service.accent,
                  "--service-tone": service.tone,
                } as CSSProperties
              }
            >
              <div className="service-copy">
                <h3>
                  {service.titlePlain} <em>{service.titleSerif}</em>
                </h3>
                <p>{service.description}</p>
              </div>
              <ServiceArtwork service={service} />
              <Link className="service-link" href="/start-project">
                Explore service <span aria-hidden="true">↗</span>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
