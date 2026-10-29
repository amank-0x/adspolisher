'use client';

import React, { useState } from 'react';
import { Files, Download, Search, Filter, Image as ImageIcon, Video, FileText, CheckCircle2 } from 'lucide-react';

const ASSETS = [
  {
    id: 'f-1',
    name: 'Google Display 300x250 Banner.png',
    project: 'Display Retargeting Suite (AP-1988)',
    type: 'image',
    size: '1.2 MB',
    version: 'v2',
    status: 'Approved',
    releasedAt: 'Oct 28, 2026',
  },
  {
    id: 'f-2',
    name: 'Google Display 728x90 Banner.png',
    project: 'Display Retargeting Suite (AP-1988)',
    type: 'image',
    size: '840 KB',
    version: 'v1',
    status: 'Approved',
    releasedAt: 'Oct 28, 2026',
  },
  {
    id: 'f-3',
    name: 'Static Feed Ad 1 - Benefit Focus.png',
    project: 'Q4 Meta Performance Ads (AP-2041)',
    type: 'image',
    size: '2.4 MB',
    version: 'v2',
    status: 'Ready for review',
    releasedAt: 'Oct 29, 2026',
  },
  {
    id: 'f-4',
    name: 'Story Motion Hook 1.mp4',
    project: 'Q4 Meta Performance Ads (AP-2041)',
    type: 'video',
    size: '4.8 MB',
    version: 'v1',
    status: 'Ready for review',
    releasedAt: 'Oct 29, 2026',
  },
  {
    id: 'f-5',
    name: 'Performance Ad Audit Report.pdf',
    project: 'Creative Refresh Audit (AP-1890)',
    type: 'pdf',
    size: '3.1 MB',
    version: 'v1',
    status: 'Approved',
    releasedAt: 'Oct 22, 2026',
  },
];

export default function FilesPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filtered = ASSETS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.project.toLowerCase().includes(search.toLowerCase());
    if (filterType === 'ALL') return matchesSearch;
    return matchesSearch && item.type.toUpperCase() === filterType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
          Files &amp; Delivered Assets
        </h2>
        <p className="mt-1 text-sm text-[#5A5852]">
          Search, preview, and download all released creatives, source files, and exports across your projects.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files by name or project…"
            className="w-full rounded-xl border border-black/[0.06] bg-white/70 py-2.5 pl-10 pr-4 text-xs text-[#141413] placeholder-neutral-400 backdrop-blur-md shadow-xs outline-none focus:border-[#4F46E5] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'IMAGE', 'VIDEO', 'PDF'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                filterType === t
                  ? 'bg-white text-[#141413] ring-1 ring-black/10 shadow-sm'
                  : 'bg-white/60 text-neutral-600 hover:bg-white hover:text-neutral-900 backdrop-blur-md'
              }`}
            >
              {t === 'ALL' ? 'All files' : t.charAt(0) + t.slice(1).toLowerCase() + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Files List / Table */}
      <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
        <div className="divide-y divide-black/[0.05]">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-white/80 transition"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs">
                  {file.type === 'image' && <ImageIcon size={20} />}
                  {file.type === 'video' && <Video size={20} />}
                  {file.type === 'pdf' && <FileText size={20} />}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-bold text-[#141413]">{file.name}</h4>
                    <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-600">
                      {file.version}
                    </span>
                  </div>
                  <p className="truncate text-xs text-[#5A5852] mt-0.5">{file.project}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-14 sm:pl-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                    file.status === 'Approved'
                      ? 'border border-emerald-500/20 bg-emerald-50/90 text-emerald-700'
                      : 'border border-[#D9480F]/20 bg-[#D9480F]/10 text-[#D9480F]'
                  }`}
                >
                  {file.status === 'Approved' && <CheckCircle2 size={13} />}
                  {file.status}
                </span>

                <span className="text-xs text-neutral-400 tabular-nums">{file.size}</span>

                <button
                  type="button"
                  onClick={() => alert(`Downloading ${file.name}`)}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 text-xs font-bold text-[#141413] hover:border-[#4F46E5]/40 hover:bg-neutral-50 shadow-xs transition"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
