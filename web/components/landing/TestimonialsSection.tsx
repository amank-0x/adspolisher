"use client";

import React from "react";

interface TestimonialItem {
  id: string;
  featured?: boolean;
  name: string;
  initials: string;
  role: string;
  company: string;
  city: string;
  serviceUsed: string;
  highlightMetric: string;
  accentColor: string;
  badgeBg: string;
  quote: string;
  contextNote: string;
  avatarUrl?: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "arjun-sharma",
    featured: true,
    name: "Arjun Sharma",
    initials: "AS",
    role: "Co-Founder & Growth Head",
    company: "VedaBotanics D2C",
    city: "Bengaluru",
    serviceUsed: "Creative Package · Meta & Reels",
    highlightMetric: "3.4x ROAS on New Hooks",
    accentColor: "#D9480F",
    badgeBg: "#FFEDD5",
    quote:
      "Before AdsPolisher, our Meta ads were hitting severe creative fatigue every two weeks. Their team took our raw product photos and delivered 12 scroll-stopping 4:5 and 9:16 variations with sharp Hindi-English Hinglish and English hooks in under 72 hours. Our thumb-stop rate jumped immediately.",
    contextNote: "Delivered 12 static + carousel creatives & 5 hook variations",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "priya-mehta",
    featured: true,
    name: "Priya Mehta",
    initials: "PM",
    role: "VP of Marketing",
    company: "Khatabook Flow SaaS",
    city: "Mumbai",
    serviceUsed: "Ad Audit & Optimization",
    highlightMetric: "-38% Lower CPL on LinkedIn",
    accentColor: "#1D4ED8",
    badgeBg: "#DBEAFE",
    quote:
      "We didn't need another vague agency retainer—we needed someone to tell us why our existing B2B ads weren't converting. AdsPolisher's frame-by-frame Ad Audit pinpointed exact visual hierarchy flaws and buried CTAs. We applied their redesign wireframes and cut our cost-per-lead by 38% in the first month.",
    contextNote: "Fixed-price Ad Audit + 6 redesigned LinkedIn & Display creatives",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "rohan-kulkarni",
    featured: false,
    name: "Rohan Kulkarni",
    initials: "RK",
    role: "Founder",
    company: "BrewCraft Roasters",
    city: "Pune",
    serviceUsed: "Ad Copywriting",
    highlightMetric: "+128% Click-Through Rate",
    accentColor: "#0F766E",
    badgeBg: "#CCFBF1",
    quote:
      "Our visuals looked good, but our ad copy read like a boring product catalog. The copywriting variations AdsPolisher wrote—especially the 3-second problem/solution hooks—completely changed how cold traffic responded to our starter kit offer.",
    contextNote: "15 direct-response headline & primary text angles",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "sneha-nair",
    featured: false,
    name: "Sneha Nair",
    initials: "SN",
    role: "Brand Director",
    company: "Zari & Aura Jewellery",
    city: "Jaipur",
    serviceUsed: "Custom Campaign Strategy",
    highlightMetric: "Festive Campaign in 72h",
    accentColor: "#6D28D9",
    badgeBg: "#EDE9FE",
    quote:
      "Launching our Diwali & bridal edit required luxury art direction that still converted on Instagram Stories. Having AI-assisted speed for multi-ratio resizing paired with a senior human art director meant zero compromise on brand aesthetics.",
    contextNote: "Full-funnel campaign strategy + multi-ratio festive suite",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "vikram-desai",
    featured: false,
    name: "Vikram Desai",
    initials: "VD",
    role: "Performance Marketing Lead",
    company: "FinStack India",
    city: "Delhi NCR",
    serviceUsed: "Creative Package",
    highlightMetric: "Zero Freelancer Delays",
    accentColor: "#D97706",
    badgeBg: "#FEF3C7",
    quote:
      "What stood out most is the clarity of scope. You submit a 5-minute brief, know the exact turnaround time and revision rounds upfront, and get organized, launch-ready files without chasing three different freelancers.",
    contextNote: "Repeat client across 3 quarterly product launches",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  },
];

function StarRating({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 fill-current"
          style={{ color }}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const featuredReviews = TESTIMONIALS.filter((t) => t.featured);
  const standardReviews = TESTIMONIALS.filter((t) => !t.featured);

  return (
    <section
      id="reviews"
      className="relative w-full border-t border-[#141413]/10 bg-[#F7F5F0] py-24 text-[#141413] lg:py-32"
      aria-label="Client reviews and outcomes"
    >
      <div className="mx-auto max-w-[1380px] px-6 md:px-12">
        {/* ===================================================================
            SECTION HEADER
           =================================================================== */}
        <div className="mb-14 border-b border-[#141413]/10 pb-8">
          <h2 className="text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-[#141413] sm:text-5xl lg:text-[3.4rem]">
            Trusted by fast-moving{" "}
            <span
              className="font-serif italic font-normal text-[#D9480F]"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, 'Times New Roman', serif",
              }}
            >
              brands &amp; founders.
            </span>
          </h2>
        </div>

        {/* ===================================================================
            TOP ROW: 2 FEATURED DEEP-DIVE TESTIMONIAL CARDS
           =================================================================== */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {featuredReviews.map((item) => (
            <article
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#141413]/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 right-0 left-0 h-1.5"
                style={{ backgroundColor: item.accentColor }}
              />

              <div>
                {/* Top Meta Row: Stars + Service & Outcome Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <StarRating color={item.accentColor} />

                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.accentColor,
                      }}
                    >
                      {item.highlightMetric}
                    </span>
                  </div>
                </div>

                {/* Quote Text */}
                <blockquote className="mt-6 text-base leading-[1.7] font-medium text-[#141413] sm:text-[17px]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                {/* Deliverable Context Bar */}
                <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F7F5F0] px-3.5 py-2 text-xs font-semibold text-[#52514E]">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.accentColor }}
                  />
                  <span>
                    <strong className="text-[#141413]">{item.serviceUsed}:</strong>{" "}
                    {item.contextNote}
                  </span>
                </div>
              </div>

              {/* Author Attribution Footer */}
              <div className="mt-8 flex items-center justify-between border-t border-[#141413]/10 pt-6">
                <div className="flex items-center gap-4">
                  {/* Avatar with automatic Indian Monogram Fallback */}
                  <div
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#141413]/15 font-bold text-white"
                    style={{ backgroundColor: item.accentColor }}
                  >
                    <span className="text-xs">{item.initials}</span>
                    {item.avatarUrl && (
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#141413]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#5A5852]">
                      {item.role},{" "}
                      <strong className="font-semibold text-[#141413]">
                        {item.company}
                      </strong>
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-[#141413]/10 bg-[#ECEAE4]/60 px-3 py-1 font-mono text-[10px] font-semibold text-[#52514E]">
                  📍 {item.city}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* ===================================================================
            BOTTOM ROW: 3 COMPACT REVIEW CARDS
           =================================================================== */}
        <div className="mt-7 grid grid-cols-1 gap-7 md:grid-cols-3">
          {standardReviews.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col justify-between rounded-[24px] border border-[#141413]/10 bg-[#ECEAE4]/55 p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <StarRating color={item.accentColor} />
                  <span
                    className="rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.accentColor,
                    }}
                  >
                    {item.highlightMetric}
                  </span>
                </div>

                <blockquote className="mt-5 text-sm leading-[1.68] text-[#2B2A27]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-7 border-t border-[#141413]/10 pt-5">
                <div className="flex items-center gap-3.5">
                  <div
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#141413]/15 text-xs font-bold text-white"
                    style={{ backgroundColor: item.accentColor }}
                  >
                    <span>{item.initials}</span>
                    {item.avatarUrl && (
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-xs font-bold text-[#141413]">
                        {item.name}
                      </h3>
                      <span className="font-mono text-[10px] text-[#6E6C66]">
                        {item.city}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-[#5A5852]">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
