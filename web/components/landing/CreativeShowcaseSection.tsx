import styles from "./CreativeShowcaseSection.module.css";

/** Keep the original VisualiseUI slideshow isolated from landing page styles. */
export default function CreativeShowcaseSection() {
  return (
    <section
      id="creative-showcase"
      className={styles.showcase}
      aria-label="AdSpolisher creative showcase"
    >
      <iframe
        className={styles.slideshow}
        src="/landing/diagonal-slideshow/index.html"
        title="AdSpolisher creative showcase"
        allow="autoplay; fullscreen"
      />
    </section>
  );
}
