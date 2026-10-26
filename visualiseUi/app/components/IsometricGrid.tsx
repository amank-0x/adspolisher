"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

export type GridCard = {
  id: string;
  title: string;
  category: string;
  image: string;
  accent: string;
  status: "Ready" | "Needs review" | "Draft";
};

type IsometricArtworkProps = {
  card: GridCard;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
};

export function IsometricArtwork({
  card,
  selected = false,
  onSelect,
  compact = false,
}: IsometricArtworkProps) {
  const content = (
    <>
      <span className="artwork-depth artwork-depth--one" aria-hidden="true" />
      <span className="artwork-depth artwork-depth--two" aria-hidden="true" />
      <span className="artwork-depth artwork-depth--three" aria-hidden="true" />
      <span className="artwork-image">
        <Image
          src={card.image}
          alt={`${card.title} ${card.category} preview`}
          fill
          sizes={compact ? "180px" : "300px"}
          priority={!compact}
        />
      </span>
      {!compact && (
        <span className="artwork-caption">
          <span>{card.category}</span>
          <strong>{card.title}</strong>
        </span>
      )}
    </>
  );

  if (onSelect) {
    return (
      <button
        className={`artwork-card ${selected ? "is-selected" : ""}`}
        style={{ "--accent": card.accent } as CSSProperties}
        type="button"
        onClick={onSelect}
        aria-label={`Select ${card.title}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className="artwork-card"
      style={{ "--accent": card.accent } as CSSProperties}
    >
      {content}
    </div>
  );
}

type IsometricGridProps = {
  cards: GridCard[];
  selectedId?: string;
  onSelect?: (card: GridCard) => void;
};

export function IsometricGrid({ cards, selectedId, onSelect }: IsometricGridProps) {
  return (
    <div className="isometric-grid" aria-label="Visual asset grid">
      {cards.map((card) => (
        <article className="grid-tile" key={card.id}>
          <IsometricArtwork
            card={card}
            selected={selectedId === card.id}
            onSelect={onSelect ? () => onSelect(card) : undefined}
          />
          <div className="tile-meta">
            <div>
              <span className="tile-kicker">{card.category}</span>
              <h3>{card.title}</h3>
            </div>
            <span className={`status status--${card.status.toLowerCase().replace(" ", "-")}`}>
              {card.status}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
