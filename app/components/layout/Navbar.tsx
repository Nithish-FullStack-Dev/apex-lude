"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, Search, X, ArrowUpRight } from "lucide-react";
import { PRODUCT_CATEGORIES, type ProductCategory } from "../../data/apexData";
import { filterProductsByQuery } from "../../utils/apexLogic";

interface NavbarProps {
  onSelectProduct: (productId: string) => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Products", href: "#products", hasMega: true },
  { label: "Technology", href: "#technology" },
  { label: "Industries", href: "#industries" },
  { label: "About", href: "#about" },
];

export function Navbar({ onSelectProduct }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredProducts = filterProductsByQuery(
    PRODUCT_CATEGORIES,
    searchQuery,
  );

  const handleProductPick = (product: ProductCategory) => {
    onSelectProduct(product.id);
    setMegaOpen(false);
    setSearchOpen(false);
    setMobileOpen(false);
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        onMouseLeave={() => setMegaOpen(false)}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled || megaOpen
            ? "border-b border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)]/95"
            : "border-b border-transparent bg-gradient-to-b from-[var(--color-charcoal)]/90 to-transparent"
        }`}
      >
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-8 lg:h-20">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
          >
            <svg
              viewBox="0 0 28 28"
              className="h-6 w-6 shrink-0"
              aria-hidden="true"
            >
              <polygon
                points="14,2 26,24 20,24 14,12 8,24 2,24"
                fill="#F28C28"
              />
              <polygon points="14,15 18,24 10,24" fill="#F28C28" />
            </svg>
            <span className="font-display text-2xl font-extrabold tracking-[0.14em] text-white">
              APEX
              <span className="text-[var(--color-industrial-orange)]">
                LUBES
              </span>
            </span>
          </a>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {NAV_LINKS.map((link) =>
              link.hasMega ? (
                <div
                  key={link.label}
                  onMouseEnter={() => setMegaOpen(true)}
                  className="relative"
                >
                  <button
                    type="button"
                    aria-expanded={megaOpen}
                    onClick={() => setMegaOpen((v) => !v)}
                    className="group inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-2 text-sm font-medium text-[var(--color-light-grey)] transition-colors hover:text-[var(--color-industrial-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                        megaOpen
                          ? "rotate-180 text-[var(--color-industrial-orange)]"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative whitespace-nowrap shrink-0 py-2 text-sm font-medium text-[var(--color-light-grey)] transition-colors hover:text-[var(--color-industrial-orange)] after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--color-industrial-orange)] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          {/* Zone 3: Search + Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Apex lubricant grades and categories"
              className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] text-[var(--color-light-grey)] transition-colors hover:border-[var(--color-industrial-orange)]/35 hover:text-[var(--color-industrial-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)]"
            >
              <Search className="h-4 w-4" />
            </button>

            <a
              href="#contact"
              className="hidden whitespace-nowrap shrink-0 bg-[var(--color-industrial-orange)] px-5 py-2.5 text-xs font-semibold tracking-wider text-[var(--color-charcoal)] uppercase transition-colors hover:bg-[var(--color-industrial-orange)]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-industrial-orange)] sm:inline-flex"
            >
              Contact Apex
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] text-[var(--color-light-grey)] lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Products Mega Menu */}
        {megaOpen && (
          <div
            role="region"
            aria-label="Product Categories Mega Menu"
            className="hidden border-t border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] lg:block"
          >
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono-tech text-xs tracking-wider text-slate-400 uppercase">
                  Apex Lubricants Portfolio · 8 Verified Ranges
                </span>
                <a
                  href="#products"
                  onClick={() => setMegaOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-industrial-orange)] hover:text-[var(--color-industrial-orange)]/90"
                >
                  <span>View Interactive Showcase</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleProductPick(cat)}
                    className="group flex flex-col items-start border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] p-4 text-left transition-colors hover:border-[var(--color-industrial-orange)]/50 hover:bg-[var(--color-charcoal)]"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-mono-tech text-xs text-[var(--color-industrial-orange)]">
                        {cat.index}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                    </div>
                    <span className="mt-2 font-display text-xl font-bold tracking-wide text-white">
                      {cat.title}
                    </span>
                    <span className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {cat.technicalLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fullscreen Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[var(--color-charcoal)] p-6 lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-display text-2xl font-extrabold tracking-[0.14em] text-white">
              APEX
              <span className="text-[var(--color-industrial-orange)]">
                LUBES
              </span>
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] text-[var(--color-light-grey)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="my-auto flex flex-col gap-3">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-baseline justify-between border-b border-white/10 py-3.5 font-display text-3xl font-bold tracking-wide text-white"
              >
                <span>{link.label}</span>
                <span className="font-mono-tech text-xs text-slate-500">
                  0{idx + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center bg-[var(--color-industrial-orange)] py-3.5 text-sm font-semibold tracking-wider text-[var(--color-charcoal)] uppercase"
            >
              Contact Apex
            </a>
            <p className="text-center font-mono-tech text-xs text-slate-400">
              +971-4-2217273 · info@apexlubes.com
            </p>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Apex products and grades"
          className="fixed inset-0 z-50 flex items-start justify-center bg-[var(--color-charcoal)]/80 px-4 pt-20 sm:pt-28"
        >
          <div className="w-full max-w-2xl border border-[var(--color-light-grey)]/15 bg-[var(--color-charcoal)] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex flex-1 items-center gap-3">
                <Search className="h-5 w-5 text-[var(--color-industrial-orange)] shrink-0" />
                <label htmlFor="apex-product-search" className="sr-only">
                  Search lubricant categories or viscosity grades
                </label>
                <input
                  id="apex-product-search"
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by grade or category (e.g. 5W-40, ISO VG 46, Dexron, Grease)..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="inline-flex h-9 w-9 items-center justify-center border border-white/15 text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  No matching Apex lubricant ranges found for "{searchQuery}".
                </p>
              ) : (
                <div className="grid gap-2">
                  {filteredProducts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleProductPick(item)}
                      className="flex items-center justify-between border border-[var(--color-light-grey)]/10 bg-[var(--color-charcoal)] px-4 py-3 text-left transition-colors hover:border-[var(--color-industrial-orange)]/50 hover:bg-[var(--color-charcoal)]"
                    >
                      <div>
                        <div className="font-display text-lg font-bold text-white">
                          {item.index}. {item.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.technicalLabel}
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[var(--color-industrial-orange)] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
