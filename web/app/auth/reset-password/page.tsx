'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { resetPasswordWithMagicLink, resetPasswordWithOtp } from '@/lib/auth-api'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }
    setLoading(true)
    try {
      if (token) await resetPasswordWithMagicLink(token, password)
      else await resetPasswordWithOtp(email.trim(), otp, password)
      router.replace('/auth?mode=signin&passwordReset=1')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Secure password reset</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use at least 8 characters. Admins and creators should enter the six-digit code from their email.</p>
        {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert"><strong className="block">Password reset error</strong>{error}</div>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          {!token && <>
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label htmlFor="reset-otp" className="mb-2 block text-sm font-medium text-slate-700">Six-digit email code</label>
              <input id="reset-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full rounded-xl border border-slate-300 px-4 py-3 tracking-[0.35em] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
          </>}
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">New password</label>
            <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">Confirm new password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </div>
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Reset password
          </button>
        </form>
        <Link href="/auth?mode=signin" className="mt-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-800">Back to sign in</Link>
      </section>
    </main>
  )
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="min-h-screen bg-slate-950" />}><ResetPasswordForm /></Suspense>
}
