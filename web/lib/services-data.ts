export interface SliderItem {
  id: string;
  src: string;
  alt: string;
}

export interface FeatureBlockItem {
  id: string;
  title: string;
  accent: string;
  titleSuffix?: string;
  body: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export interface WhySwitchingCard {
  id: string;
  iconName: 'Users' | 'ClipboardList' | 'BadgeCheck';
  title: string;
  body: string;
}

export interface ComparisonRow {
  label: string;
  freelancers: boolean | string;
  inhouse: boolean | string;
  ai: boolean | string;
  us: boolean | string;
  isPrice?: boolean;
}

export interface CategoryItem {
  id: string;
  titlePrefix: string;
  accent: string;
  description: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  serviceParam: string;
}

export const sliderItems: SliderItem[] = [
  {
    id: 'billie-print',
    src: '/services/slider/billie-print-ad-miss-pickle.jpg',
    alt: 'Billie print ad creative showcase',
  },
  {
    id: 'folio-3',
    src: '/services/slider/folio-3.png',
    alt: 'Creative brand campaign ad unit',
  },
  {
    id: 'folio-4',
    src: '/services/slider/folio-4.png',
    alt: 'Visual identity social performance graphic',
  },
  {
    id: 'folio-5',
    src: '/services/slider/folio-5.png',
    alt: 'Performance direct-response ad creative',
  },
  {
    id: 'social-anjar-1',
    src: '/services/slider/social-anjar-1.jpg',
    alt: 'Editorial ad creative layout variation',
  },
  {
    id: 'social-anjar-2',
    src: '/services/slider/social-anjar-2.jpg',
    alt: 'Conversion focused social ad variation',
  },
  {
    id: 'social-bianca',
    src: '/services/slider/social-bianca-dizon.jpg',
    alt: 'High-contrast campaign launch creative',
  },
];

export const featureBlocks: FeatureBlockItem[] = [
  {
    id: 'stand-out',
    title: 'Stand out from',
    accent: 'competitors',
    body: 'Templates and raw AI output tend to blend into the feed. Our human art-directed process gives your ads a clear hook and a look that is yours.',
    image: '/services/main/stand-out-from-competitors.png',
    imageAlt: 'Stand out from competitors creative preview',
    reverse: false,
  },
  {
    id: 'consistent',
    title: 'Keep all your ads',
    accent: 'consistent',
    body: 'Work with the same creatives across campaigns so every ad, from static posts to display banners, stays true to your brand.',
    image: '/services/main/keep-all-your-ads-consistent.png',
    imageAlt: 'Keep all your ads consistent across channels',
    reverse: true,
  },
  {
    id: 'create-more',
    title: 'Create',
    accent: 'more',
    titleSuffix: 'than ever before',
    body: 'Need static ads, carousels, display banners, short-form video hooks, or a landing page? One studio covers the whole campaign.',
    image: '/services/main/create-more-than-ever-before.png',
    imageAlt: 'Create more multi-format ad creative suite',
    reverse: false,
  },
];

export const whySwitchingCards: WhySwitchingCard[] = [
  {
    id: 'creatives',
    iconName: 'Users',
    title: 'Work with experienced creatives',
    body: 'Every concept is art-directed and refined by people, not just generated.',
  },
  {
    id: 'visibility',
    iconName: 'ClipboardList',
    title: "Know what's happening",
    body: 'Clear briefs, feedback right on the assets, and one-click approvals.',
  },
  {
    id: 'human-led',
    iconName: 'BadgeCheck',
    title: 'Human-led, AI-assisted',
    body: 'We use AI to speed up research and ideation. Experienced creatives own the final result.',
  },
];

export const comparisonRows: ComparisonRow[] = [
  {
    label: 'Dedicated point of contact',
    freelancers: false,
    inhouse: false,
    ai: false,
    us: true,
  },
  {
    label: 'Art-directed by human creatives',
    freelancers: false,
    inhouse: false,
    ai: false,
    us: true,
  },
  {
    label: 'Quality review before delivery',
    freelancers: false,
    inhouse: true,
    ai: false,
    us: true,
  },
  {
    label: 'Responsive communication',
    freelancers: false,
    inhouse: true,
    ai: true,
    us: true,
  },
  {
    label: 'First drafts in 48–72 hours',
    freelancers: false,
    inhouse: false,
    ai: true,
    us: true,
  },
  {
    label: 'Revision rounds included',
    freelancers: false,
    inhouse: false,
    ai: false,
    us: true,
  },
  {
    label: 'Scalable packages or custom quote',
    freelancers: false,
    inhouse: false,
    ai: false,
    us: true,
  },
  {
    label: 'Price',
    freelancers: 'Varies',
    inhouse: 'Varies',
    ai: 'Varies',
    us: 'Fixed',
    isPrice: true,
  },
];

export const categories: CategoryItem[] = [
  {
    id: 'motion-graphics',
    titlePrefix: 'Motion',
    accent: 'graphics',
    description: 'Add movement to your next campaign with short, attention-grabbing animated ads.',
    type: 'video',
    src: '/services/categories/motion-graphics.mp4',
    poster: '/services/categories/motion-graphics-poster.jpg',
    serviceParam: 'motion-graphics',
  },
  {
    id: 'advertisement',
    titlePrefix: '',
    accent: 'Advertisement',
    description: 'Static ads, carousels, and banners built around a strong hook and clear hierarchy.',
    type: 'image',
    src: '/services/categories/advertisement.png',
    serviceParam: 'ad-creative',
  },
  {
    id: 'web-design',
    titlePrefix: 'Web',
    accent: 'design',
    description: 'Landing pages that match your ads and give visitors a clear next step.',
    type: 'image',
    src: '/services/categories/web-design.png',
    serviceParam: 'web-design',
  },
  {
    id: 'illustrations',
    titlePrefix: '',
    accent: 'Illustrations',
    description: 'Custom visuals that give your brand a recognizable look.',
    type: 'image',
    src: '/services/categories/illustrations.png',
    serviceParam: 'illustrations',
  },
  {
    id: 'graphic-design',
    titlePrefix: 'Graphic',
    accent: 'design',
    description: 'Social graphics, menus, flyers, and more, designed to match your brand.',
    type: 'image',
    src: '/services/categories/graphic-design.png',
    serviceParam: 'graphic-design',
  },
  {
    id: 'presentation-design',
    titlePrefix: 'Presentation',
    accent: 'design',
    description: 'Clean, on-brand decks that make every slide easy to follow.',
    type: 'image',
    src: '/services/categories/presentation-design.png',
    serviceParam: 'presentation-design',
  },
];
