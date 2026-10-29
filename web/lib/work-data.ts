export type CarouselItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  clientName: string;
  caption: string;
};

export type FameItem = {
  id: string;
  image: string;
  alt: string;
  reviewerName: string;
  avatar?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
};

export type ReviewItem = {
  id: string;
  image: string;
  alt: string;
  title: string;
  excerpt: string;
  reviewerName: string;
  avatar?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  stats: {
    concepts: number;
    revisions: number;
    delivered: number;
    turnaroundHours: number;
  };
};

export const carouselItems: CarouselItem[] = [
  {
    id: "bison-401k",
    type: "image",
    src: "/work/slide/Bison-Managed-401k-Thumbnail.jpg",
    alt: "Bison Managed 401k ad creative",
    clientName: "Bison Wealth",
    caption:
      "Client asked us to craft clean, confidence-inspiring paid social creatives explaining employer-sponsored retirement benefits without complex financial jargon.",
  },
  {
    id: "toyota-innovations",
    type: "video",
    src: "/work/slide/Toyota-Innovations-Square-option-2.mp4",
    poster: "/work/slide/Toyota-Innovations-poster.jpg",
    alt: "Toyota Innovations motion ad creative",
    clientName: "Toyota Mobility",
    caption:
      "Client asked us to build dynamic short-form motion sequences highlighting electric drivetrain innovations and next-gen safety suites across Meta & YouTube Shorts.",
  },
  {
    id: "cooper-fence",
    type: "image",
    src: "/work/slide/CooperFence-BishopeState.jpg",
    alt: "Cooper Fence architectural display creative",
    clientName: "Cooper Fence Co.",
    caption:
      "Client asked us to design high-converting local service banners showcasing premium residential fencing installations with instant estimate callouts.",
  },
  {
    id: "briefly-visuals",
    type: "image",
    src: "/work/slide/Dynamic-Visual-Language-at-Every-Post-Briefly.jpg",
    alt: "Briefly brand visual identity and social posts",
    clientName: "Briefly AI",
    caption:
      "Client asked us to establish a cohesive, modular visual design system across daily feed assets, carousel breakdowns, and feature announcements.",
  },
  {
    id: "hardies-nostalgic",
    type: "video",
    src: "/work/slide/Nostalgic-Energy-for-Instant-Impact-Hardies-2.mp4",
    poster: "/work/slide/Nostalgic-Energy-poster.jpg",
    alt: "Hardies nostalgic energy motion campaign",
    clientName: "Hardies Direct",
    caption:
      "Client asked us to produce high-tempo nostalgic video teasers engineered for instant hook retention in the first 1.5 seconds of user feeds.",
  },
  {
    id: "soto-graphics",
    type: "image",
    src: "/work/slide/Minimal-Graphics-for-Modern-Appeal-Soto.jpg",
    alt: "Soto modern minimalist graphics suite",
    clientName: "Soto Living",
    caption:
      "Client asked us to create minimalist, editorial-grade product graphics that elevate everyday home essentials into luxury lifestyle statement pieces.",
  },
  {
    id: "rocketx-energy",
    type: "video",
    src: "/work/slide/RocketX-Energy-Thumbnail.mp4",
    poster: "/work/slide/RocketX-Energy-poster.jpg",
    alt: "RocketX high-velocity performance motion creative",
    clientName: "RocketX Media",
    caption:
      "Client asked us to design kinetic, high-velocity motion ads optimized for gaming and esports demographics to maximize app install rates.",
  },
  {
    id: "dawn-heidlebaugh",
    type: "image",
    src: "/work/slide/Dawn-Heidlebaugh-Social-2.jpg",
    alt: "Dawn Heidlebaugh personal brand campaign",
    clientName: "Dawn Heidlebaugh Group",
    caption:
      "Client asked us to produce premium personal brand campaign banners with crisp typographic hierarchy for high-end advisory services.",
  },
];

export const fameItems: FameItem[] = [
  {
    id: "elvis-lives",
    image: "/work/wall-of-fame/Elvis-Lives-A-Star-Spangled-Tribute-3-1024x845.jpg",
    alt: "Elvis Lives tribute social media set",
    reviewerName: "Marcus Vance",
    rating: 5,
    quote:
      "AdsPolisher brought electric tribute energy to our nationwide tour launch. Our click-through rate jumped 2.8x in the first week.",
  },
  {
    id: "mmw-social",
    image: "/work/wall-of-fame/MMW-Social-Media-Posts-July-2026.jpg",
    alt: "MMW creative campaign posts",
    reviewerName: "Priya Sharma",
    rating: 5,
    quote:
      "Every single post delivered ready-to-run variations with clean editorial framing. It turned our summer campaign into our best quarter yet.",
  },
  {
    id: "ny-knicks",
    image: "/work/wall-of-fame/NY-Knicks-Post.jpg",
    alt: "High-contrast sports social graphic",
    reviewerName: "Devon Miller",
    rating: 5,
    quote:
      "Bold court-side contrast and sharp typography that stopped scrollers instantly. Exceptional attention to detail on the color grading.",
  },
  {
    id: "night-swim",
    image: "/work/wall-of-fame/Night-Swim-PSSC.jpg",
    alt: "Night Swim event poster and social banner",
    reviewerName: "Elena Rostova",
    rating: 5,
    quote:
      "Captured the moody, atmospheric luxury vibe effortlessly. Our ticket reservation conversions increased immediately after launch.",
  },
  {
    id: "jess-review",
    image: "/work/wall-of-fame/Jess-Review-6.25.jpg",
    alt: "Creative brand assets showcase",
    reviewerName: "Jessica Hayes",
    rating: 5,
    quote:
      "Flawless communication, precise adherence to brand guidelines, and swift 48-hour delivery on all required asset formats.",
  },
  {
    id: "brg-commercial",
    image: "/work/wall-of-fame/Month-6-Updated-BRG-Commercial-SM-Posts-2026.jpg",
    alt: "BRG commercial property marketing assets",
    reviewerName: "Aarav Patel",
    rating: 5,
    quote:
      "Commercial real estate ads usually look dull, but AdsPolisher gave our listings an architectural, high-end feel that attracted serious buyers.",
  },
  {
    id: "cordova-lanes",
    image: "/work/wall-of-fame/Cordova-Lanes.jpg",
    alt: "Cordova Lanes entertainment ad creative",
    reviewerName: "Brett Holloway",
    rating: 5,
    quote:
      "Retro-modern styling that resonated across local community feeds. Booking inquiries shot up across all our weekend league slots.",
  },
  {
    id: "l6-collectibles",
    image: "/work/wall-of-fame/L6-Collectibles-2026-Proudly-Canadian-Resilience-and-Unity.jpg",
    alt: "L6 Collectibles commemorative graphic",
    reviewerName: "Chloe Tremblay",
    rating: 5,
    quote:
      "The commemorative badge creatives conveyed pure heritage and collectibility. Flawless attention to fine typography and embossing textures.",
  },
  {
    id: "why-buy-gold",
    image: "/work/wall-of-fame/Why-Buy-Gold.jpg",
    alt: "Why Buy Gold financial educational infographic ad",
    reviewerName: "Naveen Singhal",
    rating: 5,
    quote:
      "Educational infographics that simplify high-ticket asset investments for retail buyers. Outstanding turnaround and polish.",
  },
];

export const reviewItems: ReviewItem[] = [
  {
    id: "review-1",
    image: "/work/reviews/wall_fame31-1024x845.png",
    alt: "Performance ad creative package",
    title: "Transformed our paid social conversion rate in 7 days.",
    excerpt:
      "AdsPolisher overhauled our entire product catalog into punchy direct-response ads. Their turnaround speed blew our team away.",
    reviewerName: "Sarah Jenkins",
    rating: 5,
    stats: { concepts: 6, revisions: 2, delivered: 12, turnaroundHours: 48 },
  },
  {
    id: "review-2",
    image: "/work/reviews/wall_fame41-1024x845.png",
    alt: "Seasonal campaign creative suite",
    title: "The design quality rivals top tier Madison Ave agencies.",
    excerpt:
      "We needed 8 multi-platform variations for our seasonal launch. Every asset was exported pixel-perfect to exact Meta and TikTok specs.",
    reviewerName: "Karan Mehta",
    rating: 5,
    stats: { concepts: 4, revisions: 1, delivered: 8, turnaroundHours: 48 },
  },
  {
    id: "review-3",
    image: "/work/reviews/wall_fame51-1024x845.png",
    alt: "SaaS brand refresh ad set",
    title: "No back-and-forth friction, just crisp creative execution.",
    excerpt:
      "They understood our B2B tech positioning on the very first brief. Delivered our entire multi-format asset pack within 72 hours.",
    reviewerName: "David Zhao",
    rating: 5,
    stats: { concepts: 8, revisions: 2, delivered: 16, turnaroundHours: 72 },
  },
  {
    id: "review-4",
    image: "/work/reviews/wall_fame61-1024x845.png",
    alt: "DTC acquisition creative assets",
    title: "Our ROAS increased by 42% after deploying these creatives.",
    excerpt:
      "The typography hooks and visual hierarchy stopped user scrolling immediately. They have become an indispensable partner for our growth.",
    reviewerName: "Ananya Deshmukh",
    rating: 5,
    stats: { concepts: 5, revisions: 2, delivered: 10, turnaroundHours: 48 },
  },
  {
    id: "review-5",
    image: "/work/reviews/wall_fame71-1024x845.png",
    alt: "E-commerce promotion ad kit",
    title: "Delivered 14 polished ad concepts ahead of schedule.",
    excerpt:
      "AdsPolisher delivers consistent, high-impact creative every single sprint. Their communication and workflow are seamless.",
    reviewerName: "Liam O'Connor",
    rating: 5,
    stats: { concepts: 6, revisions: 1, delivered: 14, turnaroundHours: 48 },
  },
  {
    id: "review-6",
    image: "/work/reviews/wall_fame81-1024x845.png",
    alt: "Omnichannel growth campaign suite",
    title: "A true game changer for our in-house marketing velocity.",
    excerpt:
      "Instead of waiting 3 weeks for an internal designer, AdsPolisher provided 20 campaign-ready exports in just 3 days.",
    reviewerName: "Rohan Kapoor",
    rating: 5,
    stats: { concepts: 10, revisions: 2, delivered: 20, turnaroundHours: 72 },
  },
];
