import Link from 'next/link'
import Image from 'next/image'

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
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Intake open for Q4 projects
              </span>
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
              <li><Link href="/creator" className="hover:text-black">Creator Workspace</Link></li>
              <li><Link href="/admin" className="hover:text-black">Admin Console</Link></li>
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
