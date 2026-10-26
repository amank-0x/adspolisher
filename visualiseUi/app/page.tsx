"use client";

import { useMemo, useState } from "react";
import AdSpolisherHero from "./components/AdSpolisherHero";
import { IsometricGrid, type GridCard } from "./components/IsometricGrid";

const cards: GridCard[] = [
  {
    id: "aurora-launch",
    title: "Aurora launch",
    category: "Campaign",
    image: "/isometric/Dribbble1/1.jpg",
    accent: "#e8b78f",
    status: "Ready",
  },
  {
    id: "studio-notes",
    title: "Studio notes",
    category: "Editorial",
    image: "/isometric/Dribbble1/2_1.jpg",
    accent: "#8bc2c4",
    status: "Needs review",
  },
  {
    id: "weekend-edit",
    title: "Weekend edit",
    category: "Social",
    image: "/isometric/Dribbble1/3.jpg",
    accent: "#c69db5",
    status: "Draft",
  },
  {
    id: "field-notes",
    title: "Field notes",
    category: "Photography",
    image: "/isometric/Dribbble1/4_2.jpg",
    accent: "#b9aa7b",
    status: "Ready",
  },
  {
    id: "soft-signal",
    title: "Soft signal",
    category: "Campaign",
    image: "/isometric/Dribbble1/1_1.jpg",
    accent: "#9cb4d5",
    status: "Needs review",
  },
  {
    id: "north-star",
    title: "North star",
    category: "Brand",
    image: "/isometric/Dribbble1/2.jpg",
    accent: "#d2a777",
    status: "Ready",
  },
];

const filters = ["All work", "Campaign", "Editorial", "Social"];

export default function Home() {
  const [filter, setFilter] = useState("All work");
  const [selectedId, setSelectedId] = useState(cards[0].id);

  const visibleCards = useMemo(
    () => (filter === "All work" ? cards : cards.filter((card) => card.category === filter)),
    [filter],
  );

  const selectedCard = cards.find((card) => card.id === selectedId) ?? cards[0];

  return (
    <main className="visualise-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Visualise home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          visualise<span className="brand-dot">.</span>
        </a>
        <div className="topbar-links">
          <a className="active" href="#library">Library</a>
          <a href="#insights">Insights</a>
          <a href="#about">About</a>
        </div>
        <button className="profile-button" type="button" aria-label="Open profile menu">
          <span>AK</span>
          <b>⌄</b>
        </button>
      </nav>

      <AdSpolisherHero />

      <section className="proof-bar" id="services" aria-label="AdSpolisher principles">
        <span>Strategy-led creative</span><i />
        <span>Platform-native thinking</span><i />
        <span>Built for measurable growth</span>
      </section>

      <section className="library-section" id="library">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> The library</p>
            <h2>Recent pieces</h2>
          </div>
          <p className="section-description">Six fragments from the studio. Hover to unfold each one, select to keep it in focus.</p>
        </div>

        <div className="library-toolbar">
          <div className="filter-list" role="tablist" aria-label="Filter library">
            {filters.map((item) => (
              <button
                className={filter === item ? "filter-button is-active" : "filter-button"}
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="library-count">{visibleCards.length.toString().padStart(2, "0")} assets</span>
        </div>

        <IsometricGrid cards={visibleCards} selectedId={selectedId} onSelect={(card) => setSelectedId(card.id)} />

        <div className="selection-bar" id="insights" aria-live="polite">
          <div className="selection-swatch" style={{ background: selectedCard.accent }} />
          <div><span>In focus</span><strong>{selectedCard.title}</strong></div>
          <span className="selection-meta">{selectedCard.category} / {selectedCard.status}</span>
          <button type="button" onClick={() => setSelectedId(cards[(cards.findIndex((card) => card.id === selectedId) + 1) % cards.length].id)}>
            Next piece <span>→</span>
          </button>
        </div>
      </section>

      <footer className="footer" id="about">
        <span>visualise / a small archive for big ideas</span>
        <span>Built around the isometric grid</span>
      </footer>
    </main>
  );
}
