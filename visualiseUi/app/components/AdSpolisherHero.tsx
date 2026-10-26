"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type AdTemplate = {
  title: string;
  subtitle: string;
  category: string;
  metric: string;
  header: string;
  accent: string;
  canvas: string;
  image: string;
};

const TEMPLATES: AdTemplate[] = [
  { title: "ROAST & CO. BLENDS", subtitle: "Specialty Coffee Acquisition", category: "META CAROUSEL", metric: "4.2x ROAS", header: "#D9480F", accent: "#F76707", canvas: "linear-gradient(135deg,#FFF4E6,#FFD8A8)", image: "/isometric/Dribbble/1.png" },
  { title: "DISCOVER ALPINE", subtitle: "Winter Gear Launch", category: "DISPLAY AD SUITE", metric: "+164% CTR", header: "#1D4ED8", accent: "#3B82F6", canvas: "linear-gradient(135deg,#DBEAFE,#93C5FD)", image: "/isometric/Dribbble/2.png" },
  { title: "ATELIER BRIDAL", subtitle: "Editorial Lookbook Campaign", category: "PAID SOCIAL HOOKS", metric: "-41% CPA", header: "#0F766E", accent: "#14B8A6", canvas: "linear-gradient(135deg,#CCFBF1,#99F6E4)", image: "/isometric/Dribbble/3.png" },
  { title: "CRIMSON STUDIO", subtitle: "Brand Identity & Paid Media", category: "AD CREATIVE", metric: "3.9x ROAS", header: "#B91C1C", accent: "#EF4444", canvas: "linear-gradient(135deg,#FEE2E2,#FCA5A5)", image: "/isometric/Dribbble/4.png" },
  { title: "S500 STUDIO AUDIO", subtitle: "Direct-to-Consumer Funnel", category: "CONVERSION ADS", metric: "5.4x ROAS", header: "#1E293B", accent: "#475569", canvas: "linear-gradient(135deg,#E2E8F0,#CBD5E1)", image: "/isometric/Dribbble/5.png" },
  { title: "SOLSTICE EYEWEAR", subtitle: "Summer Lookbook Paid Social", category: "TIKTOK & REELS", metric: "+215% ROAS", header: "#EA580C", accent: "#FB923C", canvas: "linear-gradient(135deg,#FFEDD5,#FDBA74)", image: "/isometric/Dribbble/6.png" },
  { title: "KINETIX RUN CLUB", subtitle: "Performance Footwear Ads", category: "DYNAMIC RETARGETING", metric: "$11.20 CAC", header: "#0284C7", accent: "#38BDF8", canvas: "linear-gradient(135deg,#E0F2FE,#7DD3FC)", image: "/isometric/Dribbble/7.png" },
  { title: "BOTANICA SKIN", subtitle: "Clean Beauty Acquisition", category: "UGC AD VARIATIONS", metric: "4.7x ROAS", header: "#15803D", accent: "#22C55E", canvas: "linear-gradient(135deg,#DCFCE7,#86EFAC)", image: "/isometric/Dribbble/8.png" },
  { title: "PULSE FINTECH", subtitle: "B2B Demand Gen Campaign", category: "LINKEDIN ADS", metric: "$14 CPL", header: "#6D28D9", accent: "#8B5CF6", canvas: "linear-gradient(135deg,#EDE9FE,#C4B5FD)", image: "/isometric/Dribbble/9.png" },
  { title: "LUMINA AUDIO PRO", subtitle: "Q4 Holiday Campaign", category: "YOUTUBE & META", metric: "6.1x ROAS", header: "#BE185D", accent: "#EC4899", canvas: "linear-gradient(135deg,#FCE7F3,#F9A8D4)", image: "/isometric/Dribbble/10.png" },
];

const COLS = 3;
const TOTAL_CARDS = 95;
const TOTAL_SLOTS = Math.ceil(TOTAL_CARDS / COLS) * COLS;
const TOTAL_ROWS = TOTAL_SLOTS / COLS;
const ROW_STRIDE = 330;
const CARDS: (AdTemplate | null)[] = Array.from({ length: TOTAL_SLOTS }, (_, index) =>
  index < TOTAL_CARDS ? TEMPLATES[index % TEMPLATES.length] : null,
);

export default function AdSpolisherHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let targetProgress = 0;
    let currentProgress = 0;
    let frameId = 0;
    let initialized = false;

    const updateProgress = () => {
      const track = trackRef.current;
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const scrollDistance = track.offsetHeight - window.innerHeight;
      const scrolledDistance = Math.max(0, -trackRect.top);
      targetProgress = scrollDistance > 0 ? Math.min(1, scrolledDistance / scrollDistance) : 0;
      if (!initialized) {
        currentProgress = targetProgress;
        initialized = true;
      }
    };

    const animate = () => {
      currentProgress += (targetProgress - currentProgress) * 0.02;
      if (Math.abs(targetProgress - currentProgress) < 0.00005) {
        currentProgress = targetProgress;
      }

      if (gridRef.current) {
        // Align the final row with the initial row's viewport position at the end of the track.
        const planeScale = Number.parseFloat(
          window.getComputedStyle(gridRef.current).getPropertyValue("--grid-scale"),
        ) || 1;
        const maxTravel = (TOTAL_ROWS - 1) * ROW_STRIDE * planeScale;
        const travelY = -currentProgress * maxTravel;
        gridRef.current.style.transform = `rotateX(52deg) rotateY(0deg) rotateZ(38deg) translate3d(0px, ${travelY}px, 0px) scale(var(--grid-scale, 1))`;
      }

      frameId = requestAnimationFrame(animate);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="iso-scroll-track" ref={trackRef}>
      <section className="iso-stage" aria-label="AdSpolisher scrollable creative showcase">
        <div className="iso-stage-grid" aria-hidden="true" />
        <div className="iso-stage-glow" aria-hidden="true" />

        <header className="stage-nav">
          <a className="stage-brand" href="#top" aria-label="AdSpolisher home">
            <span className="stage-brand-mark" aria-hidden="true"><i /><i /><i /></span>
            AdSpolisher
          </a>
          <nav aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#work">Our Work</a>
            <a href="#how">How It Works</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <a className="quote-button" href="#quote">Get a Quote</a>
        </header>

        <div className="iso-grid-viewport" aria-label="Scrollable ad creative grid">
          <div className="iso-grid-plane" ref={gridRef}>
            {CARDS.map((card, index) => {
              if (!card) return <div className="iso-card-placeholder" key={`final-slot-${index}`} aria-hidden="true" />;

              const style = {
                "--header": card.header,
                "--accent": card.accent,
                "--canvas": card.canvas,
              } as CSSProperties;

              return (
                <article className="iso-card" key={`ad-${index + 1}`} style={style}>
                  <div className="iso-card-header">
                    <div className="iso-card-label"><span>{card.category}</span><b>{card.metric}</b></div>
                    <div><h2>{card.title}</h2><p>{card.subtitle}</p></div>
                  </div>
                  <div className="iso-card-media">
                    <Image src={card.image} alt={card.title} fill sizes="236px" />
                    <span className="iso-card-badge">{card.metric} / AD #{String(index + 1).padStart(2, "0")}</span>
                    <span className="iso-card-art" aria-hidden="true"><i /><i /><i /></span>
                  </div>
                  <div className="iso-card-footer">
                    <div><i /><i /><i /></div>
                    <b>↗</b>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

      </section>
    </div>
  );
}
