'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { Users, Globe, Building, Palette, Upload, Check, Camera, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [company, setCompany] = useState('Acme Growth Co.');
  const [website, setWebsite] = useState('https://acmegrowth.com');
  const [saved, setSaved] = useState(false);

  const DEFAULT_AVATAR = '/team/user-avatar.jpg';
  const userAvatar =
    session?.user?.image && session.user.image.trim() !== ''
      ? session.user.image
      : DEFAULT_AVATAR;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
          <Sparkles size={13} className="text-[#4F46E5]" />
          <span>Brand Identity</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
          Company &amp; Brand Profile
        </h2>
        <p className="mt-1 text-sm text-[#5A5852]">
          Store your brand assets, logo guidelines, and primary messaging so our creative pods can reuse them across all requests.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
        {/* User Profile Avatar Section */}
        <div className="flex items-center gap-5 pb-6 border-b border-black/[0.06]">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-[#4F46E5]/25 ring-offset-2 ring-offset-white shadow-md bg-neutral-200">
              <img
                src={userAvatar}
                alt={session?.user?.name || 'User'}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => alert('Photo upload dialog')}
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#141413] text-white shadow-md hover:bg-neutral-800 transition"
              title="Change avatar"
            >
              <Camera size={13} />
            </button>
          </div>
          <div>
            <h4 className="text-base font-bold text-[#141413]">{session?.user?.name || 'Workspace Member'}</h4>
            <p className="text-xs text-neutral-500">{session?.user?.email || ''}</p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-[#4F46E5]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#4F46E5]">
              Active Client Profile
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Contact Name
            </label>
            <input
              type="text"
              readOnly
              value={session?.user?.name || ''}
              className="w-full rounded-xl border border-black/[0.06] bg-black/[0.03] px-4 py-2.5 text-xs text-neutral-700 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              readOnly
              value={session?.user?.email || ''}
              className="w-full rounded-xl border border-black/[0.06] bg-black/[0.03] px-4 py-2.5 text-xs text-neutral-700 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Company / Brand Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs text-[#141413] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
            Brand Logo &amp; Guidelines (SVG, PNG, or PDF)
          </label>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 bg-white/50 p-6 text-center backdrop-blur-xs transition hover:bg-white hover:border-[#4F46E5]">
            <Upload size={24} className="text-[#4F46E5] mb-2" />
            <p className="text-sm font-semibold text-[#141413]">Drag and drop your brand kit</p>
            <p className="text-xs text-neutral-500 mt-1">Upload primary vector logos, font styles, and color palettes.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] px-6 text-xs font-bold text-white shadow-md hover:scale-[1.02] hover:from-neutral-900 hover:to-neutral-800 transition-all"
          >
            {saved ? <Check size={16} className="text-emerald-400" /> : null}
            {saved ? 'Saved Successfully!' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
