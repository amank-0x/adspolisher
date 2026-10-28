import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagonal Stories | visualise",
  description: "A diagonal image slideshow for creative work in progress.",
};

export default function SlideshowPage() {
  return (
    <main style={{ width: "100%", height: "100svh", overflow: "hidden" }}>
      <iframe
        src="/diagonal-slideshow-source/index.html"
        title="Diagonal Slideshow"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </main>
  );
}
