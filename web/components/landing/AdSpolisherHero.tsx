"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        const mobileOffset = window.innerWidth <= 760 ? 0 : 78;
        heroRef.current.style.transform = `perspective(1200px) rotateX(${tilt}deg) translate3d(28px, ${mobileOffset + floatY}px, 0)`;
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

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
            <Link href="/services">Services</Link>
            <Link href="/work">Our Work</Link>
            <a href="#pricing">Pricing</a>
            <Link href="/become-a-creator">Become a Creator</Link>
            <Link href="/start-project" className="nav-request-project">Request Project</Link>
            <span className="nav-progress-track" aria-hidden="true"><i style={{ width: `${scrollProgress * 100}%` }} /></span>
          </nav>
          <div className="stage-nav-actions">
            <Link className="creator-login-prompt" href="/creator/login">Are you a creator?</Link>
            <Link className="sign-in-button" href="/auth?mode=signin">Sign In</Link>
            <Link className="quote-button" href="/dashboard">Dashboard</Link>
            <button
              type="button"
              className="stage-mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={20} />
            </button>
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

      {mobileMenuOpen && (
        <div className="stage-mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
          <button
            type="button"
            className="stage-mobile-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className="stage-mobile-menu-panel">
            <div className="stage-mobile-menu-header">
              <span>Menu</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">
                <X size={20} />
              </button>
            </div>
            <nav className="stage-mobile-menu-links" aria-label="Mobile primary navigation">
              <Link href="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/work" onClick={() => setMobileMenuOpen(false)}>Our Work</Link>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <Link href="/become-a-creator" onClick={() => setMobileMenuOpen(false)}>Become a Creator</Link>
              <Link href="/start-project" onClick={() => setMobileMenuOpen(false)} className="is-primary">Request Project <span>→</span></Link>
              <div className="stage-mobile-menu-divider" />
              <Link href="/creator/login" onClick={() => setMobileMenuOpen(false)}>Are you a creator?</Link>
              <Link href="/auth?mode=signin" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            </nav>
          </div>
        </div>
      )}

      <a
        className="whatsapp-pill"
        href="https://wa.me/918051401448"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect with AdsPolisher on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.54 0 .22 5.32.22 11.86c0 2.09.55 4.13 1.59 5.93L.12 24l6.35-1.66a11.86 11.86 0 0 0 5.61 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.43-8.42Zm-8.44 18.26h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.86 9.86 0 0 1-1.51-5.23C2.18 6.42 6.61 2 12.08 2a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.47-4.45 9.84-9.9 9.84Zm5.41-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
        <span>Connect with WhatsApp</span>
        <b aria-hidden="true">↗</b>
      </a>
    </div>
  );
}
