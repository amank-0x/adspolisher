'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { requestPasswordReset } from '@/lib/auth-api'

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [errorTitle, setErrorTitle] = useState('Recovery request error')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setErrorTitle('Recovery request error')
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to request a password reset.'
      if (message.toLowerCase().includes("couldn't send the recovery email")) {
        setErrorTitle('Email delivery failed')
        setError('We couldn’t send your recovery email. Please try again in a few minutes.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <section className="relative hidden flex-1 overflow-hidden md:flex">
        <Link
          href="/auth?mode=signin"
          className="absolute left-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/30"
          aria-label="Back to sign in"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <img
          src="https://cdn.21st.dev/assets/mirror/0d/0d205a1a31d40e927885b0ec5f603407caa10585b5bc6e8b08240402c7417e86.png"
          alt="AdSpolisher creative showcase"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      <section className="relative flex min-h-screen flex-1 items-center justify-center bg-white p-6">
        <Link
          href="/auth?mode=signin"
          className="absolute left-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 md:hidden"
          aria-label="Back to sign in"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="w-full max-w-md p-2 sm:p-6">
          <div className="mb-8">
            <Link href="/" className="mb-6 inline-flex items-center gap-2.5 group">
              <Image src="/logo/adspolisher.png" alt="AdSpolisher Logo" width={38} height={38} className="h-9 w-9 rounded-lg object-contain" priority />
              <span className="text-xl font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">AdSpolisher</span>
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Forgot your password?</h1>
            <p className="text-gray-600">Enter your account email and we’ll send recovery instructions.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700" role="alert" aria-live="assertive">
              <p className="font-semibold">{errorTitle}</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {sent ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3.5 text-sm leading-6 text-green-800" role="status">
              If an account matches that email, recovery instructions have been sent. Check your inbox. Admins and creators can enter their one-time code on the reset screen.
              <Link href={`/auth/reset-password?email=${encodeURIComponent(email.trim())}`} className="mt-3 inline-block font-semibold text-blue-700 hover:text-blue-800">Continue to password reset</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="recovery-email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="recovery-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send recovery instructions
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth?mode=signin" className="font-medium text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default function ForgotPasswordPage() {
  return <Suspense fallback={<main className="min-h-screen bg-slate-950" />}><ForgotPasswordForm /></Suspense>
}
