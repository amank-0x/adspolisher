import Image from "next/image";
import type { CSSProperties } from "react";

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
    titlePlain: "Motion Graphics &",
    titleSerif: "Video Ads",
    description:
      "Short-form motion and video ad variations built to catch attention across Reels, TikTok, YouTube and paid social.",
    accent: "#BE185D",
    tone: "#F7F0F3",
    image: "/landing/services/advertisement.png",
    imageAlt: "Promotional campaign artwork for motion ad concepts",
  },
  {
    id: "landing",
    titlePlain: "Landing Page",
    titleSerif: "Design",
    description:
      "Focused landing page concepts that carry your ad message through to a clear offer, strong proof and one next step.",
    accent: "#B45309",
    tone: "#F6F2E9",
    image: "/landing/services/web-design.png",
    imageAlt: "Landing page and website design example",
  },
];

function ArtworkImage({ service, className = "" }: { service: Service; className?: string }) {
  return (
    <Image
      src={service.image}
      alt={service.imageAlt}
      fill
      sizes="(max-width: 760px) 88vw, (max-width: 1100px) 44vw, 620px"
      className={`service-art-image ${className}`}
    />
  );
}

function ServiceArtwork({ service }: { service: Service }) {
  switch (service.id) {
    case "creative":
      return (
        <div className="service-artwork service-artwork--creative" aria-hidden="true">
          <div className="creative-sheet creative-sheet--back">
            <span className="creative-sheet-back-label">SOCIAL / 9:16</span>
            <div className="creative-sheet-back-art"><i /><i /><b>YOUR NEXT<br />BIG IDEA</b></div>
          </div>
          <div className="creative-sheet creative-sheet--front">
            <div className="creative-sheet-top"><span>CAMPAIGN CREATIVE</span><b>4:5</b></div>
            <div className="creative-sheet-image"><ArtworkImage service={service} /></div>
            <div className="creative-sheet-bottom"><span>Designed to convert</span><b>↗</b></div>
          </div>
        </div>
      );
    case "copywriting":
      return (
        <div className="service-artwork service-artwork--copy" aria-hidden="true">
          <div className="copy-document">
            <div className="mock-window-bar"><i /><i /><i /><span>HOOK TEST / META</span></div>
            <div className="copy-variant copy-variant--first">
              <div className="copy-variant-heading"><b>HOOK A · PAIN POINT</b><span>01</span></div>
              <p>Still spending on ads that people scroll past?</p>
              <div className="copy-lines"><i /><i /></div>
            </div>
            <div className="copy-variant copy-variant--winner">
              <div className="copy-variant-heading"><b>HOOK B · SOCIAL PROOF</b><span>WINNER</span></div>
              <p>Make every campaign creative count.</p>
              <div className="copy-lines"><i /><i /></div>
            </div>
            <div className="copy-document-foot"><span>PRIMARY TEXT · 3 VARIATIONS</span><div><ArtworkImage service={service} /></div></div>
          </div>
        </div>
      );
    case "audit":
      return (
        <div className="service-artwork service-artwork--audit" aria-hidden="true">
          <div className="audit-panel audit-panel--before">
            <span className="audit-panel-label">CURRENT CREATIVE</span>
            <div className="audit-thumb"><ArtworkImage service={service} /></div>
            <div className="audit-metric"><span>CTR</span><b>0.8%</b><i /></div>
            <div className="audit-metric"><span>CONVERSION</span><b>1.2%</b><i /></div>
          </div>
          <div className="audit-arrow" aria-hidden="true">→</div>
          <div className="audit-panel audit-panel--after">
            <span className="audit-panel-label">CREATIVE DIRECTION</span>
            <div className="audit-chart"><i /><i /><i /><i /><i /><i /></div>
            <div className="audit-result"><span>KEY OPPORTUNITY</span><b>Clearer offer + stronger hook</b></div>
            <span className="audit-improvement">OPTIMIZATION PLAN</span>
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
        <header className="services-heading">
          <h2>Browse our core <em>capabilities</em></h2>
          <p className="services-intro">
            Creative and campaign support to turn your ideas into marketing that works.
          </p>
        </header>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className={`service-card service-card--${service.id}`}
              style={{ "--service-accent": service.accent, "--service-tone": service.tone } as CSSProperties}
            >
              <div className="service-copy">
                <h3>{service.titlePlain} <em>{service.titleSerif}</em></h3>
                <p>{service.description}</p>
              </div>
              <ServiceArtwork service={service} />
              <a className="service-link" href="#quote">
                Explore service <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
