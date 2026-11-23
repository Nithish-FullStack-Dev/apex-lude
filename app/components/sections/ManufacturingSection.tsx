"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ManufacturingSectionProps {
  reducedMotion: boolean;
}

const PLANT_HIGHLIGHTS = [
  {
    title: "Automated Blending Precision",
    detail:
      "Computer-controlled batching and stainless-steel blending vessels maintain repeatable additive-to-base-oil ratios while minimizing human error.",
  },
  {
    title: "In-House Laboratory Verification",
    detail:
      "Every blended batch undergoes viscosity, flash point, TBN, and thermal oxidation screening aligned with ASTM and SAE specifications.",
  },
  {
    title: "Scheduled UAE & Export Dispatch",
    detail:
      "Strategic Ajman manufacturing adjacent to Hamriyah Free Zone supports dependable container, drum, and bulk dispatch schedules.",
  },
];

export function ManufacturingSection({
  reducedMotion,
}: ManufacturingSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const progress = Math.max(
        -1,
        Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / vh),
      );
      setParallaxOffset(progress * 26);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Visual Blending Facility Frame with Parallax */}
          <div className="relative min-h-[340px] overflow-hidden border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] lg:col-span-7">
            {imgFailed ? (
              <div className="flex h-full min-h-[340px] items-center justify-center bg-gradient-to-br from-[var(--color-charcoal)] to-[var(--color-charcoal)] p-8">
                <p className="font-display text-3xl font-bold text-white uppercase">
                  Automated UAE Blending Facility
                </p>
              </div>
            ) : (
              <img
                src="/assets/images/manufacturing_blending_plant_1795415831959.jpg"
                alt="Apex Lubricants automated stainless steel blending plant in the United Arab Emirates"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                style={{
                  transform: `translate3d(0, ${parallaxOffset}px, 0) scale(1.06)`,
                }}
                className="h-full w-full object-cover transition-transform duration-75 will-change-transform lg:h-full"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Clean unboxed technical overlay caption */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-3 font-mono-tech text-xs text-slate-200">
              <span>
                Ajman Blending Facility · Opposite Hamriyah Free Zone 2
              </span>
              <span className="text-[var(--color-industrial-orange)]">
                Automated Batch Control
              </span>
            </div>
          </div>

          {/* Right Editorial Text */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[var(--color-industrial-orange)] uppercase">
              Manufacturing &amp; Process Control
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white uppercase sm:text-5xl lg:text-6xl"
              style={{ textWrap: "balance" }}
            >
              Precision in Every{" "}
              <span className="text-[var(--color-industrial-orange)]">
                Drop.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              APEX operates an ultra-modern automated blending system equipped
              with specialized machinery to formulate automotive, 2T/4T,
              hydraulic, grease, and industrial turbine lubricants without
              compromise.
            </p>

            <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
              {PLANT_HIGHLIGHTS.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-industrial-orange)]" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
