'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Flame,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Loader2,
  Palette,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

const SERVICES = [
  {
    id: 'paid-social',
    name: 'Paid Social Ad Creatives',
    desc: 'High-converting static hooks, UGC graphics & carousel slides.',
    icon: Flame,
    popular: true,
  },
  {
    id: 'motion-graphics',
    name: 'Motion Graphics & Video Hooks',
    desc: '4:5 & 9:16 video ads, animated hooks, and kinetic typography.',
    icon: Play,
    popular: true,
  },
  {
    id: 'display-banners',
    name: 'Google & Display Banners',
    desc: 'HTML5 animated & static responsive retargeting suites (6+ sizes).',
    icon: Layers,
    popular: false,
  },
  {
    id: 'web-design',
    name: 'Web & Landing Page Design',
    desc: 'Figma-ready conversion landing pages, UI concepts, and hero designs.',
    icon: Globe,
    popular: false,
  },
  {
    id: 'brand-identity',
    name: 'Brand Identity & Asset Polish',
    desc: 'Vector logos, custom brand illustration systems, and icon sets.',
    icon: Palette,
    popular: false,
  },
  {
    id: 'presentations',
    name: 'Pitch Decks & Presentations',
    desc: 'High-impact investor pitch decks, keynotes, and sales one-pagers.',
    icon: FileText,
    popular: false,
  },
];

const PLATFORMS = [
  'Meta (Instagram & Facebook)',
  'TikTok',
  'YouTube Shorts & Reels',
  'Google Display Network',
  'LinkedIn',
  'X / Twitter',
  'Amazon Ads',
  'Website / App Store',
];

const BUDGET_OPTIONS = [
  { id: 'under-1500', label: 'Under $1,500', note: 'Single asset or small sprint' },
  { id: '1500-3000', label: '$1,500 – $3,000', note: 'Standard full campaign pod (Most Popular)', recommended: true },
  { id: '3000-6000', label: '$3,000 – $6,000', note: 'Multi-format full launch suite' },
  { id: '6000-plus', label: '$6,000+', note: 'Enterprise / continuous creative volume' },
];

const GOAL_OPTIONS = [
  'Direct-to-Consumer Conversions & Sales',
  'Product or Feature Launch',
  'High-CTR Ad Testing & Hook Exploration',
  'Retargeting & Bottom-of-Funnel Conversion',
  'B2B Lead Generation & Demo Bookings',
  'Brand Awareness & Category Positioning',
];

export default function NewCustomerRequestPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [selectedService, setSelectedService] = useState('Paid Social Ad Creatives');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'Meta (Instagram & Facebook)',
  ]);
  const [primaryGoal, setPrimaryGoal] = useState('Direct-to-Consumer Conversions & Sales');
  const [scopeDetails, setScopeDetails] = useState('');
  const [budgetRange, setBudgetRange] = useState('$1,500 – $3,000');
  const [desiredDeadline, setDesiredDeadline] = useState('');
  const [turnaroundPriority, setTurnaroundPriority] = useState<'standard' | 'rush'>('standard');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [creativeBrief, setCreativeBrief] = useState('');

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Pre-fill user data when session loads
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
    }
  }, [session, name, email]);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg('Please enter your contact name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid contact email address.');
      return;
    }
    if (!projectTitle.trim()) {
      setErrorMsg('Please give your creative project a title.');
      return;
    }
    if (!creativeBrief.trim()) {
      setErrorMsg('Please write a brief describing your project and expectations.');
      return;
    }

    setSubmitting(true);

    try {
      // Assemble full payload
      const payload = {
        name: name.trim(),
        email: email.trim(),
        companyName: companyName.trim() || undefined,
        companyWebsite: companyWebsite.trim() || undefined,
        projectTitle: projectTitle.trim(),
        serviceNeeded: selectedService,
        targetPlatforms: selectedPlatforms,
        goals: primaryGoal,
        budgetRange,
        desiredDeadline: desiredDeadline || undefined,
        message: creativeBrief.trim(),
        attachments: {
          scopeDetails: scopeDetails.trim() || undefined,
          turnaroundPriority,
          referenceLinks: referenceLinks.trim() || undefined,
        },
        userId: session?.user?.id || undefined,
      };

      // Send to API endpoint (which connects directly to Neon DB)
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit request to database.');
      }

      setSuccessData(data.data);
    } catch (err: any) {
      console.error('[REQUEST SUBMIT ERROR]', err);
      setErrorMsg(err?.message || 'Something went wrong submitting your project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully submitted, show success view
  if (successData) {
    return (
      <div className="mx-auto max-w-2xl py-8 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(20,20,19,0.06)]">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#4F46E5]/15 blur-3xl" />

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20">
            <CheckCircle2 size={32} />
          </div>

          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
            Request Saved in Database
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#141413]">
            Project Request Submitted!
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#5A5852] max-w-lg mx-auto">
            Your project brief for <strong className="text-[#141413]">{projectTitle}</strong> has been routed to our Lead Art Directors. We will prepare your fixed-scope proposal within 24 hours.
          </p>

          <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white/80 p-4 text-left shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-black/[0.05]">
              <span className="text-neutral-500 font-medium">Request Reference</span>
              <span className="font-mono font-bold text-neutral-800">{successData.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-black/[0.05]">
              <span className="text-neutral-500 font-medium">Service Requested</span>
              <span className="font-bold text-[#141413]">{selectedService}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-neutral-500 font-medium">Estimated Turnaround</span>
              <span className="font-bold text-[#D9480F]">Proposal within 24 hours</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/requests"
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] px-6 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] hover:from-neutral-900 hover:to-neutral-800"
            >
              <span>View my requests queue</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-black/[0.08] bg-white px-6 text-xs font-bold text-[#141413] shadow-xs hover:border-[#4F46E5]/40 hover:bg-neutral-50 transition"
            >
              Back to overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Navigation Breadcrumb & Header */}
      <div>
        <Link
          href="/dashboard/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-[#141413] transition mb-3 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Requests</span>
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
              <Sparkles size={13} className="text-[#4F46E5]" />
              <span>Client Creative Intake</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span>Guaranteed 24h Proposal</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] sm:text-4xl">
              Start a New Creative Project
            </h2>
            <p className="mt-1 text-sm text-[#5A5852]">
              Fill in your campaign objectives and formats. Our art directors will structure your custom deliverables and fixed price quote.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-50/90 p-4 text-xs font-semibold text-rose-800 shadow-xs backdrop-blur-md">
          {errorMsg}
        </div>
      )}

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Form Content (8 cols) */}
        <div className="space-y-8 lg:col-span-8">
          {/* Section 1: Project Identity & Contact */}
          <section className="rounded-3xl border border-white/80 bg-white/60 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-5">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-base font-bold text-[#141413]">1. Project Identity &amp; Contact</h3>
              <p className="text-xs text-[#5A5852] mt-0.5">
                Tell us what you are building and confirm who our creative pod should update.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Project Name / Campaign Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Q4 Black Friday Meta Ads & Video Hooks"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Contact Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Acme Growth Co."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://acmegrowth.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Creative Category & Platforms */}
          <section className="rounded-3xl border border-white/80 bg-white/60 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-base font-bold text-[#141413]">2. Creative Service &amp; Platforms</h3>
              <p className="text-xs text-[#5A5852] mt-0.5">
                Select your primary format and the advertising platforms you will be running.
              </p>
            </div>

            {/* Service Selection Cards */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
                Select Primary Creative Service <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => {
                  const Icon = s.icon;
                  const isSelected = selectedService === s.name;
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSelectedService(s.name)}
                      className={`group flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'border-2 border-[#4F46E5] bg-white shadow-md ring-4 ring-[#4F46E5]/10'
                          : 'border border-black/[0.07] bg-white/70 hover:bg-white hover:border-[#4F46E5]/40 shadow-xs'
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'bg-black/[0.04] text-neutral-600 group-hover:bg-[#4F46E5]/10 group-hover:text-[#4F46E5]'
                        }`}
                      >
                        <Icon size={19} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#141413]">{s.name}</p>
                          {s.popular && (
                            <span className="rounded bg-[#D9480F]/10 px-1.5 py-0.2 text-[9px] font-bold text-[#D9480F]">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5A5852] mt-0.5 leading-snug line-clamp-2">
                          {s.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platforms Multi-select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Target Advertising Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => {
                  const active = selectedPlatforms.includes(platform);
                  return (
                    <button
                      type="button"
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        active
                          ? 'bg-[#141413] text-white shadow-xs'
                          : 'border border-black/[0.08] bg-white/80 text-neutral-700 hover:bg-white hover:text-black'
                      }`}
                    >
                      {active ? <Check size={13} strokeWidth={2.5} /> : <Plus size={13} />}
                      <span>{platform}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 3: Creative Brief & Scope */}
          <section className="rounded-3xl border border-white/80 bg-white/60 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-5">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-base font-bold text-[#141413]">3. Creative Brief &amp; Objectives</h3>
              <p className="text-xs text-[#5A5852] mt-0.5">
                Explain what you need the ads to accomplish, key angles, and any specific deliverable volume.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Primary Campaign Objective
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-medium text-[#141413] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
              >
                {GOAL_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Creative Brief &amp; Key Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe your offer, target audience, core visual ideas, product benefits, and call to action..."
                value={creativeBrief}
                onChange={(e) => setCreativeBrief(e.target.value)}
                className="w-full rounded-xl border border-black/[0.08] bg-white p-4 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Deliverables Scope / Target Formats (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., 8 static ads (4:5 and 9:16) + 3 motion video hooks (15s)"
                value={scopeDetails}
                onChange={(e) => setScopeDetails(e.target.value)}
                className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
              />
            </div>
          </section>

          {/* Section 4: Budget & Timeline */}
          <section className="rounded-3xl border border-white/80 bg-white/60 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-base font-bold text-[#141413]">4. Timeline &amp; Budget Range</h3>
              <p className="text-xs text-[#5A5852] mt-0.5">
                Helps our art directors calibrate team size and turnaround speed.
              </p>
            </div>

            {/* Budget Range Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
                Expected Budget Range
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUDGET_OPTIONS.map((opt) => {
                  const active = budgetRange === opt.label;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setBudgetRange(opt.label)}
                      className={`p-3.5 rounded-2xl text-left transition-all ${
                        active
                          ? 'border-2 border-[#4F46E5] bg-white shadow-md ring-4 ring-[#4F46E5]/10'
                          : 'border border-black/[0.07] bg-white/70 hover:bg-white hover:border-[#4F46E5]/40 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#141413]">{opt.label}</span>
                        {opt.recommended && (
                          <span className="rounded bg-[#4F46E5]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#4F46E5]">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5A5852] mt-1">{opt.note}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Desired Delivery Date (Optional)
                </label>
                <input
                  type="date"
                  value={desiredDeadline}
                  onChange={(e) => setDesiredDeadline(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-xs font-medium text-[#141413] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Turnaround Speed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTurnaroundPriority('standard')}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      turnaroundPriority === 'standard'
                        ? 'border-2 border-[#4F46E5] bg-white text-[#4F46E5] shadow-xs'
                        : 'border border-black/[0.08] bg-white/70 text-neutral-600'
                    }`}
                  >
                    Standard (3-5d)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTurnaroundPriority('rush')}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      turnaroundPriority === 'rush'
                        ? 'border-2 border-[#D9480F] bg-white text-[#D9480F] shadow-xs'
                        : 'border border-black/[0.08] bg-white/70 text-neutral-600'
                    }`}
                  >
                    ⚡ Rush (24-48h)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: References & Assets */}
          <section className="rounded-3xl border border-white/80 bg-white/60 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-5">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-base font-bold text-[#141413]">5. Reference Links &amp; Brand Assets</h3>
              <p className="text-xs text-[#5A5852] mt-0.5">
                Paste links to Figma files, Google Drive folders, competitor ad references, or inspiration.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Reference Links (Figma, Drive, Dropbox, Ad Inspiration)
              </label>
              <textarea
                rows={3}
                placeholder="https://www.figma.com/file/...&#10;https://drive.google.com/drive/folders/..."
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
                className="w-full rounded-xl border border-black/[0.08] bg-white p-3.5 text-xs text-[#141413] placeholder-neutral-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 shadow-xs leading-relaxed"
              />
            </div>
          </section>
        </div>

        {/* Right Sticky Summary Rail (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-6 backdrop-blur-2xl shadow-[0_12px_40px_rgba(20,20,19,0.05)]">
            {/* Luminous Glow */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#4F46E5]/15 blur-2xl" />

            <h3 className="text-base font-bold text-[#141413]">Project Intake Summary</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Review before routing to art directors.</p>

            <div className="mt-5 space-y-3.5 text-xs border-t border-black/[0.06] pt-4">
              <div>
                <span className="text-neutral-400 font-medium block">Service Category</span>
                <span className="font-bold text-[#141413] mt-0.5 block">{selectedService}</span>
              </div>

              <div>
                <span className="text-neutral-400 font-medium block">Target Platforms</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPlatforms.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700"
                    >
                      {p.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Estimated Budget</span>
                <span className="font-bold text-[#141413]">{budgetRange}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Turnaround</span>
                <span
                  className={`font-bold ${
                    turnaroundPriority === 'rush' ? 'text-[#D9480F]' : 'text-neutral-800'
                  }`}
                >
                  {turnaroundPriority === 'rush' ? '⚡ Rush 24-48h' : 'Standard 3-5 days'}
                </span>
              </div>
            </div>

            {/* Quality Guarantee Box */}
            <div className="mt-5 rounded-2xl border border-black/[0.05] bg-[#FAF9F5] p-3.5 text-[11px] leading-relaxed text-neutral-600">
              <div className="flex items-center gap-1.5 font-bold text-[#141413] mb-1">
                <ShieldCheck size={14} className="text-[#4F46E5]" />
                <span>24-Hour Proposal Guarantee</span>
              </div>
              Assigned Art Director will inspect your brief, establish the pod, and submit fixed pricing directly to your dashboard.
            </div>

            {/* Submit Action Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] px-5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.01] hover:from-neutral-900 hover:to-neutral-800 disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>Submitting to Database…</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Project Request</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-neutral-400 mt-3">
              No immediate charges. Fixed quote proposal delivered first.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
