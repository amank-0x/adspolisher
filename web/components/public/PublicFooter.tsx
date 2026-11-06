import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#eceae4] pt-16 pb-12 text-neutral-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo/adspolisher.png"
                alt="AdsPolisher"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
              High-converting ad creative and campaign production for ambitious brands. AI-assisted speed with experienced human creative direction.
            </p>
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">Connect with us</p>
              <div className="mt-3 flex items-center gap-2.5">
                <a
                  href="https://wa.me/9142173870"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with AdsPolisher on WhatsApp"
                  title="WhatsApp"
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#128C7E]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px] fill-current">
                    <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.54 0 .22 5.32.22 11.86c0 2.09.55 4.13 1.59 5.93L.12 24l6.35-1.66a11.86 11.86 0 0 0 5.61 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.43-8.42Zm-8.44 18.26h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.86 9.86 0 0 1-1.51-5.23C2.18 6.42 6.61 2 12.08 2a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.47-4.45 9.84-9.9 9.84Zm5.41-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/adspolisher"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AdsPolisher on LinkedIn"
                  title="LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px] fill-current">
                    <path d="M5.18 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.45 8.5h3.46V20H3.45V8.5Zm5.63 0h3.32v1.57h.05c.46-.87 1.59-1.79 3.27-1.79 3.5 0 4.15 2.3 4.15 5.29V20h-3.46v-5.69c0-1.36-.03-3.1-1.89-3.1-1.9 0-2.19 1.48-2.19 3v5.8H9.08V8.5Z" />
                  </svg>
                </a>
                <a
                  href="mailto:support@adspolisher.com"
                  aria-label="Email AdsPolisher"
                  title="Email"
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[#4F46E5]/40 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5]"
                >
                  <Mail size={17} strokeWidth={2.2} />
                </a>
                <a
                  href="https://x.com/adspolisher"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AdsPolisher on X"
                  title="X"
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-neutral-700 transition hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/10 hover:text-black"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/adspolisher"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AdsPolisher on Instagram"
                  title="Instagram"
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[#E1306C]/40 hover:bg-[#E1306C]/10 hover:text-[#E1306C]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px] fill-none stroke-current" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@adspolisher"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AdsPolisher on YouTube"
                  title="YouTube"
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10 hover:text-[#FF0000]"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px] fill-current">
                    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.55 15.6V8.4L15.75 12l-6.2 3.6Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Solutions Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm font-medium text-neutral-700">
              <li><Link href="/services#paid-social" className="hover:text-black">Paid Social Creatives</Link></li>
              <li><Link href="/services#display-suites" className="hover:text-black">Display &amp; Retargeting</Link></li>
              <li><Link href="/services#ugc-hooks" className="hover:text-black">UGC &amp; Video Hooks</Link></li>
              <li><Link href="/services#audit-refresh" className="hover:text-black">Creative Refresh &amp; Audit</Link></li>
              <li><Link href="/services" className="text-blue-600 hover:text-blue-700">View Full Catalog →</Link></li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Company &amp; Work</h4>
            <ul className="mt-4 space-y-2.5 text-sm font-medium text-neutral-700">
              <li><Link href="/work" className="hover:text-black">Selected Work</Link></li>
              <li><Link href="/#why-us" className="hover:text-black">Why AdsPolisher</Link></li>
              <li><Link href="/start-project" className="hover:text-black">Start a Project</Link></li>
              <li><Link href="/become-a-creator" className="hover:text-black">Join as a Creator</Link></li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Portals</h4>
            <ul className="mt-4 space-y-2.5 text-sm font-medium text-neutral-700">
              <li><Link href="/auth?mode=signin" className="hover:text-black">Customer Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-black">Client Dashboard</Link></li>
              <li><Link href="/creator/login" className="hover:text-black">Creator Sign In</Link></li>
              <li><Link href="/admin/login" className="hover:text-black">Admin Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row text-xs text-neutral-500">
          <p>&copy; 2026 AdsPolisher. All rights reserved. Service-led ad production agency.</p>
          <div className="flex items-center gap-6">
            <Link href="/#faq" className="hover:text-neutral-800">FAQs</Link>
            <span>&bull;</span>
            <Link href="/start-project" className="hover:text-neutral-800">Request Quote</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
