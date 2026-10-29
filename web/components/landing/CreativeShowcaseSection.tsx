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
        <div
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
                fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
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
                  fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
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

        </div>
      </div>

      {/* ── Slideshow (isolated iframe with full responsive height) ── */}
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
    </section>
  );
}
