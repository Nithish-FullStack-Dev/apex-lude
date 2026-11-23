"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { INDUSTRY_SECTORS, PRODUCT_CATEGORIES } from "../../data/apexData";

interface IndustriesSectionProps {
  onSelectProduct: (productId: string) => void;
}

export function IndustriesSection({ onSelectProduct }: IndustriesSectionProps) {
  const [activeId, setActiveId] = useState(INDUSTRY_SECTORS[0].id);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const activeSector =
    INDUSTRY_SECTORS.find((s) => s.id === activeId) ?? INDUSTRY_SECTORS[0];

  const handleJumpToProduct = (productTitle: string) => {
    const match = PRODUCT_CATEGORIES.find((p) => p.title === productTitle);
    if (match) {
      onSelectProduct(match.id);
      const el = document.getElementById("products");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="industries"
      className="border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="max-w-3xl">
          <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[var(--color-industrial-orange)] uppercase">
            Cross-Sector Performance
          </p>
          <h2
            className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white uppercase sm:text-5xl lg:text-6xl"
            style={{ textWrap: "balance" }}
          >
            Powering Industries.
            <br />
            Protecting{" "}
            <span className="text-[var(--color-industrial-orange)]">
              Performance.
            </span>
          </h2>
        </div>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-12">
          {/* Interactive Editorial Sector List */}
          <div className="flex min-w-0 flex-col divide-y divide-white/10 border-y border-white/10 lg:col-span-5">
            {INDUSTRY_SECTORS.map((sector, idx) => {
              const isSelected = sector.id === activeSector.id;
              return (
                <button
                  key={sector.id}
                  type="button"
                  onMouseEnter={() => setActiveId(sector.id)}
                  onClick={() => setActiveId(sector.id)}
                  aria-pressed={isSelected}
                  className={`group flex items-center justify-between gap-4 px-4 py-5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)] ${
                    isSelected
                      ? "bg-[var(--color-charcoal)] text-[var(--color-light-grey)]"
                      : "bg-transparent text-[var(--color-light-grey)]/70 hover:bg-[var(--color-charcoal)] hover:text-[var(--color-light-grey)]"
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-2xl font-bold tracking-wide uppercase sm:text-3xl">
                        {sector.name}
                      </span>
                    </div>
                    <p className="mt-1 pl-7 text-xs text-slate-400">
                      {sector.subtitle}
                    </p>
                  </div>

                  <ArrowUpRight
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                      isSelected
                        ? "translate-x-0.5 -translate-y-0.5 text-[var(--color-industrial-orange)]"
                        : "text-slate-600 group-hover:text-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Dynamic Industry Visual & Technical Scope */}
          <div className="flex flex-col justify-between border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] lg:col-span-7">
            <div className="relative h-64 overflow-hidden bg-[var(--color-charcoal)] sm:h-80 lg:h-96">
              {imgErrorMap[activeSector.id] ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-charcoal)] to-[var(--color-charcoal)] p-8">
                  <span className="font-display text-4xl font-bold text-white uppercase">
                    {activeSector.name}
                  </span>
                </div>
              ) : (
                <img
                  key={activeSector.id}
                  src={activeSector.imageUrl}
                  alt={activeSector.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgErrorMap((prev) => ({
                      ...prev,
                      [activeSector.id]: true,
                    }))
                  }
                  className="h-full w-full object-cover transition-transform duration-700"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)] via-[var(--color-charcoal)]/30 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                    {activeSector.subtitle}
                  </span>
                  <h3 className="font-display text-3xl font-extrabold text-white uppercase">
                    {activeSector.name} Sector
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                {activeSector.description}
              </p>

              <p className="mt-4 border-t border-white/10 pt-4 font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                {activeSector.operatingFocus}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="mr-2 text-xs font-medium text-slate-400">
                  Applicable Lines:
                </span>
                {activeSector.recommendedLines.map((line) => (
                  <button
                    key={line}
                    type="button"
                    onClick={() => handleJumpToProduct(line)}
                    className="border border-white/15 bg-[var(--color-charcoal)] px-3 py-1.5 text-xs font-medium text-[var(--color-light-grey)] transition-colors hover:border-[var(--color-industrial-orange)]/60 hover:text-[var(--color-light-grey)]"
                  >
                    {line}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
