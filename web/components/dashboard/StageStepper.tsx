'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface StageStepperProps {
  currentStage: 1 | 2 | 3 | 4 | 5; // 1: Brief, 2: Plan, 3: Production, 4: Your review, 5: Delivered
  stageName?: string;
}

const STAGES = [
  { step: 1, label: 'Brief' },
  { step: 2, label: 'Plan' },
  { step: 3, label: 'Production' },
  { step: 4, label: 'Your review' },
  { step: 5, label: 'Delivered' },
];

export function StageStepper({ currentStage }: StageStepperProps) {
  // Calculate percentage between circle 1 center and circle 5 center
  const progressPercent = ((currentStage - 1) / (STAGES.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Mobile view (< 640px) */}
      <div className="sm:hidden flex items-center justify-between text-xs font-semibold text-[#141413] mb-2">
        <span className="text-neutral-500">Progress stage:</span>
        <span
          className={`font-bold ${
            currentStage === 4 ? 'text-[#D9480F]' : 'text-[#4F46E5]'
          }`}
        >
          {currentStage}. {STAGES[currentStage - 1]?.label}
        </span>
      </div>

      {/* Stepper container with exact vertical centering */}
      <div className="relative">
        {/* Track Line - mathematically positioned at 14px (top-3.5), the exact midpoint of the 28px (h-7) circle */}
        {/* left-3.5 and right-3.5 ensure the line begins at the exact center of step 1 and ends at step 5 */}
        <div className="absolute top-3.5 left-3.5 right-3.5 -translate-y-1/2 h-[3px] bg-black/[0.08] rounded-full z-0 pointer-events-none">
          {/* Active Colored Progress Line */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              currentStage === 4
                ? 'bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#D9480F]'
                : 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps: Circles and Labels */}
        <div className="relative z-10 flex items-start justify-between">
          {STAGES.map((s) => {
            const isCompleted = s.step < currentStage;
            const isCurrent = s.step === currentStage;

            return (
              <div key={s.step} className="flex flex-col items-center">
                {/* 28px (h-7 w-7) circle - vertical midpoint is exactly 14px */}
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-[#4F46E5] text-white shadow-[0_0_8px_rgba(79,70,229,0.35)]'
                      : isCurrent
                      ? currentStage === 4
                        ? 'bg-white border-2 border-[#D9480F] text-[#D9480F] ring-4 ring-[#D9480F]/20 shadow-[0_0_12px_rgba(217,72,15,0.4)]'
                        : 'bg-white border-2 border-[#4F46E5] text-[#4F46E5] ring-4 ring-[#4F46E5]/20 shadow-[0_0_12px_rgba(79,70,229,0.4)]'
                      : 'bg-white border border-neutral-300 text-neutral-400'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : s.step}
                </div>

                {/* Step label underneath circle */}
                <span
                  className={`hidden sm:block mt-2 text-xs whitespace-nowrap transition-colors ${
                    isCurrent
                      ? currentStage === 4
                        ? 'font-bold text-[#D9480F]'
                        : 'font-bold text-[#141413]'
                      : isCompleted
                      ? 'font-semibold text-neutral-700'
                      : 'font-medium text-neutral-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StageStepper;
