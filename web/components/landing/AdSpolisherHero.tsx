"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
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
const TOTAL_CARDS = 45;
const TOTAL_SLOTS = Math.ceil(TOTAL_CARDS / COLS) * COLS;
const TOTAL_ROWS = TOTAL_SLOTS / COLS;
const ROW_STRIDE = 330;
const SCROLL_SPEED = 0.52;
const SCROLL_DISTANCE = ((TOTAL_ROWS - 1) * ROW_STRIDE) / SCROLL_SPEED;
const CARDS: (AdTemplate | null)[] = Array.from({ length: TOTAL_SLOTS }, (_, index) =>
  index < TOTAL_CARDS ? TEMPLATES[index % TEMPLATES.length] : null,
);

const IsoCard = memo(function IsoCard({ card, index }: { card: AdTemplate; index: number }) {
  const style = {
    "--header": card.header,
    "--accent": card.accent,
    "--canvas": card.canvas,
  } as CSSProperties;

  return (
    <article className="iso-card" style={style}>
      <div className="iso-card-header">
        <div className="iso-card-label"><span>{card.category}</span><b>{card.metric}</b></div>
        <div><h2>{card.title}</h2><p>{card.subtitle}</p></div>
      </div>
      <div className="iso-card-media">
        <Image src={card.image} alt={card.title} fill sizes="236px" />
        <span className="iso-card-badge">{card.metric} / AD #{String(index + 1).padStart(2, "0")}</span>
        <span className="iso-card-art" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="iso-card-footer"><div><i /><i /><i /></div><b>↗</b></div>
    </article>
  );
});

const SCROLL_STAGES = [
  { highlight: "More Growth.", description: "Scroll-stopping visuals for social, display, and paid campaigns." },
  { highlight: "Scroll-Stopping Ads.", description: "Sharper headlines, stronger hooks, and persuasive ad copy." },
  { highlight: "Smarter Campaigns.", description: "Audience positioning and creative direction built around your goals." },
  { highlight: "Higher ROAS.", description: "Find the friction in your ads and turn insights into better results." },
];

export default function AdSpolisherHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      setScrollProgress(targetProgress);
      if (!initialized) {
        currentProgress = targetProgress;
        initialized = true;
      }
    };

    const animate = () => {
      currentProgress += (targetProgress - currentProgress) * 0.07;
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
        gridRef.current.style.transform = `translate3d(-145px, 0px, 0px) rotateX(52deg) rotateY(0deg) rotateZ(38deg) translate3d(0px, ${travelY}px, 0px) scale(var(--grid-scale, 1))`;
      }

      if (heroRef.current) {
        const velocity = currentProgress - targetProgress;
        const tilt = Math.max(-3, Math.min(3, velocity * 100));
        const floatY = Math.sin(currentProgress * Math.PI * 8) * 2;
        heroRef.current.style.transform = `perspective(1200px) rotateX(${tilt}deg) translate3d(28px, ${78 + floatY}px, 0)`;
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

  const activeStageIndex = Math.min(SCROLL_STAGES.length - 1, Math.floor(scrollProgress * SCROLL_STAGES.length));
  const activeStage = SCROLL_STAGES[activeStageIndex];
  const activeCard = Math.min(TOTAL_CARDS, Math.max(1, Math.round(1 + scrollProgress * (TOTAL_CARDS - 1))));

  return (
    <div className="iso-scroll-track" ref={trackRef} style={{ "--scroll-distance": `${SCROLL_DISTANCE}px` } as CSSProperties}>
      <section className="iso-stage" aria-label="AdsPolisher scrollable creative showcase">
        <div className="iso-stage-grid" aria-hidden="true" />

        <header className="stage-nav stage-nav--floating">
          <a className="stage-brand" href="#top" aria-label="AdsPolisher home">
            <Image
              src="/logo/adspolisher_color.png"
              alt="AdsPolisher"
              width={170}
              height={54}
              className="stage-brand-logo"
              priority
            />
          </a>
          <nav className={`stage-nav-links${scrollProgress > 0.02 ? " is-scrolled" : ""}`} aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="/work">Our Work</a>
            <a href="#pricing">Pricing</a>
            <Link href="/become-a-creator">Become a Creator</Link>
            <Link href="/start-project">Request Project</Link>
            <span className="nav-progress-track" aria-hidden="true"><i style={{ width: `${scrollProgress * 100}%` }} /></span>
          </nav>
          <div className="stage-nav-actions">
            <Link className="creator-login-prompt" href="/creator/login">Are you a creator?</Link>
            <Link className="sign-in-button" href="/auth?mode=signin">Sign In</Link>
            <Link className="quote-button" href="/dashboard">Dashboard</Link>
          </div>
        </header>

        <div className="iso-grid-viewport" aria-label="Scrollable ad creative grid">
          <div className="iso-grid-plane" ref={gridRef}>
            {CARDS.map((card, index) => {
              if (!card) return <div className="iso-card-placeholder" key={`final-slot-${index}`} aria-hidden="true" />;
              return <IsoCard card={card} index={index} key={`ad-${index + 1}`} />;
            })}
          </div>
        </div>

        <div className="right-hero-wrap">
          <div className="right-hero-stage" ref={heroRef}>
            <span className="right-hero-eyebrow">Ad Creative &amp; Campaign Studio</span>
            <h1>Better Ads.<br />Stronger Brands.<br /><em key={activeStage.highlight}>{activeStage.highlight}</em></h1>
            <p className="right-hero-description" key={activeStage.description}>{activeStage.description}</p>
            <div className="right-hero-actions">
              <Link className="primary-action" href="/start-project">Start a Project <b>→</b></Link>
              <a className="secondary-action" href="#services">Explore Services</a>
            </div>
          </div>
        </div>

        <aside className="telemetry-pill" aria-label="Live ad showcase status">
          <span className="telemetry-live"><i /> Ad Showcase</span>
          <span className="telemetry-divider" />
          <span className="telemetry-counter">{String(activeCard).padStart(2, "0")} <small>/ {TOTAL_CARDS}</small></span>
          <a href="#services">Explore ↗</a>
          <span className="telemetry-progress"><i style={{ width: `${scrollProgress * 100}%` }} /></span>
        </aside>
      </section>
    </div>
  );
}
