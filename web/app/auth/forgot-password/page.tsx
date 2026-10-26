'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { requestPasswordReset } from '@/lib/auth-api'

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to request a password reset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Account recovery</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Forgot your password?</h1>
        {sent ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900" role="status">
            If an account matches that email, recovery instructions have been sent. Customers can reset from the emailed link. Admins and creators can enter their one-time code on the reset screen.
            <Link href={`/auth/reset-password?email=${encodeURIComponent(email.trim())}`} className="mt-3 inline-block font-semibold underline">Continue to password reset</Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm leading-6 text-slate-600">Enter your account email and we’ll send the right recovery instructions.</p>
            {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert"><strong className="block">Recovery request error</strong>{error}</div>}
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="recovery-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
              </div>
              <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send recovery instructions
              </button>
            </form>
          </>
        )}
        <Link href="/auth?mode=signin" className="mt-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-800">Back to sign in</Link>
      </section>
    </main>
  )
}

export default function ForgotPasswordPage() {
  return <Suspense fallback={<main className="min-h-screen bg-slate-950" />}><ForgotPasswordForm /></Suspense>
}
