'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  FolderKanban,
  FileText,
  FileClock,
  MessageSquare,
  Files,
  Plus,
  Users,
  Settings,
  X,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Pages' | 'Projects' | 'Requests' | 'Actions';
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  detail?: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  // Actions
  {
    id: 'act-new',
    title: 'Start a new project request',
    category: 'Actions',
    href: '/dashboard/requests/new',
    icon: Plus,
    detail: 'Submit a new creative brief',
  },
  // Projects
  {
    id: 'proj-2041',
    title: 'Q4 Meta Performance Ads',
    category: 'Projects',
    href: '/dashboard/projects/proj-2041',
    icon: FolderKanban,
    detail: 'AP-2041 · In production',
  },
  {
    id: 'proj-1988',
    title: 'Display Retargeting Suite',
    category: 'Projects',
    href: '/dashboard/projects/proj-1988',
    icon: FolderKanban,
    detail: 'AP-1988 · Your review (2 drafts ready)',
  },
  // Requests
  {
    id: 'req-104',
    title: 'Proposal Q-104 · Q4 Meta Campaign',
    category: 'Requests',
    href: '/dashboard/requests/req-104',
    icon: FileClock,
    detail: '$2,400 USD · Expires in 5 days',
  },
  {
    id: 'req-spring',
    title: 'Spring Promo Request',
    category: 'Requests',
    href: '/dashboard/requests',
    icon: FileText,
    detail: 'Needs your reply on target platforms',
  },
  // Pages
  {
    id: 'page-overview',
    title: 'Overview Dashboard',
    category: 'Pages',
    href: '/dashboard',
    icon: FolderKanban,
  },
  {
    id: 'page-requests',
    title: 'All Requests',
    category: 'Pages',
    href: '/dashboard/requests',
    icon: FileText,
  },
  {
    id: 'page-proposals',
    title: 'Proposals',
    category: 'Pages',
    href: '/dashboard/proposals',
    icon: FileClock,
  },
  {
    id: 'page-projects',
    title: 'Projects in Progress',
    category: 'Pages',
    href: '/dashboard/projects',
    icon: FolderKanban,
  },
  {
    id: 'page-files',
    title: 'Asset & File Library',
    category: 'Pages',
    href: '/dashboard/files',
    icon: Files,
  },
  {
    id: 'page-messages',
    title: 'Team Messages',
    category: 'Pages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    id: 'page-profile',
    title: 'Company & Brand Profile',
    category: 'Pages',
    href: '/dashboard/profile',
    icon: Users,
  },
  {
    id: 'page-settings',
    title: 'Account Settings',
    category: 'Pages',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMMAND_ITEMS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.detail && item.detail.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        router.push(filtered[selectedIndex].href);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-20"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Window (Frosted Glass) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/80 bg-white/95 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.2)]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5 sm:px-5 bg-white/60">
            <Search size={18} className="text-[#4F46E5] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search projects, files, requests, or actions…"
              className="w-full bg-transparent text-sm text-[#141413] placeholder-neutral-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="rounded-md p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X size={15} />
              </button>
            )}
            <kbd className="hidden sm:inline-block rounded border border-black/10 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-neutral-500">
                No matching results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push(item.href);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? 'bg-[#4F46E5]/10 text-[#141413]'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                            isSelected ? 'bg-[#4F46E5] text-white' : 'bg-black/5 text-neutral-600'
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[13px]">{item.title}</p>
                          {item.detail && (
                            <p className="truncate text-[11px] text-neutral-500">{item.detail}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight size={14} className="text-[#4F46E5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="flex items-center justify-between border-t border-black/5 bg-[#FAFAF8] px-4 py-2.5 text-[11px] text-neutral-500">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="font-mono">↑↓</kbd> Navigate
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> Select
              </span>
              <span>
                <kbd className="font-mono">ESC</kbd> Close
              </span>
            </div>
            <span className="text-[10px] uppercase font-semibold text-[#4F46E5]">AdsPolisher</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
