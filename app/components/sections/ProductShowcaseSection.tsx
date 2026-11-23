"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { PRODUCT_CATEGORIES, type ProductCategory } from "../../data/apexData";
import { ContainerArtwork } from "../ui/ContainerArtwork";

interface ProductShowcaseSectionProps {
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
  onRequestQuote: (productTitle: string) => void;
}

export function ProductShowcaseSection({
  selectedProductId,
  onSelectProduct,
  onRequestQuote,
}: ProductShowcaseSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [specModalProduct, setSpecModalProduct] =
    useState<ProductCategory | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; scrollLeft: number }>({
    x: 0,
    scrollLeft: 0,
  });

  const activeIndex = Math.max(
    0,
    PRODUCT_CATEGORIES.findIndex((p) => p.id === selectedProductId),
  );
  const activeProduct =
    PRODUCT_CATEGORIES[activeIndex] ?? PRODUCT_CATEGORIES[0];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[activeIndex] as HTMLElement | undefined;
    if (card) {
      const targetLeft = card.offsetLeft - 16;
      el.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    }
  }, [activeIndex]);

  const stepProduct = (delta: -1 | 1) => {
    const nextIdx =
      (activeIndex + delta + PRODUCT_CATEGORIES.length) %
      PRODUCT_CATEGORIES.length;
    onSelectProduct(PRODUCT_CATEGORIES[nextIdx].id);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragStartRef.current.x) * 1.3;
    trackRef.current.scrollLeft = dragStartRef.current.scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <section
      id="products"
      className="relative overflow-hidden border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] py-20 lg:py-28"
    >
      {/* Dynamic subtle background shift per active product */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 72% 38%, ${activeProduct.ambientGlow} 0%, rgba(8,9,11,0) 62%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header Row */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[var(--color-industrial-orange)] uppercase">
              Product Collection · 8 Specialized Ranges
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white uppercase sm:text-5xl lg:text-6xl"
              style={{ textWrap: "balance" }}
            >
              Built for Every Engine.
              <br />
              Ready for Every{" "}
              <span className="text-[var(--color-industrial-orange)]">
                Challenge.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-end">
            <span className="font-mono-tech text-xs text-slate-400">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(PRODUCT_CATEGORIES.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => stepProduct(-1)}
              aria-label="Previous product category"
              className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] text-[var(--color-light-grey)] transition-colors hover:border-[var(--color-industrial-orange)]/40 hover:bg-[var(--color-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => stepProduct(1)}
              aria-label="Next product category"
              className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] text-[var(--color-light-grey)] transition-colors hover:border-[var(--color-industrial-orange)]/40 hover:bg-[var(--color-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Quick Selector Bar */}
        <div
          className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar"
          role="tablist"
          aria-label="Product category selector"
        >
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = cat.id === activeProduct.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectProduct(cat.id)}
                className={`whitespace-nowrap shrink-0 border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)] ${
                  isSelected
                    ? "border-[var(--color-industrial-orange)] bg-[var(--color-industrial-orange)] text-[var(--color-charcoal)]"
                    : "border-[var(--color-light-grey)]/12 bg-[var(--color-charcoal)] text-[var(--color-light-grey)] hover:border-[var(--color-industrial-orange)]/30 hover:text-[var(--color-light-grey)]"
                }`}
              >
                {cat.index}. {cat.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Horizontal Drag & Snap Showcase Track */}
        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className={`mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 no-scrollbar ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {PRODUCT_CATEGORIES.map((product) => {
            const isActive = product.id === activeProduct.id;
            return (
              <article
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className={`group flex w-[86vw] shrink-0 snap-start flex-col justify-between border p-6 transition-colors duration-300 sm:w-[420px] lg:w-[440px] ${
                  isActive
                    ? "border-[var(--color-light-grey)]/30 bg-[var(--color-charcoal)]"
                    : "border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] hover:border-[var(--color-light-grey)]/25"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                      {product.index}
                    </span>
                    <span className="font-mono-tech text-[11px] text-slate-400 truncate max-w-[78%]">
                      {product.viscosityGrades.slice(0, 3).join(" · ")}
                    </span>
                  </div>

                  <div className="my-4">
                    <ContainerArtwork product={product} active={isActive} />
                  </div>

                  <p className="font-mono-tech text-[11px] tracking-wider text-slate-400 uppercase">
                    {product.technicalLabel}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold tracking-wide text-white uppercase">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpecModalProduct(product);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--color-light-grey)] uppercase transition-colors hover:text-[var(--color-industrial-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
                  >
                    <span>Explore Specifications</span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-industrial-orange)]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestQuote(product.title);
                    }}
                    className="text-xs font-medium text-slate-400 underline-offset-4 hover:text-white hover:underline"
                  >
                    Inquire
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Progress Indicator Bar */}
        <div className="mt-2 h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-[var(--color-industrial-orange)] transition-all duration-300"
            style={{
              width: `${((activeIndex + 1) / PRODUCT_CATEGORIES.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Product Specification Modal */}
      {specModalProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${specModalProduct.title} Technical Overview`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                  {specModalProduct.index} · {specModalProduct.technicalLabel}
                </p>
                <h3 className="mt-1 font-display text-3xl font-extrabold text-white uppercase">
                  {specModalProduct.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSpecModalProduct(null)}
                aria-label="Close product specification dialog"
                className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              {specModalProduct.description}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] p-4">
                <h4 className="font-mono-tech text-xs font-semibold text-white uppercase">
                  Standards &amp; Grades
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  {specModalProduct.specifications.map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-industrial-orange)]" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] p-4">
                <h4 className="font-mono-tech text-xs font-semibold text-white uppercase">
                  Primary Applications
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  {specModalProduct.applications.map((app) => (
                    <li key={app} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-industrial-orange)]" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono-tech text-xs text-slate-400">
                Available Viscosities:{" "}
                {specModalProduct.viscosityGrades.join(" / ")}
              </span>
              <button
                type="button"
                onClick={() => {
                  const title = specModalProduct.title;
                  setSpecModalProduct(null);
                  onRequestQuote(title);
                }}
                className="bg-[var(--color-industrial-orange)] px-5 py-2.5 text-xs font-semibold tracking-wider text-[var(--color-charcoal)] uppercase hover:bg-[var(--color-industrial-orange)]/90"
              >
                Request Data Sheet &amp; Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
