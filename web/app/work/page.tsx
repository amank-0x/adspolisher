'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Filter, CheckCircle2 } from 'lucide-react'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { PublicFooter } from '@/components/public/PublicFooter'

type WorkItem = {
  id: string
  title: string
  subtitle: string
  category: string
  metric: string
  metricLabel: string
  image: string
  accent: string
  challenge: string
  deliverables: string[]
  isConcept: boolean
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 'roast-co',
    title: 'Roast & Co. Blends',
    subtitle: 'Specialty Coffee DTC Acquisition',
    category: 'Meta Carousel',
    metric: '4.2x ROAS',
    metricLabel: '30-day blended return',
    image: '/isometric/Dribbble/1.png',
    accent: '#D9480F',
    challenge: 'High customer acquisition cost across Meta feed and cold audiences.',
    deliverables: ['5 Scroll-stopping carousel cards', '3 Story variations with product zoom', 'Direct response hook angles'],
    isConcept: false,
  },
  {
    id: 'discover-alpine',
    title: 'Discover Alpine',
    subtitle: 'Winter Performance Gear Launch',
    category: 'Display Suite',
    metric: '+164% CTR',
    metricLabel: 'vs previous benchmark',
    image: '/isometric/Dribbble/2.png',
    accent: '#1D4ED8',
    challenge: 'Launching premium technical apparel without relying on discounts.',
    deliverables: ['12 Responsive Google Display sizes', 'Retargeting static banners', 'Seasonal urgency layout'],
    isConcept: false,
  },
  {
    id: 'atelier-bridal',
    title: 'Atelier Bridal',
    subtitle: 'Editorial Lookbook Campaign',
    category: 'Paid Social',
    metric: '-41% CPA',
    metricLabel: 'Appointment lead cost',
    image: '/isometric/Dribbble/3.png',
    accent: '#0F766E',
    challenge: 'Luxury bridal salon needed qualified private booking inquiries.',
    deliverables: ['Editorial 4:5 lifestyle portraits', 'Luxury typography hooks', 'Geo-targeted story banners'],
    isConcept: false,
  },
  {
    id: 'crimson-studio',
    title: 'Crimson Studio',
    subtitle: 'Brand Identity & Media Rollout',
    category: 'Ad Creative',
    metric: '3.9x ROAS',
    metricLabel: 'First purchase campaign',
    image: '/isometric/Dribbble/4.png',
    accent: '#B91C1C',
    challenge: 'Establishing bold brand recall in a crowded lifestyle design space.',
    deliverables: ['High-contrast hero graphics', 'Social feed conversion banners', 'Value proposition visual overlays'],
    isConcept: true,
  },
  {
    id: 's500-audio',
    title: 'S500 Studio Audio',
    subtitle: 'Pro Audio Funnel Refresh',
    category: 'DTC Funnel',
    metric: '5.4x ROAS',
    metricLabel: 'Black Friday campaign',
    image: '/isometric/Dribbble/5.png',
    accent: '#1E293B',
    challenge: 'Technical product needed quick visual comprehension in under 2 seconds.',
    deliverables: ['Feature callout breakdown ads', 'Before/After acoustic comparison tiles', 'High-urgency promotional graphics'],
    isConcept: false,
  },
  {
    id: 'solstice-eyewear',
    title: 'Solstice Eyewear',
    subtitle: 'Summer Lookbook Paid Social',
    category: 'Paid Social',
    metric: '+215% ROAS',
    metricLabel: 'Summer flash sale',
    image: '/isometric/Dribbble/6.png',
    accent: '#EA580C',
    challenge: 'Seasonal collection needed fresh weekly creative variations to prevent ad fatigue.',
    deliverables: ['8 Dynamic carousel sets', 'Story motion stills', 'UGC frame templates'],
    isConcept: true,
  },
  {
    id: 'kinetix-run',
    title: 'Kinetix Run Club',
    subtitle: 'Performance Footwear Ads',
    category: 'Display Suite',
    metric: '$11.20 CAC',
    metricLabel: 'First pair trial',
    image: '/isometric/Dribbble/7.png',
    accent: '#0284C7',
    challenge: 'Challenging established shoe giants with specialized marathon cushioning.',
    deliverables: ['Multi-platform ad pack', 'Anatomy of shoe callout graphics', 'Social proof stat cards'],
    isConcept: false,
  },
  {
    id: 'botanica-skin',
    title: 'Botanica Skin',
    subtitle: 'Clean Beauty Acquisition',
    category: 'UGC Variations',
    metric: '4.7x ROAS',
    metricLabel: 'Cold audience prospecting',
    image: '/isometric/Dribbble/8.png',
    accent: '#15803D',
    challenge: 'Educating buyers on clinical clean botanical ingredients quickly in feed.',
    deliverables: ['Ingredient spotlight stat cards', 'Customer quote overlay graphics', 'Step 1-2-3 routine visual grids'],
    isConcept: false,
  },
  {
    id: 'pulse-fintech',
    title: 'Pulse Fintech',
    subtitle: 'B2B Demand Gen Campaign',
    category: 'Ad Creative',
    metric: '$14 CPL',
    metricLabel: 'Qualified CFO demos',
    image: '/isometric/Dribbble/9.png',
    accent: '#6D28D9',
    challenge: 'Boring financial software required compelling visual storytelling on LinkedIn.',
    deliverables: ['SaaS dashboard isometric renders', 'ROI calculation graphic hooks', 'Single-image sponsored banners'],
    isConcept: true,
  },
  {
    id: 'lumina-audio',
    title: 'Lumina Audio Pro',
    subtitle: 'Q4 Holiday Campaign Suite',
    category: 'Meta Carousel',
    metric: '6.1x ROAS',
    metricLabel: 'Holiday gift campaign',
    image: '/isometric/Dribbble/10.png',
    accent: '#BE185D',
    challenge: 'Standing out during competitive holiday auction rates with high converting gift ads.',
    deliverables: ['Gift guide carousel series', 'Unboxing preview stills', 'Limited edition announcement creatives'],
    isConcept: false,
  },
]

const CATEGORIES = ['All Work', 'Meta Carousel', 'Display Suite', 'Paid Social', 'Ad Creative', 'DTC Funnel', 'UGC Variations']

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState('All Work')

  const filteredItems = activeCategory === 'All Work'
    ? WORK_ITEMS
    : WORK_ITEMS.filter(item => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413]">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="border-b border-black/10 px-6 pt-16 pb-12 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-bold tracking-wide uppercase text-neutral-600 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            Verified Case Studies &amp; Concept Previews
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Selected Campaign Work.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
            A portfolio of performance-focused ad creatives, display suites, and direct response concepts engineered to cut acquisition costs and stop the feed scroll.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === category
                    ? 'bg-black text-white shadow-sm'
                    : 'border border-black/10 bg-white/70 text-neutral-700 hover:bg-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Work */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Media Container */}
              <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: item.accent }}
                  >
                    {item.category}
                  </span>
                  {item.isConcept && (
                    <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white">
                      Concept Work
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 z-10 rounded-xl bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-xs text-right">
                  <div className="text-sm font-black text-neutral-900">{item.metric}</div>
                  <div className="text-[10px] font-semibold text-neutral-500">{item.metricLabel}</div>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-neutral-500">
                    {item.subtitle}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                    <strong className="text-neutral-900">Challenge: </strong>
                    {item.challenge}
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Deliverables
                  </span>
                  <ul className="mt-2 space-y-1.5">
                    {item.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/start-project?ref=${encodeURIComponent(item.title)}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-neutral-50 py-2.5 text-xs font-bold text-neutral-800 transition-all hover:bg-black hover:text-white"
                  >
                    Request Similar Creative
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA banner at bottom of work page */}
        <div className="mt-20 overflow-hidden rounded-3xl bg-neutral-950 p-8 sm:p-12 text-white relative">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-black sm:text-4xl">Have an upcoming campaign?</h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-300">
              Submit your business goals and existing assets. Our team will review your brief and send back a bespoke proposal with clear deliverables and pricing.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-neutral-950 transition-all hover:bg-neutral-200"
              >
                Start a Project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-xs font-bold text-white transition-all hover:bg-white/10"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
