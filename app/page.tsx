"use client";

import { useEffect, useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { AboutSection } from "./components/sections/AboutSection";
import { ContactSection } from "./components/sections/ContactSection";
import { EngineStorySection } from "./components/sections/EngineStorySection";
import { HeroSection } from "./components/sections/HeroSection";
import { IndustriesSection } from "./components/sections/IndustriesSection";
import { ManufacturingSection } from "./components/sections/ManufacturingSection";
import { ProductShowcaseSection } from "./components/sections/ProductShowcaseSection";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { PRODUCT_CATEGORIES } from "./data/apexData";
import LubricantScrollCarousel from "./components/sections/LubricantScrollCarousel";

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    PRODUCT_CATEGORIES[0].id,
  );
  const [quoteProductTitle, setQuoteProductTitle] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleRequestQuote = (productTitle: string) => {
    setQuoteProductTitle(productTitle);
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-charcoal)] text-[var(--color-light-grey)]">
      <LoadingScreen
        onComplete={() => setIntroDone(true)}
        reducedMotion={reducedMotion}
      />

      <Navbar />

      <main>
        <HeroSection introDone={introDone} reducedMotion={reducedMotion} />

        <EngineStorySection reducedMotion={reducedMotion} />

        <LubricantScrollCarousel />
        <ProductShowcaseSection
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          onRequestQuote={handleRequestQuote}
        />

        <IndustriesSection onSelectProduct={setSelectedProductId} />

        <ManufacturingSection reducedMotion={reducedMotion} />

        <AboutSection />

        <ContactSection
          preselectedProductTitle={quoteProductTitle}
          reducedMotion={reducedMotion}
        />
      </main>

      <Footer onSelectProduct={setSelectedProductId} />
    </div>
  );
}
