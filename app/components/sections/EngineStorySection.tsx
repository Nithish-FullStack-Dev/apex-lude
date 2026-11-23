"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ENGINE_BENEFITS } from "../../data/apexData";
import { getEngineStageFromProgress } from "../../utils/apexLogic";
import { EngineScene } from "../three/EngineScene";

gsap.registerPlugin(ScrollTrigger);

interface EngineStorySectionProps {
  reducedMotion: boolean;
}

export function EngineStorySection({ reducedMotion }: EngineStorySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualStage, setManualStage] = useState<0 | 1 | 2 | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 35%",
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion]);

  const stageInfo = getEngineStageFromProgress(scrollProgress);
  const activeStage: 0 | 1 | 2 =
    manualStage !== null ? manualStage : stageInfo.stageIndex;
  const activeBenefit = ENGINE_BENEFITS[activeStage];

  const handleStageSelect = (idx: 0 | 1 | 2) => {
    setManualStage(idx);
    setScrollProgress(idx === 0 ? 0.15 : idx === 1 ? 0.5 : 0.85);
  };

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="relative border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Narrative & Interactive Benefit Switcher */}
          <div className="min-w-0 lg:col-span-5">
            <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[var(--color-industrial-orange)] uppercase">
              Hydrodynamic Engineering · Cutaway Simulation
            </p>
            <h2
              className="mt-4 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white uppercase sm:text-5xl lg:text-6xl"
              style={{ textWrap: "balance" }}
            >
              Every Moving Part. Every Moment.{" "}
              <span className="text-[var(--color-industrial-orange)]">
                Protected.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Watch how precision-blended base stocks and additive packages
              circulate across crankshaft journals, reciprocating pistons, and
              timing gears under continuous load.
            </p>

            {/* 3 Benefit Stage Controls */}
            <div
              className="mt-8 space-y-3"
              role="tablist"
              aria-label="Lubrication performance stages"
            >
              {ENGINE_BENEFITS.map((benefit, idx) => {
                const isSelected = activeStage === idx;
                return (
                  <button
                    key={benefit.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleStageSelect(idx as 0 | 1 | 2)}
                    className={`w-full border p-5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)] ${
                      isSelected
                        ? "border-[var(--color-industrial-orange)]/60 bg-[var(--color-charcoal)]"
                        : "border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] hover:border-[var(--color-light-grey)]/25"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-2xl font-bold tracking-wide text-white">
                        {benefit.step}. {benefit.title}
                      </span>
                      <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                        {isSelected ? "ACTIVE" : "INSPECT"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-slate-200">
                      {benefit.summary}
                    </p>
                    {isSelected && (
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                        {benefit.detail}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 3D Cutaway Engine Canvas */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] px-5 py-3.5">
                <span className="font-mono-tech text-xs text-slate-300">
                  {activeBenefit.step} · {activeBenefit.targetRpmLabel}
                </span>
                <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                  {activeBenefit.thermalZoneLabel}
                </span>
              </div>

              <div className="h-[360px] w-full sm:h-[460px] lg:h-[520px]">
                <EngineScene
                  scrollProgress={scrollProgress}
                  stageIndex={activeStage}
                  reducedMotion={reducedMotion}
                />
              </div>

              <div className="flex items-center justify-between border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] px-5 py-3 font-mono-tech text-[11px] text-slate-400">
                <span>
                  4-Cylinder Cutaway · Timing Gear &amp; Oil Gallery Circuit
                </span>
                <span>Stage {activeBenefit.step} / 03</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
