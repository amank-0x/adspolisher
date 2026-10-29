"use client";

import { motion } from "motion/react";

export default function CreativeShowcaseSection() {
  return (
    <section
      id="creative-showcase"
      className="creative-showcase-section"
      aria-label="AdsPolisher projects and designs showcase"
      style={{
        position: "relative",
        width: "100%",
        background: "#f7f5f0",
        color: "var(--ink, #141413)",
        paddingTop: "clamp(64px, 7vw, 96px)",
        paddingBottom: "clamp(80px, 10vw, 140px)",
        overflow: "hidden",
      }}
    >
      {/* ── Zone 1: Section Header ── */}
      <div
        className="creative-showcase-container"
        style={{
          width: "min(1380px, calc(100% - 48px))",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="creative-showcase-header"
          style={{
            paddingBottom: "32px",
            borderBottom: "1px solid rgba(20, 20, 19, 0.10)",
          }}
        >
          {/* Left: eyebrow + headline */}
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            {/* Eyebrow */}
            <div
              className="creative-showcase-eyebrow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily:
                  "ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#D9480F",
                marginBottom: "16px",
              }}
            >
              <span
                className="creative-showcase-dot"
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "1px",
                  background: "#D9480F",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              FEATURED PROJECTS &amp; DESIGNS
            </div>

            {/* Headline */}
            <h2
              className="creative-showcase-headline"
              style={{
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
              }}
            >
              <span
                className="creative-showcase-headline-plain"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "clamp(30px, 3.8vw, 48px)",
                  fontWeight: 700,
                  color: "#141413",
                  display: "inline",
                }}
              >
                Explore our creative projects &amp; designs.
              </span>
              <em
                className="creative-showcase-headline-accent"
                style={{
                  fontFamily:
                    "'Playfair Display', Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(30px, 3.8vw, 48px)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#D9480F",
                  display: "inline",
                  marginLeft: "0.28em",
                }}
              >
                Built for real impact.
              </em>
            </h2>
          </div>
        </motion.div>
      </div>

      {/* ── Slideshow (isolated iframe with full responsive height) ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <iframe
          className="creative-showcase-iframe"
          src="/landing/diagonal-slideshow/index.html"
          title="AdsPolisher projects and designs showcase"
          allow="autoplay; fullscreen"
          style={{
            display: "block",
            width: "100%",
            height: "clamp(760px, 90vh, 960px)",
            border: "none",
            marginTop: "clamp(36px, 4vw, 56px)",
            background: "#f7f5f0",
          }}
        />
      </motion.div>
    </section>
  );
}
