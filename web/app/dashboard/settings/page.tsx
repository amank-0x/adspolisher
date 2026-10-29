'use client';

import React, { useState } from 'react';
import { Settings2, Bell, Shield, KeyRound, Check } from 'lucide-react';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
          Account Settings
        </h2>
        <p className="mt-1 text-sm text-[#5A5852]">
          Manage your notification preferences, login credentials, and session security.
        </p>
      </div>

      <div className="space-y-6 rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(20,20,19,0.04)] divide-y divide-black/[0.06]">
        {/* Notifications */}
        <div className="space-y-4 pb-6">
          <h3 className="text-base font-bold text-[#141413] flex items-center gap-2">
            <Bell size={18} className="text-[#4F46E5]" /> Notification Preferences
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#141413]">Deliverable Review Alerts</p>
              <p className="text-xs text-neutral-500">Email me immediately when new drafts are released for review.</p>
            </div>
            <input
              type="checkbox"
              checked={reviewAlerts}
              onChange={(e) => setReviewAlerts(e.target.checked)}
              className="h-4 w-4 rounded accent-[#4F46E5] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#141413]">Team Messages &amp; Question Alerts</p>
              <p className="text-xs text-neutral-500">Email me when a creative pod member asks a question about my brief.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 rounded accent-[#4F46E5] cursor-pointer"
            />
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4 pt-6">
          <h3 className="text-base font-bold text-[#141413] flex items-center gap-2">
            <Shield size={18} className="text-[#4F46E5]" /> Security &amp; Authentication
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#141413]">Two-Factor Authentication (MFA)</p>
              <p className="text-xs text-neutral-500">Protect your creative workspace and proposal approvals.</p>
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 shadow-xs">
              Active
            </span>
          </div>

          <div className="pt-2">
            <a
              href="/auth/forgot-password"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 text-xs font-bold text-[#141413] hover:border-[#4F46E5]/40 hover:bg-neutral-50 shadow-xs transition"
            >
              <KeyRound size={14} /> Change password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
