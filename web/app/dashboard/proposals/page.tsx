'use client';

import React from 'react';
import Link from 'next/link';
import { FileClock, Check, X, HelpCircle, ArrowRight, ShieldCheck, Calendar, DollarSign } from 'lucide-react';

export default function ProposalsPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#141413] sm:text-3xl">
            Proposals
          </h2>
          <p className="mt-1 text-sm text-[#5A5852]">
            Review detailed project scopes, fixed pricing, and deliverables awaiting your decision.
          </p>
        </div>
      </div>

      {/* Proposal Card (Q-104) */}
      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
        <div className="border-b border-black/[0.06] bg-[#FFFAF5] p-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5E5D8] text-[#A43E13]">
                <FileClock size={24} />
              </span>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-[#F2E0D2] px-2.5 py-0.5 text-xs font-bold text-[#8E3A16]">
                    Q-104
                  </span>
                  <span className="rounded-full bg-[#D9480F]/15 px-2.5 py-0.5 text-xs font-bold text-[#D9480F]">
                    Awaiting your decision · Expires in 5 days
                  </span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-[#141413]">
                  Q4 Meta Performance Campaign
                </h3>
                <p className="text-xs text-[#5A5852] mt-0.5">
                  Request Ref: REQ-104 · Prepared by Senior Art Director
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 text-right">
              <span className="text-3xl font-bold tabular-nums text-[#141413]">$2,400</span>
              <span className="text-xs text-neutral-500">USD fixed</span>
            </div>
          </div>
        </div>

        {/* Scope and Deliverables Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-black/[0.06] bg-[#F7F6F2] p-4">
              <span className="text-xs font-semibold uppercase text-neutral-500 flex items-center gap-1.5">
                <Calendar size={14} /> Timeline
              </span>
              <p className="mt-1 text-sm font-bold text-[#141413]">7 business days</p>
              <p className="text-xs text-neutral-500 mt-0.5">First drafts in 48–72 hours</p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-[#F7F6F2] p-4">
              <span className="text-xs font-semibold uppercase text-neutral-500 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Revisions
              </span>
              <p className="mt-1 text-sm font-bold text-[#141413]">2 full rounds included</p>
              <p className="text-xs text-neutral-500 mt-0.5">Human art-directed revisions</p>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-[#F7F6F2] p-4">
              <span className="text-xs font-semibold uppercase text-neutral-500 flex items-center gap-1.5">
                <DollarSign size={14} /> Payment terms
              </span>
              <p className="mt-1 text-sm font-bold text-[#141413]">Upfront fixed deposit</p>
              <p className="text-xs text-neutral-500 mt-0.5">No recurring fees or surprise retainers</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Included Deliverables
            </h4>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#141413]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                10 scroll-stopping static feed creatives (1:1 and 4:5)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                4 high-retention short-form video motion hooks (9:16)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                3 headline and direct-response primary copy variations
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                Organized Figma design source file + ready-to-run PNGs/MP4s
              </li>
            </ul>
          </div>

          {/* Action Decision Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/[0.06]">
            <Link
              href="/dashboard/requests/req-104"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#22A559] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E8A4C] focus:outline-none focus:ring-2 focus:ring-[#22A559]"
            >
              <Check size={16} /> Accept proposal ($2,400)
            </Link>

            <Link
              href="/dashboard/messages"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-5 text-sm font-semibold text-[#141413] transition hover:bg-neutral-50"
            >
              <HelpCircle size={16} /> Ask a question
            </Link>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-semibold text-neutral-500 hover:text-rose-600 transition"
            >
              <X size={14} /> Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
