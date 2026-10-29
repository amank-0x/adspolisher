"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role = String(session?.user?.appRole ?? "USER").toUpperCase();
  const home = role === "ADMIN" ? "/admin" : role === "CREATOR" ? "/creator" : "/dashboard";

  useEffect(() => {
    if (!isPending && !session) router.replace("/auth?mode=signin");
  }, [isPending, router, session]);

  if (isPending || !session) return <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] text-sm text-neutral-500">Loading account…</div>;

  return <main className="min-h-screen bg-[#f7f6f2] px-5 py-10 text-[#141413] sm:px-8">
    <div className="mx-auto max-w-3xl">
      <Link href={home} className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black"><ArrowLeft size={14} />Back to workspace</Link>
      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[.16em] text-[#b34a20]">Account</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Profile &amp; settings</h1>
      <p className="mt-2 text-sm text-neutral-500">Your sign-in details and account security options.</p>

      <section id="profile" className="mt-7 rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-black/[0.06] pb-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100"><UserRound size={18} /></span><div><h2 className="text-sm font-semibold">Profile</h2><p className="mt-1 text-xs text-neutral-500">Account identity</p></div></div>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2"><div><dt className="text-[11px] font-medium text-neutral-500">Name</dt><dd className="mt-1 text-sm font-medium">{session.user.name || "Not provided"}</dd></div><div><dt className="text-[11px] font-medium text-neutral-500">Email</dt><dd className="mt-1 flex items-center gap-2 text-sm font-medium"><Mail size={14} className="text-neutral-400" />{session.user.email}</dd></div><div><dt className="text-[11px] font-medium text-neutral-500">Workspace role</dt><dd className="mt-1 text-sm font-medium">{role === "ADMIN" ? "Admin" : role === "CREATOR" ? "Creator" : "Customer"}</dd></div></dl>
      </section>

      <section id="settings" className="mt-4 rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-7">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100"><ShieldCheck size={18} /></span><div><h2 className="text-sm font-semibold">Security</h2><p className="mt-1 text-xs text-neutral-500">Keep your account access up to date.</p></div></div>
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl bg-[#f8f7f3] p-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold">Password</p><p className="mt-1 text-[11px] text-neutral-500">Use email recovery to change a forgotten password.</p></div><Link href="/auth/forgot-password" className="inline-flex h-9 items-center justify-center rounded-lg border border-black/[0.1] bg-white px-3 text-xs font-semibold hover:bg-neutral-50">Reset password</Link></div>
      </section>

      <p className="mt-5 text-[11px] text-neutral-400">Profile editing and notification preferences will be available when account settings are connected to the API.</p>
    </div>
  </main>;
}
