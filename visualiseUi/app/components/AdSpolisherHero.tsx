"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type GridItem =
  | { id: string; type: "empty" }
  | {
      id: string;
      type: "card";
      title: string;
      category: string;
      metric: string;
      accentColor: string;
      imageUrl: string;
    };

const ISOMETRIC_ITEMS: GridItem[] = [
  { id: "slot-01", type: "empty" },
  { id: "aura", type: "card", title: "Aura Skincare Q4", category: "Meta Ad Creative", metric: "3.8x ROAS", accentColor: "#E85D04", imageUrl: "/isometric/Dribbble/1.png" },
  { id: "kinetix", type: "card", title: "Kinetix Run Club", category: "Campaign Strategy", metric: "+142% CTR", accentColor: "#2563EB", imageUrl: "/isometric/Dribbble/2.png" },
  { id: "roast", type: "card", title: "Roast & Co. Blends", category: "Social Carousel", metric: "-38% CPA", accentColor: "#9A3412", imageUrl: "/isometric/Dribbble/3.png" },
  { id: "slot-02", type: "empty" },
  { id: "slot-03", type: "empty" },
  { id: "veloce", type: "card", title: "Veloce Electric", category: "Display Ad Suite", metric: "4.2x ROAS", accentColor: "#059669", imageUrl: "/isometric/Dribbble/4.png" },
  { id: "lumina", type: "card", title: "Lumina Audio Pro", category: "Ad Copy & Hooks", metric: "2.9M Views", accentColor: "#4F46E5", imageUrl: "/isometric/Dribbble/5.png" },
  { id: "slot-04", type: "empty" },
  { id: "nordic", type: "card", title: "Nordic Minimal", category: "Ad Audit & Redesign", metric: "+89% Conv.", accentColor: "#0D9488", imageUrl: "/isometric/Dribbble/6.png" },
  { id: "solstice", type: "card", title: "Solstice Eyewear", category: "Lookbook Ads", metric: "5.1x ROAS", accentColor: "#D97706", imageUrl: "/isometric/Dribbble/7.png" },
  { id: "pulse", type: "card", title: "Pulse Fintech", category: "B2B LinkedIn Ads", metric: "$14 CPL", accentColor: "#7C3AED", imageUrl: "/isometric/Dribbble/8.png" },
  { id: "oasis", type: "card", title: "Oasis Hydration", category: "UGC Hook Variations", metric: "+210% ROAS", accentColor: "#0284C7", imageUrl: "/isometric/Dribbble/9.png" },
  { id: "atelier", type: "card", title: "Atelier Fragrance", category: "Brand Launch Ads", metric: "3.4x ROAS", accentColor: "#BE185D", imageUrl: "/isometric/Dribbble/10.png" },
  { id: "terra", type: "card", title: "Terra Outdoor", category: "Seasonal Campaign", metric: "+64% AOV", accentColor: "#15803D", imageUrl: "/isometric/Dribbble/1.png" },
  { id: "hyperion", type: "card", title: "Hyperion SaaS", category: "Conversion Creative", metric: "-45% CAC", accentColor: "#1D4ED8", imageUrl: "/isometric/Dribbble/2.png" },
  { id: "solace", type: "card", title: "Solace Home", category: "Performance Refresh", metric: "+76% CVR", accentColor: "#B45309", imageUrl: "/isometric/Dribbble/3.png" },
  { id: "atlas", type: "card", title: "Atlas Mobility", category: "Launch Storyboard", metric: "2.6x ROAS", accentColor: "#0F766E", imageUrl: "/isometric/Dribbble/4.png" },
  { id: "morrow", type: "card", title: "Morrow Finance", category: "Paid Social System", metric: "-31% CPA", accentColor: "#4338CA", imageUrl: "/isometric/Dribbble/5.png" },
  { id: "kindred", type: "card", title: "Kindred Market", category: "Creator Ad Kit", metric: "+118% CTR", accentColor: "#C2410C", imageUrl: "/isometric/Dribbble/6.png" },
];

export default function AdSpolisherHero() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    const handleMouseMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;
        const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;
        setMouseOffset({ x: normalizedX * 18, y: normalizedY * 18 });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="ad-hero" id="top">
      <div className="ad-hero-lines" aria-hidden="true" />
      <div className="ad-hero-glow" aria-hidden="true" />

      <div className="ad-hero-copy">
        <div className="ad-hero-copy-inner">
          <p className="ad-eyebrow"><span /> AD CREATIVE &amp; CAMPAIGN STUDIO</p>
          <h1>Better Ads.<br />Stronger Brands.<br /><em>More Growth.</em></h1>
          <p className="ad-hero-summary">
            From scroll-stopping creatives to smarter ad campaigns, we help businesses turn ideas into marketing that works.
          </p>
          <div className="ad-hero-actions">
            <a className="ad-button ad-button--primary" href="#library">Start a Project <span>→</span></a>
            <a className="ad-button ad-button--secondary" href="#services">Explore Services</a>
          </div>
          <div className="ad-trust-strip">
            <span><strong>AI-Assisted</strong> Speed</span>
            <i />
            <span><strong>100% Human</strong> Quality Control</span>
            <i />
            <span><strong>48–72h</strong> Turnaround</span>
          </div>
        </div>
      </div>

      <div className="ad-grid-canvas" aria-label="Recent AdSpolisher creative work">
        <div
          className="ad-grid-plane"
          style={{ transform: `rotateX(58deg) rotateZ(-42deg) translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)` }}
        >
          {ISOMETRIC_ITEMS.map((item) => {
            if (item.type === "empty") {
              return <div className="ad-grid-slot" key={item.id} aria-hidden="true" />;
            }

            return (
              <article className="ad-grid-card" key={item.id} style={{ "--accent": item.accentColor } as CSSProperties}>
                <div className="ad-grid-card-visual">
                  <Image src={item.imageUrl} alt={item.title} fill sizes="280px" />
                  <span className="ad-metric">{item.metric}</span>
                </div>
                <div className="ad-grid-card-footer">
                  <div><p>{item.category}</p><h2>{item.title}</h2></div>
                  <span className="ad-card-arrow">↗</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
