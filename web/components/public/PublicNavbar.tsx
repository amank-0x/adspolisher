'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-[#eceae4]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="AdsPolisher home">
          <Image
            src="/logo/adspolisher.png"
            alt="AdsPolisher"
            width={150}
            height={46}
            className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex text-sm font-semibold text-neutral-700">
          <Link href="/services" className="transition-colors hover:text-black">
            Services
          </Link>
          <Link href="/work" className="transition-colors hover:text-black">
            Our Work
          </Link>
          <Link href="/#why-us" className="transition-colors hover:text-black">
            Why Us
          </Link>
          <Link href="/become-a-creator" className="text-neutral-500 transition-colors hover:text-black">
            Become a Creator
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/creator/login"
            className="whitespace-nowrap rounded-full border border-black/10 bg-white/60 px-3.5 py-2 text-[11px] font-semibold text-neutral-700 transition-all hover:border-black/20 hover:bg-white hover:text-black"
          >
            Are you a creator?
          </Link>
          <Link
            href="/auth?mode=signin"
            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-neutral-800 transition-all hover:bg-white hover:shadow-xs"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-md"
          >
            Dashboard
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-neutral-800 hover:bg-black/5 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/30 p-4 backdrop-blur-sm md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
          <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" />
          <div className="relative mx-auto mt-16 max-w-md overflow-hidden rounded-3xl border border-white/80 bg-[#f7f5ef]/95 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Menu</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-full p-2 text-neutral-600 hover:bg-black/5" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 text-base font-semibold text-neutral-800">
            <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/work" onClick={() => setMobileMenuOpen(false)}>
              Our Work
            </Link>
            <Link href="/#why-us" onClick={() => setMobileMenuOpen(false)}>
              Why Us
            </Link>
            <Link href="/become-a-creator" onClick={() => setMobileMenuOpen(false)}>
              Become a Creator
            </Link>
            <hr className="my-2 border-black/10" />
            <Link
              href="/creator/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-white hover:text-black"
            >
              Are you a creator?
            </Link>
            <Link
              href="/auth?mode=signin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-center text-sm font-bold text-white"
            >
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
