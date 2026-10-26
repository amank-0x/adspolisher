"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type LayoutType = "split" | "hero-banner" | "poster";

type BaseCard = {
  title: string;
  subtitle: string;
  category: string;
  metric: string;
  headerBg: string;
  accentColor: string;
  imageUrl: string;
  layoutType: LayoutType;
};

type GridCell = { id: string; type: "empty" } | { id: string; type: "card"; card: BaseCard };

const BASE_AD_CARDS: BaseCard[] = [
  { title: "ROAST & CO. BLENDS", subtitle: "Specialty Coffee Campaign", category: "META CAROUSEL", metric: "4.2x ROAS", headerBg: "#D9480F", accentColor: "#F76707", imageUrl: "/isometric/Dribbble/1.png", layoutType: "hero-banner" },
  { title: "DISCOVER ALPINE", subtitle: "Adventure Gear Launch", category: "DISPLAY SUITE", metric: "+164% CTR", headerBg: "#1D4ED8", accentColor: "#3B82F6", imageUrl: "/isometric/Dribbble/2.png", layoutType: "poster" },
  { title: "ATELIER WEDDING", subtitle: "Bridal Editorial Ads", category: "SOCIAL VIDEO HOOKS", metric: "-41% CPA", headerBg: "#0F766E", accentColor: "#14B8A6", imageUrl: "/isometric/Dribbble/3.png", layoutType: "split" },
  { title: "CRIMSON STUDIO", subtitle: "Brand Identity & Paid Social", category: "AD CREATIVE", metric: "3.9x ROAS", headerBg: "#B91C1C", accentColor: "#EF4444", imageUrl: "/isometric/Dribbble/4.png", layoutType: "hero-banner" },
  { title: "S500 CUSTOM AUDIO", subtitle: "Product Launch Funnel", category: "CONVERSION ADS", metric: "5.4x ROAS", headerBg: "#1E293B", accentColor: "#475569", imageUrl: "/isometric/Dribbble/5.png", layoutType: "poster" },
  { title: "SOLSTICE EYEWEAR", subtitle: "Summer Lookbook Paid Media", category: "TIKTOK & REELS", metric: "+215% ROAS", headerBg: "#EA580C", accentColor: "#FB923C", imageUrl: "/isometric/Dribbble/6.png", layoutType: "split" },
  { title: "KINETIX RUN CLUB", subtitle: "Performance Footwear", category: "DYNAMIC RETARGETING", metric: "$11.20 CAC", headerBg: "#0284C7", accentColor: "#38BDF8", imageUrl: "/isometric/Dribbble/7.png", layoutType: "hero-banner" },
  { title: "BOTANICA SKIN", subtitle: "Clean Beauty Acquisition", category: "UGC AD VARIATIONS", metric: "4.7x ROAS", headerBg: "#15803D", accentColor: "#22C55E", imageUrl: "/isometric/Dribbble/8.png", layoutType: "poster" },
  { title: "PULSE FINTECH", subtitle: "B2B Demand Generation", category: "LINKEDIN ADS", metric: "$14 CPL", headerBg: "#7C3AED", accentColor: "#A78BFA", imageUrl: "/isometric/Dribbble/9.png", layoutType: "split" },
  { title: "LUMINA AUDIO PRO", subtitle: "Product Story System", category: "AD COPY & HOOKS", metric: "2.9M VIEWS", headerBg: "#A21CAF", accentColor: "#E879F9", imageUrl: "/isometric/Dribbble/10.png", layoutType: "hero-banner" },
];

function buildConnectedGrid(): GridCell[] {
  const cells: GridCell[] = [];
  let cardCounter = 0;

  for (let row = 0; row < 13; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const structuralSlot =
        (row === 0 && column <= 1) ||
        (row === 1 && column === 0) ||
        (row === 2 && column === 0) ||
        (row === 4 && column === 0);

      if (structuralSlot) {
        cells.push({ id: `cell-${row}-${column}`, type: "empty" });
      } else {
        cells.push({ id: `cell-${row}-${column}`, type: "card", card: BASE_AD_CARDS[cardCounter % BASE_AD_CARDS.length] });
        cardCounter += 1;
      }
    }
  }

  return cells;
}

const CONNECTED_GRID_CELLS = buildConnectedGrid();

export default function AdSpolisherHero() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let targetScroll = window.scrollY;
    let currentScroll = targetScroll;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let rafId = 0;

    const onScroll = () => {
      targetScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.min(1, targetScroll / maxScroll) : 0);
    };

    const onMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 24;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 24;
    };

    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * 0.085;
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      if (gridRef.current) {
        gridRef.current.style.transform = `rotateX(56deg) rotateY(0deg) rotateZ(-45deg) translate3d(${currentMouseX}px, ${-currentScroll * 0.95 + currentMouseY}px, 0px) scale(var(--grid-scale, 1))`;
      }

      rafId = requestAnimationFrame(animate);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="iso-scroll-track">
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

        <div className="iso-copy">
          <div className="iso-copy-inner">
            <p className="iso-eyebrow"><span /> AD CREATIVE &amp; CAMPAIGN STUDIO</p>
            <h1>Better Ads.<br />Stronger Brands.<br /><em>More Growth.</em></h1>
            <p className="iso-summary">From scroll-stopping creatives to smarter ad campaigns, we help businesses turn ideas into marketing that works.</p>
            <div className="iso-actions">
              <a className="iso-button iso-button--primary" href="#quote">Start a Project <span>→</span></a>
              <a className="iso-button iso-button--secondary" href="#services">Explore Services</a>
            </div>
            <div className="iso-scroll-status">
              <span className="iso-pulse" />
              <strong>Scrollable Ad Grid</strong>
              <span className="iso-progress"><i style={{ width: `${Math.max(8, scrollProgress * 100)}%` }} /></span>
            </div>
          </div>
        </div>

        <div className="iso-grid-viewport" aria-label="Scrollable ad creative grid">
          <div className="iso-grid-plane" ref={gridRef}>
            {CONNECTED_GRID_CELLS.map((cell) => {
              if (cell.type === "empty") {
                return <div className="iso-grid-empty" key={cell.id} aria-hidden="true" />;
              }

              const card = cell.card;
              const cardStyle = { "--header": card.headerBg, "--accent": card.accentColor } as CSSProperties;

              return (
                <article className={`iso-card iso-card--${card.layoutType}`} key={cell.id} style={cardStyle}>
                  <div className="iso-card-header">
                    <div className="iso-card-label"><span>{card.category}</span><b>{card.metric}</b></div>
                    <div><h2>{card.title}</h2><p>{card.subtitle}</p></div>
                  </div>
                  <div className="iso-card-media">
                    <Image src={card.imageUrl} alt={card.title} fill sizes="300px" />
                    <span>Live Campaign</span>
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
