'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { comparisonRows } from '@/lib/services-data';

export default function ComparisonTable() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1450px] px-6 md:px-12">
        {/* Intro Row: Graphic on Left + Heading on Right */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14 mb-16">
          {/* Left Graphic (~240px) */}
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:col-span-3 lg:justify-start"
          >
            <div className="relative w-44 sm:w-56 aspect-[405/506]">
              <Image
                src="/services/design-solution-graphic-2-min.png"
                alt="Design comparison graphics"
                fill
                sizes="(max-width: 1024px) 200px, 240px"
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Right Heading + Intro */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-9"
          >
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#141413] sm:text-5xl lg:text-[4rem]">
              AdsPolisher is the best{' '}
              <em className="font-serif italic text-[#4F46E5] font-normal not-italic font-accent inline-block">
                advertisement solution
              </em>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#4A4945] sm:text-xl">
              Compare AdsPolisher with traditional hiring and DIY tools. Get agency-level
              craft with in-house speed and clear, fixed pricing.
            </p>
          </motion.div>
        </div>

        {/* Semantic Comparison Table with Horizontal Scroll Container on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full overflow-hidden rounded-3xl border border-[#141413]/10 bg-white shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <caption className="sr-only">
                Comparison of AdsPolisher vs Freelancers, In-house teams, and AI/DIY tools
              </caption>

              <thead>
                <tr className="border-b border-[#141413]/10 bg-[#FAFAFA]">
                  {/* Features Column Header */}
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-[#FAFAFA] p-6 lg:p-8 text-base font-bold uppercase tracking-wider text-[#6B7280] w-[34%]"
                  >
                    Features
                  </th>

                  {/* Competitor: Freelancers */}
                  <th
                    scope="col"
                    className="p-6 lg:p-8 text-center text-lg font-bold text-[#141413] w-[16%]"
                  >
                    Freelancers
                  </th>

                  {/* Competitor: In-house */}
                  <th
                    scope="col"
                    className="p-6 lg:p-8 text-center text-lg font-bold text-[#141413] w-[16%]"
                  >
                    In-house
                  </th>

                  {/* Competitor: AI / DIY */}
                  <th
                    scope="col"
                    className="p-6 lg:p-8 text-center text-lg font-bold text-[#141413] w-[16%]"
                  >
                    AI / DIY
                  </th>

                  {/* Highlighted: AdsPolisher */}
                  <th
                    scope="col"
                    className="relative p-6 lg:p-8 text-center bg-[#4F46E5]/[0.05] border-x border-[#4F46E5]/20 w-[18%]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative h-9 w-32">
                        <Image
                          src="/logo/adspolisher.png"
                          alt="AdsPolisher"
                          fill
                          sizes="130px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={`border-b border-[#141413]/10 transition-colors hover:bg-neutral-50/70 ${
                      idx === comparisonRows.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {/* Feature Label */}
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white p-6 lg:py-6 lg:px-8 text-base lg:text-lg font-medium text-[#141413]"
                    >
                      {row.label}
                    </th>

                    {/* Freelancers */}
                    <td className="p-6 text-center">
                      {row.isPrice ? (
                        <span className="text-base font-medium text-[#6B7280]">
                          {row.freelancers}
                        </span>
                      ) : row.freelancers ? (
                        <CheckIcon />
                      ) : (
                        <CrossIcon />
                      )}
                    </td>

                    {/* In-house */}
                    <td className="p-6 text-center">
                      {row.isPrice ? (
                        <span className="text-base font-medium text-[#6B7280]">
                          {row.inhouse}
                        </span>
                      ) : row.inhouse ? (
                        <CheckIcon />
                      ) : (
                        <CrossIcon />
                      )}
                    </td>

                    {/* AI / DIY */}
                    <td className="p-6 text-center">
                      {row.isPrice ? (
                        <span className="text-base font-medium text-[#6B7280]">
                          {row.ai}
                        </span>
                      ) : row.ai ? (
                        <CheckIcon />
                      ) : (
                        <CrossIcon />
                      )}
                    </td>

                    {/* AdsPolisher (Highlighted Column) */}
                    <td className="p-6 text-center bg-[#4F46E5]/[0.05] border-x border-[#4F46E5]/20">
                      {row.isPrice ? (
                        <span className="inline-block rounded-full bg-[#22A559]/10 px-4 py-1 text-base font-bold text-[#22A559]">
                          {row.us}
                        </span>
                      ) : row.us ? (
                        <CheckIcon highlighted />
                      ) : (
                        <CrossIcon />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CheckIcon({ highlighted = false }: { highlighted?: boolean }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
        highlighted ? 'bg-[#22A559]/15 text-[#22A559]' : 'bg-[#22A559]/10 text-[#22A559]'
      }`}
    >
      <Check className="h-5 w-5 stroke-[2.5]" />
      <span className="sr-only">Yes</span>
    </span>
  );
}

function CrossIcon() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-[#6B7280]">
      <X className="h-4 w-4 stroke-[2.5]" />
      <span className="sr-only">No</span>
    </span>
  );
}
